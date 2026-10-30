import { Model, DataTypes } from 'sequelize';

export default (sequelize) => {
  class Post extends Model {
    static associate(models) {
      // Defines the inverse relationship: Post belongs to User
      Post.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user',
        onDelete: 'CASCADE', // Automatically deletes posts if their user is deleted
      });
    }
  }

  Post.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { notEmpty: true }
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      // The foreign key column explicitly defined
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      }
    },
    {
      sequelize,
      modelName: 'Post',
      tableName: 'posts',
      timestamps: true,
    }
  );

  return Post;
};
