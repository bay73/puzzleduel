GRID_SELECTOR = "#mainGrid";

squarePuzzleTestSuite = testSuite("Square puzzle solver controllers",

beforeSuite((cb)=> {
  if (!$(GRID_SELECTOR).length) {
    throw "Missing " + GRID_SELECTOR + " element"
  };
  showSquarePuzzle = function(type, dimension, data) {
    var controls = "";
    var puzzleData = {
      typeCode: type,
      id: "",
      dimension: dimension
    };
    var settings = {
      local: true,
      data: data || {}
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
  let puzzle = showSquarePuzzle(
    "domino_castle_sum", "4x4-123",
    {
     "b2": "black", "c2": "black", "b3": "black", "c3": "black",
     "areas": [["b1","c1"],["a1","a2"],["b2","c2","b3","c3"],["d1","d2"],["a3","a4"],["b4","c4"],["d3","d4"]],
     "bottom": ["6",null,null,"9"], "right": ["6",null,null,"12"]
    }
  );
  puzzle.start();

  assert("White cell chooser").that(puzzle.cells[0][0].chooserValues).containsExactly([{}, {text:'1', returnValue: '1'}, {text:'2', returnValue: '2'}, {text:'3', returnValue: '3'}]);
  assert("White cell click").that(puzzle.cells[0][0].clickSwitch).isNull();
  assert("Black cell chooser").that(puzzle.cells[1][1].chooserValues).isNull();
  assert("Black cell click").that(puzzle.cells[1][1].clickSwitch).isNull();
  assert("Bottom clue chooser").that(puzzle.bottom[0].chooserValues).isNull();
  assert("Bottom clue click").that(puzzle.bottom[0].clickSwitch).isNull();
  assert("Right clue chooser").that(puzzle.right[0].chooserValues).isNull();
  assert("Right clue click").that(puzzle.right[0].clickSwitch).isNull();
}),

test('Hitori',() => {
  let puzzle = showSquarePuzzle(
    "hitori", "4x4",
    {"a1": "1", "b1": "1", "c1": "3", "d1": "2", "a2": "3", "b2": "2", "c2": "1", "d2": "2", "a3": "1", "b3": "2", "c3": "2", "d3": "3", "a4": "2", "b4": "3", "c4": "3", "d4": "1"}
  );
  puzzle.start();

  assert("Cell chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("Cell click").that(puzzle.cells[0][0].clickSwitch).containsExactly([{text: '1'}, {text: '1', color: puzzle.colorSchema.gridColor, returnValue: '1'}, {text: '1', image: 'white_circle'}]);
}),

test('Queens',() => {
  let puzzle = showSquarePuzzle(
    "queens", "4x4",
    {"a2": "cross", "a3": "5", "d1": "2"}
  )
  puzzle.start();

  assert("Empty cell chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("Empty cell click").that(puzzle.cells[0][0].clickSwitch).containsExactly([{}, {image: 'queen', returnValue: 'queen'}, {image: 'cross'}]);
  assert("Cross chooser").that(puzzle.cells[1][0].chooserValues).isNull();
  assert("Corss click").that(puzzle.cells[1][0].clickSwitch).isNull();
  assert("Number cell chooser").that(puzzle.cells[2][0].chooserValues).isNull();
  assert("Number cell click").that(puzzle.cells[2][0].clickSwitch).isNull();
}),

test('Minesweeper',() => {
  let puzzle = showSquarePuzzle(
    "minesweeper_classic", "4x4",
    {"a2": "cross", "a3": "5", "d1": "2"}
  )
  puzzle.start();

  assert("Empty cell chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("Empty cell click").that(puzzle.cells[0][0].clickSwitch).containsExactly([{}, {image: 'mine', returnValue: 'mine'}, {image: 'cross'}]);
  assert("Cross chooser").that(puzzle.cells[1][0].chooserValues).isNull();
  assert("Corss click").that(puzzle.cells[1][0].clickSwitch).isNull();
  assert("Number cell chooser").that(puzzle.cells[2][0].chooserValues).isNull();
  assert("Number cell click").that(puzzle.cells[2][0].clickSwitch).isNull();
}),

test('Yin Yang',() => {
  let puzzle = showSquarePuzzle("yin_yang_classic", "4x4",{"a1": "white_circle", "a2": "black_circle"});
  puzzle.start();

  assert("Empty cell chooser").that(puzzle.cells[1][1].chooserValues).isNull();
  assert("Empty cell click").that(puzzle.cells[1][1].clickSwitch).containsExactly([{}, {image: 'white_circle', returnValue: 'white_circle'}, {image: 'black_circle', returnValue: 'black_circle'}]);
  assert("Empty circle drag handler").that(puzzle.cells[1][1].drawDragHandler).isNotNull();
  assert("Empty circle drag processor").that(puzzle.cells[1][1].dragProcessor).isNotNull();
  assert("White circle chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("White circle click").that(puzzle.cells[0][0].clickSwitch).isNull();
  assert("White circle drag handler").that(puzzle.cells[0][0].drawDragHandler).isNotNull();
  assert("White circle drag processor").that(puzzle.cells[0][0].dragProcessor).isNotNull();
  assert("Black circle chooser").that(puzzle.cells[1][0].chooserValues).isNull();
  assert("Black circle click").that(puzzle.cells[1][0].clickSwitch).isNull();
  assert("Black circle drag handler").that(puzzle.cells[1][0].drawDragHandler).isNotNull();
  assert("Black circle drag processor").that(puzzle.cells[1][0].dragProcessor).isNotNull();
}),

test('Dutch snake',() => {
  let puzzle = showSquarePuzzle(
    "snake_dutch", "5x5",
    {"a4": "black_circle", "b2": "black_circle", "c3": "cross", "c4": "white_circle", "d1": "white_circle", "d5": "black_circle"}
  );
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

test('Star battle',() => {
  let puzzle = showSquarePuzzle(
    "starbattle", "5x5",
    {"c3": "cross", "areas": [["a1", "b1","a2"],["b2", "a3","b3"],["c1","c2","d1","d2","e1","e2"],["a4","a5","b4","b5","c3","c4","d3"],["c5","d4","d5","e3","e4","e5"]]}
  );
  puzzle.start();

  assert("Empty cell chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("Empty cell click").that(puzzle.cells[0][0].clickSwitch).containsExactly([{}, {image: 'star', returnValue: 'star'}, {image: 'cross'}]);
  assert("Cross chooser").that(puzzle.cells[2][2].chooserValues).isNull();
  assert("Cross click").that(puzzle.cells[2][2].clickSwitch).isNull();
}),

test('Star battle small regions',() => {
  let puzzle = showSquarePuzzle(
    "starbattle_smallregions", "5x5-1",
    {"c3": "cross", "areas": [["a1", "b1","a2"],["b2", "a3","b3"],["c1","c2","d1","d2","e1","e2"],["a4","a5","b4","b5","c3","c4","d3"],["c5","d4","d5","e3","e4","e5"]]}
  );
  puzzle.start();

  assert("Empty cell chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("Empty cell click").that(puzzle.cells[0][0].clickSwitch).containsExactly([{}, {image: 'star', returnValue: 'star'}, {image: 'cross'}]);
  assert("Cross chooser").that(puzzle.cells[2][2].chooserValues).isNull();
  assert("Cross click").that(puzzle.cells[2][2].clickSwitch).isNull();
}),

test('LITS',() => {
  let puzzle = showSquarePuzzle(
    "lits", "5x5-1",
    {"c3": "cross", "areas": [["a1", "b1","a2"],["b2", "a3","b3"],["c1","c2","d1","d2","e1","e2"],["a4","a5","b4","b5","c3","c4","d3"],["c5","d4","d5","e3","e4","e5"]]}
  );
  puzzle.start();

  assert("Empty cell chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("Empty cell click").that(puzzle.cells[0][0].clickSwitch).containsExactly([{}, {color: '#606060', returnValue: '1'}, {image: 'cross'}]);
  assert("Cross chooser").that(puzzle.cells[2][2].chooserValues).isNull();
  assert("Cross click").that(puzzle.cells[2][2].clickSwitch).isNull();
}),

test('Heyawake',() => {
  let puzzle = showSquarePuzzle(
    "heyawake", "5x5-1",
    {"c3": "cross", "areas": [["a1", "b1","a2"],["b2", "a3","b3"],["c1","c2","d1","d2","e1","e2"],["a4","a5","b4","b5","c3","c4","d3"],["c5","d4","d5","e3","e4","e5"]]}
  );
  puzzle.start();

  assert("Empty cell chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("Empty cell click").that(puzzle.cells[0][0].clickSwitch).containsExactly([{}, {color: '#606060', returnValue: '1'}, {image: 'cross'}]);
  assert("Cross chooser").that(puzzle.cells[2][2].chooserValues).isNull();
  assert("Cross click").that(puzzle.cells[2][2].clickSwitch).isNull();
}),

test('Akari',() => {
  let puzzle = showSquarePuzzle(
    "akari", "4x4",
    {"a3": "black", "c4": "1", "d1": "2"}
  )
  puzzle.start();

  assert("Empty cell chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("Empty cell click").that(puzzle.cells[0][0].clickSwitch).containsExactly([{}, {image: 'bulb', returnValue: 'bulb'}, {image: 'cross'}]);
  assert("Black cell chooser").that(puzzle.cells[2][0].chooserValues).isNull();
  assert("Black cell click").that(puzzle.cells[2][0].clickSwitch).containsExactly([{color: puzzle.colorSchema.gridColor}, {image: 'white_cross', color: puzzle.colorSchema.gridColor}]);
  assert("Number cell chooser").that(puzzle.cells[3][2].chooserValues).isNull();
  assert("Number cell click").that(puzzle.cells[3][2].clickSwitch).containsExactly([{text: '1', color: puzzle.colorSchema.gridColor, textColor: "#fff"}, {text: '1', image: 'white_cross', color: puzzle.colorSchema.gridColor, textColor: "#fff"}]);
  assert("Connector drag").that(puzzle.connectors[0][0]['v'].dragSwitch).containsExactly([{}, {color: puzzle.colorSchema.lineColor}]);
}),

test('Point a star',() => {
  let puzzle = showSquarePuzzle(
    "point_a_star", "4x4",
    {"b3": "arrow_ur", "c4": "arrow_u", "bottom": ["2",null,null,"1"], "right": ["1",null,"1",null]}
  );
  puzzle.start();

  assert("Empty cell chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("Empty cell click").that(puzzle.cells[0][0].clickSwitch).containsExactly([{}, {image: 'star', returnValue: 'star'}, {image: 'cross'}]);
  assert("Arrow cell chooser").that(puzzle.cells[2][1].chooserValues).isNull();
  assert("Arrow cell click").that(puzzle.cells[2][1].clickSwitch).containsExactly([{image: 'arrow_ur'}, {image: 'arrow_ur', color: puzzle.colorSchema.greyColor}]);
  assert("Bottom clue chooser").that(puzzle.bottom[0].chooserValues).isNull();
  assert("Bottom clue click").that(puzzle.bottom[0].clickSwitch).containsExactly([{text: '2'}, {text: '2', image: 'white_circle'}]);
  assert("Right clue chooser").that(puzzle.right[0].chooserValues).isNull();
  assert("Right clue click").that(puzzle.right[0].clickSwitch).containsExactly([{text: '1'}, {text: '1', image: 'white_circle'}]);
}),

test('Clouds',() => {
  let puzzle = showSquarePuzzle(
    "clouds", "5x5",
    {"a1": "cross", "b2": "black", "bottom": ["2","4","2","4","2"], "right": ["3","3",null,"4","4"]}
  );
  puzzle.start();

  assert("Empty cell chooser").that(puzzle.cells[2][2].chooserValues).isNull();
  assert("Empty cell click").that(puzzle.cells[2][2].clickSwitch).containsExactly([{}, {color: puzzle.colorSchema.gridColor, returnValue: 'black'}, {image: 'cross'}]);
  assert("Black cell chooser").that(puzzle.cells[1][1].chooserValues).isNull();
  assert("Black cell click").that(puzzle.cells[1][1].clickSwitch).isNull();
  assert("Cross cell chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("Cross cell click").that(puzzle.cells[0][0].clickSwitch).isNull();;
  assert("Bottom clue chooser").that(puzzle.bottom[0].chooserValues).isNull();
  assert("Bottom clue click").that(puzzle.bottom[0].clickSwitch).containsExactly([{text: '2'}, {text: '2', image: 'white_circle'}]);
  assert("Right clue chooser").that(puzzle.right[0].chooserValues).isNull();
  assert("Right clue click").that(puzzle.right[0].clickSwitch).containsExactly([{text: '3'}, {text: '3', image: 'white_circle'}]);
}),

test('Gaps',() => {
  let puzzle = showSquarePuzzle(
    "gaps", "5x5",
    {"a1": "cross", "b2": "white_circle", "bottom": ["2",null,"2",null,"2"], "right": ["3","3",null,null,null]}
  );
  puzzle.start();

  assert("Empty cell chooser").that(puzzle.cells[2][2].chooserValues).isNull();
  assert("Empty cell click").that(puzzle.cells[2][2].clickSwitch).containsExactly([{}, {image: 'white_circle', returnValue: 'white_circle'}, {image: 'cross'}]);
  assert("White circle chooser").that(puzzle.cells[1][1].chooserValues).isNull();
  assert("White circle click").that(puzzle.cells[1][1].clickSwitch).isNull();
  assert("Cross cell chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("Cross cell click").that(puzzle.cells[0][0].clickSwitch).isNull();;
  assert("Bottom clue chooser").that(puzzle.bottom[0].chooserValues).isNull();
  assert("Bottom clue click").that(puzzle.bottom[0].clickSwitch).containsExactly([{text: '2'}, {text: '2', image: 'white_circle'}]);
  assert("Right clue chooser").that(puzzle.right[0].chooserValues).isNull();
  assert("Right clue click").that(puzzle.right[0].clickSwitch).containsExactly([{text: '3'}, {text: '3', image: 'white_circle'}]);
}),

// end "Square puzzle solver controllers" test suite
);

squarePuzzleEditTestSuite = testSuite("Square puzzle author controllers",

beforeSuite((cb)=> {
  if (!$(GRID_SELECTOR).length) {
    throw "Missing " + GRID_SELECTOR + " element"
  };
  showSquarePuzzleForEdit = function(type, dimension, data) {
    var controls = "";
    var puzzleData = {
      typeCode: type,
      id: "",
      dimension: dimension
    };
    var settings = {
      local: true,
      data: data || {}
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
  let puzzle = showSquarePuzzleForEdit("domino_castle_sum", "4x4-123");
  puzzle.edit();

  assert("Cell chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("Cell click").that(puzzle.cells[0][0].clickSwitch).containsExactly([{}, {color: puzzle.colorSchema.gridColor, returnValue: 'black'}]);
  assert("Bottom clue chooser").that(puzzle.bottom[0].chooserValues).containsAtLeast([{},{text: '1', returnValue: '1'},{text: '2', returnValue: '2'},{text: '99', returnValue: '99'}]);
  assert("Bottom clue click").that(puzzle.bottom[0].clickSwitch).isNull();
  assert("Right clue chooser").that(puzzle.right[0].chooserValues).containsAtLeast([{},{text: '1', returnValue: '1'},{text: '2', returnValue: '2'},{text: '99', returnValue: '99'}]);
  assert("Right clue click").that(puzzle.right[0].clickSwitch).isNull();
  assert("Edge chooser").that(puzzle.edges[0][0][1].chooserValues).isNull();
  assert("Edge click").that(puzzle.edges[0][0][1].clickSwitch).containsExactly([{}, {color: puzzle.colorSchema.gridColor, returnValue: '1'}]);
  assert("Edge drag").that(puzzle.edges[0][0][1].dragSwitch).containsExactly([{}, {color: puzzle.colorSchema.gridColor, returnValue: '1'}]);
}),

test('Hitori',() => {
  let puzzle = showSquarePuzzleForEdit("hitori", "4x4");
  puzzle.edit();

  assert("Cell chooser").that(puzzle.cells[0][0].chooserValues).containsAtLeast([{},{text: '1', returnValue: '1'},{text: '2', returnValue: '2'},{text: '15', returnValue: '15'}]);
  assert("Cell click").that(puzzle.cells[0][0].clickSwitch).isNull();
}),

test('Queens',() => {
  let puzzle = showSquarePuzzleForEdit("queens", "4x4");
  puzzle.edit();

  assert("Cell chooser").that(puzzle.cells[0][0].chooserValues).containsAtLeast([{},{text: '0', returnValue: '0'},{text: '1', returnValue: '1'},{text: '8', returnValue: '8'}, {image: 'cross', returnValue: 'cross'}]);
  assert("Cell click").that(puzzle.cells[0][0].clickSwitch).isNull();
}),

test('Minesweeper',() => {
  let puzzle = showSquarePuzzleForEdit("minesweeper_classic", "4x4");
  puzzle.edit();

  assert("Cell chooser").that(puzzle.cells[0][0].chooserValues).containsAtLeast([{},{text: '0', returnValue: '0'},{text: '1', returnValue: '1'},{text: '8', returnValue: '8'}, {image: 'cross', returnValue: 'cross'}]);
  assert("Cell click").that(puzzle.cells[0][0].clickSwitch).isNull();
}),

test('Yin Yang',() => {
  let puzzle = showSquarePuzzleForEdit("yin_yang_classic", "4x4");
  puzzle.edit();

  assert("Cell chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("Cell click").that(puzzle.cells[0][0].clickSwitch).containsExactly([{}, {image: 'white_circle', returnValue: 'white_circle'}, {image: 'black_circle', returnValue: 'black_circle'}]);
}),

test('Dutch snake',() => {
  let puzzle = showSquarePuzzleForEdit("snake_dutch", "5x5");
  puzzle.edit();

  assert("Cell chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("Cell click").that(puzzle.cells[0][0].clickSwitch).containsExactly([{}, {image: 'white_circle', returnValue: 'white_circle'}, {image: 'black_circle', returnValue: 'black_circle'}, {image: 'cross', returnValue: 'cross'}]);
}),

test('Star battle',() => {
  let puzzle = showSquarePuzzleForEdit("starbattle", "5x5");
  puzzle.edit();

  assert("Cell chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("Cell click").that(puzzle.cells[0][0].clickSwitch).containsExactly([{}, {image: 'cross', returnValue: 'cross'}]);
  assert("Edge chooser").that(puzzle.edges[0][0][1].chooserValues).isNull();
  assert("Edge click").that(puzzle.edges[0][0][1].clickSwitch).containsExactly([{}, {color: puzzle.colorSchema.gridColor, returnValue: '1'}]);
  assert("Edge drag").that(puzzle.edges[0][0][1].dragSwitch).containsExactly([{}, {color: puzzle.colorSchema.gridColor, returnValue: '1'}]);
}),

test('Star battle small regions',() => {
  let puzzle = showSquarePuzzleForEdit("starbattle_smallregions", "5x5-1");
  puzzle.edit();

  assert("Cell chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("Cell click").that(puzzle.cells[0][0].clickSwitch).containsExactly([{}, {image: 'cross', returnValue: 'cross'}]);
  assert("Edge chooser").that(puzzle.edges[0][0][1].chooserValues).isNull();
  assert("Edge click").that(puzzle.edges[0][0][1].clickSwitch).containsExactly([{}, {color: puzzle.colorSchema.gridColor, returnValue: '1'}]);
  assert("Edge drag").that(puzzle.edges[0][0][1].dragSwitch).containsExactly([{}, {color: puzzle.colorSchema.gridColor, returnValue: '1'}]);
}),

test('LITS',() => {
  let puzzle = showSquarePuzzleForEdit("lits", "5x5");
  puzzle.edit();

  assert("Cell chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("Cell click").that(puzzle.cells[0][0].clickSwitch).containsExactly([{}, {image: 'cross', returnValue: 'cross'}]);
  assert("Edge chooser").that(puzzle.edges[0][0][1].chooserValues).isNull();
  assert("Edge click").that(puzzle.edges[0][0][1].clickSwitch).containsExactly([{}, {color: puzzle.colorSchema.gridColor, returnValue: '1'}]);
  assert("Edge drag").that(puzzle.edges[0][0][1].dragSwitch).containsExactly([{}, {color: puzzle.colorSchema.gridColor, returnValue: '1'}]);
}),

test('Heyawake',() => {
  let puzzle = showSquarePuzzleForEdit("heyawake", "5x5");
  puzzle.edit();

  assert("Cell chooser").that(puzzle.cells[0][0].chooserValues).containsAtLeast([{},{text: '0', returnValue: '0'},{text: '1', returnValue: '1'},{text: '8', returnValue: '8'}, {image: 'cross', returnValue: 'cross'}]);
  assert("Cell click").that(puzzle.cells[0][0].clickSwitch).isNull();
  assert("Edge chooser").that(puzzle.edges[0][0][1].chooserValues).isNull();
  assert("Edge click").that(puzzle.edges[0][0][1].clickSwitch).containsExactly([{}, {color: puzzle.colorSchema.gridColor, returnValue: '1'}]);
  assert("Edge drag").that(puzzle.edges[0][0][1].dragSwitch).containsExactly([{}, {color: puzzle.colorSchema.gridColor, returnValue: '1'}]);
}),

test('Akari',() => {
  let puzzle = showSquarePuzzleForEdit("akari", "4x4");
  puzzle.edit();

  assert("Cell chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("Cell click").that(puzzle.cells[0][0].clickSwitch).containsExactly([{}, {color: puzzle.colorSchema.gridColor, returnValue: 'black'}, {text: '0', color: puzzle.colorSchema.gridColor, textColor: "#fff", returnValue: '0'},{text: '1', color: puzzle.colorSchema.gridColor, textColor: "#fff", returnValue: '1'},{text: '2', color: puzzle.colorSchema.gridColor, textColor: "#fff", returnValue: '2'},{text: '3', color: puzzle.colorSchema.gridColor, textColor: "#fff", returnValue: '3'},{text: '4', color: puzzle.colorSchema.gridColor, textColor: "#fff", returnValue: '4'}]);
}),

test('Point a star',() => {
  let puzzle = showSquarePuzzleForEdit("point_a_star", "4x4");
  puzzle.edit();

  assert("Cell chooser").that(puzzle.cells[0][0].chooserValues).containsAtLeast([{},{image: 'arrow_u', returnValue: 'arrow_u'},{image: 'arrow_ur', returnValue: 'arrow_ur'},{image: 'arrow_ul', returnValue: 'arrow_ul'}]);
  assert("Cell click").that(puzzle.cells[0][0].clickSwitch).isNull();
  assert("Bottom clue chooser").that(puzzle.bottom[0].chooserValues).containsExactly([{},{text: '0', returnValue: '0'},{text: '1', returnValue: '1'},{text: '2', returnValue: '2'}]);
  assert("Bottom clue click").that(puzzle.bottom[0].clickSwitch).isNull();
  assert("Right clue chooser").that(puzzle.right[0].chooserValues).containsExactly([{},{text: '0', returnValue: '0'},{text: '1', returnValue: '1'},{text: '2', returnValue: '2'}]);
  assert("Right clue click").that(puzzle.right[0].clickSwitch).isNull();
}),

test('Clouds',() => {
  let puzzle = showSquarePuzzleForEdit("clouds", "5x5");
  puzzle.edit();

  assert("Cell chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("Cell click").that(puzzle.cells[0][0].clickSwitch).containsExactly([{}, {color: puzzle.colorSchema.gridColor, returnValue: 'black'}, {image: 'cross', returnValue: 'cross'}]);
  assert("Bottom clue chooser").that(puzzle.bottom[0].chooserValues).containsExactly([{},{text: '0', returnValue: '0'},{text: '1', returnValue: '1'},{text: '2', returnValue: '2'},{text: '3', returnValue: '3'},{text: '4', returnValue: '4'},{text: '5', returnValue: '5'}]);
  assert("Bottom clue click").that(puzzle.bottom[0].clickSwitch).isNull();
  assert("Right clue chooser").that(puzzle.right[0].chooserValues).containsExactly([{},{text: '0', returnValue: '0'},{text: '1', returnValue: '1'},{text: '2', returnValue: '2'},{text: '3', returnValue: '3'},{text: '4', returnValue: '4'},{text: '5', returnValue: '5'}]);
  assert("Right clue click").that(puzzle.right[0].clickSwitch).isNull();
}),

test('Gaps',() => {
  let puzzle = showSquarePuzzleForEdit("gaps", "5x5");
  puzzle.edit();

  assert("Cell chooser").that(puzzle.cells[0][0].chooserValues).isNull();
  assert("Cell click").that(puzzle.cells[0][0].clickSwitch).containsExactly([{}, {image: 'cross', returnValue: 'cross'}, {image: 'white_circle', returnValue: 'white_circle'}]);
  assert("Bottom clue chooser").that(puzzle.bottom[0].chooserValues).containsAtLeast([{},{text: '1', returnValue: '1'},{text: '2', returnValue: '2'},{text: '3', returnValue: '3'}]);
  assert("Bottom clue click").that(puzzle.bottom[0].clickSwitch).isNull();
  assert("Right clue chooser").that(puzzle.right[0].chooserValues).containsAtLeast([{},{text: '1', returnValue: '1'},{text: '2', returnValue: '2'},{text: '3', returnValue: '3'}]);
  assert("Right clue click").that(puzzle.right[0].clickSwitch).isNull();
}),

// end "Square puzzle author controllers" test suite
);


