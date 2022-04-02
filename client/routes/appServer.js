const express = require('express');
const router = express.Router();
const needle = require('needle');

router.post('/app/login', (req, res, next) => {
  if (req.body.username && req.body.password) {
    console.log('sentaroo')
  } else {
    res.json({
      error: 'The input field is empty',
    });
  }
});

module.exports = router;
