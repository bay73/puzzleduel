var allTestSuites = [];


requirejs(["tests/squarepuzzle_test.js"], ()=>{
  allTestSuites.push(squarePuzzleTestSuite);
  allTestSuites.push(squarePuzzleEditTestSuite);
})

requirejs(["tests/areapuzzle_test.js"], ()=>{
  allTestSuites.push(areaPuzzleTestSuite);
  allTestSuites.push(areaPuzzleEditTestSuite);
})


