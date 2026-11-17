pentominoDivisionTestSuite = uiTestSuite("Pentomino Division", "areapuzzle", "fillominoPuzzleType",

beforeSuite((suite, cb)=> {
  // Emulates drag from the center of one cell to the center of another one (it draws a connector between adjacent cells).
  suite.connectCells = function(puzzle, cell1, cell2) {
    suite.drag(puzzle, suite.cellPoint(puzzle, cell1), suite.cellPoint(puzzle, cell2));
  };
  cb();
}),

// Controller definition tests
test('Solver controllers',(suite) => {
  let puzzle = suite.showPuzzle("pentomino_division", "5x4", {"a1": "I", "e4": "L"});
  puzzle.start();

  assert("Clue cell data").that(puzzle.cells[0][0].data).isEqualTo({text: 'I'});
  assert("Clue cell chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("Empty cell chooser").that(puzzle.cells[0][1].chooserValues).containsExactly([{}, {text: 'F', returnValue: 'F'}, {text: 'I', returnValue: 'I'}, {text: 'L', returnValue: 'L'}, {text: 'N', returnValue: 'N'}, {text: 'P', returnValue: 'P'}, {text: 'T', returnValue: 'T'}, {text: 'U', returnValue: 'U'}, {text: 'V', returnValue: 'V'}, {text: 'W', returnValue: 'W'}, {text: 'X', returnValue: 'X'}, {text: 'Y', returnValue: 'Y'}, {text: 'Z', returnValue: 'Z'}]);
  assert("Empty cell click").that(puzzle.cells[0][1].clickSwitch).isNull();
  assert("Edge chooser").that(puzzle.edges[0][0][1].chooserValues).isNull();
  assert("Edge click").that(puzzle.edges[0][0][1].clickSwitch).containsExactly([{}, {color: puzzle.colorSchema.gridColor, returnValue: 'bold'}]);
  assert("Edge drag").that(puzzle.edges[0][0][1].dragSwitch).containsExactly([{}, {color: puzzle.colorSchema.gridColor, returnValue: 'bold'}]);
  assert("Connector drag").that(puzzle.connectors[0][0]['v'].dragSwitch).containsExactly([{}, {color: puzzle.colorSchema.lineColor, returnValue: 'line'}]);
}),

test('Author controllers',(suite) => {
  let puzzle = suite.showPuzzle("pentomino_division", "5x4");
  puzzle.edit();

  assert("Cell chooser").that(puzzle.cells[0][0].chooserValues).containsExactly([{}, {text: 'F', returnValue: 'F'}, {text: 'I', returnValue: 'I'}, {text: 'L', returnValue: 'L'}, {text: 'N', returnValue: 'N'}, {text: 'P', returnValue: 'P'}, {text: 'T', returnValue: 'T'}, {text: 'U', returnValue: 'U'}, {text: 'V', returnValue: 'V'}, {text: 'W', returnValue: 'W'}, {text: 'X', returnValue: 'X'}, {text: 'Y', returnValue: 'Y'}, {text: 'Z', returnValue: 'Z'}]);
  assert("Cell click").that(puzzle.cells[0][0].clickSwitch).isNull();
  assert("Edge chooser").that(puzzle.edges[0][0][1].chooserValues).isNull();
  assert("Edge click").that(puzzle.edges[0][0][1].clickSwitch).isNull();
  assert("Edge drag").that(puzzle.edges[0][0][1].dragSwitch).isNull();
  assert("Connector drag").that(puzzle.connectors[0][0]['v'].dragSwitch).isNull();
}),

// Mouse processing tests
test('Process clicks to edge',(suite) => {
  let puzzle = suite.showPuzzle("pentomino_division", "5x4", {"a1": "I", "e4": "L"});
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
  let puzzle = suite.showPuzzle("pentomino_division", "5x4", {"a1": "I", "e4": "L"});
  puzzle.start();

  // Drag along the edge between a1 and b1.
  suite.drag(puzzle, suite.gridPoint(puzzle, 1, 0), suite.gridPoint(puzzle, 1, 1));

  assert("Edge value after drag").that(puzzle.edges[0][0][1].getValue()).isEqualTo("bold");
  assert("Edge data after drag").that(puzzle.edges[0][0][1].data).isEqualTo({color: puzzle.colorSchema.gridColor, returnValue: "bold"});
}),

test('Process drag for connector',(suite) => {
  let puzzle = suite.showPuzzle("pentomino_division", "5x4", {"a1": "I", "e4": "L"});
  puzzle.start();

  assert("Connector value before drag").that(puzzle.connectors[0][0]['h'].getValue()).isNull();

  suite.connectCells(puzzle, "a1", "b1");

  assert("Connector value after drag").that(puzzle.connectors[0][0]['h'].getValue()).isEqualTo("line");
  assert("Connector data after drag").that(puzzle.connectors[0][0]['h'].data).isEqualTo({color: puzzle.colorSchema.lineColor, returnValue: 'line'});
}),

test('Border removes connector between the cells',(suite) => {
  let puzzle = suite.showPuzzle("pentomino_division", "5x4", {"a1": "I", "e4": "L"});
  puzzle.start();

  suite.connectCells(puzzle, "a1", "b1");
  suite.edgeClick(puzzle, "a1-1");

  assert("Edge value").that(puzzle.edges[0][0][1].getValue()).isEqualTo("bold");
  assert("Connector value").that(puzzle.connectors[0][0]['h'].getValue()).isNull();
}),

test('Automatic border between different letters',(suite) => {
  let puzzle = suite.showPuzzle("pentomino_division", "5x4", {"a1": "I", "e4": "L"});
  puzzle.start();

  // Letter N in b1, next to the given letter I in a1.
  puzzle.cells[0][1].switchOnChooser(4);

  assert("Cell value").that(puzzle.cells[0][1].getValue()).isEqualTo("N");
  assert("Edge between different letters").that(puzzle.edges[0][0][1].getValue()).isEqualTo("bold");
  assert("Edge data between different letters").that(puzzle.edges[0][0][1].data).isEqualTo({color: puzzle.colorSchema.greyColor});
  assert("Edge between the letter and the empty cell").that(puzzle.edges[0][1][1].getValue()).isNull();

  // The same letter N in c1.
  puzzle.cells[0][2].switchOnChooser(4);

  assert("Edge between the same letters").that(puzzle.edges[0][1][1].getValue()).isNull();
}),

test('Automatic border between areas which are too big to be joined',(suite) => {
  let puzzle = suite.showPuzzle("pentomino_division", "5x4", {"a1": "I", "e4": "L"});
  puzzle.start();

  // Area a1-b1-c1.
  suite.connectCells(puzzle, "a1", "b1");
  suite.connectCells(puzzle, "b1", "c1");
  // Area a2-b2.
  suite.connectCells(puzzle, "a2", "b2");

  assert("Edge between areas of 3 and 2 cells").that(puzzle.edges[0][0][2].getValue()).isNull();

  // Area a2-b2-c2: the areas contain 6 cells together, but a pentomino consists of 5 cells.
  suite.connectCells(puzzle, "b2", "c2");

  assert("Edge between areas of 3 and 3 cells").that(puzzle.edges[0][0][2].getValue()).isEqualTo("bold");
  assert("Edge data between areas of 3 and 3 cells").that(puzzle.edges[0][0][2].data).isEqualTo({color: puzzle.colorSchema.greyColor});
}),

// Data collector tests
test('Data collector',(suite) => {
  let puzzle = suite.showPuzzle("pentomino_division", "5x2", {"a1": "I"});
  puzzle.start();

  // Horizontal border in the middle of the grid and the letter I in a2.
  suite.edgeClick(puzzle, "a1-2");
  suite.edgeClick(puzzle, "b1-2");
  suite.edgeClick(puzzle, "c1-2");
  suite.edgeClick(puzzle, "d1-2");
  suite.edgeClick(puzzle, "e1-2");
  puzzle.cells[1][0].switchOnChooser(2);

  assert("Submission data").that(puzzle.collectData()).isEqualTo({"a2": "I", "areas": [["a1", "b1", "c1", "d1", "e1"], ["a2", "b2", "c2", "d2", "e2"]]});
}),

test('Author data collector',(suite) => {
  let puzzle = suite.showPuzzle("pentomino_division", "5x4");
  puzzle.edit();

  // Letter I in a1 and letter Z in e4.
  puzzle.cells[0][0].switchOnChooser(2);
  puzzle.cells[3][4].switchOnChooser(12);

  assert("Puzzle data").that(puzzle.collectData()).isEqualTo({"a1": "I", "e4": "Z"});
}),

);
