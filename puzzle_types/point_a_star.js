const util = require('./util');

const Checker = {
check:function(dimension, clues, data){
  // Create array
  var dim = util.parseDimension(dimension);
  var cells = util.create2DArray(dim.rows, dim.cols, false)
  var cluesCells = util.create2DArray(dim.rows, dim.cols, "")
  var bottom = [];
  var right = [];

  // Parse data.
  for (var [key, value] of Object.entries(data)) {
    var pos = util.parseCoord(key);
    if (cells[pos.y]){
      cells[pos.y][pos.x]= (value == "star");
    }
  }
  // Parse clues.
  for (var [key, value] of Object.entries(clues)) {
    if (key=="bottom") {
      bottom = value;
    } else if (key=="right") {
      right = value;
    } else {
      var pos = util.parseCoord(key);
      if (cluesCells[pos.y]){
        cluesCells[pos.y][pos.x] = value;
        cells[pos.y][pos.x] = false;
      }
    }
  }
  var res = Checker.checkTouch(cells);
  if (res.status != "OK") {
    return res;
  }
  var res = Checker.checkColumnClues(cells, bottom);
  if (res.status != "OK") {
    return res;
  }
  var res = Checker.checkRowClues(cells, right);
  if (res.status != "OK") {
    return res;
  }
  var res = Checker.checkArrows(cluesCells, cells);
  if (res.status != "OK") {
    return res;
  }
  return {status: "OK"};
},

checkTouch: function(cells) {
  for (var y = 0; y < cells.rows; y++) {
    for (var x = 0; x < cells.cols; x++) {
      if (cells[y][x]) {
        var touch = null;
        if(y>0 && cells[y-1][x]) touch = util.coord(x,y-1);
        if(x>0 && cells[y][x-1]) touch = util.coord(x-1,y);
        if(y>0 && x>0 && cells[y-1][x-1]) touch = util.coord(x-1,y-1);
        if(y>0 && x<cells.cols-1 && cells[y-1][x+1]) touch = util.coord(x+1,y-1);
        if(y<cells.rows-1 && x>0 && cells[y+1][x-1]) touch = util.coord(x-1,y+1);
      }
      if (touch!=null) {
        return {status: "Cells with stars shouldn't touch", errors: [touch, util.coord(x,y)]}
      }
    }
  }
  return {status: "OK"};
},
checkColumnClues: function(cells, clues) {
  for (var x=0; x < cells.cols; x++) {
    if (clues[x] && clues[x] != "white") {
      res = Checker.checkColumnClue(cells, clues[x], x);
      if (res) {
        return {status: "Wrong number of stars in the column", errors: res};
      }
    }
  }
  return {status: "OK"};
},
checkColumnClue: function(cells, clue, col) {
  var starCount = 0;
  var cellList = [];
  for (var y=0; y < cells.rows; y++) {
    cellList.push(util.coord(col, y));
    if (cells[y][col]) starCount++;
  }
  if (starCount.toString() != clue) return cellList;
  return null;
},
checkRowClues: function(cells, clues) {
  for (var y=0; y < cells.rows; y++) {
    if (clues[y] && clues[y] != "white") {
      res = Checker.checkRowClue(cells, clues[y], y);
      if (res) {
        return {status: "Wrong number of stars in the row", errors: res};
      }
    }
  }
  return {status: "OK"};
},
checkRowClue: function(cells, clue, row) {
  var starCount = 0;
  var cellList = [];
  for (var x=0; x < cells.cols; x++) {
    cellList.push(util.coord(x, row));
    if (cells[row][x]) starCount++;
  }
  if (starCount.toString() != clue) return cellList;
  return null;
},
checkArrows: function(clues, cells) {
  for (var y = 0; y < cells.rows; y++) {
    for (var x = 0; x < cells.cols; x++) {
      if (clues[y][x] && clues[y][x]!="white"){
        if (!Checker.checkArrow(clues[y][x], {x:x, y:y}, cells)) {
          return {status: "The arrow should point to one star" , errors: [util.coord(x,y)]};
        }
      }
    }
  }
  return {status: "OK"};
},
checkArrow: function(clue, position, cells) {
  var directions = {
    "arrow_u": {y:-1,x:0},
    "arrow_ur": {y:-1,x:1},
    "arrow_r": {y:0,x:1},
    "arrow_dr": {y:1,x:1},
    "arrow_d": {y:1,x:0},
    "arrow_dl": {y:1,x:-1},
    "arrow_l": {y:0,x:-1},
    "arrow_ul": {y:-1,x:-1},
  }
  var starCount = 0;
  var direction = directions[clue];
  for (var i=0;i<Math.max(cells.rows, cells.cols);i++) {
    var newX = position.x + direction.x * i;
    var newY = position.y + direction.y * i;
    if (newY >=0 && newY < cells.rows && newX >=0 && newX < cells.cols) {
      if (cells[newY][newX]) starCount++;
    }
  }
  return (starCount==1)
},
};

module.exports = Checker;
