starbattleTestSuite = uiTestSuite("Starbattle", "squarepuzzle", "squarePuzzleType",

test('Solver controllers',(suite) => {
  let puzzle = suite.showPuzzle(
    "starbattle", "5x5",
    {"c3": "cross", "areas": [["a1", "b1","a2"],["b2", "a3","b3"],["c1","c2","d1","d2","e1","e2"],["a4","a5","b4","b5","c3","c4","d3"],["c5","d4","d5","e3","e4","e5"]]}
  );
  puzzle.start();

  assert("Empty cell chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("Empty cell click").that(puzzle.cells[0][0].clickSwitch).containsExactly([{}, {image: 'star', returnValue: 'star'}, {image: 'cross'}]);
  assert("Cross chooser").that(puzzle.cells[2][2].chooserValues).isNull();
  assert("Cross click").that(puzzle.cells[2][2].clickSwitch).isNull();
}),

test('Author controllers',(suite) => {
  let puzzle = suite.showPuzzle("starbattle", "5x5");
  puzzle.edit();

  assert("Cell chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("Cell click").that(puzzle.cells[0][0].clickSwitch).containsExactly([{}, {image: 'cross', returnValue: 'cross'}]);
  assert("Edge chooser").that(puzzle.edges[0][0][1].chooserValues).isNull();
  assert("Edge click").that(puzzle.edges[0][0][1].clickSwitch).containsExactly([{}, {color: puzzle.colorSchema.gridColor, returnValue: 'bold'}]);
  assert("Edge drag").that(puzzle.edges[0][0][1].dragSwitch).containsExactly([{}, {color: puzzle.colorSchema.gridColor, returnValue: 'bold'}]);
}),

// Data collector tests
test('Data collector',(suite) => {
  // The puzzle and its solution are taken from the checker tests (tests/checkers/starbattle.test.js).
  let puzzle = suite.showPuzzle("starbattle", "8x8", {
    "a1": "cross",
    "areas": [["a1", "b1", "c1", "a2", "b2", "a3", "b3"], ["d1", "c2", "d2", "c3", "d3", "a4", "b4", "c4", "d4"], ["e1", "f1", "g1", "h1", "e2", "f2", "g2", "h2"], ["e3", "f3", "g3", "h3", "e4", "f4", "g4", "h4"], ["a5", "b5", "c5", "d5"], ["a6", "b6", "c6", "d6", "a7", "b7", "c7", "d7", "a8", "b8", "c8", "d8"], ["e5", "f5", "g5", "h5", "e6", "f6", "g6", "h6"], ["e7", "f7", "g7", "h7", "e8", "f8", "g8", "h8"]]});
  puzzle.start();

  assert("Submission data of the empty grid").that(puzzle.collectData()).isEqualTo({});

  let solution = {
    "b1": "star", "d1": "star", "f2": "star", "h2": "star", "b3": "star", "d3": "star", "f4": "star", "h4": "star", "a5": "star",
    "c5": "star", "e6": "star", "g6": "star", "a7": "star", "c7": "star", "e8": "star", "g8": "star"};
  suite.enterSolution(puzzle, solution);

  assert("Submission data").that(puzzle.collectData()).isEqualTo(solution);
}),

);
