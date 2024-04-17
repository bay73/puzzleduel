const cache = require('../utils/cache');
const PuzzleComment = require('../models/PuzzleComment');

module.exports = async function(req, res, next) {
  try {

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

    res.locals.mailboxState = 'none'
    if (req.user) {
      
      const comments = await PuzzleComment.find({receiver: req.user._id}).sort({date: -1}).limit(1);
      if (comments.length > 0) {
        let date = new Date()
        date.setDate(date.getDate() - 5);
        if (comments[0].date > date) {
          res.locals.mailboxState = 'warning'
        } else {
          res.locals.mailboxState = 'secondary'
        }
      }
    }
    next();
  } catch (e) {
    next(e);
  }
};
