'use strict'

const AWS = require('aws-sdk');
const uuid = require('uuid');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.createReserve = (event, context, callback) =>
{
    const datetime = new Date().toISOString();
    const data = JSON.parse(event.body);

    if(typeof data.userName !== 'string' )
    {
        console.error('Name || Email != string');

        const response =
        {
          statusCode: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
          },
          body: JSON.stringify({ "message":"Name || Email != string" })
        }

       return response;
    }

    const params = {
        TableName: 'reserves',
        Item: {
            id: uuid.v1(),
            userName: data.userName,
            email: data.email,
            total: data.total,
            createdAt: datetime,
            updatedAt: datetime,
        }
    };

    dynamoDb.put(params, (error, data) =>
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
        body: JSON.stringify(data.Item)
      };

      callback(null, response);
    });
}