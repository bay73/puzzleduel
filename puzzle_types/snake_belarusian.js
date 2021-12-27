if (typeof util=="undefined") {
  var util = require('./util');
}

const Checker = {
check:function(dimension, clues, data){
  // Create array
  var dim = util.parseDimension(dimension);
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
    if (key=="areas") {
      areas = value;
    } else {
      var pos = util.parseCoord(key);
      if (clue[pos.y]){
        clue[pos.y][pos.x] = (value=="1");
      }
    }
  }
  var res = Checker.checkSnake(cells, clue, areas);
  if (res.status != "OK") {
    return res;
  }
  res = Checker.checkAreas(cells, areas);
  if (res.status != "OK") {
    return res;
  }
  return {status: "OK"};
},

checkSnake: function(cells, clues, areas) {
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
  var tail = current;
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
  var headCoord = util.coord(head.x,head.y);
  var tailCoord = util.coord(tail.x,tail.y);
  if (!clues[head.y][head.x]) {
    return {status: "Start and end of the snake should be in the shaded areas", errors: [headCoord]};
  }
  if (!clues[tail.y][tail.x]) {
    return {status: "Start and end of the snake should be in the shaded areas", errors: [tailCoord]};
  }
  for (var a=0; a<areas.length; a++) {
    var pos = util.parseCoord(areas[a][0]);
    if (clues[pos.y][pos.x]) {
      if (!areas[a].includes(headCoord) && !areas[a].includes(tailCoord)) {
        return {status: "Start and end of the snake should be in the shaded areas", errors: areas[a]};
      }
    }
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
checkAreas: function(cells, areas) {
  for (var a=0; a<areas.length; a++) {
    var cellsInArea = Checker.getCellsInArea(cells, areas[a]);
    if (cellsInArea.length != 3) {
      return {status: "Each outlines area should contain exactly three cells of the snake", errors: areas[a]};
    }
  }
  return {status: "OK"};
},
getCellsInArea: function(cells, area) {
  var res = [];
  for (var a=0;a<area.length;a++) {
    var pos = util.parseCoord(area[a]);
    if (cells[pos.y][pos.x]) {
      res.push(area[a]);
    }
  }
  return res;
},
};

module.exports = Checker;
