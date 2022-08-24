const { Schema, model } = require('mongoose');

const competitionSchema = new Schema({
    id: String,
    name: String,
    flag: String,
    anio: String,
    activa: Boolean
}, {
    timestamps: true
});

//crea la tabla users
module.exports = model('Competition', competitionSchema, 'competitions');