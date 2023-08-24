tapaClassicTestSuite = testSuite("Tapa",

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
  suite.cellClick = function(puzzle, cell) {
    var size = puzzle.size.unitSize;
    var x = puzzle.size.leftGap + size/2 + size*(cell.charCodeAt(0) - 'a'.charCodeAt(0));
    var y = puzzle.size.topGap + size/2 + size*(parseInt(cell.substring(1)) - 1);
    puzzle.controller.onMouseDown(suite.mouseEvent(x, y));
    puzzle.controller.onMouseUp(suite.mouseEvent(x, y));
  };
  module = {};
  requirejs(['puzzle_types/util.js', 'squarepuzzle'], function() {
    window.util=Util;
    requirejs.undef('puzzle_types/tapa_classic.js');
    requirejs(['puzzle_types/tapa_classic.js'], cb);
  });
}),

after((suite)=> {
  Snap(suite.GRID_SELECTOR).clear();
}),

// Controller definition tests
test('Solver controllers',(suite) => {
  let puzzle = suite.showPuzzle("tapa_classic", "4x4",{"a1": "1_1", "a4": "3", "d2": 3});
  puzzle.start();

  assert("Empty cell chooser").that(puzzle.cells[1][1].chooserValues).isNull();
  assert("Empty cell click").that(puzzle.cells[1][1].clickSwitch).containsExactly([{}, {color: puzzle.colorSchema.gridColor, returnValue: 'black'}, {image: 'cross'}]);
  assert("Empty circle drag handler").that(puzzle.cells[1][1].drawDragHandler).isNotNull();
  assert("Empty circle drag processor").that(puzzle.cells[1][1].dragProcessor).isNotNull();
  assert("Clue circle chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("Clue circle click").that(puzzle.cells[0][0].clickSwitch).isNull();
  assert("Clue circle drag handler").that(puzzle.cells[0][0].drawDragHandler).isNotNull();
  assert("Clue circle drag processor").that(puzzle.cells[0][0].dragProcessor).isNotNull();
}),

test('Author controllers',(suite) => {
  let puzzle = suite.showPuzzle("tapa_classic", "4x4");
  puzzle.edit();

  assert("Cell click").that(puzzle.cells[0][0].clickSwitch).isNull();
  assert("Cell chooser").that(puzzle.cells[0][0].chooserValues).containsAtLeast([{}, {image: '0', returnValue: '0'}, {image: '1', returnValue: '1'}, {image: '8', returnValue: '8'}, {image: '1_1', returnValue: '1_1'}, {image: '2_4', returnValue: '2_4'}, {image: '1_2_2', returnValue: '1_2_2'}, {image: '1_1_1_1', returnValue: '1_1_1_1'}]);
  assert("Cell drag handler").that(puzzle.cells[1][1].drawDragHandler).isNull();
  assert("Cell drag processor").that(puzzle.cells[1][1].dragProcessor).isNull();
}),

// Mouse processing tests
test('Process click to empty cell',(suite) => {
  let puzzle = suite.showPuzzle("tapa_classic", "4x4",{"a1": "1_1", "a4": "3", "d2": 3});
  puzzle.start();

  let x = puzzle.size.leftGap + puzzle.size.unitSize/2 + puzzle.size.unitSize;
  let y = puzzle.size.topGap + puzzle.size.unitSize/2;

  assert("Cell value before click").that(puzzle.cells[0][1].getValue()).isNull();
  assert("Cell data before click").that(puzzle.cells[0][1].data).isEqualTo({});

  puzzle.controller.onMouseDown(suite.mouseEvent(x, y));
  puzzle.controller.onMouseUp(suite.mouseEvent(x, y));

  assert("Cell value after one click").that(puzzle.cells[0][1].getValue()).isEqualTo("black");
  assert("Cell data after one click").that(puzzle.cells[0][1].data).isEqualTo({color: puzzle.colorSchema.gridColor, returnValue:"black"});

  puzzle.controller.onMouseDown(suite.mouseEvent(x, y));
  puzzle.controller.onMouseUp(suite.mouseEvent(x, y));

  assert("Cell value after two clicks").that(puzzle.cells[0][1].getValue()).isNull();
  assert("Cell data after two clicks").that(puzzle.cells[0][1].data).isEqualTo({image:"cross"});

  puzzle.controller.onMouseDown(suite.mouseEvent(x, y));
  puzzle.controller.onMouseUp(suite.mouseEvent(x, y));

  assert("Cell value after three clicks").that(puzzle.cells[0][1].getValue()).isNull();
  assert("Cell data after three clicks").that(puzzle.cells[0][1].data).isEqualTo({});
}),

test('Process click to clue cell',(suite) => {
  let puzzle = suite.showPuzzle("tapa_classic", "4x4",{"a1": "1_1", "a4": "3", "d2": 3});
  puzzle.start();

  let x = puzzle.size.leftGap + puzzle.size.unitSize/2;
  let y = puzzle.size.topGap + puzzle.size.unitSize/2;

  assert("Cell value before click").that(puzzle.cells[0][0].getValue()).isNull();
  assert("Cell data before click").that(puzzle.cells[0][0].data).isEqualTo({image:"1_1"});

  puzzle.controller.onMouseDown(suite.mouseEvent(x, y));
  puzzle.controller.onMouseUp(suite.mouseEvent(x, y));

  assert("Cell value after one click").that(puzzle.cells[0][0].getValue()).isNull();
  assert("Cell data after one click").that(puzzle.cells[0][0].data).isEqualTo({image:"1_1"});
}),

test('Process click after small move',(suite) => {
  let puzzle = suite.showPuzzle("tapa_classic", "4x4",{"a1": "1_1", "a4": "3", "d2": 3});
  puzzle.start();

  let x = puzzle.size.leftGap + puzzle.size.unitSize/2 + puzzle.size.unitSize;
  let y = puzzle.size.topGap + puzzle.size.unitSize/2;

  assert("Cell value before click").that(puzzle.cells[0][1].getValue()).isNull();

  puzzle.controller.onMouseDown(suite.mouseEvent(x, y));
  x += puzzle.size.unitSize/10;
  puzzle.controller.onMouseMove(suite.mouseEvent(x, y));
  puzzle.controller.onMouseUp(suite.mouseEvent(x, y));

  assert("Cell value after one click").that(puzzle.cells[0][1].getValue()).isEqualTo("black");
}),

test('Process click after move to another cell',(suite) => {
  let puzzle = suite.showPuzzle("tapa_classic", "4x4",{"a1": "1_1", "a4": "3", "d2": 3});
  puzzle.start();

  let x = puzzle.size.leftGap + puzzle.size.unitSize/2 + puzzle.size.unitSize;
  let y = puzzle.size.topGap + puzzle.size.unitSize/2;

  assert("Cell value before click").that(puzzle.cells[0][1].getValue()).isNull();

  puzzle.controller.onMouseDown(suite.mouseEvent(x, y));
  x += puzzle.size.unitSize;
  puzzle.controller.onMouseMove(suite.mouseEvent(x, y));
  puzzle.controller.onMouseUp(suite.mouseEvent(x, y));

  assert("Cell value after one click").that(puzzle.cells[0][1].getValue()).isNull();
}),

test('Process drag copy',(suite) => {
  let puzzle = suite.showPuzzle("tapa_classic", "4x4",{"a1": "1_1", "a4": "3", "d2": 3});
  puzzle.start();

  let x = puzzle.size.leftGap + puzzle.size.unitSize/2 + puzzle.size.unitSize;
  let y = puzzle.size.topGap + puzzle.size.unitSize/2;

  puzzle.controller.onMouseDown(suite.mouseEvent(x, y));
  puzzle.controller.onMouseUp(suite.mouseEvent(x, y));

  assert("Source value after one click").that(puzzle.cells[0][1].getValue()).isEqualTo("black");
  assert("Target value before drag").that(puzzle.cells[0][2].getValue()).isNull();

  puzzle.controller.onMouseDown(suite.mouseEvent(x, y));
  x += puzzle.size.unitSize/2;
  puzzle.controller.onMouseMove(suite.mouseEvent(x, y));

  assert("Target value after half move").that(puzzle.cells[0][2].getValue()).isNull();
  path = puzzle.controller.dragHandler.path;
  assert("Drag path after half move").that(path).isNotNull();

  assert("Drag path type after half move").that(path.type).isEqualTo("g");
  let circle = path.toJSON().childNodes[0];
  let expectedCircleSize = puzzle.size.unitSize*0.4;
  assert("Drag circle after half move").that(circle.type).isEqualTo("circle");
  assert("Drag circle radius after half move").that(circle.attr.r).isAlmostEqualTo(expectedCircleSize);
  assert("Drag circle x after half move").that(circle.attr.cx).isAlmostEqualTo(x);
  assert("Drag circle y after half move").that(circle.attr.cy).isAlmostEqualTo(y);

  x += puzzle.size.unitSize/2;
  puzzle.controller.onMouseMove(suite.mouseEvent(x, y));

  assert("Target value after full move").that(puzzle.cells[0][2].getValue()).isEqualTo("black");
  assert("Target data after full move").that(puzzle.cells[0][2].data).isEqualTo({color:puzzle.colorSchema.gridColor, returnValue: "black"});

  puzzle.controller.onMouseUp(suite.mouseEvent(x, y));
  assert("Target data after finish drag").that(puzzle.cells[0][2].data).isEqualTo({color:puzzle.colorSchema.gridColor, returnValue: "black"});
}),

// Data collector tests
test('Data collector',(suite) => {
  let puzzle = suite.showPuzzle("tapa_classic", "4x4",{"a1": "1_1", "a4": "3", "d2": 3});
  puzzle.start();

  suite.cellClick(puzzle, "a1");
  suite.cellClick(puzzle, "b1");
  suite.cellClick(puzzle, "c1");
  suite.cellClick(puzzle, "a2");
  suite.cellClick(puzzle, "c2");
  suite.cellClick(puzzle, "a3");
  suite.cellClick(puzzle, "b3");
  suite.cellClick(puzzle, "c3");
  suite.cellClick(puzzle, "b4");
  suite.cellClick(puzzle, "c4");
  suite.cellClick(puzzle, "c4");

  assert("Submission data after few clicks").that(puzzle.collectData()).isEqualTo({"a2": "black", "a3": "black", "b1": "black", "b3": "black", "b4": "black", "c1": "black", "c2": "black", "c3": "black"});
}),

// Checker tests
test('Correct solution',(suite) => {
  let clues = {"a1": "1_1", "a5": "2", "c4": "2_4", "e1": "2"};
  let data = {"a2": "black", "a3": "black", "b1": "black", "b3": "black", "b4": "black", "b5": "black", "c1": "black", "c2": "black", "c3": "black", "d2": "black", "d4": "black", "d5": "black", "e2": "black", "e3": "black", "e4": "black"}

  assert("Correct solution response").that(Checker.check("5x5", clues, data)).isEqualTo({status: "OK"});
}),

test('Incorrect white 2x2',(suite) => {
  let clues = {"a1": "1_1", "a5": "2", "c4": "2_4", "e1": "2"};
  let data = {"a2": "black", "a3": "black", "b1": "black", "b3": "black", "b4": "black", "b5": "black", "c1": "black", "c2": "black", "c3": "black", "d2": "black", "d4": "black", "d5": "black", "e2": "black", "e3": "black", "e4": "black", "e5": "black"}

  assert("Incorrect white 2x2 solution response").that(Checker.check("5x5", clues, data)).isEqualTo({status:"No 2x2 black squares are allowed",errors:["d4","e4","d5","e5"]});
}),

test('Non-connected black',(suite) => {
  let clues = {"a1": "1_1", "a5": "2", "c4": "2_4", "e1": "2"};
  let data = {"a2": "black", "a3": "black", "b1": "black", "b3": "black", "b4": "black", "b5": "black", "c1": "black", "c2": "black", "c3": "black", "d2": "black", "d4": "black", "d5": "black", "e2": "black", "e4": "black"}

  assert("Non-connected black solution response").that(Checker.check("5x5", clues, data)).isEqualTo({status:"Black area should be connected"});
}),

test('Incorrect clue',(suite) => {
  let clues = {"a1": "1_1", "a5": "2", "c4": "2_4", "e1": "2"};
  let data = {"a2": "black", "a3": "black", "b1": "black", "b3": "black", "b4": "black", "b5": "black", "c1": "black", "c2": "black", "c3": "black", "d2": "black", "d4": "black", "e2": "black", "e3": "black", "e4": "black"}

  assert("Ignore clue obverride solution response").that(Checker.check("5x5", clues, data)).isEqualTo({status:"The clue is not correct",errors:["c4"]});
}),
);


