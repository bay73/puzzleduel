// Puzzle 5x5 with pentominoes L and V and its solution (x is a cell which can't be used,
// o is the marked node where pentominoes should touch by corner):
//   V V V . x      a1 b1 c1 d1 e1
//   V . . . .      a2 b2 c2 d2 e2
//   V . . . L      a3 b3 c3 d3 e3
//    o
//   . L L L L      a4 b4 c4 d4 e4
//   . . . . .      a5 b5 c5 d5 e5
checkerTestSuite("pentomino_touch", "Touching Pentomino",

test('Correct solution',(suite) => {
  let clues = {"e1": "cross", "nodes": {"a3-2": "1"}};
  let data = {"a1": "1", "b1": "1", "c1": "1", "a2": "1", "a3": "1", "e3": "1", "b4": "1", "c4": "1", "d4": "1", "e4": "1"};

  assert("Correct solution response").that(Checker.check("5x5-LV", clues, data)).isEqualTo({status: "OK"});
}),

test('Area is not a pentomino',(suite) => {
  let clues = {"e1": "cross", "nodes": {"a3-2": "1"}};
  // Without e3 the second area consists of 4 cells only.
  let data = {"a1": "1", "b1": "1", "c1": "1", "a2": "1", "a3": "1", "b4": "1", "c4": "1", "d4": "1", "e4": "1"};

  assert("Area is not a pentomino response").that(Checker.check("5x5-LV", clues, data)).isEqualTo({status: "Each marked area should form a pentomino from the given set", errors: ["b4", "c4", "d4", "e4"]});
}),

test('Pentomino is not from the given set',(suite) => {
  let clues = {"e1": "cross", "nodes": {"a3-2": "1"}};
  // Cell d5 is used instead of e3, so the second area is Y pentomino, which is not in the set.
  let data = {"a1": "1", "b1": "1", "c1": "1", "a2": "1", "a3": "1", "b4": "1", "c4": "1", "d4": "1", "e4": "1", "d5": "1"};

  assert("Pentomino is not from the set response").that(Checker.check("5x5-LV", clues, data)).isEqualTo({status: "Each marked area should form a pentomino from the given set", errors: ["b4", "c4", "d4", "e4", "d5"]});
}),

test('Pentomino is used twice',(suite) => {
  let clues = {"e1": "cross", "nodes": {"a3-2": "1"}};
  // The second area (c4, d4, e4, e3, e2) is one more V pentomino, L is not used.
  let data = {"a1": "1", "b1": "1", "c1": "1", "a2": "1", "a3": "1", "e2": "1", "e3": "1", "c4": "1", "d4": "1", "e4": "1"};

  assert("Pentomino is used twice response").that(Checker.check("5x5-LV", clues, data)).isEqualTo({status: "Each element should be used exactly same number of times as given", errors: ["a1", "a2", "a3", "b1", "c1", "c4", "d4", "e2", "e3", "e4"]});
}),

test('Pentominoes touch at not marked node',(suite) => {
  // Cells a3 and b4 touch by corner, but the node between them is not marked.
  let clues = {"e1": "cross"};
  let data = {"a1": "1", "b1": "1", "c1": "1", "a2": "1", "a3": "1", "e3": "1", "b4": "1", "c4": "1", "d4": "1", "e4": "1"};

  assert("Touch at not marked node response").that(Checker.check("5x5-LV", clues, data)).isEqualTo({status: "Elements should touch at marked nodes", errors: ["a3", "b3", "a4", "b4"]});
}),

test('Pentominoes do not touch at marked node',(suite) => {
  let clues = {"e1": "cross", "nodes": {"a3-2": "1"}};
  // L pentomino is moved one row down (e4, b5, c5, d5, e5) and doesn't touch V at the marked node.
  let data = {"a1": "1", "b1": "1", "c1": "1", "a2": "1", "a3": "1", "e4": "1", "b5": "1", "c5": "1", "d5": "1", "e5": "1"};

  assert("No touch at marked node response").that(Checker.check("5x5-LV", clues, data)).isEqualTo({status: "Elements should touch at marked nodes", errors: ["a3", "b3", "a4", "b4"]});
}),

);
