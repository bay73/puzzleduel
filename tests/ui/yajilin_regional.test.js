yajilinRegionalTestSuite = uiTestSuite("Regional Yajilin", "squarepuzzle", "squarePuzzleType",

beforeSuite((suite, cb)=> {
  // Emulates one mouse drag which passes through the centers of the given cells.
  suite.drawLine = function(puzzle, ...cells) {
    puzzle.controller.onMouseDown(suite.mouseEvent(suite.cellPoint(puzzle, cells[0])));
    cells.slice(1).forEach(cell => puzzle.controller.onMouseMove(suite.mouseEvent(suite.cellPoint(puzzle, cell))));
    puzzle.controller.onMouseUp(suite.mouseEvent(suite.cellPoint(puzzle, cells[cells.length - 1])));
  };
  suite.AREAS = [["a1", "b1", "a2", "b2"], ["c1", "d1", "c2", "d2"], ["a3", "b3", "a4", "b4"], ["c3", "d3", "c4", "d4"]];
  suite.CLUES = {"areas": suite.AREAS, "a1": "1", "c1": "1", "a3": "0"};
  cb();
}),

// Puzzle 4x4 used in the tests (four areas 2x2, the number in the corner of a cell is the number
// of black cells in the area) and its solution (# - black cell):
//   1 . | 1 .       # +---+
//   . . | . .       +-+ # |
//   ----+----       | +-+ |
//   0 . | . .       +-+ +-+
//   . . | . .

// Controller definition tests
test('Solver controllers',(suite) => {
  let puzzle = suite.showPuzzle("yajilin_regional", "4x4", suite.CLUES);
  puzzle.start();

  let black = puzzle.colorSchema.gridColor;
  let shaded = puzzle.colorSchema.clueColor;
  assert("Clue cell data").that(puzzle.cells[0][0].data).isEqualTo({text: '1', textColor: black});
  assert("Clue cell chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  // The cell with number can be shaded as well, the number is kept.
  assert("Clue cell click").that(puzzle.cells[0][0].clickSwitch).containsExactly(
    [{text: '1', textColor: black}, {text: '1', textColor: black, color: shaded}, {text: '1', textColor: black, image: 'cross'}]);
  assert("Clue cell drag processor").that(puzzle.cells[0][0].dragProcessor).isNotNull();
  assert("Empty cell chooser").that(puzzle.cells[1][1].chooserValues).isNull();
  assert("Empty cell click").that(puzzle.cells[1][1].clickSwitch).containsExactly([{}, {color: shaded}, {image: 'cross'}]);
  assert("Empty cell drag processor").that(puzzle.cells[1][1].dragProcessor).isNotNull();
  assert("Connector click").that(puzzle.connectors[0][0]['h'].clickSwitch).isNull();
  assert("Connector drag").that(puzzle.connectors[0][0]['h'].dragSwitch).containsExactly([{}, {color: puzzle.colorSchema.lineColor, returnValue: '1'}]);
  assert("Vertical connector drag").that(puzzle.connectors[0][0]['v'].dragSwitch).containsExactly([{}, {color: puzzle.colorSchema.lineColor, returnValue: '1'}]);
  assert("Area border data").that(puzzle.edges[0][1][1].data).isEqualTo({color: black});
  assert("Area border click").that(puzzle.edges[0][1][1].clickSwitch).containsExactly([{color: black}, {color: black, image: 'cross'}]);
  assert("Edge inside area data").that(puzzle.edges[0][0][1].data).isEqualTo({});
  assert("Edge inside area chooser").that(puzzle.edges[0][0][1].chooserValues).isNull();
  assert("Edge inside area click").that(puzzle.edges[0][0][1].clickSwitch).containsExactly([{}, {image: 'cross'}]);
  assert("Edge inside area drag").that(puzzle.edges[0][0][1].dragSwitch).isNull();
}),

test('Author controllers',(suite) => {
  let puzzle = suite.showPuzzle("yajilin_regional", "4x4");
  puzzle.edit();

  let numberItem = function(number) {
    return {text: number, textColor: puzzle.colorSchema.gridColor, returnValue: number};
  }
  assert("Cell chooser").that(puzzle.cells[0][0].chooserValues).containsAtLeast([{}, numberItem('0'), numberItem('1'), numberItem('20')]);
  // Empty cell and numbers from 0 to 20.
  assert("Number of items in the cell chooser").that(puzzle.cells[0][0].chooserValues.length).isEqualTo(22);
  assert("Cell click").that(puzzle.cells[0][0].clickSwitch).isNull();
  assert("Edge chooser").that(puzzle.edges[0][0][1].chooserValues).isNull();
  assert("Edge click").that(puzzle.edges[0][0][1].clickSwitch).containsExactly([{}, {color: puzzle.colorSchema.gridColor, returnValue: 'bold'}]);
  assert("Edge drag").that(puzzle.edges[0][0][1].dragSwitch).containsExactly([{}, {color: puzzle.colorSchema.gridColor, returnValue: 'bold'}]);
  assert("Connector click").that(puzzle.connectors[0][0]['h'].clickSwitch).isNull();
  assert("Connector drag").that(puzzle.connectors[0][0]['h'].dragSwitch).isNull();
}),

// Mouse processing tests
test('Draw and erase line by drag between cells',(suite) => {
  let puzzle = suite.showPuzzle("yajilin_regional", "4x4", suite.CLUES);
  puzzle.start();

  assert("Connector value before drag").that(puzzle.connectors[1][0]['h'].getValue()).isNull();
  assert("Connector data before drag").that(puzzle.connectors[1][0]['h'].data).isEqualTo({});

  suite.drag(puzzle, suite.cellPoint(puzzle, "a2"), suite.cellPoint(puzzle, "b2"));

  assert("Connector value after drag").that(puzzle.connectors[1][0]['h'].getValue()).isEqualTo("1");
  assert("Connector data after drag").that(puzzle.connectors[1][0]['h'].data).isEqualTo({color: puzzle.colorSchema.lineColor, returnValue: '1'});

  // The line crosses the area border between a2 and a3.
  suite.drag(puzzle, suite.cellPoint(puzzle, "a2"), suite.cellPoint(puzzle, "a3"));

  assert("Connector over area border").that(puzzle.connectors[1][0]['v'].getValue()).isEqualTo("1");
  assert("Area border after drag").that(puzzle.edges[1][0][2].data).isEqualTo({color: puzzle.colorSchema.gridColor});

  // Second drag over the line erases it.
  suite.drag(puzzle, suite.cellPoint(puzzle, "b2"), suite.cellPoint(puzzle, "a2"));

  assert("Connector value after second drag").that(puzzle.connectors[1][0]['h'].getValue()).isNull();
  assert("Connector data after second drag").that(puzzle.connectors[1][0]['h'].data).isEqualTo({});
  assert("Connector over area border after second drag").that(puzzle.connectors[1][0]['v'].getValue()).isEqualTo("1");
}),

test('Draw line through several cells by one drag',(suite) => {
  let puzzle = suite.showPuzzle("yajilin_regional", "4x4", suite.CLUES);
  puzzle.start();

  // Single mouse move along the whole column d.
  suite.drag(puzzle, suite.cellPoint(puzzle, "d1"), suite.cellPoint(puzzle, "d4"));

  assert("Line after straight drag").that(puzzle.collectData()).isEqualTo({"connectors": {"d1-v": "1", "d2-v": "1", "d3-v": "1"}});

  // Drag with turns: a2 - b2 - b3 - c3.
  suite.drawLine(puzzle, "a2", "b2", "b3", "c3");

  assert("Line after drag with turns").that(puzzle.collectData()).isEqualTo(
    {"connectors": {"d1-v": "1", "d2-v": "1", "d3-v": "1", "a2-h": "1", "b2-v": "1", "b3-h": "1"}});
}),

test('Line can go through the cell with number',(suite) => {
  let puzzle = suite.showPuzzle("yajilin_regional", "4x4", suite.CLUES);
  puzzle.start();

  // The number is a clue for the area, its cell is an ordinary one.
  suite.drawLine(puzzle, "b1", "c1", "d1");

  assert("Connector b1-c1").that(puzzle.connectors[0][1]['h'].getValue()).isEqualTo("1");
  assert("Connector c1-d1").that(puzzle.connectors[0][2]['h'].getValue()).isEqualTo("1");
  assert("Clue cell data after drag").that(puzzle.cells[0][2].data).isEqualTo({text: '1', textColor: puzzle.colorSchema.gridColor});
}),

test('Process clicks to empty cell',(suite) => {
  let puzzle = suite.showPuzzle("yajilin_regional", "4x4", suite.CLUES);
  puzzle.start();

  assert("Cell data before click").that(puzzle.cells[1][2].data).isEqualTo({});

  suite.cellClick(puzzle, "c2");

  assert("Cell data after one click").that(puzzle.cells[1][2].data).isEqualTo({color: puzzle.colorSchema.clueColor});
  assert("Cell value after one click").that(puzzle.cells[1][2].getValue()).isNull();
  // Shaded cells are not submitted, only the loop is checked.
  assert("Submission data with shaded cell").that(puzzle.collectData()).isEqualTo({});

  suite.cellClick(puzzle, "c2");

  assert("Cell data after two clicks").that(puzzle.cells[1][2].data).isEqualTo({image: 'cross'});
  assert("Cell value after two clicks").that(puzzle.cells[1][2].getValue()).isNull();

  suite.cellClick(puzzle, "c2");

  assert("Cell data after three clicks").that(puzzle.cells[1][2].data).isEqualTo({});
}),

test('Process clicks to clue cell',(suite) => {
  let puzzle = suite.showPuzzle("yajilin_regional", "4x4", suite.CLUES);
  puzzle.start();

  let black = puzzle.colorSchema.gridColor;

  suite.cellClick(puzzle, "a1");

  assert("Clue cell data after one click").that(puzzle.cells[0][0].data).isEqualTo({text: '1', textColor: black, color: puzzle.colorSchema.clueColor});

  suite.cellClick(puzzle, "a1");

  assert("Clue cell data after two clicks").that(puzzle.cells[0][0].data).isEqualTo({text: '1', textColor: black, image: 'cross'});
  assert("Submission data with the mark").that(puzzle.collectData()).isEqualTo({});

  suite.cellClick(puzzle, "a1");

  assert("Clue cell data after three clicks").that(puzzle.cells[0][0].data).isEqualTo({text: '1', textColor: black});
}),

test('Process clicks to edge',(suite) => {
  let puzzle = suite.showPuzzle("yajilin_regional", "4x4", suite.CLUES);
  puzzle.start();

  // Edge inside the area: between a1 and b1.
  suite.edgeClick(puzzle, "a1-1");

  assert("Edge data after click").that(puzzle.edges[0][0][1].data).isEqualTo({image: 'cross'});

  // Area border between b1 and c1 stays bold.
  suite.edgeClick(puzzle, "b1-1");

  assert("Area border data after click").that(puzzle.edges[0][1][1].data).isEqualTo({color: puzzle.colorSchema.gridColor, image: 'cross'});
  // The crosses are solver's marks only.
  assert("Submission data with the crosses").that(puzzle.collectData()).isEqualTo({});

  suite.edgeClick(puzzle, "a1-1");
  suite.edgeClick(puzzle, "b1-1");

  assert("Edge data after second click").that(puzzle.edges[0][0][1].data).isEqualTo({});
  assert("Area border data after second click").that(puzzle.edges[0][1][1].data).isEqualTo({color: puzzle.colorSchema.gridColor});
}),

// Data collector tests
test('Data collector',(suite) => {
  let puzzle = suite.showPuzzle("yajilin_regional", "4x4", suite.CLUES);
  puzzle.start();

  // Shaded cells a1 and c2, cross in the cell a3 (two clicks) and on the edge between c3 and d3.
  suite.cellClick(puzzle, "a1");
  suite.cellClick(puzzle, "c2");
  suite.cellClick(puzzle, "a3");
  suite.cellClick(puzzle, "a3");
  suite.edgeClick(puzzle, "c3-1");
  // The whole loop by one drag, only the turning points are listed.
  suite.drawLine(puzzle, "b1", "d1", "d4", "c4", "c3", "b3", "b4", "a4", "a2", "b2", "b1");

  assert("Submission data").that(puzzle.collectData()).isEqualTo({"connectors": {
    "b1-h": "1", "c1-h": "1", "a2-h": "1", "b3-h": "1", "a4-h": "1", "c4-h": "1", "b1-v": "1", "d1-v": "1",
    "a2-v": "1", "d2-v": "1", "a3-v": "1", "b3-v": "1", "c3-v": "1", "d3-v": "1"}});
}),

test('Author chooser',(suite) => {
  let puzzle = suite.showPuzzle("yajilin_regional", "4x4");
  puzzle.edit();

  assert("Cell data before choice").that(puzzle.cells[0][0].data).isEqualTo({});

  // Chooser items are: empty, 0, 1, ..., 20.
  puzzle.cells[0][0].switchOnChooser(2);

  assert("Cell value after choice").that(puzzle.cells[0][0].getValue()).isEqualTo("1");
  assert("Cell data after choice").that(puzzle.cells[0][0].data).isEqualTo({text: '1', textColor: puzzle.colorSchema.gridColor, returnValue: '1'});

  puzzle.cells[0][0].switchOnChooser(0);

  assert("Cell value after clearing").that(puzzle.cells[0][0].getValue()).isNull();
  assert("Cell data after clearing").that(puzzle.cells[0][0].data).isEqualTo({});
}),

test('Author clicks to edge',(suite) => {
  let puzzle = suite.showPuzzle("yajilin_regional", "4x4");
  puzzle.edit();

  assert("Edge data before click").that(puzzle.edges[0][1][1].data).isEqualTo({});
  assert("Single area without borders").that(puzzle.collectData().areas.length).isEqualTo(1);

  // Edge between b1 and c1.
  suite.edgeClick(puzzle, "b1-1");

  assert("Edge value after click").that(puzzle.edges[0][1][1].getValue()).isEqualTo("bold");
  assert("Edge data after click").that(puzzle.edges[0][1][1].data).isEqualTo({color: puzzle.colorSchema.gridColor, returnValue: 'bold'});

  suite.edgeClick(puzzle, "b1-1");

  assert("Edge value after second click").that(puzzle.edges[0][1][1].getValue()).isNull();
  assert("Edge data after second click").that(puzzle.edges[0][1][1].data).isEqualTo({});
}),

test('Author draws area borders by drag',(suite) => {
  let puzzle = suite.showPuzzle("yajilin_regional", "4x4");
  puzzle.edit();

  // Drag along the bottom edge of the cell a2.
  suite.drag(puzzle, suite.gridPoint(puzzle, 0, 2), suite.gridPoint(puzzle, 1, 2));

  assert("Edge value after drag").that(puzzle.edges[1][0][2].getValue()).isEqualTo("bold");
  assert("Edge data after drag").that(puzzle.edges[1][0][2].data).isEqualTo({color: puzzle.colorSchema.gridColor, returnValue: 'bold'});
  assert("Next edge value after drag").that(puzzle.edges[1][1][2].getValue()).isNull();

  // Drag along the whole vertical line between columns b and c.
  suite.drag(puzzle, suite.gridPoint(puzzle, 2, 0), suite.gridPoint(puzzle, 2, 4));

  assert("Edges after long drag").that(["b1-1", "b2-1", "b3-1", "b4-1"].map((edge, row) => puzzle.edges[row][1][1].getValue()))
    .isEqualTo(["bold", "bold", "bold", "bold"]);
  assert("Puzzle data after long drag").that(puzzle.collectData()).isEqualTo(
    {"areas": [["a1","b1","a2","b2","a3","b3","a4","b4"], ["c1","d1","c2","d2","c3","d3","c4","d4"]]});
}),

test('Author data collector',(suite) => {
  let puzzle = suite.showPuzzle("yajilin_regional", "4x4");
  puzzle.edit();

  // Vertical border by clicks, horizontal one by drag.
  suite.edgeClick(puzzle, "b1-1");
  suite.edgeClick(puzzle, "b2-1");
  suite.edgeClick(puzzle, "b3-1");
  suite.edgeClick(puzzle, "b4-1");
  suite.drag(puzzle, suite.gridPoint(puzzle, 0, 2), suite.gridPoint(puzzle, 4, 2));
  puzzle.cells[0][0].switchOnChooser(2);
  puzzle.cells[0][2].switchOnChooser(2);
  puzzle.cells[2][0].switchOnChooser(1);

  assert("Puzzle data").that(puzzle.collectData()).isEqualTo({"areas": suite.AREAS, "a1": "1", "c1": "1", "a3": "0"});
}),

);
