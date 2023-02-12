squaresAndRectanglesTestSuite = testSuite("Squares and Rectangles",

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
    var puzzle = new areaPuzzleType(puzzleData, controls, settings);
    puzzle.render(Snap(suite.GRID_SELECTOR));
    return puzzle;
  }
  suite.mouseEvent = function(x, y) {
    return {clientX: x, clientY: y, preventDefault: ()=>{}};
  }
  module = {};
  requirejs(['puzzle_types/util.js', 'areapuzzle'], function() {
    window.util=Util;
    requirejs.undef('puzzle_types/squares_and_rectangles.js');
    requirejs(['puzzle_types/squares_and_rectangles.js'], cb);
  });
}),

after((suite)=> {
  Snap(suite.GRID_SELECTOR).clear();
}),

test('Solver controllers',(suite) => {
  let puzzle = suite.showPuzzle(
    "squares_and_rectangles", "4x4", {"a1": "white_circle", "a2": "white_circle", "b2": "black_circle", "c1": "black_circle", "edges": {"a2-2": "huge_black_circle", "d1-2": "huge_white_circle"}, "nodes": {"b1-2": "huge_white_circle", "b3-2": "huge_black_circle"} });
  puzzle.start();

  assert("Cell chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("Cell click").that(puzzle.cells[0][0].clickSwitch).isNull();
  assert("Edge chooser").that(puzzle.edges[0][0][1].chooserValues).isNull();
  assert("Edge click").that(puzzle.edges[0][0][1].clickSwitch).containsExactly([{}, {color: puzzle.colorSchema.gridColor, returnValue: 'bold'}]);
  assert("Edge drag").that(puzzle.edges[0][0][1].dragSwitch).containsExactly([{}, {color: puzzle.colorSchema.gridColor, returnValue: 'bold'}]);
  assert("Connector drag").that(puzzle.connectors[0][0]['v'].dragSwitch).containsExactly([{}, {color: puzzle.colorSchema.lineColor, returnValue: 'line'}]);
}),

test('Author controllers',(suite) => {
  let puzzle = suite.showPuzzle("squares_and_rectangles", "4x4");
  puzzle.edit();

  assert("Cell chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("Cell click").that(puzzle.cells[0][0].clickSwitch).containsExactly([{},{image: 'white_circle', returnValue: 'white_circle'},{image: 'black_circle', returnValue: 'black_circle'}]);
  assert("Edge chooser").that(puzzle.edges[0][0][1].chooserValues).isNull();
  assert("Edge click").that(puzzle.edges[0][0][1].clickSwitch).containsExactly([{},{image: 'huge_white_circle', returnValue: 'huge_white_circle'},{image: 'huge_black_circle', returnValue: 'huge_black_circle'}]);
  assert("Edge drag").that(puzzle.edges[0][0][1].dragSwitch).isNull();
  assert("Node chooser").that(puzzle.nodes[0][0][2].chooserValues).isNull();
  assert("Node click").that(puzzle.nodes[0][0][2].clickSwitch).containsExactly([{},{image: 'huge_white_circle', returnValue: 'huge_white_circle'},{image: 'huge_black_circle', returnValue: 'huge_black_circle'}]);
  assert("Connector drag").that(puzzle.connectors[0][0]['v'].dragSwitch).isNull();
}),
// Mouse processing tests
test('Process click to edge',(suite) => {
  let puzzle = suite.showPuzzle(
    "squares_and_rectangles", "4x4", {"a1": "white_circle", "a2": "white_circle", "b2": "black_circle", "c1": "black_circle", "edges": {"a2-2": "huge_black_circle", "d1-2": "huge_white_circle"}, "nodes": {"b1-2": "huge_white_circle", "b3-2": "huge_black_circle"} });
  puzzle.start();

  let x = puzzle.size.leftGap + puzzle.size.unitSize/2;
  let y = puzzle.size.topGap + puzzle.size.unitSize;

  assert("Edge value before click").that(puzzle.edges[0][0][2].getValue()).isNull();
  assert("Edge data before click").that(puzzle.edges[0][0][2].data).isEqualTo({});

  // Click at edge between a1 and a2
  puzzle.controller.onMouseDown(suite.mouseEvent(x, y));
  puzzle.controller.onMouseUp(suite.mouseEvent(x, y));

  assert("Edge value after click").that(puzzle.edges[0][0][2].getValue()).isEqualTo("bold");
  assert("Edge data after click").that(puzzle.edges[0][0][2].data).isEqualTo({color:puzzle.colorSchema.gridColor,returnValue:"bold"});
}),
test('Process drag for edge',(suite) => {
  let puzzle = suite.showPuzzle(
    "squares_and_rectangles", "4x4", {"a1": "white_circle", "a2": "white_circle", "b2": "black_circle", "c1": "black_circle", "edges": {"a2-2": "huge_black_circle", "d1-2": "huge_white_circle"}, "nodes": {"b1-2": "huge_white_circle", "b3-2": "huge_black_circle"} });
  puzzle.start();

  let x = puzzle.size.leftGap + puzzle.size.unitSize;
  let y = puzzle.size.topGap;

  assert("Edge value before click").that(puzzle.edges[0][0][1].getValue()).isNull();
  assert("Edge data before click").that(puzzle.edges[0][0][1].data).isEqualTo({});

  // Start drag at top end of an edge between a1 and b1
  puzzle.controller.onMouseDown(suite.mouseEvent(x, y));

  assert("Edge value after mousedown").that(puzzle.edges[0][0][1].getValue()).isNull();
  assert("Edge data after mousedown").that(puzzle.edges[0][0][1].data).isEqualTo({});
  
  y += puzzle.size.unitSize;
  puzzle.controller.onMouseMove(suite.mouseEvent(x, y));
  puzzle.controller.onMouseUp(suite.mouseEvent(x, y));

  assert("Edge value after drag end").that(puzzle.edges[0][0][1].getValue()).isEqualTo("bold");
  assert("Edge data after drag end").that(puzzle.edges[0][0][1].data).isEqualTo({color:puzzle.colorSchema.gridColor,returnValue:"bold"});
}),
test('Process drag for connector',(suite) => {
  let puzzle = suite.showPuzzle(
    "squares_and_rectangles", "4x4", {"a1": "white_circle", "a2": "white_circle", "b2": "black_circle", "c1": "black_circle", "edges": {"a2-2": "huge_black_circle", "d1-2": "huge_white_circle"}, "nodes": {"b1-2": "huge_white_circle", "b3-2": "huge_black_circle"} });
  puzzle.start();

  let x = puzzle.size.leftGap + puzzle.size.unitSize/2;
  let y = puzzle.size.topGap + puzzle.size.unitSize/2;

  assert("Connector value before click").that(puzzle.connectors[0][0]['h'].getValue()).isNull();
  assert("Connector data before click").that(puzzle.connectors[0][0]['h'].data).isEqualTo({});

  puzzle.controller.onMouseDown(suite.mouseEvent(x, y));

  assert("Connector value after mousedown").that(puzzle.connectors[0][0]['h'].getValue()).isNull();
  assert("Connector data after mousedown").that(puzzle.connectors[0][0]['h'].data).isEqualTo({});
  
  x += puzzle.size.unitSize;
  puzzle.controller.onMouseMove(suite.mouseEvent(x, y));
  puzzle.controller.onMouseUp(suite.mouseEvent(x, y));

  assert("Connector value after drag end").that(puzzle.connectors[0][0]['h'].getValue()).isEqualTo("line");
  assert("Connector data after drag end").that(puzzle.connectors[0][0]['h'].data).isEqualTo({color: puzzle.colorSchema.lineColor, returnValue: 'line'});
}),
test('Automatic border between areas',(suite) => {
  let puzzle = suite.showPuzzle(
    "squares_and_rectangles", "4x4", {"a1": "white_circle", "a2": "white_circle", "b2": "black_circle", "c1": "black_circle", "edges": {"a2-2": "huge_black_circle", "d1-2": "huge_white_circle"}, "nodes": {"b1-2": "huge_white_circle", "b3-2": "huge_black_circle"} });
  puzzle.start();

  let x = puzzle.size.leftGap + puzzle.size.unitSize/2;
  let y = puzzle.size.topGap + puzzle.size.unitSize/2;

  puzzle.controller.onMouseDown(suite.mouseEvent(x, y));

  y += puzzle.size.unitSize;
  puzzle.controller.onMouseMove(suite.mouseEvent(x, y));
  puzzle.controller.onMouseUp(suite.mouseEvent(x, y));

  assert("Edge value after first connector").that(puzzle.edges[0][0][1].getValue()).isNull();
  assert("Edge data after first connector").that(puzzle.edges[0][0][1].data).isEqualTo({});

  x = puzzle.size.leftGap + puzzle.size.unitSize + puzzle.size.unitSize/2;
  y = puzzle.size.topGap + puzzle.size.unitSize/2;

  puzzle.controller.onMouseDown(suite.mouseEvent(x, y));

  y += puzzle.size.unitSize;
  puzzle.controller.onMouseMove(suite.mouseEvent(x, y));
  puzzle.controller.onMouseUp(suite.mouseEvent(x, y));

  assert("Edge value after second connector").that(puzzle.edges[0][0][1].getValue()).isEqualTo("bold");
  assert("Edge data after second connector").that(puzzle.edges[0][0][1].data).isEqualTo({color: puzzle.colorSchema.greyColor});
}),
// Checker tests
test('Touching same size area',(suite) => {
  let clues = {"c1": "black_circle", "c4": "white_circle", "edges": {"a1-1": "huge_black_circle", "d2-2": "huge_white_circle"}, "nodes": {"a3-2": "huge_black_circle"} };
  let data = {"areas":[["a1","b1","a2","b2"],["c1"],["d1","d2","d3","d4"],["c2","c3","c4"],["a3","b3","a4","b4"]]};

  assert("Touching same size area").that(Checker.check("4x4", clues, data)).isEqualTo({status:"Areas of the same size shouldn't share an edge",errors:["a1","b1","a2","b2","a3","b3","a4","b4"]});
}),

test('Incorrect not a rectangle',(suite) => {
  let clues = {"c1": "black_circle", "c4": "white_circle", "edges": {"a1-1": "huge_black_circle", "d2-2": "huge_white_circle"}, "nodes": {"a3-2": "huge_black_circle"} };
  let data = {"areas":[["a1","b1","a2","b2"],["c1"],["d1","d2","d3"],["c2","c3","c4","d4"],["a3","b3","a4","b4"]]};

  assert("Incorrect not a rectangle  response").that(Checker.check("4x4", clues, data)).isEqualTo({status:"Each area should have rectangular or square shape","errors":["c2","c3","c4","d4"]});
}),

test('Incorrect unused cells',(suite) => {
  let clues = {"c1": "black_circle", "c4": "white_circle", "edges": {"a1-1": "huge_black_circle", "d2-2": "huge_white_circle"}, "nodes": {"a3-2": "huge_black_circle"} };
  let data = {"areas":[["a1","b1","a2","b2"],["c1"],["d1","d2","d3"],["c2","c3","c4"],["a3","b3","a4","b4"]]};

  assert("Incorrect unused cells response").that(Checker.check("4x4", clues, data)).isEqualTo({status:"Each cell should belong to exactly one area","errors": ["d4"]});
}),

test('Two circles in area',(suite) => {
  let clues = {"c1": "black_circle", "c4": "white_circle", "edges": {"a1-1": "huge_black_circle", "d2-2": "huge_white_circle"}, "nodes": {"a3-2": "huge_black_circle"} };
  let data = {"areas":[["a1","b1","a2","b2"],["d1","d2","d3","d4"],["c1","c2","c3","c4"],["a3","b3","a4","b4"]]};

  assert("Correct solution response").that(Checker.check("4x4", clues, data)).isEqualTo({status:"Each area should contain exactly one circle","errors":["c1","c2","c3","c4"]});
}),

test('Incorrect border',(suite) => {
  let clues = {"c1": "black_circle", "c4": "white_circle", "edges": {"a1-1": "huge_black_circle", "d2-2": "huge_white_circle"}, "nodes": {"a3-2": "huge_black_circle"} };
  let data = {"areas":[["a1","b1","a2","b2"],["c1","d1","c2","d2"],["d3","d4"],["c3","c4"],["a3","b3","a4","b4"]]};

  assert("Incorrect border response").that(Checker.check("4x4", clues, data)).isEqualTo({status:"Clues should be fully inside a single area","errors":["d2","d3"]});
}),
test('Black circle not in square',(suite) => {
  let clues = {"c1": "black_circle", "c4": "white_circle", "edges": {"a1-1": "huge_black_circle", "d2-2": "huge_white_circle"}, "nodes": {"a3-2": "huge_black_circle"} };
  let data = {"areas":[["a1","b1"],["c1"],["d1","d2","d3","d4"],["c2","c3","c4"],["a2","b2","a3","b3","a4","b4"]]};

  assert("Black circle not in square response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "Area with a black circle should be a square","errors":["a1","b1"]});
}),
test('White circle in square',(suite) => {
  let clues = {"c1": "white_circle", "c4": "white_circle", "edges": {"a1-1": "huge_black_circle", "d2-2": "huge_white_circle"}, "nodes": {"a3-2": "huge_black_circle"} };
  let data = {"areas":[["a1","b1","a2","b2"],["c1","c2","c3"],["d1","d2","d3","d4"],["c4"],["a3","b3","a4","b4"]]};

  assert("White circle in square response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "Area with a white circle should not be a square","errors":["c4"]});
}),
);

