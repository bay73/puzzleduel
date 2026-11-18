battleshipsMinesweeperTestSuite = uiTestSuite("Minesweeper Battleships", "squarepuzzle", "squarePuzzleType",

beforeSuite((suite, cb)=> {
  // Emulates one mouse drag which goes through the centers of the given cells.
  suite.dragThrough = function(puzzle, cells) {
    puzzle.controller.onMouseDown(suite.mouseEvent(suite.cellPoint(puzzle, cells[0])));
    for (let i = 1; i < cells.length; i++) {
      puzzle.controller.onMouseMove(suite.mouseEvent(suite.cellPoint(puzzle, cells[i])));
    }
    puzzle.controller.onMouseUp(suite.mouseEvent(suite.cellPoint(puzzle, cells[cells.length - 1])));
  };
  // Puzzle from the checker tests: ~ is a cell without ship,
  // number is the amount of ship cells among the neighbours of the cell (including diagonal ones).
  //     a b c d e f
  //  1  . . . ~ . .
  //  2  . 5 . 4 . .
  //  3  . . . . . .
  //  4  . . . . . .
  //  5  . . . 2 . .
  //  6  . . . . . 0
  suite.CLUES = {"d1": "wave", "b2": "5", "d2": "4", "d5": "2", "f6": "0"};
  cb();
}),

// Controller definition tests
test('Solver controllers',(suite) => {
  let puzzle = suite.showPuzzle("battleships_minesweeper", "6x6-ship3", suite.CLUES);
  puzzle.start();

  assert("Empty cell chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("Empty cell click").that(puzzle.cells[0][0].clickSwitch).containsExactly([{}, {color: puzzle.colorSchema.greyColor, returnValue: '1'}, {image: 'wave'}]);
  assert("Empty cell drag processor").that(puzzle.cells[0][0].dragProcessor).isNotNull();
  assert("Wave cell chooser").that(puzzle.cells[0][3].chooserValues).isNull();
  assert("Wave cell click").that(puzzle.cells[0][3].clickSwitch).isNull();
  assert("Wave cell drag processor").that(puzzle.cells[0][3].dragProcessor).isNotNull();
  assert("Number cell chooser").that(puzzle.cells[1][1].chooserValues).isNull();
  assert("Number cell click").that(puzzle.cells[1][1].clickSwitch).containsExactly([{text: '5'}, {text: '5', image: 'white_circle'}]);
  assert("Number cell drag processor").that(puzzle.cells[1][1].dragProcessor).isNotNull();
  assert("Edge click").that(puzzle.edges[0][0][1].clickSwitch).isNull();
  assert("Edge drag").that(puzzle.edges[0][0][1].dragSwitch).isNull();
}),

test('Author controllers',(suite) => {
  let puzzle = suite.showPuzzle("battleships_minesweeper", "6x6-ship3");
  puzzle.edit();

  let numberItem = function(number) {
    return {text: number, returnValue: number};
  }
  assert("Cell chooser").that(puzzle.cells[0][0].chooserValues).containsExactly(
    [{}, {image: 'wave', returnValue: 'wave'}, numberItem('0'), numberItem('1'), numberItem('2'), numberItem('3'), numberItem('4'),
     numberItem('5'), numberItem('6'), numberItem('7'), numberItem('8')]);
  assert("Cell click").that(puzzle.cells[0][0].clickSwitch).isNull();
  assert("Cell drag processor").that(puzzle.cells[0][0].dragProcessor).isNull();
  assert("Edge click").that(puzzle.edges[0][0][1].clickSwitch).isNull();
}),

// Clues display tests
test('Show clues',(suite) => {
  let puzzle = suite.showPuzzle("battleships_minesweeper", "6x6-ship3", suite.CLUES);
  puzzle.start();

  assert("Wave clue").that(puzzle.cells[0][3].data).isEqualTo({image: 'wave'});
  assert("Wave clue is not a part of the solution").that(puzzle.cells[0][3].getValue()).isNull();
  assert("Number clue").that(puzzle.cells[1][1].data).isEqualTo({text: '5'});
  assert("Number clue is not a part of the solution").that(puzzle.cells[1][1].getValue()).isNull();
  assert("Cell without clue").that(puzzle.cells[0][0].data).isEqualTo({});

  let texts = $(suite.GRID_SELECTOR + " text").map((i, element) => $(element).text()).get();
  assert("Texts in the grid").that(texts).isEqualTo(["5", "4", "2", "0"]);
}),

// Mouse processing tests
test('Process clicks to empty cell',(suite) => {
  let puzzle = suite.showPuzzle("battleships_minesweeper", "6x6-ship3", suite.CLUES);
  puzzle.start();

  assert("Cell value before click").that(puzzle.cells[0][0].getValue()).isNull();
  assert("Cell data before click").that(puzzle.cells[0][0].data).isEqualTo({});

  suite.cellClick(puzzle, "a1");

  assert("Cell value after one click").that(puzzle.cells[0][0].getValue()).isEqualTo("1");
  assert("Cell data after one click").that(puzzle.cells[0][0].data).isEqualTo({color: puzzle.colorSchema.greyColor, returnValue: '1'});

  suite.cellClick(puzzle, "a1");

  assert("Cell value after two clicks").that(puzzle.cells[0][0].getValue()).isNull();
  assert("Cell data after two clicks").that(puzzle.cells[0][0].data).isEqualTo({image: 'wave'});

  suite.cellClick(puzzle, "a1");

  assert("Cell value after three clicks").that(puzzle.cells[0][0].getValue()).isNull();
  assert("Cell data after three clicks").that(puzzle.cells[0][0].data).isEqualTo({});
  assert("Neighbour cell is not changed").that(puzzle.cells[0][1].data).isEqualTo({});
}),

test('Wave clue is not changed by click',(suite) => {
  let puzzle = suite.showPuzzle("battleships_minesweeper", "6x6-ship3", suite.CLUES);
  puzzle.start();

  suite.cellClick(puzzle, "d1");

  assert("Clue data after click").that(puzzle.cells[0][3].data).isEqualTo({image: 'wave'});
  assert("Clue value after click").that(puzzle.cells[0][3].getValue()).isNull();
}),

test('Mark number clue by click',(suite) => {
  let puzzle = suite.showPuzzle("battleships_minesweeper", "6x6-ship3", suite.CLUES);
  puzzle.start();

  suite.cellClick(puzzle, "b2");

  assert("Clue data after click").that(puzzle.cells[1][1].data).isEqualTo({text: '5', image: 'white_circle'});
  assert("Clue value after click").that(puzzle.cells[1][1].getValue()).isNull();

  suite.cellClick(puzzle, "b2");

  assert("Clue data after two clicks").that(puzzle.cells[1][1].data).isEqualTo({text: '5'});
  assert("Clue value after two clicks").that(puzzle.cells[1][1].getValue()).isNull();
}),

test('Paint ship by drag',(suite) => {
  let puzzle = suite.showPuzzle("battleships_minesweeper", "6x6-ship3", suite.CLUES);
  puzzle.start();

  // Ship cell in a1 is copied along the first row, wave clue in d1 is skipped.
  suite.cellClick(puzzle, "a1");
  suite.dragThrough(puzzle, ["a1", "b1", "c1", "d1", "e1"]);

  let ship = {color: puzzle.colorSchema.greyColor, returnValue: '1'};
  assert("Cell a1 after drag").that(puzzle.cells[0][0].data).isEqualTo(ship);
  assert("Cell b1 after drag").that(puzzle.cells[0][1].data).isEqualTo(ship);
  assert("Cell c1 after drag").that(puzzle.cells[0][2].data).isEqualTo(ship);
  assert("Wave clue after drag").that(puzzle.cells[0][3].data).isEqualTo({image: 'wave'});
  assert("Cell e1 after drag").that(puzzle.cells[0][4].data).isEqualTo(ship);
  assert("Cell b1 value").that(puzzle.cells[0][1].getValue()).isEqualTo('1');
  assert("Cell f1 is not reached").that(puzzle.cells[0][5].data).isEqualTo({});

  // Number clue in b2 is skipped too.
  suite.cellClick(puzzle, "a2");
  suite.dragThrough(puzzle, ["a2", "b2", "c2"]);

  assert("Number clue after drag").that(puzzle.cells[1][1].data).isEqualTo({text: '5'});
  assert("Number clue value after drag").that(puzzle.cells[1][1].getValue()).isNull();
  assert("Cell c2 after drag").that(puzzle.cells[1][2].data).isEqualTo(ship);
}),

test('Copy wave by drag',(suite) => {
  let puzzle = suite.showPuzzle("battleships_minesweeper", "6x6-ship3", suite.CLUES);
  puzzle.start();

  // Wave is copied from the clue cell d1 to e1 and f1.
  suite.dragThrough(puzzle, ["d1", "e1", "f1"]);

  assert("Clue cell after drag").that(puzzle.cells[0][3].data).isEqualTo({image: 'wave'});
  assert("Cell e1 after drag").that(puzzle.cells[0][4].data).isEqualTo({image: 'wave'});
  assert("Cell f1 after drag").that(puzzle.cells[0][5].data).isEqualTo({image: 'wave'});
  assert("Cell f1 value").that(puzzle.cells[0][5].getValue()).isNull();

  // Number clue d2 is not replaced by wave.
  suite.dragThrough(puzzle, ["d1", "d2", "d3"]);

  assert("Number clue after drag").that(puzzle.cells[1][3].data).isEqualTo({text: '4'});
  assert("Cell d3 after drag").that(puzzle.cells[2][3].data).isEqualTo({image: 'wave'});

  // Wave set by solver can be changed by click.
  suite.cellClick(puzzle, "d3");
  assert("Cell d3 after click").that(puzzle.cells[2][3].data).isEqualTo({});
}),

test('Mark waves by drag from number clue',(suite) => {
  let puzzle = suite.showPuzzle("battleships_minesweeper", "6x6-ship3", suite.CLUES);
  puzzle.start();

  // Cell with number can't contain ship, so drag from the number b2 marks cells b3 and b4 with waves.
  suite.dragThrough(puzzle, ["b2", "b3", "b4"]);

  assert("Number clue after drag").that(puzzle.cells[1][1].data).isEqualTo({text: '5'});
  assert("Cell b3 after drag").that(puzzle.cells[2][1].data).isEqualTo({image: 'wave'});
  assert("Cell b4 after drag").that(puzzle.cells[3][1].data).isEqualTo({image: 'wave'});
  assert("Cell b4 value").that(puzzle.cells[3][1].getValue()).isNull();

  // Circle of the marked number is not copied.
  suite.cellClick(puzzle, "d5");
  suite.dragThrough(puzzle, ["d5", "d6"]);

  assert("Marked number clue after drag").that(puzzle.cells[4][3].data).isEqualTo({text: '2', image: 'white_circle'});
  assert("Cell d6 after drag").that(puzzle.cells[5][3].data).isEqualTo({image: 'wave'});

  // Other number clue is not changed.
  suite.dragThrough(puzzle, ["b2", "c2", "d2"]);

  assert("Cell c2 after drag").that(puzzle.cells[1][2].data).isEqualTo({image: 'wave'});
  assert("Number clue d2 after drag").that(puzzle.cells[1][3].data).isEqualTo({text: '4'});
}),

test('Erase by drag from empty cell',(suite) => {
  let puzzle = suite.showPuzzle("battleships_minesweeper", "6x6-ship3", suite.CLUES);
  puzzle.start();

  suite.cellClick(puzzle, "a3");
  suite.cellClick(puzzle, "a4");
  suite.cellClick(puzzle, "a4");

  suite.dragThrough(puzzle, ["a2", "a3", "a4"]);

  assert("Ship cell after drag").that(puzzle.cells[2][0].data).isEqualTo({});
  assert("Ship cell value after drag").that(puzzle.cells[2][0].getValue()).isNull();
  assert("Wave cell after drag").that(puzzle.cells[3][0].data).isEqualTo({});
}),

test('Choose clue in author mode',(suite) => {
  let puzzle = suite.showPuzzle("battleships_minesweeper", "6x6-ship3");
  puzzle.edit();

  assert("Chooser before click").that(puzzle.controller.chooserBuilder.chooserElements).isEmptyArray();

  suite.cellClick(puzzle, "b2");

  assert("Chooser after click").that(puzzle.controller.chooserBuilder.chooserElements).isNonEmptyArray();
  assert("Chooser is connected to the cell").that(puzzle.controller.chooserBuilder.element == puzzle.cells[1][1]).isEqualTo(true);
  assert("Cell data after click").that(puzzle.cells[1][1].data).isEqualTo({});

  // The second item of the chooser is wave, the next ones are numbers starting from 0.
  puzzle.cells[1][1].switchOnChooser(1);

  assert("Wave value").that(puzzle.cells[1][1].getValue()).isEqualTo('wave');
  assert("Wave data").that(puzzle.cells[1][1].data).isEqualTo({image: 'wave', returnValue: 'wave'});

  puzzle.cells[1][1].switchOnChooser(2);

  assert("Value for number 0").that(puzzle.cells[1][1].getValue()).isEqualTo('0');
  assert("Data for number 0").that(puzzle.cells[1][1].data).isEqualTo({text: '0', returnValue: '0'});

  puzzle.cells[1][1].switchOnChooser(10);

  assert("Value for number 8").that(puzzle.cells[1][1].getValue()).isEqualTo('8');
  assert("Data for number 8").that(puzzle.cells[1][1].data).isEqualTo({text: '8', returnValue: '8'});

  puzzle.cells[1][1].switchOnChooser(0);

  assert("Value after clean up").that(puzzle.cells[1][1].getValue()).isNull();
  assert("Data after clean up").that(puzzle.cells[1][1].data).isEqualTo({});
}),

// Data collector tests
test('Data collector',(suite) => {
  let puzzle = suite.showPuzzle("battleships_minesweeper", "6x6-ship3", suite.CLUES);
  puzzle.start();

  // Solution from the checker tests:
  //     a b c d e f
  //  1  # # # ~ # .
  //  2  . 5 . 4 # .
  //  3  # . # . . .
  //  4  # . . . # .
  //  5  . . . 2 . .
  //  6  . . # . . 0
  suite.cellClick(puzzle, "a1");
  suite.dragThrough(puzzle, ["a1", "b1", "c1"]);
  suite.cellClick(puzzle, "e1");
  suite.dragThrough(puzzle, ["e1", "e2"]);
  suite.cellClick(puzzle, "a3");
  suite.dragThrough(puzzle, ["a3", "a4"]);
  suite.cellClick(puzzle, "c3");
  suite.cellClick(puzzle, "e4");
  suite.cellClick(puzzle, "c6");

  // Auxiliary marks are not submitted: waves and circle at the solved clue.
  suite.dragThrough(puzzle, ["f6", "f5", "e5", "e6"]);
  suite.cellClick(puzzle, "b2");
  suite.cellClick(puzzle, "f1");
  suite.cellClick(puzzle, "f1");

  assert("Submission data").that(puzzle.collectData()).isEqualTo(
    {"a1": "1", "b1": "1", "c1": "1", "e1": "1", "e2": "1", "a3": "1", "a4": "1", "c3": "1", "e4": "1", "c6": "1"});
}),

test('Author data collector',(suite) => {
  let puzzle = suite.showPuzzle("battleships_minesweeper", "6x6-ship3");
  puzzle.edit();

  assert("Data of the empty puzzle").that(puzzle.collectData()).isEqualTo({});

  // Clues from the checker tests: item 1 of the chooser is wave, item N+2 is number N.
  puzzle.cells[0][3].switchOnChooser(1);
  puzzle.cells[1][1].switchOnChooser(7);
  puzzle.cells[1][3].switchOnChooser(6);
  puzzle.cells[4][3].switchOnChooser(4);
  puzzle.cells[5][5].switchOnChooser(2);

  assert("Puzzle data").that(puzzle.collectData()).isEqualTo(suite.CLUES);

  // Replace number in d2 by 8, replace wave in d1 by number 1 and remove clue from f6.
  puzzle.cells[1][3].switchOnChooser(10);
  puzzle.cells[0][3].switchOnChooser(3);
  puzzle.cells[5][5].switchOnChooser(0);

  assert("Puzzle data after changes").that(puzzle.collectData()).isEqualTo({"d1": "1", "b2": "5", "d2": "8", "d5": "2"});
}),

test('Author data collector for existing puzzle',(suite) => {
  let puzzle = suite.showPuzzle("battleships_minesweeper", "6x6-ship3", suite.CLUES);
  puzzle.edit();

  assert("Loaded wave").that(puzzle.cells[0][3].getValue()).isEqualTo('wave');
  assert("Loaded number").that(puzzle.cells[1][1].getValue()).isEqualTo('5');
  assert("Puzzle data").that(puzzle.collectData()).isEqualTo(suite.CLUES);
}),

);
