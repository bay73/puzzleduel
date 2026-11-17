fenceTestSuite = uiTestSuite("Fence", "squarepuzzle", "squarePuzzleType",

test('Process click on edge',(suite) => {
  let puzzle = suite.showPuzzle("fence", "4x4",{"b1": "0", "a2": "3"});
  puzzle.start();

  let point = suite.gridPoint(puzzle, 0.5, 0);

  assert("Edge value before click").that(puzzle.edges[0][0][0].getValue()).isNull();
  assert("Edge data before click").that(puzzle.edges[0][0][0].data).isEqualTo({});

  suite.click(puzzle, point);

  assert("Edge value after one click").that(puzzle.edges[0][0][0].getValue()).isEqualTo("1");
  assert("Edge data after one click").that(puzzle.edges[0][0][0].data).isEqualTo({color: puzzle.colorSchema.lineColor, returnValue: "1"});

  suite.click(puzzle, point);

  assert("Edge value after two clicks").that(puzzle.edges[0][0][0].getValue()).isNull();
  assert("Edge data after two clicks").that(puzzle.edges[0][0][0].data).isEqualTo({image: "cross"});

  suite.click(puzzle, point);

  assert("Edge value after three clicks").that(puzzle.edges[0][0][0].getValue()).isNull();
  assert("Edge data after three clicks").that(puzzle.edges[0][0][0].data).isEqualTo({});
}),

test('Process drag on edge',(suite) => {
  let puzzle = suite.showPuzzle("fence", "4x4",{"b1": "0", "a2": "3"});
  puzzle.start();

  let point = suite.gridPoint(puzzle, 0, 0);

  assert("Edge value before click").that(puzzle.edges[0][0][0].getValue()).isNull();
  assert("Edge data before click").that(puzzle.edges[0][0][0].data).isEqualTo({});

  puzzle.controller.onMouseDown(suite.mouseEvent(point));
  point.right();
  puzzle.controller.onMouseMove(suite.mouseEvent(point));

  assert("Edge value after drag").that(puzzle.edges[0][0][0].getValue()).isEqualTo("1");
  assert("Edge data after drag").that(puzzle.edges[0][0][0].data).isEqualTo({color: puzzle.colorSchema.lineColor, returnValue: "1"});

  point.left();
  puzzle.controller.onMouseMove(suite.mouseEvent(point));

  assert("Edge value after back drag").that(puzzle.edges[0][0][0].getValue()).isNull();
  assert("Edge data after back drag").that(puzzle.edges[0][0][0].data).isEqualTo({});
}),

test('Data collector',(suite) => {
  let puzzle = suite.showPuzzle("fence", "4x4",{"a1": "3", "b2": "3", "c1": "0", "d2": "1"});
  puzzle.start();

  suite.edgeClick(puzzle, "a1-0");
  suite.edgeClick(puzzle, "a1-1");
  suite.edgeClick(puzzle, "a1-3");
  suite.edgeClick(puzzle, "b1-2");
  suite.edgeClick(puzzle, "b2-1");
  suite.edgeClick(puzzle, "b2-2");
  suite.edgeClick(puzzle, "d2-2");

  assert("Submission data after few clicks").that(puzzle.collectData()).isEqualTo({"edges":{"a1-0":"1","a1-1":"1","a1-3":"1","b1-2":"1","b2-1":"1","b2-2":"1","d2-2":"1"}});
}),
);


