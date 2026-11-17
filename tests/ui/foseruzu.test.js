foseruzuTestSuite = uiTestSuite("Foseruzu", "areapuzzle", "areaPuzzleType",

test('Solver controllers',(suite) => {
  let puzzle = suite.showPuzzle(
    "foseruzu", "4x4", {"a2": "1", "b2": "3", "b3": "2"});
  puzzle.start();

  assert("Cell chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("Cell click").that(puzzle.cells[0][0].clickSwitch).isNull();
  assert("Edge chooser").that(puzzle.edges[0][0][1].chooserValues).isNull();
  assert("Edge click").that(puzzle.edges[0][0][1].clickSwitch).containsExactly([{}, {color: puzzle.colorSchema.gridColor, returnValue: 'bold'}]);
  assert("Edge drag").that(puzzle.edges[0][0][1].dragSwitch).containsExactly([{}, {color: puzzle.colorSchema.gridColor, returnValue: 'bold'}]);
  assert("Connector drag").that(puzzle.connectors[0][0]['v'].dragSwitch).containsExactly([{}, {color: puzzle.colorSchema.lineColor, returnValue: 'line'}]);
}),

test('Author contorllers',(suite) => {
  let puzzle = suite.showPuzzle("foseruzu", "4x4");
  puzzle.edit();

  assert("Cell chooser").that(puzzle.cells[0][0].chooserValues).containsExactly([{},{text: '0', returnValue: '0'},{text: '1', returnValue: '1'},{text: '2', returnValue: '2'},{text: '3', returnValue: '3'}]);
  assert("Cell click").that(puzzle.cells[0][0].clickSwitch).isNull();
  assert("Edge chooser").that(puzzle.edges[0][0][1].chooserValues).isNull();
  assert("Edge click").that(puzzle.edges[0][0][1].clickSwitch).isNull();
  assert("Edge drag").that(puzzle.edges[0][0][1].dragSwitch).isNull();
  assert("Connector drag").that(puzzle.connectors[0][0]['v'].dragSwitch).isNull();
}),
// Mouse processing tests
test('Process click to edge',(suite) => {
  let puzzle = suite.showPuzzle(
    "foseruzu", "4x4", {"a2": "1", "b2": "3", "b3": "2"});
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
    "foseruzu", "4x4", {"a2": "1", "b2": "3", "b3": "2"});
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
    "foseruzu", "4x4", {"a2": "1", "b2": "3", "b3": "2"});
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
// Border appears when two joined areas together exceed the maximal area size (3 here).
test('Automatic border between areas',(suite) => {
  let puzzle = suite.showPuzzle(
    "foseruzu", "4x4-3", {"a2": "1", "b2": "3", "b3": "2"});
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

);

