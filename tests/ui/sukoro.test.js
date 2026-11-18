sukoroTestSuite = uiTestSuite("Sukoro", "squarepuzzle", "squarePuzzleType",

// Puzzle 5x5 and its solution (the number shows how many neighbour cells contain numbers):
//   . . . . .      . 1 . . .      a1 b1 c1 d1 e1
//   . 3 . . .      1 3 2 . .      a2 b2 c2 d2 e2
//   . . . 1 .      . . 3 1 .      a3 b3 c3 d3 e3
//   . . . . .      . . 1 . .      a4 b4 c4 d4 e4
//   . . . . .      . . . . .      a5 b5 c5 d5 e5

beforeSuite((suite, cb)=> {
  suite.CLUES = {"b2": "3", "d3": "1"};
  cb();
}),

// Controller definition tests
test('Solver controllers',(suite) => {
  let puzzle = suite.showPuzzle("sukoro", "5x5", suite.CLUES);
  puzzle.start();

  assert("Empty cell chooser").that(puzzle.cells[0][0].chooserValues).containsExactly([{},{text: '1', returnValue: '1'},{text: '2', returnValue: '2'},{text: '3', returnValue: '3'},{text: '4', returnValue: '4'},{image: 'white_circle', keepPencil: true},{image: 'cross'}]);
  assert("Empty cell click").that(puzzle.cells[0][0].clickSwitch).isNull();
  assert("Clue cell chooser").that(puzzle.cells[1][1].chooserValues).isNull();
  assert("Clue cell click").that(puzzle.cells[1][1].clickSwitch).isNull();
  assert("Cell drag handler").that(puzzle.cells[0][0].drawDragHandler).isNull();
  assert("Cell drag processor").that(puzzle.cells[0][0].dragProcessor).isNull();
  assert("Edge click").that(puzzle.edges[0][0][1].clickSwitch).isNull();
}),

test('Author controllers',(suite) => {
  let puzzle = suite.showPuzzle("sukoro", "5x5");
  puzzle.edit();

  assert("Cell chooser").that(puzzle.cells[0][0].chooserValues).containsExactly([{},{text: '1', returnValue: '1'},{text: '2', returnValue: '2'},{text: '3', returnValue: '3'},{text: '4', returnValue: '4'}]);
  assert("Cell click").that(puzzle.cells[0][0].clickSwitch).isNull();
  assert("Edge click").that(puzzle.edges[0][0][1].clickSwitch).isNull();
}),

test('Chooser does not depend on the grid size',(suite) => {
  let puzzle = suite.showPuzzle("sukoro", "8x8");
  puzzle.start();

  // A cell has at most four neighbours.
  assert("Cell chooser").that(puzzle.cells[0][0].chooserValues).containsExactly([{},{text: '1', returnValue: '1'},{text: '2', returnValue: '2'},{text: '3', returnValue: '3'},{text: '4', returnValue: '4'},{image: 'white_circle', keepPencil: true},{image: 'cross'}]);
}),

// Mouse processing tests
test('Process click to empty cell',(suite) => {
  let puzzle = suite.showPuzzle("sukoro", "5x5", suite.CLUES);
  puzzle.start();

  assert("Cell value before click").that(puzzle.cells[0][1].getValue()).isNull();
  assert("Cell data before click").that(puzzle.cells[0][1].data).isEqualTo({});
  assert("Chooser before click").that(puzzle.controller.chooserBuilder.chooserElements).isEmptyArray();

  suite.cellClick(puzzle, "b1");

  assert("Chooser after click").that(puzzle.controller.chooserBuilder.chooserElements).isNonEmptyArray();
  assert("Chooser connected to the cell").that(puzzle.controller.chooserBuilder.element.col).isEqualTo(1);
  assert("Chooser connected to the cell").that(puzzle.controller.chooserBuilder.element.row).isEqualTo(0);
  assert("Cell data after click").that(puzzle.cells[0][1].data).isEqualTo({});

  puzzle.cells[0][1].switchOnChooser(1);

  assert("Cell value after choice").that(puzzle.cells[0][1].getValue()).isEqualTo('1');
  assert("Cell data after choice").that(puzzle.cells[0][1].data).isEqualTo({text: '1', returnValue: '1'});

  puzzle.cells[0][1].switchOnChooser(4);

  assert("Cell value after second choice").that(puzzle.cells[0][1].getValue()).isEqualTo('4');

  puzzle.cells[0][1].switchOnChooser(0);

  assert("Cell value after choosing the empty item").that(puzzle.cells[0][1].getValue()).isNull();
  assert("Cell data after choosing the empty item").that(puzzle.cells[0][1].data).isEqualTo({});
}),

test('Solver marks are not submitted',(suite) => {
  let puzzle = suite.showPuzzle("sukoro", "5x5", suite.CLUES);
  puzzle.start();

  // Number in b1, circle in a2 (some number should be here), cross in a1 (empty cell).
  puzzle.cells[0][1].switchOnChooser(1);
  puzzle.cells[1][0].switchOnChooser(5);
  puzzle.cells[0][0].switchOnChooser(6);

  assert("Circle data").that(puzzle.cells[1][0].data).isEqualTo({image: 'white_circle', keepPencil: true});
  assert("Circle value").that(puzzle.cells[1][0].getValue()).isNull();
  assert("Cross data").that(puzzle.cells[0][0].data).isEqualTo({image: 'cross'});
  assert("Cross value").that(puzzle.cells[0][0].getValue()).isNull();
  assert("Submission data").that(puzzle.collectData()).isEqualTo({"b1": "1"});

  // The circle is replaced with the number.
  puzzle.cells[1][0].switchOnChooser(1);

  assert("Cell data after replacing the circle").that(puzzle.cells[1][0].data).isEqualTo({text: '1', returnValue: '1'});
  assert("Submission data after replacing the circle").that(puzzle.collectData()).isEqualTo({"b1": "1", "a2": "1"});
}),

test('Clues can not be changed by solver',(suite) => {
  let puzzle = suite.showPuzzle("sukoro", "5x5", suite.CLUES);
  puzzle.start();

  suite.cellClick(puzzle, "b2");
  suite.cellClick(puzzle, "d3");

  assert("Chooser after clicks").that(puzzle.controller.chooserBuilder.chooserElements).isEmptyArray();
  assert("Clue data after click").that(puzzle.cells[1][1].data).isEqualTo({text: '3'});
  assert("Clue is not a solver value").that(puzzle.cells[1][1].getValue()).isNull();
  assert("Submission data").that(puzzle.collectData()).isEqualTo({});
}),

test('Author chooser',(suite) => {
  let puzzle = suite.showPuzzle("sukoro", "5x5");
  puzzle.edit();

  suite.cellClick(puzzle, "d3");

  assert("Chooser after click").that(puzzle.controller.chooserBuilder.chooserElements).isNonEmptyArray();
  assert("Chooser connected to the cell").that(puzzle.controller.chooserBuilder.element.col).isEqualTo(3);
  assert("Chooser connected to the cell").that(puzzle.controller.chooserBuilder.element.row).isEqualTo(2);

  puzzle.cells[2][3].switchOnChooser(4);

  assert("Cell value after choice").that(puzzle.cells[2][3].getValue()).isEqualTo('4');
  assert("Cell data after choice").that(puzzle.cells[2][3].data).isEqualTo({text: '4', returnValue: '4'});

  puzzle.cells[2][3].switchOnChooser(0);

  assert("Cell value after choosing the empty item").that(puzzle.cells[2][3].getValue()).isNull();
  assert("Puzzle data").that(puzzle.collectData()).isEqualTo({});
}),

// Data collector tests
test('Data collector',(suite) => {
  let puzzle = suite.showPuzzle("sukoro", "5x5", suite.CLUES);
  puzzle.start();

  assert("Submission data of the empty grid").that(puzzle.collectData()).isEqualTo({});

  puzzle.cells[0][1].switchOnChooser(1);
  puzzle.cells[1][0].switchOnChooser(1);
  puzzle.cells[1][2].switchOnChooser(2);
  puzzle.cells[2][2].switchOnChooser(3);
  puzzle.cells[3][2].switchOnChooser(1);
  // Crosses for some of the empty cells.
  puzzle.cells[0][0].switchOnChooser(6);
  puzzle.cells[4][4].switchOnChooser(6);

  // Given numbers and crosses are not submitted.
  assert("Submission data").that(puzzle.collectData()).isEqualTo({"b1": "1", "a2": "1", "c2": "2", "c3": "3", "c4": "1"});
}),

test('Author data collector',(suite) => {
  let puzzle = suite.showPuzzle("sukoro", "5x5");
  puzzle.edit();

  assert("Puzzle data of the empty grid").that(puzzle.collectData()).isEqualTo({});

  puzzle.cells[1][1].switchOnChooser(3);
  puzzle.cells[2][3].switchOnChooser(1);

  assert("Puzzle data").that(puzzle.collectData()).isEqualTo(suite.CLUES);
}),

);
