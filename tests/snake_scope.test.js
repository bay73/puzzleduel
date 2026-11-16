snakeScopeTestSuite = testSuite("Snakescope",

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

// Controller definition tests
test('Solver controllers',(suite) => {
  let puzzle = suite.showPuzzle(
    "snake_scope", "5x5", {"c3": "cross","nodes": {"a1-2": "3","d1-2": "1","b2-2": "0","c2-2": "2","b3-2": "1","c3-2": "1"}
}
  );
  puzzle.start();

  assert("Empty cell chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("Empty cell click").that(puzzle.cells[0][0].clickSwitch).containsExactly([{}, {color: puzzle.colorSchema.greyColor, returnValue: '1'}, {image: 'cross'}]);
  assert("Cross cell chooser").that(puzzle.cells[2][2].chooserValues).isNull();
  assert("Cross cell click").that(puzzle.cells[2][2].clickSwitch).isNull();;
  assert("Empty cell drag handler").that(puzzle.cells[2][2].drawDragHandler).isNotNull();
  assert("Empty cell drag processor").that(puzzle.cells[2][2].dragProcessor).isNotNull();
  assert("Cross drag handler").that(puzzle.cells[0][0].drawDragHandler).isNotNull();
  assert("Cross drag processor").that(puzzle.cells[0][0].dragProcessor).isNotNull();
}),

test('Author controllers',(suite) => {
  let puzzle = suite.showPuzzle("snake_scope", "5x5");
  puzzle.edit();

  assert("Cell chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("Cell click").that(puzzle.cells[0][0].clickSwitch).containsExactly([{}, {image: 'cross', returnValue: 'cross'}]);
  assert("Node chooser").that(puzzle.nodes[0][0][2].chooserValues).containsExactly([{},{text: '0', color: puzzle.colorSchema.gridColor, textColor: puzzle.colorSchema.bgColor, returnValue: '0'},{text: '1', color: puzzle.colorSchema.gridColor, textColor: puzzle.colorSchema.bgColor, returnValue: '1'},{text: '2', color: puzzle.colorSchema.gridColor, textColor: puzzle.colorSchema.bgColor, returnValue: '2'},{text: '3', color: puzzle.colorSchema.gridColor, textColor: puzzle.colorSchema.bgColor, returnValue: '3'}]);
  assert("Node clue click").that(puzzle.nodes[0][0][2].clickSwitch).isNull();
}),

);


