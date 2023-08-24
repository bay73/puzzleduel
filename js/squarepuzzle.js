define(["square","controller_helper"], function() {

squarePuzzleType = function(puzzleData, controls, settings) {
  squarePuzzle.call(this, puzzleData, controls, settings);
}

Object.setPrototypeOf(squarePuzzleType.prototype, squarePuzzle.prototype);

snailPuzzleType = function(puzzleData, controls, settings) {
  squarePuzzleType.call(this, puzzleData, controls, settings);
}

Object.setPrototypeOf(snailPuzzleType.prototype, squarePuzzleType.prototype);

squarePuzzleType.prototype.setTypeProperties = function(typeCode) {
  var self = this;

  if (typeCode =="hitori") {
    this.typeProperties = decribePuzzleType()
      .add(controller().forAuthor().cell().chooser()
        .addNumbers(0,16))
      .add(controller().forSolver().cell().clickSwitch()
        .addItem(StdItem.BLACK.submitAs("1"))
        .addItem(StdItem.WHITE_CIRCLE.doNotSubmit()))
      .build(this);
  // Snakes
  } else if (typeCode=="snake_dutch") {
    this.typeProperties = decribePuzzleType()
      .add(controller().forAuthor().cell().clickSwitch()
        .addItem(StdItem.WHITE_CIRCLE)
        .addItem(StdItem.BLACK_CIRCLE)
        .addItem(StdItem.CROSS))
      .add(controller().forSolver().cell().noClue().clickSwitch()
        .addItem(StdItem.GREY.submitAs("1"))
        .addItem(StdItem.CROSS.doNotSubmit()))
      .add(controller().forSolver().cell().clue(StdItem.WHITE_CIRCLE, StdItem.BLACK_CIRCLE).clickSwitch()
        .addItem(StdItem.GREY.submitAs("1")))
      .build(this);

  } else if (typeCode=="snake_simple") {
    var maxValue = Math.max(this.rows, this.cols);
    this.typeProperties = decribePuzzleType()
      .useOuterCells(StdOuter.RIGHT | StdOuter.BOTTOM)
      .add(controller().forAuthor().cell().inner().clickSwitch()
        .addItem(StdItem.CROSS)
        .addItem(StdItem.CLUE_COLOR))
      .add(controller().forAuthor().cell().outer().chooser()
        .addNumbers(0,maxValue))
      .add(controller().forSolver().cell().inner().noClue().clickSwitch()
        .addItem(StdItem.GREY.submitAs("black"))
        .addItem(StdItem.CROSS.doNotSubmit()))
      .add(controller().forSolver().cell().outer().clue().clickSwitch()
        .addItem(StdItem.WHITE_CIRCLE.doNotSubmit()))
      .add(controller().forSolver().cell().inner().noClue().copyPaste((data) => data.color==self.colorSchema.clueColor?{color:self.colorSchema.greyColor}:data ))
      .add(controller().forSolver().cell().inner().clue().copy())
      .addUpgradeClue(clue=>clue=="white"?null:clue)
      .build(this);

  } else if (typeCode=="snake_max") {
    var maxValue = Math.max(this.rows, this.cols);
    this.typeProperties = decribePuzzleType()
      .useOuterCells(StdOuter.RIGHT | StdOuter.BOTTOM)
      .add(controller().forAuthor().cell().inner().clickSwitch()
        .addItem(StdItem.CROSS)
        .addItem(StdItem.CLUE_COLOR))
      .add(controller().forAuthor().cell().outer().chooser()
        .addNumbers(0,maxValue))
      .add(controller().forSolver().cell().inner().noClue().clickSwitch()
        .addItem(StdItem.GREY.submitAs("black"))
        .addItem(StdItem.CROSS.doNotSubmit()))
      .add(controller().forSolver().cell().outer().clue().clickSwitch()
        .addItem(StdItem.WHITE_CIRCLE.doNotSubmit()))
      .add(controller().forSolver().cell().inner().noClue().copyPaste((data) => data.color==self.colorSchema.clueColor?{color:self.colorSchema.greyColor}:data ))
      .add(controller().forSolver().cell().inner().clue().copy())
      .addUpgradeClue(clue=>clue=="white"?null:clue)
      .build(this);

  // With areas
  } else if (typeCode=="heyawake") {
    this.typeProperties = decribePuzzleType()
      .add(controller().forAuthor().cell().chooser()
        .addItem(StdItem.CROSS)
        .addNumbers(0,20))
      .add(controller().forAuthor().edge().toAreas().clickSwitch().withDrag()
        .addItem(StdItem.BLACK.asAreaBorder()))
      .add(controller().forSolver().cell().noClue(StdItem.CROSS).clickSwitch()
        .addItem(StdItem.GREY.submitAs("1"))
        .addItem(StdItem.CROSS.doNotSubmit()))
      .add(controller().forSolver().cell().clue().copy())
      .add(controller().forSolver().cell().noClue().copyPaste((data) => {return {image: data.image, color: data.color};}))
     .build(this);

  } else if (typeCode=="starbattle") {
    this.typeProperties = decribePuzzleType()
      .add(controller().forAuthor().cell().clickSwitch()
        .addItem(StdItem.CROSS))
      .add(controller().forAuthor().edge().toAreas().clickSwitch().withDrag()
        .addItem(StdItem.BLACK.asAreaBorder()))
      .add(controller().forSolver().cell().noClue().clickSwitch()
        .addItem(StdItem.STAR)
        .addItem(StdItem.CROSS.doNotSubmit()))
      .add(controller().forSolver().cell().clue().copy())
      .add(controller().forSolver().cell().noClue().copyPaste())
     .build(this);

  } else if (typeCode=="starbattle_smallregions") {
    this.typeProperties = decribePuzzleType()
      .add(controller().forAuthor().cell().clickSwitch()
        .addItem(StdItem.CROSS))
      .add(controller().forAuthor().edge().toAreas().clickSwitch().withDrag()
        .addItem(StdItem.BLACK.asAreaBorder()))
      .add(controller().forSolver().cell().noClue().clickSwitch()
        .addItem(StdItem.STAR)
        .addItem(StdItem.CROSS.doNotSubmit()))
      .add(controller().forSolver().cell().clue().copy())
      .add(controller().forSolver().cell().noClue().copyPaste())
     .build(this);

  } else if (typeCode=="suguru") {
    this.typeProperties = decribePuzzleType()
      .add(controller().forAuthor().cell().chooser()
        .addNumbers(1,6))
      .add(controller().forAuthor().edge().toAreas().clickSwitch().withDrag()
        .addItem(StdItem.BLACK.asAreaBorder()))
      .add(controller().forSolver().cell().noClue().chooser()
        .addNumbers(1,6))
     .build(this);

  } else if (typeCode=="nanro") {
    this.typeProperties = decribePuzzleType()
      .add(controller().forAuthor().cell().chooser()
        .addNumbers(1,9))
      .add(controller().forAuthor().edge().toAreas().clickSwitch().withDrag()
        .addItem(StdItem.BLACK.asAreaBorder()))
      .add(controller().forSolver().cell().noClue().chooser()
        .addNumbers(1,9)
        .addItem(StdItem.WHITE_CIRCLE.doNotSubmit())
        .addItem(StdItem.CROSS.doNotSubmit()))
     .build(this);

  } else if (typeCode=="lits") {
    this.typeProperties = decribePuzzleType()
      .add(controller().forAuthor().cell().clickSwitch()
        .addItem(StdItem.CROSS))
      .add(controller().forAuthor().edge().toAreas().clickSwitch().withDrag()
        .addItem(StdItem.BLACK.asAreaBorder()))
      .add(controller().forSolver().cell().noClue().clickSwitch()
        .addItem(StdItem.GREY.submitAs("1"))
        .addItem(StdItem.CROSS.doNotSubmit()))
      .add(controller().forSolver().cell().clue().copy())
      .add(controller().forSolver().cell().noClue().copyPaste())
     .build(this);

  } else if (typeCode=="norinori") {
    this.typeProperties = decribePuzzleType()
      .add(controller().forAuthor().edge().toAreas().clickSwitch().withDrag()
        .addItem(StdItem.BLACK.asAreaBorder()))
      .add(controller().forSolver().cell().noClue().clickSwitch()
        .addItem(StdItem.GREY.submitAs("1"))
        .addItem(StdItem.CROSS.doNotSubmit()))
      .add(controller().forSolver().cell().clue().copy())
      .add(controller().forSolver().cell().noClue().copyPaste())
     .build(this);

  // Objects
  } else if (typeCode=="akari") {
    this.typeProperties = decribePuzzleType()
      .add(controller().forAuthor().cell().clickSwitch()
        .addItem(StdItem.BLACK)
        .addNumbers(0,4,StdColor.BLACK))
      .add(controller().forSolver().cell().noClue().clickSwitch()
        .addItem(StdItem.BULB)
        .addItem(StdItem.CROSS.doNotSubmit()))
      .add(controller().forSolver().cell().clue().clickSwitch()
        .addItem(StdItem.WHITE_CROSS.doNotSubmit()))
      .add(controller().forSolver().connector().drag()
        .addItem(StdItem.LINE.doNotSubmit()))
      .addUpgradeClue(clue=>{if (clue.includes("_shade")){return clue.substring(0,1);} else {return clue;}})
      .build(this);

  } else if (typeCode=="minesweeper_classic") {
    this.typeProperties = decribePuzzleType()
      .add(controller().forAuthor().cell().chooser()
        .addItem(StdItem.CROSS)
        .addNumbers(0,8))
      .add(controller().forSolver().cell().noClue().clickSwitch()
        .addItem(StdItem.MINE)
        .addItem(StdItem.CROSS.doNotSubmit()))
      .add(controller().forSolver().cell().clue().copy())
      .add(controller().forSolver().cell().inner().noClue().copyPaste((data) => data.text?{image: "cross"}:data))
      .add(controller().forSolver().cell().clue().noClue(StdItem.CROSS).clickSwitch()
        .addItem(StdItem.WHITE_CIRCLE.doNotSubmit()))
      .build(this);

  } else if (typeCode=="lighthouses") {
    this.typeProperties = decribePuzzleType()
      .add(controller().forAuthor().cell().chooser()
        .addItem(StdItem.CROSS)
        .addNumbers(0,10))
      .add(controller().forSolver().cell().noClue().clickSwitch()
        .addItem(StdItem.BOAT)
        .addItem(StdItem.CROSS.doNotSubmit()))
      .add(controller().forSolver().cell().clue().copy())
      .add(controller().forSolver().cell().inner().noClue().copyPaste((data) => data.text?{image: "cross"}:data))
      .add(controller().forSolver().cell().clue().clickSwitch()
        .addItem(StdItem.WHITE_CIRCLE.doNotSubmit()))
      .build(this);

  } else if (typeCode=="queens") {
    this.typeProperties = decribePuzzleType()
      .add(controller().forAuthor().cell().chooser()
        .addItem(StdItem.CROSS)
        .addNumbers(0,8))
      .add(controller().forSolver().cell().noClue().clickSwitch()
        .addItem(StdItem.QUEEN)
        .addItem(StdItem.CROSS.doNotSubmit()))
      .add(controller().forSolver().cell().clue().copy())
      .add(controller().forSolver().cell().inner().noClue().copyPaste((data) => data.text?{image: "cross"}:data))
      .add(controller().forSolver().cell().clue().noClue(StdItem.CROSS).clickSwitch()
        .addItem(StdItem.WHITE_CIRCLE.doNotSubmit()))
      .build(this);

  } else if (typeCode=="point_a_star") {
    var maxValue = (Math.max(this.rows, this.cols)+1)/2;
    this.typeProperties = decribePuzzleType()
      .useOuterCells(StdOuter.RIGHT | StdOuter.BOTTOM)
      .add(controller().forAuthor().cell().inner().chooser()
        .addItem(StdItem.ARROW_U)
        .addItem(StdItem.ARROW_UR)
        .addItem(StdItem.ARROW_R)
        .addItem(StdItem.ARROW_DR)
        .addItem(StdItem.ARROW_D)
        .addItem(StdItem.ARROW_DL)
        .addItem(StdItem.ARROW_L)
        .addItem(StdItem.ARROW_UL)
        .addItem(StdItem.CROSS))
      .add(controller().forAuthor().cell().outer().chooser()
        .addNumbers(0,maxValue))
      .add(controller().forSolver().cell().inner().noClue().clickSwitch()
        .addItem(StdItem.STAR)
        .addItem(StdItem.CROSS.doNotSubmit()))
      .add(controller().forSolver().cell().inner().clue().clickSwitch()
        .addItem(StdItem.GREY.doNotSubmit()))
      .add(controller().forSolver().cell().outer().clue().clickSwitch()
        .addItem(StdItem.WHITE_CIRCLE.doNotSubmit()))
      .addUpgradeClue(clue=>clue=="white"?null:clue)
      .add(controller().forSolver().cell().inner().clue().copy())
      .add(controller().forSolver().cell().inner().noClue().copyPaste((data) => (data.image&&data.image!="star")?{image: "cross"}:data))
      .build(this);

  } else if (typeCode=="gaps") {
    var maxValue = this.rows-2;
    this.typeProperties = decribePuzzleType()
      .useOuterCells(StdOuter.RIGHT | StdOuter.BOTTOM)
      .add(controller().forAuthor().cell().inner().clickSwitch()
        .addItem(StdItem.CROSS)
        .addItem(StdItem.WHITE_CIRCLE))
      .add(controller().forAuthor().cell().outer().chooser()
        .addNumbers(0,maxValue))
      .add(controller().forSolver().cell().inner().noClue().clickSwitch()
        .addItem(StdItem.WHITE_CIRCLE)
        .addItem(StdItem.CROSS.doNotSubmit()))
      .add(controller().forSolver().cell().outer().clue().clickSwitch()
        .addItem(StdItem.WHITE_CIRCLE.doNotSubmit()))
      .add(controller().forSolver().cell().inner().noClue().copyPaste())
      .add(controller().forSolver().cell().inner().clue().copy())
      .addUpgradeClue(clue=>clue=="white"?null:clue)
      .build(this);

  // Paint
  } else if (typeCode=="clouds") {
    var maxValue = Math.max(this.rows, this.cols);
    this.typeProperties = decribePuzzleType()
      .useOuterCells(StdOuter.RIGHT | StdOuter.BOTTOM)
      .add(controller().forAuthor().cell().inner().clickSwitch()
        .addItem(StdItem.CROSS)
        .addItem(StdItem.BLACK))
      .add(controller().forAuthor().cell().outer().chooser()
        .addNumbers(0,maxValue))
      .add(controller().forSolver().cell().inner().noClue().clickSwitch()
        .addItem(StdItem.BLACK)
        .addItem(StdItem.CROSS.doNotSubmit()))
      .add(controller().forSolver().cell().outer().clue().clickSwitch()
        .addItem(StdItem.WHITE_CIRCLE.doNotSubmit()))
      .add(controller().forSolver().cell().inner().noClue().copyPaste())
      .add(controller().forSolver().cell().inner().clue().copy())
      .addUpgradeClue(clue=>clue=="white"?null:clue)
      .build(this);

  } else if (typeCode=="battleships") {
    var maxValue = Math.max(this.rows, this.cols);
    this.typeProperties = decribePuzzleType()
      .useOuterCells(StdOuter.RIGHT | StdOuter.BOTTOM)
      .add(controller().forAuthor().cell().inner().clickSwitch()
        .addItem(StdItem.WAVE))
      .add(controller().forAuthor().cell().outer().chooser()
        .addNumbers(0,maxValue))
      .add(controller().forSolver().cell().inner().noClue().clickSwitch()
        .addItem(StdItem.GREY.submitAs('1'))
        .addItem(StdItem.WAVE.doNotSubmit()))
      .add(controller().forSolver().cell().outer().clue().clickSwitch()
        .addItem(StdItem.WHITE_CIRCLE.doNotSubmit()))
      .add(controller().forSolver().cell().inner().noClue().copyPaste())
      .add(controller().forSolver().cell().inner().clue().copy())
      .addUpgradeClue(clue=>clue=="white"?null:clue)
      .build(this);

  } else if (typeCode=="battleships_minesweeper") {
    this.typeProperties = decribePuzzleType()
      .add(controller().forAuthor().cell().chooser()
        .addItem(StdItem.WAVE)
        .addNumbers(0,8))
      .add(controller().forSolver().cell().noClue().clickSwitch()
        .addItem(StdItem.GREY.submitAs('1'))
        .addItem(StdItem.WAVE.doNotSubmit()))
      .add(controller().forSolver().cell().clue().copy())
      .add(controller().forSolver().cell().inner().noClue().copyPaste((data) => data.text?{image: "wave"}:data))
      .add(controller().forSolver().cell().clue().clickSwitch()
        .addItem(StdItem.WHITE_CIRCLE.doNotSubmit()))
      .build(this);

  } else if (typeCode=="battleships_knight") {
    this.typeProperties = decribePuzzleType()
      .add(controller().forAuthor().cell().chooser()
        .addItem(StdItem.WAVE)
        .addNumbers(0,8))
      .add(controller().forSolver().cell().noClue().clickSwitch()
        .addItem(StdItem.GREY.submitAs('1'))
        .addItem(StdItem.WAVE.doNotSubmit()))
      .add(controller().forSolver().cell().clue().copy())
      .add(controller().forSolver().cell().inner().noClue().copyPaste((data) => data.text?{image: "wave"}:data))
      .add(controller().forSolver().cell().clue().clickSwitch()
        .addItem(StdItem.WHITE_CIRCLE.doNotSubmit()))
      .build(this);

  } else if (typeCode=="pentomino") {
    var maxValue = Math.max(this.rows, this.cols);
    this.typeProperties = decribePuzzleType()
      .useOuterCells(StdOuter.RIGHT | StdOuter.BOTTOM)
      .add(controller().forAuthor().cell().inner().clickSwitch()
        .addItem(StdItem.CROSS))
      .add(controller().forAuthor().cell().outer().chooser()
        .addNumbers(0,maxValue))
      .add(controller().forSolver().cell().inner().noClue().clickSwitch()
        .addItem(StdItem.GREY.submitAs("1"))
        .addItem(StdItem.CROSS.doNotSubmit()))
      .add(controller().forSolver().cell().outer().clue().clickSwitch()
        .addItem(StdItem.WHITE_CIRCLE.doNotSubmit()))
      .add(controller().forSolver().cell().inner().noClue().copyPaste())
      .add(controller().forSolver().cell().inner().clue().copy())
      .addUpgradeClue(clue=>clue=="white"?null:clue)
      .build(this);

  } else if (typeCode=="pentomino_hungarian") {
    this.typeProperties = decribePuzzleType()
      .add(controller().forAuthor().cell().inner().clickSwitch()
        .addItem(StdItem.CLUE_COLOR.submitAs("1"))
        .addItem(StdItem.CROSS))
      .add(controller().forSolver().cell().inner().noClue().clickSwitch()
        .addItem(StdItem.GREY.submitAs("1"))
        .addItem(StdItem.CROSS.doNotSubmit()))
      .add(controller().forSolver().cell().inner().noClue().copyPaste((data) => data.color==self.colorSchema.clueColor?{color:self.colorSchema.greyColor}:data ))
      .add(controller().forSolver().cell().inner().clue().copy())
      .build(this);

  } else if (typeCode=="pentomino_touch") {
    this.typeProperties = decribePuzzleType()
      .add(controller().forAuthor().cell().inner().clickSwitch()
        .addItem(StdItem.CROSS))
      .add(controller().forAuthor().node().inner().clickSwitch()
        .addItem(StdItem.BATTENBERG.submitAs("1")))
      .add(controller().forSolver().cell().inner().noClue().clickSwitch()
        .addItem(StdItem.GREY.submitAs("1"))
        .addItem(StdItem.CROSS.doNotSubmit()))
      .add(controller().forSolver().cell().inner().noClue().copyPaste())
      .add(controller().forSolver().cell().inner().clue().copy())
      .build(this);

  } else if (typeCode=="yin_yang_classic") {
    this.typeProperties = decribePuzzleType()
      .add(controller().forAuthor().cell().clickSwitch()
        .addItem(StdItem.BLACK_CIRCLE)
        .addItem(StdItem.WHITE_CIRCLE))
      .add(controller().forSolver().cell().noClue().clickSwitch()
        .addItem(StdItem.BLACK_CIRCLE)
        .addItem(StdItem.WHITE_CIRCLE))
      .add(controller().forSolver().cell().noClue().copyPaste())
      .add(controller().forSolver().cell().clue().copy())
      .build(this);

  } else if (typeCode=="easy_as_coral") {
    var maxValue = Math.max(this.rows, this.cols);
    this.typeProperties = decribePuzzleType()
      .useOuterCells(StdOuter.LEFT | StdOuter.RIGHT | StdOuter.TOP | StdOuter.BOTTOM)
      .add(controller().forAuthor().cell().inner().clickSwitch()
        .addItem(StdItem.CROSS)
        .addItem(StdItem.BLACK))
      .add(controller().forAuthor().cell().outer().chooser()
        .addNumbers(1,maxValue))
      .add(controller().forSolver().cell().inner().noClue().clickSwitch()
        .addItem(StdItem.BLACK)
        .addItem(StdItem.CROSS.doNotSubmit()))
      .add(controller().forSolver().cell().outer().clue().clickSwitch()
        .addItem(StdItem.WHITE_CIRCLE.doNotSubmit()))
      .add(controller().forSolver().cell().inner().noClue().copyPaste())
      .add(controller().forSolver().cell().inner().clue().copy())
      .addUpgradeClue(clue=>clue=="white"?null:clue)
      .build(this);

  } else if (typeCode=="tapa_classic") {
    this.typeProperties = decribePuzzleType()
      .add(controller().forAuthor().cell().chooser()
        .addItem(controllerItem({image: "0", returnValue: "0"}))
        .addItem(controllerItem({image: "1", returnValue: "1"}))
        .addItem(controllerItem({image: "2", returnValue: "2"}))
        .addItem(controllerItem({image: "3", returnValue: "3"}))
        .addItem(controllerItem({image: "4", returnValue: "4"}))
        .addItem(controllerItem({image: "5", returnValue: "5"}))
        .addItem(controllerItem({image: "6", returnValue: "6"}))
        .addItem(controllerItem({image: "7", returnValue: "7"}))
        .addItem(controllerItem({image: "8", returnValue: "8"}))
        .addItem(controllerItem({image: "1_1", returnValue: "1_1"}))
        .addItem(controllerItem({image: "1_2", returnValue: "1_2"}))
        .addItem(controllerItem({image: "1_3", returnValue: "1_3"}))
        .addItem(controllerItem({image: "1_4", returnValue: "1_4"}))
        .addItem(controllerItem({image: "1_5", returnValue: "1_5"}))
        .addItem(controllerItem({image: "2_2", returnValue: "2_2"}))
        .addItem(controllerItem({image: "2_3", returnValue: "2_3"}))
        .addItem(controllerItem({image: "2_4", returnValue: "2_4"}))
        .addItem(controllerItem({image: "3_3", returnValue: "3_3"}))
        .addItem(controllerItem({image: "1_1_1", returnValue: "1_1_1"}))
        .addItem(controllerItem({image: "1_1_2", returnValue: "1_1_2"}))
        .addItem(controllerItem({image: "1_1_3", returnValue: "1_1_3"}))
        .addItem(controllerItem({image: "1_2_2", returnValue: "1_2_2"}))
        .addItem(controllerItem({image: "1_1_1_1", returnValue: "1_1_1_1"})))
      .add(controller().forSolver().cell().noClue().clickSwitch()
        .addItem(StdItem.BLACK)
        .addItem(StdItem.CROSS.doNotSubmit()))
      .add(controller().forSolver().cell().inner().noClue().copyPaste((data) => data.image?{image: "cross"}:data))
      .add(controller().forSolver().cell().inner().clue().copy())
      .build(this);

  } else if (typeCode=="paint_by_max") {
    var maxValue = Math.max(this.rows, this.cols);
    this.typeProperties = decribePuzzleType()
      .useOuterCells(StdOuter.LEFT | StdOuter.RIGHT | StdOuter.TOP | StdOuter.BOTTOM)
      .useOuterColors(StdOuter.LEFT | StdOuter.TOP, StdColor.DARK_OUTER)
      .useOuterColors(StdOuter.RIGHT | StdOuter.BOTTOM, StdColor.OUTER)
      .add(controller().forAuthor().cell().outer().chooser()
        .addNumbers(1,maxValue))
      .add(controller().forSolver().cell().inner().noClue().clickSwitch()
        .addItem(StdItem.BLACK)
        .addItem(StdItem.BRIGHT.submitAs('grey')))
      .add(controller().forSolver().cell().outer().clue().clickSwitch()
        .addItem(StdItem.WHITE_CIRCLE.doNotSubmit()))
      .add(controller().forSolver().cell().inner().noClue().copyPaste())
      .addUpgradeClue(clue=>clue=="white"?null:clue)
      .build(this);

  // Letters and numbers
  } else if (typeCode=="easy_as_abc") {
    var letters = self.dimensionExtra;
    this.typeProperties = decribePuzzleType()
      .useOuterCells(StdOuter.LEFT | StdOuter.RIGHT | StdOuter.TOP | StdOuter.BOTTOM)
      .add(controller().forAuthor().cell().inner().clickSwitch()
        .addItem(StdItem.CROSS))
      .add(controller().forAuthor().cell().outer().chooser()
        .addLetters(letters))
      .add(controller().forSolver().cell().inner().noClue().chooser()
        .addLetters(letters)
        .addItem(StdItem.WHITE_CIRCLE.doNotSubmit())
        .addItem(StdItem.CROSS.doNotSubmit()))
      .add(controller().forSolver().cell().outer().clue().clickSwitch()
        .addItem(StdItem.WHITE_CIRCLE.doNotSubmit()))
      .addUpgradeClue(clue=>clue=="white"?null:clue)
      .build(this);

  } else if (typeCode=="fuzuli") {
    var maxValue = Math.max(this.rows, this.cols) - 2;
    this.typeProperties = decribePuzzleType()
      .add(controller().forAuthor().cell().inner().chooser()
        .addNumbers(1, maxValue)
        .addItem(StdItem.CROSS))
      .add(controller().forSolver().cell().inner().noClue().chooser()
        .addNumbers(1, maxValue)
        .addItem(StdItem.WHITE_CIRCLE.doNotSubmit())
        .addItem(StdItem.CROSS.doNotSubmit()))
      .addUpgradeClue(clue=>clue=="white"?null:clue)
      .build(this);

  } else if (typeCode=="doubleblock") {
    var maxValue = Math.max(this.rows, this.cols) - 2;
    this.typeProperties = decribePuzzleType()
      .useOuterCells(StdOuter.RIGHT | StdOuter.BOTTOM)
      .add(controller().forAuthor().cell().inner().clickSwitch()
        .addNumbers(1, maxValue)
        .addItem(StdItem.CROSS))
      .add(controller().forAuthor().cell().outer().chooser()
        .addNumbers(0, maxValue*(maxValue+1)/2))
      .add(controller().forSolver().cell().inner().noClue().chooser()
        .addNumbers(1, maxValue)
        .addItem(StdItem.WHITE_CIRCLE.doNotSubmit())
        .addItem(StdItem.CROSS.doNotSubmit()))
      .add(controller().forSolver().cell().outer().clue().clickSwitch()
        .addItem(StdItem.WHITE_CIRCLE.doNotSubmit()))
      .addUpgradeClue(clue=>clue=="white"?null:clue)
      .build(this);

  } else if (typeCode=="skyscrapers") {
    var maxValue = Math.max(this.rows, this.cols);
    this.typeProperties = decribePuzzleType()
      .useOuterCells(StdOuter.LEFT | StdOuter.RIGHT | StdOuter.TOP | StdOuter.BOTTOM)
      .add(controller().forAuthor().cell().chooser()
        .addNumbers(1, maxValue))
      .add(controller().forSolver().cell().inner().noClue().chooser()
        .addNumbers(1, maxValue))
      .add(controller().forSolver().cell().outer().clue().clickSwitch()
        .addItem(StdItem.WHITE_CIRCLE.doNotSubmit()))
      .addUpgradeClue(clue=>clue=="white"?null:clue)
      .build(this);

  } else if (typeCode=="domino_castle_sum") {
    var letters = self.dimensionExtra;
    this.typeProperties = decribePuzzleType()
      .useOuterCells(StdOuter.RIGHT | StdOuter.BOTTOM)
      .add(controller().forAuthor().cell().outer().chooser()
        .addNumbers(1, 99))
      .add(controller().forAuthor().cell().inner().clickSwitch()
        .addItem(StdItem.BLACK))
      .add(controller().forAuthor().edge().toAreas().clickSwitch().withDrag()
        .addItem(StdItem.BLACK.asAreaBorder()))
      .add(controller().forSolver().cell().inner().noClue().chooser()
        .addLetters(letters))
      .add(controller().forSolver().cell().outer().clue().clickSwitch()
        .addItem(StdItem.WHITE_CIRCLE.doNotSubmit()))
      .build(this);

  } else {

  var typeProperties = {}

  typeProperties["snake_belarusian"] = {
    needNodes: true,
    cellController: cell => {
      setClickSwitch(cell, false, [{},{color: "#606060", returnValue: "1"},{image: "cross"}], [{},{image: "white_circle"},{image: "cross"}]);
      if (cell.isClue && cell.data.image != "cross") {
        setClueClickSwitch(cell, [{},{color: "#605030", returnValue: "1"},{image: "cross"}], [{},{image: "white_circle"},{image: "cross"}]);
      }
    },
    cellEditController: cell => {cell.isClue = true; cell.clickSwitch = [{},{color: "tan", returnValue: "1"}];},
    edgeEditController: edge => {
       if (edge.allCells.length > 1) {
         edge.isClue = true;
         edge.clickSwitch = [{},{color: self.colorSchema.gridColor, returnValue: "1"}];
         edge.dragSwitch        = [{},{color: self.colorSchema.gridColor, returnValue: "1"}];
       }
    },
    nodeEditController: node => node.dragProcessor = true,
    decodeClue: value => {return value=="1"?{color: "tan"}:{} },
    collectAreas: this.editMode,
  }

  typeProperties["sudoku_irregular"] = {
    needNodes: true,
    cellController: cell => {if (!cell.isClue) {setNumberChooser(cell, 1, self.rows);}},
    cellEditController: cell => {cell.isClue = true; setNumberChooser(cell, 1, self.rows);},
    edgeEditController: edge => {
       if (edge.allCells.length > 1) {
         edge.isClue = true;
         edge.clickSwitch = [{},{color: self.colorSchema.gridColor, returnValue: "1"}];
         edge.dragSwitch = [{},{color: self.colorSchema.gridColor, returnValue: "1"}];
       }
    },
    nodeEditController: node => node.dragProcessor = true,
    collectAreas: this.editMode,
    cellMultiPencil: true,
  }

  typeProperties["sudoku_double"] = {
    needNodes: true,
    cellController: cell => {if (!cell.isClue) {setNumberChooser(cell, 1, self.rows/2);}},
    cellEditController: cell => {cell.isClue = true; setNumberChooser(cell, 1, self.rows/2);},
    edgeEditController: edge => {
       if (edge.allCells.length > 1) {
         edge.isClue = true;
         edge.clickSwitch = [{},{color: self.colorSchema.gridColor, returnValue: "1"}];
         edge.dragSwitch = [{},{color: self.colorSchema.gridColor, returnValue: "1"}];
       }
    },
    nodeEditController: node => node.dragProcessor = true,
    collectAreas: this.editMode,
    cellMultiPencil: true,
  }

  typeProperties["chaos"] = {
    needNodes: false,
    cellController: cell => {if (!cell.isClue) {setNumberChooser(cell, 1, 4);}},
    cellEditController: cell => {cell.isClue = true; setNumberChooser(cell, 1, 4);},
    cellMultiPencil: true,
  }

  typeProperties["ripple_effect"] = {
    needNodes: true,
    cellController: cell => {if (!cell.isClue) {setNumberChooser(cell, 1, 6);}},
    cellEditController: cell => {cell.isClue = true; setNumberChooser(cell, 1, 6);},
    edgeEditController: edge => {
       if (edge.allCells.length > 1) {
         edge.isClue = true;
         edge.clickSwitch = [{},{color: self.colorSchema.gridColor, returnValue: "1"}];
         edge.dragSwitch = [{},{color: self.colorSchema.gridColor, returnValue: "1"}];
       }
    },
    nodeEditController: node => node.dragProcessor = true,
    collectAreas: this.editMode,
    cellMultiPencil: true,
  }

  typeProperties["fence"] = {
    thickEdges: true,
    outerEdges: false,
    needNodes: true,
    cellController: cell => setClickSwitch(cell, true, [{},{image: "cross"},{image: "white_circle"}]),
    edgeController: edge => {
      setClickSwitch(edge, false, [{},{color: self.colorSchema.lineColor, returnValue: 1},{image: "cross"}]);
      setDragSwitch(edge, false, [{},{color: self.colorSchema.lineColor}]);
    },
    nodeController: node => node.dragProcessor = true,
    cellEditController: cell => {cell.isClue = true; setNumberChooser(cell, 0, 4);},
  }

  typeProperties["railroad"] = {
    needConnectors: true,
    cellController: cell => {
      cell.dragProcessor = true;
    },
    connectorController: connector => {
      setDragSwitch(connector, false, [{},{color: self.colorSchema.lineColor, returnValue: 1}]);
    },
    cellEditController: cell => {
      cell.isClue = true;
      var chooserValues = [{},{image: "big_plus", returnValue: "+"}];
      for (var i=1; i<=15; i++) {
       chooserValues.push({text: i.toString(), returnValue: i.toString()});
      }
      cell.chooserValues = chooserValues;
    },
    decodeClue: value => {return value=="+"?{image: "big_plus"}:{text: value};},
  }

  typeProperties["loop_minesweeper"] = {
    needConnectors: true,
    cellController: cell => {
      setClickSwitch(cell, false, [{},{image: "cross"},{image: "white_circle"}]);
      cell.dragProcessor = true;
    },
    connectorController: connector => {
      setDragSwitch(connector, false, [{},{color: self.colorSchema.lineColor, returnValue: 1}]);
    },
    cellEditController: cell => {cell.isClue = true; setNumberChooser(cell, 0, 8);},
  }

  typeProperties["loop_bounds"] = {
    needConnectors: true,
    cellController: cell => {
      cell.dragProcessor = true;
    },
    connectorController: connector => {
      setDragSwitch(connector, false, [{},{color: self.colorSchema.lineColor, returnValue: 1}]);
    },
    cellEditController: cell => {cell.isClue = true; setNumberChooser(cell, 0, 99);},
    usePlus10: this.editMode?10:0,
  }

  typeProperties["every_second_turn"] = {
    needConnectors: true,
    cellController: cell => {
      cell.dragProcessor = true;
    },
    connectorController: connector => {
      setDragSwitch(connector, false, [{},{color: self.colorSchema.lineColor, returnValue: 1}]);
    },
    cellEditController: cell => {cell.isClue = true; cell.clickSwitch = [{},{image: "white_circle", returnValue: "white_circle"}];},
    decodeClue: value => {return {image: value} },
  }

  typeProperties["every_second_straight"] = {
    needConnectors: true,
    cellController: cell => {
      cell.dragProcessor = true;
    },
    connectorController: connector => {
      setDragSwitch(connector, false, [{},{color: self.colorSchema.lineColor, returnValue: 1}]);
    },
    cellEditController: cell => {cell.isClue = true; cell.clickSwitch = [{},{image: "white_circle", returnValue: "white_circle"}];},
    decodeClue: value => {return {image: value} },
  }

  typeProperties["passage"] = {
    cellController: cell => {
      setClickSwitch(cell, false, [{},{color: self.colorSchema.greyColor, returnValue: "1"},{image: "cross"}], [{},{color: "#a0a0a0"},{image: "cross"}]);
    },
    cellEditController: cell => {
      cell.isClue = true;
      var chooserValues = [{},{color: self.colorSchema.clueColor, returnValue: "black"},{image: "cross", returnValue: "cross"}];
      for (var i=0; i<=10; i++) {
       chooserValues.push({color: self.colorSchema.greyColor, text: i.toString(), returnValue: i.toString()});
      }
      cell.chooserValues = chooserValues;
    },
    decodeClue: value => {
      if (value=="cross") return {image: "cross"};
      else if (value=="black") return {color: self.colorSchema.clueColor, returnValue: "1"}
      else return {color: self.colorSchema.greyColor, text: value};
    },
  }

  typeProperties["simple_loop"] = {
    needNodes: false,
    needConnectors: true,
    cellController: cell => {
      cell.dragProcessor = true;
    },
    connectorController: connector => {
      setDragSwitch(connector, false, [{},{color: self.colorSchema.textColor, returnValue: 1}]);
    },
    cellEditController: cell => {cell.isClue = true; cell.clickSwitch = [{},{color: self.colorSchema.textColor, returnValue: "black"}];},
    decodeClue: value => {
      if (value=="black") {
        return {color: self.colorSchema.textColor}
      } else {
        return {text: value}
      }
    },
  }

  typeProperties["maxi_loop"] = {
    needNodes: true,
    needConnectors: true,
    cellController: cell => {
      cell.dragProcessor = true;
    },
    connectorController: connector => {
      setDragSwitch(connector, false, [{},{color: self.colorSchema.greyColor, returnValue: 1}]);
    },
    cellEditController: cell => {cell.isClue = true; setNumberChooser(cell, 1, 99);},
    edgeEditController: edge => {
       if (edge.allCells.length > 1) {
         edge.isClue = true;
         edge.clickSwitch = [{},{color: self.colorSchema.gridColor, returnValue: "1"}];
         edge.dragSwitch = [{},{color: self.colorSchema.gridColor, returnValue: "1"}];
       }
    },
    nodeEditController: node => node.dragProcessor = true,
    collectAreas: this.editMode,
    usePlus10: this.editMode?10:0,
  }

  typeProperties["country_road"] = {
    needNodes: true,
    needConnectors: true,
    cellController: cell => {
      setClickSwitch(cell, true, [{},{image: "cross"}]);
      cell.dragProcessor = true;
    },
    connectorController: connector => {
      setDragSwitch(connector, false, [{},{color: self.colorSchema.greyColor, returnValue: 1}]);
    },
    cellEditController: cell => {cell.isClue = true; setNumberChooser(cell, 1, 99);},
    edgeEditController: edge => {
       if (edge.allCells.length > 1) {
         edge.isClue = true;
         edge.clickSwitch = [{},{color: self.colorSchema.gridColor, returnValue: "1"}];
         edge.dragSwitch = [{},{color: self.colorSchema.gridColor, returnValue: "1"}];
       }
    },
    nodeEditController: node => node.dragProcessor = true,
    collectAreas: this.editMode,
    usePlus10: this.editMode?10:0,
  }

  typeProperties["double_back"] = {
    needNodes: true,
    needConnectors: true,
    cellController: cell => {
      cell.dragProcessor = true;
    },
    connectorController: connector => {
      setDragSwitch(connector, false, [{},{color: self.colorSchema.greyColor, returnValue: 1}]);
    },
    edgeEditController: edge => {
       if (edge.allCells.length > 1) {
         edge.isClue = true;
         edge.clickSwitch = [{},{color: self.colorSchema.gridColor, returnValue: "1"}];
         edge.dragSwitch = [{},{color: self.colorSchema.gridColor, returnValue: "1"}];
       }
    },
    nodeEditController: node => node.dragProcessor = true,
    collectAreas: this.editMode,
  }

  typeProperties["four_winds"] = {
    needNodes: false,
    needConnectors: true,
    cellController: cell => {
      cell.dragProcessor = true;
      if (cell.isClue) {
        setClickSwitch(cell, true, [{},{image: "white_circle"}]);
      } else {
        setClickSwitch(cell, false, [{},{image: "white_dot"}]);
      }
    },
    connectorController: connector => {
      setDragSwitch(connector, false, [{},{color: self.colorSchema.greyColor, returnValue: 1}]);
    },
    cellEditController: cell => {cell.isClue = true; setNumberChooser(cell, 1, 99);},
    usePlus10: this.editMode?10:0,
  }

  typeProperties["snake_scope"] = {
    needNodes: true,
    cellController: cell => {
      setClickSwitch(cell, false, [{},{color: self.colorSchema.greyColor, returnValue: "1"},{image: "cross"}], [{},{color: "#a0a0a0"},{image: "cross"}]);
      if (cell.isClue && cell.data.image != "cross") {
        setClueClickSwitch(cell, [{},{color: self.colorSchema.greyColor, returnValue: "1"}], [{},{color: "#a0a0a0"}]);
      }
    },
    cellEditController: cell => {cell.isClue = true; cell.clickSwitch = [{},{image: "cross", returnValue: "cross"}];},
    nodeEditController: node => {
      node.isClue = true;
      var chooserValues = [{}];
      for (var i=0; i<=3; i++) {
        chooserValues.push({color: self.colorSchema.gridColor, text: i.toString(), textColor: "#fff", returnValue: i.toString()});
      }
      node.chooserValues = chooserValues;
    },
    decodeClue: value => {
      if (value=="cross") {
        return {image: "cross"};
      } else {
        return {color: self.colorSchema.gridColor, text: value, textColor: "#fff"};
      }
    },
  }

  typeProperties["product_latin_square"] = {
    needNodes: true,
    cellController: cell => setNumberChooser(cell, 1, self.rows),
    nodeEditController: node => {
      node.isClue = true;
      var chooserValues = [{}];
      for (var i=1; i<=99; i++) {
        chooserValues.push({color: self.colorSchema.gridColor, text: i.toString(), textColor: "#fff", returnValue: i.toString()});
      }
      node.chooserValues = chooserValues;
    },
    decodeClue: value => {
      return {color: self.colorSchema.gridColor, text: value, textColor: "#fff"};
    },
    usePlus10: this.editMode?10:0,
    cellMultiPencil: true,
  }

  typeProperties["paint_battenberg"] = {
    needNodes: true,
    needBottom: true,
    needRight: true,
    cellController: cell => {
      setClickSwitch(cell, false, [{},{color: self.colorSchema.greyColor, returnValue: "black"},{image: "cross"}], [{},{color: "#a0a0a0"},{image: "cross"}]);
    },
    cellEditController: cell => {
      if (cell.outerCell) {
        cell.isClue = true;
        var chooserValues = [{}];
        for (var i=0; i<=Math.max(self.rows, self.cols); i++) {
         chooserValues.push({text: i.toString(), returnValue: i.toString()});
        }
        cell.chooserValues = chooserValues;
      } else {
        cell.isClue = true; cell.clickSwitch = [{},{image: "cross", returnValue: "cross"}];
      }
    },
    nodeEditController: node => {
      node.isClue = true;
      node.clickSwitch = [{}, {image: "battenberg_small", returnValue: "battenberg"}];
    },
    decodeClue: value => {
      if (value=="cross") {
        return {image: "cross"};
      } else if (value=="white") {
        return {};
      } else if (value=="battenberg") {
        return {image: "battenberg_small"};
      } else {
        return {text: value};
      }
    },
  }

  typeProperties["aquarium"] = {
    needNodes: true,
    needBottom: true,
    needRight: true,
    cellController: cell => {
      if (cell.outerCell) {
        setClueClickSwitch(cell, [{},{image: "white_circle"}]);
      } else {
        setClickSwitch(cell, false, [{},{color: self.colorSchema.greyColor, returnValue: "1"},{image: "cross"}], [{},{color: "#a0a0a0"},{image: "cross"}]);
      }
    },
    edgeEditController: edge => {
       if (edge.allCells.length > 1) {
         edge.isClue = true;
         edge.clickSwitch = [{},{color: self.colorSchema.gridColor, returnValue: "1"}];
         edge.dragSwitch = [{},{color: self.colorSchema.gridColor, returnValue: "1"}];
       }
    },
    nodeEditController: node => node.dragProcessor = true,
    cellEditController: cell => {
      if (cell.outerCell) {
        cell.isClue = true;
        var chooserValues = [{}];
        for (var i=0; i<=Math.max(self.rows, self.cols); i++) {
         chooserValues.push({text: i.toString(), returnValue: i.toString()});
        }
        cell.chooserValues = chooserValues;
      } else {
        cell.clickSwitch = [{},{image: "cross", returnValue: "cross"}];
      }
    },
    decodeClue: value => {return value=="cross"?{image: "cross"}:{text: value};},
    collectAreas: this.editMode,
  }

  typeProperties["tetro_scope"] = {
    needNodes: true,
    cellController: cell => {
      setClickSwitch(cell, false, [{},{color: self.colorSchema.greyColor, returnValue: "1"},{image: "cross"}], [{},{color: "#a0a0a0"},{image: "cross"}]);
      if (cell.isClue && cell.data.image != "cross") {
        setClueClickSwitch(cell, [{},{color: self.colorSchema.greyColor, returnValue: "1"}], [{},{color: "#a0a0a0"}]);
      }
    },
    cellEditController: cell => {cell.isClue = true; cell.clickSwitch = [{},{image: "cross", returnValue: "cross"}];},
    nodeEditController: node => {
      node.isClue = true;
      var chooserValues = [{}];
      for (var i=0; i<=4; i++) {
        chooserValues.push({color: self.colorSchema.gridColor, text: i.toString(), textColor: "#fff", returnValue: i.toString()});
      }
      node.chooserValues = chooserValues;
    },
    decodeClue: value => {
      if (value=="cross") {
        return {image: "cross"};
      } else {
        return {color: self.colorSchema.gridColor, text: value, textColor: "#fff"};
      }
    },
  }

  typeProperties["nurikabe"] = {
    cellController: cell => {
      setClickSwitch(cell, false, [{},{color: self.colorSchema.greyColor, returnValue: "black"},{image: "cross"}], [{},{color: "#a0a0a0"},{image: "cross"}]);
      setClueClickSwitch(cell, [{},{image: "cross"}], [{},{image: "cross"}]);
    },
    cellEditController: cell => {
      cell.isClue = true;
      var chooserValues = [{},{image: "cross", returnValue: "cross"}];
      for (var i=1; i<=99; i++) {
       chooserValues.push({text: i.toString(), returnValue: i.toString()});
      }
      cell.chooserValues = chooserValues;
    },
    usePlus10: this.editMode?11:0,
    decodeClue: value => {return value=="cross"?{image: "cross"}:{text: value};},
  }

  typeProperties["cave_classic"] = {
    cellController: cell => {
      setClickSwitch(cell, false, [{},{color: self.colorSchema.greyColor, returnValue: "black"},{image: "cross"}], [{},{color: "#a0a0a0"},{image: "cross"}]);
      setClueClickSwitch(cell, [{},{image: "cross"}], [{},{image: "cross"}]);
    },
    cellEditController: cell => {
      cell.isClue = true;
      var chooserValues = [{},{image: "cross", returnValue: "cross"},{color: self.colorSchema.clueColor, returnValue: "black"}];
      for (var i=1; i<=99; i++) {
       chooserValues.push({text: i.toString(), returnValue: i.toString()});
      }
      cell.chooserValues = chooserValues;
    },
    usePlus10: this.editMode?12:0,
    decodeClue: value => {
      if (value=="cross") {
        return {image: "cross"};
      } else if (value=="black"){
        return {color: self.colorSchema.clueColor};
      } else {
        return {text: value};
      }
    },
  }

  typeProperties["tents_classic"] = {
    needNodes: !this.editMode,
    needBottom: true,
    needRight: true,
    needConnectors: !this.editMode,
    thinConnectors: true,
    connectorController: connector => {
      setDragSwitch(connector, false, [{},{color: self.colorSchema.lineColor}]);
    },
    cellController: cell => {
      cell.dragProcessor = true;
      if (cell.outerCell) {
        setClueClickSwitch(cell, [{},{image: "white_circle"}]);
      } else {
        if (cell.isClue) {
          let image = cell.data.image + "_circle";
          setClueClickSwitch(cell, [{},{image: image}]);
        } else {
          setClickSwitch(cell, false, [{},{image: "tent", returnValue: "1"},{image: "cross"}]);
        }
      }
    },
    cellEditController: cell => {
      if (cell.outerCell) {
        cell.isClue = true;
        var chooserValues = [{}];
        for (var i=0; i<=Math.max(self.rows, self.cols); i++) {
         chooserValues.push({text: i.toString(), returnValue: i.toString()});
        }
        cell.chooserValues = chooserValues;
      } else {
        cell.chooserValues = [{},{image: "tree1", returnValue: "tree1"},{image: "tree2", returnValue: "tree2"},{image: "tree3", returnValue: "tree3"}];
      }
    },
    edgeController: edge => {
      setDragSwitch(edge, false, [{},{color: self.colorSchema.lineColor}]);
    },
    nodeController: node => node.dragProcessor = true,
    decodeClue: value => {
      if (value.startsWith("tree")) {
        return {image: value};
      } else {
        return {text: value};
      }
    },
  }

  typeProperties["arrow_web"] = {
    needNodes: false,
    cellController: cell => {
      setClickSwitch(cell, true, [{},{color: self.colorSchema.gridColor, returnValue: "1"},{color: "#a0a0b0"}], [{},{color: self.colorSchema.greyColor},{color: "#d0d0d0"}]);
    },
    cellEditController: cell => {
      cell.chooserValues = [{},{image: "white_arrow_u", returnValue: "arrow_u"},{image: "white_arrow_ur", returnValue: "arrow_ur"},{image: "white_arrow_r", returnValue: "arrow_r"},{image: "white_arrow_dr", returnValue: "arrow_dr"},{image: "white_arrow_d", returnValue: "arrow_d"},{image: "white_arrow_dl", returnValue: "arrow_dl"},{image: "white_arrow_l", returnValue: "arrow_l"},{image: "white_arrow_ul", returnValue: "arrow_ul"}];
    },
    decodeClue: value => {return {image: "white_" + value}; },
  }

  typeProperties["xo"] = {
    needConnectors: true,
    cellController: cell => setClickSwitch(cell, false, [{},{image: "white_circle", returnValue: "O"},{image: "cross", returnValue: "X"}]),
    connectorController: connector => {
      setDragSwitch(connector, false, [{},{color: self.colorSchema.lineColor, returnValue: 1}]);
    },
    cellEditController: cell => {cell.isClue = true; cell.clickSwitch = [{},{image: "white_circle", returnValue: "O"},{image: "cross", returnValue: "X"},{color: self.colorSchema.gridColor, returnValue: "black"}];},
    decodeClue: value => {
      if (value=="O") return {image: "white_circle"};
      if (value=="X") return {image: "cross"};
      if (value=="black") return {color: self.colorSchema.gridColor};
    },
  }

  typeProperties["shortest_segment"] = {
    needConnectors: true,
    needNodes: false,
    needBottom: true,
    needRight: true,
    cellController: cell => {
      cell.dragProcessor = true;
    },
    edgeController: edge => {
      setClickSwitch(edge, false, [{},{image: "cross"}]);
    },
    connectorController: connector => {
      setDragSwitch(connector, false, [{},{color: self.colorSchema.lineColor, returnValue: 1}]);
    },
    cellEditController: cell => {
      if (cell.outerCell) {
        cell.isClue = true;
        var chooserValues = [{}];
        for (var i=0; i<=Math.max(self.rows-1, self.cols-1); i++) {
          chooserValues.push({text: i.toString(), returnValue: i.toString()});
        }
        cell.chooserValues = chooserValues;
      }
    },
  }

  typeProperties["alternate_loop"] = {
    needConnectors: true,
    cellController: cell => {
      cell.dragProcessor = true;
    },
    connectorController: connector => {
      setDragSwitch(connector, false, [{},{color: self.colorSchema.lineColor, returnValue: 1}]);
    },
    cellEditController: cell => {cell.isClue = true; cell.clickSwitch = [{},{image: "white_circle", returnValue: "white_circle"},{image: "black_circle", returnValue: "black_circle"}];},
    decodeClue: value => {return {image: value} },
  }

  typeProperties["masyu"] = {
    needConnectors: true,
    cellController: cell => {
      cell.dragProcessor = true;
    },
    connectorController: connector => {
      setDragSwitch(connector, false, [{},{color: self.colorSchema.lineColor, returnValue: 1}]);
    },
    cellEditController: cell => {cell.isClue = true; cell.clickSwitch = [{},{image: "white_circle", returnValue: "white_circle"},{image: "black_circle", returnValue: "black_circle"}];},
    decodeClue: value => {return {image: value} },
  }

  typeProperties["russian_loop"] = {
    needConnectors: true,
    cellController: cell => {
      cell.dragProcessor = true;
    },
    connectorController: connector => {
      setDragSwitch(connector, false, [{},{color: self.colorSchema.lineColor, returnValue: 1}]);
    },
    edgeController: edge => {
      setClickSwitch(edge, false, [{},{image: "cross"}]);
    },
    edgeEditController: edge => {
      if (edge.allCells.length > 1 && edge.side%2==1) {
        edge.isClue = true;
        edge.clickSwitch = [{}, {image: "small_circle", returnValue: "dot"}];;
      }
    },
    decodeClue: value => {
      if (value=="dot") {
        return {image: "small_circle"}
      } else {
        return {text: value}
      }
    },
  }

  typeProperties["kropki"] = {
    cellController: cell => {if (!cell.isClue) {setNumberChooser(cell, 1, self.rows);}},
    cellEditController: cell => {cell.isClue = true; setNumberChooser(cell, 1, self.rows);},
    edgeEditController: edge => {
      if (edge.allCells.length > 1) {
        edge.isClue = true;
        edge.clickSwitch = [{}, {image: "white_dot", returnValue: "white"}, {image: "small_circle", returnValue: "black"}];;
      }
    },
    decodeClue: value => {
      if (value=="white") {
        return {image: "white_dot"}
      } else if (value=="black") {
        return {image: "small_circle"}
      } else {
        return {text: value}
      }
    },
    cellMultiPencil: true,
  }

  typeProperties["kuromasu"] = {
    cellController: cell => {
      setClickSwitch(cell, false, [{},{color: "#606060", returnValue: "1"},{image: "cross"}], [{},{color: "#a0a0a0"},{image: "cross"}]);
      setClueClickSwitch(cell, [{},{image: "cross"}], [{},{image: "cross"}]);
    },
    cellEditController: cell => {cell.isClue = true; setNumberChooser(cell, 1, 29);},
    usePlus10: this.editMode?10:0,
  }

  typeProperties["product_kuromasu"] = {
    needNodes: false,
    needBottom: true,
    needRight: true,
    cellController: cell => {
      if (cell.outerCell) {
        setClueClickSwitch(cell, [{},{image: "white_circle"}]);
      } else {
        if (!cell.isClue) {
          var chooserValues = [{}];
          for (var i=0; i<=9; i++) {
            chooserValues.push({text: i.toString(), returnValue: i.toString()});
          }
          chooserValues.push({image: "white_circle"}, {image: "cross"});
          cell.chooserValues = chooserValues;
        }
      }
    },
    cellEditController: cell => {
      if (cell.outerCell) {
        cell.isClue = true; setNumberChooser(cell, 1, 81);
      } else {
        cell.clickSwitch = [{},{image: "cross", returnValue: "cross"}];
      }
    },
    decodeClue: value => {return value=="cross"?{image: "cross"}:{text: value};},
    usePlus10: this.editMode?10:0,
    cellMultiPencil: true,
  }

  typeProperties["no_touch_sums"] = {
    needNodes: false,
    needBottom: true,
    needRight: true,
    cellController: cell => {
      if (cell.outerCell) {
        setClueClickSwitch(cell, [{},{image: "white_circle"}]);
      } else {
        if (!cell.isClue) {
          var chooserValues = [{}];
          for (var i=1; i<=parseInt(self.dimensionExtra); i++) {
            chooserValues.push({text: i.toString(), returnValue: i.toString()});
          }
          chooserValues.push({image: "white_circle"}, {image: "cross"});
          cell.chooserValues = chooserValues;
        }
      }
    },
    cellEditController: cell => {
      if (cell.outerCell) {
        cell.isClue = true; setNumberChooser(cell, 1, 81);
      } else {
        cell.clickSwitch = [{},{image: "cross", returnValue: "cross"}];
      }
    },
    decodeClue: value => {return value=="cross"?{image: "cross"}:{text: value};},
    usePlus10: this.editMode?10:0,
    cellMultiPencil: true,
  }

  typeProperties["top_heavy"] = {
    needNodes: false,
    cellController: cell => {if (!cell.isClue) {
      var chooserValues = [{}];
      for (var i=1; i<=parseInt(self.dimensionExtra); i++) {
        chooserValues.push({text: i.toString(), returnValue: i.toString()});
      }
      chooserValues.push({image: "white_circle"}, {image: "cross"});
      cell.chooserValues = chooserValues;
    }},
    cellEditController: cell => {cell.isClue = true; setNumberChooser(cell, 1, parseInt(self.dimensionExtra));},
    cellMultiPencil: true,
  }

  typeProperties["chat_room"] = {
    needConnectors: !this.editMode,
    cellController: cell => {
      cell.dragProcessor = true;
    },
    connectorController: connector => {
      setDragSwitch(connector, false, [{},{color: self.colorSchema.textColor, returnValue: 1}]);
    },
    cellEditController: cell => {
      cell.isClue = true;
      var chooserValues = [{}];
      chooserValues.push({image: 'phone', returnValue: 'phone'});
      chooserValues.push({image: 'big_white_circle', returnValue: 'white_circle'});
      chooserValues.push({image: 'big_black_circle', returnValue: 'black_circle'});
      for (var i=0; i<=99; i++) {
        chooserValues.push({text: i.toString(), image: 'big_white_circle', returnValue: 'white_'+i.toString()});
        chooserValues.push({text: i.toString(), image: 'big_black_circle', textColor: "#fff", returnValue: 'black_'+i.toString()});
      }
      cell.chooserValues = chooserValues;
    },
    decodeClue: value => {
      if (value=="phone") {
        return {image: "phone"}
      } else if (value=="black_circle") {
        return {image: "big_black_circle"}
      } else if (value=="white_circle") {
        return {image: "big_white_circle"}
      } else if (value.startsWith("black_")) {
        return {image: "big_black_circle", text: value.substring(6), textColor: "#fff"}
      } else if (value.startsWith("white_")) {
        return {image: "big_white_circle", text: value.substring(6)}
      } else {
        return {text: value}
      }
    },
  }

  typeProperties["slalom"] = {
    needNodes: true,
    needConnectors: false,
    cellController: cell => {
      cell.dragProcessor = null;
      setClickSwitch(cell, false, [{},{image: "slash", returnValue: "/"},{image: "backslash", returnValue: "\\"}]);
      if (cell.isClue && cell.data.image != "cross") {
        setClueClickSwitch(cell, [{},{color: self.colorSchema.greyColor, returnValue: "1"}], [{},{color: "#a0a0a0"}]);
      }
    },
    nodeEditController: node => {
      node.isClue = true;
      var chooserValues = [{}];
      for (var i=0; i<=4; i++) {
        chooserValues.push({color: self.colorSchema.gridColor, text: i.toString(), textColor: "#fff", returnValue: i.toString()});
      }
      node.chooserValues = chooserValues;
    },
    decodeClue: value => {
      return {color: self.colorSchema.gridColor, text: value, textColor: "#fff"};
    },
  }

  if (typeCode in typeProperties) {
    this.typeProperties = Object.assign({}, this.typeProperties,  typeProperties[typeCode]);
  }
  }
}

snailPuzzleType.prototype.setTypeProperties = function(typeCode) {
  var self = this;

  if (typeCode=="magic_snail") {
    var letters = self.dimensionExtra;
    this.typeProperties = decribePuzzleType()
      .useOuterCells(StdOuter.LEFT | StdOuter.RIGHT | StdOuter.TOP | StdOuter.BOTTOM)
      .add(controller().forAuthor().cell().outer().chooser()
        .addLetters(letters))
      .add(controller().forAuthor().cell().inner().chooser()
        .addLetters(letters)
        .addItem(StdItem.CROSS))
      .add(controller().forSolver().cell().inner().noClue().chooser()
        .addLetters(letters)
        .addItem(StdItem.CROSS.doNotSubmit())
        .addItem(StdItem.WHITE_CIRCLE.doNotSubmit()))
      .add(controller().forSolver().cell().outer().clue().clickSwitch()
        .addItem(StdItem.WHITE_CIRCLE.doNotSubmit()))
      .addUpgradeClue(clue=>clue=="white"?null:clue)
      .build(this);
  }
}

snailPuzzleType.prototype.drawBoard = function() {
  squarePuzzleType.prototype.drawBoard.call(this);
  var lineLength = this.rows - 1;
  var start = {x:0, y: 1};
  var direction = {x:1, y:0};
  while (lineLength > 0) {
    var end = {x: start.x + direction.x * lineLength, y: start.y + direction.y * lineLength};
    var line = this.snap.line(
      this.size.leftGap + this.size.unitSize * start.x, this.size.topGap + this.size.unitSize * start.y,
      this.size.leftGap + this.size.unitSize * end.x, this.size.topGap + this.size.unitSize * end.y);
      let attr = Object.assign({fill: "none", "stroke": this.colorSchema.gridColor}, this.gridProperty.edge);
      line.attr(attr);
    start = end;
    direction = {x: -direction.y, y: direction.x};
    if (direction.x==0) lineLength--;
  }
}

function setClickSwitch(element, withClues, clickSwitch, pencilClickSwitch) {
  if (element.isClue && !withClues) {
    return;
  }
  element.clickSwitch = clickSwitch.map(val => Object.assign({}, element.data, val))
  if (typeof pencilClickSwitch != "undefined") {
    element.pencilClickSwitch = pencilClickSwitch;
  } else {
    element.pencilClickSwitch = clickSwitch.map(val => {var clone = Object.assign({}, val); delete clone.returnValue; return clone});
  }
}

function setClueClickSwitch(element, clickSwitch, pencilClickSwitch) {
  if (!element.isClue) {
    return;
  }
  element.clickSwitch = clickSwitch.map(val => Object.assign({}, element.data, val))
  if (typeof pencilClickSwitch != "undefined") {
    element.pencilClickSwitch = pencilClickSwitch;
  } else {
    element.pencilClickSwitch = clickSwitch.map(val => {var clone = Object.assign({}, val); delete clone.returnValue; return clone});
  }
}

function setNumberChooser(cell, start, end) {
  var chooserValues = [{}];
  for (var i=start; i<=end; i++) {
    chooserValues.push({text: i.toString(), returnValue: i.toString()});
  }
  cell.chooserValues = chooserValues;
}

function setDragSwitch(element, withClues, dragSwitch, pencilDragSwitch) {
  if (element.isClue && !withClues) {
    return;
  }
  element.dragSwitch = dragSwitch.map(val => Object.assign({}, element.data, val))
  if (typeof pencilDragSwitch != "undefined") {
    element.pencilDragSwitch = pencilDragSwitch;
  } else {
    element.pencilDragSwitch = dragSwitch.map(val => {var clone = Object.assign({}, val); delete clone.returnValue; return clone});
  }
}

squarePuzzleCell.prototype.chooserData = function() {
  if (this.puzzle.typeCode == "chat_room") {
    var values = this.chooserValues.slice(0, 24);
    values.push({text: "+10"});
    return values;
  } else {
    return squareGridElement.prototype.chooserData.call(this);
  }
}

squarePuzzleCell.prototype.switchOnChooser = function(index) {
  if (this.puzzle.typeCode == "chat_room" && index == 24) {
    var currentIndex = this.findCurrent(this.chooserValues);
    var newIndex = currentIndex + 20;
    if (newIndex >= this.chooserValues.length) {
      newIndex -= this.chooserValues.length;
    }
    return squareGridElement.prototype.switchOnChooser.call(this, newIndex);
  } else  {
    return squareGridElement.prototype.switchOnChooser.call(this, index);
  }
}

})
