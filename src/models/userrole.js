"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class UserRole extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      UserRole.belongsTo(models.User, {
        foreignKey: "user_id",
        targetKey: "id",
      }),
        UserRole.belongsTo(models.Role, {
          foreignKey: "role_id",
          targetKey: "id",
        });
    }
  }
  UserRole.init(
    {
      // role_name: DataTypes.STRING,
      // role_id: DataTypes.NUMBER,
      // user_id: DataTypes.NUMBER,
    },
    {
      underscored: true,
      sequelize,
      modelName: "UserRole",
      tableName: "user_roles",
    }
  );
  return UserRole;
};
