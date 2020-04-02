// Default puzzle with square grid.
var innerCluePuzzle = function(typeCode, id, dimension) {
  this.id = id;
  this.typeCode = typeCode;
  this.parseDimension(dimension);
  this.initImages();
  this.createBoard();
  this.steps = [];
}

innerCluePuzzle.prototype.start = function() {
  this.removeMessages();
  // Read clues from server and start the puzzle solving.
  $.getJSON("/puzzles/" + this.id + "/start")
    .done(data => this.showClues(data))
    .fail((jqxhr, textStatus, error) => showError(jqxhr.responseText)); 
}

innerCluePuzzle.prototype.check = function() {
  var data = {};
  for (var y = 0; y < this.rows; y++) {
    for (var x = 0; x < this.cols; x++) {
      if (!this.cells[y][x].isClue) {
        var coord = String.fromCharCode('a'.charCodeAt(0) + x) + (y+1).toString();
        data[coord] = this.cells[y][x].value;
      }
    }
  }
  this.removeMessages();
  $.post("/puzzles/" + this.id + "/check", data)
    .done(response => this.showResult(response))
    .fail((jqxhr, textStatus, error) => showError(jqxhr.responseText)); 
}

innerCluePuzzle.prototype.revertStep = function() {
  if (this.steps.length > 0) {
    var step = this.steps.pop(this);
    step.cell.setValue(step.valueIndex);
  }
}

innerCluePuzzle.prototype.createBoard = function() {
  // Create 2D array of Cells
  this.cells = [];
  for (var y = 0; y < this.rows; y++) {
    this.cells[y] = new Array(this.cols);
    for (var x = 0; x < this.cols; x++) {
      this.cells[y][x] = new squarePuzzleCell(this, x, y);
    }
  }
}

innerCluePuzzle.prototype.findCellSize = function() {
  // Find cell size based on size of the window.
  var hSizeLimit = this.snap.node.clientWidth*0.97;
  var vSizeLimit = window.innerHeight*0.55;
  this.cellSize = Math.min(hSizeLimit / this.cols, vSizeLimit / this.rows);
  this.leftGap = (this.snap.node.clientWidth - this.cellSize * this.cols)/2;
  this.topGap = 45;
}
 
innerCluePuzzle.prototype.render = function(snap) {
  // Draw puzzle grid
  this.snap = snap;
  this.findCellSize();
  var board = this.snap.rect(this.leftGap, this.topGap, this.cols * this.cellSize, this.rows * this.cellSize);
  board.attr({
      fill: "#fff",
      stroke: "#000",
      strokeWidth: 5
  });
  for (var y = 0; y < this.rows; y++) {
    for (var x = 0; x < this.cols; x++) {
      this.cells[y][x].renderCell();
    }
  }
  this.snap.node.setAttribute("height", this.snap.getBBox().height + this.topGap*2);
  chooserBuilder.attachEvents(this.snap.node, this);
}

innerCluePuzzle.prototype.showClues = function(data) {
  // Parse clues.
  for (const [key, value] of Object.entries(data)) {
    var x = key.charCodeAt(0) - 'a'.charCodeAt(0);
    var y = parseInt(key.substring(1)) - 1;
    this.cells[y][x].setClue(value);
  }
  // All non-clue cells are general togglable.
  for (var y = 0; y < this.rows; y++) {
    for (var x = 0; x < this.cols; x++) {
      if (!this.cells[y][x].isClue) {
        this.cells[y][x].setRegular(this.togglers);
      }
      this.cells[y][x].syncCell();
    }
  }
}

innerCluePuzzle.prototype.showResult = function(result) {
  this.removeMessages();
  if (result.status == 'OK') {
    this.message = showMessage("Congratulations! The puzzle has been solved correctly!");
  } else {
    this.message = showError("Sorry, there is a mistake. " + result.status + ". Try again.", 10000);
    if (result.errors) {
      result.errors.forEach(coord => {
        var x = coord.charCodeAt(0) - 'a'.charCodeAt(0);
        var y = parseInt(coord.substring(1)) - 1;
        this.cells[y][x].markError();
      });
    }
  }
}

innerCluePuzzle.prototype.removeMessages = function() {
  if (this.message) {
    this.message.remove();
    this.message = null;
  }
}

innerCluePuzzle.prototype.preloadImages = function(imageList) {
  // Preload images to prevent delays when solving.
  imageList.forEach(name => new Image().src = this.imageUrl(name));
}

innerCluePuzzle.prototype.imageUrl = function(imageName) {
  // Url for image with the given name.
  return "/images/"+imageName+".png";
}

