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
    user = await User.findOne({ email: email });
    if (user) {
      errors.push({ msg: 'Email already exists' });
      res.render('register', {
        errors,
        name,
        email,
        password,
        password2
      });
      return;
    }
    user = await User.findOne({ name: name });
    if (user) {
      errors.push({ msg: 'Name already exists' });
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

    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) throw err;
        newUser.password = hash;
        newUser
          .save()
          .then(user => {
            req.flash(
              'success_msg',
              'You are now registered and can log in'
            );
            res.redirect('/users/login');
          })
          .catch(err => console.log(err));
      });
    });
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
        errors.push({ msg: 'Password must be at least 6 characters' });
      }
    }
    if (email) {
      var user = await User.findOne({ email: email, _id: {$ne: req.user._id} });
      if (user) {
        errors.push({ msg: 'Email already exists' });
      }
    }
    if (name) {
      var user = await User.findOne({ name: name, _id: {$ne: req.user._id} });
      if (user) {
        errors.push({ msg: 'Name already exists' });
      }
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

    var user = await User.findOne({ _id: req.user._id });

    bcrypt.compare(oldpassword, user.password, (err, isMatch) => {
      if (err) throw err;
      if (!isMatch) {
        errors.push({ msg: 'Password is incorrect' });
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
      if (!password) {
        user.save()
          .then(user => {
            req.flash(
              'success_msg',
              'You are succesfully changed the data'
            );
            res.redirect('/users/edit');
          })
          .catch(err => console.log(err));
        return;
      }
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, (err, hash) => {
          if (err) throw err;
          user.password = hash;
          user
            .save()
            .then(user => {
              req.flash(
                'success_msg',
                'You are succesfully changed the data'
              );
              res.redirect('/users/edit');
            })
            .catch(err => console.log(err));
        });
      });
    });


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
