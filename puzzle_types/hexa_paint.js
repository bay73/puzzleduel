const util = require('./util');

const Checker = {
check:function(dimension, clues, data){
  // Create array
  var dim = util.parseDimension(dimension);
  var cells = [];

  for (var y = 0; y < dim.rows + dim.cols - 1; y++) {
    cells[y] = new Array(2*dim.cols - 1);
    for (var x = 0; x < 2*dim.cols - 1; x++) {
      if (y - x < dim.rows && x - y < dim.cols) {
        cells[y][x] = {black: false, clue: null}
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
      cells[y][x].clue = value;
    }
  }


  for (var y = 0; y < dim.rows + dim.cols - 1; y++) {
    for (var x = 0; x < 2*dim.cols - 1; x++) {
      if (y - x < dim.rows && x - y < dim.cols) {
        if (cells[y][x].clue) {
          var count = Checker.isBlack(cells, x, y) +
            Checker.isBlack(cells, x-1, y) + 
            Checker.isBlack(cells, x, y-1) +
            Checker.isBlack(cells, x+1, y) +
            Checker.isBlack(cells, x, y+1) +
            Checker.isBlack(cells, x-1, y-1) +
            Checker.isBlack(cells, x+1, y+1)
          if (count.toString() != cells[y][x].clue) {
            return {
              status: "The clue is not correct",
              errors: [util.coord(x, y)]
            };
          }
        }
      }
    }
  }
 
  return {status: "OK"};
},
isBlack: function(cells, x, y){
  if (cells[y] && cells[y][x]) {
    if (cells[y][x].black) {
      return 1;
    }
  }
  return 0;
},
};

module.exports = Checker;
