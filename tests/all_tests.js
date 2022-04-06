var allTestSuites = [];


requirejs(["tests/squarepuzzle_test.js"], ()=>{
  allTestSuites.push(squarePuzzleTestSuite);
  allTestSuites.push(squarePuzzleEditTestSuite);
})


