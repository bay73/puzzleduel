rectoTestSuite = uiTestSuite("Recto", "areapuzzle", "areaPuzzleType",

beforeSuite((suite, cb)=> {
  // Emulates drag from the center of one cell to the center of another one (it draws a connector between adjacent cells).
  suite.connectCells = function(puzzle, cell1, cell2) {
    suite.drag(puzzle, suite.cellPoint(puzzle, cell1), suite.cellPoint(puzzle, cell2));
  };
  cb();
}),

// Controller definition tests
test('Solver controllers',(suite) => {
  let puzzle = suite.showPuzzle("recto", "4x4", {"a1": "4", "c2": "5", "d4": "3"});
  puzzle.start();

  assert("Clue cell data").that(puzzle.cells[0][0].data).isEqualTo({text: '4'});
  assert("Cell chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("Cell click").that(puzzle.cells[0][0].clickSwitch).isNull();
  assert("Edge chooser").that(puzzle.edges[0][0][1].chooserValues).isNull();
  assert("Edge click").that(puzzle.edges[0][0][1].clickSwitch).containsExactly([{}, {color: puzzle.colorSchema.gridColor, returnValue: 'bold'}]);
  assert("Edge drag").that(puzzle.edges[0][0][1].dragSwitch).containsExactly([{}, {color: puzzle.colorSchema.gridColor, returnValue: 'bold'}]);
  assert("Connector drag").that(puzzle.connectors[0][0]['v'].dragSwitch).containsExactly([{}, {color: puzzle.colorSchema.lineColor, returnValue: 'line'}]);
}),

test('Author controllers',(suite) => {
  let puzzle = suite.showPuzzle("recto", "4x4");
  puzzle.edit();

  assert("Cell chooser").that(puzzle.cells[0][0].chooserValues).containsAtLeast([{}, {text: '1', returnValue: '1'}, {text: '2', returnValue: '2'}, {text: '99', returnValue: '99'}]);
  assert("Number of items in the cell chooser").that(puzzle.cells[0][0].chooserValues.length).isEqualTo(100);
  assert("Cell click").that(puzzle.cells[0][0].clickSwitch).isNull();
  assert("Edge chooser").that(puzzle.edges[0][0][1].chooserValues).isNull();
  assert("Edge click").that(puzzle.edges[0][0][1].clickSwitch).isNull();
  assert("Edge drag").that(puzzle.edges[0][0][1].dragSwitch).isNull();
  assert("Connector drag").that(puzzle.connectors[0][0]['v'].dragSwitch).isNull();
}),

// Mouse processing tests
test('Process clicks to edge',(suite) => {
  let puzzle = suite.showPuzzle("recto", "4x4", {"a1": "4", "c2": "5", "d4": "3"});
  puzzle.start();

  assert("Edge value before click").that(puzzle.edges[0][0][2].getValue()).isNull();
  assert("Edge data before click").that(puzzle.edges[0][0][2].data).isEqualTo({});

  // Click at the edge between a1 and a2.
  suite.edgeClick(puzzle, "a1-2");

  assert("Edge value after click").that(puzzle.edges[0][0][2].getValue()).isEqualTo("bold");
  assert("Edge data after click").that(puzzle.edges[0][0][2].data).isEqualTo({color: puzzle.colorSchema.gridColor, returnValue: "bold"});

  suite.edgeClick(puzzle, "a1-2");

  assert("Edge value after second click").that(puzzle.edges[0][0][2].getValue()).isNull();
  assert("Edge data after second click").that(puzzle.edges[0][0][2].data).isEqualTo({});
}),

test('Process drag for edge',(suite) => {
  let puzzle = suite.showPuzzle("recto", "4x4", {"a1": "4", "c2": "5", "d4": "3"});
  puzzle.start();

  // Drag along the edge between a1 and b1.
  suite.drag(puzzle, suite.gridPoint(puzzle, 1, 0), suite.gridPoint(puzzle, 1, 1));

  assert("Edge value after drag").that(puzzle.edges[0][0][1].getValue()).isEqualTo("bold");
  assert("Edge data after drag").that(puzzle.edges[0][0][1].data).isEqualTo({color: puzzle.colorSchema.gridColor, returnValue: "bold"});
}),

test('Process drag for connector',(suite) => {
  let puzzle = suite.showPuzzle("recto", "4x4", {"a1": "4", "c2": "5", "d4": "3"});
  puzzle.start();

  assert("Connector value before drag").that(puzzle.connectors[0][0]['h'].getValue()).isNull();

  suite.connectCells(puzzle, "a1", "b1");

  assert("Connector value after drag").that(puzzle.connectors[0][0]['h'].getValue()).isEqualTo("line");
  assert("Connector data after drag").that(puzzle.connectors[0][0]['h'].data).isEqualTo({color: puzzle.colorSchema.lineColor, returnValue: 'line'});
}),

test('Border removes connector between the cells',(suite) => {
  let puzzle = suite.showPuzzle("recto", "4x4", {"a1": "4", "c2": "5", "d4": "3"});
  puzzle.start();

  suite.connectCells(puzzle, "a1", "b1");
  suite.edgeClick(puzzle, "a1-1");

  assert("Edge value").that(puzzle.edges[0][0][1].getValue()).isEqualTo("bold");
  assert("Connector value").that(puzzle.connectors[0][0]['h'].getValue()).isNull();
}),

test('Automatic border between areas',(suite) => {
  let puzzle = suite.showPuzzle("recto", "4x4", {"a1": "4", "c2": "5", "d4": "3"});
  puzzle.start();

  suite.connectCells(puzzle, "a1", "a2");

  assert("Edge value after first connector").that(puzzle.edges[0][0][1].getValue()).isNull();

  // Two areas a1-a2 and b1-b2 are different rectangles, so the border between them is set automatically.
  suite.connectCells(puzzle, "b1", "b2");

  assert("Edge value after second connector").that(puzzle.edges[0][0][1].getValue()).isEqualTo("bold");
  assert("Edge data after second connector").that(puzzle.edges[0][0][1].data).isEqualTo({color: puzzle.colorSchema.greyColor});
  assert("Edge between cells of one area").that(puzzle.edges[0][0][2].getValue()).isNull();
}),

// Data collector tests
test('Data collector',(suite) => {
  let puzzle = suite.showPuzzle("recto", "2x2", {"a1": "4"});
  puzzle.start();

  // Vertical border in the middle of the grid.
  suite.edgeClick(puzzle, "a1-1");
  suite.edgeClick(puzzle, "a2-1");

  assert("Submission data with two areas").that(puzzle.collectData()).isEqualTo({"areas": [["a1", "a2"], ["b1", "b2"]]});

  // Border between a1 and a2.
  suite.edgeClick(puzzle, "a1-2");

  assert("Submission data with three areas").that(puzzle.collectData()).isEqualTo({"areas": [["a1"], ["a2"], ["b1", "b2"]]});
}),

test('Author data collector',(suite) => {
  let puzzle = suite.showPuzzle("recto", "4x4");
  puzzle.edit();

  // Number 4 in a1 and number 12 in c2.
  puzzle.cells[0][0].switchOnChooser(4);
  puzzle.cells[1][2].switchOnChooser(12);

  assert("Puzzle data").that(puzzle.collectData()).isEqualTo({"a1": "4", "c2": "12"});
}),

);
