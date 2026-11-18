hitoriTestSuite = uiTestSuite("Hitori", "squarepuzzle", "squarePuzzleType",

test('Solver selectors',(suite) => {
  let puzzle = suite.showPuzzle(
    "hitori", "4x4",
    {"a1": "1", "b1": "1", "c1": "3", "d1": "2", "a2": "3", "b2": "2", "c2": "1", "d2": "2", "a3": "1", "b3": "2", "c3": "2", "d3": "3", "a4": "2", "b4": "3", "c4": "3", "d4": "1"}
  );
  puzzle.start();

  assert("Cell chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("Cell click").that(puzzle.cells[0][0].clickSwitch).containsExactly([{text: '1'}, {text: '1', color: puzzle.colorSchema.gridColor, returnValue: '1'}, {text: '1', image: 'white_circle'}]);
}),

test('Author selectors',(suite) => {
  let puzzle = suite.showPuzzle("hitori", "4x4");
  puzzle.edit();

  assert("Cell chooser").that(puzzle.cells[0][0].chooserValues).containsAtLeast([{},{text: '1', returnValue: '1'},{text: '2', returnValue: '2'},{text: '15', returnValue: '15'}]);
  assert("Cell click").that(puzzle.cells[0][0].clickSwitch).isNull();
}),

// Data collector tests
test('Data collector',(suite) => {
  // The puzzle and its solution are taken from the checker tests (tests/checkers/hitori.test.js).
  let puzzle = suite.showPuzzle("hitori", "4x4", {
    "a1": "2", "b1": "2", "c1": "3", "d1": "4", "a2": "2", "b2": "3", "c2": "3", "d2": "1", "a3": "3", "b3": "4", "c3": "1", "d3": "1",
    "a4": "4", "b4": "4", "c4": "2", "d4": "3"});
  puzzle.start();

  assert("Submission data of the empty grid").that(puzzle.collectData()).isEqualTo({});

  // Cells with clues are not submitted.
  let solution = {};
  suite.enterSolution(puzzle, solution);

  assert("Submission data").that(puzzle.collectData()).isEqualTo(solution);
}),

);
