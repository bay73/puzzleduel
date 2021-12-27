if (typeof util=="undefined") {
  var util = require('./util');
}

const Checker = {

check:function(dimension, clues, data){
  let dim = util.parseDimension(dimension);
  let cells = util.create2DArray(dim.rows, dim.cols, false)
  let trees = util.create2DArray(dim.rows, dim.cols, false)
  var bottom = [];
  var right = [];

  // Parse data.
  for (var [key, value] of Object.entries(data)) {
    var pos = util.parseCoord(key);
    if (cells[pos.y]){
      cells[pos.y][pos.x] = (value == "1");
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
      if (value.startsWith("tree")){
        cells[pos.y][pos.x] = false;
        trees[pos.y][pos.x] = true;
      }
    }
  }
  var res = Checker.checkNoTouch(cells);
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
  var res = Checker.checkLinks(cells, trees);
  if (res.status != "OK") {
    return res;
  }
  return {status: "OK"};
},

checkNoTouch: function(cells) {
  var res = Checker.findTouch(cells);
  if (res){
    return {status: "Cells with tents cannot share a point", errors: res};
  }
  return {status: "OK"};
},
findTouch: function(cells) {
  for (var y = 0; y < cells.rows; y++) {
    for (var x = 0; x < cells.cols; x++) {
      if (cells[y][x]) {
        if (Checker.ifCell(cells, x, y+1)){
          return [util.coord(x,y), util.coord(x,y+1)];
        }
        if (Checker.ifCell(cells,x-1,y+1)){
          return [util.coord(x,y), util.coord(x-1,y+1)];
        }
        if (Checker.ifCell(cells, x+1, y+1)){
          return [util.coord(x,y), util.coord(x+1,y+1)];
        }
        if (Checker.ifCell(cells, x+1, y)){
          return [util.coord(x,y), util.coord(x+1,y)];
        }
      }
    }
  }
  return null;
},
ifCell: function(cells, x, y) {
  return x>=0 && x<cells.cols && y>=0 && y<cells.rows && cells[y][x];
},
checkColumnClues: function(cells, clues) {
  for (var x=0; x < cells.cols; x++) {
    if (clues[x] && clues[x] != "white") {
      res = Checker.checkColumnClue(cells, clues[x], x);
      if (res) {
        return {status: "Wrong number of tents in the column", errors: res};
      }
    }
  }
  return {status: "OK"};
},
checkColumnClue: function(cells, clue, col) {
  var tentCount = 0;
  var cellList = [];
  for (var y=0; y < cells.rows; y++) {
    cellList.push(util.coord(col, y));
    if (cells[y][col]) tentCount++;
  }
  if (tentCount.toString() != clue) return cellList;
  return null;
},
checkRowClues: function(cells, clues) {
  for (var y=0; y < cells.rows; y++) {
    if (clues[y] && clues[y] != "white") {
      res = Checker.checkRowClue(cells, clues[y], y);
      if (res) {
        return {status: "Wrong number of tents in the row", errors: res};
      }
    }
  }
  return {status: "OK"};
},
checkRowClue: function(cells, clue, row) {
  var tentCount = 0;
  var cellList = [];
  for (var x=0; x < cells.cols; x++) {
    cellList.push(util.coord(x, row));
    if (cells[row][x]) tentCount++;
  }
  if (tentCount.toString() != clue) return cellList;
  return null;
},
checkLinks: function(tents, trees) {
  var used = util.create2DArray(tents.rows, tents.cols, false);
  for (var y = 0; y < tents.rows; y++) {
    for (var x = 0; x < tents.cols; x++) {
      if (!used[y][x] && tents[y][x]) {
        area = {cells:[], treeCount: 0, tentCount: 0};
        Checker.markTent({x: x, y:y}, tents, trees, used, area);
        var res = Checker.checkArea(area);
        if (res.status != "OK") {
          return res;
        }
      }
      if (!used[y][x] && trees[y][x]) {
        area = {cells:[], treeCount: 0, tentCount: 0};
        Checker.markTree({x: x, y:y}, tents, trees, used, area);
        var res = Checker.checkArea(area);
        if (res.status != "OK") {
          return res;
        }
      }
    }
  }
  return {status: "OK"};
},
markTent: function(pos, tents, trees, used, area) {
  if (used[pos.y][pos.x]) {
    return;
  }
  area.tentCount++;
  area.cells.push(util.coord(pos.x, pos.y));
  used[pos.y][pos.x]=true;
  if (pos.x>0 && trees[pos.y][pos.x-1]) {
    Checker.markTree({x: pos.x-1, y: pos.y}, tents, trees, used, area)
  }
  if (pos.x<trees.cols-1 && trees[pos.y][pos.x+1]) {
    Checker.markTree({x: pos.x+1, y: pos.y}, tents, trees, used, area)
  }
  if (pos.y>0 && trees[pos.y-1][pos.x]) {
    Checker.markTree({x: pos.x, y: pos.y-1}, tents, trees, used, area)
  }
  if (pos.y<trees.rows-1 && trees[pos.y+1][pos.x]) {
    Checker.markTree({x: pos.x, y: pos.y+1}, tents, trees, used, area)
  }
},
markTree: function(pos, tents, trees, used, area) {
  if (used[pos.y][pos.x]) {
    return;
  }
  area.treeCount++;
  area.cells.push(util.coord(pos.x, pos.y));
  used[pos.y][pos.x]=true;
  if (pos.x>0 && tents[pos.y][pos.x-1]) {
    Checker.markTent({x: pos.x-1, y: pos.y}, tents, trees, used, area)
  }
  if (pos.x<trees.cols-1 && tents[pos.y][pos.x+1]) {
    Checker.markTent({x: pos.x+1, y: pos.y}, tents, trees, used, area)
  }
  if (pos.y>0 && tents[pos.y-1][pos.x]) {
    Checker.markTent({x: pos.x, y: pos.y-1}, tents, trees, used, area)
  }
  if (pos.y<trees.rows-1 && tents[pos.y+1][pos.x]) {
    Checker.markTent({x: pos.x, y: pos.y+1}, tents, trees, used, area)
  }
},
checkArea: function(area) {
  if (area.treeCount != area.tentCount) {
    return {status: "Each tree should have one corresponding tent", errors: area.cells};
  }
  return {status: "OK"};
}
};

module.exports = Checker;
