const util = require('./util');

const Checker = {
check:function(dimension, clueData, data){
  // Create array
  var dim = util.parseDimension(dimension);
  var v = util.create2DArray(dim.rows, dim.cols, false)
  var h = util.create2DArray(dim.rows, dim.cols, false)
  var clues = util.create2DArray(dim.rows, dim.cols, false)

  // Parse data.
  for (var [key, value] of Object.entries(data)) {
    var pos = util.parseCoord(key);
    if (v[pos.y]){
      v[pos.y][pos.x] = (value.v=="true");
      h[pos.y][pos.x] = (value.h=="true");
    }
  }
  // Parse clues.
  for (var [key, value] of Object.entries(clueData)) {
    var pos = util.parseCoord(key);
    if (clues[pos.y]){
      clues[pos.y][pos.x] = value;
    }
  }
  return Checker.buildLines(clues, v, h);
},
buildLines: function(clues, v, h) {
  var used = util.create2DArray(clues.rows, clues.cols, false)
  var phones = util.create2DArray(clues.rows, clues.cols, "")
  for (var y=0;y<clues.rows;y++) {
    for (var x=0;x<clues.cols;x++) {
      if (clues[y][x] && (clues[y][x].startsWith("white_") || clues[y][x].startsWith("black_"))) {
        var res = Checker.buildLine({x:x, y:y}, v, h, clues);
        if (res.status != "OK") {
          return res;
        }
        var endX = res.line[res.line.length - 1].x;
        var endY = res.line[res.line.length - 1].y;
        if (clues[y][x].startsWith("white_") ){
          if (phones[endY][endX].includes("w")) {
            return {status: "Each phone should be connected to one white circle", errors: [util.coord(endX,endY)]};
          } else {
            phones[endY][endX] = phones[endY][endX].concat("w");
          }
        }
        if (clues[y][x].startsWith("black_") ){
          if (phones[endY][endX].includes("b")) {
            return {status: "Each phone should be connected to one black circle", errors: [util.coord(endX,endY)]};
          } else {
            phones[endY][endX] = phones[endY][endX].concat("b");
          }
        }
        if (clues[y][x].substring(6) != "circle") {
          if (res.turns.toString() != clues[y][x].substring(6)) {
            return {status: "The line should have " + clues[y][x].substring(6) + " turns", errors: [util.coord(x,y)]};
          }
        }
        for (var i=0;i<res.line.length;i++) {
          used[res.line[i].y][res.line[i].x] = true;
        }
      }
    }
  }
  return Checker.checkAllFilled(used);
},
buildLine: function(start, v, h, clues) {
  var line = [];
  var length = 0;
  var turns = 0;
  var prevDirection = null;
  line[0] = start;
  var prev = {};
  var current = line[0];
  while (clues[current.y][current.x]!= "phone") {
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
      return {status: "There should be single loop without bifurcations", errors: [util.coord(current.x,current.y)]};
    }
    if (nextCount < 1) {
      return {status: "Each circle should be connected to a phone", errors: [util.coord(start.x,start.y)]};
    }
    length++;
    line[length] = {x:next.x, y:next.y};
    if (prevDirection && prevDirection != nextDirection) {
      turns++;
    }
    prevDirection = nextDirection;
    prev = current;
    current = next;
  }
  return {status: "OK", line: line, turns: turns};
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
