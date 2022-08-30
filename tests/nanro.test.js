nanroTestSuite = testSuite("Nanro",

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
  };
  suite.mouseEvent = function(x, y) {
    return {clientX: x, clientY: y, preventDefault: ()=>{}};
  };
  module = {};
  requirejs(['puzzle_types/util.js', 'squarepuzzle'], function() {
    window.util=Util;
    requirejs.undef('puzzle_types/nanro.js');
    requirejs(['puzzle_types/nanro.js'], cb);
  });
}),

after((suite)=> {
  Snap(suite.GRID_SELECTOR).clear();
}),

// Controller definition tests
test('Solver controllers',(suite) => {
  let puzzle = suite.showPuzzle("nanro", "4x4",
  {"a1": "2", "a3":"3", "d2":"1", "areas": [["a1","a2","b1","b2"],["d1","d2"],["a4","b4"],["d4"],["c1","c2","a3","b3","c3","d3","c4"]]});
  puzzle.start();

  assert("Empty cell chooser").that(puzzle.cells[2][2].chooserValues).containsExactly([{},{text: '1', returnValue: '1'},{text: '2', returnValue: '2'},{text: '3', returnValue: '3'},{text: '4', returnValue: '4'},{text: '5', returnValue: '5'},{text: '6', returnValue: '6'},{image: "cross"}]);
  assert("Empty cell click").that(puzzle.cells[2][2].clickSwitch).isNull();
  assert("Clue cell chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("Clue cell click").that(puzzle.cells[0][0].clickSwitch).isNull();
  assert("Cell drag handler").that(puzzle.cells[2][2].drawDragHandler).isNull();
  assert("Cell drag processor").that(puzzle.cells[2][2].dragProcessor).isNull();
}),

test('Author controllers',(suite) => {
  let puzzle = suite.showPuzzle("nanro", "4x4");
  puzzle.edit();

  assert("Cell chooser").that(puzzle.cells[0][0].chooserValues).containsExactly([{},{text: '1', returnValue: '1'},{text: '2', returnValue: '2'},{text: '3', returnValue: '3'},{text: '4', returnValue: '4'},{text: '5', returnValue: '5'},{text: '6', returnValue: '6'}]);
  assert("Cell click").that(puzzle.cells[0][0].clickSwitch).isNull();
  assert("Edge chooser").that(puzzle.edges[0][0][1].chooserValues).isNull();
  assert("Edge click").that(puzzle.edges[0][0][1].clickSwitch).containsExactly([{}, {color: puzzle.colorSchema.gridColor, returnValue: 'bold'}]);
  assert("Edge drag").that(puzzle.edges[0][0][1].dragSwitch).containsExactly([{}, {color: puzzle.colorSchema.gridColor, returnValue: 'bold'}]);
}),

// Checker tests
test('Correct solution',(suite) => {
  let clues = {"a1": "2", "a3":"3", "d2":"1", "areas": [["a1","a2","b1","b2"],["d1","d2"],["a4","b4"],["d4"],["c1","c2","a3","b3","c3","d3","c4"]]};
  let data = {"a2": "2", "a4": "2", "b4": "2", "c4": "3", "d3": "3", "d4": "1"}

  assert("Correct solution response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "OK"});
}),

test('Wrong numbers in area',(suite) => {
  let clues = {"a1": "2", "a3":"3", "d2":"1", "areas": [["a1","a2","b1","b2"],["d1","d2"],["a4","b4"],["d4"],["c1","c2","a3","b3","c3","d3","c4"]]};
  let data = {"a2": "2", "a4": "1", "b4": "1", "c4": "3", "d3": "3", "d4": "1"}

  assert("Wrong numbers in area response").that(Checker.check("4x4", clues, data)).isEqualTo({status:"All numbers in the area should be equal to the number of cells in the area containing a number",errors:["a4","b4"]});
}),

test('Touching numbers',(suite) => {
  let clues = {"a3":"3", "d2":"1", "areas": [["a1","a2","b1","b2"],["d1","d2"],["a4","b4"],["d4"],["c1","c2","a3","b3","c3","d3","c4"]]};
  let data = {"a1": "3", "a2": "3", "b1": "3", "a4": "2", "b4": "2", "c4": "3", "d3": "3", "d4": "1"}

  assert("Touching numbers response").that(Checker.check("4x4", clues, data)).isEqualTo({status:"Two cells sharing a bold edge shouldn't contain the same numbers",errors:["a2","a3"]});
}),
test('2x2 square',(suite) => {
  let clues = {"a3":"3", "d2":"1", "areas": [["a1","a2","b1","b2"],["d1","d2"],["a4","b4"],["d4"],["c1","c2","a3","b3","c3","d3","c4"]]};
  let data = {"a1": "4", "a2": "4", "b1": "4", "b2": "4", "a4": "2", "b4": "2", "c4": "3", "d3": "3", "d4": "1"}

  assert("2x2 square").that(Checker.check("4x4", clues, data)).isEqualTo({status:"No 2x2 squares fully occupied with digits are allowed",errors:["a1","b1","a2","b2"]});
}),
test('Not connected',(suite) => {
  let clues = {"a1": "2", "a3":"3", "d2":"1", "areas": [["a1","a2","b1","b2"],["d1","d2"],["a4","b4"],["d4"],["c1","c2","a3","b3","c3","d3","c4"]]};
  let data = {"a2": "2", "a4": "1", "c4": "3", "d3": "3", "d4": "1"}

  assert("Not connected").that(Checker.check("4x4", clues, data)).isEqualTo({status:"Area occupied by the digits should be connected"});
}),

);


