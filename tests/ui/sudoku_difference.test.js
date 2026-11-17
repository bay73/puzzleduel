sudokuDifferenceTestSuite = uiTestSuite("Difference Sudoku", "sudokupuzzle", "sudokuPuzzleType",

// Clues are differences on the edges: "a1-1" is the right edge of a1, "a1-2" is its bottom edge.

// Controller definition tests
test('Solver controllers',(suite) => {
  let puzzle = suite.showPuzzle("sudoku_difference", "4x4", {"a1": "1", "edges": {"a1-1": "-2", "a1-2": "-3"}});
  puzzle.start();

  assert("Empty cell chooser").that(puzzle.cells[1][3].chooserValues).containsExactly([{}, {text: '1', returnValue: '1'}, {text: '2', returnValue: '2'}, {text: '3', returnValue: '3'}, {text: '4', returnValue: '4'}]);
  assert("Empty cell click").that(puzzle.cells[1][3].clickSwitch).isNull();
  assert("Clue cell chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("Clue cell click").that(puzzle.cells[0][0].clickSwitch).isNull();
  assert("Edge chooser").that(puzzle.edges[0][0][1].chooserValues).isNull();
  assert("Edge click").that(puzzle.edges[0][0][1].clickSwitch).isNull();
}),

test('Author controllers',(suite) => {
  let puzzle = suite.showPuzzle("sudoku_difference", "4x4");
  puzzle.edit();

  assert("Cell chooser").that(puzzle.cells[0][0].chooserValues).containsExactly([{}, {text: '1', returnValue: '1'}, {text: '2', returnValue: '2'}, {text: '3', returnValue: '3'}, {text: '4', returnValue: '4'}]);
  assert("Cell click").that(puzzle.cells[0][0].clickSwitch).isNull();
  assert("Edge chooser").that(puzzle.edges[0][0][1].chooserValues).containsExactly([{}, {image: 'small_circle', text: '1', textColor: '#fff', returnValue: '-1'}, {image: 'small_circle', text: '2', textColor: '#fff', returnValue: '-2'}, {image: 'small_circle', text: '3', textColor: '#fff', returnValue: '-3'}]);
  assert("Edge click").that(puzzle.edges[0][0][1].clickSwitch).isNull();
}),

// Clue display tests
test('Show differences',(suite) => {
  let puzzle = suite.showPuzzle("sudoku_difference", "4x4", {"a1": "1", "edges": {"a1-1": "-2", "a1-2": "-3"}});
  puzzle.start();

  assert("Difference between a1 and b1").that(puzzle.edges[0][0][1].data.text).isEqualTo('2');
  assert("Difference between a1 and b1 image").that(puzzle.edges[0][0][1].data.image).isEqualTo('small_circle');
  assert("Difference between a1 and a2").that(puzzle.edges[0][0][2].data.text).isEqualTo('3');
  assert("Edge without clue").that(puzzle.edges[0][1][1].data.text).isNull();
}),

// Data collector tests
test('Data collector',(suite) => {
  let puzzle = suite.showPuzzle("sudoku_difference", "4x4", {"a1": "1", "edges": {"a1-1": "-2", "a1-2": "-3"}});
  puzzle.start();

  // Choose 2 for the cell d2 and 3 for the cell b1.
  puzzle.cells[1][3].switchOnChooser(2);
  puzzle.cells[0][1].switchOnChooser(3);

  assert("Cell value").that(puzzle.cells[1][3].getValue()).isEqualTo('2');
  assert("Cell data").that(puzzle.cells[1][3].data).isEqualTo({text: '2', returnValue: '2'});

  assert("Submission data").that(puzzle.collectData()).isEqualTo({"b1": "3", "d2": "2"});
}),

test('Author data collector',(suite) => {
  let puzzle = suite.showPuzzle("sudoku_difference", "4x4");
  puzzle.edit();

  // Digit 2 in a1 and digit 4 in b1.
  puzzle.cells[0][0].switchOnChooser(2);
  puzzle.cells[0][1].switchOnChooser(4);
  // Difference 1 between a1 and b1, difference 3 between b1 and b2.
  puzzle.edges[0][0][1].switchOnChooser(1);
  puzzle.edges[0][1][2].switchOnChooser(3);

  assert("Edge value").that(puzzle.edges[0][0][1].getValue()).isEqualTo('-1');

  assert("Puzzle data").that(puzzle.collectData()).isEqualTo({"a1": "2", "b1": "4", "edges": {"a1-1": "-1", "b1-2": "-3"}});
}),

);
