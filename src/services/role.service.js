const db = require("../models");
const { Role, RolePermission, Permission } = db;
const { Op } = require("sequelize");
const { pagination } = require("../helpers/utils");
module.exports = {
  all: async (page = 0, size = 10) => {
    let { limit, offset } = pagination(page, size);
    let roles = await Role.findAndCountAll({
      order: [["id", "DESC"]],
      limit: limit,
      offset: offset,
    });
    roles = JSON.parse(JSON.stringify(roles));
    roles.limit = limit;
    roles.offset = offset;
    return roles;
  },
  allUnarchived: async (page = 0, size = 10) => {
    let { limit, offset } = pagination(page, size);
    let roles = await Role.findAndCountAll({
      where: { archived_at: null },
      order: [["id", "DESC"]],
      limit: limit,
      offset: offset,
    });
    roles = JSON.parse(JSON.stringify(roles));
    roles.limit = limit;
    roles.offset = offset;
    return roles;
  },
  create: async (data) => {
    let role = await Role.create(data);
    return JSON.parse(JSON.stringify(role));
  },
  findById: async (id) => {
    let role = await Role.findOne({
      where: { id: id },
      include: [
        {
          model: RolePermission,
          attributes: ["role_id", "permission_id"],
          // include: [
          //   {
          //     model: Permission,
          //   },
          // ],
        },
      ],
    });
    role = JSON.parse(JSON.stringify(role));
    console.log(role);
    return role;
  },
  update: async (data, id) => {
    let role = await Role.update(data, {
      where: { id: id },
    });
    return JSON.parse(JSON.stringiry(role));
  },
  getRolesByStakeholder: async (code) => {
    let roles = await Role.findAll({
      where: {
        name: {
          [Op.like]: `${code}%`,
        },
      },
    });
    return JSON.parse(JSON.stringify(roles));
  },
};
