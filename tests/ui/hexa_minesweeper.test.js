hexaMinesweeperTestSuite = uiTestSuite("Hexa Minesweeper", "hexapuzzle", "hexaPuzzleType",

test('Solver selectors',(suite) => {
  let puzzle = suite.showPuzzle(
    "hexa_minesweeper", "3x3",
    {"a3": "3", "d1": "2"}
  )
  puzzle.start();

  assert("Empty cell chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("Empty cell click").that(puzzle.cells[0][0].clickSwitch).containsExactly([{}, {image: 'mine', returnValue: '1'}, {image: 'cross'}]);
  assert("Number cell chooser").that(puzzle.cells[2][0].chooserValues).isNull();
  assert("Number cell click").that(puzzle.cells[2][0].clickSwitch).containsExactly([{text: '3'}, {text: '3', image: 'white_circle'}]);
}),

test('Author selectors',(suite) => {
  let puzzle = suite.showPuzzle("hexa_minesweeper", "3x3");
  puzzle.edit();

  assert("Cell chooser").that(puzzle.cells[0][0].chooserValues).containsAtLeast([{},{text: '0', returnValue: '0'},{text: '1', returnValue: '1'},{text: '6', returnValue: '6'}]);
  assert("Cell click").that(puzzle.cells[0][0].clickSwitch).isNull();
}),

// Cells of the hexagonal grid 3x3 (puzzle.cells[row][column]):
//       c1
//    b1    d2
// a1    c2    e3
//    b2    d3
// a2    c3    e4
//    b3    d4
// a3    c4    e5
//    b4    d5
//       c5

// Mouse processing tests
test('Process clicks to empty cell',(suite) => {
  let puzzle = suite.showPuzzle("hexa_minesweeper", "3x3", {"b1": "2", "c3": "1"});
  puzzle.start();

  let cell = puzzle.cells[0][0];
  assert("Cell value before click").that(cell.getValue()).isNull();

  suite.click(puzzle, cell.center());
  assert("Cell value after one click").that(cell.getValue()).isEqualTo("1");
  assert("Cell data after one click").that(cell.data).isEqualTo({image: 'mine', returnValue: '1'});

  suite.click(puzzle, cell.center());
  assert("Cell value after two clicks").that(cell.getValue()).isNull();
  assert("Cell data after two clicks").that(cell.data).isEqualTo({image: 'cross'});

  suite.click(puzzle, cell.center());
  assert("Cell value after three clicks").that(cell.getValue()).isNull();
  assert("Cell data after three clicks").that(cell.data).isEqualTo({});
}),

test('Process clicks to clue cell',(suite) => {
  let puzzle = suite.showPuzzle("hexa_minesweeper", "3x3", {"b1": "2", "c3": "1"});
  puzzle.start();

  let cell = puzzle.cells[0][1];
  assert("Clue data before click").that(cell.data).isEqualTo({text: '2'});

  suite.click(puzzle, cell.center());
  assert("Clue value after one click").that(cell.getValue()).isNull();
  assert("Clue data after one click").that(cell.data).isEqualTo({text: '2', image: 'white_circle'});

  suite.click(puzzle, cell.center());
  assert("Clue data after two clicks").that(cell.data).isEqualTo({text: '2'});
}),

test('Copy mine by drag',(suite) => {
  let puzzle = suite.showPuzzle("hexa_minesweeper", "3x3", {"b1": "2", "c3": "1"});
  puzzle.start();

  // Mine in a1 is copied to a2.
  suite.click(puzzle, puzzle.cells[0][0].center());
  suite.drag(puzzle, puzzle.cells[0][0].center(), puzzle.cells[1][0].center());

  assert("Cell value after drag").that(puzzle.cells[1][0].getValue()).isEqualTo("1");
  assert("Cell data after drag").that(puzzle.cells[1][0].data).isEqualTo({image: 'mine', returnValue: '1'});

  // Clue cell b1 can't be changed by drag.
  suite.drag(puzzle, puzzle.cells[0][0].center(), puzzle.cells[0][1].center());

  assert("Clue data after drag").that(puzzle.cells[0][1].data).isEqualTo({text: '2'});
}),

// Data collector tests
test('Data collector',(suite) => {
  let puzzle = suite.showPuzzle("hexa_minesweeper", "3x3", {"b1": "2", "c3": "1"});
  puzzle.start();

  // Mines in a1 and e5, cross in b2, circle in the clue cell b1.
  suite.click(puzzle, puzzle.cells[0][0].center());
  suite.click(puzzle, puzzle.cells[4][4].center());
  suite.click(puzzle, puzzle.cells[1][1].center());
  suite.click(puzzle, puzzle.cells[1][1].center());
  suite.click(puzzle, puzzle.cells[0][1].center());

  assert("Submission data").that(puzzle.collectData()).isEqualTo({"a1": "1", "e5": "1"});
}),

test('Author data collector',(suite) => {
  let puzzle = suite.showPuzzle("hexa_minesweeper", "3x3");
  puzzle.edit();

  // Choose "0" for a1 and "3" for c3.
  puzzle.cells[0][0].switchOnChooser(1);
  puzzle.cells[2][2].switchOnChooser(4);

  assert("Puzzle data").that(puzzle.collectData()).isEqualTo({"a1": "0", "c3": "3"});
}),

// Error display tests
test('Show error cells',(suite) => {
  let puzzle = suite.showPuzzle("hexa_minesweeper", "3x3", {"b1": "2", "c3": "1"});
  puzzle.start();

  assert("Error marks before check").that($(suite.GRID_SELECTOR + " circle").length).isEqualTo(0);

  puzzle.showErrorCells({status: "The clue is not correct", errors: ["a1", "b2"]});
  assert("Error marks for two cells").that($(suite.GRID_SELECTOR + " circle").length).isEqualTo(2);

  // Response without the list of cells doesn't add marks.
  puzzle.showErrorCells({status: "Black area should be connected"});
  assert("Error marks after response without cells").that($(suite.GRID_SELECTOR + " circle").length).isEqualTo(2);
}),

);
