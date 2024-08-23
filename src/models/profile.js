"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Profile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Profile.belongsTo(models.User, {
        foreignKey: "user_id",
        targetKey: "id",
      });
      // Profile.belongsTo(models.Country, {
      //   foreignKey : 'country_id',
      //   targetKey : 'id'
      // })
      // Profile.belongsTo(models.State, {
      //   foreignKey : 'state_id',
      //   targetKey : 'id'
      // })
    }
  }
  Profile.init(
    {
      firstname: {
        type: DataTypes.STRING,
      },
      lastname: {
        type: DataTypes.STRING,
      },
      email: {
        type: DataTypes.STRING,
      },
      phone_number: {
        type: DataTypes.STRING,
      },
      alt_phone: {
        type: DataTypes.STRING,
      },
      // company_name: {
      //   type: DataTypes.STRING,
      // },
      // points: {
      //   type: DataTypes.DOUBLE,
      // },
      // tier: DataTypes.STRING,
      // life_cycle_points: DataTypes.DOUBLE,
      // type: DataTypes.STRING,
      // channel: DataTypes.STRING,
      // ref_bonus_status: DataTypes.BOOLEAN,
      // marketing_campaign: DataTypes.STRING,
    },
    {
      sequelize: sequelize,
      underscored: true,
      modelName: "Profile",
      sequelize,
      tableName: "profiles",
    }
  );
  return Profile;
};
