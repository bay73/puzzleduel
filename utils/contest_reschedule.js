const rescheduleOneTimeContest = require('../utils/contest').rescheduleOneTimeContest;
const rescheduleDailyContest = require('../utils/contest').rescheduleDailyContest;
const rescheduleDailyShadowContest = require('../utils/contest').rescheduleDailyShadowContest;

const mongoose = require('mongoose');

require('dotenv').config();

// DB Config
const db = require('../config/keys').mongoURI;

recount = async function () {
  await rescheduleDailyContest('40645j1l9dyfi6u');
}

// Connect to MongoDB
mongoose
  .connect(
    db,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => {
    console.log('MongoDB Connected')
    recount().then(() => {
      mongoose.disconnect();
    });
  })
  .catch(err => console.log(err));



