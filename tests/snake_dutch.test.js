snakeDutchTestSuite = testSuite("Dutch Snake",

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
    "snake_dutch", "5x5",
    {"a4": "black_circle", "b2": "black_circle", "c3": "cross", "c4": "white_circle", "d1": "white_circle", "d5": "black_circle"}
  );
  puzzle.start();

  assert("Empty cell chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("Empty cell click").that(puzzle.cells[0][0].clickSwitch).containsExactly([{}, {color: puzzle.colorSchema.greyColor, returnValue: '1'}, {image: 'cross'}]);
  assert("White circle chooser").that(puzzle.cells[0][3].chooserValues).isNull();
  assert("White circle click").that(puzzle.cells[0][3].clickSwitch).containsExactly([{image: 'white_circle'}, {image: 'white_circle', color: puzzle.colorSchema.greyColor, returnValue: '1'}]);
  assert("Black circle chooser").that(puzzle.cells[1][1].chooserValues).isNull();
  assert("Black circle click").that(puzzle.cells[1][1].clickSwitch).containsExactly([{image: 'black_circle'}, {image: 'black_circle', color: puzzle.colorSchema.greyColor, returnValue: '1'}]);
  assert("Cross chooser").that(puzzle.cells[2][2].chooserValues).isNull();
  assert("Cross click").that(puzzle.cells[2][2].clickSwitch).isNull();
}),

test('Author controllers',(suite) => {
  let puzzle = suite.showPuzzle("snake_dutch", "5x5");
  puzzle.edit();

  assert("Cell chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("Cell click").that(puzzle.cells[0][0].clickSwitch).containsExactly([{}, {image: 'white_circle', returnValue: 'white_circle'}, {image: 'black_circle', returnValue: 'black_circle'}, {image: 'cross', returnValue: 'cross'}]);
}),
);


