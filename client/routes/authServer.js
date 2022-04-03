const express = require('express');
const needle = require('needle');
var aesjs = require('aes-js');
const router = express.Router();

// An example 128-bit key (16 bytes * 8 bits/byte = 128 bits)
var key1 = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16 ];
var key2 = [ 2, 3, 4, 5, 6, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16 ];


// decryption function for token
function decryptToken(hexVal){
	var encryptedBytes = aesjs.utils.hex.toBytes(hexVal);
	var ctr = new aesjs.ModeOfOperation.ctr(key1);
	var decryptedBytes = ctr.decrypt(encryptedBytes);
	var decryptedText = aesjs.utils.utf8.fromBytes(decryptedBytes);
	return decryptedText;
}

// decryption function for token
function decryptJSON(hexVal){
	var encryptedBytes = aesjs.utils.hex.toBytes(hexVal);
	var ctr = new aesjs.ModeOfOperation.ctr(key2);
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

// encrytion function for token
function encryptJSON(jaySon){
	var textBytes = aesjs.utils.utf8.toBytes(jaySon);
	var ctr = new aesjs.ModeOfOperation.ctr(key2);
	var encryptedBytes = ctr.encrypt(textBytes);
	// for storage
	var encryptedHex = aesjs.utils.hex.fromBytes(encryptedBytes);
	return encryptedHex;
}



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
				var token = JSON.stringify(resp.body);
				if (resp.body.code) {
					res.json({
						auth: "fail",
						token:""
					})
				} else {
					console.log("Plaintext Token: \n" + token);
					var encryptedToken = encryptToken(token);
					//console.log("Decrypted Token: " + decryptToken(encryptedToken));
					const plaintextJSON = JSON.stringify({
						auth: 'success',
						encrypted: encryptedToken,
					})
					//var decryptedText = decryptToken(encryptedToken);
					var encryptedJSON = encryptJSON(plaintextJSON);
					var decryptedJSON = decryptJSON(encryptedJSON);
					console.log("Plaintext JSON: \n" + plaintextJSON);
					//console.log("Decrypted JSON: " + decryptedJSON);
					res.json({
						result: encryptedJSON
					}) 
				}
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
