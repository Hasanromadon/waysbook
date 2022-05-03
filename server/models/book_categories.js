'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class book_categories extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  book_categories.init(
    {
      id_book: DataTypes.INTEGER,
      id_category: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'product_categories',
    }
  );
  return book_categories;
};
