if (typeof util=="undefined") {
  var util = require('./util');
}

// Стандартные правила Ring Ring, 
// но дополнительно заданы длины максимального отрезка (стороны) в соответсвующем столбце/строке.
// Длина стороны минимально ринга 1.

const Checker = {
check:function(dimension, clueData, data){
  // Create array
  var dim = util.parseDimension(dimension);
  var v = util.create2DArray(dim.rows, dim.cols, false)
  var h = util.create2DArray(dim.rows, dim.cols, false)
  var clues = util.create2DArray(dim.rows, dim.cols, false)
  var bottom = [];
  var right = [];
  var head = null;
  var tail = null;

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
    if (key=="bottom") {
      bottom = value;
    } else if (key=="right") {
      right = value;
    } else {
      var pos = util.parseCoord(key);
      if (clues[pos.y]) {
        clues[pos.y][pos.x] = value=="black";
      }
    }
  }
  // Check deadends and connections.
  var res = Checker.checkValidWhiteCells(v, h, clues);
  if (res.status != "OK")
    return res;
  res = Checker.checkRectangles(v, h);
  if (res.status != "OK") {
    return res;
  }
  var rectangles = res.rectangles
  var res = Checker.checkColumnClues(rectangles, bottom);
  if (res.status != "OK") {
    res.errors = [];
    for (var y=0; y < dim.rows; y++) {
        res.errors.push(util.coord(res.col, y));
      }
    return res;
  }
  var res = Checker.checkRowClues(rectangles, right);
  if (res.status != "OK") {
    res.errors = [];
    for (var x=0; x < dim.cols; x++) {
        res.errors.push(util.coord(x, res.row));
      }
    return res;
  }
  return {status: "OK"};
},
checkValidWhiteCells: function(v, h, clues) {
  for (var y = 0; y < h.rows; y++) {
    for (var x = 0; x < h.cols; x++) {
      var ends = (y > 0 && v[y-1][x]) + v[y][x] + (x > 0 && h[y][x - 1]) + h[y][x];
      if (clues[y][x]) {
        if (ends != 0) {
          return {status: "Rectangle can't pass through the black cell", errors: [util.coord(x,y)]}
        }
      } else {
        if (ends == 0) {
          return {status: "Rectangles should pass through all cells", errors: [util.coord(x,y)]}
        } else if (ends == 1) {
          return {status: "Rectangles should be a closed loop", errors: [util.coord(x,y)]}
        } else if (ends == 3) {
          return {status: "Intersection with overlapping is not allowed", errors: [util.coord(x,y)]}
        }
      }
    }
  }
  return {status: "OK"};
},
checkRectangles: function(v, h) {
  var rectangles = [];
  var count = 0;
  for (var y = 0; y < h.rows; y++) {
    for (var x = 0; x < h.cols; x++) {
      if (!(y > 0 && v[y-1][x]) && v[y][x] && !(x > 0 && h[y][x - 1]) && h[y][x]) {
        var res = Checker.buildLine(v, h, x, y);
        if (res.status != "OK") {
          return res;
        }
        if (res.turns != 4) {
          return {status: "This loop is not a rectangle", errors: res.line};
        }
        rectangles[count] = res.angles;
        count++;
      }
    }
  }
  return {status: "OK", rectangles: rectangles};
},
buildLine: function(v, h, x0, y0) {
  var turns = 1;
  var angles = {x0:x0, y0:y0};
  var prev = {x:x0, y:y0};
  var current = {x: x0 + 1, y: y0, dir: "R"};
  var next = {};
  var line = [util.coord(x0, y0), util.coord(x0 + 1, y0)];
  var length = 2;
  while (current.x != x0 || current.y != y0) {
    var nextCount = 0;
    if (current.x > 0 && h[current.y][current.x-1] && (current.x-1 != prev.x || current.y != prev.y)) {
      nextCount++;
      next = {x: current.x-1, y: current.y, dir: "L"};
    }
    if (current.x < h.cols-1 && h[current.y][current.x] && (current.x+1 != prev.x || current.y != prev.y)) {
      nextCount++;
      next = {x: current.x+1, y: current.y, dir: "R"};
    }
    if (current.y > 0 && v[current.y-1][current.x] && (current.x != prev.x || current.y-1 != prev.y)) {
      nextCount++;
      next = {x: current.x, y: current.y-1, dir: "U"};
    }
    if (current.y < v.rows-1 && v[current.y][current.x] && (current.x != prev.x || current.y+1 != prev.y)) {
      nextCount++;
      next = {x: current.x, y: current.y+1, dir: "D"};
    }
    if (nextCount == 3) {
      next.x = 2 * current.x - prev.x;
      next.y = 2 * current.y - prev.y;
      next.dir = current.dir;
    } else if (next.dir != current.dir) {
      turns++;
      if (turns == 3) {
        angles.x2 = current.x;
        angles.y2 = current.y;
      }
    }
    line[length] = util.coord(next.x, next.y);
    length++;
    prev = current;
    current = next;
  }
  return {status: "OK", line: line, turns: turns, angles:angles};
},
checkColumnClues: function(rectangles, clues) {
  for (var x=0; x < clues.length; x++) {
    if (clues[x] && clues[x] != "white") {
      res = Checker.checkColumnClue(rectangles, clues[x], x);
      if (res) {
        return {status: "Wrong length of the longest line in the column", col: x};
      }
    }
  }
  return {status: "OK"};
},
checkColumnClue: function(rectangles, clue, col) {
  var current = 0;
  var maxCount = 0;
  var n = rectangles.length;
  for (var i = 0; i < n; i++) {
    current = rectangles[i].y2 - rectangles[i].y0;
    if ((rectangles[i].x0 == col || rectangles[i].x2 == col) && current > maxCount) {
      maxCount = current;
    }
  }
  if (maxCount.toString() != clue) {
    return true;
  }
  return null;
},
checkRowClues: function(rectangles, clues) {
  for (var y=0; y < clues.length; y++) {
    if (clues[y] && clues[y] != "white") {
      res = Checker.checkRowClue(rectangles, clues[y], y);
      if (res) {
        return {status: "Wrong length of the longest line in the row", row: y};
      }
    }
  }
  return {status: "OK"};
},
checkRowClue: function(rectangles, clue, row) {
  var current = 0;
  var maxCount = 0;
  var n = rectangles.length;
  for (var i = 0; i < n; i++) {
    current = rectangles[i].x2 - rectangles[i].x0;
    if ((rectangles[i].y0 == row || rectangles[i].y2 == row) && current > maxCount) {
      maxCount = current;
    }
  }
  if (maxCount.toString() != clue) {
    return true;
  }
  return null;
},
};

module.exports = Checker;
