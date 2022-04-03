const express = require('express');
const bodyParser = require('body-parser');
const needle = require('needle');
var aesjs = require('aes-js');
const exp = express();
const router = express.Router();


var key2 = [ 2, 3, 4, 5, 6, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16 ];

// decryption function for token
function decryptJSON(hexVal){
  var encryptedBytes = aesjs.utils.hex.toBytes(hexVal);
  var ctr = new aesjs.ModeOfOperation.ctr(key2);
  var decryptedBytes = ctr.decrypt(encryptedBytes);
  var decryptedText = aesjs.utils.utf8.fromBytes(decryptedBytes);
  return decryptedText;
}

// encrytion function for token
function encryptJSON(jaySon){
  var textBytes = aesjs.utils.utf8.toBytes(jaySon);
  var ctr = new aesjs.ModeOfOperation.ctr(key2);
  var encryptedBytes = ctr.encrypt(textBytes);
  // for storage
  var encryptedHex = aesjs.utils.hex.fromBytes(encryptedBytes);
  return encryptedHex;
}


router.post('/login', (req, res, next) => {
  if (req.body.username && req.body.password) {
    var username = req.body.username;
    var password = req.body.password;
    var jaySun = JSON.stringify({
      username: username,
      password: password
    })
    console.log(jaySun);
 
    needle.post("localhost:5000/auth/login",jaySun,{json:true},function(err,resp){
      if (err) throw err;
      if (resp.body.result){
        var result = resp.body.result;
        var decryptedJSON = JSON.parse(decryptJSON(result))
        console.log("Decrypted JSON: \n" + JSON.stringify(decryptedJSON));
        var jaiSun = JSON.stringify({
          token: decryptedJSON.encrypted
        })
        //console.log(jaiSun)
        needle.post("localhost:5000/app/login",jaiSun,{json:true}, function(err,resp){
          if (err) throw err;
          if (resp.body.accessToken){
            var retval = {
              "auth": "success",
              "token": resp.body.accessToken,
              "expiration_date": resp.body.accessTokenExpiresAt,
              "client": resp.body.client
            }
            res.json(retval)
          } else {
            res.json({
              error: 'something is wrong'
            })
          }
        })
      } else {
        res.json({
          error: 'something is wrong'
        })
      }
    })
  } else {
    res.json({
      error: 'The username or password is empty',
    });
  }
});

module.exports = router;