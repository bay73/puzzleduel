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
  var res = Checker.checkAreas(cluecells, areas, requiredLetters);
  if (res.status != "OK") {
    return res;
  }
  return {status: "OK"};
},

checkAreas: function(cells, areas, requiredLetters) {
  for (var a=0; a<areas.length; a++) {
    var letters = Checker.getLetersInArea(cells, areas[a]);
    if (letters != requiredLetters) {
      return {status: "Each area should contain all letters exactly once", errors: areas[a]};
    }
  }
  return {status: "OK"};
},
getLetersInArea: function(cells, area) {
  var res = [];
  for (var a=0;a<area.length;a++) {
    var pos = util.parseCoord(area[a]);
    if (cells[pos.y][pos.x] != "") {
      res.push(cells[pos.y][pos.x]);
    }
  }
  return res.sort().join('');
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
}
};

module.exports = Checker;
