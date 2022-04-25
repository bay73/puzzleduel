var allTestSuites = [];


requirejs(["tests/squarepuzzle_test.js"], ()=>{
  allTestSuites.push(squarePuzzleTestSuite);
  allTestSuites.push(squarePuzzleEditTestSuite);
})

requirejs(["tests/areapuzzle_test.js"], ()=>{
  allTestSuites.push(areaPuzzleTestSuite);
  allTestSuites.push(areaPuzzleEditTestSuite);
})

requirejs(["tests/mouse_test.js"], ()=>{
  allTestSuites.push(mouseTestSuite);
})

requirejs(["tests/submissiondata_test.js"], ()=>{
  allTestSuites.push(submissionSquareDataTestSuite);
  allTestSuites.push(submissionAreaDataTestSuite);
})

requirejs(["tests/checkers_test.js"], ()=>{
  allTestSuites.push(yingYangCheckerTestSuite);
})

