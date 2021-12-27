if (typeof util=="undefined") {
  var util = require('./util');
}

const Checker = {
check:function(dimension, clues, data){
  // Create array
  var dim = util.parseDimension(dimension);
  var cluecells = util.create2DArray(dim.rows, dim.cols, "")
  var areas = [];

  // Parse data.
  for (var [key, value] of Object.entries(data)) {
    if (key=="areas") {
      areas = value;
    }
  }
  // Parse clues.
  for (var [key, value] of Object.entries(clues)) {
    var pos = util.parseCoord(key);
    if (cluecells[pos.y]){
      cluecells[pos.y][pos.x] = value;
    }
  }
  var res = Checker.checkAllUsed(dim, areas);
  if (res.status != "OK") {
    return res;
  }
  var res = Checker.checkAreas(cluecells, areas);
  if (res.status != "OK") {
    return res;
  }
  return {status: "OK"};
},

checkAreas: function(cells, areas) {
  for (var a=0; a<areas.length; a++) {
    var res = Checker.checkClues(cells, areas[a]);
    if (res.status != "OK") {
      return res;
    }
    var res = Checker.checkShapes(cells, areas[a]);
    if (res.status != "OK") {
      return res;
    }
  }
  return {status: "OK"};
},
checkAllUsed: function(dim, areas) {
  var used = util.create2DArray(dim.rows, dim.cols, false);
  for (var a=0; a<areas.length; a++) {
    var area = areas[a];
    for (var i=0;i<area.length;i++) {
      var pos = util.parseCoord(area[i]);
      if (used[pos.y][pos.x]) {
        return {status: "Each cell should belong to exactly one area", errors: area[i]};
      }
      used[pos.y][pos.x] = true;
    }
  }
  for (var y = 0; y < dim.rows; y++) {
    for (var x = 0; x < dim.cols; x++) {
      if (!used[y][x]) {
        return {status: "Each cell should belong to exactly one area", errors: util.coord(x, y)};
      }
    }
  }
  return {status: "OK"};
},
checkClues: function(cells, area) {
  var clues = [];
  for (var a=0; a<area.length; a++) {
    var pos = util.parseCoord(area[a]);
    if (cells[pos.y][pos.x] != "") {
      clues.push(cells[pos.y][pos.x]);
    }
  }
  if (clues.length != 1) {
    return {status: "Each area should contain exactly one circle", errors: area};
  }
  return {status: "OK"};
},
checkShapes: function(cells, area) {
  var used = util.create2DArray(cells.rows, cells.cols, false);
  var left = Number.MAX_VALUE;
  var right = -Number.MAX_VALUE;
  var top = Number.MAX_VALUE;
  var bottom = -Number.MAX_VALUE;
  var orientation = [];
  for (var i=0; i<area.length; i++) {
    var pos = util.parseCoord(area[i]);
    used[pos.y][pos.x] = true;
    left = Math.min(left, pos.x);
    right = Math.max(right, pos.x);
    top = Math.min(top, pos.y);
    bottom = Math.max(bottom, pos.y);
  }
  orientation[0] = {x:left, y:top, z:1};
  orientation[1] = {x:right, y:top, z:1};
  orientation[2] = {x:right, y:bottom, z:1};
  orientation[3] = {x:left, y:bottom, z:1};
  for (var i = 0; i < orientation.length; i++) {
    for (var row = top; row <= bottom; row++) {
      for (var column = left; column <= right; column++) {
        if (((column == orientation[i].x || row == orientation[i].y) && !used[row][column]) ||
            (column != orientation[i].x && row != orientation[i].y && used[row][column])) {
          orientation[i].z = 0;
        }
      }
    }
  }
  var n = 0;
  var nOrientation;
  for (var i = 0; i < orientation.length; i++) {
    if (orientation[i].z == 1) {
      nOrientation = i;
    }
    n += orientation[i].z;
  }
  if (n != 1) {
    return {status: "Each area should be L-shaped", errors: area};
  }
  if (cells[orientation[nOrientation].y][orientation[nOrientation].x] == "") {
    return {status: "Each area should contain a circle in the corner", errors: area};
  } else {
    if (cells[orientation[nOrientation].y][orientation[nOrientation].x] == "white_circle") {
      if ((top - bottom) == (left - right)) {
        return {status: "L-shape with a white circle should not have equal legs", errors: area};
      }
    } else {
      if ((top - bottom) != (left - right)) {
        return {status: "L-shape with a black circle should have equal legs", errors: area};
      }
    }
  }
  return {status: "OK"};
}
};

module.exports = Checker;
