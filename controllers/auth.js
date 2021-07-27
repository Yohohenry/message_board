//Importing required modules 
const express = require('express')
const passport = require('passport')
const router = express.Router()

router.get('/google', passport.authenticate('google', { scope: ['profile','email'] }))
router.get(
    '/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
      console.log('session passport: ', req.session.passport.user);
      console.log('session user: ', req.user.id);
      req.session.username = req.session.passport.user;
      req.session.userId = req.user.id;
      res.redirect('/')
    }
  )

  router.get('/logout', (req, res) => {
    req.logout()
    res.redirect('/')
  })
  
  module.exports = router