var mongoose = require('mongoose');
var userSchema = mongoose.Schema({
	username: String, // THIS IS A PHONE NUMBER !! PASSPORT REQUIRES THE NAME A USERNAME
  	password: String,
  	facebookId: String,
  	defaultShipping: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shipping'
  }
})
var shippingSchema = mongoose.Schema({
  name: String,
  address1: String,
  address2: String,
  city: String,
  state: String,
  zip: String,
  phone: String,
  status: Number, 
  parent: mongoose.Schema.Types.ObjectId
})
var productSchema = mongoose.Schema({
  title: String,
  description: String,
  imageUrl: String
})

// module.exports = mongoose.model('User', userSchema)
module.exports = {
	User: mongoose.model('User', userSchema),
	Shipping: mongoose.model('Shipping', shippingSchema),
    Product: mongoose.model('Product', productSchema)

}