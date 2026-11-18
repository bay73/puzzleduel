snakeStripedTestSuite = uiTestSuite("Striped snake", "squarepuzzle", "squarePuzzleType",

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

// Grid of the most of the tests: head and tail of the snake (#), a cell without snake (x),
// clues below and to the right of the grid.
//   . . # . 1
//   . . . . 1
//   . . . # 1
//   x . . . 0
//         1

// Controller definition tests
test('Solver controllers',(suite) => {
  let puzzle = suite.showPuzzle(
    "snake_striped", "4x4",
    {"c1": "black", "d3": "black", "a4": "cross", "bottom": [null, null, null, "1"], "right": ["1", "1", "1", "0"]}
  );
  puzzle.start();

  assert("Empty cell chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  // The snake is painted with two alternating colors, both of them are submitted as black.
  assert("Empty cell click").that(puzzle.cells[0][0].clickSwitch).containsExactly([
    {},
    {color: puzzle.colorSchema.gridColor, returnValue: 'black'},
    {color: puzzle.colorSchema.brightColor, returnValue: 'black'},
    {image: 'cross'}]);
  assert("Empty cell drag handler").that(puzzle.cells[0][0].drawDragHandler).isNotNull();
  assert("Empty cell drag processor").that(puzzle.cells[0][0].dragProcessor).isNotNull();
  assert("Black cell data").that(puzzle.cells[0][2].data).isEqualTo({color: puzzle.colorSchema.clueColor});
  assert("Black cell chooser").that(puzzle.cells[0][2].chooserValues).isNull();
  assert("Black cell click").that(puzzle.cells[0][2].clickSwitch).isNull();
  assert("Black cell drag processor").that(puzzle.cells[0][2].dragProcessor).isNull();
  assert("Cross cell data").that(puzzle.cells[3][0].data).isEqualTo({image: 'cross'});
  assert("Cross cell chooser").that(puzzle.cells[3][0].chooserValues).isNull();
  assert("Cross cell click").that(puzzle.cells[3][0].clickSwitch).isNull();
  assert("Cross cell drag processor").that(puzzle.cells[3][0].dragProcessor).isNull();
  assert("Bottom clue data").that(puzzle.bottom[3].data).isEqualTo({text: '1'});
  assert("Bottom clue chooser").that(puzzle.bottom[3].chooserValues).isNull();
  assert("Bottom clue click").that(puzzle.bottom[3].clickSwitch).containsExactly([{text: '1'}, {text: '1', image: 'white_circle'}]);
  assert("Right clue data").that(puzzle.right[3].data).isEqualTo({text: '0'});
  assert("Right clue chooser").that(puzzle.right[3].chooserValues).isNull();
  assert("Right clue click").that(puzzle.right[3].clickSwitch).containsExactly([{text: '0'}, {text: '0', image: 'white_circle'}]);
}),

test('Author controllers',(suite) => {
  let puzzle = suite.showPuzzle("snake_striped", "4x4");
  puzzle.edit();

  let numberItem = number => ({text: number, returnValue: number});
  assert("Cell chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("Cell click").that(puzzle.cells[0][0].clickSwitch).containsExactly([{}, {image: 'cross', returnValue: 'cross'}, {color: puzzle.colorSchema.clueColor, returnValue: 'black'}]);
  assert("Cell drag processor").that(puzzle.cells[0][0].dragProcessor).isNull();
  // No more than a half of the cells of a row can be of one color.
  assert("Bottom clue chooser").that(puzzle.bottom[0].chooserValues).containsExactly([{}, numberItem('0'), numberItem('1'), numberItem('2')]);
  assert("Bottom clue click").that(puzzle.bottom[0].clickSwitch).isNull();
  assert("Right clue chooser").that(puzzle.right[0].chooserValues).containsExactly([{}, numberItem('0'), numberItem('1'), numberItem('2')]);
  assert("Right clue click").that(puzzle.right[0].clickSwitch).isNull();
}),

test('Author controllers for odd size',(suite) => {
  let puzzle = suite.showPuzzle("snake_striped", "5x5");
  puzzle.edit();

  let numberItem = number => ({text: number, returnValue: number});
  // Three of five cells can be of one color.
  assert("Bottom clue chooser").that(puzzle.bottom[0].chooserValues).containsExactly([{}, numberItem('0'), numberItem('1'), numberItem('2'), numberItem('3')]);
  assert("Right clue chooser").that(puzzle.right[0].chooserValues).containsExactly([{}, numberItem('0'), numberItem('1'), numberItem('2'), numberItem('3')]);
}),

// Mouse processing tests
test('Process clicks to cell',(suite) => {
  let puzzle = suite.showPuzzle("snake_striped", "4x4", {"c1": "black", "d3": "black", "a4": "cross", "bottom": [null, null, null, "1"], "right": ["1", "1", "1", "0"]});
  puzzle.start();

  let cell = puzzle.cells[0][0];

  assert("Cell value before click").that(cell.getValue()).isNull();
  assert("Cell data before click").that(cell.data).isEqualTo({});

  suite.cellClick(puzzle, "a1");

  assert("Cell value after one click").that(cell.getValue()).isEqualTo("black");
  assert("Cell data after one click").that(cell.data).isEqualTo({color: puzzle.colorSchema.gridColor, returnValue: 'black'});

  suite.cellClick(puzzle, "a1");

  assert("Cell value after two clicks").that(cell.getValue()).isEqualTo("black");
  assert("Cell data after two clicks").that(cell.data).isEqualTo({color: puzzle.colorSchema.brightColor, returnValue: 'black'});
  assert("Submission data after two clicks").that(puzzle.collectData()).isEqualTo({"a1": "black"});

  suite.cellClick(puzzle, "a1");

  assert("Cell value after three clicks").that(cell.getValue()).isNull();
  assert("Cell data after three clicks").that(cell.data).isEqualTo({image: 'cross'});
  assert("Cross is not submitted").that(puzzle.collectData()).isEqualTo({});

  suite.cellClick(puzzle, "a1");

  assert("Cell value after four clicks").that(cell.getValue()).isNull();
  assert("Cell data after four clicks").that(cell.data).isEqualTo({});
}),

test('Clue cells are not changed by click',(suite) => {
  let puzzle = suite.showPuzzle("snake_striped", "4x4", {"c1": "black", "d3": "black", "a4": "cross", "bottom": [null, null, null, "1"], "right": ["1", "1", "1", "0"]});
  puzzle.start();

  suite.cellClick(puzzle, "c1");
  suite.cellClick(puzzle, "a4");

  assert("Black cell data").that(puzzle.cells[0][2].data).isEqualTo({color: puzzle.colorSchema.clueColor});
  assert("Cross cell data").that(puzzle.cells[3][0].data).isEqualTo({image: 'cross'});
  assert("Submission data").that(puzzle.collectData()).isEqualTo({});
}),

test('Process clicks to outer clues',(suite) => {
  let puzzle = suite.showPuzzle("snake_striped", "4x4", {"c1": "black", "d3": "black", "a4": "cross", "bottom": [null, null, null, "1"], "right": ["1", "1", "1", "0"]});
  puzzle.start();

  // The clue below the column d.
  let bottomPoint = suite.cellPoint(puzzle, 3, 4);

  suite.click(puzzle, bottomPoint);

  assert("Bottom clue value after click").that(puzzle.bottom[3].getValue()).isNull();
  assert("Bottom clue data after click").that(puzzle.bottom[3].data).isEqualTo({text: '1', image: 'white_circle'});

  suite.click(puzzle, bottomPoint);

  assert("Bottom clue data after second click").that(puzzle.bottom[3].data).isEqualTo({text: '1'});

  // The clue to the right of the row 1.
  let rightPoint = suite.cellPoint(puzzle, 4, 0);

  suite.click(puzzle, rightPoint);

  assert("Right clue value after click").that(puzzle.right[0].getValue()).isNull();
  assert("Right clue data after click").that(puzzle.right[0].data).isEqualTo({text: '1', image: 'white_circle'});
  assert("Other right clue data").that(puzzle.right[1].data).isEqualTo({text: '1'});
  assert("Clue marks are not submitted").that(puzzle.collectData()).isEqualTo({});

  suite.click(puzzle, rightPoint);

  assert("Right clue data after second click").that(puzzle.right[0].data).isEqualTo({text: '1'});
}),

test('Copy cell by drag',(suite) => {
  let puzzle = suite.showPuzzle("snake_striped", "4x4", {"c1": "black", "d3": "black", "a4": "cross", "bottom": [null, null, null, "1"], "right": ["1", "1", "1", "0"]});
  puzzle.start();

  // Black cell a1 is copied to a2 and b2.
  suite.cellClick(puzzle, "a1");
  suite.dragThroughCells(puzzle, "a1", "a2", "b2");

  assert("Cell a2 data after drag of black").that(puzzle.cells[1][0].data).isEqualTo({color: puzzle.colorSchema.gridColor, returnValue: 'black'});
  assert("Cell b2 data after drag of black").that(puzzle.cells[1][1].data).isEqualTo({color: puzzle.colorSchema.gridColor, returnValue: 'black'});

  // Cell of the second color d1 is copied to d2.
  suite.cellClick(puzzle, "d1");
  suite.cellClick(puzzle, "d1");
  suite.dragThroughCells(puzzle, "d1", "d2");

  assert("Cell d2 value after drag of second color").that(puzzle.cells[1][3].getValue()).isEqualTo("black");
  assert("Cell d2 data after drag of second color").that(puzzle.cells[1][3].data).isEqualTo({color: puzzle.colorSchema.brightColor, returnValue: 'black'});
  assert("Submission data").that(puzzle.collectData()).isEqualTo({"a1": "black", "a2": "black", "b2": "black", "d1": "black", "d2": "black"});

  // Drag from the empty cell a3 clears the cells.
  suite.dragThroughCells(puzzle, "a3", "a2", "a1");

  assert("Cell a2 data after drag of empty cell").that(puzzle.cells[1][0].data).isEqualTo({});
  assert("Cell a1 data after drag of empty cell").that(puzzle.cells[0][0].data).isEqualTo({});
  assert("Submission data after drag of empty cell").that(puzzle.collectData()).isEqualTo({"b2": "black", "d1": "black", "d2": "black"});
}),

test('Drag does not change clue cells',(suite) => {
  let puzzle = suite.showPuzzle("snake_striped", "4x4", {"c1": "black", "d3": "black", "a4": "cross", "bottom": [null, null, null, "1"], "right": ["1", "1", "1", "0"]});
  puzzle.start();

  // Black cell b1 is dragged over the clue c1, black cell a3 is dragged over the clue a4.
  suite.cellClick(puzzle, "b1");
  suite.dragThroughCells(puzzle, "b1", "c1");
  suite.cellClick(puzzle, "a3");
  suite.dragThroughCells(puzzle, "a3", "a4");
  // Clue cells are not copied to other cells.
  suite.dragThroughCells(puzzle, "d3", "d4");
  suite.dragThroughCells(puzzle, "a4", "b4");

  assert("Black clue data").that(puzzle.cells[0][2].data).isEqualTo({color: puzzle.colorSchema.clueColor});
  assert("Cross clue data").that(puzzle.cells[3][0].data).isEqualTo({image: 'cross'});
  assert("Cell d4 data").that(puzzle.cells[3][3].data).isEqualTo({});
  assert("Cell b4 data").that(puzzle.cells[3][1].data).isEqualTo({});
  assert("Submission data").that(puzzle.collectData()).isEqualTo({"b1": "black", "a3": "black"});
}),

// Data collector tests
test('Data collector',(suite) => {
  let puzzle = suite.showPuzzle("snake_striped", "4x4", {"c1": "black", "d3": "black", "bottom": [null, null, null, "1"], "right": ["1", "1", "1", "0"]});
  puzzle.start();

  // The snake c1-b1-b2-b3-c3-d3, cells of the second color are marked with o:
  //   . o # .
  //   . # . .
  //   . o # #
  //   . . . .
  suite.cellClick(puzzle, "b1");
  suite.cellClick(puzzle, "b1");
  suite.cellClick(puzzle, "b2");
  suite.cellClick(puzzle, "b3");
  suite.cellClick(puzzle, "b3");
  suite.dragThroughCells(puzzle, "b2", "c2", "c3");
  // Cell c2 is not a part of the snake: it is replaced with cross, which is not submitted.
  suite.cellClick(puzzle, "c2");
  suite.cellClick(puzzle, "c2");
  // Marks at the clues are not submitted.
  suite.click(puzzle, suite.cellPoint(puzzle, 3, 4));
  suite.click(puzzle, suite.cellPoint(puzzle, 4, 3));

  assert("Cell c2 data").that(puzzle.cells[1][2].data).isEqualTo({image: 'cross'});
  assert("Submission data").that(puzzle.collectData()).isEqualTo({"b1": "black", "b2": "black", "b3": "black", "c3": "black"});
}),

test('Process clicks to cell for author',(suite) => {
  let puzzle = suite.showPuzzle("snake_striped", "4x4");
  puzzle.edit();

  let cell = puzzle.cells[0][0];

  suite.cellClick(puzzle, "a1");

  assert("Cell value after one click").that(cell.getValue()).isEqualTo("cross");
  assert("Cell data after one click").that(cell.data).isEqualTo({image: 'cross', returnValue: 'cross'});

  suite.cellClick(puzzle, "a1");

  assert("Cell value after two clicks").that(cell.getValue()).isEqualTo("black");
  assert("Cell data after two clicks").that(cell.data).isEqualTo({color: puzzle.colorSchema.clueColor, returnValue: 'black'});

  suite.cellClick(puzzle, "a1");

  assert("Cell value after three clicks").that(cell.getValue()).isNull();
  assert("Cell data after three clicks").that(cell.data).isEqualTo({});
}),

test('Outer clues chooser for author',(suite) => {
  let puzzle = suite.showPuzzle("snake_striped", "4x4");
  puzzle.edit();

  puzzle.bottom[3].switchOnChooser(2);

  assert("Bottom clue value").that(puzzle.bottom[3].getValue()).isEqualTo("1");
  assert("Bottom clue data").that(puzzle.bottom[3].data).isEqualTo({text: '1', returnValue: '1'});

  puzzle.right[3].switchOnChooser(1);

  assert("Right clue value").that(puzzle.right[3].getValue()).isEqualTo("0");
  assert("Right clue data").that(puzzle.right[3].data).isEqualTo({text: '0', returnValue: '0'});

  puzzle.bottom[3].switchOnChooser(0);

  assert("Bottom clue value after reset").that(puzzle.bottom[3].getValue()).isNull();
  assert("Bottom clue data after reset").that(puzzle.bottom[3].data).isEqualTo({});
}),

test('Author data collector',(suite) => {
  let puzzle = suite.showPuzzle("snake_striped", "4x4");
  puzzle.edit();

  // Black cells c1 and d3 (two clicks).
  suite.cellClick(puzzle, "c1");
  suite.cellClick(puzzle, "c1");
  suite.cellClick(puzzle, "d3");
  suite.cellClick(puzzle, "d3");
  // Clue 1 below the column d, clues 1, 1, 1, 0 to the right of the grid.
  puzzle.bottom[3].switchOnChooser(2);
  [2, 2, 2, 1].forEach((index, row) => puzzle.right[row].switchOnChooser(index));
  // The clue below the column a is set and cleared.
  puzzle.bottom[0].switchOnChooser(3);
  puzzle.bottom[0].switchOnChooser(0);

  assert("Puzzle data").that(puzzle.collectData()).isEqualTo({"c1": "black", "d3": "black", "bottom": [null, null, null, "1"], "right": ["1", "1", "1", "0"]});

  // Cross in a4 (one click).
  suite.cellClick(puzzle, "a4");

  assert("Puzzle data with cross").that(puzzle.collectData()).isEqualTo({"c1": "black", "d3": "black", "a4": "cross", "bottom": [null, null, null, "1"], "right": ["1", "1", "1", "0"]});
}),

);
