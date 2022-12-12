if (typeof util=="undefined") {
  var util = require('./util');
}

var CENTER = 1;
var CORNER = 2;
var RIGHT = 3;
var BOTTOM = 4;

var Checker = {
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
  // Parse clues.
  for (var [key, value] of Object.entries(clues)) {
    if (key=="edges"){
      for (var [edgeKey, edgeValue] of Object.entries(value)) {
        if (edgeValue=="huge_black_circle" || edgeValue=="huge_white_circle") {
          var part = edgeKey.split("-");
          var pos = util.parseCoord(part[0]);
          if (part[1]=="b" || part[1]=="2") {
            cluecells[pos.y][pos.x] = {position: BOTTOM, value: edgeValue.substring(5)};
          }
          if (part[1]=="r" || part[1]=="1") {
            cluecells[pos.y][pos.x] = {position: RIGHT, value: edgeValue.substring(5)};
          }
        }
      }
    } if (key=="nodes"){
      for (var [nodeKey, nodeValue] of Object.entries(value)) {
        if (nodeValue=="huge_black_circle" || edgeValue=="huge_white_circle") {
          var part = nodeKey.split("-");
          var pos = util.parseCoord(part[0]);
          if (typeof part[1]=="undefined" || part[1]=="2") {
            cluecells[pos.y][pos.x] = {position: CORNER, value: nodeValue.substring(5)};
          }
        }
      }
    } else {
      if (value=="black_circle" || value=="white_circle") {
        var pos = util.parseCoord(key);
        cluecells[pos.y][pos.x] = {position: CENTER, value: value};
      }
    }
  }
  var res = Checker.checkAllUsed(dim, areas);
  if (res.status != "OK") {
    return res;
  }
  var res = Checker.checkAllCluesInAreas(cluecells, areas);
  if (res.status != "OK") {
    return res;
  }
  var res = Checker.checkAreas(cluecells, areas);
  if (res.status != "OK") {
    return res;
  }
  var res = Checker.checkNeighbouringAreas(dim, areas);
  if (res.status != "OK") {
    return res;
  }
  return {status: "OK"};
},

checkAreas: function(cells, areas) {
  for (var a=0; a<areas.length; a++) {
    let rect = Checker.isRectangle(cells, areas[a]);
    if (!rect) {
      return {status: "Each area should have rectangular or square shape", errors: areas[a]};
    }
    var clues = Checker.getCluesInArea(cells, areas[a]);
    if (clues.length != 1) {
      return {status: "Each area should contain exactly one circle", errors: areas[a]};
    }
    if (clues[0].value == "black_circle" && rect.width != rect.height) {
      return {status: "Area with a black circle should be a square", errors: areas[a]};
    }
    if (clues[0].value == "white_circle" && rect.width == rect.height) {
      return {status: "Area with a white circle should not be a square", errors: areas[a]};
    }
  }
  return {status: "OK"};
},
checkNeighbouringAreas: function(dim, areas) {
  var map = util.create2DArray(dim.rows, dim.cols, false);
  for (var a=0; a<areas.length; a++) {
    var area = areas[a];
    for (var i=0;i<area.length;i++) {
      var pos = util.parseCoord(area[i]);
      map[pos.y][pos.x] = a;
    }
  }
  for (var y = 0; y < dim.rows; y++) {
    for (var x = 0; x < dim.cols; x++) {
      if (y+1 < dim.rows) {
        if (map[y][x] != map[y+1][x] && areas[map[y][x]].length == areas[map[y+1][x]].length) {
          return {status: "Areas of the same size shouldn't share an edge", errors: areas[map[y][x]].concat(areas[map[y+1][x]])};
        }
      }
      if (x+1 < dim.cols) {
        if (map[y][x] != map[y][x+1] && areas[map[y][x]].length == areas[map[y][x+1]].length) {
          return {status: "Areas of the same size shouldn't share an edge", errors: areas[map[y][x]].concat(areas[map[y][x+1]])};
        }
      }
    }
  }
  return {status: "OK"};
},
getCluesInArea: function(cells, area) {
  var res = [];
  for (var a=0;a<area.length;a++) {
    var pos = util.parseCoord(area[a]);
    if (cells[pos.y][pos.x] != "") {
      res.push(cells[pos.y][pos.x]);
    }
  }
  return res;
},
checkAllCluesInAreas: function(cells, areas) {
  for (var a=0;a<areas.length;a++) {
    var area = areas[a];
    for (var i=0;i<area.length;i++) {
      var pos = util.parseCoord(area[i]);
      if (cells[pos.y][pos.x] != "") {
        let position = cells[pos.y][pos.x].position;
        if (position == RIGHT) {
          if (!area.includes(util.coord(pos.x+1, pos.y))) {
            return {status: "Clues should be fully inside a single area", errors: [util.coord(pos.x, pos.y),util.coord(pos.x+1, pos.y)]};
          }
        }
        if (position == BOTTOM) {
          if (!area.includes(util.coord(pos.x, pos.y+1))) {
            return {status: "Clues should be fully inside a single area", errors: [util.coord(pos.x, pos.y),util.coord(pos.x, pos.y+1)]};
          }
        }
        if (position == CORNER) {
          if (!area.includes(util.coord(pos.x+1, pos.y+1))) {
            return {status: "Clues should be fully inside a single area", errors: [util.coord(pos.x, pos.y),util.coord(pos.x+1, pos.y+1)]};
          }
        }
      }
    }
  }
  return {status: "OK"};
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
        return {status: "Each cell should belong to exactly one area", errors: [util.coord(x, y)]};
      }
    }
  }
  return {status: "OK"};
},
isRectangle: function(dim, area) {
  var used = util.create2DArray(dim.rows, dim.cols, false);
  var left = Number.MAX_VALUE;
  var right = -Number.MAX_VALUE;
  var top = Number.MAX_VALUE;
  var bottom = -Number.MAX_VALUE;
  for (var i=0;i<area.length;i++) {
    var pos = util.parseCoord(area[i]);
    used[pos.y][pos.x] = true;
    left = Math.min(left, pos.x);
    right = Math.max(right, pos.x);
    top = Math.min(top, pos.y);
    bottom = Math.max(bottom, pos.y);
  }
  for (var y = top; y <= bottom; y++) {
    for (var x = left; x <= right; x++) {
      if (!used[y][x]) {
        return false;
      }
    }
  }
  return {width: right - left, height: bottom - top};
}
};

module.exports = Checker;
