"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasOne(models.Profile, {
        foreignKey: "user_id",
        sourceKey: "id",
      });
      User.hasOne(models.UserRole, {
        foreignKey: "user_id", 
        sourceKey: "id",
      });
      User.hasOne(models.Wallet, {
        foreignKey: "user_id",
        sourceKey: "id",
      });
      User.hasMany(models.TransactionLog, {
        foreignKey: "user_id",
        sourceKey: "id",
      });
      // User.hasOne(models.wallet, {
      //   foreignKey: "user_id",
      //   sourceKey: "id",
      // });
      // User.hasMany(models.Otp, {
      //   foreignKey: "user_id",
      //   sourceKey: "id",
      // });
    }
  }
  User.init(
    {
      username: DataTypes.STRING,
      password: DataTypes.STRING,
      status: DataTypes.BOOLEAN,
      activation_token: DataTypes.TEXT,
      password_reset_token: DataTypes.TEXT,
    },
    {
      underscored: true,
      sequelize,
      modelName: "User",
      tableName: "users",
    }
  );
  return User;
};
