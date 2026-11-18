aqreTestSuite = uiTestSuite("Aqre", "squarepuzzle", "squarePuzzleType",

// Puzzle from the checker tests: four square areas, numbers in a1, a3, c3 and a given cross in d4.
//     a b   c d
//   1 2 . | . .
//   2 . . | . .
//     ----+----
//   3 3 . | 1 .
//   4 . . | . x

beforeSuite((suite, cb)=> {
  suite.AREAS = [["a1", "b1", "a2", "b2"], ["c1", "d1", "c2", "d2"], ["a3", "b3", "a4", "b4"], ["c3", "d3", "c4", "d4"]];
  suite.CLUES = {"areas": suite.AREAS, "a1": "2", "a3": "3", "c3": "1", "d4": "cross"};
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
  let puzzle = suite.showPuzzle("aqre", "4x4", suite.CLUES);
  puzzle.start();

  let greyColor = puzzle.colorSchema.greyColor;
  let textColor = puzzle.colorSchema.textColor;

  assert("Empty cell chooser").that(puzzle.cells[0][1].chooserValues).isNull();
  assert("Empty cell click").that(puzzle.cells[0][1].clickSwitch).containsExactly([{}, {color: greyColor, returnValue: '1'}, {image: 'cross'}]);
  assert("Empty cell drag handler").that(puzzle.cells[0][1].drawDragHandler).isNotNull();
  assert("Empty cell drag processor").that(puzzle.cells[0][1].dragProcessor).isNotNull();
  // Cell with a number can be shaded as any other cell.
  assert("Number cell chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("Number cell click").that(puzzle.cells[0][0].clickSwitch).containsExactly([
    {text: '2', textColor: textColor},
    {text: '2', textColor: textColor, color: greyColor, returnValue: '1'},
    {text: '2', textColor: textColor, image: 'cross'}]);
  assert("Number cell drag processor").that(puzzle.cells[0][0].dragProcessor).isNotNull();
  assert("Cross cell chooser").that(puzzle.cells[3][3].chooserValues).isNull();
  assert("Cross cell click").that(puzzle.cells[3][3].clickSwitch).isNull();
  assert("Edge chooser").that(puzzle.edges[0][0][1].chooserValues).isNull();
  assert("Edge click").that(puzzle.edges[0][0][1].clickSwitch).isNull();
  assert("Edge drag").that(puzzle.edges[0][0][1].dragSwitch).isNull();
  assert("Area border click").that(puzzle.edges[0][1][1].clickSwitch).isNull();
  assert("Area border drag").that(puzzle.edges[0][1][1].dragSwitch).isNull();
}),

test('Author controllers',(suite) => {
  let puzzle = suite.showPuzzle("aqre", "4x4");
  puzzle.edit();

  let number = function(value) {
    return {text: value, textColor: puzzle.colorSchema.textColor, returnValue: value};
  }
  let border = {color: puzzle.colorSchema.gridColor, returnValue: 'bold'};

  assert("Cell chooser").that(puzzle.cells[0][0].chooserValues).containsAtLeast([{}, {image: 'cross', returnValue: 'cross'}, number('0'), number('1'), number('9'), number('20')]);
  assert("Number of items in the cell chooser").that(puzzle.cells[0][0].chooserValues.length).isEqualTo(23);
  assert("Cell click").that(puzzle.cells[0][0].clickSwitch).isNull();
  assert("Cell drag processor").that(puzzle.cells[0][0].dragProcessor).isNull();
  assert("Edge chooser").that(puzzle.edges[0][0][1].chooserValues).isNull();
  assert("Edge click").that(puzzle.edges[0][0][1].clickSwitch).containsExactly([{}, border]);
  assert("Edge drag").that(puzzle.edges[0][0][1].dragSwitch).containsExactly([{}, border]);
  assert("Horizontal edge click").that(puzzle.edges[0][0][2].clickSwitch).containsExactly([{}, border]);
  assert("Horizontal edge drag").that(puzzle.edges[0][0][2].dragSwitch).containsExactly([{}, border]);
}),

