easyAsAbcTestSuite = uiTestSuite("Easy as ABC", "squarepuzzle", "squarePuzzleType",

// Controller definition tests
test('Solver controllers',(suite) => {
  let puzzle = suite.showPuzzle(
    "easy_as_abc", "4x4-ABC",
    {"a4": "cross", "bottom": ["A",null,null,null], "right": [null,null,"B","A"], "top": [null,"B",null,null], "left": ["C",null,null,null]}
  );
  puzzle.start();

  assert("Empty cell chooser").that(puzzle.cells[2][2].chooserValues).containsExactly([{}, {text:"A",returnValue:"A"}, {text:"B",returnValue:"B"}, {text:"C",returnValue:"C"}, {image: 'white_circle', keepPencil: true}, {image: 'cross'}]);
  assert("Empty cell click").that(puzzle.cells[2][2].clickSwitch).isNull();
  assert("Cross cell chooser").that(puzzle.cells[3][0].chooserValues).isNull();
  assert("Cross cell click").that(puzzle.cells[3][0].clickSwitch).isNull();;
  assert("Bottom clue chooser").that(puzzle.bottom[0].chooserValues).isNull();
  assert("Bottom clue click").that(puzzle.bottom[0].clickSwitch).containsExactly([{text: 'A'}, {text: 'A', image: 'white_circle'}]);
  assert("Right clue chooser").that(puzzle.right[0].chooserValues).isNull();
  assert("Right clue click").that(puzzle.right[2].clickSwitch).containsExactly([{text: 'B'}, {text: 'B', image: 'white_circle'}]);
  assert("Top clue chooser").that(puzzle.top[0].chooserValues).isNull();
  assert("Top clue click").that(puzzle.top[0].clickSwitch).containsExactly([{}, {image: 'white_circle'}]);
  assert("Left clue chooser").that(puzzle.left[0].chooserValues).isNull();
  assert("Left clue click").that(puzzle.left[0].clickSwitch).containsExactly([{text: 'C'}, {text: 'C', image: 'white_circle'}]);
  assert("Cell drag handler").that(puzzle.cells[2][2].drawDragHandler).isNull();
  assert("Cell drag processor").that(puzzle.cells[2][2].dragProcessor).isNull();
}),

test('Solver controllers with other letters',(suite) => {
  let puzzle = suite.showPuzzle(
    "easy_as_abc", "4x4-KL",
    {"a4": "cross", "bottom": ["K",null,null,null], "right": [null,null,"L","K"], "top": [null,"K",null,null], "left": ["K",null,null,null]}
  );
  puzzle.start();

  assert("Empty cell chooser").that(puzzle.cells[2][2].chooserValues).containsExactly([{}, {text:"K",returnValue:"K"}, {text:"L",returnValue:"L"}, {image: 'white_circle', keepPencil: true}, {image: 'cross'}]);
  assert("Empty cell click").that(puzzle.cells[2][2].clickSwitch).isNull();
}),

test('Author controllers',(suite) => {
  let puzzle = suite.showPuzzle("easy_as_abc", "4x4-ABC");
  puzzle.edit();

  assert("Cell chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("Cell click").that(puzzle.cells[0][0].clickSwitch).containsExactly([{}, {image: 'cross', returnValue: 'cross'}]);
  assert("Bottom clue chooser").that(puzzle.bottom[0].chooserValues).containsExactly([{},{text: 'A', returnValue: 'A'},{text: 'B', returnValue: 'B'},{text: 'C', returnValue: 'C'}]);
  assert("Bottom clue click").that(puzzle.bottom[0].clickSwitch).isNull();
  assert("Right clue chooser").that(puzzle.right[0].chooserValues).containsExactly([{},{text: 'A', returnValue: 'A'},{text: 'B', returnValue: 'B'},{text: 'C', returnValue: 'C'}]);
  assert("Right clue click").that(puzzle.right[0].clickSwitch).isNull();
  assert("Top clue chooser").that(puzzle.top[0].chooserValues).containsExactly([{},{text: 'A', returnValue: 'A'},{text: 'B', returnValue: 'B'},{text: 'C', returnValue: 'C'}]);
  assert("Top clue click").that(puzzle.top[0].clickSwitch).isNull();
  assert("Left clue chooser").that(puzzle.left[0].chooserValues).containsExactly([{},{text: 'A', returnValue: 'A'},{text: 'B', returnValue: 'B'},{text: 'C', returnValue: 'C'}]);
  assert("Left clue click").that(puzzle.left[0].clickSwitch).isNull();
}),
// Mouse processing tests
test('Process click to empty cell',(suite) => {
  let puzzle = suite.showPuzzle(
    "easy_as_abc", "4x4-ABC",
    {"a4": "cross", "bottom": ["A",null,null,null], "right": [null,null,"B","A"], "top": [null,"B",null,null], "left": ["C",null,null,null]}
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
  point.up(0.5);
  suite.click(puzzle, point);

  assert("Chooser after click on value").that(puzzle.controller.chooserBuilder.chooserElements).isEmptyArray();
  assert("Cell value after two clicks").that(puzzle.cells[0][0].getValue()).isEqualTo("A");
  assert("Cell data after two clicks").that(puzzle.cells[0][0].data).isEqualTo({text:"A", returnValue: "A"});
}),

test('Choose value in one click',(suite) => {
  let puzzle = suite.showPuzzle(
    "easy_as_abc", "4x4-ABC",
    {"a4": "cross", "bottom": ["A",null,null,null], "right": [null,null,"B","A"], "top": [null,"B",null,null], "left": ["C",null,null,null]}
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
  point.up(0.5);
  puzzle.controller.onMouseMove(suite.mouseEvent(point));
  puzzle.controller.onMouseUp(suite.mouseEvent(point));

  assert("Chooser after mouse up").that(puzzle.controller.chooserBuilder.chooserElements).isEmptyArray();
  assert("Cell value after mouse up").that(puzzle.cells[0][0].getValue()).isEqualTo("A");
  assert("Cell data after mouse up").that(puzzle.cells[0][0].data).isEqualTo({text:"A", returnValue: "A"});
}),


test('Process click to top clue',(suite) => {
  let puzzle = suite.showPuzzle(
    "easy_as_abc", "4x4-ABC",
    {"a4": "cross", "bottom": ["A",null,null,null], "right": [null,null,"B","A"], "top": [null,"B",null,null], "left": ["C",null,null,null]}
  );
  puzzle.start();

  let point = suite.cellPoint(puzzle, 0, -1);

  assert("Cell value before click").that(puzzle.top[0].getValue()).isNull();
  assert("Cell data before click").that(puzzle.top[0].data).isEqualTo({});

  suite.click(puzzle, point);

  assert("Cell value after one click").that(puzzle.top[0].getValue()).isNull();
  assert("Cell data after one click").that(puzzle.top[0].data).isEqualTo({image:"white_circle"});
}),

test('Process click to left clue',(suite) => {
  let puzzle = suite.showPuzzle(
    "easy_as_abc", "4x4-ABC",
    {"a4": "cross", "bottom": ["A",null,null,null], "right": [null,null,"B","A"], "top": [null,"B",null,null], "left": ["C",null,null,null]}
  );
  puzzle.start();

  let point = suite.cellPoint(puzzle, -1, 0);

  assert("Cell value before click").that(puzzle.left[0].getValue()).isNull();
  assert("Cell data before click").that(puzzle.left[0].data).isEqualTo({text: "C"});

  suite.click(puzzle, point);

  assert("Cell value after one click").that(puzzle.left[0].getValue()).isNull();
  assert("Cell data after one click").that(puzzle.left[0].data).isEqualTo({text: "C", image:"white_circle"});
}),

);


