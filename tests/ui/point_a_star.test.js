pointAStarTestSuite = uiTestSuite("Point a Star", "squarepuzzle", "squarePuzzleType",

test('Solver controllers',(suite) => {
  let puzzle = suite.showPuzzle(
    "point_a_star", "4x4",
    {"b3": "arrow_ur", "c4": "arrow_u", "bottom": ["2",null,null,"1"], "right": ["1",null,"1",null]}
  );
  puzzle.start();

  assert("Empty cell chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("Empty cell click").that(puzzle.cells[0][0].clickSwitch).containsExactly([{}, {image: 'star', returnValue: 'star'}, {image: 'cross'}]);
  assert("Arrow cell chooser").that(puzzle.cells[2][1].chooserValues).isNull();
  assert("Arrow cell click").that(puzzle.cells[2][1].clickSwitch).containsExactly([{image: 'arrow_ur'}, {image: 'arrow_ur', color: puzzle.colorSchema.greyColor}]);
  assert("Bottom clue chooser").that(puzzle.bottom[0].chooserValues).isNull();
  assert("Bottom clue click").that(puzzle.bottom[0].clickSwitch).containsExactly([{text: '2'}, {text: '2', image: 'white_circle'}]);
  assert("Right clue chooser").that(puzzle.right[0].chooserValues).isNull();
  assert("Right clue click").that(puzzle.right[0].clickSwitch).containsExactly([{text: '1'}, {text: '1', image: 'white_circle'}]);
}),

test('Author controllers',(suite) => {
  let puzzle = suite.showPuzzle("point_a_star", "4x4");
  puzzle.edit();

  assert("Cell chooser").that(puzzle.cells[0][0].chooserValues).containsAtLeast([{},{image: 'arrow_u', returnValue: 'arrow_u'},{image: 'arrow_ur', returnValue: 'arrow_ur'},{image: 'arrow_ul', returnValue: 'arrow_ul'}]);
  assert("Cell click").that(puzzle.cells[0][0].clickSwitch).isNull();
  assert("Bottom clue chooser").that(puzzle.bottom[0].chooserValues).containsExactly([{},{text: '0', returnValue: '0'},{text: '1', returnValue: '1'},{text: '2', returnValue: '2'}]);
  assert("Bottom clue click").that(puzzle.bottom[0].clickSwitch).isNull();
  assert("Right clue chooser").that(puzzle.right[0].chooserValues).containsExactly([{},{text: '0', returnValue: '0'},{text: '1', returnValue: '1'},{text: '2', returnValue: '2'}]);
  assert("Right clue click").that(puzzle.right[0].clickSwitch).isNull();
}),

// Data collector tests
test('Data collector',(suite) => {
  // The puzzle and its solution are taken from the checker tests (tests/checkers/point_a_star.test.js).
  let puzzle = suite.showPuzzle("point_a_star", "4x4", {"a1": "cross", "c2": "arrow_ur", "c3": "arrow_ul", "bottom": ["1", null, "1", null], "right": ["1", null, null, null]});
  puzzle.start();

  assert("Submission data of the empty grid").that(puzzle.collectData()).isEqualTo({});

  let solution = {"d1": "star", "b2": "star", "a4": "star", "c4": "star"};
  suite.enterSolution(puzzle, solution);

  assert("Submission data").that(puzzle.collectData()).isEqualTo(solution);
}),

);
