'use strict'

const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.listReserve = (event, context, callback) =>
{
  const params =
  {
    TableName: 'reserves'
  };

  dynamoDb.scan(params, (error, data) =>
  {
    if(error)
    {
      console.error(error);
      callback(new Error(error));
      return;
    }

    const response =
    {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify(data.Items)
    };

    callback(null, response);
  });
};