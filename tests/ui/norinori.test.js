norinoriTestSuite = uiTestSuite("Norinori", "squarepuzzle", "squarePuzzleType",

test('Solver controllers',(suite) => {
  let puzzle = suite.showPuzzle(
    "norinori", "5x5-1",
    {"areas": [["a1", "b1","a2"],["b2", "a3","b3"],["c1","c2","d1","d2","e1","e2"],["a4","a5","b4","b5","c3","c4","d3"],["c5","d4","d5","e3","e4","e5"]]}
  );
  puzzle.start();

  assert("Empty cell chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("Empty cell click").that(puzzle.cells[0][0].clickSwitch).containsExactly([{}, {color: puzzle.colorSchema.greyColor, returnValue: '1'}, {image: 'cross'}]);
}),
test('Author controllers',(suite) => {
  let puzzle = suite.showPuzzle("norinori", "5x5");
  puzzle.edit();

  assert("Cell chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("Cell click").that(puzzle.cells[0][0].clickSwitch).isNull();
  assert("Edge chooser").that(puzzle.edges[0][0][1].chooserValues).isNull();
  assert("Edge click").that(puzzle.edges[0][0][1].clickSwitch).containsExactly([{}, {color: puzzle.colorSchema.gridColor, returnValue: 'bold'}]);
  assert("Edge drag").that(puzzle.edges[0][0][1].dragSwitch).containsExactly([{}, {color: puzzle.colorSchema.gridColor, returnValue: 'bold'}]);
}),

// Data collector tests
test('Data collector',(suite) => {
  // The puzzle and its solution are taken from the checker tests (tests/checkers/norinori.test.js).
  let puzzle = suite.showPuzzle("norinori", "4x4", {"areas": [["a1", "b1", "c1", "a2", "b2"], ["d1", "c2", "d2", "d3"], ["a3", "b3", "a4", "b4"], ["c3", "c4", "d4"]]});
  puzzle.start();

  assert("Submission data of the empty grid").that(puzzle.collectData()).isEqualTo({});

  let solution = {"a1": "1", "b1": "1", "d1": "1", "d2": "1", "a3": "1", "a4": "1", "c3": "1", "c4": "1"};
  suite.enterSolution(puzzle, solution);

  assert("Submission data").that(puzzle.collectData()).isEqualTo(solution);
}),

);
