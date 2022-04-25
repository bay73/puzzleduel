mouseTestSuite = testSuite("Mouse event processing",

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

// end "Mouse event processing" test suite
);

