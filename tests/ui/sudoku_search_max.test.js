sudokuSearchMaxTestSuite = uiTestSuite("Search Max Sudoku", "sudokupuzzle", "sudokuPuzzleType",

// Clues "arrow_u", "arrow_r", "arrow_d", "arrow_l" are cells with arrows, digits are placed over the arrows.

// Controller definition tests
test('Solver controllers',(suite) => {
  let puzzle = suite.showPuzzle("sudoku_search_max", "4x4", {"a1": "1", "b1": "arrow_u", "c1": "arrow_r"});
  puzzle.start();

  assert("Empty cell chooser").that(puzzle.cells[1][3].chooserValues).containsExactly([{}, {text: '1', returnValue: '1'}, {text: '2', returnValue: '2'}, {text: '3', returnValue: '3'}, {text: '4', returnValue: '4'}]);
  assert("Empty cell click").that(puzzle.cells[1][3].clickSwitch).isNull();
  assert("Clue cell chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("Clue cell click").that(puzzle.cells[0][0].clickSwitch).isNull();
  assert("Arrow cell chooser").that(puzzle.cells[0][1].chooserValues).containsExactly([{image: 'bg_arrow_u'}, {text: '1', image: 'bg_arrow_u', textColor: '#001', returnValue: '1'}, {text: '2', image: 'bg_arrow_u', textColor: '#001', returnValue: '2'}, {text: '3', image: 'bg_arrow_u', textColor: '#001', returnValue: '3'}, {text: '4', image: 'bg_arrow_u', textColor: '#001', returnValue: '4'}]);
  assert("Arrow cell click").that(puzzle.cells[0][1].clickSwitch).isNull();
}),

test('Author controllers',(suite) => {
  let puzzle = suite.showPuzzle("sudoku_search_max", "4x4");
  puzzle.edit();

  assert("Cell chooser").that(puzzle.cells[0][0].chooserValues).containsExactly([{}, {text: '1', returnValue: '1'}, {text: '2', returnValue: '2'}, {text: '3', returnValue: '3'}, {text: '4', returnValue: '4'}, {image: 'bg_arrow_u', returnValue: 'arrow_u'}, {image: 'bg_arrow_r', returnValue: 'arrow_r'}, {image: 'bg_arrow_d', returnValue: 'arrow_d'}, {image: 'bg_arrow_l', returnValue: 'arrow_l'}]);
  assert("Cell click").that(puzzle.cells[0][0].clickSwitch).isNull();
}),

// Clue display tests
test('Show arrows',(suite) => {
  let puzzle = suite.showPuzzle("sudoku_search_max", "4x4", {"a1": "1", "b1": "arrow_u", "c1": "arrow_r"});
  puzzle.start();

  assert("Arrow up cell data").that(puzzle.cells[0][1].data).isEqualTo({image: 'bg_arrow_u'});
  assert("Arrow right cell data").that(puzzle.cells[0][2].data).isEqualTo({image: 'bg_arrow_r'});
}),

// Data collector tests
test('Data collector',(suite) => {
  let puzzle = suite.showPuzzle("sudoku_search_max", "4x4", {"a1": "1", "b1": "arrow_u", "c1": "arrow_r"});
  puzzle.start();

  // Choose 2 for the cell d2 and 3 for the cell b1 with the arrow.
  puzzle.cells[1][3].switchOnChooser(2);
  puzzle.cells[0][1].switchOnChooser(3);

  assert("Cell value").that(puzzle.cells[1][3].getValue()).isEqualTo('2');
  assert("Arrow cell value").that(puzzle.cells[0][1].getValue()).isEqualTo('3');
  assert("Arrow cell data").that(puzzle.cells[0][1].data).isEqualTo({text: '3', image: 'bg_arrow_u', textColor: '#001', returnValue: '3'});

  assert("Submission data").that(puzzle.collectData()).isEqualTo({"b1": "3", "d2": "2"});
}),

test('Author data collector',(suite) => {
  let puzzle = suite.showPuzzle("sudoku_search_max", "4x4");
  puzzle.edit();

  // Digit 2 in a1, arrow up in b1 and arrow left in c1.
  puzzle.cells[0][0].switchOnChooser(2);
  puzzle.cells[0][1].switchOnChooser(5);
  puzzle.cells[0][2].switchOnChooser(8);

  assert("Puzzle data").that(puzzle.collectData()).isEqualTo({"a1": "2", "b1": "arrow_u", "c1": "arrow_l"});
}),

);
