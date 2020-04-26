const flash = require('connect-flash');

module.exports = function(req, res, next) {
  flash()(req, res, ()=>{});
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  return next();
};



