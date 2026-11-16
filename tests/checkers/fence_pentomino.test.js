// Puzzle 6x6 with pentominoes I and L and its solution (x is a cell inside a loop).
// A clue shows the number of loop segments around the cell:
//   x x x x x 1      a1 b1 c1 d1 e1 f1
//   2 . . . . .      a2 b2 c2 d2 e2 f2
//   x . . . . .      a3 b3 c3 d3 e3 f3
//   x 1 . . . .      a4 b4 c4 d4 e4 f4
//   x . . 0 . .      a5 b5 c5 d5 e5 f5
//   x x . . . .      a6 b6 c6 d6 e6 f6
// Edge "c2-1" is the right side of c2: 0 - top, 1 - right, 2 - bottom, 3 - left.
checkerTestSuite("fence_pentomino", "Pentomino fences",

test('Correct solution',(suite) => {
  let clues = {"f1": "1", "a2": "2", "b4": "1", "d5": "0"};
  let data = {"edges": {"a1-0": "1", "a1-2": "1", "a1-3": "1", "b1-0": "1", "b1-2": "1", "c1-0": "1", "c1-2": "1", "d1-0": "1", "d1-2": "1", "e1-0": "1", "e1-1": "1", "e1-2": "1", "a2-2": "1", "a3-1": "1", "a3-3": "1", "a4-1": "1", "a4-3": "1", "a5-1": "1", "a5-3": "1", "b5-2": "1", "a6-2": "1", "a6-3": "1", "b6-1": "1", "b6-2": "1"}};

  assert("Correct solution response").that(Checker.check("6x6-IL", clues, data)).isEqualTo({status: "OK"});
}),

test('No loops',(suite) => {
  let clues = {"f1": "1", "a2": "2", "b4": "1", "d5": "0"};
  // Nothing is drawn.
  let data = {};

  assert("No loops response").that(Checker.check("6x6-IL", clues, data)).isEqualTo({status: "There should be few loops without bifurcations"});
}),

test('Loop is not closed',(suite) => {
  let clues = {"f1": "1", "a2": "2", "b4": "1", "d5": "0"};
  // The right side of e1 is missing.
  let data = {"edges": {"a1-0": "1", "a1-2": "1", "a1-3": "1", "b1-0": "1", "b1-2": "1", "c1-0": "1", "c1-2": "1", "d1-0": "1", "d1-2": "1", "e1-0": "1", "e1-2": "1", "a2-2": "1", "a3-1": "1", "a3-3": "1", "a4-1": "1", "a4-3": "1", "a5-1": "1", "a5-3": "1", "b5-2": "1", "a6-2": "1", "a6-3": "1", "b6-1": "1", "b6-2": "1"}};

  assert("Loop is not closed response").that(Checker.check("6x6-IL", clues, data)).isEqualTo({status: "There should be few loops without bifurcations"});
}),

test('Wrong number of segments around the clue',(suite) => {
  // There are no loop segments around d5, but the clue requires one.
  let clues = {"f1": "1", "a2": "2", "b4": "1", "d5": "1"};
  let data = {"edges": {"a1-0": "1", "a1-2": "1", "a1-3": "1", "b1-0": "1", "b1-2": "1", "c1-0": "1", "c1-2": "1", "d1-0": "1", "d1-2": "1", "e1-0": "1", "e1-1": "1", "e1-2": "1", "a2-2": "1", "a3-1": "1", "a3-3": "1", "a4-1": "1", "a4-3": "1", "a5-1": "1", "a5-3": "1", "b5-2": "1", "a6-2": "1", "a6-3": "1", "b6-1": "1", "b6-2": "1"}};

  assert("Wrong clue response").that(Checker.check("6x6-IL", clues, data)).isEqualTo({status: "The clue is not correct", errors: ["d5"]});
}),

test('Pentominoes touch diagonally',(suite) => {
  let clues = {"f1": "1", "a2": "2", "b4": "1", "d5": "0"};
  // Pentomino I is placed to b2-f2 (all the clues are still correct), so its cell b2 touches cell a3 of pentomino L.
  let data = {"edges": {"b1-2": "1", "c1-2": "1", "d1-2": "1", "e1-2": "1", "f1-2": "1", "a2-1": "1", "a2-2": "1", "b2-2": "1", "c2-2": "1", "d2-2": "1", "e2-2": "1", "f2-1": "1", "f2-2": "1", "a3-1": "1", "a3-3": "1", "a4-1": "1", "a4-3": "1", "a5-1": "1", "a5-3": "1", "b5-2": "1", "a6-2": "1", "a6-3": "1", "b6-1": "1", "b6-2": "1"}};

  assert("Touching pentominoes response").that(Checker.check("6x6-IL", clues, data)).isEqualTo({status: "Elements shouldn't touch", errors: ["b2", "a3"]});
}),

test('Area is not a pentomino',(suite) => {
  let clues = {"f1": "1", "a2": "2", "b4": "1", "d5": "0"};
  // The second loop goes around four cells a3-a6 only.
  let data = {"edges": {"a1-0": "1", "a1-2": "1", "a1-3": "1", "b1-0": "1", "b1-2": "1", "c1-0": "1", "c1-2": "1", "d1-0": "1", "d1-2": "1", "e1-0": "1", "e1-1": "1", "e1-2": "1", "a2-2": "1", "a3-1": "1", "a3-3": "1", "a4-1": "1", "a4-3": "1", "a5-1": "1", "a5-3": "1", "a6-1": "1", "a6-2": "1", "a6-3": "1"}};

  assert("Not a pentomino response").that(Checker.check("6x6-IL", clues, data)).isEqualTo({status: "Each marked area should form a pentomino from the given set", errors: ["a3", "a4", "a5", "a6"]});
}),

test('Pentomino is not from the given set',(suite) => {
  let clues = {"f1": "1", "a2": "2", "b4": "1", "d5": "0"};
  let data = {"edges": {"a1-0": "1", "a1-2": "1", "a1-3": "1", "b1-0": "1", "b1-2": "1", "c1-0": "1", "c1-2": "1", "d1-0": "1", "d1-2": "1", "e1-0": "1", "e1-1": "1", "e1-2": "1", "a2-2": "1", "a3-1": "1", "a3-3": "1", "a4-1": "1", "a4-3": "1", "a5-1": "1", "a5-3": "1", "b5-2": "1", "a6-2": "1", "a6-3": "1", "b6-1": "1", "b6-2": "1"}};

  // The set of the puzzle consists of I and V, so pentomino L is not allowed.
  assert("Wrong pentomino response").that(Checker.check("6x6-IV", clues, data)).isEqualTo({status: "Each marked area should form a pentomino from the given set", errors: ["a3", "a4", "a5", "a6", "b6"]});
}),

test('Pentomino is used twice',(suite) => {
  let clues = {"f1": "1", "a2": "2", "b4": "1", "d5": "0"};
  // Loops go around a1-e1 and a3-e3, so I is used twice (and L is not used).
  let data = {"edges": {"a1-0": "1", "a1-2": "1", "a1-3": "1", "b1-0": "1", "b1-2": "1", "c1-0": "1", "c1-2": "1", "d1-0": "1", "d1-2": "1", "e1-0": "1", "e1-1": "1", "e1-2": "1", "a2-2": "1", "b2-2": "1", "c2-2": "1", "d2-2": "1", "e2-2": "1", "a3-2": "1", "a3-3": "1", "b3-2": "1", "c3-2": "1", "d3-2": "1", "e3-1": "1", "e3-2": "1"}};

  assert("Pentomino used twice response").that(Checker.check("6x6-IL", clues, data)).isEqualTo({status: "Each element should be used exactly same number of times as given", errors: ["a1", "a3", "b1", "b3", "c1", "c3", "d1", "d3", "e1", "e3"]});
}),

);
