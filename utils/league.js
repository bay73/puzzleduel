const League = require('../models/League');
const Rating = require('../models/Rating');
const Puzzle = require('../models/Puzzle');
const UserSolvingTime = require('../models/UserSolvingTime');
const uniqid = require('uniqid');


async function createFromRating(startDate) {
  await League.deleteMany({})
  
  let leagueSize = 20
  let leageSizeIncrement = 10
  let names = ["Red League", "Orange League", "Yellow League", "Green League", "Blue League", "Indigo League", "Violet League"]
  
  var leagueStartDate = new Date(Date.parse(startDate));
  leagueStartDate.setDate(1)
  leagueStartDate.setUTCHours(0,0,0,0);
  leagueEndDate = new Date(leagueStartDate)
  leagueEndDate.setMonth(leagueStartDate.getMonth() + 1)

  ratingDate = new Date(leagueStartDate)
  ratingDate.setDate(ratingDate.getDate() - ratingDate.getUTCDay());
  ratingDate.setUTCHours(0,0,0,0);
  
  console.log("LeagueDates = ",leagueStartDate,leagueEndDate);
  console.log("ratingDates = ",ratingDate);

  const ratingsList = await Rating.find({date: ratingDate}).sort({value: -1})
  const ratings = ratingsList.filter(rating => rating.value > 0 && rating.missedWeek < 3);
  
  let users = [];
  let leagueOrder = 0;
  for (let i=0; i<ratings.length;i++) {
    users.push({userId: ratings[i].userId, userName: ratings[i].userName})
    if (users.length >= leagueSize) {
      let leagueid = uniqid();
      console.log(names[leagueOrder], users.length)
      var league = new League({
        code: leagueid,
        name: names[leagueOrder],
        start: leagueStartDate,
        finish: leagueEndDate,
        participants: users
      });
      await league.save();
      
      leagueSize += leageSizeIncrement;
      leagueOrder++;
      users = [];
    }
  }

  let leagueid = uniqid();
  console.log(names[leagueOrder], users.length)
  var league = new League({
    code: leagueid,
    name: names[leagueOrder],
    start: leagueStartDate,
    finish: leagueEndDate,
    participants: users
  });
  await league.save();
}

async function recountLeague(leagueId, startDate) {
  var leagueStartDate = new Date(Date.parse(startDate));
  leagueStartDate.setDate(1)
  leagueStartDate.setUTCHours(0,0,0,0);
  
  const league = await League.findOne({code: leagueId, start: leagueStartDate})
  
  if (!league) {
    console.log("League not found")
    return;
  }
  
  const endDate = league.finish > new Date() ? new Date() : league.finish;

  const puzzles = await Puzzle.find({daily: {$gte: league.start, $lt: endDate}});
  const puzzleIds = puzzles.map(puzzle => puzzle.code);
  
  const results = []
  for (let i = 0; i < league.participants.length; i++) {
    const participant = league.participants[i];
    const times = await UserSolvingTime.find({userId: participant.userId, puzzleId: {$in: puzzleIds}, date: {$lt: endDate}})
    const result = {userId: participant.userId, userName: participant.userName, solvedCount: 0, totalTime: 0};
    for (let p = 0; p < times.length; p++) {
      if (times[p].hidden != true && times[p].solvingTime > 0) {
        result.totalTime += times[p].solvingTime;
        if (times[p].errCount == 0) {
          result.solvedCount++;
        }
      }
    }
    results.push(result);
  }
  league.results = results;
  await league.save()
}

async function recountAllLeagues(startDate) {
  var leagueStartDate = new Date(Date.parse(startDate));
  leagueStartDate.setDate(1)
  leagueStartDate.setUTCHours(0,0,0,0);

  const leagues= await League.find({start: leagueStartDate})
  
  for (let i=0; i<leagues.length; i++) {
    await recountLeague(leagues[i].code, leagueStartDate)
  }
}

module.exports.createFromRating = createFromRating;
module.exports.recountLeague = recountLeague;
module.exports.recountAllLeagues = recountAllLeagues;
