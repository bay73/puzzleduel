const computeDifficulty = require('../utils/difficulty');

const mongoose = require('mongoose');

recompute = async function () {
  await computeDifficulty();
}

recompute().then(() => {
  mongoose.disconnect();
}).catch(err => console.log(err));



