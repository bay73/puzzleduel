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
  console.log(withLetter);
  let group = snap.g();
  figure.cells.forEach(function(cell) {
    let item = puzzleFigures.drawSquare(snap,coord.x+cell.x,coord.y+cell.y,size);
    group.add(item);
    item.click(function() {
      let isMarked = (group.attr("isMarked")!="true");
      group.attr({"isMarked": isMarked});
      group.children().forEach(function(item) {
        item.attr({fill: isMarked?puzzleFigures.markedColor:puzzleFigures.color})
      });
    });
  });
  if (withLetter) {
    puzzleFigures.drawLetter(snap, coord.x+figure.letterPos.x, coord.y+figure.letterPos.y, size, figure.letter);
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
},

}

$(document).ready(function () {
  $('.puzzle-figures').each(
    function() {
      puzzleFigures.init($(this));
    });
});

