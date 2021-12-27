if (typeof util=="undefined") {
  var util = require('./util');
}

const Checker = {
check:function(dimension, clues, data){
  // Create array
  var dim = util.parseDimension(dimension);
  var cells = [];

  for (var y = 0; y < dim.rows + dim.cols - 1; y++) {
    cells[y] = new Array(2*dim.cols - 1);
    for (var x = 0; x < 2*dim.cols - 1; x++) {
      if (y - x < dim.rows && x - y < dim.cols) {
        cells[y][x] = {black: false, used: false}
      }
    }
  }
  
  for (const [key, value] of Object.entries(data)) {
    var x = key.charCodeAt(0) - 'a'.charCodeAt(0);
    var y = parseInt(key.substring(1)) - 1;
    if (cells[y] && cells[y][x]) {
      cells[y][x].black = (value == '1');
    }
  }

  for (const [key, value] of Object.entries(clues)) {
    var x = key.charCodeAt(0) - 'a'.charCodeAt(0);
    var y = parseInt(key.substring(1)) - 1;
    if (cells[y] && cells[y][x]) {
      cells[y][x].black = (value == '1');
    }
  }


  var islandCount = 0;
  for (var y = 0; y < dim.rows + dim.cols - 1; y++) {
    for (var x = 0; x < 2*dim.cols - 1; x++) {
      if (y - x < dim.rows && x - y < dim.cols) {
        if (!cells[y][x].black && !cells[y][x].used) {
          var island = [];
          Checker.paint(dim, cells, x, y, island);
          if (island.length != 6) {
            return {
              status: "An island must consist of 6 cells",
              errors: island
            };
          } else {
            islandCount++;
          }
        }
      }
    }
  }
  if (islandCount != 6) {
    return {
      status: "There should be 6 white islands",
      errors: []
    };
  }
  
  return {status: "OK"};
},
paint: function(dim, cells, x, y, island){
  if (cells[y] && cells[y][x]) {
    if (!cells[y][x].black && !cells[y][x].used) {
      island.push(util.coord(x,y));
      cells[y][x].used = true;
      Checker.paint(dim, cells, x-1, y, island)
      Checker.paint(dim, cells, x, y-1, island)
      Checker.paint(dim, cells, x+1, y, island)
      Checker.paint(dim, cells, x, y+1, island)
      Checker.paint(dim, cells, x-1, y-1, island)
      Checker.paint(dim, cells, x+1, y+1, island)
    }
  }
},
};

module.exports = Checker;
