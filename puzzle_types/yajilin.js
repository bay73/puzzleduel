if (typeof util=="undefined") {
  var util = require('./util');
}

const Checker = {
check:function(dimension, clueData, data){
  // Create array
  var dim = util.parseDimension(dimension);
  var v = util.create2DArray(dim.rows, dim.cols, false)
  var h = util.create2DArray(dim.rows, dim.cols, false)
  var clues = util.create2DArray(dim.rows, dim.cols, "")

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
  var res = Checker.checkAllFilled(clues, lineRes.line, v, h);
  if (res.status != "OK") {
    return res;
  }
  var unused = res.unused;
  var res = Checker.checkClues(clues, unused);
  if (res.status != "OK") {
    return res;
  }
  var res = Checker.checkNotouch(unused);
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
checkAllFilled: function(cells, line, v, h) {
  var used = util.create2DArray(cells.rows, cells.cols, false)
  var unused = util.create2DArray(cells.rows, cells.cols, false)
  for (var i=0;i<line.length;i++) {
    used[line[i].y][line[i].x] = true;
  }
  for (var y=0;y<used.rows;y++) {
    for (var x=0;x<used.cols;x++) {
      if (cells[y][x] == "" && !used[y][x]) {
        if (h[y][x] || v[y][x]) {
          return {status: "There should be single loop passing through some cells", errors: [util.coord(x, y)]};
        }
        unused[y][x] = true;
      }
      if (cells[y][x]!="" && used[y][x]) {
        return {status: "Loop can't pass through the clue cell", errors: [util.coord(x, y)]};
      }
    }
  }
  return {status: "OK", unused: unused};
},
checkClues: function(clues, unused) {
  for (var y=0;y<clues.rows;y++) {
    for (var x=0;x<clues.cols;x++) {
      if (clues[y][x]!="" && clues[y][x]!="grey") {
        let direction = clues[y][x].charAt(0)
        let value = clues[y][x].charAt(1)
        var count = 0
        if (direction == "d") {
          count = Checker.countDown(unused, x, y);
        }
        if (direction == "u") {
          count = Checker.countUp(unused, x, y);
        }
        if (direction == "r") {
          count = Checker.countRight(unused, x, y);
        }
        if (direction == "l") {
          count = Checker.countLeft(unused, x, y);
        }
        if (count.toString() != value) {
          return {status: "The clue is not correct" , errors: [util.coord(x,y)]};
        }
      }
    }
  }
  return {status: "OK"};
},
countRight: function(unused, x, y) {
  let count = 0;
  for (var i=x+1;i<unused.cols;i++) {
    if (unused[y][i]) {
       count++;
    }
  }
  return count;
},
countLeft: function(unused, x, y) {
  let count = 0;
  for (var i=0;i<x;i++) {
    if (unused[y][i]) {
       count++;
    }
  }
  return count;
},
countUp: function(unused, x, y) {
  let count = 0;
  for (var i=0;i<y;i++) {
    if (unused[i][x]) {
       count++;
    }
  }
  return count;
},
countDown: function(unused, x, y) {
  let count = 0;
  for (var i=y+1;i<unused.rows;i++) {
    if (unused[i][x]) {
       count++;
    }
  }
  return count;
},
checkNotouch: function(cells) {
  var res = Checker.findTouch(cells);
  if (res){
    return {status: "Blackened cells shouldn't sharing an edge", errors: res};
  }
  return {status: "OK"};
},
findTouch: function(cells) {
  for (var y = 0; y < cells.rows; y++) {
    for (var x = 0; x < cells.cols; x++) {
      if (y<cells.rows-1 && cells[y][x] && cells[y+1][x]){
        return [util.coord(x,y), util.coord(x,y+1)];
      }
      if (x<cells.cols-1 && cells[y][x] && cells[y][x+1]){
        return [util.coord(x,y), util.coord(x+1,y)];
      }
    }
  }
  return null;
}
};

module.exports = Checker;
