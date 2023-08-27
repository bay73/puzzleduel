var allTestSuites = [];

requirejs(["tests/abc_division.test.js"], ()=>{
  allTestSuites.push(abcDivisionTestSuite);
})

requirejs(["tests/akari.test.js"], ()=>{
  allTestSuites.push(akariTestSuite);
})

requirejs(["tests/araf.test.js"], ()=>{
  allTestSuites.push(arafTestSuite);
})

requirejs(["tests/black_white.test.js"], ()=>{
  allTestSuites.push(blackWhiteTestSuite);
})

requirejs(["tests/chaos.test.js"], ()=>{
  allTestSuites.push(chaosTestSuite);
})

requirejs(["tests/clouds.test.js"], ()=>{
  allTestSuites.push(cloudsTestSuite);
})

requirejs(["tests/domino_castle_sum.test.js"], ()=>{
  allTestSuites.push(dominoCastleSumTestSuite);
})

requirejs(["tests/domino_hunt.test.js"], ()=>{
  allTestSuites.push(dominoHuntTestSuite);
})

requirejs(["tests/doubleblock.test.js"], ()=>{
  allTestSuites.push(doubleblockTestSuite);
})

requirejs(["tests/easy_as_coral.test.js"], ()=>{
  allTestSuites.push(easyAsCoralTestSuite);
})

requirejs(["tests/easy_as_abc.test.js"], ()=>{
  allTestSuites.push(easyAsAbcTestSuite);
})

requirejs(["tests/fence.test.js"], ()=>{
  allTestSuites.push(fenceTestSuite);
})

requirejs(["tests/fillomino.test.js"], ()=>{
  allTestSuites.push(fillominoTestSuite);
})

requirejs(["tests/foseruzu.test.js"], ()=>{
  allTestSuites.push(foseruzuTestSuite);
})

requirejs(["tests/fuzuli.test.js"], ()=>{
  allTestSuites.push(fuzuliTestSuite);
})

requirejs(["tests/gaps.test.js"], ()=>{
  allTestSuites.push(gapsTestSuite);
})

requirejs(["tests/hexa_islands.test.js"], ()=>{
  allTestSuites.push(hexaIslandsTestSuite);
})

requirejs(["tests/hexa_fence.test.js"], ()=>{
  allTestSuites.push(hexaFenceTestSuite);
})

requirejs(["tests/hexa_minesweeper.test.js"], ()=>{
  allTestSuites.push(hexaMinesweeperTestSuite);
})

requirejs(["tests/hexa_paint.test.js"], ()=>{
  allTestSuites.push(hexaPaintTestSuite);
})

requirejs(["tests/heyawake.test.js"], ()=>{
  allTestSuites.push(heyawakeTestSuite);
})

requirejs(["tests/hitori.test.js"], ()=>{
  allTestSuites.push(hitoriTestSuite);
})

requirejs(["tests/l_shapes.test.js"], ()=>{
  allTestSuites.push(lShapesTestSuite);
})

requirejs(["tests/lits.test.js"], ()=>{
  allTestSuites.push(litsTestSuite);
})

requirejs(["tests/magic_snail.test.js"], ()=>{
  allTestSuites.push(magicSnailTestSuite);
})

requirejs(["tests/minesweeper_classic.test.js"], ()=>{
  allTestSuites.push(minesweeperClassicTestSuite);
})

requirejs(["tests/nanro.test.js"], ()=>{
  allTestSuites.push(nanroTestSuite);
})

requirejs(["tests/neighbors.test.js"], ()=>{
  allTestSuites.push(neighborsTestSuite);
})

requirejs(["tests/norinori.test.js"], ()=>{
  allTestSuites.push(norinoriTestSuite);
})

requirejs(["tests/paint_by_max.test.js"], ()=>{
  allTestSuites.push(paintByMaxTestSuite);
})

requirejs(["tests/passage.test.js"], ()=>{
  allTestSuites.push(passageTestSuite);
})

