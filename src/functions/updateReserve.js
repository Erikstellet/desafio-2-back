'use strict'

const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.updateReserve = (event, context, callback) =>
{
    const datetime = new Date().toISOString();
    const data = JSON.parse(event.body);

    if(typeof data.userName !== 'string')
    {
        console.error('Empty cart');
        
        const response =
        {
            statusCode: 400,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true,
            },
            body: JSON.stringify({ "message":"Empty cart" })
        }

        return;
    }

    const params =
    {
        TableName: 'reserves',
        Key: {
            id: event.pathParameters.id
        },
        ExpressionAttributeValues: {
            ':n': data.userName,
            ':e': data.email,
            ':c': data.cart,
            ':u': datetime
        },
        UpdateExpression: 'set userName = :n, email = :e, cart = :c, updatedAt = :u'
    };

    dynamoDb.update(params, (error, data) => {
        if(error) {
            console.error(error);
            callback(new Error(error));
            return;
        }

        const response = {
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