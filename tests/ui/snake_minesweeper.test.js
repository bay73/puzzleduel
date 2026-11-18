snakeMinesweeperTestSuite = uiTestSuite("Minesweeper snake", "squarepuzzle", "squarePuzzleType",

beforeSuite((suite, cb)=> {
  // Emulates a single mouse drag through the centers of the given cells.
  suite.dragThroughCells = function(puzzle, ...cells) {
    let points = cells.map(cell => suite.cellPoint(puzzle, cell));
    puzzle.controller.onMouseDown(suite.mouseEvent(points[0]));
    points.slice(1).forEach(point => puzzle.controller.onMouseMove(suite.mouseEvent(point)));
    puzzle.controller.onMouseUp(suite.mouseEvent(points[points.length - 1]));
  };
  cb();
}),

// Grid of the most of the tests: head and tail of the snake (#), numbers and a cell without snake (x).
//   . . # 1
//   . . x 3
//   . . . #
//   . . . .

// Controller definition tests
test('Solver controllers',(suite) => {
  let puzzle = suite.showPuzzle("snake_minesweeper", "4x4", {"c1": "black", "d1": "1", "c2": "cross", "d2": "3", "d3": "black"});
  puzzle.start();

  assert("Empty cell chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("Empty cell click").that(puzzle.cells[0][0].clickSwitch).containsExactly([{}, {color: puzzle.colorSchema.gridColor, returnValue: 'black'}, {image: 'cross'}]);
  assert("Empty cell drag handler").that(puzzle.cells[0][0].drawDragHandler).isNotNull();
  assert("Empty cell drag processor").that(puzzle.cells[0][0].dragProcessor).isNotNull();
  assert("Black cell data").that(puzzle.cells[0][2].data).isEqualTo({color: puzzle.colorSchema.clueColor});
  assert("Black cell chooser").that(puzzle.cells[0][2].chooserValues).isNull();
  assert("Black cell click").that(puzzle.cells[0][2].clickSwitch).isNull();
  assert("Black cell drag processor").that(puzzle.cells[0][2].dragProcessor).isNull();
  assert("Number cell data").that(puzzle.cells[0][3].data).isEqualTo({text: '1'});
  assert("Number cell chooser").that(puzzle.cells[0][3].chooserValues).isNull();
  assert("Number cell click").that(puzzle.cells[0][3].clickSwitch).isNull();
  assert("Number cell drag processor").that(puzzle.cells[0][3].dragProcessor).isNull();
  assert("Cross cell data").that(puzzle.cells[1][2].data).isEqualTo({image: 'cross'});
  assert("Cross cell chooser").that(puzzle.cells[1][2].chooserValues).isNull();
  assert("Cross cell click").that(puzzle.cells[1][2].clickSwitch).isNull();
  assert("Cross cell drag processor").that(puzzle.cells[1][2].dragProcessor).isNull();
}),

test('Author controllers',(suite) => {
  let puzzle = suite.showPuzzle("snake_minesweeper", "4x4");
  puzzle.edit();

  let numberItem = number => ({text: number, returnValue: number});
  assert("Cell chooser").that(puzzle.cells[0][0].chooserValues).containsExactly([
    {}, numberItem('0'), numberItem('1'), numberItem('2'), numberItem('3'), numberItem('4'),
    numberItem('5'), numberItem('6'), numberItem('7'), numberItem('8'),
    {image: 'cross', returnValue: 'cross'}, {color: puzzle.colorSchema.clueColor, returnValue: 'black'}]);
  assert("Cell click").that(puzzle.cells[0][0].clickSwitch).isNull();
  assert("Cell drag processor").that(puzzle.cells[0][0].dragProcessor).isNull();
}),

// Mouse processing tests
test('Process clicks to cell',(suite) => {
  let puzzle = suite.showPuzzle("snake_minesweeper", "4x4", {"c1": "black", "d1": "1", "c2": "cross", "d2": "3", "d3": "black"});
  puzzle.start();

  let cell = puzzle.cells[0][0];

  assert("Cell value before click").that(cell.getValue()).isNull();
  assert("Cell data before click").that(cell.data).isEqualTo({});

  suite.cellClick(puzzle, "a1");

  assert("Cell value after one click").that(cell.getValue()).isEqualTo("black");
  assert("Cell data after one click").that(cell.data).isEqualTo({color: puzzle.colorSchema.gridColor, returnValue: 'black'});
  assert("Submission data after one click").that(puzzle.collectData()).isEqualTo({"a1": "black"});

  suite.cellClick(puzzle, "a1");

  assert("Cell value after two clicks").that(cell.getValue()).isNull();
  assert("Cell data after two clicks").that(cell.data).isEqualTo({image: 'cross'});
  assert("Cross is not submitted").that(puzzle.collectData()).isEqualTo({});

  suite.cellClick(puzzle, "a1");

  assert("Cell value after three clicks").that(cell.getValue()).isNull();
  assert("Cell data after three clicks").that(cell.data).isEqualTo({});
}),

test('Clue cells are not changed by click',(suite) => {
  let puzzle = suite.showPuzzle("snake_minesweeper", "4x4", {"c1": "black", "d1": "1", "c2": "cross", "d2": "3", "d3": "black"});
  puzzle.start();

  ["c1", "d1", "c2"].forEach(cell => suite.cellClick(puzzle, cell));

  assert("Black cell data").that(puzzle.cells[0][2].data).isEqualTo({color: puzzle.colorSchema.clueColor});
  assert("Number cell data").that(puzzle.cells[0][3].data).isEqualTo({text: '1'});
  assert("Cross cell data").that(puzzle.cells[1][2].data).isEqualTo({image: 'cross'});
  assert("Submission data").that(puzzle.collectData()).isEqualTo({});
}),

test('Copy black cell by drag',(suite) => {
  let puzzle = suite.showPuzzle("snake_minesweeper", "4x4", {"c1": "black", "d1": "1", "c2": "cross", "d2": "3", "d3": "black"});
  puzzle.start();

  suite.cellClick(puzzle, "b1");

  let point = suite.cellPoint(puzzle, "b1");
  puzzle.controller.onMouseDown(suite.mouseEvent(point));
  point.down();
  puzzle.controller.onMouseMove(suite.mouseEvent(point));

  assert("Cell b2 value during drag").that(puzzle.cells[1][1].getValue()).isEqualTo("black");
  assert("Cell b3 value during drag").that(puzzle.cells[2][1].getValue()).isNull();

  point.down();
  puzzle.controller.onMouseMove(suite.mouseEvent(point));
  point.right();
  puzzle.controller.onMouseMove(suite.mouseEvent(point));
  puzzle.controller.onMouseUp(suite.mouseEvent(point));

  assert("Cell b1 data after drag").that(puzzle.cells[0][1].data).isEqualTo({color: puzzle.colorSchema.gridColor, returnValue: 'black'});
  assert("Cell b2 data after drag").that(puzzle.cells[1][1].data).isEqualTo({color: puzzle.colorSchema.gridColor, returnValue: 'black'});
  assert("Cell b3 data after drag").that(puzzle.cells[2][1].data).isEqualTo({color: puzzle.colorSchema.gridColor, returnValue: 'black'});
  assert("Cell c3 data after drag").that(puzzle.cells[2][2].data).isEqualTo({color: puzzle.colorSchema.gridColor, returnValue: 'black'});
  assert("Submission data after drag").that(puzzle.collectData()).isEqualTo({"b1": "black", "b2": "black", "b3": "black", "c3": "black"});
}),

test('Copy cross and empty cell by drag',(suite) => {
  let puzzle = suite.showPuzzle("snake_minesweeper", "4x4", {"c1": "black", "d1": "1", "c2": "cross", "d2": "3", "d3": "black"});
  puzzle.start();

  // Cross in a1, black cells a3 and a4.
  suite.cellClick(puzzle, "a1");
  suite.cellClick(puzzle, "a1");
  suite.cellClick(puzzle, "a3");
  suite.cellClick(puzzle, "a4");

  suite.dragThroughCells(puzzle, "a1", "a2");

  assert("Cell a2 data after drag of cross").that(puzzle.cells[1][0].data).isEqualTo({image: 'cross'});
  assert("Cell a2 value after drag of cross").that(puzzle.cells[1][0].getValue()).isNull();
  assert("Submission data after drag of cross").that(puzzle.collectData()).isEqualTo({"a3": "black", "a4": "black"});

  // Drag from the empty cell b3 clears the cells.
  suite.dragThroughCells(puzzle, "b3", "a3", "a4");

  assert("Cell a3 data after drag of empty cell").that(puzzle.cells[2][0].data).isEqualTo({});
  assert("Cell a4 data after drag of empty cell").that(puzzle.cells[3][0].data).isEqualTo({});
  assert("Submission data after drag of empty cell").that(puzzle.collectData()).isEqualTo({});
}),

test('Drag does not change clue cells',(suite) => {
  let puzzle = suite.showPuzzle("snake_minesweeper", "4x4", {"c1": "black", "d1": "1", "c2": "cross", "d2": "3", "d3": "black"});
  puzzle.start();

  // Black cell d4 is dragged up over the clues d3, d2 and d1.
  suite.cellClick(puzzle, "d4");
  suite.dragThroughCells(puzzle, "d4", "d3", "d2", "d1");

  assert("Black clue data").that(puzzle.cells[2][3].data).isEqualTo({color: puzzle.colorSchema.clueColor});
  assert("Number 3 data").that(puzzle.cells[1][3].data).isEqualTo({text: '3'});
  assert("Number 1 data").that(puzzle.cells[0][3].data).isEqualTo({text: '1'});

  // Black cell b2 is dragged over the cross clue c2.
  suite.cellClick(puzzle, "b2");
  suite.dragThroughCells(puzzle, "b2", "c2");

  assert("Cross clue data").that(puzzle.cells[1][2].data).isEqualTo({image: 'cross'});
  assert("Submission data").that(puzzle.collectData()).isEqualTo({"b2": "black", "d4": "black"});
}),

test('Clue cells are not copied by drag',(suite) => {
  let puzzle = suite.showPuzzle("snake_minesweeper", "4x4", {"c1": "black", "d1": "1", "c2": "cross", "d2": "3", "d3": "black"});
  puzzle.start();

  suite.dragThroughCells(puzzle, "c1", "b1");
  suite.dragThroughCells(puzzle, "c2", "b2");
  suite.dragThroughCells(puzzle, "d2", "d3", "d4");

  assert("Cell b1 data").that(puzzle.cells[0][1].data).isEqualTo({});
  assert("Cell b2 data").that(puzzle.cells[1][1].data).isEqualTo({});
  assert("Cell d4 data").that(puzzle.cells[3][3].data).isEqualTo({});
  assert("Submission data").that(puzzle.collectData()).isEqualTo({});
}),

// Data collector tests
test('Data collector',(suite) => {
  let puzzle = suite.showPuzzle("snake_minesweeper", "4x4", {"c1": "black", "d1": "1", "c2": "cross", "d2": "3", "d3": "black"});
  puzzle.start();

  // The snake c1-b1-b2-b3-c3-d3:
  //   . # # 1
  //   . # x 3
  //   . # # #
  //   . . . .
  suite.cellClick(puzzle, "b1");
  suite.cellClick(puzzle, "b2");
  suite.dragThroughCells(puzzle, "b2", "b3", "c3");
  // Cross is not submitted.
  suite.cellClick(puzzle, "a1");
  suite.cellClick(puzzle, "a1");

  assert("Submission data").that(puzzle.collectData()).isEqualTo({"b1": "black", "b2": "black", "b3": "black", "c3": "black"});
}),

test('Cell chooser for author',(suite) => {
  let puzzle = suite.showPuzzle("snake_minesweeper", "4x4");
  puzzle.edit();

  let cell = puzzle.cells[0][0];

  cell.switchOnChooser(1);

  assert("Cell value after number item").that(cell.getValue()).isEqualTo("0");
  assert("Cell data after number item").that(cell.data).isEqualTo({text: '0', returnValue: '0'});

  cell.switchOnChooser(10);

  assert("Cell value after cross item").that(cell.getValue()).isEqualTo("cross");
  assert("Cell data after cross item").that(cell.data).isEqualTo({image: 'cross', returnValue: 'cross'});

  cell.switchOnChooser(11);

  assert("Cell value after black item").that(cell.getValue()).isEqualTo("black");
  assert("Cell data after black item").that(cell.data).isEqualTo({color: puzzle.colorSchema.clueColor, returnValue: 'black'});

  cell.switchOnChooser(0);

  assert("Cell value after empty item").that(cell.getValue()).isNull();
  assert("Cell data after empty item").that(cell.data).isEqualTo({});
}),

test('Author data collector',(suite) => {
  let puzzle = suite.showPuzzle("snake_minesweeper", "4x4");
  puzzle.edit();

  puzzle.cells[0][2].switchOnChooser(11); // black c1
  puzzle.cells[0][3].switchOnChooser(2);  // 1 in d1
  puzzle.cells[1][2].switchOnChooser(10); // cross in c2
  puzzle.cells[1][3].switchOnChooser(4);  // 3 in d2
  puzzle.cells[2][3].switchOnChooser(11); // black d3
  // Cell a4 is set and cleared.
  puzzle.cells[3][0].switchOnChooser(9);
  puzzle.cells[3][0].switchOnChooser(0);

  assert("Puzzle data").that(puzzle.collectData()).isEqualTo({"c1": "black", "d1": "1", "c2": "cross", "d2": "3", "d3": "black"});
}),

);
