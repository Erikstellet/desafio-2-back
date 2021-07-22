'use strict'

// Nodemailer para uso com Outlook 
var nodeoutlook = require('nodejs-nodemailer-outlook');

// Crie um arquivo chamado smtp.js dentro de uma pasta config
/* Coloque suas informações do Outlook 
  module.exports =
  {
    host: "smtp.outlook.com",
    port: 587,
    user: "Seu E-mail",
    pass: "Sua Senha",
  }
*/

const SMTP_CONFIG = require("../config/smtp");

module.exports.enviarEmail = async (event, context) => 
{
  const data = JSON.parse(event.body);
  const { cart } = data;

  const arr = Object.keys(cart).map((key) => 
  {
     const { quantity, product } = cart[key]
     return  `${product.title} | Preço: ${product.price} | Quantidade: ${quantity}`;
  })

   const mailOptions = 
   {
     auth: {
       user: SMTP_CONFIG.user,
       pass: SMTP_CONFIG.pass
     },
       from: 'abc@outlook.com',
       to: [ data.email ],
       subject: 'Sua reserva foi confirmada!',
       html: `
              <td align="left" valign="top" bgcolor="#F3BF50" style="padding: 15px;">

              <h1 style="color:#FFF"> Confirmação de reserva! </h1>
              <h3 style="color:#FFF">Olá ${data.userName}! Obrigado pela confiança :) </h3>

              <p style="size:12px"> <strong> ${arr} </strong> 
              </br>
              <p style="size:12px"> <strong> Total </strong>: R$ ${data.total} </p>
             `, 
   }   

  const response = await new Promise((rsv, rjt) => 
  {
    nodeoutlook.sendEmail(mailOptions, function (error, info) 
    {
      if (error)
      {
         return rjt(error)
      }

      rsv('Email sent'); 
      
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify({"message": "Sent"})}
    });
  });

  callback(null, response);
}