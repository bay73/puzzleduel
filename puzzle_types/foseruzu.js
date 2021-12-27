if (typeof util=="undefined") {
  var util = require('./util');
}

const Checker = {
check:function(dimension, clues, data){
  // Create array
  var part = dimension.split("-");
  var areaSize = parseInt(part[1]);
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
  var res = Checker.checkAreaSizes(areas, areaSize);
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
  for (var a=0; a<areas.length; a++) {
    var res = Checker.checkCluesInArea(cells, areas[a]);
    if (res.status != "OK") {
      return res;
    }
  }
  return {status: "OK"};
},
checkCluesInArea: function(cells, area) {
  for (var a=0;a<area.length;a++) {
    var pos = util.parseCoord(area[a]);
    if (cells[pos.y][pos.x] != "") {
      var count = Checker.countNeighboursInArea(cells, pos, area);
      if (cells[pos.y][pos.x] != (4-count).toString()) {
        return {status: "The clue is not correct" , errors: [util.coord(pos.x,pos.y)]};
      }
    }
  }
  return {status: "OK"};
},
countNeighboursInArea: function(cells, pos, area) {
  var count = 0;
  var neighbour = [{x:1, y:0}, {x:-1, y:0}, {x:0, y:1}, {x:0, y:-1}];
  for (var i=0;i<4;i++){
    var x = pos.x+neighbour[i].x;
    var y = pos.y+neighbour[i].y;
    if (x>=0 && x<cells.cols && y>=0 && y<cells.rows) {
      if (area.includes(util.coord(x,y))) {
        count++;
      }
    }
  }
  return count;
},
checkAreaSizes: function(areas, size) {
  for (var a=0; a<areas.length; a++) {
    var area = areas[a];
    if (area.length != size) {
      return {status: "Each area should have the required size", errors: areas[a]};
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
}
};

module.exports = Checker;
