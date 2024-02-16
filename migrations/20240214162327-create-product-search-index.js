'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      CREATE INDEX IF NOT EXISTS product_search_idx
      ON products
      USING GIN (to_tsvector('english', product_name || ' ' || product_description));
    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      DROP INDEX IF EXISTS product_search_idx;
    `);
  }
};