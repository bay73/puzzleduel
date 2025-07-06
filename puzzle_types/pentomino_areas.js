if (typeof util=="undefined") {
  var util = require('./util');
}
if (typeof pentomino_util=="undefined") {
  var pentomino_util = require('./pentomino_util');
}

const Checker = {
check:function(dimension, clues, data){
  // Create array
  var part = dimension.split("-");
  var requiredLetters = part[1];
  if (requiredLetters=="pento12") {
    requiredLetters = "FILNPTUVWXYZ"
  }
  var dim = util.parseDimension(part[0]);
  var cells = util.create2DArray(dim.rows, dim.cols, false)

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
      var areas = value;
    } else {
      var pos = util.parseCoord(key);
      if (cells[pos.y]){
        cells[pos.y][pos.x] = false;
      }
    }
  }
  var res = pentomino_util.checkPento(cells, requiredLetters);
  if (res.status != "OK") {
    return res;
  }
  const pentoMap = res.map;
  res = Checker.checkNoTouch(cells);
  if (res.status != "OK") {
    return res;
  }
  var res = Checker.checkAreas(pentoMap, areas);
  if (res.status != "OK") {
    return res;
  }
  return {status: "OK"};
},

checkNoTouch: function(cells) {
  for (var x = 0; x < cells.cols-1; x++) {
    for (var y = 0; y < cells.rows-1; y++) {
      if (cells[y][x] && cells[y+1][x+1] && !cells[y][x+1]  && !cells[y+1][x]) {
        return {status: "Elements shouldn't touch", errors: [util.coord(x,y), util.coord(x+1,y+1)]};
      }
      if (!cells[y][x] && !cells[y+1][x+1] && cells[y][x+1]  && cells[y+1][x]) {
        return {status: "Elements shouldn't touch", errors: [util.coord(x+1,y), util.coord(x,y+1)]};
      }
    }
  }
  return {status: "OK"};
},
checkAreas: function(pentoMap, areas) {
  var areaMap = util.create2DArray(pentoMap.rows, pentoMap.cols, 0)
  for (var a=0; a<areas.length; a++) {
  	const area = areas[a];
    for (var i=0;i<area.length;i++) {
      var pos = util.parseCoord(area[i]);
      areaMap[pos.y][pos.x]=a;
    }
  }
  var pentoAreas={}
  var pentoCells={}
  for (var x = 0; x < pentoMap.cols; x++) {
    for (var y = 0; y < pentoMap.rows; y++) {
      if (pentoMap[y][x]!=""){
        const letter=pentoMap[y][x];
        if (pentoCells[letter]==undefined) {
          pentoCells[letter] = []
        }
        pentoCells[letter].push(util.coord(x, y));
        if (pentoAreas[letter]==undefined) {
          pentoAreas[letter] = []
        }
        if (!pentoAreas[letter].includes(areaMap[y][x])){
          pentoAreas[letter].push(areaMap[y][x]);
        }
      }
    }
  }
  for (const letter in pentoAreas) {
   	if (pentoAreas[letter].length != 1) {
      return {status: "Each pentomino should be fully inside one area", errors: pentoCells[letter]};
   	}
  }
  return {status: "OK"};
},
};

module.exports = Checker;
