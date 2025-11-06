define(["square","controller_helper"], function() {

squarePuzzleType = function(puzzleData, controls, settings) {
  squarePuzzle.call(this, puzzleData, controls, settings);
}

Object.setPrototypeOf(squarePuzzleType.prototype, squarePuzzle.prototype);

snailPuzzleType = function(puzzleData, controls, settings) {
  squarePuzzleType.call(this, puzzleData, controls, settings);
}

Object.setPrototypeOf(snailPuzzleType.prototype, squarePuzzleType.prototype);

krammaPuzzleType = function(puzzleData, controls, settings) {
  squarePuzzleType.call(this, puzzleData, controls, settings);
}

Object.setPrototypeOf(krammaPuzzleType.prototype, squarePuzzleType.prototype);

squarePuzzleType.prototype.setTypeProperties = function(typeCode) {
  var self = this;

  if (typeCode =="hitori") {
    this.typeProperties = decribePuzzleType()
      .add(controller().forAuthor().cell().chooser()
        .addNumbers(0,16))
      .add(controller().forSolver().cell().clickSwitch()
        .addItem(StdItem.BLACK.submitAs("1"))
        .addItem(StdItem.WHITE_CIRCLE.doNotSubmit()))
      .add(controller().forSolver().cell().clue().copyPaste((data, elementData) => {
         return Object.assign({}, elementData, {color: data.color, image: data.image} );
      }))
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
      .add(controller().forSolver().cell().noClue().copyPaste((data, elementData) => {
         if (data.image=="cross") return data;
         else return Object.assign({}, data, {image: null} )
      }))
      .add(controller().forSolver().cell().clue().copyPaste((data, elementData) => {
         if (elementData.image=="cross") return elementData;
         else return Object.assign({}, elementData, {color: data.color} );
      }))
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

  } else if (typeCode=="snake_striped") {
    var maxValue = Math.max((this.rows+1)/2, (this.cols+1)/2);
    this.typeProperties = decribePuzzleType()
      .useOuterCells(StdOuter.RIGHT | StdOuter.BOTTOM)
      .useOuterColors(StdOuter.BOTTOM, StdColor.OUTER)
      .useOuterColors(StdOuter.RIGHT, StdColor.DARK_OUTER)
      .add(controller().forAuthor().cell().outer().chooser()
        .addNumbers(0,maxValue))
      .add(controller().forAuthor().cell().inner().clickSwitch()
        .addItem(StdItem.CROSS)
        .addItem(StdItem.CLUE_COLOR))
      .add(controller().forSolver().cell().inner().noClue().clickSwitch()
        .addItem(StdItem.BLACK)
        .addItem(StdItem.BRIGHT.submitAs('black'))
        .addItem(StdItem.CROSS.doNotSubmit()))
      .add(controller().forSolver().cell().outer().clue().clickSwitch()
        .addItem(StdItem.WHITE_CIRCLE.doNotSubmit()))
      .add(controller().forSolver().cell().inner().noClue().copyPaste())
      .addUpgradeClue(clue=>clue=="white"?null:clue)
      .build(this);

  } else if (typeCode=="snake_minesweeper") {
    this.typeProperties = decribePuzzleType()
      .add(controller().forAuthor().cell().chooser()
        .addNumbers(0,8)
        .addItem(StdItem.CROSS)
        .addItem(StdItem.CLUE_COLOR))
      .add(controller().forSolver().cell().noClue().clickSwitch()
        .addItem(StdItem.BLACK)
        .addItem(StdItem.CROSS.doNotSubmit()))
      .add(controller().forSolver().cell().noClue().copyPaste())
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

  } else if (typeCode=="passage") {
    var maxValue = Math.max(this.rows, this.cols);
    this.typeProperties = decribePuzzleType()
      .add(controller().forAuthor().cell().chooser()
        .addItem(StdItem.BLACK)
        .addItem(StdItem.CROSS)
        .addNumbers(3,maxValue,StdColor.GREY))
      .add(controller().forSolver().cell().noClue().clickSwitch()
        .addItem(StdItem.GREY.submitAs("1"))
        .addItem(StdItem.CROSS.doNotSubmit()))
      .add(controller().forSolver().cell().noClue().copyPaste((data, elementData) => {
         if (data.image=="cross") return data;
         else return Object.assign({}, {color: data.color==self.colorSchema.gridColor?self.colorSchema.greyColor:data.color} )
      }))
      .add(controller().forSolver().cell().clue().copy())
      .build(this);

  } else if (typeCode=="aquapelago") {
    this.typeProperties = decribePuzzleType()
      .add(controller().forAuthor().cell().chooser()
        .addItem(StdItem.CLUE_COLOR.submitAs("grey"))
        .addNumbers(1,99,StdColor.CLUE))
      .add(controller().forSolver().cell().noClue().clickSwitch()
        .addItem(StdItem.GREY.submitAs("1"))
        .addItem(StdItem.CROSS.doNotSubmit()))
      .add(controller().forSolver().cell().noClue().copyPaste((data, elementData) => {
         if (data.image=="cross") return data;
         else return Object.assign({}, {color: data.color==self.colorSchema.gridColor?self.colorSchema.greyColor:data.color} )
      }))
      .build(this);

  } else if (typeCode=="snake_scope") {
    this.typeProperties = decribePuzzleType()
      .add(controller().forAuthor().cell().clickSwitch()
        .addItem(StdItem.CROSS))
      .add(controller().forAuthor().node().chooser()
        .addNumbers(0,3,StdColor.BLACK))
      .add(controller().forSolver().cell().noClue().clickSwitch()
        .addItem(StdItem.GREY.submitAs("1"))
        .addItem(StdItem.CROSS.doNotSubmit()))
      .add(controller().forSolver().cell().noClue().copyPaste())
      .add(controller().forSolver().cell().clue().copy())
      .build(this);

  // With areas
  } else if (typeCode=="heyawake") {
    this.typeProperties = decribePuzzleType()
      .useCornerTexts(true)
      .add(controller().forAuthor().cell().chooser()
        .addItem(StdItem.CROSS)
        .addNumbers(0,20,{textColor: this.colorSchema.textColor}))
      .add(controller().forAuthor().edge().toAreas().clickSwitch().withDrag()
        .addItem(StdItem.BLACK.asAreaBorder()))
      .add(controller().forSolver().cell().noClue(StdItem.CROSS).clickSwitch()
        .addItem(StdItem.GREY.submitAs("1"))
        .addItem(StdItem.CROSS.doNotSubmit()))
      .add(controller().forSolver().cell()
        .copyPaste((data, elementData) => Object.assign({}, elementData, {image: data.image, color: data.color} )))
     .build(this);

  } else if (typeCode=="aqre") {
    this.typeProperties = decribePuzzleType()
      .useCornerTexts(true)
      .add(controller().forAuthor().cell().chooser()
        .addItem(StdItem.CROSS)
        .addNumbers(0,20,{textColor: this.colorSchema.textColor}))
      .add(controller().forAuthor().edge().toAreas().clickSwitch().withDrag()
        .addItem(StdItem.BLACK.asAreaBorder()))
      .add(controller().forSolver().cell().noClue(StdItem.CROSS).clickSwitch()
        .addItem(StdItem.GREY.submitAs("1"))
        .addItem(StdItem.CROSS.doNotSubmit()))
      .add(controller().forSolver().cell()
        .copyPaste((data, elementData) => Object.assign({}, elementData, {image: data.image, color: data.color} )))
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

  } else if (typeCode=="ripple_effect") {
    this.typeProperties = decribePuzzleType()
      .add(controller().forAuthor().cell().chooser()
        .addNumbers(1,6))
      .add(controller().forAuthor().edge().toAreas().clickSwitch().withDrag()
        .addItem(StdItem.BLACK.asAreaBorder()))
      .add(controller().forSolver().cell().noClue().chooser()
        .addNumbers(1,6))
     .build(this);

  } else if (typeCode=="meandering_numbers") {
    this.typeProperties = decribePuzzleType()
      .add(controller().forAuthor().cell().chooser()
        .addNumbers(1,9))
      .add(controller().forAuthor().edge().toAreas().clickSwitch().withDrag()
        .addItem(StdItem.BLACK.asAreaBorder()))
      .add(controller().forSolver().cell().noClue().chooser()
        .addNumbers(1,9))
     .build(this);

  } else if (typeCode=="nanro") {
    this.typeProperties = decribePuzzleType()
      .add(controller().forAuthor().cell().chooser()
        .addNumbers(1,9))
      .add(controller().forAuthor().edge().toAreas().clickSwitch().withDrag()
        .addItem(StdItem.BLACK.asAreaBorder()))
      .add(controller().forSolver().cell().noClue().chooser()
        .addNumbers(1,9)
        .addItem(StdItem.WHITE_CIRCLE.doNotSubmit().keepPencil())
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

  } else if (typeCode=="lits_plus") {
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

  } else if (typeCode=="lits_double") {
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

  } else if (typeCode=="lits_inverse") {
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

  } else if (typeCode=="pentomino_areas") {
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

  } else if (typeCode=="statue_park") {
    this.typeProperties = decribePuzzleType()
      .add(controller().forAuthor().cell().clickSwitch()
        .addItem(StdItem.WHITE_CIRCLE)
        .addItem(StdItem.BLACK_CIRCLE))
      .add(controller().forSolver().cell().noClue().clickSwitch()
        .addItem(StdItem.GREY.submitAs("1"))
        .addItem(StdItem.CROSS.doNotSubmit()))
      .add(controller().forSolver().cell().clue(StdItem.BLACK_CIRCLE).clickSwitch()
        .addItem(StdItem.GREY.submitAs("1")))
      .add(controller().forSolver().cell().noClue().copyPaste((data, elementData) => {
         if (data.image=="cross") return data;
         else return Object.assign({}, data, {image: null} )
      }))
      .add(controller().forSolver().cell().clue().copyPaste((data, elementData) => {
         if (elementData.image=="cross") return elementData;
         else return Object.assign({}, elementData, {color: data.color} );
      }))
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

  } else if (typeCode=="aquarium") {
    var maxValue = Math.max(this.rows, this.cols);
    this.typeProperties = decribePuzzleType()
      .useOuterCells(StdOuter.RIGHT | StdOuter.BOTTOM)
      .add(controller().forAuthor().cell().outer().chooser()
        .addNumbers(0, maxValue))
      .add(controller().forAuthor().cell().inner().clickSwitch()
        .addItem(StdItem.CROSS))
      .add(controller().forAuthor().edge().toAreas().clickSwitch().withDrag()
        .addItem(StdItem.BLACK.asAreaBorder()))
      .add(controller().forSolver().cell().outer().clue().clickSwitch()
        .addItem(StdItem.WHITE_CIRCLE.doNotSubmit()))
      .add(controller().forSolver().cell().inner().noClue().clickSwitch()
        .addItem(StdItem.GREY.submitAs("1"))
        .addItem(StdItem.CROSS.doNotSubmit()))
      .add(controller().forSolver().cell().inner().clue().copy())
      .add(controller().forSolver().cell().inner().noClue().copyPaste())
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

  } else if (typeCode=="choco_banana") {
    this.typeProperties = decribePuzzleType()
      .add(controller().forAuthor().cell().chooser()
        .addNumbers(1,29,{textColor: this.colorSchema.textColor}))
      .add(controller().forSolver().cell().noClue(StdItem.CROSS).clickSwitch()
        .addItem(StdItem.GREY.submitAs('1'))
        .addItem(StdItem.CROSS.doNotSubmit()))
      .add(controller().forSolver().cell().copy())
      .add(controller().forSolver().cell().noClue(StdItem.CROSS)
        .copyPaste((data, elementData) => Object.assign({}, elementData, {image: data.image, color: data.color})))
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
      .add(controller().forSolver().cell().clueNot(StdItem.WAVE).clickSwitch()
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
      .add(controller().forSolver().cell().clueNot(StdItem.WAVE).clickSwitch()
        .addItem(StdItem.WHITE_CIRCLE.doNotSubmit()))
      .build(this);

  } else if (typeCode=="kuromasu") {
    this.typeProperties = decribePuzzleType()
      .add(controller().forAuthor().cell().chooser()
        .addItem(StdItem.CROSS)
        .addNumbers(1,29))
      .add(controller().forSolver().cell().noClue().clickSwitch()
        .addItem(StdItem.GREY.submitAs('1'))
        .addItem(StdItem.CROSS.doNotSubmit()))
      .add(controller().forSolver().cell().clue().clickSwitch()
        .addItem(StdItem.CROSS.doNotSubmit()))
      .add(controller().forSolver().cell().clue().copy())
      .add(controller().forSolver().cell().inner().noClue().copyPaste((data) => data.text?{image: "cross"}:data))
      .build(this);

  } else if (typeCode=="cave_classic") {
    this.typeProperties = decribePuzzleType()
      .add(controller().forAuthor().cell().chooser()
        .addItem(StdItem.CROSS)
        .addItem(StdItem.CLUE_COLOR.submitAs('black'))
        .addNumbers(1,29))
      .add(controller().forSolver().cell().noClue().clickSwitch()
        .addItem(StdItem.GREY.submitAs('black'))
        .addItem(StdItem.CROSS.doNotSubmit()))
      .add(controller().forSolver().cell().clue().clickSwitch()
        .addItem(StdItem.CROSS.doNotSubmit()))
      .add(controller().forSolver().cell().clue().copy())
      .add(controller().forSolver().cell().inner().noClue().copyPaste((data) => data.text?{image: "cross"}:data))
      .build(this);

  } else if (typeCode=="canal_view") {
    this.typeProperties = decribePuzzleType()
      .add(controller().forAuthor().cell().chooser()
        .addItem(StdItem.CROSS)
        .addItem(StdItem.CLUE_COLOR.submitAs('black'))
        .addNumbers(1,29))
      .add(controller().forSolver().cell().noClue().clickSwitch()
        .addItem(StdItem.GREY.submitAs('black'))
        .addItem(StdItem.CROSS.doNotSubmit()))
      .add(controller().forSolver().cell().clue().clickSwitch()
        .addItem(StdItem.CROSS.doNotSubmit()))
      .add(controller().forSolver().cell().clue().copy())
      .add(controller().forSolver().cell().inner().noClue().copyPaste((data) => data.text?{image: "cross"}:data))
      .build(this);

  } else if (typeCode=="nurikabe") {
    this.typeProperties = decribePuzzleType()
      .add(controller().forAuthor().cell().chooser()
        .addItem(StdItem.CROSS)
        .addNumbers(1,99))
      .add(controller().forSolver().cell().noClue().clickSwitch()
        .addItem(StdItem.GREY.submitAs('black'))
        .addItem(StdItem.CROSS.doNotSubmit()))
      .add(controller().forSolver().cell().clue().clickSwitch()
        .addItem(StdItem.CROSS.doNotSubmit()))
      .add(controller().forSolver().cell().clue().copy())
      .add(controller().forSolver().cell().inner().noClue().copyPaste((data) => data.text?{image: "cross"}:data))
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

  } else if (typeCode=="tetro_scope") {
    this.typeProperties = decribePuzzleType()
      .add(controller().forAuthor().cell().inner().clickSwitch()
        .addItem(StdItem.CROSS))
      .add(controller().forAuthor().node().inner().clickSwitch()
        .addNumbers(0, 4, StdColor.BLACK))
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

  } else if (typeCode=="tapa_classic" || typeCode=="pata") {
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
        .addNumbers(0,maxValue))
      .add(controller().forSolver().cell().inner().noClue().clickSwitch()
        .addItem(StdItem.BLACK)
        .addItem(StdItem.BRIGHT.submitAs('grey')))
      .add(controller().forSolver().cell().outer().clue().clickSwitch()
        .addItem(StdItem.WHITE_CIRCLE.doNotSubmit()))
      .add(controller().forSolver().cell().inner().noClue().copyPaste())
      .addUpgradeClue(clue=>clue=="white"?null:clue)
      .build(this);

  } else if (typeCode=="paint_battenberg") {
    var maxValue = Math.max(this.rows, this.cols);
    this.typeProperties = decribePuzzleType()
      .useOuterCells(StdOuter.RIGHT | StdOuter.BOTTOM)
      .add(controller().forAuthor().cell().outer().chooser()
        .addNumbers(0,maxValue))
      .add(controller().forAuthor().cell().inner().clickSwitch()
        .addItem(StdItem.CROSS))
      .add(controller().forAuthor().node().clickSwitch()
        .addItem(StdItem.BATTENBERG))
      .add(controller().forSolver().cell().inner().noClue().clickSwitch()
        .addItem(StdItem.GREY.submitAs("black"))
        .addItem(StdItem.CROSS.doNotSubmit()))
      .add(controller().forSolver().cell().outer().clue().clickSwitch()
        .addItem(StdItem.WHITE_CIRCLE.doNotSubmit()))
      .add(controller().forSolver().cell().inner().clue().copy())
      .add(controller().forSolver().cell().inner().noClue().copyPaste())
      .addUpgradeClue(clue=>clue=="white"?null:clue)
      .build(this);

  } else if (typeCode=="arrow_web") {
    this.typeProperties = decribePuzzleType()
      .add(controller().forAuthor().cell().chooser()
        .addItem(StdItem.WHITE_ARROW_U)
        .addItem(StdItem.WHITE_ARROW_UR)
        .addItem(StdItem.WHITE_ARROW_R)
        .addItem(StdItem.WHITE_ARROW_DR)
        .addItem(StdItem.WHITE_ARROW_D)
        .addItem(StdItem.WHITE_ARROW_DL)
        .addItem(StdItem.WHITE_ARROW_L)
        .addItem(StdItem.WHITE_ARROW_UL))
      .add(controller().forSolver().cell().clickSwitch()
        .addItem(StdItem.BLACK.submitAs("1"))
        .addItem(StdItem.LIGHT_GREY.doNotSubmit()))
      .add(controller().forSolver().cell().copyPaste((data, elementData) => Object.assign({}, elementData, {color: data.color})))
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
        .addItem(StdItem.WHITE_CIRCLE.doNotSubmit().keepPencil())
        .addItem(StdItem.CROSS.doNotSubmit()))
      .add(controller().forSolver().cell().outer().clue().clickSwitch()
        .addItem(StdItem.WHITE_CIRCLE.doNotSubmit()))
      .addUpgradeClue(clue=>clue=="white"?null:clue)
      .build(this);

  } else if (typeCode=="product_kuromasu") {
    this.typeProperties = decribePuzzleType()
      .useOuterCells(StdOuter.RIGHT | StdOuter.BOTTOM)
      .add(controller().forAuthor().cell().inner().clickSwitch()
        .addItem(StdItem.CROSS))
      .add(controller().forAuthor().cell().outer().chooser()
        .addNumbers(1, 81))
      .add(controller().forSolver().cell().inner().noClue().chooser()
        .addNumbers(1, 9)
        .addItem(StdItem.WHITE_CIRCLE.doNotSubmit().keepPencil())
        .addItem(StdItem.CROSS.doNotSubmit()))
      .add(controller().forSolver().cell().outer().clue().clickSwitch()
        .addItem(StdItem.WHITE_CIRCLE.doNotSubmit()))
      .addUpgradeClue(clue=>clue=="white"?null:clue)
      .build(this);

  } else if (typeCode=="no_touch_sums") {
    var maxValue = Number(self.dimensionExtra);
    this.typeProperties = decribePuzzleType()
      .useOuterCells(StdOuter.RIGHT | StdOuter.BOTTOM)
      .add(controller().forAuthor().cell().inner().clickSwitch()
        .addItem(StdItem.CROSS))
      .add(controller().forAuthor().cell().outer().chooser()
        .addNumbers(1, 99))
      .add(controller().forSolver().cell().inner().noClue().chooser()
        .addNumbers(1, maxValue)
        .addItem(StdItem.WHITE_CIRCLE.doNotSubmit().keepPencil())
        .addItem(StdItem.CROSS.doNotSubmit()))
      .add(controller().forSolver().cell().outer().clue().clickSwitch()
        .addItem(StdItem.WHITE_CIRCLE.doNotSubmit()))
      .addUpgradeClue(clue=>clue=="white"?null:clue)
      .build(this);

  } else if (typeCode=="top_heavy") {
    var maxValue = Number(self.dimensionExtra);
    this.typeProperties = decribePuzzleType()
      .add(controller().forAuthor().cell().inner().chooser()
        .addNumbers(1, maxValue)
        .addItem(StdItem.CROSS))
      .add(controller().forSolver().cell().inner().noClue().chooser()
        .addNumbers(1, maxValue)
        .addItem(StdItem.WHITE_CIRCLE.doNotSubmit().keepPencil())
        .addItem(StdItem.CROSS.doNotSubmit()))
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
        .addItem(StdItem.WHITE_CIRCLE.doNotSubmit().keepPencil())
        .addItem(StdItem.CROSS.doNotSubmit()))
      .addUpgradeClue(clue=>clue=="white"?null:clue)
      .build(this);

  } else if (typeCode=="chaos") {
    this.typeProperties = decribePuzzleType()
      .add(controller().forAuthor().cell().inner().chooser()
        .addNumbers(1, 4))
      .add(controller().forSolver().cell().inner().noClue().chooser()
        .addNumbers(1, 4))
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
        .addItem(StdItem.WHITE_CIRCLE.doNotSubmit().keepPencil())
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

  } else if (typeCode=="skyscrapers_sums") {
    var maxValue = Math.max(this.rows, this.cols);
    var maxSum = maxValue * (maxValue + 1) / 2;
    this.typeProperties = decribePuzzleType()
      .useOuterCells(StdOuter.LEFT | StdOuter.RIGHT | StdOuter.TOP | StdOuter.BOTTOM)
      .add(controller().forAuthor().cell().inner().chooser()
        .addNumbers(1, maxValue))
      .add(controller().forAuthor().cell().outer().chooser()
        .addNumbers(1, maxSum))
      .add(controller().forSolver().cell().inner().noClue().chooser()
        .addNumbers(1, maxValue))
      .add(controller().forSolver().cell().outer().clue().clickSwitch()
        .addItem(StdItem.WHITE_CIRCLE.doNotSubmit()))
      .addUpgradeClue(clue=>clue=="white"?null:clue)
      .build(this);

  } else if (typeCode=="skyscrapers_products") {
    var maxValue = Math.max(this.rows, this.cols);
    this.typeProperties = decribePuzzleType()
      .useOuterCells(StdOuter.LEFT | StdOuter.RIGHT | StdOuter.TOP | StdOuter.BOTTOM)
      .add(controller().forAuthor().cell().inner().chooser()
        .addNumbers(1, maxValue))
      .add(controller().forAuthor().cell().outer().chooser()
        .addNumbers(1, 99))
      .add(controller().forSolver().cell().inner().noClue().chooser()
        .addNumbers(1, maxValue))
      .add(controller().forSolver().cell().outer().clue().clickSwitch()
        .addItem(StdItem.WHITE_CIRCLE.doNotSubmit()))
      .addUpgradeClue(clue=>clue=="white"?null:clue)
      .build(this);

  } else if (typeCode=="skyscrapers_gaps") {
    var maxValue = Number(self.dimensionExtra);
    this.typeProperties = decribePuzzleType()
      .useOuterCells(StdOuter.LEFT | StdOuter.RIGHT | StdOuter.TOP | StdOuter.BOTTOM)
      .add(controller().forAuthor().cell().inner().chooser()
        .addNumbers(1, maxValue)
        .addItem(StdItem.CROSS))
      .add(controller().forAuthor().cell().outer().chooser()
        .addNumbers(1, maxValue))
      .add(controller().forSolver().cell().inner().noClue().chooser()
        .addNumbers(1, maxValue)
        .addItem(StdItem.CROSS.doNotSubmit())
        .addItem(StdItem.WHITE_CIRCLE.doNotSubmit().keepPencil()))
      .add(controller().forSolver().cell().outer().clue().clickSwitch()
        .addItem(StdItem.WHITE_CIRCLE.doNotSubmit()))
      .addUpgradeClue(clue=>clue=="white"?null:clue)
      .build(this);

  } else if (typeCode=="skyscrapers_exclusive") {
    var maxValue = Math.max(this.rows, this.cols);
    var maxClue = Math.ceil(maxValue/2)
    this.typeProperties = decribePuzzleType()
      .useOuterCells(StdOuter.LEFT | StdOuter.RIGHT | StdOuter.TOP | StdOuter.BOTTOM)
      .add(controller().forAuthor().cell().inner().chooser()
        .addNumbers(1, maxValue))
      .add(controller().forAuthor().cell().outer().chooser()
        .addNumbers(0, maxClue))
      .add(controller().forSolver().cell().inner().noClue().chooser()
        .addNumbers(1, maxValue)
        .addItem(StdItem.ODD.doNotSubmit().keepPencil())
        .addItem(StdItem.EVEN.doNotSubmit().keepPencil()))
      .add(controller().forSolver().cell().outer().clue().clickSwitch()
        .addItem(StdItem.WHITE_CIRCLE.doNotSubmit())
        .addItem(StdItem.CROSS.doNotSubmit()))
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

  // Edge drawing
  } else if (typeCode=="fence") {
    this.typeProperties = decribePuzzleType().edgeStyle(false, true)
      .add(controller().forAuthor().cell().chooser()
        .addNumbers(0,4))
      .add(controller().forSolver().cell().clickSwitch()
        .addItem(StdItem.CROSS.doNotSubmit())
        .addItem(StdItem.WHITE_CIRCLE.doNotSubmit()))
      .add(controller().forSolver().edge().clickSwitch()
        .addItem(StdItem.LINE.submitAs("1"))
        .addItem(StdItem.CROSS.doNotSubmit()))
      .add(controller().forSolver().edge().drag()
        .addItem(StdItem.LINE.submitAs("1")))
      .add(controller().forSolver().cell().copyPaste((data, elementData) => {
         return Object.assign({}, elementData, {image: data.image} );
      }))
      .build(this);

  } else if (typeCode=="fence_knapp_daneben") {
    this.typeProperties = decribePuzzleType().edgeStyle(false, true)
      .add(controller().forAuthor().cell().chooser()
        .addNumbers(0,4))
      .add(controller().forSolver().cell().clickSwitch()
        .addItem(StdItem.CROSS.doNotSubmit())
        .addItem(StdItem.WHITE_CIRCLE.doNotSubmit()))
      .add(controller().forSolver().edge().clickSwitch()
        .addItem(StdItem.LINE.submitAs("1"))
        .addItem(StdItem.CROSS.doNotSubmit()))
      .add(controller().forSolver().edge().drag()
        .addItem(StdItem.LINE.submitAs("1")))
      .add(controller().forSolver().cell().copyPaste((data, elementData) => {
         return Object.assign({}, elementData, {image: data.image} );
      }))
      .build(this);

  } else if (typeCode=="fence_pentomino") {
    this.typeProperties = decribePuzzleType().edgeStyle(false, true)
      .add(controller().forAuthor().cell().chooser()
        .addNumbers(0,4))
      .add(controller().forSolver().cell().clickSwitch()
        .addItem(StdItem.CROSS.doNotSubmit())
        .addItem(StdItem.WHITE_CIRCLE.doNotSubmit()))
      .add(controller().forSolver().edge().clickSwitch()
        .addItem(StdItem.LINE.submitAs("1"))
        .addItem(StdItem.CROSS.doNotSubmit()))
      .add(controller().forSolver().edge().drag()
        .addItem(StdItem.LINE.submitAs("1")))
      .add(controller().forSolver().cell().copyPaste((data, elementData) => {
         return Object.assign({}, elementData, {image: data.image} );
      }))
      .build(this);

  } else if (typeCode=="fence_turning") {
    this.typeProperties = decribePuzzleType().edgeStyle(false, true)
      .add(controller().forAuthor().cell().chooser()
        .addNumbers(0,4))
      .add(controller().forSolver().cell().clickSwitch()
        .addItem(StdItem.CROSS.doNotSubmit())
        .addItem(StdItem.WHITE_CIRCLE.doNotSubmit()))
      .add(controller().forSolver().node().clickSwitch()
        .addItem(StdItem.CROSS.doNotSubmit())
        .addItem(StdItem.WHITE_CIRCLE.doNotSubmit()))
      .add(controller().forSolver().edge().clickSwitch()
        .addItem(StdItem.LINE.submitAs("1"))
        .addItem(StdItem.CROSS.doNotSubmit()))
      .add(controller().forSolver().edge().drag()
        .addItem(StdItem.LINE.submitAs("1")))
      .add(controller().forSolver().cell().copyPaste((data, elementData) => {
         return Object.assign({}, elementData, {image: data.image} );
      }))
      .build(this);

  } else if (typeCode=="polygraph") {
    this.typeProperties = decribePuzzleType().edgeStyle(false, true)
      .add(controller().forAuthor().cell().chooser()
        .addNumbers(0,4))
      .add(controller().forSolver().cell().clickSwitch()
        .addItem(StdItem.CROSS.doNotSubmit())
        .addItem(StdItem.WHITE_CIRCLE.doNotSubmit()))
      .add(controller().forSolver().edge().clickSwitch()
        .addItem(StdItem.LINE.submitAs("1"))
        .addItem(StdItem.CROSS.doNotSubmit()))
      .add(controller().forSolver().edge().drag()
        .addItem(StdItem.LINE.submitAs("1")))
      .add(controller().forSolver().cell().copyPaste((data, elementData) => {
         return Object.assign({}, elementData, {image: data.image} );
      }))
      .build(this);

  } else if (typeCode=="fence_even_odd") {
    this.typeProperties = decribePuzzleType().edgeStyle(false, true)
      .add(controller().forAuthor().cell().clickSwitch()
        .addItem(StdItem.LIGHT_GREY))
      .add(controller().forSolver().cell().clickSwitch()
        .addItem(StdItem.CROSS.doNotSubmit())
        .addItem(StdItem.WHITE_CIRCLE.doNotSubmit()))
      .add(controller().forSolver().edge().clickSwitch()
        .addItem(StdItem.LINE.submitAs("1"))
        .addItem(StdItem.CROSS.doNotSubmit()))
      .add(controller().forSolver().edge().drag()
        .addItem(StdItem.LINE.submitAs("1")))
      .add(controller().forSolver().cell().copyPaste((data, elementData) => {
         return Object.assign({}, elementData, {image: data.image} );
      }))
      .build(this);

  // Connector drawing
  } else if (typeCode=="country_road") {
    this.typeProperties = decribePuzzleType()
      .useCornerTexts(true)
      .add(controller().forAuthor().cell().chooser()
        .addNumbers(1,99))
      .add(controller().forAuthor().edge().toAreas().clickSwitch().withDrag()
        .addItem(StdItem.BLACK.asAreaBorder()))
      .add(controller().forSolver().cell().clickSwitch()
        .addItem(StdItem.CROSS.doNotSubmit())
        .addItem(StdItem.WHITE_CIRCLE.doNotSubmit()))
      .add(controller().forSolver().connector().drag()
        .addItem(StdItem.LINE.submitAs('1')))
      .add(controller().forSolver().edge().clickSwitch()
        .addItem(StdItem.CROSS.doNotSubmit()))
      .build(this);

  } else if (typeCode=="expressway") {
    this.typeProperties = decribePuzzleType()
      .add(controller().forAuthor().cell().clickSwitch()
        .addItem(StdItem.LIGHT_GREY))
      .add(controller().forAuthor().edge().toAreas().clickSwitch().withDrag()
        .addItem(StdItem.BLACK.asAreaBorder()))
      .add(controller().forSolver().cell().clickSwitch()
        .addItem(StdItem.CROSS.doNotSubmit())
        .addItem(StdItem.WHITE_CIRCLE.doNotSubmit()))
      .add(controller().forSolver().connector().drag()
        .addItem(StdItem.LINE.submitAs('1')))
      .add(controller().forSolver().edge().clickSwitch()
        .addItem(StdItem.CROSS.doNotSubmit()))
      .build(this);

  } else if (typeCode=="maxi_loop") {
    this.typeProperties = decribePuzzleType()
      .useCornerTexts(true)
      .add(controller().forAuthor().cell().chooser()
        .addNumbers(1,99))
      .add(controller().forAuthor().edge().toAreas().clickSwitch().withDrag()
        .addItem(StdItem.BLACK.asAreaBorder()))
      .add(controller().forSolver().cell().clickSwitch()
        .addItem(StdItem.CROSS.doNotSubmit())
        .addItem(StdItem.WHITE_CIRCLE.doNotSubmit()))
      .add(controller().forSolver().connector().drag()
        .addItem(StdItem.LINE.submitAs('1')))
      .add(controller().forSolver().edge().clickSwitch()
        .addItem(StdItem.CROSS.doNotSubmit()))
      .build(this);

  } else if (typeCode=="double_back") {
    this.typeProperties = decribePuzzleType()
      .add(controller().forAuthor().edge().toAreas().clickSwitch().withDrag()
        .addItem(StdItem.BLACK.asAreaBorder()))
      .add(controller().forSolver().cell().clickSwitch()
        .addItem(StdItem.CROSS.doNotSubmit())
        .addItem(StdItem.WHITE_CIRCLE.doNotSubmit()))
      .add(controller().forSolver().connector().drag()
        .addItem(StdItem.LINE.submitAs('1')))
      .add(controller().forSolver().edge().clickSwitch()
        .addItem(StdItem.CROSS.doNotSubmit()))
      .build(this);

  } else if (typeCode=="inturnal") {
    this.typeProperties = decribePuzzleType()
      .add(controller().forAuthor().cell().chooser()
        .addNumbers(0,4))
      .add(controller().forSolver().node().clickSwitch()
        .addItem(StdItem.CROSS.doNotSubmit())
        .addItem(StdItem.WHITE_CIRCLE.doNotSubmit()))
      .add(controller().forSolver().connector().drag()
        .addItem(StdItem.LINE.submitAs('1')))
      .add(controller().forSolver().edge().clickSwitch()
        .addItem(StdItem.CROSS.doNotSubmit()))
      .build(this);

  } else if (typeCode=="simple_loop") {
    this.typeProperties = decribePuzzleType()
      .add(controller().forAuthor().cell().clickSwitch()
        .addItem(StdItem.BLACK))
      .add(controller().forSolver().connector().drag()
        .addItem(StdItem.LINE.submitAs('1')))
      .add(controller().forSolver().edge().clickSwitch()
        .addItem(StdItem.CROSS.doNotSubmit()))
      .build(this);

  } else if (typeCode=="yajilin" || typeCode=="yajilin_domino" || typeCode=="yajilin_liar" ) {
    this.typeProperties = decribePuzzleType()
      .add(controller().forAuthor().cell().chooser()
        .addItem(StdItem.LIGHT_GREY)
        .addItem(controllerItem({image: "bg_arrow_u", text: "0", returnValue: "u0"}))
        .addItem(controllerItem({image: "bg_arrow_u", text: "1", returnValue: "u1"}))
        .addItem(controllerItem({image: "bg_arrow_u", text: "2", returnValue: "u2"}))
        .addItem(controllerItem({image: "bg_arrow_u", text: "3", returnValue: "u3"}))
        .addItem(controllerItem({image: "bg_arrow_u", text: "4", returnValue: "u4"}))
        .addItem(controllerItem({image: "bg_arrow_u", text: "5", returnValue: "u5"}))
        .addItem(controllerItem({image: "bg_arrow_r", text: "0", returnValue: "r0"}))
        .addItem(controllerItem({image: "bg_arrow_r", text: "1", returnValue: "r1"}))
        .addItem(controllerItem({image: "bg_arrow_r", text: "2", returnValue: "r2"}))
        .addItem(controllerItem({image: "bg_arrow_r", text: "3", returnValue: "r3"}))
        .addItem(controllerItem({image: "bg_arrow_r", text: "4", returnValue: "r4"}))
        .addItem(controllerItem({image: "bg_arrow_r", text: "5", returnValue: "r5"}))
        .addItem(controllerItem({image: "bg_arrow_d", text: "0", returnValue: "d0"}))
        .addItem(controllerItem({image: "bg_arrow_d", text: "1", returnValue: "d1"}))
        .addItem(controllerItem({image: "bg_arrow_d", text: "2", returnValue: "d2"}))
        .addItem(controllerItem({image: "bg_arrow_d", text: "3", returnValue: "d3"}))
        .addItem(controllerItem({image: "bg_arrow_d", text: "4", returnValue: "d4"}))
        .addItem(controllerItem({image: "bg_arrow_d", text: "5", returnValue: "d5"}))
        .addItem(controllerItem({image: "bg_arrow_l", text: "0", returnValue: "l0"}))
        .addItem(controllerItem({image: "bg_arrow_l", text: "1", returnValue: "l1"}))
        .addItem(controllerItem({image: "bg_arrow_l", text: "2", returnValue: "l2"}))
        .addItem(controllerItem({image: "bg_arrow_l", text: "3", returnValue: "l3"}))
        .addItem(controllerItem({image: "bg_arrow_l", text: "4", returnValue: "l4"}))
        .addItem(controllerItem({image: "bg_arrow_l", text: "5", returnValue: "l5"}))
        )
      .add(controller().forSolver().cell().noClue().clickSwitch()
        .addItem(StdItem.BLACK.doNotSubmit())
        .addItem(StdItem.CROSS.doNotSubmit()))
      .add(controller().forSolver().connector().drag()
        .addItem(StdItem.LINE.submitAs('1')))
      .add(controller().forSolver().edge().clickSwitch()
        .addItem(StdItem.CROSS.doNotSubmit()))
      .build(this);
    this.typeProperties.toChooserShow = function(value) {
      let showValue = Object.assign({}, value);
      showValue.textColor = "#fff";
      return showValue;
    }

  } else if (typeCode=="yajilin_sum" ) {
    this.typeProperties = decribePuzzleType()
      .add(controller().forAuthor().cell().chooser()
        .addItem(StdItem.LIGHT_GREY)
        .addNumbers(0, 15, StdColor.LIGHT_GREY)
        )
      .add(controller().forSolver().cell().noClue().clickSwitch()
        .addItem(StdItem.BLACK.doNotSubmit())
        .addItem(StdItem.CROSS.doNotSubmit()))
      .add(controller().forSolver().connector().drag()
        .addItem(StdItem.LINE.submitAs('1')))
      .add(controller().forSolver().edge().clickSwitch()
        .addItem(StdItem.CROSS.doNotSubmit()))
      .build(this);
    this.typeProperties.toChooserShow = function(value) {
      let showValue = Object.assign({}, value);
      showValue.textColor = "#fff";
      return showValue;
    }

  } else if (typeCode=="yajilin_regional" ) {
    this.typeProperties = decribePuzzleType()
      .useCornerTexts(true)
      .add(controller().forAuthor().cell().chooser()
        .addNumbers(0,20,{textColor: this.colorSchema.greyColor}))
      .add(controller().forAuthor().edge().toAreas().clickSwitch().withDrag()
        .addItem(StdItem.BLACK.asAreaBorder()))
      .add(controller().forSolver().cell().clickSwitch()
        .addItem(StdItem.BLACK.doNotSubmit())
        .addItem(StdItem.CROSS.doNotSubmit()))
      .add(controller().forSolver().connector().drag()
        .addItem(StdItem.LINE.submitAs('1')))
      .add(controller().forSolver().edge().clickSwitch()
        .addItem(StdItem.CROSS.doNotSubmit()))
      .build(this);
  } else if (typeCode=="kuroshiro") {
    this.typeProperties = decribePuzzleType()
      .add(controller().forAuthor().cell().clickSwitch()
        .addItem(StdItem.BLACK_CIRCLE)
        .addItem(StdItem.WHITE_CIRCLE))
      .add(controller().forSolver().connector().drag()
        .addItem(StdItem.LINE.submitAs('1')))
      .add(controller().forSolver().edge().clickSwitch()
        .addItem(StdItem.CROSS.doNotSubmit()))
      .build(this);

  } else if (typeCode=="alternate_loop") {
    this.typeProperties = decribePuzzleType()
      .add(controller().forAuthor().cell().clickSwitch()
        .addItem(StdItem.BLACK_CIRCLE)
        .addItem(StdItem.WHITE_CIRCLE))
      .add(controller().forSolver().connector().drag()
        .addItem(StdItem.LINE.submitAs('1')))
      .add(controller().forSolver().edge().clickSwitch()
        .addItem(StdItem.CROSS.doNotSubmit()))
      .build(this);

  } else if (typeCode=="masyu") {
    this.typeProperties = decribePuzzleType()
      .add(controller().forAuthor().cell().clickSwitch()
        .addItem(StdItem.BLACK_CIRCLE)
        .addItem(StdItem.WHITE_CIRCLE))
      .add(controller().forSolver().connector().drag()
        .addItem(StdItem.LINE.submitAs('1')))
      .add(controller().forSolver().edge().clickSwitch()
        .addItem(StdItem.CROSS.doNotSubmit()))
      .build(this);

  } else if (typeCode=="every_second_turn") {
    this.typeProperties = decribePuzzleType()
      .add(controller().forAuthor().cell().clickSwitch()
        .addItem(StdItem.WHITE_CIRCLE))
      .add(controller().forSolver().connector().drag()
        .addItem(StdItem.LINE.submitAs('1')))
      .add(controller().forSolver().edge().clickSwitch()
        .addItem(StdItem.CROSS.doNotSubmit()))
      .build(this);

  } else if (typeCode=="every_second_straight") {
    this.typeProperties = decribePuzzleType()
      .add(controller().forAuthor().cell().clickSwitch()
        .addItem(StdItem.WHITE_CIRCLE))
      .add(controller().forSolver().connector().drag()
        .addItem(StdItem.LINE.submitAs('1')))
      .add(controller().forSolver().edge().clickSwitch()
        .addItem(StdItem.CROSS.doNotSubmit()))
      .build(this);

  } else if (typeCode=="loop_minesweeper") {
    this.typeProperties = decribePuzzleType()
      .add(controller().forAuthor().cell().chooser()
        .addNumbers(0,8))
      .add(controller().forSolver().connector().drag()
        .addItem(StdItem.LINE.submitAs('1')))
      .add(controller().forSolver().cell().clickSwitch()
        .addItem(StdItem.CROSS.doNotSubmit())
        .addItem(StdItem.WHITE_CIRCLE.doNotSubmit()))
      .add(controller().forSolver().edge().clickSwitch()
        .addItem(StdItem.CROSS.doNotSubmit()))
      .build(this);

  } else if (typeCode=="loop_bounds") {
    this.typeProperties = decribePuzzleType()
      .add(controller().forAuthor().cell().chooser()
        .addNumbers(0,99))
      .add(controller().forSolver().connector().drag()
        .addItem(StdItem.LINE.submitAs('1')))
      .add(controller().forSolver().cell().clickSwitch()
        .addItem(StdItem.CROSS.doNotSubmit())
        .addItem(StdItem.WHITE_CIRCLE.doNotSubmit()))
      .add(controller().forSolver().edge().clickSwitch()
        .addItem(StdItem.CROSS.doNotSubmit()))
      .build(this);

  } else if (typeCode=="ring_ring") {
    this.typeProperties = decribePuzzleType()
      .add(controller().forAuthor().cell().clickSwitch()
        .addItem(StdItem.BLACK))
      .add(controller().forSolver().connector().drag()
        .addItem(StdItem.LINE.submitAs('1')))
      .add(controller().forSolver().edge().clickSwitch()
        .addItem(StdItem.CROSS.doNotSubmit()))
      .build(this);

  } else if (typeCode=="ring_ring_empty") {
    this.typeProperties = decribePuzzleType()
      .add(controller().forAuthor().cell().clickSwitch()
        .addItem(StdItem.BLACK))
      .add(controller().forSolver().connector().drag()
        .addItem(StdItem.LINE.submitAs('1')))
      .add(controller().forSolver().edge().clickSwitch()
        .addItem(StdItem.CROSS.doNotSubmit()))
      .add(controller().forSolver().cell().inner().noClue().clickSwitch()
        .addItem(StdItem.CROSS.doNotSubmit())
        .addItem(StdItem.WHITE_CIRCLE.doNotSubmit()))
      .build(this);

  } else if (typeCode=="ring_ring_max") {
    var maxValue = Math.max(this.rows - 1, this.cols - 1);
    this.typeProperties = decribePuzzleType()
      .useOuterCells(StdOuter.RIGHT | StdOuter.BOTTOM)
      .add(controller().forAuthor().cell().clickSwitch()
        .addItem(StdItem.BLACK))
      .add(controller().forAuthor().cell().outer().chooser()
        .addNumbers(0, maxValue))
      .add(controller().forSolver().connector().drag()
        .addItem(StdItem.LINE.submitAs('1')))
      .add(controller().forSolver().edge().clickSwitch()
        .addItem(StdItem.CROSS.doNotSubmit()))
      .add(controller().forSolver().cell().outer().clue().clickSwitch()
        .addItem(StdItem.WHITE_CIRCLE.doNotSubmit()))
      .build(this);

  } else if (typeCode=="ring_ring_nested") {
    var maxValue = Math.floor(Math.min(this.rows / 2, this.cols / 2));
    this.typeProperties = decribePuzzleType()
      .add(controller().forAuthor().cell().clickSwitch()
        .addItem(StdItem.BLACK))
      .add(controller().forAuthor().node().inner().clickSwitch()
          .addNumbers(0, maxValue, StdColor.BLACK))
      .add(controller().forSolver().connector().drag()
        .addItem(StdItem.LINE.submitAs('1')))
      .add(controller().forSolver().edge().clickSwitch()
        .addItem(StdItem.CROSS.doNotSubmit()))
      .add(controller().forSolver().node().inner().clue().clickSwitch()
          .addItem(StdItem.LIGHT_GREY.doNotSubmit()))
      .add(controller().forSolver().node().inner().noClue().clickSwitch()
          .addNumbers(0, maxValue, StdColor.LIGHT_GREY, undefined, false))
      .build(this);
  } else if (typeCode=="ring_ring_numbered") {
    var letters = self.dimensionExtra;
    this.typeProperties = decribePuzzleType()
      .add(controller().forAuthor().cell().chooser()
        .addItem(StdItem.BLACK)
        .addLetters(letters))
      .add(controller().forSolver().connector().drag()
        .addItem(StdItem.LINE.submitAs('1')))
      .add(controller().forSolver().edge().clickSwitch()
        .addItem(StdItem.CROSS.doNotSubmit()))
      .build(this);
        
  } else if (typeCode=="ring_ring_square_rectangle") {
      this.typeProperties = decribePuzzleType()
        .add(controller().forAuthor().cell().clickSwitch()
          .addItem(StdItem.BLACK)
          .addItem(StdItem.WHITE_CIRCLE)
          .addItem(StdItem.BLACK_CIRCLE))
        .add(controller().forSolver().connector().drag()
          .addItem(StdItem.LINE.submitAs('1')))
        .add(controller().forSolver().edge().clickSwitch()
          .addItem(StdItem.CROSS.doNotSubmit()))
        .build(this);

  } else if (typeCode=="ring_ring_battenberg") {
    let EMPTY_BATTENBERG = controllerItem({image: "battenberg_small_e", returnValue: "battenberg"})
    let LEFT_BATTENBERG = controllerItem({image: "battenberg_small", returnValue: "battenberg"})
    let RIGHT_BATTENBERG = controllerItem({image: "battenberg_small_1", returnValue: "battenberg"})
    this.typeProperties = decribePuzzleType()
      .add(controller().forAuthor().cell().clickSwitch()
        .addItem(EMPTY_BATTENBERG)
        .addItem(StdItem.BLACK))
      .add(controller().forSolver().connector().drag()
        .addItem(StdItem.LINE.submitAs('1')))
      .add(controller().forSolver().edge().clickSwitch()
        .addItem(StdItem.CROSS.doNotSubmit()))
      .add(controller().forSolver().cell().clue(EMPTY_BATTENBERG).clickSwitch()
        .addItem(LEFT_BATTENBERG.doNotSubmit())
        .addItem(RIGHT_BATTENBERG.doNotSubmit()))
      .build(this);

  } else if (typeCode=="four_winds") {
    this.typeProperties = decribePuzzleType()
      .add(controller().forAuthor().cell().chooser()
        .addNumbers(0,99))
      .add(controller().forSolver().cell().clue().clickSwitch()
        .addItem(StdItem.WHITE_CIRCLE.doNotSubmit()))
      .add(controller().forSolver().cell().noClue().clickSwitch()
        .addItem(StdItem.WHITE_DOT.doNotSubmit()))
      .add(controller().forSolver().connector().drag()
        .addItem(StdItem.LINE.submitAs('1')))
      .build(this);

  } else if (typeCode=="mid_loop") {
    this.typeProperties = decribePuzzleType()
      .add(controller().forAuthor().cell().clickSwitch()
        .addItem(StdItem.SMALL_CIRCLE))
      .add(controller().forAuthor().edge().clickSwitch()
        .addItem(StdItem.BLACK_CIRCLE))
      .add(controller().forSolver().connector().drag()
        .addItem(StdItem.LINE.submitAs('1')))
      .add(controller().forSolver().edge().noClue().clickSwitch()
        .addItem(StdItem.CROSS.doNotSubmit()))
      .build(this);

  } else {

  var typeProperties = {}

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
        .addItem(StdItem.WHITE_CIRCLE.doNotSubmit().keepPencil()))
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

krammaPuzzleType.prototype.setTypeProperties = function(typeCode) {
  if (typeCode =="kaitoramma") {
    this.typeProperties = decribePuzzleType()
      .add(controller().forAuthor().cell().clickSwitch()
        .addItem(StdItem.WHITE_CIRCLE)
        .addItem(StdItem.BLACK_CIRCLE))
      .add(controller().forSolver().edge().toAreas().clickSwitch().withDrag()
        .addItem(StdItem.BLACK.asAreaBorder())
        .addItem(StdItem.CROSS.doNotSubmit()))
      .add(controller().forSolver().edge().toAreas().drag()
        .addItem(StdItem.BLACK.asAreaBorder()))
      .build(this);
  }
}

krammaPuzzleType.prototype.extendLine = function(edge) {
  const side = edge.side;
  const dataToSet = Object.assign({}, edge.data)
  const pencilDataToSet = Object.assign({}, edge.pencilData)
  if (side%2 == 0) {
    // horizontal line
    const row = edge.row;
    for (let i=0;i<this.cols;i++) {
      if (i!=edge.col) {
        this.edges[row][i][side].switchToData(dataToSet, true);
        this.edges[row][i][side].setPencilData(pencilDataToSet, true);
      }
    }
  } else {
    // vertical line
    const col = edge.col;
    for (let i=0;i<this.rows;i++) {
      if (i!=edge.row) {
        this.edges[i][col][side].switchToData(dataToSet, true);
        this.edges[i][col][side].setPencilData(pencilDataToSet, true);
      }
    }
  }
}

squarePuzzleEdge.prototype.revertTo = function(oldData, oldPencilData, noLogging) {
  squareGridElement.prototype.revertTo.call(this, oldData, oldPencilData, noLogging);
  if (this.puzzle instanceof krammaPuzzleType) {
    if (!noLogging) {
      this.puzzle.extendLine(this);
    }
  }
}

squarePuzzleEdge.prototype.switchToData = function(data, noLogging) {
  squareGridElement.prototype.switchToData.call(this, data, noLogging);
  if (this.puzzle instanceof krammaPuzzleType) {
    if (!noLogging) {
      this.puzzle.extendLine(this);
    }
  }
}

squarePuzzleEdge.prototype.setPencilData = function(data, noLogging) {
  squareGridElement.prototype.setPencilData.call(this, data, noLogging);
  if (this.puzzle instanceof krammaPuzzleType) {
    if (!noLogging) {
      this.puzzle.extendLine(this);
    }
  }
}

squarePuzzleNode.prototype.processDragMove = function(startElement) {
  if (!this.processDragEnd(startElement)) {
    return false;
  }
  if (this.puzzle instanceof krammaPuzzleType) {
    return {stopDrag: true};
  }
  return {newMouseStartElement: this};
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
