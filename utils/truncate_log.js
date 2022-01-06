const UserActionLog = require('../models/UserActionLog');

const mongoose = require('mongoose');

require('dotenv').config();

// DB Config
const db = require('../config/keys').mongoURI;

truncate = async function () {
  var d = new Date();
  d.setDate(d.getDate()-61)
  result = await UserActionLog.deleteMany({date: {$lt: d}});
  console.log(result)
}

// Connect to MongoDB
mongoose
  .connect(
    db,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => {
    console.log('MongoDB Connected')
    truncate().then(() => {
      mongoose.disconnect();
    });
  })
  .catch(err => console.log(err));



