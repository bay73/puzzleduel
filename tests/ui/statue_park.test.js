statueParkTestSuite = uiTestSuite("Statue Park", "squarepuzzle", "squarePuzzleType",

// Puzzle from the checker tests: pentominoes L and V should be placed to the grid,
// cell with black circle is a part of pentomino, cell with white circle is not.
//     a b c d e
//   1 . . . . .
//   2 . . O . .       O - white circle
//   3 @ . . . .       @ - black circle
//   4 . . . . .
//   5 . . . . .

beforeSuite((suite, cb)=> {
  suite.CLUES = {"a3": "black_circle", "c2": "white_circle"};
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
  let puzzle = suite.showPuzzle("statue_park", "5x5-LV", suite.CLUES);
  puzzle.start();

  let greyColor = puzzle.colorSchema.greyColor;

  assert("Empty cell chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("Empty cell click").that(puzzle.cells[0][0].clickSwitch).containsExactly([{}, {color: greyColor, returnValue: '1'}, {image: 'cross'}]);
  assert("Empty cell drag handler").that(puzzle.cells[0][0].drawDragHandler).isNotNull();
  assert("Empty cell drag processor").that(puzzle.cells[0][0].dragProcessor).isNotNull();
  // Cell with black circle can be only shaded.
  assert("Black circle cell chooser").that(puzzle.cells[2][0].chooserValues).isNull();
  assert("Black circle cell click").that(puzzle.cells[2][0].clickSwitch).containsExactly([{image: 'black_circle'}, {image: 'black_circle', color: greyColor, returnValue: '1'}]);
  assert("Black circle cell drag processor").that(puzzle.cells[2][0].dragProcessor).isNotNull();
  // Cell with white circle can't be shaded.
  assert("White circle cell chooser").that(puzzle.cells[1][2].chooserValues).isNull();
  assert("White circle cell click").that(puzzle.cells[1][2].clickSwitch).isNull();
}),

test('Author controllers',(suite) => {
  let puzzle = suite.showPuzzle("statue_park", "5x5-LV");
  puzzle.edit();

  assert("Cell chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("Cell click").that(puzzle.cells[0][0].clickSwitch).containsExactly([{}, {image: 'white_circle', returnValue: 'white_circle'}, {image: 'black_circle', returnValue: 'black_circle'}]);
  assert("Cell drag handler").that(puzzle.cells[0][0].drawDragHandler).isNull();
  assert("Cell drag processor").that(puzzle.cells[0][0].dragProcessor).isNull();
}),

// Clue display tests
test('Show clues',(suite) => {
  let puzzle = suite.showPuzzle("statue_park", "5x5-LV", suite.CLUES);
  puzzle.start();

  assert("Grid rows").that(puzzle.rows).isEqualTo(5);
  assert("Grid columns").that(puzzle.cols).isEqualTo(5);
  assert("Black circle cell data").that(puzzle.cells[2][0].data).isEqualTo({image: 'black_circle'});
  assert("White circle cell data").that(puzzle.cells[1][2].data).isEqualTo({image: 'white_circle'});
  // Clues are not a part of the submission.
  assert("Black circle cell value").that(puzzle.cells[2][0].getValue()).isNull();
  assert("White circle cell value").that(puzzle.cells[1][2].getValue()).isNull();
  assert("Submission data").that(puzzle.collectData()).isEqualTo({});
}),

// Mouse processing tests
test('Process click to empty cell',(suite) => {
  let puzzle = suite.showPuzzle("statue_park", "5x5-LV", suite.CLUES);
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

test('Process click to black circle',(suite) => {
  let puzzle = suite.showPuzzle("statue_park", "5x5-LV", suite.CLUES);
  puzzle.start();

  let point = suite.cellPoint(puzzle, "a3");

  suite.click(puzzle, point);

  // The circle stays in the shaded cell.
  assert("Cell value after one click").that(puzzle.cells[2][0].getValue()).isEqualTo("1");
  assert("Cell data after one click").that(puzzle.cells[2][0].data).isEqualTo({image: "black_circle", color: puzzle.colorSchema.greyColor, returnValue: "1"});
  assert("Submission data after one click").that(puzzle.collectData()).isEqualTo({"a3": "1"});

  suite.click(puzzle, point);

  assert("Cell value after two clicks").that(puzzle.cells[2][0].getValue()).isNull();
  assert("Cell data after two clicks").that(puzzle.cells[2][0].data).isEqualTo({image: "black_circle"});
  assert("Submission data after two clicks").that(puzzle.collectData()).isEqualTo({});
}),

test('Process click to white circle',(suite) => {
  let puzzle = suite.showPuzzle("statue_park", "5x5-LV", suite.CLUES);
  puzzle.start();

  suite.cellClick(puzzle, "c2");

  assert("Cell value after click").that(puzzle.cells[1][2].getValue()).isNull();
  assert("Cell data after click").that(puzzle.cells[1][2].data).isEqualTo({image: "white_circle"});
  assert("Submission data").that(puzzle.collectData()).isEqualTo({});
}),

test('Shade cells by drag',(suite) => {
  let puzzle = suite.showPuzzle("statue_park", "5x5-LV", suite.CLUES);
  puzzle.start();

  let greyColor = puzzle.colorSchema.greyColor;

  suite.cellClick(puzzle, "a1");
  // One move from the shaded a1 down the column, the path goes through the black circle in a3.
  suite.dragOverCells(puzzle, "a1", "a2", "a3", "a4");

  assert("Source cell value").that(puzzle.cells[0][0].getValue()).isEqualTo("1");
  assert("Value of a2").that(puzzle.cells[1][0].getValue()).isEqualTo("1");
  assert("Color of a2").that(puzzle.cells[1][0].data.color).isEqualTo(greyColor);
  // Cell with black circle is shaded, the circle stays.
  assert("Value of the black circle cell").that(puzzle.cells[2][0].getValue()).isEqualTo("1");
  assert("Color of the black circle cell").that(puzzle.cells[2][0].data.color).isEqualTo(greyColor);
  assert("Image of the black circle cell").that(puzzle.cells[2][0].data.image).isEqualTo("black_circle");
  assert("Value of a4").that(puzzle.cells[3][0].getValue()).isEqualTo("1");
  assert("Color of a4").that(puzzle.cells[3][0].data.color).isEqualTo(greyColor);
  assert("Image of a4").that(puzzle.cells[3][0].data.image).isNull();
  assert("Value of the cell out of the drag path").that(puzzle.cells[4][0].getValue()).isNull();

  assert("Submission data").that(puzzle.collectData()).isEqualTo({"a1": "1", "a2": "1", "a3": "1", "a4": "1"});
}),

test('Set crosses by drag',(suite) => {
  let puzzle = suite.showPuzzle("statue_park", "5x5-LV", suite.CLUES);
  puzzle.start();

  suite.cellClick(puzzle, "b1");
  suite.cellClick(puzzle, "b1");
  suite.dragOverCells(puzzle, "b1", "c1", "d1");

  assert("Source cell data").that(puzzle.cells[0][1].data).isEqualTo({image: "cross"});
  assert("Data of c1").that(puzzle.cells[0][2].data).isEqualTo({image: "cross"});
  assert("Data of d1").that(puzzle.cells[0][3].data).isEqualTo({image: "cross"});
  assert("Submission data").that(puzzle.collectData()).isEqualTo({});
}),

test('Drag of cross to cells with circles',(suite) => {
  let puzzle = suite.showPuzzle("statue_park", "5x5-LV", suite.CLUES);
  puzzle.start();

  suite.cellClick(puzzle, "b2");
  suite.cellClick(puzzle, "b2");
  // Cross can't be placed neither to the white circle (it is already known as not shaded) nor to the black one.
  suite.dragOverCells(puzzle, "b2", "c2");
  suite.dragOverCells(puzzle, "b2", "b3", "a3");

  assert("White circle cell data").that(puzzle.cells[1][2].data.image).isEqualTo("white_circle");
  assert("White circle cell value").that(puzzle.cells[1][2].getValue()).isNull();
  assert("Black circle cell image").that(puzzle.cells[2][0].data.image).isEqualTo("black_circle");
  assert("Black circle cell value").that(puzzle.cells[2][0].getValue()).isNull();
  assert("Data of b3").that(puzzle.cells[2][1].data).isEqualTo({image: "cross"});
  assert("Submission data").that(puzzle.collectData()).isEqualTo({});
}),

// A cell with white circle is never shaded.
test('Drag of shaded cell over white circle',(suite) => {
  let puzzle = suite.showPuzzle("statue_park", "5x5-LV", suite.CLUES);
  puzzle.start();

  // Shade c1 and drag it down through the white circle in c2 to c3.
  suite.cellClick(puzzle, "c1");
  suite.dragOverCells(puzzle, "c1", "c2", "c3");

  assert("White circle cell image").that(puzzle.cells[1][2].data.image).isEqualTo("white_circle");
  assert("White circle cell color").that(puzzle.cells[1][2].data.color).isNull();
  assert("White circle cell value").that(puzzle.cells[1][2].getValue()).isNull();
  // The drag continues after the circle.
  assert("Value of c3").that(puzzle.cells[2][2].getValue()).isEqualTo("1");
  assert("Submission data").that(puzzle.collectData()).isEqualTo({"c1": "1", "c3": "1"});
}),

test('Drag of shaded cell over black circle',(suite) => {
  let puzzle = suite.showPuzzle("statue_park", "5x5-LV", suite.CLUES);
  puzzle.start();

  // Shade a2 and drag it down through the black circle in a3 to a4.
  suite.cellClick(puzzle, "a2");
  suite.dragOverCells(puzzle, "a2", "a3", "a4");

  assert("Black circle cell image").that(puzzle.cells[2][0].data.image).isEqualTo("black_circle");
  assert("Black circle cell color").that(puzzle.cells[2][0].data.color).isEqualTo(puzzle.colorSchema.greyColor);
  assert("Black circle cell value").that(puzzle.cells[2][0].getValue()).isEqualTo("1");
  assert("Submission data").that(puzzle.collectData()).isEqualTo({"a2": "1", "a3": "1", "a4": "1"});
}),

test('Clear cells by drag',(suite) => {
  let puzzle = suite.showPuzzle("statue_park", "5x5-LV", suite.CLUES);
  puzzle.start();

  suite.cellClick(puzzle, "a2");
  suite.cellClick(puzzle, "a3");
  suite.cellClick(puzzle, "a4");
  // Drag from the empty cell a5 clears the cells on its way including the cell with black circle.
  suite.dragOverCells(puzzle, "a5", "a4", "a3");

  assert("Value of a4").that(puzzle.cells[3][0].getValue()).isNull();
  assert("Color of a4").that(puzzle.cells[3][0].data.color).isNull();
  assert("Value of the black circle cell").that(puzzle.cells[2][0].getValue()).isNull();
  assert("Color of the black circle cell").that(puzzle.cells[2][0].data.color).isNull();
  assert("Image of the black circle cell").that(puzzle.cells[2][0].data.image).isEqualTo("black_circle");
  assert("Submission data").that(puzzle.collectData()).isEqualTo({"a2": "1"});
}),

test('Drag from clue cells does not shade',(suite) => {
  let puzzle = suite.showPuzzle("statue_park", "5x5-LV", suite.CLUES);
  puzzle.start();

  suite.dragOverCells(puzzle, "a3", "b3");
  suite.dragOverCells(puzzle, "c2", "d2");

  assert("Value of b3").that(puzzle.cells[2][1].getValue()).isNull();
  assert("Color of b3").that(puzzle.cells[2][1].data.color).isNull();
  assert("Image of b3").that(puzzle.cells[2][1].data.image).isNull();
  assert("Value of d2").that(puzzle.cells[1][3].getValue()).isNull();
  assert("Color of d2").that(puzzle.cells[1][3].data.color).isNull();
  assert("Image of d2").that(puzzle.cells[1][3].data.image).isNull();
  assert("Submission data").that(puzzle.collectData()).isEqualTo({});
}),

// Data collector tests
test('Data collector',(suite) => {
  let puzzle = suite.showPuzzle("statue_park", "5x5-LV", suite.CLUES);
  puzzle.start();

  // Solution:  # # . . .
  //            # . O . .
  //            @ . # # #      @ - shaded cell with black circle
  //            # . . . #
  //            . . . . #
  suite.cellClick(puzzle, "a1");
  suite.dragOverCells(puzzle, "a1", "b1");
  suite.dragOverCells(puzzle, "a1", "a2", "a3", "a4");
  suite.cellClick(puzzle, "c3");
  suite.dragOverCells(puzzle, "c3", "d3", "e3", "e4", "e5");
  // Crosses are not submitted.
  suite.cellClick(puzzle, "b2");
  suite.cellClick(puzzle, "b2");

  assert("Submission data").that(puzzle.collectData()).isEqualTo(
    {"a1": "1", "b1": "1", "a2": "1", "a3": "1", "a4": "1", "c3": "1", "d3": "1", "e3": "1", "e4": "1", "e5": "1"});
}),

// Author tests
test('Author sets circles by click',(suite) => {
  let puzzle = suite.showPuzzle("statue_park", "5x5-LV");
  puzzle.edit();

  let point = suite.cellPoint(puzzle, "b1");

  suite.click(puzzle, point);

  assert("Cell value after one click").that(puzzle.cells[0][1].getValue()).isEqualTo("white_circle");
  assert("Cell data after one click").that(puzzle.cells[0][1].data).isEqualTo({image: "white_circle", returnValue: "white_circle"});
  assert("Puzzle data after one click").that(puzzle.collectData()).isEqualTo({"b1": "white_circle"});

  suite.click(puzzle, point);

  assert("Cell value after two clicks").that(puzzle.cells[0][1].getValue()).isEqualTo("black_circle");
  assert("Cell data after two clicks").that(puzzle.cells[0][1].data).isEqualTo({image: "black_circle", returnValue: "black_circle"});
  assert("Puzzle data after two clicks").that(puzzle.collectData()).isEqualTo({"b1": "black_circle"});

  suite.click(puzzle, point);

  assert("Cell value after three clicks").that(puzzle.cells[0][1].getValue()).isNull();
  assert("Puzzle data after three clicks").that(puzzle.collectData()).isEqualTo({});
}),

test('Author data collector',(suite) => {
  let puzzle = suite.showPuzzle("statue_park", "5x5-LV");
  puzzle.edit();

  // Black circle in a3 (two clicks) and white circle in c2 (one click).
  suite.cellClick(puzzle, "a3");
  suite.cellClick(puzzle, "a3");
  suite.cellClick(puzzle, "c2");

  assert("Puzzle data").that(puzzle.collectData()).isEqualTo(suite.CLUES);
}),

test('Author edits existing puzzle',(suite) => {
  let puzzle = suite.showPuzzle("statue_park", "5x5-LV", suite.CLUES);
  puzzle.edit();

  assert("Black circle value").that(puzzle.cells[2][0].getValue()).isEqualTo("black_circle");
  assert("White circle value").that(puzzle.cells[1][2].getValue()).isEqualTo("white_circle");
  assert("Puzzle data").that(puzzle.collectData()).isEqualTo(suite.CLUES);

  // Remove the black circle and change the white one to black.
  suite.cellClick(puzzle, "a3");
  suite.cellClick(puzzle, "c2");

  assert("Puzzle data after change").that(puzzle.collectData()).isEqualTo({"c2": "black_circle"});
}),

);
