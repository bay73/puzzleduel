const fillReceivers = require('./comments').fillReceivers;

const mongoose = require('mongoose');

require('dotenv').config();

// DB Config
const db = require('../config/keys').mongoURI;

recount = async function () {
  await fillReceivers();
}

// Connect to MongoDB
mongoose
  .connect(db)
  .then(() => {
    console.log('MongoDB Connected')
    recount().then(() => {
      mongoose.disconnect();
    });
  })
  .catch(err => console.log(err));



