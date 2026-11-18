productKuromasuTestSuite = uiTestSuite("Product Kuromasu", "squarepuzzle", "squarePuzzleType",

// Puzzle from the checker tests: digits should be placed to some cells,
// products of the digits in the rows and columns are given to the right and below the grid.
// Solution:
//      a  b  c  d  e  f  g
//   1  2  .  3  .  .  .  .   6
//   2  .  .  .  4  .  1  .   4
//   3  5  .  .  .  2  .  .  10
//   4  .  3  .  .  .  .  3   9
//   5  .  .  1  .  6  .  .   6
//   6  .  2  .  .  .  7  .  14
//   7  .  .  .  2  .  .  4   8
//     10  6  3  8 12  7 12

beforeSuite((suite, cb)=> {
  suite.CLUES = {"bottom": ["10", "6", "3", "8", "12", "7", "12"], "right": ["6", "4", "10", "9", "6", "14", "8"]};
  suite.SOLUTION = {"a1": "2", "c1": "3", "d2": "4", "f2": "1", "a3": "5", "e3": "2", "b4": "3", "g4": "3", "c5": "1", "e5": "6", "b6": "2", "f6": "7", "d7": "2", "g7": "4"};
  // Small puzzle with a given cross and a missing clue for the tests which don't need the whole solution.
  suite.SMALL_CLUES = {"bottom": ["10", null, "3", "8"], "right": ["6", "4", "10", "9"], "b2": "cross"};
  // Cell of the puzzle by its name.
  suite.cell = function(puzzle, name) {
    return puzzle.cells[parseInt(name.substring(1)) - 1][name.charCodeAt(0) - 'a'.charCodeAt(0)];
  };
  cb();
}),

// Controller definition tests
test('Solver controllers',(suite) => {
  let puzzle = suite.showPuzzle("product_kuromasu", "4x4", suite.SMALL_CLUES);
  puzzle.start();

  let digit = function(value) {
    return {text: value, returnValue: value};
  }

  // Digits and two marks which are not submitted.
  assert("Empty cell chooser").that(puzzle.cells[0][0].chooserValues).containsExactly([
    {}, digit('1'), digit('2'), digit('3'), digit('4'), digit('5'), digit('6'), digit('7'), digit('8'), digit('9'),
    {image: 'white_circle', keepPencil: true}, {image: 'cross'}]);
  assert("Empty cell click").that(puzzle.cells[0][0].clickSwitch).isNull();
  assert("Empty cell drag processor").that(puzzle.cells[0][0].dragProcessor).isNull();
  assert("Cross cell chooser").that(puzzle.cells[1][1].chooserValues).isNull();
  assert("Cross cell click").that(puzzle.cells[1][1].clickSwitch).isNull();
  assert("Bottom clue chooser").that(puzzle.bottom[0].chooserValues).isNull();
  assert("Bottom clue click").that(puzzle.bottom[0].clickSwitch).containsExactly([{text: '10'}, {text: '10', image: 'white_circle'}]);
  assert("Empty bottom clue click").that(puzzle.bottom[1].clickSwitch).containsExactly([{}, {image: 'white_circle'}]);
  assert("Right clue chooser").that(puzzle.right[0].chooserValues).isNull();
  assert("Right clue click").that(puzzle.right[0].clickSwitch).containsExactly([{text: '6'}, {text: '6', image: 'white_circle'}]);
  assert("Last right clue click").that(puzzle.right[3].clickSwitch).containsExactly([{text: '9'}, {text: '9', image: 'white_circle'}]);
}),

test('Author controllers',(suite) => {
  let puzzle = suite.showPuzzle("product_kuromasu", "4x4");
  puzzle.edit();

  let number = function(value) {
    return {text: value, returnValue: value};
  }

  assert("Cell chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("Cell click").that(puzzle.cells[0][0].clickSwitch).containsExactly([{}, {image: 'cross', returnValue: 'cross'}]);
  // Products up to 9*9.
  assert("Bottom clue chooser").that(puzzle.bottom[0].chooserValues).containsAtLeast([{}, number('1'), number('2'), number('10'), number('80'), number('81')]);
  assert("Number of items in the bottom clue chooser").that(puzzle.bottom[0].chooserValues.length).isEqualTo(82);
  assert("Bottom clue click").that(puzzle.bottom[0].clickSwitch).isNull();
  assert("Right clue chooser").that(puzzle.right[3].chooserValues).containsAtLeast([{}, number('1'), number('2'), number('10'), number('80'), number('81')]);
  assert("Number of items in the right clue chooser").that(puzzle.right[3].chooserValues.length).isEqualTo(82);
  assert("Right clue click").that(puzzle.right[3].clickSwitch).isNull();
}),

// Clue display tests
test('Show clues',(suite) => {
  let puzzle = suite.showPuzzle("product_kuromasu", "4x4", suite.SMALL_CLUES);
  puzzle.start();

  assert("Number of bottom clues").that(puzzle.bottom.length).isEqualTo(4);
  assert("Number of right clues").that(puzzle.right.length).isEqualTo(4);
  assert("Bottom clue of column a").that(puzzle.bottom[0].data).isEqualTo({text: '10'});
  assert("Text of the missing bottom clue").that(puzzle.bottom[1].data.text).isNull();
  assert("Bottom clue of column d").that(puzzle.bottom[3].data).isEqualTo({text: '8'});
  assert("Right clue of row 1").that(puzzle.right[0].data).isEqualTo({text: '6'});
  assert("Right clue of row 3").that(puzzle.right[2].data).isEqualTo({text: '10'});
  assert("Right clue of row 4").that(puzzle.right[3].data).isEqualTo({text: '9'});
  assert("Cross cell data").that(puzzle.cells[1][1].data).isEqualTo({image: 'cross'});
  assert("Cross cell value").that(puzzle.cells[1][1].getValue()).isNull();
  // Clues are not a part of the submission.
  assert("Submission data").that(puzzle.collectData()).isEqualTo({});
}),

// Mouse processing tests
test('Choose digit for cell',(suite) => {
  let puzzle = suite.showPuzzle("product_kuromasu", "4x4", suite.SMALL_CLUES);
  puzzle.start();

  assert("Cell value before choice").that(puzzle.cells[0][0].getValue()).isNull();

  puzzle.cells[0][0].switchOnChooser(2);

  assert("Cell value after choice").that(puzzle.cells[0][0].getValue()).isEqualTo("2");
  assert("Cell data after choice").that(puzzle.cells[0][0].data).isEqualTo({text: "2", returnValue: "2"});

  // Replace the digit.
  puzzle.cells[0][0].switchOnChooser(9);

  assert("Cell value after second choice").that(puzzle.cells[0][0].getValue()).isEqualTo("9");
  assert("Cell data after second choice").that(puzzle.cells[0][0].data).isEqualTo({text: "9", returnValue: "9"});
  assert("Submission data with digit").that(puzzle.collectData()).isEqualTo({"a1": "9"});

  // Clear the cell.
  puzzle.cells[0][0].switchOnChooser(0);

  assert("Value of the cleared cell").that(puzzle.cells[0][0].getValue()).isNull();
  assert("Data of the cleared cell").that(puzzle.cells[0][0].data).isEqualTo({});
  assert("Submission data after clear").that(puzzle.collectData()).isEqualTo({});
}),

test('Choose marks for cell',(suite) => {
  let puzzle = suite.showPuzzle("product_kuromasu", "4x4", suite.SMALL_CLUES);
  puzzle.start();

  // White circle - there is some digit in the cell.
  puzzle.cells[0][0].switchOnChooser(10);

  assert("White circle image").that(puzzle.cells[0][0].data.image).isEqualTo("white_circle");
  assert("White circle value").that(puzzle.cells[0][0].getValue()).isNull();

  // Cross - the cell is empty.
  puzzle.cells[0][1].switchOnChooser(11);

  assert("Cross data").that(puzzle.cells[0][1].data).isEqualTo({image: "cross"});
  assert("Cross value").that(puzzle.cells[0][1].getValue()).isNull();

  assert("Submission data").that(puzzle.collectData()).isEqualTo({});

  // The mark is replaced by digit.
  puzzle.cells[0][0].switchOnChooser(5);

  assert("Cell data after digit is chosen").that(puzzle.cells[0][0].data).isEqualTo({text: "5", returnValue: "5"});
  assert("Submission data with digit").that(puzzle.collectData()).isEqualTo({"a1": "5"});
}),

test('Process click to given cross',(suite) => {
  let puzzle = suite.showPuzzle("product_kuromasu", "4x4", suite.SMALL_CLUES);
  puzzle.start();

  suite.cellClick(puzzle, "b2");

  assert("Cell value after click").that(puzzle.cells[1][1].getValue()).isNull();
  assert("Cell data after click").that(puzzle.cells[1][1].data).isEqualTo({image: "cross"});
  assert("Submission data").that(puzzle.collectData()).isEqualTo({});
}),

test('Process click to outer clues',(suite) => {
  let puzzle = suite.showPuzzle("product_kuromasu", "4x4", suite.SMALL_CLUES);
  puzzle.start();

  // Clue below the column a.
  let point = suite.cellPoint(puzzle, 0, 4);

  suite.click(puzzle, point);

  assert("Bottom clue data after click").that(puzzle.bottom[0].data).isEqualTo({text: "10", image: "white_circle"});
  assert("Bottom clue value after click").that(puzzle.bottom[0].getValue()).isNull();

  suite.click(puzzle, point);

  assert("Bottom clue data after second click").that(puzzle.bottom[0].data).isEqualTo({text: "10"});

  // Clue to the right of the row 2.
  suite.click(puzzle, suite.cellPoint(puzzle, 4, 1));

  assert("Right clue data after click").that(puzzle.right[1].data).isEqualTo({text: "4", image: "white_circle"});
  assert("Another right clue data").that(puzzle.right[0].data).isEqualTo({text: "6"});

  // Empty outer cell below the column b.
  suite.click(puzzle, suite.cellPoint(puzzle, 1, 4));

  assert("Empty bottom cell data after click").that(puzzle.bottom[1].data).isEqualTo({image: "white_circle"});

  // Marks of the clues are not submitted.
  assert("Submission data").that(puzzle.collectData()).isEqualTo({});
}),

// Data collector tests
test('Data collector',(suite) => {
  let puzzle = suite.showPuzzle("product_kuromasu", "7x7", suite.CLUES);
  puzzle.start();

  // Digit N is the item N of the chooser.
  for (let name in suite.SOLUTION) {
    suite.cell(puzzle, name).switchOnChooser(Number(suite.SOLUTION[name]));
  }
  // Marks are not submitted.
  suite.cell(puzzle, "b1").switchOnChooser(11);
  suite.cell(puzzle, "g1").switchOnChooser(10);
  suite.click(puzzle, suite.cellPoint(puzzle, 7, 0));

  assert("Digit value").that(suite.cell(puzzle, "f6").getValue()).isEqualTo("7");
  assert("Submission data").that(puzzle.collectData()).isEqualTo(suite.SOLUTION);
}),

// Author tests
test('Author sets clues',(suite) => {
  let puzzle = suite.showPuzzle("product_kuromasu", "4x4");
  puzzle.edit();

  // Chooser items of outer cells: empty, 1, 2, ..., 81.
  puzzle.bottom[0].switchOnChooser(10);
  puzzle.right[3].switchOnChooser(81);

  assert("Bottom clue value").that(puzzle.bottom[0].getValue()).isEqualTo("10");
  assert("Bottom clue data").that(puzzle.bottom[0].data).isEqualTo({text: "10", returnValue: "10"});
  assert("Right clue value").that(puzzle.right[3].getValue()).isEqualTo("81");
  assert("Right clue data").that(puzzle.right[3].data).isEqualTo({text: "81", returnValue: "81"});

  suite.cellClick(puzzle, "b2");

  assert("Cross value").that(puzzle.cells[1][1].getValue()).isEqualTo("cross");
  assert("Cross data").that(puzzle.cells[1][1].data).isEqualTo({image: "cross", returnValue: "cross"});

  assert("Puzzle data").that(puzzle.collectData()).isEqualTo({"b2": "cross", "bottom": ["10", null, null, null], "right": [null, null, null, "81"]});

  // Remove the bottom clue and the cross.
  puzzle.bottom[0].switchOnChooser(0);
  suite.cellClick(puzzle, "b2");

  assert("Value of the cleared bottom clue").that(puzzle.bottom[0].getValue()).isNull();
  assert("Value of the cleared cell").that(puzzle.cells[1][1].getValue()).isNull();
  // Side without clues is not included to the data.
  assert("Puzzle data after clues are removed").that(puzzle.collectData()).isEqualTo({"right": [null, null, null, "81"]});
}),

test('Author data collector',(suite) => {
  let puzzle = suite.showPuzzle("product_kuromasu", "7x7");
  puzzle.edit();

  // Number N is the item N of the chooser.
  suite.CLUES.bottom.forEach((clue, index) => puzzle.bottom[index].switchOnChooser(Number(clue)));
  suite.CLUES.right.forEach((clue, index) => puzzle.right[index].switchOnChooser(Number(clue)));

  assert("Puzzle data").that(puzzle.collectData()).isEqualTo(suite.CLUES);
}),

test('Author edits existing puzzle',(suite) => {
  let puzzle = suite.showPuzzle("product_kuromasu", "4x4", suite.SMALL_CLUES);
  puzzle.edit();

  assert("Bottom clue value").that(puzzle.bottom[0].getValue()).isEqualTo("10");
  assert("Missing bottom clue value").that(puzzle.bottom[1].getValue()).isNull();
  assert("Cross value").that(puzzle.cells[1][1].getValue()).isEqualTo("cross");
  assert("Puzzle data").that(puzzle.collectData()).isEqualTo(suite.SMALL_CLUES);

  // Remove the cross, set the missing clue and remove another one.
  suite.cellClick(puzzle, "b2");
  puzzle.bottom[1].switchOnChooser(6);
  puzzle.right[0].switchOnChooser(0);

  assert("Puzzle data after change").that(puzzle.collectData()).isEqualTo({"bottom": ["10", "6", "3", "8"], "right": [null, "4", "10", "9"]});
}),

);
