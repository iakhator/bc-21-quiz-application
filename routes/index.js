var express = require('express');
var router = express.Router();
var firebase = require('firebase');
var questions = [];

/* GET home page. */
router.get('/', function(req, res) {
    res.render('index');
});


module.exports = router;
