sudokuQueenTestSuite = uiTestSuite("Queen Sudoku", "sudokupuzzle", "sudokuPuzzleType",

// Controller definition tests
test('Solver controllers',(suite) => {
  let puzzle = suite.showPuzzle("sudoku_queen", "4x4", {"a1": "1"});
  puzzle.start();

  assert("Empty cell chooser").that(puzzle.cells[1][3].chooserValues).containsExactly([{}, {text: '1', returnValue: '1'}, {text: '2', returnValue: '2'}, {text: '3', returnValue: '3'}, {text: '4', returnValue: '4'}]);
  assert("Empty cell click").that(puzzle.cells[1][3].clickSwitch).isNull();
  assert("Clue cell chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("Clue cell click").that(puzzle.cells[0][0].clickSwitch).isNull();
}),

test('Author controllers',(suite) => {
  let puzzle = suite.showPuzzle("sudoku_queen", "4x4");
  puzzle.edit();

  assert("Cell chooser").that(puzzle.cells[0][0].chooserValues).containsExactly([{}, {text: '1', returnValue: '1'}, {text: '2', returnValue: '2'}, {text: '3', returnValue: '3'}, {text: '4', returnValue: '4'}]);
  assert("Cell click").that(puzzle.cells[0][0].clickSwitch).isNull();
}),

// Data collector tests
test('Data collector',(suite) => {
  let puzzle = suite.showPuzzle("sudoku_queen", "4x4", {"a1": "1"});
  puzzle.start();

  // Choose 2 for the cell d2 and 3 for the cell b1.
  puzzle.cells[1][3].switchOnChooser(2);
  puzzle.cells[0][1].switchOnChooser(3);

  assert("Cell value").that(puzzle.cells[1][3].getValue()).isEqualTo('2');
  assert("Cell data").that(puzzle.cells[1][3].data).isEqualTo({text: '2', returnValue: '2'});

  assert("Submission data").that(puzzle.collectData()).isEqualTo({"b1": "3", "d2": "2"});
}),

test('Author data collector',(suite) => {
  let puzzle = suite.showPuzzle("sudoku_queen", "4x4");
  puzzle.edit();

  // Digit 2 in a1 and digit 4 in b1.
  puzzle.cells[0][0].switchOnChooser(2);
  puzzle.cells[0][1].switchOnChooser(4);

  assert("Puzzle data").that(puzzle.collectData()).isEqualTo({"a1": "2", "b1": "4"});
}),

);
