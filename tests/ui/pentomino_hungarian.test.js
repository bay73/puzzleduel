pentominoHungarianTestSuite = uiTestSuite("Hungarian Pentomino", "squarepuzzle", "squarePuzzleType",

// Controller definition tests
test('Solver controllers',(suite) => {
  let puzzle = suite.showPuzzle(
    "pentomino_hungarian", "5x5",
    {"a1": "cross", "b2": "1"}
  );
  puzzle.start();

  assert("Empty cell chooser").that(puzzle.cells[2][2].chooserValues).isNull();
  assert("Empty cell click").that(puzzle.cells[2][2].clickSwitch).containsExactly([{}, {color: puzzle.colorSchema.greyColor, returnValue: '1'}, {image: 'cross'}]);
  assert("Black cell chooser").that(puzzle.cells[1][1].chooserValues).isNull();
  assert("Black cell click").that(puzzle.cells[1][1].clickSwitch).isNull();
  assert("Cross cell chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("Cross cell click").that(puzzle.cells[0][0].clickSwitch).isNull();;
  assert("Empty cell drag handler").that(puzzle.cells[2][2].drawDragHandler).isNotNull();
  assert("Empty cell drag processor").that(puzzle.cells[2][2].dragProcessor).isNotNull();
  assert("Black cell drag handler").that(puzzle.cells[1][1].drawDragHandler).isNotNull();
  assert("Black cell drag processor").that(puzzle.cells[1][1].dragProcessor).isNotNull();
  assert("Cross drag handler").that(puzzle.cells[0][0].drawDragHandler).isNotNull();
  assert("Cross drag processor").that(puzzle.cells[0][0].dragProcessor).isNotNull();
}),

test('Author controllers',(suite) => {
  let puzzle = suite.showPuzzle("pentomino_hungarian", "5x5");
  puzzle.edit();

  assert("Cell chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("Cell click").that(puzzle.cells[0][0].clickSwitch).containsExactly([{}, {color: puzzle.colorSchema.clueColor, returnValue: '1'}, {image: 'cross', returnValue: 'cross'}]);
}),
// Mouse processing tests
test('Drag outer clue inside the grid',(suite) => {
  let puzzle = suite.showPuzzle(
    "pentomino_hungarian", "5x5",
    {"a1": "cross", "b2": "1"}
  );
  puzzle.start();

  let point = suite.cellPoint(puzzle, "f1");

  assert("Target data before move").that(puzzle.cells[0][4].data).isEqualTo({});

  puzzle.controller.onMouseDown(suite.mouseEvent(point));
  point.left();
  puzzle.controller.onMouseMove(suite.mouseEvent(point));

  assert("Target data after move").that(puzzle.cells[0][4].data).isEqualTo({});

  puzzle.controller.onMouseUp(suite.mouseEvent(point));

  assert("Target data after drag end").that(puzzle.cells[0][4].data).isEqualTo({});
}),
);


