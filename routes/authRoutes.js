const express = require('express');
const passport = require('passport');
const router = express.Router();

// Redirect to Google for login
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Handle the callback
router.get('/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/login',
    successRedirect: '/', // or wherever you want to send logged-in users
  })
);

router.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/');
  });
});

module.exports = router;