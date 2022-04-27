if (typeof util=="undefined") {
  var util = require('./util');
}

var Checker = {
check:function(dimension, clues, data){
  // Create array
  var dim = util.parseDimension(dimension);
  var cells = util.create2DArray(dim.rows, dim.cols, false)
  var bottom = [];
  var right = [];
  var head = null;
  var tail = null;

  // Parse data.
  for (var [key, value] of Object.entries(data)) {
    var pos = util.parseCoord(key);
    if (cells[pos.y]){
      cells[pos.y][pos.x] = (value == "black");
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
      if (cells[pos.y]){
        cells[pos.y][pos.x] = (value == "black");
        if (value == "black") {
          if (!head) {
            head = {x: pos.x, y: pos.y};
          } else {
            tail = {x: pos.x, y: pos.y};
          }
        }
      }
    }
  }
  var res = Checker.checkSnake(cells, head, tail);
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
  return {status: "OK"};
},

checkColumnClues: function(cells, clues) {
  for (var x=0; x < cells.cols; x++) {
    if (clues[x] && clues[x] != "white") {
      res = Checker.checkColumnClue(cells, clues[x], x);
      if (res) {
        return {status: "Wrong number of blackened cells in the column", errors: res};
      }
    }
  }
  return {status: "OK"};
},
checkColumnClue: function(cells, clue, col) {
  var blackCount = 0;
  var cellList = [];
  for (var y=0; y < cells.rows; y++) {
    cellList.push(util.coord(col, y));
    if (cells[y][col]) blackCount++;
  }
  if (blackCount.toString() != clue) return cellList;
  return null;
},
checkRowClues: function(cells, clues) {
  for (var y=0; y < cells.rows; y++) {
    if (clues[y] && clues[y] != "white") {
      res = Checker.checkRowClue(cells, clues[y], y);
      if (res) {
        return {status: "Wrong number of blackened cells in the row", errors: res};
      }
    }
  }
  return {status: "OK"};
},
checkRowClue: function(cells, clue, row) {
  var blackCount = 0;
  var cellList = [];
  for (var x=0; x < cells.cols; x++) {
    cellList.push(util.coord(x, row));
    if (cells[row][x]) blackCount++;
  }
  if (blackCount.toString() != clue) return cellList;
  return null;
},
checkSnake: function(cells, head, tail) {
  var snake = util.create2DArray(cells.rows, cells.cols, 0);
  var length = 1;
  var current = head;
  var prev = head;
  snake[head.y][head.x] = length;
  while (current.x != tail.x || current.y != tail.y){
    var next = null;
    var nextCount = 0;
    if (current.x > 0 && cells[current.y][current.x-1] && (current.x-1 != prev.x || current.y != prev.y)) {
      nextCount++;
      next = {x: current.x-1, y: current.y};
    }
    if (current.x < cells.cols-1 && cells[current.y][current.x+1] && (current.x+1 != prev.x || current.y != prev.y)) {
      nextCount++;
      next = {x: current.x+1, y: current.y};
    }
    if (current.y > 0 && cells[current.y-1][current.x] && (current.x != prev.x || current.y-1 != prev.y)) {
      nextCount++;
      next = {x: current.x, y: current.y-1};
    }
    if (current.y < cells.rows-1 && cells[current.y+1][current.x] && (current.x != prev.x || current.y+1 != prev.y)) {
      nextCount++;
      next = {x: current.x, y: current.y+1};
    }
    if (nextCount != 1) {
      return {status: "Black cells should form single snake without bifurcations", errors: [util.coord(current.x,current.y)]};
    }
    length++;
    snake[next.y][next.x] = length;
    prev = current;
    current = next;
  }
  for (var x = 0; x < snake.cols; x++) {
    for (var y = 0; y < snake.rows; y++) {
      if (cells[y][x] && snake[y][x] == 0) {
        return {status: "All black cells should be part of single snake", errors: [util.coord(x,y)]};
      }
      if (snake[y][x] != 0) {
        if (x>0 && y>0 && snake[y-1][x-1] != 0 && Math.abs(snake[y-1][x-1] - snake[y][x]) > 2) {
          return {status: "Snake shouldn't touch itself", errors: [util.coord(x,y), util.coord(x-1,y-1)]};
        }
        if (x<snake.cols-1 && y>0 && snake[y-1][x+1] != 0 && Math.abs(snake[y-1][x+1] - snake[y][x]) > 2) {
          return {status: "Snake shouldn't touch itself", errors: [util.coord(x,y), util.coord(x+1,y-1)]};
        }
      }
    }
  }
  return {status: "OK"};
},
};

module.exports = Checker;