// Clue display tests
test('Show clues',(suite) => {
  let puzzle = suite.showPuzzle("aqre", "4x4", suite.CLUES);
  puzzle.start();

  let gridColor = puzzle.colorSchema.gridColor;

  assert("Number cell data").that(puzzle.cells[0][0].data).isEqualTo({text: '2', textColor: puzzle.colorSchema.textColor});
  assert("Number cell value").that(puzzle.cells[0][0].getValue()).isNull();
  assert("Cross cell data").that(puzzle.cells[3][3].data).isEqualTo({image: 'cross'});

  // The number is shown in the top left corner of the cell to be visible in the shaded cell.
  let text = puzzle.cells[0][0].elements.text;
  let center = puzzle.cells[0][0].center();
  assert("Number is to the left of the cell center").that(Number(text.attr("x")) < center.x).isEqualTo(true);
  assert("Number is above the cell center").that(Number(text.attr("y")) < center.y).isEqualTo(true);

  // Areas are shown by bold borders.
  assert("Border between b1 and c1").that(puzzle.edges[0][1][1].data.color).isEqualTo(gridColor);
  assert("Border between b2 and c2").that(puzzle.edges[1][1][1].data.color).isEqualTo(gridColor);
  assert("Border between a2 and a3").that(puzzle.edges[1][0][2].data.color).isEqualTo(gridColor);
  assert("Border between d2 and d3").that(puzzle.edges[1][3][2].data.color).isEqualTo(gridColor);
  assert("No border between a1 and b1").that(puzzle.edges[0][0][1].data.color).isNull();
  assert("No border between a1 and a2").that(puzzle.edges[0][0][2].data.color).isNull();
  assert("No border between c3 and d3").that(puzzle.edges[2][2][1].data.color).isNull();
}),

// Mouse processing tests
test('Process click to empty cell',(suite) => {
  let puzzle = suite.showPuzzle("aqre", "4x4", suite.CLUES);
  puzzle.start();

  let point = suite.cellPoint(puzzle, "b1");

  assert("Cell value before click").that(puzzle.cells[0][1].getValue()).isNull();

  suite.click(puzzle, point);

  assert("Cell value after one click").that(puzzle.cells[0][1].getValue()).isEqualTo("1");
  assert("Cell data after one click").that(puzzle.cells[0][1].data).isEqualTo({color: puzzle.colorSchema.greyColor, returnValue: "1"});

  suite.click(puzzle, point);

  assert("Cell value after two clicks").that(puzzle.cells[0][1].getValue()).isNull();
  assert("Cell data after two clicks").that(puzzle.cells[0][1].data).isEqualTo({image: "cross"});

  suite.click(puzzle, point);

  assert("Cell value after three clicks").that(puzzle.cells[0][1].getValue()).isNull();
  assert("Cell data after three clicks").that(puzzle.cells[0][1].data).isEqualTo({});
}),

test('Process click to cell with number',(suite) => {
  let puzzle = suite.showPuzzle("aqre", "4x4", suite.CLUES);
  puzzle.start();

  let textColor = puzzle.colorSchema.textColor;
  let point = suite.cellPoint(puzzle, "a3");

  suite.click(puzzle, point);

  // The number stays in the shaded cell.
  assert("Cell value after one click").that(puzzle.cells[2][0].getValue()).isEqualTo("1");
  assert("Cell data after one click").that(puzzle.cells[2][0].data).isEqualTo({text: "3", textColor: textColor, color: puzzle.colorSchema.greyColor, returnValue: "1"});

  suite.click(puzzle, point);

  assert("Cell value after two clicks").that(puzzle.cells[2][0].getValue()).isNull();
  assert("Cell data after two clicks").that(puzzle.cells[2][0].data).isEqualTo({text: "3", textColor: textColor, image: "cross"});

  suite.click(puzzle, point);

  assert("Cell value after three clicks").that(puzzle.cells[2][0].getValue()).isNull();
  assert("Cell data after three clicks").that(puzzle.cells[2][0].data).isEqualTo({text: "3", textColor: textColor});
}),

