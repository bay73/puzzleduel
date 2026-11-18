alternateLoopTestSuite = uiTestSuite("Alternate Loop", "squarepuzzle", "squarePuzzleType",

// Puzzle 4x4 and its solution (B - black circle, W - white circle):
//   . B . .      +--B--+--+      a1 b1 c1 d1
//   . W . W      +  W--+  W      a2 b2 c2 d2
//   . . . .      +  +  +  +      a3 b3 c3 d3
//   . . B .      +--+  B--+      a4 b4 c4 d4

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
  let puzzle = suite.showPuzzle("alternate_loop", "4x4", {"b1": "black_circle", "d2": "white_circle", "c4": "black_circle", "b2": "white_circle"});
  puzzle.start();

  assert("Clue cell data").that(puzzle.cells[0][1].data).isEqualTo({image: 'black_circle'});
  assert("Clue cell chooser").that(puzzle.cells[0][1].chooserValues).isNull();
  assert("Clue cell click").that(puzzle.cells[0][1].clickSwitch).isNull();
  assert("Clue cell drag processor").that(puzzle.cells[0][1].dragProcessor).isNotNull();
  assert("Empty cell chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("Empty cell click").that(puzzle.cells[0][0].clickSwitch).isNull();
  assert("Empty cell drag processor").that(puzzle.cells[0][0].dragProcessor).isNotNull();
  assert("Edge chooser").that(puzzle.edges[0][0][1].chooserValues).isNull();
  assert("Edge click").that(puzzle.edges[0][0][1].clickSwitch).containsExactly([{}, {image: 'cross'}]);
  assert("Edge drag").that(puzzle.edges[0][0][1].dragSwitch).isNull();
  assert("Connector chooser").that(puzzle.connectors[0][0]['h'].chooserValues).isNull();
  assert("Connector click").that(puzzle.connectors[0][0]['h'].clickSwitch).isNull();
  assert("Connector drag").that(puzzle.connectors[0][0]['h'].dragSwitch).containsExactly([{}, {color: puzzle.colorSchema.lineColor, returnValue: '1'}]);
  assert("Vertical connector drag").that(puzzle.connectors[0][0]['v'].dragSwitch).containsExactly([{}, {color: puzzle.colorSchema.lineColor, returnValue: '1'}]);
}),

