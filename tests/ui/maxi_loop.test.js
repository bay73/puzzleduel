maxiLoopTestSuite = uiTestSuite("Maxi Loop", "squarepuzzle", "squarePuzzleType",

beforeSuite((suite, cb)=> {
  // Emulates one mouse drag which passes through the centers of the given cells.
  suite.drawLine = function(puzzle, ...cells) {
    puzzle.controller.onMouseDown(suite.mouseEvent(suite.cellPoint(puzzle, cells[0])));
    cells.slice(1).forEach(cell => puzzle.controller.onMouseMove(suite.mouseEvent(suite.cellPoint(puzzle, cell))));
    puzzle.controller.onMouseUp(suite.mouseEvent(suite.cellPoint(puzzle, cells[cells.length - 1])));
  };
  suite.AREAS = [["a1","b1","a2","b2"], ["c1","d1","c2","d2"], ["a3","b3","a4","b4"], ["c3","d3","c4","d4"]];
  suite.CLUES = {"areas": suite.AREAS, "a1": "3", "d2": "4", "a3": "3"};
  cb();
}),

// Puzzle 4x4 used in the tests (four areas 2x2, the number is shown in the corner of a cell) and its solution:
//   3 . | . .     +-------+
//   . . | . 4     | +-----+
//   ----+----     | +-----+
//   3 . | . .     |       |
//   . . | . .     +-------+

// Controller definition tests
test('Solver controllers',(suite) => {
  let puzzle = suite.showPuzzle("maxi_loop", "4x4", suite.CLUES);
  puzzle.start();

  assert("Clue cell data").that(puzzle.cells[0][0].data).isEqualTo({text: '3'});
  assert("Clue cell chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("Clue cell click").that(puzzle.cells[0][0].clickSwitch).containsExactly(
    [{text: '3'}, {text: '3', image: 'cross'}, {text: '3', image: 'white_circle'}]);
  assert("Clue cell drag processor").that(puzzle.cells[0][0].dragProcessor).isNotNull();
  assert("Empty cell chooser").that(puzzle.cells[1][1].chooserValues).isNull();
  assert("Empty cell click").that(puzzle.cells[1][1].clickSwitch).containsExactly([{}, {image: 'cross'}, {image: 'white_circle'}]);
  assert("Empty cell drag processor").that(puzzle.cells[1][1].dragProcessor).isNotNull();
  assert("Connector click").that(puzzle.connectors[0][0]['h'].clickSwitch).isNull();
  assert("Connector drag").that(puzzle.connectors[0][0]['h'].dragSwitch).containsExactly([{}, {color: puzzle.colorSchema.lineColor, returnValue: '1'}]);
  assert("Vertical connector drag").that(puzzle.connectors[0][0]['v'].dragSwitch).containsExactly([{}, {color: puzzle.colorSchema.lineColor, returnValue: '1'}]);
  assert("Area border data").that(puzzle.edges[0][1][1].data).isEqualTo({color: puzzle.colorSchema.gridColor});
  assert("Area border click").that(puzzle.edges[0][1][1].clickSwitch).containsExactly(
    [{color: puzzle.colorSchema.gridColor}, {color: puzzle.colorSchema.gridColor, image: 'cross'}]);
  assert("Edge inside area data").that(puzzle.edges[0][0][1].data).isEqualTo({});
  assert("Edge inside area chooser").that(puzzle.edges[0][0][1].chooserValues).isNull();
  assert("Edge inside area click").that(puzzle.edges[0][0][1].clickSwitch).containsExactly([{}, {image: 'cross'}]);
  assert("Edge inside area drag").that(puzzle.edges[0][0][1].dragSwitch).isNull();
}),

test('Author controllers',(suite) => {
  let puzzle = suite.showPuzzle("maxi_loop", "4x4");
  puzzle.edit();

  assert("Cell chooser").that(puzzle.cells[0][0].chooserValues).containsAtLeast(
    [{}, {text: '1', returnValue: '1'}, {text: '2', returnValue: '2'}, {text: '99', returnValue: '99'}]);
  assert("Number of items in the cell chooser").that(puzzle.cells[0][0].chooserValues.length).isEqualTo(100);
  assert("Cell click").that(puzzle.cells[0][0].clickSwitch).isNull();
  assert("Edge chooser").that(puzzle.edges[0][0][1].chooserValues).isNull();
  assert("Edge click").that(puzzle.edges[0][0][1].clickSwitch).containsExactly([{}, {color: puzzle.colorSchema.gridColor, returnValue: 'bold'}]);
  assert("Edge drag").that(puzzle.edges[0][0][1].dragSwitch).containsExactly([{}, {color: puzzle.colorSchema.gridColor, returnValue: 'bold'}]);
  assert("Connector click").that(puzzle.connectors[0][0]['h'].clickSwitch).isNull();
  assert("Connector drag").that(puzzle.connectors[0][0]['h'].dragSwitch).isNull();
}),

// Mouse processing tests
test('Draw and erase line by drag between cells',(suite) => {
  let puzzle = suite.showPuzzle("maxi_loop", "4x4", suite.CLUES);
  puzzle.start();

  assert("Connector value before drag").that(puzzle.connectors[0][0]['h'].getValue()).isNull();
  assert("Connector data before drag").that(puzzle.connectors[0][0]['h'].data).isEqualTo({});

  // From the cell with number a1 to b1.
  suite.drag(puzzle, suite.cellPoint(puzzle, "a1"), suite.cellPoint(puzzle, "b1"));

  assert("Connector value after drag").that(puzzle.connectors[0][0]['h'].getValue()).isEqualTo("1");
  assert("Connector data after drag").that(puzzle.connectors[0][0]['h'].data).isEqualTo({color: puzzle.colorSchema.lineColor, returnValue: '1'});
  assert("Clue cell data after drag").that(puzzle.cells[0][0].data).isEqualTo({text: '3'});

  // The line crosses the area border between b1 and c1.
  suite.drag(puzzle, suite.cellPoint(puzzle, "b1"), suite.cellPoint(puzzle, "c1"));

  assert("Connector over area border").that(puzzle.connectors[0][1]['h'].getValue()).isEqualTo("1");
  assert("Area border after drag").that(puzzle.edges[0][1][1].data).isEqualTo({color: puzzle.colorSchema.gridColor});

  // Second drag over the line erases it.
  suite.drag(puzzle, suite.cellPoint(puzzle, "b1"), suite.cellPoint(puzzle, "a1"));

  assert("Connector value after second drag").that(puzzle.connectors[0][0]['h'].getValue()).isNull();
  assert("Connector data after second drag").that(puzzle.connectors[0][0]['h'].data).isEqualTo({});
  assert("Connector over area border after second drag").that(puzzle.connectors[0][1]['h'].getValue()).isEqualTo("1");
}),

test('Draw line through several cells by one drag',(suite) => {
  let puzzle = suite.showPuzzle("maxi_loop", "4x4", suite.CLUES);
  puzzle.start();

  // Single mouse move along the whole column a.
  suite.drag(puzzle, suite.cellPoint(puzzle, "a1"), suite.cellPoint(puzzle, "a4"));

  assert("Line after straight drag").that(puzzle.collectData()).isEqualTo({"connectors": {"a1-v": "1", "a2-v": "1", "a3-v": "1"}});

  // Drag with turns: b2 - c2 - c3 - d3.
  suite.drawLine(puzzle, "b2", "c2", "c3", "d3");

  assert("Line after drag with turns").that(puzzle.collectData()).isEqualTo(
    {"connectors": {"a1-v": "1", "a2-v": "1", "a3-v": "1", "b2-h": "1", "c2-v": "1", "c3-h": "1"}});
}),

test('Process clicks to empty cell',(suite) => {
  let puzzle = suite.showPuzzle("maxi_loop", "4x4", suite.CLUES);
  puzzle.start();

  assert("Cell data before click").that(puzzle.cells[1][1].data).isEqualTo({});

  suite.cellClick(puzzle, "b2");

  assert("Cell data after one click").that(puzzle.cells[1][1].data).isEqualTo({image: 'cross'});
  assert("Cell value after one click").that(puzzle.cells[1][1].getValue()).isNull();

  suite.cellClick(puzzle, "b2");

  assert("Cell data after two clicks").that(puzzle.cells[1][1].data).isEqualTo({image: 'white_circle'});
  assert("Cell value after two clicks").that(puzzle.cells[1][1].getValue()).isNull();
  // Marks in the cells are not submitted.
  assert("Submission data with the mark").that(puzzle.collectData()).isEqualTo({});

  suite.cellClick(puzzle, "b2");

  assert("Cell data after three clicks").that(puzzle.cells[1][1].data).isEqualTo({});
}),

test('Process clicks to clue cell',(suite) => {
  let puzzle = suite.showPuzzle("maxi_loop", "4x4", suite.CLUES);
  puzzle.start();

  // The number is kept when solver marks the cell.
  suite.cellClick(puzzle, "a1");

  assert("Clue cell data after one click").that(puzzle.cells[0][0].data).isEqualTo({text: '3', image: 'cross'});

  suite.cellClick(puzzle, "a1");

  assert("Clue cell data after two clicks").that(puzzle.cells[0][0].data).isEqualTo({text: '3', image: 'white_circle'});
  assert("Submission data with the mark").that(puzzle.collectData()).isEqualTo({});

  suite.cellClick(puzzle, "a1");

  assert("Clue cell data after three clicks").that(puzzle.cells[0][0].data).isEqualTo({text: '3'});
}),

test('Process clicks to edge',(suite) => {
  let puzzle = suite.showPuzzle("maxi_loop", "4x4", suite.CLUES);
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
  let puzzle = suite.showPuzzle("maxi_loop", "4x4", suite.CLUES);
  puzzle.start();

  // The whole loop by one drag, only the turning points are listed.
  suite.drawLine(puzzle, "a1", "d1", "d2", "b2", "b3", "d3", "d4", "a4", "a1");
  // Marks which are not submitted.
  suite.cellClick(puzzle, "a1");
  suite.cellClick(puzzle, "c2");
  suite.edgeClick(puzzle, "a2-1");

  assert("Submission data").that(puzzle.collectData()).isEqualTo({"connectors": {
    "a1-h": "1", "b1-h": "1", "c1-h": "1", "d1-v": "1", "c2-h": "1", "b2-h": "1", "b2-v": "1", "b3-h": "1",
    "c3-h": "1", "d3-v": "1", "c4-h": "1", "b4-h": "1", "a4-h": "1", "a3-v": "1", "a2-v": "1", "a1-v": "1"}});
}),

test('Author chooser',(suite) => {
  let puzzle = suite.showPuzzle("maxi_loop", "4x4");
  puzzle.edit();

  assert("Cell data before choice").that(puzzle.cells[0][0].data).isEqualTo({});

  // Chooser items are: empty, 1, 2, 3, ...
  puzzle.cells[0][0].switchOnChooser(3);

  assert("Cell value after choice").that(puzzle.cells[0][0].getValue()).isEqualTo("3");
  assert("Cell data after choice").that(puzzle.cells[0][0].data).isEqualTo({text: '3', returnValue: '3'});

  puzzle.cells[0][0].switchOnChooser(0);

  assert("Cell value after clearing").that(puzzle.cells[0][0].getValue()).isNull();
  assert("Cell data after clearing").that(puzzle.cells[0][0].data).isEqualTo({});
}),

test('Author clicks to edge',(suite) => {
  let puzzle = suite.showPuzzle("maxi_loop", "4x4");
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
  let puzzle = suite.showPuzzle("maxi_loop", "4x4");
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
  let puzzle = suite.showPuzzle("maxi_loop", "4x4");
  puzzle.edit();

  // Vertical border by clicks, horizontal one by drag.
  suite.edgeClick(puzzle, "b1-1");
  suite.edgeClick(puzzle, "b2-1");
  suite.edgeClick(puzzle, "b3-1");
  suite.edgeClick(puzzle, "b4-1");
  suite.drag(puzzle, suite.gridPoint(puzzle, 0, 2), suite.gridPoint(puzzle, 4, 2));
  puzzle.cells[0][0].switchOnChooser(3);
  puzzle.cells[1][3].switchOnChooser(4);
  puzzle.cells[2][0].switchOnChooser(3);

  assert("Puzzle data").that(puzzle.collectData()).isEqualTo({"areas": suite.AREAS, "a1": "3", "d2": "4", "a3": "3"});
}),

);
