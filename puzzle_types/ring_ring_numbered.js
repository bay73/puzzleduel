if (typeof util=="undefined") {
  var util = require('./util');
}

// Стандартные правила Ring Ring +
// одинаковые цифры принадлежат одному рингу, разные --- разным,
// цифры расположены в любой части ринга,
// могут быть ринги без цифр,
// через цифру проходит только 1 ринг.
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
  // Check deadends and connections.
  var res = Checker.checkValidWhiteCells(v, h, clues);
  if (res.status != "OK")
    return res;
  res = Checker.checkRectangles(v, h, clues);
  if (res.status != "OK") {
    return res;
  }
  return {status: "OK"};
},
checkValidWhiteCells: function(v, h, clues) {
  for (var y = 0; y < h.rows; y++) {
    for (var x = 0; x < h.cols; x++) {
      var ends = (y > 0 && v[y-1][x]) + v[y][x] + (x > 0 && h[y][x - 1]) + h[y][x];
      if (clues[y][x] == "black") {
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
        } else if (ends == 4 && clues[y][x] != "") {
          return {status: "Rectangles can't intersect at a cell with number", errors: [util.coord(x,y)]}
        }
      }
    }
  }
  return {status: "OK"};
},
checkRectangles: function(v, h, clues) {
  var usedNumbers = {};
  for (var y = 0; y < h.rows; y++) {
    for (var x = 0; x < h.cols; x++) {
      if (!(y > 0 && v[y-1][x]) && v[y][x] && !(x > 0 && h[y][x - 1]) && h[y][x]) {
        var res = Checker.buildLine(v, h, x, y, clues);
        if (res.status != "OK") {
          return res;
        }
        if (res.turns != 4) {
          return {status: "This loop is not a rectangle", errors: res.line};
        }
        if (res.number != "") {
          if (res.number in usedNumbers) {
            return {status: "All equal numbers should be at one rectangle", errors: [res.numberPos,usedNumbers[res.number]]};
          } else {
            usedNumbers[res.number] = res.numberPos;
          }
        }
      }
    }
  }
  return {status: "OK"};
},
buildLine: function(v, h, x0, y0, clues) {
  var turns = 1;
  var prev = {x:x0, y:y0};
  var current = {x: x0 + 1, y: y0, dir: "R"};
  var next = {};
  var line = [util.coord(x0, y0), util.coord(x0 + 1, y0)];
  var length = 2;
  var number = "";
  var numberPos = null;
  if (clues[y0][x0] != "") {
    number = clues[y0][x0];
    numberPos = util.coord(x0, y0)
  }
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
    }
    if (clues[current.y][current.x] != "") {
        if (number == "") {
            number = clues[current.y][current.x];
            numberPos = util.coord(current.x, current.y)
        } else if (number != clues[current.y][current.x]) {
            return {status: "Rectangle can't pass through cells with different numbers", errors: [numberPos, util.coord(current.x, current.y)]}
        }
    }
    line[length] = util.coord(next.x, next.y);
    length++;
    prev = current;
    current = next;
  }
  return {status: "OK", line: line, turns: turns, number: number, numberPos: numberPos};
},
};

module.exports = Checker;
