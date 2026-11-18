ringRingSquareRectangleTestSuite = uiTestSuite("Ring-ring (squares and rectangles)", "squarepuzzle", "squarePuzzleType",

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

// Grid of the most of the tests: black cells (#), black circle (@) and white circle (o).
//   @ . . # #
//   . . . . .
//   . . . # .
//   # . . . o

// Controller definition tests
test('Solver controllers',(suite) => {
  let puzzle = suite.showPuzzle("ring_ring_square_rectangle", "5x4", {"a1": "black_circle", "d1": "black", "e1": "black", "d3": "black", "a4": "black", "e4": "white_circle"});
  puzzle.start();

  assert("Empty cell chooser").that(puzzle.cells[2][2].chooserValues).isNull();
  assert("Empty cell click").that(puzzle.cells[2][2].clickSwitch).isNull();
  assert("Empty cell drag processor").that(puzzle.cells[2][2].dragProcessor).isNotNull();
  assert("Black cell data").that(puzzle.cells[0][3].data).isEqualTo({color: puzzle.colorSchema.gridColor});
  assert("Black cell chooser").that(puzzle.cells[0][3].chooserValues).isNull();
  assert("Black cell click").that(puzzle.cells[0][3].clickSwitch).isNull();
  assert("Black circle data").that(puzzle.cells[0][0].data).isEqualTo({image: 'black_circle'});
  assert("Black circle chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("Black circle click").that(puzzle.cells[0][0].clickSwitch).isNull();
  assert("Black circle drag processor").that(puzzle.cells[0][0].dragProcessor).isNotNull();
  assert("White circle data").that(puzzle.cells[3][4].data).isEqualTo({image: 'white_circle'});
  assert("White circle chooser").that(puzzle.cells[3][4].chooserValues).isNull();
  assert("White circle click").that(puzzle.cells[3][4].clickSwitch).isNull();
  assert("White circle drag processor").that(puzzle.cells[3][4].dragProcessor).isNotNull();
  assert("Edge chooser").that(puzzle.edges[1][2][2].chooserValues).isNull();
  assert("Edge click").that(puzzle.edges[1][2][2].clickSwitch).containsExactly([{}, {image: 'cross'}]);
  assert("Edge drag").that(puzzle.edges[1][2][2].dragSwitch).isNull();
  assert("Connector chooser").that(puzzle.connectors[1][2]['v'].chooserValues).isNull();
  assert("Connector click").that(puzzle.connectors[1][2]['v'].clickSwitch).isNull();
  assert("Connector drag").that(puzzle.connectors[1][2]['v'].dragSwitch).containsExactly([{}, {color: puzzle.colorSchema.lineColor, returnValue: '1'}]);
}),

test('Author controllers',(suite) => {
  let puzzle = suite.showPuzzle("ring_ring_square_rectangle", "5x4");
  puzzle.edit();

  assert("Cell chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("Cell click").that(puzzle.cells[0][0].clickSwitch).containsExactly([
    {},
    {color: puzzle.colorSchema.gridColor, returnValue: 'black'},
    {image: 'white_circle', returnValue: 'white_circle'},
    {image: 'black_circle', returnValue: 'black_circle'}]);
  assert("Cell drag processor").that(puzzle.cells[0][0].dragProcessor).isNull();
  assert("Edge chooser").that(puzzle.edges[1][2][2].chooserValues).isNull();
  assert("Edge click").that(puzzle.edges[1][2][2].clickSwitch).isNull();
  assert("Edge drag").that(puzzle.edges[1][2][2].dragSwitch).isNull();
  assert("Connector click").that(puzzle.connectors[1][2]['v'].clickSwitch).isNull();
  assert("Connector drag").that(puzzle.connectors[1][2]['v'].dragSwitch).isNull();
}),

// Mouse processing tests
test('Draw line by drag between cells',(suite) => {
  let puzzle = suite.showPuzzle("ring_ring_square_rectangle", "5x4", {"a1": "black_circle", "d1": "black", "e1": "black", "d3": "black", "a4": "black", "e4": "white_circle"});
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
  let puzzle = suite.showPuzzle("ring_ring_square_rectangle", "5x4", {"a1": "black_circle", "d1": "black", "e1": "black", "d3": "black", "a4": "black", "e4": "white_circle"});
  puzzle.start();

  suite.drawLine(puzzle, "a2", "b2");

  assert("Connector value after drag").that(puzzle.connectors[1][0]['h'].getValue()).isEqualTo("1");

  // The same connector in the opposite direction.
  suite.drawLine(puzzle, "b2", "a2");

  assert("Connector value after second drag").that(puzzle.connectors[1][0]['h'].getValue()).isNull();
  assert("Connector data after second drag").that(puzzle.connectors[1][0]['h'].data).isEqualTo({});
}),

test('Draw line through several cells',(suite) => {
  let puzzle = suite.showPuzzle("ring_ring_square_rectangle", "5x4", {"a1": "black_circle", "d1": "black", "e1": "black", "d3": "black", "a4": "black", "e4": "white_circle"});
  puzzle.start();

  // One mouse move from a2 to c2 passes over b2.
  suite.drag(puzzle, suite.cellPoint(puzzle, "a2"), suite.cellPoint(puzzle, "c2"));

  assert("Line after one long move").that(puzzle.collectData()).isEqualTo({"connectors": {"a2-h": "1", "b2-h": "1"}});

  // Drag with turns: c2 - c3 - a3 - a2 closes the rectangle.
  suite.drawLine(puzzle, "c2", "c3", "a3", "a2");

  assert("Rectangle").that(puzzle.collectData()).isEqualTo({"connectors": {"a2-h": "1", "b2-h": "1", "c2-v": "1", "a3-h": "1", "b3-h": "1", "a2-v": "1"}});
}),

test('Click and diagonal drag do not draw lines',(suite) => {
  let puzzle = suite.showPuzzle("ring_ring_square_rectangle", "5x4", {"a1": "black_circle", "d1": "black", "e1": "black", "d3": "black", "a4": "black", "e4": "white_circle"});
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
  let puzzle = suite.showPuzzle("ring_ring_square_rectangle", "5x4", {"a1": "black_circle", "d1": "black", "e1": "black", "d3": "black", "a4": "black", "e4": "white_circle"});
  puzzle.start();

  suite.drawLine(puzzle, "c1", "d1");
  suite.drawLine(puzzle, "d2", "d1");
  suite.drawLine(puzzle, "d1", "e1");

  assert("Connector between c1 and d1").that(puzzle.connectors[0][2]['h'].getValue()).isNull();
  assert("Connector between d1 and d2").that(puzzle.connectors[0][3]['v'].getValue()).isNull();
  assert("Connector between d1 and e1").that(puzzle.connectors[0][3]['h'].getValue()).isNull();
  assert("Submission data").that(puzzle.collectData()).isEqualTo({});

  // One mouse move from a1 to the black cell e1: the line is drawn only to c1.
  suite.drag(puzzle, suite.cellPoint(puzzle, "a1"), suite.cellPoint(puzzle, "e1"));

  assert("Line stops at the black cell").that(puzzle.collectData()).isEqualTo({"connectors": {"a1-h": "1", "b1-h": "1"}});
}),
test('Process clicks to edge',(suite) => {
  let puzzle = suite.showPuzzle("ring_ring_square_rectangle", "5x4", {"a1": "black_circle", "d1": "black", "e1": "black", "d3": "black", "a4": "black", "e4": "white_circle"});
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

test('Line passes through circles',(suite) => {
  let puzzle = suite.showPuzzle("ring_ring_square_rectangle", "5x4", {"a1": "black_circle", "d1": "black", "e1": "black", "d3": "black", "a4": "black", "e4": "white_circle"});
  puzzle.start();

  // Corner in the black circle a1 and corner in the white circle e4.
  suite.drawLine(puzzle, "a2", "a1", "b1");
  suite.drawLine(puzzle, "e3", "e4", "d4");

  assert("Lines through circles").that(puzzle.collectData()).isEqualTo({"connectors": {"a1-v": "1", "a1-h": "1", "e3-v": "1", "d4-h": "1"}});
}),

test('Clue cells are not changed by click',(suite) => {
  let puzzle = suite.showPuzzle("ring_ring_square_rectangle", "5x4", {"a1": "black_circle", "d1": "black", "e1": "black", "d3": "black", "a4": "black", "e4": "white_circle"});
  puzzle.start();

  ["a1", "d1", "e4", "c3"].forEach(cell => suite.cellClick(puzzle, cell));

  assert("Black circle data").that(puzzle.cells[0][0].data).isEqualTo({image: 'black_circle'});
  assert("Black cell data").that(puzzle.cells[0][3].data).isEqualTo({color: puzzle.colorSchema.gridColor});
  assert("White circle data").that(puzzle.cells[3][4].data).isEqualTo({image: 'white_circle'});
  assert("Empty cell data").that(puzzle.cells[2][2].data).isEqualTo({});
  assert("Submission data").that(puzzle.collectData()).isEqualTo({});
}),

// Data collector tests
test('Data collector',(suite) => {
  let puzzle = suite.showPuzzle("ring_ring_square_rectangle", "5x4", {"a1": "black_circle", "d1": "black", "e1": "black", "d3": "black", "a4": "black", "e4": "white_circle"});
  puzzle.start();

  // Square a1-c1-c3-a3 with the black circle and rectangle b2-e2-e4-b4 with the white circle:
  //   1 1 1 # #
  //   1 2 + 2 2
  //   1 + 1 # 2
  //   # 2 2 2 2
  suite.drawLine(puzzle, "a1", "c1", "c3", "a3", "a1");
  suite.drawLine(puzzle, "b2", "e2", "e4", "b4", "b2");
  // Cross at the edge is not submitted.
  suite.click(puzzle, suite.gridPoint(puzzle, 3.5, 3));

  assert("Submission data").that(puzzle.collectData()).isEqualTo({"connectors": {
    "a1-h": "1", "b1-h": "1", "a1-v": "1", "c1-v": "1", "a2-v": "1", "c2-v": "1", "a3-h": "1", "b3-h": "1",
    "b2-h": "1", "c2-h": "1", "d2-h": "1", "b2-v": "1", "e2-v": "1", "b3-v": "1", "e3-v": "1", "b4-h": "1", "c4-h": "1", "d4-h": "1"}});
}),

test('Process clicks to cell for author',(suite) => {
  let puzzle = suite.showPuzzle("ring_ring_square_rectangle", "5x4");
  puzzle.edit();

  let cell = puzzle.cells[0][0];

  suite.cellClick(puzzle, "a1");

  assert("Cell value after one click").that(cell.getValue()).isEqualTo("black");
  assert("Cell data after one click").that(cell.data).isEqualTo({color: puzzle.colorSchema.gridColor, returnValue: 'black'});

  suite.cellClick(puzzle, "a1");

  assert("Cell value after two clicks").that(cell.getValue()).isEqualTo("white_circle");
  assert("Cell data after two clicks").that(cell.data).isEqualTo({image: 'white_circle', returnValue: 'white_circle'});

  suite.cellClick(puzzle, "a1");

  assert("Cell value after three clicks").that(cell.getValue()).isEqualTo("black_circle");
  assert("Cell data after three clicks").that(cell.data).isEqualTo({image: 'black_circle', returnValue: 'black_circle'});

  suite.cellClick(puzzle, "a1");

  assert("Cell value after four clicks").that(cell.getValue()).isNull();
  assert("Cell data after four clicks").that(cell.data).isEqualTo({});
}),

test('Author data collector',(suite) => {
  let puzzle = suite.showPuzzle("ring_ring_square_rectangle", "5x4");
  puzzle.edit();

  // Emulates the given number of clicks at the cell.
  let clickCell = function(cell, times) {
    for (let i = 0; i < times; i++) {
      suite.cellClick(puzzle, cell);
    }
  };

  clickCell("a1", 3); // black circle
  clickCell("d1", 1); // black cells
  clickCell("e1", 1);
  clickCell("d3", 1);
  clickCell("a4", 1);
  clickCell("e4", 2); // white circle
  clickCell("b2", 4); // set and cleared

  assert("Puzzle data").that(puzzle.collectData()).isEqualTo({"a1": "black_circle", "d1": "black", "e1": "black", "d3": "black", "a4": "black", "e4": "white_circle"});
}),

test('Author can not draw lines',(suite) => {
  let puzzle = suite.showPuzzle("ring_ring_square_rectangle", "5x4");
  puzzle.edit();

  suite.drawLine(puzzle, "a2", "b2", "b3");
  // The edge between c2 and c3.
  suite.click(puzzle, suite.gridPoint(puzzle, 2.5, 2));

  assert("Connector value").that(puzzle.connectors[1][0]['h'].getValue()).isNull();
  assert("Edge data").that(puzzle.edges[1][2][2].data).isEqualTo({});
  assert("Puzzle data").that(puzzle.collectData()).isEqualTo({});
}),

);
