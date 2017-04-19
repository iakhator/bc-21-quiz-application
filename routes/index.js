var express = require('express');
var router = express.Router();
var firebase = require('firebase');

/* GET home page. */
router.get('/', function(req, res) {
    res.render('home/home');
});

router.get('/dashboard', function(req, res) {
    res.render('quiz');
});

router.get('/signin', function(req, res) {
    res.render('signin');
});

router.get('/signup', function(req, res) {
    res.render('signup');
})


router.post('/signup', function(req, res) {
	var email = req.body.email;
	var name = req.body.name;
	var username = req.body.username;
	var password = req.body.password;

	if(email === "" || name === "" || username === "" || password === "") {
		res.flash('info', 'All fields are required.');
		res.redirect('/signup');
	}
	firebase.auth().createUserWithEmailAndPassword(email, password)
	.then(function(user) {
		firebase.database().ref('users/' + user.uid).set({
	        email: email,
	        username : username,
	        name : name,
	        password : password
	     });
		res.redirect('/success');
	})
	.catch(function(error) {
		var errorCode = error.code;
		var errorMessage = error.message;
		if(errorCode === 'auth/email-already-in-use') {
			res.flash('info', 'That email is already in use.');
			res.redirect('/signup');
			console.log('That email already exist');
	  } else {
	    console.log(errorMessage);
	  }
	});
});


module.exports = router;
