yinYangClassicTestSuite = testSuite("Yin Yang",

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
    requirejs.undef('puzzle_types/yin_yang_classic.js');
    requirejs(['puzzle_types/yin_yang_classic.js'], cb);
  });
}),

after((suite)=> {
  Snap(suite.GRID_SELECTOR).clear();
}),

// Controller definition tests
test('Solver controllers',(suite) => {
  let puzzle = suite.showPuzzle("yin_yang_classic", "4x4",{"a1": "white_circle", "a2": "black_circle"});
  puzzle.start();

  assert("Empty cell chooser").that(puzzle.cells[1][1].chooserValues).isNull();
  assert("Empty cell click").that(puzzle.cells[1][1].clickSwitch).containsExactly([{}, {image: 'white_circle', returnValue: 'white_circle'}, {image: 'black_circle', returnValue: 'black_circle'}]);
  assert("Empty circle drag handler").that(puzzle.cells[1][1].drawDragHandler).isNotNull();
  assert("Empty circle drag processor").that(puzzle.cells[1][1].dragProcessor).isNotNull();
  assert("White circle chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("White circle click").that(puzzle.cells[0][0].clickSwitch).isNull();
  assert("White circle drag handler").that(puzzle.cells[0][0].drawDragHandler).isNotNull();
  assert("White circle drag processor").that(puzzle.cells[0][0].dragProcessor).isNotNull();
  assert("Black circle chooser").that(puzzle.cells[1][0].chooserValues).isNull();
  assert("Black circle click").that(puzzle.cells[1][0].clickSwitch).isNull();
  assert("Black circle drag handler").that(puzzle.cells[1][0].drawDragHandler).isNotNull();
  assert("Black circle drag processor").that(puzzle.cells[1][0].dragProcessor).isNotNull();
}),

test('Author controllers',(suite) => {
  let puzzle = suite.showPuzzle("yin_yang_classic", "4x4");
  puzzle.edit();

  assert("Cell chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("Cell click").that(puzzle.cells[0][0].clickSwitch).containsExactly([{}, {image: 'white_circle', returnValue: 'white_circle'}, {image: 'black_circle', returnValue: 'black_circle'}]);
  assert("Cell drag handler").that(puzzle.cells[1][1].drawDragHandler).isNull();
  assert("Cell drag processor").that(puzzle.cells[1][1].dragProcessor).isNull();
}),

// Mouse processing tests
test('Process click to empty cell',(suite) => {
  let puzzle = suite.showPuzzle("yin_yang_classic", "4x4",{"b1": "white_circle", "a2": "black_circle"});
  puzzle.start();

  let x = puzzle.size.leftGap + puzzle.size.unitSize/2;
  let y = puzzle.size.topGap + puzzle.size.unitSize/2;

  assert("Cell value before click").that(puzzle.cells[0][0].getValue()).isNull();
  assert("Cell data before click").that(puzzle.cells[0][0].data).isEqualTo({});

  puzzle.controller.onMouseDown(suite.mouseEvent(x, y));
  puzzle.controller.onMouseUp(suite.mouseEvent(x, y));

  assert("Cell value after one click").that(puzzle.cells[0][0].getValue()).isEqualTo("black_circle");
  assert("Cell data after one click").that(puzzle.cells[0][0].data).isEqualTo({image:"black_circle", returnValue:"black_circle"});

  puzzle.controller.onMouseDown(suite.mouseEvent(x, y));
  puzzle.controller.onMouseUp(suite.mouseEvent(x, y));

  assert("Cell value after two clicks").that(puzzle.cells[0][0].getValue()).isEqualTo("white_circle");
  assert("Cell data after two clicks").that(puzzle.cells[0][0].data).isEqualTo({image:"white_circle", returnValue:"white_circle"});

  puzzle.controller.onMouseDown(suite.mouseEvent(x, y));
  puzzle.controller.onMouseUp(suite.mouseEvent(x, y));

  assert("Cell value after three clicks").that(puzzle.cells[0][0].getValue()).isNull();
  assert("Cell data after three clicks").that(puzzle.cells[0][0].data).isEqualTo({});
}),

test('Process click to clue cell',(suite) => {
  let puzzle = suite.showPuzzle("yin_yang_classic", "4x4",{"b1": "white_circle", "a2": "black_circle"});
  puzzle.start();

  let x = puzzle.size.leftGap + puzzle.size.unitSize + puzzle.size.unitSize/2;
  let y = puzzle.size.topGap + puzzle.size.unitSize/2;

  assert("Cell value before click").that(puzzle.cells[0][0].getValue()).isNull();
  assert("Cell data before click").that(puzzle.cells[0][0].data).isEqualTo({});

  puzzle.controller.onMouseDown(suite.mouseEvent(x, y));
  puzzle.controller.onMouseUp(suite.mouseEvent(x, y));

  assert("Cell value after one click").that(puzzle.cells[0][0].getValue()).isNull();
  assert("Cell data after one click").that(puzzle.cells[0][0].data).isEqualTo({});
}),

test('Process click after small move',(suite) => {
  let puzzle = suite.showPuzzle("yin_yang_classic", "4x4",{"b1": "white_circle", "a2": "black_circle"});
  puzzle.start();

  let x = puzzle.size.leftGap + puzzle.size.unitSize/2;
  let y = puzzle.size.topGap + puzzle.size.unitSize/2;

  assert("Cell value before click").that(puzzle.cells[0][0].getValue()).isNull();

  puzzle.controller.onMouseDown(suite.mouseEvent(x, y));
  x += puzzle.size.unitSize/10;
  puzzle.controller.onMouseMove(suite.mouseEvent(x, y));
  puzzle.controller.onMouseUp(suite.mouseEvent(x, y));

  assert("Cell value after one click").that(puzzle.cells[0][0].getValue()).isEqualTo("black_circle");
}),

test('Process click after move to another cell',(suite) => {
  let puzzle = suite.showPuzzle("yin_yang_classic", "4x4",{"b1": "white_circle", "a2": "black_circle"});
  puzzle.start();

  let x = puzzle.size.leftGap + puzzle.size.unitSize/2;
  let y = puzzle.size.topGap + puzzle.size.unitSize/2;

  assert("Cell value before click").that(puzzle.cells[0][0].getValue()).isNull();

  puzzle.controller.onMouseDown(suite.mouseEvent(x, y));
  x += puzzle.size.unitSize;
  puzzle.controller.onMouseMove(suite.mouseEvent(x, y));
  puzzle.controller.onMouseUp(suite.mouseEvent(x, y));

  assert("Cell value after one click").that(puzzle.cells[0][0].getValue()).isNull();
}),

test('Process drag copy',(suite) => {
  let puzzle = suite.showPuzzle("yin_yang_classic", "4x4",{"a1": "white_circle", "a2": "black_circle"});
  puzzle.start();

  let x = puzzle.size.leftGap + puzzle.size.unitSize/2;
  let y = puzzle.size.topGap + puzzle.size.unitSize/2;

  assert("Target value before drag").that(puzzle.cells[0][1].getValue()).isNull();

  puzzle.controller.onMouseDown(suite.mouseEvent(x, y));
  x += puzzle.size.unitSize/2;
  puzzle.controller.onMouseMove(suite.mouseEvent(x, y));

  assert("Target value after half move").that(puzzle.cells[0][1].getValue()).isNull();
  path = puzzle.controller.dragHandler.path;
  assert("Drag path after half move").that(path).isNotNull();

  assert("Drag path type after half move").that(path.type).isEqualTo("g");
  let image = path.toJSON().childNodes[1];
  let expectedImageSize = puzzle.size.unitSize*0.8;
  assert("Drag image href after half move").that(image.attr.href).isEqualTo("images/white_circle.png");
  assert("Drag image width after half move").that(image.attr.width).isAlmostEqualTo(expectedImageSize);
  assert("Drag image x after half move").that(image.attr.x).isAlmostEqualTo(x - expectedImageSize/2);
  assert("Drag image y after half move").that(image.attr.y).isAlmostEqualTo(y - expectedImageSize/2);

  x += puzzle.size.unitSize/2;
  puzzle.controller.onMouseMove(suite.mouseEvent(x, y));

  assert("Target value after full move").that(puzzle.cells[0][1].getValue()).isEqualTo("white_circle");
  assert("Target data after full move").that(puzzle.cells[0][1].data).isEqualTo({image:"white_circle"});

  puzzle.controller.onMouseUp(suite.mouseEvent(x, y));
  assert("Target data after finish drag").that(puzzle.cells[0][1].data).isEqualTo({image:"white_circle"});
}),

// Data collector tests
test('Data collector',(suite) => {
  let puzzle = suite.showPuzzle("yin_yang_classic", "4x4",{"b1": "white_circle", "a2": "black_circle"});
  puzzle.start();

  suite.cellClick(puzzle, "a1");
  suite.cellClick(puzzle, "b1");
  suite.cellClick(puzzle, "b2");
  suite.cellClick(puzzle, "b2");
  suite.cellClick(puzzle, "c2");

  assert("Submission data after five clicks").that(puzzle.collectData()).isEqualTo({"a1": "black_circle", "b2": "white_circle", "c2": "black_circle"});
}),

// Checker tests
test('Correct solution',(suite) => {
  let clues = {"a1": "white_circle", "b2": "white_circle", "c3": "white_circle", "d1": "white_circle"};
  let data = {"a2": "black_circle", "a3": "black_circle", "a4": "black_circle", "b1": "white_circle", "b3": "white_circle", "b4": "black_circle", "c1": "white_circle", "c2": "black_circle", "c4": "black_circle", "d2": "black_circle", "d3": "black_circle", "d4": "black_circle"}

  assert("Correct solution response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "OK"});
}),

test('Incorrect white 2x2',(suite) => {
  let clues = {"a1": "white_circle", "b2": "white_circle", "c3": "white_circle", "d1": "white_circle"};
  let data = {"a2": "white_circle", "a3": "black_circle", "a4": "black_circle", "b1": "white_circle", "b3": "white_circle", "b4": "black_circle", "c1": "white_circle", "c2": "black_circle", "c4": "black_circle", "d2": "black_circle", "d3": "black_circle", "d4": "black_circle"}

  assert("Incorrect white 2x2 solution response").that(Checker.check("4x4", clues, data)).isEqualTo({status:"No 2x2 squares are allowed","errors":["a1","b1","a2","b2"]});
}),

test('Non-connected black',(suite) => {
  let clues = {"a1": "white_circle", "b2": "white_circle", "c3": "white_circle", "d1": "white_circle"};
  let data = {"a2": "black_circle", "a3": "black_circle", "a4": "black_circle", "b1": "white_circle", "b3": "white_circle", "b4": "black_circle", "c1": "white_circle", "c2": "black_circle", "c4": "black_circle", "d2": "black_circle", "d3": "white_circle", "d4": "black_circle"}

  assert("Non-connected black solution response").that(Checker.check("4x4", clues, data)).isEqualTo({status:"Area of one color should be connected"});
}),

test('Ignore clue obverride',(suite) => {
  let clues = {"a1": "white_circle", "b2": "white_circle", "c3": "white_circle", "d1": "white_circle"};
  let data = {"a2": "black_circle", "a3": "black_circle", "a4": "black_circle", "b1": "white_circle", "b2": "black_circle", "b3": "white_circle", "b4": "black_circle", "c1": "white_circle", "c2": "white_circle", "c4": "black_circle", "d2": "black_circle", "d3": "black_circle", "d4": "black_circle"}

  assert("Ignore clue obverride solution response").that(Checker.check("4x4", clues, data)).isEqualTo({status:"No 2x2 squares are allowed","errors":["b1","c1","b2","c2"]});
}),
);


