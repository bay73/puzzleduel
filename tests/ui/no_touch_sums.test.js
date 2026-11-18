noTouchSumsTestSuite = uiTestSuite("No Touch Sums", "squarepuzzle", "squarePuzzleType",

// Puzzle 4x4 with digits 1-3 (dimension "4x4-3") and its solution
// (sums are given to the right for some rows and at the bottom for all columns):
//   2 . 1 .  3      a1 b1 c1 d1
//   . . . .         a2 b2 c2 d2
//   . 3 . 1  4      a3 b3 c3 d3
//   . . . .         a4 b4 c4 d4
//   2 3 1 1
// Outer cells are available as puzzle.right[row] and puzzle.bottom[col].

beforeSuite((suite, cb)=> {
  suite.CLUES = {"bottom": ["2", "3", "1", "1"], "right": ["3", null, "4", null]};
  cb();
}),

// Controller definition tests
test('Solver controllers',(suite) => {
  let puzzle = suite.showPuzzle("no_touch_sums", "4x4-3", suite.CLUES);
  puzzle.start();

  assert("Cell chooser").that(puzzle.cells[0][0].chooserValues).containsExactly([{},{text: '1', returnValue: '1'},{text: '2', returnValue: '2'},{text: '3', returnValue: '3'},{image: 'white_circle', keepPencil: true},{image: 'cross'}]);
  assert("Cell click").that(puzzle.cells[0][0].clickSwitch).isNull();
  assert("Bottom clue chooser").that(puzzle.bottom[0].chooserValues).isNull();
  assert("Bottom clue click").that(puzzle.bottom[0].clickSwitch).containsExactly([{text: '2'}, {text: '2', image: 'white_circle'}]);
  assert("Right clue chooser").that(puzzle.right[0].chooserValues).isNull();
  assert("Right clue click").that(puzzle.right[0].clickSwitch).containsExactly([{text: '3'}, {text: '3', image: 'white_circle'}]);
  assert("Empty right clue chooser").that(puzzle.right[1].chooserValues).isNull();
  assert("Empty right clue click").that(puzzle.right[1].clickSwitch).containsExactly([{}, {image: 'white_circle'}]);
  assert("Cell drag processor").that(puzzle.cells[0][0].dragProcessor).isNull();
}),

test('Solver controllers for cross clue',(suite) => {
  let puzzle = suite.showPuzzle("no_touch_sums", "4x4-3", {"a2": "cross", "bottom": ["2", "3", "1", "1"], "right": ["3", null, "4", null]});
  puzzle.start();

  assert("Cross cell data").that(puzzle.cells[1][0].data).isEqualTo({image: 'cross'});
  assert("Cross cell chooser").that(puzzle.cells[1][0].chooserValues).isNull();
  assert("Cross cell click").that(puzzle.cells[1][0].clickSwitch).isNull();

  suite.cellClick(puzzle, "a2");

  assert("Chooser after click").that(puzzle.controller.chooserBuilder.chooserElements).isEmptyArray();
  assert("Cross cell data after click").that(puzzle.cells[1][0].data).isEqualTo({image: 'cross'});
}),

test('Author controllers',(suite) => {
  let puzzle = suite.showPuzzle("no_touch_sums", "4x4-3");
  puzzle.edit();

  assert("Cell chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("Cell click").that(puzzle.cells[0][0].clickSwitch).containsExactly([{}, {image: 'cross', returnValue: 'cross'}]);
  assert("Bottom clue chooser").that(puzzle.bottom[0].chooserValues).containsAtLeast([{},{text: '1', returnValue: '1'},{text: '2', returnValue: '2'},{text: '10', returnValue: '10'},{text: '99', returnValue: '99'}]);
  assert("Number of items in the bottom clue chooser").that(puzzle.bottom[0].chooserValues.length).isEqualTo(100);
  assert("Bottom clue click").that(puzzle.bottom[0].clickSwitch).isNull();
  assert("Right clue chooser").that(puzzle.right[0].chooserValues).containsAtLeast([{},{text: '1', returnValue: '1'},{text: '2', returnValue: '2'},{text: '10', returnValue: '10'},{text: '99', returnValue: '99'}]);
  assert("Number of items in the right clue chooser").that(puzzle.right[0].chooserValues.length).isEqualTo(100);
  assert("Right clue click").that(puzzle.right[0].clickSwitch).isNull();
  // Empty item, numbers 1-9 and "+10" are shown.
  assert("Number of shown items in the clue chooser").that(puzzle.bottom[0].chooserData().length).isEqualTo(11);
  assert("The last number in the clue chooser").that(puzzle.bottom[0].chooserData()[9]).isEqualTo({text: '9', returnValue: '9'});
  assert("Plus 10 item").that(puzzle.bottom[0].chooserData()[10]).isEqualTo({text: '+10'});
}),

test('Maximal digit is taken from dimension',(suite) => {
  let puzzle = suite.showPuzzle("no_touch_sums", "6x6-5", {});
  puzzle.start();

  assert("Cell chooser").that(puzzle.cells[0][0].chooserValues).containsExactly([{},{text: '1', returnValue: '1'},{text: '2', returnValue: '2'},{text: '3', returnValue: '3'},{text: '4', returnValue: '4'},{text: '5', returnValue: '5'},{image: 'white_circle', keepPencil: true},{image: 'cross'}]);
}),

// Clue display tests
test('Show outer clues',(suite) => {
  let puzzle = suite.showPuzzle("no_touch_sums", "4x4-3", suite.CLUES);
  puzzle.start();

  assert("Bottom clues").that(puzzle.bottom.map(cell => cell.data.text)).isEqualTo(['2', '3', '1', '1']);
  assert("Right clue of the first row").that(puzzle.right[0].data).isEqualTo({text: '3'});
  assert("Right clue of the second row").that(puzzle.right[1].data).isEqualTo({});
  assert("Right clue of the third row").that(puzzle.right[2].data).isEqualTo({text: '4'});
  assert("Right clue of the fourth row").that(puzzle.right[3].data).isEqualTo({});
}),

// Mouse processing tests
test('Process click to empty cell',(suite) => {
  let puzzle = suite.showPuzzle("no_touch_sums", "4x4-3", suite.CLUES);
  puzzle.start();

  assert("Cell value before click").that(puzzle.cells[0][0].getValue()).isNull();
  assert("Chooser before click").that(puzzle.controller.chooserBuilder.chooserElements).isEmptyArray();

  suite.cellClick(puzzle, "a1");

  assert("Chooser after click").that(puzzle.controller.chooserBuilder.chooserElements).isNonEmptyArray();
  assert("Chooser connected to the cell").that(puzzle.controller.chooserBuilder.element.col).isEqualTo(0);
  assert("Chooser connected to the cell").that(puzzle.controller.chooserBuilder.element.row).isEqualTo(0);

  puzzle.cells[0][0].switchOnChooser(2);

  assert("Cell value after choice").that(puzzle.cells[0][0].getValue()).isEqualTo('2');
  assert("Cell data after choice").that(puzzle.cells[0][0].data).isEqualTo({text: '2', returnValue: '2'});
}),

test('Solver marks are not submitted',(suite) => {
  let puzzle = suite.showPuzzle("no_touch_sums", "4x4-3", suite.CLUES);
  puzzle.start();

  // Digit in a1, circle in c1 (some digit should be here), cross in b1 (empty cell).
  puzzle.cells[0][0].switchOnChooser(2);
  puzzle.cells[0][2].switchOnChooser(4);
  puzzle.cells[0][1].switchOnChooser(5);

  assert("Circle data").that(puzzle.cells[0][2].data).isEqualTo({image: 'white_circle', keepPencil: true});
  assert("Circle value").that(puzzle.cells[0][2].getValue()).isNull();
  assert("Cross data").that(puzzle.cells[0][1].data).isEqualTo({image: 'cross'});
  assert("Cross value").that(puzzle.cells[0][1].getValue()).isNull();
  assert("Submission data").that(puzzle.collectData()).isEqualTo({"a1": "2"});
}),

test('Process click to outer clues',(suite) => {
  let puzzle = suite.showPuzzle("no_touch_sums", "4x4-3", suite.CLUES);
  puzzle.start();

  // Clue to the right of the first row.
  let point = suite.cellPoint(puzzle, 4, 0);
  suite.click(puzzle, point);

  assert("Right clue data after click").that(puzzle.right[0].data).isEqualTo({text: '3', image: 'white_circle'});
  assert("Right clue value after click").that(puzzle.right[0].getValue()).isNull();

  suite.click(puzzle, point);

  assert("Right clue data after second click").that(puzzle.right[0].data).isEqualTo({text: '3'});

  // Empty outer cell to the right of the second row.
  suite.click(puzzle, suite.cellPoint(puzzle, 4, 1));

  assert("Empty right clue data after click").that(puzzle.right[1].data).isEqualTo({image: 'white_circle'});

  // Clue below the column b.
  suite.click(puzzle, suite.cellPoint(puzzle, 1, 4));

  assert("Bottom clue data after click").that(puzzle.bottom[1].data).isEqualTo({text: '3', image: 'white_circle'});
  assert("Other bottom clue").that(puzzle.bottom[0].data).isEqualTo({text: '2'});
  assert("Submission data").that(puzzle.collectData()).isEqualTo({});
}),

test('Author sets crosses by click',(suite) => {
  let puzzle = suite.showPuzzle("no_touch_sums", "4x4-3");
  puzzle.edit();

  suite.cellClick(puzzle, "b2");

  assert("Chooser after click").that(puzzle.controller.chooserBuilder.chooserElements).isEmptyArray();
  assert("Cell value after click").that(puzzle.cells[1][1].getValue()).isEqualTo('cross');
  assert("Cell data after click").that(puzzle.cells[1][1].data).isEqualTo({image: 'cross', returnValue: 'cross'});

  suite.cellClick(puzzle, "b2");

  assert("Cell value after second click").that(puzzle.cells[1][1].getValue()).isNull();
  assert("Cell data after second click").that(puzzle.cells[1][1].data).isEqualTo({});
}),

test('Author chooser for outer clues',(suite) => {
  let puzzle = suite.showPuzzle("no_touch_sums", "4x4-3");
  puzzle.edit();

  assert("Chooser before click").that(puzzle.controller.chooserBuilder.chooserElements).isEmptyArray();

  // Outer cell below the column c.
  suite.click(puzzle, suite.cellPoint(puzzle, 2, 4));

  assert("Chooser after click").that(puzzle.controller.chooserBuilder.chooserElements).isNonEmptyArray();
  assert("Chooser connected to the cell").that(puzzle.controller.chooserBuilder.element.col).isEqualTo(2);
  assert("Chooser connected to the cell").that(puzzle.controller.chooserBuilder.element.row).isEqualTo(4);

  puzzle.bottom[2].switchOnChooser(6);

  assert("Bottom clue value").that(puzzle.bottom[2].getValue()).isEqualTo('6');
  assert("Bottom clue data").that(puzzle.bottom[2].data).isEqualTo({text: '6', returnValue: '6'});
}),

test('Plus 10 chooser',(suite) => {
  let puzzle = suite.showPuzzle("no_touch_sums", "4x4-3");
  puzzle.edit();

  // Choose 3, then "+10" (item 10 of the chooser) two times.
  puzzle.right[1].switchOnChooser(3);
  puzzle.right[1].switchOnChooser(10);

  assert("Right clue value after +10").that(puzzle.right[1].getValue()).isEqualTo('13');
  assert("Right clue data after +10").that(puzzle.right[1].data).isEqualTo({text: '13', returnValue: '13'});

  puzzle.right[1].switchOnChooser(10);

  assert("Right clue value after second +10").that(puzzle.right[1].getValue()).isEqualTo('23');

  // "+10" for the empty cell.
  puzzle.bottom[0].switchOnChooser(10);

  assert("Bottom clue value after +10").that(puzzle.bottom[0].getValue()).isEqualTo('10');
}),

// Data collector tests
test('Data collector',(suite) => {
  let puzzle = suite.showPuzzle("no_touch_sums", "4x4-3", suite.CLUES);
  puzzle.start();

  assert("Submission data of the empty grid").that(puzzle.collectData()).isEqualTo({});

  puzzle.cells[0][0].switchOnChooser(2);
  puzzle.cells[0][2].switchOnChooser(1);
  puzzle.cells[2][1].switchOnChooser(3);
  puzzle.cells[2][3].switchOnChooser(1);
  // Cross off the clues of the finished row and column: it doesn't change the submission.
  suite.click(puzzle, suite.cellPoint(puzzle, 4, 0));
  suite.click(puzzle, suite.cellPoint(puzzle, 0, 4));

  assert("Submission data").that(puzzle.collectData()).isEqualTo({"a1": "2", "c1": "1", "b3": "3", "d3": "1"});
}),

test('Author data collector',(suite) => {
  let puzzle = suite.showPuzzle("no_touch_sums", "4x4-3");
  puzzle.edit();

  assert("Puzzle data of the empty grid").that(puzzle.collectData()).isEqualTo({});

  puzzle.bottom[0].switchOnChooser(2);
  puzzle.bottom[1].switchOnChooser(3);
  puzzle.bottom[2].switchOnChooser(1);
  puzzle.bottom[3].switchOnChooser(1);
  puzzle.right[0].switchOnChooser(3);
  puzzle.right[2].switchOnChooser(4);

  assert("Puzzle data").that(puzzle.collectData()).isEqualTo(suite.CLUES);

  // Cross in a2: this cell should be empty in the solution.
  suite.cellClick(puzzle, "a2");

  assert("Puzzle data with cross").that(puzzle.collectData()).isEqualTo({"a2": "cross", "bottom": ["2", "3", "1", "1"], "right": ["3", null, "4", null]});
}),

);
