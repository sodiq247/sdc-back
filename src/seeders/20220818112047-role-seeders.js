"use strict";
module.exports = {
  up: async (queryInterface) => {
    queryInterface.bulkInsert("roles", [
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
  },
  down: async (queryInterface) => {
    await queryInterface.bulkDelete("departments", {
      [Op.or]: [{ name: "USD" }, { name: "EUR" }],
    });
  },
};
