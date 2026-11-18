function testSuite(name, ...tests) {
  let testList = [];
  let beforeEach = [];
  let afterEach = [];
  let beforeAll = (suite, cb) => cb();
  let afterAll = (suite) => null;
  for (let i=1; i<arguments.length; i++) {
    if (arguments[i].type == testSuite.TEST) {
      testList.push(arguments[i].exec);
    }
    if (arguments[i].type == testSuite.BEFORE_EACH) {
      beforeEach.push(arguments[i].exec);
    }
    if (arguments[i].type == testSuite.AFTER_EACH) {
      afterEach.push(arguments[i].exec);
    }
    if (arguments[i].type == testSuite.BEFORE_ALL) {
      beforeAll = arguments[i].exec;
    }
    if (arguments[i].type == testSuite.AFTER_ALL) {
      afterAll = arguments[i].exec;
    }
  }
  
  let self = {name: name,
    // onFinish (optional) is called with the results when all the tests of the suite are executed.
    exec: (hideDetails, onFinish) => {
    beforeAll( self, () => {
      let failed = 0;
      let passed = 0;
      let failures = [];
      console.log("%c" + name, "font-weight:bold");
      for (let i=0; i<testList.length; i++) {
        for (let j=0; j<beforeEach.length; j++) {
          beforeEach[j](self);
        }
        let result = testList[i](self);
        for (let j=0; j<afterEach.length; j++) {
          afterEach[j](self);
        }
        if (result.status == "PASSED") {
          passed++;
          if (!hideDetails) {
            console.log("  " + result.name + " %c" + result.status, "color:green");
          }
        } else {
          failed++;
          failures.push({name: result.name, error: result.error});
          if (!hideDetails) {
            console.log("  " + result.name + " %c" + result.status + "\n%c" + result.error, "color:red", "padding-left:50px");
          }
        }
      }
      if (failed > 0) {
        console.log("%c FAILED: " + failed + " PASSED: " + passed, "color:red;font-weight:bold");
      } else {
        console.log("%c FAILED: " + failed + " PASSED: " + passed, "color:green;font-weight:bold");
      }
      if (typeof onFinish == "function") {
        onFinish({name: name, passed: passed, failed: failed, failures: failures});
      }
    });
    afterAll(self);
  }};
  return self;
}

testSuite.TEST = 1;
testSuite.BEFORE_EACH = 2;
testSuite.AFTER_EACH = 3;
testSuite.BEFORE_ALL = 4;
testSuite.AFTER_ALL = 5;

function test(name, fn) {
  return {
    type: testSuite.TEST,
    exec: (suite) => {
      try {
        fn(suite);
        return {name: name, status: "PASSED"};
      } catch (error) {
        return {name: name, status: "FAILED", error: error + (error.stack != undefined?"\n"+error.stack:"")};
      }
    }
  };
}

function before(fn) {
  return {
    type: testSuite.BEFORE_EACH,
    exec: fn
  };
}

function after(fn) {
  return {
    type: testSuite.AFTER_EACH,
    exec: fn
  };
}

function beforeSuite(fn) {
  return {
    type: testSuite.BEFORE_ALL,
    exec: fn
  };
}

function afterSuite(fn) {
  return {
    type: testSuite.AFTER_ALL,
    exec: fn
  };
}

function assert(text) {
  return new assertSubject(text);
}



assertSubject = function(text) {
  this.text = text;
}

assertSubject.prototype.that = function(subject) {
  this.subject = subject;
  return this;
}

assertSubject.prototype.assertWithMessage = function(message, expression) {
  if (!expression) {
    throw this.text + " " + message;
  }
  return this;
}

assertSubject.prototype.isNotNull = function() {
  return this.assertWithMessage("expected to be not null, but was null", this.subject != null && typeof this.subject != 'undefined');
}

assertSubject.prototype.isNull = function() {
  return this.assertWithMessage("expected to be null, but was " + JSON.stringify(this.subject), this.subject == null || typeof this.subject == 'undefined');
}

assertSubject.prototype.isEqualTo = function(expected) {
  return this.assertWithMessage("expected to be " + JSON.stringify(expected) + ", but was " + JSON.stringify(this.subject), deepCompare(this.subject, expected));
}

