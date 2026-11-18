fenceKnappDanebenTestSuite = uiTestSuite("Knapp daneben fences", "squarepuzzle", "squarePuzzleType",

beforeSuite((suite, cb)=> {
  // Emulates a single mouse drag through the nodes of the grid: node [0, 0] is the top left corner of the cell a1.
  suite.dragThroughNodes = function(puzzle, ...nodes) {
    let points = nodes.map(node => suite.gridPoint(puzzle, node[0], node[1]));
    puzzle.controller.onMouseDown(suite.mouseEvent(points[0]));
    points.slice(1).forEach(point => puzzle.controller.onMouseMove(suite.mouseEvent(point)));
    puzzle.controller.onMouseUp(suite.mouseEvent(points[points.length - 1]));
  };
  cb();
}),

// Grid of the most of the tests:
//   2 . . .
//   . 0 3 .
//   2 . . 1
//   . 0 . .

// Controller definition tests
test('Solver controllers',(suite) => {
  let puzzle = suite.showPuzzle("fence_knapp_daneben", "4x4", {"a1": "2", "b2": "0", "c2": "3", "a3": "2", "d3": "1", "b4": "0"});
  puzzle.start();

  assert("Clue cell data").that(puzzle.cells[0][0].data).isEqualTo({text: '2'});
  assert("Clue cell chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("Clue cell click").that(puzzle.cells[0][0].clickSwitch).containsExactly([{text: '2'}, {text: '2', image: 'cross'}, {text: '2', image: 'white_circle'}]);
  assert("Clue cell drag processor").that(puzzle.cells[0][0].dragProcessor).isNotNull();
  assert("Empty cell chooser").that(puzzle.cells[0][1].chooserValues).isNull();
  assert("Empty cell click").that(puzzle.cells[0][1].clickSwitch).containsExactly([{}, {image: 'cross'}, {image: 'white_circle'}]);
  assert("Empty cell drag processor").that(puzzle.cells[0][1].dragProcessor).isNotNull();
  assert("Edge chooser").that(puzzle.edges[0][0][1].chooserValues).isNull();
  assert("Edge click").that(puzzle.edges[0][0][1].clickSwitch).containsExactly([{}, {color: puzzle.colorSchema.lineColor, returnValue: '1'}, {image: 'cross'}]);
  assert("Edge drag").that(puzzle.edges[0][0][1].dragSwitch).containsExactly([{}, {color: puzzle.colorSchema.lineColor, returnValue: '1'}]);
  // The loop can go along the border of the grid: the top side of a1.
  assert("Grid border click").that(puzzle.edges[0][0][0].clickSwitch).containsExactly([{}, {color: puzzle.colorSchema.lineColor, returnValue: '1'}, {image: 'cross'}]);
  assert("Grid border drag").that(puzzle.edges[0][0][0].dragSwitch).containsExactly([{}, {color: puzzle.colorSchema.lineColor, returnValue: '1'}]);
  assert("Node chooser").that(puzzle.nodes[0][0][2].chooserValues).isNull();
  assert("Node click").that(puzzle.nodes[0][0][2].clickSwitch).isNull();
  assert("Node drag processor").that(puzzle.nodes[0][0][2].dragProcessor).isNotNull();
}),

test('Author controllers',(suite) => {
  let puzzle = suite.showPuzzle("fence_knapp_daneben", "4x4");
  puzzle.edit();

  let numberItem = number => ({text: number, returnValue: number});
  assert("Cell chooser").that(puzzle.cells[0][0].chooserValues).containsExactly([{}, numberItem('0'), numberItem('1'), numberItem('2'), numberItem('3'), numberItem('4')]);
  assert("Cell click").that(puzzle.cells[0][0].clickSwitch).isNull();
  assert("Cell drag processor").that(puzzle.cells[0][0].dragProcessor).isNull();
  assert("Edge click").that(puzzle.edges[0][0][1].clickSwitch).isNull();
  assert("Edge drag").that(puzzle.edges[0][0][1].dragSwitch).isNull();
  assert("Node drag processor").that(puzzle.nodes[0][0][2].dragProcessor).isNull();
}),

// Mouse processing tests
test('Process clicks to edge',(suite) => {
  let puzzle = suite.showPuzzle("fence_knapp_daneben", "4x4", {"a1": "2", "b2": "0", "c2": "3", "a3": "2", "d3": "1", "b4": "0"});
  puzzle.start();

  // The edge between a1 and b1.
  let edge = puzzle.edges[0][0][1];

  assert("Edge value before click").that(edge.getValue()).isNull();
  assert("Edge data before click").that(edge.data).isEqualTo({});

  suite.edgeClick(puzzle, "a1-1");

  assert("Edge value after one click").that(edge.getValue()).isEqualTo("1");
  assert("Edge data after one click").that(edge.data).isEqualTo({color: puzzle.colorSchema.lineColor, returnValue: "1"});
  assert("The same edge from the cell b1").that(puzzle.edges[0][1][3].getValue()).isEqualTo("1");
  assert("Submission data after one click").that(puzzle.collectData()).isEqualTo({"edges": {"a1-1": "1"}});

  suite.edgeClick(puzzle, "a1-1");

  assert("Edge value after two clicks").that(edge.getValue()).isNull();
  assert("Edge data after two clicks").that(edge.data).isEqualTo({image: "cross"});
  assert("Cross is not submitted").that(puzzle.collectData()).isEqualTo({});

  suite.edgeClick(puzzle, "a1-1");

  assert("Edge value after three clicks").that(edge.getValue()).isNull();
  assert("Edge data after three clicks").that(edge.data).isEqualTo({});
}),

test('Process click on border of the grid',(suite) => {
  let puzzle = suite.showPuzzle("fence_knapp_daneben", "4x4", {"a1": "2", "b2": "0", "c2": "3", "a3": "2", "d3": "1", "b4": "0"});
  puzzle.start();

  // The top side of a1 and the right side of d4.
  suite.edgeClick(puzzle, "a1-0");
  suite.edgeClick(puzzle, "d4-1");

  assert("Top border value").that(puzzle.edges[0][0][0].getValue()).isEqualTo("1");
  assert("Top border data").that(puzzle.edges[0][0][0].data).isEqualTo({color: puzzle.colorSchema.lineColor, returnValue: "1"});
  assert("Right border value").that(puzzle.edges[3][3][1].getValue()).isEqualTo("1");
  assert("Submission data").that(puzzle.collectData()).isEqualTo({"edges": {"a1-0": "1", "d4-1": "1"}});
}),

test('Process drag on edge',(suite) => {
  let puzzle = suite.showPuzzle("fence_knapp_daneben", "4x4", {"a1": "2", "b2": "0", "c2": "3", "a3": "2", "d3": "1", "b4": "0"});
  puzzle.start();

  // Along the edge between a1 and a2: from its left end to the right one.
  let edge = puzzle.edges[0][0][2];
  let point = suite.gridPoint(puzzle, 0, 1);

  assert("Edge value before drag").that(edge.getValue()).isNull();

  puzzle.controller.onMouseDown(suite.mouseEvent(point));
  point.right();
  puzzle.controller.onMouseMove(suite.mouseEvent(point));

  assert("Edge value after drag").that(edge.getValue()).isEqualTo("1");
  assert("Edge data after drag").that(edge.data).isEqualTo({color: puzzle.colorSchema.lineColor, returnValue: "1"});

  // Moving back within the same drag removes the line.
  point.left();
  puzzle.controller.onMouseMove(suite.mouseEvent(point));
  puzzle.controller.onMouseUp(suite.mouseEvent(point));

  assert("Edge value after back drag").that(edge.getValue()).isNull();
  assert("Edge data after back drag").that(edge.data).isEqualTo({});
}),

test('Draw line through several nodes',(suite) => {
  let puzzle = suite.showPuzzle("fence_knapp_daneben", "4x4", {"a1": "2", "b2": "0", "c2": "3", "a3": "2", "d3": "1", "b4": "0"});
  puzzle.start();

  // One mouse move along the bottom sides of a1, b1 and c1.
  suite.drag(puzzle, suite.gridPoint(puzzle, 0, 1), suite.gridPoint(puzzle, 3, 1));

  assert("Line after one long move").that(puzzle.collectData()).isEqualTo({"edges": {"a1-2": "1", "b1-2": "1", "c1-2": "1"}});

  // Drag with turns: down along the right side of c2, then to the left and back up.
  suite.dragThroughNodes(puzzle, [3, 1], [3, 2], [2, 2], [2, 1]);

  // The loop around c2. The edge between b2 and c2 is named by the first of the cells.
  assert("Loop around c2").that(puzzle.collectData()).isEqualTo({"edges": {"a1-2": "1", "b1-2": "1", "c1-2": "1", "c2-1": "1", "c2-2": "1", "b2-1": "1"}});

  // Second drag over the line removes it.
  suite.dragThroughNodes(puzzle, [0, 1], [1, 1], [2, 1]);

  assert("Line after second drag").that(puzzle.collectData()).isEqualTo({"edges": {"c1-2": "1", "c2-1": "1", "c2-2": "1", "b2-1": "1"}});
}),

test('Process clicks to cell',(suite) => {
  let puzzle = suite.showPuzzle("fence_knapp_daneben", "4x4", {"a1": "2", "b2": "0", "c2": "3", "a3": "2", "d3": "1", "b4": "0"});
  puzzle.start();

  // Solver can mark the cell as outer (cross) or inner (circle).
  let cell = puzzle.cells[0][1];

  assert("Cell data before click").that(cell.data).isEqualTo({});

  suite.cellClick(puzzle, "b1");

  assert("Cell value after one click").that(cell.getValue()).isNull();
  assert("Cell data after one click").that(cell.data).isEqualTo({image: 'cross'});

  suite.cellClick(puzzle, "b1");

  assert("Cell value after two clicks").that(cell.getValue()).isNull();
  assert("Cell data after two clicks").that(cell.data).isEqualTo({image: 'white_circle'});
  assert("Marks are not submitted").that(puzzle.collectData()).isEqualTo({});

  suite.cellClick(puzzle, "b1");

  assert("Cell data after three clicks").that(cell.data).isEqualTo({});
}),

test('Process clicks to clue cell',(suite) => {
  let puzzle = suite.showPuzzle("fence_knapp_daneben", "4x4", {"a1": "2", "b2": "0", "c2": "3", "a3": "2", "d3": "1", "b4": "0"});
  puzzle.start();

  // The mark is shown together with the number.
  let cell = puzzle.cells[0][0];

  suite.cellClick(puzzle, "a1");

  assert("Clue cell value after one click").that(cell.getValue()).isNull();
  assert("Clue cell data after one click").that(cell.data).isEqualTo({text: '2', image: 'cross'});

  suite.cellClick(puzzle, "a1");

  assert("Clue cell data after two clicks").that(cell.data).isEqualTo({text: '2', image: 'white_circle'});
  assert("Marks are not submitted").that(puzzle.collectData()).isEqualTo({});

  suite.cellClick(puzzle, "a1");

  assert("Clue cell data after three clicks").that(cell.data).isEqualTo({text: '2'});
}),

test('Copy cell mark by drag',(suite) => {
  let puzzle = suite.showPuzzle("fence_knapp_daneben", "4x4", {"a1": "2", "b2": "0", "c2": "3", "a3": "2", "d3": "1", "b4": "0"});
  puzzle.start();

  // Cross in b1 is dragged to c1 and then down to the clue cell c2.
  suite.cellClick(puzzle, "b1");

  let point = suite.cellPoint(puzzle, "b1");
  puzzle.controller.onMouseDown(suite.mouseEvent(point));
  point.right();
  puzzle.controller.onMouseMove(suite.mouseEvent(point));

  assert("Cell c1 data during drag").that(puzzle.cells[0][2].data).isEqualTo({image: 'cross'});
  assert("Cell c2 data during drag").that(puzzle.cells[1][2].data).isEqualTo({text: '3'});

  point.down();
  puzzle.controller.onMouseMove(suite.mouseEvent(point));
  puzzle.controller.onMouseUp(suite.mouseEvent(point));

  // Only the mark is copied, the clue keeps its number.
  assert("Cell b1 data after drag").that(puzzle.cells[0][1].data).isEqualTo({image: 'cross'});
  assert("Cell c1 data after drag").that(puzzle.cells[0][2].data).isEqualTo({image: 'cross'});
  assert("Cell c2 data after drag").that(puzzle.cells[1][2].data).isEqualTo({text: '3', image: 'cross'});

  // Mark of the clue cell is copied without the number.
  suite.drag(puzzle, suite.cellPoint(puzzle, "c2"), suite.cellPoint(puzzle, "d2"));

  assert("Cell d2 data after drag from clue cell").that(puzzle.cells[1][3].data).isEqualTo({image: 'cross'});
  assert("Edges are not changed").that(puzzle.collectData()).isEqualTo({});
}),

// Data collector tests
test('Data collector',(suite) => {
  let puzzle = suite.showPuzzle("fence_knapp_daneben", "4x4", {"a1": "2", "b2": "0", "c2": "3", "a3": "2", "d3": "1", "b4": "0"});
  puzzle.start();

  // The loop:
  //   . +---+ .
  //   2 |   | .
  //   . + . + .
  //   . 0 3 | .
  //   +-+ +-+ .
  //   2 . | 1 .
  //   +---+ . .
  //   . 0 . . .
  // The top part is drawn by drag, the bottom part by clicks.
  suite.dragThroughNodes(puzzle, [1, 2], [1, 0], [3, 0], [3, 2], [2, 2]);
  ["b3-1", "b3-2", "a3-2", "a3-3", "a2-2"].forEach(edge => suite.edgeClick(puzzle, edge));
  // Marks which are not submitted: cross in d1, circle in the clue cell c2, cross at the right side of d1.
  suite.cellClick(puzzle, "d1");
  suite.cellClick(puzzle, "c2");
  suite.cellClick(puzzle, "c2");
  suite.edgeClick(puzzle, "d1-1");
  suite.edgeClick(puzzle, "d1-1");

  assert("Submission data").that(puzzle.collectData()).isEqualTo({"edges": {
    "a1-1": "1", "b1-0": "1", "c1-0": "1", "c1-1": "1", "a2-1": "1", "a2-2": "1",
    "c2-1": "1", "c2-2": "1", "a3-2": "1", "a3-3": "1", "b3-1": "1", "b3-2": "1"}});
}),

test('Cell chooser for author',(suite) => {
  let puzzle = suite.showPuzzle("fence_knapp_daneben", "4x4");
  puzzle.edit();

  let cell = puzzle.cells[0][0];

  cell.switchOnChooser(3);

  assert("Cell value after number item").that(cell.getValue()).isEqualTo("2");
  assert("Cell data after number item").that(cell.data).isEqualTo({text: '2', returnValue: '2'});

  cell.switchOnChooser(5);

  assert("Cell value after another number item").that(cell.getValue()).isEqualTo("4");
  assert("Cell data after another number item").that(cell.data).isEqualTo({text: '4', returnValue: '4'});

  cell.switchOnChooser(0);

  assert("Cell value after empty item").that(cell.getValue()).isNull();
  assert("Cell data after empty item").that(cell.data).isEqualTo({});
}),

test('Author data collector',(suite) => {
  let puzzle = suite.showPuzzle("fence_knapp_daneben", "4x4");
  puzzle.edit();

  puzzle.cells[0][0].switchOnChooser(3); // 2 in a1
  puzzle.cells[1][1].switchOnChooser(1); // 0 in b2
  puzzle.cells[1][2].switchOnChooser(4); // 3 in c2
  puzzle.cells[2][0].switchOnChooser(3); // 2 in a3
  puzzle.cells[2][3].switchOnChooser(2); // 1 in d3
  puzzle.cells[3][1].switchOnChooser(1); // 0 in b4
  // Cell d4 is set and cleared.
  puzzle.cells[3][3].switchOnChooser(5);
  puzzle.cells[3][3].switchOnChooser(0);

  assert("Puzzle data").that(puzzle.collectData()).isEqualTo({"a1": "2", "b2": "0", "c2": "3", "a3": "2", "d3": "1", "b4": "0"});
}),

test('Author can not draw loop',(suite) => {
  let puzzle = suite.showPuzzle("fence_knapp_daneben", "4x4");
  puzzle.edit();

  suite.edgeClick(puzzle, "a1-1");
  suite.dragThroughNodes(puzzle, [1, 0], [2, 0], [2, 1]);

  assert("Edge data after click").that(puzzle.edges[0][0][1].data).isEqualTo({});
  assert("Edge data after drag").that(puzzle.edges[0][1][0].data).isEqualTo({});
  assert("Puzzle data").that(puzzle.collectData()).isEqualTo({});
}),

);
