const util = require('./util');

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
  var res = Checker.checkEmptyNeighbours(lineRes.line, areas, clues);
  if (res.status != "OK") {
    return res;
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
checkEmptyNeighbours: function(line, areas, dim) {
  var used = util.create2DArray(dim.rows, dim.cols, false)
  var map = util.create2DArray(dim.rows, dim.cols, -1)
  for (var i=0;i<line.length;i++) {
    used[line[i].y][line[i].x] = true;
  }
  for (var i = 0; i < areas.length; i++) {
    var area = areas[i];
    for (var j = 0; j < area.length; j++) {
      var pos = util.parseCoord(area[j]);
      map[pos.y][pos.x] = i;
    }
  }
  for (var y=0;y<used.rows;y++) {
    for (var x=0;x<used.cols;x++) {
      if (y>0 && !used[y-1][x] && !used[y][x]) {
        if (map[y-1][x] != map[y][x]) {
          return {status: "Two neigbouring cells in different areas can't both be unused by the loop", errors: [util.coord(x, y), util.coord(x, y-1)]};
        }
      }
      if (x>0 && !used[y][x-1] && !used[y][x]) {
        if (map[y][x-1] != map[y][x]) {
          return {status: "Two neigbouring cells in different areas can't both be unused by the loop", errors: [util.coord(x, y), util.coord(x-1, y)]};
        }
      }
    }
  }
  return {status: "OK"};
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
  var partCount = Checker.countPartsInArea(line, area, clues);
  if (partCount != 1) {
    return {status: "Loop should visit the area exactly one time", errors: area};
  }
  var cells = util.create2DArray(clues.rows, clues.cols, false)
  var areaClue = null;
  var areaCluePos = null;
  for (var j = 0; j < area.length; j++) {
    var pos = util.parseCoord(area[j]);
    cells[pos.y][pos.x] = true;
    var value = parseInt(clues[pos.y][pos.x]);
    if (value) {
      areaClue = value;
      var areaCluePos = util.coord(pos.x, pos.y);
    }
  }
  if (!areaClue) {
    return null;
  }
  var countInArea = 0
  for (var i=1;i<line.length;i++) {
    if (cells[line[i].y][line[i].x]) {
      countInArea++;
    }
  }
  if (countInArea.toString() != areaClue) {
    return {status: "The clue is not correct", errors: [areaCluePos]};
  }
  return null;
},
countPartsInArea: function(line, area, dim) {
  var cells = util.create2DArray(dim.rows, dim.cols, false)
  for (var j = 0; j < area.length; j++) {
    var pos = util.parseCoord(area[j]);
    cells[pos.y][pos.x] = true;
  }
  var partCount = 0
  var prevInside = false;
  var start = 0;
  var isStart = false;
  for (var i=0;i<line.length;i++) {
    if (cells[line[i].y][line[i].x]) {
      if (!prevInside) {
        partCount++;
      }
      prevInside = true;
    } else {
      prevInside = false;
    }
  }
  if (cells[line[0].y][line[0].x] && cells[line[line.length-1].y][line[line.length-1].x]) {
    partCount--;
  }
  return partCount;
},
};

module.exports = Checker;
