// Add Passport-related auth routes here.

var express = require('express');
var router = express.Router();
var User = require('../models/models').User;
var Shipping = require('../models/models').Shipping;
var accountSid = process.env.ACCOUNT_SID;
var authToken = process.env.AUTH_TOKEN;
var fromPhone = process.env.FROM_PHONE;
var twilio = require("twilio")(accountSid, authToken);



module.exports = function(passport) {

  // GET registration page
  router.get('/register', function(req, res) {
    res.render('register');
  });

  // POST registration page
  var validateReq = function(userData) {
    return (userData.password === userData.passwordRepeat);
  };

function randomCode() {
      var min = 1000;
      var max = 9999;
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

  router.post('/register', function(req, res) {
    // validation step

    if (!validateReq(req.body)) {
      return res.render('register', {
        error: "Passwords don't match."
      });
    }
    var u = new User({
      username: req.body.username,
      password: req.body.password,
      registrationCode: randomCode()
    });
    u.save(function(err, user) {
      if (err) {
        console.log(err);
        res.status(500).redirect('/register');
        return;
      }
    }) 
    twilio.messages.create({ 
        to: req.body.username, 
        from: fromPhone, 
        body: u.registrationCode
    }, function(err) {
      if(err) {
        return "error"
      }
    else{res.redirect('/verify/'+ u._id)
    }
    });
  });


  router.get('/verify/:id', function(req, res){
   res.render('verify');
  })

  router.post('/verify/:id', function(req, res){
    User.findById(req.params.id, function(err, user) {
      if(req.body.code === user.registrationCode){
        user.registrationCode = null;
        user.save(function(err, user){
          if (err)
            res.render("verify", {error: "Error savin user"});
          else{
            res.redirect("/login")
          }
        })
      } else {
        res.render("verify", {error: "The code did not match, try again with a new code you will receive!"});
      }
    })
  })

  router.get('/generateNewCode', function(req, res) {
    twilio.messages.create({ 
        to: req.params.id.username, 
        from: fromPhone, 
        body: req.params.id.registrationCode
      }, function(err, message) { 
        console.log(req.user)
    });
  })
  // GET Login page
  router.get('/login', function(req, res) {
    res.render('login');
  });

  // POST Login page
  router.post('/login', passport.authenticate('local'), function(req, res) {
    if(!req.session.cart){
      req.session.cart = [];
    }
    if(req.user.registrationCode !== null){
      var code = randomCode()
      res.redirect('/shipping');
     } else {
      var code = randomCode()
      (res.redirect("/shipping"))
    }
  });




router.get('/auth/facebook',
  passport.authenticate('facebook'));

router.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });


  // GET Logout page
  router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/login');
  });


  return router;
};