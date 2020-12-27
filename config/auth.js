const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

module.exports = {
  ensureAuthenticated: function(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash('error_msg', 'Please log in to view that resource');
    res.redirect('/users/login');
  },
  forwardAuthenticated: function(req, res, next) {
    if (!req.isAuthenticated()) {
      return next();
    }
    res.redirect('/');      
  },
  sessionConfig: {
    secret: process.env.COOCKIE_SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: {
      maxAge: 900000000 // 10*24*60*60*1000 + delta
    },
    store: new MongoStore({ mongooseConnection: mongoose.connection })
  },
};
