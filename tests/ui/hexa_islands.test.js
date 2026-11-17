hexaIslandsTestSuite = uiTestSuite("Hexa Islands", "hexapuzzle", "hexaPuzzleType",

// Controller definition tests
test('Solver controllers',(suite) => {
  let puzzle = suite.showPuzzle(
    "hexa_islands", "5x5",{"a1": "1", "a2": "1"}
  );
  puzzle.start();

  assert("Clue cell chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("Clue cell click").that(puzzle.cells[0][0].clickSwitch).isNull();
  assert("Empty cell chooser").that(puzzle.cells[1][1].chooserValues).isNull();
  assert("Empty cell click").that(puzzle.cells[1][1].clickSwitch).containsExactly([{}, { color: puzzle.colorSchema.gridColor, returnValue: '1'}, {image: 'cross'}]);
  assert("Cell drag handler").that(puzzle.cells[0][0].drawDragHandler).isNotNull();
  assert("Cell drag processor").that(puzzle.cells[0][0].dragProcessor).isNotNull();
}),

test('Author controllers',(suite) => {
  let puzzle = suite.showPuzzle("hexa_islands", "5x5");
  puzzle.edit();

  assert("Cell chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("Cell click").that(puzzle.cells[0][0].clickSwitch).containsExactly([{}, {color: puzzle.colorSchema.clueColor, returnValue: '1'}]);
}),
);


