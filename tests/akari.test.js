akariTestSuite = testSuite("Akari",

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
    "akari", "4x4",
    {"a3": "black", "c4": "1", "d1": "2"}
  )
  puzzle.start();

  assert("Empty cell chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("Empty cell click").that(puzzle.cells[0][0].clickSwitch).containsExactly([{}, {image: 'bulb', returnValue: 'bulb'}, {image: 'cross'}]);
  assert("Black cell chooser").that(puzzle.cells[2][0].chooserValues).isNull();
  assert("Black cell click").that(puzzle.cells[2][0].clickSwitch).containsExactly([{color: puzzle.colorSchema.gridColor}, {image: 'white_cross', color: puzzle.colorSchema.gridColor}]);
  assert("Number cell chooser").that(puzzle.cells[3][2].chooserValues).isNull();
  assert("Number cell click").that(puzzle.cells[3][2].clickSwitch).containsExactly([{text: '1', color: puzzle.colorSchema.gridColor, textColor: "#fff"}, {text: '1', image: 'white_cross', color: puzzle.colorSchema.gridColor, textColor: "#fff"}]);
  assert("Connector drag").that(puzzle.connectors[0][0]['v'].dragSwitch).containsExactly([{}, {color: puzzle.colorSchema.lineColor}]);
}),

test('Author controllers',(suite) => {
  let puzzle = suite.showPuzzle("akari", "4x4");
  puzzle.edit();

  assert("Cell chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("Cell click").that(puzzle.cells[0][0].clickSwitch).containsExactly([{}, {color: puzzle.colorSchema.gridColor, returnValue: 'black'}, {text: '0', color: puzzle.colorSchema.gridColor, textColor: "#fff", returnValue: '0'},{text: '1', color: puzzle.colorSchema.gridColor, textColor: "#fff", returnValue: '1'},{text: '2', color: puzzle.colorSchema.gridColor, textColor: "#fff", returnValue: '2'},{text: '3', color: puzzle.colorSchema.gridColor, textColor: "#fff", returnValue: '3'},{text: '4', color: puzzle.colorSchema.gridColor, textColor: "#fff", returnValue: '4'}]);
}),
);


