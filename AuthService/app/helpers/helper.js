const {v4} = require('uuid');
const CryptoJS = require("crypto-js");

exports.createResponse = (code, status, errors = [], data = {}) => {
    let error
    if(process.env.NODE_ENV == "production") {
      if (code >= 500) {
        error = [{msg : "Internal server error"}]
      }else {
        error = Array.isArray(errors) ? errors : [{msg : errors}]
      }
    }else {
      error = Array.isArray(errors) ? errors : [{msg : errors}]
    }
  
    return {
      code: parseInt(code),
      status: status,
      errors: error,
      data: data,
    }
  }

exports.generatePaginate = (count, rows, page, limit, offset) => {
  const pagination = {}

  pagination.total = parseInt(count);
  pagination.per_page = parseInt(limit);
  pagination.last_page = Math.ceil(parseInt(count) / parseInt(limit));
  pagination.current_page = parseInt(page);
  pagination.from = offset + rows.length < 1? offset : offset+1;
  pagination.to = offset + rows.length;
  pagination.rows = rows;

  return pagination;
}

// RANDOM UNIQUE CODE
exports.getUniqueCode = () => {
  return v4();
}

// ENCRYPT TEXT
exports.encryptText = (text) => {
  try {
    return CryptoJS.AES.encrypt(text, process.env.SECRET_KEY).toString();
  } catch (error) {
    return error.message;
  }
};

// DECRYPT TEXT
exports.decryptText = (cipherText) => {
  try {
    return CryptoJS.AES.decrypt(cipherText, process.env.SECRET_KEY).toString(
      CryptoJS.enc.Utf8
    );
  } catch (error) {
    return error.message;
  }
};