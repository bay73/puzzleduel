ringRingNumberedTestSuite = uiTestSuite("Ring-Ring Numbered", "squarepuzzle", "squarePuzzleType",

beforeSuite((suite, cb)=> {
  // Emulates a single mouse drag through the centers of the given cells (it draws a line along the path).
  suite.drawLine = function(puzzle, ...cells) {
    let points = cells.map(cell => suite.cellPoint(puzzle, cell));
    puzzle.controller.onMouseDown(suite.mouseEvent(points[0]));
    points.slice(1).forEach(point => puzzle.controller.onMouseMove(suite.mouseEvent(point)));
    puzzle.controller.onMouseUp(suite.mouseEvent(points[points.length - 1]));
  };
  cb();
}),

// Grid of the most of the tests: black cells (#) and cells with letters, the dimension "5x4-AB" defines the letters.
//   # # . A .
//   . B . . .
//   . . . . A
//   # # . . .

// Controller definition tests
test('Solver controllers',(suite) => {
  let puzzle = suite.showPuzzle("ring_ring_numbered", "5x4-AB", {"a1": "black", "b1": "black", "a4": "black", "b4": "black", "d1": "A", "b2": "B", "e3": "A"});
  puzzle.start();

  assert("Empty cell chooser").that(puzzle.cells[2][2].chooserValues).isNull();
  assert("Empty cell click").that(puzzle.cells[2][2].clickSwitch).isNull();
  assert("Empty cell drag processor").that(puzzle.cells[2][2].dragProcessor).isNotNull();
  assert("Black cell data").that(puzzle.cells[0][0].data).isEqualTo({color: puzzle.colorSchema.gridColor});
  assert("Black cell chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("Black cell click").that(puzzle.cells[0][0].clickSwitch).isNull();
  assert("Black cell drag processor").that(puzzle.cells[0][0].dragProcessor).isNotNull();
  assert("Letter cell data").that(puzzle.cells[0][3].data).isEqualTo({text: 'A'});
  assert("Letter cell chooser").that(puzzle.cells[0][3].chooserValues).isNull();
  assert("Letter cell click").that(puzzle.cells[0][3].clickSwitch).isNull();
  assert("Letter cell drag processor").that(puzzle.cells[0][3].dragProcessor).isNotNull();
  assert("Edge chooser").that(puzzle.edges[1][2][2].chooserValues).isNull();
  assert("Edge click").that(puzzle.edges[1][2][2].clickSwitch).containsExactly([{}, {image: 'cross'}]);
  assert("Edge drag").that(puzzle.edges[1][2][2].dragSwitch).isNull();
  assert("Connector chooser").that(puzzle.connectors[1][2]['v'].chooserValues).isNull();
  assert("Connector click").that(puzzle.connectors[1][2]['v'].clickSwitch).isNull();
  assert("Connector drag").that(puzzle.connectors[1][2]['v'].dragSwitch).containsExactly([{}, {color: puzzle.colorSchema.lineColor, returnValue: '1'}]);
}),

test('Author controllers',(suite) => {
  let puzzle = suite.showPuzzle("ring_ring_numbered", "5x4-AB");
  puzzle.edit();

  assert("Cell chooser").that(puzzle.cells[0][0].chooserValues).containsExactly(
    [{}, {color: puzzle.colorSchema.gridColor, returnValue: 'black'}, {text: 'A', returnValue: 'A'}, {text: 'B', returnValue: 'B'}]);
  assert("Cell click").that(puzzle.cells[0][0].clickSwitch).isNull();
  assert("Cell drag processor").that(puzzle.cells[0][0].dragProcessor).isNull();
  assert("Edge chooser").that(puzzle.edges[1][2][2].chooserValues).isNull();
  assert("Edge click").that(puzzle.edges[1][2][2].clickSwitch).isNull();
  assert("Edge drag").that(puzzle.edges[1][2][2].dragSwitch).isNull();
  assert("Connector click").that(puzzle.connectors[1][2]['v'].clickSwitch).isNull();
  assert("Connector drag").that(puzzle.connectors[1][2]['v'].dragSwitch).isNull();
}),

// Mouse processing tests
test('Draw line by drag between cells',(suite) => {
  let puzzle = suite.showPuzzle("ring_ring_numbered", "5x4-AB", {"a1": "black", "b1": "black", "a4": "black", "b4": "black", "d1": "A", "b2": "B", "e3": "A"});
  puzzle.start();

  let connector = puzzle.connectors[1][2]['v'];
  let point = suite.cellPoint(puzzle, "c2");

  assert("Connector value before drag").that(connector.getValue()).isNull();
  assert("Connector data before drag").that(connector.data).isEqualTo({});

  // Drag from c2 down to c3.
  puzzle.controller.onMouseDown(suite.mouseEvent(point));
  point.down();
  puzzle.controller.onMouseMove(suite.mouseEvent(point));

  assert("Connector value after drag").that(connector.getValue()).isEqualTo("1");
  assert("Connector data after drag").that(connector.data).isEqualTo({color: puzzle.colorSchema.lineColor, returnValue: "1"});
  assert("Horizontal connector of the same cell").that(puzzle.connectors[1][2]['h'].getValue()).isNull();

  // Moving back within the same drag removes the line.
  point.up();
  puzzle.controller.onMouseMove(suite.mouseEvent(point));
  puzzle.controller.onMouseUp(suite.mouseEvent(point));

  assert("Connector value after back drag").that(connector.getValue()).isNull();
  assert("Connector data after back drag").that(connector.data).isEqualTo({});
}),

test('Second drag over the line removes it',(suite) => {
  let puzzle = suite.showPuzzle("ring_ring_numbered", "5x4-AB", {"a1": "black", "b1": "black", "a4": "black", "b4": "black", "d1": "A", "b2": "B", "e3": "A"});
  puzzle.start();

  suite.drawLine(puzzle, "a2", "b2");

  assert("Connector value after drag").that(puzzle.connectors[1][0]['h'].getValue()).isEqualTo("1");

  // The same connector in the opposite direction.
  suite.drawLine(puzzle, "b2", "a2");

  assert("Connector value after second drag").that(puzzle.connectors[1][0]['h'].getValue()).isNull();
  assert("Connector data after second drag").that(puzzle.connectors[1][0]['h'].data).isEqualTo({});
}),

test('Draw line through several cells',(suite) => {
  let puzzle = suite.showPuzzle("ring_ring_numbered", "5x4-AB", {"a1": "black", "b1": "black", "a4": "black", "b4": "black", "d1": "A", "b2": "B", "e3": "A"});
  puzzle.start();

  // One mouse move from a2 to c2 passes over b2.
  suite.drag(puzzle, suite.cellPoint(puzzle, "a2"), suite.cellPoint(puzzle, "c2"));

  assert("Line after one long move").that(puzzle.collectData()).isEqualTo({"connectors": {"a2-h": "1", "b2-h": "1"}});

  // Drag with turns: c2 - c3 - a3 - a2 closes the rectangle.
  suite.drawLine(puzzle, "c2", "c3", "a3", "a2");

  assert("Rectangle").that(puzzle.collectData()).isEqualTo({"connectors": {"a2-h": "1", "b2-h": "1", "c2-v": "1", "a3-h": "1", "b3-h": "1", "a2-v": "1"}});
}),

test('Click and diagonal drag do not draw lines',(suite) => {
  let puzzle = suite.showPuzzle("ring_ring_numbered", "5x4-AB", {"a1": "black", "b1": "black", "a4": "black", "b4": "black", "d1": "A", "b2": "B", "e3": "A"});
  puzzle.start();

  // Click at the middle of the connector between c2 and c3 and at the centers of these cells.
  suite.click(puzzle, suite.gridPoint(puzzle, 2.5, 2));
  suite.cellClick(puzzle, "c2");
  suite.cellClick(puzzle, "c3");
  // Cells b2 and c3 are not in one row or column.
  suite.drag(puzzle, suite.cellPoint(puzzle, "b2"), suite.cellPoint(puzzle, "c3"));

  assert("Connector value").that(puzzle.connectors[1][2]['v'].getValue()).isNull();
  assert("Submission data").that(puzzle.collectData()).isEqualTo({});
}),

test('Line can not enter black cell',(suite) => {
  let puzzle = suite.showPuzzle("ring_ring_numbered", "5x4-AB", {"a1": "black", "b1": "black", "a4": "black", "b4": "black", "d1": "A", "b2": "B", "e3": "A"});
  puzzle.start();

  suite.drawLine(puzzle, "a2", "a1");
  suite.drawLine(puzzle, "c1", "b1");
  suite.drawLine(puzzle, "a1", "b1");

  assert("Connector between a1 and a2").that(puzzle.connectors[0][0]['v'].getValue()).isNull();
  assert("Connector between b1 and c1").that(puzzle.connectors[0][1]['h'].getValue()).isNull();
  assert("Connector between a1 and b1").that(puzzle.connectors[0][0]['h'].getValue()).isNull();
  assert("Submission data").that(puzzle.collectData()).isEqualTo({});

  // One mouse move from e1 to the black cell a1: the line is drawn only to c1.
  suite.drag(puzzle, suite.cellPoint(puzzle, "e1"), suite.cellPoint(puzzle, "a1"));

  assert("Line stops at the black cell").that(puzzle.collectData()).isEqualTo({"connectors": {"c1-h": "1", "d1-h": "1"}});
}),
test('Process clicks to edge',(suite) => {
  let puzzle = suite.showPuzzle("ring_ring_numbered", "5x4-AB", {"a1": "black", "b1": "black", "a4": "black", "b4": "black", "d1": "A", "b2": "B", "e3": "A"});
  puzzle.start();

  // The edge between c2 and c3.
  let edge = puzzle.edges[1][2][2];
  let point = suite.gridPoint(puzzle, 2.5, 2);

  assert("Edge data before click").that(edge.data).isEqualTo({});

  suite.click(puzzle, point);

  assert("Edge value after click").that(edge.getValue()).isNull();
  assert("Edge data after click").that(edge.data).isEqualTo({image: "cross"});
  assert("Cross is not submitted").that(puzzle.collectData()).isEqualTo({});

  suite.click(puzzle, point);

  assert("Edge value after second click").that(edge.getValue()).isNull();
  assert("Edge data after second click").that(edge.data).isEqualTo({});
}),

test('Black and empty cells are not changed by click',(suite) => {
  let puzzle = suite.showPuzzle("ring_ring_numbered", "5x4-AB", {"a1": "black", "b1": "black", "a4": "black", "b4": "black", "d1": "A", "b2": "B", "e3": "A"});
  puzzle.start();

  suite.cellClick(puzzle, "a1");
  suite.cellClick(puzzle, "c3");

  assert("Black cell data").that(puzzle.cells[0][0].data).isEqualTo({color: puzzle.colorSchema.gridColor});
  assert("Empty cell data").that(puzzle.cells[2][2].data).isEqualTo({});
  assert("Submission data").that(puzzle.collectData()).isEqualTo({});
}),

test('Line passes through cell with letter',(suite) => {
  let puzzle = suite.showPuzzle("ring_ring_numbered", "5x4-AB", {"a1": "black", "b1": "black", "a4": "black", "b4": "black", "d1": "A", "b2": "B", "e3": "A"});
  puzzle.start();

  // Through the letter A in d1 and the letter B in b2.
  suite.drawLine(puzzle, "c1", "d1", "e1");
  suite.drawLine(puzzle, "b3", "b2", "c2");

  assert("Lines through letters").that(puzzle.collectData()).isEqualTo({"connectors": {"c1-h": "1", "d1-h": "1", "b2-v": "1", "b2-h": "1"}});
}),

test('Cell with letter is not changed by click',(suite) => {
  let puzzle = suite.showPuzzle("ring_ring_numbered", "5x4-AB", {"a1": "black", "b1": "black", "a4": "black", "b4": "black", "d1": "A", "b2": "B", "e3": "A"});
  puzzle.start();

  suite.cellClick(puzzle, "d1");
  suite.cellClick(puzzle, "d1");

  assert("Letter cell data").that(puzzle.cells[0][3].data).isEqualTo({text: 'A'});
  assert("Submission data").that(puzzle.collectData()).isEqualTo({});
}),

// Data collector tests
test('Data collector',(suite) => {
  let puzzle = suite.showPuzzle("ring_ring_numbered", "5x4-AB", {"a1": "black", "b1": "black", "a4": "black", "b4": "black", "d1": "A", "b2": "B", "e3": "A"});
  puzzle.start();

  // Two rectangles c1-e1-e4-c4 and a2-d2-d3-a3:
  //   # # 1 1 1
  //   2 2 + 2 1
  //   2 2 + 2 1
  //   # # 1 1 1
  suite.drawLine(puzzle, "c1", "e1", "e4", "c4", "c1");
  suite.drawLine(puzzle, "a2", "d2", "d3", "a3", "a2");
  // Cross at the edge is not submitted.
  suite.click(puzzle, suite.gridPoint(puzzle, 1.5, 2));

  assert("Submission data").that(puzzle.collectData()).isEqualTo({"connectors": {
    "c1-h": "1", "d1-h": "1", "c4-h": "1", "d4-h": "1", "a2-h": "1", "b2-h": "1", "c2-h": "1", "a3-h": "1", "b3-h": "1", "c3-h": "1",
    "c1-v": "1", "e1-v": "1", "c2-v": "1", "e2-v": "1", "c3-v": "1", "e3-v": "1", "a2-v": "1", "d2-v": "1"}});
}),

test('Letters of the chooser are defined by dimension',(suite) => {
  let puzzle = suite.showPuzzle("ring_ring_numbered", "5x4-ABC");
  puzzle.edit();

  assert("Cell chooser").that(puzzle.cells[0][0].chooserValues).containsExactly(
    [{}, {color: puzzle.colorSchema.gridColor, returnValue: 'black'}, {text: 'A', returnValue: 'A'}, {text: 'B', returnValue: 'B'}, {text: 'C', returnValue: 'C'}]);
}),

test('Cell chooser for author',(suite) => {
  let puzzle = suite.showPuzzle("ring_ring_numbered", "5x4-AB");
  puzzle.edit();

  let cell = puzzle.cells[0][0];

  cell.switchOnChooser(1);

  assert("Cell value after black item").that(cell.getValue()).isEqualTo("black");
  assert("Cell data after black item").that(cell.data).isEqualTo({color: puzzle.colorSchema.gridColor, returnValue: 'black'});

  cell.switchOnChooser(3);

  assert("Cell value after letter item").that(cell.getValue()).isEqualTo("B");
  assert("Cell data after letter item").that(cell.data).isEqualTo({text: 'B', returnValue: 'B'});

  cell.switchOnChooser(0);

  assert("Cell value after empty item").that(cell.getValue()).isNull();
  assert("Cell data after empty item").that(cell.data).isEqualTo({});
}),

test('Author data collector',(suite) => {
  let puzzle = suite.showPuzzle("ring_ring_numbered", "5x4-AB");
  puzzle.edit();

  // Black cells.
  puzzle.cells[0][0].switchOnChooser(1);
  puzzle.cells[0][1].switchOnChooser(1);
  puzzle.cells[3][0].switchOnChooser(1);
  puzzle.cells[3][1].switchOnChooser(1);
  // Letter A in d1 and e3, letter B in b2.
  puzzle.cells[0][3].switchOnChooser(2);
  puzzle.cells[2][4].switchOnChooser(2);
  puzzle.cells[1][1].switchOnChooser(3);
  // Cell c3 is set and cleared.
  puzzle.cells[2][2].switchOnChooser(3);
  puzzle.cells[2][2].switchOnChooser(0);

  assert("Puzzle data").that(puzzle.collectData()).isEqualTo({"a1": "black", "b1": "black", "a4": "black", "b4": "black", "d1": "A", "b2": "B", "e3": "A"});
}),

test('Author can not mark edges',(suite) => {
  let puzzle = suite.showPuzzle("ring_ring_numbered", "5x4-AB");
  puzzle.edit();

  // The edge between c2 and c3.
  suite.click(puzzle, suite.gridPoint(puzzle, 2.5, 2));

  assert("Edge data").that(puzzle.edges[1][2][2].data).isEqualTo({});
  assert("Puzzle data").that(puzzle.collectData()).isEqualTo({});
}),

);
