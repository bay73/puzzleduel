if (typeof util=="undefined") {
  var util = require('./util');
}

var validShapes = {
  "0_1,1_2,1_3": "S",
  "-1_1,0_1,-1_2": "S",
  "1_1,2_1,3_2": "S",
  "1_1,1_2,2_3": "S",
  "1_0,2_1,3_1": "S",
  "1_0,-1_1,0_1": "S",
  "0_1,0_2,1_3": "L",
  "0_1,-1_2,0_2": "L",
  "1_1,2_2,3_2": "L",
  "1_1,2_2,2_3": "L",
  "1_0,2_0,3_1": "L",
  "-2_1,-1_1,0_1": "L",
  "1_0,0_1,0_2": "L",
  "1_1,1_2,1_3": "L",
  "0_1,1_2,2_3": "L",
  "1_0,2_1,3_2": "L",
  "1_1,2_1,3_1": "L",
  "1_0,2_0,0_1": "L",
  "0_1,0_2,0_3": "I",
  "1_1,2_2,3_3": "I",
  "1_0,2_0,3_0": "I",
  "0_1,1_2,2_2": "C",
  "2_0,1_1,2_1": "C",
  "1_1,0_2,1_2": "C",
  "1_0,2_1,2_2": "C",
  "1_0,0_1,2_1": "C",
  "1_0,0_1,1_2": "C",
  "-1_1,0_1,1_2": "Y",
  "1_1,2_1,1_2": "Y",
};

