const express = require('express');
const router = express.Router();
const cache = require('../utils/cache');
const util = require('../utils/puzzle_util');

router.get('/:leagueid/:date', async (req, res, next) => {
  try {
    const processStart = new Date().getTime();
    const leagueId = req.params.leagueid
    const leagueDate = new Date(Date.parse(req.params.date));
    const league = await cache.readLeague(leagueId, leagueDate)
    res.render('league_view', {
      user: req.user,
      name: league.name,
      date: req.params.date,
      results: league.results.map(result => {
        return {
          userId: result.userId,
          userName: result.userName,
          solvedCount: result.solvedCount,
          totalTime: result.totalTime,
          showTime: util.timeToString(result.totalTime),
        }
      })
    })
    profiler.log('league_view', processStart);
  } catch (e) {
    next(e)
  }
});

module.exports = router;
