foseruzuTestSuite = testSuite("Foseruzu",

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
  };
  requirejs(["areapuzzle"], cb);
}),

after((suite)=> {
  Snap(suite.GRID_SELECTOR).clear();
}),

test('Solver controllers',(suite) => {
  let puzzle = suite.showPuzzle(
    "foseruzu", "4x4", {"a2": "1", "b2": "3", "b3": "2"});
  puzzle.start();

  assert("Cell chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("Cell click").that(puzzle.cells[0][0].clickSwitch).isNull();
  assert("Edge chooser").that(puzzle.edges[0][0][1].chooserValues).isNull();
  assert("Edge click").that(puzzle.edges[0][0][1].clickSwitch).containsExactly([{}, {color: puzzle.colorSchema.gridColor, returnValue: 'bold'}]);
  assert("Edge drag").that(puzzle.edges[0][0][1].dragSwitch).containsExactly([{}, {color: puzzle.colorSchema.gridColor, returnValue: 'bold'}]);
  assert("Connector drag").that(puzzle.connectors[0][0]['v'].dragSwitch).containsExactly([{}, {color: puzzle.colorSchema.lineColor, returnValue: 'line'}]);
}),

test('Author contorllers',(suite) => {
  let puzzle = suite.showPuzzle("foseruzu", "4x4");
  puzzle.edit();

  assert("Cell chooser").that(puzzle.cells[0][0].chooserValues).containsExactly([{},{text: '0', returnValue: '0'},{text: '1', returnValue: '1'},{text: '2', returnValue: '2'},{text: '3', returnValue: '3'}]);
  assert("Cell click").that(puzzle.cells[0][0].clickSwitch).isNull();
  assert("Edge chooser").that(puzzle.edges[0][0][1].chooserValues).isNull();
  assert("Edge click").that(puzzle.edges[0][0][1].clickSwitch).isNull();
  assert("Edge drag").that(puzzle.edges[0][0][1].dragSwitch).isNull();
  assert("Connector drag").that(puzzle.connectors[0][0]['v'].dragSwitch).isNull();
}),
// Mouse processing tests
test('Process click to edge',(suite) => {
  let puzzle = suite.showPuzzle(
    "foseruzu", "4x4", {"a2": "1", "b2": "3", "b3": "2"});
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
    "foseruzu", "4x4", {"a2": "1", "b2": "3", "b3": "2"});
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
    "foseruzu", "4x4", {"a2": "1", "b2": "3", "b3": "2"});
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
    "foseruzu", "4x4", {"a2": "1", "b2": "3", "b3": "2"});
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

);