assertSubject.prototype.isAlmostEqualTo = function(expected) {
  let number = Number(this.subject);
  if (isNaN(number)) {
    return this.assertWithMessage("expected to be a number, but was " + JSON.stringify(this.subject), false);
  }
  return this.assertWithMessage("expected to be almost " + expected + ", but was " + number, Math.abs(number - expected) < Math.abs(number/10000.));
}

assertSubject.prototype.containsExactly = function(expected) {
  let subject = this.subject;
  if (!subject) {
    throw this.text + " expected to be non empty Array but was " + JSON.stringify(subject);
  }
  if (!(subject instanceof Array)) {
    throw this.text + " expected to be Array but was " + (typeof subject);
  }
  if (expected.length == subject.length) {
    let equals = true;
    for (let i=0; i<subject.length; i++) {
      let found = false;
      for (let j=0; j<expected.length; j++) {
        if (deepCompare(subject[i], expected[j])) {
          found = true;
          break;
        }
      }
      if (!found) {
        equals = false;
      }
    }
    if (equals) {
      return this;
    }
  }
  throw this.text + " expected to contain exactly " + JSON.stringify(expected) + ", but was " + JSON.stringify(subject);
}


assertSubject.prototype.containsAtLeast = function(expected) {
  let subject = this.subject;
  if (!subject) {
    throw this.text + " expected to be non empty Array but was " + JSON.stringify(subject);
  }
  if (!(subject instanceof Array)) {
    throw this.text + " expected to be Array but was " + (typeof subject);
  }
  for (let i=0; i<expected.length; i++) {
    let found = false;
    for (let j=0; j<subject.length; j++) {
      if (deepCompare(subject[j], expected[i])) {
        found = true;
        break;
      }
    }
    if (!found) {
      throw this.text + " expected to contain at least " + JSON.stringify(expected) + ", but was " + JSON.stringify(subject);
    }
  }
  return this;
}

assertSubject.prototype.isEmptyArray = function() {
  let subject = this.subject;
  if (!(subject instanceof Array)) {
    throw this.text + " expected to be Array but was " + (typeof subject);
  }
  return this.assertWithMessage("expected to be empty Array, but has " + subject.length + " elements", subject.length==0);
}


assertSubject.prototype.isNonEmptyArray = function() {
  let subject = this.subject;
  if (!(subject instanceof Array)) {
    throw this.text + " expected to be non empty Array but was " + (typeof subject);
  }
  return this.assertWithMessage("expected to be non empty Array, but was " + subject, subject.length != 0);
}


function deepCompare () {
  var i, l, leftChain, rightChain;

  function compare2Objects (x, y) {
    var p;

    // remember that NaN === NaN returns false
    // and isNaN(undefined) returns true
    if (isNaN(x) && isNaN(y) && typeof x === 'number' && typeof y === 'number') {
         return true;
    }

    // Compare primitives and functions.     
    // Check if both arguments link to the same object.
    // Especially useful on the step where we compare prototypes
    if (x === y) {
        return true;
    }

    // Works in case when functions are created in constructor.
    // Comparing dates is a common scenario. Another built-ins?
    // We can even handle functions passed across iframes
    if ((typeof x === 'function' && typeof y === 'function') ||
       (x instanceof Date && y instanceof Date) ||
       (x instanceof RegExp && y instanceof RegExp) ||
       (x instanceof String && y instanceof String) ||
       (x instanceof Number && y instanceof Number)) {
        return x.toString() === y.toString();
    }

    // At last checking prototypes as good as we can
    if (!(x instanceof Object && y instanceof Object)) {
        return false;
    }

    if (x.isPrototypeOf(y) || y.isPrototypeOf(x)) {
        return false;
    }

    if (x.constructor !== y.constructor) {
        return false;
    }

    if (x.prototype !== y.prototype) {
        return false;
    }

    // Check for infinitive linking loops
    if (leftChain.indexOf(x) > -1 || rightChain.indexOf(y) > -1) {
         return false;
    }
    
    function hasDefinedProperty(o, p) {
      return o.hasOwnProperty(p) && typeof o[p] != "undefined" && o[p] != null;
    }

    // Quick checking of one object being a subset of another.
    // todo: cache the structure of arguments[0] for performance
    for (p in y) {
      if (hasDefinedProperty(y, p) !== hasDefinedProperty(x, p)) {
        return false;
      }
      if (hasDefinedProperty(y, p) && hasDefinedProperty(x, p)) {
        if (typeof y[p] !== typeof x[p]) {
          return false;
        }
      }
    }

    for (p in x) {
      if (hasDefinedProperty(y, p) !== hasDefinedProperty(x, p)) {
        return false;
      }
      if (hasDefinedProperty(y, p) && hasDefinedProperty(x, p)) {
        if (typeof y[p] !== typeof x[p]) {
          return false;
        }

        switch (typeof (x[p])) {
          case 'object':

          case 'function':
            leftChain.push(x);
            rightChain.push(y);

            if (!compare2Objects (x[p], y[p])) {
              return false;
            }

            leftChain.pop();
            rightChain.pop();
            break;

          default:
            if (x[p] !== y[p]) {
              return false;
            }
            break;
        }
      }
    }

    return true;
  }

  if (arguments.length < 1) {
    return true; //Die silently? Don't know how to handle such case, please help...
    // throw "Need two or more arguments to compare";
  }

  for (i = 1, l = arguments.length; i < l; i++) {

      leftChain = []; //Todo: this can be cached
      rightChain = [];

      if (!compare2Objects(arguments[0], arguments[i])) {
          return false;
      }
  }

  return true;
}

