const recountContest = require('../utils/duel').recountContest;

const mongoose = require('mongoose');

recount = async function () {
  result = await recountContest('4064521kovcexz9');
  if (result) {
    setTimeout(run, 30000);
  }
}

recount().then(() => {
   mongoose.disconnect();
}).catch(err => { mongoose.disconnect(); console.log(err);});


