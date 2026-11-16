hexaMinesweeperTestSuite = testSuite("Hexa Minesweeper",

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
    var puzzle = new hexaPuzzleType(puzzleData, controls, settings);
    puzzle.render(Snap(suite.GRID_SELECTOR));
    return puzzle;
  }
  requirejs(["hexapuzzle"], cb);
}),

after((suite)=> {
  Snap(suite.GRID_SELECTOR).clear();
}),

test('Solver selectors',(suite) => {
  let puzzle = suite.showPuzzle(
    "hexa_minesweeper", "3x3",
    {"a3": "3", "d1": "2"}
  )
  puzzle.start();

  assert("Empty cell chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("Empty cell click").that(puzzle.cells[0][0].clickSwitch).containsExactly([{}, {image: 'mine', returnValue: '1'}, {image: 'cross'}]);
  assert("Number cell chooser").that(puzzle.cells[2][0].chooserValues).isNull();
  assert("Number cell click").that(puzzle.cells[2][0].clickSwitch).containsExactly([{text: '3'}, {text: '3', image: 'white_circle'}]);
}),

test('Author selectors',(suite) => {
  let puzzle = suite.showPuzzle("hexa_minesweeper", "3x3");
  puzzle.edit();

  assert("Cell chooser").that(puzzle.cells[0][0].chooserValues).containsAtLeast([{},{text: '0', returnValue: '0'},{text: '1', returnValue: '1'},{text: '6', returnValue: '6'}]);
  assert("Cell click").that(puzzle.cells[0][0].clickSwitch).isNull();
}),
);


