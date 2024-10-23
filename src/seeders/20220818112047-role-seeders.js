"use strict";
const { Op } = require("sequelize");

module.exports = {
  up: async (queryInterface) => {
    // Check if the roles already exist in the database
    const existingRoles = await queryInterface.sequelize.query(
      `SELECT name FROM roles WHERE name IN ('superadmin', 'user')`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    // If roles don't exist, insert them
    if (existingRoles.length === 0) {
      await queryInterface.bulkInsert("roles", [
        {
          name: "superadmin",
          description: "this is a test role",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: "user",
          description: "Service Provider User",
          created_at: new Date(),
          updated_at: new Date(),
        },
      ]);
    }
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete("roles", {
      [Op.or]: [{ name: "superadmin" }, { name: "user" }],
    });
  },
};