arrowWebTestSuite = uiTestSuite("Arrow Web", "squarepuzzle", "squarePuzzleType",

beforeSuite((suite, cb)=> {
  // Emulates one mouse drag which goes through the centers of the given cells.
  suite.dragThrough = function(puzzle, cells) {
    puzzle.controller.onMouseDown(suite.mouseEvent(suite.cellPoint(puzzle, cells[0])));
    for (let i = 1; i < cells.length; i++) {
      puzzle.controller.onMouseMove(suite.mouseEvent(suite.cellPoint(puzzle, cells[i])));
    }
    puzzle.controller.onMouseUp(suite.mouseEvent(suite.cellPoint(puzzle, cells[cells.length - 1])));
  };
  // Puzzle from the checker tests: every cell contains an arrow, which should point to exactly one black cell.
  //     a  b  c
  //  1  ↘  ←  ↓
  //  2  ↑  ↖  ↓
  //  3  →  →  ↖
  suite.CLUES = {"a1": "arrow_dr", "b1": "arrow_l", "c1": "arrow_d", "a2": "arrow_u", "b2": "arrow_ul", "c2": "arrow_d", "a3": "arrow_r", "b3": "arrow_r", "c3": "arrow_ul"};
  cb();
}),

// Controller definition tests
test('Solver controllers',(suite) => {
  // Puzzle with two arrows only.
  let puzzle = suite.showPuzzle("arrow_web", "3x3", {"a1": "arrow_dr", "c3": "arrow_ul"});
  puzzle.start();

  assert("Arrow cell chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("Arrow cell click").that(puzzle.cells[0][0].clickSwitch).containsExactly(
    [{image: 'white_arrow_dr'},
     {image: 'white_arrow_dr', color: puzzle.colorSchema.gridColor, returnValue: '1'},
     {image: 'white_arrow_dr', color: puzzle.colorSchema.lightGreyColor}]);
  assert("Arrow cell drag processor").that(puzzle.cells[0][0].dragProcessor).isNotNull();
  assert("Empty cell chooser").that(puzzle.cells[1][1].chooserValues).isNull();
  assert("Empty cell click").that(puzzle.cells[1][1].clickSwitch).containsExactly(
    [{}, {color: puzzle.colorSchema.gridColor, returnValue: '1'}, {color: puzzle.colorSchema.lightGreyColor}]);
  assert("Empty cell drag processor").that(puzzle.cells[1][1].dragProcessor).isNotNull();
  assert("Edge click").that(puzzle.edges[0][0][1].clickSwitch).isNull();
  assert("Edge drag").that(puzzle.edges[0][0][1].dragSwitch).isNull();
}),

test('Author controllers',(suite) => {
  let puzzle = suite.showPuzzle("arrow_web", "3x3");
  puzzle.edit();

  let arrowItem = function(direction) {
    return {image: 'white_arrow_' + direction, returnValue: 'arrow_' + direction};
  }
  assert("Cell chooser").that(puzzle.cells[0][0].chooserValues).containsExactly(
    [{}, arrowItem('u'), arrowItem('ur'), arrowItem('r'), arrowItem('dr'), arrowItem('d'), arrowItem('dl'), arrowItem('l'), arrowItem('ul')]);
  assert("Cell click").that(puzzle.cells[0][0].clickSwitch).isNull();
  assert("Cell drag processor").that(puzzle.cells[0][0].dragProcessor).isNull();
  assert("Edge click").that(puzzle.edges[0][0][1].clickSwitch).isNull();
}),

// Clues display tests
test('Show clues',(suite) => {
  let puzzle = suite.showPuzzle("arrow_web", "3x3", suite.CLUES);
  puzzle.start();

  assert("Arrow in a1").that(puzzle.cells[0][0].data).isEqualTo({image: 'white_arrow_dr'});
  assert("Arrow in b1").that(puzzle.cells[0][1].data).isEqualTo({image: 'white_arrow_l'});
  assert("Arrow in a2").that(puzzle.cells[1][0].data).isEqualTo({image: 'white_arrow_u'});
  assert("Arrow in b3").that(puzzle.cells[2][1].data).isEqualTo({image: 'white_arrow_r'});
  assert("Arrow in c3").that(puzzle.cells[2][2].data).isEqualTo({image: 'white_arrow_ul'});
  assert("Arrow is not a part of the solution").that(puzzle.cells[0][0].getValue()).isNull();
}),

// Mouse processing tests
test('Process clicks to cell with arrow',(suite) => {
  let puzzle = suite.showPuzzle("arrow_web", "3x3", suite.CLUES);
  puzzle.start();

  suite.cellClick(puzzle, "a1");

  assert("Cell value after one click").that(puzzle.cells[0][0].getValue()).isEqualTo("1");
  assert("Cell data after one click").that(puzzle.cells[0][0].data).isEqualTo({image: 'white_arrow_dr', color: puzzle.colorSchema.gridColor, returnValue: '1'});

  suite.cellClick(puzzle, "a1");

  assert("Cell value after two clicks").that(puzzle.cells[0][0].getValue()).isNull();
  assert("Cell data after two clicks").that(puzzle.cells[0][0].data).isEqualTo({image: 'white_arrow_dr', color: puzzle.colorSchema.lightGreyColor});

  suite.cellClick(puzzle, "a1");

  assert("Cell value after three clicks").that(puzzle.cells[0][0].getValue()).isNull();
  assert("Cell data after three clicks").that(puzzle.cells[0][0].data).isEqualTo({image: 'white_arrow_dr'});
  assert("Neighbour cell is not changed").that(puzzle.cells[0][1].data).isEqualTo({image: 'white_arrow_l'});
}),

test('Process clicks to cell without arrow',(suite) => {
  let puzzle = suite.showPuzzle("arrow_web", "3x3", {"a1": "arrow_dr", "c3": "arrow_ul"});
  puzzle.start();

  assert("Cell data before click").that(puzzle.cells[1][1].data).isEqualTo({});

  suite.cellClick(puzzle, "b2");

  assert("Cell value after one click").that(puzzle.cells[1][1].getValue()).isEqualTo("1");
  assert("Cell data after one click").that(puzzle.cells[1][1].data).isEqualTo({color: puzzle.colorSchema.gridColor, returnValue: '1'});

  suite.cellClick(puzzle, "b2");

  assert("Cell value after two clicks").that(puzzle.cells[1][1].getValue()).isNull();
  assert("Cell data after two clicks").that(puzzle.cells[1][1].data).isEqualTo({color: puzzle.colorSchema.lightGreyColor});

  suite.cellClick(puzzle, "b2");

  assert("Cell value after three clicks").that(puzzle.cells[1][1].getValue()).isNull();
  assert("Cell data after three clicks").that(puzzle.cells[1][1].data).isEqualTo({});
}),

test('Paint cells by drag',(suite) => {
  let puzzle = suite.showPuzzle("arrow_web", "3x3", suite.CLUES);
  puzzle.start();

  // Black color of a1 is copied to b1 and c1, arrows of the cells are kept.
  suite.cellClick(puzzle, "a1");
  suite.dragThrough(puzzle, ["a1", "b1", "c1"]);

  assert("Cell a1 after drag").that(puzzle.cells[0][0].data).isEqualTo({image: 'white_arrow_dr', color: puzzle.colorSchema.gridColor, returnValue: '1'});
  assert("Cell b1 image after drag").that(puzzle.cells[0][1].data.image).isEqualTo('white_arrow_l');
  assert("Cell b1 color after drag").that(puzzle.cells[0][1].data.color).isEqualTo(puzzle.colorSchema.gridColor);
  assert("Cell b1 value after drag").that(puzzle.cells[0][1].getValue()).isEqualTo('1');
  assert("Cell c1 image after drag").that(puzzle.cells[0][2].data.image).isEqualTo('white_arrow_d');
  assert("Cell c1 color after drag").that(puzzle.cells[0][2].data.color).isEqualTo(puzzle.colorSchema.gridColor);
  assert("Cell c1 value after drag").that(puzzle.cells[0][2].getValue()).isEqualTo('1');
  assert("Cell of the second row").that(puzzle.cells[1][1].data).isEqualTo({image: 'white_arrow_ul'});

  // Cell painted by drag is switched by click the same way.
  suite.cellClick(puzzle, "c1");

  assert("Cell c1 image after click").that(puzzle.cells[0][2].data.image).isEqualTo('white_arrow_d');
  assert("Cell c1 color after click").that(puzzle.cells[0][2].data.color).isEqualTo(puzzle.colorSchema.lightGreyColor);
  assert("Cell c1 value after click").that(puzzle.cells[0][2].getValue()).isNull();
}),

test('Paint light grey cells by drag',(suite) => {
  let puzzle = suite.showPuzzle("arrow_web", "3x3", suite.CLUES);
  puzzle.start();

  // Light grey marks the cells which are known as not black.
  suite.cellClick(puzzle, "a2");
  suite.cellClick(puzzle, "a2");
  suite.dragThrough(puzzle, ["a2", "b2", "b3"]);

  assert("Cell a2 after drag").that(puzzle.cells[1][0].data).isEqualTo({image: 'white_arrow_u', color: puzzle.colorSchema.lightGreyColor});
  assert("Cell b2 image after drag").that(puzzle.cells[1][1].data.image).isEqualTo('white_arrow_ul');
  assert("Cell b2 color after drag").that(puzzle.cells[1][1].data.color).isEqualTo(puzzle.colorSchema.lightGreyColor);
  assert("Cell b2 value after drag").that(puzzle.cells[1][1].getValue()).isNull();
  assert("Cell b3 image after drag").that(puzzle.cells[2][1].data.image).isEqualTo('white_arrow_r');
  assert("Cell b3 color after drag").that(puzzle.cells[2][1].data.color).isEqualTo(puzzle.colorSchema.lightGreyColor);
  assert("Cell b3 value after drag").that(puzzle.cells[2][1].getValue()).isNull();
}),

test('Erase color by drag from uncolored cell',(suite) => {
  let puzzle = suite.showPuzzle("arrow_web", "3x3", suite.CLUES);
  puzzle.start();

  suite.cellClick(puzzle, "b3");
  suite.cellClick(puzzle, "c3");
  suite.cellClick(puzzle, "c3");

  suite.dragThrough(puzzle, ["a3", "b3", "c3"]);

  assert("Start cell after drag").that(puzzle.cells[2][0].data).isEqualTo({image: 'white_arrow_r'});
  assert("Black cell image after drag").that(puzzle.cells[2][1].data.image).isEqualTo('white_arrow_r');
  assert("Black cell color after drag").that(puzzle.cells[2][1].data.color).isNull();
  assert("Black cell value after drag").that(puzzle.cells[2][1].getValue()).isNull();
  assert("Light grey cell image after drag").that(puzzle.cells[2][2].data.image).isEqualTo('white_arrow_ul');
  assert("Light grey cell color after drag").that(puzzle.cells[2][2].data.color).isNull();
}),

test('Choose arrow in author mode',(suite) => {
  let puzzle = suite.showPuzzle("arrow_web", "3x3");
  puzzle.edit();

  assert("Chooser before click").that(puzzle.controller.chooserBuilder.chooserElements).isEmptyArray();

  suite.cellClick(puzzle, "b2");

  assert("Chooser after click").that(puzzle.controller.chooserBuilder.chooserElements).isNonEmptyArray();
  assert("Chooser is connected to the cell").that(puzzle.controller.chooserBuilder.element == puzzle.cells[1][1]).isEqualTo(true);
  assert("Cell data after click").that(puzzle.cells[1][1].data).isEqualTo({});

  // Arrows in the chooser go clockwise starting from the arrow up.
  puzzle.cells[1][1].switchOnChooser(1);

  assert("Arrow up value").that(puzzle.cells[1][1].getValue()).isEqualTo('arrow_u');
  assert("Arrow up data").that(puzzle.cells[1][1].data).isEqualTo({image: 'white_arrow_u', returnValue: 'arrow_u'});

  puzzle.cells[1][1].switchOnChooser(6);

  assert("Arrow down-left value").that(puzzle.cells[1][1].getValue()).isEqualTo('arrow_dl');
  assert("Arrow down-left data").that(puzzle.cells[1][1].data).isEqualTo({image: 'white_arrow_dl', returnValue: 'arrow_dl'});

  puzzle.cells[1][1].switchOnChooser(0);

  assert("Value after clean up").that(puzzle.cells[1][1].getValue()).isNull();
  assert("Data after clean up").that(puzzle.cells[1][1].data).isEqualTo({});
}),

// Data collector tests
test('Data collector',(suite) => {
  let puzzle = suite.showPuzzle("arrow_web", "3x3", suite.CLUES);
  puzzle.start();

  assert("Submission data for the empty grid").that(puzzle.collectData()).isEqualTo({});

  // Solution from the checker tests: black cells a1 and c3.
  suite.cellClick(puzzle, "a1");
  suite.cellClick(puzzle, "c3");

  // Light grey cells are not submitted.
  suite.cellClick(puzzle, "b1");
  suite.cellClick(puzzle, "b1");
  suite.dragThrough(puzzle, ["b1", "c1", "c2", "b2", "a2", "a3", "b3"]);

  assert("Submission data").that(puzzle.collectData()).isEqualTo({"a1": "1", "c3": "1"});

  // Black cells painted by drag are submitted.
  suite.dragThrough(puzzle, ["a1", "b1"]);

  assert("Submission data after drag").that(puzzle.collectData()).isEqualTo({"a1": "1", "b1": "1", "c3": "1"});
}),

test('Author data collector',(suite) => {
  let puzzle = suite.showPuzzle("arrow_web", "3x3");
  puzzle.edit();

  assert("Data of the empty puzzle").that(puzzle.collectData()).isEqualTo({});

  // Clues from the checker tests. Items of the chooser: 1 - up, 2 - up-right, 3 - right, 4 - down-right,
  // 5 - down, 6 - down-left, 7 - left, 8 - up-left.
  puzzle.cells[0][0].switchOnChooser(4);
  puzzle.cells[0][1].switchOnChooser(7);
  puzzle.cells[0][2].switchOnChooser(5);
  puzzle.cells[1][0].switchOnChooser(1);
  puzzle.cells[1][1].switchOnChooser(8);
  puzzle.cells[1][2].switchOnChooser(5);
  puzzle.cells[2][0].switchOnChooser(3);
  puzzle.cells[2][1].switchOnChooser(3);
  puzzle.cells[2][2].switchOnChooser(8);

  assert("Puzzle data").that(puzzle.collectData()).isEqualTo(suite.CLUES);

  // Replace arrow in a1 by up-right and down-left ones in turn and remove arrow from b2.
  puzzle.cells[0][0].switchOnChooser(2);
  puzzle.cells[1][1].switchOnChooser(0);

  assert("Puzzle data after changes").that(puzzle.collectData()).isEqualTo(
    {"a1": "arrow_ur", "b1": "arrow_l", "c1": "arrow_d", "a2": "arrow_u", "c2": "arrow_d", "a3": "arrow_r", "b3": "arrow_r", "c3": "arrow_ul"});

  puzzle.cells[0][0].switchOnChooser(6);

  assert("Arrow value after the second change").that(puzzle.collectData()["a1"]).isEqualTo("arrow_dl");
}),

test('Author data collector for existing puzzle',(suite) => {
  let puzzle = suite.showPuzzle("arrow_web", "3x3", suite.CLUES);
  puzzle.edit();

  assert("Loaded arrow").that(puzzle.cells[0][0].getValue()).isEqualTo('arrow_dr');
  assert("Puzzle data").that(puzzle.collectData()).isEqualTo(suite.CLUES);
}),

);
