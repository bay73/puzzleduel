snakeDutchTestSuite = uiTestSuite("Dutch Snake", "squarepuzzle", "squarePuzzleType",

test('Solver controllers',(suite) => {
  let puzzle = suite.showPuzzle(
    "snake_dutch", "5x5",
    {"a4": "black_circle", "b2": "black_circle", "c3": "cross", "c4": "white_circle", "d1": "white_circle", "d5": "black_circle"}
  );
  puzzle.start();

  assert("Empty cell chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("Empty cell click").that(puzzle.cells[0][0].clickSwitch).containsExactly([{}, {color: puzzle.colorSchema.greyColor, returnValue: '1'}, {image: 'cross'}]);
  assert("White circle chooser").that(puzzle.cells[0][3].chooserValues).isNull();
  assert("White circle click").that(puzzle.cells[0][3].clickSwitch).containsExactly([{image: 'white_circle'}, {image: 'white_circle', color: puzzle.colorSchema.greyColor, returnValue: '1'}]);
  assert("Black circle chooser").that(puzzle.cells[1][1].chooserValues).isNull();
  assert("Black circle click").that(puzzle.cells[1][1].clickSwitch).containsExactly([{image: 'black_circle'}, {image: 'black_circle', color: puzzle.colorSchema.greyColor, returnValue: '1'}]);
  assert("Cross chooser").that(puzzle.cells[2][2].chooserValues).isNull();
  assert("Cross click").that(puzzle.cells[2][2].clickSwitch).isNull();
}),

test('Author controllers',(suite) => {
  let puzzle = suite.showPuzzle("snake_dutch", "5x5");
  puzzle.edit();

  assert("Cell chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("Cell click").that(puzzle.cells[0][0].clickSwitch).containsExactly([{}, {image: 'white_circle', returnValue: 'white_circle'}, {image: 'black_circle', returnValue: 'black_circle'}, {image: 'cross', returnValue: 'cross'}]);
}),

// Data collector tests
test('Data collector',(suite) => {
  // The puzzle and its solution are taken from the checker tests (tests/checkers/snake_dutch.test.js).
  let puzzle = suite.showPuzzle("snake_dutch", "5x5-9", {"a3": "black_circle", "c3": "white_circle", "d4": "cross"});
  puzzle.start();

  assert("Submission data of the empty grid").that(puzzle.collectData()).isEqualTo({});

  // Cells with clues are not submitted.
  let solution = {"a1": "1", "a2": "1", "b3": "1", "d3": "1", "d2": "1", "d1": "1", "e1": "1"};
  suite.enterSolution(puzzle, solution);

  assert("Submission data").that(puzzle.collectData()).isEqualTo(solution);
}),

);
