"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Role.hasMany(models.UserRole, {
        foreignKey: "role_id",
        sourceKey: "id",
      });
      Role.hasMany(models.RolePermission, {
        foreignKey: "role_id",
        sourceKey: "id",
      });
    }
  }
  Role.init(
    {
      name: DataTypes.STRING,
      description: DataTypes.STRING,
      archived_at: DataTypes.DATE,
    },
    {
      underscored: true,
      sequelize,
      modelName: "Role",
      tableName: "roles",
    }
  );
  return Role;
};
