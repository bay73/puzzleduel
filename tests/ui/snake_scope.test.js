snakeScopeTestSuite = uiTestSuite("Snakescope", "squarepuzzle", "squarePuzzleType",

// Controller definition tests
test('Solver controllers',(suite) => {
  let puzzle = suite.showPuzzle(
    "snake_scope", "5x5", {"c3": "cross","nodes": {"a1-2": "3","d1-2": "1","b2-2": "0","c2-2": "2","b3-2": "1","c3-2": "1"}
}
  );
  puzzle.start();

  assert("Empty cell chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("Empty cell click").that(puzzle.cells[0][0].clickSwitch).containsExactly([{}, {color: puzzle.colorSchema.greyColor, returnValue: '1'}, {image: 'cross'}]);
  assert("Cross cell chooser").that(puzzle.cells[2][2].chooserValues).isNull();
  assert("Cross cell click").that(puzzle.cells[2][2].clickSwitch).isNull();;
  assert("Empty cell drag handler").that(puzzle.cells[2][2].drawDragHandler).isNotNull();
  assert("Empty cell drag processor").that(puzzle.cells[2][2].dragProcessor).isNotNull();
  assert("Cross drag handler").that(puzzle.cells[0][0].drawDragHandler).isNotNull();
  assert("Cross drag processor").that(puzzle.cells[0][0].dragProcessor).isNotNull();
}),

test('Author controllers',(suite) => {
  let puzzle = suite.showPuzzle("snake_scope", "5x5");
  puzzle.edit();

  assert("Cell chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("Cell click").that(puzzle.cells[0][0].clickSwitch).containsExactly([{}, {image: 'cross', returnValue: 'cross'}]);
  assert("Node chooser").that(puzzle.nodes[0][0][2].chooserValues).containsExactly([{},{text: '0', color: puzzle.colorSchema.gridColor, textColor: puzzle.colorSchema.bgColor, returnValue: '0'},{text: '1', color: puzzle.colorSchema.gridColor, textColor: puzzle.colorSchema.bgColor, returnValue: '1'},{text: '2', color: puzzle.colorSchema.gridColor, textColor: puzzle.colorSchema.bgColor, returnValue: '2'},{text: '3', color: puzzle.colorSchema.gridColor, textColor: puzzle.colorSchema.bgColor, returnValue: '3'}]);
  assert("Node clue click").that(puzzle.nodes[0][0][2].clickSwitch).isNull();
}),

// Data collector tests
test('Data collector',(suite) => {
  // The puzzle and its solution are taken from the checker tests (tests/checkers/snake_scope.test.js).
  let puzzle = suite.showPuzzle("snake_scope", "5x5", {"c3": "cross", "nodes": {"a1-2": "3", "d1-2": "1", "b2-2": "0", "c2-2": "2", "b3-2": "1", "c3-2": "1"}});
  puzzle.start();

  assert("Submission data of the empty grid").that(puzzle.collectData()).isEqualTo({});

  let solution = {
    "a1": "1", "b1": "1", "a2": "1", "d2": "1", "a3": "1", "d3": "1", "e3": "1", "a4": "1", "b4": "1", "e4": "1", "b5": "1", "c5": "1",
    "d5": "1", "e5": "1"};
  suite.enterSolution(puzzle, solution);

  assert("Submission data").that(puzzle.collectData()).isEqualTo(solution);
}),

);
