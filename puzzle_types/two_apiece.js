const util = require('./util');

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
      cluecells[pos.y][pos.x] = value;
    }
  }
  var res = Checker.checkAllUsed(dim, areas);
  if (res.status != "OK") {
    return res;
  }
  var res = Checker.checkAreaSizes(areas);
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
  var areaMap = util.create2DArray(cells.rows, cells.cols, -1)
  for (var a=0; a<areas.length; a++) {
    var clues = [];
    for (var i=0; i<areas[a].length;i++) {
      var pos = util.parseCoord(areas[a][i]);
      if (cells[pos.y][pos.x] != "") {
        clues.push(cells[pos.y][pos.x]);
      }
      areaMap[pos.y][pos.x] = a;
    }
    if (clues.length == 2 && clues.includes("white_circle") && clues.includes("black_circle")) {
      // good;
    } else {
      return {status: "Each area should contain exactly one white circle and one black circle", errors: areas[a]};
    }
  }
  for (var a=0; a<areas.length; a++) {
    let res = Checker.checkNeighbours(a, areas, areaMap);
    if (res.status != "OK") {
      return res;
    }
  }
  return {status: "OK"};
},
checkAreaSizes: function(areas) {
  var size = areas[0].length;
  for (var a=0; a<areas.length; a++) {
    var area = areas[a];
    if (area.length != size) {
      return {status: "All areas should have the same size", errors: areas[a]};
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
        return {status: "Each cell should belong to exactly one area", errors: util.coord(x, y)};
      }
    }
  }
  return {status: "OK"};
},
checkNeighbours: function(areaIndex, areas, areaMap) {
  var neighbours = [];
  for (var a=0;a<areas[areaIndex].length;a++) {
    var pos = util.parseCoord(areas[areaIndex][a]);
    const cellNeighbours = Checker.getNeighbourAreas(pos, areaIndex, areaMap);
    neighbours = neighbours.concat(cellNeighbours);
  }
  uniqueNeighbours = neighbours.filter(function(item, pos) {
    return neighbours.indexOf(item) == pos;
  });
  for(var i=0;i<uniqueNeighbours.length;i++) {
    if (Checker.sameShape(areas[areaIndex], areas[uniqueNeighbours[i]])) {
      return {status: "Areas of the same shape shouldn't share an edge", errors: areas[areaIndex].concat(areas[uniqueNeighbours[i]])};
    }
  }
  return {status: "OK"};
},
getNeighbourAreas: function(pos, areaIndex, areaMap) {
  var result = [];
  var neighbour = [{x:1, y:0}, {x:-1, y:0}, {x:0, y:1}, {x:0, y:-1}];
  for (var i=0;i<4;i++){
    var x = pos.x+neighbour[i].x;
    var y = pos.y+neighbour[i].y;
    if (x>=0 && x<areaMap.cols && y>=0 && y<areaMap.rows && areaMap[y][x] != areaIndex) {
      result.push(areaMap[y][x]);
    }
  }
  return result;
},
sameShape: function(area1, area2) {
  let shape1Code = Checker.getShapeCode(Checker.getShape(area1));
  let shape2 = Checker.getShape(area2)
  let mirroredShape2 = Checker.mirror(shape2)
  let shapesToCompare = [shape2, mirroredShape2];
  for (let i=0;i<3;i++) {
    shape2 = Checker.rotate(shape2);
    shapesToCompare.push(shape2);
    mirroredShape2 = Checker.rotate(mirroredShape2)
    shapesToCompare.push(mirroredShape2);
  }
  for (let i=0; i<shapesToCompare.length;i++) {
    if (shape1Code==Checker.getShapeCode(shapesToCompare[i])) {
      return true;
    }
  }
  return false;
},
getShape: function(area) {
  let minX=Number.MAX_VALUE;
  let minY=Number.MAX_VALUE;
  for (let i=0;i<area.length;i++){
    let pos = util.parseCoord(area[i]);
    minX = Math.min(minX, pos.x);
    minY = Math.min(minY, pos.y);
  }
  let shape = {
    width: 0,
    height: 0,
    cells: []
  }
  for (let i=0;i<area.length;i++){
    let pos = util.parseCoord(area[i]);
    let x = pos.x - minX;
    let y = pos.y - minY;
    shape.width = Math.max(shape.width, x);
    shape.height = Math.max(shape.height, y);
    shape.cells.push({x: x, y: y});
  }
  return shape;
},
getShapeCode: function(shape) {
  let code = "";
  shape.cells.sort((c1, c2) => {if (c1.x==c2.x) {return c1.y - c2.y;} else {return c1.x - c2.x} });
  for (let i=0;i<shape.cells.length;i++){
    code += shape.cells[i].x+"-"+shape.cells[i].y+",";
  }
  return code;
},
mirror: function(shape) {
  let newShape = {
    width: shape.height,
    height: shape.width,
    cells: []
  }
  for (let i=0;i<shape.cells.length;i++){
    newShape.cells.push( {x: shape.cells[i].y, y: shape.cells[i].x});
  }
  return newShape;
},
rotate: function(shape) {
  let newShape = {
    width: shape.height,
    height: shape.width,
    cells: []
  }
  for (let i=0;i<shape.cells.length;i++){
    newShape.cells.push( {x: shape.cells[i].y, y: shape.width - shape.cells[i].x});
  }
  return newShape;
},
};

module.exports = Checker;
