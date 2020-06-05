"use strict";
const AWS = require("aws-sdk");

// const savePictures = require("./savePictures");

module.exports.endpoint = (event, context, callback) => {
  var textract = new AWS.Textract();

  var params = {
    Document: {
      /* required */
      // Bytes: Buffer.from('...') || 'STRING_VALUE' /* Strings will be Base-64 encoded on your behalf */,
      S3Object: {
        Bucket: "super-google-photos-dev",
        Name: "IMG_0506.JPG",
        // Version: 'STRING_VALUE'
      },
    },
    FeatureTypes: [
      /* required */
      "FORMS",
      /* more items */
    ],
    // HumanLoopConfig: {
    //   FlowDefinitionArn: 'STRING_VALUE', /* required */
    //   HumanLoopName: 'STRING_VALUE', /* required */
    //   DataAttributes: {
    //     ContentClassifiers: [
    //       FreeOfPersonallyIdentifiableInformation | FreeOfAdultContent,
    //       /* more items */
    //     ]
    //   }
    // }
  };

  textract.analyzeDocument(params, function (err, data) {
    if (err) console.log(err, err.stack);
    // an error occurred
    else {
      console.log("Response::");
      console.log(data);

      const textArr = data["Blocks"].map((obj) => {
        if (obj["Text"]) {
          return obj["Text"];
        }

        return null;
      });

      const response = {
        statusCode: 200,
        body: JSON.stringify({
          message: textArr,
        }),
      };

      callback(null, response);
    } // successful response
  });
};

module.exports.savePictures = (event, context, callback) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: `save pictures`,
    }),
  };

  callback(null, response);
};