// Checkers tests //////////////////////////////////////////////////////////

// Loads the checker of the puzzle type together with the util modules it uses.
// The files are loaded as scripts into a separate hidden frame, so declarations from different
// checkers (all of them declare Checker) don't clash. Scripts are used instead of fetch,
// because fetch doesn't work when tests.html is opened as a local file.
function loadChecker(typeCode, callback) {
  let frame = document.createElement("iframe");
  frame.style.display = "none";
  document.body.appendChild(frame);
  let frameWindow = frame.contentWindow;
  // Replacement for Node module system used by the files.
  let modules = {"./util": "Util", "./sudoku_util": "SudokuUtil", "./pentomino_util": "PentominoUtil"};
  frameWindow.module = {};
  frameWindow.require = path => frameWindow.eval(modules[path]);

  let files = ["util", "sudoku_util", "pentomino_util", typeCode];
  let loadNext = function(index) {
    if (index == files.length) {
      let checker = frameWindow.eval("Checker");
      // The response is copied, since objects created in the frame are not equal
      // to objects of the main window when they are compared by the assertions.
      callback({check: (dimension, clues, data) => structuredClone(checker.check(dimension, clues, data))});
      return;
    }
    let script = frameWindow.document.createElement("script");
    script.src = new URL("puzzle_types/" + files[index] + ".js", document.baseURI).href;
    script.onload = () => loadNext(index + 1);
    script.onerror = () => console.error("Can't load " + script.src);
    frameWindow.document.head.appendChild(script);
  };
  loadNext(0);
}

// Creates test suite which contains only tests for the checker of the given puzzle type.
// The checker is available for the tests as Checker.
function checkerTestSuite(typeCode, name, ...tests) {
  // Checker is set only while a test is executed, to not affect other suites using the same global name.
  let withChecker = item => {
    if (item.type != testSuite.TEST) {
      return item;
    }
    return {
      type: item.type,
      exec: (suite) => {
        let savedChecker = window.Checker;
        window.Checker = suite.checker;
        try {
          return item.exec(suite);
        } finally {
          window.Checker = savedChecker;
        }
      }
    };
  };
  let suite = testSuite(
    name + " checker",
    beforeSuite((suite, cb) => loadChecker(typeCode, checker => {
      suite.checker = checker;
      cb();
    })),
    ...tests.map(withChecker));
  if (typeof allTestSuites != "undefined") {
    allTestSuites.push(suite);
  }
  return suite;
}

// UI tests ////////////////////////////////////////////////////////////////

// Point of the puzzle grid, which can be moved by the given number of cells.
// Coordinates col and row are measured in cells from the top left corner of the grid.
GridPoint = function(puzzle, col, row) {
  this.unitSize = puzzle.size.unitSize;
  this.x = puzzle.size.leftGap + col*this.unitSize;
  this.y = puzzle.size.topGap + row*this.unitSize;
}

GridPoint.prototype.right = function(cells) {
  this.x += (typeof cells == "undefined" ? 1 : cells)*this.unitSize;
  return this;
}

GridPoint.prototype.left = function(cells) {
  this.x -= (typeof cells == "undefined" ? 1 : cells)*this.unitSize;
  return this;
}

