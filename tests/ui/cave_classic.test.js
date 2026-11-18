caveClassicTestSuite = uiTestSuite("Cave", "squarepuzzle", "squarePuzzleType",

// Puzzle from the checker tests: black cell a1, numbers and a given cross in b2.
//    a b c d
//  1 # . . .
//  2 . x 5 .
//  3 3 . . .
//  4 . . . 2

beforeSuite((suite, cb)=> {
  suite.CLUES = {"a1": "black", "b2": "cross", "c2": "5", "a3": "3", "d4": "2"};
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
  let puzzle = suite.showPuzzle("cave_classic", "4x4", suite.CLUES);
  puzzle.start();

  assert("Empty cell chooser").that(puzzle.cells[0][1].chooserValues).isNull();
  assert("Empty cell click").that(puzzle.cells[0][1].clickSwitch).containsExactly([{}, {color: puzzle.colorSchema.greyColor, returnValue: 'black'}, {image: 'cross'}]);
  assert("Empty cell drag handler").that(puzzle.cells[0][1].drawDragHandler).isNotNull();
  assert("Empty cell drag processor").that(puzzle.cells[0][1].dragProcessor).isNotNull();
  // Solver can mark the number as used, the mark is not submitted.
  assert("Number cell chooser").that(puzzle.cells[1][2].chooserValues).isNull();
  assert("Number cell click").that(puzzle.cells[1][2].clickSwitch).containsExactly([{text: '5'}, {text: '5', image: 'cross'}]);
  assert("Number cell drag handler").that(puzzle.cells[1][2].drawDragHandler).isNotNull();
  assert("Number cell drag processor").that(puzzle.cells[1][2].dragProcessor).isNotNull();
  assert("Black clue cell chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("Black clue cell has no items to submit").that(puzzle.cells[0][0].clickSwitch.filter(item => item.returnValue).length).isEqualTo(0);
  assert("Cross cell chooser").that(puzzle.cells[1][1].chooserValues).isNull();
  assert("Cross cell has no items to submit").that(puzzle.cells[1][1].clickSwitch.filter(item => item.returnValue).length).isEqualTo(0);
}),

test('Author controllers',(suite) => {
  let puzzle = suite.showPuzzle("cave_classic", "4x4");
  puzzle.edit();

  assert("Cell chooser").that(puzzle.cells[0][0].chooserValues).containsAtLeast([{}, {image: 'cross', returnValue: 'cross'}, {color: puzzle.colorSchema.clueColor, returnValue: 'black'}, {text: '1', returnValue: '1'}, {text: '2', returnValue: '2'}, {text: '10', returnValue: '10'}, {text: '29', returnValue: '29'}]);
  assert("Number of items in the cell chooser").that(puzzle.cells[0][0].chooserValues.length).isEqualTo(32);
  assert("Cell click").that(puzzle.cells[0][0].clickSwitch).isNull();
  assert("Cell drag handler").that(puzzle.cells[0][0].drawDragHandler).isNull();
  assert("Cell drag processor").that(puzzle.cells[0][0].dragProcessor).isNull();
}),

// Clue display tests
test('Show clues',(suite) => {
  let puzzle = suite.showPuzzle("cave_classic", "4x4", suite.CLUES);
  puzzle.start();

  assert("Number cell data").that(puzzle.cells[1][2].data).isEqualTo({text: '5'});
  assert("Number cell value").that(puzzle.cells[1][2].getValue()).isNull();
  assert("Black clue cell data").that(puzzle.cells[0][0].data).isEqualTo({color: puzzle.colorSchema.clueColor});
  assert("Black clue cell value").that(puzzle.cells[0][0].getValue()).isNull();
  assert("Cross cell data").that(puzzle.cells[1][1].data).isEqualTo({image: 'cross'});
  assert("Cross cell value").that(puzzle.cells[1][1].getValue()).isNull();
  // Clues are not a part of the submission.
  assert("Submission data").that(puzzle.collectData()).isEqualTo({});
}),

// Mouse processing tests
test('Process click to empty cell',(suite) => {
  let puzzle = suite.showPuzzle("cave_classic", "4x4", suite.CLUES);
  puzzle.start();

  let point = suite.cellPoint(puzzle, "b1");

  assert("Cell value before click").that(puzzle.cells[0][1].getValue()).isNull();

  suite.click(puzzle, point);

  assert("Cell value after one click").that(puzzle.cells[0][1].getValue()).isEqualTo("black");
  assert("Cell data after one click").that(puzzle.cells[0][1].data).isEqualTo({color: puzzle.colorSchema.greyColor, returnValue: "black"});

  suite.click(puzzle, point);

  assert("Cell value after two clicks").that(puzzle.cells[0][1].getValue()).isNull();
  assert("Cell data after two clicks").that(puzzle.cells[0][1].data).isEqualTo({image: "cross"});

  suite.click(puzzle, point);

  assert("Cell value after three clicks").that(puzzle.cells[0][1].getValue()).isNull();
  assert("Cell data after three clicks").that(puzzle.cells[0][1].data).isEqualTo({});
}),

test('Process click to number cell',(suite) => {
  let puzzle = suite.showPuzzle("cave_classic", "4x4", suite.CLUES);
  puzzle.start();

  let point = suite.cellPoint(puzzle, "c2");

  suite.click(puzzle, point);

  // The number is marked by cross, it can not be shaded.
  assert("Cell data after one click").that(puzzle.cells[1][2].data).isEqualTo({text: "5", image: "cross"});
  assert("Cell value after one click").that(puzzle.cells[1][2].getValue()).isNull();

  suite.click(puzzle, point);

  assert("Cell data after two clicks").that(puzzle.cells[1][2].data).isEqualTo({text: "5"});
  assert("Cell value after two clicks").that(puzzle.cells[1][2].getValue()).isNull();

  suite.click(puzzle, point);

  assert("Submission data").that(puzzle.collectData()).isEqualTo({});
}),

test('Process click to black clue cell',(suite) => {
  let puzzle = suite.showPuzzle("cave_classic", "4x4", suite.CLUES);
  puzzle.start();

  suite.cellClick(puzzle, "a1");

  assert("Cell color after click").that(puzzle.cells[0][0].data.color).isEqualTo(puzzle.colorSchema.clueColor);
  assert("Cell value after click").that(puzzle.cells[0][0].getValue()).isNull();
  assert("Submission data").that(puzzle.collectData()).isEqualTo({});
}),

test('Process click to given cross',(suite) => {
  let puzzle = suite.showPuzzle("cave_classic", "4x4", suite.CLUES);
  puzzle.start();

  suite.cellClick(puzzle, "b2");

  assert("Cell data after click").that(puzzle.cells[1][1].data).isEqualTo({image: "cross"});
  assert("Cell value after click").that(puzzle.cells[1][1].getValue()).isNull();

  suite.cellClick(puzzle, "b2");

  assert("Cell data after two clicks").that(puzzle.cells[1][1].data).isEqualTo({image: "cross"});
  assert("Submission data").that(puzzle.collectData()).isEqualTo({});
}),

test('Shade cells by drag',(suite) => {
  let puzzle = suite.showPuzzle("cave_classic", "4x4", suite.CLUES);
  puzzle.start();

  let greyColor = puzzle.colorSchema.greyColor;

  suite.cellClick(puzzle, "d1");
  // One move from the shaded d1, the path goes through the number cell c2.
  suite.dragOverCells(puzzle, "d1", "d2", "c2", "c1");

  assert("Source cell value").that(puzzle.cells[0][3].getValue()).isEqualTo("black");
  assert("Value of d2").that(puzzle.cells[1][3].getValue()).isEqualTo("black");
  assert("Color of d2").that(puzzle.cells[1][3].data.color).isEqualTo(greyColor);
  assert("Value of c1").that(puzzle.cells[0][2].getValue()).isEqualTo("black");
  assert("Color of c1").that(puzzle.cells[0][2].data.color).isEqualTo(greyColor);
  // Number cell is not changed.
  assert("Number cell data").that(puzzle.cells[1][2].data).isEqualTo({text: "5"});
  assert("Number cell value").that(puzzle.cells[1][2].getValue()).isNull();

  assert("Submission data").that(puzzle.collectData()).isEqualTo({"c1": "black", "d1": "black", "d2": "black"});
}),

test('Set crosses by drag from number cell',(suite) => {
  let puzzle = suite.showPuzzle("cave_classic", "4x4", suite.CLUES);
  puzzle.start();

  // Cells around the number are marked as not shaded by one move from the number cell.
  suite.dragOverCells(puzzle, "c2", "c3", "d3");

  assert("Image of c3").that(puzzle.cells[2][2].data.image).isEqualTo("cross");
  assert("Text of c3").that(puzzle.cells[2][2].data.text).isNull();
  assert("Value of c3").that(puzzle.cells[2][2].getValue()).isNull();
  assert("Image of d3").that(puzzle.cells[2][3].data.image).isEqualTo("cross");
  assert("Text of d3").that(puzzle.cells[2][3].data.text).isNull();
  assert("Value of d3").that(puzzle.cells[2][3].getValue()).isNull();
  assert("Number cell data").that(puzzle.cells[1][2].data).isEqualTo({text: "5"});
  assert("Submission data").that(puzzle.collectData()).isEqualTo({});
}),

test('Set crosses by drag from cell with cross',(suite) => {
  let puzzle = suite.showPuzzle("cave_classic", "4x4", suite.CLUES);
  puzzle.start();

  suite.cellClick(puzzle, "b3");
  suite.cellClick(puzzle, "b3");
  suite.dragOverCells(puzzle, "b3", "b4", "c4");

  assert("Source cell data").that(puzzle.cells[2][1].data).isEqualTo({image: "cross"});
  assert("Data of b4").that(puzzle.cells[3][1].data).isEqualTo({image: "cross"});
  assert("Data of c4").that(puzzle.cells[3][2].data).isEqualTo({image: "cross"});
  assert("Submission data").that(puzzle.collectData()).isEqualTo({});
}),

test('Clear cells by drag',(suite) => {
  let puzzle = suite.showPuzzle("cave_classic", "4x4", suite.CLUES);
  puzzle.start();

  suite.cellClick(puzzle, "b3");
  suite.cellClick(puzzle, "b4");
  suite.cellClick(puzzle, "c4");
  // Drag from the empty cell c3 clears the cells on its way.
  suite.dragOverCells(puzzle, "c3", "b3", "b4");

  assert("Value of b3").that(puzzle.cells[2][1].getValue()).isNull();
  assert("Color of b3").that(puzzle.cells[2][1].data.color).isNull();
  assert("Value of b4").that(puzzle.cells[3][1].getValue()).isNull();
  assert("Color of b4").that(puzzle.cells[3][1].data.color).isNull();
  assert("Submission data").that(puzzle.collectData()).isEqualTo({"c4": "black"});
}),

// Cells shaded by drag from a given black cell are the same as cells shaded by click: they are submitted.
test('Drag from given black cell shades cells',(suite) => {
  let puzzle = suite.showPuzzle("cave_classic", "4x4", {"a1": "black", "d1": "3"});
  puzzle.start();

  // One drag from the given black cell a1 down to a2 and a3.
  puzzle.controller.onMouseDown(suite.mouseEvent(suite.cellPoint(puzzle, "a1")));
  puzzle.controller.onMouseMove(suite.mouseEvent(suite.cellPoint(puzzle, "a2")));
  puzzle.controller.onMouseMove(suite.mouseEvent(suite.cellPoint(puzzle, "a3")));
  puzzle.controller.onMouseUp(suite.mouseEvent(suite.cellPoint(puzzle, "a3")));

  assert("Given black cell data").that(puzzle.cells[0][0].data).isEqualTo({color: puzzle.colorSchema.clueColor});
  assert("Value of a2").that(puzzle.cells[1][0].getValue()).isEqualTo("black");
  assert("Color of a2").that(puzzle.cells[1][0].data.color).isEqualTo(puzzle.colorSchema.greyColor);
  assert("Value of a3").that(puzzle.cells[2][0].getValue()).isEqualTo("black");
  assert("Submission data").that(puzzle.collectData()).isEqualTo({"a2": "black", "a3": "black"});

  // The shaded cell can be changed by click as usual: to cross and then to empty.
  suite.cellClick(puzzle, "a2");

  assert("Data of a2 after click").that(puzzle.cells[1][0].data).isEqualTo({image: 'cross'});
  assert("Submission data after click").that(puzzle.collectData()).isEqualTo({"a3": "black"});
}),

// Data collector tests
test('Data collector',(suite) => {
  let puzzle = suite.showPuzzle("cave_classic", "4x4", suite.CLUES);
  puzzle.start();

  // Solution:  # # . #
  //            . x 5 #
  //            3 # . .
  //            . # # 2
  suite.cellClick(puzzle, "b1");
  suite.cellClick(puzzle, "d1");
  suite.dragOverCells(puzzle, "d1", "d2");
  suite.cellClick(puzzle, "b3");
  suite.dragOverCells(puzzle, "b3", "b4", "c4");
  // Crosses are not submitted.
  suite.cellClick(puzzle, "c1");
  suite.cellClick(puzzle, "c1");

  assert("Submission data").that(puzzle.collectData()).isEqualTo(
    {"b1": "black", "d1": "black", "d2": "black", "b3": "black", "b4": "black", "c4": "black"});
}),

// Author tests
test('Author sets clues by chooser',(suite) => {
  let puzzle = suite.showPuzzle("cave_classic", "4x4");
  puzzle.edit();

  // Chooser items: empty, cross, black cell, 1, 2, ...
  puzzle.cells[0][0].switchOnChooser(14);

  assert("Number value").that(puzzle.cells[0][0].getValue()).isEqualTo("12");
  assert("Number data").that(puzzle.cells[0][0].data).isEqualTo({text: "12", returnValue: "12"});
  assert("Puzzle data with number").that(puzzle.collectData()).isEqualTo({"a1": "12"});

  puzzle.cells[0][0].switchOnChooser(1);

  assert("Cross value").that(puzzle.cells[0][0].getValue()).isEqualTo("cross");
  assert("Cross data").that(puzzle.cells[0][0].data).isEqualTo({image: "cross", returnValue: "cross"});
  assert("Puzzle data with cross").that(puzzle.collectData()).isEqualTo({"a1": "cross"});

  puzzle.cells[0][0].switchOnChooser(2);

  assert("Black cell value").that(puzzle.cells[0][0].getValue()).isEqualTo("black");
  assert("Black cell data").that(puzzle.cells[0][0].data).isEqualTo({color: puzzle.colorSchema.clueColor, returnValue: "black"});
  assert("Puzzle data with black cell").that(puzzle.collectData()).isEqualTo({"a1": "black"});

  puzzle.cells[0][0].switchOnChooser(0);

  assert("Value of the cleared cell").that(puzzle.cells[0][0].getValue()).isNull();
  assert("Puzzle data after clue is removed").that(puzzle.collectData()).isEqualTo({});
}),

test('Author data collector',(suite) => {
  let puzzle = suite.showPuzzle("cave_classic", "4x4");
  puzzle.edit();

  // black cell in a1, cross in b2, number 5 in c2, number 3 in a3, number 2 in d4.
  puzzle.cells[0][0].switchOnChooser(2);
  puzzle.cells[1][1].switchOnChooser(1);
  puzzle.cells[1][2].switchOnChooser(7);
  puzzle.cells[2][0].switchOnChooser(5);
  puzzle.cells[3][3].switchOnChooser(4);

  assert("Puzzle data").that(puzzle.collectData()).isEqualTo(suite.CLUES);
}),

test('Author edits existing puzzle',(suite) => {
  let puzzle = suite.showPuzzle("cave_classic", "4x4", suite.CLUES);
  puzzle.edit();

  assert("Number value").that(puzzle.cells[1][2].getValue()).isEqualTo("5");
  assert("Puzzle data").that(puzzle.collectData()).isEqualTo(suite.CLUES);

  // Change the number in c2 to 6 and remove the clue in b2.
  puzzle.cells[1][2].switchOnChooser(8);
  puzzle.cells[1][1].switchOnChooser(0);

  assert("Puzzle data after change").that(puzzle.collectData()).isEqualTo({"a1": "black", "c2": "6", "a3": "3", "d4": "2"});
}),

);
