const rescheduleDuel = require('../utils/duel').rescheduleDuel;

const mongoose = require('mongoose');

recount = async function () {
  await rescheduleDuel('4064521kovcexz9');
}

// Connect to MongoDB
recount().then(() => {
  mongoose.disconnect();
}).catch(err => console.log(err));



