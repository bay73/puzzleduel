const express = require('express');
const router = express.Router();
const util = require('../utils/puzzle_util');
const Rating = require('../models/Rating');
const User = require('../models/User');
const profiler = require('../utils/profiler');
const cache = require('../utils/cache');

router.get('/:userid',
  async (req, res, next) => {
  try {
    const processStart = new Date().getTime();
    var from = new Date(req.query.from);
    var to = new Date(req.query.to);
    from = isNaN(from) ? to : from;
    to = isNaN(to) ? from : to;

    var to_date = new Date();
    to_date.setDate(to_date.getDate() +10);
    to = isNaN(to) ? to_date : to;
    var from_date = new Date();
    from_date.setMonth(from_date.getMonth() - 12);
    from = isNaN(from) ? from_date : from;
    if (to < from) {
      to = from;
    }

    const [typeData, userName, rating] = await Promise.all([
      cache.readPuzzleTypes(),
      cache.readUserName(req.params.userid),
      Rating.find({
        userId: req.params.userid,
        $and : [
            {date: {$gte: from}},
            {date: {$lte: to}}
          ]
      })
    ]);

    Object.keys(typeData).forEach(type => {typeData[type].puzzleCount = 0; typeData[type].valueSum = 0;})
    
    var categories = {};
    rating.forEach(week => {
      week.details.puzzles.forEach(puzzle => {
      	typeData[puzzle.type].puzzleCount++;
        typeData[puzzle.type].valueSum+=puzzle.value;
        if (typeof categories[typeData[puzzle.type].category] == 'undefined') {
          categories[typeData[puzzle.type].category] = {code: typeData[puzzle.type].category, puzzleCount: 0, valueSum: 0};
        }
        categories[typeData[puzzle.type].category].puzzleCount++;
	categories[typeData[puzzle.type].category].valueSum+=puzzle.value;
      })
    })

    res.render('userstat', {
      user: req.user,
      userId: req.params.userid,
      userName: userName,
      from: from,
      to: to,
      statdata: rating.map(ratingEntry => {
        return {
          date: ratingEntry.date,
          ratingValue: ratingEntry.value,
          weekValue: ratingEntry.details.weekValue,
          missedWeek: ratingEntry.missedWeek
        };
      }),
      categories: Object.keys(categories)
        .map(category => categories[category])
        .filter(category => category.puzzleCount > 0)
        .map(category => {
          return {
            category: category.code,
            performance: category.valueSum / category.puzzleCount,
            count: category.puzzleCount
          };
      }),
      types: Object.keys(typeData)
        .map(type => typeData[type])
        .filter(type => type.puzzleCount > 0)
        .map(type => {
          return {
            category: type.category,
            name: type.name,
            performance: type.valueSum / type.puzzleCount,
            count: type.puzzleCount
          };
      })
    });
    profiler.log('userStatistics', processStart);
  } catch (e) {
    next(e)
  }
});


module.exports = router;
