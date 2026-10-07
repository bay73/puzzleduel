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
  var res = Checker.checkDegrees(v, h);
  if (res.status != "OK") {
    return res;
  }
  var lineRes = Checker.buildLine(v, h);
  if (lineRes.status != "OK") {
    return lineRes;
  }
  var res = Checker.checkSingleLoop(lineRes.line, v, h);
  if (res.status != "OK") {
    return res;
  }
  var res = Checker.checkClues(clues, v, h);
  if (res.status != "OK") {
    return res;
  }
  return {status: "OK"};
},
neighbours: function(x, y, v, h) {
  return {
    left: x > 0 && h[y][x-1],
    right: x < h.cols-1 && h[y][x],
    up: y > 0 && v[y-1][x],
    down: y < v.rows-1 && v[y][x]
  };
},
checkDegrees: function(v, h) {
  for (var y=0;y < h.rows; y++) {
    for (var x=0;x < h.cols;x++) {
      var n = Checker.neighbours(x, y, v, h);
      var count = (n.left?1:0) + (n.right?1:0) + (n.up?1:0) + (n.down?1:0);
      if (count != 0 && count != 2) {
        return {status: "There should be single loop without bifurcations", errors: [util.coord(x, y)]};
      }
    }
  }
  return {status: "OK"};
},
buildLine: function(v, h) {
  var start = Checker.findStart(h);
  if (!start) {
    return {status: "Loop should pass through all cells with numbers"};
  }
  var line = [];
  line[0] = start;
  line[1] = {x:start.x + 1, y:start.y };
  var length = 1;
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
  for (var y=0;y < h.rows; y++) {
    for (var x=0;x < h.cols;x++) {
      if (h[y][x]) return {x:x, y:y};
    }
  }
  return null;
},
checkSingleLoop: function(line, v, h) {
  var used = util.create2DArray(h.rows, h.cols, false)
  for (var i=0;i<line.length;i++) {
    used[line[i].y][line[i].x] = true;
  }
  for (var y=0;y < h.rows; y++) {
    for (var x=0;x < h.cols;x++) {
      var n = Checker.neighbours(x, y, v, h);
      if ((n.left || n.right || n.up || n.down) && !used[y][x]) {
        return {status: "There should be single loop", errors: [util.coord(x, y)]};
      }
    }
  }
  return {status: "OK"};
},
// Number of loop steps from (x,y) going in direction (dx,dy) until the loop turns.
segmentLength: function(x, y, dx, dy, v, h) {
  var len = 0;
  while (true) {
    var n = Checker.neighbours(x, y, v, h);
    var go = (dx==1 && n.right) || (dx==-1 && n.left) || (dy==1 && n.down) || (dy==-1 && n.up);
    if (!go) {
      return len;
    }
    x += dx;
    y += dy;
    len++;
  }
},
checkClues: function(clues, v, h) {
  for (var y=0;y < clues.rows; y++) {
    for (var x=0;x < clues.cols;x++) {
      if (clues[y][x] === "" || clues[y][x] == null) {
        continue;
      }
      var n = Checker.neighbours(x, y, v, h);
      if (!(n.left || n.right || n.up || n.down)) {
        return {status: "Loop should pass through all cells with numbers", errors: [util.coord(x, y)]};
      }
      var clue = parseInt(clues[y][x]);
      if (isNaN(clue)) {
        continue;
      }
      if (n.left && n.right) {
        var len = Checker.segmentLength(x, y, -1, 0, v, h) + Checker.segmentLength(x, y, 1, 0, v, h);
        if (len != clue) {
          return {status: "Segment passing through the clue should have the indicated length", errors: [util.coord(x, y)]};
        }
      } else if (n.up && n.down) {
        var len = Checker.segmentLength(x, y, 0, -1, v, h) + Checker.segmentLength(x, y, 0, 1, v, h);
        if (len != clue) {
          return {status: "Segment passing through the clue should have the indicated length", errors: [util.coord(x, y)]};
        }
      } else {
        var lenH = n.left ? Checker.segmentLength(x, y, -1, 0, v, h) : Checker.segmentLength(x, y, 1, 0, v, h);
        var lenV = n.up ? Checker.segmentLength(x, y, 0, -1, v, h) : Checker.segmentLength(x, y, 0, 1, v, h);
        if (lenH != clue || lenV != clue) {
          return {status: "Segment passing through the clue should have the indicated length", errors: [util.coord(x, y)]};
        }
      }
    }
  }
  return {status: "OK"};
},
};

module.exports = Checker;
