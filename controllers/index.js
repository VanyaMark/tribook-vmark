/** Crear un conjunto de funciones que van a dar respuesta a nuestras rutas  */

// Importamos el modelo
const Apartment = require('../models/apartment.model.js');
const Reservation = require('../models/reservation.model.js');

const getApartments = async (req, res) => {

    // Obtenemos todos los apartamentos de la base de datos
    const apartments = await Apartment.find();

    res.render('home', {
        apartments
    });
}

const getApartmentById = async (req, res) => {
    // 1. Voy al modelo para obtener el apartamento dado su id
    const { idApartment } = req.params;

    const selectedApartment = await Apartment.findById(idApartment);
    const errorMessage = '';
    res.render('detail-apartment', {
        selectedApartment,
        errorMessage
    });
};

const searchApartments = async (req, res) => {

    // PAso 3 buscar apartamentos. Parsear la query string que recibo del formulario
    const { maxPrice } = req.query;

    // Obtener del modelo todos los apartamentos cuyo precio sea menor que el precio maximo que el usuairo está dispuesto a pagar

    // Pasarle estos apartamentos ya filtrados a la vista
    const apartments = await Apartment.find({ price: { $lte: maxPrice } });
    res.render('home', {
        apartments
    });
}

const postNewReservation = async (req, res) => {
    let apartment;
    try {
        // 1. Destructure the req.body to get all reservation details
        const { email, startDate, endDate, idApartment } = req.body;

        // 2A. Retrieve the apartment from the collection using the given id
        apartment = await Apartment.findById(idApartment);
        
        if (!apartment) {
            // Handle case where apartment is not found
            return res.status(404).json({ error: "Apartment not found" });
        }

        // 2B. Create the new reservation
        const newReservation = await Reservation.create({
            email,
            startDate,
            endDate,
            apartment
        });

        // 3. Render a reservation summary page
        return res.render('reservation-summary', {
            reservation: newReservation,
            selectedApartment: apartment
        });
        // return res.status(201).json({ message: "Reservation created", newReservation });
        
    } catch (err) {
        // Catch and handle any errors that occur
        console.error(err);
        let errorMessage = "Reserva no creada, por favor, añade datos válidos."
        return res.render('detail-apartment', {
            errorMessage,
            selectedApartment: apartment
        })
        // return res.status(500).json({ error: "An error occurred while processing the reservation" });
    }
};

module.exports = {
    getApartments,
    getApartmentById,
    searchApartments,
    postNewReservation
}