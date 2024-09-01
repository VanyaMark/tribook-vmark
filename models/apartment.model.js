// Your code here ...
const { Schema, model } = require('mongoose');

const apartmentSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    size: {
        type: Number,
        required: true,
        min: 0
    },
    mainPhoto: {
        type: String,
        required: true,
    },
    services: [{
        id: String,
        label: String,
        isPresent: Boolean,
    }],
    rooms: {
        type: Number,
        min: 1,
        max: 10,
        required: true,
    },
    guests: {
        type: Number,
        min: 1,
        max: 10,
        required: true,
    }

});

const Apartment = model('Apartment', apartmentSchema);

// Exporta un único recurso
module.exports = Apartment;