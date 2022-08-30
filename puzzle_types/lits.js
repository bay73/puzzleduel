if (typeof util=="undefined") {
  var util = require('./util');
}

var validShapes = {
  "1_0,0_1,0_2": "L",
  "0_1,-1_2,0_2": "L",
  "0_1,0_2,1_2": "L",
  "1_0,1_1,1_2": "L",
  "0_1,1_1,2_1": "L",
  "-2_1,-1_1,0_1": "L",
  "1_0,2_0,0_1": "L",
  "1_0,2_0,2_1": "L",
  "0_1,0_2,0_3": "I",
  "1_0,2_0,3_0": "I",
  "0_1,1_1,0_2": "T",
  "-1_1,0_1,1_1": "T",
  "1_0,2_0,1_1": "T",
  "-1_1,0_1,0_2": "T",
  "1_0,1_1,2_1": "S",
  "1_0,-1_1,0_1": "S",
  "-1_1,0_1,-1_2": "S",
  "0_1,1_1,1_2": "S",
};

const Checker = {
check:function(dimension, clues, data){
  // Create array
  var dim = util.parseDimension(dimension);
  var cells = util.create2DArray(dim.rows, dim.cols, false)
  var cluecells = util.create2DArray(dim.rows, dim.cols, "")

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
      if (cells[pos.y]){
        cells[pos.y][pos.x] = false;
      }
    }
  }
  var res = Checker.checkNo2x2(cells);
  if (res.status != "OK") {
    return res;
  }
  var res = Checker.checkConnected(cells);
  if (res.status != "OK") {
    return res;
  }
  var res = Checker.checkTetrominoes(cells, areas);
  if (res.status != "OK") {
    return res;
  }
  return {status: "OK"};
},

checkNo2x2: function(cells, color) {
  var res = util.find2x2(cells, [true]);
  if (res){
    return {status: "No 2x2 black squares are allowed", errors: res};
  }
  return {status: "OK"};
},

checkConnected: function(cells) {
  if (!util.checkConnected(cells, [true])) {
    return {status: "Black area should be connected"};
  }
  return {status: "OK"};
},
checkTetrominoes: function(cells, areas) {
  var tetrominoes = util.create2DArray(cells.rows, cells.cols, "")
  var areaMap = util.create2DArray(cells.rows, cells.cols, -1)
  for (var a=0; a<areas.length; a++) {
    tetrominoe = Checker.getCellsInArea(cells, areas[a]);
    if (tetrominoe.length != 4) {
      return {status: "Black cells in each area should form valid tetromino", errors: areas[a]};
    }
    tetrominoe.sort((p1,p2) => {if(p1.y == p2.y) return p1.x - p2.x; else return p1.y - p2.y;});
    var first = tetrominoe[0];
    var shape = tetrominoe.slice(1).map(cell => (cell.x-first.x)+"_"+(cell.y - first.y)).join(",");
    if (!(shape in validShapes)) {
      return {status: "Black cells in each area should form valid tetromino", errors: areas[a]};
    }
    var letter = validShapes[shape];
    tetrominoe.forEach(cell => tetrominoes[cell.y][cell.x] = letter);
    for (var i=0; i<areas[a].length;i++) {
      var pos = util.parseCoord(areas[a][i]);
      areaMap[pos.y][pos.x] = a;
    }
  }
  for (var y = 0; y < cells.rows; y++) {
    for (var x = 0; x < cells.cols; x++) {
      if (tetrominoes[y][x]) {
        if (x+1 < cells.cols) {
          if (tetrominoes[y][x+1]==tetrominoes[y][x] && areaMap[y][x+1]!=areaMap[y][x]) {
            return {status: "Tetromino of the same type shoudln't share an edge", errors: [util.coord(x,y), util.coord(x+1,y)]};
          }
        }
        if (y+1 < cells.rows) {
          if (tetrominoes[y+1][x]==tetrominoes[y][x] && areaMap[y+1][x]!=areaMap[y][x]) {
            return {status: "Tetromino of the same type shoudln't share an edge", errors: [util.coord(x,y), util.coord(x,y+1)]};
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
