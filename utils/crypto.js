const CryptoJs = require("crypto-js");
const keys = require("../config/keys");

const crypto = {};

const encryptToken = (token) => {
  const ciphertext = CryptoJs.TripleDES.encrypt(
    token,
    keys.secretOrKey
  ).toString();
  return ciphertext;
};

const decryptToken = (token) => {
  const ciphertext = CryptoJs.TripleDES.decrypt(
    token,
    keys.secretOrKey
  ).toString();
  return ciphertext;
};

crypto.encryptToken = encryptToken;
crypto.decryptToken = decryptToken;

module.exports = crypto;
