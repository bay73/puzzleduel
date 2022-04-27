snakeSimpleTestSuite = testSuite("Snake",

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
    requirejs.undef('puzzle_types/snake_simple.js');
    requirejs(['puzzle_types/snake_simple.js'], cb);
  });
}),

after((suite)=> {
  Snap(suite.GRID_SELECTOR).clear();
}),

// Controller definition tests
test('Solver controllers',(suite) => {
  let puzzle = suite.showPuzzle(
    "snake_simple", "5x5",
    {"a1": "cross", "b2": "black", "bottom": ["2","4","2","4","2"], "right": ["3","3",null,"4","4"]}
  );
  puzzle.start();

  assert("Empty cell chooser").that(puzzle.cells[2][2].chooserValues).isNull();
  assert("Empty cell click").that(puzzle.cells[2][2].clickSwitch).containsExactly([{}, {color: puzzle.colorSchema.greyColor, returnValue: 'black'}, {image: 'cross'}]);
  assert("Black cell chooser").that(puzzle.cells[1][1].chooserValues).isNull();
  assert("Black cell click").that(puzzle.cells[1][1].clickSwitch).isNull();
  assert("Cross cell chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("Cross cell click").that(puzzle.cells[0][0].clickSwitch).isNull();;
  assert("Bottom clue chooser").that(puzzle.bottom[0].chooserValues).isNull();
  assert("Bottom clue click").that(puzzle.bottom[0].clickSwitch).containsExactly([{text: '2'}, {text: '2', image: 'white_circle'}]);
  assert("Right clue chooser").that(puzzle.right[0].chooserValues).isNull();
  assert("Right clue click").that(puzzle.right[0].clickSwitch).containsExactly([{text: '3'}, {text: '3', image: 'white_circle'}]);
  assert("Empty cell drag handler").that(puzzle.cells[2][2].drawDragHandler).isNotNull();
  assert("Empty cell drag processor").that(puzzle.cells[2][2].dragProcessor).isNotNull();
  assert("Black cell drag handler").that(puzzle.cells[1][1].drawDragHandler).isNotNull();
  assert("Black cell drag processor").that(puzzle.cells[1][1].dragProcessor).isNotNull();
  assert("Cross drag handler").that(puzzle.cells[0][0].drawDragHandler).isNotNull();
  assert("Cross drag processor").that(puzzle.cells[0][0].dragProcessor).isNotNull();
}),

test('Author controllers',(suite) => {
  let puzzle = suite.showPuzzle("snake_simple", "5x5");
  puzzle.edit();

  assert("Cell chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("Cell click").that(puzzle.cells[0][0].clickSwitch).containsExactly([{}, {color: puzzle.colorSchema.clueColor, returnValue: 'black'}, {image: 'cross', returnValue: 'cross'}]);
  assert("Bottom clue chooser").that(puzzle.bottom[0].chooserValues).containsExactly([{},{text: '0', returnValue: '0'},{text: '1', returnValue: '1'},{text: '2', returnValue: '2'},{text: '3', returnValue: '3'},{text: '4', returnValue: '4'},{text: '5', returnValue: '5'}]);
  assert("Bottom clue click").that(puzzle.bottom[0].clickSwitch).isNull();
  assert("Right clue chooser").that(puzzle.right[0].chooserValues).containsExactly([{},{text: '0', returnValue: '0'},{text: '1', returnValue: '1'},{text: '2', returnValue: '2'},{text: '3', returnValue: '3'},{text: '4', returnValue: '4'},{text: '5', returnValue: '5'}]);
  assert("Right clue click").that(puzzle.right[0].clickSwitch).isNull();
}),
// Checker tests
test('Correct solution',(suite) => {
  let clues = {"a1": "black", "a4": "black", "bottom": ["3",null,"3","3","4"], "right": ["4","4",null,"4","3"]};
  let data = {"a2":"black","b2":"black","c2":"black","c1":"black","d1":"black","e1":"black","e2":"black","e3":"black","e4":"black","d4":"black","d5":"black","c5":"black","b5":"black","b4":"black"}

  assert("Correct solution response").that(Checker.check("5x5", clues, data)).isEqualTo({status: "OK"});
}),

test('Missing cell',(suite) => {
  let clues = {"a1": "black", "a4": "black", "bottom": ["3",null,"3","3","4"], "right": ["4","4",null,"4","3"]};
  let data = {"a2":"black","b2":"black","c2":"black","c1":"black","e1":"black","e2":"black","e3":"black","e4":"black","d4":"black","d5":"black","c5":"black","b5":"black","a5":"black"}

  assert("Missing cell solution response").that(Checker.check("5x5", clues, data)).isEqualTo({status: "Black cells should form single snake without bifurcations",errors:["c1"]});
}),

test('Self touch',(suite) => {
  let clues = {"a1": "black", "a4": "black", "bottom": ["3",null,"3","3","4"], "right": ["4","4",null,"4","3"]};
  let data = {"a2":"black","b2":"black","c2":"black","c1":"black","d1":"black","e1":"black","e2":"black","e3":"black","d3":"black","d4":"black","d5":"black","c5":"black","b5":"black","a5":"black"}

  assert("Self touch solution response").that(Checker.check("5x5", clues, data)).isEqualTo({status: "Snake shouldn't touch itself",errors:["d3","c2"]});
}),

test('Wrong bootom clue',(suite) => {
  let clues = {"a1": "black", "a4": "black", "bottom": ["3",null,"3","3","4"], "right": ["4","4",null,"4","3"]};
  let data = {"a2":"black","b2":"black","c2":"black","c1":"black","d1":"black","e1":"black","e2":"black","e3":"black","e4":"black","d4":"black","d5":"black","c5":"black","b5":"black","a5":"black"}

  assert("Solution response").that(Checker.check("5x5", clues, data)).isEqualTo({status: "Wrong number of blackened cells in the column",errors:["a1","a2","a3","a4","a5"]});
}),

test('Wrong right clue',(suite) => {
  let clues = {"a1": "black", "a4": "black", "bottom": [null,null,"3","3","4"], "right": ["4","4",null,"4","3"]};
  let data = {"a2":"black","b2":"black","c2":"black","c1":"black","d1":"black","e1":"black","e2":"black","e3":"black","e4":"black","d4":"black","d5":"black","c5":"black","b5":"black","a5":"black"}

  assert("Solution response").that(Checker.check("5x5", clues, data)).isEqualTo({status: "Wrong number of blackened cells in the row",errors:["a4","b4","c4","d4","e4"]});
}),
);


