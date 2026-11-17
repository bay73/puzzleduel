slashPackTestSuite = uiTestSuite("Slash Pack", "slashpuzzle", "slashPuzzleType",

// Controller definition tests
test('Solver controllers',(suite) => {
  let puzzle = suite.showPuzzle(
    "slash_pack", "5x5-ABC",
    {"a4": "A"}
  );
  puzzle.start();

  assert("Empty cell chooser").that(puzzle.cells[2][2].chooserValues).isNull();
  assert("Empty cell click").that(puzzle.cells[2][2].clickSwitch).containsExactly([{}, {image: 'slash', returnValue: '/'}, {image: 'backslash', returnValue:'\\'}]);
  assert("Letter cell chooser").that(puzzle.cells[3][0].chooserValues).isNull();
  assert("Letter cell click").that(puzzle.cells[3][0].clickSwitch).isNull();;
  assert("Cell drag handler").that(puzzle.cells[2][2].drawDragHandler).isNull();
  assert("Cell drag processor").that(puzzle.cells[2][2].dragProcessor).isNull();
  assert("Node drag handler").that(puzzle.nodes[2][2][0].drawDragHandler).isNull();
  assert("Node drag processor").that(puzzle.nodes[2][2][0].dragProcessor).isNotNull();
}),

test('Author controllers',(suite) => {
  let puzzle = suite.showPuzzle("slash_pack", "5x5-ABC");
  puzzle.edit();

  assert("Cell chooser").that(puzzle.cells[0][0].chooserValues).containsExactly([{},{text: 'A', returnValue: 'A'},{text: 'B', returnValue: 'B'},{text: 'C', returnValue: 'C'}]);
  assert("Cell click").that(puzzle.cells[0][0].clickSwitch).isNull();
}),
// Mouse processing tests
test('Process click to empty cell',(suite) => {
  let puzzle = suite.showPuzzle(
    "slash_pack", "5x5-ABC",
    {"a4": "A"}
  );
  puzzle.start();

  let point = suite.cellPoint(puzzle, "a1");

  assert("Cell value before click").that(puzzle.cells[0][0].getValue()).isNull();
  assert("Cell data before click").that(puzzle.cells[0][0].data).isEqualTo({});

  suite.click(puzzle, point);

  assert("Cell value after mouse up").that(puzzle.cells[0][0].getValue()).isEqualTo("/");
  assert("Cell data after one click").that(puzzle.cells[0][0].data).isEqualTo({image: 'slash', returnValue: '/'});
}),

test('Draw diagonal',(suite) => {
  let puzzle = suite.showPuzzle(
    "slash_pack", "5x5-ABC",
    {"a4": "A"}
  );
  puzzle.start();

  let point = suite.gridPoint(puzzle, 0, 1);

  assert("Cell value before click").that(puzzle.cells[0][0].getValue()).isNull();
  assert("Cell data before click").that(puzzle.cells[0][0].data).isEqualTo({});
  assert("Chooser before click").that(puzzle.controller.chooserBuilder.chooserElements).isEmptyArray();

  puzzle.controller.onMouseDown(suite.mouseEvent(point));

  assert("Cell data after mouse down").that(puzzle.cells[0][0].data).isEqualTo({});

  point.right();
  point.up();
  puzzle.controller.onMouseMove(suite.mouseEvent(point));

  assert("Cell value after mouse move").that(puzzle.cells[0][0].getValue()).isEqualTo("/");
  assert("Cell data after mouse move").that(puzzle.cells[0][0].data).isEqualTo({image: 'slash', returnValue: '/'});

  point.right();
  point.down();
  puzzle.controller.onMouseMove(suite.mouseEvent(point));
  
  assert("Cell value after second mouse move").that(puzzle.cells[0][1].getValue()).isEqualTo("\\");
  assert("Cell data after second mouse move").that(puzzle.cells[0][1].data).isEqualTo({image: 'backslash', returnValue: '\\'});

}),

test('Process clicks to empty cell',(suite) => {
  let puzzle = suite.showPuzzle("slash_pack", "5x5-ABC", {"a4": "A", "b1": "B"});
  puzzle.start();

  let point = suite.cellPoint(puzzle, "a1");

  suite.click(puzzle, point);
  suite.click(puzzle, point);

  assert("Cell value after two clicks").that(puzzle.cells[0][0].getValue()).isEqualTo("\\");
  assert("Cell data after two clicks").that(puzzle.cells[0][0].data).isEqualTo({image: 'backslash', returnValue: '\\'});

  suite.click(puzzle, point);

  assert("Cell value after three clicks").that(puzzle.cells[0][0].getValue()).isNull();
  assert("Cell data after three clicks").that(puzzle.cells[0][0].data).isEqualTo({});
}),

test('Cell with a letter can not be changed',(suite) => {
  let puzzle = suite.showPuzzle("slash_pack", "5x5-ABC", {"a4": "A", "b1": "B"});
  puzzle.start();

  // Click at the cell b1.
  let point = suite.cellPoint(puzzle, "b1");
  suite.click(puzzle, point);

  assert("Cell value after click").that(puzzle.cells[0][1].getValue()).isNull();
  assert("Cell data after click").that(puzzle.cells[0][1].data).isEqualTo({text: 'B'});

  // Drag from the top left to the bottom right corner of the cell b1.
  point = suite.gridPoint(puzzle, 1, 0);
  puzzle.controller.onMouseDown(suite.mouseEvent(point));
  point.right();
  point.down();
  puzzle.controller.onMouseMove(suite.mouseEvent(point));
  puzzle.controller.onMouseUp(suite.mouseEvent(point));

  assert("Cell value after drag").that(puzzle.cells[0][1].getValue()).isNull();
  assert("Cell data after drag").that(puzzle.cells[0][1].data).isEqualTo({text: 'B'});
}),

test('Repeated drag removes the diagonal',(suite) => {
  let puzzle = suite.showPuzzle("slash_pack", "5x5-ABC", {"a4": "A", "b1": "B"});
  puzzle.start();

  // From the bottom left to the top right corner of the cell a1 and back.
  let x1 = puzzle.size.leftGap;
  let y1 = puzzle.size.topGap + puzzle.size.unitSize;
  let x2 = x1 + puzzle.size.unitSize;
  let y2 = y1 - puzzle.size.unitSize;

  puzzle.controller.onMouseDown(suite.mouseEvent(x1, y1));
  puzzle.controller.onMouseMove(suite.mouseEvent(x2, y2));
  puzzle.controller.onMouseUp(suite.mouseEvent(x2, y2));

  assert("Cell value after drag").that(puzzle.cells[0][0].getValue()).isEqualTo("/");

  puzzle.controller.onMouseDown(suite.mouseEvent(x2, y2));
  puzzle.controller.onMouseMove(suite.mouseEvent(x1, y1));
  puzzle.controller.onMouseUp(suite.mouseEvent(x1, y1));

  assert("Cell value after second drag").that(puzzle.cells[0][0].getValue()).isNull();
  assert("Cell data after second drag").that(puzzle.cells[0][0].data).isEqualTo({});
}),

// Data collector tests
test('Data collector',(suite) => {
  let puzzle = suite.showPuzzle("slash_pack", "5x5-ABC", {"a4": "A", "b1": "B"});
  puzzle.start();

  // Slash in a1 by click.
  let point = suite.cellPoint(puzzle, "a1");
  suite.click(puzzle, point);
  // Backslash in c3 by drag from its top left to its bottom right corner.
  point = suite.gridPoint(puzzle, 2, 2);
  puzzle.controller.onMouseDown(suite.mouseEvent(point));
  point.right();
  point.down();
  puzzle.controller.onMouseMove(suite.mouseEvent(point));
  puzzle.controller.onMouseUp(suite.mouseEvent(point));

  // Letters given by the author are not submitted.
  assert("Submission data").that(puzzle.collectData()).isEqualTo({"a1": "/", "c3": "\\"});
}),

test('Author data collector',(suite) => {
  let puzzle = suite.showPuzzle("slash_pack", "5x5-ABC");
  puzzle.edit();

  // Choose "B" for a1 and "C" for d2.
  puzzle.cells[0][0].switchOnChooser(2);
  puzzle.cells[1][3].switchOnChooser(3);

  assert("Cell data").that(puzzle.cells[0][0].data).isEqualTo({text: 'B', returnValue: 'B'});
  assert("Puzzle data").that(puzzle.collectData()).isEqualTo({"a1": "B", "d2": "C"});
}),

);
