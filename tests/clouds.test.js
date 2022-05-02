cloudsTestSuite = testSuite("Clouds",

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
  };
  suite.mouseEvent = function(x, y) {
    return {clientX: x, clientY: y, preventDefault: ()=>{}};
  };
  requirejs(["squarepuzzle"], cb);
}),

after((suite)=> {
  Snap(suite.GRID_SELECTOR).clear();
}),
// Controller definition tests
test('Solver controllers',(suite) => {
  let puzzle = suite.showPuzzle(
    "clouds", "5x5",
    {"a1": "cross", "b2": "black", "bottom": ["2","4","2","4","2"], "right": ["3","3",null,"4","4"]}
  );
  puzzle.start();

  assert("Empty cell chooser").that(puzzle.cells[2][2].chooserValues).isNull();
  assert("Empty cell click").that(puzzle.cells[2][2].clickSwitch).containsExactly([{}, {color: puzzle.colorSchema.gridColor, returnValue: 'black'}, {image: 'cross'}]);
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
  let puzzle = suite.showPuzzle("clouds", "5x5");
  puzzle.edit();

  assert("Cell chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("Cell click").that(puzzle.cells[0][0].clickSwitch).containsExactly([{}, {color: puzzle.colorSchema.gridColor, returnValue: 'black'}, {image: 'cross', returnValue: 'cross'}]);
  assert("Bottom clue chooser").that(puzzle.bottom[0].chooserValues).containsExactly([{},{text: '0', returnValue: '0'},{text: '1', returnValue: '1'},{text: '2', returnValue: '2'},{text: '3', returnValue: '3'},{text: '4', returnValue: '4'},{text: '5', returnValue: '5'}]);
  assert("Bottom clue click").that(puzzle.bottom[0].clickSwitch).isNull();
  assert("Right clue chooser").that(puzzle.right[0].chooserValues).containsExactly([{},{text: '0', returnValue: '0'},{text: '1', returnValue: '1'},{text: '2', returnValue: '2'},{text: '3', returnValue: '3'},{text: '4', returnValue: '4'},{text: '5', returnValue: '5'}]);
  assert("Right clue click").that(puzzle.right[0].clickSwitch).isNull();
}),
// Mouse processing tests
test('Drag outer clue inside the grid',(suite) => {
  let puzzle = suite.showPuzzle(
    "clouds", "5x5",
    {"a1": "cross", "b2": "black", "bottom": ["2","4","2","4","2"], "right": ["3","3",null,"4","4"]}
  );
  puzzle.start();

  let x = puzzle.size.leftGap + puzzle.size.unitSize/2 + 5*puzzle.size.unitSize;
  let y = puzzle.size.topGap + puzzle.size.unitSize/2;

  assert("Target data before move").that(puzzle.cells[0][4].data).isEqualTo({});

  puzzle.controller.onMouseDown(suite.mouseEvent(x, y));
  x -= puzzle.size.unitSize;
  puzzle.controller.onMouseMove(suite.mouseEvent(x, y));

  assert("Target data after move").that(puzzle.cells[0][4].data).isEqualTo({});

  puzzle.controller.onMouseUp(suite.mouseEvent(x, y));

  assert("Target data after drag end").that(puzzle.cells[0][4].data).isEqualTo({});
}),
);


