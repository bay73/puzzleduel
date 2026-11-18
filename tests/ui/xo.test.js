xoTestSuite = uiTestSuite("XO", "squarepuzzle", "squarePuzzleType",

beforeSuite((suite, cb)=> {
  // Emulates several clicks at the cell.
  suite.cellClicks = function(puzzle, cell, times) {
    for (let i = 0; i < times; i++) {
      suite.cellClick(puzzle, cell);
    }
  };
  // Puzzle from the checker tests: O and X are given symbols, # is a black cell.
  //     a b c d e
  //  1  O . . . .
  //  2  . . . . .
  //  3  . . # . X
  //  4  . . . . .
  //  5  . . X . .
  suite.CLUES = {"a1": "O", "e3": "X", "c5": "X", "c3": "black"};
  cb();
}),

// Controller definition tests
test('Solver controllers',(suite) => {
  let puzzle = suite.showPuzzle("xo", "5x5", suite.CLUES);
  puzzle.start();

  assert("Empty cell chooser").that(puzzle.cells[0][1].chooserValues).isNull();
  assert("Empty cell click").that(puzzle.cells[0][1].clickSwitch).containsExactly(
    [{}, {image: 'white_circle', returnValue: 'O'}, {image: 'cross', returnValue: 'X'}]);
  assert("Cell with O chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("Cell with O click").that(puzzle.cells[0][0].clickSwitch).isNull();
  assert("Cell with X chooser").that(puzzle.cells[2][4].chooserValues).isNull();
  assert("Cell with X click").that(puzzle.cells[2][4].clickSwitch).isNull();
  assert("Black cell chooser").that(puzzle.cells[2][2].chooserValues).isNull();
  assert("Black cell click").that(puzzle.cells[2][2].clickSwitch).isNull();
  assert("Edge click").that(puzzle.edges[0][0][1].clickSwitch).isNull();
  assert("Edge drag").that(puzzle.edges[0][0][1].dragSwitch).isNull();
}),

test('Author controllers',(suite) => {
  let puzzle = suite.showPuzzle("xo", "5x5");
  puzzle.edit();

  assert("Cell chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("Cell click").that(puzzle.cells[0][0].clickSwitch).containsExactly(
    [{}, {image: 'white_circle', returnValue: 'O'}, {image: 'cross', returnValue: 'X'}, {color: puzzle.colorSchema.gridColor, returnValue: 'black'}]);
  assert("Edge click").that(puzzle.edges[0][0][1].clickSwitch).isNull();
  assert("Edge drag").that(puzzle.edges[0][0][1].dragSwitch).isNull();
}),

// Clues display tests
test('Show clues',(suite) => {
  let puzzle = suite.showPuzzle("xo", "5x5", suite.CLUES);
  puzzle.start();

  assert("Given O").that(puzzle.cells[0][0].data).isEqualTo({image: 'white_circle'});
  assert("Given X in e3").that(puzzle.cells[2][4].data).isEqualTo({image: 'cross'});
  assert("Given X in c5").that(puzzle.cells[4][2].data).isEqualTo({image: 'cross'});
  assert("Black cell").that(puzzle.cells[2][2].data).isEqualTo({color: puzzle.colorSchema.gridColor});
  assert("Cell without clue").that(puzzle.cells[0][1].data).isEqualTo({});
  // Given symbols are not submitted.
  assert("Given O value").that(puzzle.cells[0][0].getValue()).isNull();
  assert("Given X value").that(puzzle.cells[2][4].getValue()).isNull();
  assert("Black cell value").that(puzzle.cells[2][2].getValue()).isNull();
}),

// Mouse processing tests
test('Process clicks to empty cell',(suite) => {
  let puzzle = suite.showPuzzle("xo", "5x5", suite.CLUES);
  puzzle.start();

  assert("Cell value before click").that(puzzle.cells[0][1].getValue()).isNull();
  assert("Cell data before click").that(puzzle.cells[0][1].data).isEqualTo({});

  suite.cellClick(puzzle, "b1");

  assert("Cell value after one click").that(puzzle.cells[0][1].getValue()).isEqualTo("O");
  assert("Cell data after one click").that(puzzle.cells[0][1].data).isEqualTo({image: 'white_circle', returnValue: 'O'});

  suite.cellClick(puzzle, "b1");

  assert("Cell value after two clicks").that(puzzle.cells[0][1].getValue()).isEqualTo("X");
  assert("Cell data after two clicks").that(puzzle.cells[0][1].data).isEqualTo({image: 'cross', returnValue: 'X'});

  suite.cellClick(puzzle, "b1");

  assert("Cell value after three clicks").that(puzzle.cells[0][1].getValue()).isNull();
  assert("Cell data after three clicks").that(puzzle.cells[0][1].data).isEqualTo({});
  assert("Neighbour cell is not changed").that(puzzle.cells[0][2].data).isEqualTo({});
  assert("Given O is not changed").that(puzzle.cells[0][0].data).isEqualTo({image: 'white_circle'});
}),

test('Clues are not changed by click',(suite) => {
  let puzzle = suite.showPuzzle("xo", "5x5", suite.CLUES);
  puzzle.start();

  suite.cellClick(puzzle, "a1");
  suite.cellClick(puzzle, "e3");
  suite.cellClick(puzzle, "c3");

  assert("Given O after click").that(puzzle.cells[0][0].data).isEqualTo({image: 'white_circle'});
  assert("Given O value after click").that(puzzle.cells[0][0].getValue()).isNull();
  assert("Given X after click").that(puzzle.cells[2][4].data).isEqualTo({image: 'cross'});
  assert("Given X value after click").that(puzzle.cells[2][4].getValue()).isNull();
  assert("Black cell after click").that(puzzle.cells[2][2].data).isEqualTo({color: puzzle.colorSchema.gridColor});
  assert("Black cell value after click").that(puzzle.cells[2][2].getValue()).isNull();
}),

test('Process clicks in author mode',(suite) => {
  let puzzle = suite.showPuzzle("xo", "5x5");
  puzzle.edit();

  suite.cellClick(puzzle, "b2");

  assert("Cell value after one click").that(puzzle.cells[1][1].getValue()).isEqualTo("O");
  assert("Cell data after one click").that(puzzle.cells[1][1].data).isEqualTo({image: 'white_circle', returnValue: 'O'});

  suite.cellClick(puzzle, "b2");

  assert("Cell value after two clicks").that(puzzle.cells[1][1].getValue()).isEqualTo("X");
  assert("Cell data after two clicks").that(puzzle.cells[1][1].data).isEqualTo({image: 'cross', returnValue: 'X'});

  suite.cellClick(puzzle, "b2");

  assert("Cell value after three clicks").that(puzzle.cells[1][1].getValue()).isEqualTo("black");
  assert("Cell data after three clicks").that(puzzle.cells[1][1].data).isEqualTo({color: puzzle.colorSchema.gridColor, returnValue: 'black'});

  suite.cellClick(puzzle, "b2");

  assert("Cell value after four clicks").that(puzzle.cells[1][1].getValue()).isNull();
  assert("Cell data after four clicks").that(puzzle.cells[1][1].data).isEqualTo({});
  assert("Neighbour cell is not changed").that(puzzle.cells[1][2].data).isEqualTo({});
}),

// Data collector tests
test('Data collector',(suite) => {
  let puzzle = suite.showPuzzle("xo", "5x5", suite.CLUES);
  puzzle.start();

  assert("Submission data for the empty grid").that(puzzle.collectData()).isEqualTo({});

  // Solution from the checker tests (given symbols are in brackets):
  //      a   b   c   d   e
  //  1  (O)  O   X   X   O
  //  2   O   O   X   X   X
  //  3   X   X   #   O  (X)
  //  4   O   X   X   O   O
  //  5   O   O  (X)  O   X
  // One click for O and two clicks for X.
  let solution = [
    " OXXO",
    "OOXXX",
    "XX O ",
    "OXXOO",
    "OO OX"];
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 5; col++) {
      let cell = "abcde"[col] + (row + 1);
      if (solution[row][col] == "O") {
        suite.cellClicks(puzzle, cell, 1);
      }
      if (solution[row][col] == "X") {
        suite.cellClicks(puzzle, cell, 2);
      }
    }
  }
  // Clicks at the clues don't change the submission.
  suite.cellClick(puzzle, "a1");
  suite.cellClick(puzzle, "c3");

  assert("Submission data").that(puzzle.collectData()).isEqualTo({
    "b1": "O", "c1": "X", "d1": "X", "e1": "O",
    "a2": "O", "b2": "O", "c2": "X", "d2": "X", "e2": "X",
    "a3": "X", "b3": "X", "d3": "O",
    "a4": "O", "b4": "X", "c4": "X", "d4": "O", "e4": "O",
    "a5": "O", "b5": "O", "d5": "O", "e5": "X"});

  // The third click cleans the cell.
  suite.cellClick(puzzle, "e5");
  suite.cellClicks(puzzle, "b1", 2);

  assert("Submission data after cleaning").that(puzzle.collectData()).isEqualTo({
    "c1": "X", "d1": "X", "e1": "O",
    "a2": "O", "b2": "O", "c2": "X", "d2": "X", "e2": "X",
    "a3": "X", "b3": "X", "d3": "O",
    "a4": "O", "b4": "X", "c4": "X", "d4": "O", "e4": "O",
    "a5": "O", "b5": "O", "d5": "O"});
}),

