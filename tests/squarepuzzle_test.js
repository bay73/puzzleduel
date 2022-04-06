GRID_SELECTOR = "#mainGrid";

squarePuzzleTestSuite = testSuite("squarePuzzle_controllers", 

beforeSuite((cb)=> {
  if (!$(GRID_SELECTOR).length) {
    throw "Missing " + GRID_SELECTOR + " element"
  };
  showPuzzle = function(type, dimension, data) {
    var controls = "";
    var puzzleData = {
      typeCode: type,
      id: "",
      dimension: dimension
    };
    var settings = {
      local: true,
      data: data
    };
    var puzzle = new squarePuzzleType(puzzleData, controls, settings);
    puzzle.render(Snap(GRID_SELECTOR));
    return puzzle;
  }
  requirejs(["squarepuzzle"], cb);
}),

after(()=> {
  Snap(GRID_SELECTOR).clear();
}),

test('Domino Castle',() => {
  let puzzle = showPuzzle(
    "domino_castle_sum", "4x4-123",
    {
     "b2": "black", "c2": "black", "b3": "black", "c3": "black",
     "areas": [["b1","c1"],["a1","a2"],["b2","c2","b3","c3"],["d1","d2"],["a3","a4"],["b4","c4"],["d3","d4"]],
     "bottom": ["6",null,null,"9"], "right": ["6",null,null,"12"]
    }
  )
  puzzle.start();

  assert("White cell chooser").that(puzzle.cells[0][0].chooserValues).containsExactly([{}, {text:'1', returnValue: '1'}, {text:'2', returnValue: '2'}, {text:'3', returnValue: '3'}]);
  assert("White cell click").that(puzzle.cells[0][0].clickSwitch).isNull();
  assert("Black cell chooser").that(puzzle.cells[1][1].chooserValues).isNull();
  assert("Black cell click").that(puzzle.cells[1][1].clickSwitch).isNull();
  assert("Bottom clue chooser").that(puzzle.bottom[0].chooserValues).isNull();
  assert("Bottom clue click").that(puzzle.bottom[0].clickSwitch).isNull();
  assert("Rottom clue chooser").that(puzzle.right[0].chooserValues).isNull();
  assert("Rottom clue click").that(puzzle.right[0].clickSwitch).isNull();
}),

test('Hitori',() => {
  let puzzle = showPuzzle(
    "hitori", "4x4",
    {"a1": "1", "b1": "1", "c1": "3", "d1": "2", "a2": "3", "b2": "2", "c2": "1", "d2": "2", "a3": "1", "b3": "2", "c3": "2", "d3": "3", "a4": "2", "b4": "3", "c4": "3", "d4": "1"}
  )
  puzzle.start();
  
  assert("Cell chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("Cell click").that(puzzle.cells[0][0].clickSwitch).containsExactly([{text: '1'}, {text: '1', color: puzzle.colorSchema.gridColor, returnValue: '1'}, {text: '1', image: 'white_circle'}]);
}),

test('Dutch snake',() => {
  let puzzle = showPuzzle(
    "snake_dutch", "5x5",
    {"a4": "black_circle", "b2": "black_circle", "c3": "cross", "c4": "white_circle", "d1": "white_circle", "d5": "black_circle"}
  )
  puzzle.start();
  
  assert("Empty cell chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("Empty cell click").that(puzzle.cells[0][0].clickSwitch).containsExactly([{}, {color: puzzle.colorSchema.greyColor, returnValue: '1'}, {image: 'cross'}]);
  assert("White circle chooser").that(puzzle.cells[0][3].chooserValues).isNull();
  assert("White circle click").that(puzzle.cells[0][3].clickSwitch).containsExactly([{image: 'white_circle'}, {image: 'white_circle', color: puzzle.colorSchema.greyColor, returnValue: '1'}]);
  assert("Black circle chooser").that(puzzle.cells[1][1].chooserValues).isNull();
  assert("Black circle click").that(puzzle.cells[1][1].clickSwitch).containsExactly([{image: 'black_circle'}, {image: 'black_circle', color: puzzle.colorSchema.greyColor, returnValue: '1'}]);
  assert("Cross chooser").that(puzzle.cells[2][2].chooserValues).isNull();
  assert("Cross click").that(puzzle.cells[2][2].clickSwitch).isNull();
}),

// end squarePuzzle_controllers testSuite
);


