ringRingBattenbergTestSuite = uiTestSuite("Ring-Ring Battenberg", "squarepuzzle", "squarePuzzleType",

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

// Grid of the most of the tests: black cell in a1 (#) and marked cell in b2 (+).
//   # . . .
//   . + . .
//   . . . .
//   . . . .

// Controller definition tests
test('Solver controllers',(suite) => {
  let puzzle = suite.showPuzzle("ring_ring_battenberg", "4x4", {"a1": "black", "b2": "battenberg"});
  puzzle.start();

  assert("Empty cell chooser").that(puzzle.cells[2][2].chooserValues).isNull();
  assert("Empty cell click").that(puzzle.cells[2][2].clickSwitch).isNull();
  assert("Empty cell drag processor").that(puzzle.cells[2][2].dragProcessor).isNotNull();
  assert("Black cell data").that(puzzle.cells[0][0].data).isEqualTo({color: puzzle.colorSchema.gridColor});
  assert("Black cell chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("Black cell click").that(puzzle.cells[0][0].clickSwitch).isNull();
  assert("Black cell drag processor").that(puzzle.cells[0][0].dragProcessor).isNotNull();
  assert("Marked cell data").that(puzzle.cells[1][1].data).isEqualTo({image: 'battenberg_small_e'});
  assert("Marked cell chooser").that(puzzle.cells[1][1].chooserValues).isNull();
  assert("Marked cell click").that(puzzle.cells[1][1].clickSwitch).containsExactly([{image: 'battenberg_small_e'}, {image: 'battenberg_small'}, {image: 'battenberg_small_1'}]);
  assert("Marked cell drag processor").that(puzzle.cells[1][1].dragProcessor).isNotNull();
  assert("Edge chooser").that(puzzle.edges[1][2][2].chooserValues).isNull();
  assert("Edge click").that(puzzle.edges[1][2][2].clickSwitch).containsExactly([{}, {image: 'cross'}]);
  assert("Edge drag").that(puzzle.edges[1][2][2].dragSwitch).isNull();
  assert("Connector chooser").that(puzzle.connectors[1][2]['v'].chooserValues).isNull();
  assert("Connector click").that(puzzle.connectors[1][2]['v'].clickSwitch).isNull();
  assert("Connector drag").that(puzzle.connectors[1][2]['v'].dragSwitch).containsExactly([{}, {color: puzzle.colorSchema.lineColor, returnValue: '1'}]);
}),

test('Author controllers',(suite) => {
  let puzzle = suite.showPuzzle("ring_ring_battenberg", "4x4");
  puzzle.edit();

  assert("Cell chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("Cell click").that(puzzle.cells[0][0].clickSwitch).containsExactly([{}, {image: 'battenberg_small_e', returnValue: 'battenberg'}, {color: puzzle.colorSchema.gridColor, returnValue: 'black'}]);
  assert("Cell drag processor").that(puzzle.cells[0][0].dragProcessor).isNull();
  assert("Edge chooser").that(puzzle.edges[1][2][2].chooserValues).isNull();
  assert("Edge click").that(puzzle.edges[1][2][2].clickSwitch).isNull();
  assert("Edge drag").that(puzzle.edges[1][2][2].dragSwitch).isNull();
  assert("Connector click").that(puzzle.connectors[1][2]['v'].clickSwitch).isNull();
  assert("Connector drag").that(puzzle.connectors[1][2]['v'].dragSwitch).isNull();
}),

// Mouse processing tests
test('Draw line by drag between cells',(suite) => {
  let puzzle = suite.showPuzzle("ring_ring_battenberg", "4x4", {"a1": "black", "b2": "battenberg"});
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
  let puzzle = suite.showPuzzle("ring_ring_battenberg", "4x4", {"a1": "black", "b2": "battenberg"});
  puzzle.start();

  suite.drawLine(puzzle, "a2", "b2");

  assert("Connector value after drag").that(puzzle.connectors[1][0]['h'].getValue()).isEqualTo("1");

  // The same connector in the opposite direction.
  suite.drawLine(puzzle, "b2", "a2");

  assert("Connector value after second drag").that(puzzle.connectors[1][0]['h'].getValue()).isNull();
  assert("Connector data after second drag").that(puzzle.connectors[1][0]['h'].data).isEqualTo({});
}),

test('Draw line through several cells',(suite) => {
  let puzzle = suite.showPuzzle("ring_ring_battenberg", "4x4", {"a1": "black", "b2": "battenberg"});
  puzzle.start();

  // One mouse move from a2 to c2 passes over b2.
  suite.drag(puzzle, suite.cellPoint(puzzle, "a2"), suite.cellPoint(puzzle, "c2"));

  assert("Line after one long move").that(puzzle.collectData()).isEqualTo({"connectors": {"a2-h": "1", "b2-h": "1"}});

  // Drag with turns: c2 - c3 - a3 - a2 closes the rectangle.
  suite.drawLine(puzzle, "c2", "c3", "a3", "a2");

  assert("Rectangle").that(puzzle.collectData()).isEqualTo({"connectors": {"a2-h": "1", "b2-h": "1", "c2-v": "1", "a3-h": "1", "b3-h": "1", "a2-v": "1"}});
}),

test('Click and diagonal drag do not draw lines',(suite) => {
  let puzzle = suite.showPuzzle("ring_ring_battenberg", "4x4", {"a1": "black", "b2": "battenberg"});
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
  let puzzle = suite.showPuzzle("ring_ring_battenberg", "4x4", {"a1": "black", "b2": "battenberg"});
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
  let puzzle = suite.showPuzzle("ring_ring_battenberg", "4x4", {"a1": "black", "b2": "battenberg"});
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

test('Line passes through marked cell',(suite) => {
  let puzzle = suite.showPuzzle("ring_ring_battenberg", "4x4", {"a1": "black", "b2": "battenberg"});
  puzzle.start();

  // Two lines cross each other in the marked cell b2.
  suite.drawLine(puzzle, "a2", "b2", "c2");
  suite.drawLine(puzzle, "b1", "b2", "b3");

  assert("Lines through marked cell").that(puzzle.collectData()).isEqualTo({"connectors": {"a2-h": "1", "b2-h": "1", "b1-v": "1", "b2-v": "1"}});
  assert("Marked cell data").that(puzzle.cells[1][1].data).isEqualTo({image: 'battenberg_small_e'});
}),

test('Process clicks to marked cell',(suite) => {
  let puzzle = suite.showPuzzle("ring_ring_battenberg", "4x4", {"a1": "black", "b2": "battenberg"});
  puzzle.start();

  let cell = puzzle.cells[1][1];

  suite.cellClick(puzzle, "b2");

  assert("Marked cell value after one click").that(cell.getValue()).isNull();
  assert("Marked cell data after one click").that(cell.data).isEqualTo({image: 'battenberg_small'});

  suite.cellClick(puzzle, "b2");

  assert("Marked cell value after two clicks").that(cell.getValue()).isNull();
  assert("Marked cell data after two clicks").that(cell.data).isEqualTo({image: 'battenberg_small_1'});
  assert("Direction of the mark is not submitted").that(puzzle.collectData()).isEqualTo({});

  suite.cellClick(puzzle, "b2");

  assert("Marked cell data after three clicks").that(cell.data).isEqualTo({image: 'battenberg_small_e'});
}),

test('Black and empty cells are not changed by click',(suite) => {
  let puzzle = suite.showPuzzle("ring_ring_battenberg", "4x4", {"a1": "black", "b2": "battenberg"});
  puzzle.start();

  suite.cellClick(puzzle, "a1");
  suite.cellClick(puzzle, "c3");

  assert("Black cell data").that(puzzle.cells[0][0].data).isEqualTo({color: puzzle.colorSchema.gridColor});
  assert("Empty cell data").that(puzzle.cells[2][2].data).isEqualTo({});
  assert("Submission data").that(puzzle.collectData()).isEqualTo({});
}),

// Data collector tests
test('Data collector',(suite) => {
  let puzzle = suite.showPuzzle("ring_ring_battenberg", "4x4", {"a1": "black", "b2": "battenberg"});
  puzzle.start();

  // Rectangles 1 and 2 share the vertex in the marked cell b2:
  //   # 1 1 1
  //   2 + 1 1
  //   2 2 3 3
  //   2 2 3 3
  suite.drawLine(puzzle, "b1", "d1", "d2", "b2", "b1");
  suite.drawLine(puzzle, "a2", "b2", "b4", "a4", "a2");
  suite.drawLine(puzzle, "c3", "d3", "d4", "c4", "c3");
  // Marks which are not submitted.
  suite.cellClick(puzzle, "b2");
  suite.click(puzzle, suite.gridPoint(puzzle, 2.5, 2));

  assert("Submission data").that(puzzle.collectData()).isEqualTo({"connectors": {
    "b1-h": "1", "c1-h": "1", "b2-h": "1", "c2-h": "1", "a2-h": "1", "a4-h": "1", "c3-h": "1", "c4-h": "1",
    "b1-v": "1", "d1-v": "1", "a2-v": "1", "a3-v": "1", "b2-v": "1", "b3-v": "1", "c3-v": "1", "d3-v": "1"}});
}),

test('Process clicks to cell for author',(suite) => {
  let puzzle = suite.showPuzzle("ring_ring_battenberg", "4x4");
  puzzle.edit();

  let cell = puzzle.cells[0][0];

  suite.cellClick(puzzle, "a1");

  assert("Cell value after one click").that(cell.getValue()).isEqualTo("battenberg");
  assert("Cell data after one click").that(cell.data).isEqualTo({image: 'battenberg_small_e', returnValue: 'battenberg'});

  suite.cellClick(puzzle, "a1");

  assert("Cell value after two clicks").that(cell.getValue()).isEqualTo("black");
  assert("Cell data after two clicks").that(cell.data).isEqualTo({color: puzzle.colorSchema.gridColor, returnValue: 'black'});

  suite.cellClick(puzzle, "a1");

  assert("Cell value after three clicks").that(cell.getValue()).isNull();
  assert("Cell data after three clicks").that(cell.data).isEqualTo({});
}),

test('Author data collector',(suite) => {
  let puzzle = suite.showPuzzle("ring_ring_battenberg", "4x4");
  puzzle.edit();

  // Black cell a1 (two clicks), marked cell b2 (one click).
  suite.cellClick(puzzle, "a1");
  suite.cellClick(puzzle, "a1");
  suite.cellClick(puzzle, "b2");
  // Cell c3 is set and cleared.
  suite.cellClick(puzzle, "c3");
  suite.cellClick(puzzle, "c3");
  suite.cellClick(puzzle, "c3");

  assert("Puzzle data").that(puzzle.collectData()).isEqualTo({"a1": "black", "b2": "battenberg"});
}),

test('Author can not draw lines',(suite) => {
  let puzzle = suite.showPuzzle("ring_ring_battenberg", "4x4");
  puzzle.edit();

  suite.drawLine(puzzle, "a2", "b2", "b3");
  // The edge between c2 and c3.
  suite.click(puzzle, suite.gridPoint(puzzle, 2.5, 2));

  assert("Connector value").that(puzzle.connectors[1][0]['h'].getValue()).isNull();
  assert("Edge data").that(puzzle.edges[1][2][2].data).isEqualTo({});
  assert("Puzzle data").that(puzzle.collectData()).isEqualTo({});
}),

);
