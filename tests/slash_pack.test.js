slashPackTestSuite = testSuite("Slash Pack",

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
    var puzzle = new slashPuzzleType(puzzleData, controls, settings);
    puzzle.render(Snap(suite.GRID_SELECTOR));
    return puzzle;
  };
  suite.mouseEvent = function(x, y) {
    return {clientX: x, clientY: y, preventDefault: ()=>{}};
  };
  module = {};
  requirejs(['puzzle_types/util.js', 'slashpuzzle'], function() {
    window.util=Util;
    requirejs.undef('puzzle_types/slash_pack.js');
    requirejs(['puzzle_types/slash_pack.js'], cb);
  });
}),

after((suite)=> {
  Snap(suite.GRID_SELECTOR).clear();
}),

// Controller definition tests
test('Solver controllers',(suite) => {
  let puzzle = suite.showPuzzle(
    "slash_pack", "5x5-ABC",
    {"a4": "A"}
  );
  puzzle.start();

  assert("Empty cell chooser").that(puzzle.cells[2][2].chooserValues).isNull();
  assert("Empty cell click").that(puzzle.cells[2][2].clickSwitch).containsExactly([{}, {image: 'slash', returnValue: '/'}, {image: 'backslash', returnValue:'\\'}]);
  assert("Letter cell chooser").that(puzzle.cells[3][0].chooserValues).isNull();
  assert("Letter cell click").that(puzzle.cells[3][0].clickSwitch).isNull();;
  assert("Cell drag handler").that(puzzle.cells[2][2].drawDragHandler).isNull();
  assert("Cell drag processor").that(puzzle.cells[2][2].dragProcessor).isNull();
  assert("Node drag handler").that(puzzle.nodes[2][2][0].drawDragHandler).isNull();
  assert("Node drag processor").that(puzzle.nodes[2][2][0].dragProcessor).isNotNull();
}),

test('Author controllers',(suite) => {
  let puzzle = suite.showPuzzle("slash_pack", "5x5-ABC");
  puzzle.edit();

  assert("Cell chooser").that(puzzle.cells[0][0].chooserValues).containsExactly([{},{text: 'A', returnValue: 'A'},{text: 'B', returnValue: 'B'},{text: 'C', returnValue: 'C'}]);
  assert("Cell click").that(puzzle.cells[0][0].clickSwitch).isNull();
}),
// Mouse processing tests
test('Process click to empty cell',(suite) => {
  let puzzle = suite.showPuzzle(
    "slash_pack", "5x5-ABC",
    {"a4": "A"}
  );
  puzzle.start();

  let x = puzzle.size.leftGap + puzzle.size.unitSize/2;
  let y = puzzle.size.topGap + puzzle.size.unitSize/2;

  assert("Cell value before click").that(puzzle.cells[0][0].getValue()).isNull();
  assert("Cell data before click").that(puzzle.cells[0][0].data).isEqualTo({});

  puzzle.controller.onMouseDown(suite.mouseEvent(x, y));
  puzzle.controller.onMouseUp(suite.mouseEvent(x, y));

  assert("Cell value after mouse up").that(puzzle.cells[0][0].getValue()).isEqualTo("/");
  assert("Cell data after one click").that(puzzle.cells[0][0].data).isEqualTo({image: 'slash', returnValue: '/'});
}),

test('Draw diagonal',(suite) => {
  let puzzle = suite.showPuzzle(
    "slash_pack", "5x5-ABC",
    {"a4": "A"}
  );
  puzzle.start();

  let x = puzzle.size.leftGap;
  let y = puzzle.size.topGap + puzzle.size.unitSize;

  assert("Cell value before click").that(puzzle.cells[0][0].getValue()).isNull();
  assert("Cell data before click").that(puzzle.cells[0][0].data).isEqualTo({});
  assert("Chooser before click").that(puzzle.controller.chooserBuilder.chooserElements).isEmptyArray();

  puzzle.controller.onMouseDown(suite.mouseEvent(x, y));

  assert("Cell data after mouse down").that(puzzle.cells[0][0].data).isEqualTo({});

  x += puzzle.size.unitSize;
  y -= puzzle.size.unitSize;
  puzzle.controller.onMouseMove(suite.mouseEvent(x, y));

  assert("Cell value after mouse move").that(puzzle.cells[0][0].getValue()).isEqualTo("/");
  assert("Cell data after mouse move").that(puzzle.cells[0][0].data).isEqualTo({image: 'slash', returnValue: '/'});

  x += puzzle.size.unitSize;
  y += puzzle.size.unitSize;
  puzzle.controller.onMouseMove(suite.mouseEvent(x, y));
  
  assert("Cell value after second mouse move").that(puzzle.cells[0][1].getValue()).isEqualTo("\\");
  assert("Cell data after second mouse move").that(puzzle.cells[0][1].data).isEqualTo({image: 'backslash', returnValue: '\\'});

}),

// Checker tests
test('Correct solution',(suite) => {
  let clues = {"a2": "A", "a3": "B", "b3": "C", "a5": "A", "c1": "C", "e1": "B", "c5": "A", "e3": "C", "e5": "B"};
  let data = {"a4": "\\", "b1": "\\", "b4": "/", "b5": "/", "c2": "\\", "c3": "/", "c4": "/", "d3": "/", "e2": "/"}

  assert("Correct solution response").that(Checker.check("5x5-ABC", clues, data)).isEqualTo({status: "OK"});
}),

test('Not finished line',(suite) => {
  let clues = {"a2": "A", "a3": "B", "b3": "C", "a5": "A", "c1": "C", "e1": "B", "c5": "A", "e3": "C", "e5": "B"};
  let data = {"a4": "\\", "b1": "\\", "b4": "/", "b5": "/", "c2": "\\", "c3": "/", "c4": "/", "d3": "/"}

  assert("Not finished line solution response").that(Checker.check("5x5-ABC", clues, data)).isEqualTo({status: "Each area should contain all letters exactly once",errors:["a4","a5","b1","b4","b5","c1","c2","c3","c4","c5","d1","d2","d3","d4","d5","e1","e2","e3","e4","e5"]});
}),

test('Wrong letters in area',(suite) => {
  let clues = {"a2": "A", "a3": "B", "b3": "C", "a5": "A", "c1": "C", "e1": "B", "c5": "A", "e3": "C", "e5": "B"};
  let data = {"a4": "\\", "d1": "\\", "b4": "/", "b5": "/", "d  2": "/", "c3": "/", "c4": "/", "d3": "/", "e2": "/"}

  assert("Wrong letters line solution response").that(Checker.check("5x5-ABC", clues, data)).isEqualTo({status: "Each area should contain all letters exactly once",errors:["a1","a2","a3","a4","b1","b2","b3","b4","c1","c2","c3","d1","d2"]});
}),
);


