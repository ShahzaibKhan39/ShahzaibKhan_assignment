import { Model, DataTypes } from 'sequelize';

export default (sequelize) => {
  class User extends Model {
    static associate(models) {
      // Defines the relationship: One User has many Posts
      User.hasMany(models.Post, {
        foreignKey: 'userId',
        as: 'posts'
      });
    }
  }

  User.init(
    {
      username: { type: DataTypes.STRING, allowNull: false, validate: { notEmpty: true } },
      email: { type: DataTypes.STRING, allowNull: true, unique: true, validate: { isEmail: true } },
      password: { type: DataTypes.STRING, allowNull: false, validate: { len: [8, 500] } },
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'users',
      timestamps: true,
    }
  );

  return User;
};
