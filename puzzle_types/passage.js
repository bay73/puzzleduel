const util = require('./util');

const Checker = {
check:function(dimension, clues, data){
  // Create array
  var dim = util.parseDimension(dimension);
  var cells = util.create2DArray(dim.rows, dim.cols, false)
  var clue = util.create2DArray(dim.rows, dim.cols, "")
  var bottom = [];
  var right = [];
  var head = null;
  var tail = null;

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
    if (cells[pos.y]){
      if (value == "cross") {
        cells[pos.y][pos.x] = false;
      } else if (value == "black") {
        cells[pos.y][pos.x] = true;
        if (!head) {
          head = {x: pos.x, y: pos.y};
        } else {
          tail = {x: pos.x, y: pos.y};
        }
      } else {
        cells[pos.y][pos.x] = true;
        clue[pos.y][pos.x] = value;
      }
    }
  }
  var res = Checker.checkSnake(cells, head, tail);
  if (res.status != "OK") {
    return res;
  }
  var res = Checker.checkClues(res.body, clue);
  if (res.status != "OK") {
    return res;
  }
  return {status: "OK"};
},

checkClues: function(body, clue) {
  var currentClue = null;
  var currentCluePos = {};
  var direction = null;
  var currentLength = 0;
  for (var i=1; i < body.length-1; i++) {
    if (body[i].x==body[i+1].x) {
      var newDirection = 'v';
    } else {
      var newDirection = 'h';
    }
    if (newDirection == direction) {
      if (clue[body[i].y][body[i].x] != "") {
        if (currentClue != null) {
          if (currentClue != clue[body[i].y][body[i].x]) {
            return {status: "The clue is not correct" , errors: [util.coord(currentCluePos.x,currentCluePos.y), util.coord(body[i].x,body[i].y)]};
          }
        } else {
          currentClue = clue[body[i].y][body[i].x];
          currentCluePos = {x: body[i].x, y: body[i].y};
        }
      }
      currentLength++;
    } else {
      if (clue[body[i].y][body[i].x] != "") {
        return {status: "Path shouldn't turn in the cell with digit", errors: [util.coord(body[i].x,body[i].y)]};
      }
      if (currentClue != null) {
        if ((currentLength+1).toString() != currentClue) {
          return {status: "The clue is not correct" , errors: [util.coord(currentCluePos.x,currentCluePos.y)]};
        }
      }      
      currentLength = 1;
      direction = newDirection;
      currentClue = null;
    }
  }
  if (currentClue != null) {
    if ((currentLength+1).toString() != currentClue) {
      return {status: "The clue is not correct" , errors: [util.coord(currentCluePos.x,currentCluePos.y)]};
    }
  }      
  return {status: "OK"};
},
checkSnake: function(cells, head, tail) {
  var snake = util.create2DArray(cells.rows, cells.cols, 0);
  var length = 1;
  var current = head;
  var prev = head;
  var body = [];
  snake[head.y][head.x] = length;
  body[length] = {x: head.x, y:head.y};
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
      return {status: "Black cells should form single path without bifurcations", errors: [util.coord(current.x,current.y)]};
    }
    length++;
    snake[next.y][next.x] = length;
    body[length] = {x: next.x, y:next.y};
    prev = current;
    current = next;
  }
  for (var x = 0; x < snake.cols; x++) {
    for (var y = 0; y < snake.rows; y++) {
      if (cells[y][x] && snake[y][x] == 0) {
        return {status: "All black cells should be part of single path", errors: [util.coord(x,y)]};
      }
      if (snake[y][x] != 0) {
        if (x>0 && y>0 && snake[y-1][x-1] != 0 && Math.abs(snake[y-1][x-1] - snake[y][x]) > 2) {
          return {status: "Path shouldn't touch itself", errors: [util.coord(x,y), util.coord(x-1,y-1)]};
        }
        if (x<snake.cols-1 && y>0 && snake[y-1][x+1] != 0 && Math.abs(snake[y-1][x+1] - snake[y][x]) > 2) {
          return {status: "Path shouldn't touch itself", errors: [util.coord(x,y), util.coord(x+1,y-1)]};
        }
      }
    }
  }
  return {status: "OK", body: body};
},
};

module.exports = Checker;
