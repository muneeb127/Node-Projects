 //This is where we define strategies which we use with passport.js

 const LocalStrategy = require('passport-local').Strategy;
 const mongoose = require('mongoose');
 const bcrypt = require('bcryptjs');


 //Load User model 
const User = mongoose.model('users'); 

module.exports = function(passport){
    //usernameField : email 
    //We are specifying that we are using email as username
    passport.use(new LocalStrategy({usernameField: 'email'},
    //Done is a callback function
    //After we are finished authenticating, we need to call done
    //email, password are coming from the form
    (email, password, done) => {
        // console.log(email);
        //Login form is connected to our local strategy

        //Checking if user is present in the database
        //match user
        User.findOne({
            email:email
        }).then(user => {
            if(!user){
                //done(err, user, msg)
                return done(null, false, {message: 'No user found'});
            }

            //Match password
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if(err) throw err;
                if(isMatch){
                    return done(null, user);
                } else {
                    return done(null, false, {message: 'Password Incorrect'});
                }
            })
        })
    }));

    passport.serializeUser(function(user, done) {
        done(null, user.id);
      });
      
      passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
          done(err, user);
        });
      });

}