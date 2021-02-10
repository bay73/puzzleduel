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
      clues[pos.y][pos.x] = value=="white_circle";
    }
  }
  var lineRes = Checker.buildLine(v, h);
  if (lineRes.status != "OK") {
    return lineRes;
  }
  var res = Checker.checkAllFilled(v, lineRes.line);
  if (res.status != "OK") {
    return res;
  }
  var res = Checker.checkClues(lineRes.line, clues);
  if (res.status != "OK") {
    return res;
  }
  return {status: "OK"};
},
buildLine: function(v, h) {
  var line = [];
  var length = 0;
  line[0] = {x:0, y:0 };
  var prev = {x:0, y:0};
  if (!h[prev.y][prev.x]) {
    return {status: "There should be single loop passing through all cells", errors: [util.coord(prev.x,prev.y)]};
  }
  length = 1;
  line[1] = {x:1, y:0 };
  var current = {x:1, y:0};
  var next = {};
  while (current.x != 0 || current.y != 0) {
    var nextCount = 0;
    if (current.x > 0 && h[current.y][current.x-1] && (current.x-1 != prev.x || current.y != prev.y)) {
      nextCount++;
      next = {x: current.x-1, y: current.y};
    }
    if (current.x < h.cols-1 && h[current.y][current.x] && (current.x+1 != prev.x || current.y != prev.y)) {
      nextCount++;
      next = {x: current.x+1, y: current.y};
    }
    if (current.y > 0 && v[current.y-1][current.x] && (current.x != prev.x || current.y-1 != prev.y)) {
      nextCount++;
      next = {x: current.x, y: current.y-1};
    }
    if (current.y < v.rows-1 && v[current.y][current.x] && (current.x != prev.x || current.y+1 != prev.y)) {
      nextCount++;
      next = {x: current.x, y: current.y+1};
    }
    if (nextCount != 1) {
      return {status: "There should be single loop without bifurcations", errors: [util.coord(current.x,current.y)]};
    }
    length++;
    line[length] = {x:next.x, y:next.y};
    prev = current;
    current = next;
  }
  return {status: "OK", line: line};
},
checkAllFilled: function(cells, line) {
  var used = util.create2DArray(cells.rows, cells.cols, false)
  for (var i=0;i<line.length;i++) {
    used[line[i].y][line[i].x] = true;
  }
  for (var y=0;y<used.rows;y++) {
    for (var x=0;x<used.cols;x++) {
      if (!used[y][x]) {
        return {status: "There should be single loop passing through all cells", errors: [util.coord(x, y)]};
      }
    }
  }
  return {status: "OK"};
},
checkClues: function(line, clues) {
  var prevStraight = false;
  var startStraight = 0;
  var currentStraight = 0;
  var prev = 'h';
  for (var i=1;i<line.length-1;i++) {
    var next = (line[i+1].x==line[i].x)?'v':'h';
    var turn = prev!=next;
    if (turn) {
      if (clues[line[i].y][line[i].x]) {
        return {status: "The line should go straight at the cell with circle", errors: [util.coord(line[i].x, line[i].y)]};
      }
    } else {
      if (prevStraight) {
        currentStraight++;
        if (clues[line[i].y][line[i].x] && currentStraight != 2 || 
            !clues[line[i].y][line[i].x] && currentStraight > 1) {
          return {status: "Every second straight segment of the line should be marked", errors: [util.coord(line[i].x, line[i].y)]};
        }
        if (clues[line[i].y][line[i].x]) {
          currentStraight = 0;
          prevStraight = true;
        }
      } else {
        if (clues[line[i].y][line[i].x] && currentStraight != 2) {
          currentStraight = 0;
          prevStraight = true;
        } else {
          startStraight++;
        }
      }
    }
    prev = next;
  }
  if (startStraight + currentStraight != 1) {
    return {status: "Every second straight segment of the line should be marked", errors: [util.coord(line[0].x, line[0].y)]};
  }
  return {status: "OK"};
},
};

module.exports = Checker;