test('Process click to given cross',(suite) => {
  let puzzle = suite.showPuzzle("aqre", "4x4", suite.CLUES);
  puzzle.start();

  suite.cellClick(puzzle, "d4");

  assert("Cell value after click").that(puzzle.cells[3][3].getValue()).isNull();
  assert("Cell data after click").that(puzzle.cells[3][3].data).isEqualTo({image: "cross"});
}),

test('Given cross is kept on drag over it',(suite) => {
  let puzzle = suite.showPuzzle("aqre", "4x4", suite.CLUES);
  puzzle.start();

  // Shade c4 and drag it to the given cross in d4.
  suite.cellClick(puzzle, "c4");
  suite.drag(puzzle, suite.cellPoint(puzzle, "c4"), suite.cellPoint(puzzle, "d4"));

  assert("Cross cell data after drag of the shaded cell").that(puzzle.cells[3][3].data).isEqualTo({image: 'cross'});
  assert("Cross cell value after drag of the shaded cell").that(puzzle.cells[3][3].getValue()).isNull();

  // Drag the empty cell d3 to the given cross.
  suite.drag(puzzle, suite.cellPoint(puzzle, "d3"), suite.cellPoint(puzzle, "d4"));

  assert("Cross cell data after drag of the empty cell").that(puzzle.cells[3][3].data).isEqualTo({image: 'cross'});
  assert("Submission data").that(puzzle.collectData()).isEqualTo({"c4": "1"});
}),

test('Copy given cross by drag',(suite) => {
  let puzzle = suite.showPuzzle("aqre", "4x4", suite.CLUES);
  puzzle.start();

  // From the given cross in d4 to d3 and d2: crosses are marks, they are not submitted.
  puzzle.controller.onMouseDown(suite.mouseEvent(suite.cellPoint(puzzle, "d4")));
  puzzle.controller.onMouseMove(suite.mouseEvent(suite.cellPoint(puzzle, "d3")));
  puzzle.controller.onMouseMove(suite.mouseEvent(suite.cellPoint(puzzle, "d2")));
  puzzle.controller.onMouseUp(suite.mouseEvent(suite.cellPoint(puzzle, "d2")));

  assert("Cell d3 after drag").that(puzzle.cells[2][3].data).isEqualTo({image: 'cross'});
  assert("Cell d2 after drag").that(puzzle.cells[1][3].data).isEqualTo({image: 'cross'});
  assert("Given cross after drag").that(puzzle.cells[3][3].data).isEqualTo({image: 'cross'});
  assert("Submission data").that(puzzle.collectData()).isEqualTo({});
}),

test('Shade cells by drag',(suite) => {
  let puzzle = suite.showPuzzle("aqre", "4x4", suite.CLUES);
  puzzle.start();

  let greyColor = puzzle.colorSchema.greyColor;

  suite.cellClick(puzzle, "b1");
  // One move from the shaded b1 through b2 and b3 to the cell a3 with the number.
  suite.dragOverCells(puzzle, "b1", "b2", "b3", "a3");

  assert("Source cell value").that(puzzle.cells[0][1].getValue()).isEqualTo("1");
  assert("Value of b2").that(puzzle.cells[1][1].getValue()).isEqualTo("1");
  assert("Color of b2").that(puzzle.cells[1][1].data.color).isEqualTo(greyColor);
  assert("Value of b3").that(puzzle.cells[2][1].getValue()).isEqualTo("1");
  assert("Color of b3").that(puzzle.cells[2][1].data.color).isEqualTo(greyColor);
  assert("Value of the number cell").that(puzzle.cells[2][0].getValue()).isEqualTo("1");
  assert("Color of the number cell").that(puzzle.cells[2][0].data.color).isEqualTo(greyColor);
  assert("Text of the number cell").that(puzzle.cells[2][0].data.text).isEqualTo("3");
  assert("Cell out of the drag path").that(puzzle.cells[1][0].getValue()).isNull();

  assert("Submission data").that(puzzle.collectData()).isEqualTo({"b1": "1", "b2": "1", "a3": "1", "b3": "1"});
}),

