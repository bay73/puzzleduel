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
  var res = Checker.checkClues(cluecells, areas);
  if (res.status != "OK") {
    return res;
  }
  return {status: "OK"};
},

checkClues: function(cells, areas) {
  var areaMap = util.create2DArray(cells.rows, cells.cols, -1)
  for (var a=0; a<areas.length; a++) {
    for (var i=0; i<areas[a].length;i++) {
      var pos = util.parseCoord(areas[a][i]);
      areaMap[pos.y][pos.x] = a;
    }
  }

  for (var a=0; a<areas.length; a++) {
    var res = Checker.checkCluesInArea(cells, areas[a], areaMap);
    if (res.status != "OK") {
      return res;
    }
  }
  return {status: "OK"};
},
checkCluesInArea: function(cells, area, areaMap) {
  var clues=[];
  var neighbours = [];
  for (var a=0;a<area.length;a++) {
    var pos = util.parseCoord(area[a]);
    if (cells[pos.y][pos.x] != "") {
      clues.push(cells[pos.y][pos.x]);
    }
  }
  if (clues.length != 2) {
    return {status: "Each area should contain exactly two clues", errors: area};
  }
  var clue1 = parseInt(clues[0]);
  var clue2 = parseInt(clues[1]);
  if (clue1 < area.length && area.length < clue2 || clue1 > area.length && area.length > clue2 ) {
    return {status: "OK"};
  }
  return {status: "The size of an area should be strictly between numbers in area" , errors: area};
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
