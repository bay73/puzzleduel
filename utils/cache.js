const Contest = require('../models/Contest');
const Puzzle = require('../models/Puzzle');
const PuzzleType = require('../models/PuzzleType');
const Rating = require('../models/Rating');

const CONTEST_CACHE_TTL = 20*1000; // 20 seconds
const PUZZLETYPE_CACHE_TTL = 60*60*1000; // 1 hour
const PUZZLE_CACHE_TTL = 60*60*1000; // 1 hour
const RATING_CACHE_TTL = 60*60*1000; // 1 hour
const USER_CACHE_TTL = 60*60*1000; // 1 hour

const contestCache = {}
const puzzleTypeCache = {fresheness: undefined, puzzleTypes: {}}
const puzzleCache = {}
const ratingCache = {}
const userCache = {}

module.exports.readContest = async function(contestId) {
  const currentTime = new Date().getTime();
  if (typeof contestCache[contestId]=='undefined' || currentTime > contestCache[contestId].fresheness) {
    const contest = await Contest.findOne({code: contestId}).lean();
    contestCache[contestId] = {contest: contest, fresheness: new Date().getTime() + CONTEST_CACHE_TTL};
  }
  return contestCache[contestId].contest;
}

module.exports.readPuzzle = async function(puzzleId) {
  const currentTime = new Date().getTime();
  if (typeof puzzleCache[puzzleId]=='undefined' || currentTime > puzzleCache[puzzleId].fresheness) {
    const puzzle = await Puzzle.findOne({code: puzzleId});
    const puzzleObj = puzzle.toObject();
    puzzleObj.needLogging = puzzle.needLogging;
    puzzleObj.hidden = puzzle.hidden;
    puzzleObj.hiddenScore = puzzle.hiddenScore;
    puzzleObj.published = puzzle.published;
    puzzleCache[puzzleId] = {puzzle: puzzleObj, fresheness: new Date().getTime() + PUZZLE_CACHE_TTL};
  }
  return puzzleCache[puzzleId].puzzle;
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

