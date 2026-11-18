canalViewTestSuite = uiTestSuite("Canal View", "squarepuzzle", "squarePuzzleType",

// Puzzle from the checker tests: black cell a1, numbers and a given cross in b3.
//    a b c d
//  1 # . . 3
//  2 . 3 . .
//  3 . x . .
//  4 . . 5 .

beforeSuite((suite, cb)=> {
  suite.CLUES = {"a1": "black", "d1": "3", "b2": "3", "b3": "cross", "c4": "5"};
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
  let puzzle = suite.showPuzzle("canal_view", "4x4", suite.CLUES);
  puzzle.start();

  assert("Empty cell chooser").that(puzzle.cells[0][1].chooserValues).isNull();
  assert("Empty cell click").that(puzzle.cells[0][1].clickSwitch).containsExactly([{}, {color: puzzle.colorSchema.greyColor, returnValue: 'black'}, {image: 'cross'}]);
  assert("Empty cell drag handler").that(puzzle.cells[0][1].drawDragHandler).isNotNull();
  assert("Empty cell drag processor").that(puzzle.cells[0][1].dragProcessor).isNotNull();
  // Solver can mark the number as used, the mark is not submitted.
  assert("Number cell chooser").that(puzzle.cells[0][3].chooserValues).isNull();
  assert("Number cell click").that(puzzle.cells[0][3].clickSwitch).containsExactly([{text: '3'}, {text: '3', image: 'cross'}]);
  assert("Number cell drag handler").that(puzzle.cells[0][3].drawDragHandler).isNotNull();
  assert("Number cell drag processor").that(puzzle.cells[0][3].dragProcessor).isNotNull();
  assert("Black clue cell chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("Black clue cell has no items to submit").that(puzzle.cells[0][0].clickSwitch.filter(item => item.returnValue).length).isEqualTo(0);
  assert("Cross cell chooser").that(puzzle.cells[2][1].chooserValues).isNull();
  assert("Cross cell has no items to submit").that(puzzle.cells[2][1].clickSwitch.filter(item => item.returnValue).length).isEqualTo(0);
}),

test('Author controllers',(suite) => {
  let puzzle = suite.showPuzzle("canal_view", "4x4");
  puzzle.edit();

  assert("Cell chooser").that(puzzle.cells[0][0].chooserValues).containsAtLeast([{}, {image: 'cross', returnValue: 'cross'}, {color: puzzle.colorSchema.clueColor, returnValue: 'black'}, {text: '1', returnValue: '1'}, {text: '2', returnValue: '2'}, {text: '10', returnValue: '10'}, {text: '29', returnValue: '29'}]);
  assert("Number of items in the cell chooser").that(puzzle.cells[0][0].chooserValues.length).isEqualTo(32);
  assert("Cell click").that(puzzle.cells[0][0].clickSwitch).isNull();
  assert("Cell drag handler").that(puzzle.cells[0][0].drawDragHandler).isNull();
  assert("Cell drag processor").that(puzzle.cells[0][0].dragProcessor).isNull();
}),

// Clue display tests
test('Show clues',(suite) => {
  let puzzle = suite.showPuzzle("canal_view", "4x4", suite.CLUES);
  puzzle.start();

  assert("Number cell data").that(puzzle.cells[0][3].data).isEqualTo({text: '3'});
  assert("Number cell value").that(puzzle.cells[0][3].getValue()).isNull();
  assert("Black clue cell data").that(puzzle.cells[0][0].data).isEqualTo({color: puzzle.colorSchema.clueColor});
  assert("Black clue cell value").that(puzzle.cells[0][0].getValue()).isNull();
  assert("Cross cell data").that(puzzle.cells[2][1].data).isEqualTo({image: 'cross'});
  assert("Cross cell value").that(puzzle.cells[2][1].getValue()).isNull();
  // Clues are not a part of the submission.
  assert("Submission data").that(puzzle.collectData()).isEqualTo({});
}),

// Mouse processing tests
test('Process click to empty cell',(suite) => {
  let puzzle = suite.showPuzzle("canal_view", "4x4", suite.CLUES);
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
  let puzzle = suite.showPuzzle("canal_view", "4x4", suite.CLUES);
  puzzle.start();

  let point = suite.cellPoint(puzzle, "d1");

  suite.click(puzzle, point);

  // The number is marked by cross, it can not be shaded.
  assert("Cell data after one click").that(puzzle.cells[0][3].data).isEqualTo({text: "3", image: "cross"});
  assert("Cell value after one click").that(puzzle.cells[0][3].getValue()).isNull();

  suite.click(puzzle, point);

  assert("Cell data after two clicks").that(puzzle.cells[0][3].data).isEqualTo({text: "3"});
  assert("Cell value after two clicks").that(puzzle.cells[0][3].getValue()).isNull();

  suite.click(puzzle, point);

  assert("Submission data").that(puzzle.collectData()).isEqualTo({});
}),

test('Process click to black clue cell',(suite) => {
  let puzzle = suite.showPuzzle("canal_view", "4x4", suite.CLUES);
  puzzle.start();

  suite.cellClick(puzzle, "a1");

  assert("Cell color after click").that(puzzle.cells[0][0].data.color).isEqualTo(puzzle.colorSchema.clueColor);
  assert("Cell value after click").that(puzzle.cells[0][0].getValue()).isNull();
  assert("Submission data").that(puzzle.collectData()).isEqualTo({});
}),

test('Process click to given cross',(suite) => {
  let puzzle = suite.showPuzzle("canal_view", "4x4", suite.CLUES);
  puzzle.start();

  suite.cellClick(puzzle, "b3");

  assert("Cell data after click").that(puzzle.cells[2][1].data).isEqualTo({image: "cross"});
  assert("Cell value after click").that(puzzle.cells[2][1].getValue()).isNull();

  suite.cellClick(puzzle, "b3");

  assert("Cell data after two clicks").that(puzzle.cells[2][1].data).isEqualTo({image: "cross"});
  assert("Submission data").that(puzzle.collectData()).isEqualTo({});
}),

test('Shade cells by drag',(suite) => {
  let puzzle = suite.showPuzzle("canal_view", "4x4", suite.CLUES);
  puzzle.start();

  let greyColor = puzzle.colorSchema.greyColor;

  suite.cellClick(puzzle, "c1");
  // One move from the shaded c1, the path goes through the number cell b2.
  suite.dragOverCells(puzzle, "c1", "c2", "b2", "a2");

  assert("Source cell value").that(puzzle.cells[0][2].getValue()).isEqualTo("black");
  assert("Value of c2").that(puzzle.cells[1][2].getValue()).isEqualTo("black");
  assert("Color of c2").that(puzzle.cells[1][2].data.color).isEqualTo(greyColor);
  assert("Value of a2").that(puzzle.cells[1][0].getValue()).isEqualTo("black");
  assert("Color of a2").that(puzzle.cells[1][0].data.color).isEqualTo(greyColor);
  // Number cell is not changed.
  assert("Number cell data").that(puzzle.cells[1][1].data).isEqualTo({text: "3"});
  assert("Number cell value").that(puzzle.cells[1][1].getValue()).isNull();

  assert("Submission data").that(puzzle.collectData()).isEqualTo({"c1": "black", "a2": "black", "c2": "black"});
}),

test('Set crosses by drag from number cell',(suite) => {
  let puzzle = suite.showPuzzle("canal_view", "4x4", suite.CLUES);
  puzzle.start();

  // Cells around the number are marked as not shaded by one move from the number cell.
  suite.dragOverCells(puzzle, "d1", "d2", "d3");

  assert("Image of d2").that(puzzle.cells[1][3].data.image).isEqualTo("cross");
  assert("Text of d2").that(puzzle.cells[1][3].data.text).isNull();
  assert("Value of d2").that(puzzle.cells[1][3].getValue()).isNull();
  assert("Image of d3").that(puzzle.cells[2][3].data.image).isEqualTo("cross");
  assert("Text of d3").that(puzzle.cells[2][3].data.text).isNull();
  assert("Value of d3").that(puzzle.cells[2][3].getValue()).isNull();
  assert("Number cell data").that(puzzle.cells[0][3].data).isEqualTo({text: "3"});
  assert("Submission data").that(puzzle.collectData()).isEqualTo({});
}),

test('Set crosses by drag from cell with cross',(suite) => {
  let puzzle = suite.showPuzzle("canal_view", "4x4", suite.CLUES);
  puzzle.start();

  suite.cellClick(puzzle, "a2");
  suite.cellClick(puzzle, "a2");
  suite.dragOverCells(puzzle, "a2", "a3", "a4");

  assert("Source cell data").that(puzzle.cells[1][0].data).isEqualTo({image: "cross"});
  assert("Data of a3").that(puzzle.cells[2][0].data).isEqualTo({image: "cross"});
  assert("Data of a4").that(puzzle.cells[3][0].data).isEqualTo({image: "cross"});
  assert("Submission data").that(puzzle.collectData()).isEqualTo({});
}),

test('Clear cells by drag',(suite) => {
  let puzzle = suite.showPuzzle("canal_view", "4x4", suite.CLUES);
  puzzle.start();

  suite.cellClick(puzzle, "a2");
  suite.cellClick(puzzle, "a3");
  suite.cellClick(puzzle, "a4");
  // Drag from the empty cell b4 clears the cells on its way.
  suite.dragOverCells(puzzle, "b4", "a4", "a3");

  assert("Value of a4").that(puzzle.cells[3][0].getValue()).isNull();
  assert("Color of a4").that(puzzle.cells[3][0].data.color).isNull();
  assert("Value of a3").that(puzzle.cells[2][0].getValue()).isNull();
  assert("Color of a3").that(puzzle.cells[2][0].data.color).isNull();
  assert("Submission data").that(puzzle.collectData()).isEqualTo({"a2": "black"});
}),

// Data collector tests
test('Data collector',(suite) => {
  let puzzle = suite.showPuzzle("canal_view", "4x4", suite.CLUES);
  puzzle.start();

  // Solution:  # # # 3
  //            # 3 # .
  //            # x # #
  //            # # 5 .
  suite.cellClick(puzzle, "b1");
  suite.dragOverCells(puzzle, "b1", "c1", "c2", "c3", "d3");
  suite.cellClick(puzzle, "a2");
  suite.dragOverCells(puzzle, "a2", "a3", "a4", "b4");
  // Crosses are not submitted.
  suite.cellClick(puzzle, "d2");
  suite.cellClick(puzzle, "d2");

  assert("Submission data").that(puzzle.collectData()).isEqualTo(
    {"b1": "black", "c1": "black", "a2": "black", "c2": "black", "a3": "black", "c3": "black", "d3": "black", "a4": "black", "b4": "black"});
}),

// Author tests
test('Author sets clues by chooser',(suite) => {
  let puzzle = suite.showPuzzle("canal_view", "4x4");
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
  let puzzle = suite.showPuzzle("canal_view", "4x4");
  puzzle.edit();

  // black cell in a1, number 3 in d1, number 3 in b2, cross in b3, number 5 in c4.
  puzzle.cells[0][0].switchOnChooser(2);
  puzzle.cells[0][3].switchOnChooser(5);
  puzzle.cells[1][1].switchOnChooser(5);
  puzzle.cells[2][1].switchOnChooser(1);
  puzzle.cells[3][2].switchOnChooser(7);

  assert("Puzzle data").that(puzzle.collectData()).isEqualTo(suite.CLUES);
}),

test('Author edits existing puzzle',(suite) => {
  let puzzle = suite.showPuzzle("canal_view", "4x4", suite.CLUES);
  puzzle.edit();

  assert("Number value").that(puzzle.cells[0][3].getValue()).isEqualTo("3");
  assert("Puzzle data").that(puzzle.collectData()).isEqualTo(suite.CLUES);

  // Change the number in b2 to 4 and remove the clue in b3.
  puzzle.cells[1][1].switchOnChooser(6);
  puzzle.cells[2][1].switchOnChooser(0);

  assert("Puzzle data after change").that(puzzle.collectData()).isEqualTo({"a1": "black", "d1": "3", "b2": "4", "c4": "5"});
}),

);
