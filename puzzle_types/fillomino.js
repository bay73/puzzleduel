if (typeof util=="undefined") {
  var util = require('./util');
}

var Checker = {
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
  var res = Checker.checkNeighbours(dim, areas);
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
  for (var a=0;a<area.length;a++) {
    var pos = util.parseCoord(area[a]);
    if (cells[pos.y][pos.x] != "") {
      var clue = parseInt(cells[pos.y][pos.x]);
      if (clue != area.length) {
        return {status: "The size of an area should be equal to numbers in area" , errors: area};
      }
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
checkNeighbours: function(dim, areas){
  var areaMap = util.create2DArray(dim.rows, dim.cols, -1)
  for (var a=0; a<areas.length; a++) {
    for (var i=0; i<areas[a].length;i++) {
      var pos = util.parseCoord(areas[a][i]);
      areaMap[pos.y][pos.x] = a;
    }
  }
  for (var a=0; a<areas.length; a++) {
    var res = Checker.checkNeighboursForArea(areas, a, areaMap);
    if (res.status != "OK") {
      return res;
    }
  }
  return {status: "OK"};
},
checkNeighboursForArea: function(areas, areaNum, areaMap) {
  let neighbours = [];
  let area = areas[areaNum];
  for (var a=0;a<area.length;a++) {
    let pos = util.parseCoord(area[a]);
    const cellNeighbours = Checker.getNeighbourAreas(pos, areaMap);
    neighbours = neighbours.concat(cellNeighbours);
  }
  uniqueNeighbours = neighbours.filter(function(item, pos) {
    return neighbours.indexOf(item) == pos;
  });
  for (var n=0;n<uniqueNeighbours.length;n++) {
    if (uniqueNeighbours[n] != areaNum && areas[areaNum].length == areas[uniqueNeighbours[n]].length) {
      return {status: "Areas of the same size shouldn't share an edge", errors: area.concat(areas[uniqueNeighbours[n]])};
    }
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
};

module.exports = Checker;
