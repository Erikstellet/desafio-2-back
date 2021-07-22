'use strict'

const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.getReserve = (event, context, callback) =>
{
  const params =
  {
    TableName: 'reserves',
    Key: {
      id: event.pathParameters.id
    }
  };


  dynamoDb.get(params, (error, data) =>
  {
    if(error)
    {
      console.error(error);
      callback(new Error(error));
      return;
    }

    const response = data.Item ?
    {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify(data.Item)
    }

    :

    {
      statusCode: 404,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({"message" : "Reserve not found"})
    };

    callback(null, response);
  });
};