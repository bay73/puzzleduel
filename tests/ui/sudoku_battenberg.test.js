sudokuBattenbergTestSuite = uiTestSuite("Battenberg Sudoku", "sudokupuzzle", "sudokuPuzzleType",

// Clues are marks in the nodes of the grid: "a1-2" is the bottom right corner of a1.

// Controller definition tests
test('Solver controllers',(suite) => {
  let puzzle = suite.showPuzzle("sudoku_battenberg", "4x4", {"a1": "1", "nodes": {"a1-2": "battenberg"}});
  puzzle.start();

  assert("Empty cell chooser").that(puzzle.cells[1][3].chooserValues).containsExactly([{}, {text: '1', returnValue: '1'}, {text: '2', returnValue: '2'}, {text: '3', returnValue: '3'}, {text: '4', returnValue: '4'}, {image: 'odd_1'}, {image: 'even_1'}]);
  assert("Empty cell click").that(puzzle.cells[1][3].clickSwitch).isNull();
  assert("Clue cell chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("Clue cell click").that(puzzle.cells[0][0].clickSwitch).isNull();
  assert("Node chooser").that(puzzle.nodes[0][0][2].chooserValues).isNull();
  assert("Node click").that(puzzle.nodes[0][0][2].clickSwitch).isNull();
}),

test('Author controllers',(suite) => {
  let puzzle = suite.showPuzzle("sudoku_battenberg", "4x4");
  puzzle.edit();

  assert("Cell chooser").that(puzzle.cells[0][0].chooserValues).containsExactly([{}, {text: '1', returnValue: '1'}, {text: '2', returnValue: '2'}, {text: '3', returnValue: '3'}, {text: '4', returnValue: '4'}]);
  assert("Cell click").that(puzzle.cells[0][0].clickSwitch).isNull();
  assert("Inner node click").that(puzzle.nodes[0][0][2].clickSwitch).containsExactly([{}, {image: 'battenberg_small', returnValue: 'battenberg'}]);
  assert("Node at the border click").that(puzzle.nodes[0][0][0].clickSwitch).isNull();
}),

// Clue display tests
test('Show battenberg marks',(suite) => {
  let puzzle = suite.showPuzzle("sudoku_battenberg", "4x4", {"a1": "1", "nodes": {"a1-2": "battenberg"}});
  puzzle.start();

  assert("Node with mark").that(puzzle.nodes[0][0][2].data.image).isEqualTo('battenberg_small');
  assert("Node without mark").that(puzzle.nodes[0][1][2].data.image).isNull();
}),

// Data collector tests
test('Data collector',(suite) => {
  let puzzle = suite.showPuzzle("sudoku_battenberg", "4x4", {"a1": "1", "nodes": {"a1-2": "battenberg"}});
  puzzle.start();

  // Choose 2 for d2, 3 for b1, mark c1 as odd and d1 as even (the marks are not submitted).
  puzzle.cells[1][3].switchOnChooser(2);
  puzzle.cells[0][1].switchOnChooser(3);
  puzzle.cells[0][2].switchOnChooser(5);
  puzzle.cells[0][3].switchOnChooser(6);

  assert("Cell value").that(puzzle.cells[1][3].getValue()).isEqualTo('2');
  assert("Odd mark data").that(puzzle.cells[0][2].data).isEqualTo({image: 'odd_1'});
  assert("Odd mark value").that(puzzle.cells[0][2].getValue()).isNull();
  assert("Even mark value").that(puzzle.cells[0][3].getValue()).isNull();

  assert("Submission data").that(puzzle.collectData()).isEqualTo({"b1": "3", "d2": "2"});
}),

test('Author data collector',(suite) => {
  let puzzle = suite.showPuzzle("sudoku_battenberg", "4x4");
  puzzle.edit();

  // Digit 2 in a1 and digit 4 in b1.
  puzzle.cells[0][0].switchOnChooser(2);
  puzzle.cells[0][1].switchOnChooser(4);
  // Mark at the common corner of a1, b1, a2 and b2.
  suite.click(puzzle, suite.gridPoint(puzzle, 1, 1));

  assert("Node value after click").that(puzzle.nodes[0][0][2].getValue()).isEqualTo('battenberg');

  assert("Puzzle data").that(puzzle.collectData()).isEqualTo({"a1": "2", "b1": "4", "nodes": {"a1-2": "battenberg"}});
}),

);
