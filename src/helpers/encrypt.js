const { default: axios } = require("axios");
const crypto = require("crypto");
const uniqid = require("uniqid");
const atob = require("atob")
const fs = require("fs");
const path = require("path");


module.exports = {
    signAndEncode: async (data) => {
        try {
            // let privateKey = process.env.opay_merchant_private_key;
            const privateKeyPem =fs.readFileSync( path.join(__dirname, "../config/merchant_private_key.pem"), { encoding: 'utf8', flag: 'r' })
            console.log("private key", privateKeyPem)
        //    path.join(__dirname, "public")
            console.log("data", data)
            let data1 = JSON.stringify(data);
            console.log("data1", data1)
            // Create a signature using SHA256withRSA
            const sign = crypto.createSign("RSA-SHA256");
            sign.write(data1);
            sign.end();
    
            // Sign the JSON payload with the private key
            const signature = sign.sign(privateKeyPem, 'base64');
    
            // Encode the signature in Base64
            const base64Signature = Buffer.from(signature).toString('base64');
            return base64Signature;
            
        } catch (e) {
            console.log(e)
        }
    },

    encryptAndEncode: async (data) => {
        try {
            // let pubKey = process.env.opay_merchant_public_key;
            const pubKeyPem =fs.readFileSync( path.join(__dirname, "../config/merchant_public_key.pem"), { encoding: 'utf8', flag: 'r' });
            let data1 = JSON.stringify(data);
            // Encrypt the data with RSA/ECB/PKCS1Padding using the public key
            const encryptData = crypto.publicEncrypt({
                key: pubKeyPem,
                padding: crypto.constants.RSA_PKCS1_PADDING
            }, Buffer.from(data1, 'utf8'))
    
            // Encode the encrypted data with Base64
            const base64EncryptedData = encryptData.toString('base64')
            return base64EncryptedData  
        } catch (e) {
            console.log(e)
        }
    },
    decodeAndDecrypt: async (resp) => {
        try {
            // let privateKey = process.env.opay_merchant_private_key;
            const privateKeyPem =fs.readFileSync( path.join(__dirname, "../config/merchant_private_key.pem"), { encoding: 'utf8', flag: 'r' });
            const decodedData = atob(resp);
            
            // Decrypt the data using RSA/ECB/PKCS1Padding
            const decryptedData = crypto.privateDecrypt({
                key: privateKeyPem,
                padding: crypto.constants.RSA_PKCS1_PADDING
            }, decodedData
            ).toString();
            const decryptedString = atob(decryptedData);
    
            const result = JSON.parse(decryptedString);
            return result
            
        } catch (e) {
            console.log(e)
        }
    }
}