if (typeof util=="undefined") {
  var util = require('./util');
}

const Checker = {
check:function(dimension, clues, data){
  // Create array
  var part = dimension.split("-");
  var requiredLetters = part[1];
  var dim = util.parseDimension(part[0]);
  var cluecells = util.create2DArray(dim.rows, dim.cols, "")
  var areas = [];

  // Parse data.
  for (var [key, value] of Object.entries(data)) {
    if (key=="areas") {
      areas = value;
    }
  }
  // Parse clues.
  for (var [key, value] of Object.entries(clues)) {
    var pos = util.parseCoord(key);
    if (cluecells[pos.y]){
      if (value == "black") {
        cluecells[pos.y][pos.x] = "black";
      } else {
        cluecells[pos.y][pos.x] = value;
      }
    }
  }
  var res = Checker.checkAllUsed(dim, areas);
  if (res.status != "OK") {
    return res;
  }
  var dominoes = Checker.buildDominoes(cluecells, areas);
  var res = Checker.checkDominoes(cluecells, dominoes);
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
    if (letters.length > 0) {
       if (areas[a].length != 2 && letters.length > 0) {
        return {status: "Each area should contain two cells", errors: areas[a]};
       }
       if (typeof usedDominoes[letters] != "undefined") {
         return {status: "Each domino should be used once", errors: areas[a].concat(usedDominoes[letters])};
       } else {
         usedDominoes[letters] = areas[a];
       }
    }
  }
  return {status: "OK"};
},
getLetersInArea: function(cells, area) {
  var res = [];
  for (var a=0;a<area.length;a++) {
    var pos = util.parseCoord(area[a]);
    if (cells[pos.y][pos.x] != "" && cells[pos.y][pos.x] != "black") {
      res.push(cells[pos.y][pos.x]);
    }
  }
  return res.sort().join('');
},
checkAllUsed: function(dim, areas) {
  var used = util.create2DArray(dim.rows, dim.cols, false);
  for (var a=0; a<areas.length; a++) {
    var area = areas[a];
    for (var i=0;i<area.length;i++) {
      var pos = util.parseCoord(area[i]);
      if (used[pos.y][pos.x]) {
        return {status: "Each cell should belong to exactly one area", errors: area[i]};
      }
      used[pos.y][pos.x] = true;
    }
  }
  for (var y = 0; y < dim.rows; y++) {
    for (var x = 0; x < dim.cols; x++) {
      if (!used[y][x]) {
        return {status: "Each cell should belong to exactly one area", errors: util.coord(x, y)};
      }
    }
  }
  return {status: "OK"};
}
};

module.exports = Checker;
