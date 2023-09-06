const express = require('express');
const router = express.Router();
const cache = require('../utils/cache');

router.get('/', async (req, res, next) => {
  try {
    const processStart = new Date().getTime();
    var announcements = await cache.readAnnouncements();
    var locale = req.getLocale();
    res.render('announcements', {
      user: req.user,
      announcements: announcements.map(announcement => {
        if (locale != 'en' && announcement.translations) {
          if (announcement.translations[locale] && announcement.translations[locale].message) {
            announcement.message = announcement.translations[locale].message;
          }
        }
        return announcement;
      })
    });
    profiler.log('announcements', processStart);
  } catch (e) {
    next(e)
  }
});

module.exports = router;


