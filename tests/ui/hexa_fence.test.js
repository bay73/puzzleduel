hexaFenceTestSuite = uiTestSuite("Hexa Fence", "hexapuzzle", "hexaPuzzleType",

// Controller definition tests
test('Solver controllers',(suite) => {
  let puzzle = suite.showPuzzle(
    "hexa_fence", "5x5",{"b1": "1", "a2": "1"}
  );
  puzzle.start();

  assert("Cell chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("Cell click").that(puzzle.cells[0][0].clickSwitch).containsExactly([{},{image:"cross"},{image:"white_circle"}]);
  assert("Edge chooser").that(puzzle.edges[0][0][3].chooserValues).isNull();
  assert("Edge edge click").that(puzzle.edges[0][0][3].clickSwitch).containsExactly([{},{color: puzzle.colorSchema.lineColor, returnValue: "1"},{image: "cross"}]);
  assert("Edge edge drag switch").that(puzzle.edges[0][0][3].dragSwitch).containsExactly([{},{color: puzzle.colorSchema.lineColor, returnValue: "1"}]);
}),

test('Author controllers',(suite) => {
  let puzzle = suite.showPuzzle("hexa_fence", "5x5");
  puzzle.edit();

  assert("Cell chooser").that(puzzle.cells[0][0].chooserValues).containsAtLeast([{},{text: '0', returnValue: '0'},{text: '1', returnValue: '1'},{text: '6', returnValue: '6'}]);
  assert("Cell click").that(puzzle.cells[0][0].clickSwitch).isNull();
}),

// Cells of the hexagonal grid 3x3 (puzzle.cells[row][column]):
//       c1
//    b1    d2
// a1    c2    e3
//    b2    d3
// a2    c3    e4
//    b3    d4
// a3    c4    e5
//    b4    d5
//       c5
// Edges and nodes of a cell are numbered clockwise: the edge 0 is the top one, the node 0 is the top left one,
// the edge N connects the nodes N and N+1. E.g. puzzle.edges[0][0][3] is the bottom edge of a1 (between a1 and a2).

// Mouse processing tests
test('Process clicks to edge',(suite) => {
  let puzzle = suite.showPuzzle("hexa_fence", "3x3", {"b1": "1", "b2": "3"});
  puzzle.start();

  let edge = puzzle.edges[0][0][3];
  assert("Edge between a1 and a2 is common for both cells").that(puzzle.edges[1][0][0] === edge).isEqualTo(true);
  assert("Edge value before click").that(edge.getValue()).isNull();

  suite.click(puzzle, edge.center());
  assert("Edge value after one click").that(edge.getValue()).isEqualTo("1");
  assert("Edge data after one click").that(edge.data).isEqualTo({color: puzzle.colorSchema.lineColor, returnValue: '1'});

  suite.click(puzzle, edge.center());
  assert("Edge value after two clicks").that(edge.getValue()).isNull();
  assert("Edge data after two clicks").that(edge.data).isEqualTo({image: 'cross'});

  suite.click(puzzle, edge.center());
  assert("Edge value after three clicks").that(edge.getValue()).isNull();
  assert("Edge data after three clicks").that(edge.data).isEqualTo({});
}),

test('Process clicks to cell',(suite) => {
  let puzzle = suite.showPuzzle("hexa_fence", "3x3", {"b1": "1", "b2": "3"});
  puzzle.start();

  // Marks in the cells are not submitted, the clue is kept.
  let cell = puzzle.cells[1][1];
  suite.click(puzzle, cell.center());
  assert("Cell value after one click").that(cell.getValue()).isNull();
  assert("Cell data after one click").that(cell.data).isEqualTo({text: '3', image: 'cross'});

  suite.click(puzzle, cell.center());
  assert("Cell data after two clicks").that(cell.data).isEqualTo({text: '3', image: 'white_circle'});

  suite.click(puzzle, cell.center());
  assert("Cell data after three clicks").that(cell.data).isEqualTo({text: '3'});
  assert("Submission data").that(puzzle.collectData()).isEqualTo({});
}),

test('Draw edge by drag between nodes',(suite) => {
  let puzzle = suite.showPuzzle("hexa_fence", "3x3", {"b1": "1", "b2": "3"});
  puzzle.start();

  // Along the top edge of a1.
  suite.drag(puzzle, puzzle.nodes[0][0][0].center(), puzzle.nodes[0][0][1].center());

  assert("Edge value after drag").that(puzzle.edges[0][0][0].getValue()).isEqualTo("1");
  assert("Edge data after drag").that(puzzle.edges[0][0][0].data).isEqualTo({color: puzzle.colorSchema.lineColor, returnValue: '1'});

  // The same drag removes the edge.
  suite.drag(puzzle, puzzle.nodes[0][0][0].center(), puzzle.nodes[0][0][1].center());

  assert("Edge value after second drag").that(puzzle.edges[0][0][0].getValue()).isNull();
}),

test('Draw two edges by one drag',(suite) => {
  let puzzle = suite.showPuzzle("hexa_fence", "3x3", {"b1": "1", "b2": "3"});
  puzzle.start();

  // Along the top edge of a1 and then along its top right edge.
  puzzle.controller.onMouseDown(suite.mouseEvent(puzzle.nodes[0][0][0].center()));
  puzzle.controller.onMouseMove(suite.mouseEvent(puzzle.nodes[0][0][1].center()));

  assert("First edge value after first move").that(puzzle.edges[0][0][0].getValue()).isEqualTo("1");
  assert("Second edge value after first move").that(puzzle.edges[0][0][1].getValue()).isNull();

  puzzle.controller.onMouseMove(suite.mouseEvent(puzzle.nodes[0][0][2].center()));
  puzzle.controller.onMouseUp(suite.mouseEvent(puzzle.nodes[0][0][2].center()));

  assert("First edge value after second move").that(puzzle.edges[0][0][0].getValue()).isEqualTo("1");
  assert("Second edge value after second move").that(puzzle.edges[0][0][1].getValue()).isEqualTo("1");
}),

test('Drag between nodes without common edge does nothing',(suite) => {
  let puzzle = suite.showPuzzle("hexa_fence", "3x3", {"b1": "1", "b2": "3"});
  puzzle.start();

  // From the top left to the bottom right node of a1.
  suite.drag(puzzle, puzzle.nodes[0][0][0].center(), puzzle.nodes[0][0][3].center());

  assert("Submission data").that(puzzle.collectData()).isEqualTo({});
}),

// Data collector tests
test('Data collector',(suite) => {
  let puzzle = suite.showPuzzle("hexa_fence", "3x3", {"b1": "1", "b2": "3"});
  puzzle.start();

  // Top edge of a1 by drag, the edge between a1 and a2 by click, cross at the edge between a1 and b1.
  suite.drag(puzzle, puzzle.nodes[0][0][0].center(), puzzle.nodes[0][0][1].center());
  suite.click(puzzle, puzzle.edges[0][0][3].center());
  suite.click(puzzle, puzzle.edges[0][0][1].center());
  suite.click(puzzle, puzzle.edges[0][0][1].center());

  assert("Submission data").that(puzzle.collectData()).isEqualTo({"edges": {"a1-0": "1", "a1-3": "1"}});
}),

test('Author data collector',(suite) => {
  let puzzle = suite.showPuzzle("hexa_fence", "3x3");
  puzzle.edit();

  // Choose "3" for b2.
  puzzle.cells[1][1].switchOnChooser(4);

  assert("Cell data").that(puzzle.cells[1][1].data).isEqualTo({text: '3', returnValue: '3'});
  assert("Puzzle data").that(puzzle.collectData()).isEqualTo({"b2": "3"});
}),

);
