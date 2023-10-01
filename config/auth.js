const session = require('express-session');
const MongoStore = require('connect-mongo');

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
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 900000000 // 10*24*60*60*1000 + delta
    },
    store: MongoStore.create({
      mongoUrl: require('./keys').mongoURI,
      touchAfter: 24 * 3600
    })
  },
};
