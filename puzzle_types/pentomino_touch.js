const util = require('./util');

const Checker = {
pentominoes: {
 "0-0,1-0,0-1,-1-1,0-2,": "F",
 "0-0,0-1,1-1,-1-1,1-2,": "F",
 "0-0,0-1,1-1,0-2,-1-2,": "F",
 "0-0,0-1,1-1,2-1,1-2,": "F",
 "0-0,1-0,1-1,2-1,1-2,": "F",
 "0-0,0-1,-1-1,-2-1,-1-2,": "F",
 "0-0,0-1,-1-1,0-2,1-2,": "F",
 "0-0,0-1,1-1,-1-1,-1-2,": "F",
 "0-0,1-0,2-0,3-0,4-0,": "I",
 "0-0,0-1,0-2,0-3,0-4,": "I",
 "0-0,0-1,0-2,0-3,1-3,":"L",
 "0-0,1-0,0-1,2-0,3-0,":"L",
 "0-0,1-0,1-1,1-2,1-3,":"L",
 "0-0,0-1,-1-1,-2-1,-3-1,":"L",
 "0-0,0-1,0-2,0-3,-1-3,":"L",
 "0-0,0-1,1-1,2-1,3-1,":"L",
 "0-0,1-0,0-1,0-2,0-3,":"L",
 "0-0,1-0,2-0,3-0,3-1,":"L",
 "0-0,0-1,-1-1,-1-2,-1-3,": "N",
 "0-0,1-0,2-0,2-1,3-1,": "N",
 "0-0,0-1,0-2,-1-2,-1-3,": "N",
 "0-0,1-0,1-1,2-1,3-1,": "N",
 "0-0,0-1,1-1,1-2,1-3,": "N",
 "0-0,1-0,0-1,-1-1,-2-1,": "N",
 "0-0,0-1,0-2,1-2,1-3,": "N",
 "0-0,1-0,0-1,2-0,-1-1,": "N",
 "0-0,1-0,0-1,1-1,0-2,": "P",
 "0-0,1-0,2-0,1-1,2-1,": "P",
 "0-0,0-1,-1-1,0-2,-1-2,": "P",
 "0-0,1-0,0-1,1-1,2-1,": "P",
 "0-0,1-0,0-1,1-1,1-2,": "P",
 "0-0,1-0,0-1,1-1,-1-1,": "P",
 "0-0,0-1,1-1,0-2,1-2,": "P",
 "0-0,1-0,0-1,2-0,1-1,": "P",
 "0-0,1-0,2-0,1-1,1-2,": "T",
 "0-0,0-1,-1-1,0-2,-2-1,": "T",
 "0-0,0-1,0-2,1-2,-1-2,": "T",
 "0-0,0-1,1-1,0-2,2-1,": "T",
 "0-0,0-1,1-1,2-1,2-0,": "U",
 "0-0,1-0,0-1,0-2,1-2,": "U",
 "0-0,1-0,0-1,2-0,2-1,": "U",
 "0-0,1-0,1-1,1-2,0-2,": "U",
 "0-0,0-1,0-2,1-2,2-2,": "V",
 "0-0,1-0,0-1,2-0,0-2,": "V",
 "0-0,1-0,2-0,2-1,2-2,": "V",
 "0-0,0-1,0-2,-1-2,-2-2,": "V",
 "0-0,0-1,1-1,1-2,2-2,": "W",
 "0-0,1-0,0-1,-1-1,-1-2,": "W",
 "0-0,1-0,1-1,2-1,2-2,": "W",
 "0-0,0-1,-1-1,-1-2,-2-2,": "W",
 "0-0,0-1,1-1,-1-1,0-2,": "X",
 "0-0,0-1,1-1,0-2,0-3,": "Y",
 "0-0,1-0,2-0,3-0,2-1,": "Y",
 "0-0,0-1,0-2,-1-2,0-3,": "Y",
 "0-0,0-1,1-1,-1-1,2-1,": "Y",
 "0-0,0-1,-1-1,0-2,0-3,": "Y",
 "0-0,0-1,1-1,-1-1,-2-1,": "Y",
 "0-0,0-1,0-2,1-2,0-3,": "Y",
 "0-0,1-0,2-0,1-1,3-0,": "Y",
 "0-0,1-0,1-1,1-2,2-2,": "Z",
 "0-0,0-1,-1-1,-2-1,-2-2,": "Z",
 "0-0,1-0,0-1,0-2,-1-2,": "Z",
 "0-0,0-1,1-1,2-1,2-2,": "Z",
},

check:function(dimension, clues, data){
  // Create array
  var dim = util.parseDimension(dimension);
  var cells = util.create2DArray(dim.rows, dim.cols, false)
  var clue = util.create2DArray(dim.rows, dim.cols, false)

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
        clue[coord.y][coord.x] = (nvalue==1);
      }
    } else {
      var pos = util.parseCoord(key);
      if (value=="cross"){
        cells[pos.y][pos.x] = false;
      }
    }
  }
  var res = Checker.checkPento(cells);
  if (res.status != "OK") {
    return res;
  }
  res = Checker.checkClues(cells, clue);
  if (res.status != "OK") {
    return res;
  }
  return {status: "OK"};
},

