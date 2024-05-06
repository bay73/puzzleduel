chocoBananaTestSuite = testSuite("Choco Banana",

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
    var puzzle = new squarePuzzleType(puzzleData, controls, settings);
    puzzle.render(Snap(suite.GRID_SELECTOR));
    return puzzle;
  }
  module = {};
  requirejs(['puzzle_types/util.js', 'squarepuzzle'], function() {
    window.util=Util;
    requirejs.undef('puzzle_types/chaos.js');
    requirejs(['puzzle_types/choco_banana.js'], cb);
  });
}),

after((suite)=> {
  Snap(suite.GRID_SELECTOR).clear();
}),

test('Solver controllers',(suite) => {
  let puzzle = suite.showPuzzle(
    "choco_banana", "9x9-1",
    {"data": {"b1":"1","e1":"4","a2":"3","e3":"2","b4":"4","h4":"2","a5":"4","g5":"4","i5":"4","b6":"2","h6":"2","e7":"2","i8":"2","e9":"4","h9":"4"}}
  );
  puzzle.start();

  assert("Empty cell chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("Empty cell click").that(puzzle.cells[0][0].clickSwitch).containsExactly([{}, {color: puzzle.colorSchema.greyColor, returnValue: '1'}, {image: 'cross'}]);
  assert("Hint cell chooser").that(puzzle.cells[2][4].chooserValues).isNull();
  assert("Hint cell click").that(puzzle.cells[2][4].clickSwitch).containsExactly([{}, {color: puzzle.colorSchema.greyColor, returnValue: '1'}, {image: 'cross'}]);
}),
test('Author controllers',(suite) => {
  let puzzle = suite.showPuzzle("choco_banana", "9x9");
  puzzle.edit();

  assert("Cell chooser").that(puzzle.cells[0][0].chooserValues).containsAtLeast([{},{text: '1', textColor: puzzle.colorSchema.textColor, returnValue: '1'},{text: '2', textColor: puzzle.colorSchema.textColor, returnValue: '2'},{text: '8', textColor: puzzle.colorSchema.textColor, returnValue: '8'}]);
  assert("Cell click").that(puzzle.cells[0][0].clickSwitch).isNull();
}),
// Checker tests
test('Correct solution',(suite) => {
  let clues = {"a2": "5", "b1": "2", "d5": "3", "e4": "2"};
  let data = {"a3": "1", "b1": "1", "b3": "1", "b5": "1", "c1": "1", "c4": "1", "d2": "1", "d3": "1", "e4": "1", "e5": "1"}

  assert("Correct solution response").that(Checker.check("5x5", clues, data)).isEqualTo({status: "OK"});
}),
test('Wrong size of white area',(suite) => {
  let clues = {"a2": "5", "b1": "2", "d5": "3", "e4": "2"};
  let data = {"a3": "1", "b1": "1", "b3": "1", "c1": "1", "c4": "1", "d2": "1", "d3": "1", "e4": "1", "e5": "1"}

  assert("Wrong solution response").that(Checker.check("5x5", clues, data)).isEqualTo({status:"The clue is not correct", errors:["d5"]});
}),
test('Wrong shape of white area',(suite) => {
  let clues = {"a2": "5", "b1": "2", "d5": "3", "e4": "2"};
  let data = {"a3": "1", "a5": "1", "b1": "1", "b3": "1", "b5": "1", "c1": "1", "c4": "1", "d2": "1", "d3": "1", "e4": "1", "e5": "1"}

  assert("Wrong solution response").that(Checker.check("5x5", clues, data)).isEqualTo({status:"Unshaded area should have non-rectnagular shape", errors:["a4","b4"]});
}),
test('Wrong shape of black area',(suite) => {
  let clues = {"a2": "5", "b1": "2", "d5": "3", "e4": "2"};
  let data = {"a5": "1", "b1": "1", "b2": "1", "b4": "1", "b5": "1", "c3": "1", "c5": "1", "d2": "1", "d3": "1", "e4": "1", "e5": "1"}

  assert("Wrong solution response").that(Checker.check("5x5", clues, data)).isEqualTo({status:"Shaded area should have rectnagular or square shape", errors:["d2","c3","d3"]});
}),
);
