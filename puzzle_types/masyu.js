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
  var lineRes = Checker.buildLine(v, h);
  if (lineRes.status != "OK") {
    return lineRes;
  }
  var res = Checker.checkClues(lineRes.line, clues, v, h);
  if (res.status != "OK") {
    return res;
  }
  return {status: "OK"};
},
buildLine: function(v, h) {
  var start = Checker.findStart(h);
  if (!start) {
    return {status: "There should be single loop passing through some cells"};
  }
  var line = [];
  line[0] = start;
  line[1] = {x:start.x + 1, y:start.y };
  length = 1;
  var prev = line[0];
  var current = line[1];
  var next = {};
  while (current.x != start.x || current.y != start.y) {
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
  length++;
  line[length] = {x:line[1].x, y:line[1].y};
  length++;
  line[length] = {x:line[2].x, y:line[2].y};
  return {status: "OK", line: line};
},
findStart: function(h) {
  for (var x=0;x < h.cols;x++) {
    for (var y=0;y < h.rows; y++) {
      if (h[y][x]) return {x:x, y:y};
    }
  }
  return null;
},
checkClues: function(line, clues, v, h) {
  var used = util.create2DArray(clues.rows, clues.cols, false)
  var prevTurn = true;
  var prevDirection = 'h';
  var prevClue = null;
  for (var i=1;i<line.length-1;i++) {
    used[line[i].y][line[i].x] = true;
    var direction = (line[i+1].x==line[i].x)?'v':'h';
    var turn = prevDirection!=direction;

    if (prevClue == "white_circle") {
      if (!turn) {
        return {status: "Loop should turn next to the white circle", errors: [util.coord(line[i-1].x,line[i-1].y)]};
      }
    }
    if (prevClue == "black_circle") {
      if (turn) {
        return {status: "Loop shouldn't turn next to the black circle", errors: [util.coord(line[i].x,line[i].y)]};
      }
    }
    prevClue = null;

    var clue = clues[line[i].y][line[i].x];
    if (clue == "white_circle"){
      if (turn) {
        return {status: "Loop shouldn't turn at the white circle", errors: [util.coord(line[i].x,line[i].y)]};
      }
      if (!prevTurn) {
        prevClue = clue;
      }
    } else if (clue == "black_circle"){
      if (!turn) {
        return {status: "Loop should turn at the black circle", errors: [util.coord(line[i].x,line[i].y)]};
      }
      if (prevTurn) {
        return {status: "Loop shouldn't turn next to the black circle", errors: [util.coord(line[i-1].x,line[i-1].y)]};
      }
      prevClue = clue;
    }

    prevTurn = turn;
    prevDirection = direction;
  }
  for (var x=0;x < clues.cols;x++) {
    for (var y=0;y < clues.rows; y++) {
      if (v[y][x] || h[y][x]){
        if (!used[y][x]) {
          return {status: "There should be single loop passing through some cells", errors: []};
        }
      }
    }
  }
  for (var x=0;x < clues.cols;x++) {
    for (var y=0;y < clues.rows; y++) {
      if (clues[y][x] && clues[y][x] != "white"){
        if (!used[y][x]) {
          return {status: "Loop should pass through all cells with circles", errors: [util.coord(x, y)]};
        }
      }
    }
  }
  return {status: "OK"};
},
};

module.exports = Checker;
