
const ConnectedChecker = {
  findFirst: function(cells, colors) {
    for (var y = 0; y < cells.rows; y++) {
      for (var x = 0; x < cells.cols; x++) {
        if (colors.includes(cells[y][x])){
         return {x:x, y:y};
        }
      }
    }
    return null;
  },

  fill: function(cells, filled, position, colors){
    if (!filled[position.y][position.x] && colors.includes(cells[position.y][position.x])) {
      filled[position.y][position.x] = true;
      if (position.y > 0) this.fill(cells, filled, {x: position.x, y:position.y - 1}, colors);
      if (position.x > 0) this.fill(cells, filled, {x: position.x - 1, y:position.y}, colors);
      if (position.y + 1 < cells.rows) this.fill(cells, filled, {x: position.x, y:position.y + 1}, colors);
      if (position.x + 1 < cells.cols) this.fill(cells, filled, {x: position.x + 1, y:position.y}, colors);
    }
  },

  checkAllFilled: function(cells, filled, colors){
    for (var y = 0; y < cells.rows; y++) {
      for (var x = 0; x < cells.cols; x++) {
        if (colors.includes(cells[y][x]) && !filled[y][x]){
          return false;
        }
      }
    }
    return true;
  }
};

const Util = {
  create2DArray: function(rows, cols, defaultValue) {
    // Create 2D array, used by other method.
    var cells = [];
    for (var y = 0; y < rows; y++) {
      cells[y] = new Array(cols);
      for (var x = 0; x < cols; x++) {
        cells[y][x] = defaultValue;
      }
    }
    cells.rows = rows;
    cells.cols = cols;
    return cells;
  },

  parseDimension: function(dimension) {
    // Parse dimension string to values.
    var dimensions = dimension.split("x");
    return {
      rows: parseInt(dimensions[1]),
      cols: parseInt(dimensions[0])
    } 
  },

  parseCoord: function(coord) {
    // Parse coordinate string to tuple.
    return {
      x: coord.charCodeAt(0) - 'a'.charCodeAt(0),
      y: parseInt(coord.substring(1)) - 1
    }
  },

  coord: function(x, y) {
    // Convert coordinate tuple to string.
    return String.fromCharCode('a'.charCodeAt(0) + x) + (y+1).toString();
  },

  checkConnected: function(cells, colors) {
    // Returns true if all cells of one color are orthogonally connected.
    // Returns false if not.
    var first = ConnectedChecker.findFirst(cells, colors);
    if(first) {
      var filled = Util.create2DArray(cells.rows, cells.cols, false)
      ConnectedChecker.fill(cells, filled, first, colors);
      if (!ConnectedChecker.checkAllFilled(cells, filled, colors)) {
        return false;
      }
    }
    return true;
  },

  findConnected: function(cells, first, colors) {
    // Returns list of cells which of given colors are orthogonally connected.
    var filled = Util.create2DArray(cells.rows, cells.cols, false)
    ConnectedChecker.fill(cells, filled, first, colors);
    return filled;
  },

  fillConnected: function(cells, first, colors, result) {
    // Mark cells which of given colors are orthogonally connected in result array.
    ConnectedChecker.fill(cells, result, first, colors);
  },

  findWrongValue: function(cells, goodValues) {
    // Returns one cell not having good value.
    // Returns null if all cells have good value.
    for (var y = 0; y < cells.rows; y++) {
      for (var x = 0; x < cells.cols; x++) {
        if (!goodValues.includes(cells[y][x])){
          return Util.coord(x,y);
        };
      }
    }
    return null;
  },

  find2x2: function(cells, colors) {
    // Returns list of cells forming 2x2 square.
    // Returns null if no 2x2 squares of the given color.
    for (var y = 0; y < cells.rows - 1; y++) {
      for (var x = 0; x < cells.cols - 1; x++) {
        if (colors.includes(cells[y][x])
            && colors.includes(cells[y+1][x])
            && colors.includes(cells[y][x+1])
            && colors.includes(cells[y+1][x+1])){
          return [Util.coord(x,y), Util.coord(x+1,y), Util.coord(x,y+1), Util.coord(x+1,y+1)];
        }
      }
    }
    return null;
  },

  checkOnceInRows: function(cells, colors) {
    // Returns list of cells in row which is wring.
    for (var y = 0; y < cells.rows; y++) {
      var positionsToCheck = [];
      for (var x = 0; x < cells.cols; x++) {
        positionsToCheck.push({x:x, y:y});
      }
      var result = Util.checkOnceInList(cells, positionsToCheck, colors);
      if (result) {
        return result;
      }
    }
    return null;
  },

  checkOnceInColumns: function(cells, colors) {
    // Returns list of cells in column which is wring.
    for (var x = 0; x < cells.cols; x++) {
      var positionsToCheck = [];
      for (var y = 0; y < cells.rows; y++) {
        positionsToCheck.push({x:x, y:y});
      }
      var result = Util.checkOnceInList(cells, positionsToCheck, colors);
      if (result) {
        return result;
      }
    }
    return null;
  },

  checkOnceInList: function(cells, positionsToCheck, colorsToCheck) {
    // Returns list of cells if something is wrong
    // or null if everything is Ok
    var colorsPresent = [];
    var repeat = false;
    var cellList = [];
    for (var i = 0; i < positionsToCheck.length; i++) {
      cellList.push(Util.coord(positionsToCheck[i].x,positionsToCheck[i].y));
      var color = cells[positionsToCheck[i].y][positionsToCheck[i].x];
      if (colorsToCheck.includes(color)) {
        if (colorsPresent.includes(color)) {
          repeat = true;
        } else {
          colorsPresent.push(color);
        }
      }
    }
    var all = true;
    for (var i=0;i<colorsToCheck.length;i++) {
      if (!colorsPresent.includes(colorsToCheck[i])) {
        all = false;
      }
    }
    if (!all || repeat) {
      return cellList;
    }
    return null;
  }
};

module.exports = Util;
