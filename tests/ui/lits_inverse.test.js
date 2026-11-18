litsInverseTestSuite = uiTestSuite("LITS Inverse", "squarepuzzle", "squarePuzzleType",

// Puzzle from the checker tests: two areas, the top and the bottom halves of the grid.
//     a b c d
//   1 . . . .
//   2 . . . .
//     -------
//   3 . . . .
//   4 . . . .

beforeSuite((suite, cb)=> {
  suite.AREAS = [["a1", "b1", "c1", "d1", "a2", "b2", "c2", "d2"], ["a3", "b3", "c3", "d3", "a4", "b4", "c4", "d4"]];
  suite.CLUES = {"areas": suite.AREAS};
  // The same puzzle with a given cross in b1.
  suite.CLUES_WITH_CROSS = {"areas": suite.AREAS, "b1": "cross"};
  // Emulates one mouse drag which starts in the first cell and goes through the centers of the other cells.
  suite.dragOverCells = function(puzzle, ...cells) {
    puzzle.controller.onMouseDown(suite.mouseEvent(suite.cellPoint(puzzle, cells[0])));
    for (let i = 1; i < cells.length; i++) {
      puzzle.controller.onMouseMove(suite.mouseEvent(suite.cellPoint(puzzle, cells[i])));
    }
    puzzle.controller.onMouseUp(suite.mouseEvent(suite.cellPoint(puzzle, cells[cells.length - 1])));
  };
  // Emulates one mouse drag along the grid lines through the given nodes: node [0, 0] is the top left corner of a1.
  suite.dragAlongNodes = function(puzzle, ...nodes) {
    let points = nodes.map(node => suite.gridPoint(puzzle, node[0], node[1]));
    puzzle.controller.onMouseDown(suite.mouseEvent(points[0]));
    for (let i = 1; i < points.length; i++) {
      puzzle.controller.onMouseMove(suite.mouseEvent(points[i]));
    }
    puzzle.controller.onMouseUp(suite.mouseEvent(points[points.length - 1]));
  };
  cb();
}),

// Controller definition tests
test('Solver controllers',(suite) => {
  let puzzle = suite.showPuzzle("lits_inverse", "4x4", suite.CLUES_WITH_CROSS);
  puzzle.start();

  assert("Empty cell chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("Empty cell click").that(puzzle.cells[0][0].clickSwitch).containsExactly([{}, {color: puzzle.colorSchema.greyColor, returnValue: '1'}, {image: 'cross'}]);
  assert("Empty cell drag handler").that(puzzle.cells[0][0].drawDragHandler).isNotNull();
  assert("Empty cell drag processor").that(puzzle.cells[0][0].dragProcessor).isNotNull();
  assert("Cross cell chooser").that(puzzle.cells[0][1].chooserValues).isNull();
  assert("Cross cell click").that(puzzle.cells[0][1].clickSwitch).isNull();
  assert("Cross cell drag handler").that(puzzle.cells[0][1].drawDragHandler).isNotNull();
  assert("Cross cell drag processor").that(puzzle.cells[0][1].dragProcessor).isNotNull();
  assert("Edge chooser").that(puzzle.edges[0][0][1].chooserValues).isNull();
  assert("Edge click").that(puzzle.edges[0][0][1].clickSwitch).isNull();
  assert("Edge drag").that(puzzle.edges[0][0][1].dragSwitch).isNull();
  assert("Area border click").that(puzzle.edges[1][0][2].clickSwitch).isNull();
  assert("Area border drag").that(puzzle.edges[1][0][2].dragSwitch).isNull();
}),

test('Author controllers',(suite) => {
  let puzzle = suite.showPuzzle("lits_inverse", "4x4");
  puzzle.edit();

  let border = {color: puzzle.colorSchema.gridColor, returnValue: 'bold'};

  assert("Cell chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("Cell click").that(puzzle.cells[0][0].clickSwitch).containsExactly([{}, {image: 'cross', returnValue: 'cross'}]);
  assert("Cell drag processor").that(puzzle.cells[0][0].dragProcessor).isNull();
  assert("Edge chooser").that(puzzle.edges[0][0][1].chooserValues).isNull();
  assert("Edge click").that(puzzle.edges[0][0][1].clickSwitch).containsExactly([{}, border]);
  assert("Edge drag").that(puzzle.edges[0][0][1].dragSwitch).containsExactly([{}, border]);
  assert("Horizontal edge click").that(puzzle.edges[0][0][2].clickSwitch).containsExactly([{}, border]);
  assert("Horizontal edge drag").that(puzzle.edges[0][0][2].dragSwitch).containsExactly([{}, border]);
}),

// Clue display tests
test('Show clues',(suite) => {
  let puzzle = suite.showPuzzle("lits_inverse", "4x4", suite.CLUES_WITH_CROSS);
  puzzle.start();

  let gridColor = puzzle.colorSchema.gridColor;

  assert("Cross cell data").that(puzzle.cells[0][1].data).isEqualTo({image: 'cross'});
  assert("Cross cell value").that(puzzle.cells[0][1].getValue()).isNull();

  // Areas are shown by bold borders.
  assert("Border between a2 and a3").that(puzzle.edges[1][0][2].data.color).isEqualTo(gridColor);
  assert("Border between b2 and b3").that(puzzle.edges[1][1][2].data.color).isEqualTo(gridColor);
  assert("Border between d2 and d3").that(puzzle.edges[1][3][2].data.color).isEqualTo(gridColor);
  assert("No border between a1 and a2").that(puzzle.edges[0][0][2].data.color).isNull();
  assert("No border between a3 and a4").that(puzzle.edges[2][0][2].data.color).isNull();
  assert("No border between a2 and b2").that(puzzle.edges[1][0][1].data.color).isNull();
  assert("No border between c3 and d3").that(puzzle.edges[2][2][1].data.color).isNull();

  assert("Submission data").that(puzzle.collectData()).isEqualTo({});
}),

// Mouse processing tests
test('Process click to empty cell',(suite) => {
  let puzzle = suite.showPuzzle("lits_inverse", "4x4", suite.CLUES);
  puzzle.start();

  let point = suite.cellPoint(puzzle, "a1");

  assert("Cell value before click").that(puzzle.cells[0][0].getValue()).isNull();

  suite.click(puzzle, point);

  assert("Cell value after one click").that(puzzle.cells[0][0].getValue()).isEqualTo("1");
  assert("Cell data after one click").that(puzzle.cells[0][0].data).isEqualTo({color: puzzle.colorSchema.greyColor, returnValue: "1"});

  suite.click(puzzle, point);

  assert("Cell value after two clicks").that(puzzle.cells[0][0].getValue()).isNull();
  assert("Cell data after two clicks").that(puzzle.cells[0][0].data).isEqualTo({image: "cross"});

  suite.click(puzzle, point);

  assert("Cell value after three clicks").that(puzzle.cells[0][0].getValue()).isNull();
  assert("Cell data after three clicks").that(puzzle.cells[0][0].data).isEqualTo({});
}),

test('Process click to given cross',(suite) => {
  let puzzle = suite.showPuzzle("lits_inverse", "4x4", suite.CLUES_WITH_CROSS);
  puzzle.start();

  suite.cellClick(puzzle, "b1");

  assert("Cell value after click").that(puzzle.cells[0][1].getValue()).isNull();
  assert("Cell data after click").that(puzzle.cells[0][1].data).isEqualTo({image: "cross"});
  assert("Submission data").that(puzzle.collectData()).isEqualTo({});
}),

test('Shade cells by drag',(suite) => {
  let puzzle = suite.showPuzzle("lits_inverse", "4x4", suite.CLUES_WITH_CROSS);
  puzzle.start();

  let greyColor = puzzle.colorSchema.greyColor;

  suite.cellClick(puzzle, "a2");
  // One move from the shaded a2, the path goes through the given cross in b1.
  suite.dragOverCells(puzzle, "a2", "a1", "b1", "c1");

  assert("Source cell value").that(puzzle.cells[1][0].getValue()).isEqualTo("1");
  assert("Value of a1").that(puzzle.cells[0][0].getValue()).isEqualTo("1");
  assert("Data of a1").that(puzzle.cells[0][0].data).isEqualTo({color: greyColor, returnValue: "1"});
  assert("Value of c1").that(puzzle.cells[0][2].getValue()).isEqualTo("1");
  assert("Data of c1").that(puzzle.cells[0][2].data).isEqualTo({color: greyColor, returnValue: "1"});
  // Given cross is not changed.
  assert("Given cross data").that(puzzle.cells[0][1].data).isEqualTo({image: "cross"});
  assert("Given cross value").that(puzzle.cells[0][1].getValue()).isNull();

  assert("Submission data").that(puzzle.collectData()).isEqualTo({"a1": "1", "c1": "1", "a2": "1"});
}),

test('Set crosses by drag from given cross',(suite) => {
  let puzzle = suite.showPuzzle("lits_inverse", "4x4", suite.CLUES_WITH_CROSS);
  puzzle.start();

  suite.dragOverCells(puzzle, "b1", "c1", "d1");

  assert("Data of c1").that(puzzle.cells[0][2].data).isEqualTo({image: "cross"});
  assert("Data of d1").that(puzzle.cells[0][3].data).isEqualTo({image: "cross"});
  assert("Given cross data").that(puzzle.cells[0][1].data).isEqualTo({image: "cross"});
  assert("Submission data").that(puzzle.collectData()).isEqualTo({});

  // Unlike the given cross, the copied ones can be changed.
  suite.cellClick(puzzle, "c1");

  assert("Data of c1 after click").that(puzzle.cells[0][2].data).isEqualTo({});
}),

test('Set crosses by drag from cell with cross',(suite) => {
  let puzzle = suite.showPuzzle("lits_inverse", "4x4", suite.CLUES);
  puzzle.start();

  suite.cellClick(puzzle, "a3");
  suite.cellClick(puzzle, "a3");
  suite.dragOverCells(puzzle, "a3", "b3", "b4");

  assert("Source cell data").that(puzzle.cells[2][0].data).isEqualTo({image: "cross"});
  assert("Data of b3").that(puzzle.cells[2][1].data).isEqualTo({image: "cross"});
  assert("Data of b4").that(puzzle.cells[3][1].data).isEqualTo({image: "cross"});
  assert("Submission data").that(puzzle.collectData()).isEqualTo({});
}),

test('Clear cells by drag',(suite) => {
  let puzzle = suite.showPuzzle("lits_inverse", "4x4", suite.CLUES);
  puzzle.start();

  suite.cellClick(puzzle, "b3");
  suite.cellClick(puzzle, "c3");
  suite.cellClick(puzzle, "d3");
  // Drag from the empty cell a3 clears the cells on its way.
  suite.dragOverCells(puzzle, "a3", "b3", "c3");

  assert("Value of b3").that(puzzle.cells[2][1].getValue()).isNull();
  assert("Color of b3").that(puzzle.cells[2][1].data.color).isNull();
  assert("Value of c3").that(puzzle.cells[2][2].getValue()).isNull();
  assert("Color of c3").that(puzzle.cells[2][2].data.color).isNull();
  assert("Submission data").that(puzzle.collectData()).isEqualTo({"d3": "1"});
}),

// Data collector tests
test('Data collector',(suite) => {
  let puzzle = suite.showPuzzle("lits_inverse", "4x4", suite.CLUES);
  puzzle.start();

  // Solution:  . . . .
  //            # # # #
  //            # . . #
  //            # . . #
  suite.cellClick(puzzle, "a2");
  suite.dragOverCells(puzzle, "a2", "b2", "c2", "d2", "d3", "d4");
  suite.dragOverCells(puzzle, "a2", "a3", "a4");
  // Crosses are not submitted.
  suite.cellClick(puzzle, "b3");
  suite.cellClick(puzzle, "b3");

  assert("Submission data").that(puzzle.collectData()).isEqualTo(
    {"a2": "1", "b2": "1", "c2": "1", "d2": "1", "a3": "1", "d3": "1", "a4": "1", "d4": "1"});
}),

// Author tests
test('Author sets crosses by click',(suite) => {
  let puzzle = suite.showPuzzle("lits_inverse", "2x2");
  puzzle.edit();

  suite.cellClick(puzzle, "b1");

  assert("Cell value after click").that(puzzle.cells[0][1].getValue()).isEqualTo("cross");
  assert("Cell data after click").that(puzzle.cells[0][1].data).isEqualTo({image: "cross", returnValue: "cross"});
  assert("Puzzle data with cross").that(puzzle.collectData()).isEqualTo({"areas": [["a1", "b1", "a2", "b2"]], "b1": "cross"});

  suite.cellClick(puzzle, "b1");

  assert("Cell value after second click").that(puzzle.cells[0][1].getValue()).isNull();
  assert("Puzzle data after cross is removed").that(puzzle.collectData()).isEqualTo({"areas": [["a1", "b1", "a2", "b2"]]});
}),

test('Author draws area borders',(suite) => {
  let puzzle = suite.showPuzzle("lits_inverse", "2x2");
  puzzle.edit();

  let border = {color: puzzle.colorSchema.gridColor, returnValue: "bold"};

  assert("Edge value before click").that(puzzle.edges[0][0][1].getValue()).isNull();

  // Click at the edge between a1 and b1.
  suite.edgeClick(puzzle, "a1-1");

  assert("Edge value after click").that(puzzle.edges[0][0][1].getValue()).isEqualTo("bold");
  assert("Edge data after click").that(puzzle.edges[0][0][1].data).isEqualTo(border);
  // The border doesn't split the grid yet.
  assert("Puzzle data with one border").that(puzzle.collectData()).isEqualTo({"areas": [["a1", "b1", "a2", "b2"]]});

  // Drag along the edge between a2 and b2.
  suite.dragAlongNodes(puzzle, [1, 1], [1, 2]);

  assert("Edge value after drag").that(puzzle.edges[1][0][1].getValue()).isEqualTo("bold");
  assert("Edge data after drag").that(puzzle.edges[1][0][1].data).isEqualTo(border);
  assert("Puzzle data with two areas").that(puzzle.collectData()).isEqualTo({"areas": [["a1", "a2"], ["b1", "b2"]]});

  // Border between a1 and a2 separates one more area.
  suite.edgeClick(puzzle, "a1-2");

  assert("Puzzle data with three areas").that(puzzle.collectData()).isEqualTo({"areas": [["a1"], ["a2"], ["b1", "b2"]]});

  // Second click removes the border.
  suite.edgeClick(puzzle, "a1-1");

  assert("Edge value after second click").that(puzzle.edges[0][0][1].getValue()).isNull();
  assert("Puzzle data after border is removed").that(puzzle.collectData()).isEqualTo({"areas": [["a1", "b1", "b2"], ["a2"]]});
}),

test('Author data collector',(suite) => {
  let puzzle = suite.showPuzzle("lits_inverse", "4x4");
  puzzle.edit();

  // Horizontal line in the middle of the grid is drawn by one drag, then cross is set in b1.
  suite.dragAlongNodes(puzzle, [0, 2], [1, 2], [2, 2], [3, 2], [4, 2]);
  suite.cellClick(puzzle, "b1");

  assert("Puzzle data").that(puzzle.collectData()).isEqualTo(suite.CLUES_WITH_CROSS);
}),

test('Author edits existing puzzle',(suite) => {
  let puzzle = suite.showPuzzle("lits_inverse", "4x4", suite.CLUES_WITH_CROSS);
  puzzle.edit();

  assert("Cross value").that(puzzle.cells[0][1].getValue()).isEqualTo("cross");
  assert("Border value").that(puzzle.edges[1][0][2].getValue()).isEqualTo("bold");
  assert("Puzzle data").that(puzzle.collectData()).isEqualTo(suite.CLUES_WITH_CROSS);

  // Remove the cross and split the top area by the vertical line between b and c columns.
  suite.cellClick(puzzle, "b1");
  suite.dragAlongNodes(puzzle, [2, 0], [2, 1], [2, 2]);

  assert("Puzzle data after change").that(puzzle.collectData()).isEqualTo(
    {"areas": [["a1", "b1", "a2", "b2"], ["c1", "d1", "c2", "d2"], ["a3", "b3", "c3", "d3", "a4", "b4", "c4", "d4"]]});
}),

);
