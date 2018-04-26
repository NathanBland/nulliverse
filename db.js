'use strict';
const Mongoose = require('mongoose')
Mongoose.Promise = global.Promise

module.exports.callDb = (Model, awsCallback, callback) => {
  const mongoose = Mongoose.createConnection(process.env.DB_URI)
  Model.db.once('open', async () => {
    try {
      let response = await callback()
      return awsCallback(null, {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*", // Required for CORS support to work
          "Access-Control-Allow-Credentials": true, // Required for cookies, authorization headers with HTTPS 
          "Set-Cookie": cookie.serialize('Authorization', token, {
            httpOnly: true,
            secure: event.requestContext.stage === 'dev' ? false : true,
            expires: expiresDate,
            maxAge: 60 * 60 * 24 * 7 // 1 week 
          }),
        },
        body: JSON.stringify(response)
      })
    } catch (e) {
      console.error('error:', e)
      return callback(null, {
        statusCode: 401,
        body: JSON.stringify({
          user: 'Unauthorized'
        })
      })
    }

  })
};