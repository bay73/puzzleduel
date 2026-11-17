doubleChocoConsecutiveTestSuite = uiTestSuite("Double Choco Consecutive", "areapuzzle", "doubleChocoPuzzleType",

// Grid 4x4 used in the tests (G is a grey cell, numbers are clues):
//   2 . G G2      a1 b1 c1 d1
//   . . G G       a2 b2 c2 d2
//   . 22 . .      a3 b3 c3 d3
//   . . . .       a4 b4 c4 d4
// Clue "grey" is a grey cell, "grey2" is a grey cell with the number 2, "2" is a white cell with the number 2.

beforeSuite((suite, cb)=> {
  // Emulates drag from the center of one cell to the center of another one (it draws a connector between adjacent cells).
  suite.connectCells = function(puzzle, cell1, cell2) {
    suite.drag(puzzle, suite.cellPoint(puzzle, cell1), suite.cellPoint(puzzle, cell2));
  };
  cb();
}),

// Controller definition tests
test('Solver controllers',(suite) => {
  let puzzle = suite.showPuzzle("double_choco_consecutive", "4x4", {"a1": "2", "c1": "grey", "d1": "grey2", "c2": "grey", "d2": "grey", "b3": "22"});
  puzzle.start();

  assert("White cell with number data").that(puzzle.cells[0][0].data).isEqualTo({text: '2'});
  assert("Grey cell data").that(puzzle.cells[0][2].data).isEqualTo({color: puzzle.colorSchema.lightGreyColor});
  assert("Grey cell with number data").that(puzzle.cells[0][3].data).isEqualTo({text: '2', color: puzzle.colorSchema.lightGreyColor});
  assert("Cell chooser").that(puzzle.cells[0][1].chooserValues).isNull();
  assert("Cell click").that(puzzle.cells[0][1].clickSwitch).isNull();
  assert("Edge chooser").that(puzzle.edges[0][0][1].chooserValues).isNull();
  assert("Edge click").that(puzzle.edges[0][0][1].clickSwitch).containsExactly([{}, {color: puzzle.colorSchema.gridColor, returnValue: 'bold'}]);
  assert("Edge drag").that(puzzle.edges[0][0][1].dragSwitch).containsExactly([{}, {color: puzzle.colorSchema.gridColor, returnValue: 'bold'}]);
  assert("Connector drag").that(puzzle.connectors[0][0]['v'].dragSwitch).containsExactly([{}, {color: puzzle.colorSchema.lineColor, returnValue: 'line'}]);
}),

test('Author controllers',(suite) => {
  let puzzle = suite.showPuzzle("double_choco_consecutive", "4x4");
  puzzle.edit();

  // Empty value, grey cell, grey cells with numbers 1-10 and 22, white cells with numbers 1-10 and 22.
  assert("Cell chooser").that(puzzle.cells[0][0].chooserValues).containsAtLeast([
    {},
    {color: puzzle.colorSchema.lightGreyColor, returnValue: 'grey'},
    {text: '1', color: puzzle.colorSchema.lightGreyColor, returnValue: 'grey1'},
    {text: '22', color: puzzle.colorSchema.lightGreyColor, returnValue: 'grey22'},
    {text: '1', returnValue: '1'},
    {text: '22', returnValue: '22'}]);
  assert("Number of items in the cell chooser").that(puzzle.cells[0][0].chooserValues.length).isEqualTo(24);
  assert("Cell click").that(puzzle.cells[0][0].clickSwitch).isNull();
  assert("Edge chooser").that(puzzle.edges[0][0][1].chooserValues).isNull();
  assert("Edge click").that(puzzle.edges[0][0][1].clickSwitch).isNull();
  assert("Edge drag").that(puzzle.edges[0][0][1].dragSwitch).isNull();
  assert("Connector drag").that(puzzle.connectors[0][0]['v'].dragSwitch).isNull();
}),

// Mouse processing tests
test('Process clicks to edge',(suite) => {
  let puzzle = suite.showPuzzle("double_choco_consecutive", "4x4", {"a1": "2", "c1": "grey", "d1": "grey2", "c2": "grey", "d2": "grey", "b3": "22"});
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
  let puzzle = suite.showPuzzle("double_choco_consecutive", "4x4", {"a1": "2", "c1": "grey", "d1": "grey2", "c2": "grey", "d2": "grey", "b3": "22"});
  puzzle.start();

  // Drag along the edge between a1 and b1.
  suite.drag(puzzle, suite.gridPoint(puzzle, 1, 0), suite.gridPoint(puzzle, 1, 1));

  assert("Edge value after drag").that(puzzle.edges[0][0][1].getValue()).isEqualTo("bold");
  assert("Edge data after drag").that(puzzle.edges[0][0][1].data).isEqualTo({color: puzzle.colorSchema.gridColor, returnValue: "bold"});
}),

test('Process drag for connector',(suite) => {
  let puzzle = suite.showPuzzle("double_choco_consecutive", "4x4", {"a1": "2", "c1": "grey", "d1": "grey2", "c2": "grey", "d2": "grey", "b3": "22"});
  puzzle.start();

  assert("Connector value before drag").that(puzzle.connectors[0][0]['h'].getValue()).isNull();

  suite.connectCells(puzzle, "a1", "b1");

  assert("Connector value after drag").that(puzzle.connectors[0][0]['h'].getValue()).isEqualTo("line");
  assert("Connector data after drag").that(puzzle.connectors[0][0]['h'].data).isEqualTo({color: puzzle.colorSchema.lineColor, returnValue: 'line'});
}),

test('Border removes connector between the cells',(suite) => {
  let puzzle = suite.showPuzzle("double_choco_consecutive", "4x4", {"a1": "2", "c1": "grey", "d1": "grey2", "c2": "grey", "d2": "grey", "b3": "22"});
  puzzle.start();

  suite.connectCells(puzzle, "a1", "b1");
  suite.edgeClick(puzzle, "a1-1");

  assert("Edge value").that(puzzle.edges[0][0][1].getValue()).isEqualTo("bold");
  assert("Connector value").that(puzzle.connectors[0][0]['h'].getValue()).isNull();
}),

// Borders are set automatically between two areas which can not be parts of one region:
// a region consists of one white and one grey part, so two areas with cells of the same color are different regions.
test('Automatic border between white areas',(suite) => {
  let puzzle = suite.showPuzzle("double_choco_consecutive", "4x4", {"a1": "2", "c1": "grey", "d1": "grey2", "c2": "grey", "d2": "grey", "b3": "22"});
  puzzle.start();

  suite.connectCells(puzzle, "a1", "a2");

  assert("Edge value after first connector").that(puzzle.edges[0][0][1].getValue()).isNull();

  suite.connectCells(puzzle, "b1", "b2");

  assert("Edge value after second connector").that(puzzle.edges[0][0][1].getValue()).isEqualTo("bold");
  assert("Edge data after second connector").that(puzzle.edges[0][0][1].data).isEqualTo({color: puzzle.colorSchema.greyColor});
}),

test('No automatic border between white and grey areas',(suite) => {
  let puzzle = suite.showPuzzle("double_choco_consecutive", "4x4", {"a1": "2", "c1": "grey", "d1": "grey2", "c2": "grey", "d2": "grey", "b3": "22"});
  puzzle.start();

  // White area b1-b2 and grey area c1-c2 can be parts of one region.
  suite.connectCells(puzzle, "b1", "b2");
  suite.connectCells(puzzle, "c1", "c2");

  assert("Edge value between white and grey areas").that(puzzle.edges[0][1][1].getValue()).isNull();
  assert("Edge data between white and grey areas").that(puzzle.edges[0][1][1].data).isEqualTo({});
}),

test('Automatic border between grey areas',(suite) => {
  let puzzle = suite.showPuzzle("double_choco_consecutive", "4x4", {"a1": "2", "c1": "grey", "d1": "grey2", "c2": "grey", "d2": "grey", "b3": "22"});
  puzzle.start();

  suite.connectCells(puzzle, "c1", "c2");
  suite.connectCells(puzzle, "d1", "d2");

  assert("Edge value between grey areas").that(puzzle.edges[0][2][1].getValue()).isEqualTo("bold");
  assert("Edge data between grey areas").that(puzzle.edges[0][2][1].data).isEqualTo({color: puzzle.colorSchema.greyColor});
}),

// Data collector tests
test('Data collector',(suite) => {
  let puzzle = suite.showPuzzle("double_choco_consecutive", "2x2", {"b1": "grey", "b2": "grey"});
  puzzle.start();

  // Horizontal border in the middle of the grid.
  suite.edgeClick(puzzle, "a1-2");
  suite.edgeClick(puzzle, "b1-2");

  assert("Submission data").that(puzzle.collectData()).isEqualTo({"areas": [["a1", "b1"], ["a2", "b2"]]});
}),

test('Author data collector',(suite) => {
  let puzzle = suite.showPuzzle("double_choco_consecutive", "4x4");
  puzzle.edit();

  // Grey cell in a1, grey cell with the number 2 in b1, white cell with the number 2 in c1.
  puzzle.cells[0][0].switchOnChooser(1);
  puzzle.cells[0][1].switchOnChooser(3);
  puzzle.cells[0][2].switchOnChooser(14);

  assert("Grey cell data").that(puzzle.cells[0][0].data).isEqualTo({color: puzzle.colorSchema.lightGreyColor, returnValue: 'grey'});
  assert("Grey cell with number data").that(puzzle.cells[0][1].data).isEqualTo({text: '2', color: puzzle.colorSchema.lightGreyColor, returnValue: 'grey2'});
  assert("Puzzle data").that(puzzle.collectData()).isEqualTo({"a1": "grey", "b1": "grey2", "c1": "2"});
}),

);
