pointAStarTestSuite = testSuite("Point a Star",

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
    "point_a_star", "4x4",
    {"b3": "arrow_ur", "c4": "arrow_u", "bottom": ["2",null,null,"1"], "right": ["1",null,"1",null]}
  );
  puzzle.start();

  assert("Empty cell chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("Empty cell click").that(puzzle.cells[0][0].clickSwitch).containsExactly([{}, {image: 'star', returnValue: 'star'}, {image: 'cross'}]);
  assert("Arrow cell chooser").that(puzzle.cells[2][1].chooserValues).isNull();
  assert("Arrow cell click").that(puzzle.cells[2][1].clickSwitch).containsExactly([{image: 'arrow_ur'}, {image: 'arrow_ur', color: puzzle.colorSchema.greyColor}]);
  assert("Bottom clue chooser").that(puzzle.bottom[0].chooserValues).isNull();
  assert("Bottom clue click").that(puzzle.bottom[0].clickSwitch).containsExactly([{text: '2'}, {text: '2', image: 'white_circle'}]);
  assert("Right clue chooser").that(puzzle.right[0].chooserValues).isNull();
  assert("Right clue click").that(puzzle.right[0].clickSwitch).containsExactly([{text: '1'}, {text: '1', image: 'white_circle'}]);
}),

test('Author controllers',(suite) => {
  let puzzle = suite.showPuzzle("point_a_star", "4x4");
  puzzle.edit();

  assert("Cell chooser").that(puzzle.cells[0][0].chooserValues).containsAtLeast([{},{image: 'arrow_u', returnValue: 'arrow_u'},{image: 'arrow_ur', returnValue: 'arrow_ur'},{image: 'arrow_ul', returnValue: 'arrow_ul'}]);
  assert("Cell click").that(puzzle.cells[0][0].clickSwitch).isNull();
  assert("Bottom clue chooser").that(puzzle.bottom[0].chooserValues).containsExactly([{},{text: '0', returnValue: '0'},{text: '1', returnValue: '1'},{text: '2', returnValue: '2'}]);
  assert("Bottom clue click").that(puzzle.bottom[0].clickSwitch).isNull();
  assert("Right clue chooser").that(puzzle.right[0].chooserValues).containsExactly([{},{text: '0', returnValue: '0'},{text: '1', returnValue: '1'},{text: '2', returnValue: '2'}]);
  assert("Right clue click").that(puzzle.right[0].clickSwitch).isNull();
}),
);