test('Set crosses by drag',(suite) => {
  let puzzle = suite.showPuzzle("aqre", "4x4", suite.CLUES);
  puzzle.start();

  suite.cellClick(puzzle, "b1");
  suite.cellClick(puzzle, "b1");
  suite.dragOverCells(puzzle, "b1", "a1", "a2");

  assert("Source cell data").that(puzzle.cells[0][1].data).isEqualTo({image: "cross"});
  assert("Image of the number cell").that(puzzle.cells[0][0].data.image).isEqualTo("cross");
  assert("Text of the number cell").that(puzzle.cells[0][0].data.text).isEqualTo("2");
  assert("Value of the number cell").that(puzzle.cells[0][0].getValue()).isNull();
  assert("Image of a2").that(puzzle.cells[1][0].data.image).isEqualTo("cross");
  assert("Value of a2").that(puzzle.cells[1][0].getValue()).isNull();

  assert("Submission data").that(puzzle.collectData()).isEqualTo({});
}),

test('Clear cells by drag',(suite) => {
  let puzzle = suite.showPuzzle("aqre", "4x4", suite.CLUES);
  puzzle.start();

  suite.cellClick(puzzle, "a1");
  suite.cellClick(puzzle, "b1");
  suite.cellClick(puzzle, "c1");
  // Drag from the empty cell b2 clears the cells on its way.
  suite.dragOverCells(puzzle, "b2", "b1", "a1");

  assert("Value of b1").that(puzzle.cells[0][1].getValue()).isNull();
  assert("Color of b1").that(puzzle.cells[0][1].data.color).isNull();
  assert("Value of the number cell").that(puzzle.cells[0][0].getValue()).isNull();
  assert("Color of the number cell").that(puzzle.cells[0][0].data.color).isNull();
  assert("Text of the number cell").that(puzzle.cells[0][0].data.text).isEqualTo("2");
  assert("Value of the cell out of the drag path").that(puzzle.cells[0][2].getValue()).isEqualTo("1");
}),

// Data collector tests
test('Data collector',(suite) => {
  let puzzle = suite.showPuzzle("aqre", "4x4", suite.CLUES);
  puzzle.start();

  // Solution:  # # # .
  //            . . # #
  //            . # # .
  //            # # . x
  suite.cellClick(puzzle, "a1");
  suite.dragOverCells(puzzle, "a1", "b1", "c1", "c2", "d2");
  suite.cellClick(puzzle, "b3");
  suite.dragOverCells(puzzle, "b3", "c3");
  suite.dragOverCells(puzzle, "b3", "b4", "a4");
  // Crosses are not submitted.
  suite.cellClick(puzzle, "d1");
  suite.cellClick(puzzle, "d1");

  assert("Submission data").that(puzzle.collectData()).isEqualTo(
    {"a1": "1", "b1": "1", "c1": "1", "c2": "1", "d2": "1", "b3": "1", "c3": "1", "a4": "1", "b4": "1"});
}),

// Author tests
test('Author sets clues by chooser',(suite) => {
  let puzzle = suite.showPuzzle("aqre", "4x4");
  puzzle.edit();

  // Chooser items: empty, cross, 0, 1, 2, ...
  puzzle.cells[0][0].switchOnChooser(4);

  assert("Number value").that(puzzle.cells[0][0].getValue()).isEqualTo("2");
  assert("Number data").that(puzzle.cells[0][0].data).isEqualTo({text: "2", textColor: puzzle.colorSchema.textColor, returnValue: "2"});

  puzzle.cells[0][0].switchOnChooser(2);

  assert("Zero value").that(puzzle.cells[0][0].getValue()).isEqualTo("0");

  puzzle.cells[0][0].switchOnChooser(1);

  assert("Cross value").that(puzzle.cells[0][0].getValue()).isEqualTo("cross");
  assert("Cross data").that(puzzle.cells[0][0].data).isEqualTo({image: "cross", returnValue: "cross"});

  puzzle.cells[0][0].switchOnChooser(0);

  assert("Value of the cleared cell").that(puzzle.cells[0][0].getValue()).isNull();
  assert("Puzzle data").that(puzzle.collectData()).isEqualTo({"areas": [["a1", "b1", "c1", "d1", "a2", "b2", "c2", "d2", "a3", "b3", "c3", "d3", "a4", "b4", "c4", "d4"]]});
}),

