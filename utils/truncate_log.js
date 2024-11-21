const { UserActionLogOld } = require('../models/UserActionLog');
const { connectDBs } = require('../config/db')

const mongoose = require('mongoose');

truncate = async function () {
  var d = new Date();
  d.setDate(d.getDate()-31)
  result = await UserActionLogOld.deleteMany({date: {$lt: d}});
  console.log(result)
}

truncate().then(() => {
  mongoose.disconnect();
}).catch(err => console.log(err));



