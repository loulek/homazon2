var mongoose = require('mongoose');
var findOrCreate = require('mongoose-findorcreate')

var userSchema = mongoose.Schema({
	username: String, // THIS IS A PHONE NUMBER !! PASSPORT REQUIRES THE NAME A USERNAME
  	password: String,
  	facebookId: String,
  	defaultShipping: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shipping'
  	},
  	defaultPayment:{
  	type: mongoose.Schema.Types.ObjectId,
  	ref: 'Payment'
    },
  	registrationCode: String
})
userSchema.plugin(findOrCreate);

var shippingSchema = mongoose.Schema({
  name: String,
  address1: String,
  address2: String,
  city: String,
  state: String,
  zip: String,
  phone: String,
  status: Number, 
  parent:{
  	type: mongoose.Schema.Types.ObjectId,
  	ref:"User"
  } 
})
var productSchema = mongoose.Schema({
  title: String,
  description: String,
  imageUri: String,
  price: Number
})

var paymentSchema = mongoose.Schema({
  stripeBrand: String,
  stripeCustomerId: String,
  stripeExpMonth: Number,
  stripeExpYear: Number,
  stripeLast4: Number,
  stripeSource: String,
  status: Number,
  parent:{
  	type: mongoose.Schema.Types.ObjectId,
  	ref:"User"
  } 
})
var orderSchema = mongoose.Schema({
  timestamp: Date,
  contents: Array,
  user: {
  	type:mongoose.Schema.Types.ObjectId,
  	ref:"User"
  },
  payment: {
  	type:mongoose.Schema.Types.ObjectId,
  	ref:"Payment"
  },
  shipping: {
  	type: mongoose.Schema.Types.ObjectId,
  	ref:"Shipping"
  },
  subtotal: Number,
  total: Number
})


// module.exports = mongoose.model('User', userSchema)
module.exports = {
	User: mongoose.model('User', userSchema),
	Shipping: mongoose.model('Shipping', shippingSchema),
    Product: mongoose.model('Product', productSchema),
    Payment: mongoose.model('Payment', paymentSchema),
    Order: mongoose.model('Order', orderSchema)

}