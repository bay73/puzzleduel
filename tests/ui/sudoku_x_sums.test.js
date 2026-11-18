sudokuXSumsTestSuite = uiTestSuite("X Sums Sudoku", "sudokupuzzle", "sudokuPuzzleType",

// Controller definition tests
test('Solver controllers',(suite) => {
  let puzzle = suite.showPuzzle(
    "sudoku_x_sums", "4x4",
    {"a1": "1", "bottom": [null,null,"2",null], "right": ["2",null,"1",null], "top": ["4",null,null,null], "left": [null,"3",null,null]}
  );
  puzzle.start();

  assert("Empty cell chooser").that(puzzle.cells[2][2].chooserValues).containsExactly([{},{text: '1', returnValue: '1'},{text: '2', returnValue: '2'},{text: '3', returnValue: '3'},{text: '4', returnValue: '4'}]);
  assert("Empty cell click").that(puzzle.cells[2][2].clickSwitch).isNull();
  assert("Clue cell chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("Clue cell click").that(puzzle.cells[0][0].clickSwitch).isNull();
  assert("Bottom clue chooser").that(puzzle.bottom[2].chooserValues).isNull();
  assert("Bottom clue click").that(puzzle.bottom[2].clickSwitch).containsExactly([{text: '2'}, {text: '2', image: 'white_circle'}]);
  assert("Right clue chooser").that(puzzle.right[0].chooserValues).isNull();
  assert("Right clue click").that(puzzle.right[0].clickSwitch).containsExactly([{text: '2'}, {text: '2', image: 'white_circle'}]);
  assert("Top clue chooser").that(puzzle.top[3].chooserValues).isNull();
  assert("Top clue click").that(puzzle.top[3].clickSwitch).containsExactly([{}, {image: 'white_circle'}]);
  assert("Left clue chooser").that(puzzle.left[1].chooserValues).isNull();
  assert("Left clue click").that(puzzle.left[1].clickSwitch).containsExactly([{text: '3'}, {text: '3', image: 'white_circle'}]);
  assert("Cell drag handler").that(puzzle.cells[2][2].drawDragHandler).isNull();
  assert("Cell drag processor").that(puzzle.cells[2][2].dragProcessor).isNull();
}),

test('Author controllers',(suite) => {
  let puzzle = suite.showPuzzle("sudoku_x_sums", "6x6");
  puzzle.edit();

  assert("Cell chooser").that(puzzle.cells[0][0].chooserValues).containsExactly([{},{text: '1', returnValue: '1'},{text: '2', returnValue: '2'},{text: '3', returnValue: '3'},{text: '4', returnValue: '4'},{text: '5', returnValue: '5'},{text: '6', returnValue: '6'}]);
  assert("Cell click").that(puzzle.cells[0][0].clickSwitch).isNull();
  assert("Bottom clue chooser").that(puzzle.bottom[0].chooserValues).containsAtLeast([{},{text: '1', returnValue: '1'},{text: '2', returnValue: '2'},{text: '3', returnValue: '3'},{text: '21', returnValue: '21'}]);
  assert("Bottom clue click").that(puzzle.bottom[0].clickSwitch).isNull();
  assert("Right clue chooser").that(puzzle.right[0].chooserValues).containsAtLeast([{},{text: '1', returnValue: '1'},{text: '2', returnValue: '2'},{text: '3', returnValue: '3'},{text: '21', returnValue: '21'}]);
  assert("Right clue click").that(puzzle.right[0].clickSwitch).isNull();
  assert("Top clue chooser").that(puzzle.top[0].chooserValues).containsAtLeast([{},{text: '1', returnValue: '1'},{text: '2', returnValue: '2'},{text: '3', returnValue: '3'},{text: '21', returnValue: '21'}]);
  assert("Top clue click").that(puzzle.top[0].clickSwitch).isNull();
  assert("Left clue chooser").that(puzzle.left[0].chooserValues).containsAtLeast([{},{text: '1', returnValue: '1'},{text: '2', returnValue: '2'},{text: '3', returnValue: '3'},{text: '21', returnValue: '21'}]);
  assert("Left clue click").that(puzzle.left[0].clickSwitch).isNull();
}),
// Mouse processing tests
test('Plus 10 chooser',(suite) => {
  let puzzle = suite.showPuzzle("sudoku_x_sums", "6x6");
  puzzle.edit();

  let point = suite.cellPoint(puzzle, 0, -1);

  assert("Cell value before click").that(puzzle.top[0].getValue()).isNull();
  assert("Chooser before click").that(puzzle.controller.chooserBuilder.chooserElements).isEmptyArray();

  suite.click(puzzle, point);

  assert("Chooser after click").that(puzzle.controller.chooserBuilder.chooserElements).isNonEmptyArray();
  assert("Chooser connected to the cell").that(puzzle.controller.chooserBuilder.element.col).isEqualTo(0);
  assert("Chooser connected to the cell").that(puzzle.controller.chooserBuilder.element.row).isEqualTo(-1);
  assert("Cell data after one click").that(puzzle.top[0].data).isEqualTo({});
  
  point.x += puzzle.chooserSize*0.42;
  point.y -= puzzle.chooserSize*0.66;
  suite.click(puzzle, point);

  assert("Chooser after click on 1").that(puzzle.controller.chooserBuilder.chooserElements).isEmptyArray();
  assert("Cell value after click on 1").that(puzzle.top[0].getValue()).isEqualTo("1");
  assert("Cell data after click on 1").that(puzzle.top[0].data).isEqualTo({text:"1", returnValue: "1"});

  point = suite.cellPoint(puzzle, 0, -1);
  suite.click(puzzle, point);

  point.x -= puzzle.chooserSize*0.42;
  point.y -= puzzle.chooserSize*0.66;
  suite.click(puzzle, point);


  assert("Chooser after click on +10").that(puzzle.controller.chooserBuilder.chooserElements).isEmptyArray();
  assert("Cell value after click on +10").that(puzzle.top[0].getValue()).isEqualTo("11");
  assert("Cell data after click on +10").that(puzzle.top[0].data).isEqualTo({text:"11", returnValue: "11"});
}),


test('Process click to empty cell',(suite) => {
  let puzzle = suite.showPuzzle(
    "sudoku_x_sums", "4x4",
    {"bottom": [null,null,"2",null], "right": ["2",null,"1",null], "top": ["4",null,null,null], "left": [null,"3",null,null]}
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
  suite.click(puzzle, point);

  assert("Chooser after click on value").that(puzzle.controller.chooserBuilder.chooserElements).isEmptyArray();
  assert("Cell value after two clicks").that(puzzle.cells[0][0].getValue()).isEqualTo("1");
  assert("Cell data after two clicks").that(puzzle.cells[0][0].data).isEqualTo({text:"1", returnValue: "1"});
}),

test('Choose value in one click',(suite) => {
  let puzzle = suite.showPuzzle(
    "sudoku_x_sums", "4x4",
    {"bottom": [null,null,"2",null], "right": ["2",null,"1",null], "top": ["4",null,null,null], "left": [null,"3",null,null]}
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
  puzzle.controller.onMouseMove(suite.mouseEvent(point));
  puzzle.controller.onMouseUp(suite.mouseEvent(point));

  assert("Chooser after mouse up").that(puzzle.controller.chooserBuilder.chooserElements).isEmptyArray();
  assert("Cell value after mouse up").that(puzzle.cells[0][0].getValue()).isEqualTo("1");
  assert("Cell data after mouse up").that(puzzle.cells[0][0].data).isEqualTo({text:"1", returnValue: "1"});
}),

test('Process click to top clue',(suite) => {
  let puzzle = suite.showPuzzle(
    "sudoku_x_sums", "4x4",
    {"bottom": [null,null,"2",null], "right": ["2",null,"1",null], "top": ["4",null,null,null], "left": [null,"3",null,null]}
  );
  puzzle.start();

  let point = suite.cellPoint(puzzle, 0, -1);

  assert("Cell value before click").that(puzzle.top[0].getValue()).isNull();
  assert("Cell data before click").that(puzzle.top[0].data).isEqualTo({text: "4"});

  suite.click(puzzle, point);

  assert("Cell value after one click").that(puzzle.top[0].getValue()).isNull();
  assert("Cell data after one click").that(puzzle.top[0].data).isEqualTo({text: "4", image:"white_circle"});
}),

test('Process click to left clue',(suite) => {
  let puzzle = suite.showPuzzle(
    "sudoku_x_sums", "4x4",
    {"bottom": [null,null,"2",null], "right": ["2",null,"1",null], "top": ["4",null,null,null], "left": [null,"3",null,null]}
  );
  puzzle.start();

  let point = suite.cellPoint(puzzle, -1, 0);

  assert("Cell value before click").that(puzzle.left[0].getValue()).isNull();
  assert("Cell data before click").that(puzzle.left[0].data).isEqualTo({});

  suite.click(puzzle, point);

  assert("Cell value after one click").that(puzzle.left[0].getValue()).isNull();
  assert("Cell data after one click").that(puzzle.left[0].data).isEqualTo({image:"white_circle"});
}),

// Data collector tests
test('Data collector',(suite) => {
  // The puzzle and its solution are taken from the checker tests (tests/checkers/sudoku_x_sums.test.js).
  let puzzle = suite.showPuzzle("sudoku_x_sums", "4x4", {"bottom": [null, null, null, "6"], "right": ["10", null, null, null], "top": ["1", null, null, null], "left": [null, "6", null, null, null]});
  puzzle.start();

  assert("Submission data of the empty grid").that(puzzle.collectData()).isEqualTo({});

  let solution = {
    "a1": "1", "a2": "2", "a3": "3", "a4": "4", "b1": "3", "b2": "4", "b3": "1", "b4": "2", "c1": "2", "c2": "3", "c3": "4", "c4": "1",
    "d1": "4", "d2": "1", "d3": "2", "d4": "3"};
  suite.enterSolution(puzzle, solution);

  assert("Submission data").that(puzzle.collectData()).isEqualTo(solution);
}),

);
