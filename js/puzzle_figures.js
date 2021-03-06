puzzleFigures = {

gapLeft: 2,
gapTop: 2,
snapId: 0,
theme: 'default',

tetro_I: {letter: "I", letterPos: {x:1,y:0}, cells: [{x:0,y:0},{x:1,y:0},{x:2,y:0},{x:3,y:0}]},
tetro_I_vert: {letter: "I", letterPos: {x:0,y:1}, cells: [{x:0,y:0},{x:0,y:1},{x:0,y:2},{x:0,y:3}]},
tetro_T: {letter: "T", letterPos: {x:1,y:0}, cells: [{x:0,y:0},{x:1,y:0},{x:2,y:0},{x:1,y:1}]},
tetro_L: {letter: "L", letterPos: {x:0,y:1}, cells: [{x:0,y:0},{x:0,y:1},{x:0,y:2},{x:1,y:2}]},
tetro_J: {letter: "J", letterPos: {x:0,y:1}, cells: [{x:0,y:0},{x:0,y:1},{x:0,y:2},{x:-1,y:2}]},
tetro_S: {letter: "S", letterPos: {x:0,y:1}, cells: [{x:0,y:0},{x:0,y:1},{x:1,y:1},{x:1,y:2}]},
tetro_Z: {letter: "Z", letterPos: {x:0,y:1}, cells: [{x:0,y:0},{x:0,y:1},{x:-1,y:1},{x:-1,y:2}]},
tetro_O: {letter: "O", letterPos: {x:0,y:0}, cells: [{x:0,y:0},{x:1,y:0},{x:0,y:1},{x:1,y:1}]},

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

drawSquare: function(snap, x, y, size){
  var border = size/14;
  let path = snap.polygon([
     puzzleFigures.gapLeft+x*size+border,puzzleFigures.gapTop+y*size+border,
     puzzleFigures.gapLeft+x*size+size-border,puzzleFigures.gapTop+y*size+border,
     puzzleFigures.gapLeft+x*size+size-border,puzzleFigures.gapTop+y*size+size-border,
     puzzleFigures.gapLeft+x*size+border,puzzleFigures.gapTop+y*size+size-border,
     puzzleFigures.gapLeft+x*size+border,puzzleFigures.gapTop+y*size+border]);
  path.attr({fill: puzzleFigures.color})
  return path;
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
  console.log(withLetter);
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

createTetro7: function(snap, withLetters) {
  let width = $(snap.node).parent().width();
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

createPenta12: function(snap, withLetters) {
  let width = $(snap.node).parent().width();
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

init: function(element) {
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
  element.append('<svg id="figures_svg_' + puzzleFigures.snapId+'"></svg><br>');

  let figures = element.attr('figures');
  let withLetters = (element.attr('letters')=="true");
  if (figures=="tetro7") {
    puzzleFigures.createTetro7(Snap('#figures_svg_' + puzzleFigures.snapId), withLetters);
  }
  if (figures=="penta12") {
    puzzleFigures.createPenta12(Snap('#figures_svg_' + puzzleFigures.snapId), withLetters);
  }
},

}

$(document).ready(function () {
  $('.puzzle-figures').each(
    function() {
      puzzleFigures.init($(this));
    });
});

