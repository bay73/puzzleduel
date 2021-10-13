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
    var pos = util.parseCoord(key);
    if (clues[pos.y]){
      clues[pos.y][pos.x] = value;
    }
  }
  var res = Checker.checkClues(clues, v, h);
  if (res.status != "OK") {
    return res;
  }
  return {status: "OK"};
},
checkClues: function(clues, v, h) {
  var used = util.create2DArray(clues.rows, clues.cols, false);
  for (var y = 0; y < clues.rows; y++) {
    for (var x = 0; x < clues.cols; x++) {
      if (clues[y][x] != "" && clues[y][x] != "X" ) {
        res = Checker.buildLines(clues, v, h, {x:x, y: y}, used);
        if (res.status != "OK") {
          return res;
        }
      }
    }
  }
  return {status: "OK"};
},
buildLines: function(clues, v, h, pos, used) {
  lres = Checker.buildLeftLine(clues, h, pos, used);
  if (lres.status != "OK") {
    return lres;
  }
  rres = Checker.buildRightLine(clues, h, pos, used);
  if (rres.status != "OK") {
    return rres;
  }
  ures = Checker.buildUpLine(clues, v, pos, used);
  if (ures.status != "OK") {
    return ures;
  }
  dres = Checker.buildDownLine(clues, v, pos, used);
  if (dres.status != "OK") {
    return dres;
  }
  if ((lres.len + rres.len + ures.len + dres.len).toString() != clues[pos.y][pos.x] ) {
    return {status: "The clue is not correct" , errors: [util.coord(pos.x,pos.y)]};
  }
  return {status: "OK"};
},
buildLeftLine: function(clues, h, pos, used) {
  let len = 0;
  for (let x=pos.x-1; x>=0; x--) {
    if (!h[pos.y][x]) {
      break;
    }
    if (clues[pos.y][x] != "") {
      return {status: "The line from a clue shouldn't pass another clue or cell with a cross" , errors: [util.coord(x,pos.y)]};
    }
    if (used[pos.y][x]) {
      return {status: "The lines can't cross" , errors: [util.coord(x,pos.y)]};
    }
    used[pos.y][x]=true;
    len++;
  }
  return {status: "OK", len: len};
},
buildRightLine: function(clues, h, pos, used) {
  let len = 0;
  for (let x=pos.x; x < h.cols-1; x++) {
    if (!h[pos.y][x]) {
      break;
    }
    if (clues[pos.y][x+1] != "") {
      return {status: "The line from a clue shouldn't pass another clue or cell with a cross" , errors: [util.coord(x+1,pos.y)]};
    }
    if (used[pos.y][x+1]) {
      return {status: "The lines can't cross" , errors: [util.coord(x+1,pos.y)]};
    }
    used[pos.y][x+1]=true;
    len++;
  }
  return {status: "OK", len: len};
},
buildUpLine: function(clues, v, pos, used) {
  let len = 0;
  for (let y=pos.y-1; y>=0; y--) {
    if (!v[y][pos.x]) {
      break;
    }
    if (clues[y][pos.x] != "") {
      return {status: "The line from a clue shouldn't pass another clue or cell with a cross" , errors: [util.coord(pos.x,y)]};
    }
    if (used[y][pos.x]) {
      return {status: "The lines can't cross" , errors: [util.coord(pos.x,y)]};
    }
    used[y][pos.x]=true;
    len++;
  }
  return {status: "OK", len: len};
},
buildDownLine: function(clues, v, pos, used) {
  let len = 0;
  for (let y=pos.y; y<v.rows-1; y++) {
    if (!v[y][pos.x]) {
      break;
    }
    if (clues[y+1][pos.x] != "") {
      return {status: "The line from a clue shouldn't pass another clue or cell with a cross" , errors: [util.coord(pos.x,y+1)]};
    }
    if (used[y+1][pos.x]) {
      return {status: "The lines can't cross" , errors: [util.coord(pos.x,y+1)]};
    }
    used[y+1][pos.x]=true;
    len++;
  }
  return {status: "OK", len: len};
},
};

module.exports = Checker;
