pointCrowdTestSuite = uiTestSuite("Point to Crowd", "hexapuzzle", "hexaPuzzleType",

// Cells of the hexagonal grid 3x3 (puzzle.cells[row][column]):
//       c1
//    b1    d2
// a1    c2    e3
//    b2    d3
// a2    c3    e4
//    b3    d4
// a3    c4    e5
//    b4    d5
//       c5

// Controller definition tests
test('Solver controllers',(suite) => {
  let puzzle = suite.showPuzzle("point_crowd", "3x3", {"a1": "arrow_dr", "c3": "arrow_u"});
  puzzle.start();

  assert("Empty cell chooser").that(puzzle.cells[0][1].chooserValues).isNull();
  assert("Empty cell click").that(puzzle.cells[0][1].clickSwitch).containsExactly([{}, {image: 'black_circle', returnValue: '1'}, {image: 'cross'}]);
  assert("Arrow cell chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("Arrow cell click").that(puzzle.cells[0][0].clickSwitch).containsExactly([{image: 'arrow_dr'}, {image: 'arrow_dr', color: puzzle.colorSchema.lightGreyColor}]);
}),

test('Author controllers',(suite) => {
  let puzzle = suite.showPuzzle("point_crowd", "3x3");
  puzzle.edit();

  let arrowItem = function(name) {
    return {image: name, returnValue: name};
  }
  assert("Cell chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("Cell click").that(puzzle.cells[0][0].clickSwitch).containsExactly(
    [{}, arrowItem('arrow_u'), arrowItem('arrow_ur'), arrowItem('arrow_dr'), arrowItem('arrow_d'), arrowItem('arrow_dl'), arrowItem('arrow_ul')]);
}),

// Mouse processing tests
test('Process clicks to empty cell',(suite) => {
  let puzzle = suite.showPuzzle("point_crowd", "3x3", {"a1": "arrow_dr", "c3": "arrow_u"});
  puzzle.start();

  let cell = puzzle.cells[0][1];
  suite.click(puzzle, cell.center());
  assert("Cell value after one click").that(cell.getValue()).isEqualTo("1");
  assert("Cell data after one click").that(cell.data).isEqualTo({image: 'black_circle', returnValue: '1'});

  suite.click(puzzle, cell.center());
  assert("Cell value after two clicks").that(cell.getValue()).isNull();
  assert("Cell data after two clicks").that(cell.data).isEqualTo({image: 'cross'});

  suite.click(puzzle, cell.center());
  assert("Cell data after three clicks").that(cell.data).isEqualTo({});
}),

test('Process clicks to arrow cell',(suite) => {
  let puzzle = suite.showPuzzle("point_crowd", "3x3", {"a1": "arrow_dr", "c3": "arrow_u"});
  puzzle.start();

  // The arrow can be marked by the color, it is not submitted.
  let cell = puzzle.cells[0][0];
  suite.click(puzzle, cell.center());
  assert("Arrow cell value after one click").that(cell.getValue()).isNull();
  assert("Arrow cell data after one click").that(cell.data).isEqualTo({image: 'arrow_dr', color: puzzle.colorSchema.lightGreyColor});

  suite.click(puzzle, cell.center());
  assert("Arrow cell data after two clicks").that(cell.data).isEqualTo({image: 'arrow_dr'});
  assert("Submission data").that(puzzle.collectData()).isEqualTo({});
}),

test('Copy circle by drag',(suite) => {
  let puzzle = suite.showPuzzle("point_crowd", "3x3", {"a1": "arrow_dr", "c3": "arrow_u"});
  puzzle.start();

  // Circle in b1 is copied to b2.
  suite.click(puzzle, puzzle.cells[0][1].center());
  suite.drag(puzzle, puzzle.cells[0][1].center(), puzzle.cells[1][1].center());

  assert("Cell value after drag").that(puzzle.cells[1][1].getValue()).isEqualTo("1");
  assert("Cell data after drag").that(puzzle.cells[1][1].data).isEqualTo({image: 'black_circle', returnValue: '1'});

  // The arrow cell a1 can't be changed by drag.
  suite.drag(puzzle, puzzle.cells[0][1].center(), puzzle.cells[0][0].center());

  assert("Arrow cell data after drag").that(puzzle.cells[0][0].data).isEqualTo({image: 'arrow_dr'});
}),

// Data collector tests
test('Data collector',(suite) => {
  let puzzle = suite.showPuzzle("point_crowd", "3x3", {"a1": "arrow_dr", "c3": "arrow_u"});
  puzzle.start();

  // Circles in b1 and e5, cross in b2, the arrow in a1 is marked.
  suite.click(puzzle, puzzle.cells[0][1].center());
  suite.click(puzzle, puzzle.cells[4][4].center());
  suite.click(puzzle, puzzle.cells[1][1].center());
  suite.click(puzzle, puzzle.cells[1][1].center());
  suite.click(puzzle, puzzle.cells[0][0].center());

  assert("Submission data").that(puzzle.collectData()).isEqualTo({"b1": "1", "e5": "1"});
}),

test('Author data collector',(suite) => {
  let puzzle = suite.showPuzzle("point_crowd", "3x3");
  puzzle.edit();

  // Two clicks at a1 (the arrow up and right), one click at c3 (the arrow up).
  suite.click(puzzle, puzzle.cells[0][0].center());
  suite.click(puzzle, puzzle.cells[0][0].center());
  suite.click(puzzle, puzzle.cells[2][2].center());

  assert("Puzzle data").that(puzzle.collectData()).isEqualTo({"a1": "arrow_ur", "c3": "arrow_u"});
}),

);
