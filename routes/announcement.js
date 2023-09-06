const cache = require('../utils/cache');

module.exports = async function(req, res, next) {
  const date = new Date();
  const announcements = await cache.readAnnouncements();
  const announcement = Object.assign({}, announcements.filter(announcement => announcement.start < date && announcement.finish > date)[0])
  const locale = req.getLocale();
  if (locale != 'en' && announcement.translations) {
    if (announcement.translations[locale] && announcement.translations[locale].message) {
      announcement.message = announcement.translations[locale].message;
    }
  }

  res.locals.announcement = announcement;

  next();
};
