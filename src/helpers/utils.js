const mailService = require("../services/mail.service");
module.exports = {
  pagination: (page, size) => {
    const limit = size ? +size : 10;
    const offset = page ? page * limit : 0;
    return { limit, offset };
  },
  pagingData: (data, page, limit, records) => {
    const { count: totalItems, rows: result } = data;
    const currentPage = page ? +page : 1;
    const totalPages = Math.ceil(totalItems / limit);
    return { totalItems, records, totalPages, currentPage };
  },
};
