require("dotenv").config({ path: "../.env" });
const apiUtils = require("../helpers/apiUtils");
const { ApiUtils } = require("../helpers/apiUtils");

module.exports = {
  data: async (req, res) => {
    console.log("begining of data services");
    console.log(res.locals.user);
    try {
      let token = "Token " + process.env.HUSMO_TOKEN;
      let base_url = process.env.HUSMO_BASEURL;

      console.log(token);
 
      let data = {
        network: req.body.network,
        mobile_number: req.body.mobile_number,
        plan: req.body.plan,
        Ported_number: true,
      };

      let url = base_url + "api/data/";
      let config = {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      };
      console.log(data);
      console.log("end of data service");
      let result = await apiUtils.post(url, data, config);
      return result;
    } catch (e) {
      console.log(e);
      return e;
    }
   
  },
  airtime: async (req, res) => {
    try {
      let token = "Token " + process.env.HUSMO_TOKEN;
      let base_url = process.env.HUSMO_BASEURL;
      let data = {
        network: req.body.network,
        amount: req.body.amount,
        mobile_number: req.body.mobile_number,
        Ported_number: true,
        airtime_type: req.body.airtime_type,
      };
      let url = base_url + "api/topup/";
      let config = {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      };
      console.log(data);
      let result = await apiUtils.post(url, data, config);
      return result;
    } catch (e) {
      console.log(e);
      return e;
    }
  },
  cablesub: async (req, res) => {
    try {
      let token = "Token " + process.env.HUSMO_TOKEN;
      let base_url = process.env.HUSMO_BASEURL;
      let data = {
        cablename: req.body.cablename,
        cableplan: req.body.cableplan,
        smart_card_number: req.body.smart_card_number,
      };
      let url = base_url + "api/cablesub/";
      let config = {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      };
      console.log(data);

      let result = await apiUtils.post(url, data, config);
      return result;
    } catch (e) {
      console.log(e);
      return e;
    }
  },
  electric: async (req, res) => {
    try {
      let token = "Token " + process.env.HUSMO_TOKEN;
      let base_url = process.env.HUSMO_BASEURL;
      let data = {
        disco_name: req.body.disco_name,
        amount: req.body.amount,
        meter_number: req.body.meter_number,
        MeterType: req.body.MeterType,
      };
      let url = base_url + "api/billpayment/";
      let config = {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      };
      console.log(data);

      let result = await apiUtils.post(url, data, config);
      return result;
    } catch (e) {
      console.log(e);
      return e;
    }
  },
  allDataTransactions: async (req, res) => {
    try {
      let token = "Token " + process.env.HUSMO_TOKEN;
      let base_url = process.env.HUSMO_BASEURL;
      let data = {};
      let url = base_url + "api/data/";
      let config = {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      };

      let result = await apiUtils.get(url, config);
      console.log(token);
      return result;
    } catch (e) {
      console.log(e);
      return e;
    }
  },
  validateMeter: async (req, res) => {
    try {
      let token = "Token " + process.env.HUSMO_TOKEN;
      let base_url = process.env.HUSMO_BASEURL;
      let { meternumber, disconame, mtype } = req.body;
      // let url = base_url + `ajax/validate_meter_number?meternumber=${meternumber}&disconame=${disconame}&${mtype}=Prepaid`;
      let url = `${base_url}ajax/validate_meter_number?meternumber=${meternumber}&disconame=${disconame}&mtype=${mtype}`;
      // console.log(e)

      let config = {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      };

      let result = await apiUtils.get(url, config);
      return result;
    } catch (e) {
      console.log(e);
      return e;
    }
  },

  validateIUC: async (req, res) => {
    try {
      let token = "Token " + process.env.HUSMO_TOKEN;
      let base_url = process.env.HUSMO_BASEURL;
      let { cardnumber, cablename } = req.body;
      let url = `${base_url}ajax/validate_iuc?smart_card_number=${cardnumber}&cablename=${cablename}`;
      // console.log(e)
      
      let config = {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      };
      
      let result = await apiUtils.get(url, config);
      return result;
    } catch (e) {
      console.log(e);
      return e;
    }
  },
};
