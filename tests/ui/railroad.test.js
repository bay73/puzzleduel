railroadTestSuite = testSuite("Railroad",

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
  }
  suite.mouseEvent = function(x, y) {
    return {clientX: x, clientY: y, preventDefault: ()=>{}};
  }
  requirejs(["squarepuzzle"], cb);
}),

after((suite)=> {
  Snap(suite.GRID_SELECTOR).clear();
}),

test('Process drag on connector',(suite) => {
  let puzzle = suite.showPuzzle("railroad", "4x4",{"b1": "1", "b3": "+", "c3": "+"});
  puzzle.start();

  let x = puzzle.size.leftGap + puzzle.size.unitSize/2;
  let y = puzzle.size.topGap + puzzle.size.unitSize/2;

  assert("Connector value before click").that(puzzle.connectors[0][0]['h'].getValue()).isNull();
  assert("Connector data before click").that(puzzle.connectors[0][0]['h'].data).isEqualTo({});

  puzzle.controller.onMouseDown(suite.mouseEvent(x, y));
  x += puzzle.size.unitSize;
  puzzle.controller.onMouseMove(suite.mouseEvent(x, y));

  assert("Connector value after drag").that(puzzle.connectors[0][0]['h'].getValue()).isEqualTo(1);
  assert("Connector data after drag").that(puzzle.connectors[0][0]['h'].data).isEqualTo({color: puzzle.colorSchema.lineColor, returnValue:1});

  x -= puzzle.size.unitSize;
  puzzle.controller.onMouseMove(suite.mouseEvent(x, y));

  assert("Connector value after back drag").that(puzzle.connectors[0][0]['h'].getValue()).isNull();
  assert("Connector data after back drag").that(puzzle.connectors[0][0]['h'].data).isEqualTo({});
}),

test('Process click on connector',(suite) => {
  let puzzle = suite.showPuzzle("railroad", "4x4",{"b1": "1", "b3": "+", "c3": "+"});
  puzzle.start();

  let x = puzzle.size.leftGap + puzzle.size.unitSize;
  let y = puzzle.size.topGap + puzzle.size.unitSize/2;

  assert("Connector value before click").that(puzzle.connectors[0][0]['h'].getValue()).isNull();
  assert("Connector data before click").that(puzzle.connectors[0][0]['h'].data).isEqualTo({});

  puzzle.controller.onMouseDown(suite.mouseEvent(x, y));
  puzzle.controller.onMouseUp(suite.mouseEvent(x, y));

  assert("Connector value after click").that(puzzle.connectors[0][0]['h'].getValue()).isNull();
  assert("Connector data after click").that(puzzle.connectors[0][0]['h'].data).isEqualTo({});
}),

test('Drag handler path',(suite) => {
  let puzzle = suite.showPuzzle("railroad", "4x4",{"b1": "1", "b3": "+", "c3": "+"});
  puzzle.start();

  let startX = puzzle.size.leftGap + puzzle.size.unitSize/2;
  let startY = puzzle.size.topGap + puzzle.size.unitSize/2;
  let x = startX;
  let y = startY;

  puzzle.controller.onMouseDown(suite.mouseEvent(x, y));
  x += puzzle.size.unitSize/4;
  puzzle.controller.onMouseMove(suite.mouseEvent(x, y));

  let path = puzzle.controller.dragHandler.path;
  assert("Drag path after first move").that(path).isNotNull();

  assert("Drag path type after first move").that(path.type).isEqualTo("line");
  assert("Drag path color after first move").that(path.toJSON().attr.stroke).isEqualTo(puzzle.colorSchema.traceColor);
  assert("Drag path start x after first move").that(path.toJSON().attr.x1).isAlmostEqualTo(startX);
  assert("Drag path end x after first move").that(path.toJSON().attr.x2).isAlmostEqualTo(x);
  assert("Drag path start y after first move").that(path.toJSON().attr.y1).isAlmostEqualTo(startY);
  assert("Drag path end y after first move").that(path.toJSON().attr.y2).isAlmostEqualTo(y);
  x += puzzle.size.unitSize/4;

  puzzle.controller.onMouseMove(suite.mouseEvent(x, y));

  path = puzzle.controller.dragHandler.path;
  assert("Drag path after second move").that(path).isNotNull();

  assert("Drag path type after second move").that(path.type).isEqualTo("line");
  assert("Drag path color after second move").that(path.toJSON().attr.stroke).isEqualTo(puzzle.colorSchema.traceColor);
  assert("Drag path start x after second move").that(path.toJSON().attr.x1).isAlmostEqualTo(startX);
  assert("Drag path end x after second move").that(path.toJSON().attr.x2).isAlmostEqualTo(x);
  assert("Drag path start y after second move").that(path.toJSON().attr.y1).isAlmostEqualTo(startY);
  assert("Drag path end y after second move").that(path.toJSON().attr.y2).isAlmostEqualTo(y);
}),
);

