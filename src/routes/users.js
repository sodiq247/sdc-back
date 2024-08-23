const db = require('../../models/index')
const { User, Profile, Role, UserRole, Wallet } = db;
const walletService = require('../services/wallet.service')
const paystack = require('../../helpers/paystack')
const { 
  signupValidation, 
  validate,
  transferValidation,
  fundWalletvalidate,
  purchaseValidation, 
  directPurchaseValidate
}  = require('../helpers/formValidator');

var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get("/dashboard", async (req, res) => {
  let availableBal = await walletService.availableBalance(userid)
  let wallet = await walletService.userWallet(userid);

  res.render("user/Dashboard", { 
    title: "Dashboard",
    layout: "Dashboard",
    wallet,
    availableBal,
  })
});

router.post(
  "/fund-wallet/checkout",
  // utils.isIPBanned,
  transferValidation(),
  fundWalletvalidate,
  async (req, res) => {
  let user = await req.user
  let userid = user.id;
  try {
      let items = [];
      let paymentType = "card";
      // console.log(req.body)
      let gateway = req.body.gateway;
  if (gateway == "paystack") {
      let total_sum = req.body.amount;
      total_sum = total_sum.replaceAll(",", "");
      total_sum = parseInt(total_sum);
      let userProfile = await userService.userProfile(userid)
      let callback = req.get("origin") + "/user/checkout/callback";
      if (paymentType == "card") {
        let initial = await paystack.initialize2(
          userProfile.Profile.email,
          total_sum * 100,
          callback,
          req
        );
        if (initial.status == true) {
          // console.log("metrooo!", initial)
          let ref = initial.data.reference;
          await userController.initializeTransaction(req, res, ref);
          res.redirect(initial.data.authorization_url);
        }
      }
  }
    // if(gateway == "flutter"){
    //     let items = [];
    //     let paymentType = "card";
    //     // console.log(req.body)
    //     let total_sum = req.body.amount;
    //     total_sum = total_sum.replaceAll(",", "");
    //     total_sum = parseInt(total_sum);
    //     let userProfile = await userService.userProfile(userid)
    //     let callback = req.get("origin") + "/user/checkout/flutter/callback";
    //     if (paymentType == "card") {
    //         let initial = await flutterwave.initialize(
    //         userProfile.Profile.email,
    //         total_sum,
    //         callback,
    //         req
    //       );
    //       if (initial.status == "success") {
    //         // console.log("trans_ref 1", initial)
    //         let ref = initial.reference;
    //         await userController.initializeTransaction(req, res, ref);
    //         let url = initial.data.link
    //         res.redirect(url);
    //       }
    //     }
    // }
    // if (gateway == "stripe") {
    //   const [userProfile, wallet, stripeCards] = await Promise.all([
    //     userService.userProfile(userid),
    //     walletService.userWallet(userid),
    //     stripeCardService.userCards(userid)
    //   ]);
    //   console.log(stripeCards);
    //   res.render("user/stripe", {
    //     title: "Service under maintenance",
    //     layout: "dashboard",
    //     user,
    //     userid,
    //     amount:req.body.amount,
    //     userProfile: JSON.parse(JSON.stringify(userProfile)),
    //     wallet: JSON.parse(JSON.stringify(wallet)),
    //     stripeCards:JSON.parse(JSON.stringify(stripeCards))
    //   });
    // }
    } catch (e) {
      console.log(e);
      res.send(e);
    }
  }
);


router.get(
"/checkout/callback",
async (req, res) => {
  try {
  let user = await req.user
  let userid = user.id;
  let userProfile = await userService.userProfile(userid)
  let wallet = await walletService.userWallet(userid)
//   let user = req.user_;
  var ref = await req.query.reference;
  let check = await userController.checkTransaction(ref);
//   console.log(check)
  if (check) {
  let data = {};
  let data2 = [];
  data.status = "pending";
  let paystackPayload = await paystack.callback(req, res);
  if (paystackPayload.status == true) {
      data.status = "verified";
      (data.currency = paystackPayload.data.currency),
      (data.amount = paystackPayload.data.requested_amount / 100);
      data2.amount = paystackPayload.data.requested_amount / 100;
      data.transaction_id = paystackPayload.data.id;
      await userController.updateTransactionLog(data, ref);
      data.description = "crediting wallet via card";
        // STILL WORKING
      let initialfunding = await userController.getCreditTransactions(userid)
      // console.log("fund count", initialfunding)
      let fund
      if(initialfunding == 0){
          let bonus = paystackPayload.data.requested_amount / 100
          bonus = bonus * 0.1;
          let total = paystackPayload.data.requested_amount / 100 + bonus;
          // console.log("bonus",bonus, total)
          await userController.creditWallet( req, res,
          total
          );
          let data = {
              user_id: userid,
              amount: bonus,
              activity: "Wallet funding",
              description: "10% bonus of funding value on first wallet funding",
              transaction_type: "Credit",
              transaction_id: paystackPayload.data.reference
            }
          //   console.log("dataaaa", data)
            let rewardLog = await rewardLogService.create(data)
            fund = total
      } else{
          // console.log("thisss", initialfunding)
          await userController.creditWallet( req, res,
          paystackPayload.data.requested_amount / 100
          );
          fund = paystackPayload.data.requested_amount / 100

      }
      let trans = await transactionService.findByTransactionId(ref)
      let time = trans.created_at
      // console.log("time", time, ref)
      let fundData = {
          amount: fund,
          transid: ref,
          name: userProfile.Profile.firstname,
          date: time,
          email: userProfile.username
      }
      mailService.walletFunding(fundData)
        // STILL WORKING >
     res.redirect("/user/dashboard")
  }
  
  }
  } catch (e) {
      console.log(e)   
  }
}
);
module.exports = router;
