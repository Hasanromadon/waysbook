'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class profiles extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      profiles.belongsTo(models.users, {
        as: 'users',
        foreignKey: {
          name: 'id_user',
        },
      });
    }
  }
  profiles.init(
    {
      phone: DataTypes.STRING,
      gender: DataTypes.STRING,
      address: DataTypes.STRING,
      image: DataTypes.STRING,
      id_user: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'profiles',
    }
  );
  return profiles;
};
