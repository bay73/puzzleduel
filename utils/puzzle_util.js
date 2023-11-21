const PuzzleType = require('../models/PuzzleType');
const UserSolvingTime = require('../models/UserSolvingTime');
const User = require('../models/User');
const cache = require('./cache');

module.exports.timeToString = function(millis) {
  if (!millis) return "";
  var secs = Math.round(millis/1000);
  var mins = Math.trunc(secs/60);
  var hours = Math.trunc(mins/60);
  secs = secs - 60 * mins;
  mins = mins - 60 * hours;
  return (hours > 0 ? (hours + "h ") : "") +
    ((hours > 0 || mins > 0) ? (mins + "m ") : "") +
    (secs + " s");
}

module.exports.bestSolvingTimeMap = async function(includeHidden) {
  var filter = {};
  if (!includeHidden) {
    filter = {
      errCount : 0,
      solvingTime: {$exists: true},
      $or: [
        {hidden: false},
        {hidden: {$exists: false}}
      ]
    }
  }
  const times = await UserSolvingTime.aggregate([{
    $match : filter
  }, {
    $group: {
      _id: "$puzzleId",
      min: { $min: "$solvingTime" }
    }
  }]);
  var timesMap = {};
  times.forEach(time => timesMap[time._id] = time.min);
  return timesMap;
}

module.exports.userSolvingTimeMap = async function(userId, includeHidden) {
  var filter = {};
  if (!includeHidden) {
    filter = {
      userId : userId,
      $or: [
        {hidden: false},
        {hidden: {$exists: false}}
      ]
    }
  } else {
    filter = {
      userId : userId
    }
  }
  const times = await UserSolvingTime.find(filter, "puzzleId solvingTime errCount");
  var timesMap = {};
  times.forEach(time => timesMap[time.puzzleId] = {time: time.solvingTime, errors: time.errCount});
  return timesMap;
}

module.exports.userNameMap = async function() {
  const users = await User.find({}, "_id name");
  var userMap = {};
  users.forEach(user => userMap[user._id] = user.name);
  return userMap;
}

module.exports.isHiddenType = function(type) {
  if (typeof type.properties != "undefined" && typeof type.properties.activationDate != "undefined") {
    return type.properties.activationDate > new Date();
  }
  return false;
}

function processTags(text, dimension) {
  let part = dimension.split("-");
  let dimensions = dimension.split("x");
  let rows = parseInt(dimensions[1]);
  let cols = parseInt(dimensions[0]);
  let quantity = part[1];
  let letters = [];
  if (typeof part[1] != "undefined") {
    for (var i=0;i<part[1].length;i++) {
      letters.push(part[1].charAt(i));
    }
  }

  while (text.indexOf('{') >= 0) {
    let open = text.indexOf('{');
    let close = text.indexOf('}');
    let value = eval(text.substring(open + 1, close));
    text = text.substring(0, open) + value + text.substring(close+1);
  }
  return text;
}

module.exports.puzzleToObj = async function(puzzle, locale) {
  if (!puzzle) return null;
  let puzzleObj = puzzle.toObject();
  let type = await PuzzleType.findOne({ code: puzzleObj.type });
  if(type) {
    if (locale != 'en') {
      if (type.translations[locale]) {
        if (type.translations[locale].rules) {
          type.rules = type.translations[locale].rules;
        }
        if (type.translations[locale].gridControl) {
          type.gridControl = type.translations[locale].gridControl;
        }
      }
    }
    type.rules = processTags(type.rules, puzzleObj.dimension);
    type.gridControl = processTags(type.gridControl, puzzleObj.dimension);
    if (type.properties) {
      type.properties = Object.assign({}, type.properties);
      if (type.properties.figuresAttribute) {
        type.properties.figuresAttribute = processTags(type.properties.figuresAttribute, puzzleObj.dimension);
      }
    }
    puzzleObj.type = type.toObject();
  }
  if (puzzleObj.author) {
    puzzleObj.authorId = puzzleObj.author;
    var author = await User.findById(puzzleObj.author, "name");
    puzzleObj.author = author.name;
  }
  return puzzleObj;
}

module.exports.puzzleToPresent = async function(puzzle, locale) {
  if (!puzzle) return null;
  let puzzleObj = Object.assign({}, puzzle);
  let type = Object.assign({}, await cache.readPuzzleType(puzzleObj.type));
  if(type) {
    if (locale != 'en') {
      if (type.translations[locale]) {
        if (type.translations[locale].rules) {
          type.rules = type.translations[locale].rules;
        }
        if (type.translations[locale].gridControl) {
          type.gridControl = type.translations[locale].gridControl;
        }
      }
    }
    type.rules = processTags(type.rules, puzzleObj.dimension);
    type.gridControl = processTags(type.gridControl, puzzleObj.dimension);
    if (type.properties) {
      type.properties = Object.assign({}, type.properties);
      if (type.properties.figuresAttribute) {
        type.properties.figuresAttribute = processTags(type.properties.figuresAttribute, puzzleObj.dimension);
      }
    }
    puzzleObj.type = type;
  }
  if (puzzleObj.author) {
    puzzleObj.authorId = puzzle.author;
    puzzleObj.author = await cache.readUserName(puzzleObj.author);
  }
  if (puzzleObj.contest) {
    let contest = await cache.readContest(puzzleObj.contest.contestId);
    puzzleObj.contest.name = contest.name;
  }
  return puzzleObj;
}

