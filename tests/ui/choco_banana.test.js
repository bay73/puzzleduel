chocoBananaTestSuite = uiTestSuite("Choco Banana", "squarepuzzle", "squarePuzzleType",

test('Solver controllers',(suite) => {
  let puzzle = suite.showPuzzle(
    "choco_banana", "9x9-1",
    {"data": {"b1":"1","e1":"4","a2":"3","e3":"2","b4":"4","h4":"2","a5":"4","g5":"4","i5":"4","b6":"2","h6":"2","e7":"2","i8":"2","e9":"4","h9":"4"}}
  );
  puzzle.start();

  assert("Empty cell chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("Empty cell click").that(puzzle.cells[0][0].clickSwitch).containsExactly([{}, {color: puzzle.colorSchema.greyColor, returnValue: '1'}, {image: 'cross'}]);
  assert("Hint cell chooser").that(puzzle.cells[2][4].chooserValues).isNull();
  assert("Hint cell click").that(puzzle.cells[2][4].clickSwitch).containsExactly([{}, {color: puzzle.colorSchema.greyColor, returnValue: '1'}, {image: 'cross'}]);
}),
test('Author controllers',(suite) => {
  let puzzle = suite.showPuzzle("choco_banana", "9x9");
  puzzle.edit();

  assert("Cell chooser").that(puzzle.cells[0][0].chooserValues).containsAtLeast([{},{text: '1', textColor: puzzle.colorSchema.textColor, returnValue: '1'},{text: '2', textColor: puzzle.colorSchema.textColor, returnValue: '2'},{text: '8', textColor: puzzle.colorSchema.textColor, returnValue: '8'}]);
  assert("Cell click").that(puzzle.cells[0][0].clickSwitch).isNull();
}),

// Data collector tests
test('Data collector',(suite) => {
  // The puzzle and its solution are taken from the checker tests (tests/checkers/choco_banana.test.js).
  let puzzle = suite.showPuzzle("choco_banana", "5x5", {"a2": "5", "b1": "2", "d5": "3", "e4": "2"});
  puzzle.start();

  assert("Submission data of the empty grid").that(puzzle.collectData()).isEqualTo({});

  // Cells with clues are not submitted.
  let solution = {"a3": "1", "b3": "1", "b5": "1", "c1": "1", "c4": "1", "d2": "1", "d3": "1", "e5": "1"};
  suite.enterSolution(puzzle, solution);

  assert("Submission data").that(puzzle.collectData()).isEqualTo(solution);
}),

);
