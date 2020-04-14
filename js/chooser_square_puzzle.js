var innerCluePuzzle = function(puzzleData, controls) {
  commonPuzzle.call(this, puzzleData, controls);
}

Object.setPrototypeOf(innerCluePuzzle.prototype, commonPuzzle.prototype);

var classicSudokuPuzzle = function(typeCode, id, dimension) {
  innerCluePuzzle.call(this, typeCode, id, dimension);
}

Object.setPrototypeOf(classicSudokuPuzzle.prototype, innerCluePuzzle.prototype);

var outerCluePuzzle = function(puzzleData, controls) {
  commonPuzzle.call(this, puzzleData, controls);
}

Object.setPrototypeOf(outerCluePuzzle.prototype, commonPuzzle.prototype);

innerCluePuzzle.prototype.initImages = function() {
  // Images used for the given puzzle type.
  this.clues = [];
  this.togglers = [];
  if(this.typeCode == "fuzuli") {
    this.togglers = ["white"];
    for (var i=1;i<=parseInt(this.rows) - 2;i++) {
      this.clues.push(i.toString());
      this.togglers.push(i.toString());
    }
    this.togglers.push("cross");
    this.togglers.push("white_circle");
  }
  this.preloadImages(this.clues);
  this.preloadImages(this.togglers);
}

innerCluePuzzle.prototype.outerCluePosition = function() {
  return this.NONE;
}

outerCluePuzzle.prototype.parseDimension = function(dimension) {
  if (this.typeCode == "easy_as_abc") {
    // Parse dimension string to values.
    var part = dimension.split("-");
    commonPuzzle.prototype.parseDimension.call(this, part[0]);
    this.letters = part[1];
  } else {
    commonPuzzle.prototype.parseDimension.call(this, dimension);
  }
}

outerCluePuzzle.prototype.initImages = function() {
  // Images used for the given puzzle type.
  this.clues = [];
  this.togglers = [];
  if(this.typeCode == "doubleblock") {
    this.togglers = ["white"];
    for (var i=1;i<=parseInt(this.rows) - 2;i++) {
      this.togglers.push(i.toString());
    }
    this.togglers.push("cross");
    this.togglers.push("white_circle");
    for (var i=0;i<=15;i++) {
      this.clues.push(i.toString());
    }
  }
  if (this.typeCode == "easy_as_abc") {
    this.togglers = ["white"];
    if (this.letters) {
      for (var i=0;i<this.letters.length;i++) {
        var letter = this.letters.charAt(i);
        this.togglers.push(letter);
        this.clues.push(letter);
      }
    }
    this.togglers.push("cross");
    this.togglers.push("white_circle");
  }
  this.preloadImages(this.clues);
  this.preloadImages(this.togglers);
}

outerCluePuzzle.prototype.outerCluePosition = function() {
  if (this.typeCode == "easy_as_abc") {
    return this.FOUR_SIDES;
  } else {
    return this.BOTTOM_RIGHT;
  }
}

classicSudokuPuzzle.prototype.initImages = function() {
  // Images used for the given puzzle type.
  this.clues = [];
  this.togglers = [];
  this.togglers = ["white"];
  for (var i=1;i<=parseInt(this.rows);i++) {
    this.clues.push(i.toString());
    this.togglers.push(i.toString());
  }
  if (this.typeCode == "sudoku_x_sums") {
    for (var i=parseInt(this.rows);i<=19;i++) {
      this.clues.push(i.toString());
    }
  }
  this.preloadImages(this.clues);
  this.preloadImages(this.togglers);
}

classicSudokuPuzzle.prototype.outerCluePosition = function() {
  if (this.typeCode == "sudoku_x_sums" || this.typeCode == "sudoku_skyscrapers") {
    return this.FOUR_SIDES;
  } else {
    return this.NONE;
  }
}

innerCluePuzzle.prototype.render = function(snap) {
  commonPuzzle.prototype.render.call(this, snap);
  chooserBuilder.attachEvents(this.snap.node, this);
}

outerCluePuzzle.prototype.render = function(snap) {
  commonPuzzle.prototype.render.call(this, snap);
  chooserBuilder.attachEvents(this.snap.node, this);
}

classicSudokuPuzzle.prototype.render = function(snap) {
  innerCluePuzzle.prototype.render.call(this, snap);
  var sizeH = 3;
  var sizeV = 3;
  if (this.rows == 8) {
    var sizeH = 4;
    var sizeV = 2;
  }
  if (this.rows == 6) {
    var sizeH = 3;
    var sizeV = 2;
  }
  for (var j = 0; j < this.rows/sizeV; j++) {
    for (var i = 0; i < this.cols/sizeH; i++) {
        var area = this.snap.rect(
          this.leftGap + i * sizeH * this.cellSize,
          this.topGap + j * sizeV * this.cellSize,
          sizeH * this.cellSize, sizeV * this.cellSize);
        area.attr({
          fill: "none",
          stroke: this.gridProperty.stroke,
          strokeWidth: this.gridProperty.boldWidth
        });
      }
    }
}

