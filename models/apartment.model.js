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
    services: {
        // array de strings 
        // ["wifi", "air aconditionar"]
        // objeto con los servicios { wifi: true, airConditioner: false}
        wifi: Boolean,
        airConditioner: Boolean,
        kitchen: Boolean,
        disability: Boolean,
        heater: Boolean,
        tv: Boolean
    },
    // services: {
    //     type: [String], // enum
    //     validate: {
    //         validator: function (v) {
    //             return "Devuelve false si el valor 'v' a insertar no es Wifi o Kitchem o Air conditionating bla bla"
    //         },
    //         message: props => `${props.value} is not a valid service!`
    //     },
    // }

});

const Apartment = model('Apartment', apartmentSchema);

// Exporta un único recurso
module.exports = Apartment;