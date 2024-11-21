const createNextMonth = require('../utils/league').createNextMonth;
const recountAllLeagues = require('../utils/league').recountAllLeagues;
const refillLeagues = require('../utils/league').refillLeagues;
const switchUserLeagues = require('../utils/league').switchUserLeagues;

const mongoose = require('mongoose');

recount = async function () {
  if (new Date().getDate() < 2) {
    await createNextMonth(new Date());
    await switchUserLeagues();
  }
  await refillLeagues(new Date());
  await recountAllLeagues(new Date());
  if (new Date().getDate() > 26) {
    const date = new Date();
    date.setMonth(date.getMonth() + 1)
    await createNextMonth(date);
  }
}

recount().then(() => {
  mongoose.disconnect();
}).catch(err => console.log(err));



