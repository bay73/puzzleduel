if (typeof util=="undefined") {
  var util = require('./util');
}

const Checker = {
check:function(dimension, clueData, data){
  // Create array
  var dim = util.parseDimension(dimension);
  var v = util.create2DArray(dim.rows, dim.cols, false)
  var h = util.create2DArray(dim.rows, dim.cols, false)
  var clues = util.create2DArray(dim.rows, dim.cols, false)
  var areas;

  // Parse data.
  for (var [key, value] of Object.entries(data)) {
    if (key=='connectors') {
      for (var [cKey, cValue] of Object.entries(value)) {
        if (cValue=='1') {
          var part = cKey.split("-");
          var pos = util.parseCoord(part[0]);
          if (part[1]=="v") {
            v[pos.y][pos.x] = true;
          }
          if (part[1]=="h") {
            h[pos.y][pos.x] = true;
          }
        }
      }
    } else {
      var pos = util.parseCoord(key);
      if (v[pos.y]){
        v[pos.y][pos.x] = (value.v=="true");
        h[pos.y][pos.x] = (value.h=="true");
      }
    }
  }
  // Parse clues.
  for (var [key, value] of Object.entries(clueData)) {
    if (key=="areas") {
      areas = value;
    } else {
      var pos = util.parseCoord(key);
      if (clues[pos.y]){
        clues[pos.y][pos.x] = value;
      }
    }
  }
  var lineRes = Checker.buildLine(v, h);
  if (lineRes.status != "OK") {
    return lineRes;
  }
  var res = Checker.checkAreaClues(lineRes.line, areas, clues);
  if (res.status != "OK") {
    return res;
  }
  return {status: "OK"};
},
buildLine: function(v, h) {
  var start = Checker.findStart(h);
  if (!start) {
    return {status: "There should be single loop passing through some cells"};
  }
  var line = [];
  line[0] = start;
  line[1] = {x:start.x + 1, y:start.y };
  length = 1;
  var prev = line[0];
  var current = line[1];
  var next = {};
  while (current.x != start.x || current.y != start.y) {
    var nextCount = 0;
    if (current.x > 0 && h[current.y][current.x-1] && (current.x-1 != prev.x || current.y != prev.y)) {
      nextCount++;
      next = {x: current.x-1, y: current.y};
    }
    if (current.x < h.cols-1 && h[current.y][current.x] && (current.x+1 != prev.x || current.y != prev.y)) {
      nextCount++;
      next = {x: current.x+1, y: current.y};
    }
    if (current.y > 0 && v[current.y-1][current.x] && (current.x != prev.x || current.y-1 != prev.y)) {
      nextCount++;
      next = {x: current.x, y: current.y-1};
    }
    if (current.y < v.rows-1 && v[current.y][current.x] && (current.x != prev.x || current.y+1 != prev.y)) {
      nextCount++;
      next = {x: current.x, y: current.y+1};
    }
    if (nextCount != 1) {
      return {status: "There should be single loop without bifurcations", errors: [util.coord(current.x,current.y)]};
    }
    length++;
    line[length] = {x:next.x, y:next.y};
    prev = current;
    current = next;
  }
  return {status: "OK", line: line};
},
findStart: function(h) {
  for (var x=0;x < h.cols;x++) {
    for (var y=0;y < h.rows; y++) {
      if (h[y][x]) return {x:x, y:y};
    }
  }
  return null;
},
checkAreaClues: function(line, areas, clues) {
  for (var i = 0; i < areas.length; i++) {
    var area = areas[i];
    var res = Checker.checkArea(line, area, clues);
    if (res) {
      return res;
    }
  }
  return {status: "OK"};
},
checkArea: function(line, area, clues) {
  var cells = util.create2DArray(clues.rows, clues.cols, 0)
  var greyCount = 0;
  var whiteCount = 0;
  for (var j = 0; j < area.length; j++) {
    var pos = util.parseCoord(area[j]);
    if (clues[pos.y][pos.x]=="grey") {
	  cells[pos.y][pos.x] = 1;
	  greyCount++;
    } else {
	  cells[pos.y][pos.x] = 2;
	  whiteCount++;
    }
  }
  var greyUsed = 0
  var whiteUsed = 0
  for (var i=1;i<line.length;i++) {
    if (cells[line[i].y][line[i].x]==1) {
      greyUsed++;
    }
    if (cells[line[i].y][line[i].x]==2) {
      whiteUsed++;
    }
  }
  if (greyUsed!=0 && whiteUsed!=0) {
    return {status: "Line should pass only through the cells of one colour", errors: area};
  }
  if (greyUsed==0 && whiteUsed==0) {
    return {status: "All cells of one colour should be used", errors: area};
  }
  if (greyUsed!=0 && greyUsed!=greyCount) {
    return {status: "All cells of one colour should be used", errors: area};
  }
  if (whiteUsed!=0 && whiteUsed!=whiteCount) {
    return {status: "All cells of one colour should be used", errors: area};
  }
  return null;
},
};

module.exports = Checker;
