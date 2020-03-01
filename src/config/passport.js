const passport = require('passport');
const User = require('../models/user');
const facebookeStrategy = require('passport-facebook');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
require('dotenv').config();

const FacebookOption = {
    //option of the faceboook strategy 
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL: 'http://localhost:3000/api/user/facebook/redirect',
    profileFields: ["id", "displayName", "email", "gender"],
    proxy: true
}

const googleOption = {
    //option of the google strategy 
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/api/user/google/redirect',
    profileFields: ["id", "displayName", "email", "phones"],
    proxy: true
}

passport.serializeUser(function(user, done) {
    done(null, user);
});
passport.deserializeUser(function(user, done) {
    done(null, user);
});

passport.use(
    new facebookeStrategy(FacebookOption, async(accessToken, refreshToken, profile, done) => {
        try {
            const currentUser = await User.findOne({ facebookID: profile.id });
            if (currentUser) {
                // if the user is not new (has created )
                done(null, currentUser);
            } else {
                // if the user is new (not created yet)
                const user = await User.findOne({ email: profile._json.email });
                if (user) {
                    user.facebookID = profile.id;
                    await user.save();
                    done(null, user);
                } else {
                    const newUser = new User({
                        name: profile._json.name,
                        facebookID: profile._json.id,
                        email: profile._json.email,
                        Account_verified: true
                    })
                    await newUser.save();
                    done(null, newUser);
                }
            }
        } catch (err) {
            done(null, false);
        }

    }))

passport.use(

    new GoogleStrategy(googleOption, async(accessToken, refreshToken, profile, done) => {
        try {
            const currentUser = await User.findOne({ googleID: profile.id });
            if (currentUser) {
                // if the user is not new (has created )
                done(null, currentUser);
            } else {
                // if the user is new (not created yet)
                const user = await User.findOne({ email: profile.email });
                if (user) {
                    user.googleID = profile.id;
                    await user.save();
                    done(null, user);
                } else {
                    const newUser = new User({
                        name: profile.displayName,
                        googleID: profile.id,
                        email: profile.email,
                        Account_verified: profile.email_verified
                    })
                    await newUser.save();
                    done(null, newUser);
                }
            }
        } catch (err) {
            done(null, false);
        }


    }))