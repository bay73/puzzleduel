// Puzzle 4x4 and its solution (# is a painted cell):
//   2 2 3 4      # . . .      a1 b1 c1 d1
//   2 3 3 1      . . # .      a2 b2 c2 d2
//   3 4 1 1      . . . #      a3 b3 c3 d3
//   4 4 2 3      . # . .      a4 b4 c4 d4
checkerTestSuite("hitori", "Hitori",

test('Correct solution',(suite) => {
  let clues = {
    "a1": "2", "b1": "2", "c1": "3", "d1": "4",
    "a2": "2", "b2": "3", "c2": "3", "d2": "1",
    "a3": "3", "b3": "4", "c3": "1", "d3": "1",
    "a4": "4", "b4": "4", "c4": "2", "d4": "3"};
  let data = {"a1": "1", "c2": "1", "d3": "1", "b4": "1"};

  assert("Correct solution response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "OK"});
}),

test('Unpainted area is not connected',(suite) => {
  let clues = {
    "a1": "2", "b1": "2", "c1": "3", "d1": "4",
    "a2": "2", "b2": "3", "c2": "3", "d2": "1",
    "a3": "3", "b3": "4", "c3": "1", "d3": "1",
    "a4": "4", "b4": "4", "c4": "2", "d4": "3"};
  // Cell c4 is painted instead of b4: together with d3 it cuts off the corner d4.
  let data = {"a1": "1", "c2": "1", "d3": "1", "c4": "1"};

  assert("Not connected response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "White area should be connected"});
}),

test('Painted cells share an edge',(suite) => {
  let clues = {
    "a1": "2", "b1": "2", "c1": "3", "d1": "4",
    "a2": "2", "b2": "3", "c2": "3", "d2": "1",
    "a3": "3", "b3": "4", "c3": "1", "d3": "1",
    "a4": "4", "b4": "4", "c4": "2", "d4": "3"};
  // Extra painted cell a2 is just below a1.
  let data = {"a1": "1", "a2": "1", "c2": "1", "d3": "1", "b4": "1"};

  assert("Painted cells touch response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "Blackened cells shouldn't sharing an edge", errors: ["a1", "a2"]});
}),

test('Same digits in a row',(suite) => {
  let clues = {
    "a1": "2", "b1": "2", "c1": "3", "d1": "4",
    "a2": "2", "b2": "3", "c2": "3", "d2": "1",
    "a3": "3", "b3": "4", "c3": "1", "d3": "1",
    "a4": "4", "b4": "4", "c4": "2", "d4": "3"};
  // Cell a2 is painted instead of a1, so two unpainted 2's are left in the first row.
  let data = {"a2": "1", "c2": "1", "d3": "1", "b4": "1"};

  assert("Same digits in a row response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "Unpainted cells should contain different digits in row", errors: ["a1", "b1"]});
}),

);
