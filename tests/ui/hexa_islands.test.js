hexaIslandsTestSuite = uiTestSuite("Hexa Islands", "hexapuzzle", "hexaPuzzleType",

// Controller definition tests
test('Solver controllers',(suite) => {
  let puzzle = suite.showPuzzle(
    "hexa_islands", "5x5",{"a1": "1", "a2": "1"}
  );
  puzzle.start();

  assert("Clue cell chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("Clue cell click").that(puzzle.cells[0][0].clickSwitch).isNull();
  assert("Empty cell chooser").that(puzzle.cells[1][1].chooserValues).isNull();
  assert("Empty cell click").that(puzzle.cells[1][1].clickSwitch).containsExactly([{}, { color: puzzle.colorSchema.gridColor, returnValue: '1'}, {image: 'cross'}]);
  assert("Cell drag handler").that(puzzle.cells[0][0].drawDragHandler).isNotNull();
  assert("Cell drag processor").that(puzzle.cells[0][0].dragProcessor).isNotNull();
}),

test('Author controllers',(suite) => {
  let puzzle = suite.showPuzzle("hexa_islands", "5x5");
  puzzle.edit();

  assert("Cell chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("Cell click").that(puzzle.cells[0][0].clickSwitch).containsExactly([{}, {color: puzzle.colorSchema.clueColor, returnValue: '1'}]);
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
  let puzzle = suite.showPuzzle("hexa_islands", "3x3", {"a1": "1", "c3": "1"});
  puzzle.start();

  let cell = puzzle.cells[0][1];
  suite.click(puzzle, cell.center());
  assert("Cell value after one click").that(cell.getValue()).isEqualTo("1");
  assert("Cell data after one click").that(cell.data).isEqualTo({color: puzzle.colorSchema.gridColor, returnValue: '1'});

  suite.click(puzzle, cell.center());
  assert("Cell value after two clicks").that(cell.getValue()).isNull();
  assert("Cell data after two clicks").that(cell.data).isEqualTo({image: 'cross'});

  suite.click(puzzle, cell.center());
  assert("Cell value after three clicks").that(cell.getValue()).isNull();
  assert("Cell data after three clicks").that(cell.data).isEqualTo({});
}),

test('Clue cell is not changed by click',(suite) => {
  let puzzle = suite.showPuzzle("hexa_islands", "3x3", {"a1": "1", "c3": "1"});
  puzzle.start();

  suite.click(puzzle, puzzle.cells[0][0].center());

  assert("Clue data after click").that(puzzle.cells[0][0].data).isEqualTo({color: puzzle.colorSchema.clueColor});
}),

test('Drag from clue cell paints the cell black',(suite) => {
  let puzzle = suite.showPuzzle("hexa_islands", "3x3", {"a1": "1", "c3": "1"});
  puzzle.start();

  // From the given black cell a1 to the empty cell a2.
  suite.drag(puzzle, puzzle.cells[0][0].center(), puzzle.cells[1][0].center());

  assert("Cell value after drag").that(puzzle.cells[1][0].getValue()).isEqualTo("1");
  assert("Cell color after drag").that(puzzle.cells[1][0].data.color).isEqualTo(puzzle.colorSchema.gridColor);

  // From the cell painted by the solver to the other clue cell: the clue is not changed.
  suite.drag(puzzle, puzzle.cells[1][0].center(), puzzle.cells[2][2].center());

  assert("Clue data after drag").that(puzzle.cells[2][2].data).isEqualTo({color: puzzle.colorSchema.clueColor});
}),

// Data collector tests
test('Data collector',(suite) => {
  let puzzle = suite.showPuzzle("hexa_islands", "3x3", {"a1": "1", "c3": "1"});
  puzzle.start();

  // b1 is black, b2 is marked by the cross. Given cells are not submitted.
  suite.click(puzzle, puzzle.cells[0][1].center());
  suite.click(puzzle, puzzle.cells[1][1].center());
  suite.click(puzzle, puzzle.cells[1][1].center());

  assert("Submission data").that(puzzle.collectData()).isEqualTo({"b1": "1"});
}),

test('Author data collector',(suite) => {
  let puzzle = suite.showPuzzle("hexa_islands", "3x3");
  puzzle.edit();

  suite.click(puzzle, puzzle.cells[1][1].center());
  suite.click(puzzle, puzzle.cells[4][4].center());

  assert("Cell data after click").that(puzzle.cells[1][1].data).isEqualTo({color: puzzle.colorSchema.clueColor, returnValue: '1'});
  assert("Puzzle data").that(puzzle.collectData()).isEqualTo({"b2": "1", "e5": "1"});

  // The second click removes the cell.
  suite.click(puzzle, puzzle.cells[1][1].center());

  assert("Puzzle data after removing").that(puzzle.collectData()).isEqualTo({"e5": "1"});
}),

);