checkPento: function(cells) {
  var start = {x:0, y:0};
  var map = util.create2DArray(cells.rows, cells.cols, "")
  while (true) {
    let res = Checker.findNextPentomino(cells, start, map);
    if (!res) break;
    if (res.status != "OK") {
      return res;
    }
  }
  var res = Checker.checkAllUsedOnce(map);
  if (res.status != "OK") {
    return res;
  }
  return {status: "OK"};
},
ifCell: function(cells, x, y) {
  return x>=0 && x<cells.cols && y>=0 && y<cells.rows && cells[y][x];
},
checkClues: function(cells, clue) {
  for (var x = 0; x < clue.cols-1; x++) {
    for (var y = 0; y < clue.rows-1; y++) {
      var isBattenberg = cells[y][x] == cells[y+1][x+1] && cells[y][x+1] == cells[y+1][x] && cells[y][x] != cells[y][x+1];
      if (isBattenberg && !clue[y][x]) {
        return {status: "Elements should touch at marked nodes",
                errors: [util.coord(x,y), util.coord(x+1,y), util.coord(x,y+1), util.coord(x+1,y+1)]};
      }
      if (!isBattenberg && clue[y][x]) {
        return {status: "Elements should touch at marked nodes",
                errors: [util.coord(x,y), util.coord(x+1,y), util.coord(x,y+1), util.coord(x+1,y+1)]};
      }
    }
  }
  return {status: "OK"};
},
findNextPentomino: function(cells, start, map) {
  while (true) {
    if (start.x>=cells.cols) {
      start.x = 0;
      start.y++;
    } else if (start.y >= cells.rows) {
      return false;
    } else {
      if (cells[start.y][start.x] && map[start.y][start.x]=="") {
        let area = Checker.buildArea(cells, start, map);
        if (area.cells.length != 5) {
          return {status: "Each marked area should form a pentomino" , errors: area.coords};
        }
        var tetro = Checker.pentominoes[area.code];
        if (typeof tetro == "undefined") {
          return {status: "Each marked area should form a pentomino" , errors: area.coords};
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
    "F": [],
    "I": [],
    "L": [],
    "N": [],
    "P": [],
    "T": [],
    "U": [],
    "V": [],
    "W": [],
    "X": [],
    "Y": [],
    "Z": []
  };
  for (var x = 0; x < map.cols; x++) {
    for (var y = 0; y < map.rows; y++) {
      if (map[y][x]!="") {
        letters[map[y][x]].push(util.coord(x,y));
      }
    }
  }
  for(let letter of Object.keys(letters)){
    if(letters[letter].length > 5) {
      return {status: "Each element should be used exactly once" , errors: letters[letter]};
    }
  }
  for(let letter of Object.keys(letters)){
    if(letters[letter].length < 5) {
      return {status: "Each element should be used exactly once" , errors: letters[letter]};
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
