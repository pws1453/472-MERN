const express = require('express');
const needle = require('needle');
var aesjs = require('aes-js');
const router = express.Router();

var key1 = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16 ];

// decryption function for token
function decryptToken(hexVal){
  var encryptedBytes = aesjs.utils.hex.toBytes(hexVal);
  var ctr = new aesjs.ModeOfOperation.ctr(key1);
  var decryptedBytes = ctr.decrypt(encryptedBytes);
  var decryptedText = aesjs.utils.utf8.fromBytes(decryptedBytes);
  return decryptedText;
}

// encrytion function for token
function encryptToken(token){
  var textBytes = aesjs.utils.utf8.toBytes(token);
  var ctr = new aesjs.ModeOfOperation.ctr(key1);
  var encryptedBytes = ctr.encrypt(textBytes);
  // for storage
  var encryptedHex = aesjs.utils.hex.fromBytes(encryptedBytes);
  return encryptedHex;
}




router.post('/login', (req, res, next) => {
  if (req.body.token) {
    var encryptedToken = req.body.token;
    //console.log("encrypted sent: " + encryptedToken)
    var tokein = decryptToken(encryptedToken);
    var resp = JSON.parse(tokein);
    console.log("Decrypted Token" + tokein);
    res.json(resp)
  } else {
    res.json({
      error: 'The input field is empty',
    });
  }
});

module.exports = router;
