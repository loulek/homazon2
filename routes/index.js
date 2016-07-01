var express = require('express');
var router = express.Router();
var Shipping = require('../models/models').Shipping;
var User = require('../models/models').User;
var Product = require('../models/models').Product;
var creditCard = process.env.CARD;
var stripe = require("stripe")(creditCard);
var Payment = require('../models/models').Payment;
var Order = require('../models/models').Order;




// WALL
router.use(function(req, res, next){
	if (!req.user) {
		res.redirect('/login');
	} else {
		return next();
	}
});

router.get('/', function(req, res, next){
	Product.find().sort({title:1}).exec(function(err, product){
		res.render('products', {
			products : product 
		})
	})
})

router.get('/products/:id', function(req, res, next){
	Product.findById(req.params.id, function(err, product) {
		if (err) return next(err);
		res.render('singleproduct', {
			product:product
		})
	})
})


router.get('/shipping', function(req, res, next){
	res.render('shipping')
})

router.post('/shipping', function(req, res, next){	      
	var model = new Shipping({
		name: req.body.name,
		address1: req.body.address1,
		address2: req.body.address2,
		city: req.body.city,
		state: req.body.state,
		zip: req.body.zip,
		phone: req.body.phone,
		parent: req.user._id
	})
	model.save();
	User.findByIdAndUpdate(req.user._id, {defaultShipping: model._id}, function(err, callback){
		if (err)
			return "Error"
		else{
			callback;
		}
	})
	res.redirect("/cc")
})

router.get('/cc', function(req, res){
	res.render('cc')
})

router.post('/cc', function(req, res){

	stripe.customers.create({
		source: req.body.stripeToken,
		description: req.body.stripeEmail
	}, function(err, customer) {
		var card = customer.sources.data[0];
		console.log("customer", customer);
		console.log("customer card", card);
		var payment = new Payment({
			stripeBrand:card.brand,
			stripeCustomerId: customer.id,
			stripeExpMonth: card.exp_month,
			stripeExpYear: card.exp_year,
			stripeLast4: card.last4,
			stripeSource: card.id,
			parent: req.user._id

		})
		payment.save();
		req.user.defaultPayment = payment;
		req.user.save();

	});
	res.redirect("/cc")
});
// YOUR CODE: When it's time to charge the customer again, retrieve the customer ID!
	// stripe.charges.create({
	//   amount: 1500, // amount in cents, again
	//   currency: "usd",
	//   customer: customerId // Previously stored, then retrieved
	// });



router.get('/cart', function(req, res, next) {
	res.render('cart', {
		products: req.session.cart
	})	
})

router.post('/cart', function(req, res){
  var subtotal = 0;
  for (var i = 0; i < req.session.cart.length; i ++){
  	subtotal += req.session.cart[i].price;
  }
  var order = new Order ({
  timestamp: new Date(),
  contents: req.session.cart,
  user: req.user._id,
  payment: req.user.defaultPayment,
  shipping: req.user.defaultShipping,
  subtotal: subtotal,
  total: subtotal * 1.2
	})
	order.save();
	console.log(order);
	res.redirect('/order/'+order._id)

})

router.get('/cart/add/:id', function(req, res, next) {
	Product.findById(req.params.id, function(err, product) {
		req.session.cart.push(product);
		res.redirect("/cart");


	})
})

router.get('/cart/delete/:id', function(req, res, next) {
	for (var i = 0; i < req.session.cart.length ; i++){
		if (req.session.cart[i]._id === req.params.id){
			req.session.cart.splice(i, 1)
			res.redirect("/cart");


		}
	}
})
router.get('/cart/delete', function(req, res, next) {
	req.session.cart = [];
	res.redirect("/cart");
});

router.get('/order/:id', function(req, res){

	Order.findById(req.params.id).populate('shipping').exec(function(err, carrot){
		res.render('order', {
			order: carrot,
			hasone: req.session.cart.length === 1
		})
		
	})	
})


module.exports = router;