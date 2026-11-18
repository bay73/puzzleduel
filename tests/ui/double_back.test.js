doubleBackTestSuite = uiTestSuite("Double Back", "squarepuzzle", "squarePuzzleType",

// Puzzle 4x4 with two areas (left and right halves) and its solution:
//   . . | . .      a1 b1 c1 d1       +--+--+--+
//   . . | . .      a2 b2 c2 d2       |        |
//   . . | . .      a3 b3 c3 d3       +  +--+--+
//   . . | . .      a4 b4 c4 d4       |  |
//                                    +  +--+--+
//                                    |        |
//                                    +--+--+--+

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
  let puzzle = suite.showPuzzle(
    "double_back", "4x4",
    {"areas": [["a1","b1","a2","b2","a3","b3","a4","b4"],["c1","d1","c2","d2","c3","d3","c4","d4"]]}
  );
  puzzle.start();

  assert("Empty cell chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("Empty cell click").that(puzzle.cells[0][0].clickSwitch).containsExactly([{}, {image: 'cross'}, {image: 'white_circle'}]);
  assert("Empty cell drag processor").that(puzzle.cells[0][0].dragProcessor).isNotNull();
  assert("Edge chooser").that(puzzle.edges[0][0][1].chooserValues).isNull();
  assert("Edge click").that(puzzle.edges[0][0][1].clickSwitch).containsExactly([{}, {image: 'cross'}]);
  assert("Edge drag").that(puzzle.edges[0][0][1].dragSwitch).isNull();
  assert("Area border data").that(puzzle.edges[0][1][1].data).isEqualTo({color: puzzle.colorSchema.gridColor});
  assert("Area border click").that(puzzle.edges[0][1][1].clickSwitch).containsExactly([{color: puzzle.colorSchema.gridColor}, {image: 'cross', color: puzzle.colorSchema.gridColor}]);
  assert("Connector chooser").that(puzzle.connectors[0][0]['h'].chooserValues).isNull();
  assert("Connector click").that(puzzle.connectors[0][0]['h'].clickSwitch).isNull();
  assert("Connector drag").that(puzzle.connectors[0][0]['h'].dragSwitch).containsExactly([{}, {color: puzzle.colorSchema.lineColor, returnValue: '1'}]);
  assert("Vertical connector drag").that(puzzle.connectors[0][0]['v'].dragSwitch).containsExactly([{}, {color: puzzle.colorSchema.lineColor, returnValue: '1'}]);
}),

