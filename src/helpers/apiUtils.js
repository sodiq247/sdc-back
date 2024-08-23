const axios = require("axios").default;
module.exports = {
  get: async (url, config) => {
    let response = await axios.get(url, config);
    return response;
  },

  post: async (url, data, config) => {
    let response = await axios.post(url, data, config);
    return response;
  },

  put: async (url, data, config) => {
    let response = await axios.put(url, data, config);
    return response;
  },
};
