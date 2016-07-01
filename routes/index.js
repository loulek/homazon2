var express = require('express');
var router = express.Router();
var Shipping = require('../models/models').Shipping;
var User = require('../models/models').User;
var Product = require('../models/models').Product;


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

})


router.get('/cart', function(req, res, next) {
	res.render('cart', {
		products: req.session.cart
	})	
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



module.exports = router;