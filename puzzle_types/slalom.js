if (typeof util=="undefined") {
  var util = require('./util');
}

const Checker = {
check:function(dimension, clues, data){
  // Create array
  let dim = util.parseDimension(dimension);
  let cells = util.create2DArray(dim.rows, dim.cols, false)
  let clue = util.create2DArray(dim.rows+1, dim.cols+1, "")

  // Parse data.
  for (let [key, value] of Object.entries(data)) {
    let pos = util.parseCoord(key);
    if (cells[pos.y]){
      cells[pos.y][pos.x] = value;
    }
  }
  // Parse clues.
  for (let [key, value] of Object.entries(clues)) {
    if (key=="nodes") {
      for (const [nkey, nvalue] of Object.entries(value)) {
        let part = nkey.split("-");
        let coord = util.parseCoord(part[0]);
        if (typeof part[1]!="undefined") {
          let side = parseInt(part[1]);
          if (side==2) {
            coord.y++;
            coord.x++;
          } else if (side==1) {
            coord.x++;
          } else if (side==3) {
            coord.y++;
          }
        }
        clue[coord.y][coord.x] = nvalue;
      }
    }
  }
  let res = Checker.checkNoEmptyCells(cells);
  if (res.status != "OK") {
    return res;
  }
  res = Checker.checkClues(cells, clue);
  if (res.status != "OK") {
    return res;
  }
  res = Checker.checkLoop(cells);
  if (res.status != "OK") {
    return res;
  }
  return {status: "OK"};
},
checkNoEmptyCells: function(cells) {
  let coord = util.findWrongValue(cells, ["\\", "/"]);
  if (coord){
    return {
      status: "All cells should be filled",
      errors: [coord]
    };
  }
  return {status: "OK"};
},
ifCell: function(cells, x, y, value) {
  return x>=0 && x<cells.cols && y>=0 && y<cells.rows && cells[y][x] == value;
},
checkClues: function(cells, clue) {
  for (let x = 0; x < clue.cols; x++) {
    for (let y = 0; y < clue.rows; y++) {
      if (clue[y][x]) {
        let count = 0;
        if (Checker.ifCell(cells, x-1, y-1,'\\')) count++;
        if (Checker.ifCell(cells, x-1, y,'/')) count++;
        if (Checker.ifCell(cells, x, y-1,'/')) count++;
        if (Checker.ifCell(cells, x, y,'\\')) count++;
        if (count.toString() != clue[y][x]) {
          let errors = [];
          if (x>0 && y>0) {
            errors.push(util.coord(x-1,y-1));
          }
          if (x>0 && y<cells.rows) {
            errors.push(util.coord(x-1,y));
          }
          if (x<cells.cols && y>0) {
            errors.push(util.coord(x,y-1));
          }
          if (x<cells.cols && y<cells.rows) {
            errors.push(util.coord(x,y));
          }
          return {status: "The clue is not correct" , errors: errors};
        }
      }
    }
  }
  return {status: "OK"};
},
checkLoop: function(cells) {
  let paint = util.create2DArray(cells.rows, cells.cols, null);
  let toProcess = [];
  function mark(x, y, s) {
    if (x>=0 && x<paint.cols && y>=0 && y<paint.rows && s>=0 && s<4) {
      if (!paint[y][x][s]) {
        paint[y][x][s] = true;
        toProcess.push({x:x, y:y, s:s});
      }
    }
  }
  for (let x = 0; x < paint.cols; x++) {
    for (let y = 0; y < paint.rows; y++) {
      paint[y][x] = [false, false, false, false];
      if (x==0) {
        mark(x,y,3);
      }
      if (x==paint.cols-1) {
        mark(x,y,1);
      }
      if (y==0) {
        mark(x,y,0);
      }
      if (y==paint.rows-1) {
        mark(x,y,2);
      }
    }
  }
  while(toProcess.length > 0) {
    let next = toProcess.shift();
    if (next.s==0) {
      mark(next.x,next.y-1,2);
      if (cells[next.y][next.x]=='\\') {
        mark(next.x,next.y,1);
      }
      if (cells[next.y][next.x]=='/') {
        mark(next.x,next.y,3);
      }
    }
    if (next.s==1) {
      mark(next.x+1,next.y,3);
      if (cells[next.y][next.x]=='\\') {
        mark(next.x,next.y,0);
      }
      if (cells[next.y][next.x]=='/') {
        mark(next.x,next.y,2);
      }
    }
    if (next.s==2) {
      mark(next.x,next.y+1,0);
      if (cells[next.y][next.x]=='\\') {
        mark(next.x,next.y,3);
      }
      if (cells[next.y][next.x]=='/') {
        mark(next.x,next.y,1);
      }
    }
    if (next.s==3) {
      mark(next.x-1,next.y,1);
      if (cells[next.y][next.x]=='\\') {
        mark(next.x,next.y,2);
      }
      if (cells[next.y][next.x]=='/') {
        mark(next.x,next.y,0);
      }
    }
  }
  let unMarked = [];
  for (let x = 0; x < paint.cols; x++) {
    for (let y = 0; y < paint.rows; y++) {
      if (!paint[y][x][0] || !paint[y][x][1] || !paint[y][x][2] || !paint[y][x][3]) {
        unMarked.push(util.coord(x,y));
      }
    }
  }
  if (unMarked.length > 0) {
    return {
      status: "Diagonal lines shouldn't form a loop",
      errors: unMarked
    };
  }
  return {status: "OK"};
}
};

module.exports = Checker;
