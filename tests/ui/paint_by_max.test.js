paintByMaxTestSuite = uiTestSuite("Paint by Max", "squarepuzzle", "squarePuzzleType",

// Controller definition tests
test('Solver controllers',(suite) => {
  let puzzle = suite.showPuzzle(
    "paint_by_max", "4x4",
    {"bottom": ["1","3",null,null], "right": [null,"2",null,"3"], "top": [null,null,"1","2"], "left": ["3",null,2,null]}
  );
  puzzle.start();

  assert("Empty cell chooser").that(puzzle.cells[2][2].chooserValues).isNull();
  assert("Empty cell click").that(puzzle.cells[2][2].clickSwitch).containsExactly([{}, {color: puzzle.colorSchema.gridColor, returnValue: 'black'}, {color: puzzle.colorSchema.brightColor, returnValue: 'grey'}]);
  assert("Bottom clue chooser").that(puzzle.bottom[0].chooserValues).isNull();
  assert("Bottom clue click").that(puzzle.bottom[0].clickSwitch).containsExactly([{text: '1'}, {text: '1', image: 'white_circle'}]);
  assert("Right clue chooser").that(puzzle.right[1].chooserValues).isNull();
  assert("Right clue click").that(puzzle.right[1].clickSwitch).containsExactly([{text: '2'}, {text: '2', image: 'white_circle'}]);
  assert("Top clue chooser").that(puzzle.top[0].chooserValues).isNull();
  assert("Top clue click").that(puzzle.top[0].clickSwitch).containsExactly([{}, {image: 'white_circle'}]);
  assert("Left clue chooser").that(puzzle.left[0].chooserValues).isNull();
  assert("Left clue click").that(puzzle.left[0].clickSwitch).containsExactly([{text: '3'}, {text: '3', image: 'white_circle'}]);
  assert("Empty cell drag handler").that(puzzle.cells[2][2].drawDragHandler).isNotNull();
  assert("Empty cell drag processor").that(puzzle.cells[2][2].dragProcessor).isNotNull();
}),

test('Author controllers',(suite) => {
  let puzzle = suite.showPuzzle("paint_by_max", "4x4");
  puzzle.edit();


  var item = function(value) {
    return {text: value, returnValue: value}
  }
  var darkItem = function(value) {
    return {text: value, textColor: puzzle.colorSchema.outerClueSecondColor, returnValue: value}
  }

  assert("Cell chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("Cell click").that(puzzle.cells[0][0].clickSwitch).isNull();
  assert("Bottom clue chooser").that(puzzle.bottom[0].chooserValues).containsExactly([{},{text: '0', returnValue: '0'},{text: '1', returnValue: '1'},{text: '2', returnValue: '2'},{text: '3', returnValue: '3'},{text: '4', returnValue: '4'}]);
  assert("Bottom clue click").that(puzzle.bottom[0].clickSwitch).isNull();
  assert("Right clue chooser").that(puzzle.right[0].chooserValues).containsExactly([{},{text: '0', returnValue: '0'},{text: '1', returnValue: '1'},{text: '2', returnValue: '2'},{text: '3', returnValue: '3'},{text: '4', returnValue: '4'}]);
  assert("Right clue click").that(puzzle.right[0].clickSwitch).isNull();
  assert("Top clue chooser").that(puzzle.top[0].chooserValues).containsExactly([{},{text: '0', returnValue: '0'},{text: '1', returnValue: '1'},{text: '2', returnValue: '2'},{text: '3', returnValue: '3'},{text: '4', returnValue: '4'}]);
  assert("Top clue click").that(puzzle.top[0].clickSwitch).isNull();
  assert("Left clue chooser").that(puzzle.left[0].chooserValues).containsExactly([{},{text: '0', returnValue: '0'},{text: '1', returnValue: '1'},{text: '2', returnValue: '2'},{text: '3', returnValue: '3'},{text: '4', returnValue: '4'}]);
  assert("Left clue click").that(puzzle.left[0].clickSwitch).isNull();
}),
// Mouse processing tests
test('Process click to empty cell',(suite) => {
  let puzzle = suite.showPuzzle(
    "paint_by_max", "4x4",
    {"bottom": ["1","3",null,null], "right": [null,"2",null,"3"], "top": [null,null,"1","2"], "left": ["3",null,2,null]}
  );
  puzzle.start();

  let point = suite.cellPoint(puzzle, "a1");

  assert("Cell value before click").that(puzzle.cells[0][0].getValue()).isNull();
  assert("Cell data before click").that(puzzle.cells[0][0].data).isEqualTo({});

  suite.click(puzzle, point);

  assert("Cell value after one click").that(puzzle.cells[0][0].getValue()).isEqualTo("black");
  assert("Cell data after one click").that(puzzle.cells[0][0].data).isEqualTo({color:puzzle.colorSchema.gridColor, returnValue:"black"});

  suite.click(puzzle, point);

  assert("Cell value after two clicks").that(puzzle.cells[0][0].getValue()).isEqualTo("grey");
  assert("Cell data after two clicks").that(puzzle.cells[0][0].data).isEqualTo({color:puzzle.colorSchema.brightColor, returnValue:"grey"});

  suite.click(puzzle, point);

  assert("Cell value after three clicks").that(puzzle.cells[0][0].getValue()).isNull();
  assert("Cell data after three clicks").that(puzzle.cells[0][0].data).isEqualTo({});
}),

test('Process click to top clue',(suite) => {
  let puzzle = suite.showPuzzle(
    "paint_by_max", "4x4",
    {"bottom": ["1","3",null,null], "right": [null,"2",null,"3"], "top": [null,null,"1","2"], "left": ["3",null,2,null]}
  );
  puzzle.start();

  let point = suite.cellPoint(puzzle, 0, -1);

  assert("Cell value before click").that(puzzle.top[0].getValue()).isNull();
  assert("Cell data before click").that(puzzle.top[0].data).isEqualTo({});

  suite.click(puzzle, point);

  assert("Cell value after one click").that(puzzle.top[0].getValue()).isNull();
  assert("Cell data after one click").that(puzzle.top[0].data).isEqualTo({image:"white_circle"});
}),

test('Process click to left clue',(suite) => {
  let puzzle = suite.showPuzzle(
    "paint_by_max", "4x4",
    {"bottom": ["1","3",null,null], "right": [null,"2",null,"3"], "top": [null,null,"1","2"], "left": ["3",null,2,null]}
  );
  puzzle.start();

  let point = suite.cellPoint(puzzle, -1, 0);

  assert("Cell value before click").that(puzzle.left[0].getValue()).isNull();
  assert("Cell data before click").that(puzzle.left[0].data).isEqualTo({text: "3"});

  suite.click(puzzle, point);

  assert("Cell value after one click").that(puzzle.left[0].getValue()).isNull();
  assert("Cell data after one click").that(puzzle.left[0].data).isEqualTo({text: "3", image:"white_circle"});
}),

);


