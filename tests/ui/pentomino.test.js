pentominoTestSuite = uiTestSuite("Pentomino", "squarepuzzle", "squarePuzzleType",

beforeSuite((suite, cb)=> {
  // Emulates one mouse drag which goes through the centers of the given cells.
  suite.dragThrough = function(puzzle, cells) {
    puzzle.controller.onMouseDown(suite.mouseEvent(suite.cellPoint(puzzle, cells[0])));
    for (let i = 1; i < cells.length; i++) {
      puzzle.controller.onMouseMove(suite.mouseEvent(suite.cellPoint(puzzle, cells[i])));
    }
    puzzle.controller.onMouseUp(suite.mouseEvent(suite.cellPoint(puzzle, cells[cells.length - 1])));
  };
  // Puzzle from the checker tests. Numbers below and to the right are the outer clues:
  // number of shaded cells in the column and in the row (some of them are not given).
  //     a b c d e f
  //  1  . . . . . .  5
  //  2  . x . . . .
  //  3  . . . . . .  1
  //  4  . . . . . .  1
  //  5  . . . . . .  3
  //  6  . . . . . .
  //     1 1   4 2 1
  suite.CLUES = {"b2": "cross", "bottom": ["1", "1", null, "4", "2", "1"], "right": ["5", null, "1", "1", "3", null]};
  cb();
}),

// Controller definition tests
test('Solver controllers',(suite) => {
  let puzzle = suite.showPuzzle("pentomino", "6x6-IV", suite.CLUES);
  puzzle.start();

  assert("Empty cell chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("Empty cell click").that(puzzle.cells[0][0].clickSwitch).containsExactly([{}, {color: puzzle.colorSchema.greyColor, returnValue: '1'}, {image: 'cross'}]);
  assert("Empty cell drag processor").that(puzzle.cells[0][0].dragProcessor).isNotNull();
  assert("Cross cell chooser").that(puzzle.cells[1][1].chooserValues).isNull();
  assert("Cross cell click").that(puzzle.cells[1][1].clickSwitch).isNull();
  assert("Cross cell drag processor").that(puzzle.cells[1][1].dragProcessor).isNotNull();
  assert("Bottom clue chooser").that(puzzle.bottom[3].chooserValues).isNull();
  assert("Bottom clue click").that(puzzle.bottom[3].clickSwitch).containsExactly([{text: '4'}, {text: '4', image: 'white_circle'}]);
  assert("Bottom clue drag processor").that(puzzle.bottom[3].dragProcessor).isNull();
  assert("Right clue chooser").that(puzzle.right[0].chooserValues).isNull();
  assert("Right clue click").that(puzzle.right[0].clickSwitch).containsExactly([{text: '5'}, {text: '5', image: 'white_circle'}]);
  assert("Right clue drag processor").that(puzzle.right[0].dragProcessor).isNull();
  assert("Edge click").that(puzzle.edges[0][0][1].clickSwitch).isNull();
  assert("Edge drag").that(puzzle.edges[0][0][1].dragSwitch).isNull();
}),

test('Author controllers',(suite) => {
  let puzzle = suite.showPuzzle("pentomino", "6x6-IV");
  puzzle.edit();

  let numberItem = function(number) {
    return {text: number, returnValue: number};
  }
  assert("Cell chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("Cell click").that(puzzle.cells[0][0].clickSwitch).containsExactly([{}, {image: 'cross', returnValue: 'cross'}]);
  assert("Cell drag processor").that(puzzle.cells[0][0].dragProcessor).isNull();
  // Outer clue is a number from 0 to the size of the grid.
  assert("Bottom clue chooser").that(puzzle.bottom[0].chooserValues).containsExactly(
    [{}, numberItem('0'), numberItem('1'), numberItem('2'), numberItem('3'), numberItem('4'), numberItem('5'), numberItem('6')]);
  assert("Bottom clue click").that(puzzle.bottom[0].clickSwitch).isNull();
  assert("Right clue chooser").that(puzzle.right[5].chooserValues).containsExactly(
    [{}, numberItem('0'), numberItem('1'), numberItem('2'), numberItem('3'), numberItem('4'), numberItem('5'), numberItem('6')]);
  assert("Right clue click").that(puzzle.right[5].clickSwitch).isNull();
  assert("Edge click").that(puzzle.edges[0][0][1].clickSwitch).isNull();
}),

// Clues display tests
test('Show clues',(suite) => {
  let puzzle = suite.showPuzzle("pentomino", "6x6-IV", suite.CLUES);
  puzzle.start();

  assert("Number of bottom clues").that(puzzle.bottom.length).isEqualTo(6);
  assert("Number of right clues").that(puzzle.right.length).isEqualTo(6);
  assert("Clue below column a").that(puzzle.bottom[0].data).isEqualTo({text: '1'});
  assert("Missing clue below column c").that(puzzle.bottom[2].data).isEqualTo({});
  assert("Clue below column d").that(puzzle.bottom[3].data).isEqualTo({text: '4'});
  assert("Clue to the right of row 1").that(puzzle.right[0].data).isEqualTo({text: '5'});
  assert("Missing clue to the right of row 2").that(puzzle.right[1].data).isEqualTo({});
  assert("Clue to the right of row 5").that(puzzle.right[4].data).isEqualTo({text: '3'});
  assert("Cross clue").that(puzzle.cells[1][1].data).isEqualTo({image: 'cross'});
  assert("Cross clue is not a part of the solution").that(puzzle.cells[1][1].getValue()).isNull();

  let texts = $(suite.GRID_SELECTOR + " text").map((i, element) => $(element).text()).get();
  assert("Texts in the grid").that(texts).isEqualTo(["1", "1", "4", "2", "1", "5", "1", "1", "3"]);
}),

// Mouse processing tests
test('Process clicks to empty cell',(suite) => {
  let puzzle = suite.showPuzzle("pentomino", "6x6-IV", suite.CLUES);
  puzzle.start();

  assert("Cell value before click").that(puzzle.cells[0][0].getValue()).isNull();
  assert("Cell data before click").that(puzzle.cells[0][0].data).isEqualTo({});

  suite.cellClick(puzzle, "a1");

  assert("Cell value after one click").that(puzzle.cells[0][0].getValue()).isEqualTo("1");
  assert("Cell data after one click").that(puzzle.cells[0][0].data).isEqualTo({color: puzzle.colorSchema.greyColor, returnValue: '1'});

  suite.cellClick(puzzle, "a1");

  assert("Cell value after two clicks").that(puzzle.cells[0][0].getValue()).isNull();
  assert("Cell data after two clicks").that(puzzle.cells[0][0].data).isEqualTo({image: 'cross'});

  suite.cellClick(puzzle, "a1");

  assert("Cell value after three clicks").that(puzzle.cells[0][0].getValue()).isNull();
  assert("Cell data after three clicks").that(puzzle.cells[0][0].data).isEqualTo({});
  assert("Neighbour cell is not changed").that(puzzle.cells[0][1].data).isEqualTo({});
}),

test('Cross clue is not changed by click',(suite) => {
  let puzzle = suite.showPuzzle("pentomino", "6x6-IV", suite.CLUES);
  puzzle.start();

  suite.cellClick(puzzle, "b2");

  assert("Clue data after click").that(puzzle.cells[1][1].data).isEqualTo({image: 'cross'});
  assert("Clue value after click").that(puzzle.cells[1][1].getValue()).isNull();
}),

test('Mark outer clues by click',(suite) => {
  let puzzle = suite.showPuzzle("pentomino", "6x6-IV", suite.CLUES);
  puzzle.start();

  // Clue below the column d.
  suite.click(puzzle, suite.cellPoint(puzzle, 3, 6));

  assert("Bottom clue data after click").that(puzzle.bottom[3].data).isEqualTo({text: '4', image: 'white_circle'});
  assert("Bottom clue value after click").that(puzzle.bottom[3].getValue()).isNull();
  assert("Next bottom clue").that(puzzle.bottom[4].data).isEqualTo({text: '2'});

  suite.click(puzzle, suite.cellPoint(puzzle, 3, 6));

  assert("Bottom clue data after two clicks").that(puzzle.bottom[3].data).isEqualTo({text: '4'});

  // Clue to the right of the row 1.
  suite.click(puzzle, suite.cellPoint(puzzle, 6, 0));

  assert("Right clue data after click").that(puzzle.right[0].data).isEqualTo({text: '5', image: 'white_circle'});

  suite.click(puzzle, suite.cellPoint(puzzle, 6, 0));

  assert("Right clue data after two clicks").that(puzzle.right[0].data).isEqualTo({text: '5'});
}),

test('Paint pentomino by drag',(suite) => {
  let puzzle = suite.showPuzzle("pentomino", "6x6-IV", suite.CLUES);
  puzzle.start();

  // Shaded cell a2 is copied along the second row, cross clue in b2 is skipped.
  suite.cellClick(puzzle, "a2");
  suite.dragThrough(puzzle, ["a2", "b2", "c2", "d2", "e2"]);

  let shaded = {color: puzzle.colorSchema.greyColor, returnValue: '1'};
  assert("Cell a2 after drag").that(puzzle.cells[1][0].data).isEqualTo(shaded);
  assert("Cross clue after drag").that(puzzle.cells[1][1].data).isEqualTo({image: 'cross'});
  assert("Cell c2 after drag").that(puzzle.cells[1][2].data).isEqualTo(shaded);
  assert("Cell d2 after drag").that(puzzle.cells[1][3].data).isEqualTo(shaded);
  assert("Cell e2 after drag").that(puzzle.cells[1][4].data).isEqualTo(shaded);
  assert("Cell c2 value").that(puzzle.cells[1][2].getValue()).isEqualTo('1');
  assert("Cell f2 is not reached").that(puzzle.cells[1][5].data).isEqualTo({});
  assert("Cell of the first row").that(puzzle.cells[0][2].data).isEqualTo({});

  // The drag can turn.
  suite.dragThrough(puzzle, ["e2", "e3", "f3"]);

  assert("Cell e3 after drag").that(puzzle.cells[2][4].data).isEqualTo(shaded);
  assert("Cell f3 after drag").that(puzzle.cells[2][5].data).isEqualTo(shaded);
}),

test('Copy cross by drag',(suite) => {
  let puzzle = suite.showPuzzle("pentomino", "6x6-IV", suite.CLUES);
  puzzle.start();

  // Cross is copied from the clue cell b2.
  suite.dragThrough(puzzle, ["b2", "b3", "b4"]);

  assert("Clue cell after drag").that(puzzle.cells[1][1].data).isEqualTo({image: 'cross'});
  assert("Cell b3 after drag").that(puzzle.cells[2][1].data).isEqualTo({image: 'cross'});
  assert("Cell b4 after drag").that(puzzle.cells[3][1].data).isEqualTo({image: 'cross'});
  assert("Cell b4 value").that(puzzle.cells[3][1].getValue()).isNull();

  // Cross set by solver is copied the same way and can be changed by click.
  suite.dragThrough(puzzle, ["b4", "c4"]);
  assert("Cell c4 after drag").that(puzzle.cells[3][2].data).isEqualTo({image: 'cross'});

  suite.cellClick(puzzle, "c4");
  assert("Cell c4 after click").that(puzzle.cells[3][2].data).isEqualTo({});
}),

test('Erase by drag from empty cell',(suite) => {
  let puzzle = suite.showPuzzle("pentomino", "6x6-IV", suite.CLUES);
  puzzle.start();

  suite.cellClick(puzzle, "a4");
  suite.cellClick(puzzle, "a5");
  suite.cellClick(puzzle, "a5");

  suite.dragThrough(puzzle, ["a3", "a4", "a5"]);

  assert("Shaded cell after drag").that(puzzle.cells[3][0].data).isEqualTo({});
  assert("Shaded cell value after drag").that(puzzle.cells[3][0].getValue()).isNull();
  assert("Cross cell after drag").that(puzzle.cells[4][0].data).isEqualTo({});
}),

test('Drag does not change outer clues',(suite) => {
  let puzzle = suite.showPuzzle("pentomino", "6x6-IV", suite.CLUES);
  puzzle.start();

  // From the shaded cell f1 to the clue of the row 1 and from f6 to the clue of the column f.
  suite.cellClick(puzzle, "f1");
  suite.drag(puzzle, suite.cellPoint(puzzle, "f1"), suite.cellPoint(puzzle, 6, 0));
  suite.cellClick(puzzle, "f6");
  suite.drag(puzzle, suite.cellPoint(puzzle, "f6"), suite.cellPoint(puzzle, 5, 6));

  assert("Right clue after drag").that(puzzle.right[0].data).isEqualTo({text: '5'});
  assert("Bottom clue after drag").that(puzzle.bottom[5].data).isEqualTo({text: '1'});
  assert("Start cell after drag").that(puzzle.cells[0][5].getValue()).isEqualTo('1');

  // From the clue of the row 3 to the cell f3.
  suite.drag(puzzle, suite.cellPoint(puzzle, 6, 2), suite.cellPoint(puzzle, "f3"));

  assert("Cell after drag from the clue").that(puzzle.cells[2][5].data).isEqualTo({});
}),

test('Process clicks in author mode',(suite) => {
  let puzzle = suite.showPuzzle("pentomino", "6x6-IV");
  puzzle.edit();

  suite.cellClick(puzzle, "b2");

  assert("Cell value after click").that(puzzle.cells[1][1].getValue()).isEqualTo('cross');
  assert("Cell data after click").that(puzzle.cells[1][1].data).isEqualTo({image: 'cross', returnValue: 'cross'});

  suite.cellClick(puzzle, "b2");

  assert("Cell value after two clicks").that(puzzle.cells[1][1].getValue()).isNull();
  assert("Cell data after two clicks").that(puzzle.cells[1][1].data).isEqualTo({});
}),

test('Open chooser for outer clue in author mode',(suite) => {
  let puzzle = suite.showPuzzle("pentomino", "6x6-IV");
  puzzle.edit();

  assert("Chooser before click").that(puzzle.controller.chooserBuilder.chooserElements).isEmptyArray();

  // Clue to the right of the row 3.
  suite.click(puzzle, suite.cellPoint(puzzle, 6, 2));

  assert("Chooser after click").that(puzzle.controller.chooserBuilder.chooserElements).isNonEmptyArray();
  assert("Chooser is connected to the clue").that(puzzle.controller.chooserBuilder.element == puzzle.right[2]).isEqualTo(true);
  assert("Clue data after click").that(puzzle.right[2].data).isEqualTo({});

  // The third item of the chooser is "1".
  puzzle.right[2].switchOnChooser(2);

  assert("Clue value").that(puzzle.right[2].getValue()).isEqualTo('1');
  assert("Clue data").that(puzzle.right[2].data).isEqualTo({text: '1', returnValue: '1'});
}),

// Data collector tests
test('Data collector',(suite) => {
  let puzzle = suite.showPuzzle("pentomino", "6x6-IV", suite.CLUES);
  puzzle.start();

  // Solution from the checker tests: pentominoes I and V.
  //     a b c d e f
  //  1  # # # # # .  5
  //  2  . x . . . .
  //  3  . . . # . .  1
  //  4  . . . # . .  1
  //  5  . . . # # #  3
  //  6  . . . . . .
  //     1 1   4 2 1
  suite.cellClick(puzzle, "a1");
  suite.dragThrough(puzzle, ["a1", "b1", "c1", "d1", "e1"]);
  suite.cellClick(puzzle, "d3");
  suite.dragThrough(puzzle, ["d3", "d4", "d5", "e5", "f5"]);

  // Auxiliary marks are not submitted: crosses in the row 2 and circles at the solved outer clues.
  suite.dragThrough(puzzle, ["b2", "c2", "d2", "e2", "f2"]);
  suite.cellClick(puzzle, "a6");
  suite.cellClick(puzzle, "a6");
  suite.click(puzzle, suite.cellPoint(puzzle, 6, 0));
  suite.click(puzzle, suite.cellPoint(puzzle, 3, 6));

  assert("Submission data").that(puzzle.collectData()).isEqualTo(
    {"a1": "1", "b1": "1", "c1": "1", "d1": "1", "e1": "1", "d3": "1", "d4": "1", "d5": "1", "e5": "1", "f5": "1"});
}),

test('Author data collector',(suite) => {
  let puzzle = suite.showPuzzle("pentomino", "6x6-IV");
  puzzle.edit();

  assert("Data of the empty puzzle").that(puzzle.collectData()).isEqualTo({});

  // Clues from the checker tests: cross in b2 and numbers below and to the right of the grid.
  suite.cellClick(puzzle, "b2");
  puzzle.bottom[0].switchOnChooser(2);
  puzzle.bottom[1].switchOnChooser(2);
  puzzle.bottom[3].switchOnChooser(5);
  puzzle.bottom[4].switchOnChooser(3);
  puzzle.bottom[5].switchOnChooser(2);
  puzzle.right[0].switchOnChooser(6);
  puzzle.right[2].switchOnChooser(2);
  puzzle.right[3].switchOnChooser(2);
  puzzle.right[4].switchOnChooser(4);

  assert("Puzzle data").that(puzzle.collectData()).isEqualTo(suite.CLUES);

  // Clue is removed by the empty item of the chooser, clue 0 is set by the second item.
  puzzle.bottom[3].switchOnChooser(0);
  puzzle.right[5].switchOnChooser(1);

  assert("Puzzle data after changes").that(puzzle.collectData()).isEqualTo(
    {"b2": "cross", "bottom": ["1", "1", null, null, "2", "1"], "right": ["5", null, "1", "1", "3", "0"]});
}),

test('Author data collector for existing puzzle',(suite) => {
  let puzzle = suite.showPuzzle("pentomino", "6x6-IV", suite.CLUES);
  puzzle.edit();

  assert("Loaded clue").that(puzzle.bottom[3].getValue()).isEqualTo('4');
  assert("Loaded cross").that(puzzle.cells[1][1].getValue()).isEqualTo('cross');
  assert("Puzzle data").that(puzzle.collectData()).isEqualTo(suite.CLUES);

  // Add clue 0 for the row 2 and remove the cross.
  puzzle.right[1].switchOnChooser(1);
  suite.cellClick(puzzle, "b2");

  assert("Puzzle data after changes").that(puzzle.collectData()).isEqualTo(
    {"bottom": ["1", "1", null, "4", "2", "1"], "right": ["5", "0", "1", "1", "3", null]});
}),

);
