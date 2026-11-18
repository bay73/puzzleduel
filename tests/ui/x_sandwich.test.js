xSandwichTestSuite = uiTestSuite("X-Sandwich", "squarepuzzle", "squarePuzzleType",

// Puzzle 4x4 (digits 1-2, each digit two times in every row and column) and its solution.
// Outside clue is the sum of digits between the first digit from this side and its second copy.
//       2 . . 4
//   4   1 2 2 1   .       a1 b1 c1 d1
//   2   2 1 1 2   .       a2 b2 c2 d2
//   0   1 1 2 2   .       a3 b3 c3 d3
//   .   2 2 1 1   0       a4 b4 c4 d4
//       1 . . .
// Digit 1 in a1 is given. Outer cells are available as puzzle.top[col], puzzle.bottom[col],
// puzzle.left[row] and puzzle.right[row].

beforeSuite((suite, cb)=> {
  suite.CLUES = {"a1": "1", "top": ["2", null, null, "4"], "bottom": ["1", null, null, null], "left": ["4", "2", "0", null], "right": [null, null, null, "0"]};
  cb();
}),

// Controller definition tests
test('Solver controllers',(suite) => {
  let puzzle = suite.showPuzzle("x_sandwich", "4x4", suite.CLUES);
  puzzle.start();

  // Digits are from 1 to the half of the grid size.
  assert("Empty cell chooser").that(puzzle.cells[0][1].chooserValues).containsExactly([{},{text: '1', returnValue: '1'},{text: '2', returnValue: '2'},{image: 'white_circle', keepPencil: true},{image: 'cross'}]);
  assert("Empty cell click").that(puzzle.cells[0][1].clickSwitch).isNull();
  assert("Clue cell chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("Clue cell click").that(puzzle.cells[0][0].clickSwitch).isNull();
  assert("Top clue chooser").that(puzzle.top[0].chooserValues).isNull();
  assert("Top clue click").that(puzzle.top[0].clickSwitch).containsExactly([{text: '2'}, {text: '2', image: 'white_circle'}]);
  assert("Empty top clue click").that(puzzle.top[1].clickSwitch).containsExactly([{}, {image: 'white_circle'}]);
  assert("Bottom clue chooser").that(puzzle.bottom[0].chooserValues).isNull();
  assert("Bottom clue click").that(puzzle.bottom[0].clickSwitch).containsExactly([{text: '1'}, {text: '1', image: 'white_circle'}]);
  assert("Left clue chooser").that(puzzle.left[2].chooserValues).isNull();
  assert("Left clue click").that(puzzle.left[2].clickSwitch).containsExactly([{text: '0'}, {text: '0', image: 'white_circle'}]);
  assert("Right clue chooser").that(puzzle.right[3].chooserValues).isNull();
  assert("Right clue click").that(puzzle.right[3].clickSwitch).containsExactly([{text: '0'}, {text: '0', image: 'white_circle'}]);
  assert("Cell drag handler").that(puzzle.cells[0][1].drawDragHandler).isNull();
  assert("Cell drag processor").that(puzzle.cells[0][1].dragProcessor).isNull();
}),

test('Author controllers',(suite) => {
  let puzzle = suite.showPuzzle("x_sandwich", "4x4");
  puzzle.edit();

  // The biggest sum for the digits 1, 1, 2, 2 is 4.
  let sums = [{},{text: '0', returnValue: '0'},{text: '1', returnValue: '1'},{text: '2', returnValue: '2'},{text: '3', returnValue: '3'},{text: '4', returnValue: '4'}];
  assert("Cell chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("Cell click").that(puzzle.cells[0][0].clickSwitch).containsExactly([{},{text: '1', returnValue: '1'},{text: '2', returnValue: '2'}]);
  assert("Top clue chooser").that(puzzle.top[0].chooserValues).containsExactly(sums);
  assert("Top clue click").that(puzzle.top[0].clickSwitch).isNull();
  assert("Bottom clue chooser").that(puzzle.bottom[0].chooserValues).containsExactly(sums);
  assert("Bottom clue click").that(puzzle.bottom[0].clickSwitch).isNull();
  assert("Left clue chooser").that(puzzle.left[0].chooserValues).containsExactly(sums);
  assert("Left clue click").that(puzzle.left[0].clickSwitch).isNull();
  assert("Right clue chooser").that(puzzle.right[0].chooserValues).containsExactly(sums);
  assert("Right clue click").that(puzzle.right[0].clickSwitch).isNull();
}),

test('Controllers depend on the grid size',(suite) => {
  let puzzle = suite.showPuzzle("x_sandwich", "6x6");
  puzzle.start();

  assert("Solver chooser for 6x6").that(puzzle.cells[0][0].chooserValues).containsExactly([{},{text: '1', returnValue: '1'},{text: '2', returnValue: '2'},{text: '3', returnValue: '3'},{image: 'white_circle', keepPencil: true},{image: 'cross'}]);

  Snap(suite.GRID_SELECTOR).clear();
  puzzle = suite.showPuzzle("x_sandwich", "6x6");
  puzzle.edit();

  // Sums 0-10 are shown without "+10" item.
  assert("Author cell click for 6x6").that(puzzle.cells[0][0].clickSwitch).containsExactly([{},{text: '1', returnValue: '1'},{text: '2', returnValue: '2'},{text: '3', returnValue: '3'}]);
  assert("Number of items in the clue chooser for 6x6").that(puzzle.top[0].chooserValues.length).isEqualTo(12);
  assert("Number of shown items in the clue chooser for 6x6").that(puzzle.top[0].chooserData().length).isEqualTo(12);
  assert("The last item of the clue chooser for 6x6").that(puzzle.top[0].chooserData()[11]).isEqualTo({text: '10', returnValue: '10'});

  Snap(suite.GRID_SELECTOR).clear();
  puzzle = suite.showPuzzle("x_sandwich", "8x8");
  puzzle.edit();

  // Sums 0-18: empty item, numbers 0-9 and "+10" are shown.
  assert("Number of items in the clue chooser for 8x8").that(puzzle.top[0].chooserValues.length).isEqualTo(20);
  assert("The last item of the clue chooser for 8x8").that(puzzle.top[0].chooserValues[19]).isEqualTo({text: '18', returnValue: '18'});
  assert("Number of shown items in the clue chooser for 8x8").that(puzzle.top[0].chooserData().length).isEqualTo(12);
  assert("The last shown number for 8x8").that(puzzle.top[0].chooserData()[10]).isEqualTo({text: '9', returnValue: '9'});
  assert("Plus 10 item for 8x8").that(puzzle.top[0].chooserData()[11]).isEqualTo({text: '+10'});
}),

// Clue display tests
test('Show outer clues',(suite) => {
  let puzzle = suite.showPuzzle("x_sandwich", "4x4", suite.CLUES);
  puzzle.start();

  assert("Top clues").that(puzzle.top.map(cell => cell.data.text)).isEqualTo(['2', null, null, '4']);
  assert("Bottom clues").that(puzzle.bottom.map(cell => cell.data.text)).isEqualTo(['1', null, null, null]);
  assert("Left clues").that(puzzle.left.map(cell => cell.data.text)).isEqualTo(['4', '2', '0', null]);
  assert("Right clues").that(puzzle.right.map(cell => cell.data.text)).isEqualTo([null, null, null, '0']);
  assert("Given digit").that(puzzle.cells[0][0].data).isEqualTo({text: '1'});
}),

// Mouse processing tests
test('Process click to empty cell',(suite) => {
  let puzzle = suite.showPuzzle("x_sandwich", "4x4", suite.CLUES);
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
}),

test('Solver marks are not submitted',(suite) => {
  let puzzle = suite.showPuzzle("x_sandwich", "4x4", suite.CLUES);
  puzzle.start();

  // Digit in b1, circle in c1, cross in b2.
  puzzle.cells[0][1].switchOnChooser(2);
  puzzle.cells[0][2].switchOnChooser(3);
  puzzle.cells[1][1].switchOnChooser(4);

  assert("Circle data").that(puzzle.cells[0][2].data).isEqualTo({image: 'white_circle', keepPencil: true});
  assert("Circle value").that(puzzle.cells[0][2].getValue()).isNull();
  assert("Cross data").that(puzzle.cells[1][1].data).isEqualTo({image: 'cross'});
  assert("Cross value").that(puzzle.cells[1][1].getValue()).isNull();
  assert("Submission data").that(puzzle.collectData()).isEqualTo({"b1": "2"});
}),

test('Clue cell can not be changed by solver',(suite) => {
  let puzzle = suite.showPuzzle("x_sandwich", "4x4", suite.CLUES);
  puzzle.start();

  suite.cellClick(puzzle, "a1");

  assert("Chooser after click").that(puzzle.controller.chooserBuilder.chooserElements).isEmptyArray();
  assert("Given digit after click").that(puzzle.cells[0][0].data).isEqualTo({text: '1'});
  assert("Submission data").that(puzzle.collectData()).isEqualTo({});
}),

test('Process click to outer clues',(suite) => {
  let puzzle = suite.showPuzzle("x_sandwich", "4x4", suite.CLUES);
  puzzle.start();

  // Clue above the column a.
  let point = suite.cellPoint(puzzle, 0, -1);
  suite.click(puzzle, point);

  assert("Top clue data after click").that(puzzle.top[0].data).isEqualTo({text: '2', image: 'white_circle'});
  assert("Top clue value after click").that(puzzle.top[0].getValue()).isNull();

  suite.click(puzzle, point);

  assert("Top clue data after second click").that(puzzle.top[0].data).isEqualTo({text: '2'});

  // Clue to the left of the third row.
  suite.click(puzzle, suite.cellPoint(puzzle, -1, 2));

  assert("Left clue data after click").that(puzzle.left[2].data).isEqualTo({text: '0', image: 'white_circle'});

  // Clue to the right of the fourth row.
  suite.click(puzzle, suite.cellPoint(puzzle, 4, 3));

  assert("Right clue data after click").that(puzzle.right[3].data).isEqualTo({text: '0', image: 'white_circle'});

  // Clue below the column a.
  suite.click(puzzle, suite.cellPoint(puzzle, 0, 4));

  assert("Bottom clue data after click").that(puzzle.bottom[0].data).isEqualTo({text: '1', image: 'white_circle'});

  // Empty outer cell above the column b.
  suite.click(puzzle, suite.cellPoint(puzzle, 1, -1));

  assert("Empty top clue data after click").that(puzzle.top[1].data).isEqualTo({image: 'white_circle'});
  assert("Submission data").that(puzzle.collectData()).isEqualTo({});
}),

test('Author sets digits by clicks',(suite) => {
  let puzzle = suite.showPuzzle("x_sandwich", "4x4");
  puzzle.edit();

  suite.cellClick(puzzle, "b2");

  assert("Chooser after click").that(puzzle.controller.chooserBuilder.chooserElements).isEmptyArray();
  assert("Cell value after click").that(puzzle.cells[1][1].getValue()).isEqualTo('1');
  assert("Cell data after click").that(puzzle.cells[1][1].data).isEqualTo({text: '1', returnValue: '1'});

  suite.cellClick(puzzle, "b2");

  assert("Cell value after second click").that(puzzle.cells[1][1].getValue()).isEqualTo('2');
  assert("Cell data after second click").that(puzzle.cells[1][1].data).isEqualTo({text: '2', returnValue: '2'});

  suite.cellClick(puzzle, "b2");

  assert("Cell value after third click").that(puzzle.cells[1][1].getValue()).isNull();
  assert("Cell data after third click").that(puzzle.cells[1][1].data).isEqualTo({});
}),

test('Author chooser for outer clues',(suite) => {
  let puzzle = suite.showPuzzle("x_sandwich", "4x4");
  puzzle.edit();

  assert("Chooser before click").that(puzzle.controller.chooserBuilder.chooserElements).isEmptyArray();

  // Outer cell to the left of the second row.
  suite.click(puzzle, suite.cellPoint(puzzle, -1, 1));

  assert("Chooser after click").that(puzzle.controller.chooserBuilder.chooserElements).isNonEmptyArray();
  assert("Chooser connected to the cell").that(puzzle.controller.chooserBuilder.element.col).isEqualTo(-1);
  assert("Chooser connected to the cell").that(puzzle.controller.chooserBuilder.element.row).isEqualTo(1);

  // The first number of the chooser is zero.
  puzzle.left[1].switchOnChooser(1);

  assert("Left clue value for zero").that(puzzle.left[1].getValue()).isEqualTo('0');
  assert("Left clue data for zero").that(puzzle.left[1].data).isEqualTo({text: '0', returnValue: '0'});

  puzzle.left[1].switchOnChooser(5);

  assert("Left clue value").that(puzzle.left[1].getValue()).isEqualTo('4');

  puzzle.left[1].switchOnChooser(0);

  assert("Left clue value after choosing the empty item").that(puzzle.left[1].getValue()).isNull();
  assert("Puzzle data").that(puzzle.collectData()).isEqualTo({});
}),

test('Plus 10 chooser',(suite) => {
  let puzzle = suite.showPuzzle("x_sandwich", "8x8");
  puzzle.edit();

  // Choose 2 (the chooser starts with the empty item and zero), then "+10" (item 11 of the chooser).
  puzzle.top[0].switchOnChooser(3);
  puzzle.top[0].switchOnChooser(11);

  assert("Top clue value after +10").that(puzzle.top[0].getValue()).isEqualTo('12');
  assert("Top clue data after +10").that(puzzle.top[0].data).isEqualTo({text: '12', returnValue: '12'});

  // Choose 0, then "+10".
  puzzle.right[7].switchOnChooser(1);
  puzzle.right[7].switchOnChooser(11);

  assert("Right clue value after +10").that(puzzle.right[7].getValue()).isEqualTo('10');
  assert("Puzzle data").that(puzzle.collectData()).isEqualTo({
    "right": [null, null, null, null, null, null, null, "10"],
    "top": ["12", null, null, null, null, null, null, null]});
}),

// Data collector tests
test('Data collector',(suite) => {
  let puzzle = suite.showPuzzle("x_sandwich", "4x4", suite.CLUES);
  puzzle.start();

  assert("Submission data of the empty grid").that(puzzle.collectData()).isEqualTo({});

  let rows = ["-221", "2112", "1122", "2211"];
  rows.forEach((digits, row) => {
    for (let col = 0; col < 4; col++) {
      if (digits[col] != "-") {
        puzzle.cells[row][col].switchOnChooser(parseInt(digits[col]));
      }
    }
  });
  // Mark the clues of the first row and the first column as used: it doesn't change the submission.
  suite.click(puzzle, suite.cellPoint(puzzle, -1, 0));
  suite.click(puzzle, suite.cellPoint(puzzle, 0, -1));

  // Given digit and outer clues are not submitted.
  assert("Submission data").that(puzzle.collectData()).isEqualTo({
    "b1": "2", "c1": "2", "d1": "1",
    "a2": "2", "b2": "1", "c2": "1", "d2": "2",
    "a3": "1", "b3": "1", "c3": "2", "d3": "2",
    "a4": "2", "b4": "2", "c4": "1", "d4": "1"});
}),

test('Author data collector',(suite) => {
  let puzzle = suite.showPuzzle("x_sandwich", "4x4");
  puzzle.edit();

  assert("Puzzle data of the empty grid").that(puzzle.collectData()).isEqualTo({});

  // Digit 1 in a1.
  suite.cellClick(puzzle, "a1");
  // Item of the chooser for the sum N is N+1, as the chooser starts with the empty item and zero.
  puzzle.top[0].switchOnChooser(3);
  puzzle.top[3].switchOnChooser(5);
  puzzle.bottom[0].switchOnChooser(2);
  puzzle.left[0].switchOnChooser(5);
  puzzle.left[1].switchOnChooser(3);
  puzzle.left[2].switchOnChooser(1);
  puzzle.right[3].switchOnChooser(1);

  assert("Puzzle data").that(puzzle.collectData()).isEqualTo(suite.CLUES);
}),

);
