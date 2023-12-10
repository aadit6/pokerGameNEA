const crypto = require('crypto');

class HashingUtil {

    constructor() {

    }

    generateSalt(sizeInBytes, callback) { //salt helps to protect against attacks such as rainbow table attacks
        crypto.randomBytes(sizeInBytes, (err, salt) => {
            if (err) {
                console.error('Error generating salt:', err.message);
                callback('Server side salt generation error. Please try again', null);
            } else {
                callback(null, salt);
            }
        });
    }

    hashPassword(password, salt, iterations, callback) {
        const keylen = 64;
        crypto.pbkdf2(password, salt, iterations, keylen, 'sha256', (err, derivedKey) => {
            if (err) {
                console.error('Error hashing password:', err.message);
                callback('Server side hashing error. Please try again', null);
            } else {
                const hashedPassword = `${iterations}.${salt.toString('hex')}.${derivedKey.toString('hex')}`;
                console.log("Length of hashed password: ", hashedPassword.length);
                callback(null, hashedPassword);
            }
        });
    }

    comparePassword(plaintextPassword, hashedPassword, callback) {
        console.log(hashedPassword);
        const [storedIterations, storedSalt, storedDerivedKey] = hashedPassword.split('.');
        const iterations = parseInt(storedIterations, 10);
        console.log("Iterations: ", iterations);
        console.log("Stored Salt: ",Buffer.from(storedSalt, 'hex'));
        console.log("Stored derivedKey: ", Buffer.from(storedDerivedKey, 'hex'));
        
        crypto.pbkdf2(
            plaintextPassword,
            Buffer.from(storedSalt, 'hex'),
            iterations,
            64,
            'sha256',
            (err, derivedKey) => {
                if (err) {
                    console.log("Error hashing password during login: ", err.message);
                    callback("Server side hashing error during login. Please try again", null);
                } else {
                    console.log("Derived key: ", derivedKey);
                    const isValid = crypto.timingSafeEqual(derivedKey, Buffer.from(storedDerivedKey, 'hex'));
                    //timingSafeEqual used to protect against timing attacks
                    if (isValid) {
                        callback(null, true);
                    } else {
                        callback("Incorrect username or password", false);
                    }
                }
            }
        );
    }
    
}

module.exports = {HashingUtil};