sudokuXSumsTestSuite = testSuite("X Sums Sudoku",

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
    var puzzle = new sudokuPuzzleType(puzzleData, controls, settings);
    puzzle.render(Snap(suite.GRID_SELECTOR));
    return puzzle;
  };
  suite.mouseEvent = function(x, y) {
    return {clientX: x, clientY: y, preventDefault: ()=>{}};
  };
  module = {};
  requirejs(['puzzle_types/util.js', 'sudokupuzzle'], function() {
    window.util=Util;
    requirejs(['puzzle_types/sudoku_util.js'], function() {
      window.sudoku_util=SudokuUtil;
      requirejs.undef('puzzle_types/sudoku_x_sums.js');
      requirejs(['puzzle_types/sudoku_x_sums.js'], cb);
    });
  });
}),

after((suite)=> {
  Snap(suite.GRID_SELECTOR).clear();
}),

// Controller definition tests
test('Solver controllers',(suite) => {
  let puzzle = suite.showPuzzle(
    "sudoku_x_sums", "4x4",
    {"a1": "1", "bottom": [null,null,"2",null], "right": ["2",null,"1",null], "top": ["4",null,null,null], "left": [null,"3",null,null]}
  );
  puzzle.start();

  assert("Empty cell chooser").that(puzzle.cells[2][2].chooserValues).containsExactly([{},{text: '1', returnValue: '1'},{text: '2', returnValue: '2'},{text: '3', returnValue: '3'},{text: '4', returnValue: '4'}]);
  assert("Empty cell click").that(puzzle.cells[2][2].clickSwitch).isNull();
  assert("Clue cell chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("Clue cell click").that(puzzle.cells[0][0].clickSwitch).isNull();
  assert("Bottom clue chooser").that(puzzle.bottom[2].chooserValues).isNull();
  assert("Bottom clue click").that(puzzle.bottom[2].clickSwitch).containsExactly([{text: '2'}, {text: '2', image: 'white_circle'}]);
  assert("Right clue chooser").that(puzzle.right[0].chooserValues).isNull();
  assert("Right clue click").that(puzzle.right[0].clickSwitch).containsExactly([{text: '2'}, {text: '2', image: 'white_circle'}]);
  assert("Top clue chooser").that(puzzle.top[3].chooserValues).isNull();
  assert("Top clue click").that(puzzle.top[3].clickSwitch).containsExactly([{}, {image: 'white_circle'}]);
  assert("Left clue chooser").that(puzzle.left[1].chooserValues).isNull();
  assert("Left clue click").that(puzzle.left[1].clickSwitch).containsExactly([{text: '3'}, {text: '3', image: 'white_circle'}]);
  assert("Cell drag handler").that(puzzle.cells[2][2].drawDragHandler).isNull();
  assert("Cell drag processor").that(puzzle.cells[2][2].dragProcessor).isNull();
}),

test('Author controllers',(suite) => {
  let puzzle = suite.showPuzzle("sudoku_x_sums", "6x6");
  puzzle.edit();

  assert("Cell chooser").that(puzzle.cells[0][0].chooserValues).containsExactly([{},{text: '1', returnValue: '1'},{text: '2', returnValue: '2'},{text: '3', returnValue: '3'},{text: '4', returnValue: '4'},{text: '5', returnValue: '5'},{text: '6', returnValue: '6'}]);
  assert("Cell click").that(puzzle.cells[0][0].clickSwitch).isNull();
  assert("Bottom clue chooser").that(puzzle.bottom[0].chooserValues).containsAtLeast([{},{text: '1', returnValue: '1'},{text: '2', returnValue: '2'},{text: '3', returnValue: '3'},{text: '21', returnValue: '21'}]);
  assert("Bottom clue click").that(puzzle.bottom[0].clickSwitch).isNull();
  assert("Right clue chooser").that(puzzle.right[0].chooserValues).containsAtLeast([{},{text: '1', returnValue: '1'},{text: '2', returnValue: '2'},{text: '3', returnValue: '3'},{text: '21', returnValue: '21'}]);
  assert("Right clue click").that(puzzle.right[0].clickSwitch).isNull();
  assert("Top clue chooser").that(puzzle.top[0].chooserValues).containsAtLeast([{},{text: '1', returnValue: '1'},{text: '2', returnValue: '2'},{text: '3', returnValue: '3'},{text: '21', returnValue: '21'}]);
  assert("Top clue click").that(puzzle.top[0].clickSwitch).isNull();
  assert("Left clue chooser").that(puzzle.left[0].chooserValues).containsAtLeast([{},{text: '1', returnValue: '1'},{text: '2', returnValue: '2'},{text: '3', returnValue: '3'},{text: '21', returnValue: '21'}]);
  assert("Left clue click").that(puzzle.left[0].clickSwitch).isNull();
}),
// Mouse processing tests
test('Plus 10 chooser',(suite) => {
  let puzzle = suite.showPuzzle("sudoku_x_sums", "6x6");
  puzzle.edit();

  let x = puzzle.size.leftGap + puzzle.size.unitSize/2;
  let y = puzzle.size.topGap - puzzle.size.unitSize/2;

  assert("Cell value before click").that(puzzle.top[0].getValue()).isNull();
  assert("Chooser before click").that(puzzle.controller.chooserBuilder.chooserElements).isEmptyArray();

  puzzle.controller.onMouseDown(suite.mouseEvent(x, y));
  puzzle.controller.onMouseUp(suite.mouseEvent(x, y));

  assert("Chooser after click").that(puzzle.controller.chooserBuilder.chooserElements).isNonEmptyArray();
  assert("Chooser connected to the cell").that(puzzle.controller.chooserBuilder.element.col).isEqualTo(0);
  assert("Chooser connected to the cell").that(puzzle.controller.chooserBuilder.element.row).isEqualTo(-1);
  assert("Cell data after one click").that(puzzle.top[0].data).isEqualTo({});
  
  x += puzzle.chooserSize*0.42;
  y -= puzzle.chooserSize*0.66;
  puzzle.controller.onMouseDown(suite.mouseEvent(x, y));
  puzzle.controller.onMouseUp(suite.mouseEvent(x, y));

  assert("Chooser after click on 1").that(puzzle.controller.chooserBuilder.chooserElements).isEmptyArray();
  assert("Cell value after click on 1").that(puzzle.top[0].getValue()).isEqualTo("1");
  assert("Cell data after click on 1").that(puzzle.top[0].data).isEqualTo({text:"1", returnValue: "1"});

  x = puzzle.size.leftGap + puzzle.size.unitSize/2;
  y = puzzle.size.topGap - puzzle.size.unitSize/2;
  puzzle.controller.onMouseDown(suite.mouseEvent(x, y));
  puzzle.controller.onMouseUp(suite.mouseEvent(x, y));

  x -= puzzle.chooserSize*0.42;
  y -= puzzle.chooserSize*0.66;
  puzzle.controller.onMouseDown(suite.mouseEvent(x, y));
  puzzle.controller.onMouseUp(suite.mouseEvent(x, y));


  assert("Chooser after click on +10").that(puzzle.controller.chooserBuilder.chooserElements).isEmptyArray();
  assert("Cell value after click on +10").that(puzzle.top[0].getValue()).isEqualTo("11");
  assert("Cell data after click on +10").that(puzzle.top[0].data).isEqualTo({text:"11", returnValue: "11"});
}),


test('Process click to empty cell',(suite) => {
  let puzzle = suite.showPuzzle(
    "sudoku_x_sums", "4x4",
    {"bottom": [null,null,"2",null], "right": ["2",null,"1",null], "top": ["4",null,null,null], "left": [null,"3",null,null]}
  );
  puzzle.start();

  let x = puzzle.size.leftGap + puzzle.size.unitSize/2;
  let y = puzzle.size.topGap + puzzle.size.unitSize/2;

  assert("Cell value before click").that(puzzle.cells[0][0].getValue()).isNull();
  assert("Cell data before click").that(puzzle.cells[0][0].data).isEqualTo({});
  assert("Chooser before click").that(puzzle.controller.chooserBuilder.chooserElements).isEmptyArray();

  puzzle.controller.onMouseDown(suite.mouseEvent(x, y));
  puzzle.controller.onMouseUp(suite.mouseEvent(x, y));

  assert("Chooser after click").that(puzzle.controller.chooserBuilder.chooserElements).isNonEmptyArray();
  assert("Chooser connected to the cell").that(puzzle.controller.chooserBuilder.element.col).isEqualTo(0);
  assert("Chooser connected to the cell").that(puzzle.controller.chooserBuilder.element.row).isEqualTo(0);
  assert("Cell data after one click").that(puzzle.cells[0][0].data).isEqualTo({});

  x += puzzle.size.unitSize/2;
  puzzle.controller.onMouseDown(suite.mouseEvent(x, y));
  puzzle.controller.onMouseUp(suite.mouseEvent(x, y));

  assert("Chooser after click on value").that(puzzle.controller.chooserBuilder.chooserElements).isEmptyArray();
  assert("Cell value after two clicks").that(puzzle.cells[0][0].getValue()).isEqualTo("1");
  assert("Cell data after two clicks").that(puzzle.cells[0][0].data).isEqualTo({text:"1", returnValue: "1"});
}),

test('Choose value in one click',(suite) => {
  let puzzle = suite.showPuzzle(
    "sudoku_x_sums", "4x4",
    {"bottom": [null,null,"2",null], "right": ["2",null,"1",null], "top": ["4",null,null,null], "left": [null,"3",null,null]}
  );
  puzzle.start();

  let x = puzzle.size.leftGap + puzzle.size.unitSize/2;
  let y = puzzle.size.topGap + puzzle.size.unitSize/2;

  assert("Cell value before click").that(puzzle.cells[0][0].getValue()).isNull();
  assert("Cell data before click").that(puzzle.cells[0][0].data).isEqualTo({});
  assert("Chooser before click").that(puzzle.controller.chooserBuilder.chooserElements).isEmptyArray();

  puzzle.controller.onMouseDown(suite.mouseEvent(x, y));

  assert("Chooser after mouse down").that(puzzle.controller.chooserBuilder.chooserElements).isNonEmptyArray();
  assert("Chooser connected to the cell").that(puzzle.controller.chooserBuilder.element.col).isEqualTo(0);
  assert("Chooser connected to the cell").that(puzzle.controller.chooserBuilder.element.row).isEqualTo(0);
  assert("Cell data after mouse down").that(puzzle.cells[0][0].data).isEqualTo({});

  x += puzzle.size.unitSize/2;
  puzzle.controller.onMouseMove(suite.mouseEvent(x, y));
  puzzle.controller.onMouseUp(suite.mouseEvent(x, y));

  assert("Chooser after mouse up").that(puzzle.controller.chooserBuilder.chooserElements).isEmptyArray();
  assert("Cell value after mouse up").that(puzzle.cells[0][0].getValue()).isEqualTo("1");
  assert("Cell data after mouse up").that(puzzle.cells[0][0].data).isEqualTo({text:"1", returnValue: "1"});
}),

test('Process click to top clue',(suite) => {
  let puzzle = suite.showPuzzle(
    "sudoku_x_sums", "4x4",
    {"bottom": [null,null,"2",null], "right": ["2",null,"1",null], "top": ["4",null,null,null], "left": [null,"3",null,null]}
  );
  puzzle.start();

  let x = puzzle.size.leftGap + puzzle.size.unitSize/2;
  let y = puzzle.size.topGap - puzzle.size.unitSize + puzzle.size.unitSize/2;

  assert("Cell value before click").that(puzzle.top[0].getValue()).isNull();
  assert("Cell data before click").that(puzzle.top[0].data).isEqualTo({text: "4"});

  puzzle.controller.onMouseDown(suite.mouseEvent(x, y));
  puzzle.controller.onMouseUp(suite.mouseEvent(x, y));

  assert("Cell value after one click").that(puzzle.top[0].getValue()).isNull();
  assert("Cell data after one click").that(puzzle.top[0].data).isEqualTo({text: "4", image:"white_circle"});
}),

test('Process click to left clue',(suite) => {
  let puzzle = suite.showPuzzle(
    "sudoku_x_sums", "4x4",
    {"bottom": [null,null,"2",null], "right": ["2",null,"1",null], "top": ["4",null,null,null], "left": [null,"3",null,null]}
  );
  puzzle.start();

  let x = puzzle.size.leftGap - puzzle.size.unitSize + puzzle.size.unitSize/2;
  let y = puzzle.size.topGap + puzzle.size.unitSize/2;

  assert("Cell value before click").that(puzzle.left[0].getValue()).isNull();
  assert("Cell data before click").that(puzzle.left[0].data).isEqualTo({});

  puzzle.controller.onMouseDown(suite.mouseEvent(x, y));
  puzzle.controller.onMouseUp(suite.mouseEvent(x, y));

  assert("Cell value after one click").that(puzzle.left[0].getValue()).isNull();
  assert("Cell data after one click").that(puzzle.left[0].data).isEqualTo({image:"white_circle"});
}),

// Checker tests
test('Correct solution',(suite) => {
  let clues = {"bottom": [null,null,null,"6"], "right": ["10",null,null,null], "top": ["1",null,null,null], "left": [null,"6",null,null,null]};
  let data = {"a1": "1", "a2": "2", "a3": "3", "a4": "4", "b1": "3", "b2": "4", "b3": "1", "b4": "2", "c1": "2", "c2": "3","c3": "4", "c4": "1", "d1": "4", "d2": "1", "d3": "2", "d4": "3"}

  assert("Correct solution response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "OK"});
}),

test('Repeated digits in row',(suite) => {
  let clues = {"bottom": [null,null,null,"6"], "right": ["10",null,null,null], "top": ["1",null,null,null], "left": [null,"6",null,null]};
  let data = {"a1": "2", "a2": "2", "a3": "3", "a4": "4", "b1": "3", "b2": "4", "b3": "1", "b4": "2", "c1": "2", "c2": "3","c3": "4", "c4": "1", "d1": "4", "d2": "1", "d3": "2", "d4": "3"}

  assert("Repeated digits in row solution response").that(Checker.check("4x4", clues, data)).isEqualTo({status:"All digits should be exactly once in every row",errors:["a1","b1","c1","d1"]});
}),

test('Correct 6x6',(suite) => {
  let clues = {"bottom": [null,"5","12",null,"11",null], "right": [null,"9","17",null,"8",null], "top": [null,null,"11","7","12",null], "left": [null,"6","6","18",null,null]};
  let data = {"a1":"1","a2":"2","a3":"3","a4":"4","a5":"5","a6":"6", "b1":"5","b2":"4","b3":"1","b4":"6","b5":"3","b6":"2", "c1":"3","c2":"6","c3":"2","c4":"5","c5":"1","c6":"4", "d1":"2","d2":"5","d3":"6","d4":"3","d5":"4","d6":"1", "e1":"4","e2":"1","e3":"5","e4":"2","e5":"6","e6":"3", "f1":"6","f2":"3","f3":"4","f4":"1","f5":"2","f6":"5"}

  assert("Correct 6x6 solution response").that(Checker.check("6x6", clues, data)).isEqualTo({status:"OK"});
}),

test('Repeated digits in area',(suite) => {
  let clues = {"bottom": [null,null,"3",null,null,"2"], "right": ["1","3",null,"5",null,null], "top": ["6",null,null,null,"3",null], "left": [null,null,null,null,null,null]};
  let data = {"a1":"1","a2":"2","a3":"3","a4":"4","a5":"5","a6":"6", "b1":"5","b2":"4","b3":"1","b4":"6","b5":"3","b6":"2", "c1":"2","c2":"5","c3":"6","c4":"3","c5":"4","c6":"1", "d1":"3","d2":"6","d3":"2","d4":"5","d5":"1","d6":"4", "e1":"4","e2":"1","e3":"5","e4":"2","e5":"6","e6":"3", "f1":"6","f2":"3","f3":"4","f4":"1","f5":"2","f6":"5"}

  assert("Repeated digits in area solution response").that(Checker.check("6x6", clues, data)).isEqualTo({status:"All digits should be exactly once in every area",errors:["a1","a2","b1","b2","c1","c2"]});
}),

test('Wrong clue',(suite) => {
  let clues = {"bottom": [null,null,null,"2"], "right": ["1",null,null,null], "top": ["4",null,null,null], "left": [null,null,null,null]};
  let data = {"a1": "1", "a2": "2", "a3": "3", "a4": "4", "b1": "3", "b2": "4", "b3": "1", "b4": "2", "c1": "4", "c2": "3","c3": "2", "c4": "1", "d1": "2", "d2": "1", "d3": "4", "d4": "3"}

  assert("Wrong clue solution response").that(Checker.check("4x4", clues, data)).isEqualTo({status:"Wrong sum of the first digits in the row",errors:["a1","a2","a3","a4"]});
}),
);


