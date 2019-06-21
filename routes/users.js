const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const router = express.Router();

//Load user model 
require('../models/User');
const User = mongoose.model('users');

// User Login Route
router.get('/login', (req, res) => {
    res.render('users/login');
});

// User Register Route
router.get('/register', (req, res) => {
    res.render('users/register');
});

//Login From POST

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/ideas',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});

// Register Form Post
router.post('/register', (req, res) => {
    let errors = [];
    
    if(req.body.password != req.body.password2){
        errors.push({text: 'Password do not match'});
    }

    if(req.body.password.length < 4){
        errors.push({text: 'Password must be at least 4 characters'});
    }

    if(errors.length > 0){
        res.render('users/register',
        //This object is passing data to the form
        //So that the form doesnot clear if it is wrong
        {
            errors: errors,
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            password2: req.body.password2 
        });
    }else{
        User.findOne({email: req.body.email})
            .then(user => {
                if(user){
                    req.flash('error_msg', 'Email already registered');
                    res.redirect('/users/register');
                }
                else {
                    const newUser = new User({
                        name: req.body.name,
                        email: req.body.email,
                        password: req.body.password
                    });
            
                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(newUser.password, salt, (err, hash)=>{
                            if(err) throw err;
                            newUser.password = hash;
                            newUser.save()
                            //Saving new user and passing it to the .then
                                .then(user => {
                                    req.flash('success_msg', 'You are now registered and can log in');
                                    res.redirect('/users/login');
                                })
                                .catch(err => {
                                    console.log(err);
                                    return;
                                });
                        });
                    });
                }
            })

    } 
});

//logout User

router.get('/Logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
});

module.exports = router ;