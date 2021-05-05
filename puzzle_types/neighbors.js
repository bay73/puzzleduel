const util = require('./util');

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
  var res = Checker.checkAreaSizes(areas);
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
  var clue;
  var clueCoord;
  var neighbours = [];
  for (var a=0;a<area.length;a++) {
    var pos = util.parseCoord(area[a]);
    if (cells[pos.y][pos.x] != "") {
      if (typeof clue != "undefined") {
        return {status: "Each area should contain exactly one clue", errors: area};
      }
      clue = cells[pos.y][pos.x];
      clueCoord = util.coord(pos.x,pos.y);
    }
    const cellNeighbours = Checker.getNeighbourAreas(pos, areaMap);
    neighbours = neighbours.concat(cellNeighbours);
  }
  if (typeof clue == "undefined") {
    return {status: "Each area should contain exactly one clue", errors: area};
  }
  if (clue=='?') {
    return {status: "OK"};
  }
  uniqueNeighbours = neighbours.filter(function(item, pos) {
    return neighbours.indexOf(item) == pos;
  });
  if ((uniqueNeighbours.length-1).toString() != clue) {
    return {status: "The clue is not correct" , errors: [clueCoord]};
  }
  return {status: "OK"};
},
getNeighbourAreas: function(pos, areaMap) {
  var result = [];
  var neighbour = [{x:1, y:0}, {x:-1, y:0}, {x:0, y:1}, {x:0, y:-1}];
  for (var i=0;i<4;i++){
    var x = pos.x+neighbour[i].x;
    var y = pos.y+neighbour[i].y;
    if (x>=0 && x<areaMap.cols && y>=0 && y<areaMap.rows) {
      result.push(areaMap[y][x]);
    }
  }
  return result;
},
checkAreaSizes: function(areas) {
  var size = areas[0].length;
  for (var a=0; a<areas.length; a++) {
    var area = areas[a];
    if (area.length != size) {
      return {status: "All areas should have the same size", errors: areas[a]};
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
