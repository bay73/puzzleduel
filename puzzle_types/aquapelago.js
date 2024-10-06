if (typeof util=="undefined") {
  var util = require('./util');
}

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
    var pos = util.parseCoord(key);
    if (cluecells[pos.y]){
      cluecells[pos.y][pos.x] = value;
      cells[pos.y][pos.x] = true;
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
  var res = Checker.checkNo2x2(cells);
  if (res.status != "OK") {
    return res;
  }
  var res = Checker.checkAreas(cells, cluecells);
  if (res.status != "OK") {
    return res;
  }
  return {status: "OK"}
},

checkConnected: function(cells) {
  if (!util.checkConnected(cells, [false])) {
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
checkNo2x2: function(cells) {
  var res = util.find2x2(cells, [false]);
  if (res){
    return {status: "No 2x2 squares are allowed", errors: res};status
  }
  return {status: "OK"};
},
checkAreas: function(cells, cluecells) {
  const areas = util.getConnectedAreas(cells, [true], true);
  for (let a=0; a<areas.length;a++) {
    let good = true;
    const area = areas[a];
    const coords = []
    for (let i=0; i<area.length;i++) {
      coords.push(util.coord(area[i].x,area[i].y))
      if (cluecells[area[i].y][area[i].x]!="" && cluecells[area[i].y][area[i].x]!="grey" && cluecells[area[i].y][area[i].x]!=area.length.toString()) {
        good = false;
      }
    }
    if (!good) {
      return {status: "The clue is not correct", errors: coords};
    }
  }
  return {status: "OK"};
},
};

module.exports = Checker;
