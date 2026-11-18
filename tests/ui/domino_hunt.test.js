dominoHuntTestSuite = uiTestSuite("Domino hunt", "areapuzzle", "dominoType",

test('Solvers controllers',(suite) => {
  let puzzle = suite.showPuzzle(
    "domino_hunt", "4x4-123",
    {"a1": "1", "a2": "1", "a3": "1", "a4": "1", "b1": "2", "b2": "black", "b3": "black", "b4": "3", "c1": "2", "c2": "black", "c3": "black", "c4": "3", "d1": "2", "d2": "2", "d3": "3", "d4": "3"}
  );
  puzzle.start();

  assert("Cell chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("Cell click").that(puzzle.cells[0][0].clickSwitch).isNull();
  assert("Edge chooser").that(puzzle.edges[0][0][1].chooserValues).isNull();
  assert("Edge click").that(puzzle.edges[0][0][1].clickSwitch).containsExactly([{}, {color: puzzle.colorSchema.gridColor, returnValue: 'bold'}]);
  assert("Edge drag").that(puzzle.edges[0][0][1].dragSwitch).containsExactly([{}, {color: puzzle.colorSchema.gridColor, returnValue: 'bold'}]);
  assert("Connector drag").that(puzzle.connectors[0][0]['v'].dragSwitch).containsExactly([{}, {color: puzzle.colorSchema.lineColor, returnValue: 'line'}]);
}),

test('Author controllers',(suite) => {
  let puzzle = suite.showPuzzle("domino_hunt", "4x4-123");
  puzzle.edit();

  assert("Cell chooser").that(puzzle.cells[0][0].chooserValues).containsExactly([{},{color: puzzle.colorSchema.gridColor, returnValue: 'black'},{text: '1', returnValue: '1'},{text: '2', returnValue: '2'},{text: '3', returnValue: '3'}]);
  assert("Cell click").that(puzzle.cells[0][0].clickSwitch).isNull();
  assert("Edge chooser").that(puzzle.edges[0][0][1].chooserValues).isNull();
  assert("Edge click").that(puzzle.edges[0][0][1].clickSwitch).isNull();
  assert("Edge drag").that(puzzle.edges[0][0][1].dragSwitch).isNull();
  assert("Connector drag").that(puzzle.connectors[0][0]['v'].dragSwitch).isNull();
}),

test('Automatic edges for connector',(suite) => {
  let puzzle = suite.showPuzzle(
    "domino_hunt", "4x4-123",
    {"a1": "1", "a2": "1", "a3": "1", "a4": "1", "b1": "2", "b2": "black", "b3": "black", "b4": "3", "c1": "2", "c2": "black", "c3": "black", "c4": "3", "d1": "2", "d2": "2", "d3": "3", "d4": "3"}
  );
  puzzle.start();

  let point = suite.cellPoint(puzzle, "a1");

  assert("Connector value before click").that(puzzle.connectors[0][0]['h'].getValue()).isNull();
  assert("Connector data before click").that(puzzle.connectors[0][0]['h'].data).isEqualTo({});

  puzzle.controller.onMouseDown(suite.mouseEvent(point));

  assert("Connector value after mousedown").that(puzzle.connectors[0][0]['h'].getValue()).isNull();
  assert("Connector data after mousedown").that(puzzle.connectors[0][0]['h'].data).isEqualTo({});
  
  point.right();
  puzzle.controller.onMouseMove(suite.mouseEvent(point));
  puzzle.controller.onMouseUp(suite.mouseEvent(point));

  assert("Connector value after drag end").that(puzzle.connectors[0][0]['h'].getValue()).isEqualTo("line");
  assert("Connector data after drag end").that(puzzle.connectors[0][0]['h'].data).isEqualTo({color: puzzle.colorSchema.lineColor, returnValue: 'line'});

  assert("Edge a1/a2 value after connector").that(puzzle.edges[0][0][2].getValue()).isEqualTo("bold");
  assert("Edge a1/a2 data after connector").that(puzzle.edges[0][0][2].data).isEqualTo({color:puzzle.colorSchema.greyColor});

  assert("Edge b1/b2 value after connector").that(puzzle.edges[0][1][2].getValue()).isEqualTo("bold");
  assert("Edge b1/b2 data after connector").that(puzzle.edges[0][1][2].data).isEqualTo({color:puzzle.colorSchema.greyColor});

  assert("Edge b1/c1 value after connector").that(puzzle.edges[0][1][1].getValue()).isEqualTo("bold");
  assert("Edge b1/c1 data after connector").that(puzzle.edges[0][1][1].data).isEqualTo({color:puzzle.colorSchema.greyColor});

  assert("Submission data").that(puzzle.collectData().areas).containsExactly([["a1","b1"],["c1","d1","a2","d2","a3","d3","a4","b4","c4","d4"],["b2"],["c2"],["b3"],["c3"]]);
}),
test('Submission data',(suite) => {
  let puzzle = suite.showPuzzle(
    "domino_hunt", "4x4-123",
    {"a1": "1", "a2": "1", "a3": "1", "a4": "1", "b1": "2", "b2": "black", "b3": "black", "b4": "3", "c1": "2", "c2": "black", "c3": "black", "c4": "3", "d1": "2", "d2": "2", "d3": "3", "d4": "3"}
  );
  puzzle.start();

  suite.edgeClick(puzzle, "a1-1");
  suite.edgeClick(puzzle, "a2-2");
  suite.edgeClick(puzzle, "c1-1");
  suite.edgeClick(puzzle, "d2-2");
  suite.edgeClick(puzzle, "a3-2");
  suite.edgeClick(puzzle, "a3-2");
  suite.edgeClick(puzzle, "a4-1");
  suite.edgeClick(puzzle, "c4-1");

  assert("Submission data").that(puzzle.collectData().areas).containsExactly([["a1","a2"],["b1","c1"],["d1","d2"],["a3","a4"],["b4","c4"],["d3","d4"],["b2"],["c2"],["b3"],["c3"]]);
}),

// Data collector tests
test('Data collector',(suite) => {
  // The puzzle and its solution are taken from the checker tests (tests/checkers/domino_hunt.test.js).
  let puzzle = suite.showPuzzle("domino_hunt", "4x3-012", {"a1": "0", "b1": "0", "c1": "1", "d1": "2", "a2": "0", "b2": "2", "c2": "1", "d2": "0", "a3": "1", "b3": "2", "c3": "1", "d3": "2"});
  puzzle.start();

  assert("Submission data of the empty grid").that(puzzle.collectData()).isEqualTo({});

  let solution = {"areas": [["a1", "b1"], ["c1", "d1"], ["a2", "a3"], ["b2", "b3"], ["c2", "c3"], ["d2", "d3"]]};
  suite.enterSolution(puzzle, solution);

  assert("Submission data").that(puzzle.collectData()).isEqualTo(solution);
}),

);
