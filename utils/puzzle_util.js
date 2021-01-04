const PuzzleType = require('../models/PuzzleType');
const UserSolvingTime = require('../models/UserSolvingTime');
const User = require('../models/User');

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

module.exports.typeNameMap = async function() {
  const types = await PuzzleType.find({}, "code name");
  var typeMap = {};
  types.forEach(type => typeMap[type.code] = type.name);
  return typeMap;
}

module.exports.userNameMap = async function() {
  const users = await User.find({}, "_id name");
  var userMap = {};
  users.forEach(user => userMap[user._id] = user.name);
  return userMap;
}

module.exports.typeDataMap = async function() {
  const types = await PuzzleType.find({});
  var typeMap = {};
  types.forEach(type => typeMap[type.code] = type.toObject());
  return typeMap;
}

module.exports.isHiddenType = function(type) {
  if (typeof type.properties != "undefined" && typeof type.properties.activationDate != "undefined") {
    return type.properties.activationDate > new Date();
  }
  return false;
}
