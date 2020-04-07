var innerCluePuzzle = function(puzzleData, controls) {
  commonPuzzle.call(this, puzzleData, controls);
}

Object.setPrototypeOf(innerCluePuzzle.prototype, commonPuzzle.prototype);

var outerCluePuzzle = function(puzzleData, controls) {
  commonPuzzle.call(this, puzzleData, controls);
}

Object.setPrototypeOf(outerCluePuzzle.prototype, commonPuzzle.prototype);

innerCluePuzzle.prototype.initImages = function() {
  // Images used for the given puzzle type.
  this.clues = [];
  this.togglers = [];
  if(this.typeCode == "tapa_classic") {
    this.clues = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "1_1", "1_2", "1_3", "1_4", "1_5", "2_2", "2_3", "2_4", "3_3", "1_1_1", "1_1_2", "1_1_3", "1_2_2", "1_1_1_1"];
    this.togglers = ["white", "black", "cross"];
  }
  if(this.typeCode == "yin_yang_classic") {
    this.clues = ["black_circle", "white_circle"];
    this.togglers = ["white", "black_circle", "white_circle"];
  }
  if(this.typeCode == "minesweeper_classic") {
    this.clues = ["0", "1", "2", "3", "4", "5", "6", "7", "8"];
    this.togglers = ["white", "mine", "cross"];
  }
  if(this.typeCode == "nurikabe") {
    this.clues = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15"];
    this.togglers = ["white", "black", "cross"];
  }
  this.preloadImages(this.clues);
  this.preloadImages(this.togglers);
}

innerCluePuzzle.prototype.outerCluePosition = function() {
  return this.NONE;
}

outerCluePuzzle.prototype.outerCluePosition = function() {
  return this.BOTTOM_RIGHT;
}

outerCluePuzzle.prototype.initImages = function() {
  // Images used for the given puzzle type.
  this.clues = [];
  this.togglers = [];
  if(this.typeCode == "clouds") {
    this.clues = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15"];
    this.togglers = ["white", "black", "cross"];
  }
  this.preloadImages(this.clues);
  this.preloadImages(this.togglers);
}

innerCluePuzzle.prototype.showClues = function(data) {
  commonPuzzle.prototype.showClues.call(this, data);
  this.attachControllers();
}

innerCluePuzzle.prototype.showForEdit = function(data) {
  commonPuzzle.prototype.showForEdit.call(this, data);
  this.attachControllers();
}

innerCluePuzzle.prototype.attachControllers = function() {
  this.allCells.forEach(cell => {
    if (!cell.isClue) {
      cell.attachController();
    }
  });
}

outerCluePuzzle.prototype.showClues = function(data) {
  commonPuzzle.prototype.showClues.call(this, data);
  this.attachControllers();
}

outerCluePuzzle.prototype.showForEdit = function(data) {
  commonPuzzle.prototype.showForEdit.call(this, data);
  this.attachControllers();
}

outerCluePuzzle.prototype.attachControllers = function() {
  this.allCells.forEach(cell => {
    if (!cell.isClue) {
      cell.attachController();
    }
  });
}

squarePuzzleCell.prototype.attachController = function() {
  // Attach events to the cell.
  if (this.togglers.length > 1 && this.element != undefined) {
    var cell = this;
    this.element.unclick();
    this.element.click(() => cell.toggleCell());
  }
}

squarePuzzleCell.prototype.toggleCell = function() {
  if (this.puzzle.pencilMarkMode) {
    this.togglePencilMarks();
  } else {
    this.puzzle.addStep(this, this.valueIndex);
    this.setValue(this.valueIndex+1);
  }
}

squarePuzzleCell.prototype.togglePencilMarks = function() {
  if (this.togglers.length == 3) {
    if (!this.pencilMarks || this.pencilMarks.length == 0) {
      this.pencilMarks = [1];
    } else if (this.pencilMarks.includes(1)) {
      this.pencilMarks = [2];
    } else {
      this.pencilMarks = [];
    }
  }
  // TODO: Implement some logic for cases with four elements.
  this.syncCell();
  var cell = this;
  for (var i=0;i<this.markElements.length;i++) {
    this.markElements[i].unclick();
    this.markElements[i].click(() => cell.toggleCell());
  }
}

