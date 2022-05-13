magicSnailTestSuite = testSuite("Magic Snail",

beforeSuite((suite, cb)=> {
  suite.GRID_SELECTOR = "#mainGrid";
  if (!$(suite.GRID_SELECTOR).length) {
    throw "Missing " + suite.GRID_SELECTOR + " element"
  };
  suite.showPuzzle = function(type, dimension, data) {
    var controls = "";
    var puzzleData = {
      typeCode: type,
      id: "",
      dimension: dimension
    };
    var settings = {
      local: true,
      data: data || {}
    };
    var puzzle = new snailPuzzleType(puzzleData, controls, settings);
    puzzle.render(Snap(suite.GRID_SELECTOR));
    return puzzle;
  };
  suite.mouseEvent = function(x, y) {
    return {clientX: x, clientY: y, preventDefault: ()=>{}};
  };
  module = {};
  requirejs(['puzzle_types/util.js', 'squarepuzzle'], function() {
    window.util=Util;
    requirejs(['puzzle_types/sudoku_util.js'], function() {
      window.sudoku_util=SudokuUtil;
      requirejs.undef('puzzle_types/magic_snail.js');
      requirejs(['puzzle_types/magic_snail.js'], cb);
    });
  });
}),

after((suite)=> {
  Snap(suite.GRID_SELECTOR).clear();
}),

// Controller definition tests
test('Solver controllers',(suite) => {
  let puzzle = suite.showPuzzle(
    "magic_snail", "5x5-123",
    {"d3": "1", "b3":"3", "bottom": [null,null,null,null,null], "right": [null,null,null,null,null], "top": ["2",null,null,null,null], "left": [null,null,null,null,null]}
  );
  puzzle.start();

  assert("Empty cell chooser").that(puzzle.cells[2][2].chooserValues).containsExactly([{},{text: '1', returnValue: '1'},{text: '2', returnValue: '2'},{text: '3', returnValue: '3'},{image: 'cross'},{image: 'white_circle'}]);
  assert("Empty cell click").that(puzzle.cells[2][2].clickSwitch).isNull();
  assert("Clue cell chooser").that(puzzle.cells[2][1].chooserValues).isNull();
  assert("Clue cell click").that(puzzle.cells[2][1].clickSwitch).isNull();
  assert("Right clue chooser").that(puzzle.right[0].chooserValues).isNull();
  assert("Right clue click").that(puzzle.right[0].clickSwitch).containsExactly([{}, {image: 'white_circle'}]);
  assert("Top clue chooser").that(puzzle.top[0].chooserValues).isNull();
  assert("Top clue click").that(puzzle.top[0].clickSwitch).containsExactly([{text: '2'}, {text: '2', image: 'white_circle'}]);
  assert("Cell drag handler").that(puzzle.cells[2][2].drawDragHandler).isNull();
  assert("Cell drag processor").that(puzzle.cells[2][2].dragProcessor).isNull();
}),

test('Other digits',(suite) => {
  let puzzle = suite.showPuzzle(
    "magic_snail", "4x4-12",
    {"bottom": [null,null,null,"2"], "right": [null,null,null,null], "top": ["2",null,null,null], "left": [null,null,null,null]}
  );
  puzzle.start();

  assert("Empty cell chooser").that(puzzle.cells[2][2].chooserValues).containsExactly([{},{text: '1', returnValue: '1'},{text: '2', returnValue: '2'},{image: 'cross'},{image: 'white_circle'}]);
  assert("Empty cell click").that(puzzle.cells[2][2].clickSwitch).isNull();
}),

test('Author controllers',(suite) => {
  let puzzle = suite.showPuzzle("magic_snail", "5x5-123");
  puzzle.edit();

  assert("Cell chooser").that(puzzle.cells[0][0].chooserValues).containsExactly([{},{text: '1', returnValue: '1'},{text: '2', returnValue: '2'},{text: '3', returnValue: '3'},{image: 'cross', returnValue: 'cross'}]);
  assert("Cell click").that(puzzle.cells[0][0].clickSwitch).isNull();
  assert("Bottom clue chooser").that(puzzle.bottom[0].chooserValues).containsExactly([{},{text: '1', returnValue: '1'},{text: '2', returnValue: '2'},{text: '3', returnValue: '3'}]);
  assert("Bottom clue click").that(puzzle.bottom[0].clickSwitch).isNull();
  assert("Right clue chooser").that(puzzle.right[0].chooserValues).containsExactly([{},{text: '1', returnValue: '1'},{text: '2', returnValue: '2'},{text: '3', returnValue: '3'}]);
  assert("Right clue click").that(puzzle.right[0].clickSwitch).isNull();
  assert("Top clue chooser").that(puzzle.top[0].chooserValues).containsExactly([{},{text: '1', returnValue: '1'},{text: '2', returnValue: '2'},{text: '3', returnValue: '3'}]);
  assert("Top clue click").that(puzzle.top[0].clickSwitch).isNull();
  assert("Left clue chooser").that(puzzle.left[0].chooserValues).containsExactly([{},{text: '1', returnValue: '1'},{text: '2', returnValue: '2'},{text: '3', returnValue: '3'}]);
  assert("Left clue click").that(puzzle.left[0].clickSwitch).isNull();
}),

// Checker tests
test('Correct solution',(suite) => {
  let clues = {"d3": "1", "b3":"3", "bottom": [null,null,null,null,null], "right": [null,null,null,null,null], "top": ["2",null,null,null,null], "left": [null,null,null,null,null]};
  let data = {"a2": "2", "a4": "1", "a5": "3", "b1": "1", "b5": "2", "c1": "2", "c2":"3", "c5": "1", "d1": "3", "d4": "2", "e2": "1","e3": "2", "e4": "3"}

  assert("Correct solution response").that(Checker.check("5x5-123", clues, data)).isEqualTo({status: "OK"});
}),

test('Wrong spiral',(suite) => {
  let clues = {"d3": "1", "b3":"3", "bottom": [null,null,null,null,null], "right": [null,null,null,null,null], "top": ["2",null,null,null,null], "left": [null,null,null,null,null]};
  let data = {"a1": "1", "a2": "2", "a4": "1", "a5": "3", "b1": "1", "b5": "2", "c1": "2", "c2":"3", "c5": "1", "d1": "3", "d4": "2", "e2": "1","e3": "2", "e4": "3"}

  assert("Wrong spiral solution response").that(Checker.check("5x5-123", clues, data)).isEqualTo({status:"Wrong digit reading along spiral",errors:["b1"]});
}),
);


