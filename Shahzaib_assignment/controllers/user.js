import bcrypt from 'bcrypt';
import db from '../models/index.js';

const User = db.User;

const user = {
    loginUser: async (req, res) => {
        try {
        const { email, password } = req.body;

        if (!email || !password) {
        return res.status(400).json({
        message: "Email and password are required"
                });
            }

        const foundUser = await User.findOne({ where: { email } });

        if (!foundUser) {
        return res.status(404).json({
        message: "User not found"
         });
        }

        const isMatch = await bcrypt.compare(password, foundUser.password);

        if (!isMatch) {
        return res.status(401).json({
        message: "Invalid email or password"
         });
            }

        return res.status(200).json({
          message: "User login successfully"
         });
        } catch (error) {
        return res.status(500).json({
        message: "Server error",
        error: error.message
            });
        }
    },

    // Get all users from the database (password is not returned)
    getAllUser: async (req, res) => {
        try {
        const users = await User.findAll({
        attributes: ['id', 'username', 'email', 'createdAt', 'updatedAt']
        });

        return res.status(200).json({
        message: "Users fetched successfully",
        count: users.length,
        users
            });
        } catch (error) {
        return res.status(500).json({
        message: "Server error",
        error: error.message
            });
        }
    },

    // Get one user by ID (password is not returned)
    getUserById: async (req, res) => {
        try {
        const foundUser = await User.findByPk(req.params.id, {
        attributes: ['id', 'username', 'email', 'createdAt', 'updatedAt']
        });

        if (!foundUser) {
        return res.status(404).json({
        message: "User not found"
        });
            }

        return res.status(200).json({
        message: "User fetched successfully",
        user: foundUser
        });
        } catch (error) {
        return res.status(500).json({
        message: "Server error",
        error: error.message
            });
        }
    },

    createUser: async (req, res) => {
        try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
        return res.status(400).json({
        message: "Username, email and password are required"
        });
            }

            // Check length here, because the model only sees the hashed password
        if (password.length < 8) {
        return res.status(400).json({
        message: "Password must be at least 8 characters"
        });
            }

        const existingUser = await User.findOne({ where: { email } });

        if (existingUser) {
        return res.status(409).json({
        message: "User with this email already exists"
        });
            }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
        username,
        email,
        password: hashedPassword
        });

        return res.status(201).json({
        message: "User created successfully",
        user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email
            }
            });
        } catch (error) {
        return res.status(500).json({
        message: "Server error",
        error: error.message
        });
        }
    },

    // Update one user by ID. Send any of: username, email, password
    updateUser: async (req, res) => {
        try {
        const { username, email, password } = req.body;

        if (!username && !email && !password) {
        return res.status(400).json({
        message: "Send at least one of: username, email, password"
            });
            }

        const foundUser = await User.findByPk(req.params.id);

            if (!foundUser) {
            return res.status(404).json({
            message: "User not found"
                });
            }

            // If the email is changing, make sure nobody else already uses it
            if (email && email !== foundUser.email) {
            const emailTaken = await User.findOne({ where: { email } });

            if (emailTaken) {
            return res.status(409).json({
            message: "User with this email already exists"
                    });
                }
            }

            if (password && password.length < 8) {
            return res.status(400).json({
            message: "Password must be at least 8 characters"
                });
            }

            if (username) foundUser.username = username;
            if (email) foundUser.email = email;
            if (password) foundUser.password = await bcrypt.hash(password, 10);

            await foundUser.save();

            return res.status(200).json({
            message: "User updated successfully",
            user: {
            id: foundUser.id,
            username: foundUser.username,
            email: foundUser.email,
            updatedAt: foundUser.updatedAt
                }
            });
        } catch (error) {
            // Model validation failures (for example an invalid email format)
            if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({
            message: "Validation error",
            error: error.message
                });
            }

            return res.status(500).json({
            message: "Server error",
            error: error.message
            });
        }
    },

    // Delete one user by ID
    deleteUser: async (req, res) => {
        try {
        const foundUser = await User.findByPk(req.params.id);

        if (!foundUser) {
        return res.status(404).json({
        message: "User not found"
            });
            }

        await foundUser.destroy();

        return res.status(200).json({
        message: `User with ID ${req.params.id} deleted successfully`
            });
        } catch (error) {
        return res.status(500).json({
        message: "Server error",
        error: error.message
            });
        }
    }
};

export default user;