// Puzzle 4x4 (P - phone, W - white circle, B - black circle, the digit is the number of turns)
// and its solution:
//   W1 .  .  .       W1--+--+--+
//   B  .  .  P       B --+--+--P
//   P  .  .  W0      P --+--+--W0
//   .  .  .  B1      +---+--+--B1   (a4 is connected to a3)
checkerTestSuite("chat_room", "Chat room",

test('Correct solution',(suite) => {
  let clues = {"a1": "white_1", "a2": "black_circle", "d2": "phone", "a3": "phone", "d3": "white_0", "d4": "black_1"};
  let data = {"connectors": {
    "a1-h": 1, "b1-h": 1, "c1-h": 1, "d1-v": 1, "a2-h": 1, "b2-h": 1, "c2-h": 1,
    "a3-h": 1, "b3-h": 1, "c3-h": 1, "a3-v": 1, "a4-h": 1, "b4-h": 1, "c4-h": 1}};

  assert("Correct solution response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "OK"});
}),

test('Two white circles connected to one phone',(suite) => {
  // Circle in a2 is white, so the phone in d2 is connected to white circles a1 and a2.
  let clues = {"a1": "white_1", "a2": "white_circle", "d2": "phone", "a3": "phone", "d3": "white_0", "d4": "black_1"};
  let data = {"connectors": {
    "a1-h": 1, "b1-h": 1, "c1-h": 1, "d1-v": 1, "a2-h": 1, "b2-h": 1, "c2-h": 1,
    "a3-h": 1, "b3-h": 1, "c3-h": 1, "a3-v": 1, "a4-h": 1, "b4-h": 1, "c4-h": 1}};

  assert("Two white circles response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "Each phone should be connected to one white circle", errors: ["d2"]});
}),

test('Two black circles connected to one phone',(suite) => {
  // Circle in a1 is black, so the phone in d2 is connected to black circles a1 and a2.
  let clues = {"a1": "black_1", "a2": "black_circle", "d2": "phone", "a3": "phone", "d3": "white_0", "d4": "black_1"};
  let data = {"connectors": {
    "a1-h": 1, "b1-h": 1, "c1-h": 1, "d1-v": 1, "a2-h": 1, "b2-h": 1, "c2-h": 1,
    "a3-h": 1, "b3-h": 1, "c3-h": 1, "a3-v": 1, "a4-h": 1, "b4-h": 1, "c4-h": 1}};

  assert("Two black circles response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "Each phone should be connected to one black circle", errors: ["d2"]});
}),

test('Wrong number of turns',(suite) => {
  // The line from a1 has one turn (in d1), but the clue requires two.
  let clues = {"a1": "white_2", "a2": "black_circle", "d2": "phone", "a3": "phone", "d3": "white_0", "d4": "black_1"};
  let data = {"connectors": {
    "a1-h": 1, "b1-h": 1, "c1-h": 1, "d1-v": 1, "a2-h": 1, "b2-h": 1, "c2-h": 1,
    "a3-h": 1, "b3-h": 1, "c3-h": 1, "a3-v": 1, "a4-h": 1, "b4-h": 1, "c4-h": 1}};

  assert("Wrong turns response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "Wrong number of turns for the line", errors: ["a1"]});
}),

test('Line with bifurcation',(suite) => {
  let clues = {"a1": "white_1", "a2": "black_circle", "d2": "phone", "a3": "phone", "d3": "white_0", "d4": "black_1"};
  // Extra line between b1 and b2: three lines go from b1.
  let data = {"connectors": {
    "a1-h": 1, "b1-h": 1, "c1-h": 1, "d1-v": 1, "a2-h": 1, "b2-h": 1, "c2-h": 1,
    "a3-h": 1, "b3-h": 1, "c3-h": 1, "a3-v": 1, "a4-h": 1, "b4-h": 1, "c4-h": 1,
    "b1-v": 1}};

  assert("Bifurcation response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "There should be single line without bifurcations", errors: ["b1"]});
}),

test('Circle is not connected to a phone',(suite) => {
  let clues = {"a1": "white_1", "a2": "black_circle", "d2": "phone", "a3": "phone", "d3": "white_0", "d4": "black_1"};
  // No line between c1 and d1: the line from a1 ends in c1.
  let data = {"connectors": {
    "a1-h": 1, "b1-h": 1, "d1-v": 1, "a2-h": 1, "b2-h": 1, "c2-h": 1,
    "a3-h": 1, "b3-h": 1, "c3-h": 1, "a3-v": 1, "a4-h": 1, "b4-h": 1, "c4-h": 1}};

  assert("Not connected circle response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "Each circle should be connected to a phone", errors: ["a1"]});
}),

test('Lines do not pass through all cells',(suite) => {
  // Black circle is in c4 instead of d4, so no line passes through d4.
  let clues = {"a1": "white_1", "a2": "black_circle", "d2": "phone", "a3": "phone", "d3": "white_0", "c4": "black_1"};
  let data = {"connectors": {
    "a1-h": 1, "b1-h": 1, "c1-h": 1, "d1-v": 1, "a2-h": 1, "b2-h": 1, "c2-h": 1,
    "a3-h": 1, "b3-h": 1, "c3-h": 1, "a3-v": 1, "a4-h": 1, "b4-h": 1}};

  assert("Not all cells response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "Lines should pass through all cells", errors: ["d4"]});
}),

);
