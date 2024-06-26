const Contest = require('../models/Contest');
const Puzzle = require('../models/Puzzle');
const PuzzleType = require('../models/PuzzleType');
const Rating = require('../models/Rating');
const User = require('../models/User');
const UserSolvingTime = require('../models/UserSolvingTime');
const PuzzleComment = require('../models/PuzzleComment');
const League = require('../models/League');
const Announcement = require('../models/Announcement');
const sizeof = require('object-sizeof');

const CONTEST_NAME_CACHE_TTL = 10*60*60*1000; // 10 hours
const CONTEST_CACHE_TTL = 10*60*1000; // 10 minutes
const PUZZLETYPE_CACHE_TTL = 10*60*60*1000; // 10 hours
const PUZZLE_CACHE_TTL = 60*60*1000; // 1 hour
const RATING_CACHE_TTL = 60*60*1000; // 1 hour
const USER_CACHE_TTL = 60*60*1000; // 1 hour
const SOLVINGTIME_CACHE_TTL = 20*1000; // 20 seconds
const COMMENTER_CACHE_TTL = 60*60*1000; // 1 hour
const LEAGUE_CACHE_TTL = 10*60*1000; // 10 minutes
const ANNOUNCEMENTS_CACHE_TTL = 10*60*60*1000; // 10 hours

const contestCache = {}
const contestNameCache = {fresheness: undefined, contestNames: {}}
const puzzleTypeCache = {fresheness: undefined, puzzleTypes: {}}
const puzzleCache = {}
const puzzlesCache = {fresheness: undefined, puzzles: {}}
const ratingCache = {}
const monthlyRatingChangeCache = {};
const monthlyCommentersCache = {};
const userCache = {}
const userLeaguesCache = {fresheness: undefined, leagues: {}}
const solvingTimeCache = {}
const leagueCache = {}
const announcementsCache = {fresheness: undefined, puzzleTypes: {}}

module.exports.readContest = async function(contestId) {
  const currentTime = new Date().getTime();
  if (typeof contestCache[contestId]=='undefined' || currentTime > contestCache[contestId].fresheness) {
    const contest = await Contest.findOne({code: contestId}).lean();
    contestCache[contestId] = {contest: contest, fresheness: new Date().getTime() + CONTEST_CACHE_TTL};
  }
  return contestCache[contestId].contest;
}

module.exports.readContestNames = async function() {
  const currentTime = new Date().getTime();
  if (typeof contestNameCache.fresheness=='undefined' || currentTime > contestNameCache.fresheness) {
    const contests = await Contest.find({}, "code name").lean();
    contests.forEach(contest => contestNameCache.contestNames[contest.code] = contest.name);
    contestNameCache.fresheness = new Date().getTime() + CONTEST_NAME_CACHE_TTL;
  }
  return contestNameCache.contestNames;
}

module.exports.readContestName = async function(contestId) {
  const names = await module.exports.readContestNames();
  return names[contestId];
}

module.exports.refreshContest = async function(contestId) {
  const contest = await Contest.findOne({code: contestId}).lean();
  contestCache[contestId] = {contest: contest, fresheness: new Date().getTime() + CONTEST_CACHE_TTL};
  return contestCache[contestId].contest;
}

module.exports.readDailyShadowContest = async function() {
  const currentTime = new Date().getTime();
  if (typeof contestCache["_daily"]=='undefined' || currentTime > contestCache["_daily"].fresheness) {
    const datetime = new Date();
    const contest = await Contest.findOne({type: "daily_shadow", start: {$lt: datetime}, finish: {$gt: datetime} }, "code name puzzles");
    const endOfHour = new Date();
    endOfHour.setMinutes(59,59,999);
    contestCache["_daily"] = {contest: contest, fresheness: endOfHour.getTime()};
  }
  return contestCache["_daily"].contest;
}

var puzzleToObj = function(puzzle) {
  const puzzleObj = puzzle.toObject();
  puzzleObj.needLogging = puzzle.needLogging;
  puzzleObj.hidden = puzzle.hidden;
  puzzleObj.hiddenScore = puzzle.hiddenScore;
  puzzleObj.published = puzzle.published;
  puzzleObj.changeDate = puzzle.changeDate;
  puzzleObj.publishDate = puzzle.publishDate;
  return puzzleObj;
}

