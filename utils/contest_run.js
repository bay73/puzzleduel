const recountContest = require('../utils/contest').recountContest;

const mongoose = require('mongoose');

recount = async function () {
  await recountContest('lrtz8fw4j8fcaqmy1');
}

recount().then(() => {
  mongoose.disconnect();
}).catch(err => console.log(err));



