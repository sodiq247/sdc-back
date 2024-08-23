'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Wallet extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Wallet.belongsTo(models.User, {
        foreignKey: "user_id",
        targetKey: "id",
      });
    }
  }
  Wallet.init({
    // userid: DataTypes.INTEGER,
    amount: DataTypes.DOUBLE
  },
  {
    sequelize,
    underscored: true,
    modelName: "Wallet",
    tableName: "wallets",
  }
);
return Wallet;
};
