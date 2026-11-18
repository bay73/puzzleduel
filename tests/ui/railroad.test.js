railroadTestSuite = uiTestSuite("Railroad", "squarepuzzle", "squarePuzzleType",

test('Process drag on connector',(suite) => {
  let puzzle = suite.showPuzzle("railroad", "4x4",{"b1": "1", "b3": "+", "c3": "+"});
  puzzle.start();

  let point = suite.cellPoint(puzzle, "a1");

  assert("Connector value before click").that(puzzle.connectors[0][0]['h'].getValue()).isNull();
  assert("Connector data before click").that(puzzle.connectors[0][0]['h'].data).isEqualTo({});

  puzzle.controller.onMouseDown(suite.mouseEvent(point));
  point.right();
  puzzle.controller.onMouseMove(suite.mouseEvent(point));

  assert("Connector value after drag").that(puzzle.connectors[0][0]['h'].getValue()).isEqualTo(1);
  assert("Connector data after drag").that(puzzle.connectors[0][0]['h'].data).isEqualTo({color: puzzle.colorSchema.lineColor, returnValue:1});

  point.left();
  puzzle.controller.onMouseMove(suite.mouseEvent(point));

  assert("Connector value after back drag").that(puzzle.connectors[0][0]['h'].getValue()).isNull();
  assert("Connector data after back drag").that(puzzle.connectors[0][0]['h'].data).isEqualTo({});
}),

test('Process click on connector',(suite) => {
  let puzzle = suite.showPuzzle("railroad", "4x4",{"b1": "1", "b3": "+", "c3": "+"});
  puzzle.start();

  let point = suite.gridPoint(puzzle, 1, 0.5);

  assert("Connector value before click").that(puzzle.connectors[0][0]['h'].getValue()).isNull();
  assert("Connector data before click").that(puzzle.connectors[0][0]['h'].data).isEqualTo({});

  suite.click(puzzle, point);

  assert("Connector value after click").that(puzzle.connectors[0][0]['h'].getValue()).isNull();
  assert("Connector data after click").that(puzzle.connectors[0][0]['h'].data).isEqualTo({});
}),

test('Drag handler path',(suite) => {
  let puzzle = suite.showPuzzle("railroad", "4x4",{"b1": "1", "b3": "+", "c3": "+"});
  puzzle.start();

  let startX = puzzle.size.leftGap + puzzle.size.unitSize/2;
  let startY = puzzle.size.topGap + puzzle.size.unitSize/2;
  let x = startX;
  let y = startY;

  puzzle.controller.onMouseDown(suite.mouseEvent(x, y));
  x += puzzle.size.unitSize/4;
  puzzle.controller.onMouseMove(suite.mouseEvent(x, y));

  let path = puzzle.controller.dragHandler.path;
  assert("Drag path after first move").that(path).isNotNull();

  assert("Drag path type after first move").that(path.type).isEqualTo("line");
  assert("Drag path color after first move").that(path.toJSON().attr.stroke).isEqualTo(puzzle.colorSchema.traceColor);
  assert("Drag path start x after first move").that(path.toJSON().attr.x1).isAlmostEqualTo(startX);
  assert("Drag path end x after first move").that(path.toJSON().attr.x2).isAlmostEqualTo(x);
  assert("Drag path start y after first move").that(path.toJSON().attr.y1).isAlmostEqualTo(startY);
  assert("Drag path end y after first move").that(path.toJSON().attr.y2).isAlmostEqualTo(y);
  x += puzzle.size.unitSize/4;

  puzzle.controller.onMouseMove(suite.mouseEvent(x, y));

  path = puzzle.controller.dragHandler.path;
  assert("Drag path after second move").that(path).isNotNull();

  assert("Drag path type after second move").that(path.type).isEqualTo("line");
  assert("Drag path color after second move").that(path.toJSON().attr.stroke).isEqualTo(puzzle.colorSchema.traceColor);
  assert("Drag path start x after second move").that(path.toJSON().attr.x1).isAlmostEqualTo(startX);
  assert("Drag path end x after second move").that(path.toJSON().attr.x2).isAlmostEqualTo(x);
  assert("Drag path start y after second move").that(path.toJSON().attr.y1).isAlmostEqualTo(startY);
  assert("Drag path end y after second move").that(path.toJSON().attr.y2).isAlmostEqualTo(y);
}),

// Data collector tests
test('Data collector',(suite) => {
  // The puzzle and its solution are taken from the checker tests (tests/checkers/railroad.test.js).
  let puzzle = suite.showPuzzle("railroad", "5x3", {"c2": "+", "a2": "1", "b1": "2", "d3": "3", "e2": "4"});
  puzzle.start();

  assert("Submission data of the empty grid").that(puzzle.collectData()).isEqualTo({});

  let solution = {
    
    "connectors": {"a1-h": 1, "b1-h": 1, "d1-h": 1, "b2-h": 1, "c2-h": 1, "a3-h": 1, "c3-h": 1, "d3-h": 1, "a1-v": 1, "c1-v": 1, "d1-v": 1, "e1-v": 1, "a2-v": 1, "b2-v": 1, "c2-v": 1, "e2-v": 1}};
  suite.enterSolution(puzzle, solution);

  assert("Submission data").that(puzzle.collectData()).isEqualTo(solution);
}),

);
