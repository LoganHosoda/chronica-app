const express = require('express');
const router = express.Router();
const { ensureAuth, ensureGuest } = require('../middleware/auth');

const Chronicle = require('../models/Chronicle');

// @desc    Login/Landing Page
// @route   GET /
router.get('/', ensureGuest, (req, res) => {
  res.render('login', {
    layout: 'login',
  });
})

// @desc   Dashboard
// @route  GET /dashboard1
router.get('/dashboard', ensureAuth, async (req, res) => {
  try {
   const chronicle = await Chronicle.find({ user: req.user.id }).lean()
    res.render('dashboard', {
      name: req.user.firstName,
      chronicle 
    });
  } catch (err) {
    console.error(err); 
    res.render('error/500');
  }
})

module.exports = router;
