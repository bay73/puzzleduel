if (typeof util=="undefined") {
  var util = require('./util');
}

const Checker = {

check:function(dimension, clues, data){
  let part = dimension.split("-");
  let shipsSet = part[1];
  let dim = util.parseDimension(part[0]);
  let cells = util.create2DArray(dim.rows, dim.cols, false)
  let clue = util.create2DArray(dim.rows, dim.cols, "")
  let maxLength = 4;
  var bottom = [];
  var right = [];

  if (shipsSet=="ship3") {
    maxLength = 3;
  }
  if (shipsSet=="ship4") {
    maxLength = 4;
  }
  if (shipsSet=="ship5") {
    maxLength = 5;
  }
  let ships = {};
  let shipCounter = {};
  for (let i=1;i<=maxLength;i++){
    let codeV = "";
    let codeH = "";
    for (let j=0;j<i;j++) {
      codeV += "0-"+j.toString()+",";
      codeH += j.toString()+"-0,";
    }
    ships[codeV] = i.toString();
    ships[codeH] = i.toString();
    shipCounter[i.toString()] = i*(maxLength - i + 1);
  }

  // Parse data.
  for (var [key, value] of Object.entries(data)) {
    var pos = util.parseCoord(key);
    if (cells[pos.y]){
      cells[pos.y][pos.x] = (value == "1");
    }
  }
  // Parse clues.
  for (var [key, value] of Object.entries(clues)) {
    if (key=="bottom") {
      bottom = value;
    } else if (key=="right") {
      right = value;
    } else {
      var pos = util.parseCoord(key);
      if (value=="wave"){
        cells[pos.y][pos.x] = false;
      }
    }
  }
  var res = Checker.checkShips(cells, ships, shipCounter);
  if (res.status != "OK") {
    return res;
  }
  var res = Checker.checkColumnClues(cells, bottom);
  if (res.status != "OK") {
    return res;
  }
  var res = Checker.checkRowClues(cells, right);
  if (res.status != "OK") {
    return res;
  }
  return {status: "OK"};
},

checkShips: function(cells, ships, shipCounter) {
  var start = {x:0, y:0};
  var map = util.create2DArray(cells.rows, cells.cols, "")
  while (true) {
    let res = Checker.findNextShip(cells, start, map, ships);
    if (!res) break;
    if (res.status != "OK") {
      return res;
    }
  }
  var res = Checker.checkUsageNumber(map, shipCounter);
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
checkColumnClues: function(cells, clues) {
  for (var x=0; x < cells.cols; x++) {
    if (clues[x] && clues[x] != "white") {
      res = Checker.checkColumnClue(cells, clues[x], x);
      if (res) {
        return {status: "Wrong number of blackened cells in the column", errors: res};
      }
    }
  }
  return {status: "OK"};
},
checkColumnClue: function(cells, clue, col) {
  var blackCount = 0;
  var cellList = [];
  for (var y=0; y < cells.rows; y++) {
    cellList.push(util.coord(col, y));
    if (cells[y][col]) blackCount++;
  }
  if (blackCount.toString() != clue) return cellList;
  return null;
},
checkRowClues: function(cells, clues) {
  for (var y=0; y < cells.rows; y++) {
    if (clues[y] && clues[y] != "white") {
      res = Checker.checkRowClue(cells, clues[y], y);
      if (res) {
        return {status: "Wrong number of blackened cells in the row", errors: res};
      }
    }
  }
  return {status: "OK"};
},
checkRowClue: function(cells, clue, row) {
  var blackCount = 0;
  var cellList = [];
  for (var x=0; x < cells.cols; x++) {
    cellList.push(util.coord(x, row));
    if (cells[row][x]) blackCount++;
  }
  if (blackCount.toString() != clue) return cellList;
  return null;
},
findNextShip: function(cells, start, map, ships) {
  while (true) {
    if (start.x>=cells.cols) {
      start.x = 0;
      start.y++;
    } else if (start.y >= cells.rows) {
      return false;
    } else {
      if (cells[start.y][start.x] && map[start.y][start.x]=="") {
        let area = Checker.buildArea(cells, start, map);
        var ship = ships[area.code];
        if (typeof ship == "undefined") {
          return {status: "Each marked area should form a ship from the set" , errors: area.coords};
        }
        for (let i=0;i<area.cells.length;i++) {
          map[area.cells[i].y][area.cells[i].x]=ship;
        }
        return {status: "OK"};
      }
      start.x++;
    }
  }
  return false;
},
checkUsageNumber: function(map, shipCounter) {
  let letters = {
    "1": [],
    "2": [],
    "3": [],
    "4": [],
    "5": [],
    "6": [],
    "7": []
  };
  for (var x = 0; x < map.cols; x++) {
    for (var y = 0; y < map.rows; y++) {
      if (map[y][x]!="") {
        letters[map[y][x]].push(util.coord(x,y));
      }
    }
  }
  for(let letter of Object.keys(letters)){
    if(letters[letter].length > shipCounter[letter]) {
      return {status: "Number of the ships should correspond to the given set" , errors: letters[letter]};
    }
  }
  for(let letter of Object.keys(letters)){
    if(letters[letter].length < shipCounter[letter]) {
      return {status: "Number of the ships should correspond to the given set" , errors: letters[letter]};
    }
  }
  return {status: "OK"};
},
checkNoTouch: function(map) {
  for (var x = 0; x < map.cols; x++) {
    for (var y = 0; y < map.rows-1; y++) {
      if (map[y][x]!="") {
        if (x>0 && map[y+1][x-1]!="") {
          return {status: "Ships shouldn't touch" , errors: [util.coord(x,y), util.coord(x-1,y+1)]};
        }
        if (x<map.cols-1 && map[y+1][x+1]!="") {
          return {status: "Ships shouldn't touch" , errors: [util.coord(x,y), util.coord(x+1,y+1)]};
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
