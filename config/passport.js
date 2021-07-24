// import all the things we need  
const GoogleStrategy = require('passport-google-oauth20').Strategy
const db = require('../models')
const User = db.User
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
      async (accessToken, refreshToken, profile, done) => {
        //get the user data from google 
        const newUser = {
          username: profile.id,
          nickname: profile.displayName,
          password: profile.name.givenName
        }

        try {
          //find the user in our database 
          let user = await User.findOne({ username: profile.id })

          if (user.username == profile.id) {
            //If user present in our database.
            done(null, user)
          } else {
            // if user is not preset in our database save user data to database.
            user = await User.create(newUser)
            done(null, user)
            console.log(user)
          }
        } catch (err) {
          console.error(err)
        }
      }
    )
  )

  // used to serialize the user for the session
  passport.serializeUser((user, done) => {
    done(null, user)
  })

  // used to deserialize the user
  passport.deserializeUser((obj, done) => {
    done(null, obj)
  })
} 