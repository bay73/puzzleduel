kuromasuTestSuite = uiTestSuite("Kuromasu", "squarepuzzle", "squarePuzzleType",

// Puzzle from the checker tests: numbers of cells visible from the cell.
//    a b c d
//  1 . . . 2
//  2 . 7 . .
//  3 . . 4 .
//  4 . . . .
// Some tests use the same puzzle with a given cross in a4.

beforeSuite((suite, cb)=> {
  suite.CLUES = {"d1": "2", "b2": "7", "c3": "4"};
  suite.CLUES_WITH_CROSS = {"d1": "2", "b2": "7", "c3": "4", "a4": "cross"};
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
  let puzzle = suite.showPuzzle("kuromasu", "4x4", suite.CLUES_WITH_CROSS);
  puzzle.start();

  assert("Empty cell chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("Empty cell click").that(puzzle.cells[0][0].clickSwitch).containsExactly([{}, {color: puzzle.colorSchema.greyColor, returnValue: '1'}, {image: 'cross'}]);
  assert("Empty cell drag handler").that(puzzle.cells[0][0].drawDragHandler).isNotNull();
  assert("Empty cell drag processor").that(puzzle.cells[0][0].dragProcessor).isNotNull();
  // Solver can mark the number as used, the mark is not submitted.
  assert("Number cell chooser").that(puzzle.cells[0][3].chooserValues).isNull();
  assert("Number cell click").that(puzzle.cells[0][3].clickSwitch).containsExactly([{text: '2'}, {text: '2', image: 'cross'}]);
  assert("Number cell drag handler").that(puzzle.cells[0][3].drawDragHandler).isNotNull();
  assert("Number cell drag processor").that(puzzle.cells[0][3].dragProcessor).isNotNull();
  assert("Cross cell chooser").that(puzzle.cells[3][0].chooserValues).isNull();
  assert("Cross cell has no items to submit").that(puzzle.cells[3][0].clickSwitch.filter(item => item.returnValue).length).isEqualTo(0);
}),

test('Author controllers',(suite) => {
  let puzzle = suite.showPuzzle("kuromasu", "4x4");
  puzzle.edit();

  assert("Cell chooser").that(puzzle.cells[0][0].chooserValues).containsAtLeast([{}, {image: 'cross', returnValue: 'cross'}, {text: '1', returnValue: '1'}, {text: '2', returnValue: '2'}, {text: '10', returnValue: '10'}, {text: '29', returnValue: '29'}]);
  assert("Number of items in the cell chooser").that(puzzle.cells[0][0].chooserValues.length).isEqualTo(31);
  assert("Cell click").that(puzzle.cells[0][0].clickSwitch).isNull();
  assert("Cell drag handler").that(puzzle.cells[0][0].drawDragHandler).isNull();
  assert("Cell drag processor").that(puzzle.cells[0][0].dragProcessor).isNull();
}),

// Clue display tests
test('Show clues',(suite) => {
  let puzzle = suite.showPuzzle("kuromasu", "4x4", suite.CLUES_WITH_CROSS);
  puzzle.start();

  assert("Number cell data").that(puzzle.cells[0][3].data).isEqualTo({text: '2'});
  assert("Number cell value").that(puzzle.cells[0][3].getValue()).isNull();
  assert("Cross cell data").that(puzzle.cells[3][0].data).isEqualTo({image: 'cross'});
  assert("Cross cell value").that(puzzle.cells[3][0].getValue()).isNull();
  // Clues are not a part of the submission.
  assert("Submission data").that(puzzle.collectData()).isEqualTo({});
}),

// Mouse processing tests
test('Process click to empty cell',(suite) => {
  let puzzle = suite.showPuzzle("kuromasu", "4x4", suite.CLUES);
  puzzle.start();

  let point = suite.cellPoint(puzzle, "a1");

  assert("Cell value before click").that(puzzle.cells[0][0].getValue()).isNull();

  suite.click(puzzle, point);

  assert("Cell value after one click").that(puzzle.cells[0][0].getValue()).isEqualTo("1");
  assert("Cell data after one click").that(puzzle.cells[0][0].data).isEqualTo({color: puzzle.colorSchema.greyColor, returnValue: "1"});

  suite.click(puzzle, point);

  assert("Cell value after two clicks").that(puzzle.cells[0][0].getValue()).isNull();
  assert("Cell data after two clicks").that(puzzle.cells[0][0].data).isEqualTo({image: "cross"});

  suite.click(puzzle, point);

  assert("Cell value after three clicks").that(puzzle.cells[0][0].getValue()).isNull();
  assert("Cell data after three clicks").that(puzzle.cells[0][0].data).isEqualTo({});
}),

test('Process click to number cell',(suite) => {
  let puzzle = suite.showPuzzle("kuromasu", "4x4", suite.CLUES);
  puzzle.start();

  let point = suite.cellPoint(puzzle, "d1");

  suite.click(puzzle, point);

  // The number is marked by cross, it can not be shaded.
  assert("Cell data after one click").that(puzzle.cells[0][3].data).isEqualTo({text: "2", image: "cross"});
  assert("Cell value after one click").that(puzzle.cells[0][3].getValue()).isNull();

  suite.click(puzzle, point);

  assert("Cell data after two clicks").that(puzzle.cells[0][3].data).isEqualTo({text: "2"});
  assert("Cell value after two clicks").that(puzzle.cells[0][3].getValue()).isNull();

  suite.click(puzzle, point);

  assert("Submission data").that(puzzle.collectData()).isEqualTo({});
}),

test('Process click to given cross',(suite) => {
  let puzzle = suite.showPuzzle("kuromasu", "4x4", suite.CLUES_WITH_CROSS);
  puzzle.start();

  suite.cellClick(puzzle, "a4");

  assert("Cell data after click").that(puzzle.cells[3][0].data).isEqualTo({image: "cross"});
  assert("Cell value after click").that(puzzle.cells[3][0].getValue()).isNull();

  suite.cellClick(puzzle, "a4");

  assert("Cell data after two clicks").that(puzzle.cells[3][0].data).isEqualTo({image: "cross"});
  assert("Submission data").that(puzzle.collectData()).isEqualTo({});
}),

test('Shade cells by drag',(suite) => {
  let puzzle = suite.showPuzzle("kuromasu", "4x4", suite.CLUES);
  puzzle.start();

  let greyColor = puzzle.colorSchema.greyColor;

  suite.cellClick(puzzle, "c1");
  // One move from the shaded c1, the path goes through the number cell b2.
  suite.dragOverCells(puzzle, "c1", "c2", "b2", "a2");

  assert("Source cell value").that(puzzle.cells[0][2].getValue()).isEqualTo("1");
  assert("Value of c2").that(puzzle.cells[1][2].getValue()).isEqualTo("1");
  assert("Color of c2").that(puzzle.cells[1][2].data.color).isEqualTo(greyColor);
  assert("Value of a2").that(puzzle.cells[1][0].getValue()).isEqualTo("1");
  assert("Color of a2").that(puzzle.cells[1][0].data.color).isEqualTo(greyColor);
  // Number cell is not changed.
  assert("Number cell data").that(puzzle.cells[1][1].data).isEqualTo({text: "7"});
  assert("Number cell value").that(puzzle.cells[1][1].getValue()).isNull();

  assert("Submission data").that(puzzle.collectData()).isEqualTo({"c1": "1", "a2": "1", "c2": "1"});
}),

test('Set crosses by drag from number cell',(suite) => {
  let puzzle = suite.showPuzzle("kuromasu", "4x4", suite.CLUES);
  puzzle.start();

  // Cells around the number are marked as not shaded by one move from the number cell.
  suite.dragOverCells(puzzle, "b2", "b1", "a1");

  assert("Image of b1").that(puzzle.cells[0][1].data.image).isEqualTo("cross");
  assert("Text of b1").that(puzzle.cells[0][1].data.text).isNull();
  assert("Value of b1").that(puzzle.cells[0][1].getValue()).isNull();
  assert("Image of a1").that(puzzle.cells[0][0].data.image).isEqualTo("cross");
  assert("Text of a1").that(puzzle.cells[0][0].data.text).isNull();
  assert("Value of a1").that(puzzle.cells[0][0].getValue()).isNull();
  assert("Number cell data").that(puzzle.cells[1][1].data).isEqualTo({text: "7"});
  assert("Submission data").that(puzzle.collectData()).isEqualTo({});
}),

test('Set crosses by drag from cell with cross',(suite) => {
  let puzzle = suite.showPuzzle("kuromasu", "4x4", suite.CLUES);
  puzzle.start();

  suite.cellClick(puzzle, "a3");
  suite.cellClick(puzzle, "a3");
  suite.dragOverCells(puzzle, "a3", "b3", "b4");

  assert("Source cell data").that(puzzle.cells[2][0].data).isEqualTo({image: "cross"});
  assert("Data of b3").that(puzzle.cells[2][1].data).isEqualTo({image: "cross"});
  assert("Data of b4").that(puzzle.cells[3][1].data).isEqualTo({image: "cross"});
  assert("Submission data").that(puzzle.collectData()).isEqualTo({});
}),

test('Clear cells by drag',(suite) => {
  let puzzle = suite.showPuzzle("kuromasu", "4x4", suite.CLUES);
  puzzle.start();

  suite.cellClick(puzzle, "d2");
  suite.cellClick(puzzle, "d3");
  suite.cellClick(puzzle, "d4");
  // Drag from the empty cell c4 clears the cells on its way.
  suite.dragOverCells(puzzle, "c4", "d4", "d3");

  assert("Value of d4").that(puzzle.cells[3][3].getValue()).isNull();
  assert("Color of d4").that(puzzle.cells[3][3].data.color).isNull();
  assert("Value of d3").that(puzzle.cells[2][3].getValue()).isNull();
  assert("Color of d3").that(puzzle.cells[2][3].data.color).isNull();
  assert("Submission data").that(puzzle.collectData()).isEqualTo({"d2": "1"});
}),

// Data collector tests
test('Data collector',(suite) => {
  let puzzle = suite.showPuzzle("kuromasu", "4x4", suite.CLUES);
  puzzle.start();

  // Solution:  . . # 2
  //            . 7 . .
  //            # . 4 #
  //            . . . .
  suite.cellClick(puzzle, "c1");
  suite.cellClick(puzzle, "a3");
  suite.cellClick(puzzle, "d3");
  // Crosses are not submitted.
  suite.cellClick(puzzle, "a1");
  suite.cellClick(puzzle, "a1");

  assert("Submission data").that(puzzle.collectData()).isEqualTo(
    {"c1": "1", "a3": "1", "d3": "1"});
}),

// Author tests
test('Author sets clues by chooser',(suite) => {
  let puzzle = suite.showPuzzle("kuromasu", "4x4");
  puzzle.edit();

  // Chooser items: empty, cross, 1, 2, ...
  puzzle.cells[0][0].switchOnChooser(13);

  assert("Number value").that(puzzle.cells[0][0].getValue()).isEqualTo("12");
  assert("Number data").that(puzzle.cells[0][0].data).isEqualTo({text: "12", returnValue: "12"});
  assert("Puzzle data with number").that(puzzle.collectData()).isEqualTo({"a1": "12"});

  puzzle.cells[0][0].switchOnChooser(1);

  assert("Cross value").that(puzzle.cells[0][0].getValue()).isEqualTo("cross");
  assert("Cross data").that(puzzle.cells[0][0].data).isEqualTo({image: "cross", returnValue: "cross"});
  assert("Puzzle data with cross").that(puzzle.collectData()).isEqualTo({"a1": "cross"});

  puzzle.cells[0][0].switchOnChooser(0);

  assert("Value of the cleared cell").that(puzzle.cells[0][0].getValue()).isNull();
  assert("Puzzle data after clue is removed").that(puzzle.collectData()).isEqualTo({});
}),

test('Author data collector',(suite) => {
  let puzzle = suite.showPuzzle("kuromasu", "4x4");
  puzzle.edit();

  // number 2 in d1, number 7 in b2, number 4 in c3, cross in a4.
  puzzle.cells[0][3].switchOnChooser(3);
  puzzle.cells[1][1].switchOnChooser(8);
  puzzle.cells[2][2].switchOnChooser(5);
  puzzle.cells[3][0].switchOnChooser(1);

  assert("Puzzle data").that(puzzle.collectData()).isEqualTo(suite.CLUES_WITH_CROSS);
}),

test('Author edits existing puzzle',(suite) => {
  let puzzle = suite.showPuzzle("kuromasu", "4x4", suite.CLUES);
  puzzle.edit();

  assert("Number value").that(puzzle.cells[0][3].getValue()).isEqualTo("2");
  assert("Puzzle data").that(puzzle.collectData()).isEqualTo(suite.CLUES);

  // Change the number in b2 to 8 and remove the clue in c3.
  puzzle.cells[1][1].switchOnChooser(9);
  puzzle.cells[2][2].switchOnChooser(0);

  assert("Puzzle data after change").that(puzzle.collectData()).isEqualTo({"d1": "2", "b2": "8"});
}),

);
