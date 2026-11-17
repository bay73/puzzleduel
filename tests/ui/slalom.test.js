slalomTestSuite = testSuite("Slalom",

beforeSuite((suite, cb)=> {
  suite.GRID_SELECTOR = "#mainGrid";
  if (!$(suite.GRID_SELECTOR).length) {
    throw "Missing " + suite.GRID_SELECTOR + " element"
  };
  suite.showPuzzle = function(type, dimension, data) {
    var controls = "";
    var puzzleData = {
      typeCode: type,
      id: "",
      dimension: dimension
    };
    var settings = {
      local: true,
      data: data || {}
    };
    var puzzle = new slashPuzzleType(puzzleData, controls, settings);
    puzzle.render(Snap(suite.GRID_SELECTOR));
    return puzzle;
  };
  suite.mouseEvent = function(x, y) {
    return {clientX: x, clientY: y, preventDefault: ()=>{}};
  };
  // Position of the grid node: (0, 0) is the top left corner of the cell a1.
  suite.nodePosition = function(puzzle, col, row) {
    return {x: puzzle.size.leftGap + col*puzzle.size.unitSize, y: puzzle.size.topGap + row*puzzle.size.unitSize};
  };
  // Emulates mouse drag between two grid nodes.
  suite.dragBetweenNodes = function(puzzle, col1, row1, col2, row2) {
    let start = suite.nodePosition(puzzle, col1, row1);
    let end = suite.nodePosition(puzzle, col2, row2);
    puzzle.controller.onMouseDown(suite.mouseEvent(start.x, start.y));
    puzzle.controller.onMouseMove(suite.mouseEvent(end.x, end.y));
    puzzle.controller.onMouseUp(suite.mouseEvent(end.x, end.y));
  };
  requirejs(["slashpuzzle"], cb);
}),

after((suite)=> {
  Snap(suite.GRID_SELECTOR).clear();
}),

// Controller definition tests
test('Solver controllers',(suite) => {
  // Clues are numbers in the nodes: "a1-2" is the bottom right corner of the cell a1.
  let puzzle = suite.showPuzzle(
    "slalom", "4x4",
    {"nodes": {"a1-2": "1", "b2-2": "3"}}
  );
  puzzle.start();

  assert("Cell chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("Cell click").that(puzzle.cells[0][0].clickSwitch).containsExactly([{}, {image: 'slash', returnValue: '/'}, {image: 'backslash', returnValue:'\\'}]);
  assert("Cell drag processor").that(puzzle.cells[0][0].dragProcessor).isNull();
  assert("Clue node data").that(puzzle.nodes[0][0][2].data).isEqualTo({text: '1', color: puzzle.colorSchema.gridColor, textColor: "#fff"});
  assert("Clue node chooser").that(puzzle.nodes[0][0][2].chooserValues).isNull();
  assert("Clue node click").that(puzzle.nodes[0][0][2].clickSwitch).isNull();
  assert("Clue node drag processor").that(puzzle.nodes[0][0][2].dragProcessor).isNotNull();
  assert("Empty node chooser").that(puzzle.nodes[0][0][0].chooserValues).isNull();
  assert("Empty node click").that(puzzle.nodes[0][0][0].clickSwitch).isNull();
  assert("Empty node drag processor").that(puzzle.nodes[0][0][0].dragProcessor).isNotNull();
}),

test('Author controllers',(suite) => {
  let puzzle = suite.showPuzzle("slalom", "4x4");
  puzzle.edit();

  let numberItem = function(number) {
    return {text: number, color: puzzle.colorSchema.gridColor, textColor: "#fff", returnValue: number};
  }
  assert("Node chooser").that(puzzle.nodes[0][0][2].chooserValues).containsExactly([{}, numberItem('0'), numberItem('1'), numberItem('2'), numberItem('3'), numberItem('4')]);
  assert("Node click").that(puzzle.nodes[0][0][2].clickSwitch).isNull();
  assert("Node drag processor").that(puzzle.nodes[0][0][2].dragProcessor).isNull();
  assert("Cell chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("Cell click").that(puzzle.cells[0][0].clickSwitch).isNull();
}),

// Mouse processing tests
test('Process clicks to cell',(suite) => {
  let puzzle = suite.showPuzzle("slalom", "4x4", {"nodes": {"a1-2": "1", "b2-2": "3"}});
  puzzle.start();

  let x = puzzle.size.leftGap + puzzle.size.unitSize/2;
  let y = puzzle.size.topGap + puzzle.size.unitSize/2;

  assert("Cell value before click").that(puzzle.cells[0][0].getValue()).isNull();
  assert("Cell data before click").that(puzzle.cells[0][0].data).isEqualTo({});

  puzzle.controller.onMouseDown(suite.mouseEvent(x, y));
  puzzle.controller.onMouseUp(suite.mouseEvent(x, y));

  assert("Cell value after one click").that(puzzle.cells[0][0].getValue()).isEqualTo("/");
  assert("Cell data after one click").that(puzzle.cells[0][0].data).isEqualTo({image: 'slash', returnValue: '/'});

  puzzle.controller.onMouseDown(suite.mouseEvent(x, y));
  puzzle.controller.onMouseUp(suite.mouseEvent(x, y));

  assert("Cell value after two clicks").that(puzzle.cells[0][0].getValue()).isEqualTo("\\");
  assert("Cell data after two clicks").that(puzzle.cells[0][0].data).isEqualTo({image: 'backslash', returnValue: '\\'});

  puzzle.controller.onMouseDown(suite.mouseEvent(x, y));
  puzzle.controller.onMouseUp(suite.mouseEvent(x, y));

  assert("Cell value after three clicks").that(puzzle.cells[0][0].getValue()).isNull();
  assert("Cell data after three clicks").that(puzzle.cells[0][0].data).isEqualTo({});
}),

test('Draw diagonals by drag between nodes',(suite) => {
  let puzzle = suite.showPuzzle("slalom", "4x4", {"nodes": {"a1-2": "1", "b2-2": "3"}});
  puzzle.start();

  // From the top left to the bottom right corner of the cell b1.
  suite.dragBetweenNodes(puzzle, 1, 0, 2, 1);

  assert("Cell value after drag").that(puzzle.cells[0][1].getValue()).isEqualTo("\\");
  assert("Cell data after drag").that(puzzle.cells[0][1].data).isEqualTo({image: 'backslash', returnValue: '\\'});

  // From the bottom left to the top right corner of the cell a2.
  suite.dragBetweenNodes(puzzle, 0, 2, 1, 1);

  assert("Cell value after drag in other direction").that(puzzle.cells[1][0].getValue()).isEqualTo("/");
  assert("Cell data after drag in other direction").that(puzzle.cells[1][0].data).isEqualTo({image: 'slash', returnValue: '/'});
  assert("Other cells are not changed").that(puzzle.cells[0][0].getValue()).isNull();
}),

test('Repeated drag removes the diagonal',(suite) => {
  let puzzle = suite.showPuzzle("slalom", "4x4", {"nodes": {"a1-2": "1", "b2-2": "3"}});
  puzzle.start();

  suite.dragBetweenNodes(puzzle, 1, 0, 2, 1);
  assert("Cell value after drag").that(puzzle.cells[0][1].getValue()).isEqualTo("\\");

  // The same drag in the opposite direction.
  suite.dragBetweenNodes(puzzle, 2, 1, 1, 0);
  assert("Cell value after second drag").that(puzzle.cells[0][1].getValue()).isNull();
  assert("Cell data after second drag").that(puzzle.cells[0][1].data).isEqualTo({});
}),

test('Drag along other diagonal replaces the diagonal',(suite) => {
  let puzzle = suite.showPuzzle("slalom", "4x4", {"nodes": {"a1-2": "1", "b2-2": "3"}});
  puzzle.start();

  suite.dragBetweenNodes(puzzle, 1, 0, 2, 1);
  assert("Cell value after drag").that(puzzle.cells[0][1].getValue()).isEqualTo("\\");

  // From the top right to the bottom left corner of the same cell.
  suite.dragBetweenNodes(puzzle, 2, 0, 1, 1);
  assert("Cell value after drag along other diagonal").that(puzzle.cells[0][1].getValue()).isEqualTo("/");
}),

test('Drag along the cell side does nothing',(suite) => {
  let puzzle = suite.showPuzzle("slalom", "4x4", {"nodes": {"a1-2": "1", "b2-2": "3"}});
  puzzle.start();

  // Along the border between a1 and a2.
  suite.dragBetweenNodes(puzzle, 0, 1, 1, 1);
  // Along the border between a1 and b1.
  suite.dragBetweenNodes(puzzle, 1, 0, 1, 1);

  assert("Cell a1 value").that(puzzle.cells[0][0].getValue()).isNull();
  assert("Cell b1 value").that(puzzle.cells[0][1].getValue()).isNull();
  assert("Cell a2 value").that(puzzle.cells[1][0].getValue()).isNull();
  assert("Submission data").that(puzzle.collectData()).isEqualTo({});
}),

// Data collector tests
test('Data collector',(suite) => {
  let puzzle = suite.showPuzzle("slalom", "4x4", {"nodes": {"a1-2": "1", "b2-2": "3"}});
  puzzle.start();

  let x = puzzle.size.leftGap + puzzle.size.unitSize/2;
  let y = puzzle.size.topGap + puzzle.size.unitSize/2;
  // Slash in a1 by click, backslash in b1 and slash in c3 by drag.
  puzzle.controller.onMouseDown(suite.mouseEvent(x, y));
  puzzle.controller.onMouseUp(suite.mouseEvent(x, y));
  suite.dragBetweenNodes(puzzle, 1, 0, 2, 1);
  suite.dragBetweenNodes(puzzle, 3, 2, 2, 3);

  assert("Submission data").that(puzzle.collectData()).isEqualTo({"a1": "/", "b1": "\\", "c3": "/"});
}),

test('Author data collector',(suite) => {
  let puzzle = suite.showPuzzle("slalom", "4x4");
  puzzle.edit();

  // Choose "2" for the bottom right corner of a1 and "0" for the bottom right corner of c2.
  puzzle.nodes[0][0][2].switchOnChooser(3);
  puzzle.nodes[1][2][2].switchOnChooser(1);

  assert("Node value").that(puzzle.nodes[0][0][2].getValue()).isEqualTo("2");
  assert("Node data").that(puzzle.nodes[0][0][2].data).isEqualTo({text: '2', color: puzzle.colorSchema.gridColor, textColor: "#fff", returnValue: '2'});
  assert("Puzzle data").that(puzzle.collectData()).isEqualTo({"nodes": {"a1-2": "2", "c2-2": "0"}});
}),

);
