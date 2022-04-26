dominoCastleSumTestSuite = testSuite("Domino Castle Sum",

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

test('Solver selectors',(suite) => {
  let puzzle = suite.showPuzzle(
    "domino_castle_sum", "4x4-123",
    {
     "b2": "black", "c2": "black", "b3": "black", "c3": "black",
     "areas": [["b1","c1"],["a1","a2"],["b2","c2","b3","c3"],["d1","d2"],["a3","a4"],["b4","c4"],["d3","d4"]],
     "bottom": ["6",null,null,"9"], "right": ["6",null,null,"12"]
    }
  );
  puzzle.start();

  assert("White cell chooser").that(puzzle.cells[0][0].chooserValues).containsExactly([{}, {text:'1', returnValue: '1'}, {text:'2', returnValue: '2'}, {text:'3', returnValue: '3'}]);
  assert("White cell click").that(puzzle.cells[0][0].clickSwitch).isNull();
  assert("Black cell chooser").that(puzzle.cells[1][1].chooserValues).isNull();
  assert("Black cell click").that(puzzle.cells[1][1].clickSwitch).isNull();
  assert("Bottom clue chooser").that(puzzle.bottom[0].chooserValues).isNull();
  assert("Bottom clue click").that(puzzle.bottom[0].clickSwitch).isNull();
  assert("Right clue chooser").that(puzzle.right[0].chooserValues).isNull();
  assert("Right clue click").that(puzzle.right[0].clickSwitch).isNull();
}),

test('Author selectors',(suite) => {
  let puzzle = suite.showPuzzle("domino_castle_sum", "4x4-123");
  puzzle.edit();

  assert("Cell chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("Cell click").that(puzzle.cells[0][0].clickSwitch).containsExactly([{}, {color: puzzle.colorSchema.gridColor, returnValue: 'black'}]);
  assert("Bottom clue chooser").that(puzzle.bottom[0].chooserValues).containsAtLeast([{},{text: '1', returnValue: '1'},{text: '2', returnValue: '2'},{text: '99', returnValue: '99'}]);
  assert("Bottom clue click").that(puzzle.bottom[0].clickSwitch).isNull();
  assert("Right clue chooser").that(puzzle.right[0].chooserValues).containsAtLeast([{},{text: '1', returnValue: '1'},{text: '2', returnValue: '2'},{text: '99', returnValue: '99'}]);
  assert("Right clue click").that(puzzle.right[0].clickSwitch).isNull();
  assert("Edge chooser").that(puzzle.edges[0][0][1].chooserValues).isNull();
  assert("Edge click").that(puzzle.edges[0][0][1].clickSwitch).containsExactly([{}, {color: puzzle.colorSchema.gridColor, returnValue: '1'}]);
  assert("Edge drag").that(puzzle.edges[0][0][1].dragSwitch).containsExactly([{}, {color: puzzle.colorSchema.gridColor, returnValue: '1'}]);
}),
);


