const createFromRating = require('../utils/league').createFromRating;
const recountAllLeagues = require('../utils/league').recountAllLeagues;

const mongoose = require('mongoose');

require('dotenv').config();

// DB Config
const db = require('../config/keys').mongoURI;

recount = async function () {
  await recountAllLeagues('2023-03-01');
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



