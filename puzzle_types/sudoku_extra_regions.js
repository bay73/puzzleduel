if (typeof util=="undefined") {
  var util = require('./util');
}
if (typeof sudoku_util=="undefined") {
  var sudoku_util = require('./sudoku_util');
}

const Checker = {
check:function(dimension, clues, data){
  // Create array
  var dim = util.parseDimension(dimension);
  var cells = util.create2DArray(dim.rows, dim.cols, "")
  var shades = util.create2DArray(dim.rows, dim.cols, false)

  // Parse data.
  for (var [key, value] of Object.entries(data)) {
    var pos = util.parseCoord(key);
    if (cells[pos.y]){
      cells[pos.y][pos.x] = value;
    }
  }
  // Parse clues.
  for (var [key, value] of Object.entries(clues)) {
    var pos = util.parseCoord(key);
    if (cells[pos.y]){
      if (value.startsWith("-")) {
        shades[pos.y][pos.x] = true;
        if (value.length > 1) {
          cells[pos.y][pos.x] = value.substring(1);
        }
      } else {
        cells[pos.y][pos.x] = value;
      }
    }
  }
  colors = [];
  for (var i=1;i<=parseInt(dim.rows);i++) {
    colors.push(i.toString());
  }
  var res = sudoku_util.checkAreaMagic(cells, colors);
  if (res.status != "OK") {
    return res;
  }
  var res = sudoku_util.checkRowMagic(cells, colors);
  if (res.status != "OK") {
    return res;
  }
  var res = sudoku_util.checkColumnMagic(cells, colors);
  if (res.status != "OK") {
    return res;
  }
  var res = Checker.checkExtraRegions(cells, shades, colors);
  if (res.status != "OK") {
    return res;
  }
  return {status: "OK"};
},
checkExtraRegions: function(cells, shades, colors) {
  var used = util.create2DArray(shades.rows, shades.cols, false)
  for (var y = 0; y < cells.rows; y++) {
    for (var x = 0; x < cells.cols; x++) {
      if (shades[y][x] && !used[y][x]) {
        let start = {x: x, y: y};
        let area = Checker.buildArea(shades, start, used);
        var res = util.checkOnceInList(cells, area, colors);
        if (res){
          return {status: "All digits should be exactly once in shaded area", errors: res};
        }
      }
    }
  }
  return {status: "OK"};
},
buildArea: function(shades, start, used) {
   var area = Checker.buildSimpleArea(shades, start, used);
   while (area.length < used.rows) {
     var extention1 = []
     var extention2 = []
     var extention3 = []
     var extention4 = []
     var extended = false;
     for (let a=0; a<area.length; a++) {
       extention1 = Checker.buildSimpleArea(shades, {x: area[a].x-1, y: area[a].y-1}, used);
       extention2 = Checker.buildSimpleArea(shades, {x: area[a].x+1, y: area[a].y-1}, used);
       extention3 = Checker.buildSimpleArea(shades, {x: area[a].x-1, y: area[a].y+1}, used);
       extention4 = Checker.buildSimpleArea(shades, {x: area[a].x+1, y: area[a].y+1}, used);
       area = area.concat(extention1).concat(extention2).concat(extention3).concat(extention4);
       if (extention1.length + extention2.length + extention3.length + extention4.length != 0) {
         extended = true;
         break;
       }
     }
     if (!extended) break;
   }
   return area;
},
buildSimpleArea: function(shades, start, used) {
   var area = [];
   var queue = [];
   queue.push(start);
   while (queue.length > 0) {
     let next = queue.shift();
     if (Checker.ifCell(shades, next.x, next.y) && !used[next.y][next.x]) {
       used[next.y][next.x]=true;
       area.push({x: next.x, y: next.y});
       queue.push({x: next.x+1, y: next.y});
       queue.push({x: next.x-1, y: next.y});
       queue.push({x: next.x, y: next.y+1});
       queue.push({x: next.x, y: next.y-1});
     }
   }
   return area;
},
ifCell: function(shades, x, y) {
  return x>=0 && x<shades.cols && y>=0 && y<shades.rows && shades[y][x];
},
};

module.exports = Checker;