var readPuzzleFromDb = async function(cacheId, condition) {
  const puzzle = await Puzzle.findOne(condition);
  const puzzleObj = puzzleToObj(puzzle);
  let fresheness = new Date().getTime() + PUZZLE_CACHE_TTL;
  if (puzzleObj.changeDate && puzzleObj.changeDate.getTime() > new Date().getTime() && puzzleObj.changeDate.getTime() < fresheness) {
    fresheness = puzzleObj.changeDate.getTime()
  }
  puzzleCache[cacheId] = {puzzle: puzzleObj, fresheness: fresheness};
  return puzzleCache[cacheId].puzzle;
}

module.exports.refreshPuzzle = async function(puzzleId) {
  return await readPuzzleFromDb(puzzleId, {code: puzzleId});
}

module.exports.readPuzzle = async function(puzzleId) {
  const currentTime = new Date().getTime();
  if (typeof puzzleCache[puzzleId]=='undefined' || currentTime > puzzleCache[puzzleId].fresheness) {
    await readPuzzleFromDb(puzzleId, {code: puzzleId});
  }
  return puzzleCache[puzzleId].puzzle;
}

module.exports.readPuzzleByDate = async function(date) {
  const currentTime = new Date().getTime();
  if (typeof puzzleCache[date]=='undefined' || currentTime > puzzleCache[date].fresheness) {
    await readPuzzleFromDb(date, {daily: date})
  }
  return puzzleCache[date].puzzle;
}

module.exports.readPuzzleTypes = async function() {
  const currentTime = new Date().getTime();
  if (typeof puzzleTypeCache.fresheness=='undefined' || currentTime > puzzleTypeCache.fresheness) {
    const puzzleTypes = await PuzzleType.find().lean();
    puzzleTypes.forEach(type => puzzleTypeCache.puzzleTypes[type.code] = type);
    puzzleTypeCache.fresheness = new Date().getTime() + PUZZLETYPE_CACHE_TTL;
  }
  return puzzleTypeCache.puzzleTypes;
}

module.exports.readAllPuzzles = async function() {
  const currentTime = new Date().getTime();
  if (typeof puzzlesCache.fresheness=='undefined' || currentTime > puzzlesCache.fresheness) {
    const puzzles = await Puzzle.find({}, "-data");
    puzzlesCache.puzzles = puzzles
    puzzlesCache.fresheness = new Date().getTime() + PUZZLE_CACHE_TTL;
  }
  return puzzlesCache.puzzles;
}

module.exports.readPuzzleType = async function(puzzleTypeId) {
  const types = await module.exports.readPuzzleTypes();
  return types[puzzleTypeId];
}

module.exports.readRating = async function(ratingDate) {
  const currentTime = new Date().getTime();
  if (typeof ratingCache[ratingDate]=='undefined' || currentTime > ratingCache[ratingDate].fresheness) {
    const ratingList = await Rating.find({date: ratingDate}).lean();
    ratingCache[ratingDate] = {ratingList: ratingList, fresheness: new Date().getTime() + RATING_CACHE_TTL};
  }
  return ratingCache[ratingDate].ratingList;
}

module.exports.readLeagues = async function(leagueDate) {
  var leagueStartDate = new Date(Date.parse(leagueDate));
  leagueStartDate.setUTCHours(0,0,0,0);
  leagueStartDate.setUTCDate(1)
  const currentTime = new Date().getTime();
  const key = leagueStartDate
  if (typeof leagueCache[key]=='undefined' || currentTime > leagueCache[key].fresheness) {
    const leagues = await League.find({start: leagueStartDate}).lean();
    const leaguesMap = {}
    leagues.forEach(league => leaguesMap[league.code] = league)
    leagueCache[key] = {leagues: leaguesMap, fresheness: new Date().getTime() + LEAGUE_CACHE_TTL};
  }
  return leagueCache[key].leagues;
}

