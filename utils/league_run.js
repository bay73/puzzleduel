const createNextMonth = require('../utils/league').createNextMonth;
const recountAllLeagues = require('../utils/league').recountAllLeagues;
const refillLeagues = require('../utils/league').refillLeagues;
const switchUserLeagues = require('../utils/league').switchUserLeagues;

const mongoose = require('mongoose');

require('dotenv').config();

// DB Config
const db = require('../config/keys').mongoURI;

recount = async function () {
  await refillLeagues(new Date());
  await recountAllLeagues(new Date());
  if (new Date().getDate() > 26) {
    const date = new Date();
    date.setMonth(date.getMonth() +1 )
    await createNextMonth(date);
  }
  if (new Date().getDate() < 2) {
    await switchUserLeagues();
  }
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



