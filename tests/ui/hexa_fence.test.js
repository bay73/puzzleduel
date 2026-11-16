hexaFenceTestSuite = testSuite("Hexa Fence",

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
  };
  requirejs(["hexapuzzle"], cb);
}),

after((suite)=> {
  Snap(suite.GRID_SELECTOR).clear();
}),
// Controller definition tests
test('Solver controllers',(suite) => {
  let puzzle = suite.showPuzzle(
    "hexa_fence", "5x5",{"b1": "1", "a2": "1"}
  );
  puzzle.start();

  assert("Cell chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("Cell click").that(puzzle.cells[0][0].clickSwitch).containsExactly([{},{image:"cross"},{image:"white_circle"}]);
  assert("Edge chooser").that(puzzle.edges[0][0][3].chooserValues).isNull();
  assert("Edge edge click").that(puzzle.edges[0][0][3].clickSwitch).containsExactly([{},{color: puzzle.colorSchema.lineColor, returnValue: "1"},{image: "cross"}]);
  assert("Edge edge drag switch").that(puzzle.edges[0][0][3].dragSwitch).containsExactly([{},{color: puzzle.colorSchema.lineColor, returnValue: "1"}]);
}),

test('Author controllers',(suite) => {
  let puzzle = suite.showPuzzle("hexa_fence", "5x5");
  puzzle.edit();

  assert("Cell chooser").that(puzzle.cells[0][0].chooserValues).containsAtLeast([{},{text: '0', returnValue: '0'},{text: '1', returnValue: '1'},{text: '6', returnValue: '6'}]);
  assert("Cell click").that(puzzle.cells[0][0].clickSwitch).isNull();
}),

);


