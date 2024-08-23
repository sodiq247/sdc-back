const { executeSQL, formatData } = require("../helpers/ccmsUtil");
const db = require("../models");
const { Role, RolePermission, Permission } = require("../models");
module.exports = {
  all: async () => {
    let rolepermission = await RolePermission.findAll({
      include: [
        {
          model: Permission,
        },
        {
          model: Role,
        },
      ],
    });
    return formatData(rolepermission);
  },
  allUnarchived: async () => {
    let roles = await RolePermission.findAll({
      include: [
        {
          model: Permission,
        },
        {
          model: Role,
        },
      ],
      where: { archived_at: null },
    });
    return formatData(roles);
  },
  create: async (data) => {
    RolePermission.upsert(
      {
        role_id: data.role_id,
        permission_id: data.permission_id,
      },
      {
        where: {
          role_id: data.role_id,
          permission_id: data.permission_id,
        },
      }
    );
  },
  findById: async (id) => {
    let role = await RolePermission.findOne({
      where: { id: id },
      include: [
        {
          model: Permission,
        },
        {
          model: Role,
        },
      ],
    });
    return formatData(role);
  },
  update: async (data, id) => {
    let role = await RolePermission.update(data, {
      where: { id: id },
    });
    return formatData(role);
  },
  bulkCreate: async (data) => {
    let result = await RolePermission.bulkCreate(data, {
      ignoreDuplicates: true,
    });
    return result;
  },
  deleteByRole: async (role_id) => {
    let result = await RolePermission.destroy({
      where: { role_id: role_id },
    });
    console.log(result);
    return result;
  },
  delete: async (role_id, permission_id) => {
    let permission = await RolePermission.destroy({
      where: { role_id: role_id, permission_id: permission_id },
    });
    return permission;
  },
  check: async (role_id, permission_id) => {
    return await RolePermission.count({
      where: { role_id: role_id, permission_id: permission_id },
    });
  },
  hasPermission: async (user, permission) => {
    let sql = `select count(*) as count from user_roles ur 
    join role_permissions rp on rp.role_id = ur.role_id 
    join permissions p on p.id = rp.permission_id 
    where ur.user_id ='${user}'  and p.name='${permission}'`;
    let result = await executeSQL(sql);
    return formatData(result);
  },
  hasPermissions: async (user, permissions) => {
    let sql = `SELECT p.name, true as status from permissions p 
    join role_permissions rp on rp.permission_id = p.id 
    join user_roles ur on ur.role_id=rp.role_id 
    where p.name IN (${permissions}) AND ur.user_id = '${user}'`;
    let result = await executeSQL(sql);
    return formatData(result);
  },
  userPermissions: async (user) => {
    let sql = `SELECT p.name, true as status from permissions p join role_permissions 
    rp on rp.permission_id = p.id join user_roles ur on ur.role_id=rp.role_id
    where ur.user_id = ${user};`;
    let result = await executeSQL(sql);
    return formatData(result);
  },
};
