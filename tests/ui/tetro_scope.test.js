tetroScopeTestSuite = uiTestSuite("Tetro Scope", "squarepuzzle", "squarePuzzleType",

beforeSuite((suite, cb)=> {
  // Emulates one mouse drag which goes through the centers of the given cells.
  suite.dragThrough = function(puzzle, cells) {
    puzzle.controller.onMouseDown(suite.mouseEvent(suite.cellPoint(puzzle, cells[0])));
    for (let i = 1; i < cells.length; i++) {
      puzzle.controller.onMouseMove(suite.mouseEvent(suite.cellPoint(puzzle, cells[i])));
    }
    puzzle.controller.onMouseUp(suite.mouseEvent(suite.cellPoint(puzzle, cells[cells.length - 1])));
  };
  // Emulates several clicks at the bottom right corner of the cell.
  suite.nodeClick = function(puzzle, cell, times) {
    for (let i = 0; i < (times || 1); i++) {
      suite.click(puzzle, suite.cellPoint(puzzle, cell).right(0.5).down(0.5));
    }
  };
  // Puzzle from the checker tests. Clues are numbers in the nodes of the grid: amount of shaded cells around the node.
  // "a1-2" is the bottom right corner of a1 (puzzle.nodes[0][0][2]), the node between a1, b1, a2 and b2.
  //     a b c d e f g h i
  //  1  . . . . . . . . .
  //      2
  //  2  . . . . . . . . .
  //  3  . . . . . . . . .
  //  4  . . . . . . . . .
  //              3     3
  //  5  . . . . . . . . .
  //  6  . . . . . . . . .
  //          0
  //  7  . . . . . . . . .
  //  8  . . . . . . . x .
  //  9  . . . . . . . . .
  suite.CLUES = {"h8": "cross", "nodes": {"a1-2": "2", "e4-2": "3", "h4-2": "3", "c6-2": "0"}};
  cb();
}),

// Controller definition tests
test('Solver controllers',(suite) => {
  let puzzle = suite.showPuzzle("tetro_scope", "9x9", suite.CLUES);
  puzzle.start();

  assert("Empty cell chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("Empty cell click").that(puzzle.cells[0][0].clickSwitch).containsExactly([{}, {color: puzzle.colorSchema.greyColor, returnValue: '1'}, {image: 'cross'}]);
  assert("Empty cell drag processor").that(puzzle.cells[0][0].dragProcessor).isNotNull();
  assert("Cross cell chooser").that(puzzle.cells[7][7].chooserValues).isNull();
  assert("Cross cell click").that(puzzle.cells[7][7].clickSwitch).isNull();
  assert("Cross cell drag processor").that(puzzle.cells[7][7].dragProcessor).isNotNull();
  assert("Clue node chooser").that(puzzle.nodes[0][0][2].chooserValues).isNull();
  assert("Clue node click").that(puzzle.nodes[0][0][2].clickSwitch).isNull();
  assert("Clue node drag processor").that(puzzle.nodes[0][0][2].dragProcessor).isNull();
  assert("Empty node chooser").that(puzzle.nodes[0][1][2].chooserValues).isNull();
  assert("Empty node click").that(puzzle.nodes[0][1][2].clickSwitch).isNull();
  assert("Edge click").that(puzzle.edges[0][0][1].clickSwitch).isNull();
  assert("Edge drag").that(puzzle.edges[0][0][1].dragSwitch).isNull();
}),

test('Author controllers',(suite) => {
  let puzzle = suite.showPuzzle("tetro_scope", "9x9");
  puzzle.edit();

  let numberItem = function(number) {
    return {text: number, color: puzzle.colorSchema.gridColor, textColor: "#fff", returnValue: number};
  }
  assert("Cell chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("Cell click").that(puzzle.cells[0][0].clickSwitch).containsExactly([{}, {image: 'cross', returnValue: 'cross'}]);
  assert("Cell drag processor").that(puzzle.cells[0][0].dragProcessor).isNull();
  assert("Node chooser").that(puzzle.nodes[0][0][2].chooserValues).isNull();
  assert("Node click").that(puzzle.nodes[0][0][2].clickSwitch).containsExactly([{}, numberItem('0'), numberItem('1'), numberItem('2'), numberItem('3'), numberItem('4')]);
  assert("Edge click").that(puzzle.edges[0][0][1].clickSwitch).isNull();
}),

// Clues display tests
test('Show clues',(suite) => {
  let puzzle = suite.showPuzzle("tetro_scope", "9x9", suite.CLUES);
  puzzle.start();

  assert("Node a1-2").that(puzzle.nodes[0][0][2].data).isEqualTo({text: '2', color: puzzle.colorSchema.gridColor, textColor: "#fff"});
  assert("Node e4-2").that(puzzle.nodes[3][4][2].data).isEqualTo({text: '3', color: puzzle.colorSchema.gridColor, textColor: "#fff"});
  assert("Node c6-2").that(puzzle.nodes[5][2][2].data).isEqualTo({text: '0', color: puzzle.colorSchema.gridColor, textColor: "#fff"});
  assert("Node without clue").that(puzzle.nodes[0][1][2].data).isEqualTo({});
  assert("Cross clue").that(puzzle.cells[7][7].data).isEqualTo({image: 'cross'});
  assert("Cross clue is not a part of the solution").that(puzzle.cells[7][7].getValue()).isNull();

  let texts = $(suite.GRID_SELECTOR + " text").map((i, element) => $(element).text()).get();
  assert("Texts in the grid").that(texts).containsExactly(["2", "3", "3", "0"]);
}),

// Mouse processing tests
test('Process clicks to empty cell',(suite) => {
  let puzzle = suite.showPuzzle("tetro_scope", "9x9", suite.CLUES);
  puzzle.start();

  assert("Cell value before click").that(puzzle.cells[0][0].getValue()).isNull();
  assert("Cell data before click").that(puzzle.cells[0][0].data).isEqualTo({});

  suite.cellClick(puzzle, "a1");

  assert("Cell value after one click").that(puzzle.cells[0][0].getValue()).isEqualTo("1");
  assert("Cell data after one click").that(puzzle.cells[0][0].data).isEqualTo({color: puzzle.colorSchema.greyColor, returnValue: '1'});

  suite.cellClick(puzzle, "a1");

  assert("Cell value after two clicks").that(puzzle.cells[0][0].getValue()).isNull();
  assert("Cell data after two clicks").that(puzzle.cells[0][0].data).isEqualTo({image: 'cross'});

  suite.cellClick(puzzle, "a1");

  assert("Cell value after three clicks").that(puzzle.cells[0][0].getValue()).isNull();
  assert("Cell data after three clicks").that(puzzle.cells[0][0].data).isEqualTo({});
  assert("Neighbour cell is not changed").that(puzzle.cells[0][1].data).isEqualTo({});
  assert("Clue node is not changed").that(puzzle.nodes[0][0][2].data).isEqualTo({text: '2', color: puzzle.colorSchema.gridColor, textColor: "#fff"});
}),

test('Clues are not changed by click',(suite) => {
  let puzzle = suite.showPuzzle("tetro_scope", "9x9", suite.CLUES);
  puzzle.start();

  suite.cellClick(puzzle, "h8");

  assert("Cross data after click").that(puzzle.cells[7][7].data).isEqualTo({image: 'cross'});
  assert("Cross value after click").that(puzzle.cells[7][7].getValue()).isNull();

  // Click at the clue node a1-2 and at the node b1-2 without clue.
  suite.nodeClick(puzzle, "a1");
  suite.nodeClick(puzzle, "b1");

  assert("Clue node after click").that(puzzle.nodes[0][0][2].data).isEqualTo({text: '2', color: puzzle.colorSchema.gridColor, textColor: "#fff"});
  assert("Empty node after click").that(puzzle.nodes[0][1][2].data).isEqualTo({});
  assert("Cells around the nodes").that(
    [puzzle.cells[0][0].data, puzzle.cells[0][1].data, puzzle.cells[0][2].data, puzzle.cells[1][0].data, puzzle.cells[1][1].data, puzzle.cells[1][2].data]
  ).isEqualTo([{}, {}, {}, {}, {}, {}]);
}),

test('Paint tetromino by drag',(suite) => {
  let puzzle = suite.showPuzzle("tetro_scope", "9x9", suite.CLUES);
  puzzle.start();

  // Shaded cell g7 is copied to the right and down, cross clue in h8 is skipped.
  suite.cellClick(puzzle, "g7");
  suite.dragThrough(puzzle, ["g7", "h7", "h8", "h9"]);

  let shaded = {color: puzzle.colorSchema.greyColor, returnValue: '1'};
  assert("Cell g7 after drag").that(puzzle.cells[6][6].data).isEqualTo(shaded);
  assert("Cell h7 after drag").that(puzzle.cells[6][7].data).isEqualTo(shaded);
  assert("Cross clue after drag").that(puzzle.cells[7][7].data).isEqualTo({image: 'cross'});
  assert("Cell h9 after drag").that(puzzle.cells[8][7].data).isEqualTo(shaded);
  assert("Cell h9 value").that(puzzle.cells[8][7].getValue()).isEqualTo('1');
  assert("Cell g8 is not changed").that(puzzle.cells[7][6].data).isEqualTo({});
  assert("Cell i7 is not reached").that(puzzle.cells[6][8].data).isEqualTo({});
}),

test('Copy cross by drag',(suite) => {
  let puzzle = suite.showPuzzle("tetro_scope", "9x9", suite.CLUES);
  puzzle.start();

  // Cross is copied from the clue cell h8.
  suite.dragThrough(puzzle, ["h8", "g8", "f8"]);

  assert("Clue cell after drag").that(puzzle.cells[7][7].data).isEqualTo({image: 'cross'});
  assert("Cell g8 after drag").that(puzzle.cells[7][6].data).isEqualTo({image: 'cross'});
  assert("Cell f8 after drag").that(puzzle.cells[7][5].data).isEqualTo({image: 'cross'});
  assert("Cell f8 value").that(puzzle.cells[7][5].getValue()).isNull();

  // Cross set by solver can be changed by click.
  suite.cellClick(puzzle, "f8");
  assert("Cell f8 after click").that(puzzle.cells[7][5].data).isEqualTo({});
}),

test('Erase by drag from empty cell',(suite) => {
  let puzzle = suite.showPuzzle("tetro_scope", "9x9", suite.CLUES);
  puzzle.start();

  suite.cellClick(puzzle, "a4");
  suite.cellClick(puzzle, "a5");
  suite.cellClick(puzzle, "a5");

  suite.dragThrough(puzzle, ["a3", "a4", "a5"]);

  assert("Shaded cell after drag").that(puzzle.cells[3][0].data).isEqualTo({});
  assert("Shaded cell value after drag").that(puzzle.cells[3][0].getValue()).isNull();
  assert("Cross cell after drag").that(puzzle.cells[4][0].data).isEqualTo({});
}),

test('Process clicks to cell in author mode',(suite) => {
  let puzzle = suite.showPuzzle("tetro_scope", "9x9");
  puzzle.edit();

  suite.cellClick(puzzle, "b2");

  assert("Cell value after click").that(puzzle.cells[1][1].getValue()).isEqualTo('cross');
  assert("Cell data after click").that(puzzle.cells[1][1].data).isEqualTo({image: 'cross', returnValue: 'cross'});

  suite.cellClick(puzzle, "b2");

  assert("Cell value after two clicks").that(puzzle.cells[1][1].getValue()).isNull();
  assert("Cell data after two clicks").that(puzzle.cells[1][1].data).isEqualTo({});
}),

test('Process clicks to node in author mode',(suite) => {
  let puzzle = suite.showPuzzle("tetro_scope", "9x9");
  puzzle.edit();

  let node = puzzle.nodes[1][1][2];
  assert("Node value before click").that(node.getValue()).isNull();
  assert("Node data before click").that(node.data).isEqualTo({});

  // Clicks at the bottom right corner of b2: numbers from 0 to 4 and then the empty node again.
  for (let number = 0; number <= 4; number++) {
    suite.nodeClick(puzzle, "b2");

    assert("Node value after " + (number + 1) + " clicks").that(node.getValue()).isEqualTo(number.toString());
    assert("Node data after " + (number + 1) + " clicks").that(node.data).isEqualTo(
      {text: number.toString(), color: puzzle.colorSchema.gridColor, textColor: "#fff", returnValue: number.toString()});
  }
  assert("Cells around the node").that(
    [puzzle.cells[1][1].data, puzzle.cells[1][2].data, puzzle.cells[2][1].data, puzzle.cells[2][2].data]
  ).isEqualTo([{}, {}, {}, {}]);
  assert("Other node").that(puzzle.nodes[1][2][2].data).isEqualTo({});

  suite.nodeClick(puzzle, "b2");

  assert("Node value after 6 clicks").that(node.getValue()).isNull();
  assert("Node data after 6 clicks").that(node.data).isEqualTo({});
}),

// Data collector tests
test('Data collector',(suite) => {
  let puzzle = suite.showPuzzle("tetro_scope", "9x9", suite.CLUES);
  puzzle.start();

  // Solution from the checker tests: seven different tetrominoes.
  //     a b c d e f g h i
  //  1  # # # # . # # . .
  //  2  . . . . . # # . .
  //  3  # # # . . . . . #
  //  4  . # . . # . . . #
  //  5  . . . . # # . # #
  //  6  . . . . . # . . .
  //  7  # . . . . . . . .
  //  8  # . . # # . . x .
  //  9  # # . . # # . . .
  suite.cellClick(puzzle, "a1");
  suite.dragThrough(puzzle, ["a1", "b1", "c1", "d1"]);
  suite.cellClick(puzzle, "f1");
  suite.dragThrough(puzzle, ["f1", "g1", "g2", "f2"]);
  suite.cellClick(puzzle, "a3");
  suite.dragThrough(puzzle, ["a3", "b3", "c3"]);
  suite.dragThrough(puzzle, ["b3", "b4"]);
  suite.cellClick(puzzle, "e4");
  suite.dragThrough(puzzle, ["e4", "e5", "f5", "f6"]);
  suite.cellClick(puzzle, "i3");
  suite.dragThrough(puzzle, ["i3", "i4", "i5", "h5"]);
  suite.cellClick(puzzle, "a7");
  suite.dragThrough(puzzle, ["a7", "a8", "a9", "b9"]);
  suite.cellClick(puzzle, "d8");
  suite.dragThrough(puzzle, ["d8", "e8", "e9", "f9"]);

  // Auxiliary crosses are not submitted.
  suite.dragThrough(puzzle, ["h8", "h7", "g7"]);
  suite.cellClick(puzzle, "e1");
  suite.cellClick(puzzle, "e1");

  assert("Submission data").that(puzzle.collectData()).isEqualTo({
    "a1": "1", "b1": "1", "c1": "1", "d1": "1",
    "f1": "1", "g1": "1", "f2": "1", "g2": "1",
    "a3": "1", "b3": "1", "c3": "1", "b4": "1",
    "e4": "1", "e5": "1", "f5": "1", "f6": "1",
    "i3": "1", "i4": "1", "h5": "1", "i5": "1",
    "a7": "1", "a8": "1", "a9": "1", "b9": "1",
    "d8": "1", "e8": "1", "e9": "1", "f9": "1"});
}),

test('Author data collector',(suite) => {
  let puzzle = suite.showPuzzle("tetro_scope", "9x9");
  puzzle.edit();

  assert("Data of the empty puzzle").that(puzzle.collectData()).isEqualTo({});

  // Clues from the checker tests: N+1 clicks at the node set the number N.
  suite.cellClick(puzzle, "h8");
  suite.nodeClick(puzzle, "a1", 3);
  suite.nodeClick(puzzle, "e4", 4);
  suite.nodeClick(puzzle, "h4", 4);
  suite.nodeClick(puzzle, "c6", 1);

  assert("Puzzle data").that(puzzle.collectData()).isEqualTo(suite.CLUES);

  // Change number in a1-2 from 2 to 4, remove number from c6-2 (5 more clicks) and remove the cross.
  suite.nodeClick(puzzle, "a1", 2);
  suite.nodeClick(puzzle, "c6", 5);
  suite.cellClick(puzzle, "h8");

  assert("Puzzle data after changes").that(puzzle.collectData()).isEqualTo({"nodes": {"a1-2": "4", "e4-2": "3", "h4-2": "3"}});
}),

test('Author data collector for existing puzzle',(suite) => {
  let puzzle = suite.showPuzzle("tetro_scope", "9x9", suite.CLUES);
  puzzle.edit();

  assert("Loaded node").that(puzzle.nodes[0][0][2].getValue()).isEqualTo('2');
  assert("Loaded cross").that(puzzle.cells[7][7].getValue()).isEqualTo('cross');
  assert("Puzzle data").that(puzzle.collectData()).isEqualTo(suite.CLUES);

  // The next click at the loaded node 2 changes it to 3.
  suite.nodeClick(puzzle, "a1");

  assert("Puzzle data after click").that(puzzle.collectData()).isEqualTo(
    {"h8": "cross", "nodes": {"a1-2": "3", "e4-2": "3", "h4-2": "3", "c6-2": "0"}});
}),

);