var squarePuzzleCell = function(puzzle, col, row) {
  // Element of the grid.
  this.puzzle = puzzle;
  this.col = col;
  this.row = row;
  this.isClue = false;
  this.value = "white";
  this.togglers = []
  this.cellSize = this.puzzle.cellSize;
}

squarePuzzleCell.prototype.setClue = function(value) {
  // Mark cell as a clue.
  this.isClue = true;
  this.value = value;
}

squarePuzzleCell.prototype.setRegular = function(togglers) {
  // Mark cell as a regular.
  this.togglers = togglers;
  this.valueIndex = 0;
  this.value = this.togglers[this.valueIndex];
}

squarePuzzleCell.prototype.renderCell = function() {
  // Draw cell in the canvas.
  this.cellSize = this.puzzle.cellSize;
  var corner = this.getCorner();
  this.rect = this.puzzle.snap.rect(corner.x, corner.y, this.cellSize, this.cellSize);
  this.rect.attr({
    fill: "none",
    stroke: "#000",
    strokeWidth: 1
  });
  this.element = this.puzzle.snap.image(
    this.puzzle.imageUrl(this.value), 
    corner.x, corner.y, this.cellSize, this.cellSize);
  this.element.cell = this;
}

squarePuzzleCell.prototype.markError = function() {
  var center = this.getCenter();
  var errorElem = this.puzzle.snap.circle(center.x, center.y, 0);
  errorElem.attr({fill: "#f08", opacity: 0.5});
  var radius = this.cellSize/3;
  // Blinking animation
  var errorInterval = setInterval(() => {
      errorElem.attr({r: 0});
      errorElem.animate({r: radius}, 200);
    }, 400);
  // Remove animation after 5 sec.
  setTimeout(() => {errorElem.remove(); clearInterval(errorInterval);}, 5000);
}

squarePuzzleCell.prototype.getCenter = function() {
  var corner = this.getCorner();
  return {
    x: corner.x + this.cellSize/2,
    y: corner.y + this.cellSize/2
  }
}

squarePuzzleCell.prototype.getCorner = function() {
  return {
    x: this.puzzle.leftGap + this.col*this.cellSize,
    y: this.puzzle.topGap + this.row*this.cellSize
  }
}

squarePuzzleCell.prototype.syncCell = function() {
  // Sync cell image.
  if (this.element != undefined) {
    this.element.attr({href: this.puzzle.imageUrl(this.value)});
  }
}

squarePuzzleCell.prototype.setValue = function(valueIndex) {
  if (!this.isClue) {
    this.valueIndex = valueIndex;
    this.value = this.togglers[this.valueIndex];
  }
  this.syncCell();
}

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
  }
  this.preloadImages(this.clues);
  this.preloadImages(this.togglers);
}

innerCluePuzzle.prototype.parseDimension = function(dimension) {
  // Parse dimension string to values.
  var dimensions = dimension.split("x");
  this.rows = dimensions[1];
  this.cols = dimensions[0];
}

var chooserBuilder = {

eventPosition: function(event) {
  if (event instanceof TouchEvent) {
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
    var chooserSize = puzzle.cellSize*1.3;
    var circle = puzzle.snap.circle(center.x, center.y, chooserSize);
    circle.attr({fill: "#880", opacity: 0.4});
    puzzle.chooserElem.append(circle);
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
  togglerCircle.attr({stroke: "#550", strokeWidth: 2, fill: "#880", opacity: 0.2});
  puzzle.chooserElem.append(togglerCircle);
  var togglerImage = puzzle.snap.image(
    puzzle.imageUrl(value),
    center.x + Math.sin(index*angle)*size*distance - size/4,
    center.y - Math.cos(index*angle)*size*distance - size/4,
    size/2,
    size/2);
  togglerImage.valueIndex = index;
  puzzle.chooserElem.append(togglerImage);
  togglerImage.node.addEventListener("mouseover", ()=> {togglerCircle.attr({opacity: 0.95});});
  togglerImage.node.addEventListener("mouseout", ()=> {togglerCircle.attr({opacity: 0.2});});
  puzzle.snap.node.addEventListener("touchmove", (event)=> {
    if (chooserBuilder.eventElement(event)==togglerImage) {
      togglerCircle.attr({opacity: 0.95});
    } else {
      togglerCircle.attr({opacity: 0.2});
    }
  });
},

onMouseUp: function(puzzle, event) {
  if (puzzle.chooserElem) {
    var element = chooserBuilder.eventElement(event);
    if (element.valueIndex != undefined) {
      puzzle.steps.push({cell: puzzle.chooserElem.cell, valueIndex: puzzle.chooserElem.cell.valueIndex});
      puzzle.chooserElem.cell.setValue(element.valueIndex);
    }
    puzzle.chooserElem.remove();
    puzzle.chooserElem = null;
  }
}
}




