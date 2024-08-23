const db = require("../models/index");
const { User, Profile, Role, UserRole, Wallet, TransactionLog } = db;
const bcrypt = require("bcryptjs");
const uniqid = require("uniqid");
const jwt = require("jsonwebtoken");
const { now } = require("moment");
const mailService = require("./mail.service");
const { Op, QueryTypes } = require("sequelize");

module.exports = {
    userWallet: async (userid) => {
        let wallet = await Wallet.findOne({
            where: { user_id: userid}
        })
        wallet = JSON.parse(JSON.stringify(wallet));
        return wallet;
    },
    availableBalance: async(userid) => {
        let sql = `SELECT w.amount as amount FROM wallets w where w.user_id = '${userid}'`
        let result = await db.rest.query(sql, { type: QueryTypes.SELECT})
        result = JSON.parse(JSON.stringify(result));
        // console.log("hereee", result)
        let availableBal = result[0].amount
        return availableBal
    },
    deduction: async (userid, deduction) => {
        try {
            let wallet = await Wallet.findOne({
                where: { user_id: userid}
            })
            let balance = wallet.amount - deduction
            if (deduction > wallet.amount || balance < 0){
                throw new Error("Not Enough funds in wallet");              
            }
            // balance = convertToTwoDecimalPlaces(balance)
            let data = {
                amount: balance,
                updated_at: now()
            }
            let wal = await Wallet.update(data, {
                where: { user_id: userid}
            })
            return JSON.parse(JSON.stringify(wal)); 
        } catch (e) {
            console.log(e)
            return e
        }        
    },
    increment: async (userid, increment) => {
        try {
            let wallet = await Wallet.findOne({
                where: { user_id: userid}
            })
            let balance = wallet.amount + increment
            let data = {
                amount: balance,
                updated_at: now()
            }
            let wal = await Wallet.update(data, {
                where: { user_id: userid }
            })
            return JSON.parse(JSON.stringify(wal));
        } catch (e) {
            console.log(e)
            return e
        }
    },
}