module.exports.readUserName = async function(userId) {
  const currentTime = new Date().getTime();
  if (typeof userCache[userId]=='undefined' || currentTime > userCache[userId].fresheness) {
    const user = await User.findById(userId, "name").lean();
    if (user) {
      userCache[userId] = {userName: user.name, fresheness: new Date().getTime() + USER_CACHE_TTL};
    }
  }
  return userCache[userId].userName;
}

module.exports.readUserLeagues = async function() {
  const currentTime = new Date().getTime();
  if (typeof userLeaguesCache.fresheness=='undefined' || currentTime > userLeaguesCache.fresheness) {
    const userLeagues = await User.find().lean();
    userLeagues.forEach(user => userLeaguesCache.leagues[user._id] = user.league);
    userLeaguesCache.fresheness = new Date().getTime() + USER_CACHE_TTL;
  }
  return userLeaguesCache.leagues;
}

module.exports.readSolvingTime = async function(puzzleId) {
  const currentTime = new Date().getTime();
  if (typeof solvingTimeCache[puzzleId]=='undefined' || currentTime > solvingTimeCache[puzzleId].fresheness) {
    const times = await UserSolvingTime.find({
      puzzleId: puzzleId,
      $or: [
        {hidden: false},
        {hidden: {$exists: false}}
      ]
    }).lean();
    solvingTimeCache[puzzleId] = {times: times, fresheness: new Date().getTime() + SOLVINGTIME_CACHE_TTL};
  }
  return solvingTimeCache[puzzleId].times;
}

module.exports.readMonthlyRatingChange = async function(date) {
  const monthBegin = new Date(date.getFullYear(), date.getMonth(), 3);
  const currentTime = new Date().getTime();
  if (typeof monthlyRatingChangeCache[monthBegin]=='undefined' || currentTime > monthlyRatingChangeCache[monthBegin].fresheness) {
    const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 2);
    const ratingList = await Rating.find({date: {$gt: monthBegin, $lte: monthEnd}, ratingWeek: {$gte: 4}}, "userId userName change").lean();
    const ratingChanges = {};
    ratingList.forEach(function(rating) {
      if (typeof ratingChanges[rating.userId]=="undefined") {
        ratingChanges[rating.userId] = {userName: rating.userName, change: rating.change};
      } else {
        ratingChanges[rating.userId].change += rating.change;
      }
    })
    const changeList = Object.keys(ratingChanges).map(function(key){
      return {userId: key, userName: ratingChanges[key].userName, change: ratingChanges[key].change};
    })
    monthlyRatingChangeCache[monthBegin] = {changeList: changeList, fresheness: new Date().getTime() + RATING_CACHE_TTL};
  }
  return monthlyRatingChangeCache[monthBegin].changeList;
}

module.exports.readMonthlyCommenters = async function(date) {
  const monthBegin = new Date(date.getFullYear(), date.getMonth(), 1);
  const currentTime = new Date().getTime();
  if (typeof monthlyCommentersCache[monthBegin]=='undefined' || currentTime > monthlyCommentersCache[monthBegin].fresheness) {
    const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    const commentList = await PuzzleComment.find({date: {$gt: monthBegin, $lte: monthEnd}, comment: {$exists : true, $ne : ""}}).lean();
    const comments = {};
    commentList.forEach(function(comment) {
      if (typeof comments[comment.userId]=="undefined") {
        comments[comment.userId] = {userName: comment.userName, commentCount: 1};
      } else {
        comments[comment.userId].commentCount++;
      }
    })
    const commenters = Object.keys(comments).map(function(key){
      return {userId: key, userName: comments[key].userName, commentCount: comments[key].commentCount};
    })
    monthlyCommentersCache[monthBegin] = {commenters: commenters, fresheness: new Date().getTime() + COMMENTER_CACHE_TTL};
  }
  return monthlyCommentersCache[monthBegin].commenters;
}

module.exports.readAnnouncements = async function() {
  const currentTime = new Date().getTime();
  if (typeof announcementsCache.fresheness=='undefined' || currentTime > announcementsCache.fresheness) {
    const announcements = await Announcement.find({}).sort({start: -1}).lean();
    announcementsCache.announcements = announcements;
    announcementsCache.fresheness = new Date().getTime() + ANNOUNCEMENTS_CACHE_TTL;
  }
  return announcementsCache.announcements;
}

