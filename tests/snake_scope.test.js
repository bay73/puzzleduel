snakeScopeTestSuite = testSuite("Snakescope",

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
    requirejs.undef('puzzle_types/snake_scope.js');
    requirejs(['puzzle_types/snake_scope.js'], cb);
  });
}),

after((suite)=> {
  Snap(suite.GRID_SELECTOR).clear();
}),

// Controller definition tests
test('Solver controllers',(suite) => {
  let puzzle = suite.showPuzzle(
    "snake_scope", "5x5", {"c3": "cross","nodes": {"a1-2": "3","d1-2": "1","b2-2": "0","c2-2": "2","b3-2": "1","c3-2": "1"}
}
  );
  puzzle.start();

  assert("Empty cell chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("Empty cell click").that(puzzle.cells[0][0].clickSwitch).containsExactly([{}, {color: puzzle.colorSchema.greyColor, returnValue: '1'}, {image: 'cross'}]);
  assert("Cross cell chooser").that(puzzle.cells[2][2].chooserValues).isNull();
  assert("Cross cell click").that(puzzle.cells[2][2].clickSwitch).isNull();;
  assert("Empty cell drag handler").that(puzzle.cells[2][2].drawDragHandler).isNotNull();
  assert("Empty cell drag processor").that(puzzle.cells[2][2].dragProcessor).isNotNull();
  assert("Cross drag handler").that(puzzle.cells[0][0].drawDragHandler).isNotNull();
  assert("Cross drag processor").that(puzzle.cells[0][0].dragProcessor).isNotNull();
}),

test('Author controllers',(suite) => {
  let puzzle = suite.showPuzzle("snake_scope", "5x5");
  puzzle.edit();

  assert("Cell chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("Cell click").that(puzzle.cells[0][0].clickSwitch).containsExactly([{}, {image: 'cross', returnValue: 'cross'}]);
  assert("Node chooser").that(puzzle.nodes[0][0][2].chooserValues).containsExactly([{},{text: '0', color: puzzle.colorSchema.gridColor, textColor: puzzle.colorSchema.bgColor, returnValue: '0'},{text: '1', color: puzzle.colorSchema.gridColor, textColor: puzzle.colorSchema.bgColor, returnValue: '1'},{text: '2', color: puzzle.colorSchema.gridColor, textColor: puzzle.colorSchema.bgColor, returnValue: '2'},{text: '3', color: puzzle.colorSchema.gridColor, textColor: puzzle.colorSchema.bgColor, returnValue: '3'}]);
  assert("Node clue click").that(puzzle.nodes[0][0][2].clickSwitch).isNull();
}),
// Checker tests
test('Correct solution',(suite) => {
  let clues =  {"c3": "cross","nodes": {"a1-2": "3","d1-2": "1","b2-2": "0","c2-2": "2","b3-2": "1","c3-2": "1"}};
  let data = {"a1": "1", "b1": "1", "a2": "1", "d2": "1", "a3": "1", "d3": "1", "e3": "1", "a4": "1", "b4": "1", "e4": "1", "b5": "1", "c5": "1", "d5": "1", "e5": "1"}

  assert("Correct solution response").that(Checker.check("5x5", clues, data)).isEqualTo({status: "OK"});
}),

test('Missing cell',(suite) => {
  let clues =  {"c3": "cross","nodes": {"a1-2": "3","d1-2": "1","b2-2": "0","c2-2": "2","b3-2": "1","c3-2": "1"}};
  let data = {"a1": "1", "b1": "1", "a2": "1", "d2": "1", "a3": "1", "d3": "1", "e3": "1", "a4": "1", "b4": "1", "b5": "1", "c5": "1", "d5": "1", "e5": "1"}

  assert("Missing cell solution response").that(Checker.check("5x5", clues, data)).isEqualTo({status: "All black cells should be part of single snake",errors:["d2"]});
}),

test('Self touch',(suite) => {
  let clues =  {"c3": "cross","nodes": {"a1-2": "3","d1-2": "1","b2-2": "0","c2-2": "2","b3-2": "1","c3-2": "1"}};
  let data = {"a1": "1", "b1": "1", "c1": "1", "a2": "1", "d2": "1", "a3": "1", "d3": "1", "e3": "1", "a4": "1", "b4": "1", "e4": "1", "b5": "1", "c5": "1", "d5": "1", "e5": "1"}

  assert("Self touch solution response").that(Checker.check("5x5", clues, data)).isEqualTo({status: "Snake shouldn't touch itself",errors:["d2","c1"]});
}),

test('Wrong clue',(suite) => {
  let clues =  {"c3": "cross","nodes": {"a1-2": "3","d1-2": "1","b2-2": "0","c2-2": "2","b3-2": "1","c3-2": "1"}};
  let data = {"a1": "1", "b1": "1", "a2": "1", "d2": "1", "a3": "1", "d3": "1", "e3": "1", "a4": "1", "a5": "1", "e4": "1", "b5": "1", "c5": "1", "d5": "1", "e5": "1"}

  assert("Solution response").that(Checker.check("5x5", clues, data)).isEqualTo({status: "The clue is not correct", errors:["b3","c3","b4","c4"]});
}),

);


