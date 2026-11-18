akariTestSuite = uiTestSuite("Akari", "squarepuzzle", "squarePuzzleType",

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

// Data collector tests
test('Data collector',(suite) => {
  // The puzzle and its solution are taken from the checker tests (tests/checkers/akari.test.js).
  let puzzle = suite.showPuzzle("akari", "4x4", {"d1": "black", "b2": "2", "a4": "black", "d4": "0"});
  puzzle.start();

  assert("Submission data of the empty grid").that(puzzle.collectData()).isEqualTo({});

  let solution = {"b1": "bulb", "a2": "bulb", "d2": "bulb", "c3": "bulb", "b4": "bulb"};
  suite.enterSolution(puzzle, solution);

  assert("Submission data").that(puzzle.collectData()).isEqualTo(solution);
}),

);
