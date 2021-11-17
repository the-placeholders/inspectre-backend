'use strict';

const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');

const client = jwksClient({
    jwksUri: process.env.AUTH_DOMAIN
});

function getKey(header, callback) {
    client.getSigningKey(header.kid, function (err, key) {
    var signingKey = key.publicKey || key.rsaPublicKey;
    callback(null, signingKey);
    });
}

function verifyUser(req, errOrUserCallback) {

try {
    const token = req.headers.authorization.split(' ')[1];
    console.log(token);
    jwt.verify(token, getKey, {}, errOrUserCallback);
} catch (e) {
    errOrUserCallback('Not Authorized');
}
}

module.exports = verifyUser;