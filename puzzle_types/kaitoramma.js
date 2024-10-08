if (typeof util=="undefined") {
  var util = require('./util');
}

const Checker = {
check:function(dimension, clues, data){
  // Create array
  var part = dimension.split("-");
  var requiredLetters = part[1];
  var dim = util.parseDimension(part[0]);
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
  const corners = []
  for (var a=0; a<areas.length; a++) {
    const corner = Checker.isRectangle(cells, areas[a])
    if (!corner) {
      return {status: "Each area should have rectangular or square shape", errors: areas[a]};
    } else {
      corners.push(corner)
    }
    var clues = Checker.getCluesInArea(cells, areas[a]);
    if (clues.length == 0) {
      return {status: "Each area should contain at least one circle", errors: areas[a]};
    }
    if (clues.includes("white_circle") && clues.includes("black_circle")) {
      return {status: "The area should not contain circles of different color", errors: areas[a]};
    }
  }
  function onlyUnique(value, index, array) {
    return array.indexOf(value) === index;
  }
  const allXs = corners.map(corner => corner.left).filter(onlyUnique);
  const allYs = corners.map(corner => corner.top).filter(onlyUnique);
  for (let i=0;i<allXs.length;i++) {
    x = allXs[i];
    const columnYs = corners.filter(corner => corner.left==x).map(corner => corner.top).filter(onlyUnique)
    if (columnYs.length != allYs.length) {
      return {status: "The dividing lines must start and end on the grid boundary", errors: []};
    }
  }
  return {status: "OK"};
},
getCluesInArea: function(cells, area) {
  var res = [];
  for (var a=0;a<area.length;a++) {
    var pos = util.parseCoord(area[a]);
    if (cells[pos.y][pos.x] != "") {
      res.push(cells[pos.y][pos.x]);
    }
  }
  return res;
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
isRectangle: function(dim, area) {
  var used = util.create2DArray(dim.rows, dim.cols, false);
  var left = Number.MAX_VALUE;
  var right = -Number.MAX_VALUE;
  var top = Number.MAX_VALUE;
  var bottom = -Number.MAX_VALUE;
  for (var i=0;i<area.length;i++) {
    var pos = util.parseCoord(area[i]);
    used[pos.y][pos.x] = true;
    left = Math.min(left, pos.x);
    right = Math.max(right, pos.x);
    top = Math.min(top, pos.y);
    bottom = Math.max(bottom, pos.y);
  }
  for (var y = top; y <= bottom; y++) {
    for (var x = left; x <= right; x++) {
      if (!used[y][x]) {
        return false;
      }
    }
  }
  return {left: left, top: top};
}
};

module.exports = Checker;
