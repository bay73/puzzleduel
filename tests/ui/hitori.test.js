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
);