test('Author controllers',(suite) => {
  let puzzle = suite.showPuzzle("double_back", "4x4");
  puzzle.edit();

  assert("Cell chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("Cell click").that(puzzle.cells[0][0].clickSwitch).isNull();
  assert("Cell drag processor").that(puzzle.cells[0][0].dragProcessor).isNull();
  assert("Edge chooser").that(puzzle.edges[0][0][1].chooserValues).isNull();
  assert("Edge click").that(puzzle.edges[0][0][1].clickSwitch).containsExactly([{}, {color: puzzle.colorSchema.gridColor, returnValue: 'bold'}]);
  assert("Edge drag").that(puzzle.edges[0][0][1].dragSwitch).containsExactly([{}, {color: puzzle.colorSchema.gridColor, returnValue: 'bold'}]);
  assert("Connector drag").that(puzzle.connectors[0][0]['h'].dragSwitch).isNull();
}),

// Mouse processing tests
test('Draw line by drag between cells',(suite) => {
  let puzzle = suite.showPuzzle(
    "double_back", "4x4",
    {"areas": [["a1","b1","a2","b2","a3","b3","a4","b4"],["c1","d1","c2","d2","c3","d3","c4","d4"]]}
  );
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
  let puzzle = suite.showPuzzle(
    "double_back", "4x4",
    {"areas": [["a1","b1","a2","b2","a3","b3","a4","b4"],["c1","d1","c2","d2","c3","d3","c4","d4"]]}
  );
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
  let puzzle = suite.showPuzzle(
    "double_back", "4x4",
    {"areas": [["a1","b1","a2","b2","a3","b3","a4","b4"],["c1","d1","c2","d2","c3","d3","c4","d4"]]}
  );
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
  let puzzle = suite.showPuzzle(
    "double_back", "4x4",
    {"areas": [["a1","b1","a2","b2","a3","b3","a4","b4"],["c1","d1","c2","d2","c3","d3","c4","d4"]]}
  );
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
  let puzzle = suite.showPuzzle(
    "double_back", "4x4",
    {"areas": [["a1","b1","a2","b2","a3","b3","a4","b4"],["c1","d1","c2","d2","c3","d3","c4","d4"]]}
  );
  puzzle.start();

  assert("Cell data before click").that(puzzle.cells[0][0].data).isEqualTo({});

  suite.cellClick(puzzle, "a1");

  assert("Cell data after one click").that(puzzle.cells[0][0].data).isEqualTo({image: 'cross'});
  // Marks in the cells are solver's notes, they are not submitted.
  assert("Submission data after one click").that(puzzle.collectData()).isEqualTo({});

  suite.cellClick(puzzle, "a1");

  assert("Cell data after two clicks").that(puzzle.cells[0][0].data).isEqualTo({image: 'white_circle'});
  assert("Submission data after two clicks").that(puzzle.collectData()).isEqualTo({});

  suite.cellClick(puzzle, "a1");

  assert("Cell data after three clicks").that(puzzle.cells[0][0].data).isEqualTo({});
}),

test('Process clicks to edge',(suite) => {
  let puzzle = suite.showPuzzle(
    "double_back", "4x4",
    {"areas": [["a1","b1","a2","b2","a3","b3","a4","b4"],["c1","d1","c2","d2","c3","d3","c4","d4"]]}
  );
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

test('Process clicks to area border',(suite) => {
  let puzzle = suite.showPuzzle(
    "double_back", "4x4",
    {"areas": [["a1","b1","a2","b2","a3","b3","a4","b4"],["c1","d1","c2","d2","c3","d3","c4","d4"]]}
  );
  puzzle.start();

  // Click at the border between b1 and c1.
  suite.edgeClick(puzzle, "b1-1");

  assert("Border data after click").that(puzzle.edges[0][1][1].data).isEqualTo({image: 'cross', color: puzzle.colorSchema.gridColor});
  assert("Submission data after click").that(puzzle.collectData()).isEqualTo({});

  suite.edgeClick(puzzle, "b1-1");

  assert("Border data after second click").that(puzzle.edges[0][1][1].data).isEqualTo({color: puzzle.colorSchema.gridColor});
}),

test('Process clicks to edge in edit mode',(suite) => {
  let puzzle = suite.showPuzzle("double_back", "4x4");
  puzzle.edit();

  assert("Edge value before click").that(puzzle.edges[0][0][1].getValue()).isNull();

  // Click at the edge between a1 and b1.
  suite.edgeClick(puzzle, "a1-1");

  assert("Edge value after click").that(puzzle.edges[0][0][1].getValue()).isEqualTo("bold");
  assert("Edge data after click").that(puzzle.edges[0][0][1].data).isEqualTo({color: puzzle.colorSchema.gridColor, returnValue: "bold"});

  suite.edgeClick(puzzle, "a1-1");

  assert("Edge value after second click").that(puzzle.edges[0][0][1].getValue()).isNull();
  assert("Edge data after second click").that(puzzle.edges[0][0][1].data).isEqualTo({});
}),

test('Process drag for edge in edit mode',(suite) => {
  let puzzle = suite.showPuzzle("double_back", "4x4");
  puzzle.edit();

  // Drag along the edge between a1 and b1.
  suite.drag(puzzle, suite.gridPoint(puzzle, 1, 0), suite.gridPoint(puzzle, 1, 1));

  assert("Edge value after drag").that(puzzle.edges[0][0][1].getValue()).isEqualTo("bold");
  assert("Edge data after drag").that(puzzle.edges[0][0][1].data).isEqualTo({color: puzzle.colorSchema.gridColor, returnValue: "bold"});

  // Drag along the edge between a1 and a2.
  suite.drag(puzzle, suite.gridPoint(puzzle, 0, 1), suite.gridPoint(puzzle, 1, 1));

  assert("Second edge value after drag").that(puzzle.edges[0][0][2].getValue()).isEqualTo("bold");
  // The cell a1 is separated from the others.
  assert("Puzzle data").that(puzzle.collectData()).isEqualTo(
    {"areas": [["a1"], ["b1","c1","d1","a2","b2","c2","d2","a3","b3","c3","d3","a4","b4","c4","d4"]]});
}),

test('Lines can not be drawn in edit mode',(suite) => {
  let puzzle = suite.showPuzzle("double_back", "4x4");
  puzzle.edit();

  suite.drawLine(puzzle, "a4", "b4", "c4");

  assert("Connector a4-b4").that(puzzle.connectors[3][0]['h'].getValue()).isNull();
  assert("Connector b4-c4").that(puzzle.connectors[3][1]['h'].getValue()).isNull();
}),

// Data collector tests
test('Data collector',(suite) => {
  let puzzle = suite.showPuzzle(
    "double_back", "4x4",
    {"areas": [["a1","b1","a2","b2","a3","b3","a4","b4"],["c1","d1","c2","d2","c3","d3","c4","d4"]]}
  );
  puzzle.start();

  // The whole loop is drawn by one drag which starts and ends in a1.
  suite.drawLine(puzzle, "a1", "b1", "c1", "d1", "d2", "c2", "b2", "b3", "c3", "d3", "d4", "c4", "b4", "a4", "a3", "a2", "a1");

  assert("Submission data").that(puzzle.collectData()).isEqualTo(
    {"connectors": {
      "a1-h": "1", "a1-v": "1", "b1-h": "1", "c1-h": "1", "d1-v": "1", "a2-v": "1", "b2-h": "1", "b2-v": "1",
      "c2-h": "1", "a3-v": "1", "b3-h": "1", "c3-h": "1", "d3-v": "1", "a4-h": "1", "b4-h": "1", "c4-h": "1"}});
}),

test('Author data collector',(suite) => {
  let puzzle = suite.showPuzzle("double_back", "4x4");
  puzzle.edit();

  // Vertical border in the middle of the grid: two clicks and two drags along the edges.
  suite.edgeClick(puzzle, "b1-1");
  suite.edgeClick(puzzle, "b2-1");
  suite.drag(puzzle, suite.gridPoint(puzzle, 2, 2), suite.gridPoint(puzzle, 2, 3));
  suite.drag(puzzle, suite.gridPoint(puzzle, 2, 3), suite.gridPoint(puzzle, 2, 4));

  assert("Puzzle data").that(puzzle.collectData()).isEqualTo({"areas": [["a1","b1","a2","b2","a3","b3","a4","b4"],["c1","d1","c2","d2","c3","d3","c4","d4"]]});
}),

);
