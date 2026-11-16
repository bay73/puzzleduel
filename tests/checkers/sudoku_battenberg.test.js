// Solution of the 4x4 puzzle. Battenberg marks are in the nodes where 2x2 squares a1-b2, c2-d3 and a3-b4 meet:
// odd and even digits form chess pattern there (and only there).
//   1 2 3 4
//   4 3 1 2
//   2 1 4 3
//   3 4 2 1
checkerTestSuite("sudoku_battenberg", "Battenberg Sudoku",

test('Correct solution',(suite) => {
  let clues = {"d1": "4", "b3": "1", "d3": "3", "nodes": {"a1-2": "battenberg", "c2-2": "battenberg", "a3-2": "battenberg"}};
  let data = {"a1": "1", "b1": "2", "c1": "3",
              "a2": "4", "b2": "3", "c2": "1", "d2": "2",
              "a3": "2", "c3": "4",
              "a4": "3", "b4": "4", "c4": "2", "d4": "1"};

  assert("Correct solution response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "OK"});
}),

test('Repeated digit in area',(suite) => {
  let clues = {"d1": "4", "b3": "1", "d3": "3", "nodes": {"a1-2": "battenberg", "c2-2": "battenberg", "a3-2": "battenberg"}};
  // Digits in b1 and c1 are exchanged, so 3 is twice in the top left area.
  let data = {"a1": "1", "b1": "3", "c1": "2",
              "a2": "4", "b2": "3", "c2": "1", "d2": "2",
              "a3": "2", "c3": "4",
              "a4": "3", "b4": "4", "c4": "2", "d4": "1"};

  assert("Repeated digit in area response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "All digits should be exactly once in every area", errors: ["a1", "a2", "b1", "b2"]});
}),

test('Repeated digit in row',(suite) => {
  let clues = {"d1": "4", "b3": "1", "d3": "3", "nodes": {"a1-2": "battenberg", "c2-2": "battenberg", "a3-2": "battenberg"}};
  // Digits in b1 and b2 are exchanged: all areas are correct, but 3 is twice in the first row.
  let data = {"a1": "1", "b1": "3", "c1": "3",
              "a2": "4", "b2": "2", "c2": "1", "d2": "2",
              "a3": "2", "c3": "4",
              "a4": "3", "b4": "4", "c4": "2", "d4": "1"};

  assert("Repeated digit in row response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "All digits should be exactly once in every row", errors: ["a1", "b1", "c1", "d1"]});
}),

test('Repeated digit in column',(suite) => {
  let clues = {"d1": "4", "b3": "1", "d3": "3", "nodes": {"a1-2": "battenberg", "c2-2": "battenberg", "a3-2": "battenberg"}};
  // Digits in a2 and b2 are exchanged: all areas and rows are correct, but 3 is twice in the first column.
  let data = {"a1": "1", "b1": "2", "c1": "3",
              "a2": "3", "b2": "4", "c2": "1", "d2": "2",
              "a3": "2", "c3": "4",
              "a4": "3", "b4": "4", "c4": "2", "d4": "1"};

  assert("Repeated digit in column response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "All digits should be exactly once in every column", errors: ["a1", "a2", "a3", "a4"]});
}),

test('Chess pattern without mark',(suite) => {
  let clues = {"d1": "4", "b3": "1", "d3": "3", "nodes": {"a1-2": "battenberg", "c2-2": "battenberg", "a3-2": "battenberg"}};
  // Valid sudoku, but cells b1 (even), c1 (odd), b2 (odd), c2 (even) form chess pattern and there is no mark.
  let data = {"a1": "1", "b1": "2", "c1": "3",
              "a2": "4", "b2": "3", "c2": "2", "d2": "1",
              "a3": "2", "c3": "4",
              "a4": "3", "b4": "4", "c4": "1", "d4": "2"};

  assert("Chess pattern without mark response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "Cells shouldn't form 'chess' pattern", errors: ["b1", "c1", "b2", "c2"]});
}),

test('No chess pattern around mark',(suite) => {
  let clues = {"d1": "4", "b3": "1", "d3": "3", "nodes": {"a1-2": "battenberg", "c2-2": "battenberg", "a3-2": "battenberg"}};
  // Valid sudoku, but a1 and a2 are both odd, so there is no chess pattern around the mark between a1 and b2.
  let data = {"a1": "1", "b1": "2", "c1": "3",
              "a2": "3", "b2": "4", "c2": "1", "d2": "2",
              "a3": "2", "c3": "4",
              "a4": "4", "b4": "3", "c4": "2", "d4": "1"};

  assert("No chess pattern around mark response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "Cells should form 'chess' pattern", errors: ["a1", "b1", "a2", "b2"]});
}),

);
