var mongoose = require('mongoose');

var connect = process.env.MONGODB_URI || require('./models/connect');
mongoose.connect(connect);

var Product = require('./models/models').Product;

var products = [{"price":9.99,"imageUri":"https://images-na.ssl-images-amazon.com/images/I/61rOt2JB5mL._SL1000_.jpg","description":"Makes toast. With Hello Kitty on it. This is a MUST own.","title":"Hello Kitty Toaster"},{"price":12.25,"imageUri":"http://ichef-1.bbci.co.uk/news/1024/media/images/65438000/png/_65438509_visort.png","description":"Blocks facial recognition software from recognizing you. So, you know, Ethan can't hack you.","title":"Privacy Visor"},{"price":42.00,"imageUri":"https://images.vat19.com/covers/large/10-foot-pogo-stick.jpg","description":"With this classic, you can bounce around the classroom faster than ever before. Challenge your classmates to see who can jump the highest!","title":"Pogo stick"}]

products.forEach(function(product){



	var product = new Product({
		"imageUri": product.imageUri,
		"description" : product.description,
		"title" : product.title
	});
	console.log(product);

	product.save(function(err){
		if(err){
			console.log(err)
		} else {
			console.log("saved restaurant");	
		}
		
	})

})