module.exports.resetCache = function() {
  let deleteAll = function(cache) {
    Object.keys(cache).forEach(function(key) { delete cache[key]; });
  }

  deleteAll(contestCache);
  contestNameCache.fresheness = undefined;
  puzzleTypeCache.fresheness = undefined;
  puzzlesCache.fresheness = undefined;
  deleteAll(puzzleCache);
  deleteAll(ratingCache);
  deleteAll(monthlyRatingChangeCache);
  deleteAll(monthlyCommentersCache);
  deleteAll(userCache);
  userLeaguesCache.fresheness = undefined;
  deleteAll(solvingTimeCache);
  deleteAll(leagueCache);
  announcementsCache.fresheness = undefined;
}

module.exports.clearOutdatedCache = function() {
  const currentTime = new Date().getTime();
  let deleteOtdatedKeys = function(cache) {
    Object.keys(cache).forEach(function(key) { if (cache[key].fresheness < currentTime) { delete cache[key]; }});
  }
  deleteOtdatedKeys(contestCache);
  deleteOtdatedKeys(puzzleCache);
  deleteOtdatedKeys(ratingCache);
  deleteOtdatedKeys(monthlyRatingChangeCache);
  deleteOtdatedKeys(monthlyCommentersCache);
  deleteOtdatedKeys(userCache);
  deleteOtdatedKeys(solvingTimeCache);
  deleteOtdatedKeys(leagueCache);
}

printedSizeOf = function(object) {
  return  String(Math.round( sizeof(object)/ 1024)).padStart(6, ' ') + " kB"
}

module.exports.printCacheSize = function() {
  console.log("contests:     " + printedSizeOf(contestCache));
  console.log("contestNames: " + printedSizeOf(contestNameCache));
  console.log("puzzlesTypes: " + printedSizeOf(puzzleTypeCache));
  console.log("puzzles:      " + printedSizeOf(puzzlesCache));
  console.log("puzzleData:   " + printedSizeOf(puzzleCache));
  console.log("ratings:      " + printedSizeOf(ratingCache));
  console.log("ratingChange: " + printedSizeOf(monthlyRatingChangeCache));
  console.log("commenters:   " + printedSizeOf(monthlyCommentersCache));
  console.log("users:        " + printedSizeOf(userCache));
  console.log("userLeagues:  " + printedSizeOf(userLeaguesCache));
  console.log("solvingTimes: " + printedSizeOf(solvingTimeCache));
  console.log("leagues:      " + printedSizeOf(leagueCache));
  console.log("announcement: " + printedSizeOf(announcementsCache));
}

module.exports.printCache = function() {
  console.log(new Date().getTime());
  console.log("contests:");
  Object.keys(contestCache).forEach(function(key) { console.log(key, contestCache[key].fresheness);});
  console.log("contestNames:");
  console.log(contestNameCache.fresheness);
  console.log("puzzlesTypes:");
  console.log(puzzleTypeCache.fresheness);
  console.log("puzzles:");
  console.log(puzzlesCache.fresheness);
  Object.keys(puzzleCache).forEach(function(key) { console.log(key, puzzleCache[key].fresheness); });
  console.log("ratings:");
  Object.keys(ratingCache).forEach(function(key) { console.log(key, ratingCache[key].fresheness); });
  console.log("ratingChanges:");
  Object.keys(monthlyRatingChangeCache).forEach(function(key) { console.log(key, monthlyRatingChangeCache[key].fresheness); });
  console.log("commenters:");
  Object.keys(monthlyCommentersCache).forEach(function(key) { console.log(key, monthlyCommentersCache[key].fresheness); });
  console.log("users:");
  Object.keys(userCache).forEach(function(key) { console.log(key, userCache[key].fresheness); });
  console.log("userLeagues:");
  console.log(userLeaguesCache.fresheness);
  console.log("solvingTimes:");
  Object.keys(solvingTimeCache).forEach(function(key) { console.log(key, solvingTimeCache[key].fresheness); });
  console.log("leagues:");
  Object.keys(leagueCache).forEach(function(key) { console.log(key, leagueCache[key].fresheness); });
  console.log("announcements:");
  console.log(announcementsCache.fresheness);
}