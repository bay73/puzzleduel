if (typeof util=="undefined") {
  var util = require('./util');
}

var Checker = {
check:function(dimension, clues, data){
  // Create array
  var dim = util.parseDimension(dimension);
  let clue = util.create2DArray(dim.rows, dim.cols, "")
  let edges = util.create2DArray(dim.rows, dim.cols, "")
  let cells = util.create2DArray(dim.rows, dim.cols, false)

  for (var y = 0; y < dim.rows; y++) {
    for (var x = 0; x< dim.cols; x++) {
      edges[y][x] = [false, false, false, false];
    }
  }

  // Parse data.
  for (var [key, value] of Object.entries(clues)) {
    const pos = util.parseCoord(key);
    if (clue[pos.y]){
      clue[pos.y][pos.x] = value;
    }
  }

  if (!data.edges){
    return {status: "There should be single loop without bifurcations"};
  }

  for (const [key, value] of Object.entries(data.edges)) {
    const coord = key.split("-")
    const pos = util.parseCoord(key);
    const s = parseInt(coord[1]);
    if (s>=0 && s<4 && pos.x>=0 && pos.x<dim.cols && pos.y>=0 && pos.y<dim.rows) {
      edges[pos.y][pos.x][s] = (value=='1');
    }  
  }

  for (var y = 0; y < dim.rows; y++) {
    let inner = false;
    for (var x = dim.cols - 1; x>=0; x--) {
      if (edges[y][x][1]) {
        inner = !inner;
      }
      cells[y][x] = inner;
    }
  }

  if (!util.checkConnected(cells, [true])) {
    return {status: "There should be single loop without bifurcations"};
  }
  
  if (!Checker.checkOuterConnectedToEdge(cells)) {
    return {status: "There should be single loop without bifurcations"};
  }

  if (!Checker.checkEdges(cells, edges)) {
    return {status: "There should be single loop without bifurcations"};
  }

  res = Checker.checkClues(cells, clue);
  if (res.status != "OK") {
    return res;
  }

  return {status: "OK"};
},
checkOuterConnectedToEdge: function(cells) {
  var filled = util.create2DArray(cells.rows, cells.cols, false)
  for (var i=0; i<cells.cols; i++) {
    util.fillConnected(cells, {x:i, y:0}, [false], filled);
    util.fillConnected(cells, {x:i, y:cells.rows - 1}, [false], filled);
  }
  for (var j=0; j<cells.rows; j++) {
    util.fillConnected(cells, {x:0, y:j}, [false], filled);
    util.fillConnected(cells, {x:cells.cols - 1, y:j}, [false], filled);
  }
  for (var y = 0; y < cells.rows; y++) {
    for (var x = 0; x < cells.cols; x++) {
      if (!cells[y][x] && !filled[y][x]){
        return false;
      };
    }
  }
  return true;
},
checkEdges: function(cells, edges) {
  for (var y = 0; y < cells.rows; y++) {
    for (var x = 0; x< cells.cols; x++) {
      if (y==0) {
        if (cells[y][x] != edges[y][x][0]) return false;
      }
      if (x==0) {
        if (cells[y][x] != edges[y][x][3]) return false;
      }
      if (y==cells.rows-1) {
        if (cells[y][x] != edges[y][x][2]) return false;
      } else {
        if ((cells[y][x]!=cells[y+1][x]) != edges[y][x][2]) return false;
      }
      if (x==cells.cols-1) {
        if (cells[y][x] != edges[y][x][1]) return false;
      } else {
        if ((cells[y][x]!=cells[y][x+1]) != edges[y][x][1]) return false;
      }
    }
  }
  return true;
},
checkClues: function(cells, clue) {
  for (var y = 0; y < cells.rows; y++) {
    for (var x = 0; x < cells.cols; x++) {
      if (clue[y][x]!=""){
        let count = Checker.countNeighbours(cells, x, y, false)
        if (count.toString() != clue[y][x]) {
          return {status: "The clue is not correct" , errors: [util.coord(x,y)]};
        }
      }
    }
  }
  return {status: "OK"};
},
countNeighbours: function(cells, x, y, value) {
  let count = 0;
  if (Checker.isInner(x-1,y,cells)==value) count++;
  if (Checker.isInner(x+1,y,cells)==value) count++;
  if (Checker.isInner(x,y-1,cells)==value) count++;
  if (Checker.isInner(x,y+1,cells)==value) count++;
  return count;
},
isInner :function(x, y, cells) {
  if (x>=0 && x<cells.cols && y>=0 && y<cells.rows) {
    return cells[y][x]
  }
  return false;
}
};

module.exports = Checker;
