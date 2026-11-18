shortestSegmentTestSuite = uiTestSuite("Shortest Segment", "squarepuzzle", "squarePuzzleType",

beforeSuite((suite, cb)=> {
  // Emulates one mouse drag which passes through the centers of the given cells.
  suite.drawLine = function(puzzle, ...cells) {
    puzzle.controller.onMouseDown(suite.mouseEvent(suite.cellPoint(puzzle, cells[0])));
    cells.slice(1).forEach(cell => puzzle.controller.onMouseMove(suite.mouseEvent(suite.cellPoint(puzzle, cell))));
    puzzle.controller.onMouseUp(suite.mouseEvent(suite.cellPoint(puzzle, cells[cells.length - 1])));
  };
  suite.CLUES = {"bottom": [null, "2", null, null], "right": [null, "1", null, null]};
  cb();
}),

// Puzzle 4x4 used in the tests (clues are below and to the right of the grid) and its solution:
//   . . . .       +-----+
//   . . . . 1     | +-+ | 1
//   . . . .       | | | |
//   . . . .       +-+ +-+
//     2             2

// Controller definition tests
test('Solver controllers',(suite) => {
  let puzzle = suite.showPuzzle("shortest_segment", "4x4", suite.CLUES);
  puzzle.start();

  assert("Cell chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("Cell click").that(puzzle.cells[0][0].clickSwitch).isNull();
  assert("Cell drag processor").that(puzzle.cells[0][0].dragProcessor).isNotNull();
  assert("Bottom clue data").that(puzzle.bottom[1].data).isEqualTo({text: '2'});
  assert("Bottom clue chooser").that(puzzle.bottom[1].chooserValues).isNull();
  assert("Bottom clue click").that(puzzle.bottom[1].clickSwitch).isNull();
  assert("Right clue data").that(puzzle.right[1].data).isEqualTo({text: '1'});
  assert("Right clue chooser").that(puzzle.right[1].chooserValues).isNull();
  assert("Right clue click").that(puzzle.right[1].clickSwitch).isNull();
  assert("Empty bottom cell data").that(puzzle.bottom[0].data).isEqualTo({});
  assert("Empty bottom cell click").that(puzzle.bottom[0].clickSwitch).isNull();
  assert("Connector click").that(puzzle.connectors[0][0]['h'].clickSwitch).isNull();
  assert("Connector drag").that(puzzle.connectors[0][0]['h'].dragSwitch).containsExactly([{}, {color: puzzle.colorSchema.lineColor, returnValue: 1}]);
  assert("Vertical connector drag").that(puzzle.connectors[0][0]['v'].dragSwitch).containsExactly([{}, {color: puzzle.colorSchema.lineColor, returnValue: 1}]);
  assert("Edge chooser").that(puzzle.edges[0][0][1].chooserValues).isNull();
  assert("Edge click").that(puzzle.edges[0][0][1].clickSwitch).containsExactly([{}, {image: 'cross'}]);
  assert("Edge drag").that(puzzle.edges[0][0][1].dragSwitch).isNull();
}),

test('Author controllers',(suite) => {
  let puzzle = suite.showPuzzle("shortest_segment", "4x4");
  puzzle.edit();

  let numbers = [{}, {text: '0', returnValue: '0'}, {text: '1', returnValue: '1'}, {text: '2', returnValue: '2'}, {text: '3', returnValue: '3'}];
  // The longest possible segment in the grid 4x4 has length 3.
  assert("Bottom cell chooser").that(puzzle.bottom[0].chooserValues).containsExactly(numbers);
  assert("Bottom cell click").that(puzzle.bottom[0].clickSwitch).isNull();
  assert("Right cell chooser").that(puzzle.right[0].chooserValues).containsExactly(numbers);
  assert("Right cell click").that(puzzle.right[0].clickSwitch).isNull();
  assert("Grid cell chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("Grid cell click").that(puzzle.cells[0][0].clickSwitch).isNull();
  assert("Grid cell drag processor").that(puzzle.cells[0][0].dragProcessor).isNull();
  assert("Edge click").that(puzzle.edges[0][0][1].clickSwitch).isNull();
  assert("Connector click").that(puzzle.connectors[0][0]['h'].clickSwitch).isNull();
  assert("Connector drag").that(puzzle.connectors[0][0]['h'].dragSwitch).isNull();
}),

// Mouse processing tests
test('Draw and erase line by drag between cells',(suite) => {
  let puzzle = suite.showPuzzle("shortest_segment", "4x4", suite.CLUES);
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

test('Draw line through several cells by one drag',(suite) => {
  let puzzle = suite.showPuzzle("shortest_segment", "4x4", suite.CLUES);
  puzzle.start();

  // Single mouse move along the whole column d.
  suite.drag(puzzle, suite.cellPoint(puzzle, "d1"), suite.cellPoint(puzzle, "d4"));

  assert("Line after straight drag").that(puzzle.collectData()).isEqualTo({"connectors": {"d1-v": 1, "d2-v": 1, "d3-v": 1}});

  // Drag with turns: a2 - a3 - b3 - b4.
  suite.drawLine(puzzle, "a2", "a3", "b3", "b4");

  assert("Line after drag with turns").that(puzzle.collectData()).isEqualTo(
    {"connectors": {"d1-v": 1, "d2-v": 1, "d3-v": 1, "a2-v": 1, "a3-h": 1, "b3-v": 1}});
}),

test('Cells and clues are not changed by click',(suite) => {
  let puzzle = suite.showPuzzle("shortest_segment", "4x4", suite.CLUES);
  puzzle.start();

  suite.cellClick(puzzle, "a1");
  // Clue below the column b and clue to the right of the second row.
  suite.click(puzzle, suite.cellPoint(puzzle, 1, 4));
  suite.click(puzzle, suite.cellPoint(puzzle, 4, 1));
  // Empty outer cell below the column a.
  suite.click(puzzle, suite.cellPoint(puzzle, 0, 4));

  assert("Cell data after click").that(puzzle.cells[0][0].data).isEqualTo({});
  assert("Bottom clue data after click").that(puzzle.bottom[1].data).isEqualTo({text: '2'});
  assert("Right clue data after click").that(puzzle.right[1].data).isEqualTo({text: '1'});
  assert("Empty bottom cell data after click").that(puzzle.bottom[0].data).isEqualTo({});
  assert("Submission data after clicks").that(puzzle.collectData()).isEqualTo({});
}),

test('Process clicks to edge',(suite) => {
  let puzzle = suite.showPuzzle("shortest_segment", "4x4", suite.CLUES);
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

// Clue cells outside of the grid are not a part of the lines.
test('Drag over outer clue cells draws nothing',(suite) => {
  let puzzle = suite.showPuzzle("shortest_segment", "4x4", suite.CLUES);
  puzzle.start();

  // From the grid cell d4 to the clue cell to the right of it and to the clue cell below it.
  suite.drag(puzzle, suite.cellPoint(puzzle, "d4"), suite.cellPoint(puzzle, 4, 3));
  suite.drag(puzzle, suite.cellPoint(puzzle, "d4"), suite.cellPoint(puzzle, 3, 4));
  // From the clue cells back to the grid.
  suite.drag(puzzle, suite.cellPoint(puzzle, 4, 3), suite.cellPoint(puzzle, "d4"));
  suite.drag(puzzle, suite.cellPoint(puzzle, 3, 4), suite.cellPoint(puzzle, "d4"));
  // Between two clue cells below the grid and between two clue cells to the right of the grid.
  suite.drag(puzzle, suite.cellPoint(puzzle, 0, 4), suite.cellPoint(puzzle, 1, 4));
  suite.drag(puzzle, suite.cellPoint(puzzle, 4, 0), suite.cellPoint(puzzle, 4, 1));

  assert("Submission data").that(puzzle.collectData()).isEqualTo({});
}),

test('Line is kept when the drag leaves the grid',(suite) => {
  let puzzle = suite.showPuzzle("shortest_segment", "4x4", suite.CLUES);
  puzzle.start();

  // One drag from a4 to b4 and then down to the clue cell below the grid.
  puzzle.controller.onMouseDown(suite.mouseEvent(suite.cellPoint(puzzle, "a4")));
  puzzle.controller.onMouseMove(suite.mouseEvent(suite.cellPoint(puzzle, "b4")));
  let dataInGrid = puzzle.collectData();
  let outerPoint = suite.cellPoint(puzzle, 1, 4);
  puzzle.controller.onMouseMove(suite.mouseEvent(outerPoint));
  puzzle.controller.onMouseUp(suite.mouseEvent(outerPoint));

  assert("Connector between a4 and b4").that(puzzle.connectors[3][0]['h'].getValue()).isNotNull();
  assert("Submission data after leaving the grid").that(puzzle.collectData()).isEqualTo(dataInGrid);
}),

// Data collector tests
test('Data collector',(suite) => {
  let puzzle = suite.showPuzzle("shortest_segment", "4x4", suite.CLUES);
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

test('Author chooser',(suite) => {
  let puzzle = suite.showPuzzle("shortest_segment", "4x4");
  puzzle.edit();

  assert("Bottom cell data before choice").that(puzzle.bottom[1].data).isEqualTo({});

  // Chooser items are: empty, 0, 1, 2, 3.
  puzzle.bottom[1].switchOnChooser(3);

  assert("Bottom cell value after choice").that(puzzle.bottom[1].getValue()).isEqualTo("2");
  assert("Bottom cell data after choice").that(puzzle.bottom[1].data).isEqualTo({text: '2', returnValue: '2'});

  puzzle.right[1].switchOnChooser(1);

  assert("Right cell value after choice").that(puzzle.right[1].getValue()).isEqualTo("0");
  assert("Right cell data after choice").that(puzzle.right[1].data).isEqualTo({text: '0', returnValue: '0'});

  puzzle.bottom[1].switchOnChooser(0);

  assert("Bottom cell value after clearing").that(puzzle.bottom[1].getValue()).isNull();
  assert("Bottom cell data after clearing").that(puzzle.bottom[1].data).isEqualTo({});
}),

test('Author can not change grid',(suite) => {
  let puzzle = suite.showPuzzle("shortest_segment", "4x4");
  puzzle.edit();

  suite.cellClick(puzzle, "a1");
  suite.edgeClick(puzzle, "a1-1");
  suite.drag(puzzle, suite.cellPoint(puzzle, "c1"), suite.cellPoint(puzzle, "d1"));

  assert("Cell data after click").that(puzzle.cells[0][0].data).isEqualTo({});
  assert("Edge data after click").that(puzzle.edges[0][0][1].data).isEqualTo({});
  assert("Connector value after drag").that(puzzle.connectors[0][2]['h'].getValue()).isNull();
  assert("Puzzle data").that(puzzle.collectData()).isEqualTo({});
}),

test('Author data collector',(suite) => {
  let puzzle = suite.showPuzzle("shortest_segment", "4x4");
  puzzle.edit();

  puzzle.bottom[1].switchOnChooser(3);
  puzzle.right[1].switchOnChooser(2);

  assert("Puzzle data").that(puzzle.collectData()).isEqualTo({"bottom": [null, "2", null, null], "right": [null, "1", null, null]});

  // Zero is a valid clue and differs from the empty cell. The side without clues is not included to the data.
  puzzle.bottom[0].switchOnChooser(1);
  puzzle.right[1].switchOnChooser(0);

  assert("Puzzle data after changes").that(puzzle.collectData()).isEqualTo({"bottom": ["0", "2", null, null]});
}),

);
