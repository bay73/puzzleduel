const leagueSettings = require('../utils/league_settings');

module.exports = function(req, res, next) {

  var theme = "default";
  if (req.query.theme) {
    theme = req.query.theme;
    res.cookie('theme', req.query.theme, { maxAge: 100*24*60*60*1000});
  } else {
    theme = req.cookies.theme;
  }

  res.locals.theme = theme;
  res.locals.leagueSettings = leagueSettings(res.locals.theme)

  next();
};
