// Puzzle 4x4 with dominoes 1-1, 1-2, 1-3, 2-2, 2-3, 3-3 and its solution
// (# is a black cell, the numbers outside the grid are the sums):
//   1 1-1 1   4      a1 b1 c1 d1
//   |     |
//   3 # # 2          a2 b2 c2 d2
//
//   3 # # 2          a3 b3 c3 d3
//   |     |
//   3 3-2 2  10      a4 b4 c4 d4
//  10     7
// Places for dominoes: a1-a2, b1-c1, d1-d2, a3-a4, b4-c4, d3-d4.
checkerTestSuite("domino_castle_sum", "Domino Castle Sum",

test('Correct solution',(suite) => {
  let clues = {"b2": "black", "c2": "black", "b3": "black", "c3": "black",
               "areas": [["b1","c1"],["a1","a2"],["b2","c2","b3","c3"],["d1","d2"],["a3","a4"],["b4","c4"],["d3","d4"]],
               "bottom": ["10", null, null, "7"], "right": ["4", null, null, "10"]};
  let data = {"a1": "1", "b1": "1", "c1": "1", "d1": "1", "a2": "3", "d2": "2", "a3": "3", "d3": "2", "a4": "3", "b4": "3", "c4": "2", "d4": "2"};

  assert("Correct solution response").that(Checker.check("4x4-123", clues, data)).isEqualTo({status: "OK"});
}),

test('Empty cell',(suite) => {
  let clues = {"b2": "black", "c2": "black", "b3": "black", "c3": "black",
               "areas": [["b1","c1"],["a1","a2"],["b2","c2","b3","c3"],["d1","d2"],["a3","a4"],["b4","c4"],["d3","d4"]],
               "bottom": ["10", null, null, "7"], "right": ["4", null, null, "10"]};
  // Cell a1 is not filled.
  let data = {"b1": "1", "c1": "1", "d1": "1", "a2": "3", "d2": "2", "a3": "3", "d3": "2", "a4": "3", "b4": "3", "c4": "2", "d4": "2"};

  assert("Empty cell response").that(Checker.check("4x4-123", clues, data)).isEqualTo({status: "All cells should be filled", errors: ["a1", "a2"]});
}),

test('Domino used twice',(suite) => {
  let clues = {"b2": "black", "c2": "black", "b3": "black", "c3": "black",
               "areas": [["b1","c1"],["a1","a2"],["b2","c2","b3","c3"],["d1","d2"],["a3","a4"],["b4","c4"],["d3","d4"]],
               "bottom": ["10", null, null, "7"], "right": ["4", null, null, "10"]};
  // 2 in c1 makes domino b1-c1 equal to 1-2, which is the same as domino d1-d2.
  let data = {"a1": "1", "b1": "1", "c1": "2", "d1": "1", "a2": "3", "d2": "2", "a3": "3", "d3": "2", "a4": "3", "b4": "3", "c4": "2", "d4": "2"};

  assert("Domino used twice response").that(Checker.check("4x4-123", clues, data)).isEqualTo({status: "Each domino should be used once", errors: ["d1", "d2", "b1", "c1"]});
}),

test('Touching dominoes with different values',(suite) => {
  let clues = {"b2": "black", "c2": "black", "b3": "black", "c3": "black",
               "areas": [["b1","c1"],["a1","a2"],["b2","c2","b3","c3"],["d1","d2"],["a3","a4"],["b4","c4"],["d3","d4"]],
               "bottom": ["10", null, null, "7"], "right": ["4", null, null, "10"]};
  // Domino d1-d2 is turned over (2-1 instead of 1-2), so 1 in c1 touches 2 in d1.
  let data = {"a1": "1", "b1": "1", "c1": "1", "d1": "2", "a2": "3", "d2": "1", "a3": "3", "d3": "2", "a4": "3", "b4": "3", "c4": "2", "d4": "2"};

  assert("Touching dominoes response").that(Checker.check("4x4-123", clues, data)).isEqualTo({status: "Touching dominoes should contain the same value", errors: ["c1", "d1"]});
}),

test('Wrong sum in column',(suite) => {
  let clues = {"b2": "black", "c2": "black", "b3": "black", "c3": "black",
               "areas": [["b1","c1"],["a1","a2"],["b2","c2","b3","c3"],["d1","d2"],["a3","a4"],["b4","c4"],["d3","d4"]],
               "bottom": ["10", null, null, "7"], "right": ["4", null, null, "10"]};
  // Correct chain of dominoes, but the sum in column a is 2+1+1+1=5 instead of 10.
  //   2 2-2 2
  //   1 # # 3
  //   1 # # 3
  //   1 1-3 3
  let data = {"a1": "2", "b1": "2", "c1": "2", "d1": "2", "a2": "1", "d2": "3", "a3": "1", "d3": "3", "a4": "1", "b4": "1", "c4": "3", "d4": "3"};

  assert("Wrong column sum response").that(Checker.check("4x4-123", clues, data)).isEqualTo({status: "Wrong sum of values in the column", errors: ["a1", "a2", "a3", "a4"]});
}),

test('Wrong sum in row',(suite) => {
  let clues = {"b2": "black", "c2": "black", "b3": "black", "c3": "black",
               "areas": [["b1","c1"],["a1","a2"],["b2","c2","b3","c3"],["d1","d2"],["a3","a4"],["b4","c4"],["d3","d4"]],
               "bottom": ["10", null, null, "7"], "right": ["4", null, null, "10"]};
  // Correct chain of dominoes with correct sums in columns a (3+3+3+1) and d (2+2+2+1),
  // but the sum in the first row is 3+3+2+2=10 instead of 4.
  //   3 3-2 2
  //   3 # # 2
  //   3 # # 2
  //   1 1-1 1
  let data = {"a1": "3", "b1": "3", "c1": "2", "d1": "2", "a2": "3", "d2": "2", "a3": "3", "d3": "2", "a4": "1", "b4": "1", "c4": "1", "d4": "1"};

  assert("Wrong row sum response").that(Checker.check("4x4-123", clues, data)).isEqualTo({status: "Wrong sum of values in the row", errors: ["a1", "b1", "c1", "d1"]});
}),

);
