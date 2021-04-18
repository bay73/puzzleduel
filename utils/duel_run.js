const recountContest = require('../utils/duel').recountContest;

const mongoose = require('mongoose');

require('dotenv').config();

// DB Config
const db = require('../config/keys').mongoURI;

recount = async function () {
  result = await recountContest('40645v1knnk0dug');
  if (result) {
    setTimeout(run, 30000);
  }
}

function run() {
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
    .catch(err => { mongoose.disconnect(); console.log(err);});
}

run();


