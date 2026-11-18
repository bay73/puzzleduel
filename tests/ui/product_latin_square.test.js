productLatinSquareTestSuite = uiTestSuite("Product Latin Square", "squarepuzzle", "squarePuzzleType",

// Puzzle 4x4 and its solution (the clues are placed at the nodes between 4 cells,
// the clue is the product of the digits in these cells):
//   1   2   3   4      a1 b1 c1 d1
//    24
//   3   4   1   2      a2 b2 c2 d2
//        16
//   2   1   4   3      a3 b3 c3 d3
//            24
//   4   3   2   1      a4 b4 c4 d4
// Node "a1-2" is the bottom right corner of a1, it is available as puzzle.nodes[0][0][2].

beforeSuite((suite, cb)=> {
  suite.CLUES = {"nodes": {"a1-2": "24", "b2-2": "16", "c3-2": "24"}};
  cb();
}),

// Controller definition tests
test('Solver controllers',(suite) => {
  let puzzle = suite.showPuzzle("product_latin_square", "4x4", suite.CLUES);
  puzzle.start();

  assert("Cell chooser").that(puzzle.cells[0][0].chooserValues).containsExactly([{},{text: '1', returnValue: '1'},{text: '2', returnValue: '2'},{text: '3', returnValue: '3'},{text: '4', returnValue: '4'}]);
  // There is no "+10" item for the digits.
  assert("Shown items of the cell chooser").that(puzzle.cells[0][0].chooserData().length).isEqualTo(5);
  assert("Cell click").that(puzzle.cells[0][0].clickSwitch).isNull();
  assert("Clue node chooser").that(puzzle.nodes[0][0][2].chooserValues).isNull();
  assert("Clue node click").that(puzzle.nodes[0][0][2].clickSwitch).isNull();
  assert("Empty node chooser").that(puzzle.nodes[0][1][2].chooserValues).isNull();
  assert("Empty node click").that(puzzle.nodes[0][1][2].clickSwitch).isNull();
  assert("Cell drag processor").that(puzzle.cells[0][0].dragProcessor).isNull();
}),

test('Author controllers',(suite) => {
  let puzzle = suite.showPuzzle("product_latin_square", "4x4");
  puzzle.edit();

  let product = (value) => ({color: puzzle.colorSchema.gridColor, text: value, textColor: '#fff', returnValue: value});
  // Only the products can be given.
  assert("Cell chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("Cell click").that(puzzle.cells[0][0].clickSwitch).isNull();
  assert("Node chooser").that(puzzle.nodes[0][0][2].chooserValues).containsAtLeast([{}, product('1'), product('2'), product('10'), product('99')]);
  assert("Number of items in the node chooser").that(puzzle.nodes[0][0][2].chooserValues.length).isEqualTo(100);
  assert("Node click").that(puzzle.nodes[0][0][2].clickSwitch).isNull();
  // Empty item, numbers 1-9 and "+10" are shown.
  assert("Number of shown items in the node chooser").that(puzzle.nodes[0][0][2].chooserData().length).isEqualTo(11);
  assert("The last number in the node chooser").that(puzzle.nodes[0][0][2].chooserData()[9]).isEqualTo(product('9'));
  assert("Plus 10 item").that(puzzle.nodes[0][0][2].chooserData()[10]).isEqualTo({text: '+10'});
}),

test('Chooser depends on the grid size',(suite) => {
  let puzzle = suite.showPuzzle("product_latin_square", "6x6");
  puzzle.start();

  assert("Number of items in the chooser").that(puzzle.cells[0][0].chooserValues.length).isEqualTo(7);
  assert("The last item of the chooser").that(puzzle.cells[0][0].chooserValues[6]).isEqualTo({text: '6', returnValue: '6'});
}),

// Clue display tests
test('Show products',(suite) => {
  let puzzle = suite.showPuzzle("product_latin_square", "4x4", suite.CLUES);
  puzzle.start();

  assert("Product at the corner of a1, b1, a2, b2").that(puzzle.nodes[0][0][2].data).isEqualTo({color: puzzle.colorSchema.gridColor, text: '24', textColor: '#fff'});
  assert("Product at the corner of b2, c2, b3, c3").that(puzzle.nodes[1][1][2].data).isEqualTo({color: puzzle.colorSchema.gridColor, text: '16', textColor: '#fff'});
  assert("Product at the corner of c3, d3, c4, d4").that(puzzle.nodes[2][2][2].data).isEqualTo({color: puzzle.colorSchema.gridColor, text: '24', textColor: '#fff'});
  assert("The same node as the corner of the neighbour cell").that(puzzle.nodes[1][1][0].data).isEqualTo({color: puzzle.colorSchema.gridColor, text: '24', textColor: '#fff'});
  assert("Node without product").that(puzzle.nodes[0][1][2].data).isEqualTo({});
  assert("Node with product is a clue").that(puzzle.nodes[0][0][2].isClue).isEqualTo(true);
}),

// Mouse processing tests
test('Process click to cell',(suite) => {
  let puzzle = suite.showPuzzle("product_latin_square", "4x4", suite.CLUES);
  puzzle.start();

  assert("Cell value before click").that(puzzle.cells[0][0].getValue()).isNull();
  assert("Chooser before click").that(puzzle.controller.chooserBuilder.chooserElements).isEmptyArray();

  suite.cellClick(puzzle, "a1");

  assert("Chooser after click").that(puzzle.controller.chooserBuilder.chooserElements).isNonEmptyArray();
  assert("Chooser connected to the cell").that(puzzle.controller.chooserBuilder.element.col).isEqualTo(0);
  assert("Chooser connected to the cell").that(puzzle.controller.chooserBuilder.element.row).isEqualTo(0);

  puzzle.cells[0][0].switchOnChooser(4);

  assert("Cell value after choice").that(puzzle.cells[0][0].getValue()).isEqualTo('4');
  assert("Cell data after choice").that(puzzle.cells[0][0].data).isEqualTo({text: '4', returnValue: '4'});

  puzzle.cells[0][0].switchOnChooser(0);

  assert("Cell value after choosing the empty item").that(puzzle.cells[0][0].getValue()).isNull();
}),

test('Products can not be changed by solver',(suite) => {
  let puzzle = suite.showPuzzle("product_latin_square", "4x4", suite.CLUES);
  puzzle.start();

  // Node with the product and node without it.
  suite.click(puzzle, suite.gridPoint(puzzle, 1, 1));
  suite.click(puzzle, suite.gridPoint(puzzle, 2, 1));

  assert("Chooser after clicks").that(puzzle.controller.chooserBuilder.chooserElements).isEmptyArray();
  assert("Product after click").that(puzzle.nodes[0][0][2].data).isEqualTo({color: puzzle.colorSchema.gridColor, text: '24', textColor: '#fff'});
  assert("Empty node after click").that(puzzle.nodes[0][1][2].data).isEqualTo({});
  assert("Submission data").that(puzzle.collectData()).isEqualTo({});
}),

test('Author chooser for products',(suite) => {
  let puzzle = suite.showPuzzle("product_latin_square", "4x4");
  puzzle.edit();

  assert("Chooser before click").that(puzzle.controller.chooserBuilder.chooserElements).isEmptyArray();

  // Common corner of b2, c2, b3 and c3.
  suite.click(puzzle, suite.gridPoint(puzzle, 2, 2));

  assert("Chooser after click").that(puzzle.controller.chooserBuilder.chooserElements).isNonEmptyArray();
  assert("Chooser connected to the node").that(puzzle.controller.chooserBuilder.element.getCoordinates()).isEqualTo("b2-2");
  assert("Node data after click").that(puzzle.nodes[1][1][2].data).isEqualTo({});

  puzzle.nodes[1][1][2].switchOnChooser(8);

  assert("Node value after choice").that(puzzle.nodes[1][1][2].getValue()).isEqualTo('8');
  assert("Node data after choice").that(puzzle.nodes[1][1][2].data).isEqualTo({color: puzzle.colorSchema.gridColor, text: '8', textColor: '#fff', returnValue: '8'});
  assert("Puzzle data").that(puzzle.collectData()).isEqualTo({"nodes": {"b2-2": "8"}});

  puzzle.nodes[1][1][2].switchOnChooser(0);

  assert("Node value after choosing the empty item").that(puzzle.nodes[1][1][2].getValue()).isNull();
  assert("Puzzle data without products").that(puzzle.collectData()).isEqualTo({});
}),

test('Author can not set digits',(suite) => {
  let puzzle = suite.showPuzzle("product_latin_square", "4x4");
  puzzle.edit();

  suite.cellClick(puzzle, "b2");

  assert("Chooser after click").that(puzzle.controller.chooserBuilder.chooserElements).isEmptyArray();
  assert("Cell data after click").that(puzzle.cells[1][1].data).isEqualTo({});
  assert("Puzzle data").that(puzzle.collectData()).isEqualTo({});
}),

test('Plus 10 chooser',(suite) => {
  let puzzle = suite.showPuzzle("product_latin_square", "4x4");
  puzzle.edit();

  // Choose 4, then "+10" (item 10 of the chooser) two times.
  puzzle.nodes[0][0][2].switchOnChooser(4);
  puzzle.nodes[0][0][2].switchOnChooser(10);

  assert("Node value after +10").that(puzzle.nodes[0][0][2].getValue()).isEqualTo('14');
  assert("Node data after +10").that(puzzle.nodes[0][0][2].data).isEqualTo({color: puzzle.colorSchema.gridColor, text: '14', textColor: '#fff', returnValue: '14'});

  puzzle.nodes[0][0][2].switchOnChooser(10);

  assert("Node value after second +10").that(puzzle.nodes[0][0][2].getValue()).isEqualTo('24');

  // "+10" for the empty node.
  puzzle.nodes[1][1][2].switchOnChooser(10);

  assert("Empty node value after +10").that(puzzle.nodes[1][1][2].getValue()).isEqualTo('10');
}),

// Data collector tests
test('Data collector',(suite) => {
  let puzzle = suite.showPuzzle("product_latin_square", "4x4", suite.CLUES);
  puzzle.start();

  assert("Submission data of the empty grid").that(puzzle.collectData()).isEqualTo({});

  let rows = ["1234", "3412", "2143", "4321"];
  rows.forEach((digits, row) => {
    for (let col = 0; col < 4; col++) {
      puzzle.cells[row][col].switchOnChooser(parseInt(digits[col]));
    }
  });

  // Products are not submitted.
  assert("Submission data").that(puzzle.collectData()).isEqualTo({
    "a1": "1", "b1": "2", "c1": "3", "d1": "4",
    "a2": "3", "b2": "4", "c2": "1", "d2": "2",
    "a3": "2", "b3": "1", "c3": "4", "d3": "3",
    "a4": "4", "b4": "3", "c4": "2", "d4": "1"});
}),

test('Author data collector',(suite) => {
  let puzzle = suite.showPuzzle("product_latin_square", "4x4");
  puzzle.edit();

  assert("Puzzle data of the empty grid").that(puzzle.collectData()).isEqualTo({});

  // 24 = 4, +10, +10; 16 = 6, +10.
  puzzle.nodes[0][0][2].switchOnChooser(4);
  puzzle.nodes[0][0][2].switchOnChooser(10);
  puzzle.nodes[0][0][2].switchOnChooser(10);
  puzzle.nodes[1][1][2].switchOnChooser(6);
  puzzle.nodes[1][1][2].switchOnChooser(10);
  puzzle.nodes[2][2][2].switchOnChooser(4);
  puzzle.nodes[2][2][2].switchOnChooser(10);
  puzzle.nodes[2][2][2].switchOnChooser(10);

  assert("Puzzle data").that(puzzle.collectData()).isEqualTo(suite.CLUES);
}),

);
