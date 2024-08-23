const husmoServices = require("../services/husmo.services");
const walletService = require('../services/wallet.service');
const paystackService = require('../helpers/paystack');
const { default: axios, Axios } = require("axios");
const transactionLogService = require("../services/transaction.log.service");

module.exports = {
  data: async (req, res) => {
    let result = await husmoServices.data(req, res);
    let user = await res.locals.user;
    let deduction_amnt = Math.ceil(parseInt(result.plan_amount) + parseInt(result.plan_amount )* 0.2 );
    if (result.Status == "successful"){
      let deduction = await walletService.deduction(user.sub,deduction_amnt)
      if (deduction){
              console.log("successfully deducted ", deduction_amnt, " from user: ", user.sub)
      }
    }
    console.log(result);
    res.send(result);
  },
  airtime: async (req, res) => {
    let result = await husmoServices.airtime(req, res);
    let user = await res.locals.user;
    let deduction_amnt = Math.ceil(parseInt(result.plan_amount) + parseInt(result.plan_amount )* 0.2 );
    if (result.Status == "successful"){
      let deduction = await walletService.deduction(user.sub,deduction_amnt)
      if (deduction){
              console.log("successfully deducted ", deduction_amnt, " from user: ", user.sub)
      }
    }
    console.log(result);
    res.send(result);
  },
  allDataTransactions: async (req, res) => {
    let result = await husmoServices.allDataTransactions(req, res);
    console.log(result);
    res.send(result);
  },
  initialize: async (req, res) => {
    let result = await paystackService.initialize(req,res)
    return result;
  },
  verifyPaystack: async (req, res) => {
    let result = await paystackService.verifyTransaction(req,res)
    if (result.status === "success"){
      console.log("Paystack transaction success !!");
      let amount = result.amount/100
      let data = {
        user_id:res.locals.user.sub,
        transaction_ref:result.reference,
        currency:result.currency,
        type:"paystack",
        description:"Funded account",
        amount,
        status:1
      }
      let transaction = await transactionLogService.add_transaction(data);
      console.log(transaction);
      
    }
    return result;
  },
  creditWallet: async (req, res, transaction_amt) => {
    let user = await res.locals.user;
    let wallet_increment = await walletService.increment(user.sub, transaction_amt)
    return wallet_increment
  },
  validateMeter: async (req, res) => {
    let result = await husmoServices.validateMeter(req, res);
    console.log(result);
    res.send(result);
  },
  validateIUC: async (req, res) => {
    let result = await husmoServices.validateIUC(req, res);
    console.log(result);
    res.send(result);
  },
  cablesub: async (req, res) => {
    let result = await husmoServices.cablesub(req, res);
    let user = await res.locals.user;
    let deduction_amnt = Math.ceil(parseInt(result.plan_amount) + 80 );
    if (result.Status == "successful"){
      let deduction = await walletService.deduction(user.sub,deduction_amnt)
      if (deduction){
              console.log("successfully deducted ", deduction_amnt, " from user: ", user.sub)
      }
    }
    console.log(result);
    res.send(result);
  },
  electric: async (req, res) => {
    let result = await husmoServices.electric(req, res);
    let user = await res.locals.user;
    let deduction_amnt = Math.ceil(parseInt(result.plan_amount) + 80 );
    if (result.Status == "successful"){
      let deduction = await walletService.deduction(user.sub,deduction_amnt)
      if (deduction){
              console.log("successfully deducted ", deduction_amnt, " from user: ", user.sub)
      }
    }
    console.log(result);
    res.send(result);
  }
  
};
