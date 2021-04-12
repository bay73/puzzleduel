const logData = {}


profiler = {
log: function(title, startTime) {
  var duration = new Date().getTime() - startTime;
  if (typeof logData[title] == 'undefined') {
    logData[title] = {
      quantity: 0,
      totalTime: 0,
      maxTime: 0
    }
  }
  logData[title].quantity++;
  logData[title].totalTime += duration;
  logData[title].maxTime = Math.max(logData[title].maxTime, duration);
},
dump: function(dumpFunction) {
  Object.keys(logData).sort().forEach(function (key) {
    if (logData[key].quantity != 0) {
      var avg = Math.round(logData[key].totalTime / logData[key].quantity);
      var max = logData[key].maxTime;
      dumpFunction(key.padEnd(45, '.')
         + ' avg:' + String(avg).padStart(5, ' ')
         + '.... max:' + String(logData[key].maxTime).padStart(6, ' ')
         + '.... count: ' + String(logData[key].quantity).padStart(5, ' '));
    }
  });  

}
}

module.exports = profiler;
