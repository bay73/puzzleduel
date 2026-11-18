passageTestSuite = uiTestSuite("Passage", "squarepuzzle", "squarePuzzleType",

test('Solver controllers',(suite) => {
  let puzzle = suite.showPuzzle(
    "passage", "5x5",
    {"a1": "black", "a3": "4", "c5": "cross", "d1": "3", "e5": "black"}
  );
  puzzle.start();

  assert("Empty cell chooser").that(puzzle.cells[1][1].chooserValues).isNull();
  assert("Empty cell click").that(puzzle.cells[1][1].clickSwitch).containsExactly([{}, {color: puzzle.colorSchema.greyColor, returnValue: '1'}, {image: 'cross'}]);
  assert("Numbered cell chooser").that(puzzle.cells[0][3].chooserValues).isNull();
  assert("Numbered cell click").that(puzzle.cells[0][3].clickSwitch).isNull();
  assert("Black cell chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("Black cell click").that(puzzle.cells[0][0].clickSwitch).isNull();
  assert("Cross chooser").that(puzzle.cells[4][2].chooserValues).isNull();
  assert("Cross click").that(puzzle.cells[4][2].clickSwitch).isNull();
}),

test('Author controllers',(suite) => {
  let puzzle = suite.showPuzzle("passage", "5x5");
  puzzle.edit();

  assert("Cell chooser").that(puzzle.cells[0][0].chooserValues).containsExactly([{}, {color: puzzle.colorSchema.gridColor, returnValue: 'black'}, {image: 'cross', returnValue: 'cross'}, {text: '3', color: puzzle.colorSchema.greyColor, textColor: puzzle.colorSchema.textColor, returnValue: '3'}, {text: '4', color: puzzle.colorSchema.greyColor, textColor: puzzle.colorSchema.textColor, returnValue: '4'}, {text: '5', color: puzzle.colorSchema.greyColor, textColor: puzzle.colorSchema.textColor, returnValue: '5'}]);
  assert("Cell click").that(puzzle.cells[0][0].clickSwitch).isNull();
}),

// Data collector tests
test('Data collector',(suite) => {
  // The puzzle and its solution are taken from the checker tests (tests/checkers/passage.test.js).
  let puzzle = suite.showPuzzle("passage", "5x5", {"a1": "black", "b1": "3", "c3": "4", "e4": "black"});
  puzzle.start();

  assert("Submission data of the empty grid").that(puzzle.collectData()).isEqualTo({});

  let solution = {"c1": "1", "c2": "1", "c4": "1", "d4": "1"};
  suite.enterSolution(puzzle, solution);

  assert("Submission data").that(puzzle.collectData()).isEqualTo(solution);
}),

);
