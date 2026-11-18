kropkiTestSuite = uiTestSuite("Kropki", "squarepuzzle", "squarePuzzleType",

// Puzzle 4x4 and its solution (o is a white dot, * is a black dot, a1 and c3 are given):
//   1 o 2 o 3 o 4      a1 b1 c1 d1
//       *       *
//   3 o 4   1 * 2      a2 b2 c2 d2
//   o           o
//   2 o 1   4 o 3      a3 b3 c3 d3
//   *       *
//   4 o 3 o 2 * 1      a4 b4 c4 d4
// Dots are the clues on the edges: "a1-1" is the right edge of a1, "a1-2" is the bottom edge of a1.

beforeSuite((suite, cb)=> {
  suite.CLUES = {"a1": "1", "c3": "4", "edges": {
    "a1-1": "white", "b1-1": "white", "c1-1": "white", "a2-1": "white", "c2-1": "black",
    "a3-1": "white", "c3-1": "white", "a4-1": "white", "b4-1": "white", "c4-1": "black",
    "b1-2": "black", "d1-2": "black", "a2-2": "white", "d2-2": "white", "a3-2": "black", "c3-2": "black"}};
  // Chooses the digits in the cells: {"b1": "2", ...}
  suite.enterDigits = function(puzzle, digits) {
    for (let [cell, digit] of Object.entries(digits)) {
      let col = cell.charCodeAt(0) - 'a'.charCodeAt(0);
      let row = parseInt(cell.substring(1)) - 1;
      puzzle.cells[row][col].switchOnChooser(parseInt(digit));
    }
  };
  cb();
}),

// Controller definition tests
test('Solver controllers',(suite) => {
  let puzzle = suite.showPuzzle("kropki", "4x4", suite.CLUES);
  puzzle.start();

  assert("Empty cell chooser").that(puzzle.cells[0][1].chooserValues).containsExactly([{},{text: '1', returnValue: '1'},{text: '2', returnValue: '2'},{text: '3', returnValue: '3'},{text: '4', returnValue: '4'}]);
  assert("Empty cell click").that(puzzle.cells[0][1].clickSwitch).isNull();
  assert("Clue cell chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("Clue cell click").that(puzzle.cells[0][0].clickSwitch).isNull();
  assert("Edge with dot chooser").that(puzzle.edges[0][0][1].chooserValues).isNull();
  assert("Edge with dot click").that(puzzle.edges[0][0][1].clickSwitch).isNull();
  assert("Edge without dot chooser").that(puzzle.edges[1][1][1].chooserValues).isNull();
  assert("Edge without dot click").that(puzzle.edges[1][1][1].clickSwitch).isNull();
  assert("Cell drag processor").that(puzzle.cells[0][1].dragProcessor).isNull();
}),

test('Author controllers',(suite) => {
  let puzzle = suite.showPuzzle("kropki", "4x4");
  puzzle.edit();

  let dots = [{}, {image: 'white_dot', returnValue: 'white'}, {image: 'small_circle', returnValue: 'black'}];
  assert("Cell chooser").that(puzzle.cells[0][0].chooserValues).containsExactly([{},{text: '1', returnValue: '1'},{text: '2', returnValue: '2'},{text: '3', returnValue: '3'},{text: '4', returnValue: '4'}]);
  assert("Cell click").that(puzzle.cells[0][0].clickSwitch).isNull();
  assert("Vertical edge chooser").that(puzzle.edges[0][0][1].chooserValues).isNull();
  assert("Vertical edge click").that(puzzle.edges[0][0][1].clickSwitch).containsExactly(dots);
  assert("Horizontal edge click").that(puzzle.edges[0][0][2].clickSwitch).containsExactly(dots);
  assert("Edge drag").that(puzzle.edges[0][0][1].dragSwitch).isNull();
  // There are no dots at the border of the grid.
  assert("Top border click").that(puzzle.edges[0][0][0].clickSwitch).isNull();
  assert("Left border click").that(puzzle.edges[0][0][3].clickSwitch).isNull();
  assert("Right border click").that(puzzle.edges[3][3][1].clickSwitch).isNull();
  assert("Bottom border click").that(puzzle.edges[3][3][2].clickSwitch).isNull();
}),

test('Chooser depends on the grid size',(suite) => {
  let puzzle = suite.showPuzzle("kropki", "6x6");
  puzzle.start();

  assert("Number of items in the chooser").that(puzzle.cells[0][0].chooserValues.length).isEqualTo(7);
  assert("The last item of the chooser").that(puzzle.cells[0][0].chooserValues[6]).isEqualTo({text: '6', returnValue: '6'});
}),

// Clue display tests
test('Show dots',(suite) => {
  let puzzle = suite.showPuzzle("kropki", "4x4", suite.CLUES);
  puzzle.start();

  assert("White dot between a1 and b1").that(puzzle.edges[0][0][1].data).isEqualTo({image: 'white_dot'});
  assert("Black dot between c2 and d2").that(puzzle.edges[1][2][1].data).isEqualTo({image: 'small_circle'});
  assert("Black dot between b1 and b2").that(puzzle.edges[0][1][2].data).isEqualTo({image: 'small_circle'});
  assert("White dot between a2 and a3").that(puzzle.edges[1][0][2].data).isEqualTo({image: 'white_dot'});
  assert("No dot between b2 and c2").that(puzzle.edges[1][1][1].data).isEqualTo({});
  assert("No dot between a1 and a2").that(puzzle.edges[0][0][2].data).isEqualTo({});
  assert("Given digit").that(puzzle.cells[2][2].data).isEqualTo({text: '4'});
}),

// Mouse processing tests
test('Process click to empty cell',(suite) => {
  let puzzle = suite.showPuzzle("kropki", "4x4", suite.CLUES);
  puzzle.start();

  assert("Cell value before click").that(puzzle.cells[0][1].getValue()).isNull();
  assert("Chooser before click").that(puzzle.controller.chooserBuilder.chooserElements).isEmptyArray();

  suite.cellClick(puzzle, "b1");

  assert("Chooser after click").that(puzzle.controller.chooserBuilder.chooserElements).isNonEmptyArray();
  assert("Chooser connected to the cell").that(puzzle.controller.chooserBuilder.element.col).isEqualTo(1);
  assert("Chooser connected to the cell").that(puzzle.controller.chooserBuilder.element.row).isEqualTo(0);
  assert("Cell data after click").that(puzzle.cells[0][1].data).isEqualTo({});

  puzzle.cells[0][1].switchOnChooser(2);

  assert("Cell value after choice").that(puzzle.cells[0][1].getValue()).isEqualTo('2');
  assert("Cell data after choice").that(puzzle.cells[0][1].data).isEqualTo({text: '2', returnValue: '2'});

  puzzle.cells[0][1].switchOnChooser(0);

  assert("Cell value after choosing the empty item").that(puzzle.cells[0][1].getValue()).isNull();
  assert("Cell data after choosing the empty item").that(puzzle.cells[0][1].data).isEqualTo({});
}),

test('Clues can not be changed by solver',(suite) => {
  let puzzle = suite.showPuzzle("kropki", "4x4", suite.CLUES);
  puzzle.start();

  // Given digit, white dot, black dot, edge without dot.
  suite.cellClick(puzzle, "a1");
  suite.edgeClick(puzzle, "a1-1");
  suite.edgeClick(puzzle, "b1-2");
  suite.edgeClick(puzzle, "b2-1");

  assert("Chooser after clicks").that(puzzle.controller.chooserBuilder.chooserElements).isEmptyArray();
  assert("Given digit after click").that(puzzle.cells[0][0].data).isEqualTo({text: '1'});
  assert("White dot after click").that(puzzle.edges[0][0][1].data).isEqualTo({image: 'white_dot'});
  assert("Black dot after click").that(puzzle.edges[0][1][2].data).isEqualTo({image: 'small_circle'});
  assert("Edge without dot after click").that(puzzle.edges[1][1][1].data).isEqualTo({});
  assert("Submission data").that(puzzle.collectData()).isEqualTo({});
}),

test('Author sets dots by clicks',(suite) => {
  let puzzle = suite.showPuzzle("kropki", "4x4");
  puzzle.edit();

  assert("Edge value before click").that(puzzle.edges[0][0][1].getValue()).isNull();

  suite.edgeClick(puzzle, "a1-1");

  assert("Edge value after click").that(puzzle.edges[0][0][1].getValue()).isEqualTo('white');
  assert("Edge data after click").that(puzzle.edges[0][0][1].data).isEqualTo({image: 'white_dot', returnValue: 'white'});

  suite.edgeClick(puzzle, "a1-1");

  assert("Edge value after second click").that(puzzle.edges[0][0][1].getValue()).isEqualTo('black');
  assert("Edge data after second click").that(puzzle.edges[0][0][1].data).isEqualTo({image: 'small_circle', returnValue: 'black'});

  suite.edgeClick(puzzle, "a1-1");

  assert("Edge value after third click").that(puzzle.edges[0][0][1].getValue()).isNull();
  assert("Edge data after third click").that(puzzle.edges[0][0][1].data).isEqualTo({});

  // The same edge is the left side of b1.
  suite.edgeClick(puzzle, "b1-3");

  assert("Edge value after click to the side of the neighbour cell").that(puzzle.edges[0][0][1].getValue()).isEqualTo('white');
}),

test('Author can not set dots at the border',(suite) => {
  let puzzle = suite.showPuzzle("kropki", "4x4");
  puzzle.edit();

  suite.edgeClick(puzzle, "a1-0");
  suite.edgeClick(puzzle, "a1-3");
  suite.edgeClick(puzzle, "d4-1");
  suite.edgeClick(puzzle, "d4-2");

  assert("Top border value").that(puzzle.edges[0][0][0].getValue()).isNull();
  assert("Top border data").that(puzzle.edges[0][0][0].data).isEqualTo({color: puzzle.colorSchema.gridColor});
  assert("Puzzle data").that(puzzle.collectData()).isEqualTo({});
}),

// Data collector tests
test('Data collector',(suite) => {
  let puzzle = suite.showPuzzle("kropki", "4x4", suite.CLUES);
  puzzle.start();

  assert("Submission data of the empty grid").that(puzzle.collectData()).isEqualTo({});

  let solution = {"b1": "2", "c1": "3", "d1": "4", "a2": "3", "b2": "4", "c2": "1", "d2": "2",
                  "a3": "2", "b3": "1", "d3": "3", "a4": "4", "b4": "3", "c4": "2", "d4": "1"};
  suite.enterDigits(puzzle, solution);

  // Given digits and dots are not submitted.
  assert("Submission data").that(puzzle.collectData()).isEqualTo(solution);
}),

test('Author data collector',(suite) => {
  let puzzle = suite.showPuzzle("kropki", "4x4");
  puzzle.edit();

  suite.enterDigits(puzzle, {"a1": "1", "c3": "4"});
  // One click for the white dot, two clicks for the black one.
  let whiteDots = ["a1-1", "b1-1", "c1-1", "a2-1", "a3-1", "c3-1", "a4-1", "b4-1", "a2-2", "d2-2"];
  let blackDots = ["c2-1", "c4-1", "b1-2", "d1-2", "a3-2", "c3-2"];
  whiteDots.forEach(edge => suite.edgeClick(puzzle, edge));
  blackDots.forEach(edge => {
    suite.edgeClick(puzzle, edge);
    suite.edgeClick(puzzle, edge);
  });

  assert("Puzzle data").that(puzzle.collectData()).isEqualTo(suite.CLUES);
}),

);
