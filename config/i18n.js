var i18n = require("i18n");

i18n.configure({
  // setup some locales - other locales default to en silently
  locales:['en', 'ru', 'mn'],
  defaultLocale: 'en',

  directory: './locales',
  syncFiles: true,
  // sets a custom cookie name to parse locale settings from  - defaults to NULL
  cookie: 'lang',
  queryParameter: 'lang',
});

module.exports = function(req, res, next) {

  if (req.query.lang) {
    res.cookie('lang', req.query.lang, { maxAge: 100*24*60*60*1000});
  }
  
  res.locals.ipInfo = req.ipInfo

  return i18n.init(req, res, next);
};
