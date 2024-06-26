const UserActionLog = require('../models/UserActionLog');

const mongoose = require('mongoose');

require('dotenv').config();

// DB Config
const db = require('../config/keys').mongoURI;

truncate = async function () {
  var d = new Date();
  d.setDate(d.getDate()-31)
  result = await UserActionLog.deleteMany({date: {$lt: d}});
  console.log(result)
}

// Connect to MongoDB
mongoose
  .connect(db)
  .then(() => {
    console.log('MongoDB Connected')
    truncate().then(() => {
      mongoose.disconnect();
    });
  })
  .catch(err => console.log(err));



