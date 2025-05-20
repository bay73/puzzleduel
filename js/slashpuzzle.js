define(["square","controller_helper"], function() {

slashPuzzleType = function(puzzleData, controls, settings) {
  squarePuzzle.call(this, puzzleData, controls, settings);
}

Object.setPrototypeOf(slashPuzzleType.prototype, squarePuzzle.prototype);

slashPuzzleType.prototype.setTypeProperties = function(typeCode) {
  var self = this;

  if (typeCode=="slalom") {
    this.typeProperties = decribePuzzleType()
      .add(controller().forAuthor().node().chooser()
        .addNumbers(0,4,StdColor.BLACK))
      .add(controller().forSolver().node().dragEnabled())
      .add(controller().forSolver().cell().clickSwitch()
        .addItem(StdItem.SLASH)
        .addItem(StdItem.BACKSLASH))
      .build(this);

  } else if (typeCode=="slash_pack") {
    var letters = self.dimensionExtra;
    this.typeProperties = decribePuzzleType()
      .add(controller().forAuthor().cell().chooser()
        .addLetters(letters))
      .add(controller().forSolver().node().dragEnabled())
      .add(controller().forSolver().cell().noClue().clickSwitch()
        .addItem(StdItem.SLASH)
        .addItem(StdItem.BACKSLASH))
      .build(this);

  // 24 hours drawings
  } else if (typeCode=="half_cut") {
    var letters = self.dimensionExtra;
    this.typeProperties = decribePuzzleType().edgeStyle(false, false)
      .add(controller().forAuthor().edge().clickSwitch().withDrag()
        .addItem(StdItem.BLACK))
      .add(controller().forAuthor().node().dragEnabled())
      .add(controller().forAuthor().cell().noClue().clickSwitch()
        .addItem(StdItem.SLASH)
        .addItem(StdItem.BACKSLASH))
      .add(controller().forSolver().edge().clickSwitch().withDrag()
        .addItem(StdItem.BLACK))
      .add(controller().forSolver().node().dragEnabled())
      .add(controller().forSolver().cell().noClue().clickSwitch()
        .addItem(StdItem.SLASH)
        .addItem(StdItem.BACKSLASH))
      .build(this);
  }
}

squarePuzzleCell.prototype.switchToSlash = function(slashType) {
  if (this.clickSwitch) {
    if (this.getValue() == slashType) {
      this.switchToData(this.clickSwitch[0], false);
      return true;
    } else {
      for (var i=0; i<this.clickSwitch.length; i++){
        if (this.clickSwitch[i].returnValue == slashType) {
          this.switchToData(this.clickSwitch[i], false);
          return true;
        }
      }
    }
  }
  return false;
}

squarePuzzleNode.prototype.processDragEnd = function(startElement) {
  if (startElement.constructor.name != this.constructor.name) {
    return false;
  }
  var commonSlashCell = this.commonSlashCell(startElement);
  if (commonSlashCell) {
    return commonSlashCell.switchToSlash("/");
  }
  var commonBackslashCell = this.commonBackslashCell(startElement);
  if (commonBackslashCell) {
    return commonBackslashCell.switchToSlash("\\");
  }
  return false;
}

squarePuzzleNode.prototype.processDragMove = function(startElement) {
  if (!this.processDragEnd(startElement)) {
    return false;
  }
  return {newMouseStartElement: this};
}

squarePuzzleNode.prototype.commonSlashCell = function(otherNode) {
  if (this == otherNode) {
    return null;
  }
  var thisPosition = this.position();
  var otherPosition = otherNode.position();
  if (thisPosition.col == otherPosition.col - 1 && thisPosition.row == otherPosition.row + 1 ) {
    return this.puzzle.cells[thisPosition.row][otherPosition.col]
  }
  if (thisPosition.col == otherPosition.col + 1 && thisPosition.row == otherPosition.row - 1 ) {
    return this.puzzle.cells[otherPosition.row][thisPosition.col]
  }
}

squarePuzzleNode.prototype.commonBackslashCell = function(otherNode) {
  if (this == otherNode) {
    return null;
  }
  var thisPosition = this.position();
  var otherPosition = otherNode.position();
  if (thisPosition.col == otherPosition.col - 1 && thisPosition.row == otherPosition.row - 1 ) {
    return this.puzzle.cells[otherPosition.row][otherPosition.col]
  }
  if (thisPosition.col == otherPosition.col + 1 && thisPosition.row == otherPosition.row + 1 ) {
    return this.puzzle.cells[thisPosition.row][thisPosition.col]
  }
}

})