test('Author controllers',(suite) => {
  let puzzle = suite.showPuzzle("alternate_loop", "4x4");
  puzzle.edit();

  assert("Cell chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("Cell click").that(puzzle.cells[0][0].clickSwitch).containsExactly([{}, {image: 'black_circle', returnValue: 'black_circle'}, {image: 'white_circle', returnValue: 'white_circle'}]);
  assert("Cell drag processor").that(puzzle.cells[0][0].dragProcessor).isNull();
  assert("Edge chooser").that(puzzle.edges[0][0][1].chooserValues).isNull();
  assert("Edge click").that(puzzle.edges[0][0][1].clickSwitch).isNull();
  assert("Edge drag").that(puzzle.edges[0][0][1].dragSwitch).isNull();
  assert("Connector drag").that(puzzle.connectors[0][0]['h'].dragSwitch).isNull();
}),

// Mouse processing tests
test('Draw line by drag between cells',(suite) => {
  let puzzle = suite.showPuzzle("alternate_loop", "4x4", {"b1": "black_circle", "d2": "white_circle", "c4": "black_circle", "b2": "white_circle"});
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
  let puzzle = suite.showPuzzle("alternate_loop", "4x4", {"b1": "black_circle", "d2": "white_circle", "c4": "black_circle", "b2": "white_circle"});
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
  let puzzle = suite.showPuzzle("alternate_loop", "4x4", {"b1": "black_circle", "d2": "white_circle", "c4": "black_circle", "b2": "white_circle"});
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
  let puzzle = suite.showPuzzle("alternate_loop", "4x4", {"b1": "black_circle", "d2": "white_circle", "c4": "black_circle", "b2": "white_circle"});
  puzzle.start();

  // From a1 to b2.
  suite.drag(puzzle, suite.cellPoint(puzzle, "a1"), suite.cellPoint(puzzle, "b2"));

  assert("Connector a1-b1").that(puzzle.connectors[0][0]['h'].getValue()).isNull();
  assert("Connector a1-a2").that(puzzle.connectors[0][0]['v'].getValue()).isNull();
  assert("Connector a2-b2").that(puzzle.connectors[1][0]['h'].getValue()).isNull();
  assert("Connector b1-b2").that(puzzle.connectors[0][1]['v'].getValue()).isNull();
  assert("Submission data").that(puzzle.collectData()).isEqualTo({});
}),

test('Clicks do not change cells',(suite) => {
  let puzzle = suite.showPuzzle("alternate_loop", "4x4", {"b1": "black_circle", "d2": "white_circle", "c4": "black_circle", "b2": "white_circle"});
  puzzle.start();

  suite.cellClick(puzzle, "b1");
  suite.cellClick(puzzle, "a1");

  assert("Clue cell data after click").that(puzzle.cells[0][1].data).isEqualTo({image: 'black_circle'});
  assert("Empty cell data after click").that(puzzle.cells[0][0].data).isEqualTo({});
  assert("Submission data").that(puzzle.collectData()).isEqualTo({});
}),

test('Process clicks to edge',(suite) => {
  let puzzle = suite.showPuzzle("alternate_loop", "4x4", {"b1": "black_circle", "d2": "white_circle", "c4": "black_circle", "b2": "white_circle"});
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

test('Process clicks to cell in edit mode',(suite) => {
  let puzzle = suite.showPuzzle("alternate_loop", "4x4");
  puzzle.edit();

  assert("Cell value before click").that(puzzle.cells[1][1].getValue()).isNull();

  suite.cellClick(puzzle, "b2");

  assert("Cell value after one click").that(puzzle.cells[1][1].getValue()).isEqualTo("black_circle");
  assert("Cell data after one click").that(puzzle.cells[1][1].data).isEqualTo({image: 'black_circle', returnValue: 'black_circle'});
  assert("Puzzle data after one click").that(puzzle.collectData()).isEqualTo({"b2": "black_circle"});

  suite.cellClick(puzzle, "b2");

  assert("Cell value after two clicks").that(puzzle.cells[1][1].getValue()).isEqualTo("white_circle");
  assert("Cell data after two clicks").that(puzzle.cells[1][1].data).isEqualTo({image: 'white_circle', returnValue: 'white_circle'});
  assert("Puzzle data after two clicks").that(puzzle.collectData()).isEqualTo({"b2": "white_circle"});

  suite.cellClick(puzzle, "b2");

  assert("Cell value after three clicks").that(puzzle.cells[1][1].getValue()).isNull();
  assert("Cell data after three clicks").that(puzzle.cells[1][1].data).isEqualTo({});
}),

test('Lines can not be drawn in edit mode',(suite) => {
  let puzzle = suite.showPuzzle("alternate_loop", "4x4");
  puzzle.edit();

  suite.drawLine(puzzle, "a4", "b4", "c4");

  assert("Connector a4-b4").that(puzzle.connectors[3][0]['h'].getValue()).isNull();
  assert("Connector b4-c4").that(puzzle.connectors[3][1]['h'].getValue()).isNull();
}),

// Data collector tests
test('Data collector',(suite) => {
  let puzzle = suite.showPuzzle("alternate_loop", "4x4", {"b1": "black_circle", "d2": "white_circle", "c4": "black_circle", "b2": "white_circle"});
  puzzle.start();

  // The whole loop is drawn by one drag which starts and ends in a1.
  suite.drawLine(puzzle, "a1", "b1", "c1", "d1", "d2", "d3", "d4", "c4", "c3", "c2", "b2", "b3", "b4", "a4", "a3", "a2", "a1");

  assert("Submission data").that(puzzle.collectData()).isEqualTo(
    {"connectors": {
      "a1-h": "1", "b1-h": "1", "c1-h": "1", "d1-v": "1", "d2-v": "1", "d3-v": "1", "c4-h": "1", "c3-v": "1",
      "c2-v": "1", "b2-h": "1", "b2-v": "1", "b3-v": "1", "a4-h": "1", "a3-v": "1", "a2-v": "1", "a1-v": "1"}});
}),

test('Author data collector',(suite) => {
  let puzzle = suite.showPuzzle("alternate_loop", "4x4");
  puzzle.edit();

  // Black circle in b1.
  suite.cellClick(puzzle, "b1");
  // White circle in d2.
  suite.cellClick(puzzle, "d2");
  suite.cellClick(puzzle, "d2");
  // Black circle in c4.
  suite.cellClick(puzzle, "c4");
  // White circle in b2.
  suite.cellClick(puzzle, "b2");
  suite.cellClick(puzzle, "b2");

  assert("Puzzle data").that(puzzle.collectData()).isEqualTo({"b1": "black_circle", "d2": "white_circle", "c4": "black_circle", "b2": "white_circle"});
}),

);
