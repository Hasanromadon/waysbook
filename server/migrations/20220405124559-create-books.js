'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('books', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      title: {
        type: Sequelize.STRING,
      },
      author: {
        type: Sequelize.STRING,
      },
      publicationDate: {
        type: Sequelize.DATE,
      },
      description: {
        type: Sequelize.TEXT,
      },
      price: {
        type: Sequelize.BIGINT,
      },
      isbn: {
        type: Sequelize.BIGINT,
      },
      pages: {
        type: Sequelize.INTEGER,
      },
      bookAttachment: {
        type: Sequelize.STRING,
      },
      thumbnail: {
        type: Sequelize.STRING,
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('books');
  },
};
