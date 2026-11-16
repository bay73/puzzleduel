// Hexagonal grid 3x3 (side of the hexagon is 3 cells):
//             c1
//          b1    d2
//       a1    c2    e3
//          b2    d3
//       a2    c3    e4
//          b3    d4
//       a3    c4    e5
//          b4    d5
//             c5
// Areas:
//   A: a1 b1 c1 c2 d2
//   B: d3 e3 d4 e4 c5 d5 e5
//   C: a2 b2 a3 b3 c3 b4 c4
// Solution (# is a shaded cell): L-tetrahex in A, S-tetrahex in B and Y-tetrahex in C:
//              #
//           #     #
//        #     .     #
//           .     .
//        #     #     #
//           #     #
//        .     .     .
//           #     #
//              .
checkerTestSuite("slicy", "Slicy",

test('Correct solution',(suite) => {
  let clues = {"areas": [["a1","b1","c1","c2","d2"], ["d3","e3","d4","e4","c5","d5","e5"], ["a2","b2","a3","b3","c3","b4","c4"]]};
  let data = {"a1": "1", "b1": "1", "c1": "1", "d2": "1",
              "e3": "1", "d4": "1", "e4": "1", "d5": "1",
              "a2": "1", "b3": "1", "c3": "1", "b4": "1"};

  assert("Correct solution response").that(Checker.check("3x3", clues, data)).isEqualTo({status: "OK"});
}),

test('Three shaded cells with common point',(suite) => {
  let clues = {"areas": [["a1","b1","c1","c2","d2"], ["d3","e3","d4","e4","c5","d5","e5"], ["a2","b2","a3","b3","c3","b4","c4"]]};
  // Extra shaded cell b2 touches both a1 and a2.
  let data = {"a1": "1", "b1": "1", "c1": "1", "d2": "1",
              "e3": "1", "d4": "1", "e4": "1", "d5": "1",
              "a2": "1", "b2": "1", "b3": "1", "c3": "1", "b4": "1"};

  assert("Common point response").that(Checker.check("3x3", clues, data)).isEqualTo({status: "Three shaded cells cannot have common point", errors: ["a1", "a2", "b2"]});
}),

test('Shaded cells are not connected',(suite) => {
  let clues = {"areas": [["a1","b1","c1","c2","d2"], ["d3","e3","d4","e4","c5","d5","e5"], ["a2","b2","a3","b3","c3","b4","c4"]]};
  // Without a2 and e3 the tetrahex a1-b1-c1-d2 is separated from other shaded cells.
  let data = {"a1": "1", "b1": "1", "c1": "1", "d2": "1",
              "d4": "1", "e4": "1", "d5": "1",
              "b3": "1", "c3": "1", "b4": "1"};

  assert("Not connected response").that(Checker.check("3x3", clues, data)).isEqualTo({status: "Black area should be connected"});
}),

test('Wrong number of shaded cells in the area',(suite) => {
  let clues = {"areas": [["a1","b1","c1","c2","d2"], ["d3","e3","d4","e4","c5","d5","e5"], ["a2","b2","a3","b3","c3","b4","c4"]]};
  // Without a2 there are only three shaded cells in the area C.
  let data = {"a1": "1", "b1": "1", "c1": "1", "d2": "1",
              "e3": "1", "d4": "1", "e4": "1", "d5": "1",
              "b3": "1", "c3": "1", "b4": "1"};

  assert("Three cells response").that(Checker.check("3x3", clues, data)).isEqualTo({
    status: "Black cells in each area should form valid tetrahex",
    errors: ["a2","b2","a3","b3","c3","b4","c4"]});
}),

test('Shaded cells in the area are not a tetrahex',(suite) => {
  let clues = {"areas": [["a1","b1","c1","c2","d2"], ["d3","e3","d4","e4","c5","d5","e5"], ["a2","b2","a3","b3","c3","b4","c4"]]};
  // Shaded cells a2, a3, b4 and c3 of the area C are not connected inside the area.
  let data = {"a1": "1", "b1": "1", "c1": "1", "d2": "1",
              "e3": "1", "d4": "1", "e4": "1", "d5": "1",
              "a2": "1", "a3": "1", "c3": "1", "b4": "1"};

  assert("Not tetrahex response").that(Checker.check("3x3", clues, data)).isEqualTo({
    status: "Black cells in each area should form valid tetrahex",
    errors: ["a2","b2","a3","b3","c3","b4","c4"]});
}),

test('Same tetrahexes share an edge',(suite) => {
  let clues = {"areas": [["a1","b1","c1","c2","d2"], ["d3","e3","d4","e4","c5","d5","e5"], ["a2","b2","a3","b3","c3","b4","c4"]]};
  // The tetrahex in the area B is e3-e4-e5-d5. It is L-tetrahex and it touches L-tetrahex of the area A.
  let data = {"a1": "1", "b1": "1", "c1": "1", "d2": "1",
              "e3": "1", "e4": "1", "d5": "1", "e5": "1",
              "a2": "1", "b3": "1", "c3": "1", "b4": "1"};

  assert("Same tetrahexes response").that(Checker.check("3x3", clues, data)).isEqualTo({status: "Tetrahexes of the same type shoudln't share an edge", errors: ["d2", "e3"]});
}),

);