test('Author draws area borders',(suite) => {
  let puzzle = suite.showPuzzle("aqre", "2x2");
  puzzle.edit();

  let border = {color: puzzle.colorSchema.gridColor, returnValue: "bold"};

  assert("Edge value before click").that(puzzle.edges[0][0][1].getValue()).isNull();
  assert("Puzzle data without borders").that(puzzle.collectData()).isEqualTo({"areas": [["a1", "b1", "a2", "b2"]]});

  // Click at the edge between a1 and b1.
  suite.edgeClick(puzzle, "a1-1");

  assert("Edge value after click").that(puzzle.edges[0][0][1].getValue()).isEqualTo("bold");
  assert("Edge data after click").that(puzzle.edges[0][0][1].data).isEqualTo(border);
  // The border doesn't split the grid yet.
  assert("Puzzle data with one border").that(puzzle.collectData()).isEqualTo({"areas": [["a1", "b1", "a2", "b2"]]});

  // Drag along the edge between a2 and b2.
  suite.dragAlongNodes(puzzle, [1, 1], [1, 2]);

  assert("Edge value after drag").that(puzzle.edges[1][0][1].getValue()).isEqualTo("bold");
  assert("Edge data after drag").that(puzzle.edges[1][0][1].data).isEqualTo(border);
  assert("Puzzle data with two areas").that(puzzle.collectData()).isEqualTo({"areas": [["a1", "a2"], ["b1", "b2"]]});

  // Second click removes the border.
  suite.edgeClick(puzzle, "a1-1");

  assert("Edge value after second click").that(puzzle.edges[0][0][1].getValue()).isNull();
  assert("Puzzle data after border is removed").that(puzzle.collectData()).isEqualTo({"areas": [["a1", "b1", "a2", "b2"]]});
}),

test('Author data collector',(suite) => {
  let puzzle = suite.showPuzzle("aqre", "4x4");
  puzzle.edit();

  // Vertical and horizontal lines in the middle of the grid, each one is drawn by one drag.
  suite.dragAlongNodes(puzzle, [2, 0], [2, 1], [2, 2], [2, 3], [2, 4]);
  suite.dragAlongNodes(puzzle, [0, 2], [1, 2], [2, 2], [3, 2], [4, 2]);
  // Numbers 2 in a1, 3 in a3, 1 in c3 and cross in d4.
  puzzle.cells[0][0].switchOnChooser(4);
  puzzle.cells[2][0].switchOnChooser(5);
  puzzle.cells[2][2].switchOnChooser(3);
  puzzle.cells[3][3].switchOnChooser(1);

  assert("Puzzle data").that(puzzle.collectData()).isEqualTo(suite.CLUES);
}),

test('Author edits existing puzzle',(suite) => {
  let puzzle = suite.showPuzzle("aqre", "4x4", suite.CLUES);
  puzzle.edit();

  assert("Number value").that(puzzle.cells[0][0].getValue()).isEqualTo("2");
  assert("Cross value").that(puzzle.cells[3][3].getValue()).isEqualTo("cross");
  assert("Border value").that(puzzle.edges[0][1][1].getValue()).isEqualTo("bold");
  assert("Puzzle data").that(puzzle.collectData()).isEqualTo(suite.CLUES);

  // Remove the border between b1 and c1 and between b2 and c2 to join two top areas.
  suite.edgeClick(puzzle, "b1-1");
  suite.edgeClick(puzzle, "b2-1");

  assert("Puzzle data after change").that(puzzle.collectData()).isEqualTo(
    {"areas": [["a1", "b1", "c1", "d1", "a2", "b2", "c2", "d2"], ["a3", "b3", "a4", "b4"], ["c3", "d3", "c4", "d4"]],
     "a1": "2", "a3": "3", "c3": "1", "d4": "cross"});
}),

);
