define(["hexa","controller_helper"], function() {

hexaPuzzleType = function(puzzleData, controls, settings) {
  hexaPuzzle.call(this, puzzleData, controls, settings);
}

Object.setPrototypeOf(hexaPuzzleType.prototype, hexaPuzzle.prototype);

hexaPuzzleType.prototype.setTypeProperties = function(typeCode){
  var self = this;

  if (typeCode =="hexa_minesweeper") {
    this.typeProperties = decribePuzzleType()
      .add(controller().forAuthor().cell().chooser()
        .addNumbers(0,6))
      .add(controller().forSolver().cell().noClue().clickSwitch()
        .addItem(StdItem.MINE.submitAs("1"))
        .addItem(StdItem.CROSS.doNotSubmit()))
      .add(controller().forSolver().cell().clue().clickSwitch()
        .addItem(StdItem.WHITE_CIRCLE.doNotSubmit()))
      .add(controller().forSolver().cell().noClue().copyPaste())
      .build(this);

  } else if (typeCode =="hexa_paint") {
    this.typeProperties = decribePuzzleType()
      .add(controller().forAuthor().cell().chooser()
        .addNumbers(0,7))
      .add(controller().forSolver().cell().clickSwitch()
        .addItem(StdItem.BRIGHT.submitAs("1"))
        .addItem(StdItem.WHITE_CIRCLE.doNotSubmit()))
      .add(controller().forSolver().cell().copyPaste((fromData, toData) => {return {text: toData.text, color: fromData.color, textColor: fromData.textColor, image: fromData.image}}))
      .build(this);

  } else if (typeCode =="hexa_islands") {
    this.typeProperties = decribePuzzleType()
      .add(controller().forAuthor().cell().clickSwitch()
        .addItem(StdItem.CLUE_COLOR.submitAs("1")))
      .add(controller().forSolver().cell().noClue().clickSwitch()
        .addItem(StdItem.BLACK.submitAs("1"))
        .addItem(StdItem.CROSS.doNotSubmit()))
      .add(controller().forSolver().cell().clue().copy())
      .add(controller().forSolver().cell().noClue().copyPaste(data => data.color==self.colorSchema.clueColor?{color:self.colorSchema.gridColor}:data ))
      .build(this);

  } else if (typeCode =="hexa_fence") {
    this.typeProperties = decribePuzzleType().edgeStyle(false, true)
      .add(controller().forAuthor().cell().chooser()
        .addNumbers(0,6))
      .add(controller().forSolver().cell().clickSwitch()
        .addItem(StdItem.CROSS.doNotSubmit())
        .addItem(StdItem.WHITE_CIRCLE.doNotSubmit()))
      .add(controller().forSolver().edge().clickSwitch()
        .addItem(StdItem.LINE.submitAs("1"))
        .addItem(StdItem.CROSS.doNotSubmit()))
      .add(controller().forSolver().edge().drag()
        .addItem(StdItem.LINE.submitAs("1")))
      .build(this);

  }
}
})
