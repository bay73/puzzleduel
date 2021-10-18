if (typeof util=="undefined") {
  var util = require('./util');
}

const Checker = {
check:function(dimension, clues, data){
  // Create array
  var dim = util.parseDimension(dimension);
  var cells = util.create2DArray(dim.rows, dim.cols, "")
  var nodes = util.create2DArray(dim.rows, dim.cols, "")

  // Parse data.
  for (var [key, value] of Object.entries(data)) {
    var pos = util.parseCoord(key);
    if (cells[pos.y]){
      cells[pos.y][pos.x] = value;
    }
  }
  // Parse clues.
  for (var [key, value] of Object.entries(clues)) {
    if (key=="nodes") {
      for (const [nkey, nvalue] of Object.entries(value)) {
        var part = nkey.split("-");
        var coord = util.parseCoord(part[0]);
        if (typeof part[1]!="undefined") {
          var side = parseInt(part[1]);
          if (side==0) {
            coord.y--;
            coord.x--;
          } else if (side==1) {
            coord.y--;
          } else if (side==3) {
            coord.x--;
          }
        }
        nodes[coord.y][coord.x] = nvalue;
      }
    }
  }
  var colors = [];
  for (var i=1;i<=parseInt(dim.rows);i++) {
    colors.push(i.toString());
  }
  var res = Checker.checkColumnMagic(cells, colors);
  if (res.status != "OK") {
    return res;
  }
  var res = Checker.checkRowMagic(cells, colors);
  if (res.status != "OK") {
    return res;
  }
  var res = Checker.checkClues(cells, nodes);
  if (res.status != "OK") {
    return res;
  }
  return {status: "OK"};
},

checkClues: function(cells, nodes) {
  for (var x = 0; x < nodes.cols; x++) {
    for (var y = 0; y < nodes.rows; y++) {
      if (nodes[y][x]) {
        var product = parseInt(cells[y][x])*parseInt(cells[y][x+1])*parseInt(cells[y+1][x])*parseInt(cells[y+1][x+1]);
        if (product.toString() != nodes[y][x]) {
          return {status: "The clue is not correct" , errors: [util.coord(x,y),util.coord(x+1,y),util.coord(x,y+1),util.coord(x+1,y+1)]};
        }
      }
    }
  }
  return {status: "OK"};
},
checkRowMagic: function(cells, colors) {
  var res = util.checkOnceInRows(cells, colors);
  if (res){
    return {status: "All digits should be exactly once in every row", errors: res};
  }
  return {status: "OK"};
},
checkColumnMagic: function(cells, colors) {
  var res = util.checkOnceInColumns(cells, colors);
  if (res){
    return {status: "All digits should be exactly once in every column", errors: res};
  }
  return {status: "OK"};
}
};

module.exports = Checker;
