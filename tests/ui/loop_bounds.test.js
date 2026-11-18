loopBoundsTestSuite = uiTestSuite("Loop Bounds", "squarepuzzle", "squarePuzzleType",

// Puzzle 4x4 and its solution:
//   8 . . .      a1 b1 c1 d1       8--+--+--+
//   . . . 2      a2 b2 c2 d2       |        |
//   . . . 6      a3 b3 c3 d3       +  +--+--2
//   . . . .      a4 b4 c4 d4       |  |
//                                  +  +--+--6
//                                  |        |
//                                  +--+--+--+

beforeSuite((suite, cb)=> {
  // Emulates one mouse drag passing through the centers of the given cells, e.g. drawLine(puzzle, "a1", "b1", "b2").
  suite.drawLine = function(puzzle, ...cells) {
    puzzle.controller.onMouseDown(suite.mouseEvent(suite.cellPoint(puzzle, cells[0])));
    for (let i = 1; i < cells.length; i++) {
      puzzle.controller.onMouseMove(suite.mouseEvent(suite.cellPoint(puzzle, cells[i])));
    }
    puzzle.controller.onMouseUp(suite.mouseEvent(suite.cellPoint(puzzle, cells[cells.length - 1])));
  };
  cb();
}),

// Controller definition tests
test('Solver controllers',(suite) => {
  let puzzle = suite.showPuzzle("loop_bounds", "4x4", {"a1": "8", "d2": "2", "d3": "6"});
  puzzle.start();

  assert("Clue cell data").that(puzzle.cells[1][3].data).isEqualTo({text: '2'});
  assert("Clue cell chooser").that(puzzle.cells[1][3].chooserValues).isNull();
  assert("Clue cell click").that(puzzle.cells[1][3].clickSwitch).containsExactly([{text: '2'}, {text: '2', image: 'cross'}, {text: '2', image: 'white_circle'}]);
  assert("Clue cell drag processor").that(puzzle.cells[1][3].dragProcessor).isNotNull();
  assert("Empty cell chooser").that(puzzle.cells[0][1].chooserValues).isNull();
  assert("Empty cell click").that(puzzle.cells[0][1].clickSwitch).containsExactly([{}, {image: 'cross'}, {image: 'white_circle'}]);
  assert("Empty cell drag processor").that(puzzle.cells[0][1].dragProcessor).isNotNull();
  assert("Edge chooser").that(puzzle.edges[0][0][1].chooserValues).isNull();
  assert("Edge click").that(puzzle.edges[0][0][1].clickSwitch).containsExactly([{}, {image: 'cross'}]);
  assert("Edge drag").that(puzzle.edges[0][0][1].dragSwitch).isNull();
  assert("Connector chooser").that(puzzle.connectors[0][0]['h'].chooserValues).isNull();
  assert("Connector click").that(puzzle.connectors[0][0]['h'].clickSwitch).isNull();
  assert("Connector drag").that(puzzle.connectors[0][0]['h'].dragSwitch).containsExactly([{}, {color: puzzle.colorSchema.lineColor, returnValue: '1'}]);
  assert("Vertical connector drag").that(puzzle.connectors[0][0]['v'].dragSwitch).containsExactly([{}, {color: puzzle.colorSchema.lineColor, returnValue: '1'}]);
}),

test('Author controllers',(suite) => {
  let puzzle = suite.showPuzzle("loop_bounds", "4x4");
  puzzle.edit();

  assert("Cell chooser").that(puzzle.cells[0][0].chooserValues).containsAtLeast([{}, {text: '0', returnValue: '0'}, {text: '1', returnValue: '1'}, {text: '99', returnValue: '99'}]);
  assert("Number of items in the cell chooser").that(puzzle.cells[0][0].chooserValues.length).isEqualTo(101);
  assert("Cell click").that(puzzle.cells[0][0].clickSwitch).isNull();
  assert("Cell drag processor").that(puzzle.cells[0][0].dragProcessor).isNull();
  assert("Edge chooser").that(puzzle.edges[0][0][1].chooserValues).isNull();
  assert("Edge click").that(puzzle.edges[0][0][1].clickSwitch).isNull();
  assert("Edge drag").that(puzzle.edges[0][0][1].dragSwitch).isNull();
  assert("Connector drag").that(puzzle.connectors[0][0]['h'].dragSwitch).isNull();
}),

// Mouse processing tests
test('Draw line by drag between cells',(suite) => {
  let puzzle = suite.showPuzzle("loop_bounds", "4x4", {"a1": "8", "d2": "2", "d3": "6"});
  puzzle.start();

  assert("Connector value before drag").that(puzzle.connectors[0][0]['h'].getValue()).isNull();
  assert("Connector data before drag").that(puzzle.connectors[0][0]['h'].data).isEqualTo({});

  // From a1 to b1.
  suite.drag(puzzle, suite.cellPoint(puzzle, "a1"), suite.cellPoint(puzzle, "b1"));

  assert("Horizontal connector value after drag").that(puzzle.connectors[0][0]['h'].getValue()).isEqualTo("1");
  assert("Horizontal connector data after drag").that(puzzle.connectors[0][0]['h'].data).isEqualTo({color: puzzle.colorSchema.lineColor, returnValue: '1'});
  assert("Vertical connector value after drag").that(puzzle.connectors[0][0]['v'].getValue()).isNull();

  // From a2 up to a1.
  suite.drag(puzzle, suite.cellPoint(puzzle, "a2"), suite.cellPoint(puzzle, "a1"));

  assert("Vertical connector value after second drag").that(puzzle.connectors[0][0]['v'].getValue()).isEqualTo("1");
  assert("Vertical connector data after second drag").that(puzzle.connectors[0][0]['v'].data).isEqualTo({color: puzzle.colorSchema.lineColor, returnValue: '1'});
  assert("Submission data").that(puzzle.collectData()).isEqualTo({"connectors": {"a1-h": "1", "a1-v": "1"}});
}),

test('Repeated drag removes the line',(suite) => {
  let puzzle = suite.showPuzzle("loop_bounds", "4x4", {"a1": "8", "d2": "2", "d3": "6"});
  puzzle.start();

  suite.drag(puzzle, suite.cellPoint(puzzle, "a1"), suite.cellPoint(puzzle, "b1"));
  assert("Connector value after drag").that(puzzle.connectors[0][0]['h'].getValue()).isEqualTo("1");

  // The same segment in the opposite direction.
  suite.drag(puzzle, suite.cellPoint(puzzle, "b1"), suite.cellPoint(puzzle, "a1"));

  assert("Connector value after second drag").that(puzzle.connectors[0][0]['h'].getValue()).isNull();
  assert("Connector data after second drag").that(puzzle.connectors[0][0]['h'].data).isEqualTo({});
  assert("Submission data").that(puzzle.collectData()).isEqualTo({});
}),

test('Draw line through several cells by one drag',(suite) => {
  let puzzle = suite.showPuzzle("loop_bounds", "4x4", {"a1": "8", "d2": "2", "d3": "6"});
  puzzle.start();

  // The mouse goes a4 - b4 - c4 - c3 without releasing the button.
  suite.drawLine(puzzle, "a4", "b4", "c4", "c3");

  assert("Connector a4-b4").that(puzzle.connectors[3][0]['h'].getValue()).isEqualTo("1");
  assert("Connector b4-c4").that(puzzle.connectors[3][1]['h'].getValue()).isEqualTo("1");
  assert("Connector c3-c4").that(puzzle.connectors[2][2]['v'].getValue()).isEqualTo("1");
  assert("Submission data").that(puzzle.collectData()).isEqualTo({"connectors": {"a4-h": "1", "b4-h": "1", "c3-v": "1"}});

  // Single mouse move from a3 to a1 draws the line through a2.
  suite.drag(puzzle, suite.cellPoint(puzzle, "a3"), suite.cellPoint(puzzle, "a1"));

  assert("Connector a1-a2").that(puzzle.connectors[0][0]['v'].getValue()).isEqualTo("1");
  assert("Connector a2-a3").that(puzzle.connectors[1][0]['v'].getValue()).isEqualTo("1");
  assert("Submission data after second drag").that(puzzle.collectData()).isEqualTo(
    {"connectors": {"a4-h": "1", "b4-h": "1", "c3-v": "1", "a1-v": "1", "a2-v": "1"}});
}),

test('Diagonal drag does not draw lines',(suite) => {
  let puzzle = suite.showPuzzle("loop_bounds", "4x4", {"a1": "8", "d2": "2", "d3": "6"});
  puzzle.start();

  // From a1 to b2.
  suite.drag(puzzle, suite.cellPoint(puzzle, "a1"), suite.cellPoint(puzzle, "b2"));

  assert("Connector a1-b1").that(puzzle.connectors[0][0]['h'].getValue()).isNull();
  assert("Connector a1-a2").that(puzzle.connectors[0][0]['v'].getValue()).isNull();
  assert("Connector a2-b2").that(puzzle.connectors[1][0]['h'].getValue()).isNull();
  assert("Connector b1-b2").that(puzzle.connectors[0][1]['v'].getValue()).isNull();
  assert("Submission data").that(puzzle.collectData()).isEqualTo({});
}),

test('Process clicks to empty cell',(suite) => {
  let puzzle = suite.showPuzzle("loop_bounds", "4x4", {"a1": "8", "d2": "2", "d3": "6"});
  puzzle.start();

  assert("Cell data before click").that(puzzle.cells[0][1].data).isEqualTo({});

  suite.cellClick(puzzle, "b1");

  assert("Cell data after one click").that(puzzle.cells[0][1].data).isEqualTo({image: 'cross'});
  // Marks in the cells are solver's notes, they are not submitted.
  assert("Submission data after one click").that(puzzle.collectData()).isEqualTo({});

  suite.cellClick(puzzle, "b1");

  assert("Cell data after two clicks").that(puzzle.cells[0][1].data).isEqualTo({image: 'white_circle'});
  assert("Submission data after two clicks").that(puzzle.collectData()).isEqualTo({});

  suite.cellClick(puzzle, "b1");

  assert("Cell data after three clicks").that(puzzle.cells[0][1].data).isEqualTo({});
}),

test('Process clicks to clue cell',(suite) => {
  let puzzle = suite.showPuzzle("loop_bounds", "4x4", {"a1": "8", "d2": "2", "d3": "6"});
  puzzle.start();

  suite.cellClick(puzzle, "d2");

  // The clue is kept, the mark is added to it.
  assert("Clue cell data after one click").that(puzzle.cells[1][3].data).isEqualTo({text: '2', image: 'cross'});

  suite.cellClick(puzzle, "d2");

  assert("Clue cell data after two clicks").that(puzzle.cells[1][3].data).isEqualTo({text: '2', image: 'white_circle'});
  assert("Submission data after two clicks").that(puzzle.collectData()).isEqualTo({});

  suite.cellClick(puzzle, "d2");

  assert("Clue cell data after three clicks").that(puzzle.cells[1][3].data).isEqualTo({text: '2'});
}),

test('Process clicks to edge',(suite) => {
  let puzzle = suite.showPuzzle("loop_bounds", "4x4", {"a1": "8", "d2": "2", "d3": "6"});
  puzzle.start();

  assert("Edge data before click").that(puzzle.edges[0][0][1].data).isEqualTo({});

  // Click at the edge between a1 and b1.
  suite.edgeClick(puzzle, "a1-1");

  assert("Edge data after click").that(puzzle.edges[0][0][1].data).isEqualTo({image: 'cross'});
  assert("The same edge of the neighbour cell").that(puzzle.edges[0][1][3].data).isEqualTo({image: 'cross'});
  // The cross is a solver's note, it is not submitted and the line is not drawn by click.
  assert("Connector value after click").that(puzzle.connectors[0][0]['h'].getValue()).isNull();
  assert("Submission data after click").that(puzzle.collectData()).isEqualTo({});

  suite.edgeClick(puzzle, "a1-1");

  assert("Edge data after second click").that(puzzle.edges[0][0][1].data).isEqualTo({});
}),

test('Choose number in edit mode',(suite) => {
  let puzzle = suite.showPuzzle("loop_bounds", "4x4");
  puzzle.edit();

  assert("Cell value before choice").that(puzzle.cells[1][1].getValue()).isNull();

  // Item 5 of the chooser is the number 4.
  puzzle.cells[1][1].switchOnChooser(5);

  assert("Cell value after choice").that(puzzle.cells[1][1].getValue()).isEqualTo("4");
  assert("Cell data after choice").that(puzzle.cells[1][1].data).isEqualTo({text: '4', returnValue: '4'});

  // The first item of the chooser clears the cell.
  puzzle.cells[1][1].switchOnChooser(0);

  assert("Cell value after clearing").that(puzzle.cells[1][1].getValue()).isNull();
  assert("Cell data after clearing").that(puzzle.cells[1][1].data).isEqualTo({});
}),

test('Lines can not be drawn in edit mode',(suite) => {
  let puzzle = suite.showPuzzle("loop_bounds", "4x4");
  puzzle.edit();

  suite.drawLine(puzzle, "a4", "b4", "c4");

  assert("Connector a4-b4").that(puzzle.connectors[3][0]['h'].getValue()).isNull();
  assert("Connector b4-c4").that(puzzle.connectors[3][1]['h'].getValue()).isNull();
}),

// Data collector tests
test('Data collector',(suite) => {
  let puzzle = suite.showPuzzle("loop_bounds", "4x4", {"a1": "8", "d2": "2", "d3": "6"});
  puzzle.start();

  // The whole loop is drawn by one drag which starts and ends in a1.
  suite.drawLine(puzzle, "a1", "b1", "c1", "d1", "d2", "c2", "b2", "b3", "c3", "d3", "d4", "c4", "b4", "a4", "a3", "a2", "a1");

  assert("Submission data").that(puzzle.collectData()).isEqualTo(
    {"connectors": {
      "a1-h": "1", "a1-v": "1", "b1-h": "1", "c1-h": "1", "d1-v": "1", "a2-v": "1", "b2-h": "1", "b2-v": "1",
      "c2-h": "1", "a3-v": "1", "b3-h": "1", "c3-h": "1", "d3-v": "1", "a4-h": "1", "b4-h": "1", "c4-h": "1"}});
}),

test('Author data collector',(suite) => {
  let puzzle = suite.showPuzzle("loop_bounds", "4x4");
  puzzle.edit();

  // Numbers are chosen by the index of the chooser item: 8 in a1, 2 in d2, 6 in d3.
  puzzle.cells[0][0].switchOnChooser(9);
  puzzle.cells[1][3].switchOnChooser(3);
  puzzle.cells[2][3].switchOnChooser(7);

  assert("Puzzle data").that(puzzle.collectData()).isEqualTo({"a1": "8", "d2": "2", "d3": "6"});
}),

);
