ringRingEmptyTestSuite = uiTestSuite("Ring-Ring with empty cell", "squarepuzzle", "squarePuzzleType",

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

// Grid of the most of the tests: black cell in a1 (#).
//   # . . .
//   . . . .
//   . . . .
//   . . . .

// Controller definition tests
test('Solver controllers',(suite) => {
  let puzzle = suite.showPuzzle("ring_ring_empty", "4x4", {"a1": "black"});
  puzzle.start();

  assert("Empty cell chooser").that(puzzle.cells[2][2].chooserValues).isNull();
  assert("Empty cell click").that(puzzle.cells[2][2].clickSwitch).containsExactly([{}, {image: 'cross'}, {image: 'white_circle'}]);
  assert("Empty cell drag processor").that(puzzle.cells[2][2].dragProcessor).isNotNull();
  assert("Black cell data").that(puzzle.cells[0][0].data).isEqualTo({color: puzzle.colorSchema.gridColor});
  assert("Black cell chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("Black cell click").that(puzzle.cells[0][0].clickSwitch).isNull();
  assert("Black cell drag processor").that(puzzle.cells[0][0].dragProcessor).isNotNull();
  assert("Edge chooser").that(puzzle.edges[1][2][2].chooserValues).isNull();
  assert("Edge click").that(puzzle.edges[1][2][2].clickSwitch).containsExactly([{}, {image: 'cross'}]);
  assert("Edge drag").that(puzzle.edges[1][2][2].dragSwitch).isNull();
  assert("Connector chooser").that(puzzle.connectors[1][2]['v'].chooserValues).isNull();
  assert("Connector click").that(puzzle.connectors[1][2]['v'].clickSwitch).isNull();
  assert("Connector drag").that(puzzle.connectors[1][2]['v'].dragSwitch).containsExactly([{}, {color: puzzle.colorSchema.lineColor, returnValue: '1'}]);
}),

test('Author controllers',(suite) => {
  let puzzle = suite.showPuzzle("ring_ring_empty", "4x4");
  puzzle.edit();

  assert("Cell chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("Cell click").that(puzzle.cells[0][0].clickSwitch).containsExactly([{}, {color: puzzle.colorSchema.gridColor, returnValue: 'black'}]);
  assert("Cell drag processor").that(puzzle.cells[0][0].dragProcessor).isNull();
  assert("Edge chooser").that(puzzle.edges[1][2][2].chooserValues).isNull();
  assert("Edge click").that(puzzle.edges[1][2][2].clickSwitch).isNull();
  assert("Edge drag").that(puzzle.edges[1][2][2].dragSwitch).isNull();
  assert("Connector click").that(puzzle.connectors[1][2]['v'].clickSwitch).isNull();
  assert("Connector drag").that(puzzle.connectors[1][2]['v'].dragSwitch).isNull();
}),

// Mouse processing tests
test('Draw line by drag between cells',(suite) => {
  let puzzle = suite.showPuzzle("ring_ring_empty", "4x4", {"a1": "black"});
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
  let puzzle = suite.showPuzzle("ring_ring_empty", "4x4", {"a1": "black"});
  puzzle.start();

  suite.drawLine(puzzle, "a2", "b2");

  assert("Connector value after drag").that(puzzle.connectors[1][0]['h'].getValue()).isEqualTo("1");

  // The same connector in the opposite direction.
  suite.drawLine(puzzle, "b2", "a2");

  assert("Connector value after second drag").that(puzzle.connectors[1][0]['h'].getValue()).isNull();
  assert("Connector data after second drag").that(puzzle.connectors[1][0]['h'].data).isEqualTo({});
}),

test('Draw line through several cells',(suite) => {
  let puzzle = suite.showPuzzle("ring_ring_empty", "4x4", {"a1": "black"});
  puzzle.start();

  // One mouse move from a2 to c2 passes over b2.
  suite.drag(puzzle, suite.cellPoint(puzzle, "a2"), suite.cellPoint(puzzle, "c2"));

  assert("Line after one long move").that(puzzle.collectData()).isEqualTo({"connectors": {"a2-h": "1", "b2-h": "1"}});

  // Drag with turns: c2 - c3 - a3 - a2 closes the rectangle.
  suite.drawLine(puzzle, "c2", "c3", "a3", "a2");

  assert("Rectangle").that(puzzle.collectData()).isEqualTo({"connectors": {"a2-h": "1", "b2-h": "1", "c2-v": "1", "a3-h": "1", "b3-h": "1", "a2-v": "1"}});
}),

test('Click and diagonal drag do not draw lines',(suite) => {
  let puzzle = suite.showPuzzle("ring_ring_empty", "4x4", {"a1": "black"});
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
  let puzzle = suite.showPuzzle("ring_ring_empty", "4x4", {"a1": "black"});
  puzzle.start();

  suite.drawLine(puzzle, "a2", "a1");
  suite.drawLine(puzzle, "a1", "b1");
  suite.drawLine(puzzle, "b1", "a1");

  assert("Connector between a1 and a2").that(puzzle.connectors[0][0]['v'].getValue()).isNull();
  assert("Connector between a1 and b1").that(puzzle.connectors[0][0]['h'].getValue()).isNull();
  assert("Submission data").that(puzzle.collectData()).isEqualTo({});

  // One mouse move from a4 up to the black cell a1: the line is drawn only to a2.
  suite.drag(puzzle, suite.cellPoint(puzzle, "a4"), suite.cellPoint(puzzle, "a1"));

  assert("Line stops at the black cell").that(puzzle.collectData()).isEqualTo({"connectors": {"a2-v": "1", "a3-v": "1"}});
}),
test('Process clicks to edge',(suite) => {
  let puzzle = suite.showPuzzle("ring_ring_empty", "4x4", {"a1": "black"});
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

test('Process clicks to cell',(suite) => {
  let puzzle = suite.showPuzzle("ring_ring_empty", "4x4", {"a1": "black"});
  puzzle.start();

  // Solver can mark the cell as unused (cross) or used (circle).
  let cell = puzzle.cells[3][3];

  assert("Cell data before click").that(cell.data).isEqualTo({});

  suite.cellClick(puzzle, "d4");

  assert("Cell value after one click").that(cell.getValue()).isNull();
  assert("Cell data after one click").that(cell.data).isEqualTo({image: 'cross'});
  assert("Cross is not submitted").that(puzzle.collectData()).isEqualTo({});

  suite.cellClick(puzzle, "d4");

  assert("Cell value after two clicks").that(cell.getValue()).isNull();
  assert("Cell data after two clicks").that(cell.data).isEqualTo({image: 'white_circle'});
  assert("Circle is not submitted").that(puzzle.collectData()).isEqualTo({});

  suite.cellClick(puzzle, "d4");

  assert("Cell data after three clicks").that(cell.data).isEqualTo({});
}),

test('Marks and lines do not affect each other',(suite) => {
  let puzzle = suite.showPuzzle("ring_ring_empty", "4x4", {"a1": "black"});
  puzzle.start();

  suite.cellClick(puzzle, "b2");
  suite.cellClick(puzzle, "b2");
  suite.drawLine(puzzle, "a2", "b2", "c2");

  assert("Cell data after drag").that(puzzle.cells[1][1].data).isEqualTo({image: 'white_circle'});
  assert("Line through the marked cell").that(puzzle.collectData()).isEqualTo({"connectors": {"a2-h": "1", "b2-h": "1"}});

  suite.cellClick(puzzle, "b2");

  assert("Cell data after click").that(puzzle.cells[1][1].data).isEqualTo({});
  assert("Line after click to the cell").that(puzzle.collectData()).isEqualTo({"connectors": {"a2-h": "1", "b2-h": "1"}});
}),

test('Black cell is not changed by click',(suite) => {
  let puzzle = suite.showPuzzle("ring_ring_empty", "4x4", {"a1": "black"});
  puzzle.start();

  suite.cellClick(puzzle, "a1");
  suite.cellClick(puzzle, "a1");

  assert("Black cell data").that(puzzle.cells[0][0].data).isEqualTo({color: puzzle.colorSchema.gridColor});
  assert("Submission data").that(puzzle.collectData()).isEqualTo({});
}),

// Data collector tests
test('Data collector',(suite) => {
  let puzzle = suite.showPuzzle("ring_ring_empty", "4x4", {"a1": "black"});
  puzzle.start();

  // Two rectangles b1-d1-d3-b3 and a2-c2-c4-a4, the cell d4 is not used:
  //   # 1 1 1
  //   2 + 2 1
  //   2 1 + 1
  //   2 2 2 x
  suite.drawLine(puzzle, "b1", "d1", "d3", "b3", "b1");
  suite.drawLine(puzzle, "a2", "c2", "c4", "a4", "a2");
  // Marks which are not submitted: cross in the unused cell, circle in b1.
  suite.cellClick(puzzle, "d4");
  suite.cellClick(puzzle, "b1");
  suite.cellClick(puzzle, "b1");

  assert("Submission data").that(puzzle.collectData()).isEqualTo({"connectors": {
    "b1-h": "1", "c1-h": "1", "b3-h": "1", "c3-h": "1", "a2-h": "1", "b2-h": "1", "a4-h": "1", "b4-h": "1",
    "b1-v": "1", "d1-v": "1", "b2-v": "1", "d2-v": "1", "a2-v": "1", "c2-v": "1", "a3-v": "1", "c3-v": "1"}});
}),

test('Process clicks to cell for author',(suite) => {
  let puzzle = suite.showPuzzle("ring_ring_empty", "4x4");
  puzzle.edit();

  let cell = puzzle.cells[0][0];

  suite.cellClick(puzzle, "a1");

  assert("Cell value after one click").that(cell.getValue()).isEqualTo("black");
  assert("Cell data after one click").that(cell.data).isEqualTo({color: puzzle.colorSchema.gridColor, returnValue: 'black'});

  suite.cellClick(puzzle, "a1");

  assert("Cell value after two clicks").that(cell.getValue()).isNull();
  assert("Cell data after two clicks").that(cell.data).isEqualTo({});
}),

test('Author data collector',(suite) => {
  let puzzle = suite.showPuzzle("ring_ring_empty", "4x4");
  puzzle.edit();

  suite.cellClick(puzzle, "a1");
  suite.cellClick(puzzle, "c3");
  // Cell d4 is set and cleared.
  suite.cellClick(puzzle, "d4");
  suite.cellClick(puzzle, "d4");

  assert("Puzzle data").that(puzzle.collectData()).isEqualTo({"a1": "black", "c3": "black"});
}),

test('Author can not draw lines',(suite) => {
  let puzzle = suite.showPuzzle("ring_ring_empty", "4x4");
  puzzle.edit();

  suite.drawLine(puzzle, "a2", "b2", "b3");
  // The edge between c2 and c3.
  suite.click(puzzle, suite.gridPoint(puzzle, 2.5, 2));

  assert("Connector value").that(puzzle.connectors[1][0]['h'].getValue()).isNull();
  assert("Edge data").that(puzzle.edges[1][2][2].data).isEqualTo({});
  assert("Puzzle data").that(puzzle.collectData()).isEqualTo({});
}),

);
