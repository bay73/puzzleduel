skyscrapersTestSuite = testSuite("Skyscrapers",

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
  module = {};
  requirejs(['puzzle_types/util.js', 'squarepuzzle'], function() {
    window.util=Util;
    requirejs(['puzzle_types/sudoku_util.js'], function() {
      window.sudoku_util=SudokuUtil;
      requirejs.undef('puzzle_types/skyscrapers.js');
      requirejs(['puzzle_types/skyscrapers.js'], cb);
    });
  });
}),

after((suite)=> {
  Snap(suite.GRID_SELECTOR).clear();
}),

// Controller definition tests
test('Solver controllers',(suite) => {
  let puzzle = suite.showPuzzle(
    "skyscrapers", "4x4-ABC",
    {"a4": "cross", "bottom": [null,null,"2",null], "right": ["2",null,"1",null], "top": ["4",null,null,null], "left": [null,"3",null,null]}
  );
  puzzle.start();

  assert("Empty cell chooser").that(puzzle.cells[2][2].chooserValues).containsExactly([{},{text: '1', returnValue: '1'},{text: '2', returnValue: '2'},{text: '3', returnValue: '3'},{text: '4', returnValue: '4'}]);
  assert("Empty cell click").that(puzzle.cells[2][2].clickSwitch).isNull();
  assert("Cross cell chooser").that(puzzle.cells[3][0].chooserValues).isNull();
  assert("Cross cell click").that(puzzle.cells[3][0].clickSwitch).isNull();;
  assert("Bottom clue chooser").that(puzzle.bottom[2].chooserValues).isNull();
  assert("Bottom clue click").that(puzzle.bottom[2].clickSwitch).containsExactly([{text: '2'}, {text: '2', image: 'white_circle'}]);
  assert("Right clue chooser").that(puzzle.right[0].chooserValues).isNull();
  assert("Right clue click").that(puzzle.right[0].clickSwitch).containsExactly([{text: '2'}, {text: '2', image: 'white_circle'}]);
  assert("Top clue chooser").that(puzzle.top[3].chooserValues).isNull();
  assert("Top clue click").that(puzzle.top[3].clickSwitch).containsExactly([{}, {image: 'white_circle'}]);
  assert("Left clue chooser").that(puzzle.left[1].chooserValues).isNull();
  assert("Left clue click").that(puzzle.left[1].clickSwitch).containsExactly([{text: '3'}, {text: '3', image: 'white_circle'}]);
  assert("Cell drag handler").that(puzzle.cells[2][2].drawDragHandler).isNull();
  assert("Cell drag processor").that(puzzle.cells[2][2].dragProcessor).isNull();
}),