test('Author data collector',(suite) => {
  let puzzle = suite.showPuzzle("xo", "5x5");
  puzzle.edit();

  assert("Data of the empty puzzle").that(puzzle.collectData()).isEqualTo({});

  // Clues from the checker tests: one click for O, two clicks for X and three clicks for black cell.
  suite.cellClicks(puzzle, "a1", 1);
  suite.cellClicks(puzzle, "e3", 2);
  suite.cellClicks(puzzle, "c5", 2);
  suite.cellClicks(puzzle, "c3", 3);

  assert("Puzzle data").that(puzzle.collectData()).isEqualTo(suite.CLUES);

  // Change O in a1 to X and remove black cell.
  suite.cellClick(puzzle, "a1");
  suite.cellClick(puzzle, "c3");

  assert("Puzzle data after changes").that(puzzle.collectData()).isEqualTo({"a1": "X", "e3": "X", "c5": "X"});
}),

test('Author data collector for existing puzzle',(suite) => {
  let puzzle = suite.showPuzzle("xo", "5x5", suite.CLUES);
  puzzle.edit();

  assert("Loaded O").that(puzzle.cells[0][0].getValue()).isEqualTo('O');
  assert("Loaded black cell").that(puzzle.cells[2][2].getValue()).isEqualTo('black');
  assert("Puzzle data").that(puzzle.collectData()).isEqualTo(suite.CLUES);

  // The next click at the loaded X changes it to black cell.
  suite.cellClick(puzzle, "e3");

  assert("Puzzle data after click").that(puzzle.collectData()).isEqualTo({"a1": "O", "e3": "black", "c5": "X", "c3": "black"});
}),

);
