const express = require('express');
const router = express.Router();
const SudoqLog = require('../models/SudoqLog');

// Save puzzle log
router.post('/:userid/:date', async (req, res, next) => {
  try {
    const logItems = []
    for (let i=0; i< req.body.length; i++) {
      const bodyItem = req.body[i]
      logItems.push(
        new SudoqLog({
          userId: req.params.userid,
          puzzleDate: req.params.date,
          size: bodyItem.size,
          answer: bodyItem.answer,
          solved: bodyItem.solved,
          time: bodyItem.time
        })
      )
    }
    await SudoqLog.insertMany(logItems)
    res.json(null);
  } catch (e) {
    next(e);
  }
});

module.exports = router;