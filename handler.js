"use strict";

var textract = require("aws-sdk").textract;

module.exports.endpoint = (event, context, callback) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: `bye Hello, ${event} the current time is ${new Date().toTimeString()}.`,
    }),
  };

  callback(null, response);
};
