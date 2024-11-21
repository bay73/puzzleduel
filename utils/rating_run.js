const computeRating = require('../utils/rating');

const mongoose = require('mongoose');

recompute = async function () {
  var d = new Date();
  await computeRating(d);
  d.setDate(d.getDate()+7)
  await computeRating(d);
}

recompute().then(() => {
  mongoose.disconnect();
}).catch(err => console.log(err));



