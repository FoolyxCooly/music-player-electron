const crypto = require('crypto');

function generateCodeVerifier() {
  return crypto.randomBytes(64).toString('hex');
}

function generateCodeChallenge(verifier) {
  return crypto.createHash('sha256').update(verifier).digest('base64url');
}

const verifier = generateCodeVerifier();
const challenge = generateCodeChallenge(verifier);

console.log("Verifier:", verifier);
console.log("Challenge:", challenge);

module.exports = { verifier, challenge };