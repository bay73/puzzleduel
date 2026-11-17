arafTestSuite = uiTestSuite("Araf", "areapuzzle", "arafPuzzleType",

beforeSuite((suite, cb)=> {
  // Emulates drag from the center of one cell to the center of another one (it draws a connector between adjacent cells).
  suite.connectCells = function(puzzle, cell1, cell2) {
    suite.drag(puzzle, suite.cellPoint(puzzle, cell1), suite.cellPoint(puzzle, cell2));
  };
  cb();
}),

test('Solver controllers',(suite) => {
  let puzzle = suite.showPuzzle(
    "araf", "4x4", {"a1": "5", "a2": "11", "d3": "7", "d4": "8"});
  puzzle.start();

  assert("Cell chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("Cell click").that(puzzle.cells[0][0].clickSwitch).isNull();
  assert("Edge chooser").that(puzzle.edges[0][0][1].chooserValues).isNull();
  assert("Edge click").that(puzzle.edges[0][0][1].clickSwitch).containsExactly([{}, {color: puzzle.colorSchema.gridColor, returnValue: 'bold'}]);
  assert("Edge drag").that(puzzle.edges[0][0][1].dragSwitch).containsExactly([{}, {color: puzzle.colorSchema.gridColor, returnValue: 'bold'}]);
  assert("Connector drag").that(puzzle.connectors[0][0]['v'].dragSwitch).containsExactly([{}, {color: puzzle.colorSchema.lineColor, returnValue: 'line'}]);
}),
test('Author controllers',(suite) => {
  let puzzle = suite.showPuzzle("araf", "4x4");
  puzzle.edit();

  assert("Cell chooser").that(puzzle.cells[0][0].chooserValues).containsAtLeast([{},{text: '1', returnValue: '1'},{text: '2', returnValue: '2'},{text: '99', returnValue: '99'}]);
  assert("Cell click").that(puzzle.cells[0][0].clickSwitch).isNull();
  assert("Edge chooser").that(puzzle.edges[0][0][1].chooserValues).isNull();
  assert("Edge click").that(puzzle.edges[0][0][1].clickSwitch).isNull();
  assert("Edge drag").that(puzzle.edges[0][0][1].dragSwitch).isNull();
  assert("Connector drag").that(puzzle.connectors[0][0]['v'].dragSwitch).isNull();
}),
// Mouse processing tests
test('Process click to edge',(suite) => {
  let puzzle = suite.showPuzzle(
    "araf", "4x4", {"a1": "5", "a2": "11", "d3": "7", "d4": "8"});
  puzzle.start();

  let point = suite.gridPoint(puzzle, 0.5, 1);

  assert("Edge value before click").that(puzzle.edges[0][0][2].getValue()).isNull();
  assert("Edge data before click").that(puzzle.edges[0][0][2].data).isEqualTo({});

  // Click at edge between a1 and a2
  suite.click(puzzle, point);

  assert("Edge value after click").that(puzzle.edges[0][0][2].getValue()).isEqualTo("bold");
  assert("Edge data after click").that(puzzle.edges[0][0][2].data).isEqualTo({color:puzzle.colorSchema.gridColor,returnValue:"bold"});
}),
test('Process drag for edge',(suite) => {
  let puzzle = suite.showPuzzle(
    "araf", "4x4", {"a1": "5", "a2": "11", "d3": "7", "d4": "8"});
  puzzle.start();

  let point = suite.gridPoint(puzzle, 1, 0);

  assert("Edge value before click").that(puzzle.edges[0][0][1].getValue()).isNull();
  assert("Edge data before click").that(puzzle.edges[0][0][1].data).isEqualTo({});

  // Start drag at top end of an edge between a1 and b1
  puzzle.controller.onMouseDown(suite.mouseEvent(point));

  assert("Edge value after mousedown").that(puzzle.edges[0][0][1].getValue()).isNull();
  assert("Edge data after mousedown").that(puzzle.edges[0][0][1].data).isEqualTo({});
  
  point.down();
  puzzle.controller.onMouseMove(suite.mouseEvent(point));
  puzzle.controller.onMouseUp(suite.mouseEvent(point));

  assert("Edge value after drag end").that(puzzle.edges[0][0][1].getValue()).isEqualTo("bold");
  assert("Edge data after drag end").that(puzzle.edges[0][0][1].data).isEqualTo({color:puzzle.colorSchema.gridColor,returnValue:"bold"});
}),
test('Process drag for connector',(suite) => {
  let puzzle = suite.showPuzzle(
    "araf", "4x4", {"a1": "5", "a2": "11", "d3": "7", "d4": "8"});
  puzzle.start();

  let point = suite.cellPoint(puzzle, "a1");

  assert("Connector value before click").that(puzzle.connectors[0][0]['h'].getValue()).isNull();
  assert("Connector data before click").that(puzzle.connectors[0][0]['h'].data).isEqualTo({});

  puzzle.controller.onMouseDown(suite.mouseEvent(point));

  assert("Connector value after mousedown").that(puzzle.connectors[0][0]['h'].getValue()).isNull();
  assert("Connector data after mousedown").that(puzzle.connectors[0][0]['h'].data).isEqualTo({});
  
  point.right();
  puzzle.controller.onMouseMove(suite.mouseEvent(point));
  puzzle.controller.onMouseUp(suite.mouseEvent(point));

  assert("Connector value after drag end").that(puzzle.connectors[0][0]['h'].getValue()).isEqualTo("line");
  assert("Connector data after drag end").that(puzzle.connectors[0][0]['h'].data).isEqualTo({color: puzzle.colorSchema.lineColor, returnValue: 'line'});
}),
// Every area of Araf contains exactly two numbers, so the border is set automatically
// between two areas which contain more than two numbers together.
// Grid 4x4 used in the tests below:
//   5  .  2  .      a1 b1 c1 d1
//   11 .  .  .      a2 b2 c2 d2
//   .  .  .  7      a3 b3 c3 d3
//   .  .  .  8      a4 b4 c4 d4
test('No automatic border between cells with numbers',(suite) => {
  let puzzle = suite.showPuzzle("araf", "4x4", {"a1": "5", "a2": "11", "c1": "2", "d3": "7", "d4": "8"});
  puzzle.start();

  // Two numbers can belong to one area.
  assert("Edge between a1 and a2").that(puzzle.edges[0][0][2].getValue()).isNull();
  assert("Edge between d3 and d4").that(puzzle.edges[2][3][2].getValue()).isNull();
}),

test('No automatic border between area with two numbers and area without numbers',(suite) => {
  let puzzle = suite.showPuzzle("araf", "4x4", {"a1": "5", "a2": "11", "c1": "2", "d3": "7", "d4": "8"});
  puzzle.start();

  // Area a1-a2 contains two numbers, area b1-b2 contains no numbers: the areas still can be joined.
  suite.connectCells(puzzle, "a1", "a2");
  suite.connectCells(puzzle, "b1", "b2");

  assert("Edge between a1 and b1").that(puzzle.edges[0][0][1].getValue()).isNull();
  assert("Edge data between a1 and b1").that(puzzle.edges[0][0][1].data).isEqualTo({});
  assert("Edge between a2 and b2").that(puzzle.edges[1][0][1].getValue()).isNull();
}),

test('Automatic border between areas with three numbers',(suite) => {
  let puzzle = suite.showPuzzle("araf", "4x4", {"a1": "5", "a2": "11", "c1": "2", "d3": "7", "d4": "8"});
  puzzle.start();

  suite.connectCells(puzzle, "a1", "a2");
  suite.connectCells(puzzle, "b1", "b2");
  // Area b1-b2 is extended to c1 with the number 2: three numbers together with the area a1-a2.
  suite.connectCells(puzzle, "b1", "c1");

  assert("Edge between a1 and b1").that(puzzle.edges[0][0][1].getValue()).isEqualTo("bold");
  assert("Edge data between a1 and b1").that(puzzle.edges[0][0][1].data).isEqualTo({color: puzzle.colorSchema.greyColor});
  assert("Edge between a2 and b2").that(puzzle.edges[1][0][1].getValue()).isEqualTo("bold");
  // The cell d1 has no number, it can be added to the area with one number.
  assert("Edge between c1 and d1").that(puzzle.edges[0][2][1].getValue()).isNull();
}),

test('Automatic border between area with two numbers and cell with number',(suite) => {
  let puzzle = suite.showPuzzle("araf", "4x4", {"a1": "5", "a2": "11", "c1": "2", "d3": "7", "d4": "8"});
  puzzle.start();

  suite.connectCells(puzzle, "b1", "c1");

  assert("Edge between a1 and b1 before joining").that(puzzle.edges[0][0][1].getValue()).isNull();
  assert("Edge between a1 and a2 before joining").that(puzzle.edges[0][0][2].getValue()).isNull();

  // Area a1-b1-c1 contains the numbers 5 and 2, so the cell a2 with the number 11 can't be added.
  suite.connectCells(puzzle, "a1", "b1");

  assert("Connector between a1 and b1").that(puzzle.connectors[0][0]['h'].getValue()).isEqualTo("line");
  assert("Edge between a1 and a2 after joining").that(puzzle.edges[0][0][2].getValue()).isEqualTo("bold");
  assert("Edge data between a1 and a2 after joining").that(puzzle.edges[0][0][2].data).isEqualTo({color: puzzle.colorSchema.greyColor});
}),

// Data collector tests
test('Data collector',(suite) => {
  let puzzle = suite.showPuzzle("araf", "2x2", {"a1": "1", "b2": "3"});
  puzzle.start();

  // Borders between a1 and b1 and between a1 and a2.
  suite.edgeClick(puzzle, "a1-1");
  suite.edgeClick(puzzle, "a1-2");

  assert("Submission data").that(puzzle.collectData()).isEqualTo({"areas": [["a1"], ["b1", "a2", "b2"]]});
}),

test('Author data collector',(suite) => {
  let puzzle = suite.showPuzzle("araf", "4x4");
  puzzle.edit();

  // Number 5 in a1 and number 11 in a2.
  puzzle.cells[0][0].switchOnChooser(5);
  puzzle.cells[1][0].switchOnChooser(11);

  assert("Puzzle data").that(puzzle.collectData()).isEqualTo({"a1": "5", "a2": "11"});
}),

);

