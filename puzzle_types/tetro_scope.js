if (typeof util=="undefined") {
  var util = require('./util');
}

const Checker = {
tetrominoes: {
 "0-0,1-0,0-1,1-1,": "O",
 "0-0,1-0,2-0,3-0,": "I",
 "0-0,0-1,0-2,0-3,": "I",
 "0-0,1-0,1-1,2-1,": "Z",
 "0-0,0-1,-1-1,-1-2,": "Z",
 "0-0,1-0,0-1,-1-1,": "S",
 "0-0,0-1,1-1,1-2,": "S",
 "0-0,0-1,1-1,0-2,": "T",
 "0-0,1-0,2-0,1-1,": "T",
 "0-0,0-1,-1-1,0-2,": "T",
 "0-0,0-1,1-1,-1-1,": "T",
 "0-0,0-1,0-2,1-2,": "L",
 "0-0,0-1,-1-1,-2-1,": "L",
 "0-0,1-0,1-1,1-2,": "L",
 "0-0,1-0,0-1,2-0,": "L",
 "0-0,0-1,0-2,-1-2,": "J",
 "0-0,1-0,0-1,0-2,": "J",
 "0-0,1-0,2-0,2-1,": "J",
 "0-0,0-1,1-1,2-1,": "J"
},

check:function(dimension, clues, data){
  // Create array
  var dim = util.parseDimension(dimension);
  var cells = util.create2DArray(dim.rows, dim.cols, false)
  var clue = util.create2DArrayExtended(dim.rows, dim.cols, "")

  // Parse data.
  for (var [key, value] of Object.entries(data)) {
    var pos = util.parseCoord(key);
    if (cells[pos.y]){
      cells[pos.y][pos.x] = (value == "1");
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
        clue[coord.y][coord.x] = nvalue;
      }
    } else {
      var pos = util.parseCoord(key);
      if (value=="cross"){
        cells[pos.y][pos.x] = false;
      }
    }
  }
  var res = Checker.checkTetro(cells);
  if (res.status != "OK") {
    return res;
  }
  res = Checker.checkClues(cells, clue);
  if (res.status != "OK") {
    return res;
  }
  return {status: "OK"};
},

checkTetro: function(cells) {
  var start = {x:0, y:0};
  var map = util.create2DArray(cells.rows, cells.cols, "")
  while (true) {
    let res = Checker.findNextTetromino(cells, start, map);
    if (!res) break;
    if (res.status != "OK") {
      return res;
    }
  }
  var res = Checker.checkAllUsedOnce(map);
  if (res.status != "OK") {
    return res;
  }
  var res = Checker.checkNoTouch(map);
  if (res.status != "OK") {
    return res;
  }
  return {status: "OK"};
},
ifCell: function(cells, x, y) {
  return x>=0 && x<cells.cols && y>=0 && y<cells.rows && cells[y][x];
},
checkClues: function(cells, clue) {
  for (var x = -1; x < clue.cols; x++) {
    for (var y = -1; y < clue.rows; y++) {
      if (clue[y][x]) {
        var count = 0;
        if (Checker.ifCell(cells, x, y)) count++;
        if (Checker.ifCell(cells, x+1, y)) count++;
        if (Checker.ifCell(cells, x, y+1)) count++;
        if (Checker.ifCell(cells, x+1, y+1)) count++;
        if (count.toString() != clue[y][x]) {
          return {status: "The clue is not correct" , errors: [util.coord(x,y),util.coord(x+1,y),util.coord(x,y+1),util.coord(x+1,y+1)]};
        }
      }
    }
  }
  return {status: "OK"};
},
findNextTetromino: function(cells, start, map) {
  while (true) {
    if (start.x>=cells.cols) {
      start.x = 0;
      start.y++;
    } else if (start.y >= cells.rows) {
      return false;
    } else {
      if (cells[start.y][start.x] && map[start.y][start.x]=="") {
        let area = Checker.buildArea(cells, start, map);
        if (area.cells.length != 4) {
          return {status: "Each marked area should form a tetromino" , errors: area.coords};
        }
        var tetro = Checker.tetrominoes[area.code];
        if (typeof tetro == "undefined") {
          return {status: "Each marked area should form a tetromino" , errors: area.coords};
        }
        for (let i=0;i<area.cells.length;i++) {
          map[area.cells[i].y][area.cells[i].x]=tetro;
        }
        return {status: "OK"};
      }
      start.x++;
    }
  }
  return false;
},
checkAllUsedOnce: function(map) {
  let letters = {
    "L": [],
    "J": [],
    "I": [],
    "T": [],
    "S": [],
    "Z": [],
    "O": []
  };
  for (var x = 0; x < map.cols; x++) {
    for (var y = 0; y < map.rows; y++) {
      if (map[y][x]!="") {
        letters[map[y][x]].push(util.coord(x,y));
      }
    }
  }
  for(let letter of Object.keys(letters)){
    if(letters[letter].length > 4) {
      return {status: "Each element should be used exactly once" , errors: letters[letter]};
    }
  }
  for(let letter of Object.keys(letters)){
    if(letters[letter].length < 4) {
      return {status: "Each element should be used exactly once" , errors: letters[letter]};
    }
  }
  return {status: "OK"};
},
checkNoTouch: function(map) {
  for (var x = 0; x < map.cols; x++) {
    for (var y = 0; y < map.rows-1; y++) {
      if (map[y][x]!="") {
        if (x>0 && map[y+1][x-1]!="" && map[y+1][x-1]!=map[y][x]) {
          return {status: "Elements shouldn't touch" , errors: [util.coord(x,y), util.coord(x-1,y+1)]};
        }
        if (x<map.cols-1 && map[y+1][x+1]!="" && map[y+1][x+1]!=map[y][x]) {
          return {status: "Elements shouldn't touch" , errors: [util.coord(x,y), util.coord(x+1,y+1)]};
        }
      }
    }
  }
  return {status: "OK"};
},
buildArea: function(cells, start, map) {
   var area = {
     cells: [],
     coords: [],
     code: ""
   };
   var queue = [];
   queue.push(start);
   while (queue.length > 0) {
     let next = queue.shift();
     if (Checker.ifCell(cells, next.x, next.y) && map[next.y][next.x]=="") {
       map[next.y][next.x]=".";
       area.cells.push({x: next.x, y: next.y});
       area.coords.push(util.coord(next.x, next.y));
       area.code+=(next.x-start.x)+"-"+(next.y-start.y)+",";
       queue.push({x: next.x+1, y: next.y});
       queue.push({x: next.x-1, y: next.y});
       queue.push({x: next.x, y: next.y+1});
       queue.push({x: next.x, y: next.y-1});
     }
   }
   return area;
}
};

module.exports = Checker;
