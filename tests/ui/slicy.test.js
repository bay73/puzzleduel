slicyTestSuite = uiTestSuite("Slicy", "hexapuzzle", "hexaPuzzleType",

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
// the edge N connects the nodes N and N+1.

// Controller definition tests
test('Solver controllers',(suite) => {
  let puzzle = suite.showPuzzle("slicy", "3x3", {"a1": "cross", "areas": [["a1", "b1", "a2"], ["b2", "c2", "c1"]]});
  puzzle.start();

  assert("Empty cell chooser").that(puzzle.cells[0][1].chooserValues).isNull();
  assert("Empty cell click").that(puzzle.cells[0][1].clickSwitch).containsExactly([{}, {color: puzzle.colorSchema.greyColor, returnValue: '1'}, {image: 'cross'}]);
  assert("Cell with cross data").that(puzzle.cells[0][0].data).isEqualTo({image: 'cross'});
  assert("Cell with cross click").that(puzzle.cells[0][0].clickSwitch).isNull();
  assert("Edge click").that(puzzle.edges[0][0][1].clickSwitch).isNull();
  // The border between a1 and b2, which belong to different areas, is shown as bold.
  assert("Border between areas").that(puzzle.edges[0][0][2].data.color).isEqualTo(puzzle.colorSchema.gridColor);
}),

test('Author controllers',(suite) => {
  let puzzle = suite.showPuzzle("slicy", "2x2");
  puzzle.edit();

  assert("Cell chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("Cell click").that(puzzle.cells[0][0].clickSwitch).containsExactly([{}, {image: 'cross', returnValue: 'cross'}]);
  assert("Edge click").that(puzzle.edges[0][0][1].clickSwitch).containsExactly([{}, {color: puzzle.colorSchema.gridColor, returnValue: 'bold'}]);
}),

// Mouse processing tests
test('Process clicks to empty cell',(suite) => {
  let puzzle = suite.showPuzzle("slicy", "3x3", {"a1": "cross", "areas": [["a1", "b1", "a2"], ["b2", "c2", "c1"]]});
  puzzle.start();

  let cell = puzzle.cells[0][1];
  suite.click(puzzle, cell.center());
  assert("Cell value after one click").that(cell.getValue()).isEqualTo("1");
  assert("Cell data after one click").that(cell.data).isEqualTo({color: puzzle.colorSchema.greyColor, returnValue: '1'});

  suite.click(puzzle, cell.center());
  assert("Cell value after two clicks").that(cell.getValue()).isNull();
  assert("Cell data after two clicks").that(cell.data).isEqualTo({image: 'cross'});

  suite.click(puzzle, cell.center());
  assert("Cell data after three clicks").that(cell.data).isEqualTo({});
}),

test('Cell with given cross is not changed by click',(suite) => {
  let puzzle = suite.showPuzzle("slicy", "3x3", {"a1": "cross", "areas": [["a1", "b1", "a2"], ["b2", "c2", "c1"]]});
  puzzle.start();

  suite.click(puzzle, puzzle.cells[0][0].center());

  assert("Cell data after click").that(puzzle.cells[0][0].data).isEqualTo({image: 'cross'});
  assert("Submission data").that(puzzle.collectData()).isEqualTo({});
}),

test('Copy cell by drag',(suite) => {
  let puzzle = suite.showPuzzle("slicy", "3x3", {"a1": "cross", "areas": [["a1", "b1", "a2"], ["b2", "c2", "c1"]]});
  puzzle.start();

  // Paint b1 and copy it to b2.
  suite.click(puzzle, puzzle.cells[0][1].center());
  suite.drag(puzzle, puzzle.cells[0][1].center(), puzzle.cells[1][1].center());

  assert("Cell value after drag").that(puzzle.cells[1][1].getValue()).isEqualTo("1");

  // The given cross of a1 can be copied to a2 as a mark, it is not submitted.
  suite.drag(puzzle, puzzle.cells[0][0].center(), puzzle.cells[1][0].center());

  assert("Cell data after drag from the cross").that(puzzle.cells[1][0].data.image).isEqualTo("cross");
  assert("Submission data").that(puzzle.collectData()).isEqualTo({"b1": "1", "b2": "1"});
}),

// Data collector tests
test('Data collector',(suite) => {
  let puzzle = suite.showPuzzle("slicy", "3x3", {"a1": "cross", "areas": [["a1", "b1", "a2"], ["b2", "c2", "c1"]]});
  puzzle.start();

  // b1 and e5 are painted, b2 is marked by the cross.
  suite.click(puzzle, puzzle.cells[0][1].center());
  suite.click(puzzle, puzzle.cells[4][4].center());
  suite.click(puzzle, puzzle.cells[1][1].center());
  suite.click(puzzle, puzzle.cells[1][1].center());

  assert("Submission data").that(puzzle.collectData()).isEqualTo({"b1": "1", "e5": "1"});
}),

test('Author areas',(suite) => {
  // Grid 2x2 consists of the cells a1, b1, a2, b2, c2, b3, c3.
  let puzzle = suite.showPuzzle("slicy", "2x2");
  puzzle.edit();

  assert("Puzzle data without borders").that(puzzle.collectData()).isEqualTo({"areas": [["a1", "b1", "a2", "b2", "c2", "b3", "c3"]]});

  // Borders between a1 and its neighbours b1, b2 and a2.
  suite.click(puzzle, puzzle.edges[0][0][1].center());
  suite.click(puzzle, puzzle.edges[0][0][2].center());

  assert("Edge value after click").that(puzzle.edges[0][0][1].getValue()).isEqualTo("bold");
  assert("Puzzle data with not closed border").that(puzzle.collectData()).isEqualTo({"areas": [["a1", "b1", "a2", "b2", "c2", "b3", "c3"]]});

  suite.click(puzzle, puzzle.edges[0][0][3].center());

  assert("Puzzle data with closed border").that(puzzle.collectData()).isEqualTo({"areas": [["a1"], ["b1", "a2", "b2", "c2", "b3", "c3"]]});

  // Cross in a1.
  suite.click(puzzle, puzzle.cells[0][0].center());

  assert("Puzzle data with cross").that(puzzle.collectData()).isEqualTo({"a1": "cross", "areas": [["a1"], ["b1", "a2", "b2", "c2", "b3", "c3"]]});
}),

test('Author draws border by drag between nodes',(suite) => {
  let puzzle = suite.showPuzzle("slicy", "2x2");
  puzzle.edit();

  // Along the edge between a1 and b1.
  suite.drag(puzzle, puzzle.nodes[0][0][1].center(), puzzle.nodes[0][0][2].center());

  assert("Edge value after drag").that(puzzle.edges[0][0][1].getValue()).isEqualTo("bold");
  assert("Edge data after drag").that(puzzle.edges[0][0][1].data).isEqualTo({color: puzzle.colorSchema.gridColor, returnValue: 'bold'});
}),

);
