submissionSquareDataTestSuite = testSuite("Submission data for square puzzle",

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
  suite.cellClick = function(puzzle, cell) {
    var size = puzzle.size.unitSize;
    var x = puzzle.size.leftGap + size/2 + size*(cell.charCodeAt(0) - 'a'.charCodeAt(0));
    var y = puzzle.size.topGap + size/2 + size*(parseInt(cell.substring(1)) - 1);
    puzzle.controller.onMouseDown(suite.mouseEvent(x, y));
    puzzle.controller.onMouseUp(suite.mouseEvent(x, y));
  }
  requirejs(["squarepuzzle"], cb);
}),

after((suite)=> {
  Snap(suite.GRID_SELECTOR).clear();
}),

test('Yin yang',(suite) => {
  let puzzle = suite.showPuzzle("yin_yang_classic", "4x4",{"b1": "white_circle", "a2": "black_circle"});
  puzzle.start();

  suite.cellClick(puzzle, "a1");
  suite.cellClick(puzzle, "b1");
  suite.cellClick(puzzle, "b2");
  suite.cellClick(puzzle, "b2");
  suite.cellClick(puzzle, "c2");

  assert("Submission data after five clicks").that(puzzle.collectData()).isEqualTo({"a1": "black_circle", "b2": "white_circle", "c2": "black_circle"});
}),

// end "Submission data for square puzzle" test suite
);

submissionAreaDataTestSuite = testSuite("Submission data for area puzzle",

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

    var x = puzzle.size.leftGap + size*col + (side==1?size:(size==3?0:size/2));
    var y = puzzle.size.topGap + size*row + (side==2?size:(size==0?0:size/2));;
    puzzle.controller.onMouseDown(suite.mouseEvent(x, y));
    puzzle.controller.onMouseUp(suite.mouseEvent(x, y));
  }
  requirejs(["areapuzzle"], cb);
}),

after((suite)=> {
  Snap(suite.GRID_SELECTOR).clear();
}),

test('Domino Hunt',(suite) => {
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

// end "Submission data for area puzzle" test suite
);

