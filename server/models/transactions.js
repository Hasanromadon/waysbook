'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class transactions extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      transactions.hasMany(models.transaction_details, {
        as: 'order_detail',
        foreignKey: {
          name: 'id_order',
        },
      });
      transactions.hasMany(models.book_reviews, {
        as: 'reviews',
        foreignKey: {
          name: 'id_transaction',
        },
      });

      transactions.belongsTo(models.users, {
        as: 'buyer',
        foreignKey: {
          name: 'id_buyer',
        },
      });
    }
  }

  transactions.init(
    {
      id_buyer: DataTypes.INTEGER,
      tracking_number: {
        type: DataTypes.STRING,
        defaultValue: null,
      },

      status: DataTypes.STRING,
      isReview: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: 'transactions',
    }
  );
  return transactions;
};
