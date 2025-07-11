if (typeof util=="undefined") {
  var util = require('./util');
}

const PentominoUtil = {
pentominoes: {
 "0-0,1-0,-1-1,0-1,0-2,": "F",
 "0-0,-1-1,0-1,1-1,1-2,": "F",
 "0-0,0-1,1-1,-1-2,0-2,": "F",
 "0-0,0-1,1-1,2-1,1-2,": "F",
 "0-0,1-0,1-1,2-1,1-2,": "F",
 "0-0,-2-1,-1-1,0-1,-1-2,": "F",
 "0-0,-1-1,0-1,0-2,1-2,": "F",
 "0-0,-1-1,0-1,1-1,-1-2,": "F",
 "0-0,1-0,2-0,3-0,4-0,": "I",
 "0-0,0-1,0-2,0-3,0-4,": "I",
 "0-0,0-1,0-2,0-3,1-3,":"L",
 "0-0,1-0,2-0,3-0,0-1,":"L",
 "0-0,1-0,1-1,1-2,1-3,":"L",
 "0-0,-3-1,-2-1,-1-1,0-1,":"L",
 "0-0,0-1,0-2,-1-3,0-3,":"L",
 "0-0,0-1,1-1,2-1,3-1,":"L",
 "0-0,1-0,0-1,0-2,0-3,":"L",
 "0-0,1-0,2-0,3-0,3-1,":"L",
 "0-0,-1-1,0-1,-1-2,-1-3,": "N",
 "0-0,1-0,2-0,2-1,3-1,": "N",
 "0-0,0-1,-1-2,0-2,-1-3,": "N",
 "0-0,1-0,1-1,2-1,3-1,": "N",
 "0-0,0-1,1-1,1-2,1-3,": "N",
 "0-0,1-0,-2-1,-1-1,0-1,": "N",
 "0-0,0-1,0-2,1-2,1-3,": "N",
 "0-0,1-0,2-0,-1-1,0-1,": "N",
 "0-0,1-0,0-1,1-1,0-2,": "P",
 "0-0,1-0,2-0,1-1,2-1,": "P",
 "0-0,-1-1,0-1,-1-2,0-2,": "P",
 "0-0,1-0,0-1,1-1,2-1,": "P",
 "0-0,1-0,0-1,1-1,1-2,": "P",
 "0-0,1-0,-1-1,0-1,1-1,": "P",
 "0-0,0-1,1-1,0-2,1-2,": "P",
 "0-0,1-0,2-0,0-1,1-1,": "P",
 "0-0,1-0,2-0,1-1,1-2,": "T",
 "0-0,-2-1,-1-1,0-1,0-2,": "T",
 "0-0,0-1,-1-2,0-2,1-2,": "T",
 "0-0,0-1,1-1,2-1,0-2,": "T",
 "0-0,2-0,0-1,1-1,2-1,": "U",
 "0-0,1-0,0-1,0-2,1-2,": "U",
 "0-0,1-0,2-0,0-1,2-1,": "U",
 "0-0,1-0,1-1,0-2,1-2,": "U",
 "0-0,0-1,0-2,1-2,2-2,": "V",
 "0-0,1-0,2-0,0-1,0-2,": "V",
 "0-0,1-0,2-0,2-1,2-2,": "V",
 "0-0,0-1,-2-2,-1-2,0-2,": "V",
 "0-0,0-1,1-1,1-2,2-2,": "W",
 "0-0,1-0,-1-1,0-1,-1-2,": "W",
 "0-0,1-0,1-1,2-1,2-2,": "W",
 "0-0,-1-1,0-1,-2-2,-1-2,": "W",
 "0-0,-1-1,0-1,1-1,0-2,": "X",
 "0-0,0-1,1-1,0-2,0-3,": "Y",
 "0-0,1-0,2-0,3-0,2-1,": "Y",
 "0-0,0-1,-1-2,0-2,0-3,": "Y",
 "0-0,-1-1,0-1,1-1,2-1,": "Y",
 "0-0,-1-1,0-1,0-2,0-3,": "Y",
 "0-0,-2-1,-1-1,0-1,1-1,": "Y",
 "0-0,0-1,0-2,1-2,0-3,": "Y",
 "0-0,1-0,2-0,3-0,1-1,": "Y",
 "0-0,1-0,1-1,1-2,2-2,": "Z",
 "0-0,-2-1,-1-1,0-1,-2-2,": "Z",
 "0-0,1-0,0-1,-1-2,0-2,": "Z",
 "0-0,0-1,1-1,2-1,2-2,": "Z",
},

checkPento: function(cells, requiredLetters) {
  var start = {x:0, y:0};
  var map = util.create2DArray(cells.rows, cells.cols, "")
  var count = 0;
  while (true) {
    let res = PentominoUtil.findNextPentomino(cells, start, map, requiredLetters, count);
    if (!res) break;
    if (res.status != "OK") {
      return res;
    }
    count++;
  }
  var res = PentominoUtil.checkAllUsedOnce(map, requiredLetters);
  if (res.status != "OK") {
    return res;
  }
  return {status: "OK", map: map};
},
ifCell: function(cells, x, y) {
  return x>=0 && x<cells.cols && y>=0 && y<cells.rows && cells[y][x];
},
findNextPentomino: function(cells, start, map, requiredLetters, count) {
  while (true) {
    if (start.x>=cells.cols) {
      start.x = 0;
      start.y++;
    } else if (start.y >= cells.rows) {
      return false;
    } else {
      if (cells[start.y][start.x] && map[start.y][start.x]=="") {
        let area = PentominoUtil.buildArea(cells, start, map);
        if (area.cells.length != 5) {
          return {status: "Each marked area should form a pentomino from the given set" , errors: area.coords};
        }
        var pento = PentominoUtil.pentominoes[area.code];
        if (typeof pento == "undefined" || !requiredLetters.includes(pento)) {
          return {status: "Each marked area should form a pentomino from the given set" , errors: area.coords};
        }
        for (let i=0;i<area.cells.length;i++) {
          map[area.cells[i].y][area.cells[i].x]=pento+"-"+count.toString();
        }
        return {status: "OK"};
      }
      start.x++;
    }
  }
  return false;
},
checkAllUsedOnce: function(map, requiredLetters) {
  let lettersRequired = {};
  let letters = {};
  for (let i=0;i<requiredLetters.length;i++) {
    let letter = requiredLetters.charAt(i);
    if (!lettersRequired[letter]) {
      letters[letter] = [];
      lettersRequired[letter] = 5;
    } else {
      lettersRequired[letter] += 5;
    }
  }
  for (var x = 0; x < map.cols; x++) {
    for (var y = 0; y < map.rows; y++) {
      if (map[y][x]!="") {
        letters[map[y][x].charAt(0)].push(util.coord(x,y));
      }
    }
  }
  for(let letter of Object.keys(letters)){
    if(letters[letter].length > lettersRequired[letter]) {
      return {status: "Each element should be used exactly same number of times as given" , errors: letters[letter]};
    }
  }
  for(let letter of Object.keys(letters)){
    if(letters[letter].length < lettersRequired[letter]) {
      return {status: "Each element should be used exactly same number of times as given" , errors: letters[letter]};
    }
  }
  return {status: "OK"};
},
buildArea: function(cells, start, map) {
   var area = {
     cells: [],
     coords: [],
   };
   var queue = [];
   queue.push(start);
   while (queue.length > 0) {
     let next = queue.shift();
     if (PentominoUtil.ifCell(cells, next.x, next.y) && map[next.y][next.x]=="") {
       map[next.y][next.x]=".";
       area.cells.push({x: next.x, y: next.y});
       area.coords.push(util.coord(next.x, next.y));
       queue.push({x: next.x+1, y: next.y});
       queue.push({x: next.x-1, y: next.y});
       queue.push({x: next.x, y: next.y+1});
       queue.push({x: next.x, y: next.y-1});
     }
   }
   area.code = PentominoUtil.getAreaCode(area.coords)
   return area;
},
getAreaCode: function(area) {
  let sortedCells = area
    .map(coord => util.parseCoord(coord))
    .sort((pos1, pos2) => {
      if (pos1.y < pos2.y) {
        return -1;
      } else if (pos2.y < pos1.y) {
        return 1;
      } else {
        return Math.sign(pos1.x - pos2.x);
      }
    })
  let start = sortedCells[0];  
  var code = "";
  sortedCells.forEach( pos => code+= (pos.x-start.x)+"-"+(pos.y-start.y)+",")
  return code
},
};

module.exports = PentominoUtil;
