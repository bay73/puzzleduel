const express = require('express');
const router = express.Router();
const util = require('../utils/puzzle_util');
const Rating = require('../models/Rating');
const User = require('../models/User');

router.get('/:userid',
  async (req, res, next) => {
  try {
    var typeData = await util.typeDataMap();
    Object.keys(typeData).forEach(type => {typeData[type].puzzleCount = 0; typeData[type].valueSum = 0;})

    const user = await User.findOne({_id: req.params.userid});

    const rating = await Rating.find({userId: req.params.userid});
    
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
      userName: user.name,
      statdata: rating.map(ratingEntry => {
        return {
          date: ratingEntry.date,
          ratingValue: ratingEntry.value,
          weekValue: ratingEntry.details.weekValue
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
  } catch (e) {
    next(e)
  }
});


module.exports = router;
