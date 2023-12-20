passageTestSuite = testSuite("Passage",

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
    "passage", "5x5",
    {"a1": "black", "a3": "4", "c5": "cross", "d1": "3", "e5": "black"}
  );
  puzzle.start();

  assert("Empty cell chooser").that(puzzle.cells[1][1].chooserValues).isNull();
  assert("Empty cell click").that(puzzle.cells[1][1].clickSwitch).containsExactly([{}, {color: puzzle.colorSchema.greyColor, returnValue: '1'}, {image: 'cross'}]);
  assert("Numbered cell chooser").that(puzzle.cells[0][3].chooserValues).isNull();
  assert("Numbered cell click").that(puzzle.cells[0][3].clickSwitch).isNull();
  assert("Black cell chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("Black cell click").that(puzzle.cells[0][0].clickSwitch).isNull();
  assert("Cross chooser").that(puzzle.cells[4][2].chooserValues).isNull();
  assert("Cross click").that(puzzle.cells[4][2].clickSwitch).isNull();
}),

test('Author controllers',(suite) => {
  let puzzle = suite.showPuzzle("passage", "5x5");
  puzzle.edit();

  assert("Cell chooser").that(puzzle.cells[0][0].chooserValues).containsExactly([{}, {color: puzzle.colorSchema.gridColor, returnValue: 'black'}, {image: 'cross', returnValue: 'cross'}, {text: '3', color: puzzle.colorSchema.greyColor, textColor: puzzle.colorSchema.textColor, returnValue: '3'}, {text: '4', color: puzzle.colorSchema.greyColor, textColor: puzzle.colorSchema.textColor, returnValue: '4'}, {text: '5', color: puzzle.colorSchema.greyColor, textColor: puzzle.colorSchema.textColor, returnValue: '5'}]);
  assert("Cell click").that(puzzle.cells[0][0].clickSwitch).isNull();
}),
);


