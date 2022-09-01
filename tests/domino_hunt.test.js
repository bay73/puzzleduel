dominoHuntTestSuite = testSuite("Domino hunt",

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
    var puzzle = new dominoType(puzzleData, controls, settings);
    puzzle.render(Snap(suite.GRID_SELECTOR));
    return puzzle;
  }
  suite.mouseEvent = function(x, y) {
    return {clientX: x, clientY: y, preventDefault: ()=>{}};
  }
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
  }
  requirejs(["areapuzzle"], cb);
}),

after((suite)=> {
  Snap(suite.GRID_SELECTOR).clear();
}),

test('Solvers controllers',(suite) => {
  let puzzle = suite.showPuzzle(
    "domino_hunt", "4x4-123",
    {"a1": "1", "a2": "1", "a3": "1", "a4": "1", "b1": "2", "b2": "black", "b3": "black", "b4": "3", "c1": "2", "c2": "black", "c3": "black", "c4": "3", "d1": "2", "d2": "2", "d3": "3", "d4": "3"}
  );
  puzzle.start();

  assert("Cell chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("Cell click").that(puzzle.cells[0][0].clickSwitch).isNull();
  assert("Edge chooser").that(puzzle.edges[0][0][1].chooserValues).isNull();
  assert("Edge click").that(puzzle.edges[0][0][1].clickSwitch).containsExactly([{}, {color: puzzle.colorSchema.gridColor, returnValue: '1'}]);
  assert("Edge drag").that(puzzle.edges[0][0][1].dragSwitch).containsExactly([{}, {color: puzzle.colorSchema.gridColor, returnValue: '1'}]);
  assert("Connector drag").that(puzzle.connectors[0][0]['v'].dragSwitch).containsExactly([{}, {color: puzzle.colorSchema.greyColor, returnValue: '1'}]);
}),

test('Author controllers',(suite) => {
  let puzzle = suite.showPuzzle("domino_hunt", "4x4-123");
  puzzle.edit();

  assert("Cell chooser").that(puzzle.cells[0][0].chooserValues).containsExactly([{},{color: puzzle.colorSchema.gridColor, returnValue: 'black'},{text: '1', returnValue: '1'},{text: '2', returnValue: '2'},{text: '3', returnValue: '3'}]);
  assert("Cell click").that(puzzle.cells[0][0].clickSwitch).isNull();
  assert("Edge chooser").that(puzzle.edges[0][0][1].chooserValues).isNull();
  assert("Edge click").that(puzzle.edges[0][0][1].clickSwitch).isNull();
  assert("Edge drag").that(puzzle.edges[0][0][1].dragSwitch).isNull();
  assert("Connector drag").that(puzzle.connectors[0][0]['v'].dragSwitch).isNull();
}),

test('Automatic edges for connector',(suite) => {
  let puzzle = suite.showPuzzle(
    "domino_hunt", "4x4-123",
    {"a1": "1", "a2": "1", "a3": "1", "a4": "1", "b1": "2", "b2": "black", "b3": "black", "b4": "3", "c1": "2", "c2": "black", "c3": "black", "c4": "3", "d1": "2", "d2": "2", "d3": "3", "d4": "3"}
  );
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

  assert("Connector value after drag end").that(puzzle.connectors[0][0]['h'].getValue()).isEqualTo("1");
  assert("Connector data after drag end").that(puzzle.connectors[0][0]['h'].data).isEqualTo({color: puzzle.colorSchema.greyColor, returnValue: '1'});

  assert("Edge a1/a2 value after connector").that(puzzle.edges[0][0][2].getValue()).isEqualTo("1");
  assert("Edge a1/a2 data after connector").that(puzzle.edges[0][0][2].data).isEqualTo({color:puzzle.colorSchema.greyColor});

  assert("Edge b1/b2 value after connector").that(puzzle.edges[0][1][2].getValue()).isEqualTo("1");
  assert("Edge b1/b2 data after connector").that(puzzle.edges[0][1][2].data).isEqualTo({color:puzzle.colorSchema.greyColor});

  assert("Edge b1/c1 value after connector").that(puzzle.edges[0][1][1].getValue()).isEqualTo("1");
  assert("Edge b1/c1 data after connector").that(puzzle.edges[0][1][1].data).isEqualTo({color:puzzle.colorSchema.greyColor});

  assert("Submission data").that(puzzle.collectData().areas).containsExactly([["a1","b1"],["c1","d1","a2","d2","a3","d3","a4","b4","c4","d4"],["b2"],["c2"],["b3"],["c3"]]);
}),
test('Submission data',(suite) => {
  let puzzle = suite.showPuzzle(
    "domino_hunt", "4x4-123",
    {"a1": "1", "a2": "1", "a3": "1", "a4": "1", "b1": "2", "b2": "black", "b3": "black", "b4": "3", "c1": "2", "c2": "black", "c3": "black", "c4": "3", "d1": "2", "d2": "2", "d3": "3", "d4": "3"}
  );
  puzzle.start();

  suite.edgeClick(puzzle, "a1-1");
  suite.edgeClick(puzzle, "a2-2");
  suite.edgeClick(puzzle, "c1-1");
  suite.edgeClick(puzzle, "d2-2");
  suite.edgeClick(puzzle, "a3-2");
  suite.edgeClick(puzzle, "a3-2");
  suite.edgeClick(puzzle, "a4-1");
  suite.edgeClick(puzzle, "c4-1");

  assert("Submission data").that(puzzle.collectData().areas).containsExactly([["a1","a2"],["b1","c1"],["d1","d2"],["a3","a4"],["b4","c4"],["d3","d4"],["b2"],["c2"],["b3"],["c3"]]);
}),

);

