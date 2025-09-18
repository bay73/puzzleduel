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
        cells[y][x] = {circle: false, clue: null}
      }
    }
  }
  
  for (const [key, value] of Object.entries(data)) {
    var x = key.charCodeAt(0) - 'a'.charCodeAt(0);
    var y = parseInt(key.substring(1)) - 1;
    if (cells[y] && cells[y][x]) {
      cells[y][x].circle = (value == '1');
    }
  }
  
  for (const [key, value] of Object.entries(clues)) {
    var x = key.charCodeAt(0) - 'a'.charCodeAt(0);
    var y = parseInt(key.substring(1)) - 1;
    if (cells[y] && cells[y][x]) {
      cells[y][x].clue = value;
      cells[y][x].circle = false;
    }
  }


  for (var y = 0; y < dim.rows + dim.cols - 1; y++) {
    for (var x = 0; x < 2*dim.cols - 1; x++) {
      if (y - x < dim.rows && x - y < dim.cols) {
        if (cells[y][x].clue) {
          let up = Checker.countUp(dim, cells, x, y)
          let down = Checker.countDown(dim, cells, x, y)
          let upLeft = Checker.countUpLeft(dim, cells, x, y)
          let downRight = Checker.countDownRight(dim, cells, x, y)
          let upRight = Checker.countUpRight(dim, cells, x, y)
          let downLeft = Checker.countDownLeft(dim, cells, x, y)
          if (cells[y][x].clue == "arrow_u") {
            if (up <= down || up <= upLeft || up <= upRight || up <= downLeft || up <= downRight) {
              return {
                status: "The arrow should point to the most circles",
                errors: [util.coord(x, y)]
              };
            }
          }
          if (cells[y][x].clue == "arrow_d") {
            if (down <= up || down <= upLeft || down <= upRight || down <= downLeft || down <= downRight) {
              return {
                status: "The arrow should point to the most circles",
                errors: [util.coord(x, y)]
              };
            }
          }
          if (cells[y][x].clue == "arrow_ur") {
            if (upRight <= down || upRight <= upLeft || upRight <= up || upRight <= downLeft || upRight <= downRight) {
              return {
                status: "The arrow should point to the most circles",
                errors: [util.coord(x, y)]
              };
            }
          }
          if (cells[y][x].clue == "arrow_ul") {
            if (upLeft <= down || upLeft <= up || upLeft <= upRight || upLeft <= downLeft || upLeft <= downRight) {
              return {
                status: "The arrow should point to the most circles",
                errors: [util.coord(x, y)]
              };
            }
          }
          if (cells[y][x].clue == "arrow_dr") {
            if (downRight <= down || downRight <= upLeft || downRight <= upRight || downRight <= downLeft || downRight <= up) {
              return {
                status: "The arrow should point to the most circles",
                errors: [util.coord(x, y)]
              };
            }
          }
          if (cells[y][x].clue == "arrow_dl") {
            if (downLeft <= down || downLeft <= upLeft || downLeft <= upRight || downLeft <= up || downLeft <= downRight) {
              return {
                status: "The arrow should point to the most circles",
                errors: [util.coord(x, y)]
              };
            }
          }
        }
      }
    }
  }
 
  return {status: "OK"};
},
countUp: function(dim, cells, x, y){
  let count = 0;
  for (var i=0; i<y; i++) {
    if (cells[i] && cells[i][x]) {
      if (cells[i][x].circle) {
        count++;
      }
    }
  }
  return count;
},
countDown: function(dim, cells, x, y){
  let count = 0;
  for (var i=y+1; i<2*dim.rows + dim.cols - 1; i++) {
    if (cells[i] && cells[i][x]) {
      if (cells[i][x].circle) {
        count++;
      }
    }
  }
  return count;
},
countUpLeft: function(dim, cells, x, y){
  let count = 0;
  for (var i=0; i<y; i++) {
    if (cells[i] && cells[i][x+i-y]) {
      if (cells[i][x+i-y].circle) {
        count++;
      }
    }
  }
  return count;
},
countUpRight: function(dim, cells, x, y){
  let count = 0;
  for (var i=x+1; i<2*dim.cols - 1; i++) {
    if (cells[y] && cells[y][i]) {
      if (cells[y][i].circle) {
        count++;
      }
    }
  }
  return count;
},
countDownRight: function(dim, cells, x, y){
  let count = 0;
  for (var i=y+1; i<2*dim.rows + dim.cols - 1; i++) {
    if (cells[i] && cells[i][x+i-y]) {
      if (cells[i][x+i-y].circle) {
        count++;
      }
    }
  }
  return count;
},
countDownLeft: function(dim, cells, x, y){
  let count = 0;
  for (var i=0; i<x; i++) {
    if (cells[y] && cells[y][i]) {
      if (cells[y][i].circle) {
        count++;
      }
    }
  }
  return count;
},
};

module.exports = Checker;
