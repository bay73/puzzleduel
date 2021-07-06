puzzleFigures = {

gapLeft: 2,
gapTop: 2,
snapId: 0,
theme: 'default',

tetro_I: [{x:0,y:0},{x:1,y:0},{x:2,y:0},{x:3,y:0}],
tetro_I_vert: [{x:0,y:0},{x:0,y:1},{x:0,y:2},{x:0,y:3}],
tetro_T: [{x:0,y:0},{x:1,y:0},{x:2,y:0},{x:1,y:1}],
tetro_L: [{x:0,y:0},{x:0,y:1},{x:0,y:2},{x:1,y:2}],
tetro_J: [{x:0,y:0},{x:0,y:1},{x:0,y:2},{x:-1,y:2}],
tetro_S: [{x:0,y:0},{x:0,y:1},{x:1,y:1},{x:1,y:2}],
tetro_Z: [{x:0,y:0},{x:0,y:1},{x:-1,y:1},{x:-1,y:2}],
tetro_O: [{x:0,y:0},{x:1,y:0},{x:0,y:1},{x:1,y:1}],

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

drawFigure: function(snap,coord,cells,size) {
  var group = snap.g();
  cells.forEach(function(cell) {
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
  group.attr({"isMarked": false})
},

createTetro7: function(snap) {
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
    puzzleFigures.drawFigure(snap,{x:0,y:0}, puzzleFigures.tetro_O, cellSize);
    puzzleFigures.drawFigure(snap,{x:4,y:0}, puzzleFigures.tetro_Z, cellSize);
    puzzleFigures.drawFigure(snap,{x:6,y:0}, puzzleFigures.tetro_S, cellSize);
    puzzleFigures.drawFigure(snap,{x:9,y:0}, puzzleFigures.tetro_I_vert, cellSize);
    puzzleFigures.drawFigure(snap,{x:11,y:0}, puzzleFigures.tetro_L, cellSize);
    puzzleFigures.drawFigure(snap,{x:15,y:0}, puzzleFigures.tetro_J, cellSize);
    puzzleFigures.drawFigure(snap,{x:17,y:0}, puzzleFigures.tetro_T, cellSize);
  } else {
    var cellSize = width/8;
    snap.node.setAttribute("height", cellSize * 8 + puzzleFigures.gapTop*2);
    puzzleFigures.gapLeft = (width - cellSize*8)/2
    puzzleFigures.drawFigure(snap,{x:3,y:0}, puzzleFigures.tetro_O, cellSize);
    puzzleFigures.drawFigure(snap,{x:1,y:0}, puzzleFigures.tetro_Z, cellSize);
    puzzleFigures.drawFigure(snap,{x:6,y:0}, puzzleFigures.tetro_S, cellSize);
    puzzleFigures.drawFigure(snap,{x:2,y:3}, puzzleFigures.tetro_I, cellSize);
    puzzleFigures.drawFigure(snap,{x:2.5,y:5}, puzzleFigures.tetro_T, cellSize);
    puzzleFigures.drawFigure(snap,{x:0,y:5}, puzzleFigures.tetro_L, cellSize);
    puzzleFigures.drawFigure(snap,{x:7,y:5}, puzzleFigures.tetro_J, cellSize);
  }
},

init: function(element) {
  puzzleFigures.theme = element.attr('theme')?element.attr('theme'):'default';
  puzzleFigures.color = "#000";
  puzzleFigures.markedColor = "#384d52";
  if (puzzleFigures.theme == "contrast"){
    puzzleFigures.color = "#fff";
    puzzleFigures.markedColor = "#404040";
  }
  if (puzzleFigures.theme == "white"){
  puzzleFigures.markedColor = "#ddd";
  }
  puzzleFigures.snapId++;
  element.append('<svg id="figures_svg_' + puzzleFigures.snapId+'"></svg><br>');

  let figures = element.attr('figures');
  if (figures=="tetro7") {
    puzzleFigures.createTetro7(Snap('#figures_svg_' + puzzleFigures.snapId));
  }
},

}

$(document).ready(function () {
  $('.puzzle-figures').each(
    function() {
      puzzleFigures.init($(this));
    });
});

