const express = require('express');
const needle = require('needle');
const router = express.Router();

router.get('/login', (req, res, next) => {
  if (req.body.username && req.body.password) {
    console.log('sentaroo')
  } else {
    res.json({
      error: 'The input field is empty',
    });
  }
});

router.post('/login', (req, res, next) => {
  console.log(req.body)
  if (req.body.username) {
    if (req.body.password) {
      var username = req.body.username;
      var password = req.body.password;
      var url = "http://localhost:3000/oauth/token"
      var options = {
        username: username,
        password: password,
      }
      needle.post(url,'grant_type=client_credentials',options,function(err,resp){
        if (err) throw err;
        console.log(resp.body.accessToken)
      })
      res.json({
        yay: 'issa work'
      })
    } else {
      res.json({
        error: 'The password field is empty',
      }); 
    }
  } else {
    res.json({
      error: 'The username field is empty',
    });
  }
});

module.exports = router;
