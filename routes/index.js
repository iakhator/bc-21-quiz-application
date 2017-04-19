var express = require('express');
var router = express.Router();
var firebase = require('firebase');
var questions = [];

/* GET home page. */
router.get('/', function(req, res) {
    res.render('home');
});

router.get('/dashboard', function(req, res) {
    res.render('dashboard');
});

router.get('/signin', function(req, res) {
    res.render('signin');
});


module.exports = router;
