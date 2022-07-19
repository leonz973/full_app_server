/** @format */

let CryptoJS = require('crypto-js');
let config = require('./config');
let desUtil = {
    encryptByDESModeEBC: function encryptByDESModeEBC(message) {
        let keyHex = CryptoJS.enc.Utf8.parse(config.salt);
        let encrypted = CryptoJS.DES.encrypt(message, keyHex, {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        });
        return encrypted.ciphertext.toString(); //DES  ECB模式加密
    },
    decryptByDESModeEBC: function decryptByDESModeEBC(ciphertext) {
        let keyHex = CryptoJS.enc.Utf8.parse(config.salt);
        let decrypted = CryptoJS.DES.decrypt(
            {
                ciphertext: CryptoJS.enc.Hex.parse(ciphertext)
            },
            keyHex,
            {
                mode: CryptoJS.mode.ECB,
                padding: CryptoJS.pad.Pkcs7
            }
        );
        let result_value = decrypted.toString(CryptoJS.enc.Utf8);
        return result_value; //DES  ECB模式解密
    }
};

let aesUtil = {
    encryptByAESModeEBC: function encryptByAESModeEBC(message) {
        let keyHex = CryptoJS.enc.Utf8.parse(config.salt);
        let encrypted = CryptoJS.AES.encrypt(message, keyHex, {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        });
        return encrypted.ciphertext.toString(); //AES  ECB模式加密
    },
    decryptByAESModeEBC: function decryptByAESModeEBC(ciphertext) {
        let keyHex = CryptoJS.enc.Utf8.parse(config.salt);
        let decrypted = CryptoJS.AES.decrypt(
            {
                ciphertext: CryptoJS.enc.Hex.parse(ciphertext)
            },
            keyHex,
            {
                mode: CryptoJS.mode.ECB,
                padding: CryptoJS.pad.Pkcs7
            }
        );
        let result_value = decrypted.toString(CryptoJS.enc.Utf8);
        return result_value; //DES  ECB模式解密
    }
};
module.exports = {
    desUtil,
    aesUtil
};
