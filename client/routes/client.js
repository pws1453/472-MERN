const express = require('express');
const router = express.Router();


router.post('/login', (req, res, next) => {
  if (req.body.username && req.body.password) {
    console.log('sentaroo')
  } else {
    res.json({
      error: 'The username or password is empty',
    });
  }
});

module.exports = router;