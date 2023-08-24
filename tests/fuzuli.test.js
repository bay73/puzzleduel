fuzuliTestSuite = testSuite("Fuzuli",

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
    requirejs.undef('puzzle_types/fuzuli.js');
    requirejs(['puzzle_types/fuzuli.js'], cb);
  });
}),

after((suite)=> {
  Snap(suite.GRID_SELECTOR).clear();
}),

// Controller definition tests
test('Solver controllers',(suite) => {
  let puzzle = suite.showPuzzle(
    "fuzuli", "5x5",
    {"a4": "1", "b1": "1", "b5": "2", "c2": "3", "c3": "1", "d3": "2", "e4": "3"}
  );
  puzzle.start();

  assert("Empty cell chooser").that(puzzle.cells[1][1].chooserValues).containsExactly([{}, {text:"1",returnValue:"1"}, {text:"2",returnValue:"2"}, {text:"3",returnValue:"3"}, {image: 'white_circle'}, {image: 'cross'}]);
  assert("Empty cell click").that(puzzle.cells[1][1].clickSwitch).isNull();
  assert("Numbered cell chooser").that(puzzle.cells[3][0].chooserValues).isNull();
  assert("Numbered cell click").that(puzzle.cells[3][0].clickSwitch).isNull();;
  assert("Cell drag handler").that(puzzle.cells[2][2].drawDragHandler).isNull();
  assert("Cell drag processor").that(puzzle.cells[2][2].dragProcessor).isNull();
}),

test('Author controllers',(suite) => {
  let puzzle = suite.showPuzzle("fuzuli", "5x5");
  puzzle.edit();

  assert("Cell chooser").that(puzzle.cells[0][0].chooserValues).containsExactly([{}, {text:"1",returnValue:"1"}, {text:"2",returnValue:"2"}, {text:"3",returnValue:"3"}, {image: 'cross', returnValue: "cross"}]);
  assert("Cell click").that(puzzle.cells[0][0].clickSwitch).isNull();
}),
// Mouse processing tests
test('Process click to empty cell',(suite) => {
  let puzzle = suite.showPuzzle(
    "fuzuli", "4x4-ABC",
    {"a4": "1"}
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
  y -= puzzle.size.unitSize/2;
  puzzle.controller.onMouseDown(suite.mouseEvent(x, y));
  puzzle.controller.onMouseUp(suite.mouseEvent(x, y));

  assert("Chooser after click on value").that(puzzle.controller.chooserBuilder.chooserElements).isEmptyArray();
  assert("Cell value after two clicks").that(puzzle.cells[0][0].getValue()).isEqualTo("1");
  assert("Cell data after two clicks").that(puzzle.cells[0][0].data).isEqualTo({text:"1", returnValue: "1"});
}),

test('Choose value in one click',(suite) => {
  let puzzle = suite.showPuzzle(
    "fuzuli", "4x4-ABC",
    {"a4": "1"}
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
  y -= puzzle.size.unitSize/2;
  puzzle.controller.onMouseMove(suite.mouseEvent(x, y));
  puzzle.controller.onMouseUp(suite.mouseEvent(x, y));

  assert("Chooser after mouse up").that(puzzle.controller.chooserBuilder.chooserElements).isEmptyArray();
  assert("Cell value after mouse up").that(puzzle.cells[0][0].getValue()).isEqualTo("1");
  assert("Cell data after mouse up").that(puzzle.cells[0][0].data).isEqualTo({text:"1", returnValue: "1"});
}),

// Checker tests
test('Correct solution',(suite) => {
  let clues = {"a4": "1", "b1": "1", "b5": "2", "c2": "3", "c3": "1", "d3": "2", "e4": "3"};
  let data = {"a2": "2", "a5": "3", "b3": "3", "c4": "2", "d1": "3", "d5": "1", "e1": "2", "e2": "1"}

  assert("Correct solution response").that(Checker.check("5x5", clues, data)).isEqualTo({status: "OK"});
}),

test('Missing number',(suite) => {
  let clues = {"a4": "1", "b1": "1", "b5": "2", "c2": "3", "c3": "1", "d3": "2", "e4": "3"};
  let data = {"a2": "2", "a5": "3", "b3": "3", "c4": "2", "d1": "3", "e1": "2", "e2": "1"}

  assert("Missing letters solution response").that(Checker.check("5x5", clues, data)).isEqualTo({status:"All digits should be exactly once in every column",errors:["d1","d2","d3","d4","d5"]});
}),

test('Repeated number',(suite) => {
  let clues = {"a4": "1", "b1": "1", "b5": "2", "c2": "3", "c3": "1", "d3": "2", "e4": "3"};
  let data = {"a2": "2", "a5": "3", "b3": "3", "c4": "2", "d1": "3", "d5": "1", "e1": "2", "e2": "3"}

  assert("Repeated letters solution response").that(Checker.check("5x5", clues, data)).isEqualTo({status:"All digits should be exactly once in every column",errors:["e1","e2","e3","e4","e5"]});
}),

test('2x2 square',(suite) => {
  let clues = {"a4": "1", "b1": "1", "b5": "2", "c2": "3", "c3": "1", "d3": "2", "e4": "3"};
  let data = {"a2": "2", "a5": "3", "b3": "3", "c4": "2", "d1": "3", "d2": "1", "e1": "2", "e5": "1"}

  assert("2x2 square solution response").that(Checker.check("5x5", clues, data)).isEqualTo({status:"No 2x2 squares fully occupied with digits are allowed",errors:["c2","d2","c3","d3"]});
}),
);


