abcDivisionTestSuite = uiTestSuite("ABC Division", "areapuzzle", "areaPuzzleType",

test('Solver controllers',(suite) => {
  let puzzle = suite.showPuzzle(
    "abc_division", "4x4-ABCD",
    {"a1": "A", "a2": "B", "a3": "C", "a4": "D", "b1": "A", "b2": "B", "b3": "C", "b4": "D", "c1": "A", "c2": "B", "c3": "A", "c4": "B", "d1": "C", "d2": "D", "d3": "C", "d4": "D"}
  );
  puzzle.start();

  assert("Cell chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("Cell click").that(puzzle.cells[0][0].clickSwitch).isNull();
  assert("Edge chooser").that(puzzle.edges[0][0][1].chooserValues).isNull();
  assert("Edge click").that(puzzle.edges[0][0][1].clickSwitch).containsExactly([{}, {color: puzzle.colorSchema.gridColor, returnValue: 'bold'}]);
  assert("Edge drag").that(puzzle.edges[0][0][1].dragSwitch).containsExactly([{}, {color: puzzle.colorSchema.gridColor, returnValue: 'bold'}]);
  assert("Connector drag").that(puzzle.connectors[0][0]['v'].dragSwitch).containsExactly([{}, {color: puzzle.colorSchema.lineColor, returnValue: 'line'}]);
}),

test('Author controllers',(suite) => {
  let puzzle = suite.showPuzzle("abc_division", "4x4-ABCD");
  puzzle.edit();

  assert("Cell chooser").that(puzzle.cells[0][0].chooserValues).containsExactly([{},{text: 'A', returnValue: 'A'},{text: 'B', returnValue: 'B'},{text: 'C', returnValue: 'C'},{text: 'D', returnValue: 'D'}]);
  assert("Cell click").that(puzzle.cells[0][0].clickSwitch).isNull();
  assert("Edge chooser").that(puzzle.edges[0][0][1].chooserValues).isNull();
  assert("Edge click").that(puzzle.edges[0][0][1].clickSwitch).isNull();
  assert("Edge drag").that(puzzle.edges[0][0][1].dragSwitch).isNull();
  assert("Connector drag").that(puzzle.connectors[0][0]['v'].dragSwitch).isNull();
}),
// Mouse processing tests
test('Process click to edge',(suite) => {
  let puzzle = suite.showPuzzle(
    "abc_division", "4x4-ABCD",
    {"a1": "A", "a2": "B", "a3": "C", "a4": "D", "b1": "A", "b2": "B", "b3": "C", "b4": "D", "c1": "A", "c2": "B", "c3": "A", "c4": "B", "d1": "C", "d2": "D", "d3": "C", "d4": "D"}
  );
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
    "abc_division", "4x4-ABCD",
    {"a1": "A", "a2": "B", "a3": "C", "a4": "D", "b1": "A", "b2": "B", "b3": "C", "b4": "D", "c1": "A", "c2": "B", "c3": "A", "c4": "B", "d1": "C", "d2": "D", "d3": "C", "d4": "D"}
  );
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
    "abc_division", "4x4-ABCD",
    {"a1": "A", "a2": "B", "a3": "C", "a4": "D", "b1": "A", "b2": "B", "b3": "C", "b4": "D", "c1": "A", "c2": "B", "c3": "A", "c4": "B", "d1": "C", "d2": "D", "d3": "C", "d4": "D"}
  );
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
    "abc_division", "4x4-ABCD",
    {"a1": "A", "a2": "B", "a3": "C", "a4": "D", "b1": "A", "b2": "B", "b3": "C", "b4": "D", "c1": "A", "c2": "B", "c3": "A", "c4": "B", "d1": "C", "d2": "D", "d3": "C", "d4": "D"}
  );
  puzzle.start();

  let point = suite.cellPoint(puzzle, "a1");

  puzzle.controller.onMouseDown(suite.mouseEvent(point));

  point.down();
  puzzle.controller.onMouseMove(suite.mouseEvent(point));
  puzzle.controller.onMouseUp(suite.mouseEvent(point));

  // Extend the first area to three cells (a1-a2-a3): the border is set only
  // when two areas together are bigger than the number of letters.
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
  // The puzzle and its solution are taken from the checker tests (tests/checkers/abc_division.test.js).
  let puzzle = suite.showPuzzle("abc_division", "4x3-ABC", {"a1": "A", "b1": "B", "c1": "C", "d1": "A", "a2": "C", "b2": "A", "c2": "B", "d2": "B", "a3": "B", "b3": "C", "c3": "A", "d3": "C"});
  puzzle.start();

  assert("Submission data of the empty grid").that(puzzle.collectData()).isEqualTo({});

  // Areas are listed in the order in which they are collected from the grid.
  let solution = {"areas": [["a1", "b1", "c1"], ["a2", "b2", "c2"], ["d1", "d2", "d3"], ["a3", "b3", "c3"]]};
  suite.enterSolution(puzzle, solution);

  assert("Submission data").that(puzzle.collectData()).isEqualTo(solution);
}),

);
