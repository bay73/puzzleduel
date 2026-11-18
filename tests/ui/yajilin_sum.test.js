yajilinSumTestSuite = uiTestSuite("Yajilin Sum", "squarepuzzle", "squarePuzzleType",

beforeSuite((suite, cb)=> {
  // Emulates one mouse drag which passes through the centers of the given cells.
  suite.drawLine = function(puzzle, ...cells) {
    puzzle.controller.onMouseDown(suite.mouseEvent(suite.cellPoint(puzzle, cells[0])));
    cells.slice(1).forEach(cell => puzzle.controller.onMouseMove(suite.mouseEvent(suite.cellPoint(puzzle, cell))));
    puzzle.controller.onMouseUp(suite.mouseEvent(suite.cellPoint(puzzle, cells[cells.length - 1])));
  };
  suite.CLUES = {"b2": "1"};
  cb();
}),

// Puzzle 4x4 used in the tests (the clue is the number of black cells in the row and column of the clue)
// and its solution (# - black cell):
//   . . . .     +-----+
//   . 1 . .     | 1 # |
//   . . . .     | +-+ |
//   . . . .     +-+ +-+

// Controller definition tests
test('Solver controllers',(suite) => {
  let puzzle = suite.showPuzzle("yajilin_sum", "4x4", suite.CLUES);
  puzzle.start();

  assert("Clue cell data").that(puzzle.cells[1][1].data).isEqualTo({text: '1', color: puzzle.colorSchema.lightGreyColor});
  assert("Clue cell chooser").that(puzzle.cells[1][1].chooserValues).isNull();
  assert("Clue cell click").that(puzzle.cells[1][1].clickSwitch).isNull();
  assert("Empty cell chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("Empty cell click").that(puzzle.cells[0][0].clickSwitch).containsExactly([{}, {color: puzzle.colorSchema.gridColor}, {image: 'cross'}]);
  assert("Empty cell drag processor").that(puzzle.cells[0][0].dragProcessor).isNotNull();
  assert("Connector click").that(puzzle.connectors[0][0]['h'].clickSwitch).isNull();
  assert("Connector drag").that(puzzle.connectors[0][0]['h'].dragSwitch).containsExactly([{}, {color: puzzle.colorSchema.lineColor, returnValue: '1'}]);
  assert("Vertical connector drag").that(puzzle.connectors[0][0]['v'].dragSwitch).containsExactly([{}, {color: puzzle.colorSchema.lineColor, returnValue: '1'}]);
  assert("Edge chooser").that(puzzle.edges[0][0][1].chooserValues).isNull();
  assert("Edge click").that(puzzle.edges[0][0][1].clickSwitch).containsExactly([{}, {image: 'cross'}]);
  assert("Edge drag").that(puzzle.edges[0][0][1].dragSwitch).isNull();
}),

test('Author controllers',(suite) => {
  let puzzle = suite.showPuzzle("yajilin_sum", "4x4");
  puzzle.edit();

  let numberItem = function(number) {
    return {text: number, color: puzzle.colorSchema.lightGreyColor, returnValue: number};
  }
  assert("Cell chooser").that(puzzle.cells[0][0].chooserValues).containsAtLeast([
    {}, {color: puzzle.colorSchema.lightGreyColor, returnValue: 'grey'}, numberItem('0'), numberItem('1'), numberItem('15')]);
  // Empty cell, grey cell and numbers from 0 to 15.
  assert("Number of items in the cell chooser").that(puzzle.cells[0][0].chooserValues.length).isEqualTo(18);
  assert("Cell click").that(puzzle.cells[0][0].clickSwitch).isNull();
  assert("Cell drag processor").that(puzzle.cells[0][0].dragProcessor).isNull();
  assert("Connector click").that(puzzle.connectors[0][0]['h'].clickSwitch).isNull();
  assert("Connector drag").that(puzzle.connectors[0][0]['h'].dragSwitch).isNull();
  assert("Edge click").that(puzzle.edges[0][0][1].clickSwitch).isNull();
  assert("Edge drag").that(puzzle.edges[0][0][1].dragSwitch).isNull();
}),

// Mouse processing tests
test('Draw and erase line by drag between cells',(suite) => {
  let puzzle = suite.showPuzzle("yajilin_sum", "4x4", suite.CLUES);
  puzzle.start();

  assert("Connector value before drag").that(puzzle.connectors[0][0]['h'].getValue()).isNull();
  assert("Connector data before drag").that(puzzle.connectors[0][0]['h'].data).isEqualTo({});

  suite.drag(puzzle, suite.cellPoint(puzzle, "a1"), suite.cellPoint(puzzle, "b1"));

  assert("Connector value after drag").that(puzzle.connectors[0][0]['h'].getValue()).isEqualTo("1");
  assert("Connector data after drag").that(puzzle.connectors[0][0]['h'].data).isEqualTo({color: puzzle.colorSchema.lineColor, returnValue: '1'});

  suite.drag(puzzle, suite.cellPoint(puzzle, "a1"), suite.cellPoint(puzzle, "a2"));

  assert("Vertical connector value after drag").that(puzzle.connectors[0][0]['v'].getValue()).isEqualTo("1");

  // Second drag over the line erases it.
  suite.drag(puzzle, suite.cellPoint(puzzle, "b1"), suite.cellPoint(puzzle, "a1"));

  assert("Connector value after second drag").that(puzzle.connectors[0][0]['h'].getValue()).isNull();
  assert("Connector data after second drag").that(puzzle.connectors[0][0]['h'].data).isEqualTo({});
  assert("Vertical connector value after second drag").that(puzzle.connectors[0][0]['v'].getValue()).isEqualTo("1");
}),

test('Draw line through several cells by one drag',(suite) => {
  let puzzle = suite.showPuzzle("yajilin_sum", "4x4", suite.CLUES);
  puzzle.start();

  // Single mouse move along the whole first row.
  suite.drag(puzzle, suite.cellPoint(puzzle, "a1"), suite.cellPoint(puzzle, "d1"));

  assert("Line after straight drag").that(puzzle.collectData()).isEqualTo({"connectors": {"a1-h": "1", "b1-h": "1", "c1-h": "1"}});

  // Drag with turns: a3 - b3 - b4 - c4.
  suite.drawLine(puzzle, "a3", "b3", "b4", "c4");

  assert("Line after drag with turns").that(puzzle.collectData()).isEqualTo(
    {"connectors": {"a1-h": "1", "b1-h": "1", "c1-h": "1", "a3-h": "1", "b3-v": "1", "b4-h": "1"}});
}),

test('Process clicks to cell',(suite) => {
  let puzzle = suite.showPuzzle("yajilin_sum", "4x4", suite.CLUES);
  puzzle.start();

  assert("Cell data before click").that(puzzle.cells[0][0].data).isEqualTo({});

  suite.cellClick(puzzle, "a1");

  assert("Cell data after one click").that(puzzle.cells[0][0].data).isEqualTo({color: puzzle.colorSchema.gridColor});
  assert("Cell value after one click").that(puzzle.cells[0][0].getValue()).isNull();
  // Black cells are not submitted, only the loop is checked.
  assert("Submission data with black cell").that(puzzle.collectData()).isEqualTo({});

  suite.cellClick(puzzle, "a1");

  assert("Cell data after two clicks").that(puzzle.cells[0][0].data).isEqualTo({image: 'cross'});
  assert("Cell value after two clicks").that(puzzle.cells[0][0].getValue()).isNull();

  suite.cellClick(puzzle, "a1");

  assert("Cell data after three clicks").that(puzzle.cells[0][0].data).isEqualTo({});
}),

test('Clue cell is not changed by click',(suite) => {
  let puzzle = suite.showPuzzle("yajilin_sum", "4x4", suite.CLUES);
  puzzle.start();

  suite.cellClick(puzzle, "b2");

  assert("Clue cell data after click").that(puzzle.cells[1][1].data).isEqualTo({text: '1', color: puzzle.colorSchema.lightGreyColor});
}),

test('Line can not go through clue cell',(suite) => {
  let puzzle = suite.showPuzzle("yajilin_sum", "4x4", suite.CLUES);
  puzzle.start();

  // To the clue cell b2 and from it.
  suite.drag(puzzle, suite.cellPoint(puzzle, "a2"), suite.cellPoint(puzzle, "b2"));
  suite.drag(puzzle, suite.cellPoint(puzzle, "b2"), suite.cellPoint(puzzle, "b1"));

  assert("Connector a2-b2").that(puzzle.connectors[1][0]['h'].getValue()).isNull();
  assert("Connector b1-b2").that(puzzle.connectors[0][1]['v'].getValue()).isNull();
  assert("Submission data after drags to clue cell").that(puzzle.collectData()).isEqualTo({});

  // Drag along the whole column b connects only the cells below the clue.
  suite.drag(puzzle, suite.cellPoint(puzzle, "b1"), suite.cellPoint(puzzle, "b4"));

  assert("Submission data after drag over clue cell").that(puzzle.collectData()).isEqualTo({"connectors": {"b3-v": "1"}});
}),

test('Line can not go through black cell',(suite) => {
  let puzzle = suite.showPuzzle("yajilin_sum", "4x4", suite.CLUES);
  puzzle.start();

  // Black cell c1.
  suite.cellClick(puzzle, "c1");
  suite.drag(puzzle, suite.cellPoint(puzzle, "b1"), suite.cellPoint(puzzle, "c1"));
  suite.drag(puzzle, suite.cellPoint(puzzle, "c1"), suite.cellPoint(puzzle, "c2"));

  assert("Connector b1-c1").that(puzzle.connectors[0][1]['h'].getValue()).isNull();
  assert("Connector c1-c2").that(puzzle.connectors[0][2]['v'].getValue()).isNull();

  // Drag along the whole first row connects only a1 and b1.
  suite.drag(puzzle, suite.cellPoint(puzzle, "a1"), suite.cellPoint(puzzle, "d1"));

  assert("Submission data after drag over black cell").that(puzzle.collectData()).isEqualTo({"connectors": {"a1-h": "1"}});

  // The cell with cross is not black, so the line can pass it.
  suite.cellClick(puzzle, "c1");
  suite.drag(puzzle, suite.cellPoint(puzzle, "b1"), suite.cellPoint(puzzle, "c1"));

  assert("Cell with cross").that(puzzle.cells[0][2].data).isEqualTo({image: 'cross'});
  assert("Submission data after drag to cell with cross").that(puzzle.collectData()).isEqualTo({"connectors": {"a1-h": "1", "b1-h": "1"}});
}),

test('Black cell removes lines',(suite) => {
  let puzzle = suite.showPuzzle("yajilin_sum", "4x4", suite.CLUES);
  puzzle.start();

  // Lines a4 - d4, d4 - d1 and a branch c4 - c3.
  suite.drawLine(puzzle, "a4", "d4", "d1");
  suite.drag(puzzle, suite.cellPoint(puzzle, "c4"), suite.cellPoint(puzzle, "c3"));

  assert("Lines before click").that(puzzle.collectData()).isEqualTo(
    {"connectors": {"a4-h": "1", "b4-h": "1", "c4-h": "1", "c3-v": "1", "d1-v": "1", "d2-v": "1", "d3-v": "1"}});

  // Cell c4 becomes black, so all the lines from it are removed.
  suite.cellClick(puzzle, "c4");

  assert("Black cell data").that(puzzle.cells[3][2].data).isEqualTo({color: puzzle.colorSchema.gridColor});
  assert("Connector b4-c4 after click").that(puzzle.connectors[3][1]['h'].data).isEqualTo({});
  assert("Connector c4-d4 after click").that(puzzle.connectors[3][2]['h'].data).isEqualTo({});
  assert("Connector c3-c4 after click").that(puzzle.connectors[2][2]['v'].data).isEqualTo({});
  assert("Lines after click").that(puzzle.collectData()).isEqualTo(
    {"connectors": {"a4-h": "1", "d1-v": "1", "d2-v": "1", "d3-v": "1"}});

  // The lines are not restored when the cell is switched to cross and to empty.
  suite.cellClick(puzzle, "c4");
  suite.cellClick(puzzle, "c4");

  assert("Cell data after three clicks").that(puzzle.cells[3][2].data).isEqualTo({});
  assert("Lines after three clicks").that(puzzle.collectData()).isEqualTo(
    {"connectors": {"a4-h": "1", "d1-v": "1", "d2-v": "1", "d3-v": "1"}});
}),

test('Undo of black cell restores lines',(suite) => {
  let puzzle = suite.showPuzzle("yajilin_sum", "4x4", suite.CLUES);
  puzzle.start();

  suite.drawLine(puzzle, "a1", "d1");
  suite.cellClick(puzzle, "c1");

  assert("Lines after click").that(puzzle.collectData()).isEqualTo({"connectors": {"a1-h": "1"}});

  // Single undo reverts both the black cell and the lines removed by it.
  puzzle.revertStep();

  assert("Cell data after undo").that(puzzle.cells[0][2].data).isEqualTo({});
  assert("Lines after undo").that(puzzle.collectData()).isEqualTo({"connectors": {"a1-h": "1", "b1-h": "1", "c1-h": "1"}});
}),

test('Process clicks to edge',(suite) => {
  let puzzle = suite.showPuzzle("yajilin_sum", "4x4", suite.CLUES);
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

// Data collector tests
test('Data collector',(suite) => {
  let puzzle = suite.showPuzzle("yajilin_sum", "4x4", suite.CLUES);
  puzzle.start();

  // Marks which are not submitted: cross in the cell b1 (two clicks) and cross on the edge between a2 and b2.
  suite.cellClick(puzzle, "b1");
  suite.cellClick(puzzle, "b1");
  suite.edgeClick(puzzle, "a2-1");
  // Black cells and the whole loop by one drag (only the turning points are listed).
  suite.cellClick(puzzle, "c2");
  suite.drawLine(puzzle, "a1", "d1", "d4", "c4", "c3", "b3", "b4", "a4", "a1");

  assert("Submission data").that(puzzle.collectData()).isEqualTo({"connectors": {
    "a1-h": "1", "b1-h": "1", "c1-h": "1", "b3-h": "1", "a4-h": "1", "c4-h": "1", "a1-v": "1", "d1-v": "1",
    "a2-v": "1", "d2-v": "1", "a3-v": "1", "b3-v": "1", "c3-v": "1", "d3-v": "1"}});
}),

test('Author chooser',(suite) => {
  let puzzle = suite.showPuzzle("yajilin_sum", "4x4");
  puzzle.edit();

  assert("Cell data before choice").that(puzzle.cells[1][1].data).isEqualTo({});

  // Chooser items are: empty, grey, 0, 1, ..., 15.
  puzzle.cells[1][1].switchOnChooser(3);

  assert("Cell value after choice").that(puzzle.cells[1][1].getValue()).isEqualTo("1");
  assert("Cell data after choice").that(puzzle.cells[1][1].data).isEqualTo({text: '1', color: puzzle.colorSchema.lightGreyColor, returnValue: '1'});

  puzzle.cells[1][1].switchOnChooser(17);

  assert("Cell value after choice of the last item").that(puzzle.cells[1][1].getValue()).isEqualTo("15");
  assert("Cell data after choice of the last item").that(puzzle.cells[1][1].data).isEqualTo({text: '15', color: puzzle.colorSchema.lightGreyColor, returnValue: '15'});

  puzzle.cells[1][1].switchOnChooser(1);

  assert("Cell value after choice of grey").that(puzzle.cells[1][1].getValue()).isEqualTo("grey");
  assert("Cell data after choice of grey").that(puzzle.cells[1][1].data).isEqualTo({color: puzzle.colorSchema.lightGreyColor, returnValue: 'grey'});

  puzzle.cells[1][1].switchOnChooser(0);

  assert("Cell value after clearing").that(puzzle.cells[1][1].getValue()).isNull();
  assert("Cell data after clearing").that(puzzle.cells[1][1].data).isEqualTo({});
}),

test('Author data collector',(suite) => {
  let puzzle = suite.showPuzzle("yajilin_sum", "4x4");
  puzzle.edit();

  puzzle.cells[1][1].switchOnChooser(3);

  assert("Puzzle data").that(puzzle.collectData()).isEqualTo({"b2": "1"});

  // Grey cell without clue and zero.
  puzzle.cells[0][3].switchOnChooser(1);
  puzzle.cells[3][0].switchOnChooser(2);

  assert("Puzzle data with three clues").that(puzzle.collectData()).isEqualTo({"b2": "1", "d1": "grey", "a4": "0"});
}),

);
