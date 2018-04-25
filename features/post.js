'use strict';
const Mongoose = require('mongoose')
Mongoose.Promise = global.Promise

module.exports.readPost = (event, context, callback) => {
  
  // const mongoose = Mongoose.createConnection(process.env.DB_URI)
  // const Product = require('../../models/post')(mongoose)
  
  // let postId = ""
  // let query = {}
  // if (event.pathParameters) {
  //   query = {_id: event.pathParameters.id}
  // }
  // Product.db.once('open', () => {
  //   Product.find(query)
  //   .then(product => {
  //     Product.db.close()
  //     return callback(null, {
  //       statusCode: 200,
  //       body: JSON.stringify({
  //         product: product
  //       })
  //     })
  //   })
  //   .catch(err => {
  //     Product.db.close()
  //     return callback(new Error(err))
  //   })
  // })
};
