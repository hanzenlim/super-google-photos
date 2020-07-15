"use strict";
const AWS = require("aws-sdk");
const uuid = require("uuid");
const dynamodb = require("./dynamodb");
const algoliasearch = require("algoliasearch");

const client = algoliasearch("M2IPRGF51C", "779178baf0193e33a07920ff67d89928");
const index = client.initIndex("google_photos");

module.exports.analyzeimage = (event, context, callback) => {
  const imageUrl = event.queryStringParameters.imageUrl;


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
      "FORMS",
    ],
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


      function sendtoAlgolia(tags);


      callback(null, response);
    } // successful response
  });
};

module.exports.uploadToAlgolia = (event, context, callback) => {
  const id = "IMG_394343.jpg";

  const myObj = {
    objectID: id,
    imageUrl: "https://s3.amazon.com/IMG_394343.jpg",
    tags: ["Princeton", "International"],
  };

  index.saveObject(myObj).then((data) => {
    console.log(data);

    const response = {
      statusCode: 200,
      body: JSON.stringify({
        message: data,
      }),
    };

    callback(null, response);
  });
};

module.exports.searchAlgolia = (event, context, callback) => {
  // only query string
  console.log("event::", event);
  const query = event.queryStringParameters.query;

  index.search(query).then(({ hits }) => {
    const response = {
      statusCode: 200,
      body: JSON.stringify({
        message: hits,
      }),
    };

    callback(null, response);
  });
};