"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class RolePermission extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      RolePermission.belongsTo(models.Permission, {
        foreignKey: "permission_id",
        targetKey: "id",
      });
      RolePermission.belongsTo(models.Role, {
        foreignKey: "role_id",
        targetKey: "id",
      });
    }
  }
  RolePermission.init(
    {},
    {
      underscored: true,
      sequelize,
      modelName: "RolePermission",
      tableName: "role_permissions",
      timestamps: false,

      defaultScope: {
        attributes: { include: ["role_id", "permission_id"] }, // Exclude the primary key column from the projection
      },
    }
  );

  return RolePermission;
};
