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
  var firstSum = null;
  var firstArea = null;
  for (var y = 0; y < cells.rows; y++) {
    for (var x = 0; x < cells.cols; x++) {
      if (shades[y][x] && !used[y][x]) {
        let start = {x: x, y: y};
        let area = Checker.buildArea(shades, start, used);
        var areaSum = Checker.areaSum(cells, area);
        if (firstSum == null) {
          firstSum = areaSum;
          firstArea = area;
        } else {
          if (areaSum != firstSum) {
            var cellList = [];
            for (var i = 0; i < area.length; i++) {
              cellList.push(util.coord(area[i].x,area[i].y));
            }
            for (var i = 0; i < firstArea.length; i++) {
              cellList.push(util.coord(firstArea[i].x,firstArea[i].y));
            }
            return {status: "Sum of digits in each grey region should be the same", errors: cellList};
          }
        }
      }
    }
  }
  return {status: "OK"};
},
buildArea: function(shades, start, used) {
   var area = Checker.buildSimpleArea(shades, start, used);
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
  areaSum: function(cells, positionsToCheck) {
    var sum = 0;
    for (var i = 0; i < positionsToCheck.length; i++) {
      var value = parseInt(cells[positionsToCheck[i].y][positionsToCheck[i].x]);
      sum += value;
    }
    return sum;
  }

};

module.exports = Checker;
