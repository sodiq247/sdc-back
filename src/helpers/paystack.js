const { default: axios } = require("axios");
const uniqid = require("uniqid");
// const open = require("open")

require("dotenv").config();
module.exports = {
  callback: async (ref) => {
    let resp = await axios.get(process.env.PAYSTACK_VERIFY + ref, {
      headers: {
        Authorization: "Bearer " + process.env.PAYSTACK_SECRET_KEY,
      },
    });
    return resp.data;
  },
  verifyTransaction: async (req, res) => {
    console.log(req.body.reference);
    try {
      let resp = await axios.get(
        process.env.PAYSTACK_VERIFY + req.body.reference,
        {
          headers: {
            Authorization: "Bearer " + process.env.PAYSTACK_SECRET_KEY,
          },
        }
      );
      res.status(200).json(resp.data);
      return (resp.data)
    } catch (e) {
      // console.log(e)
      return e;
    }
  },
  initialize: async (req, res) => {
    const { email, amount } = req.body;
    console.log('Request body:', req.body);
    const params = JSON.stringify({
        email,
        amount,
        callback_url:"http://localhost:3000/confirmation"
    });
    try {
        const transaction = await axios.post(
          process.env.paystack_initialize,
            params,
            {
                headers: {
                    Authorization: "Bearer " + process.env.PAYSTACK_SECRET_KEY,
                    "Content-Type": "application/json",
                },
            }
        );
        if (transaction.data) {
            res.status(200).json(transaction.data);
        } else {
            console.log("No Authentication URL found");
            res.status(500).json({ error: "No Authentication URL found" }); 
        }
    } catch (error) {
        console.error('Error initializing Paystack transaction:', error.message);
        res.status(500).json({ error: error.message });
    }
  },
  initialize2: async (email, amount, callback, req) => {
    try {
      let ref = uniqid();
      let resp = await axios.post(
        process.env.paystack_initialize,
        {
          email: email,
          amount: amount,
          callback_url: callback,
          key: process.env.PAYSTACK_SECRET_KEY,
          reference: ref,
          //subaccount: process.env.paystack_subaccount
        },
        {
          headers: {
            Authorization: "Bearer " + process.env.PAYSTACK_SECRET_KEY,
          },
        }
      );
      return resp.data;
    } catch (e) {
      // console.log(e.message);
    }
  },
  initializeTrader: async (email, amount, req) => {
    try {
      let ref = uniqid();
      let resp = await axios.post(
        process.env.paystack_initialize,
        {
          email: email,
          amount: amount,
          callback_url: req.get("origin") + "/user/checkout/callback",
          key: process.env.PAYSTACK_SECRET_KEY,
          reference: ref,
          subaccount: process.env.paystack_subaccount,
        },
        {
          headers: {
            Authorization: "Bearer " + process.env.PAYSTACK_SECRET_KEY,
          },
        }
      );
      return resp.data;
    } catch (e) {
      // console.log(e);
    }
  },
  initializeTrader2: async (email, amount, req) => {
    try {
      let ref = uniqid();
      let resp = await axios.post(
        process.env.paystack_initialize,
        {
          email: email,
          amount: amount,
          callback_url: req.get("origin") + "/user/checkout/callback",
          key: process.env.PAYSTACK_SECRET_KEY,
          reference: ref,
          subaccount: process.env.paystack_subaccount,
        },
        {
          headers: {
            Authorization: "Bearer " + process.env.PAYSTACK_SECRET_KEY,
          },
        }
      );
      return resp.data;
    } catch (e) {
      // console.log(e);
    }
  },
  accountDetails: async (accountNumber, code) => {
    var config = {
      method: "get",
      url: `https://api.paystack.co/bank/resolve?account_number=${accountNumber}&bank_code=${code}`,
      headers: {
        Authorization: "Bearer " + process.env.PAYSTACK_SECRET_KEY,
      },
    };
    let result;
    await axios(config)
      .then(async function (response) {
        result = await response.data;
      })
      .catch(function (error) {
        result = error.response.data;
      });
    return result;
  },
  listBanks: async () => {
    var config = {
      method: "get",
      url: "https://api.paystack.co/bank?currency=NGN",
      headers: {
        Authorization: "Bearer " + process.env.PAYSTACK_SECRET_KEY,
      },
    };
    var bankResult = null;
    await axios(config)
      .then(async function (response) {
        bankResult = await response.data;
      })
      .catch(function (error) {
        bankResult = error.response.data;
      });
    return bankResult;
  },
  recipient: async (name, account_number, bank_code) => {
    var data = JSON.stringify({
      type: "nuban",
      name: name,
      account_number: account_number,
      bank_code: bank_code,
      currency: "NGN",
    });

    var config = {
      method: "post",
      url: "https://api.paystack.co/transferrecipient",
      headers: {
        Authorization: "Bearer " + process.env.PAYSTACK_SECRET_KEY,
        "Content-Type": "application/json",
      },
      data: data,
    };
    let result = null;
    await axios(config)
      .then(async function (response) {
        result = await response.data;
      })
      .catch(function (error) {
        result = error.response.data;
      });
    return result;
  },
  transfer: async (amount, recipient_code, reason) => {
    var data = JSON.stringify({
      source: "balance",
      amount: amount,
      recipient: recipient_code,
      reason: reason,
    });

    var config = {
      method: "post",
      url: "https://api.paystack.co/transfer",
      headers: {
        Authorization: "Bearer " + process.env.PAYSTACK_SECRET_KEY,
        "Content-Type": "application/json",
      },
      data: data,
    };
    let result;
    await axios(config)
      .then(async function (response) {
        result = await response.data;
      })
      .catch(function (error) {
        result = error.response.data;
      });
    return result;
  },
  // mobileVerify: async (ref) => {
  //   try {
  //     let resp = await axios.get(
  //       process.env.PAYSTACK_VERIFY + ref,
  //       {
  //         headers: {
  //           Authorization: "Bearer " + process.env.PAYSTACK_SECRET_KEY,
  //         },
  //       }
  //     );
  //     return resp.data;
  //   } catch (e) {
  //     console.log(e)
  //     return e
  //   }

  // },
};
