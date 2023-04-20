const League = require('../models/League');
const Rating = require('../models/Rating');
const Puzzle = require('../models/Puzzle');
const User = require('../models/User');
const UserSolvingTime = require('../models/UserSolvingTime');
const leagueSettings = require('../utils/league_settings')();

async function saveLeague(ids, leagueOrder, leagueStartDate, leagueEndDate, users, updateUsers) {
  console.log(leagueSettings[ids[leagueOrder]].name, users.length)
  var league = new League({
    code: ids[leagueOrder],
    name: leagueSettings[ids[leagueOrder]].name,
    start: leagueStartDate,
    finish: leagueEndDate,
    participants: users
  });
  await league.save();
  if (updateUsers) {
    for (const item of users) {
      const user = await User.findById(item.userId)
      if (user) {
        user.league = ids[leagueOrder]
        await user.save()
      }
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
      await saveLeague(ids, leagueOrder, leagueStartDate, leagueEndDate, users, true)
      leagueSize += leageSizeIncrement;
      leagueOrder++;
      users = [];
    }
  }

  await saveLeague(ids, leagueOrder, leagueStartDate, leagueEndDate, users, true)
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

async function createNextMonth(startDate) {
  let ids = []
  Object.entries(leagueSettings).forEach(([key, value]) => ids[value.index-1] = key)

  var leagueStartDate = new Date(Date.parse(startDate));
  leagueStartDate.setUTCHours(0,0,0,0);
  leagueStartDate.setDate(1)
  leagueEndDate = new Date(leagueStartDate)
  leagueEndDate.setMonth(leagueStartDate.getMonth() + 1)
  previousLeagueStartDate = new Date(leagueStartDate)
  previousLeagueStartDate.setMonth(leagueStartDate.getMonth() - 1)

  if (leagueStartDate < new Date()) {
    console.log("Leagues already started.")
    return;
  }

  await League.deleteMany({start: leagueStartDate})

  let sorting = function(r1, r2) {
    if (r1.solvedCount != r2.solvedCount) return r2.solvedCount - r1.solvedCount;
    if (r1.totalSolvedCount != r2.totalSolvedCount) return r2.totalSolvedCount - r1.totalSolvedCount;
    return r1.totalTime - r2.totalTime;
  }

  let takeFrom = async function (leagueId, fromIndex, toIndex, exclude0) {
    const league = await League.findOne({code: leagueId, start: previousLeagueStartDate})
    if (!league) {
      console.log("League " + ids[leagueOrder] + " not found")
      return [];
    }
    const results = league.results.sort(sorting).slice(fromIndex, toIndex)
    return results
      .filter(result => {if (exclude0) {return result.totalSolvedCount > 0} else {return true}})
      .map(result => {return {userId: result.userId, userName: result.userName}});
  }

  let leagueOrder = 0;
  for (let leagueOrder = 0; leagueOrder < 5; leagueOrder++) {
    let users = [];
    if (leagueOrder > 0) {
      users.push(...await takeFrom(ids[leagueOrder - 1], leagueSettings[ids[leagueOrder - 1]].bottom, undefined, leagueOrder === 4));
      users.push(...await takeFrom(ids[leagueOrder], leagueSettings[ids[leagueOrder]].top, leagueSettings[ids[leagueOrder]].bottom, leagueOrder === 4) );
    } else {
      users.push(...await takeFrom(ids[leagueOrder], 0, leagueSettings[ids[leagueOrder]].bottom, false));
    }

    if (leagueOrder < 4) {
      users.push(...await takeFrom(ids[leagueOrder + 1], 0, leagueSettings[ids[leagueOrder+1]].top, false));
    }
    await saveLeague(ids, leagueOrder, leagueStartDate, leagueEndDate, users, false)
  }
}

async function switchUserLeagues() {
  const date = new Date()
  const leagues= await League.find({start: {$lt: date}, finish: {$gt: date}})
  for (const league of leagues) {
    for (const item of league.participants) {
      const user = await User.findById(item.userId)
      if (user) {
        user.league = league.code
        await user.save()
      }
    }
  }
}

module.exports.recountLeague = recountLeague;
module.exports.recountAllLeagues = recountAllLeagues;
module.exports.refillLeagues = refillLeagues;
module.exports.createNextMonth = createNextMonth;
module.exports.switchUserLeagues = switchUserLeagues;
