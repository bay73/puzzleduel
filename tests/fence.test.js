fenceTestSuite = testSuite("Fence",

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
  suite.edgeClick = function(puzzle, edge) {
    var size = puzzle.size.unitSize;
    var part = edge.split("-");
    var col = part[0].charCodeAt(0) - 'a'.charCodeAt(0);
    var row = parseInt(part[0].substring(1)) - 1;
    var side = part[1];

    var x = puzzle.size.leftGap + size*col + (side==1?size:(side==3?0:size/2));
    var y = puzzle.size.topGap + size*row + (side==2?size:(side==0?0:size/2));;
    puzzle.controller.onMouseDown(suite.mouseEvent(x, y));
    puzzle.controller.onMouseUp(suite.mouseEvent(x, y));
  };
  requirejs(["squarepuzzle"], cb);
}),

after((suite)=> {
  Snap(suite.GRID_SELECTOR).clear();
}),

test('Process click on edge',(suite) => {
  let puzzle = suite.showPuzzle("fence", "4x4",{"b1": "0", "a2": "3"});
  puzzle.start();

  let x = puzzle.size.leftGap + puzzle.size.unitSize/2;
  let y = puzzle.size.topGap;

  assert("Edge value before click").that(puzzle.edges[0][0][0].getValue()).isNull();
  assert("Edge data before click").that(puzzle.edges[0][0][0].data).isEqualTo({});

  puzzle.controller.onMouseDown(suite.mouseEvent(x, y));
  puzzle.controller.onMouseUp(suite.mouseEvent(x, y));

  assert("Edge value after one click").that(puzzle.edges[0][0][0].getValue()).isEqualTo(1);
  assert("Edge data after one click").that(puzzle.edges[0][0][0].data).isEqualTo({color: puzzle.colorSchema.lineColor, returnValue:1});

  puzzle.controller.onMouseDown(suite.mouseEvent(x, y));
  puzzle.controller.onMouseUp(suite.mouseEvent(x, y));

  assert("Edge value after two clicks").that(puzzle.edges[0][0][0].getValue()).isNull();
  assert("Edge data after two clicks").that(puzzle.edges[0][0][0].data).isEqualTo({image: "cross"});

  puzzle.controller.onMouseDown(suite.mouseEvent(x, y));
  puzzle.controller.onMouseUp(suite.mouseEvent(x, y));

  assert("Edge value after three clicks").that(puzzle.edges[0][0][0].getValue()).isNull();
  assert("Edge data after three clicks").that(puzzle.edges[0][0][0].data).isEqualTo({});
}),

test('Process drag on edge',(suite) => {
  let puzzle = suite.showPuzzle("fence", "4x4",{"b1": "0", "a2": "3"});
  puzzle.start();

  let x = puzzle.size.leftGap;
  let y = puzzle.size.topGap;

  assert("Edge value before click").that(puzzle.edges[0][0][0].getValue()).isNull();
  assert("Edge data before click").that(puzzle.edges[0][0][0].data).isEqualTo({});

  puzzle.controller.onMouseDown(suite.mouseEvent(x, y));
  x += puzzle.size.unitSize;
  puzzle.controller.onMouseMove(suite.mouseEvent(x, y));

  assert("Edge value after drag").that(puzzle.edges[0][0][0].getValue()).isEqualTo(1);
  assert("Edge data after drag").that(puzzle.edges[0][0][0].data).isEqualTo({color: puzzle.colorSchema.lineColor});

  x -= puzzle.size.unitSize;
  puzzle.controller.onMouseMove(suite.mouseEvent(x, y));

  assert("Edge value after back drag").that(puzzle.edges[0][0][0].getValue()).isNull();
  assert("Edge data after back drag").that(puzzle.edges[0][0][0].data).isEqualTo({});
}),

test('Data collector',(suite) => {
  let puzzle = suite.showPuzzle("fence", "4x4",{"a1": "3", "b2": "3", "c1": "0", "d2": "1"});
  puzzle.start();

  suite.edgeClick(puzzle, "a1-0");
  suite.edgeClick(puzzle, "a1-1");
  suite.edgeClick(puzzle, "a1-3");
  suite.edgeClick(puzzle, "b1-2");
  suite.edgeClick(puzzle, "b2-1");
  suite.edgeClick(puzzle, "b2-2");
  suite.edgeClick(puzzle, "d2-2");

  assert("Submission data after few clicks").that(puzzle.collectData()).isEqualTo({"edges":{"a1-0":1,"a1-1":1,"a1-3":1,"b1-2":1,"b2-1":1,"b2-2":1,"d2-2":1}});
}),
);


