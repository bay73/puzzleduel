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
  var prevDirection = 'h';
  var prevClueCell = null;
  var firstClueCell = null;
  var prevClue = null;
  var firstClue = null;
  var turnsBeforeFirst = 0;
  var turnsSinceLast = 0;
  for (var i=0;i<line.length-1;i++) {
    used[line[i].y][line[i].x] = true;
    var direction = (line[i+1].x==line[i].x)?'v':'h';
    var turn = prevDirection!=direction;
    var clue = clues[line[i].y][line[i].x];
    if (clue != ""){
      if (prevClue!=null && prevClue!=clue) {
        if (turnsSinceLast != 1) {
          return {status: "Loop should turn exactly once between the white and black circles", errors: [util.coord(line[i].x,line[i].y), util.coord(prevClueCell.x, prevClueCell.y)]};
        }
      }
      if (prevClue!=null && prevClue==clue) {
        if (turnsSinceLast != 0) {
          return {status: "Loop should not turn between the circles of the same color", errors: [util.coord(line[i].x,line[i].y), util.coord(prevClueCell.x, prevClueCell.y)]};
        }
      }
      prevClueCell = {x: line[i].x, y: line[i].y};
      prevClue = clue;
      turnsSinceLast = 0;
      if (firstClue == null){
        firstClueCell = {x: line[i].x, y: line[i].y};
        firstClue = clue;
      }
    } else {
      if (prevDirection != direction) {
        turnsSinceLast++;
        if (firstClue == null){
          turnsBeforeFirst++;
        }
      }
      if (i==0) {
        turnsBeforeFirst++;
      }
    }
    prevDirection = direction;
  }
  if (prevClue!=null && prevClue!=firstClue) {
    if (turnsSinceLast+turnsBeforeFirst != 1) {
      return {status: "Loop should turn exactly once between the white and black circles", errors: [util.coord(firstClueCell.x, firstClueCell.y), util.coord(prevClueCell.x, prevClueCell.y)]};
    }
  }
  if (prevClue!=null && prevClue==firstClue) {
    if (turnsSinceLast+turnsBeforeFirst != 0) {
      return {status: "Loop should not turn between the circles of the same color", errors: [util.coord(firstClueCell.x, firstClueCell.y), util.coord(prevClueCell.x, prevClueCell.y)]};
    }
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
