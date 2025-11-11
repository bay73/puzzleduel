define(["square","controller_helper"], function() {

 connectorPuzzleType = function(puzzleData, controls, settings) {
  squarePuzzle.call(this, puzzleData, controls, settings);
}

Object.setPrototypeOf(connectorPuzzleType.prototype, squarePuzzle.prototype);


connectorPuzzleType.prototype.setTypeProperties = function(typeCode) {
  var self = this;

  if (typeCode =="country_road") {
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

  }
}
})