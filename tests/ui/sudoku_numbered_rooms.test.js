sudokuNumberedRoomsTestSuite = uiTestSuite("Numbered Rooms Sudoku", "sudokupuzzle", "sudokuPuzzleType",

// Clues are placed outside the grid: puzzle.top[0] is the cell above the column a.

// Controller definition tests
test('Solver controllers',(suite) => {
  let puzzle = suite.showPuzzle("sudoku_numbered_rooms", "4x4", {"a1": "1", "top": ["2", null, null, null], "left": [null, "3", null, null], "right": [null, null, null, null], "bottom": [null, null, null, null]});
  puzzle.start();

  assert("Empty cell chooser").that(puzzle.cells[1][3].chooserValues).containsExactly([{}, {text: '1', returnValue: '1'}, {text: '2', returnValue: '2'}, {text: '3', returnValue: '3'}, {text: '4', returnValue: '4'}]);
  assert("Empty cell click").that(puzzle.cells[1][3].clickSwitch).isNull();
  assert("Clue cell chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("Clue cell click").that(puzzle.cells[0][0].clickSwitch).isNull();
  assert("Outer clue chooser").that(puzzle.top[0].chooserValues).isNull();
  assert("Outer clue click").that(puzzle.top[0].clickSwitch).containsExactly([{text: '2'}, {text: '2', image: 'white_circle'}]);
  assert("Empty outer cell click").that(puzzle.right[0].clickSwitch).containsExactly([{}, {image: 'white_circle'}]);
}),

test('Author controllers',(suite) => {
  let puzzle = suite.showPuzzle("sudoku_numbered_rooms", "4x4");
  puzzle.edit();

  assert("Cell chooser").that(puzzle.cells[0][0].chooserValues).containsExactly([{}, {text: '1', returnValue: '1'}, {text: '2', returnValue: '2'}, {text: '3', returnValue: '3'}, {text: '4', returnValue: '4'}]);
  assert("Cell click").that(puzzle.cells[0][0].clickSwitch).isNull();
  assert("Outer cell chooser").that(puzzle.top[0].chooserValues).containsExactly([{}, {text: '1', returnValue: '1'}, {text: '2', returnValue: '2'}, {text: '3', returnValue: '3'}, {text: '4', returnValue: '4'}]);
  assert("Outer cell click").that(puzzle.top[0].clickSwitch).isNull();
}),

// Clue display tests
test('Show outer clues',(suite) => {
  let puzzle = suite.showPuzzle("sudoku_numbered_rooms", "4x4", {"a1": "1", "top": ["2", null, null, null], "left": [null, "3", null, null], "right": [null, null, null, null], "bottom": [null, null, null, null]});
  puzzle.start();

  assert("Top clue").that(puzzle.top[0].data).isEqualTo({text: '2'});
  assert("Left clue").that(puzzle.left[1].data).isEqualTo({text: '3'});
  assert("Empty outer cell").that(puzzle.top[1].data).isEqualTo({});
}),

// Data collector tests
test('Data collector',(suite) => {
  let puzzle = suite.showPuzzle("sudoku_numbered_rooms", "4x4", {"a1": "1", "top": ["2", null, null, null], "left": [null, "3", null, null], "right": [null, null, null, null], "bottom": [null, null, null, null]});
  puzzle.start();

  // Choose 2 for the cell d2 and 3 for the cell b1.
  puzzle.cells[1][3].switchOnChooser(2);
  puzzle.cells[0][1].switchOnChooser(3);

  assert("Cell value").that(puzzle.cells[1][3].getValue()).isEqualTo('2');
  assert("Cell data").that(puzzle.cells[1][3].data).isEqualTo({text: '2', returnValue: '2'});

  // The clue above the column a is marked by the circle, the mark is not submitted.
  suite.click(puzzle, suite.cellPoint(puzzle, 0, -1));

  assert("Outer clue data after click").that(puzzle.top[0].data).isEqualTo({text: '2', image: 'white_circle'});
  assert("Outer clue value after click").that(puzzle.top[0].getValue()).isNull();

  assert("Submission data").that(puzzle.collectData()).isEqualTo({"b1": "3", "d2": "2"});
}),

test('Author data collector',(suite) => {
  let puzzle = suite.showPuzzle("sudoku_numbered_rooms", "4x4");
  puzzle.edit();

  // Digit 2 in a1 and digit 4 in b1.
  puzzle.cells[0][0].switchOnChooser(2);
  puzzle.cells[0][1].switchOnChooser(4);
  // Clue 2 above the column b and clue 4 at the left of the third row.
  puzzle.top[1].switchOnChooser(2);
  puzzle.left[2].switchOnChooser(4);

  assert("Puzzle data").that(puzzle.collectData()).isEqualTo({"a1": "2", "b1": "4", "top": [null, "2", null, null], "left": [null, null, "4", null]});
}),

);
