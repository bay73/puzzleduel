doubleblockTestSuite = testSuite("Double Block",

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
    requirejs.undef('puzzle_types/doubleblock.js');
    requirejs(['puzzle_types/doubleblock.js'], cb);
  });
}),

after((suite)=> {
  Snap(suite.GRID_SELECTOR).clear();
}),

// Controller definition tests
test('Solver controllers',(suite) => {
  let puzzle = suite.showPuzzle(
    "doubleblock", "5x5",
    {"a1": "cross", "bottom": [null,"5",null,null,"4"], "right": ["4",null,"2",null,"5"]}
  );
  puzzle.start();

  assert("Empty cell chooser").that(puzzle.cells[2][2].chooserValues).containsExactly([{}, {text:"1",returnValue:"1"}, {text:"2",returnValue:"2"}, {text:"3",returnValue:"3"}, {image: 'white_circle', keepPencil: true}, {image: 'cross'}]);
  assert("Empty cell click").that(puzzle.cells[2][2].clickSwitch).isNull();
  assert("Cross cell chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("Cross cell click").that(puzzle.cells[0][0].clickSwitch).isNull();;
  assert("Bottom clue chooser").that(puzzle.bottom[1].chooserValues).isNull();
  assert("Bottom clue click").that(puzzle.bottom[1].clickSwitch).containsExactly([{text: '5'}, {text: '5', image: 'white_circle'}]);
  assert("Right clue chooser").that(puzzle.right[0].chooserValues).isNull();
  assert("Right clue click").that(puzzle.right[0].clickSwitch).containsExactly([{text: '4'}, {text: '4', image: 'white_circle'}]);
  assert("Cell drag handler").that(puzzle.cells[2][2].drawDragHandler).isNull();
  assert("Cell drag processor").that(puzzle.cells[2][2].dragProcessor).isNull();
}),

test('Author controllers',(suite) => {
  let puzzle = suite.showPuzzle("doubleblock", "5x5");
  puzzle.edit();

  assert("Cell chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("Cell click").that(puzzle.cells[0][0].clickSwitch).containsExactly([{},{text: '1', returnValue: '1'},{text: '2', returnValue: '2'},{text: '3', returnValue: '3'},{image: 'cross', returnValue: 'cross'}]);
  assert("Bottom clue chooser").that(puzzle.bottom[0].chooserValues).containsAtLeast([{},{text: '1', returnValue: '1'},{text: '2', returnValue: '2'},{text: '6', returnValue: '6'}]);
  assert("Bottom clue click").that(puzzle.bottom[0].clickSwitch).isNull();
  assert("Right clue chooser").that(puzzle.right[0].chooserValues).containsAtLeast([{},{text: '1', returnValue: '1'},{text: '2', returnValue: '2'},{text: '6', returnValue: '6'}]);
  assert("Right clue click").that(puzzle.right[0].clickSwitch).isNull();
}),
// Mouse processing tests
test('Process click to empty cell',(suite) => {
  let puzzle = suite.showPuzzle(
    "doubleblock", "5x5",
    {"b2": "cross", "bottom": [null,"5",null,null,"4"], "right": ["4",null,"2",null,"5"]}
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
    "doubleblock", "5x5",
    {"b2": "cross", "bottom": [null,"5",null,null,"4"], "right": ["4",null,"2",null,"5"]}
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
  let clues = {"b2": "cross", "bottom": [null,"5",null,null,"4"], "right": ["4",null,"2",null,"5"]};
  let data = {"a2": "3", "a4": "2", "a5": "1", "b1": "1", "b3": "2", "b4": "3", "c1": "3", "c2": "1", "c5": "2", "d2": "2", "d3": "1", "d5": "3", "e1": "2", "e3": "3", "e4": "1"}

  assert("Correct solution response").that(Checker.check("5x5", clues, data)).isEqualTo({status: "OK"});
}),

test('Missing number',(suite) => {
  let clues = {"b2": "cross", "bottom": [null,"5",null,null,"4"], "right": ["4",null,"2",null,"5"]};
  let data = {"a2": "3", "a4": "2", "a5": "1", "b1": "1", "b3": "2", "c1": "3", "c2": "1", "c5": "2", "d2": "2", "d3": "1", "d5": "3", "e1": "2", "e3": "3", "e4": "1"}

  assert("Missing letters solution response").that(Checker.check("5x5", clues, data)).isEqualTo({status:"All digits should be exactly once in every column",errors:["b1","b2","b3","b4","b5"]});
}),

test('Repeated numer',(suite) => {
  let clues = {"b2": "cross", "bottom": [null,"5",null,null,"4"], "right": ["4",null,"2",null,"5"]};
  let data = {"a2": "3", "a4": "2", "a5": "1", "b1": "1", "b3": "2", "b4": "3", "c1": "3", "c2": "1", "c5": "2", "d2": "2", "d3": "1", "d5": "3", "e1": "2", "e3": "3", "e4": "1", "e5": "2"}

  assert("Repeated letters solution response").that(Checker.check("5x5", clues, data)).isEqualTo({status:"All digits should be exactly once in every column",errors:["e1","e2","e3","e4","e5"]});
}),

test('Wrong clue',(suite) => {
  let clues = {"b2": "cross", "bottom": [null,"5",null,null,"4"], "right": ["4",null,"2",null,"5"]};
  let data = {"a2": "3", "a3": "2", "a5": "1", "b1": "1", "b3": "3", "b4": "2", "c1": "3", "c2": "1", "c5": "2", "d2": "2", "d4": "1", "d5": "3", "e1": "2", "e3": "1", "e4": "3"}

  assert("Wrong clue solution response").that(Checker.check("5x5", clues, data)).isEqualTo({status:"Wrong sum for the row",errors:["a3","b3","c3","d3","e3"]});
}),
);


