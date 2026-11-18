midLoopTestSuite = uiTestSuite("Mid-Loop", "squarepuzzle", "squarePuzzleType",

beforeSuite((suite, cb)=> {
  // Emulates one mouse drag which passes through the centers of the given cells.
  suite.drawLine = function(puzzle, ...cells) {
    puzzle.controller.onMouseDown(suite.mouseEvent(suite.cellPoint(puzzle, cells[0])));
    cells.slice(1).forEach(cell => puzzle.controller.onMouseMove(suite.mouseEvent(suite.cellPoint(puzzle, cell))));
    puzzle.controller.onMouseUp(suite.mouseEvent(suite.cellPoint(puzzle, cells[cells.length - 1])));
  };
  suite.CLUES = {"b2": "small_circle", "c2": "small_circle", "edges": {"b3-1": "black_circle", "a2-2": "black_circle", "d2-2": "black_circle"}};
  cb();
}),

// Puzzle 6x4 used in the tests and its solution. Small circles (o) are in the centers of the cells b2 and c2,
// black circles (*) are on the edges: between a2 and a3, between d2 and d3, between b3 and c3.
//   .   .   .   .   .   .      +-+ +-+ . .
//   .   o   o   .   .   .      | | | | . .
//   *           *
//   .   . * .   .   .   .      | +-+ | . .
//   .   .   .   .   .   .      +-----+ . .

// Controller definition tests
test('Solver controllers',(suite) => {
  let puzzle = suite.showPuzzle("mid_loop", "6x4", suite.CLUES);
  puzzle.start();

  assert("Clue cell data").that(puzzle.cells[1][1].data).isEqualTo({image: 'small_circle'});
  assert("Clue cell chooser").that(puzzle.cells[1][1].chooserValues).isNull();
  assert("Clue cell click").that(puzzle.cells[1][1].clickSwitch).isNull();
  assert("Clue cell drag processor").that(puzzle.cells[1][1].dragProcessor).isNotNull();
  assert("Empty cell chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("Empty cell click").that(puzzle.cells[0][0].clickSwitch).isNull();
  assert("Empty cell drag processor").that(puzzle.cells[0][0].dragProcessor).isNotNull();
  assert("Connector click").that(puzzle.connectors[0][0]['h'].clickSwitch).isNull();
  assert("Connector drag").that(puzzle.connectors[0][0]['h'].dragSwitch).containsExactly([{}, {color: puzzle.colorSchema.lineColor, returnValue: '1'}]);
  assert("Vertical connector drag").that(puzzle.connectors[0][0]['v'].dragSwitch).containsExactly([{}, {color: puzzle.colorSchema.lineColor, returnValue: '1'}]);
  assert("Clue edge data").that(puzzle.edges[2][1][1].data).isEqualTo({image: 'black_circle'});
  assert("Clue edge chooser").that(puzzle.edges[2][1][1].chooserValues).isNull();
  assert("Clue edge click").that(puzzle.edges[2][1][1].clickSwitch).isNull();
  assert("Clue edge drag").that(puzzle.edges[2][1][1].dragSwitch).isNull();
  assert("Empty edge chooser").that(puzzle.edges[0][0][1].chooserValues).isNull();
  assert("Empty edge click").that(puzzle.edges[0][0][1].clickSwitch).containsExactly([{}, {image: 'cross'}]);
  assert("Empty edge drag").that(puzzle.edges[0][0][1].dragSwitch).isNull();
}),

test('Author controllers',(suite) => {
  let puzzle = suite.showPuzzle("mid_loop", "6x4");
  puzzle.edit();

  assert("Cell chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("Cell click").that(puzzle.cells[0][0].clickSwitch).containsExactly([{}, {image: 'small_circle', returnValue: 'small_circle'}]);
  assert("Cell drag processor").that(puzzle.cells[0][0].dragProcessor).isNull();
  assert("Vertical edge chooser").that(puzzle.edges[0][0][1].chooserValues).isNull();
  assert("Vertical edge click").that(puzzle.edges[0][0][1].clickSwitch).containsExactly([{}, {image: 'black_circle', returnValue: 'black_circle'}]);
  assert("Vertical edge drag").that(puzzle.edges[0][0][1].dragSwitch).isNull();
  assert("Horizontal edge click").that(puzzle.edges[0][0][2].clickSwitch).containsExactly([{}, {image: 'black_circle', returnValue: 'black_circle'}]);
  assert("Connector click").that(puzzle.connectors[0][0]['h'].clickSwitch).isNull();
  assert("Connector drag").that(puzzle.connectors[0][0]['h'].dragSwitch).isNull();
}),

// Mouse processing tests
test('Draw and erase line by drag between cells',(suite) => {
  let puzzle = suite.showPuzzle("mid_loop", "6x4", suite.CLUES);
  puzzle.start();

  assert("Connector value before drag").that(puzzle.connectors[0][1]['v'].getValue()).isNull();
  assert("Connector data before drag").that(puzzle.connectors[0][1]['v'].data).isEqualTo({});

  // From b1 to the cell with dot b2.
  suite.drag(puzzle, suite.cellPoint(puzzle, "b1"), suite.cellPoint(puzzle, "b2"));

  assert("Connector value after drag").that(puzzle.connectors[0][1]['v'].getValue()).isEqualTo("1");
  assert("Connector data after drag").that(puzzle.connectors[0][1]['v'].data).isEqualTo({color: puzzle.colorSchema.lineColor, returnValue: '1'});
  assert("Clue cell data after drag").that(puzzle.cells[1][1].data).isEqualTo({image: 'small_circle'});

  suite.drag(puzzle, suite.cellPoint(puzzle, "a1"), suite.cellPoint(puzzle, "b1"));

  assert("Horizontal connector value after drag").that(puzzle.connectors[0][0]['h'].getValue()).isEqualTo("1");

  // Second drag over the line erases it.
  suite.drag(puzzle, suite.cellPoint(puzzle, "b2"), suite.cellPoint(puzzle, "b1"));

  assert("Connector value after second drag").that(puzzle.connectors[0][1]['v'].getValue()).isNull();
  assert("Connector data after second drag").that(puzzle.connectors[0][1]['v'].data).isEqualTo({});
  assert("Horizontal connector value after second drag").that(puzzle.connectors[0][0]['h'].getValue()).isEqualTo("1");
}),

test('Draw line through the dot on the edge',(suite) => {
  let puzzle = suite.showPuzzle("mid_loop", "6x4", suite.CLUES);
  puzzle.start();

  // The edge between b3 and c3 contains a dot.
  suite.drag(puzzle, suite.cellPoint(puzzle, "b3"), suite.cellPoint(puzzle, "c3"));

  assert("Connector value after drag").that(puzzle.connectors[2][1]['h'].getValue()).isEqualTo("1");
  assert("Clue edge data after drag").that(puzzle.edges[2][1][1].data).isEqualTo({image: 'black_circle'});
}),

test('Draw line through several cells by one drag',(suite) => {
  let puzzle = suite.showPuzzle("mid_loop", "6x4", suite.CLUES);
  puzzle.start();

  // Single mouse move along the whole fourth row.
  suite.drag(puzzle, suite.cellPoint(puzzle, "a4"), suite.cellPoint(puzzle, "f4"));

  assert("Line after straight drag").that(puzzle.collectData()).isEqualTo(
    {"connectors": {"a4-h": "1", "b4-h": "1", "c4-h": "1", "d4-h": "1", "e4-h": "1"}});

  // Drag with turns: a1 - b1 - b2 - c2.
  suite.drawLine(puzzle, "a1", "b1", "b2", "c2");

  assert("Line after drag with turns").that(puzzle.collectData()).isEqualTo(
    {"connectors": {"a4-h": "1", "b4-h": "1", "c4-h": "1", "d4-h": "1", "e4-h": "1", "a1-h": "1", "b1-v": "1", "b2-h": "1"}});
}),

test('Cells are not changed by click',(suite) => {
  let puzzle = suite.showPuzzle("mid_loop", "6x4", suite.CLUES);
  puzzle.start();

  suite.cellClick(puzzle, "b2");
  suite.cellClick(puzzle, "a1");

  assert("Clue cell data after click").that(puzzle.cells[1][1].data).isEqualTo({image: 'small_circle'});
  assert("Empty cell data after click").that(puzzle.cells[0][0].data).isEqualTo({});
}),

test('Process clicks to edge',(suite) => {
  let puzzle = suite.showPuzzle("mid_loop", "6x4", suite.CLUES);
  puzzle.start();

  // Edge between c3 and d3.
  suite.edgeClick(puzzle, "c3-1");

  assert("Edge data after click").that(puzzle.edges[2][2][1].data).isEqualTo({image: 'cross'});
  assert("Edge value after click").that(puzzle.edges[2][2][1].getValue()).isNull();
  // The cross is solver's mark only.
  assert("Submission data with the cross").that(puzzle.collectData()).isEqualTo({});

  suite.edgeClick(puzzle, "c3-1");

  assert("Edge data after second click").that(puzzle.edges[2][2][1].data).isEqualTo({});
}),

test('Clue edges are not changed by click',(suite) => {
  let puzzle = suite.showPuzzle("mid_loop", "6x4", suite.CLUES);
  puzzle.start();

  // Vertical edge between b3 and c3, horizontal edge between a2 and a3.
  suite.edgeClick(puzzle, "b3-1");
  suite.edgeClick(puzzle, "a2-2");

  assert("Vertical clue edge data after click").that(puzzle.edges[2][1][1].data).isEqualTo({image: 'black_circle'});
  assert("Horizontal clue edge data after click").that(puzzle.edges[1][0][2].data).isEqualTo({image: 'black_circle'});
}),

// Data collector tests
test('Data collector',(suite) => {
  let puzzle = suite.showPuzzle("mid_loop", "6x4", suite.CLUES);
  puzzle.start();

  // The whole loop by one drag, only the turning points are listed.
  suite.drawLine(puzzle, "a1", "b1", "b3", "c3", "c1", "d1", "d4", "a4", "a1");
  // Mark which is not submitted.
  suite.edgeClick(puzzle, "e1-1");

  assert("Submission data").that(puzzle.collectData()).isEqualTo({"connectors": {
    "a1-h": "1", "a1-v": "1", "b1-v": "1", "c1-h": "1", "c1-v": "1", "d1-v": "1", "a2-v": "1", "b2-v": "1",
    "c2-v": "1", "d2-v": "1", "a3-v": "1", "b3-h": "1", "d3-v": "1", "a4-h": "1", "b4-h": "1", "c4-h": "1"}});
}),

test('Author clicks to cell',(suite) => {
  let puzzle = suite.showPuzzle("mid_loop", "6x4");
  puzzle.edit();

  assert("Cell data before click").that(puzzle.cells[1][1].data).isEqualTo({});

  suite.cellClick(puzzle, "b2");

  assert("Cell value after click").that(puzzle.cells[1][1].getValue()).isEqualTo("small_circle");
  assert("Cell data after click").that(puzzle.cells[1][1].data).isEqualTo({image: 'small_circle', returnValue: 'small_circle'});

  suite.cellClick(puzzle, "b2");

  assert("Cell value after second click").that(puzzle.cells[1][1].getValue()).isNull();
  assert("Cell data after second click").that(puzzle.cells[1][1].data).isEqualTo({});
}),

test('Author clicks to edge',(suite) => {
  let puzzle = suite.showPuzzle("mid_loop", "6x4");
  puzzle.edit();

  assert("Edge data before click").that(puzzle.edges[2][1][1].data).isEqualTo({});

  // Edge between b3 and c3.
  suite.edgeClick(puzzle, "b3-1");

  assert("Edge value after click").that(puzzle.edges[2][1][1].getValue()).isEqualTo("black_circle");
  assert("Edge data after click").that(puzzle.edges[2][1][1].data).isEqualTo({image: 'black_circle', returnValue: 'black_circle'});

  // The same edge is the left side of the cell c3.
  suite.edgeClick(puzzle, "c3-3");

  assert("Edge value after second click").that(puzzle.edges[2][1][1].getValue()).isNull();
  assert("Edge data after second click").that(puzzle.edges[2][1][1].data).isEqualTo({});
}),

test('Author can not draw lines',(suite) => {
  let puzzle = suite.showPuzzle("mid_loop", "6x4");
  puzzle.edit();

  suite.drag(puzzle, suite.cellPoint(puzzle, "a1"), suite.cellPoint(puzzle, "b1"));

  assert("Connector value after drag").that(puzzle.connectors[0][0]['h'].getValue()).isNull();
  assert("Puzzle data after drag").that(puzzle.collectData()).isEqualTo({});
}),

test('Author data collector',(suite) => {
  let puzzle = suite.showPuzzle("mid_loop", "6x4");
  puzzle.edit();

  suite.cellClick(puzzle, "b2");
  suite.cellClick(puzzle, "c2");
  suite.edgeClick(puzzle, "b3-1");
  suite.edgeClick(puzzle, "a2-2");
  suite.edgeClick(puzzle, "d2-2");

  assert("Puzzle data").that(puzzle.collectData()).isEqualTo(
    {"b2": "small_circle", "c2": "small_circle", "edges": {"b3-1": "black_circle", "a2-2": "black_circle", "d2-2": "black_circle"}});
}),

);
