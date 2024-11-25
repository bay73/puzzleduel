const recountContest = require('../utils/contest');

const mongoose = require('mongoose');

const User = require('../models/User');
const Puzzle = require('../models/Puzzle');
const { UserActionLog } = require('../models/UserActionLog');
const UserSolvingTime = require('../models/UserSolvingTime');

refill = async function () {
  var userMap = {}
  var userData = await User.find();
  userData.forEach(user => userMap[user._id] = user.name);

  const puzzles = await Puzzle.find({}, "-data");
  for(var i=0;i<puzzles.length;i++) {
    var puzzle = puzzles[i];
    const finished = await UserActionLog.find({puzzleId: puzzle.code, action: "solved"}, "userId").distinct("userId");
    var notFinished = await UserActionLog.find({puzzleId: puzzle.code, userId: {$nin: finished}}, "userId").distinct("userId");
    var notFinished1 = await UserSolvingTime.find({puzzleId: puzzle.code, solvingTime: {$exists: false}}, "userId").distinct("userId");
    notFinished1 = notFinished1.map(userId => userId+"");
    notFinished = notFinished.map(userId => userId+"");
    let difference = notFinished.filter(x => !notFinished1.includes(x));
    console.log(puzzle.code + " -> " + difference.length);
    for (var j=0;j<difference.length;j++){
      const newUserSolvingTime = new UserSolvingTime({
        userId: difference[j],
        userName: userMap[difference[j]],
        puzzleId: puzzle.code,
        errCount: 0
      });
      await newUserSolvingTime.save();
    }
  }
}

refill().then(() => {
  mongoose.disconnect();
}).catch(err => console.log(err));



