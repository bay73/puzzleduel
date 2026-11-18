gapsTestSuite = uiTestSuite("Gaps", "squarepuzzle", "squarePuzzleType",

test('Solver controllers',(suite) => {
  let puzzle = suite.showPuzzle(
    "gaps", "5x5",
    {"a1": "cross", "b2": "white_circle", "bottom": ["2",null,"2",null,"2"], "right": ["3","3",null,null,null]}
  );
  puzzle.start();

  assert("Empty cell chooser").that(puzzle.cells[2][2].chooserValues).isNull();
  assert("Empty cell click").that(puzzle.cells[2][2].clickSwitch).containsExactly([{}, {image: 'white_circle', returnValue: 'white_circle'}, {image: 'cross'}]);
  assert("White circle chooser").that(puzzle.cells[1][1].chooserValues).isNull();
  assert("White circle click").that(puzzle.cells[1][1].clickSwitch).isNull();
  assert("Cross cell chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("Cross cell click").that(puzzle.cells[0][0].clickSwitch).isNull();;
  assert("Bottom clue chooser").that(puzzle.bottom[0].chooserValues).isNull();
  assert("Bottom clue click").that(puzzle.bottom[0].clickSwitch).containsExactly([{text: '2'}, {text: '2', image: 'white_circle'}]);
  assert("Right clue chooser").that(puzzle.right[0].chooserValues).isNull();
  assert("Right clue click").that(puzzle.right[0].clickSwitch).containsExactly([{text: '3'}, {text: '3', image: 'white_circle'}]);
  assert("Empty cell drag handler").that(puzzle.cells[2][2].drawDragHandler).isNotNull();
  assert("Empty cell drag processor").that(puzzle.cells[2][2].dragProcessor).isNotNull();
  assert("White circle drag handler").that(puzzle.cells[1][1].drawDragHandler).isNotNull();
  assert("White circle drag processor").that(puzzle.cells[1][1].dragProcessor).isNotNull();
  assert("Cross drag handler").that(puzzle.cells[0][0].drawDragHandler).isNotNull();
  assert("Cross drag processor").that(puzzle.cells[0][0].dragProcessor).isNotNull();
}),

test('Author controllers',(suite) => {
  let puzzle = suite.showPuzzle("gaps", "5x5");
  puzzle.edit();

  assert("Cell chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("Cell click").that(puzzle.cells[0][0].clickSwitch).containsExactly([{}, {image: 'cross', returnValue: 'cross'}, {image: 'white_circle', returnValue: 'white_circle'}]);
  assert("Bottom clue chooser").that(puzzle.bottom[0].chooserValues).containsAtLeast([{},{text: '1', returnValue: '1'},{text: '2', returnValue: '2'},{text: '3', returnValue: '3'}]);
  assert("Bottom clue click").that(puzzle.bottom[0].clickSwitch).isNull();
  assert("Right clue chooser").that(puzzle.right[0].chooserValues).containsAtLeast([{},{text: '1', returnValue: '1'},{text: '2', returnValue: '2'},{text: '3', returnValue: '3'}]);
  assert("Right clue click").that(puzzle.right[0].clickSwitch).isNull();
}),

// Data collector tests
test('Data collector',(suite) => {
  // The puzzle and its solution are taken from the checker tests (tests/checkers/gaps.test.js).
  let puzzle = suite.showPuzzle("gaps", "8x8", {"bottom": ["1", null, null, "1", null, null, null, "1"], "right": ["1", null, null, "1", null, null, null, "1"]});
  puzzle.start();

  assert("Submission data of the empty grid").that(puzzle.collectData()).isEqualTo({});

  let solution = {
    "b1": "white_circle", "d1": "white_circle", "f2": "white_circle", "h2": "white_circle", "b3": "white_circle", "d3": "white_circle",
    "f4": "white_circle", "h4": "white_circle", "a5": "white_circle", "c5": "white_circle", "e6": "white_circle", "g6": "white_circle",
    "a7": "white_circle", "c7": "white_circle", "e8": "white_circle", "g8": "white_circle"};
  suite.enterSolution(puzzle, solution);

  assert("Submission data").that(puzzle.collectData()).isEqualTo(solution);
}),

);
