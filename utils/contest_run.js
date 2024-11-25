const recountContest = require('../utils/contest').recountContest;

const mongoose = require('mongoose');

recount = async function () {
  await recountContest('gh459823vcd65jj');
}

recount().then(() => {
  mongoose.disconnect();
}).catch(err => console.log(err));



