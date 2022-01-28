const Contest = require('../models/Contest');
const Puzzle = require('../models/Puzzle');
const PuzzleType = require('../models/PuzzleType');
const Rating = require('../models/Rating');
const User = require('../models/User');
const UserSolvingTime = require('../models/UserSolvingTime');
const PuzzleComment = require('../models/PuzzleComment');

const CONTEST_CACHE_TTL = 10*1000; // 10 seconds
const PUZZLETYPE_CACHE_TTL = 60*60*1000; // 1 hour
const PUZZLE_CACHE_TTL = 60*60*1000; // 1 hour
const RATING_CACHE_TTL = 60*60*1000; // 1 hour
const USER_CACHE_TTL = 60*60*1000; // 1 hour
const SOLVINGTIME_CACHE_TTL = 20*1000; // 20 seconds
const COMMENTER_CACHE_TTL = 60*60*1000; // 1 hour

const contestCache = {}
const puzzleTypeCache = {fresheness: undefined, puzzleTypes: {}}
const puzzleCache = {}
const ratingCache = {}
const monthlyRatingChangeCache = {};
const monthlyCommentersCache = {};
const userCache = {}
const solvingTimeCache = {}

module.exports.readContest = async function(contestId) {
  const currentTime = new Date().getTime();
  if (typeof contestCache[contestId]=='undefined' || currentTime > contestCache[contestId].fresheness) {
    const contest = await Contest.findOne({code: contestId}).lean();
    contestCache[contestId] = {contest: contest, fresheness: new Date().getTime() + CONTEST_CACHE_TTL};
  }
  return contestCache[contestId].contest;
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
    var endOfHour = new Date();
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
  return puzzleObj;
}

var readPuzzleFromDb = async function(cacheId, condition) {
  const puzzle = await Puzzle.findOne(condition);
  const puzzleObj = puzzleToObj(puzzle);
  var fresheness = new Date().getTime() + PUZZLE_CACHE_TTL;
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
  monthBegin = new Date(date.getFullYear(), date.getMonth(), 3);
  const currentTime = new Date().getTime();
  if (typeof monthlyRatingChangeCache[monthBegin]=='undefined' || currentTime > monthlyRatingChangeCache[monthBegin].fresheness) {
    monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 2);
    const ratingList = await Rating.find({date: {$gt: monthBegin, $lte: monthEnd}, ratingWeek: {$gte: 4}}).lean();
    ratingChanges = {};
    ratingList.forEach(function(rating) {
      if (typeof ratingChanges[rating.userId]=="undefined") {
        ratingChanges[rating.userId] = {userName: rating.userName, change: rating.change};
      } else {
        ratingChanges[rating.userId].change += rating.change;
      }
    })
    var changeList = Object.keys(ratingChanges).map(function(key){
      return {userId: key, userName: ratingChanges[key].userName, change: ratingChanges[key].change};
    })
    monthlyRatingChangeCache[monthBegin] = {changeList: changeList, fresheness: new Date().getTime() + RATING_CACHE_TTL};
  }
  return monthlyRatingChangeCache[monthBegin].changeList;
}

module.exports.readMonthlyCommenters = async function(date) {
  monthBegin = new Date(date.getFullYear(), date.getMonth(), 1);
  const currentTime = new Date().getTime();
  if (typeof monthlyCommentersCache[monthBegin]=='undefined' || currentTime > monthlyCommentersCache[monthBegin].fresheness) {
    monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    const commentList = await PuzzleComment.find({date: {$gt: monthBegin, $lte: monthEnd}, comment: {$exists : true, $ne : ""}}).lean();
    comments = {};
    commentList.forEach(function(comment) {
      if (typeof comments[comment.userId]=="undefined") {
        comments[comment.userId] = {userName: comment.userName, commentCount: 1};
      } else {
        comments[comment.userId].commentCount++;
      }
    })
    var commenters = Object.keys(comments).map(function(key){
      return {userId: key, userName: comments[key].userName, commentCount: comments[key].commentCount};
    })
    monthlyCommentersCache[monthBegin] = {commenters: commenters, fresheness: new Date().getTime() + COMMENTER_CACHE_TTL};
  }
  return monthlyCommentersCache[monthBegin].commenters;
}

module.exports.clearCache = function() {
  Object.keys(contestCache).forEach(function(key) { delete contestCache[key]; });
  Object.keys(puzzleCache).forEach(function(key) { delete puzzleCache[key]; });
  Object.keys(ratingCache).forEach(function(key) { delete ratingCache[key]; });
  Object.keys(userCache).forEach(function(key) { delete userCache[key]; });
  Object.keys(solvingTimeCache).forEach(function(key) { delete solvingTimeCache[key]; });
  puzzleTypeCache.fresheness = undefined;
}

module.exports.printCache = function() {
  console.log(new Date().getTime());
  console.log("contests:");
  Object.keys(contestCache).forEach(function(key) { console.log(key, contestCache[key].fresheness);});
  console.log("puzzles:");
  Object.keys(puzzleCache).forEach(function(key) { console.log(key, puzzleCache[key].fresheness); });
  console.log("ratings:");
  Object.keys(ratingCache).forEach(function(key) { console.log(key, ratingCache[key].fresheness); });
  console.log("users:");
  Object.keys(userCache).forEach(function(key) { console.log(key, userCache[key].fresheness);; });
  console.log("solvingTimes:");
  Object.keys(solvingTimeCache).forEach(function(key) { console.log(key, solvingTimeCache[key].fresheness);; });
}

