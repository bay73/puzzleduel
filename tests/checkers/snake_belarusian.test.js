// Puzzle 4x4 with three areas (x is a cell of a shaded area) and its solution (# is a snake cell):
//   +---+---+---+---+
//   | x   x   x |   |      # # # #      a1 b1 c1 d1
//   +       +---+   +
//   | x   x |       |      . . . #      a2 b2 c2 d2
//   +---+---+---+   +
//   | x   x   x |   |      . . . #      a3 b3 c3 d3
//   +           +---+
//   | x   x   x   x |      . # # #      a4 b4 c4 d4
//   +---+---+---+---+
checkerTestSuite("snake_belarusian", "Belarusian snake",

test('Correct solution',(suite) => {
  let clues = {"areas": [["a1","b1","c1","a2","b2"], ["d1","c2","d2","d3"], ["a3","b3","c3","a4","b4","c4","d4"]],
               "a1": "1", "b1": "1", "c1": "1", "a2": "1", "b2": "1",
               "a3": "1", "b3": "1", "c3": "1", "a4": "1", "b4": "1", "c4": "1", "d4": "1"};
  let data = {"a1": "1", "b1": "1", "c1": "1", "d1": "1", "d2": "1", "d3": "1", "d4": "1", "c4": "1", "b4": "1"};

  assert("Correct solution response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "OK"});
}),

test('Wrong number of snake cells in the area',(suite) => {
  let clues = {"areas": [["a1","b1","c1","a2","b2"], ["d1","c2","d2","d3"], ["a3","b3","c3","a4","b4","c4","d4"]],
               "a1": "1", "b1": "1", "c1": "1", "a2": "1", "b2": "1",
               "a3": "1", "b3": "1", "c3": "1", "a4": "1", "b4": "1", "c4": "1", "d4": "1"};
  // Without b4 there are only two snake cells in the bottom area.
  let data = {"a1": "1", "b1": "1", "c1": "1", "d1": "1", "d2": "1", "d3": "1", "d4": "1", "c4": "1"};

  assert("Wrong area response").that(Checker.check("4x4", clues, data)).isEqualTo({
    status: "Each outlines area should contain exactly three cells of the snake",
    errors: ["a3","b3","c3","a4","b4","c4","d4"]});
}),

test('No head and tail',(suite) => {
  // Other puzzle: two areas a1-b4 and c1-d4.
  let clues = {"areas": [["a1","b1","a2","b2","a3","b3","a4","b4"], ["c1","d1","c2","d2","c3","d3","c4","d4"]],
               "a1": "1", "b1": "1", "a2": "1", "b2": "1", "a3": "1", "b3": "1", "a4": "1", "b4": "1",
               "c1": "1", "d1": "1", "c2": "1", "d2": "1", "c3": "1", "d3": "1", "c4": "1", "d4": "1"};
  // Three cells in each area, but all of them are separate.
  let data = {"a1": "1", "b2": "1", "a3": "1", "c1": "1", "d2": "1", "c3": "1"};

  assert("No head response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "Snake should have a head and a tail", errors: []});
}),

test('Snake with bifurcation',(suite) => {
  let clues = {"areas": [["a1","b1","c1","a2","b2"], ["d1","c2","d2","d3"], ["a3","b3","c3","a4","b4","c4","d4"]],
               "a1": "1", "b1": "1", "c1": "1", "a2": "1", "b2": "1",
               "a3": "1", "b3": "1", "c3": "1", "a4": "1", "b4": "1", "c4": "1", "d4": "1"};
  // The snake splits in d3 into two branches: d4 and c3-b3.
  let data = {"a1": "1", "b1": "1", "c1": "1", "d1": "1", "d2": "1", "d3": "1", "d4": "1", "c3": "1", "b3": "1"};

  assert("Bifurcation response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "Black cells should form single snake without bifurcations", errors: ["d3"]});
}),

test('Two separate parts',(suite) => {
  let clues = {"areas": [["a1","b1","c1","a2","b2"], ["d1","c2","d2","d3"], ["a3","b3","c3","a4","b4","c4","d4"]],
               "a1": "1", "b1": "1", "c1": "1", "a2": "1", "b2": "1",
               "a3": "1", "b3": "1", "c3": "1", "a4": "1", "b4": "1", "c4": "1", "d4": "1"};
  // The part a4-b4-c4 is not connected to the part a1-d1-d3.
  let data = {"a1": "1", "b1": "1", "c1": "1", "d1": "1", "d2": "1", "d3": "1", "a4": "1", "b4": "1", "c4": "1"};

  assert("Separate parts response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "All black cells should be part of single snake", errors: ["a4"]});
}),

test('Snake touches itself',(suite) => {
  let clues = {"areas": [["a1","b1","c1","a2","b2"], ["d1","c2","d2","d3"], ["a3","b3","c3","a4","b4","c4","d4"]],
               "a1": "1", "b1": "1", "c1": "1", "a2": "1", "b2": "1",
               "a3": "1", "b3": "1", "c3": "1", "a4": "1", "b4": "1", "c4": "1", "d4": "1"};
  // The snake b1-a1-a3-c3-c2-d2-d1 touches itself diagonally in b1 and c2:
  //   # # . #
  //   # . # #
  //   # # # .
  //   . . . .
  let data = {"b1": "1", "a1": "1", "a2": "1", "a3": "1", "b3": "1", "c3": "1", "c2": "1", "d2": "1", "d1": "1"};

  assert("Touching response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "Snake shouldn't touch itself", errors: ["c2", "b1"]});
}),

test('Snake end is not in a shaded area',(suite) => {
  let clues = {"areas": [["a1","b1","c1","a2","b2"], ["d1","c2","d2","d3"], ["a3","b3","c3","a4","b4","c4","d4"]],
               "a1": "1", "b1": "1", "c1": "1", "a2": "1", "b2": "1",
               "a3": "1", "b3": "1", "c3": "1", "a4": "1", "b4": "1", "c4": "1", "d4": "1"};
  // The snake b1-a1-a3-d3-d1 has three cells in each area, but it ends in d1, which is not shaded:
  //   # # . #
  //   # . . #
  //   # # # #
  //   . . . .
  let data = {"b1": "1", "a1": "1", "a2": "1", "a3": "1", "b3": "1", "c3": "1", "d3": "1", "d2": "1", "d1": "1"};

  assert("Wrong end response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "Start and end of the snake should be in the shaded areas", errors: ["d1"]});
}),

);
