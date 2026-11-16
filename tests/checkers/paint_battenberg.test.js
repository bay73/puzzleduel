// Puzzle 4x4 and its solution (# is a painted cell, numbers of painted cells are given for rows and columns):
//   # . . #  2      a1 b1 c1 d1
//   . # . #  2      a2 b2 c2 d2
//   . # # .  2      a3 b3 c3 d3
//   . . . .         a4 b4 c4 d4
//   1 2 1 2
// Chess pattern marks are in the common corner of a1-b1-a2-b2 and in the common corner of c2-d2-c3-d3.
checkerTestSuite("paint_battenberg", "Paint Battenberg",

test('Correct solution',(suite) => {
  let clues = {"bottom": ["1", "2", "1", "2"], "right": ["2", "2", "2", null], "nodes": {"a1-2": "battenberg", "c2-2": "battenberg"}};
  let data = {"a1": "black", "d1": "black", "b2": "black", "d2": "black", "b3": "black", "c3": "black"};

  assert("Correct solution response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "OK"});
}),

test('Wrong number of painted cells in column',(suite) => {
  let clues = {"bottom": ["1", "2", "1", "2"], "right": ["2", "2", "2", null], "nodes": {"a1-2": "battenberg", "c2-2": "battenberg"}};
  // Cell a1 is not painted, there are no painted cells in the column a.
  let data = {"d1": "black", "b2": "black", "d2": "black", "b3": "black", "c3": "black"};

  assert("Wrong column response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "Wrong number of blackened cells in the column", errors: ["a1", "a2", "a3", "a4"]});
}),

test('Wrong number of painted cells in row',(suite) => {
  let clues = {"bottom": ["1", "2", "1", "2"], "right": ["2", "2", "2", null], "nodes": {"a1-2": "battenberg", "c2-2": "battenberg"}};
  // Cell c4 is painted instead of c3, there is only one painted cell in the third row.
  let data = {"a1": "black", "d1": "black", "b2": "black", "d2": "black", "b3": "black", "c4": "black"};

  assert("Wrong row response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "Wrong number of blackened cells in the row", errors: ["a3", "b3", "c3", "d3"]});
}),

test('Chess pattern without mark',(suite) => {
  let clues = {"bottom": ["1", "2", "1", "2"], "right": ["2", "2", "2", null], "nodes": {"a1-2": "battenberg", "c2-2": "battenberg"}};
  // Cells c2 and d3 are painted instead of d2 and c3:
  //   # . . #
  //   . # # .
  //   . # . #
  //   . . . .
  // Cells c1-d1-c2-d2 form chess pattern, but there is no mark there.
  let data = {"a1": "black", "d1": "black", "b2": "black", "c2": "black", "b3": "black", "d3": "black"};

  assert("Unmarked chess pattern response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "Cells shouldn't form 'chess' pattern", errors: ["c1", "d1", "c2", "d2"]});
}),

test('No chess pattern around the mark',(suite) => {
  let clues = {"bottom": ["1", "2", "1", "2"], "right": ["2", "2", "2", null], "nodes": {"a1-2": "battenberg", "c2-2": "battenberg"}};
  // Cells c1 and a3 are painted instead of a1 and c3:
  //   . . # #
  //   . # . #
  //   # # . .
  //   . . . .
  // Cells a1-b1-a2-b2 don't form chess pattern.
  let data = {"c1": "black", "d1": "black", "b2": "black", "d2": "black", "a3": "black", "b3": "black"};

  assert("Missing chess pattern response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "Cells should form 'chess' pattern", errors: ["a1", "b1", "a2", "b2"]});
}),

);
