ringRingNestedTestSuite = uiTestSuite("Ring-Ring Nested", "squarepuzzle", "squarePuzzleType",

beforeSuite((suite, cb)=> {
  // Emulates a single mouse drag through the centers of the given cells (it draws a line along the path).
  suite.drawLine = function(puzzle, ...cells) {
    let points = cells.map(cell => suite.cellPoint(puzzle, cell));
    puzzle.controller.onMouseDown(suite.mouseEvent(points[0]));
    points.slice(1).forEach(point => puzzle.controller.onMouseMove(suite.mouseEvent(point)));
    puzzle.controller.onMouseUp(suite.mouseEvent(points[points.length - 1]));
  };
  cb();
}),

// Grid of the most of the tests: black cells (#) and clues in the nodes of the grid
// ("a1-2" is the bottom right corner of the cell a1).
//   # # . . .
//     0   1
//   . . . . .
//     1   2
//   . . . . .
//
//   # # . . .

// Controller definition tests
test('Solver controllers',(suite) => {
  let puzzle = suite.showPuzzle("ring_ring_nested", "5x4", {"a1": "black", "b1": "black", "a4": "black", "b4": "black", "nodes": {"a1-2": "0", "c1-2": "1", "a2-2": "1", "c2-2": "2"}});
  puzzle.start();

  assert("Empty cell chooser").that(puzzle.cells[2][2].chooserValues).isNull();
  assert("Empty cell click").that(puzzle.cells[2][2].clickSwitch).isNull();
  assert("Empty cell drag processor").that(puzzle.cells[2][2].dragProcessor).isNotNull();
  assert("Black cell data").that(puzzle.cells[0][0].data).isEqualTo({color: puzzle.colorSchema.gridColor});
  assert("Black cell chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("Black cell click").that(puzzle.cells[0][0].clickSwitch).isNull();
  assert("Black cell drag processor").that(puzzle.cells[0][0].dragProcessor).isNotNull();
  let clueNode = {text: '0', color: puzzle.colorSchema.gridColor, textColor: '#fff'};
  assert("Clue node data").that(puzzle.nodes[0][0][2].data).isEqualTo(clueNode);
  assert("Clue node chooser").that(puzzle.nodes[0][0][2].chooserValues).isNull();
  assert("Clue node click").that(puzzle.nodes[0][0][2].clickSwitch).containsExactly([clueNode, {text: '0', color: puzzle.colorSchema.lightGreyColor, textColor: '#fff'}]);
  // Each rectangle is at least 2x2, so no more than 2 nested rectangles fit into the grid 5x4.
  let noteItem = number => ({text: number, color: puzzle.colorSchema.lightGreyColor});
  assert("Empty node chooser").that(puzzle.nodes[0][1][2].chooserValues).isNull();
  assert("Empty node click").that(puzzle.nodes[0][1][2].clickSwitch).containsExactly([{}, noteItem('0'), noteItem('1'), noteItem('2')]);
  assert("Edge chooser").that(puzzle.edges[1][2][2].chooserValues).isNull();
  assert("Edge click").that(puzzle.edges[1][2][2].clickSwitch).containsExactly([{}, {image: 'cross'}]);
  assert("Edge drag").that(puzzle.edges[1][2][2].dragSwitch).isNull();
  assert("Connector chooser").that(puzzle.connectors[1][2]['v'].chooserValues).isNull();
  assert("Connector click").that(puzzle.connectors[1][2]['v'].clickSwitch).isNull();
  assert("Connector drag").that(puzzle.connectors[1][2]['v'].dragSwitch).containsExactly([{}, {color: puzzle.colorSchema.lineColor, returnValue: '1'}]);
}),

test('Author controllers',(suite) => {
  let puzzle = suite.showPuzzle("ring_ring_nested", "5x4");
  puzzle.edit();

  assert("Cell chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("Cell click").that(puzzle.cells[0][0].clickSwitch).containsExactly([{}, {color: puzzle.colorSchema.gridColor, returnValue: 'black'}]);
  let numberItem = number => ({text: number, color: puzzle.colorSchema.gridColor, textColor: '#fff', returnValue: number});
  assert("Node chooser").that(puzzle.nodes[1][1][2].chooserValues).isNull();
  assert("Node click").that(puzzle.nodes[1][1][2].clickSwitch).containsExactly([{}, numberItem('0'), numberItem('1'), numberItem('2')]);
  assert("Cell drag processor").that(puzzle.cells[0][0].dragProcessor).isNull();
  assert("Edge chooser").that(puzzle.edges[1][2][2].chooserValues).isNull();
  assert("Edge click").that(puzzle.edges[1][2][2].clickSwitch).isNull();
  assert("Edge drag").that(puzzle.edges[1][2][2].dragSwitch).isNull();
  assert("Connector click").that(puzzle.connectors[1][2]['v'].clickSwitch).isNull();
  assert("Connector drag").that(puzzle.connectors[1][2]['v'].dragSwitch).isNull();
}),

// Mouse processing tests
test('Draw line by drag between cells',(suite) => {
  let puzzle = suite.showPuzzle("ring_ring_nested", "5x4", {"a1": "black", "b1": "black", "a4": "black", "b4": "black", "nodes": {"a1-2": "0", "c1-2": "1", "a2-2": "1", "c2-2": "2"}});
  puzzle.start();

  let connector = puzzle.connectors[1][2]['v'];
  let point = suite.cellPoint(puzzle, "c2");

  assert("Connector value before drag").that(connector.getValue()).isNull();
  assert("Connector data before drag").that(connector.data).isEqualTo({});

  // Drag from c2 down to c3.
  puzzle.controller.onMouseDown(suite.mouseEvent(point));
  point.down();
  puzzle.controller.onMouseMove(suite.mouseEvent(point));

  assert("Connector value after drag").that(connector.getValue()).isEqualTo("1");
  assert("Connector data after drag").that(connector.data).isEqualTo({color: puzzle.colorSchema.lineColor, returnValue: "1"});
  assert("Horizontal connector of the same cell").that(puzzle.connectors[1][2]['h'].getValue()).isNull();

  // Moving back within the same drag removes the line.
  point.up();
  puzzle.controller.onMouseMove(suite.mouseEvent(point));
  puzzle.controller.onMouseUp(suite.mouseEvent(point));

  assert("Connector value after back drag").that(connector.getValue()).isNull();
  assert("Connector data after back drag").that(connector.data).isEqualTo({});
}),

test('Second drag over the line removes it',(suite) => {
  let puzzle = suite.showPuzzle("ring_ring_nested", "5x4", {"a1": "black", "b1": "black", "a4": "black", "b4": "black", "nodes": {"a1-2": "0", "c1-2": "1", "a2-2": "1", "c2-2": "2"}});
  puzzle.start();

  suite.drawLine(puzzle, "a2", "b2");

  assert("Connector value after drag").that(puzzle.connectors[1][0]['h'].getValue()).isEqualTo("1");

  // The same connector in the opposite direction.
  suite.drawLine(puzzle, "b2", "a2");

  assert("Connector value after second drag").that(puzzle.connectors[1][0]['h'].getValue()).isNull();
  assert("Connector data after second drag").that(puzzle.connectors[1][0]['h'].data).isEqualTo({});
}),

test('Draw line through several cells',(suite) => {
  let puzzle = suite.showPuzzle("ring_ring_nested", "5x4", {"a1": "black", "b1": "black", "a4": "black", "b4": "black", "nodes": {"a1-2": "0", "c1-2": "1", "a2-2": "1", "c2-2": "2"}});
  puzzle.start();

  // One mouse move from a2 to c2 passes over b2.
  suite.drag(puzzle, suite.cellPoint(puzzle, "a2"), suite.cellPoint(puzzle, "c2"));

  assert("Line after one long move").that(puzzle.collectData()).isEqualTo({"connectors": {"a2-h": "1", "b2-h": "1"}});

  // Drag with turns: c2 - c3 - a3 - a2 closes the rectangle.
  suite.drawLine(puzzle, "c2", "c3", "a3", "a2");

  assert("Rectangle").that(puzzle.collectData()).isEqualTo({"connectors": {"a2-h": "1", "b2-h": "1", "c2-v": "1", "a3-h": "1", "b3-h": "1", "a2-v": "1"}});
}),

test('Click and diagonal drag do not draw lines',(suite) => {
  let puzzle = suite.showPuzzle("ring_ring_nested", "5x4", {"a1": "black", "b1": "black", "a4": "black", "b4": "black", "nodes": {"a1-2": "0", "c1-2": "1", "a2-2": "1", "c2-2": "2"}});
  puzzle.start();

  // Click at the middle of the connector between c2 and c3 and at the centers of these cells.
  suite.click(puzzle, suite.gridPoint(puzzle, 2.5, 2));
  suite.cellClick(puzzle, "c2");
  suite.cellClick(puzzle, "c3");
  // Cells b2 and c3 are not in one row or column.
  suite.drag(puzzle, suite.cellPoint(puzzle, "b2"), suite.cellPoint(puzzle, "c3"));

  assert("Connector value").that(puzzle.connectors[1][2]['v'].getValue()).isNull();
  assert("Submission data").that(puzzle.collectData()).isEqualTo({});
}),

test('Line can not enter black cell',(suite) => {
  let puzzle = suite.showPuzzle("ring_ring_nested", "5x4", {"a1": "black", "b1": "black", "a4": "black", "b4": "black", "nodes": {"a1-2": "0", "c1-2": "1", "a2-2": "1", "c2-2": "2"}});
  puzzle.start();

  suite.drawLine(puzzle, "a2", "a1");
  suite.drawLine(puzzle, "c1", "b1");
  suite.drawLine(puzzle, "a1", "b1");

  assert("Connector between a1 and a2").that(puzzle.connectors[0][0]['v'].getValue()).isNull();
  assert("Connector between b1 and c1").that(puzzle.connectors[0][1]['h'].getValue()).isNull();
  assert("Connector between a1 and b1").that(puzzle.connectors[0][0]['h'].getValue()).isNull();
  assert("Submission data").that(puzzle.collectData()).isEqualTo({});

  // One mouse move from e1 to the black cell a1: the line is drawn only to c1.
  suite.drag(puzzle, suite.cellPoint(puzzle, "e1"), suite.cellPoint(puzzle, "a1"));

  assert("Line stops at the black cell").that(puzzle.collectData()).isEqualTo({"connectors": {"c1-h": "1", "d1-h": "1"}});
}),
test('Process clicks to edge',(suite) => {
  let puzzle = suite.showPuzzle("ring_ring_nested", "5x4", {"a1": "black", "b1": "black", "a4": "black", "b4": "black", "nodes": {"a1-2": "0", "c1-2": "1", "a2-2": "1", "c2-2": "2"}});
  puzzle.start();

  // The edge between c2 and c3.
  let edge = puzzle.edges[1][2][2];
  let point = suite.gridPoint(puzzle, 2.5, 2);

  assert("Edge data before click").that(edge.data).isEqualTo({});

  suite.click(puzzle, point);

  assert("Edge value after click").that(edge.getValue()).isNull();
  assert("Edge data after click").that(edge.data).isEqualTo({image: "cross"});
  assert("Cross is not submitted").that(puzzle.collectData()).isEqualTo({});

  suite.click(puzzle, point);

  assert("Edge value after second click").that(edge.getValue()).isNull();
  assert("Edge data after second click").that(edge.data).isEqualTo({});
}),

test('Black and empty cells are not changed by click',(suite) => {
  let puzzle = suite.showPuzzle("ring_ring_nested", "5x4", {"a1": "black", "b1": "black", "a4": "black", "b4": "black", "nodes": {"a1-2": "0", "c1-2": "1", "a2-2": "1", "c2-2": "2"}});
  puzzle.start();

  suite.cellClick(puzzle, "a1");
  suite.cellClick(puzzle, "c3");

  assert("Black cell data").that(puzzle.cells[0][0].data).isEqualTo({color: puzzle.colorSchema.gridColor});
  assert("Empty cell data").that(puzzle.cells[2][2].data).isEqualTo({});
  assert("Submission data").that(puzzle.collectData()).isEqualTo({});
}),

test('Process clicks to clue node',(suite) => {
  let puzzle = suite.showPuzzle("ring_ring_nested", "5x4", {"a1": "black", "b1": "black", "a4": "black", "b4": "black", "nodes": {"a1-2": "0", "c1-2": "1", "a2-2": "1", "c2-2": "2"}});
  puzzle.start();

  // The clue at the bottom right corner of a1 can be marked as used.
  let node = puzzle.nodes[0][0][2];
  let point = suite.gridPoint(puzzle, 1, 1);

  suite.click(puzzle, point);

  assert("Clue node value after click").that(node.getValue()).isNull();
  assert("Clue node data after click").that(node.data).isEqualTo({text: '0', color: puzzle.colorSchema.lightGreyColor, textColor: '#fff'});
  assert("Mark is not submitted").that(puzzle.collectData()).isEqualTo({});

  suite.click(puzzle, point);

  assert("Clue node data after second click").that(node.data).isEqualTo({text: '0', color: puzzle.colorSchema.gridColor, textColor: '#fff'});
}),

test('Process clicks to empty node',(suite) => {
  let puzzle = suite.showPuzzle("ring_ring_nested", "5x4", {"a1": "black", "b1": "black", "a4": "black", "b4": "black", "nodes": {"a1-2": "0", "c1-2": "1", "a2-2": "1", "c2-2": "2"}});
  puzzle.start();

  // Solver can write notes to the nodes without clues: the bottom right corner of b1.
  let node = puzzle.nodes[0][1][2];
  let point = suite.gridPoint(puzzle, 2, 1);

  assert("Node data before click").that(node.data).isEqualTo({});

  suite.click(puzzle, point);

  assert("Node value after one click").that(node.getValue()).isNull();
  assert("Node data after one click").that(node.data).isEqualTo({text: '0', color: puzzle.colorSchema.lightGreyColor});

  suite.click(puzzle, point);

  assert("Node data after two clicks").that(node.data).isEqualTo({text: '1', color: puzzle.colorSchema.lightGreyColor});

  suite.click(puzzle, point);

  assert("Node value after three clicks").that(node.getValue()).isNull();
  assert("Node data after three clicks").that(node.data).isEqualTo({text: '2', color: puzzle.colorSchema.lightGreyColor});
  assert("Notes are not submitted").that(puzzle.collectData()).isEqualTo({});

  suite.click(puzzle, point);

  assert("Node data after four clicks").that(node.data).isEqualTo({});
  assert("Other nodes are not changed").that(puzzle.nodes[0][2][2].data).isEqualTo({text: '1', color: puzzle.colorSchema.gridColor, textColor: '#fff'});
}),

// Data collector tests
test('Data collector',(suite) => {
  let puzzle = suite.showPuzzle("ring_ring_nested", "5x4", {"a1": "black", "b1": "black", "a4": "black", "b4": "black", "nodes": {"a1-2": "0", "c1-2": "1", "a2-2": "1", "c2-2": "2"}});
  puzzle.start();

  // Two rectangles c1-e1-e4-c4 and a2-d2-d3-a3:
  //   # # 1 1 1
  //   2 2 + 2 1
  //   2 2 + 2 1
  //   # # 1 1 1
  suite.drawLine(puzzle, "c1", "e1", "e4", "c4", "c1");
  suite.drawLine(puzzle, "a2", "d2", "d3", "a3", "a2");
  // Marks which are not submitted: used clue, note in the node, cross at the edge.
  suite.click(puzzle, suite.gridPoint(puzzle, 1, 1));
  suite.click(puzzle, suite.gridPoint(puzzle, 4, 2));
  suite.click(puzzle, suite.gridPoint(puzzle, 1.5, 2));

  assert("Submission data").that(puzzle.collectData()).isEqualTo({"connectors": {
    "c1-h": "1", "d1-h": "1", "c4-h": "1", "d4-h": "1", "a2-h": "1", "b2-h": "1", "c2-h": "1", "a3-h": "1", "b3-h": "1", "c3-h": "1",
    "c1-v": "1", "e1-v": "1", "c2-v": "1", "e2-v": "1", "c3-v": "1", "e3-v": "1", "a2-v": "1", "d2-v": "1"}});
}),

test('Process clicks to cell for author',(suite) => {
  let puzzle = suite.showPuzzle("ring_ring_nested", "5x4");
  puzzle.edit();

  let cell = puzzle.cells[0][0];

  suite.cellClick(puzzle, "a1");

  assert("Cell value after one click").that(cell.getValue()).isEqualTo("black");
  assert("Cell data after one click").that(cell.data).isEqualTo({color: puzzle.colorSchema.gridColor, returnValue: 'black'});

  suite.cellClick(puzzle, "a1");

  assert("Cell value after two clicks").that(cell.getValue()).isNull();
  assert("Cell data after two clicks").that(cell.data).isEqualTo({});
}),

test('Process clicks to node for author',(suite) => {
  let puzzle = suite.showPuzzle("ring_ring_nested", "5x4");
  puzzle.edit();

  // The bottom right corner of b2.
  let node = puzzle.nodes[1][1][2];
  let point = suite.gridPoint(puzzle, 2, 2);
  let numberItem = number => ({text: number, color: puzzle.colorSchema.gridColor, textColor: '#fff', returnValue: number});

  suite.click(puzzle, point);

  assert("Node value after one click").that(node.getValue()).isEqualTo("0");
  assert("Node data after one click").that(node.data).isEqualTo(numberItem('0'));

  suite.click(puzzle, point);

  assert("Node value after two clicks").that(node.getValue()).isEqualTo("1");
  assert("Node data after two clicks").that(node.data).isEqualTo(numberItem('1'));

  suite.click(puzzle, point);

  assert("Node value after three clicks").that(node.getValue()).isEqualTo("2");
  assert("Node data after three clicks").that(node.data).isEqualTo(numberItem('2'));

  suite.click(puzzle, point);

  assert("Node value after four clicks").that(node.getValue()).isNull();
  assert("Node data after four clicks").that(node.data).isEqualTo({});
  assert("Cells around the node are not changed").that(puzzle.collectData()).isEqualTo({});
}),

test('Author data collector',(suite) => {
  let puzzle = suite.showPuzzle("ring_ring_nested", "5x4");
  puzzle.edit();

  // Emulates the given number of clicks at the node of the grid.
  let clickNode = function(col, row, times) {
    for (let i = 0; i < times; i++) {
      suite.click(puzzle, suite.gridPoint(puzzle, col, row));
    }
  };

  ["a1", "b1", "a4", "b4"].forEach(cell => suite.cellClick(puzzle, cell));
  clickNode(1, 1, 1); // 0 at the bottom right corner of a1
  clickNode(3, 1, 2); // 1 at the bottom right corner of c1
  clickNode(1, 2, 2); // 1 at the bottom right corner of a2
  clickNode(3, 2, 3); // 2 at the bottom right corner of c2
  clickNode(2, 3, 4); // the bottom right corner of b3 is set and cleared

  assert("Puzzle data").that(puzzle.collectData()).isEqualTo({"a1": "black", "b1": "black", "a4": "black", "b4": "black", "nodes": {"a1-2": "0", "c1-2": "1", "a2-2": "1", "c2-2": "2"}});
}),

test('Author can not draw lines',(suite) => {
  let puzzle = suite.showPuzzle("ring_ring_nested", "5x4");
  puzzle.edit();

  suite.drawLine(puzzle, "a2", "b2", "b3");
  // The edge between c2 and c3.
  suite.click(puzzle, suite.gridPoint(puzzle, 2.5, 2));

  assert("Connector value").that(puzzle.connectors[1][0]['h'].getValue()).isNull();
  assert("Edge data").that(puzzle.edges[1][2][2].data).isEqualTo({});
  assert("Puzzle data").that(puzzle.collectData()).isEqualTo({});
}),

);
