sudokuSameSumTestSuite = uiTestSuite("Same Sum Sudoku", "sudokupuzzle", "sudokuPuzzleType",

// Grey cells form the regions with the same sum.
// Clue "-" is an empty grey cell, clue "-2" is a grey cell with the given digit 2.

// Controller definition tests
test('Solver controllers',(suite) => {
  let puzzle = suite.showPuzzle("sudoku_same_sum", "4x4", {"a1": "1", "b1": "-", "c1": "-2"});
  puzzle.start();

  assert("Empty cell chooser").that(puzzle.cells[1][3].chooserValues).containsExactly([{}, {text: '1', textColor: puzzle.colorSchema.textColor, returnValue: '1'}, {text: '2', textColor: puzzle.colorSchema.textColor, returnValue: '2'}, {text: '3', textColor: puzzle.colorSchema.textColor, returnValue: '3'}, {text: '4', textColor: puzzle.colorSchema.textColor, returnValue: '4'}]);
  assert("Empty cell click").that(puzzle.cells[1][3].clickSwitch).isNull();
  assert("Grey cell chooser").that(puzzle.cells[0][1].chooserValues).containsExactly([{color: 'grey'}, {text: '1', color: 'grey', textColor: puzzle.colorSchema.textColor, returnValue: '1'}, {text: '2', color: 'grey', textColor: puzzle.colorSchema.textColor, returnValue: '2'}, {text: '3', color: 'grey', textColor: puzzle.colorSchema.textColor, returnValue: '3'}, {text: '4', color: 'grey', textColor: puzzle.colorSchema.textColor, returnValue: '4'}]);
  assert("Clue cell chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("Grey clue cell chooser").that(puzzle.cells[0][2].chooserValues).isNull();
}),

test('Author controllers',(suite) => {
  let puzzle = suite.showPuzzle("sudoku_same_sum", "4x4");
  puzzle.edit();

  assert("Cell chooser").that(puzzle.cells[0][0].chooserValues).containsExactly([{}, {text: '1', returnValue: '1'}, {text: '2', returnValue: '2'}, {text: '3', returnValue: '3'}, {text: '4', returnValue: '4'}, {color: 'grey', returnValue: '-'}, {text: '1', color: 'grey', returnValue: '-1'}, {text: '2', color: 'grey', returnValue: '-2'}, {text: '3', color: 'grey', returnValue: '-3'}, {text: '4', color: 'grey', returnValue: '-4'}]);
  assert("Cell click").that(puzzle.cells[0][0].clickSwitch).isNull();
}),

// Clue display tests
test('Show grey cells',(suite) => {
  let puzzle = suite.showPuzzle("sudoku_same_sum", "4x4", {"a1": "1", "b1": "-", "c1": "-2"});
  puzzle.start();

  assert("Clue cell data").that(puzzle.cells[0][0].data).isEqualTo({text: '1'});
  assert("Grey cell data").that(puzzle.cells[0][1].data).isEqualTo({color: 'grey'});
  assert("Grey clue cell data").that(puzzle.cells[0][2].data).isEqualTo({text: '2', color: 'grey'});
}),

// Data collector tests
test('Data collector',(suite) => {
  let puzzle = suite.showPuzzle("sudoku_same_sum", "4x4", {"a1": "1", "b1": "-", "c1": "-2"});
  puzzle.start();

  // Choose 2 for the cell d2 and 3 for the grey cell b1.
  puzzle.cells[1][3].switchOnChooser(2);
  puzzle.cells[0][1].switchOnChooser(3);

  assert("Cell value").that(puzzle.cells[1][3].getValue()).isEqualTo('2');
  assert("Cell data").that(puzzle.cells[1][3].data).isEqualTo({text: '2', textColor: puzzle.colorSchema.textColor, returnValue: '2'});
  assert("Grey cell value").that(puzzle.cells[0][1].getValue()).isEqualTo('3');
  assert("Grey cell data").that(puzzle.cells[0][1].data).isEqualTo({text: '3', color: 'grey', textColor: puzzle.colorSchema.textColor, returnValue: '3'});
  assert("Submission data").that(puzzle.collectData()).isEqualTo({"b1": "3", "d2": "2"});
}),

test('Author data collector',(suite) => {
  let puzzle = suite.showPuzzle("sudoku_same_sum", "4x4");
  puzzle.edit();

  // Digit 2 in a1, empty grey cell in b1, grey cell with digit 3 in c1.
  puzzle.cells[0][0].switchOnChooser(2);
  puzzle.cells[0][1].switchOnChooser(5);
  puzzle.cells[0][2].switchOnChooser(8);

  assert("Puzzle data").that(puzzle.collectData()).isEqualTo({"a1": "2", "b1": "-", "c1": "-3"});
}),

);
