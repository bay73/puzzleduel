snakeBelarusianTestSuite = uiTestSuite("Belarusian snake", "squarepuzzle", "squarePuzzleType",

beforeSuite((suite, cb)=> {
  // Emulates a single mouse drag through the nodes of the grid: node [0, 0] is the top left corner of the cell a1.
  suite.dragThroughNodes = function(puzzle, ...nodes) {
    let points = nodes.map(node => suite.gridPoint(puzzle, node[0], node[1]));
    puzzle.controller.onMouseDown(suite.mouseEvent(points[0]));
    points.slice(1).forEach(point => puzzle.controller.onMouseMove(suite.mouseEvent(point)));
    puzzle.controller.onMouseUp(suite.mouseEvent(points[points.length - 1]));
  };
  // Puzzle of the most of the tests: three areas, cells of the areas 1 and 3 are colored.
  //   1 1 1|2
  //       +-+
  //   1 1|2 2
  //   ---+-+
  //   3 3 3|2
  //        +-
  //   3 3 3 3
  suite.CLUES = {
    "areas": [["a1","b1","c1","a2","b2"], ["d1","c2","d2","d3"], ["a3","b3","c3","a4","b4","c4","d4"]],
    "a1": "1", "b1": "1", "c1": "1", "a2": "1", "b2": "1",
    "a3": "1", "b3": "1", "c3": "1", "a4": "1", "b4": "1", "c4": "1", "d4": "1"};
  // Colors of the snake in white and in colored cells.
  suite.SNAKE_COLOR = "#606060";
  suite.SNAKE_COLOR_IN_COLORED_CELL = "#605030";
  suite.CELL_COLOR = "tan";
  cb();
}),

// Controller definition tests
test('Solver controllers',(suite) => {
  let puzzle = suite.showPuzzle("snake_belarusian", "4x4", suite.CLUES);
  puzzle.start();

  let whiteCell = puzzle.cells[0][3];
  assert("White cell is clue").that(whiteCell.isClue).isEqualTo(false);
  assert("White cell chooser").that(whiteCell.chooserValues).isNull();
  assert("White cell click length").that(whiteCell.clickSwitch.length).isEqualTo(3);
  assert("White cell click colors").that(whiteCell.clickSwitch.map(item => item.color || null)).isEqualTo([null, suite.SNAKE_COLOR, null]);
  assert("White cell click images").that(whiteCell.clickSwitch.map(item => item.image || null)).isEqualTo([null, null, "cross"]);
  assert("White cell click values").that(whiteCell.clickSwitch.map(item => item.returnValue || null)).isEqualTo([null, "1", null]);

  let coloredCell = puzzle.cells[0][0];
  assert("Colored cell is clue").that(coloredCell.isClue).isEqualTo(true);
  assert("Colored cell color").that(coloredCell.data.color).isEqualTo(suite.CELL_COLOR);
  assert("Colored cell chooser").that(coloredCell.chooserValues).isNull();
  assert("Colored cell click length").that(coloredCell.clickSwitch.length).isEqualTo(3);
  assert("Colored cell click colors").that(coloredCell.clickSwitch.map(item => item.color || null)).isEqualTo([suite.CELL_COLOR, suite.SNAKE_COLOR_IN_COLORED_CELL, suite.CELL_COLOR]);
  assert("Colored cell click images").that(coloredCell.clickSwitch.map(item => item.image || null)).isEqualTo([null, null, "cross"]);
  assert("Colored cell click values").that(coloredCell.clickSwitch.map(item => item.returnValue || null)).isEqualTo([null, "1", null]);

  // The edge between c1 and d1 is the border of areas, the edge between a1 and b1 is not.
  assert("Area border color").that(puzzle.edges[0][2][1].data.color).isEqualTo(puzzle.colorSchema.gridColor);
  assert("Area border chooser").that(puzzle.edges[0][2][1].chooserValues).isNull();
  assert("Area border click").that(puzzle.edges[0][2][1].clickSwitch).isNull();
  assert("Area border drag").that(puzzle.edges[0][2][1].dragSwitch).isNull();
  assert("Inner edge color").that(puzzle.edges[0][0][1].data.color).isNull();
  assert("Inner edge click").that(puzzle.edges[0][0][1].clickSwitch).isNull();
  assert("Inner edge drag").that(puzzle.edges[0][0][1].dragSwitch).isNull();
  assert("Node drag processor").that(puzzle.nodes[0][0][2].dragProcessor).isNull();
}),

test('Author controllers',(suite) => {
  let puzzle = suite.showPuzzle("snake_belarusian", "4x4");
  puzzle.edit();

  assert("Cell chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("Cell click").that(puzzle.cells[0][0].clickSwitch).containsExactly([{}, {color: suite.CELL_COLOR, returnValue: '1'}]);
  assert("Inner edge chooser").that(puzzle.edges[0][0][1].chooserValues).isNull();
  assert("Inner edge click").that(puzzle.edges[0][0][1].clickSwitch).containsExactly([{}, {color: puzzle.colorSchema.gridColor, returnValue: '1'}]);
  assert("Inner edge drag").that(puzzle.edges[0][0][1].dragSwitch).containsExactly([{}, {color: puzzle.colorSchema.gridColor, returnValue: '1'}]);
  // The top side of a1 is the border of the grid.
  assert("Grid border click").that(puzzle.edges[0][0][0].clickSwitch).isNull();
  assert("Grid border drag").that(puzzle.edges[0][0][0].dragSwitch).isNull();
  assert("Node chooser").that(puzzle.nodes[0][0][2].chooserValues).isNull();
  assert("Node click").that(puzzle.nodes[0][0][2].clickSwitch).isNull();
  assert("Node drag processor").that(puzzle.nodes[0][0][2].dragProcessor).isNotNull();
}),

// Mouse processing tests
test('Process clicks to white cell',(suite) => {
  let puzzle = suite.showPuzzle("snake_belarusian", "4x4", suite.CLUES);
  puzzle.start();

  let cell = puzzle.cells[0][3];

  assert("Cell value before click").that(cell.getValue()).isNull();

  suite.cellClick(puzzle, "d1");

  assert("Cell value after one click").that(cell.getValue()).isEqualTo("1");
  assert("Cell color after one click").that(cell.data.color).isEqualTo(suite.SNAKE_COLOR);
  assert("Cell image after one click").that(cell.data.image).isNull();
  assert("Submission data after one click").that(puzzle.collectData()).isEqualTo({"d1": "1"});

  suite.cellClick(puzzle, "d1");

  assert("Cell value after two clicks").that(cell.getValue()).isNull();
  assert("Cell color after two clicks").that(cell.data.color).isNull();
  assert("Cell image after two clicks").that(cell.data.image).isEqualTo("cross");
  assert("Cross is not submitted").that(puzzle.collectData()).isEqualTo({});

  suite.cellClick(puzzle, "d1");

  assert("Cell value after three clicks").that(cell.getValue()).isNull();
  assert("Cell color after three clicks").that(cell.data.color).isNull();
  assert("Cell image after three clicks").that(cell.data.image).isNull();
}),

test('Process clicks to colored cell',(suite) => {
  let puzzle = suite.showPuzzle("snake_belarusian", "4x4", suite.CLUES);
  puzzle.start();

  let cell = puzzle.cells[0][0];

  assert("Cell value before click").that(cell.getValue()).isNull();
  assert("Colored cells are not submitted").that(puzzle.collectData()).isEqualTo({});

  suite.cellClick(puzzle, "a1");

  assert("Cell value after one click").that(cell.getValue()).isEqualTo("1");
  assert("Cell color after one click").that(cell.data.color).isEqualTo(suite.SNAKE_COLOR_IN_COLORED_CELL);
  assert("Cell image after one click").that(cell.data.image).isNull();
  assert("Submission data after one click").that(puzzle.collectData()).isEqualTo({"a1": "1"});

  suite.cellClick(puzzle, "a1");

  // The cell keeps its color under the cross.
  assert("Cell value after two clicks").that(cell.getValue()).isNull();
  assert("Cell color after two clicks").that(cell.data.color).isEqualTo(suite.CELL_COLOR);
  assert("Cell image after two clicks").that(cell.data.image).isEqualTo("cross");
  assert("Cross is not submitted").that(puzzle.collectData()).isEqualTo({});

  suite.cellClick(puzzle, "a1");

  assert("Cell value after three clicks").that(cell.getValue()).isNull();
  assert("Cell color after three clicks").that(cell.data.color).isEqualTo(suite.CELL_COLOR);
  assert("Cell image after three clicks").that(cell.data.image).isNull();
}),

test('Solver can not change area borders',(suite) => {
  let puzzle = suite.showPuzzle("snake_belarusian", "4x4", suite.CLUES);
  puzzle.start();

  // Clicks to the border between c1 and d1 and to the edge between a1 and b1.
  suite.edgeClick(puzzle, "c1-1");
  suite.edgeClick(puzzle, "a1-1");
  // Drag along the edge between a3 and a4 and along the border between a2 and a3.
  suite.dragThroughNodes(puzzle, [0, 3], [1, 3]);
  suite.dragThroughNodes(puzzle, [0, 2], [1, 2]);

  assert("Area border color after click").that(puzzle.edges[0][2][1].data.color).isEqualTo(puzzle.colorSchema.gridColor);
  assert("Inner edge color after click").that(puzzle.edges[0][0][1].data.color).isNull();
  assert("Inner edge color after drag").that(puzzle.edges[2][0][2].data.color).isNull();
  assert("Area border color after drag").that(puzzle.edges[1][0][2].data.color).isEqualTo(puzzle.colorSchema.gridColor);
  assert("Submission data").that(puzzle.collectData()).isEqualTo({});
}),

// Data collector tests
test('Data collector',(suite) => {
  let puzzle = suite.showPuzzle("snake_belarusian", "4x4", suite.CLUES);
  puzzle.start();

  // The snake a1-d1-d4-b4 has three cells in each area:
  //   # # # #
  //   . . . #
  //   . . . #
  //   . # # #
  ["a1", "b1", "c1", "d1", "d2", "d3", "d4", "c4", "b4"].forEach(cell => suite.cellClick(puzzle, cell));
  // Crosses in a white and in a colored cell are not submitted.
  suite.cellClick(puzzle, "c2");
  suite.cellClick(puzzle, "c2");
  suite.cellClick(puzzle, "a2");
  suite.cellClick(puzzle, "a2");

  assert("Submission data").that(puzzle.collectData()).isEqualTo({"a1": "1", "b1": "1", "c1": "1", "d1": "1", "d2": "1", "d3": "1", "d4": "1", "c4": "1", "b4": "1"});
}),

test('Process clicks to cell for author',(suite) => {
  let puzzle = suite.showPuzzle("snake_belarusian", "4x4");
  puzzle.edit();

  let cell = puzzle.cells[0][0];

  suite.cellClick(puzzle, "a1");

  assert("Cell value after one click").that(cell.getValue()).isEqualTo("1");
  assert("Cell color after one click").that(cell.data.color).isEqualTo(suite.CELL_COLOR);
  assert("Puzzle data after one click").that(puzzle.collectData()).isEqualTo({"a1": "1"});

  suite.cellClick(puzzle, "a1");

  assert("Cell value after two clicks").that(cell.getValue()).isNull();
  assert("Cell color after two clicks").that(cell.data.color).isNull();
  assert("Puzzle data after two clicks").that(puzzle.collectData()).isEqualTo({});
}),

test('Process clicks to edge for author',(suite) => {
  let puzzle = suite.showPuzzle("snake_belarusian", "2x2");
  puzzle.edit();

  let edge = puzzle.edges[0][0][1];

  assert("Edge value before click").that(edge.getValue()).isNull();

  // The edge between a1 and b1.
  suite.edgeClick(puzzle, "a1-1");

  assert("Edge value after click").that(edge.getValue()).isEqualTo("1");
  assert("Edge color after click").that(edge.data.color).isEqualTo(puzzle.colorSchema.gridColor);
  assert("The same edge from the cell b1").that(puzzle.edges[0][1][3].getValue()).isEqualTo("1");
  // The border does not split the grid yet.
  assert("Puzzle data after click").that(puzzle.collectData()).isEqualTo({"areas": [["a1", "b1", "a2", "b2"]]});

  // The edge between a2 and b2.
  suite.edgeClick(puzzle, "a2-1");

  assert("Puzzle data with two areas").that(puzzle.collectData()).isEqualTo({"areas": [["a1", "a2"], ["b1", "b2"]]});

  suite.edgeClick(puzzle, "a1-1");

  assert("Edge value after second click").that(edge.getValue()).isNull();
  assert("Edge color after second click").that(edge.data.color).isNull();
  assert("Puzzle data after second click").that(puzzle.collectData()).isEqualTo({"areas": [["a1", "b1", "a2", "b2"]]});
}),

test('Draw area borders by drag between nodes for author',(suite) => {
  let puzzle = suite.showPuzzle("snake_belarusian", "4x4");
  puzzle.edit();

  let point = suite.gridPoint(puzzle, 2, 0);

  // From the top of the grid down along the line between the columns b and c.
  puzzle.controller.onMouseDown(suite.mouseEvent(point));
  point.down();
  puzzle.controller.onMouseMove(suite.mouseEvent(point));

  assert("First edge value after drag").that(puzzle.edges[0][1][1].getValue()).isEqualTo("1");
  assert("First edge color after drag").that(puzzle.edges[0][1][1].data.color).isEqualTo(puzzle.colorSchema.gridColor);
  assert("Second edge value before drag").that(puzzle.edges[1][1][1].getValue()).isNull();

  // One mouse move to the bottom of the grid passes over two nodes.
  point.down(3);
  puzzle.controller.onMouseMove(suite.mouseEvent(point));
  puzzle.controller.onMouseUp(suite.mouseEvent(point));

  assert("Second edge value after drag").that(puzzle.edges[1][1][1].getValue()).isEqualTo("1");
  assert("Third edge value after drag").that(puzzle.edges[2][1][1].getValue()).isEqualTo("1");
  assert("Fourth edge value after drag").that(puzzle.edges[3][1][1].getValue()).isEqualTo("1");
  assert("Puzzle data after drag").that(puzzle.collectData()).isEqualTo(
    {"areas": [["a1", "b1", "a2", "b2", "a3", "b3", "a4", "b4"], ["c1", "d1", "c2", "d2", "c3", "d3", "c4", "d4"]]});

  // Second drag over the edge removes the border.
  suite.dragThroughNodes(puzzle, [2, 2], [2, 1]);

  assert("Second edge value after second drag").that(puzzle.edges[1][1][1].getValue()).isNull();
  assert("First edge value after second drag").that(puzzle.edges[0][1][1].getValue()).isEqualTo("1");
}),

test('Author can not change border of the grid',(suite) => {
  let puzzle = suite.showPuzzle("snake_belarusian", "4x4");
  puzzle.edit();

  // The top side of a1.
  suite.edgeClick(puzzle, "a1-0");
  suite.dragThroughNodes(puzzle, [0, 0], [1, 0]);
  // The left side of a2.
  suite.dragThroughNodes(puzzle, [0, 1], [0, 2]);

  assert("Top border value").that(puzzle.edges[0][0][0].getValue()).isNull();
  assert("Top border color").that(puzzle.edges[0][0][0].data.color).isEqualTo(puzzle.colorSchema.gridColor);
  assert("Left border value").that(puzzle.edges[1][0][3].getValue()).isNull();
  assert("Left border color").that(puzzle.edges[1][0][3].data.color).isEqualTo(puzzle.colorSchema.gridColor);
  assert("Puzzle data").that(puzzle.collectData()).isEqualTo({});
}),

test('Author data collector',(suite) => {
  let puzzle = suite.showPuzzle("snake_belarusian", "4x4");
  puzzle.edit();

  // Border of the area d1-c2-d2-d3 and the border between the rows 2 and 3 to the left of it (see suite.CLUES).
  suite.dragThroughNodes(puzzle, [3, 0], [3, 1], [2, 1], [2, 2], [3, 2], [3, 3], [4, 3]);
  suite.dragThroughNodes(puzzle, [2, 2], [1, 2], [0, 2]);

  assert("Areas").that(puzzle.collectData()).isEqualTo(
    {"areas": [["a1","b1","c1","a2","b2"], ["d1","c2","d2","d3"], ["a3","b3","c3","a4","b4","c4","d4"]]});

  // Colored cells of the first and the third areas.
  ["a1", "b1", "c1", "a2", "b2", "a3", "b3", "c3", "a4", "b4", "c4", "d4"].forEach(cell => suite.cellClick(puzzle, cell));

  assert("Puzzle data").that(puzzle.collectData()).isEqualTo(suite.CLUES);

  // Without the border between c1 and d1 the first two areas are joined.
  suite.edgeClick(puzzle, "c1-1");

  assert("Areas after removing a border").that(puzzle.collectData().areas).isEqualTo(
    [["a1","b1","c1","d1","a2","b2","c2","d2","d3"], ["a3","b3","c3","a4","b4","c4","d4"]]);
}),

);
