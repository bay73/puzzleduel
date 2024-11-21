const computeRating = require('../utils/rating');

const mongoose = require('mongoose');

require('dotenv').config();

// DB Config
const db = require('../config/keys').mongoURI;

recompute = async function () {
  var d = new Date();
  await computeRating(d);
  d.setDate(d.getDate()+7)
  await computeRating(d);
}

// Connect to MongoDB
mongoose
  .connect(db)
  .then(() => {
    console.log('MongoDB Connected')
    recompute().then(() => {
      mongoose.disconnect();
    });
  })
  .catch(err => console.log(err));



