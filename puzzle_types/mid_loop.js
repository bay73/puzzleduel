if (typeof util=="undefined") {
  var util = require('./util');
}

const CENTER = 1;
const CORNER = 2;
const RIGHT = 3;
const BOTTOM = 4;

const Checker = {
check:function(dimension, clueData, data){
  // Create array
  var dim = util.parseDimension(dimension);
  var v = util.create2DArray(dim.rows, dim.cols, false)
  var h = util.create2DArray(dim.rows, dim.cols, false)
  var cluecells = util.create2DArray(dim.rows, dim.cols, 0)

  // Parse data.
  for (var [key, value] of Object.entries(data)) {
    if (key=='connectors') {
      for (var [cKey, cValue] of Object.entries(value)) {
        if (cValue=='1') {
          var part = cKey.split("-");
          var pos = util.parseCoord(part[0]);
          if (part[1]=="v") {
            v[pos.y][pos.x] = true;
          }
          if (part[1]=="h") {
            h[pos.y][pos.x] = true;
          }
        }
      }
    } else {
      var pos = util.parseCoord(key);
      if (v[pos.y]){
        v[pos.y][pos.x] = (value.v=="true");
        h[pos.y][pos.x] = (value.h=="true");
      }
    }
  }
  // Parse clues.
  for (var [key, value] of Object.entries(clueData)) {
    if (key=="edges"){
      for (var [edgeKey, edgeValue] of Object.entries(value)) {
        if (edgeValue=="black_circle") {
          var part = edgeKey.split("-");
          var pos = util.parseCoord(part[0]);
          if (part[1]=="b" || part[1]=="2") {
            cluecells[pos.y][pos.x] = BOTTOM;
          }
          if (part[1]=="r" || part[1]=="1") {
            cluecells[pos.y][pos.x] = RIGHT;
          }
        }
      }
    } else {
      if (value=="small_circle") {
        var pos = util.parseCoord(key);
        cluecells[pos.y][pos.x] = CENTER;
      }
    }
  }
  var res = Checker.checkPassedClues(cluecells, v, h);
  if (res.status != "OK") {
    return res;
  }
  var lineRes = Checker.buildLine(v, h);
  if (lineRes.status != "OK") {
    return lineRes;
  }
  var res = Checker.checkLoop(lineRes.line, cluecells, v, h);
  if (res.status != "OK") {
    return res;
  }
  return {status: "OK"};
},
checkPassedClues: function(cluecells, v, h) {
  for (var x=0;x < h.cols;x++) {
    for (var y=0;y < h.rows; y++) {
      if (cluecells[y][x]==CENTER) {
        if (!v[y][x] && !h[y][x]) {
          return {status: "Loop should pass straight through all circles", errors: [util.coord(x, y)]};
        }
      }
      if (cluecells[y][x]==BOTTOM) {
        if (!v[y][x] ) {
          return {status: "Loop should pass straight through all circles", errors: [util.coord(x, y), util.coord(x, y+1)]};
        }
      }
      if (cluecells[y][x]==RIGHT) {
        if (!h[y][x] ) {
          return {status: "Loop should pass straight through all circles", errors: [util.coord(x, y), util.coord(x+1, y)]};
        }
      }
    }
  }
  return {status: "OK"};
},
buildLine: function(v, h) {
  var start = Checker.findStart(h);
  if (!start) {
    return {status: "There should be single loop passing through some cells"};
  }
  var line = [];
  line[0] = start;
  line[1] = {x:start.x + 1, y:start.y };
  length = 1;
  var prev = line[0];
  var current = line[1];
  var next = {};
  while (current.x != start.x || current.y != start.y) {
    var nextCount = 0;
    if (current.x > 0 && h[current.y][current.x-1] && (current.x-1 != prev.x || current.y != prev.y)) {
      nextCount++;
      next = {x: current.x-1, y: current.y};
    }
    if (current.x < h.cols-1 && h[current.y][current.x] && (current.x+1 != prev.x || current.y != prev.y)) {
      nextCount++;
      next = {x: current.x+1, y: current.y};
    }
    if (current.y > 0 && v[current.y-1][current.x] && (current.x != prev.x || current.y-1 != prev.y)) {
      nextCount++;
      next = {x: current.x, y: current.y-1};
    }
    if (current.y < v.rows-1 && v[current.y][current.x] && (current.x != prev.x || current.y+1 != prev.y)) {
      nextCount++;
      next = {x: current.x, y: current.y+1};
    }
    if (nextCount != 1) {
      return {status: "There should be single loop without bifurcations", errors: [util.coord(current.x,current.y)]};
    }
    length++;
    line[length] = {x:next.x, y:next.y};
    prev = current;
    current = next;
  }
  return {status: "OK", line: line};
},
findStart: function(h) {
  for (var x=0;x < h.cols;x++) {
    for (var y=0;y < h.rows; y++) {
      if (h[y][x]) return {x:x, y:y};
    }
  }
  return null;
},
checkLoop: function(line, clues, v, h) {
  var used = util.create2DArray(clues.rows, clues.cols, false)
  var prevDirection = 'h';
  var lastTurn = {x: line[0].x, y: line[0].y}
  var lastClue = null;
  if (clues[line[0].y][line[0].x] == CENTER) {
     return {status: "Loop should pass straight through all circles", errors: [util.coord(line[0].x, line[0].y)]};
  }
  used[line[0].y][line[0].x] = true;
  for (var i=1;i<line.length-1;i++) {
    used[line[i].y][line[i].x] = true;
    if (clues[line[i].y][line[i].x] == CENTER) {
      if (lastClue != null) {
         return {status: "Loop should have not more than one dot at each straight segment", errors: [util.coord(line[i].x,line[i].y), util.coord(lastClue.x, lastClue.y)]};
      }
      lastClue = {x: line[i].x, y: line[i].y, position: CENTER}
    }
    if (clues[line[i].y][line[i].x] == RIGHT && line[i-1].y == line[i].y && line[i-1].x == line[i].x + 1) {
      if (lastClue != null) {
         return {status: "Loop should have not more than one dot at each straight segment", errors: [util.coord(line[i].x,line[i].y), util.coord(lastClue.x, lastClue.y)]};
      }
      lastClue = {x: line[i].x, y: line[i].y, position: RIGHT}
    }
    if (clues[line[i].y][line[i].x] == BOTTOM && line[i-1].y == line[i].y + 1 && line[i-1].x == line[i].x) {
      if (lastClue != null) {
         return {status: "Loop should have not more than one dot at each straight segment", errors: [util.coord(line[i].x,line[i].y), util.coord(lastClue.x, lastClue.y)]};
      }
      lastClue = {x: line[i].x, y: line[i].y, position: BOTTOM}
    }

    var direction = (line[i+1].x==line[i].x)?'v':'h';
    if (prevDirection!=direction) {
        if (lastClue != null) {
	      if (lastClue.position == CENTER) {
	        if(lastTurn.x + line[i].x != lastClue.x * 2  || lastTurn.y + line[i].y != lastClue.y * 2) {
              return {status: "Dot should be in the middle of the corresponding straight segment", errors: [util.coord(lastClue.x, lastClue.y), ]};
	        }
	      }          
	      if (lastClue.position == RIGHT) {
	        if(lastTurn.x + line[i].x != lastClue.x * 2 + 1  || lastTurn.y + line[i].y != lastClue.y * 2) {
              return {status: "Dot should be in the middle of the corresponding straight segment", errors: [util.coord(lastClue.x, lastClue.y), util.coord(lastClue.x+1, lastClue.y)]};
	        }
	      }          
	      if (lastClue.position == BOTTOM) {
	        if(lastTurn.x + line[i].x != lastClue.x * 2  || lastTurn.y + line[i].y != lastClue.y * 2 + 1) {
              return {status: "Dot should be in the middle of the corresponding straight segment", errors: [util.coord(lastClue.x, lastClue.y),util.coord(lastClue.x, lastClue.y+1)]};
	        }
	      }          
        }
    	lastTurn = {x: line[i].x, y: line[i].y}
    	lastClue = null;
    };
    prevDirection = direction;

    if (clues[line[i].y][line[i].x] == RIGHT && line[i+1].y == line[i].y && line[i+1].x == line[i].x + 1) {
      if (lastClue != null) {
         return {status: "Loop should have not more than one dot at each straight segment", errors: [util.coord(line[i].x,line[i].y), util.coord(lastClue.x, lastClue.y)]};
      }
      lastClue = {x: line[i].x, y: line[i].y, position: RIGHT}
    }
    if (clues[line[i].y][line[i].x] == BOTTOM && line[i+1].y == line[i].y + 1 && line[i+1].x == line[i].x) {
      if (lastClue != null) {
         return {status: "Loop should have not more than one dot at each straight segment", errors: [util.coord(line[i].x,line[i].y), util.coord(lastClue.x, lastClue.y)]};
      }
      lastClue = {x: line[i].x, y: line[i].y, position: BOTTOM}
    }
  }
  if (lastClue != null) {
    if (lastClue.position == CENTER) {
      if(lastTurn.x + line[i].x != lastClue.x * 2  || lastTurn.y + line[i].y != lastClue.y * 2) {
        return {status: "Dot should be in the middle of the corresponding straight segment", errors: [util.coord(lastClue.x, lastClue.y)]};
	  }
	}          
	if (lastClue.position == RIGHT) {
	  if(lastTurn.x + line[i].x != lastClue.x * 2 + 1  || lastTurn.y + line[i].y != lastClue.y * 2) {
        return {status: "Dot should be in the middle of the corresponding straight segment", errors: [util.coord(lastClue.x, lastClue.y), util.coord(lastClue.x+1, lastClue.y)]};
	  }
	}          
	if (lastClue.position == BOTTOM) {
	  if(lastTurn.x + line[i].x != lastClue.x * 2  || lastTurn.y + line[i].y != lastClue.y * 2 + 1) {
         return {status: "Dot should be in the middle of the corresponding straight segment", errors: [util.coord(lastClue.x, lastClue.y),util.coord(lastClue.x, lastClue.y+1)]};
	  }
	}          
  }
  for (var x=0;x < clues.cols;x++) {
    for (var y=0;y < clues.rows; y++) {
      if (v[y][x] || h[y][x]){
        if (!used[y][x]) {
          return {status: "There should be single loop passing through some cells", errors: []};
        }
      }
    }
  }
  return {status: "OK"};
},
};

module.exports = Checker;