squarePuzzleCell.prototype.revertTo = function(data) {
  this.setValue(data.index);
}

// Class to build value chooser
var chooserBuilder = {

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

eventElement: function(event) {
  var position = chooserBuilder.eventPosition(event);
  return Snap.getElementByPoint(position.x, position.y);
},

attachEvents: function(node, puzzle) {
  node.addEventListener("mousedown", function(event){chooserBuilder.onMouseDown(puzzle, event)});
  node.addEventListener("touchstart", function(event){chooserBuilder.onMouseDown(puzzle, event)});
  node.addEventListener("mouseup", function(event){chooserBuilder.onMouseUp(puzzle, event)});
  node.addEventListener("touchend", function(event){chooserBuilder.onMouseUp(puzzle, event)});
},

onMouseDown: function(puzzle, event) {
  event.preventDefault();
  var cell = chooserBuilder.eventElement(event).cell;
  if (cell && cell.togglers.length > 0) {
    if (puzzle.chooserElem) {
      puzzle.chooserElem.remove();
    }
    var center = cell.getCenter();
    puzzle.chooserElem = puzzle.snap.group();
    puzzle.chooserElem.cell = cell;
    // Chooser should fit to the screen when hit on th leftmost cell.
    // 25 - distance between left border and svg, leftGap - between svg edge and grid.
    var chooserSize = Math.min(25 + puzzle.leftGap + puzzle.cellSize / 2, puzzle.cellSize * 1.6);
    var circle = puzzle.snap.circle(center.x, center.y, chooserSize);
    circle.attr({fill: "#750", opacity: 0.5});
    puzzle.chooserElem.append(circle);
    puzzle.chooserElem.main = circle;
    var angle = Math.PI * 2 / cell.togglers.length;
    var distance = 1. / (1. + Math.sin(angle/2));
    for (var i=0;i<cell.togglers.length;i++){
      chooserBuilder.createToggler(puzzle, center, angle, distance, chooserSize, i, cell.togglers[i]);
    }
    puzzle.chooserElem.node.addEventListener("mouseleave", function(event){chooserBuilder.onMouseUp(puzzle,event)});
  }
},

createToggler: function(puzzle, center, angle, distance, size, index, value) {
  var togglerCircle = puzzle.snap.circle(
    center.x + Math.sin(index*angle)*size*distance,
    center.y - Math.cos(index*angle)*size*distance,
    size*(1.-distance));
  togglerCircle.attr({stroke: "#430", strokeWidth: 2, fill: "#750", opacity: 0.2});
  puzzle.chooserElem.append(togglerCircle);
  var togglerImage = puzzle.snap.image(
    puzzle.imageUrl(value),
    center.x + Math.sin(index*angle)*size*distance - size*(1.-distance),
    center.y - Math.cos(index*angle)*size*distance - size*(1.-distance),
    size*(1.-distance)*2,
    size*(1.-distance)*2);
  $(togglerImage.node).css("filter","url(#chooser)");
  togglerImage.valueIndex = index;
  puzzle.chooserElem.append(togglerImage);
  togglerImage.node.addEventListener("mouseover", ()=> {togglerCircle.attr({opacity: 1});});
  togglerImage.node.addEventListener("mouseout", ()=> {togglerCircle.attr({opacity: 0.3});});
  puzzle.snap.node.addEventListener("touchmove", (event)=> {
    if (chooserBuilder.eventElement(event)==togglerImage) {
      togglerCircle.attr({opacity: 1});
    } else {
      togglerCircle.attr({opacity: 0.3});
    }
  });
},

onMouseUp: function(puzzle, event) {
  if (puzzle.chooserElem) {
    var element = chooserBuilder.eventElement(event);
    if (element.valueIndex != undefined) {
      if (puzzle.pencilMarkMode) {
        puzzle.chooserElem.cell.togglePencilMark(element.valueIndex);
      } else {
        puzzle.addStep(puzzle.chooserElem.cell, {index: puzzle.chooserElem.cell.valueIndex});
        puzzle.chooserElem.cell.setValue(element.valueIndex);
      }
    }
    if (element != puzzle.chooserElem.main) {
      puzzle.chooserElem.remove();
      puzzle.chooserElem = null;
    }
  }
}
}

