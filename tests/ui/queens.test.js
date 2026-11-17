queensTestSuite = uiTestSuite("Queens", "squarepuzzle", "squarePuzzleType",

test('Solver controllers',(suite) => {
  let puzzle = suite.showPuzzle(
    "queens", "4x4",
    {"a2": "cross", "a3": "5", "d1": "2"}
  )
  puzzle.start();

  assert("Empty cell chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("Empty cell click").that(puzzle.cells[0][0].clickSwitch).containsExactly([{}, {image: 'queen', returnValue: 'queen'}, {image: 'cross'}]);
  assert("Cross chooser").that(puzzle.cells[1][0].chooserValues).isNull();
  assert("Cross click").that(puzzle.cells[1][0].clickSwitch).isNull();
  assert("Number cell chooser").that(puzzle.cells[2][0].chooserValues).isNull();
  assert("Number cell click").that(puzzle.cells[2][0].clickSwitch).containsExactly([{text: '5'}, {text: '5', image: 'white_circle'}]);
}),
test('Author controllers',(suite) => {
  let puzzle = suite.showPuzzle("queens", "4x4");
  puzzle.edit();

  assert("Cell chooser").that(puzzle.cells[0][0].chooserValues).containsAtLeast([{},{text: '0', returnValue: '0'},{text: '1', returnValue: '1'},{text: '8', returnValue: '8'}, {image: 'cross', returnValue: 'cross'}]);
  assert("Cell click").that(puzzle.cells[0][0].clickSwitch).isNull();
}),
);


