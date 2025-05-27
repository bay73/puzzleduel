if (typeof util=="undefined") {
  var util = require('./util');
}

const Checker = {
check:function(dimension, clueData, data){
  // Create array
  var dim = util.parseDimension(dimension);
  var v = util.create2DArray(dim.rows, dim.cols, false)
  var h = util.create2DArray(dim.rows, dim.cols, false)
  var clues = util.create2DArray(dim.rows, dim.cols, "")

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
    }
  }
  // Parse clues.
  for (var [key, value] of Object.entries(clueData)) {
    var pos = util.parseCoord(key);
    if (clues[pos.y]){
      clues[pos.y][pos.x] = value;
    }
  }
  var lineRes = Checker.buildLine(v, h);
  if (lineRes.status != "OK") {
    return lineRes;
  }
  var res = Checker.checkSingleLoop(lineRes.line, v, h);
  if (res.status != "OK") {
    return res;
  }
  var res = Checker.checkClues(clues, v, h);
  if (res.status != "OK") {
    return res;
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
  length++;
  line[length] = {x:line[1].x, y:line[1].y};
  length++;
  line[length] = {x:line[2].x, y:line[2].y};
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
checkClues: function(clues, v, h) {
  let paint = util.create2DArray(clues.rows, clues.cols, null);
  let toProcess = [];
  function mark(x, y, s) {
    if (x>=0 && x<paint.cols && y>=0 && y<paint.rows && s>=0 && s<4) {
      if (!paint[y][x][s]) {
        paint[y][x][s] = true;
        toProcess.push({x:x, y:y, s:s});
      }
    }
  }
  for (let x = 0; x < paint.cols; x++) {
    for (let y = 0; y < paint.rows; y++) {
      paint[y][x] = [false, false, false, false];
      if (x==0) {
        mark(x,y,0);
        mark(x,y,2);
      }
      if (x==paint.cols-1) {
        mark(x,y,1);
        mark(x,y,3);
      }
      if (y==0) {
        mark(x,y,0);
        mark(x,y,1);
      }
      if (y==paint.rows-1) {
        mark(x,y,2);
        mark(x,y,3);
      }
    }
  }
  while(toProcess.length > 0) {
    let next = toProcess.shift();
    if (next.s==0) {
      mark(next.x,next.y-1,2);
      mark(next.x-1,next.y,1);
      if (next.x>0 && !h[next.y][next.x-1]) {
        mark(next.x,next.y,2);
      }
      if (next.y>0 && !v[next.y-1][next.x]) {
        mark(next.x,next.y,1);
      }
    }
    if (next.s==1) {
      mark(next.x,next.y-1,3);
      mark(next.x+1,next.y,0);
      if (!h[next.y][next.x]) {
        mark(next.x,next.y,3);
      }
      if (next.y>0 && !v[next.y-1][next.x]) {
        mark(next.x,next.y,0);
      }
    }
    if (next.s==2) {
      mark(next.x,next.y+1,0);
      mark(next.x-1,next.y,3);
      if (next.x>0 && !h[next.y][next.x-1]) {
        mark(next.x,next.y,0);
      }
      if (!v[next.y][next.x]) {
        mark(next.x,next.y,3);
      }
    }
    if (next.s==3) {
      mark(next.x,next.y+1,1);
      mark(next.x+1,next.y,2);
      if (!h[next.y][next.x]) {
        mark(next.x,next.y,1);
      }
      if (!v[next.y][next.x]) {
        mark(next.x,next.y,2);
      }
    }
  }
  for (let x = 0; x < clues.cols; x++) {
    for (let y = 0; y < clues.rows; y++) {
      if (clues[y][x] != "") {
        let internal = 0;
        if (!paint[y][x][0]) {
          internal++;
        }
        if (!paint[y][x][1]) {
          internal++;
        }
        if (!paint[y][x][2]) {
          internal++;
        }
        if (!paint[y][x][3]) {
          internal++;
        }
        if (internal.toString() != clues[y][x]) {
          return {status: "The clue is not correct" , errors: [util.coord(x,y)]};
        }
        
      }
    }
  }
  return {status: "OK"};
},
checkSingleLoop: function(line, v, h) {
  var used = util.create2DArray(v.rows, v.cols, false)
  used[line[0].y][line[0].x] = true;
  for (var i=1;i<line.length-1;i++) {
    used[line[i].y][line[i].x] = true;
  }
  for (var x=0;x < v.cols;x++) {
    for (var y=0;y < v.rows; y++) {
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
