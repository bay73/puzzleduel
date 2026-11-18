define(["square","controller_helper"], function() {

sudokuPuzzleType = function(puzzleData, controls, settings) {
  squarePuzzle.call(this, puzzleData, controls, settings);
}

Object.setPrototypeOf(sudokuPuzzleType.prototype, squarePuzzle.prototype);

diagonalPuzzleType = function(puzzleData, controls, settings) {
  sudokuPuzzleType.call(this, puzzleData, controls, settings);
}

Object.setPrototypeOf(diagonalPuzzleType.prototype, sudokuPuzzleType.prototype);

sudokuPuzzleType.prototype.setTypeProperties = function(typeCode) {
  var self = this;

  if (typeCode=="sudoku_skyscrapers") {
    var maxValue = this.rows;
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

  } else if (typeCode=="sudoku_x_sums") {
    var maxValue = this.rows;
    var maxSum = maxValue * (maxValue+1) / 2;
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

  } else if (typeCode=="sudoku_numbered_rooms") {
    var maxValue = this.rows;
    this.typeProperties = decribePuzzleType()
      .useOuterCells(StdOuter.LEFT | StdOuter.RIGHT | StdOuter.TOP | StdOuter.BOTTOM)
      .add(controller().forAuthor().cell().inner().chooser()
        .addNumbers(1, maxValue))
      .add(controller().forAuthor().cell().outer().chooser()
        .addNumbers(1, maxValue))
      .add(controller().forSolver().cell().inner().noClue().chooser()
        .addNumbers(1, maxValue))
      .add(controller().forSolver().cell().outer().clue().clickSwitch()
        .addItem(StdItem.WHITE_CIRCLE.doNotSubmit()))
      .addUpgradeClue(clue=>clue=="white"?null:clue)
      .build(this);

  } else if (typeCode=="sudoku_index_to_one") {
    var maxValue = this.rows;
    this.typeProperties = decribePuzzleType()
      .useOuterCells(StdOuter.LEFT | StdOuter.RIGHT | StdOuter.TOP | StdOuter.BOTTOM)
      .add(controller().forAuthor().cell().inner().chooser()
        .addNumbers(1, maxValue))
      .add(controller().forAuthor().cell().outer().chooser()
        .addNumbers(1, maxValue))
      .add(controller().forSolver().cell().inner().noClue().chooser()
        .addNumbers(1, maxValue))
      .add(controller().forSolver().cell().outer().clue().clickSwitch()
        .addItem(StdItem.WHITE_CIRCLE.doNotSubmit()))
      .addUpgradeClue(clue=>clue=="white"?null:clue)
      .build(this);

  } else if (typeCode=="sudoku_odd_even_big_small") {
    var maxValue = this.rows;
    this.typeProperties = decribePuzzleType()
      .useOuterCells(StdOuter.LEFT | StdOuter.RIGHT | StdOuter.TOP | StdOuter.BOTTOM)
      .add(controller().forAuthor().cell().inner().chooser()
        .addNumbers(1, maxValue))
      .add(controller().forAuthor().cell().outer().chooser()
        .addItem(controllerItem({image: "odd", returnValue: "odd"}))
        .addItem(controllerItem({image: "even", returnValue: "even"}))
        .addItem(controllerItem({image: "big", returnValue: "big"}))
        .addItem(controllerItem({image: "small", returnValue: "small"})))
      .add(controller().forSolver().cell().inner().noClue().chooser()
        .addNumbers(1, maxValue))
      .add(controller().forSolver().cell().outer().clue().clickSwitch()
        .addItem(StdItem.BRIGHT.doNotSubmit()))
      .addUpgradeClue(clue=>clue=="white"?null:clue)
      .build(this);

  } else if (typeCode=="sudoku_classic" || typeCode == "sudoku_antiknight" || typeCode == "sudoku_notouch" || typeCode == "sudoku_queen") {
    var maxValue = this.rows;
    this.typeProperties = decribePuzzleType()
      .add(controller().forAuthor().cell().chooser()
        .addNumbers(1, maxValue))
      .add(controller().forSolver().cell().inner().noClue().chooser()
        .addNumbers(1, maxValue))
      .addUpgradeClue(clue=>clue=="white"?null:clue)
      .build(this);
  } else if (typeCode=="sudoku_search_max") {
    var maxValue = this.rows;
    this.typeProperties = decribePuzzleType()
      .add(controller().forAuthor().cell().chooser()
        .addNumbers(1, maxValue)
        .addItem(StdItem.BG_ARROW_U)
        .addItem(StdItem.BG_ARROW_R)
        .addItem(StdItem.BG_ARROW_D)
        .addItem(StdItem.BG_ARROW_L))
      .add(controller().forSolver().cell().inner().noClue().chooser()
        .addNumbers(1, maxValue))
      .add(controller().forSolver().cell().inner().clue(StdItem.BG_ARROW_U, StdItem.BG_ARROW_R, StdItem.BG_ARROW_D, StdItem.BG_ARROW_L).chooser()
        .addNumbers(1, maxValue, StdColor.STANDARD))
      .addUpgradeClue(clue=>clue=="white"?null:clue)
      .build(this);
    this.typeProperties.toChooserShow = function(value) {
      if (self.editMode==false) {
        let showValue = Object.assign({}, value);
        showValue.image = null;
        return showValue;
      } else {
        return value;
      }
    }
    this.typeProperties.toPencilShow = function(value) {
      if (self.editMode==false) {
        let showValue = Object.assign({}, value);
        showValue.image = null;
        return showValue;
      } else {
        return value;
      }
    }
  } else if ( typeCode == "sudoku_citywalk") {
    let paint2to7 = function(n) {
      if (n>=3&&n<=7) {
        return {color: self.colorSchema.lightGreyColor}
      } else {
        return {}
      }
    }
    var maxValue = this.rows;
    this.typeProperties = decribePuzzleType()
      .add(controller().forAuthor().cell().chooser()
        .addNumbers(1, maxValue, paint2to7))
      .add(controller().forSolver().cell().inner().noClue().chooser()
        .addNumbers(1, maxValue, paint2to7)
        .addItem(StdItem.LIGHT_GREY.doNotSubmit())
        .addItem(StdItem.WHITE_CIRCLE.doNotSubmit()))
      .addUpgradeClue(clue=>clue=="white"?null:clue)
      .build(this);
  } else if (typeCode=="sudoku_square_number") {
    var maxValue = this.rows;
    this.typeProperties = decribePuzzleType()
      .add(controller().forAuthor().cell().chooser()
        .addNumbers(1, maxValue))
      .add(controller().forAuthor().edge().minCells(2).clickSwitch()
        .addItem(StdItem.SMALL_CIRCLE.submitAs("black_circle")))
      .add(controller().forSolver().cell().inner().noClue().chooser()
        .addNumbers(1, maxValue))
      .build(this);
  } else if (typeCode=="sudoku_pair_sum") {
    var maxValue = this.rows;
    var maxSum = 2 * this.rows - 1
    this.typeProperties = decribePuzzleType()
      .add(controller().forAuthor().cell().chooser()
        .addNumbers(1, maxValue))
      .add(controller().forAuthor().edge().chooser()
        .addNumbers(3, maxSum, StdColor.WHITE_TEXT, "small_circle", i=>"+"+i))
      .add(controller().forSolver().cell().inner().noClue().chooser()
        .addNumbers(1, maxValue))
      .build(this);
  } else if (typeCode=="sudoku_difference") {
    var maxValue = this.rows;
    this.typeProperties = decribePuzzleType()
      .add(controller().forAuthor().cell().chooser()
        .addNumbers(1, maxValue))
      .add(controller().forAuthor().edge().chooser()
        .addNumbers(1, maxValue - 1, StdColor.WHITE_TEXT, "small_circle", i=>"-"+i))
      .add(controller().forSolver().cell().inner().noClue().chooser()
        .addNumbers(1, maxValue))
      .build(this);
  } else if (typeCode=="sudoku_blackout") {
    var maxValue = this.rows;
    this.typeProperties = decribePuzzleType()
      .add(controller().forAuthor().cell().chooser()
        .addNumbers(1, maxValue)
        .addItem(StdItem.BLACK))
      .add(controller().forSolver().cell().inner().noClue().chooser()
        .addNumbers(1, maxValue))
      .build(this);
  } else if (typeCode=="sudoku_consecutive") {
    var maxValue = this.rows;
    this.typeProperties = decribePuzzleType()
      .add(controller().forAuthor().cell().chooser()
        .addNumbers(1, maxValue))
      .add(controller().forAuthor().edge().minCells(2).clickSwitch()
        .addItem(StdItem.WHITE_DOT))
      .add(controller().forSolver().cell().inner().noClue().chooser()
        .addNumbers(1, maxValue))
      .build(this);
  } else if (typeCode=="sudoku_battenberg") {
    var maxValue = this.rows;
    this.typeProperties = decribePuzzleType()
      .add(controller().forAuthor().cell().chooser()
        .addNumbers(1, maxValue))
      .add(controller().forAuthor().node().minCells(4).clickSwitch()
        .addItem(StdItem.BATTENBERG))
      .add(controller().forSolver().cell().inner().noClue().chooser()
        .addNumbers(1, maxValue)
        .addItem(controllerItem({image: "odd_1"}))
        .addItem(controllerItem({image: "even_1"})))
      .build(this);
  } else if (["sudoku_fortress", "sudoku_selfjoint", "sudoku_extra_regions", "sudoku_same_sum",
              "sudoku_hundred", "sudoku_even_odd", "sudoku_odd"].includes(typeCode)) {
    // Sudoku with grey cells: the author marks a cell as grey (with or without a digit),
    // the solver enters digits both to white and to grey cells.
    var maxValue = this.rows;
    var grey = {color: "grey"};
    var greyCell = controllerItem({color: "grey", returnValue: "-"});
    var asGrey = i => "-" + i;
    var author = controller().forAuthor().cell().chooser();
    if (typeCode=="sudoku_odd") {
      author.addNumbers(1, maxValue).addItem(greyCell);
    } else if (typeCode=="sudoku_even_odd") {
      for (var i=1; i<=maxValue; i++) {
        if (i%2==0) {
          author.addNumbers(i, i, grey, undefined, asGrey);
        } else {
          author.addNumbers(i, i);
        }
      }
      author.addItem(greyCell);
    } else {
      author.addNumbers(1, maxValue).addItem(greyCell).addNumbers(1, maxValue, grey, undefined, asGrey);
    }
    this.typeProperties = decribePuzzleType()
      .add(author)
      .add(controller().forSolver().cell().inner().noText().chooser()
        .addNumbers(1, maxValue, {textColor: puzzle => puzzle.colorSchema.textColor}))
      .build(this);
    // Solver's chooser shows digits without the color of the cell.
    this.typeProperties.toChooserShow = function(value) {
      let showValue = Object.assign({}, value);
      if (!self.editMode) {
        delete showValue.color;
      }
      return showValue;
    }
    if (typeCode=="sudoku_odd" || typeCode=="sudoku_even_odd") {
      // Author's chooser doesn't contain all combinations of digit and color for these types,
      // but any combination is accepted as a clue.
      this.typeProperties.decodeClue = function(value) {
        if (value=="-") {
          return {color: "grey"};
        } else if (value.startsWith("-")) {
          return {color: "grey", text: value.substring(1)};
        } else {
          return {text: value};
        }
      }
    }
  }
  // Cells show all digits at once, even for sudoku bigger than 9.
  // "+10" item is used only for outer clues of X Sums, where sums can be big.
  var plus10Item = this.typeProperties.usePlus10;
  this.typeProperties.usePlus10 = false;
  if (typeCode=="sudoku_x_sums") {
    this.typeProperties.usePlus10 = plus10Item;
    this.typeProperties.usePlus10For = element => element.outerCell;
  }
}

diagonalPuzzleType.prototype.setTypeProperties = function(typeCode) {
  var self = this;

  if (typeCode=="sudoku_diagonal") {
    var maxValue = this.rows;
    this.typeProperties = decribePuzzleType()
      .add(controller().forAuthor().cell().chooser()
        .addNumbers(1, maxValue))
      .add(controller().forSolver().cell().inner().noClue().chooser()
        .addNumbers(1, maxValue))
      .addUpgradeClue(clue=>clue=="white"?null:clue)
      .build(this);
  } else if (typeCode=="sudoku_antidiagonal") {
    var maxValue = this.rows;
    this.typeProperties = decribePuzzleType()
      .add(controller().forAuthor().cell().chooser()
        .addNumbers(1, maxValue))
      .add(controller().forSolver().cell().inner().noClue().chooser()
        .addNumbers(1, maxValue))
      .addUpgradeClue(clue=>clue=="white"?null:clue)
      .build(this);
  }
  this.typeProperties.usePlus10 = false;
}
sudokuPuzzleType.prototype.createBoard = function() {
  squarePuzzle.prototype.createBoard.call(this);
  if (this.cols ==4) {
    var dx = 2;
    var dy = 2;
  } else if (this.cols ==6) {
    var dx = 3;
    var dy = 2;
  } else if (this.cols ==8) {
    var dx = 4;
    var dy = 2;
  } else if (this.cols ==9) {
    var dx = 3;
    var dy = 3;
  } else if (this.cols ==10) {
    var dx = 5;
    var dy = 2;
  } else if (this.cols ==12) {
    var dx = 4;
    var dy = 3;
  } else if (this.cols ==16) {
    var dx = 4;
    var dy = 4;
  }
  for (var x=dx-1;x<this.cols;x+=dx) {
    for (var y=0;y<this.rows;y++) {
      this.edges[y][x][1].isFinal = true;
      this.edges[y][x][1].data = {text: null, image: null, color: this.colorSchema.gridColor, textColor: null};
    }
  }
  for (var x=0;x<this.cols;x++) {
    for (var y=dy-1;y<this.rows;y+=dy) {
      this.edges[y][x][2].isFinal = true;
      this.edges[y][x][2].data = {text: null, image: null, color: this.colorSchema.gridColor, textColor: null};
    }
  }
}

diagonalPuzzleType.prototype.drawBoard = function() {
  sudokuPuzzleType.prototype.drawBoard.call(this);
  let gap = Math.ceil(this.size.unitSize/12);
  var attr = {
    "stroke-linecap": "round",
    "stroke": this.colorSchema.gridColor,
    "stroke-dasharray": gap +"," + (gap*1.5)
  };
  var line = this.snap.line(
    this.size.leftGap, this.size.topGap,
    this.size.leftGap + this.cols * this.size.unitSize, this.size.topGap + this.rows * this.size.unitSize);
  line.attr(attr);
  line = this.snap.line(
    this.size.leftGap + this.cols * this.size.unitSize, this.size.topGap,
    this.size.leftGap, this.size.topGap + this.rows * this.size.unitSize);
  line.attr(attr);
}

})
