// Default puzzle with square grid.
var squarePuzzle = function(typeCode, id, dimension) {
  this.id = id;
  this.typeCode = typeCode;
  this.initImages();
  this.parseDimension(dimension);
  this.createBoard();
}

squarePuzzle.prototype.start = function() {
  this.removeMessages();
  // Read clues from server and start the puzzle solving.
  $.getJSON("/puzzles/" + this.id + "/start")
    .done(data => this.showClues(data))
    .fail((jqxhr, textStatus, error) => showError(jqxhr.responseText)); 
}

squarePuzzle.prototype.check = function() {
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
  // Read clues from server and start the puzzle solving.
  $.post("/puzzles/" + this.id + "/check", data)
    .done(response => this.showResult(response))
    .fail((jqxhr, textStatus, error) => showError(jqxhr.responseText)); 
}


squarePuzzle.prototype.createBoard = function() {
  // Create 2D array of Cells
  this.cells = [];
  for (var y = 0; y < this.rows; y++) {
    this.cells[y] = new Array(this.cols);
    for (var x = 0; x < this.cols; x++) {
      this.cells[y][x] = new squarePuzzleCell(this, x, y);
    }
  }
}

squarePuzzle.prototype.findCellSize = function() {
  // Find cell size based on size of the window.
  var hSizeLimit = this.snap.node.clientWidth*0.97;
  var vSizeLimit = window.innerHeight*0.6;
  this.cellSize = Math.min(hSizeLimit / this.cols, vSizeLimit / this.rows);
  this.leftGap = (this.snap.node.clientWidth - this.cellSize * this.cols)/2;
  this.topGap = 1;
}
 
squarePuzzle.prototype.render = function(snap) {
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
  this.snap.node.setAttribute("height", this.snap.getBBox().height + 2);
}

squarePuzzle.prototype.showClues = function(data) {
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

squarePuzzle.prototype.showResult = function(result) {
  this.removeMessages();
  if (result.status == 'OK') {
    this.message = showMessage("Congratulations! Puzzle solved correctly!");
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

squarePuzzle.prototype.removeMessages = function() {
  if (this.message) {
    this.message.remove();
    this.message = null;
  }
}

squarePuzzle.prototype.preloadImages = function(imageList) {
  // Preload images to prevent delays when solving.
  imageList.forEach(name => new Image().src = this.imageUrl(name));
}

squarePuzzle.prototype.imageUrl = function(imageName) {
  // Url for image with the given name.
  return "images/"+imageName+".png";
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
  this.attachController();
}

squarePuzzleCell.prototype.renderCell = function() {
  // Draw cell inthe canvas.
  this.cellSize = this.puzzle.cellSize;
  var x = this.puzzle.leftGap + this.col*this.cellSize;
  var y = this.puzzle.topGap + this.row*this.cellSize;
  this.rect = this.puzzle.snap.rect(x, y, this.cellSize, this.cellSize);
  this.rect.attr({
    fill: "none",
    stroke: "#000",
    strokeWidth: 1
  });
  this.element = this.puzzle.snap.image(this.puzzle.imageUrl(this.value), x, y, this.cellSize, this.cellSize);
}

squarePuzzleCell.prototype.markError = function() {
  this.cellSize = this.puzzle.cellSize;
  var x = this.puzzle.leftGap + this.col*this.cellSize;
  var y = this.puzzle.topGap + this.row*this.cellSize;
  var errorElem = this.puzzle.snap.circle(x + this.cellSize/2, y + this.cellSize/2, 0);
  errorElem.attr({fill: "#f08", opacity: 0.5});
  var radius = this.cellSize/3;
  var errorInterval = setInterval(() => {
      errorElem.attr({r: 0});
      errorElem.animate({r: radius}, 200);
    }, 400);
  setTimeout(() => {errorElem.remove(); clearInterval(errorInterval);}, 5000);
}

squarePuzzleCell.prototype.syncCell = function() {
  // Sync cell image.
  if (this.element != undefined) {
    this.element.attr({href: this.puzzle.imageUrl(this.value)});
  }
}

squarePuzzleCell.prototype.toggleCell = function() {
  // Process click in the cell.
  this.valueIndex++;
  if (this.valueIndex >= this.togglers.length) this.valueIndex = 0;
  this.value = this.togglers[this.valueIndex];
  this.syncCell();
}

squarePuzzleCell.prototype.attachController = function() {
  // Attach events to the cell.
  if (this.togglers.length > 1 && this.element != undefined) {
    var cell = this;
    this.element.unclick();
    this.element.click(() => cell.toggleCell());
  }
}

squarePuzzle.prototype.initImages = function() {
  // Images used for the given puzzle type.
  this.clues = [];
  this.togglers = [];
  if(this.typeCode == "tapa_classic") {
    this.clues = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "1_1", "1_2", "1_3", "1_4", "1_5", "2_2", "2_3", "2_4", "3_3", "1_1_1", "1_1_2", "1_1_3", "1_2_2", "1_1_1_1"];
    this.togglers = ["white", "black", "x"];
  }
  this.preloadImages(this.clues);
  this.preloadImages(this.togglers);
}

squarePuzzle.prototype.parseDimension = function(dimension) {
  // Parse dimension string to values.
  var dimensions = dimension.split("x");
  this.rows = dimensions[1];
  this.cols = dimensions[0];
}

