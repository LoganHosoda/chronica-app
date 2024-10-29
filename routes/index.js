const express = require('express');
const router = express.Router();
const { ensureAuth, ensureGuest } = require('../middleware/auth');

const Chronicle = require('../models/Chronicle');

// @desc    login/landing page
// @route   get /
router.get('/', ensureGuest, (req, res) => {
  res.render('login', {
    layout: 'login',
  });
})

// @desc   dashboard
// @route  get /dashboard1
router.get('/dashboard', ensureAuth, async (req, res) => {
  try {
   const chronicles = await Chronicle.find({ user: req.user.id }).lean()
    res.render('dashboard', {
      name: req.user.firstname,
      chronicles, 
    });
  } catch (err) {
    console.error(err); 
    res.render('error/500');
  }
})

module.exports = router;