requirejs(["tests/pentomino_hungarian.test.js"], ()=>{
  allTestSuites.push(pentominoHungarianTestSuite);
})

requirejs(["tests/pentomino_touch.test.js"], ()=>{
  allTestSuites.push(pentominoTouchTestSuite);
})

requirejs(["tests/point_a_star.test.js"], ()=>{
  allTestSuites.push(pointAStarTestSuite);
})

requirejs(["tests/queens.test.js"], ()=>{
  allTestSuites.push(queensTestSuite);
})

requirejs(["tests/railroad.test.js"], ()=>{
  allTestSuites.push(railroadTestSuite);
})

requirejs(["tests/ripple_effect.test.js"], ()=>{
  allTestSuites.push(rippleEffectTestSuite);
})

requirejs(["tests/shikaku.test.js"], ()=>{
  allTestSuites.push(shikakuTestSuite);
})

requirejs(["tests/skyscrapers.test.js"], ()=>{
  allTestSuites.push(skyscrapersTestSuite);
})

requirejs(["tests/snake_dutch.test.js"], ()=>{
  allTestSuites.push(snakeDutchTestSuite);
})

requirejs(["tests/snake_max.test.js"], ()=>{
  allTestSuites.push(snakeMaxTestSuite);
})

requirejs(["tests/snake_simple.test.js"], ()=>{
  allTestSuites.push(snakeSimpleTestSuite);
})

requirejs(["tests/starbattle.test.js"], ()=>{
  allTestSuites.push(starbattleTestSuite);
})

requirejs(["tests/starbattle_smallregions.test.js"], ()=>{
  allTestSuites.push(starbattleSmallregionsTestSuite);
})

requirejs(["tests/spiral_galaxies.test.js"], ()=>{
  allTestSuites.push(spiralGalaxiesTestSuite);
})

requirejs(["tests/squares_and_rectangles.test.js"], ()=>{
  allTestSuites.push(squaresAndRectanglesTestSuite);
})


requirejs(["tests/sudoku_antidiagonal.test.js"], ()=>{
  allTestSuites.push(sudokuAntidiagonalTestSuite);
})

requirejs(["tests/sudoku_antiknight.test.js"], ()=>{
  allTestSuites.push(sudokuAntiknightTestSuite);
})

requirejs(["tests/sudoku_classic.test.js"], ()=>{
  allTestSuites.push(sudokuClassicTestSuite);
})

requirejs(["tests/sudoku_diagonal.test.js"], ()=>{
  allTestSuites.push(sudokuDiagonalTestSuite);
})

requirejs(["tests/sudoku_notouch.test.js"], ()=>{
  allTestSuites.push(sudokuNotouchTestSuite);
})

requirejs(["tests/sudoku_odd_even_big_small.test.js"], ()=>{
  allTestSuites.push(sudokuOddEvenBigSmallTestSuite);
})

requirejs(["tests/sudoku_pair_sum.test.js"], ()=>{
  allTestSuites.push(sudokuPairSumTestSuite);
})

requirejs(["tests/sudoku_skyscrapers.test.js"], ()=>{
  allTestSuites.push(sudokuSyscrapersTestSuite);
})

requirejs(["tests/sudoku_skyscrapers.test.js"], ()=>{
  allTestSuites.push(sudokuSyscrapersTestSuite);
})

requirejs(["tests/sudoku_square_number.test.js"], ()=>{
  allTestSuites.push(sudokuSquareNumberTestSuite);
})

requirejs(["tests/suguru.test.js"], ()=>{
  allTestSuites.push(suguruTestSuite);
})

requirejs(["tests/tapa_classic.test.js"], ()=>{
  allTestSuites.push(tapaClassicTestSuite);
})

requirejs(["tests/two_apiece.test.js"], ()=>{
  allTestSuites.push(twoApieceTestSuite);
})

requirejs(["tests/yin_yang_classic.test.js"], ()=>{
  allTestSuites.push(yinYangClassicTestSuite);
})

