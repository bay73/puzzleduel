sudokuIrregularTestSuite = uiTestSuite("Irregular Sudoku", "squarepuzzle", "squarePuzzleType",

// Areas of the 4x4 puzzle and its solution (b1 and a4 are given):
//   A A A B      1 2 3 4      a1 b1 c1 d1
//   C A B B      2 4 1 3      a2 b2 c2 d2
//   C C D B      3 1 4 2      a3 b3 c3 d3
//   C D D D      4 3 2 1      a4 b4 c4 d4
// The author draws the borders of the areas by clicking the edges or by dragging along the grid lines.

beforeSuite((suite, cb)=> {
  suite.CLUES = {"areas": [["a1","b1","c1","b2"], ["d1","c2","d2","d3"], ["a2","a3","b3","a4"], ["c3","b4","c4","d4"]], "b1": "2", "a4": "4"};
  // Chooses the digits in the cells: {"a1": "1", ...}
  suite.enterDigits = function(puzzle, digits) {
    for (let [cell, digit] of Object.entries(digits)) {
      let col = cell.charCodeAt(0) - 'a'.charCodeAt(0);
      let row = parseInt(cell.substring(1)) - 1;
      puzzle.cells[row][col].switchOnChooser(parseInt(digit));
    }
  };
  // Emulates one mouse drag along the grid lines through the given nodes.
  // Node [col, row] is measured in cells from the top left corner of the grid.
  suite.drawBorder = function(puzzle, ...nodes) {
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
  let puzzle = suite.showPuzzle("sudoku_irregular", "4x4", suite.CLUES);
  puzzle.start();

  assert("Empty cell chooser").that(puzzle.cells[0][0].chooserValues).containsExactly([{},{text: '1', returnValue: '1'},{text: '2', returnValue: '2'},{text: '3', returnValue: '3'},{text: '4', returnValue: '4'}]);
  assert("Empty cell click").that(puzzle.cells[0][0].clickSwitch).isNull();
  assert("Clue cell chooser").that(puzzle.cells[0][1].chooserValues).isNull();
  assert("Clue cell click").that(puzzle.cells[0][1].clickSwitch).isNull();
  assert("Area border click").that(puzzle.edges[0][2][1].clickSwitch).isNull();
  assert("Area border drag").that(puzzle.edges[0][2][1].dragSwitch).isNull();
  assert("Inner edge click").that(puzzle.edges[0][0][1].clickSwitch).isNull();
  assert("Inner edge drag").that(puzzle.edges[0][0][1].dragSwitch).isNull();
  assert("Node drag processor").that(puzzle.nodes[0][0][2].dragProcessor).isNull();
  assert("Cell drag processor").that(puzzle.cells[0][0].dragProcessor).isNull();
}),

test('Author controllers',(suite) => {
  let puzzle = suite.showPuzzle("sudoku_irregular", "4x4");
  puzzle.edit();

  let border = [{}, {color: puzzle.colorSchema.gridColor, returnValue: '1'}];
  assert("Cell chooser").that(puzzle.cells[0][0].chooserValues).containsExactly([{},{text: '1', returnValue: '1'},{text: '2', returnValue: '2'},{text: '3', returnValue: '3'},{text: '4', returnValue: '4'}]);
  assert("Cell click").that(puzzle.cells[0][0].clickSwitch).isNull();
  assert("Vertical edge chooser").that(puzzle.edges[0][0][1].chooserValues).isNull();
  assert("Vertical edge click").that(puzzle.edges[0][0][1].clickSwitch).containsExactly(border);
  assert("Vertical edge drag").that(puzzle.edges[0][0][1].dragSwitch).containsExactly(border);
  assert("Horizontal edge click").that(puzzle.edges[0][0][2].clickSwitch).containsExactly(border);
  assert("Horizontal edge drag").that(puzzle.edges[0][0][2].dragSwitch).containsExactly(border);
  // Border of the grid can not be changed.
  assert("Top border click").that(puzzle.edges[0][0][0].clickSwitch).isNull();
  assert("Top border drag").that(puzzle.edges[0][0][0].dragSwitch).isNull();
  assert("Right border click").that(puzzle.edges[3][3][1].clickSwitch).isNull();
  assert("Node drag processor").that(puzzle.nodes[0][0][2].dragProcessor).isEqualTo(true);
}),

test('Chooser depends on the grid size',(suite) => {
  let puzzle = suite.showPuzzle("sudoku_irregular", "6x6");
  puzzle.start();

  assert("Number of items in the chooser").that(puzzle.cells[0][0].chooserValues.length).isEqualTo(7);
  assert("The last item of the chooser").that(puzzle.cells[0][0].chooserValues[6]).isEqualTo({text: '6', returnValue: '6'});
}),

// Clue display tests
test('Show areas',(suite) => {
  let puzzle = suite.showPuzzle("sudoku_irregular", "4x4", suite.CLUES);
  puzzle.start();

  let border = {color: puzzle.colorSchema.gridColor};
  assert("Border between c1 and d1").that(puzzle.edges[0][2][1].data).isEqualTo(border);
  assert("Border between a1 and a2").that(puzzle.edges[0][0][2].data).isEqualTo(border);
  assert("Border between a2 and b2").that(puzzle.edges[1][0][1].data).isEqualTo(border);
  assert("Border between c1 and c2").that(puzzle.edges[0][2][2].data).isEqualTo(border);
  assert("Border between b3 and b4").that(puzzle.edges[2][1][2].data).isEqualTo(border);
  assert("No border between a1 and b1").that(puzzle.edges[0][0][1].data).isEqualTo({});
  assert("No border between b1 and b2").that(puzzle.edges[0][1][2].data).isEqualTo({});
  assert("No border between c2 and d2").that(puzzle.edges[1][2][1].data).isEqualTo({});
  assert("No border between a3 and a4").that(puzzle.edges[2][0][2].data).isEqualTo({});
  assert("Given digit").that(puzzle.cells[3][0].data).isEqualTo({text: '4'});
}),

// Mouse processing tests
test('Process click to empty cell',(suite) => {
  let puzzle = suite.showPuzzle("sudoku_irregular", "4x4", suite.CLUES);
  puzzle.start();

  assert("Cell value before click").that(puzzle.cells[0][0].getValue()).isNull();
  assert("Chooser before click").that(puzzle.controller.chooserBuilder.chooserElements).isEmptyArray();

  suite.cellClick(puzzle, "a1");

  assert("Chooser after click").that(puzzle.controller.chooserBuilder.chooserElements).isNonEmptyArray();
  assert("Chooser connected to the cell").that(puzzle.controller.chooserBuilder.element.col).isEqualTo(0);
  assert("Chooser connected to the cell").that(puzzle.controller.chooserBuilder.element.row).isEqualTo(0);

  puzzle.cells[0][0].switchOnChooser(1);

  assert("Cell value after choice").that(puzzle.cells[0][0].getValue()).isEqualTo('1');
  assert("Cell data after choice").that(puzzle.cells[0][0].data).isEqualTo({text: '1', returnValue: '1'});

  puzzle.cells[0][0].switchOnChooser(0);

  assert("Cell value after choosing the empty item").that(puzzle.cells[0][0].getValue()).isNull();
}),

test('Clues can not be changed by solver',(suite) => {
  let puzzle = suite.showPuzzle("sudoku_irregular", "4x4", suite.CLUES);
  puzzle.start();

  // Given digit, area border and the edge inside of the area.
  suite.cellClick(puzzle, "b1");
  suite.edgeClick(puzzle, "c1-1");
  suite.edgeClick(puzzle, "a1-1");
  suite.drawBorder(puzzle, [1, 0], [1, 1]);

  assert("Chooser after clicks").that(puzzle.controller.chooserBuilder.chooserElements).isEmptyArray();
  assert("Given digit after click").that(puzzle.cells[0][1].data).isEqualTo({text: '2'});
  assert("Area border after click").that(puzzle.edges[0][2][1].data).isEqualTo({color: puzzle.colorSchema.gridColor});
  assert("Inner edge after click and drag").that(puzzle.edges[0][0][1].data).isEqualTo({});
  assert("Submission data").that(puzzle.collectData()).isEqualTo({});
}),

test('Author sets borders by clicks',(suite) => {
  let puzzle = suite.showPuzzle("sudoku_irregular", "4x4");
  puzzle.edit();

  assert("Edge value before click").that(puzzle.edges[0][0][1].getValue()).isNull();

  suite.edgeClick(puzzle, "a1-1");

  assert("Edge value after click").that(puzzle.edges[0][0][1].getValue()).isEqualTo('1');
  assert("Edge data after click").that(puzzle.edges[0][0][1].data).isEqualTo({color: puzzle.colorSchema.gridColor, returnValue: '1'});

  suite.edgeClick(puzzle, "a1-2");

  assert("Puzzle data with one separated cell").that(puzzle.collectData()).isEqualTo(
    {"areas": [["a1"], ["b1","c1","d1","a2","b2","c2","d2","a3","b3","c3","d3","a4","b4","c4","d4"]]});

  suite.edgeClick(puzzle, "a1-1");

  assert("Edge value after second click").that(puzzle.edges[0][0][1].getValue()).isNull();
  assert("Edge data after second click").that(puzzle.edges[0][0][1].data).isEqualTo({});

  // Border of the grid is not changed by clicks.
  suite.edgeClick(puzzle, "a1-0");

  assert("Grid border data after click").that(puzzle.edges[0][0][0].data).isEqualTo({color: puzzle.colorSchema.gridColor});
  assert("Grid border value after click").that(puzzle.edges[0][0][0].getValue()).isNull();
}),

test('Author sets borders by drag',(suite) => {
  let puzzle = suite.showPuzzle("sudoku_irregular", "4x4");
  puzzle.edit();

  // Along the right side of c1.
  suite.drawBorder(puzzle, [3, 0], [3, 1]);

  assert("Vertical edge value after drag").that(puzzle.edges[0][2][1].getValue()).isEqualTo('1');
  assert("Vertical edge data after drag").that(puzzle.edges[0][2][1].data).isEqualTo({color: puzzle.colorSchema.gridColor, returnValue: '1'});
  assert("Next edge is not changed").that(puzzle.edges[1][2][1].getValue()).isNull();

  // One mouse movement with the turn: bottom side of d1, then it goes along the border of the grid.
  suite.drawBorder(puzzle, [3, 1], [4, 1], [4, 2]);

  assert("Horizontal edge value after drag").that(puzzle.edges[0][3][2].getValue()).isEqualTo('1');
  assert("Grid border value after drag").that(puzzle.edges[1][3][1].getValue()).isNull();
  assert("Grid border data after drag").that(puzzle.edges[1][3][1].data).isEqualTo({color: puzzle.colorSchema.gridColor});
  assert("Puzzle data").that(puzzle.collectData()).isEqualTo(
    {"areas": [["a1","b1","c1","a2","b2","c2","d2","a3","b3","c3","d3","a4","b4","c4","d4"], ["d1"]]});

  // Drag along the existing border removes it.
  suite.drawBorder(puzzle, [3, 1], [3, 0]);

  assert("Vertical edge value after second drag").that(puzzle.edges[0][2][1].getValue()).isNull();
  assert("Vertical edge data after second drag").that(puzzle.edges[0][2][1].data).isEqualTo({});
}),

// Data collector tests
test('Data collector',(suite) => {
  let puzzle = suite.showPuzzle("sudoku_irregular", "4x4", suite.CLUES);
  puzzle.start();

  assert("Submission data of the empty grid").that(puzzle.collectData()).isEqualTo({});

  let solution = {
    "a1": "1", "c1": "3", "d1": "4",
    "a2": "2", "b2": "4", "c2": "1", "d2": "3",
    "a3": "3", "b3": "1", "c3": "4", "d3": "2",
    "b4": "3", "c4": "2", "d4": "1",
  };
  suite.enterDigits(puzzle, solution);

  // Given digits and areas are not submitted.
  assert("Submission data").that(puzzle.collectData()).isEqualTo(solution);
}),

test('Author data collector',(suite) => {
  let puzzle = suite.showPuzzle("sudoku_irregular", "4x4");
  puzzle.edit();

  suite.enterDigits(puzzle, {"b1": "2", "a4": "4"});

  assert("Puzzle data without borders").that(puzzle.collectData()).isEqualTo({"b1": "2", "a4": "4"});

  // Border of the area A (a1, b1, c1, b2): the stairs from the top side of the grid to its left side.
  suite.drawBorder(puzzle, [3, 0], [3, 1], [2, 1], [2, 2], [1, 2], [1, 1], [0, 1]);
  // Border between the areas B and D: from the center of the grid to its right side.
  suite.drawBorder(puzzle, [2, 2], [3, 2], [3, 3], [4, 3]);
  // Border between the areas C and D is set by clicks.
  suite.edgeClick(puzzle, "b3-1");
  suite.edgeClick(puzzle, "b3-2");
  suite.edgeClick(puzzle, "a4-1");

  assert("Puzzle data").that(puzzle.collectData()).isEqualTo(suite.CLUES);
}),

);
