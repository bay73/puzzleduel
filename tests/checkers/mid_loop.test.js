// Puzzle 6x4 and its solution (o is a dot in the cell center, * is a dot on the border of two cells):
//   +---+   +---+   .   .      a1 b1 c1 d1 e1 f1
//   |   |   |   |
//   |   o   o   |   .   .      a2 b2 c2 d2 e2 f2
//   *   |   |   *
//   |   +-*-+   |   .   .      a3 b3 c3 d3 e3 f3
//   |           |
//   +---+---+---+   .   .      a4 b4 c4 d4 e4 f4
// Dots in the cells b2 and c2, dots on the borders b3/c3, a2/a3 and d2/d3.
checkerTestSuite("mid_loop", "Mid-loop",

test('Correct solution',(suite) => {
  let clues = {"b2": "small_circle", "c2": "small_circle", "edges": {"b3-1": "black_circle", "a2-2": "black_circle", "d2-2": "black_circle"}};
  let data = {"connectors": {"a1-h": "1", "a1-v": "1", "b1-v": "1", "c1-h": "1", "c1-v": "1", "d1-v": "1", "a2-v": "1", "b2-v": "1", "c2-v": "1", "d2-v": "1", "a3-v": "1", "b3-h": "1", "d3-v": "1", "a4-h": "1", "b4-h": "1", "c4-h": "1"}};

  assert("Correct solution response").that(Checker.check("6x4", clues, data)).isEqualTo({status: "OK"});
}),

test('Loop turns in the cell with a dot',(suite) => {
  let clues = {"b2": "small_circle", "c2": "small_circle", "edges": {"b3-1": "black_circle", "a2-2": "black_circle", "d2-2": "black_circle"}};
  // Loop c1-e1-e2-d2-d3-a3-a2-c2-c1 turns in the cell c2.
  let data = {"connectors": {"c1-h": "1", "c1-v": "1", "d1-h": "1", "e1-v": "1", "a2-h": "1", "a2-v": "1", "b2-h": "1", "d2-h": "1", "d2-v": "1", "a3-h": "1", "b3-h": "1", "c3-h": "1"}};

  assert("Turn in the dot response").that(Checker.check("6x4", clues, data)).isEqualTo({status: "Loop should pass straight through all circles", errors: ["c2"]});
}),

test('Loop does not pass through a dot on the border',(suite) => {
  let clues = {"b2": "small_circle", "c2": "small_circle", "edges": {"b3-1": "black_circle", "a2-2": "black_circle", "d2-2": "black_circle"}};
  // Loop goes d1-e1-e3-d3-d4 and doesn't cross the border between d2 and d3.
  let data = {"connectors": {"a1-h": "1", "a1-v": "1", "b1-v": "1", "c1-h": "1", "c1-v": "1", "d1-h": "1", "e1-v": "1", "a2-v": "1", "b2-v": "1", "c2-v": "1", "e2-v": "1", "a3-v": "1", "b3-h": "1", "d3-h": "1", "d3-v": "1", "a4-h": "1", "b4-h": "1", "c4-h": "1"}};

  assert("Missed dot response").that(Checker.check("6x4", clues, data)).isEqualTo({status: "Loop should pass straight through all circles", errors: ["d2", "d3"]});
}),

test('No loop',(suite) => {
  // The same puzzle without the dot between b3 and c3.
  let clues = {"b2": "small_circle", "c2": "small_circle", "edges": {"a2-2": "black_circle", "d2-2": "black_circle"}};
  // All dots are passed by separate vertical lines, which do not form a loop.
  let data = {"connectors": {"a2-v": "1", "b1-v": "1", "b2-v": "1", "c1-v": "1", "c2-v": "1", "d2-v": "1"}};

  assert("No loop response").that(Checker.check("6x4", clues, data)).isEqualTo({status: "There should be single loop passing through some cells"});
}),

test('Loop with bifurcation',(suite) => {
  let clues = {"b2": "small_circle", "c2": "small_circle", "edges": {"b3-1": "black_circle", "a2-2": "black_circle", "d2-2": "black_circle"}};
  // Extra line c3-c4: three lines meet in the cell c3.
  let data = {"connectors": {"a1-h": "1", "a1-v": "1", "b1-v": "1", "c1-h": "1", "c1-v": "1", "d1-v": "1", "a2-v": "1", "b2-v": "1", "c2-v": "1", "d2-v": "1", "a3-v": "1", "b3-h": "1", "c3-v": "1", "d3-v": "1", "a4-h": "1", "b4-h": "1", "c4-h": "1"}};

  assert("Bifurcation response").that(Checker.check("6x4", clues, data)).isEqualTo({status: "There should be single loop without bifurcations", errors: ["c3"]});
}),

test('Dot is not in the middle of the segment',(suite) => {
  let clues = {"b2": "small_circle", "c2": "small_circle", "edges": {"b3-1": "black_circle", "a2-2": "black_circle", "d2-2": "black_circle"}};
  // Loop goes d1-d3-e3-e4-d4: segment d1-d3 has length 3 and the dot between d2 and d3 is not in its middle.
  let data = {"connectors": {"a1-h": "1", "a1-v": "1", "b1-v": "1", "c1-h": "1", "c1-v": "1", "d1-v": "1", "a2-v": "1", "b2-v": "1", "c2-v": "1", "d2-v": "1", "a3-v": "1", "b3-h": "1", "d3-h": "1", "e3-v": "1", "a4-h": "1", "b4-h": "1", "c4-h": "1", "d4-h": "1"}};

  assert("Dot not in the middle response").that(Checker.check("6x4", clues, data)).isEqualTo({status: "Dot should be in the middle of the corresponding straight segment", errors: ["d2", "d3"]});
}),

test('Two dots at one segment',(suite) => {
  let clues = {"b2": "small_circle", "c2": "small_circle", "edges": {"b3-1": "black_circle", "a2-2": "black_circle", "d2-2": "black_circle"}};
  // Loop a2-d2-d3-a3-a2: segment a2-d2 contains both dots b2 and c2.
  let data = {"connectors": {"a2-h": "1", "a2-v": "1", "b2-h": "1", "c2-h": "1", "d2-v": "1", "a3-h": "1", "b3-h": "1", "c3-h": "1"}};

  assert("Two dots at one segment response").that(Checker.check("6x4", clues, data)).isEqualTo({status: "Loop should have not more than one dot at each straight segment", errors: ["c2", "b2"]});
}),

test('Two loops',(suite) => {
  let clues = {"b2": "small_circle", "c2": "small_circle", "edges": {"b3-1": "black_circle", "a2-2": "black_circle", "d2-2": "black_circle"}};
  // Second loop e1-f1-f2-e2 is drawn besides the correct one.
  let data = {"connectors": {"a1-h": "1", "a1-v": "1", "b1-v": "1", "c1-h": "1", "c1-v": "1", "d1-v": "1", "e1-h": "1", "e1-v": "1", "f1-v": "1", "a2-v": "1", "b2-v": "1", "c2-v": "1", "d2-v": "1", "e2-h": "1", "a3-v": "1", "b3-h": "1", "d3-v": "1", "a4-h": "1", "b4-h": "1", "c4-h": "1"}};

  assert("Two loops response").that(Checker.check("6x4", clues, data)).isEqualTo({status: "There should be single loop passing through some cells", errors: []});
}),

// The loop is traced from its top left corner (a1 in the tests below),
// the dots on the borders of this cell belong to the first and to the last segments.
test('Dot on the right border of the first cell is not in the middle',(suite) => {
  // The loop goes along the border of the 3x2 grid. The segment a1-c1 has the middle in b1,
  // but the dot is between a1 and b1.
  let clues = {"edges": {"a1-1": "black_circle"}};
  let data = {"connectors": {"a1-h": "1", "b1-h": "1", "a1-v": "1", "c1-v": "1", "a2-h": "1", "b2-h": "1"}};

  assert("Dot on the right border response").that(Checker.check("3x2", clues, data)).isEqualTo({status: "Dot should be in the middle of the corresponding straight segment", errors: ["a1", "b1"]});
}),

test('Dot on the bottom border of the first cell is not in the middle',(suite) => {
  // The loop goes along the border of the 2x3 grid. The segment a1-a3 has the middle in a2,
  // but the dot is between a1 and a2.
  let clues = {"edges": {"a1-2": "black_circle"}};
  let data = {"connectors": {"a1-h": "1", "a1-v": "1", "a2-v": "1", "b1-v": "1", "b2-v": "1", "a3-h": "1"}};

  assert("Dot on the bottom border response").that(Checker.check("2x3", clues, data)).isEqualTo({status: "Dot should be in the middle of the corresponding straight segment", errors: ["a1", "a2"]});
}),

test('Dots on the borders of the first cell are in the middle',(suite) => {
  // The loop goes along the border of the 2x2 grid: both dots are in the middle of the segments a1-b1 and a1-a2.
  let clues = {"edges": {"a1-1": "black_circle", "a1-2": "black_circle"}};
  let data = {"connectors": {"a1-h": "1", "a1-v": "1", "b1-v": "1", "a2-h": "1"}};

  assert("Dots in the middle response").that(Checker.check("2x2", clues, data)).isEqualTo({status: "OK"});
}),

test('Two dots at the first segment',(suite) => {
  // The loop goes along the border of the 4x2 grid. The segment a1-d1 contains
  // the dot between a1 and b1 and the dot between b1 and c1 (which is in the middle).
  let clues = {"edges": {"a1-1": "black_circle", "b1-1": "black_circle"}};
  let data = {"connectors": {"a1-h": "1", "b1-h": "1", "c1-h": "1", "a1-v": "1", "d1-v": "1", "a2-h": "1", "b2-h": "1", "c2-h": "1"}};

  assert("Two dots at the first segment response").that(Checker.check("4x2", clues, data)).isEqualTo({status: "Loop should have not more than one dot at each straight segment", errors: ["b1", "a1"]});
}),

);