const Checker = {
check:function(dimension, clues, data){
  // Create array
  let dim = util.parseDimension(dimension);
  let cells = [];
  let areas = [];

  for (let y = 0; y < dim.rows + dim.cols - 1; y++) {
    cells[y] = new Array(2*dim.cols - 1);
    for (let x = 0; x < 2*dim.cols - 1; x++) {
      if (y - x < dim.rows && x - y < dim.cols) {
        cells[y][x] = false
      }
    }
  }

  for (const [key, value] of Object.entries(data)) {
    let x = key.charCodeAt(0) - 'a'.charCodeAt(0);
    let y = parseInt(key.substring(1)) - 1;
    if (cells[y]) {
      cells[y][x] = (value == '1');
    }
  }

  // Parse clues.
  for (let [key, value] of Object.entries(clues)) {
    if (key=="areas") {
      areas = value;
    } else {
      let pos = util.parseCoord(key);
      if (cells[pos.y]){
        cells[pos.y][pos.x] = false;
      }
    }
  }
  let res = Checker.checkNoThreePoints(dim, cells);
  if (res.status != "OK") {
    return res;
  }
  res = Checker.checkConnected(dim, cells);
  if (res.status != "OK") {
    return res;
  }
  res = Checker.checkTetrahexes(dim, cells, areas);
  if (res.status != "OK") {
    return res;
  }
  return {status: "OK"};
},

checkNoThreePoints: function(dim, cells) {
  let res = Checker.findThreePoint(dim, cells);
  if (res){
    return {status: "Three shaded cells cannot have common point", errors: res};
  }
  return {status: "OK"};
},
findThreePoint: function(dim, cells) {
  for (let y = 0; y < dim.rows + dim.cols - 2; y++) {
    for (let x = 0; x < 2*dim.cols - 2; x++) {
      if (y - x < dim.rows && x - y < dim.cols) {
        if(cells[y][x] && cells[y+1][x] && cells[y+1][x+1]) {
          return [util.coord(x,y), util.coord(x,y+1), util.coord(x+1,y+1)];
        }
        if(cells[y][x] && cells[y][x+1] && cells[y+1][x+1]) {
          return [util.coord(x,y), util.coord(x+1,y), util.coord(x+1,y+1)];
        }
      }
    }
  }
},
checkConnected: function(dim, cells) {
  const first = Checker.findFirst(dim, cells)
  if (!first) {
    return {status: "OK"};
  }
  let used = [];
  for (let y = 0; y < dim.rows + dim.cols - 1; y++) {
    used[y] = new Array(2*dim.cols - 1);
    for (let x = 0; x < 2*dim.cols - 1; x++) {
      if (y - x < dim.rows && x - y < dim.cols) {
        used[y][x] = false;
      }
    }
  }
  Checker.paint(dim, cells, used, first.x, first.y)
  let allPainted = true
  for (let y = 0; y < dim.rows + dim.cols - 1; y++) {
    for (let x = 0; x < 2*dim.cols - 1; x++) {
      if (y - x < dim.rows && x - y < dim.cols) {
        if (cells[y][x] && !used[y][x]) allPainted = false
      }
    }
  }
  
  if (!allPainted) {
    return {status: "Black area should be connected"};
  }
  return {status: "OK"};
},
findFirst: function(dim, cells) {
  for (let y = 0; y < dim.rows + dim.cols - 1; y++) {
    for (let x = 0; x < 2*dim.cols - 1; x++) {
      if (y - x < dim.rows && x - y < dim.cols) {
        if(cells[y][x]) {
          return {x: x, y: y}
        }
      }
    }
  }
  return null
},
paint: function(dim, cells, used, x, y){
  if (x >= 0 && x < 2*dim.cols - 1 && y >= 0 && y < dim.rows + dim.cols - 1 && y - x < dim.rows && x - y < dim.cols) {
    if (cells[y][x] && !used[y][x]) {
      used[y][x] = true;
      Checker.paint(dim, cells, used, x-1, y)
      Checker.paint(dim, cells, used, x, y-1)
      Checker.paint(dim, cells, used, x+1, y)
      Checker.paint(dim, cells, used, x, y+1)
      Checker.paint(dim, cells, used, x-1, y-1)
      Checker.paint(dim, cells, used, x+1, y+1)
    }
  }
},
checkTetrahexes: function(dim, cells, areas) {
  var tetrahexes = []
  var areaMap = []
  for (let y = 0; y < dim.rows + dim.cols - 1; y++) {
    tetrahexes[y] = new Array(2*dim.cols - 1);
    areaMap[y] = new Array(2*dim.cols - 1);
    for (let x = 0; x < 2*dim.cols - 1; x++) {
      if (y - x < dim.rows && x - y < dim.cols) {
        tetrahexes[y][x] = ""
        areaMap[y][x] = -1
      }
    }
  }

  for (var a=0; a<areas.length; a++) {
    tetrahex = Checker.getCellsInArea(cells, areas[a]);
    if (tetrahex.length != 4) {
      return {status: "Black cells in each area should form valid tetrahex", errors: areas[a]};
    }
    tetrahex.sort((p1,p2) => {if(p1.y == p2.y) return p1.x - p2.x; else return p1.y - p2.y;});
    var first = tetrahex[0];
    var shape = tetrahex.slice(1).map(cell => (cell.x-first.x)+"_"+(cell.y - first.y)).join(",");
    if (!(shape in validShapes)) {
      return {status: "Black cells in each area should form valid tetrahex", errors: areas[a]};
    }
    var letter = validShapes[shape];
    tetrahex.forEach(cell => tetrahexes[cell.y][cell.x] = letter);
    for (var i=0; i<areas[a].length;i++) {
      var pos = util.parseCoord(areas[a][i]);
      areaMap[pos.y][pos.x] = a;
    }
  }
  for (let y = 0; y < dim.rows + dim.cols - 1; y++) {
    for (let x = 0; x < 2*dim.cols - 1; x++) {
      if (y - x < dim.rows && x - y < dim.cols) {
        if (tetrahexes[y][x]) {
          if (x+1 < 2*dim.cols - 1) {
            if (tetrahexes[y][x+1]==tetrahexes[y][x] && areaMap[y][x+1]!=areaMap[y][x]) {
              return {status: "Tetrahexes of the same type shoudln't share an edge", errors: [util.coord(x,y), util.coord(x+1,y)]};
            }
          }
          if (y+1 < dim.rows + dim.cols - 1) {
            if (tetrahexes[y+1][x]==tetrahexes[y][x] && areaMap[y+1][x]!=areaMap[y][x]) {
              return {status: "Tetrahexes of the same type shoudln't share an edge", errors: [util.coord(x,y), util.coord(x,y+1)]};
            }
          }
          if (x+1 < 2*dim.cols - 1 && y+1 < dim.rows + dim.cols - 1) {
            if (tetrahexes[y+1][x+1]==tetrahexes[y][x] && areaMap[y+1][x+1]!=areaMap[y][x]) {
              return {status: "Tetrahexes of the same type shoudln't share an edge", errors: [util.coord(x,y), util.coord(x+1,y+1)]};
            }
          }
        }
      }
    }
  }  
  return {status: "OK"};
},
getCellsInArea: function(cells, area) {
  var res = [];
  for (var a=0;a<area.length;a++) {
    var pos = util.parseCoord(area[a]);
    if (cells[pos.y][pos.x]) {
      res.push(pos);
    }
  }
  return res;
},
};

module.exports = Checker;
