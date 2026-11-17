sudokuBlackoutTestSuite = uiTestSuite("Blackout Sudoku", "sudokupuzzle", "sudokuPuzzleType",

// Clue "black" is a black cell without a digit.

// Controller definition tests
test('Solver controllers',(suite) => {
  let puzzle = suite.showPuzzle("sudoku_blackout", "6x6", {"a1": "1", "b1": "black"});
  puzzle.start();

  assert("Empty cell chooser").that(puzzle.cells[1][3].chooserValues).containsExactly([{}, {text: '1', returnValue: '1'}, {text: '2', returnValue: '2'}, {text: '3', returnValue: '3'}, {text: '4', returnValue: '4'}, {text: '5', returnValue: '5'}, {text: '6', returnValue: '6'}]);
  assert("Empty cell click").that(puzzle.cells[1][3].clickSwitch).isNull();
  assert("Clue cell chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("Clue cell click").that(puzzle.cells[0][0].clickSwitch).isNull();
  assert("Black cell chooser").that(puzzle.cells[0][1].chooserValues).isNull();
  assert("Black cell click").that(puzzle.cells[0][1].clickSwitch).isNull();
}),

test('Author controllers',(suite) => {
  let puzzle = suite.showPuzzle("sudoku_blackout", "6x6");
  puzzle.edit();

  assert("Cell chooser").that(puzzle.cells[0][0].chooserValues).containsExactly([{}, {text: '1', returnValue: '1'}, {text: '2', returnValue: '2'}, {text: '3', returnValue: '3'}, {text: '4', returnValue: '4'}, {text: '5', returnValue: '5'}, {text: '6', returnValue: '6'}, {color: puzzle.colorSchema.gridColor, returnValue: 'black'}]);
  assert("Cell click").that(puzzle.cells[0][0].clickSwitch).isNull();
}),

// Clue display tests
test('Show black cells',(suite) => {
  let puzzle = suite.showPuzzle("sudoku_blackout", "6x6", {"a1": "1", "b1": "black"});
  puzzle.start();

  assert("Clue cell data").that(puzzle.cells[0][0].data).isEqualTo({text: '1'});
  assert("Black cell data").that(puzzle.cells[0][1].data).isEqualTo({color: puzzle.colorSchema.gridColor});
}),

// Data collector tests
test('Data collector',(suite) => {
  let puzzle = suite.showPuzzle("sudoku_blackout", "6x6", {"a1": "1", "b1": "black"});
  puzzle.start();

  // Choose 2 for the cell d2 and 3 for the cell c1.
  puzzle.cells[1][3].switchOnChooser(2);
  puzzle.cells[0][2].switchOnChooser(3);

  assert("Cell value").that(puzzle.cells[1][3].getValue()).isEqualTo('2');

  assert("Submission data").that(puzzle.collectData()).isEqualTo({"c1": "3", "d2": "2"});
}),

test('Author data collector',(suite) => {
  let puzzle = suite.showPuzzle("sudoku_blackout", "6x6");
  puzzle.edit();

  // Digit 2 in a1 and black cell in b1.
  puzzle.cells[0][0].switchOnChooser(2);
  puzzle.cells[0][1].switchOnChooser(7);

  assert("Black cell data").that(puzzle.cells[0][1].data).isEqualTo({color: puzzle.colorSchema.gridColor, returnValue: 'black'});

  assert("Puzzle data").that(puzzle.collectData()).isEqualTo({"a1": "2", "b1": "black"});
}),

);
