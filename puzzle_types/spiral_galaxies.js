if (typeof util=="undefined") {
  var util = require('./util');
}

const CENTER = 1;
const CORNER = 2;
const RIGHT = 3;
const BOTTOM = 4;

const Checker = {
check:function(dimension, clues, data){
  // Create array
  var dim = util.parseDimension(dimension);
  var cluecells = util.create2DArray(dim.rows, dim.cols, 0)
  var areas = [];

  // Parse data.
  for (var [key, value] of Object.entries(data)) {
    if (key=="areas") {
      areas = value;
    }
  }
  // Parse clues.
  for (var [key, value] of Object.entries(clues)) {
    if (key=="edges"){
      for (var [edgeKey, edgeValue] of Object.entries(value)) {
        if (edgeValue=="black_circle") {
          var part = edgeKey.split("-");
          var pos = util.parseCoord(part[0]);
          if (part[1]=="b" || part[1]=="2") {
            cluecells[pos.y][pos.x] = BOTTOM;
          }
          if (part[1]=="r" || part[1]=="1") {
            cluecells[pos.y][pos.x] = RIGHT;
          }
        }
      }
    } if (key=="nodes"){
      for (var [nodeKey, nodeValue] of Object.entries(value)) {
        if (nodeValue=="black_circle") {
          var part = nodeKey.split("-");
          var pos = util.parseCoord(part[0]);
          if (typeof part[1]=="undefined" || part[1]=="2") {
            cluecells[pos.y][pos.x] = CORNER;
          }
        }
      }
    } else {
      if (value=="small_circle") {
        var pos = util.parseCoord(key);
        cluecells[pos.y][pos.x] = CENTER;
      }
    }
  }
  var res = Checker.checkAllUsed(dim, areas);
  if (res.status != "OK") {
    return res;
  }
  var res = Checker.checkAreas(cluecells, areas);
  if (res.status != "OK") {
    return res;
  }
  return {status: "OK"};
},

checkAreas: function(cells, areas) {
  for (var a=0; a<areas.length; a++) {
    var circle = Checker.getCircleInArea(cells, areas[a]);
    if (circle.length != 1) {
      return {status: "Each area should contain exactly one circle", errors: areas[a]};
    }
    var centerPos = {x: circle[0].x, y: circle[0].y}
    if (circle[0].v == BOTTOM) {
      centerPos.y += 0.5;
    } else if (circle[0].v == RIGHT) {
      centerPos.x += 0.5;
    } else if (circle[0].v == CORNER) {
      centerPos.x += 0.5;
      centerPos.y += 0.5;
    }
    if (!Checker.checkCenter(areas[a], centerPos)) {
      return {status: "Circle should be at the center of rotational symmetry the area", errors: areas[a]};
    }
  }
  return {status: "OK"};
},
getCircleInArea: function(cells, area) {
  var res = [];
  for (var a=0;a<area.length;a++) {
    var pos = util.parseCoord(area[a]);
    if (cells[pos.y][pos.x] != 0) {
      res.push({x: pos.x, y: pos.y, v: cells[pos.y][pos.x]});
    }
  }
  return res;
},
checkCenter: function(area, center) {
  for (var a=0;a<area.length;a++) {
    var pos = util.parseCoord(area[a]);
    var symmetricalPos = util.coord(Math.round(center.x*2 - pos.x), Math.round(center.y*2 - pos.y));
    if (!area.includes(symmetricalPos)) {
      return false;
    }
  }
  return true;
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
