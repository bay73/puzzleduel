const fillReceivers = require('./comments').fillReceivers;

const mongoose = require('mongoose');

fillReceivers().then(() => {
   mongoose.disconnect();
}).catch(err => console.log(err));



