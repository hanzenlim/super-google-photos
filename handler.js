"use strict";
const AWS = require("aws-sdk");
const uuid = require("uuid");
const dynamodb = require("./dynamodb");

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
  const body = JSON.parse(event.body);
  const images = body.images;

  // save to DB
  const timestamp = new Date().getTime();
  const data = images;
  // if (typeof data.text !== 'string') {
  //   console.error('Validation Failed');
  //   callback(null, {
  //     statusCode: 400,
  //     headers: { 'Content-Type': 'text/plain' },
  //     body: 'Couldn\'t create the todo item.',
  //   });
  //   return;
  // }

  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Item: {
      id: uuid.v1(),
      text: data,
      checked: false,
      createdAt: timestamp,
      updatedAt: timestamp,
    },
  };

  // write the todo to the database
  dynamodb.put(params, (error) => {
    // handle potential errors
    if (error) {
      console.error(error);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { "Content-Type": "text/plain" },
        body: "Couldn't create the todo item.",
      });
      return;
    }

    // create a response
    const response = {
      statusCode: 200,
      body: JSON.stringify(params.Item),
    };
    callback(null, response);
  });
};
