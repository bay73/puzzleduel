// Puzzle 4x4 (o is a circle) and its solution:
//   +---+---+---+---+
//   |   o   |       |      a1 b1 c1 d1
//   +---+---+   o   +
//   |   |   |       |      a2 b2 c2 d2
//   +   + o +---+---+
//   | o |   |       |      a3 b3 c3 d3
//   +   +---+ o +---+
//   |   |       | o |      a4 b4 c4 d4
//   +---+---+---+---+
// Circles: in the centers of a3 and d4, at the right edge of a1 ("a1-1"),
// at the bottom edges of b2 and c3 ("b2-2", "c3-2"), at the bottom right corner of c1 ("c1-2").
checkerTestSuite("spiral_galaxies", "Spiral galaxies",

test('Correct solution',(suite) => {
  let clues = {"a3": "small_circle", "d4": "small_circle",
               "edges": {"a1-1": "black_circle", "b2-2": "black_circle", "c3-2": "black_circle"},
               "nodes": {"c1-2": "black_circle"}};
  let data = {"areas": [["a1","b1"], ["c1","d1","c2","d2"], ["a2","a3","a4"], ["b2","b3"], ["c3","d3","b4","c4"], ["d4"]]};

  assert("Correct solution response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "OK"});
}),

test('Two circles in one area',(suite) => {
  let clues = {"a3": "small_circle", "d4": "small_circle",
               "edges": {"a1-1": "black_circle", "b2-2": "black_circle", "c3-2": "black_circle"},
               "nodes": {"c1-2": "black_circle"}};
  // Cell d4 with its circle is joined to the area c3-d3-b4-c4.
  let data = {"areas": [["a1","b1"], ["c1","d1","c2","d2"], ["a2","a3","a4"], ["b2","b3"], ["c3","d3","b4","c4","d4"]]};

  assert("Two circles response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "Each area should contain exactly one circle", errors: ["c3","d3","b4","c4","d4"]});
}),

test('No circles in the area',(suite) => {
  // No circle in d4.
  let clues = {"a3": "small_circle",
               "edges": {"a1-1": "black_circle", "b2-2": "black_circle", "c3-2": "black_circle"},
               "nodes": {"c1-2": "black_circle"}};
  let data = {"areas": [["a1","b1"], ["c1","d1","c2","d2"], ["a2","a3","a4"], ["b2","b3"], ["c3","d3","b4","c4"], ["d4"]]};

  assert("No circles response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "Each area should contain exactly one circle", errors: ["d4"]});
}),

test('Area is not symmetrical',(suite) => {
  let clues = {"a3": "small_circle", "d4": "small_circle",
               "edges": {"a1-1": "black_circle", "b2-2": "black_circle", "c3-2": "black_circle"},
               "nodes": {"c1-2": "black_circle"}};
  // Cell b4 is moved to the area a2-a3-a4, the circle in a3 is not the center of symmetry of this area anymore.
  let data = {"areas": [["a1","b1"], ["c1","d1","c2","d2"], ["a2","a3","a4","b4"], ["b2","b3"], ["c3","d3","c4"], ["d4"]]};

  assert("Not symmetrical response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "Circle should be at the center of rotational symmetry the area", errors: ["a2","a3","a4","b4"]});
}),

test('Cell without area',(suite) => {
  let clues = {"a3": "small_circle", "d4": "small_circle", "edges": {"a1-1": "black_circle", "b2-2": "black_circle", "c3-2": "black_circle"}, "nodes": {"c1-2": "black_circle"}};
  // Solution without the area d4: d4 is the first cell which doesn't belong to any area.
  let data = {"areas": [["a1", "b1"], ["c1", "d1", "c2", "d2"], ["a2", "a3", "a4"], ["b2", "b3"], ["c3", "d3", "b4", "c4"]]};

  assert("Cell without area response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "Each cell should belong to exactly one area", errors: ["d4"]});
}),

test('Cell in two areas',(suite) => {
  let clues = {"a3": "small_circle", "d4": "small_circle", "edges": {"a1-1": "black_circle", "b2-2": "black_circle", "c3-2": "black_circle"}, "nodes": {"c1-2": "black_circle"}};
  // Solution with an extra area which consists of the cell a1.
  let data = {"areas": [["a1", "b1"], ["c1", "d1", "c2", "d2"], ["a2", "a3", "a4"], ["b2", "b3"], ["c3", "d3", "b4", "c4"], ["d4"], ["a1"]]};

  assert("Cell in two areas response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "Each cell should belong to exactly one area", errors: ["a1"]});
}),

);
