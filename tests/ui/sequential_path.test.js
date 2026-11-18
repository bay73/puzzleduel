sequentialPathTestSuite = uiTestSuite("Sequential Path", "squarepuzzle", "squarePuzzleType",

beforeSuite((suite, cb)=> {
  // Emulates one mouse drag which passes through the centers of the given cells.
  suite.drawLine = function(puzzle, ...cells) {
    puzzle.controller.onMouseDown(suite.mouseEvent(suite.cellPoint(puzzle, cells[0])));
    cells.slice(1).forEach(cell => puzzle.controller.onMouseMove(suite.mouseEvent(suite.cellPoint(puzzle, cell))));
    puzzle.controller.onMouseUp(suite.mouseEvent(suite.cellPoint(puzzle, cells[cells.length - 1])));
  };
  cb();
}),

// Puzzle 4x4 used in the tests and its solution (the path from 1 to 4 through all cells):
//   1 . . .     1-----+
//   . . 2 .     +---2-+
//   . 3 . .     +-3---+
//   4 . . .     4-----+

// Controller definition tests
test('Solver controllers',(suite) => {
  let puzzle = suite.showPuzzle("sequential_path", "4x4", {"a1": "1", "c2": "2", "b3": "3", "a4": "4"});
  puzzle.start();

  assert("Clue cell data").that(puzzle.cells[0][0].data).isEqualTo({text: '1'});
  assert("Clue cell chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("Clue cell click").that(puzzle.cells[0][0].clickSwitch).containsExactly([{text: '1'}, {text: '1', image: 'white_circle'}]);
  assert("Clue cell drag processor").that(puzzle.cells[0][0].dragProcessor).isNotNull();
  assert("Empty cell chooser").that(puzzle.cells[0][1].chooserValues).isNull();
  assert("Empty cell click").that(puzzle.cells[0][1].clickSwitch).containsExactly([{}, {image: 'white_circle'}]);
  assert("Empty cell drag processor").that(puzzle.cells[0][1].dragProcessor).isNotNull();
  assert("Connector click").that(puzzle.connectors[0][0]['h'].clickSwitch).isNull();
  assert("Connector drag").that(puzzle.connectors[0][0]['h'].dragSwitch).containsExactly([{}, {color: puzzle.colorSchema.lineColor, returnValue: '1'}]);
  assert("Vertical connector drag").that(puzzle.connectors[0][0]['v'].dragSwitch).containsExactly([{}, {color: puzzle.colorSchema.lineColor, returnValue: '1'}]);
  assert("Edge chooser").that(puzzle.edges[1][1][1].chooserValues).isNull();
  assert("Edge click").that(puzzle.edges[1][1][1].clickSwitch).containsExactly([{}, {image: 'cross'}]);
  assert("Edge drag").that(puzzle.edges[1][1][1].dragSwitch).isNull();
}),

test('Author controllers',(suite) => {
  let puzzle = suite.showPuzzle("sequential_path", "4x4");
  puzzle.edit();

  assert("Cell chooser").that(puzzle.cells[0][0].chooserValues).containsAtLeast(
    [{}, {text: '0', returnValue: '0'}, {text: '1', returnValue: '1'}, {text: '99', returnValue: '99'}]);
  assert("Number of items in the cell chooser").that(puzzle.cells[0][0].chooserValues.length).isEqualTo(101);
  assert("Cell click").that(puzzle.cells[0][0].clickSwitch).isNull();
  assert("Cell drag processor").that(puzzle.cells[0][0].dragProcessor).isNull();
  assert("Connector click").that(puzzle.connectors[0][0]['h'].clickSwitch).isNull();
  assert("Connector drag").that(puzzle.connectors[0][0]['h'].dragSwitch).isNull();
  assert("Edge click").that(puzzle.edges[1][1][1].clickSwitch).isNull();
  assert("Edge drag").that(puzzle.edges[1][1][1].dragSwitch).isNull();
}),

// Mouse processing tests
test('Draw and erase line by drag between cells',(suite) => {
  let puzzle = suite.showPuzzle("sequential_path", "4x4", {"a1": "1", "c2": "2", "b3": "3", "a4": "4"});
  puzzle.start();

  assert("Connector value before drag").that(puzzle.connectors[0][0]['h'].getValue()).isNull();
  assert("Connector data before drag").that(puzzle.connectors[0][0]['h'].data).isEqualTo({});

  // From the cell with number a1 to b1.
  suite.drag(puzzle, suite.cellPoint(puzzle, "a1"), suite.cellPoint(puzzle, "b1"));

  assert("Connector value after drag").that(puzzle.connectors[0][0]['h'].getValue()).isEqualTo("1");
  assert("Connector data after drag").that(puzzle.connectors[0][0]['h'].data).isEqualTo({color: puzzle.colorSchema.lineColor, returnValue: '1'});
  assert("Clue cell data after drag").that(puzzle.cells[0][0].data).isEqualTo({text: '1'});

  suite.drag(puzzle, suite.cellPoint(puzzle, "a1"), suite.cellPoint(puzzle, "a2"));

  assert("Vertical connector value after drag").that(puzzle.connectors[0][0]['v'].getValue()).isEqualTo("1");

  // Second drag over the line erases it.
  suite.drag(puzzle, suite.cellPoint(puzzle, "b1"), suite.cellPoint(puzzle, "a1"));

  assert("Connector value after second drag").that(puzzle.connectors[0][0]['h'].getValue()).isNull();
  assert("Connector data after second drag").that(puzzle.connectors[0][0]['h'].data).isEqualTo({});
  assert("Vertical connector value after second drag").that(puzzle.connectors[0][0]['v'].getValue()).isEqualTo("1");
}),

test('Draw line through several cells by one drag',(suite) => {
  let puzzle = suite.showPuzzle("sequential_path", "4x4", {"a1": "1", "c2": "2", "b3": "3", "a4": "4"});
  puzzle.start();

  // Single mouse move along the whole second row, through the cell with number.
  suite.drag(puzzle, suite.cellPoint(puzzle, "a2"), suite.cellPoint(puzzle, "d2"));

  assert("Line after straight drag").that(puzzle.collectData()).isEqualTo({"connectors": {"a2-h": "1", "b2-h": "1", "c2-h": "1"}});

  // Drag with turns: a3 - b3 - b4 - c4.
  suite.drawLine(puzzle, "a3", "b3", "b4", "c4");

  assert("Line after drag with turns").that(puzzle.collectData()).isEqualTo(
    {"connectors": {"a2-h": "1", "b2-h": "1", "c2-h": "1", "a3-h": "1", "b3-v": "1", "b4-h": "1"}});
}),

test('Process clicks to empty cell',(suite) => {
  let puzzle = suite.showPuzzle("sequential_path", "4x4", {"a1": "1", "c2": "2", "b3": "3", "a4": "4"});
  puzzle.start();

  assert("Cell data before click").that(puzzle.cells[0][1].data).isEqualTo({});

  suite.cellClick(puzzle, "b1");

  assert("Cell data after click").that(puzzle.cells[0][1].data).isEqualTo({image: 'white_circle'});
  assert("Cell value after click").that(puzzle.cells[0][1].getValue()).isNull();
  // The circle is solver's mark only.
  assert("Submission data with the mark").that(puzzle.collectData()).isEqualTo({});

  suite.cellClick(puzzle, "b1");

  assert("Cell data after second click").that(puzzle.cells[0][1].data).isEqualTo({});
}),

test('Process clicks to clue cell',(suite) => {
  let puzzle = suite.showPuzzle("sequential_path", "4x4", {"a1": "1", "c2": "2", "b3": "3", "a4": "4"});
  puzzle.start();

  // Solver can mark the numbers which are already used, the number itself is kept.
  suite.cellClick(puzzle, "a1");

  assert("Clue cell data after click").that(puzzle.cells[0][0].data).isEqualTo({text: '1', image: 'white_circle'});
  assert("Submission data with the mark").that(puzzle.collectData()).isEqualTo({});

  suite.cellClick(puzzle, "a1");

  assert("Clue cell data after second click").that(puzzle.cells[0][0].data).isEqualTo({text: '1'});
}),

test('Process clicks to edge',(suite) => {
  let puzzle = suite.showPuzzle("sequential_path", "4x4", {"a1": "1", "c2": "2", "b3": "3", "a4": "4"});
  puzzle.start();

  // Edge between b2 and b3.
  suite.edgeClick(puzzle, "b2-2");

  assert("Edge data after click").that(puzzle.edges[1][1][2].data).isEqualTo({image: 'cross'});
  // The cross is solver's mark only.
  assert("Submission data with the cross").that(puzzle.collectData()).isEqualTo({});

  suite.edgeClick(puzzle, "b2-2");

  assert("Edge data after second click").that(puzzle.edges[1][1][2].data).isEqualTo({});
}),

// Data collector tests
test('Data collector',(suite) => {
  let puzzle = suite.showPuzzle("sequential_path", "4x4", {"a1": "1", "c2": "2", "b3": "3", "a4": "4"});
  puzzle.start();

  // The whole path by one drag, only the turning points are listed.
  suite.drawLine(puzzle, "a1", "d1", "d2", "a2", "a3", "d3", "d4", "a4");
  // Marks which are not submitted.
  suite.cellClick(puzzle, "a1");
  suite.cellClick(puzzle, "b2");
  suite.edgeClick(puzzle, "b1-2");

  assert("Submission data").that(puzzle.collectData()).isEqualTo({"connectors": {
    "a1-h": "1", "b1-h": "1", "c1-h": "1", "d1-v": "1",
    "a2-h": "1", "b2-h": "1", "c2-h": "1", "a2-v": "1",
    "a3-h": "1", "b3-h": "1", "c3-h": "1", "d3-v": "1",
    "a4-h": "1", "b4-h": "1", "c4-h": "1"}});
}),

test('Author chooser',(suite) => {
  let puzzle = suite.showPuzzle("sequential_path", "4x4");
  puzzle.edit();

  assert("Cell data before choice").that(puzzle.cells[0][0].data).isEqualTo({});

  // Chooser items are: empty, 0, 1, 2, ...
  puzzle.cells[0][0].switchOnChooser(2);

  assert("Cell value after choice").that(puzzle.cells[0][0].getValue()).isEqualTo("1");
  assert("Cell data after choice").that(puzzle.cells[0][0].data).isEqualTo({text: '1', returnValue: '1'});

  puzzle.cells[0][0].switchOnChooser(0);

  assert("Cell value after clearing").that(puzzle.cells[0][0].getValue()).isNull();
  assert("Cell data after clearing").that(puzzle.cells[0][0].data).isEqualTo({});
}),

test('Author can not draw lines',(suite) => {
  let puzzle = suite.showPuzzle("sequential_path", "4x4");
  puzzle.edit();

  // Mouse down opens the number chooser of the cell a1, so only the connector is checked.
  suite.drag(puzzle, suite.cellPoint(puzzle, "a1"), suite.cellPoint(puzzle, "b1"));

  assert("Connector value after drag").that(puzzle.connectors[0][0]['h'].getValue()).isNull();
  assert("Connector data after drag").that(puzzle.connectors[0][0]['h'].data).isEqualTo({});
}),

test('Author data collector',(suite) => {
  let puzzle = suite.showPuzzle("sequential_path", "4x4");
  puzzle.edit();

  puzzle.cells[0][0].switchOnChooser(2);
  puzzle.cells[1][2].switchOnChooser(3);
  puzzle.cells[2][1].switchOnChooser(4);
  puzzle.cells[3][0].switchOnChooser(5);

  assert("Puzzle data").that(puzzle.collectData()).isEqualTo({"a1": "1", "c2": "2", "b3": "3", "a4": "4"});
}),

);
