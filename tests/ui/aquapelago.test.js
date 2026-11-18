aquapelagoTestSuite = uiTestSuite("Aquapelago", "squarepuzzle", "squarePuzzleType",

// Puzzle from the checker tests: clues are shaded cells, some of them with numbers.
//     a b c d
//   1 1 . . .
//   2 . . 2 .
//   3 . . . .
//   4 . . . #      # - shaded cell without number

beforeSuite((suite, cb)=> {
  suite.CLUES = {"a1": "1", "c2": "2", "d4": "grey"};
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
  let puzzle = suite.showPuzzle("aquapelago", "4x4", suite.CLUES);
  puzzle.start();

  assert("Empty cell chooser").that(puzzle.cells[0][1].chooserValues).isNull();
  assert("Empty cell click").that(puzzle.cells[0][1].clickSwitch).containsExactly([{}, {color: puzzle.colorSchema.greyColor, returnValue: '1'}, {image: 'cross'}]);
  assert("Empty cell drag handler").that(puzzle.cells[0][1].drawDragHandler).isNotNull();
  assert("Empty cell drag processor").that(puzzle.cells[0][1].dragProcessor).isNotNull();
  assert("Number cell chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("Number cell click").that(puzzle.cells[0][0].clickSwitch).isNull();
  assert("Number cell drag processor").that(puzzle.cells[0][0].dragProcessor).isNull();
  assert("Shaded clue cell chooser").that(puzzle.cells[3][3].chooserValues).isNull();
  assert("Shaded clue cell click").that(puzzle.cells[3][3].clickSwitch).isNull();
  assert("Shaded clue cell drag processor").that(puzzle.cells[3][3].dragProcessor).isNull();
}),

test('Author controllers',(suite) => {
  let puzzle = suite.showPuzzle("aquapelago", "4x4");
  puzzle.edit();

  let clueColor = puzzle.colorSchema.clueColor;
  let number = function(value) {
    return {text: value, color: clueColor, textColor: puzzle.colorSchema.bgColor, returnValue: value};
  }

  assert("Cell chooser").that(puzzle.cells[0][0].chooserValues).containsAtLeast([{}, {color: clueColor, returnValue: 'grey'}, number('1'), number('2'), number('10'), number('99')]);
  assert("Number of items in the cell chooser").that(puzzle.cells[0][0].chooserValues.length).isEqualTo(101);
  assert("Cell click").that(puzzle.cells[0][0].clickSwitch).isNull();
  assert("Cell drag processor").that(puzzle.cells[0][0].dragProcessor).isNull();
}),

// Clue display tests
test('Show clues',(suite) => {
  let puzzle = suite.showPuzzle("aquapelago", "4x4", suite.CLUES);
  puzzle.start();

  // Numbers are shown in the shaded cells.
  assert("Number cell data").that(puzzle.cells[0][0].data).isEqualTo({text: '1', color: puzzle.colorSchema.clueColor, textColor: puzzle.colorSchema.bgColor});
  assert("Second number cell data").that(puzzle.cells[1][2].data).isEqualTo({text: '2', color: puzzle.colorSchema.clueColor, textColor: puzzle.colorSchema.bgColor});
  assert("Shaded clue cell data").that(puzzle.cells[3][3].data).isEqualTo({color: puzzle.colorSchema.clueColor});
  // Clues are not a part of the submission.
  assert("Number cell value").that(puzzle.cells[0][0].getValue()).isNull();
  assert("Shaded clue cell value").that(puzzle.cells[3][3].getValue()).isNull();
  assert("Submission data").that(puzzle.collectData()).isEqualTo({});
}),

// Mouse processing tests
test('Process click to empty cell',(suite) => {
  let puzzle = suite.showPuzzle("aquapelago", "4x4", suite.CLUES);
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

test('Process click to clue cells',(suite) => {
  let puzzle = suite.showPuzzle("aquapelago", "4x4", suite.CLUES);
  puzzle.start();

  suite.cellClick(puzzle, "a1");
  suite.cellClick(puzzle, "d4");

  assert("Number cell data after click").that(puzzle.cells[0][0].data).isEqualTo({text: '1', color: puzzle.colorSchema.clueColor, textColor: puzzle.colorSchema.bgColor});
  assert("Shaded clue cell data after click").that(puzzle.cells[3][3].data).isEqualTo({color: puzzle.colorSchema.clueColor});
  assert("Submission data").that(puzzle.collectData()).isEqualTo({});
}),

test('Shade cells by drag',(suite) => {
  let puzzle = suite.showPuzzle("aquapelago", "4x4", suite.CLUES);
  puzzle.start();

  let greyColor = puzzle.colorSchema.greyColor;

  suite.cellClick(puzzle, "b3");
  // One move from the shaded b3 through c3 and d3 to the clue cell d4.
  suite.dragOverCells(puzzle, "b3", "c3", "d3", "d4");

  assert("Source cell value").that(puzzle.cells[2][1].getValue()).isEqualTo("1");
  assert("Value of c3").that(puzzle.cells[2][2].getValue()).isEqualTo("1");
  assert("Color of c3").that(puzzle.cells[2][2].data.color).isEqualTo(greyColor);
  assert("Value of d3").that(puzzle.cells[2][3].getValue()).isEqualTo("1");
  assert("Color of d3").that(puzzle.cells[2][3].data.color).isEqualTo(greyColor);
  // Clue cell is not changed.
  assert("Clue cell data").that(puzzle.cells[3][3].data).isEqualTo({color: puzzle.colorSchema.clueColor});
  assert("Clue cell value").that(puzzle.cells[3][3].getValue()).isNull();

  assert("Submission data").that(puzzle.collectData()).isEqualTo({"b3": "1", "c3": "1", "d3": "1"});
}),

test('Set crosses by drag',(suite) => {
  let puzzle = suite.showPuzzle("aquapelago", "4x4", suite.CLUES);
  puzzle.start();

  suite.cellClick(puzzle, "b1");
  suite.cellClick(puzzle, "b1");
  // The path goes through the clue cell c2.
  suite.dragOverCells(puzzle, "b1", "c1", "c2", "d2");

  assert("Source cell data").that(puzzle.cells[0][1].data).isEqualTo({image: "cross"});
  assert("Data of c1").that(puzzle.cells[0][2].data).isEqualTo({image: "cross"});
  assert("Data of d2").that(puzzle.cells[1][3].data).isEqualTo({image: "cross"});
  assert("Clue cell data").that(puzzle.cells[1][2].data).isEqualTo({text: '2', color: puzzle.colorSchema.clueColor, textColor: puzzle.colorSchema.bgColor});

  assert("Submission data").that(puzzle.collectData()).isEqualTo({});
}),

test('Clear cells by drag',(suite) => {
  let puzzle = suite.showPuzzle("aquapelago", "4x4", suite.CLUES);
  puzzle.start();

  suite.cellClick(puzzle, "a3");
  suite.cellClick(puzzle, "b3");
  suite.cellClick(puzzle, "c3");
  // Drag from the empty cell a4 clears the cells on its way.
  suite.dragOverCells(puzzle, "a4", "a3", "b3");

  assert("Value of a3").that(puzzle.cells[2][0].getValue()).isNull();
  assert("Color of a3").that(puzzle.cells[2][0].data.color).isNull();
  assert("Value of b3").that(puzzle.cells[2][1].getValue()).isNull();
  assert("Color of b3").that(puzzle.cells[2][1].data.color).isNull();
  assert("Value of the cell out of the drag path").that(puzzle.cells[2][2].getValue()).isEqualTo("1");
}),

test('Drag from clue cell does nothing',(suite) => {
  let puzzle = suite.showPuzzle("aquapelago", "4x4", suite.CLUES);
  puzzle.start();

  suite.dragOverCells(puzzle, "a1", "a2", "a3");

  assert("Value of a2").that(puzzle.cells[1][0].getValue()).isNull();
  assert("Color of a2").that(puzzle.cells[1][0].data.color).isNull();
  assert("Text of a2").that(puzzle.cells[1][0].data.text).isNull();
  assert("Value of a3").that(puzzle.cells[2][0].getValue()).isNull();
  assert("Clue cell data").that(puzzle.cells[0][0].data).isEqualTo({text: '1', color: puzzle.colorSchema.clueColor, textColor: puzzle.colorSchema.bgColor});
}),

// Data collector tests
test('Data collector',(suite) => {
  let puzzle = suite.showPuzzle("aquapelago", "4x4", suite.CLUES);
  puzzle.start();

  // The only shaded cell of the solution is b3, cross in b2 is not submitted.
  suite.cellClick(puzzle, "b3");
  suite.cellClick(puzzle, "b2");
  suite.cellClick(puzzle, "b2");

  assert("Submission data").that(puzzle.collectData()).isEqualTo({"b3": "1"});
}),

// Author tests
test('Author sets clues by chooser',(suite) => {
  let puzzle = suite.showPuzzle("aquapelago", "4x4");
  puzzle.edit();

  let clueColor = puzzle.colorSchema.clueColor;

  // Chooser items: empty, shaded cell, 1, 2, ...
  puzzle.cells[0][0].switchOnChooser(1);

  assert("Shaded cell value").that(puzzle.cells[0][0].getValue()).isEqualTo("grey");
  assert("Shaded cell data").that(puzzle.cells[0][0].data).isEqualTo({color: clueColor, returnValue: "grey"});

  puzzle.cells[0][0].switchOnChooser(13);

  assert("Number value").that(puzzle.cells[0][0].getValue()).isEqualTo("12");
  assert("Number data").that(puzzle.cells[0][0].data).isEqualTo({text: "12", color: clueColor, textColor: puzzle.colorSchema.bgColor, returnValue: "12"});
  assert("Puzzle data with number").that(puzzle.collectData()).isEqualTo({"a1": "12"});

  puzzle.cells[0][0].switchOnChooser(0);

  assert("Value of the cleared cell").that(puzzle.cells[0][0].getValue()).isNull();
  assert("Puzzle data after clue is removed").that(puzzle.collectData()).isEqualTo({});
}),

test('Author data collector',(suite) => {
  let puzzle = suite.showPuzzle("aquapelago", "4x4");
  puzzle.edit();

  // Numbers 1 in a1 and 2 in c2, shaded cell d4.
  puzzle.cells[0][0].switchOnChooser(2);
  puzzle.cells[1][2].switchOnChooser(3);
  puzzle.cells[3][3].switchOnChooser(1);

  assert("Puzzle data").that(puzzle.collectData()).isEqualTo(suite.CLUES);
}),

test('Author edits existing puzzle',(suite) => {
  let puzzle = suite.showPuzzle("aquapelago", "4x4", suite.CLUES);
  puzzle.edit();

  assert("Number value").that(puzzle.cells[0][0].getValue()).isEqualTo("1");
  assert("Shaded cell value").that(puzzle.cells[3][3].getValue()).isEqualTo("grey");
  assert("Puzzle data").that(puzzle.collectData()).isEqualTo(suite.CLUES);

  // Remove the clue in a1 and replace the shaded cell d4 by number 3.
  puzzle.cells[0][0].switchOnChooser(0);
  puzzle.cells[3][3].switchOnChooser(4);

  assert("Puzzle data after change").that(puzzle.collectData()).isEqualTo({"c2": "2", "d4": "3"});
}),

);
