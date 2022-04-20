GRID_SELECTOR = "#mainGrid";

mouseTestSuite = testSuite("Mouse event processing",

beforeSuite((cb)=> {
  if (!$(GRID_SELECTOR).length) {
    throw "Missing " + GRID_SELECTOR + " element"
  };
  showMousePuzzle = function(type, dimension, data) {
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
    puzzle.render(Snap(GRID_SELECTOR));
    return puzzle;
  }
  createMouseEvent = function(x, y) {
    return {clientX: x, clientY: y, preventDefault: ()=>{}};
  }
  requirejs(["squarepuzzle"], cb);
}),

after(()=> {
  Snap(GRID_SELECTOR).clear();
}),

test('Process click to empty cell',() => {
  let puzzle = showMousePuzzle("yin_yang_classic", "4x4",{"b1": "white_circle", "a2": "black_circle"});
  puzzle.start();
  
  let x = puzzle.size.leftGap + puzzle.size.unitSize/2;
  let y = puzzle.size.topGap + puzzle.size.unitSize/2;

  assert("Cell value before click").that(puzzle.cells[0][0].getValue()).isNull();
  assert("Cell data before click").that(puzzle.cells[0][0].data).isEqualTo({});

  puzzle.controller.onMouseDown(createMouseEvent(x, y));
  puzzle.controller.onMouseUp(createMouseEvent(x, y));
  
  assert("Cell value after one click").that(puzzle.cells[0][0].getValue()).isEqualTo("black_circle");
  assert("Cell data after one click").that(puzzle.cells[0][0].data).isEqualTo({image:"black_circle", returnValue:"black_circle"});

  puzzle.controller.onMouseDown(createMouseEvent(x, y));
  puzzle.controller.onMouseUp(createMouseEvent(x, y));
  
  assert("Cell value after two clicks").that(puzzle.cells[0][0].getValue()).isEqualTo("white_circle");
  assert("Cell data after two clicks").that(puzzle.cells[0][0].data).isEqualTo({image:"white_circle", returnValue:"white_circle"});

  puzzle.controller.onMouseDown(createMouseEvent(x, y));
  puzzle.controller.onMouseUp(createMouseEvent(x, y));
  
  assert("Cell value after three clicks").that(puzzle.cells[0][0].getValue()).isNull();
  assert("Cell data after three clicks").that(puzzle.cells[0][0].data).isEqualTo({});
}),

test('Process click to clue cell',() => {
  let puzzle = showMousePuzzle("yin_yang_classic", "4x4",{"b1": "white_circle", "a2": "black_circle"});
  puzzle.start();
  
  let x = puzzle.size.leftGap + puzzle.size.unitSize + puzzle.size.unitSize/2;
  let y = puzzle.size.topGap + puzzle.size.unitSize/2;

  assert("Cell value before click").that(puzzle.cells[0][0].getValue()).isNull();
  assert("Cell data before click").that(puzzle.cells[0][0].data).isEqualTo({});

  puzzle.controller.onMouseDown(createMouseEvent(x, y));
  puzzle.controller.onMouseUp(createMouseEvent(x, y));
  
  assert("Cell value after one click").that(puzzle.cells[0][0].getValue()).isNull();
  assert("Cell data after one click").that(puzzle.cells[0][0].data).isEqualTo({});
}),

test('Process click after small move',() => {
  let puzzle = showMousePuzzle("yin_yang_classic", "4x4",{"b1": "white_circle", "a2": "black_circle"});
  puzzle.start();
  
  let x = puzzle.size.leftGap + puzzle.size.unitSize/2;
  let y = puzzle.size.topGap + puzzle.size.unitSize/2;

  assert("Cell value before click").that(puzzle.cells[0][0].getValue()).isNull();

  puzzle.controller.onMouseDown(createMouseEvent(x, y));
  x += puzzle.size.unitSize/10;
  puzzle.controller.onMouseMove(createMouseEvent(x, y));
  puzzle.controller.onMouseUp(createMouseEvent(x, y));
  
  assert("Cell value after one click").that(puzzle.cells[0][0].getValue()).isEqualTo("black_circle");
}),

test('Process click after move to another cell',() => {
  let puzzle = showMousePuzzle("yin_yang_classic", "4x4",{"b1": "white_circle", "a2": "black_circle"});
  puzzle.start();
  
  let x = puzzle.size.leftGap + puzzle.size.unitSize/2;
  let y = puzzle.size.topGap + puzzle.size.unitSize/2;

  assert("Cell value before click").that(puzzle.cells[0][0].getValue()).isNull();

  puzzle.controller.onMouseDown(createMouseEvent(x, y));
  x += puzzle.size.unitSize;
  puzzle.controller.onMouseMove(createMouseEvent(x, y));
  puzzle.controller.onMouseUp(createMouseEvent(x, y));
  
  assert("Cell value after one click").that(puzzle.cells[0][0].getValue()).isNull();
}),

test('Process click on edge',() => {
  let puzzle = showMousePuzzle("fence", "4x4",{"b1": "0", "a2": "3"});
  puzzle.start();
  
  let x = puzzle.size.leftGap + puzzle.size.unitSize/2;
  let y = puzzle.size.topGap;

  assert("Edge value before click").that(puzzle.edges[0][0][0].getValue()).isNull();
  assert("Edge data before click").that(puzzle.edges[0][0][0].data).isEqualTo({});

  puzzle.controller.onMouseDown(createMouseEvent(x, y));
  puzzle.controller.onMouseUp(createMouseEvent(x, y));
  
  assert("Edge value after one click").that(puzzle.edges[0][0][0].getValue()).isEqualTo(1);
  assert("Edge data after one click").that(puzzle.edges[0][0][0].data).isEqualTo({color: puzzle.colorSchema.lineColor, returnValue:1});

  puzzle.controller.onMouseDown(createMouseEvent(x, y));
  puzzle.controller.onMouseUp(createMouseEvent(x, y));
  
  assert("Edge value after two clicks").that(puzzle.edges[0][0][0].getValue()).isNull();
  assert("Edge data after two clicks").that(puzzle.edges[0][0][0].data).isEqualTo({image: "cross"});

  puzzle.controller.onMouseDown(createMouseEvent(x, y));
  puzzle.controller.onMouseUp(createMouseEvent(x, y));
  
  assert("Edge value after three clicks").that(puzzle.edges[0][0][0].getValue()).isNull();
  assert("Edge data after three clicks").that(puzzle.edges[0][0][0].data).isEqualTo({});
}),

test('Process drag on edge',() => {
  let puzzle = showMousePuzzle("fence", "4x4",{"b1": "0", "a2": "3"});
  puzzle.start();
  
  let x = puzzle.size.leftGap;
  let y = puzzle.size.topGap;

  assert("Edge value before click").that(puzzle.edges[0][0][0].getValue()).isNull();
  assert("Edge data before click").that(puzzle.edges[0][0][0].data).isEqualTo({});

  puzzle.controller.onMouseDown(createMouseEvent(x, y));
  x += puzzle.size.unitSize;
  puzzle.controller.onMouseMove(createMouseEvent(x, y));
  
  assert("Edge value after drag").that(puzzle.edges[0][0][0].getValue()).isEqualTo(1);
  assert("Edge data after drag").that(puzzle.edges[0][0][0].data).isEqualTo({color: puzzle.colorSchema.lineColor});

  x -= puzzle.size.unitSize;
  puzzle.controller.onMouseMove(createMouseEvent(x, y));
  
  assert("Edge value after back drag").that(puzzle.edges[0][0][0].getValue()).isNull();
  assert("Edge data after back drag").that(puzzle.edges[0][0][0].data).isEqualTo({});

}),

test('Process drag on connector',() => {
  let puzzle = showMousePuzzle("railroad", "4x4",{"b1": "1", "b3": "+", "c3": "+"});
  puzzle.start();
  
  let x = puzzle.size.leftGap + puzzle.size.unitSize/2;
  let y = puzzle.size.topGap + puzzle.size.unitSize/2;

  assert("Connector value before click").that(puzzle.connectors[0][0]['h'].getValue()).isNull();
  assert("Connector data before click").that(puzzle.connectors[0][0]['h'].data).isEqualTo({});

  puzzle.controller.onMouseDown(createMouseEvent(x, y));
  x += puzzle.size.unitSize;
  puzzle.controller.onMouseMove(createMouseEvent(x, y));
  
  assert("Connector value after drag").that(puzzle.connectors[0][0]['h'].getValue()).isEqualTo(1);
  assert("Connector data after drag").that(puzzle.connectors[0][0]['h'].data).isEqualTo({color: puzzle.colorSchema.lineColor, returnValue:1});

  x -= puzzle.size.unitSize;
  puzzle.controller.onMouseMove(createMouseEvent(x, y));
  
  assert("Connector value after back drag").that(puzzle.connectors[0][0]['h'].getValue()).isNull();
  assert("Connector data after back drag").that(puzzle.connectors[0][0]['h'].data).isEqualTo({});

}),

test('Process click on connector',() => {
  let puzzle = showMousePuzzle("railroad", "4x4",{"b1": "1", "b3": "+", "c3": "+"});
  puzzle.start();
  
  let x = puzzle.size.leftGap + puzzle.size.unitSize;
  let y = puzzle.size.topGap + puzzle.size.unitSize/2;

  assert("Connector value before click").that(puzzle.connectors[0][0]['h'].getValue()).isNull();
  assert("Connector data before click").that(puzzle.connectors[0][0]['h'].data).isEqualTo({});

  puzzle.controller.onMouseDown(createMouseEvent(x, y));
  puzzle.controller.onMouseUp(createMouseEvent(x, y));
  
  assert("Connector value after click").that(puzzle.connectors[0][0]['h'].getValue()).isNull();
  assert("Connector data after click").that(puzzle.connectors[0][0]['h'].data).isEqualTo({});
}),

// end "Mouse event processing" test suite
);

