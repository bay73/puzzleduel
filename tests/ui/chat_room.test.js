chatRoomTestSuite = uiTestSuite("Chat Room", "squarepuzzle", "squarePuzzleType",

// Puzzle 4x4 (P - phone, W - white circle, B - black circle, the digit is the number of turns)
// and its solution:
//   W1 .  .  .       W1--+--+--+
//   B  .  .  P       B --+--+--P
//   P  .  .  W0      P --+--+--W0
//   .  .  .  B1      +---+--+--B1   (a4 is connected to a3)
// The solver draws lines by dragging from a cell to the adjacent one. Connector "a1-h" joins a1 and b1,
// connector "a1-v" joins a1 and a2.

beforeSuite((suite, cb)=> {
  suite.CLUES = {"a1": "white_1", "a2": "black_circle", "d2": "phone", "a3": "phone", "d3": "white_0", "d4": "black_1"};
  // Emulates one mouse drag through the centers of the given cells.
  suite.drawLine = function(puzzle, ...cells) {
    puzzle.controller.onMouseDown(suite.mouseEvent(suite.cellPoint(puzzle, cells[0])));
    for (let i = 1; i < cells.length; i++) {
      puzzle.controller.onMouseMove(suite.mouseEvent(suite.cellPoint(puzzle, cells[i])));
    }
    puzzle.controller.onMouseUp(suite.mouseEvent(suite.cellPoint(puzzle, cells[cells.length - 1])));
  };
  cb();
}),

// Controller definition tests
test('Solver controllers',(suite) => {
  let puzzle = suite.showPuzzle("chat_room", "4x4", suite.CLUES);
  puzzle.start();

  let line = {color: puzzle.colorSchema.textColor, returnValue: 1};
  assert("Empty cell chooser").that(puzzle.cells[0][1].chooserValues).isNull();
  assert("Empty cell click").that(puzzle.cells[0][1].clickSwitch).isNull();
  assert("Empty cell drag processor").that(puzzle.cells[0][1].dragProcessor).isEqualTo(true);
  assert("Clue cell chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("Clue cell click").that(puzzle.cells[0][0].clickSwitch).isNull();
  assert("Clue cell drag processor").that(puzzle.cells[0][0].dragProcessor).isEqualTo(true);
  assert("Horizontal connector click").that(puzzle.connectors[0][0]['h'].clickSwitch).isNull();
  assert("Horizontal connector drag").that(puzzle.connectors[0][0]['h'].dragSwitch).containsExactly([{}, line]);
  assert("Vertical connector drag").that(puzzle.connectors[0][0]['v'].dragSwitch).containsExactly([{}, line]);
  assert("Edge click").that(puzzle.edges[0][0][1].clickSwitch).isNull();
  assert("Edge drag").that(puzzle.edges[0][0][1].dragSwitch).isNull();
}),

test('Author controllers',(suite) => {
  let puzzle = suite.showPuzzle("chat_room", "4x4");
  puzzle.edit();

  assert("Cell chooser").that(puzzle.cells[0][0].chooserValues).containsAtLeast([
    {},
    {image: 'phone', returnValue: 'phone'},
    {image: 'big_white_circle', returnValue: 'white_circle'},
    {image: 'big_black_circle', returnValue: 'black_circle'},
    {text: '0', image: 'big_white_circle', returnValue: 'white_0'},
    {text: '0', image: 'big_black_circle', textColor: '#fff', returnValue: 'black_0'},
    {text: '99', image: 'big_white_circle', returnValue: 'white_99'},
    {text: '99', image: 'big_black_circle', textColor: '#fff', returnValue: 'black_99'}]);
  // Empty value, phone, two circles and two circles for every number 0-99.
  assert("Number of items in the cell chooser").that(puzzle.cells[0][0].chooserValues.length).isEqualTo(204);
  // Only numbers 0-9 are shown, the last item is "+10".
  assert("Number of shown items in the cell chooser").that(puzzle.cells[0][0].chooserData().length).isEqualTo(25);
  assert("The last shown item with number").that(puzzle.cells[0][0].chooserData()[23]).isEqualTo({text: '9', image: 'big_black_circle', textColor: '#fff', returnValue: 'black_9'});
  assert("Plus 10 item").that(puzzle.cells[0][0].chooserData()[24]).isEqualTo({text: '+10'});
  assert("Cell click").that(puzzle.cells[0][0].clickSwitch).isNull();
  assert("Cell drag processor").that(puzzle.cells[0][0].dragProcessor).isNull();
  assert("Connector drag").that(puzzle.connectors[0][0]['h'].dragSwitch).isNull();
  assert("Edge click").that(puzzle.edges[0][0][1].clickSwitch).isNull();
}),

// Clue display tests
test('Show clues',(suite) => {
  let puzzle = suite.showPuzzle("chat_room", "4x4", suite.CLUES);
  puzzle.start();

  assert("White circle with number").that(puzzle.cells[0][0].data).isEqualTo({image: 'big_white_circle', text: '1'});
  assert("Black circle").that(puzzle.cells[1][0].data).isEqualTo({image: 'big_black_circle'});
  assert("Phone").that(puzzle.cells[1][3].data).isEqualTo({image: 'phone'});
  assert("White circle with zero").that(puzzle.cells[2][3].data).isEqualTo({image: 'big_white_circle', text: '0'});
  assert("Black circle with number").that(puzzle.cells[3][3].data).isEqualTo({image: 'big_black_circle', text: '1', textColor: '#fff'});
  assert("Empty cell").that(puzzle.cells[0][1].data).isEqualTo({});
  assert("Clue cell is a clue").that(puzzle.cells[0][0].isClue).isEqualTo(true);
  assert("Empty cell is not a clue").that(puzzle.cells[0][1].isClue).isEqualTo(false);
}),

// Mouse processing tests
test('Process drag between cells',(suite) => {
  let puzzle = suite.showPuzzle("chat_room", "4x4", suite.CLUES);
  puzzle.start();

  assert("Connector value before drag").that(puzzle.connectors[0][1]['h'].getValue()).isNull();

  suite.drag(puzzle, suite.cellPoint(puzzle, "b1"), suite.cellPoint(puzzle, "c1"));

  assert("Horizontal connector value after drag").that(puzzle.connectors[0][1]['h'].getValue()).isEqualTo(1);
  assert("Horizontal connector data after drag").that(puzzle.connectors[0][1]['h'].data).isEqualTo({color: puzzle.colorSchema.textColor, returnValue: 1});
  assert("Other connector of the cell").that(puzzle.connectors[0][1]['v'].getValue()).isNull();

  suite.drag(puzzle, suite.cellPoint(puzzle, "b2"), suite.cellPoint(puzzle, "b1"));

  assert("Vertical connector value after drag up").that(puzzle.connectors[0][1]['v'].getValue()).isEqualTo(1);

  // The same drag once more removes the line.
  suite.drag(puzzle, suite.cellPoint(puzzle, "b1"), suite.cellPoint(puzzle, "c1"));

  assert("Horizontal connector value after second drag").that(puzzle.connectors[0][1]['h'].getValue()).isNull();
  assert("Horizontal connector data after second drag").that(puzzle.connectors[0][1]['h'].data).isEqualTo({});
  assert("Vertical connector is kept").that(puzzle.connectors[0][1]['v'].getValue()).isEqualTo(1);
}),

test('Process drag from clue cell',(suite) => {
  let puzzle = suite.showPuzzle("chat_room", "4x4", suite.CLUES);
  puzzle.start();

  // From the white circle a1 to the right and from the phone a3 to the black circle a2.
  suite.drag(puzzle, suite.cellPoint(puzzle, "a1"), suite.cellPoint(puzzle, "b1"));
  suite.drag(puzzle, suite.cellPoint(puzzle, "a3"), suite.cellPoint(puzzle, "a2"));

  assert("Connector from the circle").that(puzzle.connectors[0][0]['h'].getValue()).isEqualTo(1);
  assert("Connector between two clues").that(puzzle.connectors[1][0]['v'].getValue()).isEqualTo(1);
  assert("Circle is not changed").that(puzzle.cells[0][0].data).isEqualTo({image: 'big_white_circle', text: '1'});
  assert("Phone is not changed").that(puzzle.cells[2][0].data).isEqualTo({image: 'phone'});
}),

test('Process drag through several cells',(suite) => {
  let puzzle = suite.showPuzzle("chat_room", "4x4", suite.CLUES);
  puzzle.start();

  // One mouse movement along the first row and down to the phone.
  suite.drawLine(puzzle, "a1", "b1", "c1", "d1", "d2");

  assert("Connector a1-b1").that(puzzle.connectors[0][0]['h'].getValue()).isEqualTo(1);
  assert("Connector b1-c1").that(puzzle.connectors[0][1]['h'].getValue()).isEqualTo(1);
  assert("Connector c1-d1").that(puzzle.connectors[0][2]['h'].getValue()).isEqualTo(1);
  assert("Connector d1-d2").that(puzzle.connectors[0][3]['v'].getValue()).isEqualTo(1);
  assert("Submission data").that(puzzle.collectData()).isEqualTo({"connectors": {"a1-h": 1, "b1-h": 1, "c1-h": 1, "d1-v": 1}});
}),

test('Clicks do not change cells for solver',(suite) => {
  let puzzle = suite.showPuzzle("chat_room", "4x4", suite.CLUES);
  puzzle.start();

  suite.cellClick(puzzle, "a1");
  suite.cellClick(puzzle, "d2");
  suite.cellClick(puzzle, "b1");

  assert("Chooser after clicks").that(puzzle.controller.chooserBuilder.chooserElements).isEmptyArray();
  assert("Circle after click").that(puzzle.cells[0][0].data).isEqualTo({image: 'big_white_circle', text: '1'});
  assert("Phone after click").that(puzzle.cells[1][3].data).isEqualTo({image: 'phone'});
  assert("Empty cell after click").that(puzzle.cells[0][1].data).isEqualTo({});
  assert("Submission data").that(puzzle.collectData()).isEqualTo({});
}),

test('Author chooser',(suite) => {
  let puzzle = suite.showPuzzle("chat_room", "4x4");
  puzzle.edit();

  assert("Chooser before click").that(puzzle.controller.chooserBuilder.chooserElements).isEmptyArray();

  suite.cellClick(puzzle, "b3");

  assert("Chooser after click").that(puzzle.controller.chooserBuilder.chooserElements).isNonEmptyArray();
  assert("Chooser connected to the cell").that(puzzle.controller.chooserBuilder.element.col).isEqualTo(1);
  assert("Chooser connected to the cell").that(puzzle.controller.chooserBuilder.element.row).isEqualTo(2);

  puzzle.cells[2][1].switchOnChooser(1);
  assert("Phone value").that(puzzle.cells[2][1].getValue()).isEqualTo('phone');
  assert("Phone data").that(puzzle.cells[2][1].data).isEqualTo({image: 'phone', returnValue: 'phone'});

  puzzle.cells[2][1].switchOnChooser(2);
  assert("White circle value").that(puzzle.cells[2][1].getValue()).isEqualTo('white_circle');
  assert("White circle data").that(puzzle.cells[2][1].data).isEqualTo({image: 'big_white_circle', returnValue: 'white_circle'});

  puzzle.cells[2][1].switchOnChooser(3);
  assert("Black circle value").that(puzzle.cells[2][1].getValue()).isEqualTo('black_circle');

  puzzle.cells[2][1].switchOnChooser(6);
  assert("White circle with number value").that(puzzle.cells[2][1].getValue()).isEqualTo('white_1');
  assert("White circle with number data").that(puzzle.cells[2][1].data).isEqualTo({image: 'big_white_circle', text: '1', returnValue: 'white_1'});

  puzzle.cells[2][1].switchOnChooser(0);
  assert("Value after choosing the empty item").that(puzzle.cells[2][1].getValue()).isNull();
  assert("Data after choosing the empty item").that(puzzle.cells[2][1].data).isEqualTo({});
}),

test('Plus 10 chooser',(suite) => {
  let puzzle = suite.showPuzzle("chat_room", "4x4");
  puzzle.edit();

  // White circle with 1, then "+10" (the last item of the chooser) two times.
  puzzle.cells[0][0].switchOnChooser(6);
  puzzle.cells[0][0].switchOnChooser(24);

  assert("White circle value after +10").that(puzzle.cells[0][0].getValue()).isEqualTo('white_11');
  assert("White circle data after +10").that(puzzle.cells[0][0].data).isEqualTo({image: 'big_white_circle', text: '11', returnValue: 'white_11'});

  puzzle.cells[0][0].switchOnChooser(24);

  assert("White circle value after second +10").that(puzzle.cells[0][0].getValue()).isEqualTo('white_21');

  // Black circle with 0, then "+10".
  puzzle.cells[0][1].switchOnChooser(5);
  puzzle.cells[0][1].switchOnChooser(24);

  assert("Black circle value after +10").that(puzzle.cells[0][1].getValue()).isEqualTo('black_10');
  assert("Black circle data after +10").that(puzzle.cells[0][1].data).isEqualTo({image: 'big_black_circle', text: '10', textColor: '#fff', returnValue: 'black_10'});
}),

// Data collector tests
test('Data collector',(suite) => {
  let puzzle = suite.showPuzzle("chat_room", "4x4", suite.CLUES);
  puzzle.start();

  assert("Submission data of the empty grid").that(puzzle.collectData()).isEqualTo({});

  // W1 in a1 is connected to the phone d2 (one turn).
  suite.drawLine(puzzle, "a1", "b1", "c1", "d1", "d2");
  // B in a2 is connected to the same phone.
  suite.drawLine(puzzle, "a2", "b2", "c2", "d2");
  // W0 in d3 is connected to the phone a3.
  suite.drawLine(puzzle, "d3", "c3", "b3", "a3");
  // B1 in d4 is connected to the phone a3 (one turn).
  suite.drawLine(puzzle, "d4", "c4", "b4", "a4", "a3");

  assert("Submission data").that(puzzle.collectData()).isEqualTo({"connectors": {
    "a1-h": 1, "b1-h": 1, "c1-h": 1, "d1-v": 1, "a2-h": 1, "b2-h": 1, "c2-h": 1,
    "a3-h": 1, "b3-h": 1, "c3-h": 1, "a3-v": 1, "a4-h": 1, "b4-h": 1, "c4-h": 1}});
}),

test('Author data collector',(suite) => {
  let puzzle = suite.showPuzzle("chat_room", "4x4");
  puzzle.edit();

  assert("Puzzle data of the empty grid").that(puzzle.collectData()).isEqualTo({});

  puzzle.cells[0][0].switchOnChooser(6);  // white circle with 1
  puzzle.cells[1][0].switchOnChooser(3);  // black circle
  puzzle.cells[1][3].switchOnChooser(1);  // phone
  puzzle.cells[2][0].switchOnChooser(1);  // phone
  puzzle.cells[2][3].switchOnChooser(4);  // white circle with 0
  puzzle.cells[3][3].switchOnChooser(7);  // black circle with 1

  assert("Puzzle data").that(puzzle.collectData()).isEqualTo(suite.CLUES);
}),

);
