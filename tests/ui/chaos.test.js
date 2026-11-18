chaosTestSuite = uiTestSuite("Chaos", "squarepuzzle", "squarePuzzleType",

// Controller definition tests
test('Solver controllers',(suite) => {
  let puzzle = suite.showPuzzle(
    "chaos", "5x5",
    {"a4": "1", "b1": "1", "b5": "2", "c2": "3", "c3": "1", "d3": "2", "e4": "3"}
  );
  puzzle.start();

  assert("Empty cell chooser").that(puzzle.cells[1][1].chooserValues).containsExactly([{}, {text:"1",returnValue:"1"}, {text:"2",returnValue:"2"}, {text:"3",returnValue:"3"}, {text: '4', returnValue: '4'}]);
  assert("Empty cell click").that(puzzle.cells[1][1].clickSwitch).isNull();
  assert("Numbered cell chooser").that(puzzle.cells[3][0].chooserValues).isNull();
  assert("Numbered cell click").that(puzzle.cells[3][0].clickSwitch).isNull();;
  assert("Cell drag handler").that(puzzle.cells[2][2].drawDragHandler).isNull();
  assert("Cell drag processor").that(puzzle.cells[2][2].dragProcessor).isNull();
}),

test('Author controllers',(suite) => {
  let puzzle = suite.showPuzzle("chaos", "5x5");
  puzzle.edit();

  assert("Cell chooser").that(puzzle.cells[0][0].chooserValues).containsExactly([{}, {text:"1",returnValue:"1"}, {text:"2",returnValue:"2"}, {text:"3",returnValue:"3"}, {text: '4', returnValue: "4"}]);
  assert("Cell click").that(puzzle.cells[0][0].clickSwitch).isNull();
}),
// Mouse processing tests
test('Process click to empty cell',(suite) => {
  let puzzle = suite.showPuzzle(
    "fuzuli", "5x5",
    {"a4": "1"}
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
  assert("Cell value after two clicks").that(puzzle.cells[0][0].getValue()).isEqualTo("1");
  assert("Cell data after two clicks").that(puzzle.cells[0][0].data).isEqualTo({text:"1", returnValue: "1"});
}),

test('Choose value in one click',(suite) => {
  let puzzle = suite.showPuzzle(
    "chaos", "5x5",
    {"a4": "1"}
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
  assert("Cell value after mouse up").that(puzzle.cells[0][0].getValue()).isEqualTo("1");
  assert("Cell data after mouse up").that(puzzle.cells[0][0].data).isEqualTo({text:"1", returnValue: "1"});
}),

// Data collector tests
test('Data collector',(suite) => {
  // The puzzle and its solution are taken from the checker tests (tests/checkers/chaos.test.js).
  let puzzle = suite.showPuzzle("chaos", "5x5", {"a1": "1", "a5": "1", "b2": "2", "b4": "2", "c3": "3", "d2": "4", "d4": "2", "e1": "2", "e5": "1"});
  puzzle.start();

  assert("Submission data of the empty grid").that(puzzle.collectData()).isEqualTo({});

  let solution = {
    "a2": "4", "a3": "1", "a4": "4", "b1": "2", "b3": "3", "b5": "4", "c1": "2", "c2": "4", "c4": "3", "c5": "1", "d1": "1", "d3": "4",
    "d5": "4", "e2": "1", "e3": "2", "e4": "2"};
  suite.enterSolution(puzzle, solution);

  assert("Submission data").that(puzzle.collectData()).isEqualTo(solution);
}),

);
