pataTestSuite = uiTestSuite("Pata", "squarepuzzle", "squarePuzzleType",

// Puzzle from the checker tests: Tapa-like clues 1_2 (numbers 1 and 2 in one cell) and 1.
//     a   b   c   d
//   1 .   .   .   .
//   2 .   .  1_2  .
//   3 .   .   .   .
//   4 1   .   .   .

beforeSuite((suite, cb)=> {
  suite.CLUES = {"c2": "1_2", "a4": "1"};
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
  let puzzle = suite.showPuzzle("pata", "4x4", suite.CLUES);
  puzzle.start();

  assert("Empty cell chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("Empty cell click").that(puzzle.cells[0][0].clickSwitch).containsExactly([{}, {color: puzzle.colorSchema.gridColor, returnValue: 'black'}, {image: 'cross'}]);
  assert("Empty cell drag handler").that(puzzle.cells[0][0].drawDragHandler).isNotNull();
  assert("Empty cell drag processor").that(puzzle.cells[0][0].dragProcessor).isNotNull();
  assert("Clue cell chooser").that(puzzle.cells[1][2].chooserValues).isNull();
  assert("Clue cell click").that(puzzle.cells[1][2].clickSwitch).isNull();
  assert("Clue cell drag handler").that(puzzle.cells[1][2].drawDragHandler).isNotNull();
  assert("Clue cell drag processor").that(puzzle.cells[1][2].dragProcessor).isNotNull();
}),

test('Author controllers',(suite) => {
  let puzzle = suite.showPuzzle("pata", "4x4");
  puzzle.edit();

  let clue = function(value) {
    return {image: value, returnValue: value};
  }

  assert("Cell chooser").that(puzzle.cells[0][0].chooserValues).containsExactly([
    {}, clue('0'), clue('1'), clue('2'), clue('3'), clue('4'), clue('5'), clue('6'), clue('7'), clue('8'),
    clue('1_1'), clue('1_2'), clue('1_3'), clue('1_4'), clue('1_5'), clue('2_2'), clue('2_3'), clue('2_4'), clue('3_3'),
    clue('1_1_1'), clue('1_1_2'), clue('1_1_3'), clue('1_2_2'), clue('1_1_1_1')]);
  assert("Cell click").that(puzzle.cells[0][0].clickSwitch).isNull();
  assert("Cell drag handler").that(puzzle.cells[0][0].drawDragHandler).isNull();
  assert("Cell drag processor").that(puzzle.cells[0][0].dragProcessor).isNull();
}),

// Clue display tests
test('Show clues',(suite) => {
  let puzzle = suite.showPuzzle("pata", "4x4", suite.CLUES);
  puzzle.start();

  assert("Clue with two numbers").that(puzzle.cells[1][2].data).isEqualTo({image: '1_2'});
  assert("Clue with one number").that(puzzle.cells[3][0].data).isEqualTo({image: '1'});
  // Clues are not a part of the submission.
  assert("Clue cell value").that(puzzle.cells[1][2].getValue()).isNull();
  assert("Submission data").that(puzzle.collectData()).isEqualTo({});
}),

// Mouse processing tests
test('Process click to empty cell',(suite) => {
  let puzzle = suite.showPuzzle("pata", "4x4", suite.CLUES);
  puzzle.start();

  let point = suite.cellPoint(puzzle, "b1");

  assert("Cell value before click").that(puzzle.cells[0][1].getValue()).isNull();

  suite.click(puzzle, point);

  assert("Cell value after one click").that(puzzle.cells[0][1].getValue()).isEqualTo("black");
  assert("Cell data after one click").that(puzzle.cells[0][1].data).isEqualTo({color: puzzle.colorSchema.gridColor, returnValue: "black"});

  suite.click(puzzle, point);

  assert("Cell value after two clicks").that(puzzle.cells[0][1].getValue()).isNull();
  assert("Cell data after two clicks").that(puzzle.cells[0][1].data).isEqualTo({image: "cross"});

  suite.click(puzzle, point);

  assert("Cell value after three clicks").that(puzzle.cells[0][1].getValue()).isNull();
  assert("Cell data after three clicks").that(puzzle.cells[0][1].data).isEqualTo({});
}),

test('Process click to clue cell',(suite) => {
  let puzzle = suite.showPuzzle("pata", "4x4", suite.CLUES);
  puzzle.start();

  suite.cellClick(puzzle, "c2");

  assert("Cell value after click").that(puzzle.cells[1][2].getValue()).isNull();
  assert("Cell data after click").that(puzzle.cells[1][2].data).isEqualTo({image: "1_2"});
  assert("Submission data").that(puzzle.collectData()).isEqualTo({});
}),

test('Paint cells by drag',(suite) => {
  let puzzle = suite.showPuzzle("pata", "4x4", suite.CLUES);
  puzzle.start();

  let black = {color: puzzle.colorSchema.gridColor, returnValue: "black"};

  suite.cellClick(puzzle, "b1");
  // One move from the black b1, the path goes through the clue cell c2.
  suite.dragOverCells(puzzle, "b1", "b2", "c2", "d2");

  assert("Source cell value").that(puzzle.cells[0][1].getValue()).isEqualTo("black");
  assert("Value of b2").that(puzzle.cells[1][1].getValue()).isEqualTo("black");
  assert("Data of b2").that(puzzle.cells[1][1].data).isEqualTo(black);
  assert("Value of d2").that(puzzle.cells[1][3].getValue()).isEqualTo("black");
  assert("Data of d2").that(puzzle.cells[1][3].data).isEqualTo(black);
  // Clue cell is not changed.
  assert("Clue cell data").that(puzzle.cells[1][2].data).isEqualTo({image: "1_2"});
  assert("Clue cell value").that(puzzle.cells[1][2].getValue()).isNull();

  assert("Submission data").that(puzzle.collectData()).isEqualTo({"b1": "black", "b2": "black", "d2": "black"});
}),

test('Set crosses by drag from clue cell',(suite) => {
  let puzzle = suite.showPuzzle("pata", "4x4", suite.CLUES);
  puzzle.start();

  // Cells around the clue are marked as not painted by one move from the clue cell.
  suite.dragOverCells(puzzle, "c2", "c1", "d1");

  assert("Image of c1").that(puzzle.cells[0][2].data.image).isEqualTo("cross");
  assert("Value of c1").that(puzzle.cells[0][2].getValue()).isNull();
  assert("Image of d1").that(puzzle.cells[0][3].data.image).isEqualTo("cross");
  assert("Value of d1").that(puzzle.cells[0][3].getValue()).isNull();
  assert("Clue cell data").that(puzzle.cells[1][2].data).isEqualTo({image: "1_2"});
  assert("Submission data").that(puzzle.collectData()).isEqualTo({});

  // The crosses can be changed by click.
  suite.cellClick(puzzle, "c1");
  suite.cellClick(puzzle, "c1");

  assert("Value of c1 after clicks").that(puzzle.cells[0][2].getValue()).isEqualTo("black");
}),

test('Set crosses by drag from cell with cross',(suite) => {
  let puzzle = suite.showPuzzle("pata", "4x4", suite.CLUES);
  puzzle.start();

  suite.cellClick(puzzle, "a1");
  suite.cellClick(puzzle, "a1");
  suite.dragOverCells(puzzle, "a1", "a2", "a3", "a4");

  assert("Source cell data").that(puzzle.cells[0][0].data).isEqualTo({image: "cross"});
  assert("Data of a2").that(puzzle.cells[1][0].data).isEqualTo({image: "cross"});
  assert("Data of a3").that(puzzle.cells[2][0].data).isEqualTo({image: "cross"});
  // Clue cell is not changed.
  assert("Clue cell data").that(puzzle.cells[3][0].data).isEqualTo({image: "1"});
  assert("Submission data").that(puzzle.collectData()).isEqualTo({});
}),

test('Clear cells by drag',(suite) => {
  let puzzle = suite.showPuzzle("pata", "4x4", suite.CLUES);
  puzzle.start();

  suite.cellClick(puzzle, "b3");
  suite.cellClick(puzzle, "c3");
  suite.cellClick(puzzle, "d3");
  // Drag from the empty cell a3 clears the cells on its way.
  suite.dragOverCells(puzzle, "a3", "b3", "c3");

  assert("Value of b3").that(puzzle.cells[2][1].getValue()).isNull();
  assert("Color of b3").that(puzzle.cells[2][1].data.color).isNull();
  assert("Value of c3").that(puzzle.cells[2][2].getValue()).isNull();
  assert("Color of c3").that(puzzle.cells[2][2].data.color).isNull();
  assert("Submission data").that(puzzle.collectData()).isEqualTo({"d3": "black"});
}),

// Data collector tests
test('Data collector',(suite) => {
  let puzzle = suite.showPuzzle("pata", "4x4", suite.CLUES);
  puzzle.start();

  // Solution:  .  #  .  .
  //            #  # 1_2 #
  //            .  #  .  #
  //            1  #  #  #
  suite.cellClick(puzzle, "b1");
  suite.dragOverCells(puzzle, "b1", "b2", "a2");
  suite.dragOverCells(puzzle, "b2", "b3", "b4", "c4", "d4", "d3", "d2");
  // Crosses are not submitted.
  suite.cellClick(puzzle, "c3");
  suite.cellClick(puzzle, "c3");

  assert("Submission data").that(puzzle.collectData()).isEqualTo(
    {"b1": "black", "a2": "black", "b2": "black", "d2": "black", "b3": "black", "d3": "black", "b4": "black", "c4": "black", "d4": "black"});
}),

// Author tests
test('Author sets clues by chooser',(suite) => {
  let puzzle = suite.showPuzzle("pata", "4x4");
  puzzle.edit();

  // Chooser items: empty, 0 - 8, then clues with several numbers.
  puzzle.cells[0][0].switchOnChooser(1);

  assert("Zero clue value").that(puzzle.cells[0][0].getValue()).isEqualTo("0");
  assert("Zero clue data").that(puzzle.cells[0][0].data).isEqualTo({image: "0", returnValue: "0"});

  puzzle.cells[0][0].switchOnChooser(23);

  assert("Four numbers clue value").that(puzzle.cells[0][0].getValue()).isEqualTo("1_1_1_1");
  assert("Four numbers clue data").that(puzzle.cells[0][0].data).isEqualTo({image: "1_1_1_1", returnValue: "1_1_1_1"});
  assert("Puzzle data with clue").that(puzzle.collectData()).isEqualTo({"a1": "1_1_1_1"});

  puzzle.cells[0][0].switchOnChooser(0);

  assert("Value of the cleared cell").that(puzzle.cells[0][0].getValue()).isNull();
  assert("Puzzle data after clue is removed").that(puzzle.collectData()).isEqualTo({});
}),

test('Author data collector',(suite) => {
  let puzzle = suite.showPuzzle("pata", "4x4");
  puzzle.edit();

  // Clue 1_2 in c2 and clue 1 in a4.
  puzzle.cells[1][2].switchOnChooser(11);
  puzzle.cells[3][0].switchOnChooser(2);

  assert("Puzzle data").that(puzzle.collectData()).isEqualTo(suite.CLUES);
}),

test('Author edits existing puzzle',(suite) => {
  let puzzle = suite.showPuzzle("pata", "4x4", suite.CLUES);
  puzzle.edit();

  assert("Clue value").that(puzzle.cells[1][2].getValue()).isEqualTo("1_2");
  assert("Puzzle data").that(puzzle.collectData()).isEqualTo(suite.CLUES);

  // Change the clue in c2 to 2_4, remove the clue in a4 and add clue 8 to d1.
  puzzle.cells[1][2].switchOnChooser(17);
  puzzle.cells[3][0].switchOnChooser(0);
  puzzle.cells[0][3].switchOnChooser(9);

  assert("Puzzle data after change").that(puzzle.collectData()).isEqualTo({"d1": "8", "c2": "2_4"});
}),

);
