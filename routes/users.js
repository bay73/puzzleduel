const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
// Load User model
const User = require('../models/User');

const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

// Login Page
router.get('/login', forwardAuthenticated, (req, res) => res.render('login'));

// Register Page
router.get('/register', forwardAuthenticated, (req, res) => res.render('register'));

async function hashWithSalt(password) {
  var salt = await bcrypt.genSalt(10);
  var hash = await bcrypt.hash(password, salt);
  return hash;
}

// Register
router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password, password2 } = req.body;
    let errors = [];

    if (!name || !email || !password || !password2) {
      errors.push({ msg: 'Please enter all fields' });
    }

    if (password != password2) {
      errors.push({ msg: 'Passwords do not match' });
    }

    if (password.length < 6) {
      errors.push({ msg: 'Password must be at least 6 characters' });
    }

    user = await User.findOne({ email: email }, "email");
    if (user) {
      errors.push({ msg: 'Email already exists' });
    }

    user = await User.findOne({ name: name }, "name");
    if (user) {
      errors.push({ msg: 'Name already exists' });
    }

    if (errors.length > 0) {
      res.render('register', {
        errors,
        name,
        email,
        password,
        password2
      });
      return;
    }

    const newUser = new User({
      name,
      email,
      password
    });

    var hash = await hashWithSalt(newUser.password);

    newUser.password = hash;
    await newUser.save();

    req.flash('success_msg', 'You are now registered and can log in');
    res.redirect('/users/login');
  } catch (e) {
    next(e);
  }
});

// Edit Page
router.get('/edit', ensureAuthenticated, (req, res) => {
  if (!req.user) {
    res.sendStatus(403);
    return;
  }
  res.render('edit_user', {
    user: req.user,
    name: req.user.name,
    email: req.user.email
  });
});

// Edit
router.post('/edit', ensureAuthenticated, async (req, res, next) => {
  try {
    if (!req.user) {
      res.sendStatus(403);
      return;
    }
    const { name, email, password, password2, oldpassword } = req.body;
    let errors = [];

    if (!oldpassword) {
      errors.push({ msg: 'Please enter the current password' });
    }

    if (password) {
      if (password != password2) {
        errors.push({ msg: 'Passwords do not match' });
      }
      if (password.length < 6) {
        errors.push({ msg: 'New password must be at least 6 characters' });
      }
    }
    if (email) {
      var user = await User.findOne({ email: email, _id: {$ne: req.user._id} }, "email");
      if (user) {
        errors.push({ msg: 'Email already exists' });
      }
    }
    if (name) {
      var user = await User.findOne({ name: name, _id: {$ne: req.user._id} }, "name");
      if (user) {
        errors.push({ msg: 'Name already exists' });
      }
    }

    var user = await User.findOne({ _id: req.user._id });

    var isMatch = await bcrypt.compare(oldpassword, user.password);

    if (!isMatch) {
      errors.push({ msg: 'Current password is incorrect' });
    }
    if (errors.length > 0) {
      res.render('edit_user', {
        user: req.user,
        errors: errors,
        name: name,
        email: email,
        password: password,
        password2: password2,
        oldpassword: oldpassword
      });
      return;
    }

    if (name) {
      user.name = name;
    }
    if (email) {
      user.email = email;
    }


    if (password) {
      var hash = await hashWithSalt(password);
      user.password = hash;
    }

    await user.save();

    req.flash('success_msg', 'You are succesfully changed the data');
    res.redirect('/users/edit');
  } catch (e) {
    next(e);
  }
});

// Login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/');
});

module.exports = router;
