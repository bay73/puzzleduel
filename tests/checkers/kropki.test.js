// Puzzle 4x4 and its solution (o is a white dot, * is a black dot,
// a1 and c3 are given):
//   1 o 2 o 3 o 4      a1 b1 c1 d1
//       *       *
//   3 o 4   1 * 2      a2 b2 c2 d2
//   o           o
//   2 o 1   4 o 3      a3 b3 c3 d3
//   *       *
//   4 o 3 o 2 * 1      a4 b4 c4 d4
// Edge "a1-1" is between a1 and b1, edge "a1-2" is between a1 and a2.
checkerTestSuite("kropki", "Kropki",

test('Correct solution',(suite) => {
  let clues = {"a1": "1", "c3": "4", "edges": {
    "a1-1": "white", "b1-1": "white", "c1-1": "white", "a2-1": "white", "c2-1": "black",
    "a3-1": "white", "c3-1": "white", "a4-1": "white", "b4-1": "white", "c4-1": "black",
    "b1-2": "black", "d1-2": "black", "a2-2": "white", "d2-2": "white", "a3-2": "black", "c3-2": "black"}};
  let data = {"b1": "2", "c1": "3", "d1": "4", "a2": "3", "b2": "4", "c2": "1", "d2": "2",
              "a3": "2", "b3": "1", "d3": "3", "a4": "4", "b4": "3", "c4": "2", "d4": "1"};

  assert("Correct solution response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "OK"});
}),

test('Repeated digit in a row',(suite) => {
  let clues = {"a1": "1", "c3": "4", "edges": {
    "a1-1": "white", "b1-1": "white", "c1-1": "white", "a2-1": "white", "c2-1": "black",
    "a3-1": "white", "c3-1": "white", "a4-1": "white", "b4-1": "white", "c4-1": "black",
    "b1-2": "black", "d1-2": "black", "a2-2": "white", "d2-2": "white", "a3-2": "black", "c3-2": "black"}};
  // Digit 2 is in b1 and c1.
  let data = {"b1": "2", "c1": "2", "d1": "4", "a2": "3", "b2": "4", "c2": "1", "d2": "2",
              "a3": "2", "b3": "1", "d3": "3", "a4": "4", "b4": "3", "c4": "2", "d4": "1"};

  assert("Repeated digit in a row response").that(Checker.check("4x4", clues, data)).isEqualTo(
    {status: "All digits should be exactly once in every row", errors: ["a1", "b1", "c1", "d1"]});
}),

test('Empty cell',(suite) => {
  let clues = {"a1": "1", "c3": "4", "edges": {
    "a1-1": "white", "b1-1": "white", "c1-1": "white", "a2-1": "white", "c2-1": "black",
    "a3-1": "white", "c3-1": "white", "a4-1": "white", "b4-1": "white", "c4-1": "black",
    "b1-2": "black", "d1-2": "black", "a2-2": "white", "d2-2": "white", "a3-2": "black", "c3-2": "black"}};
  // Cell b2 is not filled.
  let data = {"b1": "2", "c1": "3", "d1": "4", "a2": "3", "c2": "1", "d2": "2",
              "a3": "2", "b3": "1", "d3": "3", "a4": "4", "b4": "3", "c4": "2", "d4": "1"};

  assert("Empty cell response").that(Checker.check("4x4", clues, data)).isEqualTo(
    {status: "All digits should be exactly once in every row", errors: ["a2", "b2", "c2", "d2"]});
}),

test('Repeated digit in a column',(suite) => {
  let clues = {"a1": "1", "c3": "4", "edges": {
    "a1-1": "white", "b1-1": "white", "c1-1": "white", "a2-1": "white", "c2-1": "black",
    "a3-1": "white", "c3-1": "white", "a4-1": "white", "b4-1": "white", "c4-1": "black",
    "b1-2": "black", "d1-2": "black", "a2-2": "white", "d2-2": "white", "a3-2": "black", "c3-2": "black"}};
  // Digits in a2 and b2 are swapped: all rows are correct, but digit 4 is in a2 and a4.
  let data = {"b1": "2", "c1": "3", "d1": "4", "a2": "4", "b2": "3", "c2": "1", "d2": "2",
              "a3": "2", "b3": "1", "d3": "3", "a4": "4", "b4": "3", "c4": "2", "d4": "1"};

  assert("Repeated digit in a column response").that(Checker.check("4x4", clues, data)).isEqualTo(
    {status: "All digits should be exactly once in every column", errors: ["a1", "a2", "a3", "a4"]});
}),

test('Consecutive digits without a dot (vertical)',(suite) => {
  // No white dot between a2 and a3, which contain 3 and 2.
  let clues = {"a1": "1", "c3": "4", "edges": {
    "a1-1": "white", "b1-1": "white", "c1-1": "white", "a2-1": "white", "c2-1": "black",
    "a3-1": "white", "c3-1": "white", "a4-1": "white", "b4-1": "white", "c4-1": "black",
    "b1-2": "black", "d1-2": "black", "d2-2": "white", "a3-2": "black", "c3-2": "black"}};
  let data = {"b1": "2", "c1": "3", "d1": "4", "a2": "3", "b2": "4", "c2": "1", "d2": "2",
              "a3": "2", "b3": "1", "d3": "3", "a4": "4", "b4": "3", "c4": "2", "d4": "1"};

  assert("Consecutive digits response").that(Checker.check("4x4", clues, data)).isEqualTo(
    {status: "The digits shouldn't be consecutive", errors: ["a2", "a3"]});
}),

test('Consecutive digits without a dot (horizontal)',(suite) => {
  // No white dot between b1 and c1, which contain 2 and 3.
  let clues = {"a1": "1", "c3": "4", "edges": {
    "a1-1": "white", "c1-1": "white", "a2-1": "white", "c2-1": "black",
    "a3-1": "white", "c3-1": "white", "a4-1": "white", "b4-1": "white", "c4-1": "black",
    "b1-2": "black", "d1-2": "black", "a2-2": "white", "d2-2": "white", "a3-2": "black", "c3-2": "black"}};
  let data = {"b1": "2", "c1": "3", "d1": "4", "a2": "3", "b2": "4", "c2": "1", "d2": "2",
              "a3": "2", "b3": "1", "d3": "3", "a4": "4", "b4": "3", "c4": "2", "d4": "1"};

  assert("Consecutive digits response").that(Checker.check("4x4", clues, data)).isEqualTo(
    {status: "The digits shouldn't be consecutive", errors: ["b1", "c1"]});
}),

test('Digits 1 and 2 without a dot',(suite) => {
  // No dot between c4 and d4, which contain 2 and 1 (either white or black dot is expected).
  let clues = {"a1": "1", "c3": "4", "edges": {
    "a1-1": "white", "b1-1": "white", "c1-1": "white", "a2-1": "white", "c2-1": "black",
    "a3-1": "white", "c3-1": "white", "a4-1": "white", "b4-1": "white",
    "b1-2": "black", "d1-2": "black", "a2-2": "white", "d2-2": "white", "a3-2": "black", "c3-2": "black"}};
  let data = {"b1": "2", "c1": "3", "d1": "4", "a2": "3", "b2": "4", "c2": "1", "d2": "2",
              "a3": "2", "b3": "1", "d3": "3", "a4": "4", "b4": "3", "c4": "2", "d4": "1"};

  assert("Digits 1 and 2 without a dot response").that(Checker.check("4x4", clues, data)).isEqualTo(
    {status: "The digits shouldn't be consecutive", errors: ["c4", "d4"]});
}),

test('Double digits without a dot (vertical)',(suite) => {
  // No black dot between a3 and a4, which contain 2 and 4.
  let clues = {"a1": "1", "c3": "4", "edges": {
    "a1-1": "white", "b1-1": "white", "c1-1": "white", "a2-1": "white", "c2-1": "black",
    "a3-1": "white", "c3-1": "white", "a4-1": "white", "b4-1": "white", "c4-1": "black",
    "b1-2": "black", "d1-2": "black", "a2-2": "white", "d2-2": "white", "c3-2": "black"}};
  let data = {"b1": "2", "c1": "3", "d1": "4", "a2": "3", "b2": "4", "c2": "1", "d2": "2",
              "a3": "2", "b3": "1", "d3": "3", "a4": "4", "b4": "3", "c4": "2", "d4": "1"};

  assert("Double digits response").that(Checker.check("4x4", clues, data)).isEqualTo(
    {status: "The digits shouldn't be two times bigger one another", errors: ["a3", "a4"]});
}),

test('Black dot between wrong digits (vertical)',(suite) => {
  // Black dot between a1 and a2, which contain 1 and 3.
  let clues = {"a1": "1", "c3": "4", "edges": {
    "a1-1": "white", "b1-1": "white", "c1-1": "white", "a2-1": "white", "c2-1": "black",
    "a3-1": "white", "c3-1": "white", "a4-1": "white", "b4-1": "white", "c4-1": "black",
    "a1-2": "black",
    "b1-2": "black", "d1-2": "black", "a2-2": "white", "d2-2": "white", "a3-2": "black", "c3-2": "black"}};
  let data = {"b1": "2", "c1": "3", "d1": "4", "a2": "3", "b2": "4", "c2": "1", "d2": "2",
              "a3": "2", "b3": "1", "d3": "3", "a4": "4", "b4": "3", "c4": "2", "d4": "1"};

  assert("Black dot response").that(Checker.check("4x4", clues, data)).isEqualTo(
    {status: "The digits should be two times bigger one another", errors: ["a1", "a2"]});
}),

test('Black dot between wrong digits (horizontal)',(suite) => {
  // Black dot between b2 and c2, which contain 4 and 1.
  let clues = {"a1": "1", "c3": "4", "edges": {
    "a1-1": "white", "b1-1": "white", "c1-1": "white", "a2-1": "white", "c2-1": "black",
    "a3-1": "white", "c3-1": "white", "a4-1": "white", "b4-1": "white", "c4-1": "black",
    "b2-1": "black",
    "b1-2": "black", "d1-2": "black", "a2-2": "white", "d2-2": "white", "a3-2": "black", "c3-2": "black"}};
  let data = {"b1": "2", "c1": "3", "d1": "4", "a2": "3", "b2": "4", "c2": "1", "d2": "2",
              "a3": "2", "b3": "1", "d3": "3", "a4": "4", "b4": "3", "c4": "2", "d4": "1"};

  assert("Black dot response").that(Checker.check("4x4", clues, data)).isEqualTo(
    {status: "The digits should be two times bigger one another", errors: ["b2", "c2"]});
}),

test('White dot between wrong digits (vertical)',(suite) => {
  // White dot between a1 and a2, which contain 1 and 3.
  let clues = {"a1": "1", "c3": "4", "edges": {
    "a1-1": "white", "b1-1": "white", "c1-1": "white", "a2-1": "white", "c2-1": "black",
    "a3-1": "white", "c3-1": "white", "a4-1": "white", "b4-1": "white", "c4-1": "black",
    "a1-2": "white",
    "b1-2": "black", "d1-2": "black", "a2-2": "white", "d2-2": "white", "a3-2": "black", "c3-2": "black"}};
  let data = {"b1": "2", "c1": "3", "d1": "4", "a2": "3", "b2": "4", "c2": "1", "d2": "2",
              "a3": "2", "b3": "1", "d3": "3", "a4": "4", "b4": "3", "c4": "2", "d4": "1"};

  assert("White dot response").that(Checker.check("4x4", clues, data)).isEqualTo(
    {status: "The digits should be consecutive", errors: ["a1", "a2"]});
}),

test('White dot between wrong digits (horizontal)',(suite) => {
  // White dot between b3 and c3, which contain 1 and 4.
  let clues = {"a1": "1", "c3": "4", "edges": {
    "a1-1": "white", "b1-1": "white", "c1-1": "white", "a2-1": "white", "c2-1": "black",
    "a3-1": "white", "c3-1": "white", "a4-1": "white", "b4-1": "white", "c4-1": "black",
    "b3-1": "white",
    "b1-2": "black", "d1-2": "black", "a2-2": "white", "d2-2": "white", "a3-2": "black", "c3-2": "black"}};
  let data = {"b1": "2", "c1": "3", "d1": "4", "a2": "3", "b2": "4", "c2": "1", "d2": "2",
              "a3": "2", "b3": "1", "d3": "3", "a4": "4", "b4": "3", "c4": "2", "d4": "1"};

  assert("White dot response").that(Checker.check("4x4", clues, data)).isEqualTo(
    {status: "The digits should be consecutive", errors: ["b3", "c3"]});
}),

);
