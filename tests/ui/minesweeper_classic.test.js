minesweeperClassicTestSuite = uiTestSuite("Minesweeper", "squarepuzzle", "squarePuzzleType",

test('Solver selectors',(suite) => {
  let puzzle = suite.showPuzzle(
    "minesweeper_classic", "4x4",
    {"a2": "cross", "a3": "5", "d1": "2"}
  )
  puzzle.start();

  assert("Empty cell chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("Empty cell click").that(puzzle.cells[0][0].clickSwitch).containsExactly([{}, {image: 'mine', returnValue: 'mine'}, {image: 'cross'}]);
  assert("Cross chooser").that(puzzle.cells[1][0].chooserValues).isNull();
  assert("Cross click").that(puzzle.cells[1][0].clickSwitch).isNull();
  assert("Number cell chooser").that(puzzle.cells[2][0].chooserValues).isNull();
  assert("Number cell click").that(puzzle.cells[2][0].clickSwitch).containsExactly([{text: '5'}, {text: '5', image: 'white_circle'}]);
}),

test('Author selectors',(suite) => {
  let puzzle = suite.showPuzzle("minesweeper_classic", "4x4");
  puzzle.edit();

  assert("Cell chooser").that(puzzle.cells[0][0].chooserValues).containsAtLeast([{},{text: '0', returnValue: '0'},{text: '1', returnValue: '1'},{text: '8', returnValue: '8'}, {image: 'cross', returnValue: 'cross'}]);
  assert("Cell click").that(puzzle.cells[0][0].clickSwitch).isNull();
}),

// Data collector tests
test('Data collector',(suite) => {
  // The puzzle and its solution are taken from the checker tests (tests/checkers/minesweeper_classic.test.js).
  let puzzle = suite.showPuzzle("minesweeper_classic", "4x4", {"a1": "1", "c1": "2", "b3": "1", "c3": "1", "d4": "cross"});
  puzzle.start();

  assert("Submission data of the empty grid").that(puzzle.collectData()).isEqualTo({});

  let solution = {"b1": "mine", "d2": "mine", "a4": "mine"};
  suite.enterSolution(puzzle, solution);

  assert("Submission data").that(puzzle.collectData()).isEqualTo(solution);
}),

);
