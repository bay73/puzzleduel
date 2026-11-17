sudokuCitywalkTestSuite = uiTestSuite("Citywalk Sudoku", "sudokupuzzle", "sudokuPuzzleType",

// Digits from 3 to 6 are shown in the cells with light grey background.

// Controller definition tests
test('Solver controllers',(suite) => {
  let puzzle = suite.showPuzzle("sudoku_citywalk", "6x6", {"a1": "3", "b1": "1"});
  puzzle.start();

  assert("Empty cell chooser").that(puzzle.cells[1][3].chooserValues).containsExactly([{}, {text: '1', returnValue: '1'}, {text: '2', returnValue: '2'}, {text: '3', color: puzzle.colorSchema.lightGreyColor, returnValue: '3'}, {text: '4', color: puzzle.colorSchema.lightGreyColor, returnValue: '4'}, {text: '5', color: puzzle.colorSchema.lightGreyColor, returnValue: '5'}, {text: '6', color: puzzle.colorSchema.lightGreyColor, returnValue: '6'}, {color: puzzle.colorSchema.lightGreyColor}, {image: 'white_circle'}]);
  assert("Empty cell click").that(puzzle.cells[1][3].clickSwitch).isNull();
  assert("Clue cell chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("Clue cell click").that(puzzle.cells[0][0].clickSwitch).isNull();
}),

test('Author controllers',(suite) => {
  let puzzle = suite.showPuzzle("sudoku_citywalk", "6x6");
  puzzle.edit();

  assert("Cell chooser").that(puzzle.cells[0][0].chooserValues).containsExactly([{}, {text: '1', returnValue: '1'}, {text: '2', returnValue: '2'}, {text: '3', color: puzzle.colorSchema.lightGreyColor, returnValue: '3'}, {text: '4', color: puzzle.colorSchema.lightGreyColor, returnValue: '4'}, {text: '5', color: puzzle.colorSchema.lightGreyColor, returnValue: '5'}, {text: '6', color: puzzle.colorSchema.lightGreyColor, returnValue: '6'}]);
  assert("Cell click").that(puzzle.cells[0][0].clickSwitch).isNull();
}),

// Clue display tests
test('Show digits of the city',(suite) => {
  let puzzle = suite.showPuzzle("sudoku_citywalk", "6x6", {"a1": "3", "b1": "1"});
  puzzle.start();

  assert("Cell with a big digit").that(puzzle.cells[0][0].data).isEqualTo({text: '3', color: puzzle.colorSchema.lightGreyColor});
  assert("Cell with a small digit").that(puzzle.cells[0][1].data).isEqualTo({text: '1'});
}),

// Data collector tests
test('Data collector',(suite) => {
  let puzzle = suite.showPuzzle("sudoku_citywalk", "6x6", {"a1": "3", "b1": "1"});
  puzzle.start();

  // Choose 2 for d2, 3 for c1; mark d1 by the color and e1 by the circle (the marks are not submitted).
  puzzle.cells[1][3].switchOnChooser(2);
  puzzle.cells[0][2].switchOnChooser(3);
  puzzle.cells[0][3].switchOnChooser(7);
  puzzle.cells[0][4].switchOnChooser(8);

  assert("Cell with a small digit").that(puzzle.cells[1][3].data).isEqualTo({text: '2', returnValue: '2'});
  assert("Cell with a big digit").that(puzzle.cells[0][2].data).isEqualTo({text: '3', color: puzzle.colorSchema.lightGreyColor, returnValue: '3'});
  assert("Color mark value").that(puzzle.cells[0][3].getValue()).isNull();
  assert("Circle mark value").that(puzzle.cells[0][4].getValue()).isNull();

  assert("Submission data").that(puzzle.collectData()).isEqualTo({"c1": "3", "d2": "2"});
}),

test('Author data collector',(suite) => {
  let puzzle = suite.showPuzzle("sudoku_citywalk", "6x6");
  puzzle.edit();

  // Digit 2 in a1 and digit 5 in b1.
  puzzle.cells[0][0].switchOnChooser(2);
  puzzle.cells[0][1].switchOnChooser(5);

  assert("Puzzle data").that(puzzle.collectData()).isEqualTo({"a1": "2", "b1": "5"});
}),

);
