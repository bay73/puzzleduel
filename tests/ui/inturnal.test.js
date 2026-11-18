inturnalTestSuite = uiTestSuite("Inturnal", "squarepuzzle", "squarePuzzleType",

beforeSuite((suite, cb)=> {
  // Emulates a single mouse drag through the centers of the given cells (it draws a line along the path).
  suite.drawLine = function(puzzle, ...cells) {
    let points = cells.map(cell => suite.cellPoint(puzzle, cell));
    puzzle.controller.onMouseDown(suite.mouseEvent(points[0]));
    points.slice(1).forEach(point => puzzle.controller.onMouseMove(suite.mouseEvent(point)));
    puzzle.controller.onMouseUp(suite.mouseEvent(points[points.length - 1]));
  };
  cb();
}),

// Grid of the most of the tests:
//   . . . .
//   . 4 2 .
//   . 3 . .
//   1 . . 0

// Controller definition tests
test('Solver controllers',(suite) => {
  let puzzle = suite.showPuzzle("inturnal", "4x4", {"b2": "4", "c2": "2", "b3": "3", "a4": "1", "d4": "0"});
  puzzle.start();

  assert("Clue cell data").that(puzzle.cells[1][1].data).isEqualTo({text: '4'});
  assert("Clue cell chooser").that(puzzle.cells[1][1].chooserValues).isNull();
  assert("Clue cell click").that(puzzle.cells[1][1].clickSwitch).isNull();
  assert("Clue cell drag processor").that(puzzle.cells[1][1].dragProcessor).isNotNull();
  assert("Empty cell chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("Empty cell click").that(puzzle.cells[0][0].clickSwitch).isNull();
  assert("Empty cell drag processor").that(puzzle.cells[0][0].dragProcessor).isNotNull();
  assert("Connector chooser").that(puzzle.connectors[0][0]['h'].chooserValues).isNull();
  assert("Connector click").that(puzzle.connectors[0][0]['h'].clickSwitch).isNull();
  assert("Connector drag").that(puzzle.connectors[0][0]['h'].dragSwitch).containsExactly([{}, {color: puzzle.colorSchema.lineColor, returnValue: '1'}]);
  assert("Edge chooser").that(puzzle.edges[0][0][1].chooserValues).isNull();
  assert("Edge click").that(puzzle.edges[0][0][1].clickSwitch).containsExactly([{}, {image: 'cross'}]);
  assert("Edge drag").that(puzzle.edges[0][0][1].dragSwitch).isNull();
  assert("Node chooser").that(puzzle.nodes[0][0][2].chooserValues).isNull();
  assert("Node click").that(puzzle.nodes[0][0][2].clickSwitch).containsExactly([{}, {image: 'cross'}, {image: 'white_circle'}]);
  assert("Node drag processor").that(puzzle.nodes[0][0][2].dragProcessor).isNull();
}),

test('Author controllers',(suite) => {
  let puzzle = suite.showPuzzle("inturnal", "4x4");
  puzzle.edit();

  let numberItem = number => ({text: number, returnValue: number});
  assert("Cell chooser").that(puzzle.cells[0][0].chooserValues).containsExactly([{}, numberItem('0'), numberItem('1'), numberItem('2'), numberItem('3'), numberItem('4')]);
  assert("Cell click").that(puzzle.cells[0][0].clickSwitch).isNull();
  assert("Cell drag processor").that(puzzle.cells[0][0].dragProcessor).isNull();
  assert("Connector drag").that(puzzle.connectors[0][0]['h'].dragSwitch).isNull();
  assert("Edge click").that(puzzle.edges[0][0][1].clickSwitch).isNull();
  assert("Node click").that(puzzle.nodes[0][0][2].clickSwitch).isNull();
}),

// Mouse processing tests
test('Draw line by drag between cells',(suite) => {
  let puzzle = suite.showPuzzle("inturnal", "4x4", {"b2": "4", "c2": "2", "b3": "3", "a4": "1", "d4": "0"});
  puzzle.start();

  let connector = puzzle.connectors[0][0]['h'];
  let point = suite.cellPoint(puzzle, "a1");

  assert("Connector value before drag").that(connector.getValue()).isNull();
  assert("Connector data before drag").that(connector.data).isEqualTo({});

  puzzle.controller.onMouseDown(suite.mouseEvent(point));
  point.right();
  puzzle.controller.onMouseMove(suite.mouseEvent(point));

  assert("Connector value after drag").that(connector.getValue()).isEqualTo("1");
  assert("Connector data after drag").that(connector.data).isEqualTo({color: puzzle.colorSchema.lineColor, returnValue: "1"});
  assert("Vertical connector of the same cell").that(puzzle.connectors[0][0]['v'].getValue()).isNull();

  // Moving back within the same drag removes the line.
  point.left();
  puzzle.controller.onMouseMove(suite.mouseEvent(point));
  puzzle.controller.onMouseUp(suite.mouseEvent(point));

  assert("Connector value after back drag").that(connector.getValue()).isNull();
  assert("Connector data after back drag").that(connector.data).isEqualTo({});
}),

test('Second drag over the line removes it',(suite) => {
  let puzzle = suite.showPuzzle("inturnal", "4x4", {"b2": "4", "c2": "2", "b3": "3", "a4": "1", "d4": "0"});
  puzzle.start();

  suite.drawLine(puzzle, "a1", "a2", "a3");

  assert("Line after drag").that(puzzle.collectData()).isEqualTo({"connectors": {"a1-v": "1", "a2-v": "1"}});

  // The first connector in the opposite direction.
  suite.drawLine(puzzle, "a2", "a1");

  assert("Line after second drag").that(puzzle.collectData()).isEqualTo({"connectors": {"a2-v": "1"}});
}),

test('Draw line through several cells',(suite) => {
  let puzzle = suite.showPuzzle("inturnal", "4x4", {"b2": "4", "c2": "2", "b3": "3", "a4": "1", "d4": "0"});
  puzzle.start();

  // One mouse move from a1 to d1 passes over b1 and c1.
  suite.drag(puzzle, suite.cellPoint(puzzle, "a1"), suite.cellPoint(puzzle, "d1"));

  assert("Line after one long move").that(puzzle.collectData()).isEqualTo({"connectors": {"a1-h": "1", "b1-h": "1", "c1-h": "1"}});

  // Drag with turns: d1 - d2 - a2 - a1 closes the loop, which passes through the clue cells b2 and c2.
  suite.drawLine(puzzle, "d1", "d2", "a2", "a1");

  assert("Loop").that(puzzle.collectData()).isEqualTo({"connectors": {
    "a1-h": "1", "b1-h": "1", "c1-h": "1", "d1-v": "1", "a2-h": "1", "b2-h": "1", "c2-h": "1", "a1-v": "1"}});
  assert("Clue cell data").that(puzzle.cells[1][1].data).isEqualTo({text: '4'});
}),

test('Click and diagonal drag do not draw lines',(suite) => {
  let puzzle = suite.showPuzzle("inturnal", "4x4", {"b2": "4", "c2": "2", "b3": "3", "a4": "1", "d4": "0"});
  puzzle.start();

  // Clicks to an empty cell and to a clue cell.
  suite.cellClick(puzzle, "a1");
  suite.cellClick(puzzle, "b2");
  // Cells a1 and b2 are not in one row or column.
  suite.drag(puzzle, suite.cellPoint(puzzle, "a1"), suite.cellPoint(puzzle, "b2"));

  assert("Empty cell data").that(puzzle.cells[0][0].data).isEqualTo({});
  assert("Clue cell data").that(puzzle.cells[1][1].data).isEqualTo({text: '4'});
  assert("Submission data").that(puzzle.collectData()).isEqualTo({});
}),

test('Process clicks to node',(suite) => {
  let puzzle = suite.showPuzzle("inturnal", "4x4", {"b2": "4", "c2": "2", "b3": "3", "a4": "1", "d4": "0"});
  puzzle.start();

  // The top left corner of the clue cell b2: solver can mark if the loop turns around it.
  let node = puzzle.nodes[0][0][2];
  let point = suite.gridPoint(puzzle, 1, 1);

  assert("The same node from the cell b2").that(puzzle.nodes[1][1][0] === node).isEqualTo(true);
  assert("Node data before click").that(node.data).isEqualTo({});

  suite.click(puzzle, point);

  assert("Node value after one click").that(node.getValue()).isNull();
  assert("Node data after one click").that(node.data).isEqualTo({image: 'cross'});

  suite.click(puzzle, point);

  assert("Node value after two clicks").that(node.getValue()).isNull();
  assert("Node data after two clicks").that(node.data).isEqualTo({image: 'white_circle'});
  assert("Marks are not submitted").that(puzzle.collectData()).isEqualTo({});

  suite.click(puzzle, point);

  assert("Node data after three clicks").that(node.data).isEqualTo({});
  assert("Cells around the node are not changed").that(puzzle.cells[1][1].data).isEqualTo({text: '4'});
}),

test('Process clicks to edge',(suite) => {
  let puzzle = suite.showPuzzle("inturnal", "4x4", {"b2": "4", "c2": "2", "b3": "3", "a4": "1", "d4": "0"});
  puzzle.start();

  // The edge between a1 and b1.
  let edge = puzzle.edges[0][0][1];

  assert("Edge data before click").that(edge.data).isEqualTo({});

  suite.edgeClick(puzzle, "a1-1");

  assert("Edge value after click").that(edge.getValue()).isNull();
  assert("Edge data after click").that(edge.data).isEqualTo({image: "cross"});
  assert("The same edge from the cell b1").that(puzzle.edges[0][1][3].data).isEqualTo({image: "cross"});
  assert("Cross is not submitted").that(puzzle.collectData()).isEqualTo({});

  suite.edgeClick(puzzle, "a1-1");

  assert("Edge value after second click").that(edge.getValue()).isNull();
  assert("Edge data after second click").that(edge.data).isEqualTo({});
}),

// Data collector tests
test('Data collector',(suite) => {
  let puzzle = suite.showPuzzle("inturnal", "4x4", {"b2": "4", "c2": "2", "b3": "3", "a4": "1", "d4": "0"});
  puzzle.start();

  // The loop:
  //   +---+ .
  //   | 4 2 .
  //   | 3-+ .
  //   1-+ . 0
  suite.drawLine(puzzle, "a1", "c1", "c3", "b3", "b4", "a4", "a1");
  // Marks which are not submitted: cross at the top left corner of d4, circle at the top left corner of b2,
  // cross at the edge between c4 and d4.
  suite.click(puzzle, suite.gridPoint(puzzle, 3, 3));
  suite.click(puzzle, suite.gridPoint(puzzle, 1, 1));
  suite.click(puzzle, suite.gridPoint(puzzle, 1, 1));
  suite.edgeClick(puzzle, "c4-1");

  assert("Submission data").that(puzzle.collectData()).isEqualTo(
    {"connectors": {"a1-h": "1", "b1-h": "1", "c1-v": "1", "c2-v": "1", "b3-h": "1", "b3-v": "1", "a4-h": "1", "a3-v": "1", "a2-v": "1", "a1-v": "1"}});
}),

test('Cell chooser for author',(suite) => {
  let puzzle = suite.showPuzzle("inturnal", "4x4");
  puzzle.edit();

  let cell = puzzle.cells[1][1];

  cell.switchOnChooser(5);

  assert("Cell value after number item").that(cell.getValue()).isEqualTo("4");
  assert("Cell data after number item").that(cell.data).isEqualTo({text: '4', returnValue: '4'});

  cell.switchOnChooser(1);

  assert("Cell value after another number item").that(cell.getValue()).isEqualTo("0");
  assert("Cell data after another number item").that(cell.data).isEqualTo({text: '0', returnValue: '0'});

  cell.switchOnChooser(0);

  assert("Cell value after empty item").that(cell.getValue()).isNull();
  assert("Cell data after empty item").that(cell.data).isEqualTo({});
}),

test('Author data collector',(suite) => {
  let puzzle = suite.showPuzzle("inturnal", "4x4");
  puzzle.edit();

  puzzle.cells[1][1].switchOnChooser(5); // 4 in b2
  puzzle.cells[1][2].switchOnChooser(3); // 2 in c2
  puzzle.cells[2][1].switchOnChooser(4); // 3 in b3
  puzzle.cells[3][0].switchOnChooser(2); // 1 in a4
  puzzle.cells[3][3].switchOnChooser(1); // 0 in d4
  // Cell a1 is set and cleared.
  puzzle.cells[0][0].switchOnChooser(2);
  puzzle.cells[0][0].switchOnChooser(0);

  assert("Puzzle data").that(puzzle.collectData()).isEqualTo({"b2": "4", "c2": "2", "b3": "3", "a4": "1", "d4": "0"});
}),

test('Author can not put marks',(suite) => {
  let puzzle = suite.showPuzzle("inturnal", "4x4");
  puzzle.edit();

  // The edge between c1 and d1 and the bottom right corner of a1.
  suite.edgeClick(puzzle, "c1-1");
  suite.click(puzzle, suite.gridPoint(puzzle, 1, 1));

  assert("Edge data").that(puzzle.edges[0][2][1].data).isEqualTo({});
  assert("Node data").that(puzzle.nodes[0][0][2].data).isEqualTo({});
  assert("Puzzle data").that(puzzle.collectData()).isEqualTo({});
}),

);