test('Author controllers',(suite) => {
  let puzzle = suite.showPuzzle("skyscrapers", "4x4-ABC");
  puzzle.edit();

  assert("Cell chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("Cell click").that(puzzle.cells[0][0].clickSwitch).containsExactly([{}, {image: 'cross', returnValue: 'cross'}]);
  assert("Bottom clue chooser").that(puzzle.bottom[0].chooserValues).containsExactly([{},{text: '1', returnValue: '1'},{text: '2', returnValue: '2'},{text: '3', returnValue: '3'},{text: '4', returnValue: '4'}]);
  assert("Bottom clue click").that(puzzle.bottom[0].clickSwitch).isNull();
  assert("Right clue chooser").that(puzzle.right[0].chooserValues).containsExactly([{},{text: '1', returnValue: '1'},{text: '2', returnValue: '2'},{text: '3', returnValue: '3'},{text: '4', returnValue: '4'}]);
  assert("Right clue click").that(puzzle.right[0].clickSwitch).isNull();
  assert("Top clue chooser").that(puzzle.top[0].chooserValues).containsExactly([{},{text: '1', returnValue: '1'},{text: '2', returnValue: '2'},{text: '3', returnValue: '3'},{text: '4', returnValue: '4'}]);
  assert("Top clue click").that(puzzle.top[0].clickSwitch).isNull();
  assert("Left clue chooser").that(puzzle.left[0].chooserValues).containsExactly([{},{text: '1', returnValue: '1'},{text: '2', returnValue: '2'},{text: '3', returnValue: '3'},{text: '4', returnValue: '4'}]);
  assert("Left clue click").that(puzzle.left[0].clickSwitch).isNull();
}),
// Mouse processing tests
test('Process click to empty cell',(suite) => {
  let puzzle = suite.showPuzzle(
    "skyscrapers", "4x4-ABC",
    {"a4": "cross", "bottom": [null,null,"2",null], "right": ["2",null,"1",null], "top": ["4",null,null,null], "left": [null,"3",null,null]}
  );
  puzzle.start();

  let x = puzzle.size.leftGap + puzzle.size.unitSize/2;
  let y = puzzle.size.topGap + puzzle.size.unitSize/2;

  assert("Cell value before click").that(puzzle.cells[0][0].getValue()).isNull();
  assert("Cell data before click").that(puzzle.cells[0][0].data).isEqualTo({});
  assert("Chooser before click").that(puzzle.controller.chooserBuilder.chooserElements).isEmptyArray();

  puzzle.controller.onMouseDown(suite.mouseEvent(x, y));
  puzzle.controller.onMouseUp(suite.mouseEvent(x, y));

  assert("Chooser after click").that(puzzle.controller.chooserBuilder.chooserElements).isNonEmptyArray();
  assert("Chooser connected to the cell").that(puzzle.controller.chooserBuilder.element.col).isEqualTo(0);
  assert("Chooser connected to the cell").that(puzzle.controller.chooserBuilder.element.row).isEqualTo(0);
  assert("Cell data after one click").that(puzzle.cells[0][0].data).isEqualTo({});

  x += puzzle.size.unitSize/2;
  puzzle.controller.onMouseDown(suite.mouseEvent(x, y));
  puzzle.controller.onMouseUp(suite.mouseEvent(x, y));

  assert("Chooser after click on value").that(puzzle.controller.chooserBuilder.chooserElements).isEmptyArray();
  assert("Cell value after two clicks").that(puzzle.cells[0][0].getValue()).isEqualTo("1");
  assert("Cell data after two clicks").that(puzzle.cells[0][0].data).isEqualTo({text:"1", returnValue: "1"});
}),

test('Choose value in one click',(suite) => {
  let puzzle = suite.showPuzzle(
    "skyscrapers", "4x4-ABC",
    {"a4": "cross", "bottom": [null,null,"2",null], "right": ["2",null,"1",null], "top": ["4",null,null,null], "left": [null,"3",null,null]}
  );
  puzzle.start();

  let x = puzzle.size.leftGap + puzzle.size.unitSize/2;
  let y = puzzle.size.topGap + puzzle.size.unitSize/2;

  assert("Cell value before click").that(puzzle.cells[0][0].getValue()).isNull();
  assert("Cell data before click").that(puzzle.cells[0][0].data).isEqualTo({});
  assert("Chooser before click").that(puzzle.controller.chooserBuilder.chooserElements).isEmptyArray();

  puzzle.controller.onMouseDown(suite.mouseEvent(x, y));

  assert("Chooser after mouse down").that(puzzle.controller.chooserBuilder.chooserElements).isNonEmptyArray();
  assert("Chooser connected to the cell").that(puzzle.controller.chooserBuilder.element.col).isEqualTo(0);
  assert("Chooser connected to the cell").that(puzzle.controller.chooserBuilder.element.row).isEqualTo(0);
  assert("Cell data after mouse down").that(puzzle.cells[0][0].data).isEqualTo({});

  x += puzzle.size.unitSize/2;
  puzzle.controller.onMouseMove(suite.mouseEvent(x, y));
  puzzle.controller.onMouseUp(suite.mouseEvent(x, y));

  assert("Chooser after mouse up").that(puzzle.controller.chooserBuilder.chooserElements).isEmptyArray();
  assert("Cell value after mouse up").that(puzzle.cells[0][0].getValue()).isEqualTo("1");
  assert("Cell data after mouse up").that(puzzle.cells[0][0].data).isEqualTo({text:"1", returnValue: "1"});
}),


test('Process click to top clue',(suite) => {
  let puzzle = suite.showPuzzle(
    "skyscrapers", "4x4-ABC",
    {"a4": "cross", "bottom": [null,null,"2",null], "right": ["2",null,"1",null], "top": ["4",null,null,null], "left": [null,"3",null,null]}
  );
  puzzle.start();

  let x = puzzle.size.leftGap + puzzle.size.unitSize/2;
  let y = puzzle.size.topGap - puzzle.size.unitSize + puzzle.size.unitSize/2;

  assert("Cell value before click").that(puzzle.top[0].getValue()).isNull();
  assert("Cell data before click").that(puzzle.top[0].data).isEqualTo({text: "4"});

  puzzle.controller.onMouseDown(suite.mouseEvent(x, y));
  puzzle.controller.onMouseUp(suite.mouseEvent(x, y));

  assert("Cell value after one click").that(puzzle.top[0].getValue()).isNull();
  assert("Cell data after one click").that(puzzle.top[0].data).isEqualTo({text: "4", image:"white_circle"});
}),

test('Process click to left clue',(suite) => {
  let puzzle = suite.showPuzzle(
    "skyscrapers", "4x4-ABC",
    {"a4": "cross", "bottom": [null,null,"2",null], "right": ["2",null,"1",null], "top": ["4",null,null,null], "left": [null,"3",null,null]}
  );
  puzzle.start();

  let x = puzzle.size.leftGap - puzzle.size.unitSize + puzzle.size.unitSize/2;
  let y = puzzle.size.topGap + puzzle.size.unitSize/2;

  assert("Cell value before click").that(puzzle.left[0].getValue()).isNull();
  assert("Cell data before click").that(puzzle.left[0].data).isEqualTo({});

  puzzle.controller.onMouseDown(suite.mouseEvent(x, y));
  puzzle.controller.onMouseUp(suite.mouseEvent(x, y));

  assert("Cell value after one click").that(puzzle.left[0].getValue()).isNull();
  assert("Cell data after one click").that(puzzle.left[0].data).isEqualTo({image:"white_circle"});
}),

// Checker tests
test('Correct solution',(suite) => {
  let clues = {"bottom": [null,null,"2",null], "right": ["2",null,"1",null], "top": ["4",null,null,null], "left": [null,"3",null,null]};
  let data = {"a1": "1", "a2": "2", "a3": "3", "a4": "4", "b1": "4", "b2": "3", "b3": "2", "b4": "1", "c1": "2", "c2": "4","c3": "1", "c4": "3", "d1": "3", "d2": "1", "d3": "4", "d4": "2"}

  assert("Correct solution response").that(Checker.check("4x4-ABC", clues, data)).isEqualTo({status: "OK"});
}),

test('Repeated digits',(suite) => {
  let clues = {"bottom": [null,null,"2",null], "right": ["2",null,"1",null], "top": ["4",null,null,null], "left": [null,"3",null,null]};
  let data = {"a1": "2", "a2": "2", "a3": "3", "a4": "4", "b1": "4", "b2": "3", "b3": "2", "b4": "1", "c1": "2", "c2": "4","c3": "1", "c4": "3", "d1": "3", "d2": "1", "d3": "4", "d4": "2"}

  assert("Repeated digits solution response").that(Checker.check("4x4-ABC", clues, data)).isEqualTo({status:"All digits should be exactly once in every row",errors:["a1","b1","c1","d1"]});
}),

test('Wrong clue',(suite) => {
  let clues = {"bottom": [null,null,"2",null], "right": ["2",null,"1",null], "top": ["4",null,null,null], "left": [null,"3",null,null]};
  let data = {"a1": "1", "a2": "2", "a3": "3", "a4": "4", "b1": "4", "b2": "3", "b3": "2", "b4": "1", "c1": "3", "c2": "4","c3": "1", "c4": "2", "d1": "2", "d2": "1", "d3": "4", "d4": "3"}

  assert("Wrong clue solution response").that(Checker.check("4x4-ABC", clues, data)).isEqualTo({status:"Wrong number of visible buldings in the row",errors:["d1","c1","b1","a1"]});
}),
);


