battleshipsTestSuite = uiTestSuite("Battleships", "squarepuzzle", "squarePuzzleType",

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
  // number of ship cells in the column and in the row.
  //     a b c d e f
  //  1  . . . ~ . .  4
  //  2  . . . . . .  1
  //  3  . . . . . .  2
  //  4  . . . . . .  2
  //  5  . . . . . .  0
  //  6  . . . . . .  1
  //     3 1 3 0 3 0
  suite.CLUES = {"d1": "wave", "bottom": ["3", "1", "3", "0", "3", "0"], "right": ["4", "1", "2", "2", "0", "1"]};
  cb();
}),

// Controller definition tests
test('Solver controllers',(suite) => {
  let puzzle = suite.showPuzzle("battleships", "6x6-ship3", suite.CLUES);
  puzzle.start();

  assert("Empty cell chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("Empty cell click").that(puzzle.cells[0][0].clickSwitch).containsExactly([{}, {color: puzzle.colorSchema.greyColor, returnValue: '1'}, {image: 'wave'}]);
  assert("Empty cell drag processor").that(puzzle.cells[0][0].dragProcessor).isNotNull();
  assert("Wave cell chooser").that(puzzle.cells[0][3].chooserValues).isNull();
  assert("Wave cell click").that(puzzle.cells[0][3].clickSwitch).isNull();
  assert("Wave cell drag processor").that(puzzle.cells[0][3].dragProcessor).isNotNull();
  assert("Bottom clue chooser").that(puzzle.bottom[0].chooserValues).isNull();
  assert("Bottom clue click").that(puzzle.bottom[0].clickSwitch).containsExactly([{text: '3'}, {text: '3', image: 'white_circle'}]);
  assert("Bottom clue drag processor").that(puzzle.bottom[0].dragProcessor).isNull();
  assert("Right clue chooser").that(puzzle.right[0].chooserValues).isNull();
  assert("Right clue click").that(puzzle.right[0].clickSwitch).containsExactly([{text: '4'}, {text: '4', image: 'white_circle'}]);
  assert("Right clue drag processor").that(puzzle.right[0].dragProcessor).isNull();
  assert("Edge click").that(puzzle.edges[0][0][1].clickSwitch).isNull();
  assert("Edge drag").that(puzzle.edges[0][0][1].dragSwitch).isNull();
}),

test('Author controllers',(suite) => {
  let puzzle = suite.showPuzzle("battleships", "6x6-ship3");
  puzzle.edit();

  let numberItem = function(number) {
    return {text: number, returnValue: number};
  }
  assert("Cell chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("Cell click").that(puzzle.cells[0][0].clickSwitch).containsExactly([{}, {image: 'wave', returnValue: 'wave'}]);
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
  let puzzle = suite.showPuzzle("battleships", "6x6-ship3", suite.CLUES);
  puzzle.start();

  assert("Number of bottom clues").that(puzzle.bottom.length).isEqualTo(6);
  assert("Number of right clues").that(puzzle.right.length).isEqualTo(6);
  assert("Clue below column a").that(puzzle.bottom[0].data).isEqualTo({text: '3'});
  assert("Clue below column d").that(puzzle.bottom[3].data).isEqualTo({text: '0'});
  assert("Clue to the right of row 1").that(puzzle.right[0].data).isEqualTo({text: '4'});
  assert("Clue to the right of row 6").that(puzzle.right[5].data).isEqualTo({text: '1'});
  assert("Wave clue").that(puzzle.cells[0][3].data).isEqualTo({image: 'wave'});
  assert("Wave clue is not a part of the solution").that(puzzle.cells[0][3].getValue()).isNull();

  let texts = $(suite.GRID_SELECTOR + " text").map((i, element) => $(element).text()).get();
  assert("Texts in the grid").that(texts).isEqualTo(["3", "1", "3", "0", "3", "0", "4", "1", "2", "2", "0", "1"]);
}),

// Mouse processing tests
test('Process clicks to empty cell',(suite) => {
  let puzzle = suite.showPuzzle("battleships", "6x6-ship3", suite.CLUES);
  puzzle.start();

  assert("Cell value before click").that(puzzle.cells[0][0].getValue()).isNull();
  assert("Cell data before click").that(puzzle.cells[0][0].data).isEqualTo({});

  suite.cellClick(puzzle, "a1");

  assert("Cell value after one click").that(puzzle.cells[0][0].getValue()).isEqualTo("1");
  assert("Cell data after one click").that(puzzle.cells[0][0].data).isEqualTo({color: puzzle.colorSchema.greyColor, returnValue: '1'});

  suite.cellClick(puzzle, "a1");

  assert("Cell value after two clicks").that(puzzle.cells[0][0].getValue()).isNull();
  assert("Cell data after two clicks").that(puzzle.cells[0][0].data).isEqualTo({image: 'wave'});

  suite.cellClick(puzzle, "a1");

  assert("Cell value after three clicks").that(puzzle.cells[0][0].getValue()).isNull();
  assert("Cell data after three clicks").that(puzzle.cells[0][0].data).isEqualTo({});
  assert("Neighbour cell is not changed").that(puzzle.cells[0][1].data).isEqualTo({});
}),

test('Wave clue is not changed by click',(suite) => {
  let puzzle = suite.showPuzzle("battleships", "6x6-ship3", suite.CLUES);
  puzzle.start();

  suite.cellClick(puzzle, "d1");

  assert("Clue data after click").that(puzzle.cells[0][3].data).isEqualTo({image: 'wave'});
  assert("Clue value after click").that(puzzle.cells[0][3].getValue()).isNull();
}),

test('Mark outer clues by click',(suite) => {
  let puzzle = suite.showPuzzle("battleships", "6x6-ship3", suite.CLUES);
  puzzle.start();

  // Clue below the column a.
  suite.click(puzzle, suite.cellPoint(puzzle, 0, 6));

  assert("Bottom clue data after click").that(puzzle.bottom[0].data).isEqualTo({text: '3', image: 'white_circle'});
  assert("Bottom clue value after click").that(puzzle.bottom[0].getValue()).isNull();
  assert("Next bottom clue").that(puzzle.bottom[1].data).isEqualTo({text: '1'});

  suite.click(puzzle, suite.cellPoint(puzzle, 0, 6));

  assert("Bottom clue data after two clicks").that(puzzle.bottom[0].data).isEqualTo({text: '3'});

  // Clue to the right of the row 2.
  suite.click(puzzle, suite.cellPoint(puzzle, 6, 1));

  assert("Right clue data after click").that(puzzle.right[1].data).isEqualTo({text: '1', image: 'white_circle'});

  suite.click(puzzle, suite.cellPoint(puzzle, 6, 1));

  assert("Right clue data after two clicks").that(puzzle.right[1].data).isEqualTo({text: '1'});
}),

test('Paint ship by drag',(suite) => {
  let puzzle = suite.showPuzzle("battleships", "6x6-ship3", suite.CLUES);
  puzzle.start();

  // Ship cell in a1 is copied along the first row, wave clue in d1 is skipped.
  suite.cellClick(puzzle, "a1");
  suite.dragThrough(puzzle, ["a1", "b1", "c1", "d1", "e1"]);

  let ship = {color: puzzle.colorSchema.greyColor, returnValue: '1'};
  assert("Cell a1 after drag").that(puzzle.cells[0][0].data).isEqualTo(ship);
  assert("Cell b1 after drag").that(puzzle.cells[0][1].data).isEqualTo(ship);
  assert("Cell c1 after drag").that(puzzle.cells[0][2].data).isEqualTo(ship);
  assert("Wave clue after drag").that(puzzle.cells[0][3].data).isEqualTo({image: 'wave'});
  assert("Cell e1 after drag").that(puzzle.cells[0][4].data).isEqualTo(ship);
  assert("Cell b1 value").that(puzzle.cells[0][1].getValue()).isEqualTo('1');
  assert("Cell f1 is not reached").that(puzzle.cells[0][5].data).isEqualTo({});
  assert("Cell of the second row").that(puzzle.cells[1][1].data).isEqualTo({});
}),

test('Copy wave by drag',(suite) => {
  let puzzle = suite.showPuzzle("battleships", "6x6-ship3", suite.CLUES);
  puzzle.start();

  // Wave is copied from the clue cell d1.
  suite.dragThrough(puzzle, ["d1", "d2", "d3"]);

  assert("Clue cell after drag").that(puzzle.cells[0][3].data).isEqualTo({image: 'wave'});
  assert("Cell d2 after drag").that(puzzle.cells[1][3].data).isEqualTo({image: 'wave'});
  assert("Cell d3 after drag").that(puzzle.cells[2][3].data).isEqualTo({image: 'wave'});
  assert("Cell d3 value").that(puzzle.cells[2][3].getValue()).isNull();

  // Wave set by solver is copied the same way and can be changed by click.
  suite.dragThrough(puzzle, ["d3", "c3"]);
  assert("Cell c3 after drag").that(puzzle.cells[2][2].data).isEqualTo({image: 'wave'});

  suite.cellClick(puzzle, "c3");
  assert("Cell c3 after click").that(puzzle.cells[2][2].data).isEqualTo({});
}),

test('Erase by drag from empty cell',(suite) => {
  let puzzle = suite.showPuzzle("battleships", "6x6-ship3", suite.CLUES);
  puzzle.start();

  suite.cellClick(puzzle, "a3");
  suite.cellClick(puzzle, "a4");
  suite.cellClick(puzzle, "a4");

  suite.dragThrough(puzzle, ["a2", "a3", "a4"]);

  assert("Ship cell after drag").that(puzzle.cells[2][0].data).isEqualTo({});
  assert("Ship cell value after drag").that(puzzle.cells[2][0].getValue()).isNull();
  assert("Wave cell after drag").that(puzzle.cells[3][0].data).isEqualTo({});
}),

test('Drag does not change outer clues',(suite) => {
  let puzzle = suite.showPuzzle("battleships", "6x6-ship3", suite.CLUES);
  puzzle.start();

  // From the ship cell f2 to the clue of the row 2 and to the clue of the column f.
  suite.cellClick(puzzle, "f2");
  suite.drag(puzzle, suite.cellPoint(puzzle, "f2"), suite.cellPoint(puzzle, 6, 1));
  suite.cellClick(puzzle, "f6");
  suite.drag(puzzle, suite.cellPoint(puzzle, "f6"), suite.cellPoint(puzzle, 5, 6));

  assert("Right clue after drag").that(puzzle.right[1].data).isEqualTo({text: '1'});
  assert("Bottom clue after drag").that(puzzle.bottom[5].data).isEqualTo({text: '0'});
  assert("Start cell after drag").that(puzzle.cells[1][5].getValue()).isEqualTo('1');

  // From the clue of the row 1 to the cell f1.
  suite.drag(puzzle, suite.cellPoint(puzzle, 6, 0), suite.cellPoint(puzzle, "f1"));

  assert("Cell after drag from the clue").that(puzzle.cells[0][5].data).isEqualTo({});
}),

test('Process clicks in author mode',(suite) => {
  let puzzle = suite.showPuzzle("battleships", "6x6-ship3");
  puzzle.edit();

  suite.cellClick(puzzle, "b2");

  assert("Cell value after click").that(puzzle.cells[1][1].getValue()).isEqualTo('wave');
  assert("Cell data after click").that(puzzle.cells[1][1].data).isEqualTo({image: 'wave', returnValue: 'wave'});

  suite.cellClick(puzzle, "b2");

  assert("Cell value after two clicks").that(puzzle.cells[1][1].getValue()).isNull();
  assert("Cell data after two clicks").that(puzzle.cells[1][1].data).isEqualTo({});
}),

test('Open chooser for outer clue in author mode',(suite) => {
  let puzzle = suite.showPuzzle("battleships", "6x6-ship3");
  puzzle.edit();

  assert("Chooser before click").that(puzzle.controller.chooserBuilder.chooserElements).isEmptyArray();

  // Clue below the column b.
  suite.click(puzzle, suite.cellPoint(puzzle, 1, 6));

  assert("Chooser after click").that(puzzle.controller.chooserBuilder.chooserElements).isNonEmptyArray();
  assert("Chooser is connected to the clue").that(puzzle.controller.chooserBuilder.element == puzzle.bottom[1]).isEqualTo(true);
  assert("Clue data after click").that(puzzle.bottom[1].data).isEqualTo({});

  // The fifth item of the chooser is "3".
  puzzle.bottom[1].switchOnChooser(4);

  assert("Clue value").that(puzzle.bottom[1].getValue()).isEqualTo('3');
  assert("Clue data").that(puzzle.bottom[1].data).isEqualTo({text: '3', returnValue: '3'});
}),

// Data collector tests
test('Data collector',(suite) => {
  let puzzle = suite.showPuzzle("battleships", "6x6-ship3", suite.CLUES);
  puzzle.start();

  // Solution from the checker tests:
  //     a b c d e f
  //  1  # # # ~ # .  4
  //  2  . . . . # .  1
  //  3  # . # . . .  2
  //  4  # . . . # .  2
  //  5  . . . . . .  0
  //  6  . . # . . .  1
  //     3 1 3 0 3 0
  suite.cellClick(puzzle, "a1");
  suite.dragThrough(puzzle, ["a1", "b1", "c1"]);
  suite.cellClick(puzzle, "e1");
  suite.dragThrough(puzzle, ["e1", "e2"]);
  suite.cellClick(puzzle, "a3");
  suite.dragThrough(puzzle, ["a3", "a4"]);
  suite.cellClick(puzzle, "c3");
  suite.cellClick(puzzle, "e4");
  suite.cellClick(puzzle, "c6");

  // Auxiliary marks are not submitted: waves in the row 5 and circles at the solved outer clues.
  suite.cellClick(puzzle, "a5");
  suite.cellClick(puzzle, "a5");
  suite.dragThrough(puzzle, ["a5", "b5", "c5", "d5", "e5", "f5"]);
  suite.click(puzzle, suite.cellPoint(puzzle, 6, 4));
  suite.click(puzzle, suite.cellPoint(puzzle, 3, 6));

  assert("Submission data").that(puzzle.collectData()).isEqualTo(
    {"a1": "1", "b1": "1", "c1": "1", "e1": "1", "e2": "1", "a3": "1", "a4": "1", "c3": "1", "e4": "1", "c6": "1"});
}),

test('Author data collector',(suite) => {
  let puzzle = suite.showPuzzle("battleships", "6x6-ship3");
  puzzle.edit();

  assert("Data of the empty puzzle").that(puzzle.collectData()).isEqualTo({});

  // Wave in d1, clue 3 below the column a, clue 0 below the column d, clue 4 for the row 1 and clue 1 for the row 6.
  suite.cellClick(puzzle, "d1");
  puzzle.bottom[0].switchOnChooser(4);
  puzzle.bottom[3].switchOnChooser(1);
  puzzle.right[0].switchOnChooser(5);
  puzzle.right[5].switchOnChooser(2);

  assert("Puzzle data").that(puzzle.collectData()).isEqualTo(
    {"d1": "wave", "bottom": ["3", null, null, "0", null, null], "right": ["4", null, null, null, null, "1"]});

  // Clue is removed by the empty item of the chooser.
  puzzle.bottom[3].switchOnChooser(0);

  assert("Puzzle data after removing clue").that(puzzle.collectData()).isEqualTo(
    {"d1": "wave", "bottom": ["3", null, null, null, null, null], "right": ["4", null, null, null, null, "1"]});
}),

test('Author data collector for existing puzzle',(suite) => {
  let puzzle = suite.showPuzzle("battleships", "6x6-ship3", suite.CLUES);
  puzzle.edit();

  assert("Loaded clue").that(puzzle.bottom[0].getValue()).isEqualTo('3');
  assert("Puzzle data").that(puzzle.collectData()).isEqualTo(suite.CLUES);

  // Change clue for the row 2 from 1 to 2 and remove the wave.
  puzzle.right[1].switchOnChooser(3);
  suite.cellClick(puzzle, "d1");

  assert("Puzzle data after changes").that(puzzle.collectData()).isEqualTo(
    {"bottom": ["3", "1", "3", "0", "3", "0"], "right": ["4", "2", "2", "2", "0", "1"]});
}),

);