GridPoint.prototype.down = function(cells) {
  this.y += (typeof cells == "undefined" ? 1 : cells)*this.unitSize;
  return this;
}

GridPoint.prototype.up = function(cells) {
  this.y -= (typeof cells == "undefined" ? 1 : cells)*this.unitSize;
  return this;
}

// Creates test suite for UI of the puzzle types which are implemented by the given class
// (e.g. "squarePuzzleType") from the given module of js directory (e.g. "squarepuzzle").
// The grid is cleared after every test. The suite object provides helpers for the tests:
//   suite.showPuzzle(typeCode, dimension, data) - creates and renders the puzzle,
//       call start() or edit() of the returned puzzle to use it as a solver or as an author;
//   suite.cellPoint(puzzle, "b3") - point at the center of the cell. Cells can be given also by zero-based
//       column and row, cellPoint(puzzle, 1, -1) is the clue cell above the column b;
//   suite.gridPoint(puzzle, col, row) - point with coordinates measured in cells from the top left corner
//       of the grid: gridPoint(puzzle, 1, 0) is the top right corner of the cell a1;
//   point.right(n), point.left(n), point.down(n), point.up(n) - move the point by n cells (by one cell
//       by default, n can be fractional). Fields point.x and point.y can be also changed directly;
//   suite.mouseEvent(point) - event to pass to mouse handlers of puzzle.controller;
//   suite.click(puzzle, point) - mouse click at the point;
//   suite.drag(puzzle, point1, point2) - mouse drag from one point to another;
//       mouseEvent, click and drag accept also coordinates: click(puzzle, x, y);
//   suite.enterSolution(puzzle, data) - enters the solution through the puzzle controls, data has the format
//       which is submitted to the checker: values of the cells are set by clicks or by the value chooser,
//       connectors are drawn by drag between the cells, edges are set by clicks, and areas are separated
//       by clicks at the edges between them. It throws an error if a value can't be set;
//   suite.cellClick(puzzle, "b3") - click at the center of the cell;
//   suite.edgeClick(puzzle, "b3-1") - click at the middle of the cell edge
//       (0 - top, 1 - right, 2 - bottom, 3 - left).
// More helpers can be added to the suite in beforeSuite of the test file.
function uiTestSuite(name, moduleName, puzzleClassName, ...items) {
  let customSetup = items.filter(item => item.type == testSuite.BEFORE_ALL);
  let otherItems = items.filter(item => item.type != testSuite.BEFORE_ALL);
  return testSuite(
    name,
    beforeSuite((suite, cb) => {
      suite.GRID_SELECTOR = "#mainGrid";
      if (!$(suite.GRID_SELECTOR).length) {
        throw "Missing " + suite.GRID_SELECTOR + " element"
      };
      suite.showPuzzle = function(type, dimension, data) {
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
        var puzzle = new window[puzzleClassName](puzzleData, controls, settings);
        puzzle.render(Snap(suite.GRID_SELECTOR));
        return puzzle;
      };
      suite.gridPoint = function(puzzle, col, row) {
        return new GridPoint(puzzle, col, row);
      };
      suite.cellPoint = function(puzzle, cell, row) {
        if (typeof cell == "string") {
          return new GridPoint(puzzle, cell.charCodeAt(0) - 'a'.charCodeAt(0) + 0.5, parseInt(cell.substring(1)) - 0.5);
        }
        return new GridPoint(puzzle, cell + 0.5, row + 0.5);
      };
      // Mouse helpers accept a point or a pair of coordinates.
      suite.mouseEvent = function(x, y) {
        if (typeof x == "object") {
          return {clientX: x.x, clientY: x.y, preventDefault: ()=>{}};
        }
        return {clientX: x, clientY: y, preventDefault: ()=>{}};
      };
      suite.click = function(puzzle, x, y) {
        puzzle.controller.onMouseDown(suite.mouseEvent(x, y));
        puzzle.controller.onMouseUp(suite.mouseEvent(x, y));
      };
      suite.drag = function(puzzle, x1, y1, x2, y2) {
        let start = typeof x1 == "object" ? x1 : {x: x1, y: y1};
        let end = typeof x1 == "object" ? y1 : {x: x2, y: y2};
        puzzle.controller.onMouseDown(suite.mouseEvent(start));
        puzzle.controller.onMouseMove(suite.mouseEvent(end));
        puzzle.controller.onMouseUp(suite.mouseEvent(end));
      };
      suite.cellClick = function(puzzle, cell) {
        var size = puzzle.size.unitSize;
        var x = puzzle.size.leftGap + size/2 + size*(cell.charCodeAt(0) - 'a'.charCodeAt(0));
        var y = puzzle.size.topGap + size/2 + size*(parseInt(cell.substring(1)) - 1);
        suite.click(puzzle, x, y);
      };
      suite.edgeClick = function(puzzle, edge) {
        var size = puzzle.size.unitSize;
        var part = edge.split("-");
        var col = part[0].charCodeAt(0) - 'a'.charCodeAt(0);
        var row = parseInt(part[0].substring(1)) - 1;
        var side = part[1];

        var x = puzzle.size.leftGap + size*col + (side==1?size:(side==3?0:size/2));
        var y = puzzle.size.topGap + size*row + (side==2?size:(side==0?0:size/2));
        suite.click(puzzle, x, y);
      };
      // Clicks at the element until it gets the required value.
      suite.clickToValue = function(puzzle, element, value, name) {
        let maxClicks = element.clickSwitch ? element.clickSwitch.length : 0;
        for (let i = 0; i < maxClicks && element.getValue() != value; i++) {
          suite.click(puzzle, element.center());
        }
        if (element.getValue() != value) {
          throw "Value " + JSON.stringify(value) + " can't be set for " + name;
        }
      };
      suite.enterSolution = function(puzzle, data) {
        let cellPosition = cell => ({col: cell.charCodeAt(0) - 'a'.charCodeAt(0), row: parseInt(cell.substring(1)) - 1});
        for (let [key, value] of Object.entries(data)) {
          if (key == "connectors") {
            // Connector "a1-h" joins a1 with the cell to the right of it, "a1-v" - with the cell below it.
            for (let connector of Object.keys(value)) {
              let part = connector.split("-");
              let pos = cellPosition(part[0]);
              let other = part[1] == "h" ? puzzle.cells[pos.row][pos.col + 1] : puzzle.cells[pos.row + 1][pos.col];
              suite.drag(puzzle, puzzle.cells[pos.row][pos.col].center(), other.center());
            }
          } else if (key == "edges") {
            for (let [edge, edgeValue] of Object.entries(value)) {
              let part = edge.split("-");
              let pos = cellPosition(part[0]);
              suite.clickToValue(puzzle, puzzle.edges[pos.row][pos.col][part[1]], edgeValue, "edge " + edge);
            }
          } else if (key == "areas") {
            // Border is set at the right and at the bottom edges of the cell when the next cell belongs to another area.
            let areaOfCell = {};
            value.forEach((area, index) => area.forEach(cell => areaOfCell[cell] = index));
            for (let row = 0; row < puzzle.rows; row++) {
              for (let col = 0; col < puzzle.cols; col++) {
                let name = puzzle.cells[row][col].getCoordinates();
                if (col < puzzle.cols - 1 && areaOfCell[name] != areaOfCell[puzzle.cells[row][col + 1].getCoordinates()]) {
                  suite.clickToValue(puzzle, puzzle.edges[row][col][1], "bold", "edge " + name + "-1");
                }
                if (row < puzzle.rows - 1 && areaOfCell[name] != areaOfCell[puzzle.cells[row + 1][col].getCoordinates()]) {
                  suite.clickToValue(puzzle, puzzle.edges[row][col][2], "bold", "edge " + name + "-2");
                }
              }
            }
          } else if (/^[a-z][0-9]+$/.test(key)) {
            let pos = cellPosition(key);
            let cell = puzzle.cells[pos.row][pos.col];
            if (cell.chooserValues != null) {
              let item = cell.chooserValues.findIndex(chooserValue => chooserValue.returnValue == value);
              if (item < 0) {
                throw "Value " + JSON.stringify(value) + " can't be chosen for cell " + key;
              }
              cell.switchOnChooser(item);
            } else {
              suite.clickToValue(puzzle, cell, value, "cell " + key);
            }
          } else {
            throw "Solution data " + key + " is not supported";
          }
        }
      };
      requirejs([moduleName], () => {
        if (customSetup.length > 0) {
          customSetup[customSetup.length - 1].exec(suite, cb);
        } else {
          cb();
        }
      });
    }),
    after((suite) => {
      Snap(suite.GRID_SELECTOR).clear();
    }),
    ...otherItems);
}
