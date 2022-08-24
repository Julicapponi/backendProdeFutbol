const { Schema, model } = require('mongoose');

const userSchema = new Schema({
    name: String,
    userName: String,
    email: String,
    password: String,
    admin: String
}, {
    timestamps: true
});

//crea la tabla users
module.exports = model('User', userSchema, 'users');