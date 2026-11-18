simpleLoopTestSuite = uiTestSuite("Simple Loop", "squarepuzzle", "squarePuzzleType",

beforeSuite((suite, cb)=> {
  // Emulates one mouse drag which passes through the centers of the given cells.
  suite.drawLine = function(puzzle, ...cells) {
    puzzle.controller.onMouseDown(suite.mouseEvent(suite.cellPoint(puzzle, cells[0])));
    cells.slice(1).forEach(cell => puzzle.controller.onMouseMove(suite.mouseEvent(suite.cellPoint(puzzle, cell))));
    puzzle.controller.onMouseUp(suite.mouseEvent(suite.cellPoint(puzzle, cells[cells.length - 1])));
  };
  cb();
}),

// Puzzle 4x4 used in the tests (# - black cell) and its solution:
//   # # . .     # # +-+
//   . . . .     +-+ | |
//   . . . .     | +-+ |
//   . . . .     +-----+

// Controller definition tests
test('Solver controllers',(suite) => {
  let puzzle = suite.showPuzzle("simple_loop", "4x4", {"a1": "black", "b1": "black"});
  puzzle.start();

  assert("Black cell data").that(puzzle.cells[0][0].data).isEqualTo({color: puzzle.colorSchema.gridColor});
  assert("Black cell chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("Black cell click").that(puzzle.cells[0][0].clickSwitch).isNull();
  assert("Empty cell chooser").that(puzzle.cells[1][1].chooserValues).isNull();
  assert("Empty cell click").that(puzzle.cells[1][1].clickSwitch).isNull();
  assert("Empty cell drag processor").that(puzzle.cells[1][1].dragProcessor).isNotNull();
  assert("Connector click").that(puzzle.connectors[1][1]['h'].clickSwitch).isNull();
  assert("Connector drag").that(puzzle.connectors[1][1]['h'].dragSwitch).containsExactly([{}, {color: puzzle.colorSchema.lineColor, returnValue: '1'}]);
  assert("Vertical connector drag").that(puzzle.connectors[1][1]['v'].dragSwitch).containsExactly([{}, {color: puzzle.colorSchema.lineColor, returnValue: '1'}]);
  assert("Edge chooser").that(puzzle.edges[1][1][1].chooserValues).isNull();
  assert("Edge click").that(puzzle.edges[1][1][1].clickSwitch).containsExactly([{}, {image: 'cross'}]);
  assert("Edge drag").that(puzzle.edges[1][1][1].dragSwitch).isNull();
}),

test('Author controllers',(suite) => {
  let puzzle = suite.showPuzzle("simple_loop", "4x4");
  puzzle.edit();

  assert("Cell chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("Cell click").that(puzzle.cells[0][0].clickSwitch).containsExactly([{}, {color: puzzle.colorSchema.gridColor, returnValue: 'black'}]);
  assert("Cell drag processor").that(puzzle.cells[0][0].dragProcessor).isNull();
  assert("Connector click").that(puzzle.connectors[0][0]['h'].clickSwitch).isNull();
  assert("Connector drag").that(puzzle.connectors[0][0]['h'].dragSwitch).isNull();
  assert("Edge click").that(puzzle.edges[1][1][1].clickSwitch).isNull();
  assert("Edge drag").that(puzzle.edges[1][1][1].dragSwitch).isNull();
}),

// Mouse processing tests
test('Draw and erase line by drag between cells',(suite) => {
  let puzzle = suite.showPuzzle("simple_loop", "4x4", {"a1": "black", "b1": "black"});
  puzzle.start();

  assert("Connector value before drag").that(puzzle.connectors[0][2]['h'].getValue()).isNull();
  assert("Connector data before drag").that(puzzle.connectors[0][2]['h'].data).isEqualTo({});

  suite.drag(puzzle, suite.cellPoint(puzzle, "c1"), suite.cellPoint(puzzle, "d1"));

  assert("Connector value after drag").that(puzzle.connectors[0][2]['h'].getValue()).isEqualTo("1");
  assert("Connector data after drag").that(puzzle.connectors[0][2]['h'].data).isEqualTo({color: puzzle.colorSchema.lineColor, returnValue: '1'});

  suite.drag(puzzle, suite.cellPoint(puzzle, "c1"), suite.cellPoint(puzzle, "c2"));

  assert("Vertical connector value after drag").that(puzzle.connectors[0][2]['v'].getValue()).isEqualTo("1");

  // Second drag over the line erases it.
  suite.drag(puzzle, suite.cellPoint(puzzle, "d1"), suite.cellPoint(puzzle, "c1"));

  assert("Connector value after second drag").that(puzzle.connectors[0][2]['h'].getValue()).isNull();
  assert("Connector data after second drag").that(puzzle.connectors[0][2]['h'].data).isEqualTo({});
  assert("Vertical connector value after second drag").that(puzzle.connectors[0][2]['v'].getValue()).isEqualTo("1");
}),

test('Draw line through several cells by one drag',(suite) => {
  let puzzle = suite.showPuzzle("simple_loop", "4x4", {"a1": "black", "b1": "black"});
  puzzle.start();

  // Single mouse move along the whole column d.
  suite.drag(puzzle, suite.cellPoint(puzzle, "d1"), suite.cellPoint(puzzle, "d4"));

  assert("Line after straight drag").that(puzzle.collectData()).isEqualTo({"connectors": {"d1-v": "1", "d2-v": "1", "d3-v": "1"}});

  // Drag with turns: a2 - b2 - b3 - c3.
  suite.drawLine(puzzle, "a2", "b2", "b3", "c3");

  assert("Line after drag with turns").that(puzzle.collectData()).isEqualTo(
    {"connectors": {"d1-v": "1", "d2-v": "1", "d3-v": "1", "a2-h": "1", "b2-v": "1", "b3-h": "1"}});
}),

test('Line can not go through black cells',(suite) => {
  let puzzle = suite.showPuzzle("simple_loop", "4x4", {"a1": "black", "b1": "black"});
  puzzle.start();

  // From black cell to white one, from white to black and between two black cells.
  suite.drag(puzzle, suite.cellPoint(puzzle, "b1"), suite.cellPoint(puzzle, "c1"));
  suite.drag(puzzle, suite.cellPoint(puzzle, "a2"), suite.cellPoint(puzzle, "a1"));
  suite.drag(puzzle, suite.cellPoint(puzzle, "a1"), suite.cellPoint(puzzle, "b1"));

  assert("Connector b1-c1").that(puzzle.connectors[0][1]['h'].getValue()).isNull();
  assert("Connector a1-a2").that(puzzle.connectors[0][0]['v'].getValue()).isNull();
  assert("Connector a1-b1").that(puzzle.connectors[0][0]['h'].getValue()).isNull();
  assert("Submission data after drags to black cells").that(puzzle.collectData()).isEqualTo({});

  // Drag along the whole first row connects only white cells.
  suite.drag(puzzle, suite.cellPoint(puzzle, "d1"), suite.cellPoint(puzzle, "a1"));

  assert("Submission data after drag along the row").that(puzzle.collectData()).isEqualTo({"connectors": {"c1-h": "1"}});
}),

test('Cells are not changed by click',(suite) => {
  let puzzle = suite.showPuzzle("simple_loop", "4x4", {"a1": "black", "b1": "black"});
  puzzle.start();

  suite.cellClick(puzzle, "a1");
  suite.cellClick(puzzle, "c1");

  assert("Black cell data after click").that(puzzle.cells[0][0].data).isEqualTo({color: puzzle.colorSchema.gridColor});
  assert("Empty cell data after click").that(puzzle.cells[0][2].data).isEqualTo({});
}),

test('Process clicks to edge',(suite) => {
  let puzzle = suite.showPuzzle("simple_loop", "4x4", {"a1": "black", "b1": "black"});
  puzzle.start();

  // Edge between b2 and c2.
  suite.edgeClick(puzzle, "b2-1");

  assert("Edge data after click").that(puzzle.edges[1][1][1].data).isEqualTo({image: 'cross'});
  // The cross is solver's mark only.
  assert("Submission data with the cross").that(puzzle.collectData()).isEqualTo({});

  suite.edgeClick(puzzle, "b2-1");

  assert("Edge data after second click").that(puzzle.edges[1][1][1].data).isEqualTo({});
}),

// Data collector tests
test('Data collector',(suite) => {
  let puzzle = suite.showPuzzle("simple_loop", "4x4", {"a1": "black", "b1": "black"});
  puzzle.start();

  suite.drawLine(puzzle, "c1", "d1", "d4", "a4", "a2", "b2", "b3", "c3", "c1");
  suite.edgeClick(puzzle, "b3-2");

  assert("Submission data").that(puzzle.collectData()).isEqualTo({"connectors": {
    "c1-h": "1", "c1-v": "1", "d1-v": "1",
    "a2-h": "1", "a2-v": "1", "b2-v": "1", "c2-v": "1", "d2-v": "1",
    "a3-v": "1", "b3-h": "1", "d3-v": "1",
    "a4-h": "1", "b4-h": "1", "c4-h": "1"}});
}),

test('Author click cycle',(suite) => {
  let puzzle = suite.showPuzzle("simple_loop", "4x4");
  puzzle.edit();

  assert("Cell data before click").that(puzzle.cells[0][0].data).isEqualTo({});

  suite.cellClick(puzzle, "a1");

  assert("Cell value after click").that(puzzle.cells[0][0].getValue()).isEqualTo("black");
  assert("Cell data after click").that(puzzle.cells[0][0].data).isEqualTo({color: puzzle.colorSchema.gridColor, returnValue: 'black'});

  suite.cellClick(puzzle, "a1");

  assert("Cell value after second click").that(puzzle.cells[0][0].getValue()).isNull();
  assert("Cell data after second click").that(puzzle.cells[0][0].data).isEqualTo({});
}),

test('Author can not draw lines',(suite) => {
  let puzzle = suite.showPuzzle("simple_loop", "4x4");
  puzzle.edit();

  suite.drag(puzzle, suite.cellPoint(puzzle, "c1"), suite.cellPoint(puzzle, "d1"));

  assert("Connector value after drag").that(puzzle.connectors[0][2]['h'].getValue()).isNull();
  assert("Puzzle data after drag").that(puzzle.collectData()).isEqualTo({});
}),

test('Author data collector',(suite) => {
  let puzzle = suite.showPuzzle("simple_loop", "4x4");
  puzzle.edit();

  suite.cellClick(puzzle, "a1");
  suite.cellClick(puzzle, "b1");
  // Cell c3 is set to black and cleared back.
  suite.cellClick(puzzle, "c3");
  suite.cellClick(puzzle, "c3");

  assert("Puzzle data").that(puzzle.collectData()).isEqualTo({"a1": "black", "b1": "black"});
}),

);
