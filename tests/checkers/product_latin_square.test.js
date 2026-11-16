// Puzzle 4x4 and its solution (the clues are placed at the nodes between 4 cells):
//   1   2   3   4      a1 b1 c1 d1
//    24
//   3   4   1   2      a2 b2 c2 d2
//        16
//   2   1   4   3      a3 b3 c3 d3
//            24
//   4   3   2   1      a4 b4 c4 d4
checkerTestSuite("product_latin_square", "Product Latin Square",

test('Correct solution',(suite) => {
  let clues = {"nodes": {"a1-2": "24", "b2-2": "16", "c3-2": "24"}};
  let data = {
    "a1": "1", "b1": "2", "c1": "3", "d1": "4",
    "a2": "3", "b2": "4", "c2": "1", "d2": "2",
    "a3": "2", "b3": "1", "c3": "4", "d3": "3",
    "a4": "4", "b4": "3", "c4": "2", "d4": "1"};

  assert("Correct solution response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "OK"});
}),

test('Digit is repeated in the column',(suite) => {
  let clues = {"nodes": {"a1-2": "24", "b2-2": "16", "c3-2": "24"}};
  // Digit 3 in b1 instead of 2: there are two 3s in the column b.
  let data = {
    "a1": "1", "b1": "3", "c1": "3", "d1": "4",
    "a2": "3", "b2": "4", "c2": "1", "d2": "2",
    "a3": "2", "b3": "1", "c3": "4", "d3": "3",
    "a4": "4", "b4": "3", "c4": "2", "d4": "1"};

  assert("Digit is repeated in the column response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "All digits should be exactly once in every column", errors: ["b1", "b2", "b3", "b4"]});
}),

test('Empty cell',(suite) => {
  let clues = {"nodes": {"a1-2": "24", "b2-2": "16", "c3-2": "24"}};
  // Cell d4 is empty.
  let data = {
    "a1": "1", "b1": "2", "c1": "3", "d1": "4",
    "a2": "3", "b2": "4", "c2": "1", "d2": "2",
    "a3": "2", "b3": "1", "c3": "4", "d3": "3",
    "a4": "4", "b4": "3", "c4": "2"};

  assert("Empty cell response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "All digits should be exactly once in every column", errors: ["d1", "d2", "d3", "d4"]});
}),

test('Digit is repeated in the row',(suite) => {
  let clues = {"nodes": {"a1-2": "24", "b2-2": "16", "c3-2": "24"}};
  // Digits in a1 and a2 are swapped: all columns are still correct, but there are two 3s in the row 1.
  let data = {
    "a1": "3", "b1": "2", "c1": "3", "d1": "4",
    "a2": "1", "b2": "4", "c2": "1", "d2": "2",
    "a3": "2", "b3": "1", "c3": "4", "d3": "3",
    "a4": "4", "b4": "3", "c4": "2", "d4": "1"};

  assert("Digit is repeated in the row response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "All digits should be exactly once in every row", errors: ["a1", "b1", "c1", "d1"]});
}),

test('Wrong product',(suite) => {
  // The product of digits around the node between b2 and c3 is 4*1*1*4 = 16, not 12.
  let clues = {"nodes": {"a1-2": "24", "b2-2": "12", "c3-2": "24"}};
  let data = {
    "a1": "1", "b1": "2", "c1": "3", "d1": "4",
    "a2": "3", "b2": "4", "c2": "1", "d2": "2",
    "a3": "2", "b3": "1", "c3": "4", "d3": "3",
    "a4": "4", "b4": "3", "c4": "2", "d4": "1"};

  assert("Wrong product response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "The clue is not correct", errors: ["b2", "c2", "b3", "c3"]});
}),

);
