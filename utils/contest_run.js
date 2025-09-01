const recountContest = require('../utils/contest').recountContest;

const mongoose = require('mongoose');

recount = async function () {
  await recountContest('sringriaiujamsa');
}

recount().then(() => {
  mongoose.disconnect();
}).catch(err => console.log(err));



