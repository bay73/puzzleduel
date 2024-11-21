const rescheduleOneTimeContest = require('../utils/contest').rescheduleOneTimeContest;
const rescheduleDailyContest = require('../utils/contest').rescheduleDailyContest;
const rescheduleDailyShadowContest = require('../utils/contest').rescheduleDailyShadowContest;

const mongoose = require('mongoose');

recount = async function () {
  await rescheduleDailyContest('yeurw8yqash');
}

recount().then(() => {
   mongoose.disconnect();
}).catch(err => console.log(err));



