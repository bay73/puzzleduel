sudokuOddEvenBigSmallTestSuite = uiTestSuite("Odd Even Big Small", "sudokupuzzle", "sudokuPuzzleType",

// Controller definition tests
test('Solver controllers',(suite) => {
  let puzzle = suite.showPuzzle(
    "sudoku_odd_even_big_small", "8x8",
    {"a1": "1", "bottom": ["small",null,null,null,null,null,null,null], "right": [null,null,null,null,null,null,null,null], "top": [null,null,null,null,null,null,null,null], "left": [null,null,null,null,null,null,null,null]}
  );
  puzzle.start();

  assert("Empty cell chooser").that(puzzle.cells[2][2].chooserValues).containsExactly([{},{text: '1', returnValue: '1'},{text: '2', returnValue: '2'},{text: '3', returnValue: '3'},{text: '4', returnValue: '4'},{text: '5', returnValue: '5'},{text: '6', returnValue: '6'},{text: '7', returnValue: '7'},{text: '8', returnValue: '8'}]);
  assert("Empty cell click").that(puzzle.cells[2][2].clickSwitch).isNull();
  assert("Clue cell chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("Clue cell click").that(puzzle.cells[0][0].clickSwitch).isNull();
  assert("Bottom clue chooser").that(puzzle.bottom[0].chooserValues).isNull();
  assert("Bottom clue click").that(puzzle.bottom[0].clickSwitch).containsExactly([{image: 'small'}, {image: 'small', color: puzzle.colorSchema.brightColor}]);
  assert("Cell drag handler").that(puzzle.cells[2][2].drawDragHandler).isNull();
  assert("Cell drag processor").that(puzzle.cells[2][2].dragProcessor).isNull();
}),

test('Author controllers',(suite) => {
  let puzzle = suite.showPuzzle("sudoku_odd_even_big_small", "8x8");
  puzzle.edit();

  assert("Cell chooser").that(puzzle.cells[0][0].chooserValues).containsExactly([{},{text: '1', returnValue: '1'},{text: '2', returnValue: '2'},{text: '3', returnValue: '3'},{text: '4', returnValue: '4'},{text: '5', returnValue: '5'},{text: '6', returnValue: '6'},{text: '7', returnValue: '7'},{text: '8', returnValue: '8'}]);
  assert("Cell click").that(puzzle.cells[0][0].clickSwitch).isNull();
  assert("Bottom clue chooser").that(puzzle.bottom[0].chooserValues).containsExactly([{},{image: 'odd', returnValue: 'odd'},{image: 'even', returnValue: 'even'},{image: 'big', returnValue: 'big'},{image: 'small', returnValue: 'small'}]);
  assert("Bottom clue click").that(puzzle.bottom[0].clickSwitch).isNull();
  assert("Right clue chooser").that(puzzle.right[0].chooserValues).containsExactly([{},{image: 'odd', returnValue: 'odd'},{image: 'even', returnValue: 'even'},{image: 'big', returnValue: 'big'},{image: 'small', returnValue: 'small'}]);
  assert("Right clue click").that(puzzle.right[0].clickSwitch).isNull();
  assert("Top clue chooser").that(puzzle.top[0].chooserValues).containsExactly([{},{image: 'odd', returnValue: 'odd'},{image: 'even', returnValue: 'even'},{image: 'big', returnValue: 'big'},{image: 'small', returnValue: 'small'}]);
  assert("Top clue click").that(puzzle.top[0].clickSwitch).isNull();
  assert("Left clue chooser").that(puzzle.left[0].chooserValues).containsExactly([{},{image: 'odd', returnValue: 'odd'},{image: 'even', returnValue: 'even'},{image: 'big', returnValue: 'big'},{image: 'small', returnValue: 'small'}]);
  assert("Left clue click").that(puzzle.left[0].clickSwitch).isNull();
}),
// Mouse processing tests
test('Process click to empty cell',(suite) => {
  let puzzle = suite.showPuzzle(
    "sudoku_odd_even_big_small", "8x8",
    {"b2": "1", "bottom": ["small",null,null,null,null,null,null,null], "right": [null,null,null,null,null,null,null,null], "top": [null,null,null,null,null,null,null,null], "left": [null,null,null,null,null,null,null,null]}
  );
  puzzle.start();

  let point = suite.cellPoint(puzzle, "a1");

  assert("Cell value before click").that(puzzle.cells[0][0].getValue()).isNull();
  assert("Cell data before click").that(puzzle.cells[0][0].data).isEqualTo({});
  assert("Chooser before click").that(puzzle.controller.chooserBuilder.chooserElements).isEmptyArray();

  suite.click(puzzle, point);

  assert("Chooser after click").that(puzzle.controller.chooserBuilder.chooserElements).isNonEmptyArray();
  assert("Chooser connected to the cell").that(puzzle.controller.chooserBuilder.element.col).isEqualTo(0);
  assert("Chooser connected to the cell").that(puzzle.controller.chooserBuilder.element.row).isEqualTo(0);
  assert("Cell data after one click").that(puzzle.cells[0][0].data).isEqualTo({});

  point.right(0.5);
  point.up();
  suite.click(puzzle, point);

  assert("Chooser after click on value").that(puzzle.controller.chooserBuilder.chooserElements).isEmptyArray();
  assert("Cell value after two clicks").that(puzzle.cells[0][0].getValue()).isEqualTo("1");
  assert("Cell data after two clicks").that(puzzle.cells[0][0].data).isEqualTo({text:"1", returnValue: "1"});
}),

test('Choose value in one click',(suite) => {
  let puzzle = suite.showPuzzle(
    "sudoku_odd_even_big_small", "8x8",
    {"b2": "1", "bottom": ["small",null,null,null,null,null,null,null], "right": [null,null,null,null,null,null,null,null], "top": [null,null,null,null,null,null,null,null], "left": [null,null,null,null,null,null,null,null]}
  );
  puzzle.start();

  let point = suite.cellPoint(puzzle, "a1");

  assert("Cell value before click").that(puzzle.cells[0][0].getValue()).isNull();
  assert("Cell data before click").that(puzzle.cells[0][0].data).isEqualTo({});
  assert("Chooser before click").that(puzzle.controller.chooserBuilder.chooserElements).isEmptyArray();

  puzzle.controller.onMouseDown(suite.mouseEvent(point));

  assert("Chooser after mouse down").that(puzzle.controller.chooserBuilder.chooserElements).isNonEmptyArray();
  assert("Chooser connected to the cell").that(puzzle.controller.chooserBuilder.element.col).isEqualTo(0);
  assert("Chooser connected to the cell").that(puzzle.controller.chooserBuilder.element.row).isEqualTo(0);
  assert("Cell data after mouse down").that(puzzle.cells[0][0].data).isEqualTo({});

  point.right(0.5);
  point.up();
  puzzle.controller.onMouseMove(suite.mouseEvent(point));
  puzzle.controller.onMouseUp(suite.mouseEvent(point));

  assert("Chooser after mouse up").that(puzzle.controller.chooserBuilder.chooserElements).isEmptyArray();
  assert("Cell value after mouse up").that(puzzle.cells[0][0].getValue()).isEqualTo("1");
  assert("Cell data after mouse up").that(puzzle.cells[0][0].data).isEqualTo({text:"1", returnValue: "1"});
}),

test('Process click to top clue',(suite) => {
  let puzzle = suite.showPuzzle(
    "sudoku_odd_even_big_small", "8x8",
    {"a1": "1", "bottom": ["small",null,null,null,null,null,null,null], "right": [null,null,null,null,null,null,null,null], "top": ["small",null,null,null,null,null,null,null], "left": [null,null,null,null,null,null,null,null]}
  );
  puzzle.start();

  let point = suite.cellPoint(puzzle, 0, -1);

  assert("Cell value before click").that(puzzle.top[0].getValue()).isNull();
  assert("Cell data before click").that(puzzle.top[0].data).isEqualTo({image: "small"});

  suite.click(puzzle, point);

  assert("Cell value after one click").that(puzzle.top[0].getValue()).isNull();
  assert("Cell data after one click").that(puzzle.top[0].data).isEqualTo({image:"small", color: puzzle.colorSchema.brightColor});
}),

// Data collector tests
test('Data collector',(suite) => {
  // The puzzle and its solution are taken from the checker tests (tests/checkers/sudoku_odd_even_big_small.test.js).
  let puzzle = suite.showPuzzle("sudoku_odd_even_big_small", "8x8", {
    "top": ["odd", "even", null, null, null, null, null, null], "bottom": ["even", null, null, null, null, null, null, "odd"],
    "left": ["small", "big", null, null, null, null, null, null], "right": ["big", null, null, "small", null, null, null, null],
    "c3": "4"});
  puzzle.start();

  assert("Submission data of the empty grid").that(puzzle.collectData()).isEqualTo({});

  let solution = {
    "a1": "1", "b1": "2", "c1": "3", "d1": "4", "e1": "5", "f1": "6", "g1": "7", "h1": "8", "a2": "5", "b2": "6", "c2": "7", "d2": "8",
    "e2": "1", "f2": "2", "g2": "3", "h2": "4", "a3": "2", "b3": "1", "d3": "3", "e3": "6", "f3": "5", "g3": "8", "h3": "7", "a4": "6",
    "b4": "5", "c4": "8", "d4": "7", "e4": "2", "f4": "1", "g4": "4", "h4": "3", "a5": "3", "b5": "4", "c5": "1", "d5": "2", "e5": "7",
    "f5": "8", "g5": "5", "h5": "6", "a6": "7", "b6": "8", "c6": "5", "d6": "6", "e6": "3", "f6": "4", "g6": "1", "h6": "2", "a7": "4",
    "b7": "3", "c7": "2", "d7": "1", "e7": "8", "f7": "7", "g7": "6", "h7": "5", "a8": "8", "b8": "7", "c8": "6", "d8": "5", "e8": "4",
    "f8": "3", "g8": "2", "h8": "1"};
  suite.enterSolution(puzzle, solution);

  assert("Submission data").that(puzzle.collectData()).isEqualTo(solution);
}),

);
