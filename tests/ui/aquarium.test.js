aquariumTestSuite = uiTestSuite("Aquarium", "squarepuzzle", "squarePuzzleType",

// Puzzle from the checker tests: four areas, numbers of filled cells are given to the right and below the grid.
//     a   b   c   d
//   1 .   . | .   .   0
//       +---+
//   2 . | . | .   .   3
//     --+   +---+
//   3 .   .   . | .   1
//       +---+---+---
//   4 . | .   .   .   4
//     2   1   2   3

beforeSuite((suite, cb)=> {
  suite.AREAS = [["a1", "b1", "a2"], ["c1", "d1", "c2", "d2", "d3"], ["b2", "a3", "b3", "c3", "a4"], ["b4", "c4", "d4"]];
  suite.CLUES = {"areas": suite.AREAS, "bottom": ["2", "1", "2", "3"], "right": ["0", "3", "1", "4"]};
  // Emulates one mouse drag which starts in the first cell and goes through the centers of the other cells.
  suite.dragOverCells = function(puzzle, ...cells) {
    puzzle.controller.onMouseDown(suite.mouseEvent(suite.cellPoint(puzzle, cells[0])));
    for (let i = 1; i < cells.length; i++) {
      puzzle.controller.onMouseMove(suite.mouseEvent(suite.cellPoint(puzzle, cells[i])));
    }
    puzzle.controller.onMouseUp(suite.mouseEvent(suite.cellPoint(puzzle, cells[cells.length - 1])));
  };
  // Emulates one mouse drag along the grid lines through the given nodes: node [0, 0] is the top left corner of a1.
  suite.dragAlongNodes = function(puzzle, ...nodes) {
    let points = nodes.map(node => suite.gridPoint(puzzle, node[0], node[1]));
    puzzle.controller.onMouseDown(suite.mouseEvent(points[0]));
    for (let i = 1; i < points.length; i++) {
      puzzle.controller.onMouseMove(suite.mouseEvent(points[i]));
    }
    puzzle.controller.onMouseUp(suite.mouseEvent(points[points.length - 1]));
  };
  cb();
}),

// Controller definition tests
test('Solver controllers',(suite) => {
  // Bottom clue of the column d is missing, c1 is a given cross.
  let puzzle = suite.showPuzzle("aquarium", "4x4", {"areas": suite.AREAS, "bottom": ["2", "1", "2", null], "right": ["0", "3", "1", "4"], "c1": "cross"});
  puzzle.start();

  assert("Empty cell chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("Empty cell click").that(puzzle.cells[0][0].clickSwitch).containsExactly([{}, {color: puzzle.colorSchema.greyColor, returnValue: '1'}, {image: 'cross'}]);
  assert("Empty cell drag handler").that(puzzle.cells[0][0].drawDragHandler).isNotNull();
  assert("Empty cell drag processor").that(puzzle.cells[0][0].dragProcessor).isNotNull();
  assert("Cross cell chooser").that(puzzle.cells[0][2].chooserValues).isNull();
  assert("Cross cell click").that(puzzle.cells[0][2].clickSwitch).isNull();
  assert("Cross cell drag processor").that(puzzle.cells[0][2].dragProcessor).isNotNull();
  assert("Bottom clue chooser").that(puzzle.bottom[0].chooserValues).isNull();
  assert("Bottom clue click").that(puzzle.bottom[0].clickSwitch).containsExactly([{text: '2'}, {text: '2', image: 'white_circle'}]);
  assert("Empty bottom clue click").that(puzzle.bottom[3].clickSwitch).containsExactly([{}, {image: 'white_circle'}]);
  assert("Right clue chooser").that(puzzle.right[0].chooserValues).isNull();
  assert("Right clue click").that(puzzle.right[0].clickSwitch).containsExactly([{text: '0'}, {text: '0', image: 'white_circle'}]);
  assert("Last right clue click").that(puzzle.right[3].clickSwitch).containsExactly([{text: '4'}, {text: '4', image: 'white_circle'}]);
  assert("Bottom clue drag processor").that(puzzle.bottom[0].dragProcessor).isNull();
  assert("Edge click").that(puzzle.edges[0][0][1].clickSwitch).isNull();
  assert("Edge drag").that(puzzle.edges[0][0][1].dragSwitch).isNull();
  assert("Area border click").that(puzzle.edges[0][1][1].clickSwitch).isNull();
  assert("Area border drag").that(puzzle.edges[0][1][1].dragSwitch).isNull();
}),

test('Author controllers',(suite) => {
  let puzzle = suite.showPuzzle("aquarium", "4x4");
  puzzle.edit();

  let numbers = [{}, {text: '0', returnValue: '0'}, {text: '1', returnValue: '1'}, {text: '2', returnValue: '2'}, {text: '3', returnValue: '3'}, {text: '4', returnValue: '4'}];
  let border = {color: puzzle.colorSchema.gridColor, returnValue: 'bold'};

  assert("Cell chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("Cell click").that(puzzle.cells[0][0].clickSwitch).containsExactly([{}, {image: 'cross', returnValue: 'cross'}]);
  assert("Bottom clue chooser").that(puzzle.bottom[0].chooserValues).containsExactly(numbers);
  assert("Bottom clue click").that(puzzle.bottom[0].clickSwitch).isNull();
  assert("Right clue chooser").that(puzzle.right[3].chooserValues).containsExactly(numbers);
  assert("Right clue click").that(puzzle.right[3].clickSwitch).isNull();
  assert("Edge chooser").that(puzzle.edges[0][0][1].chooserValues).isNull();
  assert("Edge click").that(puzzle.edges[0][0][1].clickSwitch).containsExactly([{}, border]);
  assert("Edge drag").that(puzzle.edges[0][0][1].dragSwitch).containsExactly([{}, border]);
  assert("Horizontal edge click").that(puzzle.edges[0][0][2].clickSwitch).containsExactly([{}, border]);
  assert("Horizontal edge drag").that(puzzle.edges[0][0][2].dragSwitch).containsExactly([{}, border]);
}),

test('Author controllers depend on grid size',(suite) => {
  let puzzle = suite.showPuzzle("aquarium", "6x6");
  puzzle.edit();

  assert("Number of items in the bottom clue chooser").that(puzzle.bottom[0].chooserValues.length).isEqualTo(8);
  assert("Bottom clue chooser").that(puzzle.bottom[0].chooserValues).containsAtLeast([{}, {text: '0', returnValue: '0'}, {text: '6', returnValue: '6'}]);
  assert("Number of items in the right clue chooser").that(puzzle.right[5].chooserValues.length).isEqualTo(8);
}),

// Clue display tests
test('Show clues',(suite) => {
  let puzzle = suite.showPuzzle("aquarium", "4x4", suite.CLUES);
  puzzle.start();

  let gridColor = puzzle.colorSchema.gridColor;

  assert("Number of bottom clues").that(puzzle.bottom.length).isEqualTo(4);
  assert("Number of right clues").that(puzzle.right.length).isEqualTo(4);
  assert("Bottom clue of column a").that(puzzle.bottom[0].data).isEqualTo({text: '2'});
  assert("Bottom clue of column b").that(puzzle.bottom[1].data).isEqualTo({text: '1'});
  assert("Bottom clue of column d").that(puzzle.bottom[3].data).isEqualTo({text: '3'});
  assert("Right clue of row 1").that(puzzle.right[0].data).isEqualTo({text: '0'});
  assert("Right clue of row 2").that(puzzle.right[1].data).isEqualTo({text: '3'});
  assert("Right clue of row 4").that(puzzle.right[3].data).isEqualTo({text: '4'});

  // Areas are shown by bold borders.
  assert("Border between b1 and c1").that(puzzle.edges[0][1][1].data.color).isEqualTo(gridColor);
  assert("Border between a2 and b2").that(puzzle.edges[1][0][1].data.color).isEqualTo(gridColor);
  assert("Border between b1 and b2").that(puzzle.edges[0][1][2].data.color).isEqualTo(gridColor);
  assert("Border between a2 and a3").that(puzzle.edges[1][0][2].data.color).isEqualTo(gridColor);
  assert("Border between d3 and d4").that(puzzle.edges[2][3][2].data.color).isEqualTo(gridColor);
  assert("No border between a1 and b1").that(puzzle.edges[0][0][1].data.color).isNull();
  assert("No border between a1 and a2").that(puzzle.edges[0][0][2].data.color).isNull();
  assert("No border between d2 and d3").that(puzzle.edges[1][3][2].data.color).isNull();
  assert("No border between b4 and c4").that(puzzle.edges[3][1][1].data.color).isNull();
}),

// Mouse processing tests
test('Process click to empty cell',(suite) => {
  let puzzle = suite.showPuzzle("aquarium", "4x4", suite.CLUES);
  puzzle.start();

  let point = suite.cellPoint(puzzle, "a2");

  assert("Cell value before click").that(puzzle.cells[1][0].getValue()).isNull();

  suite.click(puzzle, point);

  assert("Cell value after one click").that(puzzle.cells[1][0].getValue()).isEqualTo("1");
  assert("Cell data after one click").that(puzzle.cells[1][0].data).isEqualTo({color: puzzle.colorSchema.greyColor, returnValue: "1"});

  suite.click(puzzle, point);

  assert("Cell value after two clicks").that(puzzle.cells[1][0].getValue()).isNull();
  assert("Cell data after two clicks").that(puzzle.cells[1][0].data).isEqualTo({image: "cross"});

  suite.click(puzzle, point);

  assert("Cell value after three clicks").that(puzzle.cells[1][0].getValue()).isNull();
  assert("Cell data after three clicks").that(puzzle.cells[1][0].data).isEqualTo({});
}),

test('Process click to given cross',(suite) => {
  let puzzle = suite.showPuzzle("aquarium", "4x4", {"areas": suite.AREAS, "c1": "cross"});
  puzzle.start();

  suite.cellClick(puzzle, "c1");

  assert("Cell value after click").that(puzzle.cells[0][2].getValue()).isNull();
  assert("Cell data after click").that(puzzle.cells[0][2].data).isEqualTo({image: "cross"});
}),

test('Process click to outer clues',(suite) => {
  let puzzle = suite.showPuzzle("aquarium", "4x4", {"areas": suite.AREAS, "bottom": ["2", null, "2", "3"], "right": ["0", "3", "1", "4"]});
  puzzle.start();

  // Clue below the column a.
  let point = suite.cellPoint(puzzle, 0, 4);

  suite.click(puzzle, point);

  assert("Bottom clue data after click").that(puzzle.bottom[0].data).isEqualTo({text: "2", image: "white_circle"});
  assert("Bottom clue value after click").that(puzzle.bottom[0].getValue()).isNull();

  suite.click(puzzle, point);

  assert("Bottom clue data after second click").that(puzzle.bottom[0].data).isEqualTo({text: "2"});

  // Clue to the right of the row 2.
  suite.click(puzzle, suite.cellPoint(puzzle, 4, 1));

  assert("Right clue data after click").that(puzzle.right[1].data).isEqualTo({text: "3", image: "white_circle"});
  assert("Another right clue data").that(puzzle.right[0].data).isEqualTo({text: "0"});

  // Empty outer cell below the column b.
  suite.click(puzzle, suite.cellPoint(puzzle, 1, 4));

  assert("Empty bottom cell data after click").that(puzzle.bottom[1].data).isEqualTo({image: "white_circle"});

  // Marks of the clues are not submitted.
  assert("Submission data").that(puzzle.collectData()).isEqualTo({});
}),

test('Fill cells by drag',(suite) => {
  let puzzle = suite.showPuzzle("aquarium", "4x4", suite.CLUES);
  puzzle.start();

  let greyColor = puzzle.colorSchema.greyColor;

  suite.cellClick(puzzle, "a4");
  // One move from the filled a4 along the bottom row and further to the clue to the right of it.
  puzzle.controller.onMouseDown(suite.mouseEvent(suite.cellPoint(puzzle, "a4")));
  puzzle.controller.onMouseMove(suite.mouseEvent(suite.cellPoint(puzzle, "b4")));
  puzzle.controller.onMouseMove(suite.mouseEvent(suite.cellPoint(puzzle, "c4")));
  puzzle.controller.onMouseMove(suite.mouseEvent(suite.cellPoint(puzzle, "d4")));
  puzzle.controller.onMouseMove(suite.mouseEvent(suite.cellPoint(puzzle, 4, 3)));
  puzzle.controller.onMouseUp(suite.mouseEvent(suite.cellPoint(puzzle, 4, 3)));

  assert("Source cell value").that(puzzle.cells[3][0].getValue()).isEqualTo("1");
  assert("Value of b4").that(puzzle.cells[3][1].getValue()).isEqualTo("1");
  assert("Data of b4").that(puzzle.cells[3][1].data).isEqualTo({color: greyColor, returnValue: "1"});
  assert("Value of c4").that(puzzle.cells[3][2].getValue()).isEqualTo("1");
  assert("Value of d4").that(puzzle.cells[3][3].getValue()).isEqualTo("1");
  assert("Value of the cell out of the drag path").that(puzzle.cells[2][0].getValue()).isNull();
  // Outer clue is not changed.
  assert("Right clue data").that(puzzle.right[3].data).isEqualTo({text: "4"});

  assert("Submission data").that(puzzle.collectData()).isEqualTo({"a4": "1", "b4": "1", "c4": "1", "d4": "1"});
}),

test('Set crosses by drag',(suite) => {
  let puzzle = suite.showPuzzle("aquarium", "4x4", suite.CLUES);
  puzzle.start();

  suite.cellClick(puzzle, "a1");
  suite.cellClick(puzzle, "a1");
  suite.dragOverCells(puzzle, "a1", "b1", "c1", "d1");

  assert("Source cell data").that(puzzle.cells[0][0].data).isEqualTo({image: "cross"});
  assert("Data of b1").that(puzzle.cells[0][1].data).isEqualTo({image: "cross"});
  assert("Data of c1").that(puzzle.cells[0][2].data).isEqualTo({image: "cross"});
  assert("Data of d1").that(puzzle.cells[0][3].data).isEqualTo({image: "cross"});

  assert("Submission data").that(puzzle.collectData()).isEqualTo({});
}),

test('Clear cells by drag',(suite) => {
  let puzzle = suite.showPuzzle("aquarium", "4x4", suite.CLUES);
  puzzle.start();

  suite.cellClick(puzzle, "b4");
  suite.cellClick(puzzle, "c4");
  suite.cellClick(puzzle, "d4");
  // Drag from the empty cell a4 clears the cells on its way.
  suite.dragOverCells(puzzle, "a4", "b4", "c4");

  assert("Value of b4").that(puzzle.cells[3][1].getValue()).isNull();
  assert("Color of b4").that(puzzle.cells[3][1].data.color).isNull();
  assert("Value of c4").that(puzzle.cells[3][2].getValue()).isNull();
  assert("Value of the cell out of the drag path").that(puzzle.cells[3][3].getValue()).isEqualTo("1");
}),

test('Drag with given cross',(suite) => {
  let puzzle = suite.showPuzzle("aquarium", "4x4", {"areas": suite.AREAS, "c1": "cross"});
  puzzle.start();

  // The given cross is copied to empty cells.
  suite.dragOverCells(puzzle, "c1", "b1", "a1");

  assert("Data of b1").that(puzzle.cells[0][1].data).isEqualTo({image: "cross"});
  assert("Data of a1").that(puzzle.cells[0][0].data).isEqualTo({image: "cross"});

  // The given cross is not changed by drag from the filled cell.
  suite.cellClick(puzzle, "d1");
  suite.dragOverCells(puzzle, "d1", "c1");

  assert("Given cross data").that(puzzle.cells[0][2].data).isEqualTo({image: "cross"});
  assert("Submission data").that(puzzle.collectData()).isEqualTo({"d1": "1"});
}),

// Data collector tests
test('Data collector',(suite) => {
  let puzzle = suite.showPuzzle("aquarium", "4x4", suite.CLUES);
  puzzle.start();

  // Solution:  . . . .
  //            # . # #
  //            . . . #
  //            # # # #
  suite.cellClick(puzzle, "a2");
  suite.cellClick(puzzle, "c2");
  suite.dragOverCells(puzzle, "c2", "d2", "d3");
  suite.cellClick(puzzle, "a4");
  suite.dragOverCells(puzzle, "a4", "b4", "c4", "d4");
  // Crosses and marks of the clues are not submitted.
  suite.cellClick(puzzle, "a1");
  suite.cellClick(puzzle, "a1");
  suite.click(puzzle, suite.cellPoint(puzzle, 4, 0));

  assert("Submission data").that(puzzle.collectData()).isEqualTo(
    {"a2": "1", "c2": "1", "d2": "1", "d3": "1", "a4": "1", "b4": "1", "c4": "1", "d4": "1"});
}),

// Author tests
test('Author sets clues',(suite) => {
  let puzzle = suite.showPuzzle("aquarium", "4x4");
  puzzle.edit();

  let allCells = [["a1", "b1", "c1", "d1", "a2", "b2", "c2", "d2", "a3", "b3", "c3", "d3", "a4", "b4", "c4", "d4"]];

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

  assert("Puzzle data").that(puzzle.collectData()).isEqualTo(
    {"areas": allCells, "c1": "cross", "bottom": ["2", null, null, null], "right": [null, "0", null, null]});

  // Remove the clues.
  puzzle.bottom[0].switchOnChooser(0);
  suite.cellClick(puzzle, "c1");

  assert("Value of the cleared bottom clue").that(puzzle.bottom[0].getValue()).isNull();
  assert("Value of the cleared cell").that(puzzle.cells[0][2].getValue()).isNull();
  // Side without clues is not included to the data.
  assert("Puzzle data after clues are removed").that(puzzle.collectData()).isEqualTo(
    {"areas": allCells, "right": [null, "0", null, null]});
}),

test('Author draws area borders',(suite) => {
  let puzzle = suite.showPuzzle("aquarium", "2x2");
  puzzle.edit();

  let border = {color: puzzle.colorSchema.gridColor, returnValue: "bold"};

  assert("Edge value before click").that(puzzle.edges[0][0][2].getValue()).isNull();

  // Click at the edge between a1 and a2.
  suite.edgeClick(puzzle, "a1-2");

  assert("Edge value after click").that(puzzle.edges[0][0][2].getValue()).isEqualTo("bold");
  assert("Edge data after click").that(puzzle.edges[0][0][2].data).isEqualTo(border);

  // Drag along the edge between b1 and b2.
  suite.dragAlongNodes(puzzle, [1, 1], [2, 1]);

  assert("Edge value after drag").that(puzzle.edges[0][1][2].getValue()).isEqualTo("bold");
  assert("Edge data after drag").that(puzzle.edges[0][1][2].data).isEqualTo(border);
  assert("Puzzle data with two areas").that(puzzle.collectData()).isEqualTo({"areas": [["a1", "b1"], ["a2", "b2"]]});

  // Second click removes the border.
  suite.edgeClick(puzzle, "a1-2");

  assert("Edge value after second click").that(puzzle.edges[0][0][2].getValue()).isNull();
  assert("Puzzle data after border is removed").that(puzzle.collectData()).isEqualTo({"areas": [["a1", "b1", "a2", "b2"]]});
}),

test('Author data collector',(suite) => {
  let puzzle = suite.showPuzzle("aquarium", "4x4");
  puzzle.edit();

  // Borders of the areas (see the diagram at the top of the file).
  // Line from the top side between b1 and c1, then to the left and down to the left side of the grid.
  suite.dragAlongNodes(puzzle, [2, 0], [2, 1], [1, 1], [1, 2], [0, 2]);
  // Line from the corner of c1 down, to the right, down and to the right side of the grid.
  suite.dragAlongNodes(puzzle, [2, 1], [2, 2], [3, 2], [3, 3], [4, 3]);
  // Line from the corner of c3 to the left and down to the bottom side of the grid.
  suite.dragAlongNodes(puzzle, [3, 3], [2, 3], [1, 3], [1, 4]);
  // Outer clues.
  ["2", "1", "2", "3"].forEach((clue, index) => puzzle.bottom[index].switchOnChooser(Number(clue) + 1));
  ["0", "3", "1", "4"].forEach((clue, index) => puzzle.right[index].switchOnChooser(Number(clue) + 1));

  assert("Puzzle data").that(puzzle.collectData()).isEqualTo(suite.CLUES);
}),

test('Author edits existing puzzle',(suite) => {
  let puzzle = suite.showPuzzle("aquarium", "4x4", suite.CLUES);
  puzzle.edit();

  assert("Bottom clue value").that(puzzle.bottom[0].getValue()).isEqualTo("2");
  assert("Right clue value").that(puzzle.right[3].getValue()).isEqualTo("4");
  assert("Border value").that(puzzle.edges[0][1][1].getValue()).isEqualTo("bold");
  assert("Puzzle data").that(puzzle.collectData()).isEqualTo(suite.CLUES);

  // Remove the border between d3 and d4 to join two areas, change one clue and remove another.
  suite.edgeClick(puzzle, "d3-2");
  puzzle.bottom[3].switchOnChooser(5);
  puzzle.right[0].switchOnChooser(0);

  assert("Puzzle data after change").that(puzzle.collectData()).isEqualTo(
    {"areas": [["a1", "b1", "a2"], ["c1", "d1", "c2", "d2", "d3", "b4", "c4", "d4"], ["b2", "a3", "b3", "c3", "a4"]],
     "bottom": ["2", "1", "2", "4"], "right": [null, "3", "1", "4"]});
}),

);
