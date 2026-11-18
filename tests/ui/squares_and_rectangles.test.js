squaresAndRectanglesTestSuite = uiTestSuite("Squares and Rectangles", "areapuzzle", "areaPuzzleType",

test('Solver controllers',(suite) => {
  let puzzle = suite.showPuzzle(
    "squares_and_rectangles", "4x4", {"a1": "white_circle", "a2": "white_circle", "b2": "black_circle", "c1": "black_circle", "edges": {"a2-2": "huge_black_circle", "d1-2": "huge_white_circle"}, "nodes": {"b1-2": "huge_white_circle", "b3-2": "huge_black_circle"} });
  puzzle.start();

  assert("Cell chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("Cell click").that(puzzle.cells[0][0].clickSwitch).isNull();
  assert("Edge chooser").that(puzzle.edges[0][0][1].chooserValues).isNull();
  assert("Edge click").that(puzzle.edges[0][0][1].clickSwitch).containsExactly([{}, {color: puzzle.colorSchema.gridColor, returnValue: 'bold'}]);
  assert("Edge drag").that(puzzle.edges[0][0][1].dragSwitch).containsExactly([{}, {color: puzzle.colorSchema.gridColor, returnValue: 'bold'}]);
  assert("Connector drag").that(puzzle.connectors[0][0]['v'].dragSwitch).containsExactly([{}, {color: puzzle.colorSchema.lineColor, returnValue: 'line'}]);
}),

test('Author controllers',(suite) => {
  let puzzle = suite.showPuzzle("squares_and_rectangles", "4x4");
  puzzle.edit();

  assert("Cell chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("Cell click").that(puzzle.cells[0][0].clickSwitch).containsExactly([{},{image: 'white_circle', returnValue: 'white_circle'},{image: 'black_circle', returnValue: 'black_circle'}]);
  assert("Edge chooser").that(puzzle.edges[0][0][1].chooserValues).isNull();
  assert("Edge click").that(puzzle.edges[0][0][1].clickSwitch).containsExactly([{},{image: 'huge_white_circle', returnValue: 'huge_white_circle'},{image: 'huge_black_circle', returnValue: 'huge_black_circle'}]);
  assert("Edge drag").that(puzzle.edges[0][0][1].dragSwitch).isNull();
  assert("Node chooser").that(puzzle.nodes[0][0][2].chooserValues).isNull();
  assert("Node click").that(puzzle.nodes[0][0][2].clickSwitch).containsExactly([{},{image: 'huge_white_circle', returnValue: 'huge_white_circle'},{image: 'huge_black_circle', returnValue: 'huge_black_circle'}]);
  assert("Connector drag").that(puzzle.connectors[0][0]['v'].dragSwitch).isNull();
}),
// Mouse processing tests
test('Process click to edge',(suite) => {
  let puzzle = suite.showPuzzle(
    "squares_and_rectangles", "4x4", {"a1": "white_circle", "a2": "white_circle", "b2": "black_circle", "c1": "black_circle", "edges": {"a2-2": "huge_black_circle", "d1-2": "huge_white_circle"}, "nodes": {"b1-2": "huge_white_circle", "b3-2": "huge_black_circle"} });
  puzzle.start();

  let point = suite.gridPoint(puzzle, 0.5, 1);

  assert("Edge value before click").that(puzzle.edges[0][0][2].getValue()).isNull();
  assert("Edge data before click").that(puzzle.edges[0][0][2].data).isEqualTo({});

  // Click at edge between a1 and a2
  suite.click(puzzle, point);

  assert("Edge value after click").that(puzzle.edges[0][0][2].getValue()).isEqualTo("bold");
  assert("Edge data after click").that(puzzle.edges[0][0][2].data).isEqualTo({color:puzzle.colorSchema.gridColor,returnValue:"bold"});
}),
test('Process drag for edge',(suite) => {
  let puzzle = suite.showPuzzle(
    "squares_and_rectangles", "4x4", {"a1": "white_circle", "a2": "white_circle", "b2": "black_circle", "c1": "black_circle", "edges": {"a2-2": "huge_black_circle", "d1-2": "huge_white_circle"}, "nodes": {"b1-2": "huge_white_circle", "b3-2": "huge_black_circle"} });
  puzzle.start();

  let point = suite.gridPoint(puzzle, 1, 0);

  assert("Edge value before click").that(puzzle.edges[0][0][1].getValue()).isNull();
  assert("Edge data before click").that(puzzle.edges[0][0][1].data).isEqualTo({});

  // Start drag at top end of an edge between a1 and b1
  puzzle.controller.onMouseDown(suite.mouseEvent(point));

  assert("Edge value after mousedown").that(puzzle.edges[0][0][1].getValue()).isNull();
  assert("Edge data after mousedown").that(puzzle.edges[0][0][1].data).isEqualTo({});
  
  point.down();
  puzzle.controller.onMouseMove(suite.mouseEvent(point));
  puzzle.controller.onMouseUp(suite.mouseEvent(point));

  assert("Edge value after drag end").that(puzzle.edges[0][0][1].getValue()).isEqualTo("bold");
  assert("Edge data after drag end").that(puzzle.edges[0][0][1].data).isEqualTo({color:puzzle.colorSchema.gridColor,returnValue:"bold"});
}),
test('Process drag for connector',(suite) => {
  let puzzle = suite.showPuzzle(
    "squares_and_rectangles", "4x4", {"a1": "white_circle", "a2": "white_circle", "b2": "black_circle", "c1": "black_circle", "edges": {"a2-2": "huge_black_circle", "d1-2": "huge_white_circle"}, "nodes": {"b1-2": "huge_white_circle", "b3-2": "huge_black_circle"} });
  puzzle.start();

  let point = suite.cellPoint(puzzle, "a1");

  assert("Connector value before click").that(puzzle.connectors[0][0]['h'].getValue()).isNull();
  assert("Connector data before click").that(puzzle.connectors[0][0]['h'].data).isEqualTo({});

  puzzle.controller.onMouseDown(suite.mouseEvent(point));

  assert("Connector value after mousedown").that(puzzle.connectors[0][0]['h'].getValue()).isNull();
  assert("Connector data after mousedown").that(puzzle.connectors[0][0]['h'].data).isEqualTo({});
  
  point.right();
  puzzle.controller.onMouseMove(suite.mouseEvent(point));
  puzzle.controller.onMouseUp(suite.mouseEvent(point));

  assert("Connector value after drag end").that(puzzle.connectors[0][0]['h'].getValue()).isEqualTo("line");
  assert("Connector data after drag end").that(puzzle.connectors[0][0]['h'].data).isEqualTo({color: puzzle.colorSchema.lineColor, returnValue: 'line'});
}),
test('Automatic border between areas',(suite) => {
  let puzzle = suite.showPuzzle(
    "squares_and_rectangles", "4x4", {"a1": "white_circle", "a2": "white_circle", "b2": "black_circle", "c1": "black_circle", "edges": {"a2-2": "huge_black_circle", "d1-2": "huge_white_circle"}, "nodes": {"b1-2": "huge_white_circle", "b3-2": "huge_black_circle"} });
  puzzle.start();

  let point = suite.cellPoint(puzzle, "a1");

  puzzle.controller.onMouseDown(suite.mouseEvent(point));

  point.down();
  puzzle.controller.onMouseMove(suite.mouseEvent(point));
  puzzle.controller.onMouseUp(suite.mouseEvent(point));

  assert("Edge value after first connector").that(puzzle.edges[0][0][1].getValue()).isNull();
  assert("Edge data after first connector").that(puzzle.edges[0][0][1].data).isEqualTo({});

  point = suite.cellPoint(puzzle, "b1");

  puzzle.controller.onMouseDown(suite.mouseEvent(point));

  point.down();
  puzzle.controller.onMouseMove(suite.mouseEvent(point));
  puzzle.controller.onMouseUp(suite.mouseEvent(point));

  assert("Edge value after second connector").that(puzzle.edges[0][0][1].getValue()).isEqualTo("bold");
  assert("Edge data after second connector").that(puzzle.edges[0][0][1].data).isEqualTo({color: puzzle.colorSchema.greyColor});
}),

// Data collector tests
test('Data collector',(suite) => {
  // The puzzle and its solution are taken from the checker tests (tests/checkers/squares_and_rectangles.test.js).
  let puzzle = suite.showPuzzle("squares_and_rectangles", "4x4", {"edges": {"b1-1": "huge_white_circle"}, "b3": "black_circle", "d3": "white_circle"});
  puzzle.start();

  let solution = {"areas": [["a1", "b1", "c1", "d1"], ["a2", "b2", "c2", "a3", "b3", "c3", "a4", "b4", "c4"], ["d2", "d3", "d4"]]};
  suite.enterSolution(puzzle, solution);

  assert("Submission data").that(puzzle.collectData()).isEqualTo(solution);
}),

);
