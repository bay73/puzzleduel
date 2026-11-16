// Puzzle 5x3 and its solution (the loop crosses itself in the cell marked with +,
// numbered cells should be passed straight and in order 1-2-3-4-1):
//   ┌──2──┐  ┌──┐      a1 b1 c1 d1 e1
//   1  ┌──+──┘  4      a2 b2 c2 d2 e2
//   └──┘  └──3──┘      a3 b3 c3 d3 e3
// The loop is submitted as the list of connectors: <cell>-h connects the cell with its right neighbour,
// <cell>-v connects the cell with its bottom neighbour.
checkerTestSuite("railroad", "Railroad",

test('Correct solution',(suite) => {
  let clues = {"c2": "+", "a2": "1", "b1": "2", "d3": "3", "e2": "4"};
  let data = {"connectors": {
    "a1-h": 1, "b1-h": 1, "d1-h": 1, "b2-h": 1, "c2-h": 1, "a3-h": 1, "c3-h": 1, "d3-h": 1,
    "a1-v": 1, "c1-v": 1, "d1-v": 1, "e1-v": 1, "a2-v": 1, "b2-v": 1, "c2-v": 1, "e2-v": 1}};

  assert("Correct solution response").that(Checker.check("5x3", clues, data)).isEqualTo({status: "OK"});
}),

test('No loop',(suite) => {
  let clues = {"c2": "+", "a2": "1", "b1": "2", "d3": "3", "e2": "4"};
  // Nothing is drawn.
  let data = {};

  assert("No loop response").that(Checker.check("5x3", clues, data)).isEqualTo({status: "There should be single loop passing through all cells", errors: ["a1"]});
}),

test('Loop does not pass through all cells',(suite) => {
  let clues = {"a2": "1", "b1": "2", "d3": "3", "e2": "4"};
  // The loop goes along the border of the grid and doesn't visit b2, c2 and d2.
  let data = {"connectors": {
    "a1-h": 1, "b1-h": 1, "c1-h": 1, "d1-h": 1, "a3-h": 1, "b3-h": 1, "c3-h": 1, "d3-h": 1,
    "a1-v": 1, "e1-v": 1, "a2-v": 1, "e2-v": 1}};

  assert("Not all cells response").that(Checker.check("5x3", clues, data)).isEqualTo({status: "There should be single loop passing through all cells", errors: ["b2"]});
}),

test('Intersection in not marked cell',(suite) => {
  // The loop crosses itself in c2, but the cell is not marked.
  let clues = {"a2": "1", "b1": "2", "d3": "3", "e2": "4"};
  let data = {"connectors": {
    "a1-h": 1, "b1-h": 1, "d1-h": 1, "b2-h": 1, "c2-h": 1, "a3-h": 1, "c3-h": 1, "d3-h": 1,
    "a1-v": 1, "c1-v": 1, "d1-v": 1, "e1-v": 1, "a2-v": 1, "b2-v": 1, "c2-v": 1, "e2-v": 1}};

  assert("Intersection in not marked cell response").that(Checker.check("5x3", clues, data)).isEqualTo({status: "The loop can't have an intersection outside of the marked cells", errors: ["c2"]});
}),

test('Loop with a branch',(suite) => {
  let clues = {"c2": "+", "a2": "1", "b1": "2", "d3": "3", "e2": "4"};
  // Extra connector between d2 and e2 makes a branch in e2.
  let data = {"connectors": {
    "a1-h": 1, "b1-h": 1, "d1-h": 1, "b2-h": 1, "c2-h": 1, "d2-h": 1, "a3-h": 1, "c3-h": 1, "d3-h": 1,
    "a1-v": 1, "c1-v": 1, "d1-v": 1, "e1-v": 1, "a2-v": 1, "b2-v": 1, "c2-v": 1, "e2-v": 1}};

  assert("Loop with a branch response").that(Checker.check("5x3", clues, data)).isEqualTo({status: "The loop can't have an intersection outside of the marked cells", errors: ["e2"]});
}),

test('No intersection in marked cell',(suite) => {
  // Cell d3 is marked, but the loop just goes through it.
  let clues = {"c2": "+", "d3": "+", "a2": "1", "b1": "2", "e2": "3"};
  let data = {"connectors": {
    "a1-h": 1, "b1-h": 1, "d1-h": 1, "b2-h": 1, "c2-h": 1, "a3-h": 1, "c3-h": 1, "d3-h": 1,
    "a1-v": 1, "c1-v": 1, "d1-v": 1, "e1-v": 1, "a2-v": 1, "b2-v": 1, "c2-v": 1, "e2-v": 1}};

  assert("No intersection in marked cell response").that(Checker.check("5x3", clues, data)).isEqualTo({status: "The loop should have an intersection at the marked cell", errors: ["d3"]});
}),

test('Turn in numbered cell',(suite) => {
  // Number 2 is placed to c1, where the loop turns.
  let clues = {"c2": "+", "a2": "1", "c1": "2", "d3": "3", "e2": "4"};
  let data = {"connectors": {
    "a1-h": 1, "b1-h": 1, "d1-h": 1, "b2-h": 1, "c2-h": 1, "a3-h": 1, "c3-h": 1, "d3-h": 1,
    "a1-v": 1, "c1-v": 1, "d1-v": 1, "e1-v": 1, "a2-v": 1, "b2-v": 1, "c2-v": 1, "e2-v": 1}};

  assert("Turn in numbered cell response").that(Checker.check("5x3", clues, data)).isEqualTo({status: "The line shouldn't have turn at numbered cells", errors: ["c1"]});
}),

test('Wrong order of numbered cells',(suite) => {
  // Numbers 3 and 4 are swapped, so the loop passes the numbers in order 1-2-4-3.
  let clues = {"c2": "+", "a2": "1", "b1": "2", "d3": "4", "e2": "3"};
  let data = {"connectors": {
    "a1-h": 1, "b1-h": 1, "d1-h": 1, "b2-h": 1, "c2-h": 1, "a3-h": 1, "c3-h": 1, "d3-h": 1,
    "a1-v": 1, "c1-v": 1, "d1-v": 1, "e1-v": 1, "a2-v": 1, "b2-v": 1, "c2-v": 1, "e2-v": 1}};

  assert("Wrong order response").that(Checker.check("5x3", clues, data)).isEqualTo({status: "The line should pass numbered cells in order", errors: ["b1", "d3"]});
}),

);
