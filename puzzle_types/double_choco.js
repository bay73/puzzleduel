if (typeof util=="undefined") {
  var util = require('./util');
}

const Checker = {
check:function(dimension, clues, data){
  // Create array
  let dim = util.parseDimension(dimension);
  let areas = [];
  let cells = util.create2DArray(dim.rows, dim.cols, "")
  let shades = util.create2DArray(dim.rows, dim.cols, false)

  // Parse data.
  for (let [key, value] of Object.entries(data)) {
    if (key == "areas") {
      areas = value;
    }
  }
  // Parse clues.
  for (let [key, value] of Object.entries(clues)) {
    let pos = util.parseCoord(key);
    if (cells[pos.y]){
      if (value.startsWith("grey")) {
        shades[pos.y][pos.x] = true;
        if (value.length > 4) {
          cells[pos.y][pos.x] = value.substring(4);
        }
      } else {
        cells[pos.y][pos.x] = value;
      }
    }
  }
  let res = Checker.checkRegions(dim, cells, shades, areas);
  if (res.status != "OK") {
    return res;
  }
  return {status: "OK"};
},

checkRegions: function(dim, cells, shades, areas) {
  let res = [];
  for (let a = 0; a < areas.length; a++) {
    res = Checker.checkRegion(dim, cells, shades, areas[a]);
    if (res.status != "OK") {
      return res;
    }
  }
  return {status: "OK"};
},

checkRegion: function(dim, cells, shades, area) {
  let hintValue = 0;
  let greyAreaCoords = [];
  let whiteAreaCoords = [];
  let greyAreaPositions = [];
  let whiteAreaPositions = [];
  let hints = [];
  for (let a = 0; a < area.length; a++) {
    let pos = util.parseCoord(area[a]);
    if (cells[pos.y][pos.x] != '') {
      hints.push(util.coord(pos.x, pos.y));
      if (hintValue != 0 && hintValue != cells[pos.y][pos.x]) {
        return {status: "All numbers in a region must be equal", errors: hints};
      }
      hintValue = cells[pos.y][pos.x];
    }
    if (shades[pos.y][pos.x]) {
      greyAreaPositions.push(pos);
      greyAreaCoords.push(area[a]);
    } else {
      whiteAreaPositions.push(pos);
      whiteAreaCoords.push(area[a]);
    }
  }
  if (!Checker.isAreaConnected(dim, whiteAreaPositions)) {
    return {status: "White area should be connected", errors: whiteAreaCoords};
  }
  if (!Checker.isAreaConnected(dim, greyAreaPositions)) {
    return {status: "Shaded area should be connected", errors: greyAreaCoords};
  }
  if (greyAreaCoords.length != whiteAreaCoords.length) {
    return {status: "Areas of white cells and shaded cells must have the same shape", errors: area};
  }
  if (hintValue != 0 && greyAreaCoords.length != hintValue) {
    return {status: "The number must be equal to the number of cells of each color in a region", errors: area};
  }
  let whiteForm = Checker.findMinimalShape(whiteAreaPositions);
  let shadedForm = Checker.findMinimalShape(greyAreaPositions);
  if (Checker.compareShapes(whiteForm, shadedForm) != 0) {
    return {status: "Areas of white cells and gray cells must have the same shape", errors: area};
  }
  return {status: "OK"};
},

comparePosition: function(pos1, pos2) {
  return pos1.y != pos2.y ? pos1.y - pos2.y : pos1.x - pos2.x;
},

compareShapes: function(area1, area2) {
  for (let a = 0; a < area1.length; a++) {
    let d = Checker.comparePosition(area1[a], area2[a]);
    if (d < 0) return -1;
    if (d > 0) return 1;
  }
  return 0;
},

normalizeShape: function(area) {
  area.sort((a,b) => a.y != b.y ? a.y - b.y : a.x - b.x);
  for (let a = 1; a < area.length; a++) {
    area[a].y -= area[0].y;
    area[a].x -= area[0].x;
  }
  area[0].y = 0;
  area[0].x = 0;
},

minimalShapeOfTwo: function(area1, area2) {
  for (let a = 1; a < area1.length; a++) {
    let d = Checker.comparePosition(area1[a], area2[a]);
    if (d < 0) return area1;
    if (d > 0) return area2;
  }
  return area1;
},

findMinimalShape: function(area) {
  let minArea = structuredClone(area)
  Checker.normalizeShape(minArea);
  if (area.length > 1) {
    for (let j = 0; j < 2; j++) {
      for (let i = 0; i < 4; i++) {
        Checker.normalizeShape(area);
        if (Checker.compareShapes(minArea, area) > 0) {
          minArea = area
        }
        area = area.map((pos) => ({x: -pos.y, y: pos.x})); // rotate clockwise
      }
      area = area.map((pos) => ({x: pos.x, y: -pos.y})); // reflect
    }
  }
  return minArea;
},

isAreaConnected: function(dim, area) {
  if (area.length < 2) return true;
  let board = util.create2DArray(dim.rows, dim.cols, 0);
  for (let i = 0; i < area.length; i++) {
    board[area[i].y][area[i].x] = 1;
  }
  let painted = Checker.paintAreaRecursively(board, area[0]);
  return painted == area.length;
},

paintAreaRecursively: function(board, position) {
  const neighbour = [{y:1,x:0}, {y:0,x:1}, {y:-1,x:0}, {y:0,x:-1}]
  let paintedCount = 1;
  board[position.y][position.x] = 2;
  for (let i = 0; i < neighbour.length; i++) {
    const newX = position.x + neighbour[i].x;
    const newY = position.y + neighbour[i].y;
    if (newY >= 0 && newY < board.rows && newX >= 0 && newX < board.cols && board[newY][newX] == 1) {
      paintedCount += Checker.paintAreaRecursively(board, {x: newX, y: newY});
    }
  }
  return paintedCount;
},
};

module.exports = Checker;
