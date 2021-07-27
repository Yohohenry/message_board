// import all the things we need  
const GoogleStrategy = require('passport-google-oauth20').Strategy
const db = require('../models')
const User = db.User
const bcrypt = require('bcrypt')
const dotenv = require('dotenv')
dotenv.config({ path: './config.env' })

module.exports = function (passport) {

  passport.use(
    new GoogleStrategy(
        {
          clientID: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          callbackURL: '/auth/google/callback',
        },
         (req, accessToken, refreshToken, profile, done) => {
            //find the user in our database 
            var username = profile.id
            User.findOne({ where: {
              username
              }})
              .then(user => {
                  if (user) {return done(null, user)}
                  const randomPassword = Math.random().toString(36).slice(-8)
                  bcrypt.genSalt(10, (err, salt) => {
                      bcrypt.hash(randomPassword, salt, (err, hash) => {
                          if (err) throw err
                          User.create({
                              username: profile.id, 
                              nickname: profile.displayName, 
                              password: hash
                          })
                          .then(user => done(null, user))
                          .catch(err => console.error(err))
                      })
                      
                  })
              })
          }
          
      )
  )
  // used to serialize the user for the session
  passport.serializeUser((user, done) => {
    done(null, user.username)
  })

  // used to deserialize the user
  passport.deserializeUser(function(user, done) {
    console.log('deserialize username: ', user)
    User.findOne({
        where: { username: user}
    })
    done(null, user);
    });
} 