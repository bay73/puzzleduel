commonPuzzle = function(puzzleData, controls) {
  this.id = puzzleData.id;
  this.typeCode = puzzleData.typeCode;
  this.parseDimension(puzzleData.dimension);
  this.initImages();
  this.createBoard();
  this.steps = [];
  this.initControls(controls);
}

commonPuzzle.prototype.parseDimension = function(dimension) {
  // Parse dimension string to values.
  var dimensions = dimension.split("x");
  this.rows = dimensions[1];
  this.cols = dimensions[0];
}

commonPuzzle.prototype.initImages = function() {
  // Images used for the given puzzle type.
  this.clues = [];
  this.togglers = [];
  this.togglers = ["white"];
  this.preloadImages(this.clues);
  this.preloadImages(this.togglers);
}

commonPuzzle.prototype.start = function() {
  if (this.controls.startBtn) {
    $(this.controls.startBtn).html('Restart');
  }
  if (this.controls.revertBtn) {
    $(this.controls.revertBtn).show().prop('disabled', true);
  }
  if (this.controls.checkBtn) { 
    $(this.controls.checkBtn).show().prop('disabled', true);
  }
  this.removeMessages();
  // Read clues from server and start the puzzle solving.
  $.getJSON("/puzzles/" + this.id + "/start")
    .done(data => this.showClues(data))
    .fail((jqxhr, textStatus, error) => {this.message = showError(jqxhr.responseText);});
}

commonPuzzle.prototype.check = function() {
  var data = this.collectData(true, false);
  this.removeMessages();
  // Read result from server and show.
  $.post("/puzzles/" + this.id + "/check", data)
    .done(response => this.showResult(response))
    .fail((jqxhr, textStatus, error) => {this.message = showError(jqxhr.responseText);});
}

commonPuzzle.prototype.collectData = function(needWhites, needClues) {
  var data = {};
  for (var y = 0; y < this.rows; y++) {
    for (var x = 0; x < this.cols; x++) {
      var collect = true;
      if (this.cells[y][x].isClue && !needClues) {
        collect = false;
      }
      if (this.cells[y][x].value == "white" && !needWhites) {
        collect = false;
      }
      if (collect) {
        var coord = String.fromCharCode('a'.charCodeAt(0) + x) + (y+1).toString();
        data[coord] = this.cells[y][x].value;
      }
    }
  }
  return data;
}

commonPuzzle.prototype.edit = function() {
  this.removeMessages();
  if (this.controls.revertBtn) {
    $(this.controls.revertBtn).show().prop('disabled', true);
  }
  if (this.controls.saveBtn) {
    $(this.controls.saveBtn).show().prop('disabled', true);
  }
  // Read clues from server and start the puzzle solving.
  $.getJSON("/puzzles/" + this.id + "/get")
    .done(data => this.showForEdit(data))
    .fail((jqxhr, textStatus, error) => {this.message = showError(jqxhr.responseText);});
}

commonPuzzle.prototype.save = function() {
  var data = this.collectData(false, true);
  this.removeMessages();
  // Read result from server and show.
  $.post("/puzzles/" + (this.id ? this.id: "0") + "/edit", data)
    .done(response => this.showSaveResult(response))
    .fail((jqxhr, textStatus, error) => {this.message = showError(jqxhr.responseText);});
}

commonPuzzle.prototype.addStep = function(cell, oldValueIndex) {
  this.steps.push({cell: cell, valueIndex: oldValueIndex});
  if (this.controls.checkBtn) {
    $(this.controls.checkBtn).prop('disabled', false);
  }
    if (this.controls.saveBtn) {
      $(this.controls.saveBtn).prop('disabled', false);
    }
  if (this.controls.revertBtn) {
    $(this.controls.revertBtn).prop('disabled', false);
  }
}

commonPuzzle.prototype.revertStep = function() {
  if (this.steps.length > 0) {
    var step = this.steps.pop(this);
    step.cell.setValue(step.valueIndex);
  }
  if (this.steps.length == 0) {
    if (this.controls.checkBtn) {
      $(this.controls.checkBtn).prop('disabled', true);
    }
    if (this.controls.saveBtn) {
      $(this.controls.saveBtn).prop('disabled', true);
    }
    if (this.controls.revertBtn) {
      $(this.controls.revertBtn).prop('disabled', true);
    }
  }
}

