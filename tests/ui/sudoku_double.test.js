sudokuDoubleTestSuite = uiTestSuite("Double Sudoku", "squarepuzzle", "squarePuzzleType",

// Puzzle 6x6 with six 3x2 areas and its solution (b4, a6, d6 and f6 are given).
// Digits 1-3 are exactly twice in every row, column and area.
//   . . . | . . .      3 1 2 | 3 2 1
//   . . . | . . .      2 3 1 | 2 1 3
//   ------+------      ------+------
//   . . . | . . .      3 1 2 | 3 2 1
//   . 2 . | . . .      1 2 3 | 1 3 2
//   ------+------      ------+------
//   . . . | . . .      2 3 1 | 2 1 3
//   1 . . | 1 . 2      1 2 3 | 1 3 2
// The author draws the borders of the areas by clicking the edges or by dragging along the grid lines.

beforeSuite((suite, cb)=> {
  suite.CLUES = {"b4": "2", "a6": "1", "d6": "1", "f6": "2",
                 "areas": [["a1", "b1", "c1", "a2", "b2", "c2"],
                           ["d1", "e1", "f1", "d2", "e2", "f2"],
                           ["a3", "b3", "c3", "a4", "b4", "c4"],
                           ["d3", "e3", "f3", "d4", "e4", "f4"],
                           ["a5", "b5", "c5", "a6", "b6", "c6"],
                           ["d5", "e5", "f5", "d6", "e6", "f6"]]};
  // Chooses the digits in the cells: {"a1": "3", ...}
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
  let puzzle = suite.showPuzzle("sudoku_double", "6x6", suite.CLUES);
  puzzle.start();

  // Digits are from 1 to the half of the grid size.
  assert("Empty cell chooser").that(puzzle.cells[0][0].chooserValues).containsExactly([{},{text: '1', returnValue: '1'},{text: '2', returnValue: '2'},{text: '3', returnValue: '3'}]);
  assert("Empty cell click").that(puzzle.cells[0][0].clickSwitch).isNull();
  assert("Clue cell chooser").that(puzzle.cells[3][1].chooserValues).isNull();
  assert("Clue cell click").that(puzzle.cells[3][1].clickSwitch).isNull();
  assert("Area border click").that(puzzle.edges[0][2][1].clickSwitch).isNull();
  assert("Area border drag").that(puzzle.edges[0][2][1].dragSwitch).isNull();
  assert("Inner edge click").that(puzzle.edges[0][0][1].clickSwitch).isNull();
  assert("Inner edge drag").that(puzzle.edges[0][0][1].dragSwitch).isNull();
  assert("Node drag processor").that(puzzle.nodes[0][0][2].dragProcessor).isNull();
  assert("Cell drag processor").that(puzzle.cells[0][0].dragProcessor).isNull();
}),

test('Author controllers',(suite) => {
  let puzzle = suite.showPuzzle("sudoku_double", "6x6");
  puzzle.edit();

  let border = [{}, {color: puzzle.colorSchema.gridColor, returnValue: '1'}];
  assert("Cell chooser").that(puzzle.cells[0][0].chooserValues).containsExactly([{},{text: '1', returnValue: '1'},{text: '2', returnValue: '2'},{text: '3', returnValue: '3'}]);
  assert("Cell click").that(puzzle.cells[0][0].clickSwitch).isNull();
  assert("Vertical edge chooser").that(puzzle.edges[0][0][1].chooserValues).isNull();
  assert("Vertical edge click").that(puzzle.edges[0][0][1].clickSwitch).containsExactly(border);
  assert("Vertical edge drag").that(puzzle.edges[0][0][1].dragSwitch).containsExactly(border);
  assert("Horizontal edge click").that(puzzle.edges[0][0][2].clickSwitch).containsExactly(border);
  assert("Horizontal edge drag").that(puzzle.edges[0][0][2].dragSwitch).containsExactly(border);
  // Border of the grid can not be changed.
  assert("Top border click").that(puzzle.edges[0][0][0].clickSwitch).isNull();
  assert("Top border drag").that(puzzle.edges[0][0][0].dragSwitch).isNull();
  assert("Bottom border click").that(puzzle.edges[5][5][2].clickSwitch).isNull();
  assert("Node drag processor").that(puzzle.nodes[0][0][2].dragProcessor).isEqualTo(true);
}),

test('Chooser depends on the grid size',(suite) => {
  let puzzle = suite.showPuzzle("sudoku_double", "8x8");
  puzzle.start();

  assert("Cell chooser").that(puzzle.cells[0][0].chooserValues).containsExactly([{},{text: '1', returnValue: '1'},{text: '2', returnValue: '2'},{text: '3', returnValue: '3'},{text: '4', returnValue: '4'}]);
}),

// Clue display tests
test('Show areas',(suite) => {
  let puzzle = suite.showPuzzle("sudoku_double", "6x6", suite.CLUES);
  puzzle.start();

  let border = {color: puzzle.colorSchema.gridColor};
  assert("Border between c1 and d1").that(puzzle.edges[0][2][1].data).isEqualTo(border);
  assert("Border between c6 and d6").that(puzzle.edges[5][2][1].data).isEqualTo(border);
  assert("Border between a2 and a3").that(puzzle.edges[1][0][2].data).isEqualTo(border);
  assert("Border between f4 and f5").that(puzzle.edges[3][5][2].data).isEqualTo(border);
  assert("No border between a1 and b1").that(puzzle.edges[0][0][1].data).isEqualTo({});
  assert("No border between d1 and e1").that(puzzle.edges[0][3][1].data).isEqualTo({});
  assert("No border between a1 and a2").that(puzzle.edges[0][0][2].data).isEqualTo({});
  assert("No border between a3 and a4").that(puzzle.edges[2][0][2].data).isEqualTo({});
  assert("Given digit").that(puzzle.cells[3][1].data).isEqualTo({text: '2'});
}),

// Mouse processing tests
test('Process click to empty cell',(suite) => {
  let puzzle = suite.showPuzzle("sudoku_double", "6x6", suite.CLUES);
  puzzle.start();

  assert("Cell value before click").that(puzzle.cells[0][0].getValue()).isNull();
  assert("Chooser before click").that(puzzle.controller.chooserBuilder.chooserElements).isEmptyArray();

  suite.cellClick(puzzle, "a1");

  assert("Chooser after click").that(puzzle.controller.chooserBuilder.chooserElements).isNonEmptyArray();
  assert("Chooser connected to the cell").that(puzzle.controller.chooserBuilder.element.col).isEqualTo(0);
  assert("Chooser connected to the cell").that(puzzle.controller.chooserBuilder.element.row).isEqualTo(0);

  puzzle.cells[0][0].switchOnChooser(3);

  assert("Cell value after choice").that(puzzle.cells[0][0].getValue()).isEqualTo('3');
  assert("Cell data after choice").that(puzzle.cells[0][0].data).isEqualTo({text: '3', returnValue: '3'});

  puzzle.cells[0][0].switchOnChooser(0);

  assert("Cell value after choosing the empty item").that(puzzle.cells[0][0].getValue()).isNull();
}),

test('Clues can not be changed by solver',(suite) => {
  let puzzle = suite.showPuzzle("sudoku_double", "6x6", suite.CLUES);
  puzzle.start();

  // Given digit, area border and the edge inside of the area.
  suite.cellClick(puzzle, "b4");
  suite.edgeClick(puzzle, "c1-1");
  suite.edgeClick(puzzle, "a1-1");
  suite.drawBorder(puzzle, [1, 0], [1, 1]);

  assert("Chooser after clicks").that(puzzle.controller.chooserBuilder.chooserElements).isEmptyArray();
  assert("Given digit after click").that(puzzle.cells[3][1].data).isEqualTo({text: '2'});
  assert("Area border after click").that(puzzle.edges[0][2][1].data).isEqualTo({color: puzzle.colorSchema.gridColor});
  assert("Inner edge after click and drag").that(puzzle.edges[0][0][1].data).isEqualTo({});
  assert("Submission data").that(puzzle.collectData()).isEqualTo({});
}),

test('Author sets borders by clicks',(suite) => {
  let puzzle = suite.showPuzzle("sudoku_double", "6x6");
  puzzle.edit();

  assert("Edge value before click").that(puzzle.edges[0][0][1].getValue()).isNull();

  suite.edgeClick(puzzle, "a1-1");

  assert("Edge value after click").that(puzzle.edges[0][0][1].getValue()).isEqualTo('1');
  assert("Edge data after click").that(puzzle.edges[0][0][1].data).isEqualTo({color: puzzle.colorSchema.gridColor, returnValue: '1'});

  suite.edgeClick(puzzle, "a1-1");

  assert("Edge value after second click").that(puzzle.edges[0][0][1].getValue()).isNull();
  assert("Edge data after second click").that(puzzle.edges[0][0][1].data).isEqualTo({});

  // Border of the grid is not changed by clicks.
  suite.edgeClick(puzzle, "a1-3");

  assert("Grid border data after click").that(puzzle.edges[0][0][3].data).isEqualTo({color: puzzle.colorSchema.gridColor});
  assert("Grid border value after click").that(puzzle.edges[0][0][3].getValue()).isNull();
}),

test('Author sets borders by drag',(suite) => {
  let puzzle = suite.showPuzzle("sudoku_double", "6x6");
  puzzle.edit();

  // Along the bottom side of a2 and b2.
  suite.drawBorder(puzzle, [0, 2], [1, 2], [2, 2]);

  assert("Edge below a2 value after drag").that(puzzle.edges[1][0][2].getValue()).isEqualTo('1');
  assert("Edge below a2 data after drag").that(puzzle.edges[1][0][2].data).isEqualTo({color: puzzle.colorSchema.gridColor, returnValue: '1'});
  assert("Edge below b2 value after drag").that(puzzle.edges[1][1][2].getValue()).isEqualTo('1');
  assert("Edge below c2 is not changed").that(puzzle.edges[1][2][2].getValue()).isNull();

  // Up along the right side of b2 and b1.
  suite.drawBorder(puzzle, [2, 2], [2, 1], [2, 0]);

  assert("Edge to the right of b2 value after drag").that(puzzle.edges[1][1][1].getValue()).isEqualTo('1');
  assert("Edge to the right of b1 value after drag").that(puzzle.edges[0][1][1].getValue()).isEqualTo('1');
  assert("Puzzle data").that(puzzle.collectData()).isEqualTo({"areas": [
    ["a1", "b1", "a2", "b2"],
    ["c1", "d1", "e1", "f1", "c2", "d2", "e2", "f2",
     "a3", "b3", "c3", "d3", "e3", "f3", "a4", "b4", "c4", "d4", "e4", "f4",
     "a5", "b5", "c5", "d5", "e5", "f5", "a6", "b6", "c6", "d6", "e6", "f6"]]});

  // Drag along the existing border removes it.
  suite.drawBorder(puzzle, [1, 2], [2, 2]);

  assert("Edge below b2 value after second drag").that(puzzle.edges[1][1][2].getValue()).isNull();
  assert("Edge below b2 data after second drag").that(puzzle.edges[1][1][2].data).isEqualTo({});
  assert("Edge below a2 is kept").that(puzzle.edges[1][0][2].getValue()).isEqualTo('1');
}),

// Data collector tests
test('Data collector',(suite) => {
  let puzzle = suite.showPuzzle("sudoku_double", "6x6", suite.CLUES);
  puzzle.start();

  assert("Submission data of the empty grid").that(puzzle.collectData()).isEqualTo({});

  let solution = {"a1": "3", "b1": "1", "c1": "2", "d1": "3", "e1": "2", "f1": "1",
                  "a2": "2", "b2": "3", "c2": "1", "d2": "2", "e2": "1", "f2": "3",
                  "a3": "3", "b3": "1", "c3": "2", "d3": "3", "e3": "2", "f3": "1",
                  "a4": "1", "c4": "3", "d4": "1", "e4": "3", "f4": "2",
                  "a5": "2", "b5": "3", "c5": "1", "d5": "2", "e5": "1", "f5": "3",
                  "b6": "2", "c6": "3", "e6": "3"};
  suite.enterDigits(puzzle, solution);

  // Given digits and areas are not submitted.
  assert("Submission data").that(puzzle.collectData()).isEqualTo(solution);
}),

test('Author data collector',(suite) => {
  let puzzle = suite.showPuzzle("sudoku_double", "6x6");
  puzzle.edit();

  suite.enterDigits(puzzle, {"b4": "2", "a6": "1", "d6": "1", "f6": "2"});

  assert("Puzzle data without borders").that(puzzle.collectData()).isEqualTo({"b4": "2", "a6": "1", "d6": "1", "f6": "2"});

  // Vertical border in the middle of the grid, from the top to the bottom.
  suite.drawBorder(puzzle, [3, 0], [3, 1], [3, 2], [3, 3], [3, 4], [3, 5], [3, 6]);
  // Horizontal border between the rows 2 and 3, from the left to the right.
  suite.drawBorder(puzzle, [0, 2], [1, 2], [2, 2], [3, 2], [4, 2], [5, 2], [6, 2]);
  // Horizontal border between the rows 4 and 5 is set by clicks.
  ["a4-2", "b4-2", "c4-2", "d4-2", "e4-2", "f4-2"].forEach(edge => suite.edgeClick(puzzle, edge));

  assert("Puzzle data").that(puzzle.collectData()).isEqualTo(suite.CLUES);
}),

);
