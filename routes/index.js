const express = require('express');
const router = express.Router();

// Welcome Page
router.get('/', (req, res) => 
  res.render('welcome', {
    user: req.user,
    puzzle: {
      type: {
        code: "tapa_classic",
        name: "Tapa",
        rules: "Shade some empty cells black to create a single connected wall. Numbers in a cell indicate the length of consecutive shaded blocks in the neighboring cells. If there is more than one number in a cell, then there must be at least one white (unshaded) cell between the black cell groups.",
        puzzleJs: "square_puzzle.js",
        puzzleObj: "squarePuzzle"
      }
    }
  }));

module.exports = router;
