masyuTestSuite = uiTestSuite("Masyu", "squarepuzzle", "squarePuzzleType",

beforeSuite((suite, cb)=> {
  // Emulates one mouse drag which passes through the centers of the given cells.
  suite.drawLine = function(puzzle, ...cells) {
    puzzle.controller.onMouseDown(suite.mouseEvent(suite.cellPoint(puzzle, cells[0])));
    cells.slice(1).forEach(cell => puzzle.controller.onMouseMove(suite.mouseEvent(suite.cellPoint(puzzle, cell))));
    puzzle.controller.onMouseUp(suite.mouseEvent(suite.cellPoint(puzzle, cells[cells.length - 1])));
  };
  cb();
}),

// Puzzle 5x4 used in the tests (W - white circle, B - black circle) and its solution:
//   . W . . B     +-W-----B
//   . . . . .     | . . . |
//   . . . . W     | . . . W
//   B . . . .     B-------+

// Controller definition tests
test('Solver controllers',(suite) => {
  let puzzle = suite.showPuzzle("masyu", "5x4", {"b1": "white_circle", "e1": "black_circle", "e3": "white_circle", "a4": "black_circle"});
  puzzle.start();

  assert("White circle data").that(puzzle.cells[0][1].data).isEqualTo({image: 'white_circle'});
  assert("Black circle data").that(puzzle.cells[0][4].data).isEqualTo({image: 'black_circle'});
  assert("Clue cell chooser").that(puzzle.cells[0][1].chooserValues).isNull();
  assert("Clue cell click").that(puzzle.cells[0][1].clickSwitch).isNull();
  assert("Clue cell drag processor").that(puzzle.cells[0][1].dragProcessor).isNotNull();
  assert("Empty cell chooser").that(puzzle.cells[1][1].chooserValues).isNull();
  assert("Empty cell click").that(puzzle.cells[1][1].clickSwitch).isNull();
  assert("Empty cell drag processor").that(puzzle.cells[1][1].dragProcessor).isNotNull();
  assert("Connector click").that(puzzle.connectors[0][0]['h'].clickSwitch).isNull();
  assert("Connector drag").that(puzzle.connectors[0][0]['h'].dragSwitch).containsExactly([{}, {color: puzzle.colorSchema.lineColor, returnValue: '1'}]);
  assert("Vertical connector drag").that(puzzle.connectors[0][0]['v'].dragSwitch).containsExactly([{}, {color: puzzle.colorSchema.lineColor, returnValue: '1'}]);
  assert("Edge chooser").that(puzzle.edges[1][1][1].chooserValues).isNull();
  assert("Edge click").that(puzzle.edges[1][1][1].clickSwitch).containsExactly([{}, {image: 'cross'}]);
  assert("Edge drag").that(puzzle.edges[1][1][1].dragSwitch).isNull();
}),

test('Author controllers',(suite) => {
  let puzzle = suite.showPuzzle("masyu", "5x4");
  puzzle.edit();

  assert("Cell chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("Cell click").that(puzzle.cells[0][0].clickSwitch).containsExactly(
    [{}, {image: 'black_circle', returnValue: 'black_circle'}, {image: 'white_circle', returnValue: 'white_circle'}]);
  assert("Cell drag processor").that(puzzle.cells[0][0].dragProcessor).isNull();
  assert("Connector click").that(puzzle.connectors[0][0]['h'].clickSwitch).isNull();
  assert("Connector drag").that(puzzle.connectors[0][0]['h'].dragSwitch).isNull();
  assert("Edge click").that(puzzle.edges[1][1][1].clickSwitch).isNull();
  assert("Edge drag").that(puzzle.edges[1][1][1].dragSwitch).isNull();
}),

// Mouse processing tests
test('Draw and erase line by drag between cells',(suite) => {
  let puzzle = suite.showPuzzle("masyu", "5x4", {"b1": "white_circle", "e1": "black_circle", "e3": "white_circle", "a4": "black_circle"});
  puzzle.start();

  assert("Connector value before drag").that(puzzle.connectors[0][0]['h'].getValue()).isNull();
  assert("Connector data before drag").that(puzzle.connectors[0][0]['h'].data).isEqualTo({});

  // From a1 to the cell with circle b1.
  suite.drag(puzzle, suite.cellPoint(puzzle, "a1"), suite.cellPoint(puzzle, "b1"));

  assert("Connector value after drag").that(puzzle.connectors[0][0]['h'].getValue()).isEqualTo("1");
  assert("Connector data after drag").that(puzzle.connectors[0][0]['h'].data).isEqualTo({color: puzzle.colorSchema.lineColor, returnValue: '1'});
  assert("Circle after drag").that(puzzle.cells[0][1].data).isEqualTo({image: 'white_circle'});

  // Vertical line from a1 to a2.
  suite.drag(puzzle, suite.cellPoint(puzzle, "a1"), suite.cellPoint(puzzle, "a2"));

  assert("Vertical connector value after drag").that(puzzle.connectors[0][0]['v'].getValue()).isEqualTo("1");
  assert("Horizontal connector value after vertical drag").that(puzzle.connectors[0][0]['h'].getValue()).isEqualTo("1");

  // Drag in the opposite direction over the existing line erases it.
  suite.drag(puzzle, suite.cellPoint(puzzle, "b1"), suite.cellPoint(puzzle, "a1"));

  assert("Connector value after second drag").that(puzzle.connectors[0][0]['h'].getValue()).isNull();
  assert("Connector data after second drag").that(puzzle.connectors[0][0]['h'].data).isEqualTo({});
  assert("Vertical connector value after second drag").that(puzzle.connectors[0][0]['v'].getValue()).isEqualTo("1");
}),

test('Draw line through several cells by one drag',(suite) => {
  let puzzle = suite.showPuzzle("masyu", "5x4", {"b1": "white_circle", "e1": "black_circle", "e3": "white_circle", "a4": "black_circle"});
  puzzle.start();

  // Single mouse move from a1 to e1 connects all the cells of the row.
  suite.drag(puzzle, suite.cellPoint(puzzle, "a1"), suite.cellPoint(puzzle, "e1"));

  assert("Line after straight drag").that(puzzle.collectData()).isEqualTo(
    {"connectors": {"a1-h": "1", "b1-h": "1", "c1-h": "1", "d1-h": "1"}});

  // Drag with turns: a2 - b2 - b3 - c3.
  suite.drawLine(puzzle, "a2", "b2", "b3", "c3");

  assert("Line after drag with turns").that(puzzle.collectData()).isEqualTo(
    {"connectors": {"a1-h": "1", "b1-h": "1", "c1-h": "1", "d1-h": "1", "a2-h": "1", "b2-v": "1", "b3-h": "1"}});
}),

test('Drag between cells of different rows and columns',(suite) => {
  let puzzle = suite.showPuzzle("masyu", "5x4", {"b1": "white_circle", "e1": "black_circle", "e3": "white_circle", "a4": "black_circle"});
  puzzle.start();

  suite.drag(puzzle, suite.cellPoint(puzzle, "b2"), suite.cellPoint(puzzle, "c3"));

  assert("Line after diagonal drag").that(puzzle.collectData()).isEqualTo({});
}),

test('Cells are not changed by click',(suite) => {
  let puzzle = suite.showPuzzle("masyu", "5x4", {"b1": "white_circle", "e1": "black_circle", "e3": "white_circle", "a4": "black_circle"});
  puzzle.start();

  suite.cellClick(puzzle, "b1");
  suite.cellClick(puzzle, "c2");

  assert("Clue cell data after click").that(puzzle.cells[0][1].data).isEqualTo({image: 'white_circle'});
  assert("Empty cell data after click").that(puzzle.cells[1][2].data).isEqualTo({});
  assert("Submission data after clicks").that(puzzle.collectData()).isEqualTo({});
}),

test('Process clicks to edge',(suite) => {
  let puzzle = suite.showPuzzle("masyu", "5x4", {"b1": "white_circle", "e1": "black_circle", "e3": "white_circle", "a4": "black_circle"});
  puzzle.start();

  assert("Edge data before click").that(puzzle.edges[1][2][1].data).isEqualTo({});

  // Edge between c2 and d2.
  suite.edgeClick(puzzle, "c2-1");

  assert("Edge data after click").that(puzzle.edges[1][2][1].data).isEqualTo({image: 'cross'});
  assert("Edge value after click").that(puzzle.edges[1][2][1].getValue()).isNull();
  // The cross is solver's mark only.
  assert("Submission data with the cross").that(puzzle.collectData()).isEqualTo({});

  suite.edgeClick(puzzle, "c2-1");

  assert("Edge data after second click").that(puzzle.edges[1][2][1].data).isEqualTo({});
}),

// Data collector tests
test('Data collector',(suite) => {
  let puzzle = suite.showPuzzle("masyu", "5x4", {"b1": "white_circle", "e1": "black_circle", "e3": "white_circle", "a4": "black_circle"});
  puzzle.start();

  // The loop along the grid border, drawn by two drags.
  suite.drawLine(puzzle, "a1", "e1", "e4");
  suite.drawLine(puzzle, "a1", "a2", "a3", "a4", "b4", "c4", "d4", "e4");
  // Marks which are not submitted.
  suite.edgeClick(puzzle, "b2-1");

  assert("Submission data").that(puzzle.collectData()).isEqualTo({"connectors": {
    "a1-h": "1", "b1-h": "1", "c1-h": "1", "d1-h": "1", "e1-v": "1", "e2-v": "1", "e3-v": "1",
    "d4-h": "1", "c4-h": "1", "b4-h": "1", "a4-h": "1", "a3-v": "1", "a2-v": "1", "a1-v": "1"}});
}),

test('Author click cycle',(suite) => {
  let puzzle = suite.showPuzzle("masyu", "5x4");
  puzzle.edit();

  assert("Cell data before click").that(puzzle.cells[0][1].data).isEqualTo({});

  suite.cellClick(puzzle, "b1");

  assert("Cell value after one click").that(puzzle.cells[0][1].getValue()).isEqualTo("black_circle");
  assert("Cell data after one click").that(puzzle.cells[0][1].data).isEqualTo({image: 'black_circle', returnValue: 'black_circle'});

  suite.cellClick(puzzle, "b1");

  assert("Cell value after two clicks").that(puzzle.cells[0][1].getValue()).isEqualTo("white_circle");
  assert("Cell data after two clicks").that(puzzle.cells[0][1].data).isEqualTo({image: 'white_circle', returnValue: 'white_circle'});

  suite.cellClick(puzzle, "b1");

  assert("Cell value after three clicks").that(puzzle.cells[0][1].getValue()).isNull();
  assert("Cell data after three clicks").that(puzzle.cells[0][1].data).isEqualTo({});
}),

test('Author can not draw lines',(suite) => {
  let puzzle = suite.showPuzzle("masyu", "5x4");
  puzzle.edit();

  suite.drag(puzzle, suite.cellPoint(puzzle, "a1"), suite.cellPoint(puzzle, "b1"));

  assert("Connector value after drag").that(puzzle.connectors[0][0]['h'].getValue()).isNull();
  assert("Puzzle data after drag").that(puzzle.collectData()).isEqualTo({});
}),

test('Author data collector',(suite) => {
  let puzzle = suite.showPuzzle("masyu", "5x4");
  puzzle.edit();

  // White circles in b1 and e3 (two clicks), black circles in e1 and a4 (one click).
  suite.cellClick(puzzle, "b1");
  suite.cellClick(puzzle, "b1");
  suite.cellClick(puzzle, "e1");
  suite.cellClick(puzzle, "e3");
  suite.cellClick(puzzle, "e3");
  suite.cellClick(puzzle, "a4");

  assert("Puzzle data").that(puzzle.collectData()).isEqualTo({"b1": "white_circle", "e1": "black_circle", "e3": "white_circle", "a4": "black_circle"});
}),

);
