"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Permission extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Permission.hasMany(models.RolePermission, {
        foreignKey: "permission_id",
        sourceKey: "id",
      });
    }
  }
  Permission.init(
    {
      name: DataTypes.STRING,
    },
    {
      underscored: true,
      sequelize,
      modelName: "Permission",
      tableName: "permissions",
    }
  );
  return Permission;
};
