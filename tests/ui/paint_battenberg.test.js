paintBattenbergTestSuite = uiTestSuite("Paint Battenberg", "squarepuzzle", "squarePuzzleType",

// Puzzle from the checker tests: numbers of painted cells are given to the right and below the grid,
// Battenberg marks (*) are placed in the grid nodes: "a1-2" is the bottom right corner of a1.
//     a   b   c   d
//   1 .   .   .   .   2
//         *
//   2 .   .   .   .   2
//                 *
//   3 .   .   .   .   2
//
//   4 .   .   .   .
//     1   2   1   2

beforeSuite((suite, cb)=> {
  suite.CLUES = {"bottom": ["1", "2", "1", "2"], "right": ["2", "2", "2", null], "nodes": {"a1-2": "battenberg", "c2-2": "battenberg"}};
  // Emulates one mouse drag which starts in the first cell and goes through the centers of the other cells.
  suite.dragOverCells = function(puzzle, ...cells) {
    puzzle.controller.onMouseDown(suite.mouseEvent(suite.cellPoint(puzzle, cells[0])));
    for (let i = 1; i < cells.length; i++) {
      puzzle.controller.onMouseMove(suite.mouseEvent(suite.cellPoint(puzzle, cells[i])));
    }
    puzzle.controller.onMouseUp(suite.mouseEvent(suite.cellPoint(puzzle, cells[cells.length - 1])));
  };
  cb();
}),

// Controller definition tests
test('Solver controllers',(suite) => {
  let puzzle = suite.showPuzzle("paint_battenberg", "4x4", Object.assign({"a4": "cross"}, suite.CLUES));
  puzzle.start();

  assert("Empty cell chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("Empty cell click").that(puzzle.cells[0][0].clickSwitch).containsExactly([{}, {color: puzzle.colorSchema.greyColor, returnValue: 'black'}, {image: 'cross'}]);
  assert("Empty cell drag handler").that(puzzle.cells[0][0].drawDragHandler).isNotNull();
  assert("Empty cell drag processor").that(puzzle.cells[0][0].dragProcessor).isNotNull();
  assert("Cross cell chooser").that(puzzle.cells[3][0].chooserValues).isNull();
  assert("Cross cell click").that(puzzle.cells[3][0].clickSwitch).isNull();
  assert("Cross cell drag processor").that(puzzle.cells[3][0].dragProcessor).isNotNull();
  assert("Bottom clue chooser").that(puzzle.bottom[0].chooserValues).isNull();
  assert("Bottom clue click").that(puzzle.bottom[0].clickSwitch).containsExactly([{text: '1'}, {text: '1', image: 'white_circle'}]);
  assert("Bottom clue drag processor").that(puzzle.bottom[0].dragProcessor).isNull();
  assert("Right clue chooser").that(puzzle.right[0].chooserValues).isNull();
  assert("Right clue click").that(puzzle.right[0].clickSwitch).containsExactly([{text: '2'}, {text: '2', image: 'white_circle'}]);
  assert("Empty right clue click").that(puzzle.right[3].clickSwitch).containsExactly([{}, {image: 'white_circle'}]);
  assert("Node with mark chooser").that(puzzle.nodes[0][0][2].chooserValues).isNull();
  assert("Node with mark click").that(puzzle.nodes[0][0][2].clickSwitch).isNull();
  assert("Node with mark drag processor").that(puzzle.nodes[0][0][2].dragProcessor).isNull();
  assert("Empty node chooser").that(puzzle.nodes[0][1][2].chooserValues).isNull();
  assert("Empty node click").that(puzzle.nodes[0][1][2].clickSwitch).isNull();
}),

test('Author controllers',(suite) => {
  let puzzle = suite.showPuzzle("paint_battenberg", "4x4");
  puzzle.edit();

  let numbers = [{}, {text: '0', returnValue: '0'}, {text: '1', returnValue: '1'}, {text: '2', returnValue: '2'}, {text: '3', returnValue: '3'}, {text: '4', returnValue: '4'}];

  assert("Cell chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("Cell click").that(puzzle.cells[0][0].clickSwitch).containsExactly([{}, {image: 'cross', returnValue: 'cross'}]);
  assert("Cell drag processor").that(puzzle.cells[0][0].dragProcessor).isNull();
  assert("Bottom clue chooser").that(puzzle.bottom[0].chooserValues).containsExactly(numbers);
  assert("Bottom clue click").that(puzzle.bottom[0].clickSwitch).isNull();
  assert("Right clue chooser").that(puzzle.right[3].chooserValues).containsExactly(numbers);
  assert("Right clue click").that(puzzle.right[3].clickSwitch).isNull();
  assert("Node chooser").that(puzzle.nodes[0][0][2].chooserValues).isNull();
  assert("Node click").that(puzzle.nodes[0][0][2].clickSwitch).containsExactly([{}, {image: 'battenberg_small', returnValue: 'battenberg'}]);
}),

test('Author controllers depend on grid size',(suite) => {
  let puzzle = suite.showPuzzle("paint_battenberg", "6x6");
  puzzle.edit();

  assert("Number of items in the bottom clue chooser").that(puzzle.bottom[0].chooserValues.length).isEqualTo(8);
  assert("Bottom clue chooser").that(puzzle.bottom[0].chooserValues).containsAtLeast([{}, {text: '0', returnValue: '0'}, {text: '6', returnValue: '6'}]);
  assert("Number of items in the right clue chooser").that(puzzle.right[5].chooserValues.length).isEqualTo(8);
}),

// Clue display tests
test('Show clues',(suite) => {
  let puzzle = suite.showPuzzle("paint_battenberg", "4x4", suite.CLUES);
  puzzle.start();

  assert("Number of bottom clues").that(puzzle.bottom.length).isEqualTo(4);
  assert("Number of right clues").that(puzzle.right.length).isEqualTo(4);
  assert("Bottom clue of column a").that(puzzle.bottom[0].data).isEqualTo({text: '1'});
  assert("Bottom clue of column b").that(puzzle.bottom[1].data).isEqualTo({text: '2'});
  assert("Bottom clue of column d").that(puzzle.bottom[3].data).isEqualTo({text: '2'});
  assert("Right clue of row 1").that(puzzle.right[0].data).isEqualTo({text: '2'});
  assert("Right clue of row 3").that(puzzle.right[2].data).isEqualTo({text: '2'});
  assert("Text of the missing right clue").that(puzzle.right[3].data.text).isNull();

  assert("Node with mark between a1, b1, a2, b2").that(puzzle.nodes[0][0][2].data).isEqualTo({image: 'battenberg_small'});
  assert("Node with mark between c2, d2, c3, d3").that(puzzle.nodes[1][2][2].data).isEqualTo({image: 'battenberg_small'});
  // The same node is available from all the cells around it.
  assert("Node with mark as the top left corner of b2").that(puzzle.nodes[1][1][0].data).isEqualTo({image: 'battenberg_small'});
  assert("Node without mark").that(puzzle.nodes[0][1][2].data.image).isNull();
  assert("Node without mark at the bottom").that(puzzle.nodes[2][2][2].data.image).isNull();

  // The mark is placed exactly at the corner of the cells.
  let center = puzzle.nodes[0][0][2].center();
  let corner = suite.gridPoint(puzzle, 1, 1);
  assert("Mark x").that(center.x).isAlmostEqualTo(corner.x);
  assert("Mark y").that(center.y).isAlmostEqualTo(corner.y);

  assert("Submission data").that(puzzle.collectData()).isEqualTo({});
}),

// Mouse processing tests
test('Process click to empty cell',(suite) => {
  let puzzle = suite.showPuzzle("paint_battenberg", "4x4", suite.CLUES);
  puzzle.start();

  let point = suite.cellPoint(puzzle, "a1");

  assert("Cell value before click").that(puzzle.cells[0][0].getValue()).isNull();

  suite.click(puzzle, point);

  assert("Cell value after one click").that(puzzle.cells[0][0].getValue()).isEqualTo("black");
  assert("Cell data after one click").that(puzzle.cells[0][0].data).isEqualTo({color: puzzle.colorSchema.greyColor, returnValue: "black"});

  suite.click(puzzle, point);

  assert("Cell value after two clicks").that(puzzle.cells[0][0].getValue()).isNull();
  assert("Cell data after two clicks").that(puzzle.cells[0][0].data).isEqualTo({image: "cross"});

  suite.click(puzzle, point);

  assert("Cell value after three clicks").that(puzzle.cells[0][0].getValue()).isNull();
  assert("Cell data after three clicks").that(puzzle.cells[0][0].data).isEqualTo({});
}),

test('Process click to given cross',(suite) => {
  let puzzle = suite.showPuzzle("paint_battenberg", "4x4", Object.assign({"a4": "cross"}, suite.CLUES));
  puzzle.start();

  suite.cellClick(puzzle, "a4");

  assert("Cell value after click").that(puzzle.cells[3][0].getValue()).isNull();
  assert("Cell data after click").that(puzzle.cells[3][0].data).isEqualTo({image: "cross"});
  assert("Submission data").that(puzzle.collectData()).isEqualTo({});
}),

test('Process click to outer clues',(suite) => {
  let puzzle = suite.showPuzzle("paint_battenberg", "4x4", suite.CLUES);
  puzzle.start();

  // Clue below the column a.
  let point = suite.cellPoint(puzzle, 0, 4);

  suite.click(puzzle, point);

  assert("Bottom clue data after click").that(puzzle.bottom[0].data).isEqualTo({text: "1", image: "white_circle"});
  assert("Bottom clue value after click").that(puzzle.bottom[0].getValue()).isNull();

  suite.click(puzzle, point);

  assert("Bottom clue data after second click").that(puzzle.bottom[0].data).isEqualTo({text: "1"});

  // Clue to the right of the row 2.
  suite.click(puzzle, suite.cellPoint(puzzle, 4, 1));

  assert("Right clue data after click").that(puzzle.right[1].data).isEqualTo({text: "2", image: "white_circle"});
  assert("Another right clue data").that(puzzle.right[0].data).isEqualTo({text: "2"});

  // Empty outer cell to the right of the row 4.
  suite.click(puzzle, suite.cellPoint(puzzle, 4, 3));

  assert("Empty right cell data after click").that(puzzle.right[3].data).isEqualTo({image: "white_circle"});

  // Marks of the clues are not submitted.
  assert("Submission data").that(puzzle.collectData()).isEqualTo({});
}),

test('Process click to node',(suite) => {
  let puzzle = suite.showPuzzle("paint_battenberg", "4x4", suite.CLUES);
  puzzle.start();

  // Node with the mark and node without it.
  suite.click(puzzle, suite.gridPoint(puzzle, 1, 1));
  suite.click(puzzle, suite.gridPoint(puzzle, 2, 1));

  assert("Node with mark data").that(puzzle.nodes[0][0][2].data).isEqualTo({image: 'battenberg_small'});
  assert("Node without mark image").that(puzzle.nodes[0][1][2].data.image).isNull();
  // Cells around the nodes are not changed too.
  assert("Value of a1").that(puzzle.cells[0][0].getValue()).isNull();
  assert("Value of b1").that(puzzle.cells[0][1].getValue()).isNull();
  assert("Value of b2").that(puzzle.cells[1][1].getValue()).isNull();
  assert("Value of c2").that(puzzle.cells[1][2].getValue()).isNull();
  assert("Submission data").that(puzzle.collectData()).isEqualTo({});
}),

test('Paint cells by drag',(suite) => {
  let puzzle = suite.showPuzzle("paint_battenberg", "4x4", suite.CLUES);
  puzzle.start();

  let greyColor = puzzle.colorSchema.greyColor;

  suite.cellClick(puzzle, "a4");
  // One move from the painted a4 along the bottom row and further to the outer cell to the right of it.
  puzzle.controller.onMouseDown(suite.mouseEvent(suite.cellPoint(puzzle, "a4")));
  puzzle.controller.onMouseMove(suite.mouseEvent(suite.cellPoint(puzzle, "b4")));
  puzzle.controller.onMouseMove(suite.mouseEvent(suite.cellPoint(puzzle, "c4")));
  puzzle.controller.onMouseMove(suite.mouseEvent(suite.cellPoint(puzzle, "d4")));
  puzzle.controller.onMouseMove(suite.mouseEvent(suite.cellPoint(puzzle, 4, 3)));
  puzzle.controller.onMouseUp(suite.mouseEvent(suite.cellPoint(puzzle, 4, 3)));

  assert("Source cell value").that(puzzle.cells[3][0].getValue()).isEqualTo("black");
  assert("Value of b4").that(puzzle.cells[3][1].getValue()).isEqualTo("black");
  assert("Data of b4").that(puzzle.cells[3][1].data).isEqualTo({color: greyColor, returnValue: "black"});
  assert("Value of c4").that(puzzle.cells[3][2].getValue()).isEqualTo("black");
  assert("Value of d4").that(puzzle.cells[3][3].getValue()).isEqualTo("black");
  assert("Value of the cell out of the drag path").that(puzzle.cells[2][0].getValue()).isNull();
  // Outer cell is not changed.
  assert("Right outer cell image").that(puzzle.right[3].data.image).isNull();
  assert("Right outer cell color").that(puzzle.right[3].data.color).isNull();

  assert("Submission data").that(puzzle.collectData()).isEqualTo({"a4": "black", "b4": "black", "c4": "black", "d4": "black"});
}),

test('Set crosses by drag',(suite) => {
  let puzzle = suite.showPuzzle("paint_battenberg", "4x4", suite.CLUES);
  puzzle.start();

  suite.cellClick(puzzle, "a1");
  suite.cellClick(puzzle, "a1");
  suite.dragOverCells(puzzle, "a1", "b1", "b2");

  assert("Source cell data").that(puzzle.cells[0][0].data).isEqualTo({image: "cross"});
  assert("Data of b1").that(puzzle.cells[0][1].data).isEqualTo({image: "cross"});
  assert("Data of b2").that(puzzle.cells[1][1].data).isEqualTo({image: "cross"});
  assert("Submission data").that(puzzle.collectData()).isEqualTo({});
}),

test('Clear cells by drag',(suite) => {
  let puzzle = suite.showPuzzle("paint_battenberg", "4x4", suite.CLUES);
  puzzle.start();

  suite.cellClick(puzzle, "b4");
  suite.cellClick(puzzle, "c4");
  suite.cellClick(puzzle, "d4");
  // Drag from the empty cell a4 clears the cells on its way.
  suite.dragOverCells(puzzle, "a4", "b4", "c4");

  assert("Value of b4").that(puzzle.cells[3][1].getValue()).isNull();
  assert("Color of b4").that(puzzle.cells[3][1].data.color).isNull();
  assert("Value of c4").that(puzzle.cells[3][2].getValue()).isNull();
  assert("Submission data").that(puzzle.collectData()).isEqualTo({"d4": "black"});
}),

test('Drag with given cross',(suite) => {
  let puzzle = suite.showPuzzle("paint_battenberg", "4x4", Object.assign({"a4": "cross"}, suite.CLUES));
  puzzle.start();

  // The given cross is copied to empty cells.
  suite.dragOverCells(puzzle, "a4", "a3", "a2");

  assert("Data of a3").that(puzzle.cells[2][0].data).isEqualTo({image: "cross"});
  assert("Data of a2").that(puzzle.cells[1][0].data).isEqualTo({image: "cross"});

  // The given cross is not changed by drag from the painted cell.
  suite.cellClick(puzzle, "b4");
  suite.dragOverCells(puzzle, "b4", "a4");

  assert("Given cross data").that(puzzle.cells[3][0].data).isEqualTo({image: "cross"});
  assert("Submission data").that(puzzle.collectData()).isEqualTo({"b4": "black"});
}),

// Data collector tests
test('Data collector',(suite) => {
  let puzzle = suite.showPuzzle("paint_battenberg", "4x4", suite.CLUES);
  puzzle.start();

  // Solution:  # . . #
  //            . # . #
  //            . # # .
  //            . . . .
  suite.cellClick(puzzle, "a1");
  suite.cellClick(puzzle, "d1");
  suite.dragOverCells(puzzle, "d1", "d2");
  suite.cellClick(puzzle, "b2");
  suite.dragOverCells(puzzle, "b2", "b3", "c3");
  // Crosses and marks of the clues are not submitted.
  suite.cellClick(puzzle, "a4");
  suite.cellClick(puzzle, "a4");
  suite.click(puzzle, suite.cellPoint(puzzle, 4, 0));

  assert("Submission data").that(puzzle.collectData()).isEqualTo(
    {"a1": "black", "d1": "black", "b2": "black", "d2": "black", "b3": "black", "c3": "black"});
}),

// Author tests
test('Author sets clues',(suite) => {
  let puzzle = suite.showPuzzle("paint_battenberg", "4x4");
  puzzle.edit();

  // Chooser items of outer cells: empty, 0, 1, 2, 3, 4.
  puzzle.bottom[0].switchOnChooser(3);
  puzzle.right[1].switchOnChooser(1);

  assert("Bottom clue value").that(puzzle.bottom[0].getValue()).isEqualTo("2");
  assert("Bottom clue data").that(puzzle.bottom[0].data).isEqualTo({text: "2", returnValue: "2"});
  assert("Right clue value").that(puzzle.right[1].getValue()).isEqualTo("0");
  assert("Right clue data").that(puzzle.right[1].data).isEqualTo({text: "0", returnValue: "0"});

  suite.cellClick(puzzle, "c1");

  assert("Cross value").that(puzzle.cells[0][2].getValue()).isEqualTo("cross");
  assert("Cross data").that(puzzle.cells[0][2].data).isEqualTo({image: "cross", returnValue: "cross"});

  assert("Puzzle data").that(puzzle.collectData()).isEqualTo({"c1": "cross", "bottom": ["2", null, null, null], "right": [null, "0", null, null]});

  // Remove the bottom clue and the cross.
  puzzle.bottom[0].switchOnChooser(0);
  suite.cellClick(puzzle, "c1");

  assert("Value of the cleared bottom clue").that(puzzle.bottom[0].getValue()).isNull();
  assert("Value of the cleared cell").that(puzzle.cells[0][2].getValue()).isNull();
  // Side without clues is not included to the data.
  assert("Puzzle data after clues are removed").that(puzzle.collectData()).isEqualTo({"right": [null, "0", null, null]});
}),

test('Author sets marks in nodes',(suite) => {
  let puzzle = suite.showPuzzle("paint_battenberg", "4x4");
  puzzle.edit();

  // Common corner of a1, b1, a2 and b2.
  let point = suite.gridPoint(puzzle, 1, 1);

  assert("Node value before click").that(puzzle.nodes[0][0][2].getValue()).isNull();

  suite.click(puzzle, point);

  assert("Node value after click").that(puzzle.nodes[0][0][2].getValue()).isEqualTo("battenberg");
  assert("Node data after click").that(puzzle.nodes[0][0][2].data).isEqualTo({image: "battenberg_small", returnValue: "battenberg"});
  assert("Neighbour node value").that(puzzle.nodes[0][1][2].getValue()).isNull();
  assert("Puzzle data with mark").that(puzzle.collectData()).isEqualTo({"nodes": {"a1-2": "battenberg"}});

  suite.click(puzzle, point);

  assert("Node value after second click").that(puzzle.nodes[0][0][2].getValue()).isNull();
  assert("Puzzle data after mark is removed").that(puzzle.collectData()).isEqualTo({});
}),

test('Author data collector',(suite) => {
  let puzzle = suite.showPuzzle("paint_battenberg", "4x4");
  puzzle.edit();

  // Clues below the grid and to the right of it (the last row has no clue).
  ["1", "2", "1", "2"].forEach((clue, index) => puzzle.bottom[index].switchOnChooser(Number(clue) + 1));
  ["2", "2", "2"].forEach((clue, index) => puzzle.right[index].switchOnChooser(Number(clue) + 1));
  // Marks at the bottom right corners of a1 and c2.
  suite.click(puzzle, suite.gridPoint(puzzle, 1, 1));
  suite.click(puzzle, suite.gridPoint(puzzle, 3, 2));

  assert("Puzzle data").that(puzzle.collectData()).isEqualTo(suite.CLUES);
}),

test('Author edits existing puzzle',(suite) => {
  let puzzle = suite.showPuzzle("paint_battenberg", "4x4", suite.CLUES);
  puzzle.edit();

  assert("Bottom clue value").that(puzzle.bottom[0].getValue()).isEqualTo("1");
  assert("Right clue value").that(puzzle.right[2].getValue()).isEqualTo("2");
  assert("Node value").that(puzzle.nodes[0][0][2].getValue()).isEqualTo("battenberg");
  assert("Puzzle data").that(puzzle.collectData()).isEqualTo(suite.CLUES);

  // Remove the mark at the corner of a1, add the missing right clue and a cross to d4.
  suite.click(puzzle, suite.gridPoint(puzzle, 1, 1));
  puzzle.right[3].switchOnChooser(1);
  suite.cellClick(puzzle, "d4");

  assert("Puzzle data after change").that(puzzle.collectData()).isEqualTo(
    {"d4": "cross", "bottom": ["1", "2", "1", "2"], "right": ["2", "2", "2", "0"], "nodes": {"c2-2": "battenberg"}});
}),

);
