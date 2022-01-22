if (typeof util=="undefined") {
  var util = require('./util');
}

const Checker = {
check:function(dimension, clues, data){
  // Create array
  var part = dimension.split("-");
  var requiredLetters = part[1];
  var dim = util.parseDimension(part[0]);
  var cells = util.create2DArray(dim.rows, dim.cols, "")
  var bottom = [];
  var right = [];
  var areas = [];

  // Parse data.
  for (var [key, value] of Object.entries(data)) {
    var pos = util.parseCoord(key);
    if (cells[pos.y]){
      cells[pos.y][pos.x] = value;
    }
  }
  // Parse clues.
  for (var [key, value] of Object.entries(clues)) {
    if (key=="bottom") {
      bottom = value;
    } else if (key=="right") {
      right = value;
    } else if (key=="areas") {
      areas = value;
    } else {
      var pos = util.parseCoord(key);
      if (cells[pos.y]){
        if (value == "black") {
          cells[pos.y][pos.x] = "black";
        } else {
          cells[pos.y][pos.x] = value;
        }
      }
    }
  }
  var dominoes = Checker.buildDominoes(cells, areas);
  var res = Checker.checkDominoes(cells, dominoes);
  if (res.status != "OK") {
    return res;
  }
  var res = Checker.checkTochingDominoes(cells, dominoes);
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

buildDominoes: function(cells, areas) {
  var dominoes = [];
  for (var a=0; a<areas.length; a++) {
    dominoes = dominoes.concat(Checker.dominoesInArea(cells, areas[a]));
  }
  return dominoes;
},
dominoesInArea: function(cells, area) {
  var used = util.create2DArray(cells.rows, cells.cols, true);
  for (var a=0;a<area.length;a++) {
    var pos = util.parseCoord(area[a]);
    used[pos.y][pos.x] = false;
  }
  for (var y = 0; y < used.rows; y++) {
    for (var x = 0; x < used.cols; x++) {
      if (!used[y][x]) {
        used[y][x] = (cells[y][x]=="black");
      }
    }
  }
  var dominoes = [];
  for (var y = 0; y < used.rows; y++) {
    for (var x = 0; x < used.cols; x++) {
      if (!used[y][x]) {
        dominoes.push(Checker.connectedArea(used, {x: x, y:y}))
      }
    }
  }
  return dominoes;
},
connectedArea: function(used, start) {
   var area = [];
   var queue = [];
   queue.push(start);
   while (queue.length > 0) {
     let next = queue.shift();
     if (Checker.ifCell(used, next)) {
       used[next.y][next.x]=true;
       area.push(util.coord(next.x, next.y));
       queue.push({x: next.x+1, y: next.y});
       queue.push({x: next.x-1, y: next.y});
       queue.push({x: next.x, y: next.y+1});
       queue.push({x: next.x, y: next.y-1});
     }
   }
   return area;
},
ifCell: function(used, pos) {
  return pos.x>=0 && pos.x<used.cols && pos.y>=0 && pos.y<used.rows && !used[pos.y][pos.x];
},
checkDominoes: function(cells, areas) {
  var usedDominoes = {};
  for (var a=0; a<areas.length; a++) {
    let letters = Checker.getLetersInArea(cells, areas[a]);
    if (letters.length != 2) {
      return {status: "All cells should be filled", errors: areas[a]};
    }
    if (typeof usedDominoes[letters] != "undefined") {
      return {status: "Each domino should be used once", errors: areas[a].concat(usedDominoes[letters])};
    } else {
      usedDominoes[letters] = areas[a];
    }
  }
  return {status: "OK"};
},
getLetersInArea: function(cells, area) {
  var res = [];
  for (var a=0;a<area.length;a++) {
    var pos = util.parseCoord(area[a]);
    if (cells[pos.y][pos.x] != "") {
      res.push(cells[pos.y][pos.x]);
    }
  }
  return res.sort().join('');
},
checkTochingDominoes: function(cells, dominoes) {
  var map = util.create2DArray(cells.rows, cells.cols, "");
  for (var a=0; a<dominoes.length; a++) {
    for (var d=0;d<dominoes[a].length;d++) {
      var pos = util.parseCoord(dominoes[a][d]);
      map[pos.y][pos.x] = a.toString();
    }
  }
  for (var y = 0; y < cells.rows; y++) {
    for (var x = 0; x < cells.cols; x++) {
      if (cells[y][x] && cells[y][x]!="" && cells[y][x]!="black"){
        if (x+1<cells.cols && cells[y][x+1] && cells[y][x+1]!="" && cells[y][x+1]!="black") {
          if (cells[y][x] != cells[y][x+1] && map[y][x] != map[y][x+1]) {
            return {status: "Touching dominoes should contain the same value", errors: [util.coord(x,y), util.coord(x+1,y)]};
          }
        }
        if (y+1<cells.rows && cells[y+1][x] && cells[y+1][x]!="" && cells[y+1][x]!="black") {
          if (cells[y][x] != cells[y+1][x] && map[y][x] != map[y+1][x]) {
            return {status: "Touching dominoes should contain the same value", errors: [util.coord(x,y), util.coord(x,y+1)]};
          }
        }
      }
    }
  }
  return {status: "OK"};
},
checkColumnClues: function(cells, clues) {
  for (var x=0; x < cells.cols; x++) {
    if (clues[x] && clues[x] != "white") {
      res = Checker.checkColumnClue(cells, clues[x], x);
      if (res) {
        return {status: "Wrong sum of values in the column", errors: res};
      }
    }
  }
  return {status: "OK"};
},
checkColumnClue: function(cells, clue, col) {
  var sum = 0;
  var cellList = [];
  for (var y=0; y < cells.rows; y++) {
    cellList.push(util.coord(col, y));
    if (cells[y][col] && cells[y][col]!="" && cells[y][col]!="black") sum+=parseInt(cells[y][col]);
  }
  if (sum.toString() != clue) return cellList;
  return null;
},
checkRowClues: function(cells, clues) {
  for (var y=0; y < cells.rows; y++) {
    if (clues[y] && clues[y] != "white") {
      res = Checker.checkRowClue(cells, clues[y], y);
      if (res) {
        return {status: "Wrong sum of values in the row", errors: res};
      }
    }
  }
  return {status: "OK"};
},
checkRowClue: function(cells, clue, row) {
  var sum = 0;
  var cellList = [];
  for (var x=0; x < cells.cols; x++) {
    cellList.push(util.coord(x, row));
    if (cells[row][x] && cells[row][x]!="" && cells[row][x]!="black") sum+=parseInt(cells[row][x]);
  }
  if (sum.toString() != clue) return cellList;
  return null;
},
};

module.exports = Checker;
