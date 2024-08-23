const db = require("../models");
const { Role, RolePermission, Permission } = db;
const { Op, QueryTypes } = require("sequelize");
module.exports = {
  formatData: (data) => {
    return JSON.parse(JSON.stringify(data));
  },
  executeSQL: async (sql) => {
    return await db.rest.query(sql, { type: QueryTypes.SELECT });
  },
  executeBulkUpdateSQL: async (sql) => {
    return await db.rest.query(sql, { type: QueryTypes.BULKUPDATE });
  },
  executeUpdateSQL: async (sql) => {
    return await db.rest.query(sql, { type: QueryTypes.UPDATE });
  },
};
