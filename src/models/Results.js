const { Schema, model } = require('mongoose');

const resultSchema = new Schema({
    idPartido: String,
    ganaLocal: Boolean,
    ganaVisitante: Boolean,
    golLocal: String,
    golVisitante: String,
});

//crea la tabla users
module.exports = model('Result', resultSchema, 'results');