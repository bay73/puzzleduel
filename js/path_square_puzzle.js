define(["/js/common.js"], function() {

innerCluePuzzle = function(puzzleData, controls, settings) {
  commonPuzzle.call(this, puzzleData, controls, settings);
}

Object.setPrototypeOf(innerCluePuzzle.prototype, commonPuzzle.prototype);

innerCluePuzzle.prototype.initImages = function() {
  // Images used for the given puzzle type.
  this.clues = [];
  this.togglers = [];
  if(this.typeCode == "every_second_turn") {
    this.clues = ["white_circle"];
  }
  if(this.typeCode == "loop_minesweeper") {
    this.clues = ["0", "1", "2", "3", "4", "5", "6", "7", "8"];
  }
  if(this.typeCode == "masyu") {
    this.clues = ["white_circle", "black_circle"];
  }
  if(this.typeCode == "simple_loop") {
    this.clues = ["black"];
  }
  if(this.typeCode == "chat_room") {
    this.clues = ["phone", "white_circle", "white_1", "white_2", "white_3", "white_4", "white_5", "black_circle", "black_1", "black_2", "black_3", "black_4", "black_5"];
  }
  this.preloadImages(this.clues);
  this.preloadImages(this.togglers);
}

innerCluePuzzle.prototype.outerCluePosition = function() {
  return this.NONE;
}

innerCluePuzzle.prototype.render = function(snap) {
  commonPuzzle.prototype.render.call(this, snap);
  dragController.attachEvents(this);
}

innerCluePuzzle.prototype.collectData = function(needWhites, needClues) {
  var data = {};
  for (var y = 0; y < this.rows; y++) {
    for (var x = 0; x < this.cols; x++) {
      var coord = String.fromCharCode('a'.charCodeAt(0) + x) + (y+1).toString();
      data[coord] = this.cells[y][x].directions;
    }
  }
  return data;
}

squarePuzzleCell.prototype.getLineAttr = function(pencilMark) {
  var width = pencilMark ? this.puzzle.cellSize/16 : this.puzzle.cellSize/6;
  var attr = {
    stroke: "#002B36",
    strokeWidth: width + "px",
    "stroke-linecap": "round",
    "stroke-opacity": 1
  };
  if (pencilMark) {
    attr["stroke-dasharray"]="1," + width*1.5;
  }
  return attr;
}

squarePuzzleCell.prototype.toggleLine = function(direction) {
  if (!this.markDirections) {
    this.markDirections = {};
  }
  if (!this.directions) {
    this.directions = {};
  }
  if (this.puzzle.pencilMarkMode) {
    this.markDirections[direction] = !this.markDirections[direction];
  } else {
    this.puzzle.addStep(this, {h: this.directions.h, v: this.directions.v});
    this.directions[direction] = !this.directions[direction];
    this.markDirections[direction] = false;
  }
  this.syncCell();
}

squarePuzzleCell.prototype.revertTo = function(data) {
  this.directions = data;
  this.syncCell();
}

squarePuzzleCell.prototype.reset = function() {
  this.markDirections = {};
  this.directions = {};
}

squarePuzzleCell.prototype.syncAdditional = function() {
  if (!this.lines) {
    this.lines = [];
  }
  while (this.lines.length > 0) {
    var line = this.lines.pop();
    line.remove();
  }
  var center = this.getCenter();
  if (this.markDirections["h"]) {
    var line = this.puzzle.snap.line(center.x, center.y, center.x + this.cellSize, center.y);
    line.attr(this.getLineAttr(true));
    this.lines.push(line);
  }
  if (this.markDirections["v"]) {
    var line = this.puzzle.snap.line(center.x, center.y, center.x, center.y + this.cellSize);
    line.attr(this.getLineAttr(true));
    this.lines.push(line);
  }
  if (this.directions["h"]) {
    var line = this.puzzle.snap.line(center.x, center.y, center.x + this.cellSize, center.y);
    line.attr(this.getLineAttr(false));
    this.lines.push(line);
  }
  if (this.directions["v"]) {
    var line = this.puzzle.snap.line(center.x, center.y, center.x, center.y + this.cellSize);
    line.attr(this.getLineAttr(false));
    this.lines.push(line);
  }
}

// Class to build value chooser
var dragController = {

eventPosition: function(event) {
  if (window.TouchEvent && event instanceof TouchEvent) {
    if(event.type == "touchend") {
      return {x: event.changedTouches[0].clientX, y: event.changedTouches[0].clientY};
    } else {
      return {x: event.touches[0].clientX, y: event.touches[0].clientY};
    }
  } else {
    return {x: event.clientX, y: event.clientY};
  }
},

eventElement: function(puzzle, event) {
  var position = dragController.transformPoint(puzzle.snap.node, dragController.eventPosition(event));
  var col = Math.floor((position.x - puzzle.leftGap)/puzzle.cellSize);
  var row = Math.floor((position.y - puzzle.topGap)/puzzle.cellSize);
  if (puzzle.cells[row]) {
    return puzzle.cells[row][col];
  } else {
    return null;
  }
},

attachEvents: function(puzzle) {
  puzzle.snap.node.addEventListener("mousedown", function(event){dragController.onMouseDown(puzzle, event)});
  puzzle.snap.node.addEventListener("touchstart", function(event){dragController.onMouseDown(puzzle, event)});
  puzzle.snap.node.addEventListener("mouseup", function(event){dragController.onMouseUp(puzzle, event)});
  puzzle.snap.node.addEventListener("touchend", function(event){dragController.onMouseUp(puzzle, event)});
  puzzle.snap.node.addEventListener("touchcancel", function(event){dragController.onMouseUp(puzzle, event)});
},

transformPoint: function(node, position) {
  var p = node.createSVGPoint()
  p.x = position.x;
  p.y = position.y;
  return p.matrixTransform(node.getScreenCTM().inverse())
},

onMouseDown: function(puzzle, event) {
  event.preventDefault();
  if (puzzle.dragData && puzzle.dragData.line) {
    puzzle.dragData.line.remove();
  }
  var cell = dragController.eventElement(puzzle, event);
  if (cell) {
    var dragData = {
      startCell: cell,
      startPosition: dragController.eventPosition(event)
    }
    puzzle.dragData = dragData;

    dragData.listener = function(event){dragController.onMouseMove(puzzle, event)};
        
    puzzle.snap.node.addEventListener("touchmove", dragData.listener);
    puzzle.snap.node.addEventListener("mousemove", dragData.listener);
  }
},

onMouseMove: function(puzzle, event) {
  if (!puzzle.dragData) {
    return;
  }
  if (puzzle.dragData.line) {
    puzzle.dragData.line.remove();
  }
  var cell = dragController.eventElement(puzzle, event);
  if (!cell) {
    return;
  }
  var absolutePosition = dragController.eventPosition(event);
  var position = dragController.transformPoint(puzzle.snap.node, absolutePosition);
  var startCenter = puzzle.dragData.startCell.getCenter();
  var finishMove = cell != puzzle.dragData.startCell && 
       (Math.abs(position.x - startCenter.x) > puzzle.cellSize*0.75 ||
        Math.abs(position.y - startCenter.y) > puzzle.cellSize*0.75);
  if (finishMove) {
    var row = puzzle.dragData.startCell.row;
    var col = puzzle.dragData.startCell.col;
    if (Math.abs(position.x - startCenter.x) > Math.abs(position.y - startCenter.y)) {
      col = col + Math.sign(position.x - startCenter.x);
    } else {
      row = row + Math.sign(position.y - startCenter.y);
    }
    if (puzzle.cells[row] && puzzle.cells[row][col]){
      var finishCell = puzzle.cells[row][col];
      if (finishCell.row > puzzle.dragData.startCell.row) puzzle.dragData.startCell.toggleLine('v');
      else if (finishCell.row < puzzle.dragData.startCell.row) finishCell.toggleLine('v');
      else if (finishCell.col > puzzle.dragData.startCell.col) puzzle.dragData.startCell.toggleLine('h');
      else if (finishCell.col < puzzle.dragData.startCell.col) finishCell.toggleLine('h');
      puzzle.dragData.startCell = finishCell;
    }
  } else {
    var needLine = cell != puzzle.dragData.startCell ||
       (Math.abs(absolutePosition.x - puzzle.dragData.startPosition.x) > puzzle.cellSize*0.1 ||
        Math.abs(absolutePosition.y - puzzle.dragData.startPosition.y) > puzzle.cellSize*0.1);
    if (needLine) {
      var vertical = 0;
      var horizontal = 0;
      if (Math.abs(position.x - startCenter.x) > Math.abs(position.y - startCenter.y)) {
        horizontal = position.x - startCenter.x;
      } else {
        vertical = position.y - startCenter.y;
      }
      puzzle.dragData.line = puzzle.snap.line(startCenter.x, startCenter.y, startCenter.x + horizontal, startCenter.y + vertical);
      puzzle.dragData.line.attr(puzzle.dragData.startCell.getLineAttr(puzzle.pencilMarkMode));
    }
  }
},

onMouseUp: function(puzzle, event) {
  if (!puzzle.dragData) {
    return;
  }
  if (puzzle.dragData.line) {
    puzzle.dragData.line.remove();
  }
  puzzle.snap.node.removeEventListener("touchmove", puzzle.dragData.listener);
  puzzle.snap.node.removeEventListener("mousemove", puzzle.dragData.listener);
  puzzle.dragData = null;
}
}

})
