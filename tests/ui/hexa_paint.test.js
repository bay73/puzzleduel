hexaPaintTestSuite = testSuite("Paint be Hex",

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
  suite.mouseEvent = function(x, y) {
    return {clientX: x, clientY: y, preventDefault: ()=>{}};
  };
  requirejs(["hexapuzzle"], cb);
}),

after((suite)=> {
  Snap(suite.GRID_SELECTOR).clear();
}),
// Controller definition tests
test('Solver controllers',(suite) => {
  let puzzle = suite.showPuzzle(
    "hexa_paint", "3x3",{"a1": "3", "a2": "2"}
  );
  puzzle.start();

  assert("cell chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("cell click").that(puzzle.cells[0][0].clickSwitch).containsExactly([{text: "3"}, {text: "3", color: puzzle.colorSchema.brightColor, returnValue: '1'}, {text: "3", image: 'white_circle'}]);
  assert("Cell drag handler").that(puzzle.cells[0][0].drawDragHandler).isNotNull();
  assert("Cell drag processor").that(puzzle.cells[0][0].dragProcessor).isNotNull();
}),

test('Author controllers',(suite) => {
  let puzzle = suite.showPuzzle("hexa_paint", "5x5");
  puzzle.edit();

  assert("Cell chooser").that(puzzle.cells[0][0].chooserValues).containsExactly([{},{text: '0', returnValue: '0'},{text: '1', returnValue: '1'},{text: '2', returnValue: '2'},{text: '3', returnValue: '3'},{text: '4', returnValue: '4'},{text: '5', returnValue: '5'},{text: '6', returnValue: '6'},{text: '7', returnValue: '7'}]);
  assert("Cell click").that(puzzle.cells[0][0].clickSwitch).isNull();
}),
);


