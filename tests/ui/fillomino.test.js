fillominoTestSuite = uiTestSuite("Fillomino", "areapuzzle", "fillominoPuzzleType",

test('Solver controllers',(suite) => {
  let puzzle = suite.showPuzzle("fillomino", "4x4", {"a1": "3"});
  puzzle.start();

  assert("Cell chooser").that(puzzle.cells[1][1].chooserValues).containsAtLeast([{},{text: '1'},{text: '2'},{text: '10'}]);
  assert("Cell click").that(puzzle.cells[0][0].clickSwitch).isNull();
  assert("Edge chooser").that(puzzle.edges[0][0][1].chooserValues).isNull();
  assert("Edge click").that(puzzle.edges[0][0][1].clickSwitch).containsExactly([{}, {color: puzzle.colorSchema.gridColor, returnValue: 'bold'}]);
  assert("Edge drag").that(puzzle.edges[0][0][1].dragSwitch).containsExactly([{}, {color: puzzle.colorSchema.gridColor, returnValue: 'bold'}]);
  assert("Connector drag").that(puzzle.connectors[0][0]['v'].dragSwitch).containsExactly([{}, {color: puzzle.colorSchema.lineColor, returnValue:"line"}]);
}),
test('Author controllers',(suite) => {
  let puzzle = suite.showPuzzle("fillomino", "4x4");
  puzzle.edit();

  assert("Cell chooser").that(puzzle.cells[0][0].chooserValues).containsAtLeast([{},{text: '1', returnValue: '1'},{text: '2', returnValue: '2'},{text: '15', returnValue: '15'}]);
  assert("Cell click").that(puzzle.cells[0][0].clickSwitch).isNull();
  assert("Edge chooser").that(puzzle.edges[0][0][1].chooserValues).isNull();
  assert("Edge click").that(puzzle.edges[0][0][1].clickSwitch).isNull();
  assert("Edge drag").that(puzzle.edges[0][0][1].dragSwitch).isNull();
}),
// Mouse processing tests
test('Process click to empty cell',(suite) => {
  let puzzle = suite.showPuzzle("fillomino", "4x4", {"a1": "3", "b2": "3", "a3": "2"});
  puzzle.start();

  let point = suite.cellPoint(puzzle, "a2");

  assert("Cell value before click").that(puzzle.cells[1][0].getValue()).isNull();
  assert("Cell data before click").that(puzzle.cells[1][0].data).isEqualTo({});
  assert("Chooser before click").that(puzzle.controller.chooserBuilder.chooserElements).isEmptyArray();

  // Click at cell a2
  suite.click(puzzle, point);

  assert("Chooser after click").that(puzzle.controller.chooserBuilder.chooserElements).isNonEmptyArray();
  assert("Chooser connected to the cell col").that(puzzle.controller.chooserBuilder.element.col).isEqualTo(0);
  assert("Chooser connected to the cell row").that(puzzle.controller.chooserBuilder.element.row).isEqualTo(1);
  assert("Cell data after one click").that(puzzle.cells[1][0].data).isEqualTo({});

  // Click at value chooser (choosing "3"). Chooser items are placed relative to the chooser size,
  // which doesn't depend only on the cell size (it's limited by the left gap in narrow windows).
  point.x += puzzle.chooserSize*0.77;
  point.y += puzzle.chooserSize*0.11;
  suite.click(puzzle, point);

  assert("Chooser after click on value").that(puzzle.controller.chooserBuilder.chooserElements).isEmptyArray();
  assert("Cell data after two clicks").that(puzzle.cells[1][0].data).isEqualTo({text:"3"});
  assert("Cell value after two clicks").that(puzzle.cells[1][0].getValue()).isNull();
}),

test('Draw connector on drag',(suite) => {
  let puzzle = suite.showPuzzle("fillomino", "4x4", {"a2": "3"});
  puzzle.start();

  let point = suite.cellPoint(puzzle, "a1");

  assert("Cell value before click").that(puzzle.cells[0][0].getValue()).isNull();
  assert("Cell data before click").that(puzzle.cells[0][0].data).isEqualTo({});
  assert("Chooser before click").that(puzzle.controller.chooserBuilder.chooserElements).isEmptyArray();

  puzzle.controller.onMouseDown(suite.mouseEvent(point));

  assert("Chooser after mouse down").that(puzzle.controller.chooserBuilder.chooserElements).isEmptyArray();
  assert("Cell data after mouse down").that(puzzle.cells[0][0].data).isEqualTo({});

  point.right(0.5);
  puzzle.controller.onMouseMove(suite.mouseEvent(point));

  let path = puzzle.controller.dragHandler.path;
  assert("Drag path after mouse move").that(path).isNotNull();

  point.right(0.5);
  puzzle.controller.onMouseMove(suite.mouseEvent(point));

  assert("Connector after mouse move").that(puzzle.connectors[0][0]['h'].data).isEqualTo({color: puzzle.colorSchema.lineColor, returnValue:"line"});

  puzzle.controller.onMouseUp(suite.mouseEvent(point));

  assert("Chooser after mouse up").that(puzzle.controller.chooserBuilder.chooserElements).isEmptyArray();
  assert("Cell value after mouse up").that(puzzle.cells[0][0].getValue()).isNull();
  assert("Cell data after mouse up").that(puzzle.cells[0][0].data).isEqualTo({});
}),
test('Automatically set borders',(suite) => {
  let puzzle = suite.showPuzzle("fillomino", "4x4", {"a1": "3", "b2": "3", "a3": "2"});
  puzzle.start();

  let point = suite.cellPoint(puzzle, "a2");

  // Click at cell a2
  suite.click(puzzle, point);

  // Click at value chooser (choosing "2")
  point.x += puzzle.chooserSize*0.71;
  point.y -= puzzle.chooserSize*0.32;
  suite.click(puzzle, point);

  assert("Cell data after two clicks").that(puzzle.cells[1][0].data).isEqualTo({text:"2"});
  assert("Edge between a2 and a1 value after change cell").that(puzzle.edges[1][0][0].getValue()).isEqualTo("bold");
  assert("Edge between a2 and b2 value after change cell").that(puzzle.edges[1][0][1].getValue()).isEqualTo("bold");
  assert("Edge between a2 and a3 value after change cell").that(puzzle.edges[1][0][2].getValue()).isEqualTo(null);
}),
// Data collector tests
test('Data collector',(suite) => {
  let puzzle = suite.showPuzzle("fillomino", "4x4",{"a1": "3", "b1": "2","a4":"3","d2":"2"});
  puzzle.start();

  puzzle.cells[1][0].switchToData({text:"3"});
  puzzle.cells[2][0].switchToData({text:"4"});
  puzzle.cells[1][1].switchToData({text:"3"});
  puzzle.cells[2][1].switchToData({text:"4"});
  puzzle.cells[3][1].switchToData({text:"3"});
  puzzle.cells[0][2].switchToData({text:"2"});
  puzzle.cells[1][2].switchToData({text:"4"});
  puzzle.cells[2][2].switchToData({text:"4"});
  puzzle.cells[3][2].switchToData({text:"3"});
  puzzle.cells[0][3].switchToData({text:"1"});
  puzzle.cells[2][3].switchToData({text:"2"});
  puzzle.cells[3][3].switchToData({text:"1"});

  assert("Submission data after five clicks").that(puzzle.collectData()).isEqualTo(
  {"areas":[["b1","c1"],["d1"],["a1","a2","b2"],["c2","a3","b3","c3"],["d2","d3"],["a4","b4","c4"],["d4"]]});
}),

);

