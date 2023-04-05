const League = require('../models/League');
const Rating = require('../models/Rating');
const Puzzle = require('../models/Puzzle');
const User = require('../models/User');
const UserSolvingTime = require('../models/UserSolvingTime');
const leagueSettings = require('../utils/league_settings')();

async function saveLeague(ids, leagueOrder, leagueStartDate, leagueEndDate, users) {
  console.log(leagueSettings[ids[leagueOrder]].name, users.length)
  var league = new League({
    code: ids[leagueOrder],
    name: leagueSettings[ids[leagueOrder]].name,
    start: leagueStartDate,
    finish: leagueEndDate,
    participants: users
  });
  await league.save();
  for (const item of users) {
    const user = await User.findById(item.userId)
    if (user) {
      user.league = ids[leagueOrder]
      await user.save()
    }
  }
}

async function createFromRating(startDate) {
  await League.deleteMany({})

  let leagueSize = 20
  let leageSizeIncrement = 10
  let ids = []
  Object.entries(leagueSettings).forEach(([key, value]) => ids[value.index-1] = key)

  var leagueStartDate = new Date(Date.parse(startDate));
  leagueStartDate.setUTCHours(0,0,0,0);
  leagueStartDate.setDate(1)
  leagueEndDate = new Date(leagueStartDate)
  leagueEndDate.setMonth(leagueStartDate.getMonth() + 1)

  ratingDate = new Date(leagueStartDate)
  ratingDate.setDate(ratingDate.getDate() - ratingDate.getUTCDay());
  ratingDate.setUTCHours(0,0,0,0);

  const ratingsList = await Rating.find({date: ratingDate}).sort({value: -1})
  const ratings = ratingsList.filter(rating => rating.value > 0 && rating.missedWeek < 3);

  let users = [];
  let leagueOrder = 0;
  for (let i=0; i<ratings.length;i++) {
    users.push({userId: ratings[i].userId, userName: ratings[i].userName})
    if (users.length >= leagueSize) {
      await saveLeague(ids, leagueOrder, leagueStartDate, leagueEndDate, users)
      leagueSize += leageSizeIncrement;
      leagueOrder++;
      users = [];
    }
  }

  await saveLeague(ids, leagueOrder, leagueStartDate, leagueEndDate, users)
}

async function recountLeague(leagueId, startDate) {
  var leagueStartDate = new Date(Date.parse(startDate));
  leagueStartDate.setUTCHours(0,0,0,0);
  leagueStartDate.setDate(1)

  const league = await League.findOne({code: leagueId, start: leagueStartDate})

  if (!league) {
    console.log("League " + leagueId + " not found")
    return;
  }

  const endDate = league.finish > new Date() ? new Date() : league.finish;
  const puzzles = await Puzzle.find({daily: {$gte: league.start, $lt: endDate}});
  const puzzleIds = puzzles.map(puzzle => puzzle.code);
  const results = []
  for (let i = 0; i < league.participants.length; i++) {
    const participant = league.participants[i];
    const times = await UserSolvingTime.find({userId: participant.userId, puzzleId: {$in: puzzleIds}, date: {$lt: endDate}})
    const result = {userId: participant.userId, userName: participant.userName, solvedCount: 0, totalSolvedCount: 0, totalTime: 0};
    for (let p = 0; p < times.length; p++) {
      if (times[p].hidden != true && times[p].solvingTime > 0) {
        result.totalTime += times[p].solvingTime;
        result.totalSolvedCount++;
        if (times[p].errCount == 0) {
          result.solvedCount++;
        }
      }
    }
    results.push(result);
  }
  console.log("League " + leagueId + ". Results for " + results.length + " user found!")
  league.results = results;
  await league.save()
}

async function recountAllLeagues(startDate) {
  var leagueStartDate = new Date(Date.parse(startDate));
  leagueStartDate.setUTCHours(0,0,0,0);
  leagueStartDate.setDate(1)

  const leagues= await League.find({start: leagueStartDate})

  for (let i=0; i<leagues.length; i++) {
    await recountLeague(leagues[i].code, leagueStartDate)
  }
}

async function refillLeagues(date) {
  var leagueStartDate = new Date(Date.parse(date));
  leagueStartDate.setUTCHours(0,0,0,0);
  leagueStartDate.setDate(1)
  const allUsers = {}
  const times = await UserSolvingTime.find({date: {$gte: leagueStartDate, $lt: date}, solvingTime: {$gt: 0}})
  times.forEach(time => allUsers[time.userId] = time.userName)
  const leagues= await League.find({start: leagueStartDate})
  leagues.forEach(league => league.participants.forEach(participant => delete allUsers[participant.userId]))
  if (Object.keys(allUsers).length > 0) {
    console.log("Found new users: ")
    console.log(allUsers)
    let lastLeague = leagues[0];
    leagues.forEach(league => {if (leagueSettings[league.code].index > leagueSettings[lastLeague.code].index) {lastLeague = league}})
    console.log("Adding users to " + lastLeague.name)
    Object.entries(allUsers).forEach(([key, value]) => lastLeague.participants.push({userId: key, userName: value}))
    await lastLeague.save()
    for (const key of Object.keys(allUsers)) {
      const user = await User.findById(key)
      if (user) {
        user.league = lastLeague.code
        await user.save()
      }
    }
  } else {
    console.log("No new users found.")
  }
}

module.exports.createFromRating = createFromRating;
module.exports.recountLeague = recountLeague;
module.exports.recountAllLeagues = recountAllLeagues;
module.exports.refillLeagues = refillLeagues;
