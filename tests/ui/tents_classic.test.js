tentsClassicTestSuite = uiTestSuite("Tents", "squarepuzzle", "squarePuzzleType",

beforeSuite((suite, cb)=> {
  // Emulates one mouse drag which goes through the centers of the given cells
  // (it draws connectors between the cells).
  suite.dragThrough = function(puzzle, cells) {
    puzzle.controller.onMouseDown(suite.mouseEvent(suite.cellPoint(puzzle, cells[0])));
    for (let i = 1; i < cells.length; i++) {
      puzzle.controller.onMouseMove(suite.mouseEvent(suite.cellPoint(puzzle, cells[i])));
    }
    puzzle.controller.onMouseUp(suite.mouseEvent(suite.cellPoint(puzzle, cells[cells.length - 1])));
  };
  // Emulates one mouse drag along the grid lines through the given nodes.
  // Node is a pair [col, row], node [0, 0] is the top left corner of the grid.
  suite.dragAlongNodes = function(puzzle, nodes) {
    let points = nodes.map(node => suite.gridPoint(puzzle, node[0], node[1]));
    puzzle.controller.onMouseDown(suite.mouseEvent(points[0]));
    for (let i = 1; i < points.length; i++) {
      puzzle.controller.onMouseMove(suite.mouseEvent(points[i]));
    }
    puzzle.controller.onMouseUp(suite.mouseEvent(points[points.length - 1]));
  };
  // Puzzle from the checker tests: T is a tree, numbers below and to the right are the outer clues
  // (number of tents in the column and in the row).
  //     a b c d
  //  1  . T . .  2
  //  2  . . . T  0
  //  3  . T . .  0
  //  4  . . . .  1
  //     1 1 0 1
  suite.CLUES = {"b1": "tree1", "d2": "tree2", "b3": "tree3", "bottom": ["1", "1", "0", "1"], "right": ["2", "0", "0", "1"]};
  cb();
}),

// Controller definition tests
test('Solver controllers',(suite) => {
  let puzzle = suite.showPuzzle("tents_classic", "4x4", suite.CLUES);
  puzzle.start();

  assert("Empty cell chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("Empty cell click").that(puzzle.cells[0][0].clickSwitch).containsExactly([{}, {image: 'tent', returnValue: '1'}, {image: 'cross'}]);
  assert("Empty cell drag processor").that(puzzle.cells[0][0].dragProcessor).isNotNull();
  assert("Tree chooser").that(puzzle.cells[0][1].chooserValues).isNull();
  assert("Tree click").that(puzzle.cells[0][1].clickSwitch).containsExactly([{image: 'tree1'}, {image: 'tree1_circle'}]);
  assert("Tree drag processor").that(puzzle.cells[0][1].dragProcessor).isNotNull();
  assert("Other tree click").that(puzzle.cells[2][1].clickSwitch).containsExactly([{image: 'tree3'}, {image: 'tree3_circle'}]);
  assert("Bottom clue chooser").that(puzzle.bottom[0].chooserValues).isNull();
  assert("Bottom clue click").that(puzzle.bottom[0].clickSwitch).containsExactly([{text: '1'}, {text: '1', image: 'white_circle'}]);
  assert("Right clue chooser").that(puzzle.right[0].chooserValues).isNull();
  assert("Right clue click").that(puzzle.right[0].clickSwitch).containsExactly([{text: '2'}, {text: '2', image: 'white_circle'}]);
  // Lines between the cells (to connect tent with its tree) and along the edges are auxiliary, they are not submitted.
  assert("Horizontal connector drag").that(puzzle.connectors[0][0]['h'].dragSwitch).containsExactly([{}, {color: puzzle.colorSchema.lineColor}]);
  assert("Vertical connector drag").that(puzzle.connectors[0][0]['v'].dragSwitch).containsExactly([{}, {color: puzzle.colorSchema.lineColor}]);
  assert("Edge chooser").that(puzzle.edges[0][0][1].chooserValues).isNull();
  assert("Edge click").that(puzzle.edges[0][0][1].clickSwitch).isNull();
  assert("Edge drag").that(puzzle.edges[0][0][1].dragSwitch).containsExactly([{}, {color: puzzle.colorSchema.lineColor}]);
  assert("Node click").that(puzzle.nodes[0][0][2].clickSwitch).isNull();
  assert("Node drag processor").that(puzzle.nodes[0][0][2].dragProcessor).isNotNull();
}),

test('Author controllers',(suite) => {
  let puzzle = suite.showPuzzle("tents_classic", "4x4");
  puzzle.edit();

  let numberItem = function(number) {
    return {text: number, returnValue: number};
  }
  assert("Cell chooser").that(puzzle.cells[0][0].chooserValues).containsExactly(
    [{}, {image: 'tree1', returnValue: 'tree1'}, {image: 'tree2', returnValue: 'tree2'}, {image: 'tree3', returnValue: 'tree3'}]);
  assert("Cell click").that(puzzle.cells[0][0].clickSwitch).isNull();
  assert("Cell drag processor").that(puzzle.cells[0][0].dragProcessor).isNull();
  // Outer clue is a number from 0 to the size of the grid.
  assert("Bottom clue chooser").that(puzzle.bottom[0].chooserValues).containsExactly(
    [{}, numberItem('0'), numberItem('1'), numberItem('2'), numberItem('3'), numberItem('4')]);
  assert("Bottom clue click").that(puzzle.bottom[0].clickSwitch).isNull();
  assert("Right clue chooser").that(puzzle.right[3].chooserValues).containsExactly(
    [{}, numberItem('0'), numberItem('1'), numberItem('2'), numberItem('3'), numberItem('4')]);
  assert("Right clue click").that(puzzle.right[3].clickSwitch).isNull();
  assert("Edge click").that(puzzle.edges[0][0][1].clickSwitch).isNull();
  assert("Edge drag").that(puzzle.edges[0][0][1].dragSwitch).isNull();
}),

// Clues display tests
test('Show clues',(suite) => {
  let puzzle = suite.showPuzzle("tents_classic", "4x4", suite.CLUES);
  puzzle.start();

  assert("Tree in b1").that(puzzle.cells[0][1].data).isEqualTo({image: 'tree1'});
  assert("Tree in d2").that(puzzle.cells[1][3].data).isEqualTo({image: 'tree2'});
  assert("Tree in b3").that(puzzle.cells[2][1].data).isEqualTo({image: 'tree3'});
  assert("Tree is not a part of the solution").that(puzzle.cells[0][1].getValue()).isNull();
  assert("Number of bottom clues").that(puzzle.bottom.length).isEqualTo(4);
  assert("Number of right clues").that(puzzle.right.length).isEqualTo(4);
  assert("Clue below column a").that(puzzle.bottom[0].data).isEqualTo({text: '1'});
  assert("Clue below column c").that(puzzle.bottom[2].data).isEqualTo({text: '0'});
  assert("Clue to the right of row 1").that(puzzle.right[0].data).isEqualTo({text: '2'});
  assert("Clue to the right of row 4").that(puzzle.right[3].data).isEqualTo({text: '1'});

  let texts = $(suite.GRID_SELECTOR + " text").map((i, element) => $(element).text()).get();
  assert("Texts in the grid").that(texts).isEqualTo(["1", "1", "0", "1", "2", "0", "0", "1"]);
}),

// Mouse processing tests
test('Process clicks to empty cell',(suite) => {
  let puzzle = suite.showPuzzle("tents_classic", "4x4", suite.CLUES);
  puzzle.start();

  assert("Cell value before click").that(puzzle.cells[0][0].getValue()).isNull();
  assert("Cell data before click").that(puzzle.cells[0][0].data).isEqualTo({});

  suite.cellClick(puzzle, "a1");

  assert("Cell value after one click").that(puzzle.cells[0][0].getValue()).isEqualTo("1");
  assert("Cell data after one click").that(puzzle.cells[0][0].data).isEqualTo({image: 'tent', returnValue: '1'});

  suite.cellClick(puzzle, "a1");

  assert("Cell value after two clicks").that(puzzle.cells[0][0].getValue()).isNull();
  assert("Cell data after two clicks").that(puzzle.cells[0][0].data).isEqualTo({image: 'cross'});

  suite.cellClick(puzzle, "a1");

  assert("Cell value after three clicks").that(puzzle.cells[0][0].getValue()).isNull();
  assert("Cell data after three clicks").that(puzzle.cells[0][0].data).isEqualTo({});
  assert("Tree is not changed").that(puzzle.cells[0][1].data).isEqualTo({image: 'tree1'});
  assert("Neighbour cell is not changed").that(puzzle.cells[1][0].data).isEqualTo({});
}),

test('Mark tree by click',(suite) => {
  let puzzle = suite.showPuzzle("tents_classic", "4x4", suite.CLUES);
  puzzle.start();

  // Tree is still shown, but with the circle (for the trees which already have tents).
  suite.cellClick(puzzle, "b1");

  assert("Tree data after click").that(puzzle.cells[0][1].data).isEqualTo({image: 'tree1_circle'});
  assert("Tree value after click").that(puzzle.cells[0][1].getValue()).isNull();
  assert("Other tree").that(puzzle.cells[1][3].data).isEqualTo({image: 'tree2'});

  suite.cellClick(puzzle, "d2");

  assert("Other tree data after click").that(puzzle.cells[1][3].data).isEqualTo({image: 'tree2_circle'});

  suite.cellClick(puzzle, "b1");

  assert("Tree data after two clicks").that(puzzle.cells[0][1].data).isEqualTo({image: 'tree1'});
  assert("Tree value after two clicks").that(puzzle.cells[0][1].getValue()).isNull();
}),

test('Mark outer clues by click',(suite) => {
  let puzzle = suite.showPuzzle("tents_classic", "4x4", suite.CLUES);
  puzzle.start();

  // Clue below the column c.
  suite.click(puzzle, suite.cellPoint(puzzle, 2, 4));

  assert("Bottom clue data after click").that(puzzle.bottom[2].data).isEqualTo({text: '0', image: 'white_circle'});
  assert("Bottom clue value after click").that(puzzle.bottom[2].getValue()).isNull();
  assert("Next bottom clue").that(puzzle.bottom[3].data).isEqualTo({text: '1'});

  suite.click(puzzle, suite.cellPoint(puzzle, 2, 4));

  assert("Bottom clue data after two clicks").that(puzzle.bottom[2].data).isEqualTo({text: '0'});

  // Clue to the right of the row 1.
  suite.click(puzzle, suite.cellPoint(puzzle, 4, 0));

  assert("Right clue data after click").that(puzzle.right[0].data).isEqualTo({text: '2', image: 'white_circle'});

  suite.click(puzzle, suite.cellPoint(puzzle, 4, 0));

  assert("Right clue data after two clicks").that(puzzle.right[0].data).isEqualTo({text: '2'});
}),

test('Connect tent and tree by drag',(suite) => {
  let puzzle = suite.showPuzzle("tents_classic", "4x4", suite.CLUES);
  puzzle.start();

  suite.cellClick(puzzle, "a1");

  assert("Connector before drag").that(puzzle.connectors[0][0]['h'].data).isEqualTo({});

  // Line from the tent a1 to the tree b1.
  suite.dragThrough(puzzle, ["a1", "b1"]);

  assert("Connector data after drag").that(puzzle.connectors[0][0]['h'].data).isEqualTo({color: puzzle.colorSchema.lineColor});
  assert("Connector value after drag").that(puzzle.connectors[0][0]['h'].getValue()).isNull();
  assert("Other connector of a1").that(puzzle.connectors[0][0]['v'].data).isEqualTo({});
  assert("Tent after drag").that(puzzle.cells[0][0].data).isEqualTo({image: 'tent', returnValue: '1'});
  assert("Tree after drag").that(puzzle.cells[0][1].data).isEqualTo({image: 'tree1'});

  // The second drag removes the line.
  suite.dragThrough(puzzle, ["b1", "a1"]);

  assert("Connector data after the second drag").that(puzzle.connectors[0][0]['h'].data).isEqualTo({});

  // Line from the tree d2 up to d1 and line from the tree b3 down to b4.
  suite.dragThrough(puzzle, ["d2", "d1"]);
  suite.dragThrough(puzzle, ["b3", "b4"]);

  assert("Connector between d1 and d2").that(puzzle.connectors[0][3]['v'].data).isEqualTo({color: puzzle.colorSchema.lineColor});
  assert("Connector between b3 and b4").that(puzzle.connectors[2][1]['v'].data).isEqualTo({color: puzzle.colorSchema.lineColor});
  assert("Empty cell d1 after drag").that(puzzle.cells[0][3].data).isEqualTo({});
}),

test('Draw long line by drag',(suite) => {
  let puzzle = suite.showPuzzle("tents_classic", "4x4", suite.CLUES);
  puzzle.start();

  // One drag through the cells a4, b4, c4 and c3.
  suite.dragThrough(puzzle, ["a4", "b4", "c4", "c3"]);

  assert("Connector between a4 and b4").that(puzzle.connectors[3][0]['h'].data).isEqualTo({color: puzzle.colorSchema.lineColor});
  assert("Connector between b4 and c4").that(puzzle.connectors[3][1]['h'].data).isEqualTo({color: puzzle.colorSchema.lineColor});
  assert("Connector between c3 and c4").that(puzzle.connectors[2][2]['v'].data).isEqualTo({color: puzzle.colorSchema.lineColor});
  assert("Connector between c4 and d4").that(puzzle.connectors[3][2]['h'].data).isEqualTo({});
  assert("Connector between b3 and b4").that(puzzle.connectors[2][1]['v'].data).isEqualTo({});
  assert("Cells of the line").that(
    [puzzle.cells[3][0].data, puzzle.cells[3][1].data, puzzle.cells[3][2].data, puzzle.cells[2][2].data]
  ).isEqualTo([{}, {}, {}, {}]);
}),

test('Draw line along edges by drag',(suite) => {
  let puzzle = suite.showPuzzle("tents_classic", "4x4", suite.CLUES);
  puzzle.start();

  assert("Edge before drag").that(puzzle.edges[1][0][2].data).isEqualTo({});

  // Drag along the bottom side of a2, then along the right sides of a3 and a4.
  suite.dragAlongNodes(puzzle, [[0, 2], [1, 2], [1, 3], [1, 4]]);

  assert("Bottom edge of a2 after drag").that(puzzle.edges[1][0][2].data).isEqualTo({color: puzzle.colorSchema.lineColor});
  assert("Bottom edge of a2 value").that(puzzle.edges[1][0][2].getValue()).isNull();
  assert("The same edge from the cell a3").that(puzzle.edges[2][0][0].data).isEqualTo({color: puzzle.colorSchema.lineColor});
  assert("Right edge of a3 after drag").that(puzzle.edges[2][0][1].data).isEqualTo({color: puzzle.colorSchema.lineColor});
  assert("Right edge of a4 after drag").that(puzzle.edges[3][0][1].data).isEqualTo({color: puzzle.colorSchema.lineColor});
  assert("Bottom edge of b2 after drag").that(puzzle.edges[1][1][2].data).isEqualTo({});
  assert("Cells near the line").that(
    [puzzle.cells[1][0].data, puzzle.cells[2][0].data, puzzle.cells[3][0].data, puzzle.cells[3][1].data]
  ).isEqualTo([{}, {}, {}, {}]);

  // The second drag removes the line.
  suite.dragAlongNodes(puzzle, [[1, 3], [1, 4]]);

  assert("Right edge of a4 after the second drag").that(puzzle.edges[3][0][1].data).isEqualTo({});
  assert("Right edge of a3 after the second drag").that(puzzle.edges[2][0][1].data).isEqualTo({color: puzzle.colorSchema.lineColor});

  // Click doesn't change the edge.
  suite.edgeClick(puzzle, "c2-2");

  assert("Edge after click").that(puzzle.edges[1][2][2].data).isEqualTo({});
}),

test('Choose clue in author mode',(suite) => {
  let puzzle = suite.showPuzzle("tents_classic", "4x4");
  puzzle.edit();

  assert("Chooser before click").that(puzzle.controller.chooserBuilder.chooserElements).isEmptyArray();

  suite.cellClick(puzzle, "b2");

  assert("Chooser after click").that(puzzle.controller.chooserBuilder.chooserElements).isNonEmptyArray();
  assert("Chooser is connected to the cell").that(puzzle.controller.chooserBuilder.element == puzzle.cells[1][1]).isEqualTo(true);
  assert("Cell data after click").that(puzzle.cells[1][1].data).isEqualTo({});

  // Three kinds of trees.
  puzzle.cells[1][1].switchOnChooser(1);

  assert("The first tree value").that(puzzle.cells[1][1].getValue()).isEqualTo('tree1');
  assert("The first tree data").that(puzzle.cells[1][1].data).isEqualTo({image: 'tree1', returnValue: 'tree1'});

  puzzle.cells[1][1].switchOnChooser(3);

  assert("The third tree value").that(puzzle.cells[1][1].getValue()).isEqualTo('tree3');
  assert("The third tree data").that(puzzle.cells[1][1].data).isEqualTo({image: 'tree3', returnValue: 'tree3'});

  puzzle.cells[1][1].switchOnChooser(0);

  assert("Value after clean up").that(puzzle.cells[1][1].getValue()).isNull();
  assert("Data after clean up").that(puzzle.cells[1][1].data).isEqualTo({});

  // Clue below the column b: the fourth item of the chooser is "2".
  suite.click(puzzle, suite.cellPoint(puzzle, 1, 4));

  assert("Chooser is connected to the outer clue").that(puzzle.controller.chooserBuilder.element == puzzle.bottom[1]).isEqualTo(true);

  puzzle.bottom[1].switchOnChooser(3);

  assert("Outer clue value").that(puzzle.bottom[1].getValue()).isEqualTo('2');
  assert("Outer clue data").that(puzzle.bottom[1].data).isEqualTo({text: '2', returnValue: '2'});
}),

// Data collector tests
test('Data collector',(suite) => {
  let puzzle = suite.showPuzzle("tents_classic", "4x4", suite.CLUES);
  puzzle.start();

  assert("Submission data for the empty grid").that(puzzle.collectData()).isEqualTo({});

  // Solution from the checker tests (A is a tent):
  //     a b c d
  //  1  A T . A  2
  //  2  . . . T  0
  //  3  . T . .  0
  //  4  . A . .  1
  //     1 1 0 1
  suite.cellClick(puzzle, "a1");
  suite.cellClick(puzzle, "d1");
  suite.cellClick(puzzle, "b4");

  // Auxiliary marks are not submitted: crosses, lines between tents and trees, line along the edge,
  // circles at the trees and at the outer clues.
  suite.cellClick(puzzle, "c1");
  suite.cellClick(puzzle, "c1");
  suite.cellClick(puzzle, "a3");
  suite.cellClick(puzzle, "a3");
  suite.dragThrough(puzzle, ["a1", "b1"]);
  suite.dragThrough(puzzle, ["d1", "d2"]);
  suite.dragThrough(puzzle, ["b4", "b3"]);
  suite.dragAlongNodes(puzzle, [[0, 2], [1, 2], [2, 2]]);
  suite.cellClick(puzzle, "b1");
  suite.cellClick(puzzle, "d2");
  suite.cellClick(puzzle, "b3");
  suite.click(puzzle, suite.cellPoint(puzzle, 2, 4));
  suite.click(puzzle, suite.cellPoint(puzzle, 4, 0));

  assert("Submission data").that(puzzle.collectData()).isEqualTo({"a1": "1", "d1": "1", "b4": "1"});
}),

test('Author data collector',(suite) => {
  let puzzle = suite.showPuzzle("tents_classic", "4x4");
  puzzle.edit();

  assert("Data of the empty puzzle").that(puzzle.collectData()).isEqualTo({});

  // Clues from the checker tests: item N of the cell chooser is the tree of the kind N,
  // item N+1 of the outer clue chooser is the number N.
  puzzle.cells[0][1].switchOnChooser(1);
  puzzle.cells[1][3].switchOnChooser(2);
  puzzle.cells[2][1].switchOnChooser(3);
  puzzle.bottom[0].switchOnChooser(2);
  puzzle.bottom[1].switchOnChooser(2);
  puzzle.bottom[2].switchOnChooser(1);
  puzzle.bottom[3].switchOnChooser(2);
  puzzle.right[0].switchOnChooser(3);
  puzzle.right[1].switchOnChooser(1);
  puzzle.right[2].switchOnChooser(1);
  puzzle.right[3].switchOnChooser(2);

  assert("Puzzle data").that(puzzle.collectData()).isEqualTo(suite.CLUES);

  // Move the tree from b3 to c3 (as the tree of the first kind), change clue for the column d to 4 and for the row 2 to 3.
  puzzle.cells[2][1].switchOnChooser(0);
  puzzle.cells[2][2].switchOnChooser(1);
  puzzle.bottom[3].switchOnChooser(5);
  puzzle.right[1].switchOnChooser(4);

  assert("Puzzle data after changes").that(puzzle.collectData()).isEqualTo(
    {"b1": "tree1", "d2": "tree2", "c3": "tree1", "bottom": ["1", "1", "0", "4"], "right": ["2", "3", "0", "1"]});
}),

test('Author data collector for existing puzzle',(suite) => {
  let puzzle = suite.showPuzzle("tents_classic", "4x4", suite.CLUES);
  puzzle.edit();

  assert("Loaded tree").that(puzzle.cells[0][1].getValue()).isEqualTo('tree1');
  assert("Loaded bottom clue").that(puzzle.bottom[2].getValue()).isEqualTo('0');
  assert("Loaded right clue").that(puzzle.right[0].getValue()).isEqualTo('2');
  assert("Puzzle data").that(puzzle.collectData()).isEqualTo(suite.CLUES);
}),

);
