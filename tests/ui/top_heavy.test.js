topHeavyTestSuite = uiTestSuite("Top Heavy", "squarepuzzle", "squarePuzzleType",

// Puzzle 4x4 with digits 1-3 (dimension "4x4-3") and its solution (x is an empty cell):
//   3 . . x      3 2 1 x      a1 b1 c1 d1
//   . . . .      2 1 x 3      a2 b2 c2 d2
//   . . 3 .      1 x 3 2      a3 b3 c3 d3
//   . . . .      x 3 2 1      a4 b4 c4 d4
// Clues are 3 in a1, 3 in c3 and the cross in d1 (the cell which is empty in the solution).

beforeSuite((suite, cb)=> {
  suite.CLUES = {"a1": "3", "c3": "3", "d1": "cross"};
  cb();
}),

// Controller definition tests
test('Solver controllers',(suite) => {
  let puzzle = suite.showPuzzle("top_heavy", "4x4-3", suite.CLUES);
  puzzle.start();

  assert("Empty cell chooser").that(puzzle.cells[0][1].chooserValues).containsExactly([{},{text: '1', returnValue: '1'},{text: '2', returnValue: '2'},{text: '3', returnValue: '3'},{image: 'white_circle', keepPencil: true},{image: 'cross'}]);
  assert("Empty cell click").that(puzzle.cells[0][1].clickSwitch).isNull();
  assert("Digit clue chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("Digit clue click").that(puzzle.cells[0][0].clickSwitch).isNull();
  assert("Cross clue chooser").that(puzzle.cells[0][3].chooserValues).isNull();
  assert("Cross clue click").that(puzzle.cells[0][3].clickSwitch).isNull();
  assert("Cell drag handler").that(puzzle.cells[0][1].drawDragHandler).isNull();
  assert("Cell drag processor").that(puzzle.cells[0][1].dragProcessor).isNull();
}),

test('Author controllers',(suite) => {
  let puzzle = suite.showPuzzle("top_heavy", "4x4-3");
  puzzle.edit();

  assert("Cell chooser").that(puzzle.cells[0][0].chooserValues).containsExactly([{},{text: '1', returnValue: '1'},{text: '2', returnValue: '2'},{text: '3', returnValue: '3'},{image: 'cross', returnValue: 'cross'}]);
  assert("Cell click").that(puzzle.cells[0][0].clickSwitch).isNull();
  assert("Edge click").that(puzzle.edges[0][0][1].clickSwitch).isNull();
}),

test('Maximal digit is taken from dimension',(suite) => {
  let puzzle = suite.showPuzzle("top_heavy", "6x6-4");
  puzzle.start();

  assert("Solver chooser").that(puzzle.cells[0][0].chooserValues).containsExactly([{},{text: '1', returnValue: '1'},{text: '2', returnValue: '2'},{text: '3', returnValue: '3'},{text: '4', returnValue: '4'},{image: 'white_circle', keepPencil: true},{image: 'cross'}]);

  Snap(suite.GRID_SELECTOR).clear();
  puzzle = suite.showPuzzle("top_heavy", "6x6-5");
  puzzle.edit();

  assert("Author chooser").that(puzzle.cells[0][0].chooserValues).containsExactly([{},{text: '1', returnValue: '1'},{text: '2', returnValue: '2'},{text: '3', returnValue: '3'},{text: '4', returnValue: '4'},{text: '5', returnValue: '5'},{image: 'cross', returnValue: 'cross'}]);
}),

// Clue display tests
test('Show clues',(suite) => {
  let puzzle = suite.showPuzzle("top_heavy", "4x4-3", suite.CLUES);
  puzzle.start();

  assert("Digit clue").that(puzzle.cells[0][0].data).isEqualTo({text: '3'});
  assert("Cross clue").that(puzzle.cells[0][3].data).isEqualTo({image: 'cross'});
  assert("Empty cell").that(puzzle.cells[0][1].data).isEqualTo({});
  assert("Cross clue is a clue").that(puzzle.cells[0][3].isClue).isEqualTo(true);
}),

// Mouse processing tests
test('Process click to empty cell',(suite) => {
  let puzzle = suite.showPuzzle("top_heavy", "4x4-3", suite.CLUES);
  puzzle.start();

  assert("Cell value before click").that(puzzle.cells[0][1].getValue()).isNull();
  assert("Cell data before click").that(puzzle.cells[0][1].data).isEqualTo({});
  assert("Chooser before click").that(puzzle.controller.chooserBuilder.chooserElements).isEmptyArray();

  suite.cellClick(puzzle, "b1");

  assert("Chooser after click").that(puzzle.controller.chooserBuilder.chooserElements).isNonEmptyArray();
  assert("Chooser connected to the cell").that(puzzle.controller.chooserBuilder.element.col).isEqualTo(1);
  assert("Chooser connected to the cell").that(puzzle.controller.chooserBuilder.element.row).isEqualTo(0);
  assert("Cell data after click").that(puzzle.cells[0][1].data).isEqualTo({});

  puzzle.cells[0][1].switchOnChooser(2);

  assert("Cell value after choice").that(puzzle.cells[0][1].getValue()).isEqualTo('2');
  assert("Cell data after choice").that(puzzle.cells[0][1].data).isEqualTo({text: '2', returnValue: '2'});

  puzzle.cells[0][1].switchOnChooser(0);

  assert("Cell value after choosing the empty item").that(puzzle.cells[0][1].getValue()).isNull();
  assert("Cell data after choosing the empty item").that(puzzle.cells[0][1].data).isEqualTo({});
}),

test('Solver marks are not submitted',(suite) => {
  let puzzle = suite.showPuzzle("top_heavy", "4x4-3", suite.CLUES);
  puzzle.start();

  // Digit in b1, circle in a2 (some digit should be here), cross in c2 (empty cell).
  puzzle.cells[0][1].switchOnChooser(2);
  puzzle.cells[1][0].switchOnChooser(4);
  puzzle.cells[1][2].switchOnChooser(5);

  assert("Circle data").that(puzzle.cells[1][0].data).isEqualTo({image: 'white_circle', keepPencil: true});
  assert("Circle value").that(puzzle.cells[1][0].getValue()).isNull();
  assert("Cross data").that(puzzle.cells[1][2].data).isEqualTo({image: 'cross'});
  assert("Cross value").that(puzzle.cells[1][2].getValue()).isNull();
  assert("Submission data").that(puzzle.collectData()).isEqualTo({"b1": "2"});
}),

test('Clues can not be changed by solver',(suite) => {
  let puzzle = suite.showPuzzle("top_heavy", "4x4-3", suite.CLUES);
  puzzle.start();

  // Digit clue and cross clue.
  suite.cellClick(puzzle, "a1");
  suite.cellClick(puzzle, "d1");

  assert("Chooser after clicks").that(puzzle.controller.chooserBuilder.chooserElements).isEmptyArray();
  assert("Digit clue after click").that(puzzle.cells[0][0].data).isEqualTo({text: '3'});
  assert("Cross clue after click").that(puzzle.cells[0][3].data).isEqualTo({image: 'cross'});
  assert("Submission data").that(puzzle.collectData()).isEqualTo({});
}),

test('Author chooser',(suite) => {
  let puzzle = suite.showPuzzle("top_heavy", "4x4-3");
  puzzle.edit();

  suite.cellClick(puzzle, "d1");

  assert("Chooser after click").that(puzzle.controller.chooserBuilder.chooserElements).isNonEmptyArray();
  assert("Chooser connected to the cell").that(puzzle.controller.chooserBuilder.element.col).isEqualTo(3);
  assert("Chooser connected to the cell").that(puzzle.controller.chooserBuilder.element.row).isEqualTo(0);

  puzzle.cells[0][3].switchOnChooser(4);

  assert("Cross value").that(puzzle.cells[0][3].getValue()).isEqualTo('cross');
  assert("Cross data").that(puzzle.cells[0][3].data).isEqualTo({image: 'cross', returnValue: 'cross'});

  puzzle.cells[0][3].switchOnChooser(1);

  assert("Digit value").that(puzzle.cells[0][3].getValue()).isEqualTo('1');
  assert("Digit data").that(puzzle.cells[0][3].data).isEqualTo({text: '1', returnValue: '1'});

  puzzle.cells[0][3].switchOnChooser(0);

  assert("Value after choosing the empty item").that(puzzle.cells[0][3].getValue()).isNull();
  assert("Puzzle data").that(puzzle.collectData()).isEqualTo({});
}),

// Data collector tests
test('Data collector',(suite) => {
  let puzzle = suite.showPuzzle("top_heavy", "4x4-3", suite.CLUES);
  puzzle.start();

  assert("Submission data of the empty grid").that(puzzle.collectData()).isEqualTo({});

  let rows = ["-21-", "21x3", "1x-2", "x321"];
  rows.forEach((items, row) => {
    for (let col = 0; col < 4; col++) {
      if (items[col] == "x") {
        // Cross for the empty cell.
        puzzle.cells[row][col].switchOnChooser(5);
      } else if (items[col] != "-") {
        puzzle.cells[row][col].switchOnChooser(parseInt(items[col]));
      }
    }
  });

  // Clues and crosses are not submitted.
  assert("Submission data").that(puzzle.collectData()).isEqualTo(
    {"b1": "2", "c1": "1", "a2": "2", "b2": "1", "d2": "3", "a3": "1", "d3": "2", "b4": "3", "c4": "2", "d4": "1"});
}),

test('Author data collector',(suite) => {
  let puzzle = suite.showPuzzle("top_heavy", "4x4-3");
  puzzle.edit();

  assert("Puzzle data of the empty grid").that(puzzle.collectData()).isEqualTo({});

  puzzle.cells[0][0].switchOnChooser(3);
  puzzle.cells[2][2].switchOnChooser(3);
  puzzle.cells[0][3].switchOnChooser(4);

  assert("Puzzle data").that(puzzle.collectData()).isEqualTo(suite.CLUES);
}),

);
