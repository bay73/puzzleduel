kaitorammaTestSuite = uiTestSuite("Kaitoramma", "squarepuzzle", "krammaPuzzleType",

// Puzzle 4x4 and its solution (W, B are white and black circles):
//   W . | . B      a1 b1 c1 d1
//   . . | . .      a2 b2 c2 d2
//   ----+----
//   . B | W .      a3 b3 c3 d3
//   . . | . W      a4 b4 c4 d4
// The grid is divided by the straight lines going from one side of the grid to another,
// so a click on an edge or a drag along it changes the whole grid line.

beforeSuite((suite, cb)=> {
  suite.CLUES = {"a1": "white_circle", "d1": "black_circle", "b3": "black_circle", "c3": "white_circle", "d4": "white_circle"};
  // Values of all the edges of the vertical grid line to the right of the given column (zero-based).
  suite.verticalLine = function(puzzle, col) {
    return puzzle.edges.map(row => row[col][1].getValue());
  };
  // Values of all the edges of the horizontal grid line below the given row (zero-based).
  suite.horizontalLine = function(puzzle, row) {
    return puzzle.edges[row].map(cell => cell[2].getValue());
  };
  cb();
}),

// Controller definition tests
test('Solver controllers',(suite) => {
  let puzzle = suite.showPuzzle("kaitoramma", "4x4", suite.CLUES);
  puzzle.start();

  let border = {color: puzzle.colorSchema.gridColor, returnValue: 'bold'};
  assert("Empty cell chooser").that(puzzle.cells[0][1].chooserValues).isNull();
  assert("Empty cell click").that(puzzle.cells[0][1].clickSwitch).isNull();
  assert("Clue cell chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("Clue cell click").that(puzzle.cells[0][0].clickSwitch).isNull();
  assert("Vertical edge chooser").that(puzzle.edges[0][0][1].chooserValues).isNull();
  assert("Vertical edge click").that(puzzle.edges[0][0][1].clickSwitch).containsExactly([{}, border, {image: 'cross'}]);
  assert("Vertical edge drag").that(puzzle.edges[0][0][1].dragSwitch).containsExactly([{}, border]);
  assert("Horizontal edge click").that(puzzle.edges[0][0][2].clickSwitch).containsExactly([{}, border, {image: 'cross'}]);
  assert("Horizontal edge drag").that(puzzle.edges[0][0][2].dragSwitch).containsExactly([{}, border]);
  assert("Node drag processor").that(puzzle.nodes[0][0][2].dragProcessor).isEqualTo(true);
}),

test('Author controllers',(suite) => {
  let puzzle = suite.showPuzzle("kaitoramma", "4x4");
  puzzle.edit();

  assert("Cell chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("Cell click").that(puzzle.cells[0][0].clickSwitch).containsExactly([{}, {image: 'white_circle', returnValue: 'white_circle'}, {image: 'black_circle', returnValue: 'black_circle'}]);
  assert("Edge chooser").that(puzzle.edges[0][0][1].chooserValues).isNull();
  assert("Edge click").that(puzzle.edges[0][0][1].clickSwitch).isNull();
  assert("Edge drag").that(puzzle.edges[0][0][1].dragSwitch).isNull();
}),

// Clue display tests
test('Show circles',(suite) => {
  let puzzle = suite.showPuzzle("kaitoramma", "4x4", suite.CLUES);
  puzzle.start();

  assert("White circle").that(puzzle.cells[0][0].data).isEqualTo({image: 'white_circle'});
  assert("Black circle").that(puzzle.cells[0][3].data).isEqualTo({image: 'black_circle'});
  assert("Empty cell").that(puzzle.cells[0][1].data).isEqualTo({});
}),

// Mouse processing tests
test('Click to edge changes the whole vertical line',(suite) => {
  let puzzle = suite.showPuzzle("kaitoramma", "4x4", suite.CLUES);
  puzzle.start();

  assert("Line before click").that(suite.verticalLine(puzzle, 1)).isEqualTo([null, null, null, null]);

  // Edge between b1 and c1.
  suite.edgeClick(puzzle, "b1-1");

  assert("Line after click").that(suite.verticalLine(puzzle, 1)).isEqualTo(['bold', 'bold', 'bold', 'bold']);
  assert("Clicked edge data after click").that(puzzle.edges[0][1][1].data).isEqualTo({color: puzzle.colorSchema.gridColor, returnValue: 'bold'});
  assert("Edge at the other end of the line after click").that(puzzle.edges[3][1][1].data).isEqualTo({color: puzzle.colorSchema.gridColor, returnValue: 'bold'});
  assert("Neighbour line after click").that(suite.verticalLine(puzzle, 0)).isEqualTo([null, null, null, null]);
  assert("Crossing line after click").that(suite.horizontalLine(puzzle, 0)).isEqualTo([null, null, null, null]);

  // The second click to another edge of the same line sets crosses (there is no border here).
  suite.edgeClick(puzzle, "b3-1");

  assert("Line after second click").that(suite.verticalLine(puzzle, 1)).isEqualTo([null, null, null, null]);
  assert("Clicked edge data after second click").that(puzzle.edges[2][1][1].data).isEqualTo({image: 'cross'});
  assert("Edge at the other end of the line after second click").that(puzzle.edges[0][1][1].data).isEqualTo({image: 'cross'});

  // The third click clears the line.
  suite.edgeClick(puzzle, "b4-1");

  assert("Line after third click").that(suite.verticalLine(puzzle, 1)).isEqualTo([null, null, null, null]);
  assert("Clicked edge data after third click").that(puzzle.edges[3][1][1].data).isEqualTo({});
  assert("Edge at the other end of the line after third click").that(puzzle.edges[0][1][1].data).isEqualTo({});
}),

test('Click to edge changes the whole horizontal line',(suite) => {
  let puzzle = suite.showPuzzle("kaitoramma", "4x4", suite.CLUES);
  puzzle.start();

  // Edge between c2 and c3.
  suite.edgeClick(puzzle, "c2-2");

  assert("Line after click").that(suite.horizontalLine(puzzle, 1)).isEqualTo(['bold', 'bold', 'bold', 'bold']);
  assert("Neighbour line after click").that(suite.horizontalLine(puzzle, 2)).isEqualTo([null, null, null, null]);
  assert("Crossing line after click").that(suite.verticalLine(puzzle, 2)).isEqualTo([null, null, null, null]);
  assert("Submission data").that(puzzle.collectData()).isEqualTo(
    {"areas": [["a1","b1","c1","d1","a2","b2","c2","d2"], ["a3","b3","c3","d3","a4","b4","c4","d4"]]});
}),

test('Drag along edge changes the whole line',(suite) => {
  let puzzle = suite.showPuzzle("kaitoramma", "4x4", suite.CLUES);
  puzzle.start();

  // Along the right side of a4.
  suite.drag(puzzle, suite.gridPoint(puzzle, 1, 3), suite.gridPoint(puzzle, 1, 4));

  assert("Vertical line after drag").that(suite.verticalLine(puzzle, 0)).isEqualTo(['bold', 'bold', 'bold', 'bold']);
  assert("Edge data after drag").that(puzzle.edges[0][0][1].data).isEqualTo({color: puzzle.colorSchema.gridColor, returnValue: 'bold'});

  // Along the bottom side of d3.
  suite.drag(puzzle, suite.gridPoint(puzzle, 4, 3), suite.gridPoint(puzzle, 3, 3));

  assert("Horizontal line after drag").that(suite.horizontalLine(puzzle, 2)).isEqualTo(['bold', 'bold', 'bold', 'bold']);
  assert("Vertical line is kept").that(suite.verticalLine(puzzle, 0)).isEqualTo(['bold', 'bold', 'bold', 'bold']);

  // Drag along another edge of the vertical line removes it.
  suite.drag(puzzle, suite.gridPoint(puzzle, 1, 0), suite.gridPoint(puzzle, 1, 1));

  assert("Vertical line after second drag").that(suite.verticalLine(puzzle, 0)).isEqualTo([null, null, null, null]);
  assert("Edge data after second drag").that(puzzle.edges[3][0][1].data).isEqualTo({});
  assert("Horizontal line is kept").that(suite.horizontalLine(puzzle, 2)).isEqualTo(['bold', 'bold', 'bold', 'bold']);
}),

test('Crosses are not submitted',(suite) => {
  let puzzle = suite.showPuzzle("kaitoramma", "4x4", suite.CLUES);
  puzzle.start();

  // Line in the middle of the grid and the crossed line to the right of the column a.
  suite.edgeClick(puzzle, "b1-1");
  suite.edgeClick(puzzle, "a1-1");
  suite.edgeClick(puzzle, "a1-1");

  assert("Crossed edge data").that(puzzle.edges[1][0][1].data).isEqualTo({image: 'cross'});
  assert("Submission data").that(puzzle.collectData()).isEqualTo(
    {"areas": [["a1","b1","a2","b2","a3","b3","a4","b4"], ["c1","d1","c2","d2","c3","d3","c4","d4"]]});
}),

test('Cells can not be changed by solver',(suite) => {
  let puzzle = suite.showPuzzle("kaitoramma", "4x4", suite.CLUES);
  puzzle.start();

  suite.cellClick(puzzle, "a1");
  suite.cellClick(puzzle, "d1");
  suite.cellClick(puzzle, "b2");
  // Drag between the centers of the cells doesn't draw anything.
  suite.drag(puzzle, suite.cellPoint(puzzle, "a1"), suite.cellPoint(puzzle, "b1"));

  assert("White circle after click").that(puzzle.cells[0][0].data).isEqualTo({image: 'white_circle'});
  assert("Black circle after click").that(puzzle.cells[0][3].data).isEqualTo({image: 'black_circle'});
  assert("Empty cell after click").that(puzzle.cells[1][1].data).isEqualTo({});
  assert("Line between the cells after drag").that(suite.verticalLine(puzzle, 0)).isEqualTo([null, null, null, null]);
  assert("Submission data").that(puzzle.collectData()).isEqualTo({});
}),

test('Author sets circles by clicks',(suite) => {
  let puzzle = suite.showPuzzle("kaitoramma", "4x4");
  puzzle.edit();

  assert("Cell value before click").that(puzzle.cells[1][2].getValue()).isNull();

  suite.cellClick(puzzle, "c2");

  assert("Cell value after click").that(puzzle.cells[1][2].getValue()).isEqualTo('white_circle');
  assert("Cell data after click").that(puzzle.cells[1][2].data).isEqualTo({image: 'white_circle', returnValue: 'white_circle'});

  suite.cellClick(puzzle, "c2");

  assert("Cell value after second click").that(puzzle.cells[1][2].getValue()).isEqualTo('black_circle');
  assert("Cell data after second click").that(puzzle.cells[1][2].data).isEqualTo({image: 'black_circle', returnValue: 'black_circle'});

  suite.cellClick(puzzle, "c2");

  assert("Cell value after third click").that(puzzle.cells[1][2].getValue()).isNull();
  assert("Cell data after third click").that(puzzle.cells[1][2].data).isEqualTo({});
}),

test('Author can not draw lines',(suite) => {
  let puzzle = suite.showPuzzle("kaitoramma", "4x4");
  puzzle.edit();

  suite.edgeClick(puzzle, "b1-1");
  suite.drag(puzzle, suite.gridPoint(puzzle, 0, 2), suite.gridPoint(puzzle, 1, 2));

  assert("Vertical line after click").that(suite.verticalLine(puzzle, 1)).isEqualTo([null, null, null, null]);
  assert("Horizontal line after drag").that(suite.horizontalLine(puzzle, 1)).isEqualTo([null, null, null, null]);
  assert("Puzzle data").that(puzzle.collectData()).isEqualTo({});
}),

// Data collector tests
test('Data collector',(suite) => {
  let puzzle = suite.showPuzzle("kaitoramma", "4x4", suite.CLUES);
  puzzle.start();

  assert("Submission data of the empty grid").that(puzzle.collectData()).isEqualTo({});

  // Vertical line in the middle of the grid is set by click, horizontal one by drag.
  suite.edgeClick(puzzle, "b2-1");
  suite.drag(puzzle, suite.gridPoint(puzzle, 0, 2), suite.gridPoint(puzzle, 1, 2));

  assert("Submission data").that(puzzle.collectData()).isEqualTo(
    {"areas": [["a1","b1","a2","b2"], ["c1","d1","c2","d2"], ["a3","b3","a4","b4"], ["c3","d3","c4","d4"]]});
}),

test('Author data collector',(suite) => {
  let puzzle = suite.showPuzzle("kaitoramma", "4x4");
  puzzle.edit();

  assert("Puzzle data of the empty grid").that(puzzle.collectData()).isEqualTo({});

  // One click for the white circle, two clicks for the black one.
  ["a1", "c3", "d4"].forEach(cell => suite.cellClick(puzzle, cell));
  ["d1", "b3"].forEach(cell => {
    suite.cellClick(puzzle, cell);
    suite.cellClick(puzzle, cell);
  });

  assert("Puzzle data").that(puzzle.collectData()).isEqualTo(suite.CLUES);
}),

);
