const util = require('./util');

const Checker = {
check:function(dimension, clues, data){
  // Create array
  var dim = util.parseDimension(dimension);
  var cells = util.create2DArray(dim.rows, dim.cols, false);
  var clue = util.create2DArray(dim.rows, dim.cols, "");
  var areas;

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
        if (value=="cross") {
          cells[pos.y][pos.x] = false;
        } else {
          clue[pos.y][pos.x] = value;
        }
      }
    }
  }
  var res = Checker.checkConnected(cells);
  if (res.status != "OK") {
    return res;
  }
  var res = Checker.checkNotouch(cells);
  if (res.status != "OK") {
    return res;
  }
  var res = Checker.checkCountInAreas(cells, clue, areas);
  if (res.status != "OK") {
    return res;
  }
  var res = Checker.checkAreaRule(cells, areas);
  if (res.status != "OK") {
    return res;
  }
  return {status: "OK"};
},

checkConnected: function(cells) {
  if (!util.checkConnected(cells, false)) {
    return {status: "White area should be connected"};
  }
  return {status: "OK"};
},
checkNotouch: function(cells) {
  var res = Checker.findTouch(cells);
  if (res){
    return {status: "Blackened cells shouldn't sharing an edge", errors: res};
  }
  return {status: "OK"};
},
findTouch: function(cells) {
  for (var y = 0; y < cells.rows; y++) {
    for (var x = 0; x < cells.cols; x++) {
      if (y<cells.rows-1 && cells[y][x] && cells[y+1][x]){
        return [util.coord(x,y), util.coord(x,y+1)];
      }
      if (x<cells.cols-1 && cells[y][x] && cells[y][x+1]){
        return [util.coord(x,y), util.coord(x+1,y)];
      }
    }
  }
  return null;
},
checkCountInAreas: function(cells, clue, areas) {
  for (var a=0; a<areas.length; a++) {
    var area = areas[a];
    var blackCount = 0;
    var clueInArea = null;
    for (var i=0;i<area.length;i++) {
      var pos = util.parseCoord(area[i]);
      if (cells[pos.y][pos.x]) {
        blackCount++;
      }
      if (clue[pos.y][pos.x]) {
        clueInArea = clue[pos.y][pos.x];
      }
    }
    if (clueInArea) {
      if (blackCount != parseInt(clueInArea)) {
       return {status: "The clue is not correct", errors: area};
      }
    }
  }
  return {status: "OK"};
},
checkAreaRule: function(cells, areas) {
  var areaMap = util.create2DArray(cells.rows, cells.cols, -1)
  for (var a=0; a<areas.length; a++) {
    for (var i=0; i<areas[a].length;i++) {
      var pos = util.parseCoord(areas[a][i]);
      areaMap[pos.y][pos.x] = a;
    }
  }
  var wrongRow = Checker.checkRows(cells, areaMap);
  if (wrongRow) {
    return {status: "Sequence of white cells cannot span more than two outlined areas", errors: wrongRow};
  }
  var wrongCol = Checker.checkCols(cells, areaMap);
  if (wrongCol) {
    return {status: "Sequence of white cells cannot span more than two outlined areas", errors: wrongCol};
  }
  return {status: "OK"};
},
checkRows: function(cells, areaMap) {
  for (var y = 0; y < cells.rows; y++) {
    var spanAreas = [];
    var spanCells = [];
    for (var x = 0; x < cells.cols; x++) {
      if (cells[y][x]) {
        if (spanAreas.filter((v, i, a) => a.indexOf(v) === i).length > 2) {
          return spanCells;
        } 
        spanAreas = [];
        spanCells = [];
      } else {
        spanCells.push(util.coord(x,y));
        spanAreas.push(areaMap[y][x]);
      }
    }
    if (spanAreas.filter((v, i, a) => a.indexOf(v) === i).length > 2) {
      return spanCells;
    } 
  }
  return null;
},
checkCols: function(cells, areaMap) {
  for (var x = 0; x < cells.cols; x++) {
    var spanAreas = [];
    var spanCells = [];
    for (var y = 0; y < cells.rows; y++) {
      if (cells[y][x]) {
        if (spanAreas.filter((v, i, a) => a.indexOf(v) === i).length > 2) {
          return spanCells;
        } 
        spanAreas = [];
        spanCells = [];
      } else {
        spanCells.push(util.coord(x,y));
        spanAreas.push(areaMap[y][x]);
      }
    }
    if (spanAreas.filter((v, i, a) => a.indexOf(v) === i).length > 2) {
      return spanCells;
    } 
  }
  return null;
},
};

module.exports = Checker;
