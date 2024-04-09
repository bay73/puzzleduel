puzzleFigures = {

gapLeft: 2,
gapTop: 2,
snapId: 0,
theme: 'default',

tetro_I: {letter: "I", letterPos: {x:1,y:0}, cells: [{x:0,y:0},{x:1,y:0},{x:2,y:0},{x:3,y:0}]},
tetro_I_vert: {letter: "I", letterPos: {x:0,y:2}, cells: [{x:0,y:0},{x:0,y:1},{x:0,y:2},{x:0,y:3}]},
tetro_T: {letter: "T", letterPos: {x:1,y:0}, cells: [{x:0,y:0},{x:1,y:0},{x:2,y:0},{x:1,y:1}]},
tetro_L: {letter: "L", letterPos: {x:0,y:1}, cells: [{x:0,y:0},{x:0,y:1},{x:0,y:2},{x:1,y:2}]},
tetro_J: {letter: "J", letterPos: {x:0,y:1}, cells: [{x:0,y:0},{x:0,y:1},{x:0,y:2},{x:-1,y:2}]},
tetro_S: {letter: "S", letterPos: {x:0,y:1}, cells: [{x:0,y:0},{x:0,y:1},{x:1,y:1},{x:1,y:2}]},
tetro_Z: {letter: "Z", letterPos: {x:0,y:1}, cells: [{x:0,y:0},{x:0,y:1},{x:-1,y:1},{x:-1,y:2}]},
tetro_O: {letter: "O", letterPos: {x:0,y:0}, cells: [{x:0,y:0},{x:1,y:0},{x:0,y:1},{x:1,y:1}]},

allTetro7: {},
allTetro5: {},
allTetro4: {},

penta_F: {letter: "F", letterPos: {x:0,y:1}, cells: [{x:0,y:0},{x:1,y:0},{x:-1,y:1},{x:0,y:1},{x:0,y:2}]},
penta_I: {letter: "I", letterPos: {x:0,y:2}, cells: [{x:0,y:0},{x:0,y:1},{x:0,y:2},{x:0,y:3},{x:0,y:4}]},
penta_L: {letter: "L", letterPos: {x:0,y:2}, cells: [{x:0,y:0},{x:0,y:1},{x:0,y:2},{x:0,y:3},{x:1,y:3}]},
penta_N: {letter: "N", letterPos: {x:-1,y:1}, cells: [{x:0,y:0},{x:0,y:1},{x:-1,y:1},{x:-1,y:2},{x:-1,y:3}]},
penta_P: {letter: "P", letterPos: {x:0,y:1}, cells: [{x:0,y:0},{x:1,y:0},{x:0,y:1},{x:1,y:1},{x:0,y:2}]},
penta_T: {letter: "T", letterPos: {x:1,y:1}, cells: [{x:0,y:0},{x:1,y:0},{x:2,y:0},{x:1,y:1},{x:1,y:2}]},
penta_U: {letter: "U", letterPos: {x:1,y:1}, cells: [{x:0,y:0},{x:0,y:1},{x:1,y:1},{x:2,y:1},{x:2,y:0}]},
penta_V: {letter: "V", letterPos: {x:0,y:2}, cells: [{x:0,y:0},{x:0,y:1},{x:0,y:2},{x:1,y:2},{x:2,y:2}]},
penta_W: {letter: "W", letterPos: {x:1,y:1}, cells: [{x:0,y:0},{x:0,y:1},{x:1,y:1},{x:1,y:2},{x:2,y:2}]},
penta_X: {letter: "X", letterPos: {x:0,y:1}, cells: [{x:0,y:0},{x:-1,y:1},{x:0,y:1},{x:1,y:1},{x:0,y:2}]},
penta_Y: {letter: "Y", letterPos: {x:0,y:1}, cells: [{x:0,y:0},{x:0,y:1},{x:1,y:1},{x:0,y:2},{x:0,y:3}]},
penta_Z: {letter: "Z", letterPos: {x:1,y:1}, cells: [{x:0,y:0},{x:1,y:0},{x:1,y:1},{x:1,y:2},{x:2,y:2}]},

hexa_S: {letter: "S", letterPos: {x:-1.55,y:2.5}, cells: [{x:0,y:0},{x:-1,y:2},{x:-1,y:4},{x:-2,y:6}]},
hexa_L: {letter: "L", letterPos: {x:-0.55,y:2.5}, cells: [{x:0,y:0},{x:0,y:2},{x:0,y:4},{x:1,y:4}]},
hexa_I: {letter: "I", letterPos: {x:-0.55,y:2.5}, cells: [{x:0,y:0},{x:0,y:2},{x:0,y:4},{x:0,y:6}]},
hexa_C: {letter: "C", letterPos: {x:-1.55,y:2.5}, cells: [{x:0,y:0},{x:-1,y:2},{x:-1,y:4},{x:0,y:4}]},
hexa_Y: {letter: "Y", letterPos: {x:0.45,y:0.5}, cells: [{x:0,y:0},{x:1,y:0},{x:1,y:2},{x:2,y:-2}]},

allPenta: {},

ship: function(length) {
  let cells = [];
  for( let i=0;i<length;i++) {
    cells.push({x:i, y:0});
  }
  return {letter: "", letterPos: {x:0,y:0}, cells: cells };
},

shipSet: function(code) {
  if (code=="ship3") {
    return [3,2,1];
  }
  if (code=="ship4") {
    return [4,3,2,1];
  }
  if (code=="ship5") {
    return [5,4,3,2,1];
  }
  let counts = [];
  for(let i=0;i<code.length;i++) {
    counts.push(parseInt(code.charAt(i)));
  }
  return counts;
},

drawRectangle: function(snap, x, y, dx, dy, size){
  var border = size/14;
  let path = snap.polygon([
     puzzleFigures.gapLeft+x*size+border,puzzleFigures.gapTop+y*size+border,
     puzzleFigures.gapLeft+x*size+dx*size-border,puzzleFigures.gapTop+y*size+border,
     puzzleFigures.gapLeft+x*size+dx*size-border,puzzleFigures.gapTop+y*size+dy*size-border,
     puzzleFigures.gapLeft+x*size+border,puzzleFigures.gapTop+y*size+dy*size-border,
     puzzleFigures.gapLeft+x*size+border,puzzleFigures.gapTop+y*size+border]);
  path.attr({fill: puzzleFigures.color});
  return path;
},

drawSquare: function(snap, x, y, size){
  return puzzleFigures.drawRectangle(snap, x, y, 1, 1, size)
},

drawLetter: function(snap, x, y, size, letter){
  let topBorder = size*0.15;
  let height = size*0.7;
  let leftBorder = size*0.3;
  let width = size*0.4;
  if (letter=="I") {
    leftBorder = size*0.4;
    width = size*0.2;
  }
  let textElement = snap.text(puzzleFigures.gapLeft+x*size+leftBorder, puzzleFigures.gapTop+(y+0.6)*size+topBorder, letter);
      
  textElement.attr({
    "font-family": "sans-serif",
    "font-weight": "bold",
     "lengthAdjust": "spacingAndGlyphs",
     "fill": puzzleFigures.letterColor,
     "font-size": height,
     "textLength": width });
  return textElement;
},

drawFigure: function(snap,coord,figure,size,withLetter) {
  let toggle = function() {
    let isMarked = (group.attr("isMarked")!="true");
    group.attr({"isMarked": isMarked});
    group.children().forEach(function(item) {
      item.attr({fill: isMarked?puzzleFigures.markedColor:puzzleFigures.color})
    });
  }
  let group = snap.g();
  figure.cells.forEach(function(cell) {
    let item = puzzleFigures.drawSquare(snap,coord.x+cell.x,coord.y+cell.y,size);
    group.add(item);
    item.click(toggle);
  });
  if (withLetter) {
    let item = puzzleFigures.drawLetter(snap, coord.x+figure.letterPos.x, coord.y+figure.letterPos.y, size, figure.letter);
    item.click(toggle);
  }
  group.attr({"isMarked": false})
},

drawHexaFigure: function(snap,coord,figure,size,withLetter) {
  let baseCorner = function(coord, size) {
    let s = size;
    let h = s * Math.sqrt(3)/2.;
    return {
      x: puzzleFigures.gapLeft + s/2 + coord.x * s*3/2,
      y: puzzleFigures.gapTop + (coord.x - 1) * h + coord.y * h * 2 - coord.y * h
    };
  };
  let cellCorners = function(coord, size) {
    let s = size*0.9;
    let h = s * Math.sqrt(3)/2.;
    let base = baseCorner(coord, size);
    return [
      base,
      {x: base.x + s,       y: base.y},
      {x: base.x + s + s/2, y: base.y + h},
      {x: base.x + s,       y: base.y + 2*h},
      {x: base.x,           y: base.y + 2*h},
      {x: base.x - s/2,     y: base.y + h}
    ];
  }
  let drawHexa = function(snap, coord, size) {
    let path = snap.polygon([].concat.apply([], cellCorners(coord, size).map(corner => [corner.x, corner.y])));
    path.attr({fill: puzzleFigures.color});
    return path;
  }

  let toggle = function() {
    let isMarked = (group.attr("isMarked")!="true");
    group.attr({"isMarked": isMarked});
    group.children().forEach(function(item) {
      item.attr({fill: isMarked?puzzleFigures.markedColor:puzzleFigures.color})
    });
  }
  let group = snap.g();

  figure.cells.forEach(function(cell) {
    let item = drawHexa(snap,{x: coord.x+cell.x,y: coord.y+cell.y},size);
    group.add(item);
    item.click(toggle);
  });
  if (withLetter) {
    let base = baseCorner({x: coord.x + figure.letterPos.x, y: coord.y + figure.letterPos.y}, size)
    let letterSize = size * 1.5
    let item = puzzleFigures.drawLetter(snap, base.x/letterSize, base.y/letterSize, letterSize, figure.letter);
    item.click(toggle);
  }
  group.attr({"isMarked": false})
},

drawDomino: function(snap,coord,size,letter1, letter2) {
  let toggle = function() {
    let isMarked = (group.attr("isMarked")!="true");
    group.attr({"isMarked": isMarked});
    group.children().forEach(function(item) {
      item.attr({fill: isMarked?puzzleFigures.markedColor:puzzleFigures.color})
    });
  }
  let group = snap.g();
  let item = puzzleFigures.drawSquare(snap,coord.x,coord.y,size);
  item.click(toggle);
  group.add(item);
  item = puzzleFigures.drawLetter(snap, coord.x, coord.y, size, letter1);
  item.click(toggle);
  item = puzzleFigures.drawSquare(snap,coord.x + 1,coord.y,size);
  item.click(toggle);
  group.add(item);
  item = puzzleFigures.drawLetter(snap, coord.x + 1, coord.y, size, letter2);
  item.click(toggle);
  group.attr({"isMarked": false});
},

getRealWidth: function(obj) {
  return $(obj).parent().width()
},

createDominoSet: function(snap, values, includeDoubles) {
  let width = puzzleFigures.getRealWidth($(snap.node));
  const viewportWidth = Math.max(
    document.documentElement.clientWidth,
    window.innerWidth || 0
  )
  snap.node.setAttribute("width", width);
  let itemCount = values.length - (includeDoubles?0:1);
  if (viewportWidth < 992) {
    if (itemCount%2==0) {
      var maxXPos = itemCount*2.5;
    } else {
      var maxXPos = (itemCount+1)*2.5;
    }
    var maxYPos = Math.ceil((itemCount+1)/2)*1.5 - 0.5;
    var direction = 'h';
  } else {
    var maxXPos = Math.ceil((itemCount+2)/2)*2.5 - 0.5;
    if (itemCount%2==0) {
      var maxYPos = itemCount*1.5 - 0.5;
    } else {
      var maxYPos = itemCount*1.5 - 0.5;
    }
    var direction = 'v';
  }
  var cellSize = width/maxXPos;
  snap.node.setAttribute("height", cellSize * maxYPos + puzzleFigures.gapTop*2);
  for (let x=0; x<values.length; x++) {
    for (let y=x+(includeDoubles?0:1);y<values.length;y++) {
      let xPos = x*2.5;
      let yPos = (y - x - (includeDoubles?0:1))*1.5;
      if (yPos > maxYPos) {
        xPos = maxXPos - xPos - 2.5;
        yPos = 2*maxYPos - yPos - 0.5;
      }
      if (xPos > maxXPos) {
        xPos = 2*maxXPos - xPos - 1.5;
        yPos = maxYPos - yPos - 1;
      }
      if (direction=='h') {
        puzzleFigures.drawDomino(snap, {x: xPos, y: yPos}, cellSize, values.charAt(y - x - (includeDoubles?0:1)), values.charAt(y));
      } else {
        puzzleFigures.drawDomino(snap, {x: xPos, y: yPos}, cellSize, values.charAt(x), values.charAt(y));
      }
    }
  }
},

createTetro7: function(snap, withLetters) {
  let width = puzzleFigures.getRealWidth($(snap.node));
  const viewportWidth = Math.max(
    document.documentElement.clientWidth,
    window.innerWidth || 0
  )
  snap.node.setAttribute("width", width);
  if (viewportWidth < 992) {
    if (viewportWidth < 768) {
      var cellSize = width/20;
    } else {
      var cellSize = width/28;
    }
    snap.node.setAttribute("height", cellSize * 4 + puzzleFigures.gapTop*2);
    puzzleFigures.gapLeft = (width - cellSize*20)/2
    puzzleFigures.drawFigure(snap,{x:0,y:0}, puzzleFigures.tetro_O, cellSize, withLetters);
    puzzleFigures.drawFigure(snap,{x:4,y:0}, puzzleFigures.tetro_Z, cellSize, withLetters);
    puzzleFigures.drawFigure(snap,{x:6,y:0}, puzzleFigures.tetro_S, cellSize, withLetters);
    puzzleFigures.drawFigure(snap,{x:9,y:0}, puzzleFigures.tetro_I_vert, cellSize, withLetters);
    puzzleFigures.drawFigure(snap,{x:11,y:0}, puzzleFigures.tetro_L, cellSize, withLetters);
    puzzleFigures.drawFigure(snap,{x:15,y:0}, puzzleFigures.tetro_J, cellSize, withLetters);
    puzzleFigures.drawFigure(snap,{x:17,y:0}, puzzleFigures.tetro_T, cellSize, withLetters);
  } else {
    var cellSize = width/8;
    snap.node.setAttribute("height", cellSize * 8 + puzzleFigures.gapTop*2);
    puzzleFigures.gapLeft = (width - cellSize*8)/2
    puzzleFigures.drawFigure(snap,{x:3,y:0}, puzzleFigures.tetro_O, cellSize, withLetters);
    puzzleFigures.drawFigure(snap,{x:1,y:0}, puzzleFigures.tetro_Z, cellSize, withLetters);
    puzzleFigures.drawFigure(snap,{x:6,y:0}, puzzleFigures.tetro_S, cellSize, withLetters);
    puzzleFigures.drawFigure(snap,{x:2,y:3}, puzzleFigures.tetro_I, cellSize, withLetters);
    puzzleFigures.drawFigure(snap,{x:2.5,y:5}, puzzleFigures.tetro_T, cellSize, withLetters);
    puzzleFigures.drawFigure(snap,{x:0,y:5}, puzzleFigures.tetro_L, cellSize, withLetters);
    puzzleFigures.drawFigure(snap,{x:7,y:5}, puzzleFigures.tetro_J, cellSize, withLetters);
  }
},

createTetro4: function(snap, withLetters) {
  let width = puzzleFigures.getRealWidth($(snap.node));
  const viewportWidth = Math.max(
    document.documentElement.clientWidth,
    window.innerWidth || 0
  )
  snap.node.setAttribute("width", width);
  var cellSize = width/10;
  snap.node.setAttribute("height", cellSize * 4 + puzzleFigures.gapTop*2);
  puzzleFigures.gapLeft = (width - cellSize*9.5)/2
  puzzleFigures.drawFigure(snap,{x:0,y:1}, puzzleFigures.tetro_L, cellSize, withLetters);
  puzzleFigures.drawFigure(snap,{x:2.5,y:0}, puzzleFigures.tetro_I_vert, cellSize, withLetters);
  puzzleFigures.drawFigure(snap,{x:4,y:2}, puzzleFigures.tetro_T, cellSize, withLetters);
  puzzleFigures.drawFigure(snap,{x:7.5,y:1}, puzzleFigures.tetro_S, cellSize, withLetters);
},

createTetro5: function(snap, withLetters) {
  let width = puzzleFigures.getRealWidth($(snap.node));
  const viewportWidth = Math.max(
    document.documentElement.clientWidth,
    window.innerWidth || 0
  )
  snap.node.setAttribute("width", width);
  var cellSize = width/12.5;
  snap.node.setAttribute("height", cellSize * 4 + puzzleFigures.gapTop*2);
  puzzleFigures.gapLeft = (width - cellSize*12)/2
  puzzleFigures.drawFigure(snap,{x:0,y:1}, puzzleFigures.tetro_L, cellSize, withLetters);
  puzzleFigures.drawFigure(snap,{x:2.5,y:0}, puzzleFigures.tetro_I_vert, cellSize, withLetters);
  puzzleFigures.drawFigure(snap,{x:4,y:2}, puzzleFigures.tetro_T, cellSize, withLetters);
  puzzleFigures.drawFigure(snap,{x:7.5,y:1}, puzzleFigures.tetro_S, cellSize, withLetters);
  puzzleFigures.drawFigure(snap,{x:10,y:2}, puzzleFigures.tetro_O, cellSize, withLetters);
},

createSlicy: function(snap, withLetters) {
  let width = puzzleFigures.getRealWidth($(snap.node));
  const viewportWidth = Math.max(
    document.documentElement.clientWidth,
    window.innerWidth || 0
  )
  snap.node.setAttribute("width", width);
  var cellSize = width/24;
  snap.node.setAttribute("height", cellSize * 7 + puzzleFigures.gapTop*2);
  puzzleFigures.gapLeft = (width - cellSize*23)/2

  puzzleFigures.drawHexaFigure(snap, {x:2, y:-1}, puzzleFigures.hexa_S, cellSize, withLetters)
  puzzleFigures.drawHexaFigure(snap, {x:4, y:-3}, puzzleFigures.hexa_L, cellSize, withLetters)
  puzzleFigures.drawHexaFigure(snap, {x:7, y:-6}, puzzleFigures.hexa_I, cellSize, withLetters)
  puzzleFigures.drawHexaFigure(snap, {x:10, y:-8}, puzzleFigures.hexa_C, cellSize, withLetters)
  puzzleFigures.drawHexaFigure(snap, {x:12, y:-10}, puzzleFigures.hexa_Y, cellSize, withLetters)
},

createPento12: function(snap, withLetters) {
  let width = puzzleFigures.getRealWidth($(snap.node));
  const viewportWidth = Math.max(
    document.documentElement.clientWidth,
    window.innerWidth || 0
  )
  snap.node.setAttribute("width", width);
  if (viewportWidth < 992) {
    var cellSize = width/36;
    snap.node.setAttribute("height", cellSize * 5 + puzzleFigures.gapTop*2);
    puzzleFigures.gapLeft = (width - cellSize*35.5)/2
    puzzleFigures.drawFigure(snap,{x:1,y:0},    puzzleFigures.penta_F, cellSize, withLetters);
    puzzleFigures.drawFigure(snap,{x:3.5,y:0},  puzzleFigures.penta_I, cellSize, withLetters);
    puzzleFigures.drawFigure(snap,{x:5,y:0},    puzzleFigures.penta_L, cellSize, withLetters);
    puzzleFigures.drawFigure(snap,{x:8.5,y:0},  puzzleFigures.penta_N, cellSize, withLetters);
    puzzleFigures.drawFigure(snap,{x:10,y:0},   puzzleFigures.penta_P, cellSize, withLetters);
    puzzleFigures.drawFigure(snap,{x:12.5,y:0}, puzzleFigures.penta_T, cellSize, withLetters);
    puzzleFigures.drawFigure(snap,{x:16,y:0},   puzzleFigures.penta_U, cellSize, withLetters);
    puzzleFigures.drawFigure(snap,{x:19.5,y:0}, puzzleFigures.penta_V, cellSize, withLetters);
    puzzleFigures.drawFigure(snap,{x:23,y:0},   puzzleFigures.penta_W, cellSize, withLetters);
    puzzleFigures.drawFigure(snap,{x:27.5,y:0}, puzzleFigures.penta_X, cellSize, withLetters);
    puzzleFigures.drawFigure(snap,{x:30,y:0},   puzzleFigures.penta_Y, cellSize, withLetters);
    puzzleFigures.drawFigure(snap,{x:32.5,y:0}, puzzleFigures.penta_Z, cellSize, withLetters);
  } else {
    var cellSize = width/12.5;
    snap.node.setAttribute("height", cellSize * 14.5 + puzzleFigures.gapTop*2);
    puzzleFigures.gapLeft = (width - cellSize*12.5)/2
    puzzleFigures.drawFigure(snap,{x:1,y:0},      puzzleFigures.penta_F, cellSize, withLetters);
    puzzleFigures.drawFigure(snap,{x:4,y:0},      puzzleFigures.penta_I, cellSize, withLetters);
    puzzleFigures.drawFigure(snap,{x:6.5,y:0},      puzzleFigures.penta_L, cellSize, withLetters);
    puzzleFigures.drawFigure(snap,{x:10.5,y:0},    puzzleFigures.penta_N, cellSize, withLetters);
    puzzleFigures.drawFigure(snap,{x:0,y:3.5},   puzzleFigures.penta_Y, cellSize, withLetters);
    puzzleFigures.drawFigure(snap,{x:2.5,y:5.5},      puzzleFigures.penta_U, cellSize, withLetters);
    puzzleFigures.drawFigure(snap,{x:6,y:4.5},  puzzleFigures.penta_T, cellSize, withLetters);
    puzzleFigures.drawFigure(snap,{x:10.5,y:4.5},    puzzleFigures.penta_X, cellSize, withLetters);
    puzzleFigures.drawFigure(snap,{x:0,y:8},    puzzleFigures.penta_P, cellSize, withLetters);
    puzzleFigures.drawFigure(snap,{x:2.5,y:8},      puzzleFigures.penta_W, cellSize, withLetters);
    puzzleFigures.drawFigure(snap,{x:6,y:8},   puzzleFigures.penta_Z, cellSize, withLetters);
    puzzleFigures.drawFigure(snap,{x:9.5,y:8},   puzzleFigures.penta_V, cellSize, withLetters);
  }
},

figureHeight: function(figure){
  let minY = 0;
  let maxY = 0;
  figure.cells.forEach(cell => { minY = Math.min(minY, cell.y); maxY = Math.max(maxY, cell.y);});
  return maxY - minY + 1;
},

figureWidth: function(figure){
  let minX = 0;
  let maxX = 0;
  figure.cells.forEach(cell => { minX = Math.min(minX, cell.x); maxX = Math.max(maxX, cell.x);});
  return maxX - minX + 1;
},

figureLeft: function(figure){
  let minX = 0;
  figure.cells.forEach(cell => { minX = Math.min(minX, cell.x);});
  return minX;
},

createPento: function(snap, pentominos, withLetters) {
  let width = puzzleFigures.getRealWidth($(snap.node));
  const viewportWidth = Math.max(
    document.documentElement.clientWidth,
    window.innerWidth || 0
  )
  snap.node.setAttribute("width", width);
  if (viewportWidth < 992) {
    let figuresHeight = 0;
    let figuresWidth = 0;
    for (var i = 0; i < pentominos.length; i++) {
      figuresHeight = Math.max(figuresHeight, puzzleFigures.figureHeight(puzzleFigures.allPenta[pentominos.charAt(i)]));
      figuresWidth = figuresWidth + puzzleFigures.figureWidth(puzzleFigures.allPenta[pentominos.charAt(i)]) + 0.5;
    }
    var cellSize = width/figuresWidth;
    snap.node.setAttribute("height", cellSize * figuresHeight + puzzleFigures.gapTop*2);
    puzzleFigures.gapLeft = (width - cellSize*(figuresWidth-0.5))/2
    let x = 0;
    let y = 0;
    for (var i = 0; i < pentominos.length; i++) {
      puzzleFigures.drawFigure(
        snap,
        {x : x - puzzleFigures.figureLeft(puzzleFigures.allPenta[pentominos.charAt(i)]), y : y},
        puzzleFigures.allPenta[pentominos.charAt(i)],
        cellSize,
        withLetters);
      x+=puzzleFigures.figureWidth(puzzleFigures.allPenta[pentominos.charAt(i)]) + 0.5;
    }
  } else {
    let rows = 3;
    if (pentominos.length > 12) {
      rows = 4;
    }
    if (pentominos.length < 9) {
      rows = 2;
    }
    if (pentominos.length < 5) {
      rows = 1;
    }
    let figuresInRow = Math.ceil(pentominos.length/rows);
    let figuresHeight = 0;
    let maxHeightInRow = 0;
    let rowWidth = 0;
    let figuresWidth = 0;
    for (var i = 0; i < pentominos.length; i++) {
      maxHeightInRow = Math.max(maxHeightInRow, puzzleFigures.figureHeight(puzzleFigures.allPenta[pentominos.charAt(i)]));
      rowWidth += puzzleFigures.figureWidth(puzzleFigures.allPenta[pentominos.charAt(i)]) + 0.5;
      figuresWidth = Math.max(figuresWidth, rowWidth);
      if ((i+1)%figuresInRow==0) {
        rowWidth = 0;
        figuresHeight += maxHeightInRow + 0.5;
        maxHeightInRow = 0;
      }
    }
    if (pentominos%rows != 0) {
      figuresHeight += maxHeightInRow + 0.5;
    }
    var cellSize = width/figuresWidth;
    snap.node.setAttribute("height", cellSize * figuresHeight + puzzleFigures.gapTop*2);
    let x = 0;
    let y = 0;
    maxHeightInRow = 0;
    for (var i = 0; i < pentominos.length; i++) {
      maxHeightInRow = Math.max(maxHeightInRow, puzzleFigures.figureHeight(puzzleFigures.allPenta[pentominos.charAt(i)]));
      puzzleFigures.drawFigure(
        snap,
        {x : x - puzzleFigures.figureLeft(puzzleFigures.allPenta[pentominos.charAt(i)]), y : y},
        puzzleFigures.allPenta[pentominos.charAt(i)],
        cellSize,
        withLetters);
      x+=puzzleFigures.figureWidth(puzzleFigures.allPenta[pentominos.charAt(i)]) + 0.5;
      if ((i+1)%figuresInRow==0) {
        x = 0;
        y += maxHeightInRow + 0.5;
        maxHeightInRow = 0;
      }
    }
  }
},
createBattleship: function(snap, counts) {
  let width = puzzleFigures.getRealWidth($(snap.node));
  const viewportWidth = Math.max(
    document.documentElement.clientWidth,
    window.innerWidth || 0
  )
  snap.node.setAttribute("width", width);
  if (viewportWidth < 992) {
    let totalLength = 0;
    for (let i=0;i<counts.length;i++){
      totalLength += (i+1.5)*counts[i];
    }
    var horizontal = totalLength;
    if (totalLength > 16) {
      var horizontal = 0;
      for (let i=0;i<counts.length;i++){
        let next = horizontal+(i+1.5)*counts[i];
        if (next > totalLength/2.) {
          if (next-totalLength/2. < totalLength/2-horizontal) {
            horizontal = next;
          }
          break;
        }
        horizontal = next;
      }
      horizontal = Math.max(totalLength - horizontal, horizontal);
    }
    var cellSize = width/horizontal;
    if (totalLength > 16) {
      snap.node.setAttribute("height", cellSize * 2.5 + puzzleFigures.gapTop*2);
    } else {
      snap.node.setAttribute("height", cellSize + puzzleFigures.gapTop*2);
    }
    puzzleFigures.gapLeft = (width - cellSize*(horizontal-0.5))/2
    let x = 0;
    let y = 0;
    for (let i=counts.length-1;i>=0;i--){
      for (let j=0;j<counts[i];j++) {
        puzzleFigures.drawFigure(snap,{x:x,y:y}, puzzleFigures.ship(i+1), cellSize, false);
        x+=i+1.5;
        if (x+i+1>=horizontal) {
          x=0;
          y+=1.5;
        }
      }
    }
  } else {
    let totalLength = 0;
    for (let i=0;i<counts.length;i++){
      totalLength = Math.max(totalLength, (i+1.5)*counts[i]);
    }
    var cellSize = width/totalLength;
    snap.node.setAttribute("height", cellSize * counts.length * 1.5 - 0.5 + puzzleFigures.gapTop*2);
    puzzleFigures.gapLeft = (width - cellSize*(totalLength-0.5))/2
    let x = 0;
    let y = 0;
    for (let i=counts.length-1;i>=0;i--){
      for (let j=0;j<counts[i];j++) {
        puzzleFigures.drawFigure(snap,{x:x,y:y}, puzzleFigures.ship(i+1), cellSize, false);
        x+=i+1.5;
      }
      x=0;
      y+=1.5;
    }
  }
},

init: function(element) {
  puzzleFigures.allTetro7 = {'I': puzzleFigures.tetro_I_vert, 'T': puzzleFigures.tetro_T, 'L': puzzleFigures.tetro_L,
                            'J': puzzleFigures.tetro_J, 'S': puzzleFigures.tetro_S, 'Z': puzzleFigures.tetro_Z,
                            'O': puzzleFigures.tetro_O},
  puzzleFigures.allTetro5 = {'I': puzzleFigures.tetro_I_vert, 'T': puzzleFigures.tetro_T, 'L': puzzleFigures.tetro_L,
                             'S': puzzleFigures.tetro_S, 'O': puzzleFigures.tetro_O},
  puzzleFigures.allTetro4 = {'L': puzzleFigures.tetro_L, 'I': puzzleFigures.tetro_I_vert, 'T': puzzleFigures.tetro_T,
                             'S': puzzleFigures.tetro_S},

  puzzleFigures.allPenta = {'F': puzzleFigures.penta_F, 'I': puzzleFigures.penta_I, 'L': puzzleFigures.penta_L,
                            'N': puzzleFigures.penta_N, 'P': puzzleFigures.penta_P, 'T': puzzleFigures.penta_T,
                            'U': puzzleFigures.penta_U, 'V': puzzleFigures.penta_V, 'W': puzzleFigures.penta_W,
                            'X': puzzleFigures.penta_X, 'Y': puzzleFigures.penta_Y, 'Z': puzzleFigures.penta_Z},
  puzzleFigures.theme = element.attr('theme')?element.attr('theme'):'default';
  puzzleFigures.color = "#000";
  puzzleFigures.letterColor = "#fff";
  puzzleFigures.markedColor = "#384d52";
  if (puzzleFigures.theme == "contrast"){
    puzzleFigures.color = "#fff";
    puzzleFigures.letterColor = "#000";
    puzzleFigures.markedColor = "#404040";
  }
  if (puzzleFigures.theme == "white"){
    puzzleFigures.markedColor = "#ddd";
  }
  puzzleFigures.snapId++;
  element.empty();
  element.append('<svg id="figures_svg_' + puzzleFigures.snapId+'"></svg><br>');

  let figures = element.attr('figures');
  let withLetters = (element.attr('letters')=="true");
  if (figures.toLowerCase()=="tetro7") {
    puzzleFigures.createTetro7(Snap('#figures_svg_' + puzzleFigures.snapId), withLetters);
  }
  if (figures.toLowerCase()=="lits") {
    puzzleFigures.createTetro4(Snap('#figures_svg_' + puzzleFigures.snapId), withLetters);
  }
  if (figures.toLowerCase()=="litso") {
    puzzleFigures.createTetro5(Snap('#figures_svg_' + puzzleFigures.snapId), withLetters);
  }
  if (figures.toLowerCase()=="slicy") {
    puzzleFigures.createSlicy(Snap('#figures_svg_' + puzzleFigures.snapId), withLetters);
  }
  if (figures.toLowerCase()=="pento12") {
    puzzleFigures.createPento12(Snap('#figures_svg_' + puzzleFigures.snapId), withLetters);
  }
  if (figures.toLowerCase()=="ship3") {
    puzzleFigures.createBattleship(Snap('#figures_svg_' + puzzleFigures.snapId), puzzleFigures.shipSet("ship3"));
  }
  if (figures.toLowerCase()=="ship4") {
    puzzleFigures.createBattleship(Snap('#figures_svg_' + puzzleFigures.snapId), puzzleFigures.shipSet("ship4"));
  }
  if (figures.toLowerCase()=="ship5") {
    puzzleFigures.createBattleship(Snap('#figures_svg_' + puzzleFigures.snapId), puzzleFigures.shipSet("ship5"));
  }
  if (figures.toLowerCase()=="ship") {
    puzzleFigures.createBattleship(Snap('#figures_svg_' + puzzleFigures.snapId), puzzleFigures.shipSet(element.attr('set')?element.attr('set'):'ship4'));
  }
  if (figures.toLowerCase()=="pento") {
    puzzleFigures.createPento(Snap('#figures_svg_' + puzzleFigures.snapId), element.attr('set')?element.attr('set'):'FILNPTUVWXYZ', withLetters);
  }
  if (figures.toLowerCase()=="domino") {
    puzzleFigures.createDominoSet(Snap('#figures_svg_' + puzzleFigures.snapId),element.attr('set'), element.attr('doubles')!='false');
  }
},

}

$(document).ready(function () {
  $('.puzzle-figures').each(
    function() {
      puzzleFigures.init($(this));
    });
});

