meanderingNumbersTestSuite = uiTestSuite("Meandering Numbers", "squarepuzzle", "squarePuzzleType",

// Puzzle 4x4 (numbers up to 5, dimension "4x4-5") and its solution (b2 and d1 are given):
//   2   1 | 4   1      a1 b1 c1 d1
//     +---+
//   3 | 5 | 3   2      a2 b2 c2 d2
//   ---+   +-------
//   1   4 | 1   4      a3 b3 c3 d3
//
//   2   3 | 2   3      a4 b4 c4 d4

beforeSuite((suite, cb)=> {
  suite.CLUES = {"areas": [["a1","b1","a2"], ["c1","d1","c2","d2"], ["b2","a3","b3","a4","b4"], ["c3","d3","c4","d4"]],
                 "d1": "1", "b2": "5"};
  // Chooses the numbers in the cells: {"a1": "2", ...}
  suite.enterNumbers = function(puzzle, numbers) {
    for (let [cell, number] of Object.entries(numbers)) {
      let col = cell.charCodeAt(0) - 'a'.charCodeAt(0);
      let row = parseInt(cell.substring(1)) - 1;
      puzzle.cells[row][col].switchOnChooser(parseInt(number));
    }
  };
  cb();
}),

// Controller definition tests
test('Solver controllers',(suite) => {
  let puzzle = suite.showPuzzle("meandering_numbers", "4x4-5", suite.CLUES);
  puzzle.start();

  assert("Empty cell chooser").that(puzzle.cells[0][0].chooserValues).containsExactly([{},{text: '1', returnValue: '1'},{text: '2', returnValue: '2'},{text: '3', returnValue: '3'},{text: '4', returnValue: '4'},{text: '5', returnValue: '5'}]);
  assert("Empty cell click").that(puzzle.cells[0][0].clickSwitch).isNull();
  assert("Clue cell chooser").that(puzzle.cells[0][3].chooserValues).isNull();
  assert("Clue cell click").that(puzzle.cells[0][3].clickSwitch).isNull();
  assert("Area border click").that(puzzle.edges[0][1][1].clickSwitch).isNull();
  assert("Area border drag").that(puzzle.edges[0][1][1].dragSwitch).isNull();
  assert("Inner edge click").that(puzzle.edges[0][0][1].clickSwitch).isNull();
  assert("Inner edge drag").that(puzzle.edges[0][0][1].dragSwitch).isNull();
  assert("Cell drag processor").that(puzzle.cells[0][0].dragProcessor).isNull();
}),

test('Author controllers',(suite) => {
  let puzzle = suite.showPuzzle("meandering_numbers", "4x4-5");
  puzzle.edit();

  assert("Cell chooser").that(puzzle.cells[0][0].chooserValues).containsExactly([{},{text: '1', returnValue: '1'},{text: '2', returnValue: '2'},{text: '3', returnValue: '3'},{text: '4', returnValue: '4'},{text: '5', returnValue: '5'}]);
  assert("Cell click").that(puzzle.cells[0][0].clickSwitch).isNull();
  assert("Edge chooser").that(puzzle.edges[0][0][1].chooserValues).isNull();
  assert("Edge click").that(puzzle.edges[0][0][1].clickSwitch).containsExactly([{}, {color: puzzle.colorSchema.gridColor, returnValue: 'bold'}]);
  assert("Edge drag").that(puzzle.edges[0][0][1].dragSwitch).containsExactly([{}, {color: puzzle.colorSchema.gridColor, returnValue: 'bold'}]);
}),

test('Maximal number is taken from dimension',(suite) => {
  let puzzle = suite.showPuzzle("meandering_numbers", "4x4-7");
  puzzle.start();

  assert("Number of items in the solver chooser").that(puzzle.cells[0][0].chooserValues.length).isEqualTo(8);
  assert("The last item of the solver chooser").that(puzzle.cells[0][0].chooserValues[7]).isEqualTo({text: '7', returnValue: '7'});

  Snap(suite.GRID_SELECTOR).clear();
  puzzle = suite.showPuzzle("meandering_numbers", "4x4-3");
  puzzle.edit();

  assert("Number of items in the author chooser").that(puzzle.cells[0][0].chooserValues.length).isEqualTo(4);
  assert("The last item of the author chooser").that(puzzle.cells[0][0].chooserValues[3]).isEqualTo({text: '3', returnValue: '3'});
}),

// Clue display tests
test('Show areas',(suite) => {
  let puzzle = suite.showPuzzle("meandering_numbers", "4x4-5", suite.CLUES);
  puzzle.start();

  let border = {color: puzzle.colorSchema.gridColor};
  assert("Border between b1 and c1").that(puzzle.edges[0][1][1].data).isEqualTo(border);
  assert("Border between b1 and b2").that(puzzle.edges[0][1][2].data).isEqualTo(border);
  assert("Border between a2 and b2").that(puzzle.edges[1][0][1].data).isEqualTo(border);
  assert("Border between a2 and a3").that(puzzle.edges[1][0][2].data).isEqualTo(border);
  assert("Border between d2 and d3").that(puzzle.edges[1][3][2].data).isEqualTo(border);
  assert("No border between a1 and b1").that(puzzle.edges[0][0][1].data).isEqualTo({});
  assert("No border between a1 and a2").that(puzzle.edges[0][0][2].data).isEqualTo({});
  assert("No border between b2 and b3").that(puzzle.edges[1][1][2].data).isEqualTo({});
  assert("No border between c3 and c4").that(puzzle.edges[2][2][2].data).isEqualTo({});
  assert("Given number").that(puzzle.cells[1][1].data).isEqualTo({text: '5'});
}),

// Mouse processing tests
test('Process click to empty cell',(suite) => {
  let puzzle = suite.showPuzzle("meandering_numbers", "4x4-5", suite.CLUES);
  puzzle.start();

  assert("Cell value before click").that(puzzle.cells[0][0].getValue()).isNull();
  assert("Chooser before click").that(puzzle.controller.chooserBuilder.chooserElements).isEmptyArray();

  suite.cellClick(puzzle, "a1");

  assert("Chooser after click").that(puzzle.controller.chooserBuilder.chooserElements).isNonEmptyArray();
  assert("Chooser connected to the cell").that(puzzle.controller.chooserBuilder.element.col).isEqualTo(0);
  assert("Chooser connected to the cell").that(puzzle.controller.chooserBuilder.element.row).isEqualTo(0);

  puzzle.cells[0][0].switchOnChooser(5);

  assert("Cell value after choice").that(puzzle.cells[0][0].getValue()).isEqualTo('5');
  assert("Cell data after choice").that(puzzle.cells[0][0].data).isEqualTo({text: '5', returnValue: '5'});

  puzzle.cells[0][0].switchOnChooser(0);

  assert("Cell value after choosing the empty item").that(puzzle.cells[0][0].getValue()).isNull();
}),

test('Clues can not be changed by solver',(suite) => {
  let puzzle = suite.showPuzzle("meandering_numbers", "4x4-5", suite.CLUES);
  puzzle.start();

  // Given number, area border and the edge inside of the area.
  suite.cellClick(puzzle, "d1");
  suite.edgeClick(puzzle, "b1-1");
  suite.edgeClick(puzzle, "a1-1");
  suite.drag(puzzle, suite.gridPoint(puzzle, 1, 0), suite.gridPoint(puzzle, 1, 1));

  assert("Chooser after clicks").that(puzzle.controller.chooserBuilder.chooserElements).isEmptyArray();
  assert("Given number after click").that(puzzle.cells[0][3].data).isEqualTo({text: '1'});
  assert("Area border after click").that(puzzle.edges[0][1][1].data).isEqualTo({color: puzzle.colorSchema.gridColor});
  assert("Inner edge after click and drag").that(puzzle.edges[0][0][1].data).isEqualTo({});
  assert("Submission data").that(puzzle.collectData()).isEqualTo({});
}),

test('Author sets borders by clicks',(suite) => {
  let puzzle = suite.showPuzzle("meandering_numbers", "4x4-5");
  puzzle.edit();

  assert("Edge value before click").that(puzzle.edges[0][0][1].getValue()).isNull();

  suite.edgeClick(puzzle, "a1-1");

  assert("Edge value after click").that(puzzle.edges[0][0][1].getValue()).isEqualTo('bold');
  assert("Edge data after click").that(puzzle.edges[0][0][1].data).isEqualTo({color: puzzle.colorSchema.gridColor, returnValue: 'bold'});

  suite.edgeClick(puzzle, "a1-1");

  assert("Edge value after second click").that(puzzle.edges[0][0][1].getValue()).isNull();
  assert("Edge data after second click").that(puzzle.edges[0][0][1].data).isEqualTo({});
}),

test('Author sets borders by drag',(suite) => {
  let puzzle = suite.showPuzzle("meandering_numbers", "4x4-5");
  puzzle.edit();

  // Along the bottom side of a1.
  suite.drag(puzzle, suite.gridPoint(puzzle, 0, 1), suite.gridPoint(puzzle, 1, 1));

  assert("Horizontal edge value after drag").that(puzzle.edges[0][0][2].getValue()).isEqualTo('bold');
  assert("Horizontal edge data after drag").that(puzzle.edges[0][0][2].data).isEqualTo({color: puzzle.colorSchema.gridColor, returnValue: 'bold'});

  // Along the right side of a1.
  suite.drag(puzzle, suite.gridPoint(puzzle, 1, 1), suite.gridPoint(puzzle, 1, 0));

  assert("Vertical edge value after drag").that(puzzle.edges[0][0][1].getValue()).isEqualTo('bold');
  assert("Puzzle data").that(puzzle.collectData()).isEqualTo(
    {"areas": [["a1"], ["b1","c1","d1","a2","b2","c2","d2","a3","b3","c3","d3","a4","b4","c4","d4"]]});
}),

// Data collector tests
test('Data collector',(suite) => {
  let puzzle = suite.showPuzzle("meandering_numbers", "4x4-5", suite.CLUES);
  puzzle.start();

  assert("Submission data of the empty grid").that(puzzle.collectData()).isEqualTo({});

  let solution = {"a1": "2", "b1": "1", "c1": "4", "a2": "3", "c2": "3", "d2": "2",
                  "a3": "1", "b3": "4", "c3": "1", "d3": "4", "a4": "2", "b4": "3", "c4": "2", "d4": "3"};
  suite.enterNumbers(puzzle, solution);

  // Given numbers and areas are not submitted.
  assert("Submission data").that(puzzle.collectData()).isEqualTo(solution);
}),

test('Author data collector',(suite) => {
  let puzzle = suite.showPuzzle("meandering_numbers", "4x4-5");
  puzzle.edit();

  suite.enterNumbers(puzzle, {"d1": "1", "b2": "5"});

  // Without inner borders the whole grid is one area.
  assert("Puzzle data without borders").that(puzzle.collectData()).isEqualTo(
    {"areas": [["a1","b1","c1","d1","a2","b2","c2","d2","a3","b3","c3","d3","a4","b4","c4","d4"]], "d1": "1", "b2": "5"});

  // Vertical border between the columns b and c: drag along the edges, one edge per drag.
  for (let row = 0; row < 4; row++) {
    suite.drag(puzzle, suite.gridPoint(puzzle, 2, row), suite.gridPoint(puzzle, 2, row + 1));
  }
  // Borders of the area a1-b1-a2 and the border between the rows 2 and 3.
  suite.edgeClick(puzzle, "b1-2");
  suite.edgeClick(puzzle, "a2-1");
  suite.edgeClick(puzzle, "a2-2");
  suite.edgeClick(puzzle, "c2-2");
  suite.edgeClick(puzzle, "d2-2");

  assert("Puzzle data").that(puzzle.collectData()).isEqualTo(suite.CLUES);
}),

);
