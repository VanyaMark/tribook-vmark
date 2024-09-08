const { Schema, model } = require('mongoose');
const { validate } = require('./apartment.model');

const reservationSchema = Schema({
    email: {
        type: String,
        required: true,
        lowercase: true,
        validate: {
            validator: function(v) {
              return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v);
            },
            message: props => `${props.value} is not a valid email!`
          }
    },
    startDate: {
        type: Date,
        required: true,
        validate: {
            validator: function(value) {
                return value >= new Date();
            },
            message: 'Start date cannot be in the past!'
        }
    },
    endDate: {
        type: Date,
        required: true,
        // Realizar una validación para que startDate sea siempre antes que endDate
        validate: {
            validator: function(value) {
                return value > this.startDate; // Ensure endDate is greater than startDate
            },
            message: 'End date must be after the start date!'
        }
    },
    status: {
        type: String,
        enum: ['Pending', 'Accepted', 'Rejected'],
        default: 'Pending'
    },
    apartment: { type: Schema.Types.ObjectId, ref: 'Apartment' }
},
{ 
    timestamps: true
  }
);

const Reservation = model('Reservation', reservationSchema);

module.exports = Reservation;