pentasightTestSuite = uiTestSuite("Pentasight", "squarepuzzle", "squarePuzzleType",

beforeSuite((suite, cb)=> {
  // Emulates one mouse drag which goes through the centers of the given cells.
  suite.dragThrough = function(puzzle, cells) {
    puzzle.controller.onMouseDown(suite.mouseEvent(suite.cellPoint(puzzle, cells[0])));
    for (let i = 1; i < cells.length; i++) {
      puzzle.controller.onMouseMove(suite.mouseEvent(suite.cellPoint(puzzle, cells[i])));
    }
    puzzle.controller.onMouseUp(suite.mouseEvent(suite.cellPoint(puzzle, cells[cells.length - 1])));
  };
  // Puzzle from the checker tests: # is a given cell of a pentomino,
  // number is the amount of white cells seen from the cell (the cell itself is white).
  //     a b c d e f
  //  1  # . . . . .
  //  2  . . . . . .
  //  3  7 . . . 4 .
  //  4  . . . . . .
  //  5  . . 7 . . .
  //  6  . . . . . .
  suite.CLUES = {"a1": "black", "a3": "7", "e3": "4", "c5": "7"};
  cb();
}),

// Controller definition tests
test('Solver controllers',(suite) => {
  let puzzle = suite.showPuzzle("pentasight", "6x6-IV", suite.CLUES);
  puzzle.start();

  assert("Empty cell chooser").that(puzzle.cells[0][1].chooserValues).isNull();
  assert("Empty cell click").that(puzzle.cells[0][1].clickSwitch).containsExactly([{}, {color: puzzle.colorSchema.greyColor, returnValue: 'black'}, {image: 'cross'}]);
  assert("Empty cell drag processor").that(puzzle.cells[0][1].dragProcessor).isNotNull();
  assert("Number cell chooser").that(puzzle.cells[2][0].chooserValues).isNull();
  assert("Number cell click").that(puzzle.cells[2][0].clickSwitch).containsExactly([{text: '7'}, {text: '7', image: 'cross'}]);
  assert("Number cell drag processor").that(puzzle.cells[2][0].dragProcessor).isNotNull();
  assert("Black cell chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("Edge click").that(puzzle.edges[0][0][1].clickSwitch).isNull();
  assert("Edge drag").that(puzzle.edges[0][0][1].dragSwitch).isNull();
}),

test('Author controllers',(suite) => {
  let puzzle = suite.showPuzzle("pentasight", "6x6-IV");
  puzzle.edit();

  // Empty item, cross, black cell and numbers from 1 to 29.
  assert("Cell chooser").that(puzzle.cells[0][0].chooserValues).containsAtLeast(
    [{}, {image: 'cross', returnValue: 'cross'}, {color: puzzle.colorSchema.clueColor, returnValue: 'black'},
     {text: '1', returnValue: '1'}, {text: '2', returnValue: '2'}, {text: '10', returnValue: '10'}, {text: '29', returnValue: '29'}]);
  assert("Number of items in the cell chooser").that(puzzle.cells[0][0].chooserValues.length).isEqualTo(32);
  assert("Cell click").that(puzzle.cells[0][0].clickSwitch).isNull();
  assert("Cell drag processor").that(puzzle.cells[0][0].dragProcessor).isNull();
  assert("Edge click").that(puzzle.edges[0][0][1].clickSwitch).isNull();
}),

// Clues display tests
test('Show clues',(suite) => {
  let puzzle = suite.showPuzzle("pentasight", "6x6-IV", {"a1": "black", "a3": "7", "e3": "4", "c5": "7", "f6": "cross"});
  puzzle.start();

  assert("Black clue").that(puzzle.cells[0][0].data).isEqualTo({color: puzzle.colorSchema.clueColor});
  assert("Black clue is not submitted").that(puzzle.cells[0][0].getValue()).isNull();
  assert("Number clue a3").that(puzzle.cells[2][0].data).isEqualTo({text: '7'});
  assert("Number clue is not submitted").that(puzzle.cells[2][0].getValue()).isNull();
  assert("Number clue e3").that(puzzle.cells[2][4].data).isEqualTo({text: '4'});
  assert("Cross clue").that(puzzle.cells[5][5].data).isEqualTo({image: 'cross'});
  assert("Cross clue is not submitted").that(puzzle.cells[5][5].getValue()).isNull();
  assert("Cell without clue").that(puzzle.cells[0][1].data).isEqualTo({});

  let texts = $(suite.GRID_SELECTOR + " text").map((i, element) => $(element).text()).get();
  assert("Texts in the grid").that(texts).isEqualTo(["7", "4", "7"]);
}),

// Mouse processing tests
test('Process clicks to empty cell',(suite) => {
  let puzzle = suite.showPuzzle("pentasight", "6x6-IV", suite.CLUES);
  puzzle.start();

  assert("Cell value before click").that(puzzle.cells[0][1].getValue()).isNull();
  assert("Cell data before click").that(puzzle.cells[0][1].data).isEqualTo({});

  suite.cellClick(puzzle, "b1");

  assert("Cell value after one click").that(puzzle.cells[0][1].getValue()).isEqualTo("black");
  assert("Cell data after one click").that(puzzle.cells[0][1].data).isEqualTo({color: puzzle.colorSchema.greyColor, returnValue: 'black'});

  suite.cellClick(puzzle, "b1");

  assert("Cell value after two clicks").that(puzzle.cells[0][1].getValue()).isNull();
  assert("Cell data after two clicks").that(puzzle.cells[0][1].data).isEqualTo({image: 'cross'});

  suite.cellClick(puzzle, "b1");

  assert("Cell value after three clicks").that(puzzle.cells[0][1].getValue()).isNull();
  assert("Cell data after three clicks").that(puzzle.cells[0][1].data).isEqualTo({});
  assert("Neighbour cell is not changed").that(puzzle.cells[0][2].data).isEqualTo({});
}),

test('Mark number clue by click',(suite) => {
  let puzzle = suite.showPuzzle("pentasight", "6x6-IV", suite.CLUES);
  puzzle.start();

  suite.cellClick(puzzle, "a3");

  assert("Clue data after click").that(puzzle.cells[2][0].data).isEqualTo({text: '7', image: 'cross'});
  assert("Clue value after click").that(puzzle.cells[2][0].getValue()).isNull();
  assert("Other clue").that(puzzle.cells[2][4].data).isEqualTo({text: '4'});

  suite.cellClick(puzzle, "a3");

  assert("Clue data after two clicks").that(puzzle.cells[2][0].data).isEqualTo({text: '7'});
  assert("Clue value after two clicks").that(puzzle.cells[2][0].getValue()).isNull();
}),

test('Black clue stays black after click',(suite) => {
  let puzzle = suite.showPuzzle("pentasight", "6x6-IV", suite.CLUES);
  puzzle.start();

  suite.cellClick(puzzle, "a1");

  assert("Clue color after click").that(puzzle.cells[0][0].data.color).isEqualTo(puzzle.colorSchema.clueColor);
  assert("Clue value after click").that(puzzle.cells[0][0].getValue()).isNull();

  suite.cellClick(puzzle, "a1");

  assert("Clue data after two clicks").that(puzzle.cells[0][0].data).isEqualTo({color: puzzle.colorSchema.clueColor});
}),

test('Paint pentomino by drag',(suite) => {
  let puzzle = suite.showPuzzle("pentasight", "6x6-IV", suite.CLUES);
  puzzle.start();

  // Shaded cell d3 is copied down and to the right.
  suite.cellClick(puzzle, "d3");
  suite.dragThrough(puzzle, ["d3", "d4", "d5", "e5", "f5"]);

  let shaded = {color: puzzle.colorSchema.greyColor, returnValue: 'black'};
  assert("Cell d3 after drag").that(puzzle.cells[2][3].data).isEqualTo(shaded);
  assert("Cell d4 after drag").that(puzzle.cells[3][3].data).isEqualTo(shaded);
  assert("Cell d5 after drag").that(puzzle.cells[4][3].data).isEqualTo(shaded);
  assert("Cell e5 after drag").that(puzzle.cells[4][4].data).isEqualTo(shaded);
  assert("Cell f5 after drag").that(puzzle.cells[4][5].data).isEqualTo(shaded);
  assert("Cell f5 value").that(puzzle.cells[4][5].getValue()).isEqualTo('black');
  assert("Cell e4 is not changed").that(puzzle.cells[3][4].data).isEqualTo({});

  // Clues are not changed by drag.
  suite.dragThrough(puzzle, ["d3", "e3", "f3"]);

  assert("Number clue after drag").that(puzzle.cells[2][4].data).isEqualTo({text: '4'});
  assert("Number clue value after drag").that(puzzle.cells[2][4].getValue()).isNull();
  assert("Cell f3 after drag").that(puzzle.cells[2][5].data).isEqualTo(shaded);

  suite.cellClick(puzzle, "b1");
  suite.dragThrough(puzzle, ["b1", "a1"]);

  assert("Black clue after drag").that(puzzle.cells[0][0].data).isEqualTo({color: puzzle.colorSchema.clueColor});
}),

test('Mark crosses by drag from number clue',(suite) => {
  let puzzle = suite.showPuzzle("pentasight", "6x6-IV", suite.CLUES);
  puzzle.start();

  // Cells seen from the number are white, drag from the number a3 marks them with crosses.
  suite.dragThrough(puzzle, ["a3", "b3", "c3"]);

  assert("Number clue after drag").that(puzzle.cells[2][0].data).isEqualTo({text: '7'});
  assert("Cell b3 after drag").that(puzzle.cells[2][1].data).isEqualTo({image: 'cross'});
  assert("Cell c3 after drag").that(puzzle.cells[2][2].data).isEqualTo({image: 'cross'});
  assert("Cell c3 value").that(puzzle.cells[2][2].getValue()).isNull();

  // Cross set by drag is copied further and can be changed by click.
  suite.dragThrough(puzzle, ["c3", "c4"]);
  assert("Cell c4 after drag").that(puzzle.cells[3][2].data).isEqualTo({image: 'cross'});

  suite.cellClick(puzzle, "c4");
  assert("Cell c4 after click").that(puzzle.cells[3][2].data).isEqualTo({});
}),

test('Erase by drag from empty cell',(suite) => {
  let puzzle = suite.showPuzzle("pentasight", "6x6-IV", suite.CLUES);
  puzzle.start();

  suite.cellClick(puzzle, "b5");
  suite.cellClick(puzzle, "b6");
  suite.cellClick(puzzle, "b6");

  suite.dragThrough(puzzle, ["b4", "b5", "b6"]);

  assert("Shaded cell after drag").that(puzzle.cells[4][1].data).isEqualTo({});
  assert("Shaded cell value after drag").that(puzzle.cells[4][1].getValue()).isNull();
  assert("Cross cell after drag").that(puzzle.cells[5][1].data).isEqualTo({});
}),

test('Choose clue in author mode',(suite) => {
  let puzzle = suite.showPuzzle("pentasight", "6x6-IV");
  puzzle.edit();

  assert("Chooser before click").that(puzzle.controller.chooserBuilder.chooserElements).isEmptyArray();

  suite.cellClick(puzzle, "b2");

  assert("Chooser after click").that(puzzle.controller.chooserBuilder.chooserElements).isNonEmptyArray();
  assert("Chooser is connected to the cell").that(puzzle.controller.chooserBuilder.element == puzzle.cells[1][1]).isEqualTo(true);
  assert("Cell data after click").that(puzzle.cells[1][1].data).isEqualTo({});

  // The second item of the chooser is cross, the third one is black cell, the next ones are numbers starting from 1.
  puzzle.cells[1][1].switchOnChooser(1);

  assert("Cross value").that(puzzle.cells[1][1].getValue()).isEqualTo('cross');
  assert("Cross data").that(puzzle.cells[1][1].data).isEqualTo({image: 'cross', returnValue: 'cross'});

  puzzle.cells[1][1].switchOnChooser(2);

  assert("Black cell value").that(puzzle.cells[1][1].getValue()).isEqualTo('black');
  assert("Black cell data").that(puzzle.cells[1][1].data).isEqualTo({color: puzzle.colorSchema.clueColor, returnValue: 'black'});

  puzzle.cells[1][1].switchOnChooser(11);

  assert("Value for number 9").that(puzzle.cells[1][1].getValue()).isEqualTo('9');
  assert("Data for number 9").that(puzzle.cells[1][1].data).isEqualTo({text: '9', returnValue: '9'});

  puzzle.cells[1][1].switchOnChooser(0);

  assert("Value after clean up").that(puzzle.cells[1][1].getValue()).isNull();
  assert("Data after clean up").that(puzzle.cells[1][1].data).isEqualTo({});
}),

test('Choose number greater than 9 in author mode',(suite) => {
  let puzzle = suite.showPuzzle("pentasight", "6x6-IV");
  puzzle.edit();

  // Numbers starting from 10 are replaced with "+10" item in the chooser.
  let items = puzzle.cells[0][0].chooserData();
  assert("Number of items in the chooser").that(items.length).isEqualTo(13);
  assert("The last item of the chooser").that(items[12]).isEqualTo({text: '+10'});
  assert("Item before the last one").that(items[11]).isEqualTo({text: '9', returnValue: '9'});

  // Choose 2 and then "+10" twice.
  puzzle.cells[0][0].switchOnChooser(4);
  puzzle.cells[0][0].switchOnChooser(12);

  assert("Cell value after +10").that(puzzle.cells[0][0].getValue()).isEqualTo('12');
  assert("Cell data after +10").that(puzzle.cells[0][0].data).isEqualTo({text: '12', returnValue: '12'});

  puzzle.cells[0][0].switchOnChooser(12);

  assert("Cell value after the second +10").that(puzzle.cells[0][0].getValue()).isEqualTo('22');
}),

// Cells shaded by drag from a given black cell are the same as cells shaded by click: they are submitted.
test('Drag from given black cell shades cells',(suite) => {
  let puzzle = suite.showPuzzle("pentasight", "6x6-IV", {"a1": "black", "d1": "3"});
  puzzle.start();

  // One drag from the given black cell a1 down to a2 and a3.
  puzzle.controller.onMouseDown(suite.mouseEvent(suite.cellPoint(puzzle, "a1")));
  puzzle.controller.onMouseMove(suite.mouseEvent(suite.cellPoint(puzzle, "a2")));
  puzzle.controller.onMouseMove(suite.mouseEvent(suite.cellPoint(puzzle, "a3")));
  puzzle.controller.onMouseUp(suite.mouseEvent(suite.cellPoint(puzzle, "a3")));

  assert("Given black cell data").that(puzzle.cells[0][0].data).isEqualTo({color: puzzle.colorSchema.clueColor});
  assert("Value of a2").that(puzzle.cells[1][0].getValue()).isEqualTo("black");
  assert("Color of a2").that(puzzle.cells[1][0].data.color).isEqualTo(puzzle.colorSchema.greyColor);
  assert("Value of a3").that(puzzle.cells[2][0].getValue()).isEqualTo("black");
  assert("Submission data").that(puzzle.collectData()).isEqualTo({"a2": "black", "a3": "black"});

  // The shaded cell can be changed by click as usual: to cross and then to empty.
  suite.cellClick(puzzle, "a2");

  assert("Data of a2 after click").that(puzzle.cells[1][0].data).isEqualTo({image: 'cross'});
  assert("Submission data after click").that(puzzle.collectData()).isEqualTo({"a3": "black"});
}),

// Data collector tests
test('Data collector',(suite) => {
  let puzzle = suite.showPuzzle("pentasight", "6x6-IV", suite.CLUES);
  puzzle.start();

  // Solution from the checker tests: pentomino I (with the given cell a1) and pentomino V.
  //     a b c d e f
  //  1  # # # # # .
  //  2  . . . . . .
  //  3  7 . . # 4 .
  //  4  . . . # . .
  //  5  . . 7 # # #
  //  6  . . . . . .
  suite.cellClick(puzzle, "b1");
  suite.dragThrough(puzzle, ["b1", "c1", "d1", "e1"]);
  suite.cellClick(puzzle, "d3");
  suite.dragThrough(puzzle, ["d3", "d4", "d5", "e5", "f5"]);

  // Auxiliary marks are not submitted: crosses in the row 3 and column a, crosses at the solved clues a3 and e3.
  suite.dragThrough(puzzle, ["a3", "b3", "c3"]);
  suite.dragThrough(puzzle, ["a3", "a4", "a5", "a6"]);
  suite.cellClick(puzzle, "f1");
  suite.cellClick(puzzle, "f1");
  suite.cellClick(puzzle, "a3");
  suite.cellClick(puzzle, "e3");

  assert("Submission data").that(puzzle.collectData()).isEqualTo(
    {"b1": "black", "c1": "black", "d1": "black", "e1": "black", "d3": "black", "d4": "black", "d5": "black", "e5": "black", "f5": "black"});
}),

test('Author data collector',(suite) => {
  let puzzle = suite.showPuzzle("pentasight", "6x6-IV");
  puzzle.edit();

  assert("Data of the empty puzzle").that(puzzle.collectData()).isEqualTo({});

  // Clues from the checker tests: item 1 of the chooser is cross, item 2 is black cell, item N+2 is number N.
  puzzle.cells[0][0].switchOnChooser(2);
  puzzle.cells[2][0].switchOnChooser(9);
  puzzle.cells[2][4].switchOnChooser(6);
  puzzle.cells[4][2].switchOnChooser(9);

  assert("Puzzle data").that(puzzle.collectData()).isEqualTo(suite.CLUES);

  // Add cross to f6, replace black cell a1 by number 1 and remove number from c5.
  puzzle.cells[5][5].switchOnChooser(1);
  puzzle.cells[0][0].switchOnChooser(3);
  puzzle.cells[4][2].switchOnChooser(0);

  assert("Puzzle data after changes").that(puzzle.collectData()).isEqualTo({"a1": "1", "a3": "7", "e3": "4", "f6": "cross"});
}),

test('Author data collector for existing puzzle',(suite) => {
  let puzzle = suite.showPuzzle("pentasight", "6x6-IV", suite.CLUES);
  puzzle.edit();

  assert("Loaded black cell").that(puzzle.cells[0][0].getValue()).isEqualTo('black');
  assert("Loaded number").that(puzzle.cells[2][0].getValue()).isEqualTo('7');
  assert("Puzzle data").that(puzzle.collectData()).isEqualTo(suite.CLUES);
}),

);
