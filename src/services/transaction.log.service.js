const db = require("../models");
const { TransactionLog } = db;
const { Op } = require("sequelize");
const walletService = require("./wallet.service");

module.exports = {
  add_transaction: async (data) => {
    try {
      // Check if the transaction already exists
      const existingTransaction = await TransactionLog.findOne({
        where: { transaction_ref: data.transaction_ref }
      });

      // If the transaction already exists, return an error message
      if (existingTransaction) {
        return {
          status: 0,
          msg: "This transaction log already exists"
        };
      }

      // Create the transaction log
      const createdTransaction = await TransactionLog.create(data);

      if (!createdTransaction) {
        throw new Error("Failed to create transaction log");
      }

      // Fund the user's wallet
      const walletFunded = await walletService.increment(data.user_id, data.amount);

      if (!walletFunded) {
        throw new Error("Failed to fund wallet");
      }

      // Return a success message
      return {
        status: 1,
        msg: "Transaction log created and wallet funded successfully"
      };

    } catch (error) {
      return {
        status: 0,
        msg: "Error creating a transaction",
        reason: error.message
      };
    }
  }
};
