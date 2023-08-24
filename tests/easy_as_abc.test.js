easyAsAbcTestSuite = testSuite("Easy as ABC",

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
    requirejs.undef('puzzle_types/easy_as_abc.js');
    requirejs(['puzzle_types/easy_as_abc.js'], cb);
  });
}),

after((suite)=> {
  Snap(suite.GRID_SELECTOR).clear();
}),

// Controller definition tests
test('Solver controllers',(suite) => {
  let puzzle = suite.showPuzzle(
    "easy_as_abc", "4x4-ABC",
    {"a4": "cross", "bottom": ["A",null,null,null], "right": [null,null,"B","A"], "top": [null,"B",null,null], "left": ["C",null,null,null]}
  );
  puzzle.start();

  assert("Empty cell chooser").that(puzzle.cells[2][2].chooserValues).containsExactly([{}, {text:"A",returnValue:"A"}, {text:"B",returnValue:"B"}, {text:"C",returnValue:"C"}, {image: 'white_circle'}, {image: 'cross'}]);
  assert("Empty cell click").that(puzzle.cells[2][2].clickSwitch).isNull();
  assert("Cross cell chooser").that(puzzle.cells[3][0].chooserValues).isNull();
  assert("Cross cell click").that(puzzle.cells[3][0].clickSwitch).isNull();;
  assert("Bottom clue chooser").that(puzzle.bottom[0].chooserValues).isNull();
  assert("Bottom clue click").that(puzzle.bottom[0].clickSwitch).containsExactly([{text: 'A'}, {text: 'A', image: 'white_circle'}]);
  assert("Right clue chooser").that(puzzle.right[0].chooserValues).isNull();
  assert("Right clue click").that(puzzle.right[2].clickSwitch).containsExactly([{text: 'B'}, {text: 'B', image: 'white_circle'}]);
  assert("Top clue chooser").that(puzzle.top[0].chooserValues).isNull();
  assert("Top clue click").that(puzzle.top[0].clickSwitch).containsExactly([{}, {image: 'white_circle'}]);
  assert("Left clue chooser").that(puzzle.left[0].chooserValues).isNull();
  assert("Left clue click").that(puzzle.left[0].clickSwitch).containsExactly([{text: 'C'}, {text: 'C', image: 'white_circle'}]);
  assert("Cell drag handler").that(puzzle.cells[2][2].drawDragHandler).isNull();
  assert("Cell drag processor").that(puzzle.cells[2][2].dragProcessor).isNull();
}),

test('Solver controllers with other letters',(suite) => {
  let puzzle = suite.showPuzzle(
    "easy_as_abc", "4x4-KL",
    {"a4": "cross", "bottom": ["K",null,null,null], "right": [null,null,"L","K"], "top": [null,"K",null,null], "left": ["K",null,null,null]}
  );
  puzzle.start();

  assert("Empty cell chooser").that(puzzle.cells[2][2].chooserValues).containsExactly([{}, {text:"K",returnValue:"K"}, {text:"L",returnValue:"L"}, {image: 'white_circle'}, {image: 'cross'}]);
  assert("Empty cell click").that(puzzle.cells[2][2].clickSwitch).isNull();
}),

