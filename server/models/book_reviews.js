'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class book_reviews extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      book_reviews.belongsTo(models.users, {
        as: 'user',
        foreignKey: {
          name: 'id_user',
        },
      });
      book_reviews.belongsTo(models.books, {
        as: 'book_detail',
        foreignKey: {
          name: 'id_book',
        },
      });
    }
  }
  book_reviews.init(
    {
      id_user: DataTypes.INTEGER,
      id_book: DataTypes.INTEGER,
      id_transaction: DataTypes.INTEGER,
      rating: DataTypes.INTEGER,
      review: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: 'book_reviews',
    }
  );
  return book_reviews;
};
