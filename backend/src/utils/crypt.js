const bcrypt = require('bcryptjs');

const crypt = {
    hashPassword: async (password, rounds) => {
        const salt = await bcrypt.genSalt(parseInt(rounds));
        return await bcrypt.hash(password, salt);
    },
    matchPassword: async (enteredPassword, hashedPassword) => {
        return await bcrypt.compare(enteredPassword, hashedPassword);
    }
};

module.exports = crypt;