const express = require('express');
const router = express.Router();
const cache = require('../utils/cache');
const util = require('../utils/puzzle_util');
const leagueSettings = require('../utils/league_settings');

router.use(require('./common.js'));

let convertResults = function(results) {
  return results.map(result => {
    return {
      userId: result.userId,
      userName: result.userName,
      solvedCount: result.solvedCount,
      totalSolvedCount: result.totalSolvedCount,
      totalTime: result.totalTime,
      showTime: util.timeToString(result.totalTime),
    }
  })
}

router.get('/:leagueid/:date', async (req, res, next) => {
  try {
    const processStart = new Date().getTime();
    const leagueId = req.params.leagueid
    const leagueDate = new Date(Date.parse(req.params.date));
    const leagues = await cache.readLeagues(leagueDate)
    const league = leagues[leagueId]
    res.render('league_view', {
      user: req.user,
      code: league.code,
      name: league.name,
      date: req.params.date,
      results: convertResults(league.results)
    })
    profiler.log('league_view', processStart);
  } catch (e) {
    next(e)
  }
});

router.get('/:date', async (req, res, next) => {
  try {
    const processStart = new Date().getTime();
    const leagueDate = new Date(Date.parse(req.params.date));
    const leagues = Object.values(await cache.readLeagues(leagueDate))
    res.render('league_overview', {
      user: req.user,
      date: leagueDate,
      leagues: leagues.map(league => {
        return {code: league.code, name: league.name, results: convertResults(league.results) }
      })
    })
    profiler.log('league_overview', processStart);
  } catch (e) {
    next(e)
  }
});

module.exports = router;
