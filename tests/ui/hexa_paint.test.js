hexaPaintTestSuite = uiTestSuite("Paint be Hex", "hexapuzzle", "hexaPuzzleType",

// Controller definition tests
test('Solver controllers',(suite) => {
  let puzzle = suite.showPuzzle(
    "hexa_paint", "3x3",{"a1": "3", "a2": "2"}
  );
  puzzle.start();

  assert("cell chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("cell click").that(puzzle.cells[0][0].clickSwitch).containsExactly([{text: "3"}, {text: "3", color: puzzle.colorSchema.brightColor, returnValue: '1'}, {text: "3", image: 'white_circle'}]);
  assert("Cell drag handler").that(puzzle.cells[0][0].drawDragHandler).isNotNull();
  assert("Cell drag processor").that(puzzle.cells[0][0].dragProcessor).isNotNull();
}),

test('Author controllers',(suite) => {
  let puzzle = suite.showPuzzle("hexa_paint", "5x5");
  puzzle.edit();

  assert("Cell chooser").that(puzzle.cells[0][0].chooserValues).containsExactly([{},{text: '0', returnValue: '0'},{text: '1', returnValue: '1'},{text: '2', returnValue: '2'},{text: '3', returnValue: '3'},{text: '4', returnValue: '4'},{text: '5', returnValue: '5'},{text: '6', returnValue: '6'},{text: '7', returnValue: '7'}]);
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
test('Process clicks to clue cell',(suite) => {
  let puzzle = suite.showPuzzle("hexa_paint", "3x3", {"b1": "2", "c3": "1"});
  puzzle.start();

  // Clue cells can be painted, the number is kept.
  let cell = puzzle.cells[0][1];
  assert("Cell data before click").that(cell.data).isEqualTo({text: '2'});

  suite.click(puzzle, cell.center());
  assert("Cell value after one click").that(cell.getValue()).isEqualTo("1");
  assert("Cell data after one click").that(cell.data).isEqualTo({text: '2', color: puzzle.colorSchema.brightColor, returnValue: '1'});

  suite.click(puzzle, cell.center());
  assert("Cell value after two clicks").that(cell.getValue()).isNull();
  assert("Cell data after two clicks").that(cell.data).isEqualTo({text: '2', image: 'white_circle'});

  suite.click(puzzle, cell.center());
  assert("Cell value after three clicks").that(cell.getValue()).isNull();
  assert("Cell data after three clicks").that(cell.data).isEqualTo({text: '2'});
}),

test('Copy color by drag',(suite) => {
  let puzzle = suite.showPuzzle("hexa_paint", "3x3", {"b1": "2", "c3": "1"});
  puzzle.start();

  // Paint b1 and copy it to the empty cell b2.
  suite.click(puzzle, puzzle.cells[0][1].center());
  suite.drag(puzzle, puzzle.cells[0][1].center(), puzzle.cells[1][1].center());

  assert("Empty cell value after drag").that(puzzle.cells[1][1].getValue()).isEqualTo("1");
  assert("Empty cell color after drag").that(puzzle.cells[1][1].data.color).isEqualTo(puzzle.colorSchema.brightColor);
  assert("Empty cell text after drag").that(puzzle.cells[1][1].data.text).isNull();

  // Copy to the clue cell c3: it is painted, but keeps its own number.
  suite.drag(puzzle, puzzle.cells[0][1].center(), puzzle.cells[2][2].center());

  assert("Clue cell value after drag").that(puzzle.cells[2][2].getValue()).isEqualTo("1");
  assert("Clue cell color after drag").that(puzzle.cells[2][2].data.color).isEqualTo(puzzle.colorSchema.brightColor);
  assert("Clue cell text after drag").that(puzzle.cells[2][2].data.text).isEqualTo("1");
}),

// Data collector tests
test('Data collector',(suite) => {
  let puzzle = suite.showPuzzle("hexa_paint", "3x3", {"b1": "2", "c3": "1"});
  puzzle.start();

  // a1 and b1 are painted, a2 is marked by the circle.
  suite.click(puzzle, puzzle.cells[0][0].center());
  suite.click(puzzle, puzzle.cells[0][1].center());
  suite.click(puzzle, puzzle.cells[1][0].center());
  suite.click(puzzle, puzzle.cells[1][0].center());

  assert("Submission data").that(puzzle.collectData()).isEqualTo({"a1": "1", "b1": "1"});
}),

test('Author data collector',(suite) => {
  let puzzle = suite.showPuzzle("hexa_paint", "3x3");
  puzzle.edit();

  // Choose "7" for b2.
  puzzle.cells[1][1].switchOnChooser(8);

  assert("Puzzle data").that(puzzle.collectData()).isEqualTo({"b2": "7"});
}),

);
