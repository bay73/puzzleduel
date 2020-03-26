const express = require('express');
const router = express.Router();
// PuzzleType model
const PuzzleType = require('../models/PuzzleType');

// Welcome Page
router.get('/', (req, res) => { 
  PuzzleType.findOne({ code: 'tapa_classic' }).then(type => {
    if(type) {
      var puzzle = {
        type: type
      }
    }
    res.render('welcome', {
      user: req.user,
      puzzle: puzzle
    });
  });
});

module.exports = router;
