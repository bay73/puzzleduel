gapsTestSuite = testSuite("Gaps",

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
  requirejs(["squarepuzzle"], cb);
}),

after((suite)=> {
  Snap(suite.GRID_SELECTOR).clear();
}),

test('Solver controllers',(suite) => {
  let puzzle = suite.showPuzzle(
    "gaps", "5x5",
    {"a1": "cross", "b2": "white_circle", "bottom": ["2",null,"2",null,"2"], "right": ["3","3",null,null,null]}
  );
  puzzle.start();

  assert("Empty cell chooser").that(puzzle.cells[2][2].chooserValues).isNull();
  assert("Empty cell click").that(puzzle.cells[2][2].clickSwitch).containsExactly([{}, {image: 'white_circle', returnValue: 'white_circle'}, {image: 'cross'}]);
  assert("White circle chooser").that(puzzle.cells[1][1].chooserValues).isNull();
  assert("White circle click").that(puzzle.cells[1][1].clickSwitch).isNull();
  assert("Cross cell chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("Cross cell click").that(puzzle.cells[0][0].clickSwitch).isNull();;
  assert("Bottom clue chooser").that(puzzle.bottom[0].chooserValues).isNull();
  assert("Bottom clue click").that(puzzle.bottom[0].clickSwitch).containsExactly([{text: '2'}, {text: '2', image: 'white_circle'}]);
  assert("Right clue chooser").that(puzzle.right[0].chooserValues).isNull();
  assert("Right clue click").that(puzzle.right[0].clickSwitch).containsExactly([{text: '3'}, {text: '3', image: 'white_circle'}]);
}),

test('Author controllers',(suite) => {
  let puzzle = suite.showPuzzle("gaps", "5x5");
  puzzle.edit();

  assert("Cell chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("Cell click").that(puzzle.cells[0][0].clickSwitch).containsExactly([{}, {image: 'cross', returnValue: 'cross'}, {image: 'white_circle', returnValue: 'white_circle'}]);
  assert("Bottom clue chooser").that(puzzle.bottom[0].chooserValues).containsAtLeast([{},{text: '1', returnValue: '1'},{text: '2', returnValue: '2'},{text: '3', returnValue: '3'}]);
  assert("Bottom clue click").that(puzzle.bottom[0].clickSwitch).isNull();
  assert("Right clue chooser").that(puzzle.right[0].chooserValues).containsAtLeast([{},{text: '1', returnValue: '1'},{text: '2', returnValue: '2'},{text: '3', returnValue: '3'}]);
  assert("Right clue click").that(puzzle.right[0].clickSwitch).isNull();
}),
);


