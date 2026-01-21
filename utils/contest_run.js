const recountContest = require('../utils/contest').recountContest;

const mongoose = require('mongoose');

recount = async function () {
  await recountContest('yaj11lr3t8mqt');
}

recount().then(() => {
  mongoose.disconnect();
}).catch(err => console.log(err));



