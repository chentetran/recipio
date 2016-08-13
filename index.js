var express = require('express');
var bodyParser = require('body-parser'); // Required if we need to use HTTP query or post parameters

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public')); //serve static content

var mongoUri = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://heroku_pxxf6jx1:3shqldvfs1viv5m7vmmhorj0p0@ds153705.mlab.com:53705/heroku_pxxf6jx1';
var MongoClient = require('mongodb').MongoClient, format = require('util').format;
var db = MongoClient.connect(mongoUri, function(error, databaseConnection) {
  db = databaseConnection;
});

// homepage
app.get('/', (request, response) => {
	return response.sendFile(__dirname + '/public/index.html');
});

app.get('/recipe', (request, response) => {
	recipeName = request.query.recipe;
	console.log(recipeName);

	db.collection('recipes').find({"name": recipeName}).toArray((err, recipeArr) => {
		if (err) 
			return response.send({"error": "Error in finding recipe"});
		if (recipeArr.length == 0) {
			return response.send({"error": "Recipe doesn't exist"});
		}
		return response.send(recipeArr[0]);
	});
});

app.listen(process.env.PORT || 3000);