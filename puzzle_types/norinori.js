if (typeof util=="undefined") {
  var util = require('./util');
}

const Checker = {
check:function(dimension, clues, data){
  // Create array
  var dim = util.parseDimension(dimension);
  var cells = util.create2DArray(dim.rows, dim.cols, false);
  var areas;

  // Parse data.
  for (var [key, value] of Object.entries(data)) {
    var pos = util.parseCoord(key);
    if (cells[pos.y]){
      cells[pos.y][pos.x] = (value == "1");
    }
  }
  // Parse clues.
  for (var [key, value] of Object.entries(clues)) {
    if (key=="areas") {
      areas = value;
    }
  }
  var res = Checker.checkDomino(cells);
  if (res.status != "OK") {
    return res;
  }
  var res = Checker.checkCountInAreas(cells, areas);
  if (res.status != "OK") {
    return res;
  }
  return {status: "OK"};
},

checkDomino: function(cells) {
  for (var y = 0; y < cells.rows; y++) {
    for (var x = 0; x < cells.cols; x++) {
      if (cells[y][x]){
        let neighbours = Checker.getNeighbours(cells, x, y);
        if (neighbours.length != 1) {
          neighbours.push(util.coord(x,y));
          return {status: "Shaded cells should form a domino", errors: neighbours};
        }
      }
    }
  }
  return {status: "OK"};
},
getNeighbours: function(cells, x, y) {
  let neighbours = [];
  if (Checker.isPainted(cells, x-1, y)) {
    neighbours.push(util.coord(x-1,y));
  }
  if (Checker.isPainted(cells, x+1, y)) {
    neighbours.push(util.coord(x+1,y));
  }
  if (Checker.isPainted(cells, x, y-1)) {
    neighbours.push(util.coord(x,y-1));
  }
  if (Checker.isPainted(cells, x, y+1)) {
    neighbours.push(util.coord(x,y+1));
  }
  return neighbours;
},
isPainted: function(cells, x, y) {
  if (x >=0 && x < cells.cols && y >=0 && y < cells.rows) {
    return cells[y][x];
  }
  return false;
},
checkCountInAreas: function(cells, areas) {
  for (var a=0; a<areas.length; a++) {
    var area = areas[a];
    var blackCount = 0;
    for (var i=0;i<area.length;i++) {
      var pos = util.parseCoord(area[i]);
      if (cells[pos.y][pos.x]) {
        blackCount++;
      }
    }
    if (blackCount != 2) {
     return {status: "The area should contain exactly 2 shaded cells", errors: area};
    }
  }
  return {status: "OK"};
},
};

module.exports = Checker;
