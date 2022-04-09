function testSuite(name, ...tests) {
  let testList = [];
  let beforeEach = [];
  let afterEach = [];
  let beforeAll = (cb) => cb();
  let afterAll = () => null;
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
  
  return {name: name,
    exec: (hideDetails) => {
    beforeAll( () => {
      let failed = 0;
      let passed = 0;
      console.log("%c" + name, "font-weight:bold");
      for (let i=0; i<testList.length; i++) {
        for (let j=0; j<beforeEach.length; j++) {
          beforeEach[j]();
        }
        let result = testList[i]();
        for (let j=0; j<afterEach.length; j++) {
          afterEach[j]();
        }
        if (result.status == "PASSED") {
          passed++;
          if (!hideDetails) {
            console.log("  " + result.name + " %c" + result.status, "color:green");
          }
        } else {
          failed++;
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
    });
    afterAll();
  }};
}

testSuite.TEST = 1;
testSuite.BEFORE_EACH = 2;
testSuite.AFTER_EACH = 3;
testSuite.BEFORE_ALL = 4;
testSuite.AFTER_ALL = 5;

function test(name, fn) {
  return {
    type: testSuite.TEST,
    exec: () => {
      try {
        fn();
        return {name: name, status: "PASSED"};
      } catch (error) {
        return {name: name, status: "FAILED", error: error};
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
  return this.assertWithMessage("expected to be not null, but was null", this.subject != null);
}

assertSubject.prototype.isNull = function() {
  return this.assertWithMessage("expected to be null, but was " + JSON.stringify(this.subject), this.subject == null);
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
