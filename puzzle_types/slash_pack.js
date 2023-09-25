if (typeof util=="undefined") {
  var util = require('./util');
}

var Checker = {
check:function(dimension, clues, data){
  // Create array
  var part = dimension.split("-");
  var letters = [];
  for (var i=0;i<part[1].length;i++) {
     letters.push(part[1].charAt(i));
  }
  var dim = util.parseDimension(part[0]);
  let cells = util.create2DArray(dim.rows, dim.cols, "")

  // Parse data.
  for (let [key, value] of Object.entries(data)) {
    let pos = util.parseCoord(key);
    if (cells[pos.y]){
      cells[pos.y][pos.x] = value;
    }
  }
  // Parse clues.
  for (let [key, value] of Object.entries(clues)) {
    let pos = util.parseCoord(key);
    if (cells[pos.y]){
      cells[pos.y][pos.x] = value;
    }
  }
  let res = Checker.checkAreas(cells, letters);
  if (res.status != "OK") {
    return res;
  }
  return {status: "OK"};
},
checkAreas: function(cells, letters) {
  let paint = util.create2DArray(cells.rows, cells.cols, null);
  let toProcess = [];
  function mark(x, y, s, color) {
    if (x>=0 && x<paint.cols && y>=0 && y<paint.rows && s>=0 && s<4) {
      if (paint[y][x][s] == 0) {
        paint[y][x][s] = color;
        toProcess.push({x:x, y:y, s:s});
      }
    }
  }
  for (let x = 0; x < paint.cols; x++) {
    for (let y = 0; y < paint.rows; y++) {
      paint[y][x] = [0, 0, 0, 0];
    }
  }
  let color = 0;
  while (true) {
    let start = null;
    lookforstart:
    for (let x = 0; x < paint.cols; x++) {
      for (let y = 0; y < paint.rows; y++) {
        for (let s = 0; s < 4; s++) {
          if (paint[y][x][s]==0) {
            start = {x:x, y:y, s:s};
            break lookforstart;
          }
        }
      }
    }
    if (start==null) {
      break;
    }
    color++;
    mark(start.x, start.y, start.s, color);
    while(toProcess.length > 0) {
      let next = toProcess.shift();
      if (next.s==0) {
        mark(next.x,next.y-1,2,color);
        if (cells[next.y][next.x]=='\\') {
          mark(next.x,next.y,1,color);
        } else if (cells[next.y][next.x]=='/') {
          mark(next.x,next.y,3,color);
        } else {
          mark(next.x,next.y,1,color);
          mark(next.x,next.y,2,color);
          mark(next.x,next.y,3,color);
        }
      }
      if (next.s==1) {
        mark(next.x+1,next.y,3,color);
        if (cells[next.y][next.x]=='\\') {
          mark(next.x,next.y,0,color);
        } else if (cells[next.y][next.x]=='/') {
          mark(next.x,next.y,2,color);
        } else {
          mark(next.x,next.y,0,color);
          mark(next.x,next.y,2,color);
          mark(next.x,next.y,3,color);
        }
      }
      if (next.s==2) {
        mark(next.x,next.y+1,0,color);
        if (cells[next.y][next.x]=='\\') {
          mark(next.x,next.y,3,color);
        } else if (cells[next.y][next.x]=='/') {
          mark(next.x,next.y,1,color);
        } else {
          mark(next.x,next.y,0,color);
          mark(next.x,next.y,1,color);
          mark(next.x,next.y,3,color);
        }
      }
      if (next.s==3) {
        mark(next.x-1,next.y,1,color);
        if (cells[next.y][next.x]=='\\') {
          mark(next.x,next.y,2,color);
        } else if (cells[next.y][next.x]=='/') {
          mark(next.x,next.y,0,color);
        } else {
          mark(next.x,next.y,0,color);
          mark(next.x,next.y,1,color);
          mark(next.x,next.y,2,color);
        }
      }
    }
  }
  for (let c = 1; c <= color; c++) {
    let lettersPerArea = [];
    var repeat = false;
    let areaCells = []
    for (let x = 0; x < cells.cols; x++) {
      for (let y = 0; y < cells.rows; y++) {
        if (paint[y][x][0]==c || paint[y][x][1]==c || paint[y][x][2]==c || paint[y][x][3]==c) {
          areaCells.push(util.coord(x,y));
          if (cells[y][x] != "" && cells[y][x] != "/" && cells[y][x] != "\\") {
            if (lettersPerArea.includes(cells[y][x])) {
              repeat = true;
            } else {
              lettersPerArea.push(cells[y][x]);
            }
          }
        }
      }
    }
    var all = true;
    for (var i=0;i<letters.length;i++) {
      if (!lettersPerArea.includes(letters[i])) {
        all = false;
      }
    }
    if (!all || repeat) {
      return {
        status: "Each area should contain all letters exactly once",
        errors: areaCells
      };
    }
  }
  return {status: "OK"};
},
};

module.exports = Checker;
