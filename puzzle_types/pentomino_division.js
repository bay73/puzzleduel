if (typeof util=="undefined") {
  var util = require('./util');
}
if (typeof pentomino_util=="undefined") {
  var pentomino_util = require('./pentomino_util');
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
  var areaMap = util.create2DArray(cells.rows, cells.cols, -1)
  var areaLetter = []
  for (var a=0; a<areas.length; a++) {
    var clues = [];
    if (areas[a].length != 5) {
      return {status: "Each marked area should form a pentomino", errors: areas[a]};
    }
    for (var i=0; i<areas[a].length;i++) {
      var pos = util.parseCoord(areas[a][i]);
      if (cells[pos.y][pos.x] != "") {
        clues.push(cells[pos.y][pos.x]);
      }
      areaMap[pos.y][pos.x] = a;
    }
    areaCode = pentomino_util.getAreaCode(areas[a])
    areaLetter[a] = pentomino_util.pentominoes[areaCode];
    if (areaLetter[a]==undefined) {
      return {status: "Each marked area should form a pentomino", errors: areas[a]};
    }
    let wrongClues = clues.filter( clue => clue != areaLetter[a])
    if (wrongClues.length > 0) {
      return {status: "The shape is not correct", errors: areas[a]};
    }
  }
  for (var a=0; a<areas.length; a++) {
    let res = Checker.checkNeighbours(a, areas, areaMap, areaLetter);
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
checkNeighbours: function(areaIndex, areas, areaMap, areaLetter) {
  var neighbours = [];
  for (var a=0;a<areas[areaIndex].length;a++) {
    var pos = util.parseCoord(areas[areaIndex][a]);
    const cellNeighbours = Checker.getNeighbourAreas(pos, areaIndex, areaMap);
    neighbours = neighbours.concat(cellNeighbours);
  }
  uniqueNeighbours = neighbours.filter(function(item, pos) {
    return neighbours.indexOf(item) == pos;
  });
  for(var i=0;i<uniqueNeighbours.length;i++) {
    if (areaLetter[areaIndex] == areaLetter[uniqueNeighbours[i]]) {
      return {status: "Areas of the same shape shouldn't share an edge", errors: areas[areaIndex].concat(areas[uniqueNeighbours[i]])};
    }
  }
  return {status: "OK"};
},
getNeighbourAreas: function(pos, areaIndex, areaMap) {
  var result = [];
  var neighbour = [{x:1, y:0}, {x:-1, y:0}, {x:0, y:1}, {x:0, y:-1}];
  for (var i=0;i<4;i++){
    var x = pos.x+neighbour[i].x;
    var y = pos.y+neighbour[i].y;
    if (x>=0 && x<areaMap.cols && y>=0 && y<areaMap.rows && areaMap[y][x] != areaIndex) {
      result.push(areaMap[y][x]);
    }
  }
  return result;
},
};

module.exports = Checker;