commonPuzzle.prototype.render = function(snap) {
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

commonPuzzle.prototype.createBoard = function() {
  // Create 2D array of Cells
  this.cells = [];
  for (var y = 0; y < this.rows; y++) {
    this.cells[y] = new Array(this.cols);
    for (var x = 0; x < this.cols; x++) {
      this.cells[y][x] = new squarePuzzleCell(this, x, y);
    }
  }
}

commonPuzzle.prototype.findCellSize = function() {
  // Find cell size based on size of the window.
  var hSizeLimit = this.snap.node.clientWidth*0.90;
  var vSizeLimit = window.innerHeight*0.57;
  this.cellSize = Math.min(hSizeLimit / this.cols, vSizeLimit / this.rows);
  this.leftGap = (this.snap.node.clientWidth - this.cellSize * this.cols)/2;
  this.topGap = 1;
}
 
commonPuzzle.prototype.preloadImages = function(imageList) {
  // Preload images to prevent delays when solving.
  imageList.forEach(name => new Image().src = this.imageUrl(name));
}

commonPuzzle.prototype.imageUrl = function(imageName) {
  // Url for image with the given name.
  return "/images/"+imageName+".png";
}

commonPuzzle.prototype.showClues = function(data) {
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
  this.startTimer();
}

commonPuzzle.prototype.startTimer = function() {
  if (!this.controls.timer) {
    return;
  }
  self = this;
  this.startTime = new Date();
  this.showTime();
  this.timer = setInterval(() => self.showTime(),1000);
}

commonPuzzle.prototype.stopTimer = function() {
  if (this.timer) {
    clearInterval(this.timer);
    this.timer = null;
  }
}

commonPuzzle.prototype.showTime = function() {
  var formatNumber = function(num){
    if (num < 10) return '0' + num.toString();
    return num.toString();
  }
  var currentTime = new Date();
  var d = Math.round((currentTime.getTime() - this.startTime.getTime()) / 1000);
  var mins = Math.floor(d / 60);
  var secs = d - mins * 60;
  var hours = Math.floor(mins / 60);
  mins = mins - hours * 60;
  hours = hours > 0?formatNumber(hours)+":":"";
  mins = formatNumber(mins) + ":";
  secs = formatNumber(secs);
  $(this.controls.timer).text(hours + mins + secs);
}

commonPuzzle.prototype.showSaveResult = function(result) {
  this.removeMessages();
  if (result.status == 'OK') {
    this.stopTimer();
    this.message = showMessage("The puzzle has been saved!");
  } else {
    this.message = showError("Error while saving. " + result.status + ".");
    this.showErrorCells(result);
  }
}

commonPuzzle.prototype.showResult = function(result) {
  this.removeMessages();
  if (result.status == 'OK') {
    this.stopTimer();
    this.message = showMessage("Congratulations! The puzzle has been solved correctly!");
  } else {
    this.message = showError("Sorry, there is a mistake. " + result.status + ". Try again.");
    this.showErrorCells(result);
  }
}

commonPuzzle.prototype.showErrorCells = function(result) {
  if (result.errors) {
    result.errors.forEach(coord => {
      var x = coord.charCodeAt(0) - 'a'.charCodeAt(0);
      var y = parseInt(coord.substring(1)) - 1;
      this.cells[y][x].markError();
    });
  }
}

commonPuzzle.prototype.removeMessages = function() {
  if (this.message) {
    this.message.remove();
    this.message = null;
  }
}

commonPuzzle.prototype.showForEdit = function (data) {
  this.showClues(data);
  var editTogglers = ["white"].concat(this.clues);
  for (var y = 0; y < this.rows; y++) {
    for (var x = 0; x < this.cols; x++) {
      var index = editTogglers.indexOf(this.cells[y][x].value);
      this.cells[y][x].setRegular(editTogglers);
      this.cells[y][x].setValue(index);
    }
  }
}

commonPuzzle.prototype.initControls = function (controls) {
  self = this;
  this.controls = controls;
  if (this.controls.startBtn) {
    $(this.controls.startBtn).click(() => self.start());
  }
  if (this.controls.revertBtn) {
    $(this.controls.revertBtn).hide().click(() => self.revertStep());
  }
  if (this.controls.checkBtn) {
    $(this.controls.checkBtn).prop('disabled', true).click(() => self.check());
  }
  if (this.controls.saveBtn) {
    $(this.controls.saveBtn).click(() => self.save());
  }
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
  this.isClue = false;
  this.valueIndex = 0;
  this.value = this.togglers[this.valueIndex];
//this.attachController();
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
    if (this.valueIndex < 0) this.valueIndex = this.togglers.length - 1;
    if (this.valueIndex >= this.togglers.length) this.valueIndex = 0;
    this.value = this.togglers[this.valueIndex];
  }
  this.syncCell();
}

