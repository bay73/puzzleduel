var innerCluePuzzle = function(puzzleData, controls) {
  commonPuzzle.call(this, puzzleData, controls);
}

Object.setPrototypeOf(innerCluePuzzle.prototype, commonPuzzle.prototype);

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

// Extend cell class adding click controller
squarePuzzleCell.prototype.setRegular = function(togglers) {
  // Mark cell as a regular.
  this.togglers = togglers;
  this.isClue = false;
  this.valueIndex = 0;
  this.value = this.togglers[this.valueIndex];
  this.attachController();
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
  this.puzzle.addStep(this, this.valueIndex);
  // Process click in the cell.
  this.setValue(this.valueIndex+1);
}

