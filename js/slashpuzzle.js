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
        .addNumbers(0,4,StdColor.BLACK)))
      .add(controller().forSolver().cell().clickSwitch()
        .addItem(StdItem.SLASH)
        .addItem(StdItem.BACKSLASH))
      .build(this);
  }
}
