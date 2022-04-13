GRID_SELECTOR = "#mainGrid";

areaPuzzleTestSuite = testSuite("Area puzzle solver controllers",

beforeSuite((cb)=> {
  if (!$(GRID_SELECTOR).length) {
    throw "Missing " + GRID_SELECTOR + " element"
  };
  showAreaPuzzle = function(type, dimension, data) {
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
    var puzzle = new areaPuzzleType(puzzleData, controls, settings);
    puzzle.render(Snap(GRID_SELECTOR));
    return puzzle;
  }
  requirejs(["areapuzzle"], cb);
}),

after(()=> {
  Snap(GRID_SELECTOR).clear();
}),

test('ABC Division',() => {
  let puzzle = showAreaPuzzle(
    "abc_division", "4x4-ABCD",
    {"a1": "A", "a2": "B", "a3": "C", "a4": "D", "b1": "A", "b2": "B", "b3": "C", "b4": "D", "c1": "A", "c2": "B", "c3": "A", "c4": "B", "d1": "C", "d2": "D", "d3": "C", "d4": "D"}
  );
  puzzle.start();

  assert("Cell chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("Cell click").that(puzzle.cells[0][0].clickSwitch).isNull();
  assert("Edge chooser").that(puzzle.edges[0][0][1].chooserValues).isNull();
  assert("Edge click").that(puzzle.edges[0][0][1].clickSwitch).containsExactly([{}, {color: puzzle.colorSchema.gridColor, returnValue: '1'}]);
  assert("Edge drag").that(puzzle.edges[0][0][1].dragSwitch).containsExactly([{}, {color: puzzle.colorSchema.gridColor, returnValue: '1'}]);
  assert("Connector drag").that(puzzle.connectors[0][0]['v'].dragSwitch).containsExactly([{}, {color: puzzle.colorSchema.greyColor, returnValue: '1'}]);
}),
// end "Area puzzle solver controllers" test suitex
);

areaPuzzleEditTestSuite = testSuite("Area puzzle author controllers",

beforeSuite((cb)=> {
  if (!$(GRID_SELECTOR).length) {
    throw "Missing " + GRID_SELECTOR + " element"
  };
  showAreaPuzzleForEdit = function(type, dimension, data) {
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
    var puzzle = new areaPuzzleType(puzzleData, controls, settings);
    puzzle.render(Snap(GRID_SELECTOR));
    return puzzle;
  }
  requirejs(["areapuzzle"], cb);
}),

after(()=> {
  Snap(GRID_SELECTOR).clear();
}),

test('ABC Division',() => {
  let puzzle = showAreaPuzzleForEdit("abc_division", "4x4-ABCD");
  puzzle.edit();

  assert("Cell chooser").that(puzzle.cells[0][0].chooserValues).containsExactly([{},{text: 'A', returnValue: 'A'},{text: 'B', returnValue: 'B'},{text: 'C', returnValue: 'C'},{text: 'D', returnValue: 'D'}]);
  assert("Cell click").that(puzzle.cells[0][0].clickSwitch).isNull();
  assert("Edge chooser").that(puzzle.edges[0][0][1].chooserValues).isNull();
  assert("Edge click").that(puzzle.edges[0][0][1].clickSwitch).isNull();
  assert("Edge drag").that(puzzle.edges[0][0][1].dragSwitch).isNull();
  assert("Connector drag").that(puzzle.connectors[0][0]['v'].dragSwitch).isNull();
}),
// end "Area puzzle author controllers" test suitex
);

