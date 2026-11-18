russianLoopTestSuite = uiTestSuite("Russian Loop", "squarepuzzle", "squarePuzzleType",

beforeSuite((suite, cb)=> {
  // Emulates one mouse drag which passes through the centers of the given cells.
  suite.drawLine = function(puzzle, ...cells) {
    puzzle.controller.onMouseDown(suite.mouseEvent(suite.cellPoint(puzzle, cells[0])));
    cells.slice(1).forEach(cell => puzzle.controller.onMouseMove(suite.mouseEvent(suite.cellPoint(puzzle, cell))));
    puzzle.controller.onMouseUp(suite.mouseEvent(suite.cellPoint(puzzle, cells[cells.length - 1])));
  };
  suite.CLUES = {"edges": {"b1-1": "dot", "b2-1": "dot", "a3-1": "dot", "b3-1": "dot", "c3-1": "dot", "a4-1": "dot", "b4-1": "dot", "c4-1": "dot"}};
  cb();
}),

// Puzzle 4x4 used in the tests (dots are on the vertical edges between cells) and its solution:
//   .   . o .   .     +-----+
//   .   . o .   .     | +-+ |
//   . o . o . o .     | | | |
//   . o . o . o .     +-+ +-+

// Controller definition tests
test('Solver controllers',(suite) => {
  let puzzle = suite.showPuzzle("russian_loop", "4x4", suite.CLUES);
  puzzle.start();

  assert("Cell chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("Cell click").that(puzzle.cells[0][0].clickSwitch).isNull();
  assert("Cell drag processor").that(puzzle.cells[0][0].dragProcessor).isNotNull();
  assert("Connector click").that(puzzle.connectors[0][0]['h'].clickSwitch).isNull();
  assert("Connector drag").that(puzzle.connectors[0][0]['h'].dragSwitch).containsExactly([{}, {color: puzzle.colorSchema.lineColor, returnValue: 1}]);
  assert("Vertical connector drag").that(puzzle.connectors[0][0]['v'].dragSwitch).containsExactly([{}, {color: puzzle.colorSchema.lineColor, returnValue: 1}]);
  assert("Clue edge data").that(puzzle.edges[0][1][1].data).isEqualTo({image: 'small_circle'});
  assert("Clue edge chooser").that(puzzle.edges[0][1][1].chooserValues).isNull();
  assert("Clue edge click").that(puzzle.edges[0][1][1].clickSwitch).isNull();
  assert("Empty edge chooser").that(puzzle.edges[0][0][1].chooserValues).isNull();
  assert("Empty edge click").that(puzzle.edges[0][0][1].clickSwitch).containsExactly([{}, {image: 'cross'}]);
  assert("Empty edge drag").that(puzzle.edges[0][0][1].dragSwitch).isNull();
}),

test('Author controllers',(suite) => {
  let puzzle = suite.showPuzzle("russian_loop", "4x4");
  puzzle.edit();

  assert("Cell chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("Cell click").that(puzzle.cells[0][0].clickSwitch).isNull();
  assert("Cell drag processor").that(puzzle.cells[0][0].dragProcessor).isNull();
  // Dots can be placed only on the vertical edges between two cells.
  assert("Vertical edge chooser").that(puzzle.edges[0][0][1].chooserValues).isNull();
  assert("Vertical edge click").that(puzzle.edges[0][0][1].clickSwitch).containsExactly([{}, {image: 'small_circle', returnValue: 'dot'}]);
  assert("Horizontal edge click").that(puzzle.edges[0][0][2].clickSwitch).isNull();
  assert("Grid border click").that(puzzle.edges[0][3][1].clickSwitch).isNull();
  assert("Connector click").that(puzzle.connectors[0][0]['h'].clickSwitch).isNull();
  assert("Connector drag").that(puzzle.connectors[0][0]['h'].dragSwitch).isNull();
}),

// Mouse processing tests
test('Draw and erase line by drag between cells',(suite) => {
  let puzzle = suite.showPuzzle("russian_loop", "4x4", suite.CLUES);
  puzzle.start();

  assert("Connector value before drag").that(puzzle.connectors[0][0]['h'].getValue()).isNull();
  assert("Connector data before drag").that(puzzle.connectors[0][0]['h'].data).isEqualTo({});

  suite.drag(puzzle, suite.cellPoint(puzzle, "a1"), suite.cellPoint(puzzle, "b1"));

  assert("Connector value after drag").that(puzzle.connectors[0][0]['h'].getValue()).isEqualTo(1);
  assert("Connector data after drag").that(puzzle.connectors[0][0]['h'].data).isEqualTo({color: puzzle.colorSchema.lineColor, returnValue: 1});

  suite.drag(puzzle, suite.cellPoint(puzzle, "a1"), suite.cellPoint(puzzle, "a2"));

  assert("Vertical connector value after drag").that(puzzle.connectors[0][0]['v'].getValue()).isEqualTo(1);

  // Second drag over the line erases it.
  suite.drag(puzzle, suite.cellPoint(puzzle, "b1"), suite.cellPoint(puzzle, "a1"));

  assert("Connector value after second drag").that(puzzle.connectors[0][0]['h'].getValue()).isNull();
  assert("Connector data after second drag").that(puzzle.connectors[0][0]['h'].data).isEqualTo({});
  assert("Vertical connector value after second drag").that(puzzle.connectors[0][0]['v'].getValue()).isEqualTo(1);
}),

test('Draw line through the dot on the edge',(suite) => {
  let puzzle = suite.showPuzzle("russian_loop", "4x4", suite.CLUES);
  puzzle.start();

  // The edge between b1 and c1 contains a dot.
  suite.drag(puzzle, suite.cellPoint(puzzle, "b1"), suite.cellPoint(puzzle, "c1"));

  assert("Connector value after drag").that(puzzle.connectors[0][1]['h'].getValue()).isEqualTo(1);
  assert("Clue edge data after drag").that(puzzle.edges[0][1][1].data).isEqualTo({image: 'small_circle'});
}),

test('Draw line through several cells by one drag',(suite) => {
  let puzzle = suite.showPuzzle("russian_loop", "4x4", suite.CLUES);
  puzzle.start();

  // Single mouse move along the whole first row.
  suite.drag(puzzle, suite.cellPoint(puzzle, "a1"), suite.cellPoint(puzzle, "d1"));

  assert("Line after straight drag").that(puzzle.collectData()).isEqualTo({"connectors": {"a1-h": 1, "b1-h": 1, "c1-h": 1}});

  // Drag with turns: a2 - a3 - b3 - b4.
  suite.drawLine(puzzle, "a2", "a3", "b3", "b4");

  assert("Line after drag with turns").that(puzzle.collectData()).isEqualTo(
    {"connectors": {"a1-h": 1, "b1-h": 1, "c1-h": 1, "a2-v": 1, "a3-h": 1, "b3-v": 1}});
}),

test('Cells are not changed by click',(suite) => {
  let puzzle = suite.showPuzzle("russian_loop", "4x4", suite.CLUES);
  puzzle.start();

  suite.cellClick(puzzle, "a1");

  assert("Cell data after click").that(puzzle.cells[0][0].data).isEqualTo({});
  assert("Submission data after click").that(puzzle.collectData()).isEqualTo({});
}),

test('Process clicks to edge',(suite) => {
  let puzzle = suite.showPuzzle("russian_loop", "4x4", suite.CLUES);
  puzzle.start();

  // Edge between a1 and b1.
  suite.edgeClick(puzzle, "a1-1");

  assert("Edge data after click").that(puzzle.edges[0][0][1].data).isEqualTo({image: 'cross'});
  assert("Edge value after click").that(puzzle.edges[0][0][1].getValue()).isNull();
  // The cross is solver's mark only.
  assert("Submission data with the cross").that(puzzle.collectData()).isEqualTo({});

  suite.edgeClick(puzzle, "a1-1");

  assert("Edge data after second click").that(puzzle.edges[0][0][1].data).isEqualTo({});
}),

test('Clue edges are not changed by click',(suite) => {
  let puzzle = suite.showPuzzle("russian_loop", "4x4", suite.CLUES);
  puzzle.start();

  // Edge with the dot between b1 and c1.
  suite.edgeClick(puzzle, "b1-1");

  assert("Clue edge data after click").that(puzzle.edges[0][1][1].data).isEqualTo({image: 'small_circle'});
}),

// Data collector tests
test('Data collector',(suite) => {
  let puzzle = suite.showPuzzle("russian_loop", "4x4", suite.CLUES);
  puzzle.start();

  // The whole loop by one drag, only the turning points are listed.
  suite.drawLine(puzzle, "a1", "d1", "d4", "c4", "c2", "b2", "b4", "a4", "a1");
  // Mark which is not submitted.
  suite.edgeClick(puzzle, "a2-1");

  // The connectors are collected as numbers, the checker accepts both 1 and "1".
  assert("Submission data").that(puzzle.collectData()).isEqualTo({"connectors": {
    "a1-h": 1, "b1-h": 1, "c1-h": 1, "a1-v": 1, "d1-v": 1,
    "a2-v": 1, "b2-h": 1, "b2-v": 1, "c2-v": 1, "d2-v": 1,
    "a3-v": 1, "b3-v": 1, "c3-v": 1, "d3-v": 1,
    "a4-h": 1, "c4-h": 1}});
}),

test('Author clicks to edge',(suite) => {
  let puzzle = suite.showPuzzle("russian_loop", "4x4");
  puzzle.edit();

  assert("Edge data before click").that(puzzle.edges[0][1][1].data).isEqualTo({});

  // Edge between b1 and c1.
  suite.edgeClick(puzzle, "b1-1");

  assert("Edge value after click").that(puzzle.edges[0][1][1].getValue()).isEqualTo("dot");
  assert("Edge data after click").that(puzzle.edges[0][1][1].data).isEqualTo({image: 'small_circle', returnValue: 'dot'});

  // The same edge is the left side of the cell c1.
  suite.edgeClick(puzzle, "c1-3");

  assert("Edge value after second click").that(puzzle.edges[0][1][1].getValue()).isNull();
  assert("Edge data after second click").that(puzzle.edges[0][1][1].data).isEqualTo({});
}),

test('Author can not change cells and horizontal edges',(suite) => {
  let puzzle = suite.showPuzzle("russian_loop", "4x4");
  puzzle.edit();

  suite.cellClick(puzzle, "a1");
  // Edge between a1 and a2.
  suite.edgeClick(puzzle, "a1-2");
  suite.drag(puzzle, suite.cellPoint(puzzle, "c1"), suite.cellPoint(puzzle, "d1"));

  assert("Cell data after click").that(puzzle.cells[0][0].data).isEqualTo({});
  assert("Horizontal edge data after click").that(puzzle.edges[0][0][2].data).isEqualTo({});
  assert("Connector value after drag").that(puzzle.connectors[0][2]['h'].getValue()).isNull();
  assert("Puzzle data").that(puzzle.collectData()).isEqualTo({});
}),

test('Author data collector',(suite) => {
  let puzzle = suite.showPuzzle("russian_loop", "4x4");
  puzzle.edit();

  ["b1-1", "b2-1", "a3-1", "b3-1", "c3-1", "a4-1", "b4-1", "c4-1"].forEach(edge => suite.edgeClick(puzzle, edge));

  assert("Puzzle data").that(puzzle.collectData()).isEqualTo(
    {"edges": {"b1-1": "dot", "b2-1": "dot", "a3-1": "dot", "b3-1": "dot", "c3-1": "dot", "a4-1": "dot", "b4-1": "dot", "c4-1": "dot"}});
}),

);
