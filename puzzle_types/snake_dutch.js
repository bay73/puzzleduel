if (typeof util=="undefined") {
  var util = require('./util');
}

const Checker = {
check:function(dimension, clues, data){
  // Create array
  var part = dimension.split("-");
  var snakeLength = part[1]?parseInt(part[1]):45;
  var dim = util.parseDimension(part[0]);
  var cells = util.create2DArray(dim.rows, dim.cols, false)
  var clue = util.create2DArray(dim.rows, dim.cols, false)

  // Parse data.
  for (var [key, value] of Object.entries(data)) {
    var pos = util.parseCoord(key);
    if (cells[pos.y]){
      cells[pos.y][pos.x] = (value == "1");
    }
  }
  // Parse clues.
  for (var [key, value] of Object.entries(clues)) {
    var pos = util.parseCoord(key);
    if (clue[pos.y]){
      clue[pos.y][pos.x] = value;
    }
  }
  var res = Checker.checkSnake(cells, snakeLength);
  if (res.status != "OK") {
    return res;
  }
  res = Checker.checkClues(cells, clue);
  if (res.status != "OK") {
    return res;
  }
  return {status: "OK"};
},

checkSnake: function(cells, snakeLength) {
  var snake = util.create2DArray(cells.rows, cells.cols, 0);
  var length = 1;
  var head = Checker.findHead(cells);
  if (!head) {
    return {status: "Snake should have a head and a tail", errors: []};
  }
  var current = head;
  var prev = head;
  snake[head.y][head.x] = length;
  while (true){
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
    if (nextCount == 0) {
      break;
    }
    if (nextCount > 1) {
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
  if (length != snakeLength) {
    return {status: "The length of the snake should be exactly equal to the given value", errors: []};
  }
  return {status: "OK"};
},
findHead: function(cells) {
  for (var x = 0; x < cells.cols; x++) {
    for (var y = 0; y < cells.rows; y++) {
      if (cells[y][x] && Checker.countNeighbours(cells, x, y)==1) {
        return {x: x, y: y};
      }
    }
  }
  return null;
},
countNeighbours: function(cells, x, y) {
  var count = 0;
  if (Checker.ifCell(cells, x-1, y)) count++;
  if (Checker.ifCell(cells, x+1, y)) count++;
  if (Checker.ifCell(cells, x, y-1)) count++;
  if (Checker.ifCell(cells, x, y+1)) count++;
  return count;
},
ifCell: function(cells, x, y) {
  return x>=0 && x<cells.cols && y>=0 && y<cells.rows && cells[y][x];
},
checkClues: function(cells, clue) {
  for (var x = 0; x < clue.cols; x++) {
    for (var y = 0; y < clue.rows; y++) {
      if (clue[y][x]=="cross" && cells[y][x]) {
        return {status: "Snake can't go through crossed cell", errors: [util.coord(x,y)]};
      }
      if (clue[y][x]=="black_circle") {
        var vCount = 0;
        var hCount = 0;
        if (Checker.ifCell(cells, x-1, y)) hCount++;
        if (Checker.ifCell(cells, x+1, y)) hCount++;
        if (Checker.ifCell(cells, x, y-1)) vCount++;
        if (Checker.ifCell(cells, x, y+1)) vCount++;
        if ( !cells[y][x] || hCount != 1 || vCount != 1) {
          return {status: "Snake should turn in the cell with black circle", errors: [util.coord(x,y)]};
        }
      }
      if (clue[y][x]=="white_circle") {
        var vCount = 0;
        var hCount = 0;
        if (Checker.ifCell(cells, x-1, y)) hCount++;
        if (Checker.ifCell(cells, x+1, y)) hCount++;
        if (Checker.ifCell(cells, x, y-1)) vCount++;
        if (Checker.ifCell(cells, x, y+1)) vCount++;
        if ( !cells[y][x] || (hCount != 2 && vCount != 2)) {
          return {status: "Snake should go straight through the cell with white circle", errors: [util.coord(x,y)]};
        }
      }
    }
  }
  return {status: "OK"};
}
};

module.exports = Checker;
