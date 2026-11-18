starbattleSmallregionsTestSuite = uiTestSuite("Starbattle (Small Regions)", "squarepuzzle", "squarePuzzleType",

test('Solver controllers',(suite) => {
  let puzzle = suite.showPuzzle(
    "starbattle_smallregions", "5x5-1",
    {"c3": "cross", "areas": [["a1", "b1","a2"],["b2", "a3","b3"],["c1","c2","d1","d2","e1","e2"],["a4","a5","b4","b5","c3","c4","d3"],["c5","d4","d5","e3","e4","e5"]]}
  );
  puzzle.start();

  assert("Empty cell chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("Empty cell click").that(puzzle.cells[0][0].clickSwitch).containsExactly([{}, {image: 'star', returnValue: 'star'}, {image: 'cross'}]);
  assert("Cross chooser").that(puzzle.cells[2][2].chooserValues).isNull();
  assert("Cross click").that(puzzle.cells[2][2].clickSwitch).isNull();
}),

test('Author controllers',(suite) => {
  let puzzle = suite.showPuzzle("starbattle_smallregions", "5x5-1");
  puzzle.edit();

  assert("Cell chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("Cell click").that(puzzle.cells[0][0].clickSwitch).containsExactly([{}, {image: 'cross', returnValue: 'cross'}]);
  assert("Edge chooser").that(puzzle.edges[0][0][1].chooserValues).isNull();
  assert("Edge click").that(puzzle.edges[0][0][1].clickSwitch).containsExactly([{}, {color: puzzle.colorSchema.gridColor, returnValue: 'bold'}]);
  assert("Edge drag").that(puzzle.edges[0][0][1].dragSwitch).containsExactly([{}, {color: puzzle.colorSchema.gridColor, returnValue: 'bold'}]);
}),

// Data collector tests
test('Data collector',(suite) => {
  // The puzzle and its solution are taken from the checker tests (tests/checkers/starbattle_smallregions.test.js).
  let puzzle = suite.showPuzzle("starbattle_smallregions", "5x5-1", {
    
    "areas": [["a1", "b1", "a2", "a3"], ["c1", "d1", "e1", "e2", "e3"], ["b2", "c2", "d2", "b3"], ["c3", "d3", "a4", "b4", "c4", "a5"], ["d4", "e4", "b5", "c5", "d5", "e5"]]});
  puzzle.start();

  assert("Submission data of the empty grid").that(puzzle.collectData()).isEqualTo({});

  let solution = {"a1": "star", "c2": "star", "e3": "star", "b4": "star", "d5": "star"};
  suite.enterSolution(puzzle, solution);

  assert("Submission data").that(puzzle.collectData()).isEqualTo(solution);
}),

);
