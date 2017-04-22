var express = require('express');
var router = express.Router();
var firebase = require('firebase');
var localStorage = require('localStorage');
var store = require('store');

/* GET home page. */
router.get('/', function(req, res) {
    res.render('home/home');
});

router.get('/start', function(req, res) {
    if (req.cookies.user) {
        // res.locals.user = user;
        var user = JSON.parse(req.cookies.user);

        firebase.database().ref('users/' + user.uid).on('value', function(snap) {
            name = snap.val().name;
            email = snap.val().email;

            res.render('quiz', {
                name: name,
                user: user,
                email: email,
            });
        });
    } else {
        res.redirect('/');
    }
});

//signin routes
router.get('/signin', function(req, res) {

    if (req.cookies.user) {
        res.redirect('/start');
    } else {
        res.render('signin');
    }
});

router.post('/signin', function(req, res) {
    var email = req.body.email;
    var password = req.body.password;

    if (email === "" || password === "") {
        res.flash('info', 'All fields are required.');
        res.redirect('/signin');
    } else {
        firebase.auth().signInWithEmailAndPassword(email, password)
            .then(function(user) {
                res.cookie('user', JSON.stringify(user));
                res.redirect('/start');
            })
            .catch(function(error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                if (errorCode === 'auth/user-not-found') {
                    res.flash('info', 'User not Found.');
                    res.redirect('/signin');
                } else {
                    if (errorCode === 'auth/wrong-password') {
                        res.flash('info', 'Invalid username, password combination.');
                        res.redirect('/signin');
                    }
                    console.log(errorMessage);
                }
            });
    }
});


//signup routes
router.get('/signup', function(req, res) {
    // var user = firebase.auth().currentUser;
    var user = localStorage.getItem('user');

    // if (user) {
    if (req.cookies.user) {
        return res.redirect('/start');
    } else {
        res.render('signup');

    }
});

router.post('/signup', function(req, res) {
    var email = req.body.email;
    var name = req.body.name;
    var username = req.body.username;
    var password = req.body.password;
    if (email === "" || name === "" || password === "") {
        res.flash('info', 'All fields are required.');
        res.redirect('/signup');
    } else {
        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then(function(user) {
                firebase.database().ref('users/' + user.uid).set({
                    email: email,
                    name: name,
                    password: password
                });

                res.cookie('user', JSON.stringify(user));
                res.redirect('/start');
            })
            .catch(function(error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                if (errorCode === 'auth/email-already-in-use') {
                    res.flash('info', 'That email is already in use.');
                    res.redirect('/signup');
                } else if(errorCode === 'auth/invalid-email') {
                    res.flash('info', 'Invalid email.');
                    res.redirect('/signup');
                }else if(errorCode === 'auth/weak-password') {
                    res.flash('info', 'Password must be 6 characters long.');
                    res.redirect('/signup');
                }else {
                    console.log(errorMessage);
                }
            });
    }
});

router.get('/signout', function(req, res) {
    // firebase.auth().signOut();
    // store.clearAll();
    res.clearCookie('user');
    res.redirect('/');
});


module.exports = router;
