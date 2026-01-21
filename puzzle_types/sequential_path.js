if (typeof util=="undefined") {
  var util = require('./util');
}

const Checker = {
check:function(dimension, clueData, data){
  // Create array
  var dim = util.parseDimension(dimension);
  var v = util.create2DArray(dim.rows, dim.cols, false)
  var h = util.create2DArray(dim.rows, dim.cols, false)
  var clues = util.create2DArray(dim.rows, dim.cols, false)

  // Parse data.
  for (var [key, value] of Object.entries(data)) {
    if (key=='connectors') {
      for (var [cKey, cValue] of Object.entries(value)) {
        if (cValue=='1') {
          var part = cKey.split("-");
          var pos = util.parseCoord(part[0]);
          if (part[1]=="v") {
            v[pos.y][pos.x] = true;
          }
          if (part[1]=="h") {
            h[pos.y][pos.x] = true;
          }
        }
      }
    } else {
      var pos = util.parseCoord(key);
      if (v[pos.y]){
        v[pos.y][pos.x] = (value.v=="true");
        h[pos.y][pos.x] = (value.h=="true");
      }
    }
  }
  // Parse clues.
  for (var [key, value] of Object.entries(clueData)) {
    var pos = util.parseCoord(key);
    if (clues[pos.y]){
      clues[pos.y][pos.x] = value;
    }
  }
  return Checker.findLine(clues, v, h);
},
findLine: function(clues, v, h) {
  var used = util.create2DArray(clues.rows, clues.cols, false)
  for (var y=0;y<clues.rows;y++) {
    for (var x=0;x<clues.cols;x++) {
      if (clues[y][x] && clues[y][x]=="1") {
        var res = Checker.buildLine({x:x, y:y}, v, h, clues);
        if (res.status != "OK") {
          return res;
        }
        var lastNumber = 0;
        for (var i=0;i<res.line.length;i++) {
          used[res.line[i].y][res.line[i].x] = true;
          if (clues[res.line[i].y][res.line[i].x]) {
            lastNumber++
            if (clues[res.line[i].y][res.line[i].x] != lastNumber.toString()) {
              return {status: "The line should pass numbered cells in order", errors: [util.coord(res.line[i].x,res.line[i].y)]}
            }
          }
        }
      }
    }
  }
  return Checker.checkAllFilled(used);
},
buildLine: function(start, v, h, clues) {
  var line = [];
  var length = 0;
  var prevDirection = null;
  line[0] = start;
  var prev = {};
  var current = line[0];
  while (true) {
    var nextDirection = null;
    var next = {};
    var nextCount = 0;
    if (current.x > 0 && h[current.y][current.x-1] && (current.x-1 != prev.x || current.y != prev.y)) {
      nextCount++;
      next = {x: current.x-1, y: current.y};
      nextDirection = 'h';
    }
    if (current.x < h.cols-1 && h[current.y][current.x] && (current.x+1 != prev.x || current.y != prev.y)) {
      nextCount++;
      next = {x: current.x+1, y: current.y};
      nextDirection = 'h';
    }
    if (current.y > 0 && v[current.y-1][current.x] && (current.x != prev.x || current.y-1 != prev.y)) {
      nextCount++;
      next = {x: current.x, y: current.y-1};
      nextDirection = 'v';
    }
    if (current.y < v.rows-1 && v[current.y][current.x] && (current.x != prev.x || current.y+1 != prev.y)) {
      nextCount++;
      next = {x: current.x, y: current.y+1};
      nextDirection = 'v';
    }
    if (nextCount > 1) {
      return {status: "There should be single line without bifurcations", errors: [util.coord(current.x,current.y)]};
    }
    if (nextCount < 1) {
      break;
    }
    length++;
    line[length] = {x:next.x, y:next.y};
    prevDirection = nextDirection;
    prev = current;
    current = next;
  }
  return {status: "OK", line: line};
},
checkAllFilled: function(used) {
  for (var y=0;y<used.rows;y++) {
    for (var x=0;x<used.cols;x++) {
      if (!used[y][x]) {
        return {status: "Lines should pass through all cells", errors: [util.coord(x, y)]};
      }
    }
  }
  return {status: "OK"};
},
};

module.exports = Checker;
