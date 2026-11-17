chocoBananaTestSuite = uiTestSuite("Choco Banana", "squarepuzzle", "squarePuzzleType",

test('Solver controllers',(suite) => {
  let puzzle = suite.showPuzzle(
    "choco_banana", "9x9-1",
    {"data": {"b1":"1","e1":"4","a2":"3","e3":"2","b4":"4","h4":"2","a5":"4","g5":"4","i5":"4","b6":"2","h6":"2","e7":"2","i8":"2","e9":"4","h9":"4"}}
  );
  puzzle.start();

  assert("Empty cell chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("Empty cell click").that(puzzle.cells[0][0].clickSwitch).containsExactly([{}, {color: puzzle.colorSchema.greyColor, returnValue: '1'}, {image: 'cross'}]);
  assert("Hint cell chooser").that(puzzle.cells[2][4].chooserValues).isNull();
  assert("Hint cell click").that(puzzle.cells[2][4].clickSwitch).containsExactly([{}, {color: puzzle.colorSchema.greyColor, returnValue: '1'}, {image: 'cross'}]);
}),
test('Author controllers',(suite) => {
  let puzzle = suite.showPuzzle("choco_banana", "9x9");
  puzzle.edit();

  assert("Cell chooser").that(puzzle.cells[0][0].chooserValues).containsAtLeast([{},{text: '1', textColor: puzzle.colorSchema.textColor, returnValue: '1'},{text: '2', textColor: puzzle.colorSchema.textColor, returnValue: '2'},{text: '8', textColor: puzzle.colorSchema.textColor, returnValue: '8'}]);
  assert("Cell click").that(puzzle.cells[0][0].clickSwitch).isNull();
}),
);
