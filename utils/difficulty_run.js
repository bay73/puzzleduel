const computeDifficulty = require('../utils/difficulty');

const mongoose = require('mongoose');

require('dotenv').config();

// DB Config
const db = require('../config/keys').mongoURI;

recompute = async function () {
  await computeDifficulty();
}

// Connect to MongoDB
mongoose
  .connect(
    db,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => {
    console.log('MongoDB Connected')
    recompute().then(() => {
      mongoose.disconnect();
    });
  })
  .catch(err => console.log(err));



