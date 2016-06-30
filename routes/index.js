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


module.exports = router;