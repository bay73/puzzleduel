ringRingMaxTestSuite = uiTestSuite("Ring-Ring Max", "squarepuzzle", "squarePuzzleType",

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

// Grid of the most of the tests: black cells (#) and clues below and to the right of the grid.
//   # # . . . 2
//   . . . . . 3
//   . . . . . 3
//   # # . . . 2
//   1 0 3 1 3

// Controller definition tests
test('Solver controllers',(suite) => {
  let puzzle = suite.showPuzzle("ring_ring_max", "5x4", {"a1": "black", "b1": "black", "a4": "black", "b4": "black", "bottom": ["1", "0", "3", "1", "3"], "right": ["2", "3", "3", "2"]});
  puzzle.start();

  assert("Empty cell chooser").that(puzzle.cells[2][2].chooserValues).isNull();
  assert("Empty cell click").that(puzzle.cells[2][2].clickSwitch).isNull();
  assert("Empty cell drag processor").that(puzzle.cells[2][2].dragProcessor).isNotNull();
  assert("Black cell data").that(puzzle.cells[0][0].data).isEqualTo({color: puzzle.colorSchema.gridColor});
  assert("Black cell chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("Black cell click").that(puzzle.cells[0][0].clickSwitch).isNull();
  assert("Black cell drag processor").that(puzzle.cells[0][0].dragProcessor).isNotNull();
  assert("Bottom clue data").that(puzzle.bottom[0].data).isEqualTo({text: '1'});
  assert("Bottom clue chooser").that(puzzle.bottom[0].chooserValues).isNull();
  assert("Bottom clue click").that(puzzle.bottom[0].clickSwitch).containsExactly([{text: '1'}, {text: '1', image: 'white_circle'}]);
  assert("Right clue data").that(puzzle.right[0].data).isEqualTo({text: '2'});
  assert("Right clue chooser").that(puzzle.right[0].chooserValues).isNull();
  assert("Right clue click").that(puzzle.right[0].clickSwitch).containsExactly([{text: '2'}, {text: '2', image: 'white_circle'}]);
  assert("Edge chooser").that(puzzle.edges[1][2][2].chooserValues).isNull();
  assert("Edge click").that(puzzle.edges[1][2][2].clickSwitch).containsExactly([{}, {image: 'cross'}]);
  assert("Edge drag").that(puzzle.edges[1][2][2].dragSwitch).isNull();
  assert("Connector chooser").that(puzzle.connectors[1][2]['v'].chooserValues).isNull();
  assert("Connector click").that(puzzle.connectors[1][2]['v'].clickSwitch).isNull();
  assert("Connector drag").that(puzzle.connectors[1][2]['v'].dragSwitch).containsExactly([{}, {color: puzzle.colorSchema.lineColor, returnValue: '1'}]);
}),

test('Author controllers',(suite) => {
  let puzzle = suite.showPuzzle("ring_ring_max", "5x4");
  puzzle.edit();

  let numbers = [{}, {text: '0', returnValue: '0'}, {text: '1', returnValue: '1'}, {text: '2', returnValue: '2'}, {text: '3', returnValue: '3'}, {text: '4', returnValue: '4'}];
  assert("Cell chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("Cell click").that(puzzle.cells[0][0].clickSwitch).containsExactly([{}, {color: puzzle.colorSchema.gridColor, returnValue: 'black'}]);
  // The longest possible side in the grid 5x4 passes through 5 cells, so its length is 4.
  assert("Bottom clue chooser").that(puzzle.bottom[0].chooserValues).containsExactly(numbers);
  assert("Right clue chooser").that(puzzle.right[0].chooserValues).containsExactly(numbers);
  assert("Cell drag processor").that(puzzle.cells[0][0].dragProcessor).isNull();
  assert("Edge chooser").that(puzzle.edges[1][2][2].chooserValues).isNull();
  assert("Edge click").that(puzzle.edges[1][2][2].clickSwitch).isNull();
  assert("Edge drag").that(puzzle.edges[1][2][2].dragSwitch).isNull();
  assert("Connector click").that(puzzle.connectors[1][2]['v'].clickSwitch).isNull();
  assert("Connector drag").that(puzzle.connectors[1][2]['v'].dragSwitch).isNull();
}),

// Mouse processing tests
test('Draw line by drag between cells',(suite) => {
  let puzzle = suite.showPuzzle("ring_ring_max", "5x4", {"a1": "black", "b1": "black", "a4": "black", "b4": "black", "bottom": ["1", "0", "3", "1", "3"], "right": ["2", "3", "3", "2"]});
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
  let puzzle = suite.showPuzzle("ring_ring_max", "5x4", {"a1": "black", "b1": "black", "a4": "black", "b4": "black", "bottom": ["1", "0", "3", "1", "3"], "right": ["2", "3", "3", "2"]});
  puzzle.start();

  suite.drawLine(puzzle, "a2", "b2");

  assert("Connector value after drag").that(puzzle.connectors[1][0]['h'].getValue()).isEqualTo("1");

  // The same connector in the opposite direction.
  suite.drawLine(puzzle, "b2", "a2");

  assert("Connector value after second drag").that(puzzle.connectors[1][0]['h'].getValue()).isNull();
  assert("Connector data after second drag").that(puzzle.connectors[1][0]['h'].data).isEqualTo({});
}),

test('Draw line through several cells',(suite) => {
  let puzzle = suite.showPuzzle("ring_ring_max", "5x4", {"a1": "black", "b1": "black", "a4": "black", "b4": "black", "bottom": ["1", "0", "3", "1", "3"], "right": ["2", "3", "3", "2"]});
  puzzle.start();

  // One mouse move from a2 to c2 passes over b2.
  suite.drag(puzzle, suite.cellPoint(puzzle, "a2"), suite.cellPoint(puzzle, "c2"));

  assert("Line after one long move").that(puzzle.collectData()).isEqualTo({"connectors": {"a2-h": "1", "b2-h": "1"}});

  // Drag with turns: c2 - c3 - a3 - a2 closes the rectangle.
  suite.drawLine(puzzle, "c2", "c3", "a3", "a2");

  assert("Rectangle").that(puzzle.collectData()).isEqualTo({"connectors": {"a2-h": "1", "b2-h": "1", "c2-v": "1", "a3-h": "1", "b3-h": "1", "a2-v": "1"}});
}),

test('Click and diagonal drag do not draw lines',(suite) => {
  let puzzle = suite.showPuzzle("ring_ring_max", "5x4", {"a1": "black", "b1": "black", "a4": "black", "b4": "black", "bottom": ["1", "0", "3", "1", "3"], "right": ["2", "3", "3", "2"]});
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
  let puzzle = suite.showPuzzle("ring_ring_max", "5x4", {"a1": "black", "b1": "black", "a4": "black", "b4": "black", "bottom": ["1", "0", "3", "1", "3"], "right": ["2", "3", "3", "2"]});
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
  let puzzle = suite.showPuzzle("ring_ring_max", "5x4", {"a1": "black", "b1": "black", "a4": "black", "b4": "black", "bottom": ["1", "0", "3", "1", "3"], "right": ["2", "3", "3", "2"]});
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
  let puzzle = suite.showPuzzle("ring_ring_max", "5x4", {"a1": "black", "b1": "black", "a4": "black", "b4": "black", "bottom": ["1", "0", "3", "1", "3"], "right": ["2", "3", "3", "2"]});
  puzzle.start();

  suite.cellClick(puzzle, "a1");
  suite.cellClick(puzzle, "c3");

  assert("Black cell data").that(puzzle.cells[0][0].data).isEqualTo({color: puzzle.colorSchema.gridColor});
  assert("Empty cell data").that(puzzle.cells[2][2].data).isEqualTo({});
  assert("Submission data").that(puzzle.collectData()).isEqualTo({});
}),

test('Process clicks to outer clues',(suite) => {
  let puzzle = suite.showPuzzle("ring_ring_max", "5x4", {"a1": "black", "b1": "black", "a4": "black", "b4": "black", "bottom": ["1", "0", "3", "1", "3"], "right": ["2", "3", "3", "2"]});
  puzzle.start();

  // The clue below the column a.
  let bottomPoint = suite.cellPoint(puzzle, 0, 4);

  suite.click(puzzle, bottomPoint);

  assert("Bottom clue value after click").that(puzzle.bottom[0].getValue()).isNull();
  assert("Bottom clue data after click").that(puzzle.bottom[0].data).isEqualTo({text: '1', image: 'white_circle'});
  assert("Other bottom clue data").that(puzzle.bottom[1].data).isEqualTo({text: '0'});

  suite.click(puzzle, bottomPoint);

  assert("Bottom clue data after second click").that(puzzle.bottom[0].data).isEqualTo({text: '1'});

  // The clue to the right of the row 2.
  let rightPoint = suite.cellPoint(puzzle, 5, 1);

  suite.click(puzzle, rightPoint);

  assert("Right clue value after click").that(puzzle.right[1].getValue()).isNull();
  assert("Right clue data after click").that(puzzle.right[1].data).isEqualTo({text: '3', image: 'white_circle'});
  assert("Clue marks are not submitted").that(puzzle.collectData()).isEqualTo({});

  suite.click(puzzle, rightPoint);

  assert("Right clue data after second click").that(puzzle.right[1].data).isEqualTo({text: '3'});
}),

// Clue cells outside of the grid are not a part of the lines.
test('Drag over outer clue cells draws nothing',(suite) => {
  let puzzle = suite.showPuzzle("ring_ring_max", "5x4", {"a1": "black", "b1": "black", "a4": "black", "b4": "black", "bottom": ["1", "0", "3", "1", "3"], "right": ["2", "3", "3", "2"]});
  puzzle.start();

  // From the grid cell e4 to the clue cell to the right of it and to the clue cell below it.
  suite.drag(puzzle, suite.cellPoint(puzzle, "e4"), suite.cellPoint(puzzle, 5, 3));
  suite.drag(puzzle, suite.cellPoint(puzzle, "e4"), suite.cellPoint(puzzle, 4, 4));
  // From the clue cells back to the grid.
  suite.drag(puzzle, suite.cellPoint(puzzle, 5, 3), suite.cellPoint(puzzle, "e4"));
  suite.drag(puzzle, suite.cellPoint(puzzle, 4, 4), suite.cellPoint(puzzle, "e4"));
  // Between two clue cells below the grid and between two clue cells to the right of the grid.
  suite.drag(puzzle, suite.cellPoint(puzzle, 0, 4), suite.cellPoint(puzzle, 1, 4));
  suite.drag(puzzle, suite.cellPoint(puzzle, 5, 0), suite.cellPoint(puzzle, 5, 1));

  assert("Submission data").that(puzzle.collectData()).isEqualTo({});
}),

test('Line is kept when the drag leaves the grid',(suite) => {
  let puzzle = suite.showPuzzle("ring_ring_max", "5x4", {"a1": "black", "b1": "black", "a4": "black", "b4": "black", "bottom": ["1", "0", "3", "1", "3"], "right": ["2", "3", "3", "2"]});
  puzzle.start();

  // One drag from c4 to d4 and then down to the clue cell below the grid.
  puzzle.controller.onMouseDown(suite.mouseEvent(suite.cellPoint(puzzle, "c4")));
  puzzle.controller.onMouseMove(suite.mouseEvent(suite.cellPoint(puzzle, "d4")));
  let dataInGrid = puzzle.collectData();
  let outerPoint = suite.cellPoint(puzzle, 3, 4);
  puzzle.controller.onMouseMove(suite.mouseEvent(outerPoint));
  puzzle.controller.onMouseUp(suite.mouseEvent(outerPoint));

  assert("Connector between c4 and d4").that(puzzle.connectors[3][2]['h'].getValue()).isNotNull();
  assert("Submission data after leaving the grid").that(puzzle.collectData()).isEqualTo(dataInGrid);
}),

// Data collector tests
test('Data collector',(suite) => {
  let puzzle = suite.showPuzzle("ring_ring_max", "5x4", {"a1": "black", "b1": "black", "a4": "black", "b4": "black", "bottom": ["1", "0", "3", "1", "3"], "right": ["2", "3", "3", "2"]});
  puzzle.start();

  // Two rectangles c1-e1-e4-c4 and a2-d2-d3-a3:
  //   # # 1 1 1
  //   2 2 + 2 1
  //   2 2 + 2 1
  //   # # 1 1 1
  suite.drawLine(puzzle, "c1", "e1", "e4", "c4", "c1");
  suite.drawLine(puzzle, "a2", "d2", "d3", "a3", "a2");
  // Marks which are not submitted.
  suite.click(puzzle, suite.cellPoint(puzzle, 0, 4));
  suite.click(puzzle, suite.cellPoint(puzzle, 5, 0));
  suite.click(puzzle, suite.gridPoint(puzzle, 1.5, 2));

  assert("Submission data").that(puzzle.collectData()).isEqualTo({"connectors": {
    "c1-h": "1", "d1-h": "1", "c4-h": "1", "d4-h": "1", "a2-h": "1", "b2-h": "1", "c2-h": "1", "a3-h": "1", "b3-h": "1", "c3-h": "1",
    "c1-v": "1", "e1-v": "1", "c2-v": "1", "e2-v": "1", "c3-v": "1", "e3-v": "1", "a2-v": "1", "d2-v": "1"}});
}),

test('Process clicks to cell for author',(suite) => {
  let puzzle = suite.showPuzzle("ring_ring_max", "5x4");
  puzzle.edit();

  let cell = puzzle.cells[0][0];

  suite.cellClick(puzzle, "a1");

  assert("Cell value after one click").that(cell.getValue()).isEqualTo("black");
  assert("Cell data after one click").that(cell.data).isEqualTo({color: puzzle.colorSchema.gridColor, returnValue: 'black'});

  suite.cellClick(puzzle, "a1");

  assert("Cell value after two clicks").that(cell.getValue()).isNull();
  assert("Cell data after two clicks").that(cell.data).isEqualTo({});
}),

test('Outer clues chooser for author',(suite) => {
  let puzzle = suite.showPuzzle("ring_ring_max", "5x4");
  puzzle.edit();

  puzzle.bottom[2].switchOnChooser(4);

  assert("Bottom clue value").that(puzzle.bottom[2].getValue()).isEqualTo("3");
  assert("Bottom clue data").that(puzzle.bottom[2].data).isEqualTo({text: '3', returnValue: '3'});

  puzzle.right[1].switchOnChooser(1);

  assert("Right clue value").that(puzzle.right[1].getValue()).isEqualTo("0");
  assert("Right clue data").that(puzzle.right[1].data).isEqualTo({text: '0', returnValue: '0'});

  puzzle.bottom[2].switchOnChooser(0);

  assert("Bottom clue value after reset").that(puzzle.bottom[2].getValue()).isNull();
  assert("Bottom clue data after reset").that(puzzle.bottom[2].data).isEqualTo({});
}),

test('Author data collector',(suite) => {
  let puzzle = suite.showPuzzle("ring_ring_max", "5x4");
  puzzle.edit();

  ["a1", "b1", "a4", "b4"].forEach(cell => suite.cellClick(puzzle, cell));
  // Clues 1, 0, 3, 1, 3 below the grid.
  [2, 1, 4, 2, 4].forEach((index, col) => puzzle.bottom[col].switchOnChooser(index));
  // Clues 2, 3, 3, 2 to the right of the grid.
  [3, 4, 4, 3].forEach((index, row) => puzzle.right[row].switchOnChooser(index));

  assert("Puzzle data").that(puzzle.collectData()).isEqualTo({"a1": "black", "b1": "black", "a4": "black", "b4": "black", "bottom": ["1", "0", "3", "1", "3"], "right": ["2", "3", "3", "2"]});

  // Remove some of the clues.
  suite.cellClick(puzzle, "b1");
  puzzle.bottom[1].switchOnChooser(0);
  puzzle.right[3].switchOnChooser(0);

  assert("Puzzle data without some clues").that(puzzle.collectData()).isEqualTo(
    {"a1": "black", "a4": "black", "b4": "black", "bottom": ["1", null, "3", "1", "3"], "right": ["2", "3", "3", null]});
}),

test('Author can not draw lines',(suite) => {
  let puzzle = suite.showPuzzle("ring_ring_max", "5x4");
  puzzle.edit();

  suite.drawLine(puzzle, "a2", "b2", "b3");
  // The edge between c2 and c3.
  suite.click(puzzle, suite.gridPoint(puzzle, 2.5, 2));

  assert("Connector value").that(puzzle.connectors[1][0]['h'].getValue()).isNull();
  assert("Edge data").that(puzzle.edges[1][2][2].data).isEqualTo({});
  assert("Puzzle data").that(puzzle.collectData()).isEqualTo({});
}),

);
