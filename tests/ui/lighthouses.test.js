lighthousesTestSuite = uiTestSuite("Lighthouses", "squarepuzzle", "squarePuzzleType",

beforeSuite((suite, cb)=> {
  // Emulates one mouse drag which goes through the centers of the given cells.
  suite.dragThrough = function(puzzle, cells) {
    puzzle.controller.onMouseDown(suite.mouseEvent(suite.cellPoint(puzzle, cells[0])));
    for (let i = 1; i < cells.length; i++) {
      puzzle.controller.onMouseMove(suite.mouseEvent(suite.cellPoint(puzzle, cells[i])));
    }
    puzzle.controller.onMouseUp(suite.mouseEvent(suite.cellPoint(puzzle, cells[cells.length - 1])));
  };
  // Puzzle from the checker tests: number is a lighthouse with the amount of boats in its row and column,
  // x is a cell without boat.
  //     a b c d e
  //  1  2 . . . x
  //  2  . . . . .
  //  3  . . . . .
  //  4  . . . . .
  //  5  . . 1 . 1
  suite.CLUES = {"a1": "2", "e1": "cross", "c5": "1", "e5": "1"};
  cb();
}),

// Controller definition tests
test('Solver controllers',(suite) => {
  let puzzle = suite.showPuzzle("lighthouses", "5x5", suite.CLUES);
  puzzle.start();

  assert("Empty cell chooser").that(puzzle.cells[0][1].chooserValues).isNull();
  assert("Empty cell click").that(puzzle.cells[0][1].clickSwitch).containsExactly([{}, {image: 'boat', returnValue: 'boat'}, {image: 'cross'}]);
  assert("Empty cell drag processor").that(puzzle.cells[0][1].dragProcessor).isNotNull();
  assert("Lighthouse chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("Lighthouse click").that(puzzle.cells[0][0].clickSwitch).containsExactly([{text: '2'}, {text: '2', image: 'white_circle'}]);
  assert("Lighthouse drag processor").that(puzzle.cells[0][0].dragProcessor).isNotNull();
  assert("Cross cell chooser").that(puzzle.cells[0][4].chooserValues).isNull();
  assert("Cross cell drag processor").that(puzzle.cells[0][4].dragProcessor).isNotNull();
  assert("Edge click").that(puzzle.edges[0][0][1].clickSwitch).isNull();
  assert("Edge drag").that(puzzle.edges[0][0][1].dragSwitch).isNull();
}),

test('Author controllers',(suite) => {
  let puzzle = suite.showPuzzle("lighthouses", "5x5");
  puzzle.edit();

  let numberItem = function(number) {
    return {text: number, returnValue: number};
  }
  assert("Cell chooser").that(puzzle.cells[0][0].chooserValues).containsExactly(
    [{}, {image: 'cross', returnValue: 'cross'}, numberItem('0'), numberItem('1'), numberItem('2'), numberItem('3'), numberItem('4'),
     numberItem('5'), numberItem('6'), numberItem('7'), numberItem('8'), numberItem('9'), numberItem('10')]);
  assert("Cell click").that(puzzle.cells[0][0].clickSwitch).isNull();
  assert("Cell drag processor").that(puzzle.cells[0][0].dragProcessor).isNull();
  assert("Edge click").that(puzzle.edges[0][0][1].clickSwitch).isNull();
}),

// Clues display tests
test('Show clues',(suite) => {
  let puzzle = suite.showPuzzle("lighthouses", "5x5", suite.CLUES);
  puzzle.start();

  assert("Lighthouse a1").that(puzzle.cells[0][0].data).isEqualTo({text: '2'});
  assert("Lighthouse is not a part of the solution").that(puzzle.cells[0][0].getValue()).isNull();
  assert("Lighthouse e5").that(puzzle.cells[4][4].data).isEqualTo({text: '1'});
  assert("Cross clue").that(puzzle.cells[0][4].data).isEqualTo({image: 'cross'});
  assert("Cross clue is not a part of the solution").that(puzzle.cells[0][4].getValue()).isNull();
  assert("Cell without clue").that(puzzle.cells[0][1].data).isEqualTo({});

  let texts = $(suite.GRID_SELECTOR + " text").map((i, element) => $(element).text()).get();
  assert("Texts in the grid").that(texts).isEqualTo(["2", "1", "1"]);
}),

// Mouse processing tests
test('Process clicks to empty cell',(suite) => {
  let puzzle = suite.showPuzzle("lighthouses", "5x5", suite.CLUES);
  puzzle.start();

  assert("Cell value before click").that(puzzle.cells[0][2].getValue()).isNull();
  assert("Cell data before click").that(puzzle.cells[0][2].data).isEqualTo({});

  suite.cellClick(puzzle, "c1");

  assert("Cell value after one click").that(puzzle.cells[0][2].getValue()).isEqualTo("boat");
  assert("Cell data after one click").that(puzzle.cells[0][2].data).isEqualTo({image: 'boat', returnValue: 'boat'});

  suite.cellClick(puzzle, "c1");

  assert("Cell value after two clicks").that(puzzle.cells[0][2].getValue()).isNull();
  assert("Cell data after two clicks").that(puzzle.cells[0][2].data).isEqualTo({image: 'cross'});

  suite.cellClick(puzzle, "c1");

  assert("Cell value after three clicks").that(puzzle.cells[0][2].getValue()).isNull();
  assert("Cell data after three clicks").that(puzzle.cells[0][2].data).isEqualTo({});
  assert("Neighbour cell is not changed").that(puzzle.cells[0][1].data).isEqualTo({});
}),

test('Mark lighthouse by click',(suite) => {
  let puzzle = suite.showPuzzle("lighthouses", "5x5", suite.CLUES);
  puzzle.start();

  suite.cellClick(puzzle, "a1");

  assert("Lighthouse data after click").that(puzzle.cells[0][0].data).isEqualTo({text: '2', image: 'white_circle'});
  assert("Lighthouse value after click").that(puzzle.cells[0][0].getValue()).isNull();
  assert("Other lighthouse").that(puzzle.cells[4][2].data).isEqualTo({text: '1'});

  suite.cellClick(puzzle, "a1");

  assert("Lighthouse data after two clicks").that(puzzle.cells[0][0].data).isEqualTo({text: '2'});
  assert("Lighthouse value after two clicks").that(puzzle.cells[0][0].getValue()).isNull();
}),

test('Copy cross by drag',(suite) => {
  let puzzle = suite.showPuzzle("lighthouses", "5x5", suite.CLUES);
  puzzle.start();

  // Cross is copied from the clue cell e1 down to the lighthouse e5, which is not changed.
  suite.dragThrough(puzzle, ["e1", "e2", "e3", "e4", "e5"]);

  assert("Clue cell after drag").that(puzzle.cells[0][4].data).isEqualTo({image: 'cross'});
  assert("Cell e2 after drag").that(puzzle.cells[1][4].data).isEqualTo({image: 'cross'});
  assert("Cell e3 after drag").that(puzzle.cells[2][4].data).isEqualTo({image: 'cross'});
  assert("Cell e4 after drag").that(puzzle.cells[3][4].data).isEqualTo({image: 'cross'});
  assert("Cell e4 value").that(puzzle.cells[3][4].getValue()).isNull();
  assert("Lighthouse after drag").that(puzzle.cells[4][4].data).isEqualTo({text: '1'});

  // Cross set by solver is copied the same way and can be changed by click.
  suite.dragThrough(puzzle, ["e3", "d3"]);
  assert("Cell d3 after drag").that(puzzle.cells[2][3].data).isEqualTo({image: 'cross'});

  suite.cellClick(puzzle, "d3");
  assert("Cell d3 after click").that(puzzle.cells[2][3].data).isEqualTo({});
}),

test('Mark crosses by drag from lighthouse',(suite) => {
  let puzzle = suite.showPuzzle("lighthouses", "5x5", suite.CLUES);
  puzzle.start();

  // Boats can't touch lighthouses, so drag from the lighthouse a1 marks its neighbours with crosses.
  suite.dragThrough(puzzle, ["a1", "a2", "b2", "b1"]);

  assert("Lighthouse after drag").that(puzzle.cells[0][0].data).isEqualTo({text: '2'});
  assert("Cell a2 after drag").that(puzzle.cells[1][0].data).isEqualTo({image: 'cross'});
  assert("Cell b2 after drag").that(puzzle.cells[1][1].data).isEqualTo({image: 'cross'});
  assert("Cell b1 after drag").that(puzzle.cells[0][1].data).isEqualTo({image: 'cross'});
  assert("Cell b1 value").that(puzzle.cells[0][1].getValue()).isNull();

  // Circle of the marked lighthouse is not copied, other lighthouse is not changed.
  suite.cellClick(puzzle, "c5");
  suite.dragThrough(puzzle, ["c5", "d5", "e5"]);

  assert("Marked lighthouse after drag").that(puzzle.cells[4][2].data).isEqualTo({text: '1', image: 'white_circle'});
  assert("Cell d5 after drag").that(puzzle.cells[4][3].data).isEqualTo({image: 'cross'});
  assert("Lighthouse e5 after drag").that(puzzle.cells[4][4].data).isEqualTo({text: '1'});
}),

test('Copy boat by drag',(suite) => {
  let puzzle = suite.showPuzzle("lighthouses", "5x5", suite.CLUES);
  puzzle.start();

  // Boat is moved from c2 to c1: copy it by drag and erase the original one by drag from empty cell.
  suite.cellClick(puzzle, "c2");
  suite.dragThrough(puzzle, ["c2", "c1"]);

  assert("Cell c1 after drag").that(puzzle.cells[0][2].data).isEqualTo({image: 'boat', returnValue: 'boat'});
  assert("Cell c1 value after drag").that(puzzle.cells[0][2].getValue()).isEqualTo('boat');

  suite.dragThrough(puzzle, ["c3", "c2"]);

  assert("Cell c2 after erasing").that(puzzle.cells[1][2].data).isEqualTo({});
  assert("Cell c2 value after erasing").that(puzzle.cells[1][2].getValue()).isNull();
  assert("Cell c1 after erasing").that(puzzle.cells[0][2].getValue()).isEqualTo('boat');
}),

test('Choose clue in author mode',(suite) => {
  let puzzle = suite.showPuzzle("lighthouses", "5x5");
  puzzle.edit();

  assert("Chooser before click").that(puzzle.controller.chooserBuilder.chooserElements).isEmptyArray();

  suite.cellClick(puzzle, "b2");

  assert("Chooser after click").that(puzzle.controller.chooserBuilder.chooserElements).isNonEmptyArray();
  assert("Chooser is connected to the cell").that(puzzle.controller.chooserBuilder.element == puzzle.cells[1][1]).isEqualTo(true);
  assert("Cell data after click").that(puzzle.cells[1][1].data).isEqualTo({});

  // The second item of the chooser is cross, the next ones are numbers starting from 0.
  puzzle.cells[1][1].switchOnChooser(1);

  assert("Cross value").that(puzzle.cells[1][1].getValue()).isEqualTo('cross');
  assert("Cross data").that(puzzle.cells[1][1].data).isEqualTo({image: 'cross', returnValue: 'cross'});

  puzzle.cells[1][1].switchOnChooser(11);

  assert("Value for number 9").that(puzzle.cells[1][1].getValue()).isEqualTo('9');
  assert("Data for number 9").that(puzzle.cells[1][1].data).isEqualTo({text: '9', returnValue: '9'});

  puzzle.cells[1][1].switchOnChooser(0);

  assert("Value after clean up").that(puzzle.cells[1][1].getValue()).isNull();
  assert("Data after clean up").that(puzzle.cells[1][1].data).isEqualTo({});
}),

test('Choose number 10 in author mode',(suite) => {
  let puzzle = suite.showPuzzle("lighthouses", "5x5");
  puzzle.edit();

  // Number 10 is replaced with "+10" item in the chooser.
  let items = puzzle.cells[0][0].chooserData();
  assert("Number of items in the chooser").that(items.length).isEqualTo(13);
  assert("The last item of the chooser").that(items[12]).isEqualTo({text: '+10'});
  assert("Item before the last one").that(items[11]).isEqualTo({text: '9', returnValue: '9'});

  // Choose 0 and then "+10".
  puzzle.cells[0][0].switchOnChooser(2);
  puzzle.cells[0][0].switchOnChooser(12);

  assert("Cell value").that(puzzle.cells[0][0].getValue()).isEqualTo('10');
  assert("Cell data").that(puzzle.cells[0][0].data).isEqualTo({text: '10', returnValue: '10'});
}),

// Data collector tests
test('Data collector',(suite) => {
  let puzzle = suite.showPuzzle("lighthouses", "5x5", suite.CLUES);
  puzzle.start();

  // Solution from the checker tests (B is a boat):
  //     a b c d e
  //  1  2 . B . x
  //  2  . . . . .
  //  3  B . . . B
  //  4  . . . . .
  //  5  . . 1 . 1
  suite.cellClick(puzzle, "c1");
  suite.cellClick(puzzle, "a3");
  suite.cellClick(puzzle, "e3");

  // Auxiliary marks are not submitted: crosses around the lighthouse a1, cross in c3 and circle at the lighthouse e5.
  suite.dragThrough(puzzle, ["a1", "a2", "b2", "b1"]);
  suite.cellClick(puzzle, "c3");
  suite.cellClick(puzzle, "c3");
  suite.cellClick(puzzle, "e5");

  assert("Submission data").that(puzzle.collectData()).isEqualTo({"c1": "boat", "a3": "boat", "e3": "boat"});
}),

test('Author data collector',(suite) => {
  let puzzle = suite.showPuzzle("lighthouses", "5x5");
  puzzle.edit();

  assert("Data of the empty puzzle").that(puzzle.collectData()).isEqualTo({});

  // Clues from the checker tests: item 1 of the chooser is cross, item N+2 is number N.
  puzzle.cells[0][0].switchOnChooser(4);
  puzzle.cells[0][4].switchOnChooser(1);
  puzzle.cells[4][2].switchOnChooser(3);
  puzzle.cells[4][4].switchOnChooser(3);

  assert("Puzzle data").that(puzzle.collectData()).isEqualTo(suite.CLUES);

  // Replace lighthouse a1 by 0, replace cross in e1 by lighthouse 3 and remove lighthouse e5.
  puzzle.cells[0][0].switchOnChooser(2);
  puzzle.cells[0][4].switchOnChooser(5);
  puzzle.cells[4][4].switchOnChooser(0);

  assert("Puzzle data after changes").that(puzzle.collectData()).isEqualTo({"a1": "0", "e1": "3", "c5": "1"});
}),

test('Author data collector for existing puzzle',(suite) => {
  let puzzle = suite.showPuzzle("lighthouses", "5x5", suite.CLUES);
  puzzle.edit();

  assert("Loaded lighthouse").that(puzzle.cells[0][0].getValue()).isEqualTo('2');
  assert("Loaded cross").that(puzzle.cells[0][4].getValue()).isEqualTo('cross');
  assert("Puzzle data").that(puzzle.collectData()).isEqualTo(suite.CLUES);
}),

);
