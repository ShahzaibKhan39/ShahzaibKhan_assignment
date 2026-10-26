const userController ={
    getAllUser: (req, res) => {
        res.status(200).json({message: "Get all users"});
    },
    getUserById: (req, res) => {
        res.status(200).json({message: `Get user with ID ${req.params.id}`});
    },
    createUser:(req, res) => {
        res.status(201).json({message: "User created successfully"});
    },
    updateUser:(req, res) => {
        res.status(200).json({message: `User with ID ${req.params.id} updated successfully`});
    },
    deleteUser:(req, res) => {
        res.status(200).json({message: `User with ID ${req.params.id} deleted successfully`});
    }
}

export default userController;