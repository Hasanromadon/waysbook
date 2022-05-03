'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class products extends Model {
    // assosiate with users
    static associate(models) {
      // products.belongsTo(models.users, {
      //   as: 'users',
      //   foreignKey: {
      //     name: 'id_user',
      //   },
      // });
      // assosiate with categories
      // products.belongsToMany(models.categories, {
      //   as: 'categories',
      //   through: {
      //     model: 'book_categories',
      //     as: 'bridge',
      //   },
      //   foreignKey: 'id_book',
      // });
      // products.hasMany(models.book_reviews, {
      //   as: 'reviews',
      //   foreignKey: {
      //     name: 'id_book',
      //   },
      // });
    }
  }
  products.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      author: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      publicationDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      isbn: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      pages: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      bookAttachment: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      thumbnail: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'books',
    }
  );
  return products;
};
