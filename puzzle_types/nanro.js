if (typeof util=="undefined") {
  var util = require('./util');
}

var Checker = {
check:function(dimension, clues, data){
  // Create array
  var dim = util.parseDimension(dimension);
  var cells = util.create2DArray(dim.rows, dim.cols, "")

  // Parse data.
  for (var [key, value] of Object.entries(data)) {
    var pos = util.parseCoord(key);
    if (cells[pos.y]){
      cells[pos.y][pos.x] = value;
    }
  }
  // Parse clues.
  for (var [key, value] of Object.entries(clues)) {
    if (key=="areas") {
      areas = value;
    } else {
      var pos = util.parseCoord(key);
      if (cells[pos.y]){
        cells[pos.y][pos.x] = value;
      }
    }
  }
  var res = Checker.checkAreas(areas, cells);
  if (res.status != "OK") {
    return res;
  }
  var res = Checker.checkNoTouch(areas, cells);
  if (res.status != "OK") {
    return res;
  }
  var res = Checker.checkNo2x2(cells);
  if (res.status != "OK") {
    return res;
  }
  var res = Checker.checkConnected(cells);
  if (res.status != "OK") {
    return res;
  }
  return {status: "OK"};
},
checkAreas: function(areas, cells) {
  for (var i = 0; i < areas.length; i++) {
    var area = areas[i];
    var values = [];
    for (var j = 0; j < area.length; j++) {
      var pos = util.parseCoord(area[j]);
      var value = parseInt(cells[pos.y][pos.x]);
      if (value) {
        values.push(value);
      }
    }
    var valCount = values.length
    if (valCount==0) {
      return {status: "Each area should contain at least one number", errors: area};
    }
    for (var j = 0; j < values.length; j++) {
      if (values[j] != valCount) {
        return {status: "All numbers in the area should be equal to the number of cells in the area containing a number", errors: area};
      }
    }
  }
  return {status: "OK"};
},
checkNoTouch: function(areas, cells) {
  var areaMap = util.create2DArray(cells.rows, cells.cols, -1)
  for (var a=0; a<areas.length; a++) {
    for (var i=0; i<areas[a].length;i++) {
      var pos = util.parseCoord(areas[a][i]);
      areaMap[pos.y][pos.x] = a;
    }
  }
  var res = Checker.findTouch(areaMap, cells);
  if (res){
    return {status: "Two cells sharing a bold edge shouldn't contain the same numbers", errors: res};
  }
  return {status: "OK"};
},
findTouch: function(areaMap, cells) {
  for (var y = 0; y < cells.rows; y++) {
    for (var x = 0; x < cells.cols; x++) {
      if (y<cells.rows-1&&cells[y][x]&&cells[y][x]==cells[y+1][x]&&areaMap[y][x]!=areaMap[y+1][x]){
        return [util.coord(x,y), util.coord(x,y+1)];
      }
      if (x<cells.cols-1&&cells[y][x]&&cells[y][x]==cells[y][x+1]&&areaMap[y][x]!=areaMap[y][x+1]){
        return [util.coord(x,y), util.coord(x+1,y)];
      }
    }
  }
  return null;
},
checkNo2x2: function(cells) {
  var res = util.find2x2(cells, ["1","2","3","4","5","6","7","8","9"]);
  if (res){
    return {status: "No 2x2 squares fully occupied with digits are allowed", errors: res};
  }
  return {status: "OK"};
},
checkConnected: function(cells) {
  if (!util.checkConnected(cells, ["1","2","3","4","5","6","7","8","9"])) {
    return {status: "Area occupied by the digits should be connected"};
  }
  return {status: "OK"};
}
};

module.exports = Checker;