test('Author controllers',(suite) => {
  let puzzle = suite.showPuzzle("easy_as_abc", "4x4-ABC");
  puzzle.edit();

  assert("Cell chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("Cell click").that(puzzle.cells[0][0].clickSwitch).containsExactly([{}, {image: 'cross', returnValue: 'cross'}]);
  assert("Bottom clue chooser").that(puzzle.bottom[0].chooserValues).containsExactly([{},{text: 'A', returnValue: 'A'},{text: 'B', returnValue: 'B'},{text: 'C', returnValue: 'C'}]);
  assert("Bottom clue click").that(puzzle.bottom[0].clickSwitch).isNull();
  assert("Right clue chooser").that(puzzle.right[0].chooserValues).containsExactly([{},{text: 'A', returnValue: 'A'},{text: 'B', returnValue: 'B'},{text: 'C', returnValue: 'C'}]);
  assert("Right clue click").that(puzzle.right[0].clickSwitch).isNull();
  assert("Top clue chooser").that(puzzle.top[0].chooserValues).containsExactly([{},{text: 'A', returnValue: 'A'},{text: 'B', returnValue: 'B'},{text: 'C', returnValue: 'C'}]);
  assert("Top clue click").that(puzzle.top[0].clickSwitch).isNull();
  assert("Left clue chooser").that(puzzle.left[0].chooserValues).containsExactly([{},{text: 'A', returnValue: 'A'},{text: 'B', returnValue: 'B'},{text: 'C', returnValue: 'C'}]);
  assert("Left clue click").that(puzzle.left[0].clickSwitch).isNull();
}),
// Mouse processing tests
test('Process click to empty cell',(suite) => {
  let puzzle = suite.showPuzzle(
    "easy_as_abc", "4x4-ABC",
    {"a4": "cross", "bottom": ["A",null,null,null], "right": [null,null,"B","A"], "top": [null,"B",null,null], "left": ["C",null,null,null]}
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
  assert("Cell value after two clicks").that(puzzle.cells[0][0].getValue()).isEqualTo("A");
  assert("Cell data after two clicks").that(puzzle.cells[0][0].data).isEqualTo({text:"A", returnValue: "A"});
}),

test('Choose value in one click',(suite) => {
  let puzzle = suite.showPuzzle(
    "easy_as_abc", "4x4-ABC",
    {"a4": "cross", "bottom": ["A",null,null,null], "right": [null,null,"B","A"], "top": [null,"B",null,null], "left": ["C",null,null,null]}
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
  assert("Cell value after mouse up").that(puzzle.cells[0][0].getValue()).isEqualTo("A");
  assert("Cell data after mouse up").that(puzzle.cells[0][0].data).isEqualTo({text:"A", returnValue: "A"});
}),


test('Process click to top clue',(suite) => {
  let puzzle = suite.showPuzzle(
    "easy_as_abc", "4x4-ABC",
    {"a4": "cross", "bottom": ["A",null,null,null], "right": [null,null,"B","A"], "top": [null,"B",null,null], "left": ["C",null,null,null]}
  );
  puzzle.start();

  let x = puzzle.size.leftGap + puzzle.size.unitSize/2;
  let y = puzzle.size.topGap - puzzle.size.unitSize + puzzle.size.unitSize/2;

  assert("Cell value before click").that(puzzle.top[0].getValue()).isNull();
  assert("Cell data before click").that(puzzle.top[0].data).isEqualTo({});

  puzzle.controller.onMouseDown(suite.mouseEvent(x, y));
  puzzle.controller.onMouseUp(suite.mouseEvent(x, y));

  assert("Cell value after one click").that(puzzle.top[0].getValue()).isNull();
  assert("Cell data after one click").that(puzzle.top[0].data).isEqualTo({image:"white_circle"});
}),

test('Process click to left clue',(suite) => {
  let puzzle = suite.showPuzzle(
    "easy_as_abc", "4x4-ABC",
    {"a4": "cross", "bottom": ["A",null,null,null], "right": [null,null,"B","A"], "top": [null,"B",null,null], "left": ["C",null,null,null]}
  );
  puzzle.start();

  let x = puzzle.size.leftGap - puzzle.size.unitSize + puzzle.size.unitSize/2;
  let y = puzzle.size.topGap + puzzle.size.unitSize/2;

  assert("Cell value before click").that(puzzle.left[0].getValue()).isNull();
  assert("Cell data before click").that(puzzle.left[0].data).isEqualTo({text: "C"});

  puzzle.controller.onMouseDown(suite.mouseEvent(x, y));
  puzzle.controller.onMouseUp(suite.mouseEvent(x, y));

  assert("Cell value after one click").that(puzzle.left[0].getValue()).isNull();
  assert("Cell data after one click").that(puzzle.left[0].data).isEqualTo({text: "C", image:"white_circle"});
}),

// Checker tests
test('Correct solution',(suite) => {
  let clues = {"a4": "cross", "bottom": ["A",null,null,null], "right": [null,null,"B","A"], "top": [null,"B",null,null], "left": ["C",null,null,null]};
  let data = {"a1": "C", "a2": "B", "a3": "A", "b1": "B", "b2": "A", "b4": "C", "c1": "A", "c3": "C", "c4": "B", "d2": "C", "d3": "B", "d4": "A"}

  assert("Correct solution response").that(Checker.check("4x4-ABC", clues, data)).isEqualTo({status: "OK"});
}),

test('Missing letters',(suite) => {
  let clues = {"a4": "cross", "bottom": ["A",null,null,null], "right": [null,null,"B","A"], "top": [null,"B",null,null], "left": ["C",null,null,null]};
  let data = {"a2": "B", "a3": "A", "b1": "B", "b2": "A", "b4": "C", "c1": "A", "c3": "C", "c4": "B", "d2": "C", "d3": "B", "d4": "A"}

  assert("Missing letters solution response").that(Checker.check("4x4-ABC", clues, data)).isEqualTo({status:"All letters should be exactly once in every column",errors:["a1","a2","a3","a4"]});
}),

test('Repeated letters',(suite) => {
  let clues = {"a4": "cross", "bottom": ["A",null,null,null], "right": [null,null,"B","A"], "top": [null,"B",null,null], "left": ["C",null,null,null]};
  let data = {"a1": "B", "a2": "B", "a3": "A", "b1": "B", "b2": "A", "b4": "C", "c1": "A", "c3": "C", "c4": "B", "d2": "C", "d3": "B", "d4": "A"}

  assert("Repeated letters solution response").that(Checker.check("4x4-ABC", clues, data)).isEqualTo({status:"All letters should be exactly once in every column",errors:["a1","a2","a3","a4"]});
}),

test('Wrong clue',(suite) => {
  let clues = {"a4": "cross", "bottom": ["A",null,null,null], "right": [null,null,"B","A"], "top": [null,"B",null,null], "left": ["C",null,null,null]};
  let data = {"a1": "B", "a2": "C", "a3": "A", "b1": "C", "b2": "A", "b4": "B", "c1": "A", "c3": "B", "c4": "C", "d2": "B", "d3": "C", "d4": "A"}

  assert("Wrong clue solution response").that(Checker.check("4x4-ABC", clues, data)).isEqualTo({status:"Wrong first letter in the row",errors:["b1","b2","b3","b4"]});
}),
);


