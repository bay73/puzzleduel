if (typeof util=="undefined") {
  var util = require('./util');
}

var Checker = {
check:function(dimension, clues, data){
  // Create array
  var dim = util.parseDimension(dimension);
  var cells = util.create2DArray(dim.rows, dim.cols, false)
  var cluecells = util.create2DArray(dim.rows, dim.cols, "")
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
    var pos = util.parseCoord(key);
    if (cells[pos.y]){
      cells[pos.y][pos.x] = (value == "black");
      if (value == "black") {
        if (!head) {
          head = {x: pos.x, y: pos.y};
        } else {
          tail = {x: pos.x, y: pos.y};
        }
      } else {
        if (cluecells[pos.y]){
          cluecells[pos.y][pos.x] = value;
        }
      }  
    }
  }

  var res = Checker.checkMinesClues(cells, cluecells);
  if (res.status != "OK") {
    return res;
  }
  var res = Checker.checkSnake(cells, head, tail);
  if (res.status != "OK") {
    return res;
  }
  return {status: "OK"};
},

checkMinesClues: function(cells, cluecells) {
  for (var y = 0; y < cells.rows; y++) {
    for (var x = 0; x < cells.cols; x++) {
      if (cluecells[y][x]!="" && cluecells[y][x]!="cross"){
        if (!Checker.checkMinesClue(cluecells[y][x], {x:x, y:y}, cells)) {
          return {status: "The clue is not correct" , errors: [util.coord(x,y)]};
        }
      }
    }
  }
  return {status: "OK"};
},

checkMinesClue: function(clue, position, cells) {
  var neighbour = [{y:1,x:0}, {y:1,x:1}, {y:0,x:1}, {y:-1,x:1}, {y:-1,x:0}, {y:-1,x:-1}, {y:0,x:-1}, {y:1,x:-1}]
  var mineCount = 0;
  for (var i=0;i<8;i++) {
    var newX = position.x + neighbour[i].x;
    var newY = position.y + neighbour[i].y;
    var cell = null;
    if (newY >=0 && newY < cells.rows && newX >=0 && newX < cells.cols) {
      if (cells[newY][newX]) mineCount++;
    }
  }
  return (clue == mineCount.toString())
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
