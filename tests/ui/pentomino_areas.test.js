pentominoAreasTestSuite = uiTestSuite("Pentomino Areas", "squarepuzzle", "squarePuzzleType",

beforeSuite((suite, cb)=> {
  // Emulates one mouse drag which goes through the centers of the given cells.
  suite.dragThrough = function(puzzle, cells) {
    puzzle.controller.onMouseDown(suite.mouseEvent(suite.cellPoint(puzzle, cells[0])));
    for (let i = 1; i < cells.length; i++) {
      puzzle.controller.onMouseMove(suite.mouseEvent(suite.cellPoint(puzzle, cells[i])));
    }
    puzzle.controller.onMouseUp(suite.mouseEvent(suite.cellPoint(puzzle, cells[cells.length - 1])));
  };
  // Emulates one mouse drag along the grid lines through the given nodes.
  // Node is a pair [col, row], node [0, 0] is the top left corner of the grid.
  suite.dragAlongNodes = function(puzzle, nodes) {
    let points = nodes.map(node => suite.gridPoint(puzzle, node[0], node[1]));
    puzzle.controller.onMouseDown(suite.mouseEvent(points[0]));
    for (let i = 1; i < points.length; i++) {
      puzzle.controller.onMouseMove(suite.mouseEvent(points[i]));
    }
    puzzle.controller.onMouseUp(suite.mouseEvent(points[points.length - 1]));
  };
  // Puzzle from the checker tests: two areas (rows 1-2 and rows 3-6) and a cross in b4.
  //     a b c d e f
  //  1  . . . . . .
  //  2  . . . . . .
  //     -----------
  //  3  . . . . . .
  //  4  . x . . . .
  //  5  . . . . . .
  //  6  . . . . . .
  suite.CLUES = {"b4": "cross", "areas": [["a1", "b1", "c1", "d1", "e1", "f1", "a2", "b2", "c2", "d2", "e2", "f2"],
                                          ["a3", "b3", "c3", "d3", "e3", "f3", "a4", "b4", "c4", "d4", "e4", "f4", "a5", "b5", "c5", "d5", "e5", "f5", "a6", "b6", "c6", "d6", "e6", "f6"]]};
  cb();
}),

// Controller definition tests
test('Solver controllers',(suite) => {
  let puzzle = suite.showPuzzle("pentomino_areas", "6x6-IV", suite.CLUES);
  puzzle.start();

  assert("Empty cell chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("Empty cell click").that(puzzle.cells[0][0].clickSwitch).containsExactly([{}, {color: puzzle.colorSchema.greyColor, returnValue: '1'}, {image: 'cross'}]);
  assert("Empty cell drag processor").that(puzzle.cells[0][0].dragProcessor).isNotNull();
  assert("Cross cell chooser").that(puzzle.cells[3][1].chooserValues).isNull();
  assert("Cross cell click").that(puzzle.cells[3][1].clickSwitch).isNull();
  assert("Cross cell drag processor").that(puzzle.cells[3][1].dragProcessor).isNotNull();
  assert("Edge inside area chooser").that(puzzle.edges[0][0][1].chooserValues).isNull();
  assert("Edge inside area click").that(puzzle.edges[0][0][1].clickSwitch).isNull();
  assert("Edge inside area drag").that(puzzle.edges[0][0][1].dragSwitch).isNull();
  assert("Area border click").that(puzzle.edges[1][0][2].clickSwitch).isNull();
  assert("Area border drag").that(puzzle.edges[1][0][2].dragSwitch).isNull();
}),

test('Author controllers',(suite) => {
  let puzzle = suite.showPuzzle("pentomino_areas", "6x6-IV");
  puzzle.edit();

  assert("Cell chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("Cell click").that(puzzle.cells[0][0].clickSwitch).containsExactly([{}, {image: 'cross', returnValue: 'cross'}]);
  assert("Cell drag processor").that(puzzle.cells[0][0].dragProcessor).isNull();
  assert("Edge chooser").that(puzzle.edges[0][0][1].chooserValues).isNull();
  assert("Edge click").that(puzzle.edges[0][0][1].clickSwitch).containsExactly([{}, {color: puzzle.colorSchema.gridColor, returnValue: 'bold'}]);
  assert("Edge drag").that(puzzle.edges[0][0][1].dragSwitch).containsExactly([{}, {color: puzzle.colorSchema.gridColor, returnValue: 'bold'}]);
  assert("Node chooser").that(puzzle.nodes[0][0][2].chooserValues).isNull();
  assert("Node click").that(puzzle.nodes[0][0][2].clickSwitch).isNull();
  assert("Node drag processor").that(puzzle.nodes[0][0][2].dragProcessor).isNotNull();
}),

// Clues display tests
test('Show areas',(suite) => {
  let puzzle = suite.showPuzzle("pentomino_areas", "6x6-IV", suite.CLUES);
  puzzle.start();

  // Bottom edges of the row 2 are area borders.
  assert("Border below a2").that(puzzle.edges[1][0][2].data).isEqualTo({color: puzzle.colorSchema.gridColor});
  assert("Border below f2").that(puzzle.edges[1][5][2].data).isEqualTo({color: puzzle.colorSchema.gridColor});
  assert("Border above c3").that(puzzle.edges[2][2][0].data).isEqualTo({color: puzzle.colorSchema.gridColor});
  assert("Edge between a1 and a2").that(puzzle.edges[0][0][2].data).isEqualTo({});
  assert("Edge between a1 and b1").that(puzzle.edges[0][0][1].data).isEqualTo({});
  assert("Edge between a3 and a4").that(puzzle.edges[2][0][2].data).isEqualTo({});
  assert("Edge between a3 and b3").that(puzzle.edges[2][0][1].data).isEqualTo({});
  assert("Cross clue").that(puzzle.cells[3][1].data).isEqualTo({image: 'cross'});
  assert("Cross clue is not a part of the solution").that(puzzle.cells[3][1].getValue()).isNull();
}),

// Mouse processing tests
test('Process clicks to empty cell',(suite) => {
  let puzzle = suite.showPuzzle("pentomino_areas", "6x6-IV", suite.CLUES);
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
}),

test('Cross clue is not changed by click',(suite) => {
  let puzzle = suite.showPuzzle("pentomino_areas", "6x6-IV", suite.CLUES);
  puzzle.start();

  suite.cellClick(puzzle, "b4");

  assert("Clue data after click").that(puzzle.cells[3][1].data).isEqualTo({image: 'cross'});
  assert("Clue value after click").that(puzzle.cells[3][1].getValue()).isNull();
}),

test('Edges are not changed by solver',(suite) => {
  let puzzle = suite.showPuzzle("pentomino_areas", "6x6-IV", suite.CLUES);
  puzzle.start();

  // Click at the area border below a2 and at the edge between a1 and b1.
  suite.edgeClick(puzzle, "a2-2");
  suite.edgeClick(puzzle, "a1-1");

  assert("Area border after click").that(puzzle.edges[1][0][2].data).isEqualTo({color: puzzle.colorSchema.gridColor});
  assert("Edge inside area after click").that(puzzle.edges[0][0][1].data).isEqualTo({});

  // Drag along the area border and along the edge between a1 and b1.
  suite.dragAlongNodes(puzzle, [[0, 2], [1, 2], [2, 2]]);
  suite.dragAlongNodes(puzzle, [[1, 0], [1, 1]]);

  assert("Area border after drag").that(puzzle.edges[1][0][2].data).isEqualTo({color: puzzle.colorSchema.gridColor});
  assert("Edge inside area after drag").that(puzzle.edges[0][0][1].data).isEqualTo({});
  assert("Cells near the edges").that([puzzle.cells[0][0].data, puzzle.cells[0][1].data, puzzle.cells[1][0].data, puzzle.cells[2][0].data]).isEqualTo([{}, {}, {}, {}]);
}),

test('Paint pentomino by drag',(suite) => {
  let puzzle = suite.showPuzzle("pentomino_areas", "6x6-IV", suite.CLUES);
  puzzle.start();

  // Shaded cell b2 is copied down through the area border, cross clue in b4 is skipped.
  suite.cellClick(puzzle, "b2");
  suite.dragThrough(puzzle, ["b2", "b3", "b4", "b5", "c5"]);

  let shaded = {color: puzzle.colorSchema.greyColor, returnValue: '1'};
  assert("Cell b2 after drag").that(puzzle.cells[1][1].data).isEqualTo(shaded);
  assert("Cell b3 after drag").that(puzzle.cells[2][1].data).isEqualTo(shaded);
  assert("Cross clue after drag").that(puzzle.cells[3][1].data).isEqualTo({image: 'cross'});
  assert("Cell b5 after drag").that(puzzle.cells[4][1].data).isEqualTo(shaded);
  assert("Cell c5 after drag").that(puzzle.cells[4][2].data).isEqualTo(shaded);
  assert("Cell c5 value").that(puzzle.cells[4][2].getValue()).isEqualTo('1');
  assert("Cell b6 is not reached").that(puzzle.cells[5][1].data).isEqualTo({});
  assert("Area border after drag").that(puzzle.edges[1][1][2].data).isEqualTo({color: puzzle.colorSchema.gridColor});
}),

test('Copy cross by drag',(suite) => {
  let puzzle = suite.showPuzzle("pentomino_areas", "6x6-IV", suite.CLUES);
  puzzle.start();

  // Cross is copied from the clue cell b4.
  suite.dragThrough(puzzle, ["b4", "c4", "d4"]);

  assert("Clue cell after drag").that(puzzle.cells[3][1].data).isEqualTo({image: 'cross'});
  assert("Cell c4 after drag").that(puzzle.cells[3][2].data).isEqualTo({image: 'cross'});
  assert("Cell d4 after drag").that(puzzle.cells[3][3].data).isEqualTo({image: 'cross'});
  assert("Cell d4 value").that(puzzle.cells[3][3].getValue()).isNull();

  // Cross set by solver can be changed by click.
  suite.cellClick(puzzle, "d4");
  assert("Cell d4 after click").that(puzzle.cells[3][3].data).isEqualTo({});
}),

test('Erase by drag from empty cell',(suite) => {
  let puzzle = suite.showPuzzle("pentomino_areas", "6x6-IV", suite.CLUES);
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
  let puzzle = suite.showPuzzle("pentomino_areas", "6x6-IV");
  puzzle.edit();

  suite.cellClick(puzzle, "b2");

  assert("Cell value after click").that(puzzle.cells[1][1].getValue()).isEqualTo('cross');
  assert("Cell data after click").that(puzzle.cells[1][1].data).isEqualTo({image: 'cross', returnValue: 'cross'});

  suite.cellClick(puzzle, "b2");

  assert("Cell value after two clicks").that(puzzle.cells[1][1].getValue()).isNull();
  assert("Cell data after two clicks").that(puzzle.cells[1][1].data).isEqualTo({});
}),

test('Process clicks to edge in author mode',(suite) => {
  let puzzle = suite.showPuzzle("pentomino_areas", "6x6-IV");
  puzzle.edit();

  assert("Edge value before click").that(puzzle.edges[0][0][2].getValue()).isNull();
  assert("Edge data before click").that(puzzle.edges[0][0][2].data).isEqualTo({});

  // Click at the edge between a1 and a2.
  suite.edgeClick(puzzle, "a1-2");

  assert("Edge value after click").that(puzzle.edges[0][0][2].getValue()).isEqualTo("bold");
  assert("Edge data after click").that(puzzle.edges[0][0][2].data).isEqualTo({color: puzzle.colorSchema.gridColor, returnValue: "bold"});
  assert("The same edge from the cell a2").that(puzzle.edges[1][0][0].getValue()).isEqualTo("bold");
  assert("Next edge").that(puzzle.edges[0][1][2].data).isEqualTo({});
  assert("Cells near the edge").that([puzzle.cells[0][0].data, puzzle.cells[1][0].data]).isEqualTo([{}, {}]);

  suite.edgeClick(puzzle, "a1-2");

  assert("Edge value after two clicks").that(puzzle.edges[0][0][2].getValue()).isNull();
  assert("Edge data after two clicks").that(puzzle.edges[0][0][2].data).isEqualTo({});
}),

test('Process drag for edges in author mode',(suite) => {
  let puzzle = suite.showPuzzle("pentomino_areas", "6x6-IV");
  puzzle.edit();

  // Drag along the right side of a1, then along the bottom sides of b1 and c1.
  suite.dragAlongNodes(puzzle, [[1, 0], [1, 1], [2, 1], [3, 1]]);

  let border = {color: puzzle.colorSchema.gridColor, returnValue: "bold"};
  assert("Right edge of a1 after drag").that(puzzle.edges[0][0][1].data).isEqualTo(border);
  assert("Bottom edge of b1 after drag").that(puzzle.edges[0][1][2].data).isEqualTo(border);
  assert("Bottom edge of c1 after drag").that(puzzle.edges[0][2][2].data).isEqualTo(border);
  assert("Bottom edge of d1 after drag").that(puzzle.edges[0][3][2].data).isEqualTo({});
  assert("Bottom edge of a1 after drag").that(puzzle.edges[0][0][2].data).isEqualTo({});

  // The second drag along the edge removes the border.
  suite.dragAlongNodes(puzzle, [[2, 1], [3, 1]]);

  assert("Bottom edge of c1 after the second drag").that(puzzle.edges[0][2][2].data).isEqualTo({});
  assert("Bottom edge of b1 after the second drag").that(puzzle.edges[0][1][2].data).isEqualTo(border);
}),

// Data collector tests
test('Data collector',(suite) => {
  let puzzle = suite.showPuzzle("pentomino_areas", "6x6-IV", suite.CLUES);
  puzzle.start();

  // Solution from the checker tests: pentomino I in the first area and pentomino V in the second one.
  //     a b c d e f
  //  1  # # # # # .
  //  2  . . . . . .
  //     -----------
  //  3  . . . # . .
  //  4  . x . # . .
  //  5  . . . # # #
  //  6  . . . . . .
  suite.cellClick(puzzle, "a1");
  suite.dragThrough(puzzle, ["a1", "b1", "c1", "d1", "e1"]);
  suite.cellClick(puzzle, "d3");
  suite.dragThrough(puzzle, ["d3", "d4", "d5", "e5", "f5"]);

  // Auxiliary crosses are not submitted.
  suite.dragThrough(puzzle, ["b4", "c4", "c3"]);
  suite.cellClick(puzzle, "f1");
  suite.cellClick(puzzle, "f1");

  assert("Submission data").that(puzzle.collectData()).isEqualTo(
    {"a1": "1", "b1": "1", "c1": "1", "d1": "1", "e1": "1", "d3": "1", "d4": "1", "d5": "1", "e5": "1", "f5": "1"});
}),

test('Author data collector',(suite) => {
  let puzzle = suite.showPuzzle("pentomino_areas", "6x6-IV");
  puzzle.edit();

  let allCells = [];
  for (let row = 1; row <= 6; row++) {
    for (let col of "abcdef") {
      allCells.push(col + row);
    }
  }
  assert("Data of the empty puzzle").that(puzzle.collectData()).isEqualTo({"areas": [allCells]});

  // Clues from the checker tests: border between the rows 2 and 3 and cross in b4.
  suite.dragAlongNodes(puzzle, [[0, 2], [1, 2], [2, 2], [3, 2], [4, 2]]);

  assert("Data for unfinished border").that(puzzle.collectData()).isEqualTo({"areas": [allCells]});

  suite.edgeClick(puzzle, "e2-2");
  suite.edgeClick(puzzle, "f2-2");
  suite.cellClick(puzzle, "b4");

  assert("Puzzle data").that(puzzle.collectData()).isEqualTo(suite.CLUES);

  // Separate cells a1 and a2 to one more area.
  suite.dragAlongNodes(puzzle, [[1, 0], [1, 1], [1, 2]]);

  // The order of the areas doesn't matter.
  let data = puzzle.collectData();
  assert("Cross for three areas").that(data["b4"]).isEqualTo("cross");
  assert("Three areas").that(data["areas"]).containsExactly(
    [["a1", "a2"],
     ["b1", "c1", "d1", "e1", "f1", "b2", "c2", "d2", "e2", "f2"],
     ["a3", "b3", "c3", "d3", "e3", "f3", "a4", "b4", "c4", "d4", "e4", "f4", "a5", "b5", "c5", "d5", "e5", "f5", "a6", "b6", "c6", "d6", "e6", "f6"]]);
}),

test('Author data collector for existing puzzle',(suite) => {
  let puzzle = suite.showPuzzle("pentomino_areas", "6x6-IV", suite.CLUES);
  puzzle.edit();

  assert("Loaded border").that(puzzle.edges[1][0][2].getValue()).isEqualTo('bold');
  assert("Loaded cross").that(puzzle.cells[3][1].getValue()).isEqualTo('cross');
  assert("Puzzle data").that(puzzle.collectData()).isEqualTo(suite.CLUES);

  // Removing a part of the border joins the areas, cross is removed by click.
  suite.edgeClick(puzzle, "c2-2");
  suite.cellClick(puzzle, "b4");

  let allCells = [];
  for (let row = 1; row <= 6; row++) {
    for (let col of "abcdef") {
      allCells.push(col + row);
    }
  }
  assert("Puzzle data after changes").that(puzzle.collectData()).isEqualTo({"areas": [allCells]});
}),

);
