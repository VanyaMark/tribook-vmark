/** Crear un conjunto de funciones que van a dar respuesta a nuestras rutas  */

// Importamos el modelo
const Apartment = require('../models/apartment.model.js');
const Reservation = require('../models/reservation.model.js');

const getApartments = async (req, res) => {
    let apartments;

    try {
        const isAdmin = req.session.isAuthenticated || false;

        if (isAdmin) {
            apartments = await Apartment.find();
        } else {
            apartments = await Apartment.find({ isPublished: true });
        }

        res.render('home', {
            apartments
        });
    } catch (error) {
        console.error('Error fetching apartments:', error);
        res.status(500).send('Server error');
    }
}

        // Async function to get reservations for the apartment
        const getApartmentReservations = async (apartmentId) => {
            const reservations = await Reservation.find({ apartment: apartmentId });
            return reservations.map(reservation => ({
                startDate: reservation.startDate,
                endDate: reservation.endDate,
            }));
        };

const getApartmentById = async (req, res) => {
    // 1. Fetch the apartment by its id
    const { idApartment } = req.params;
    console.log(idApartment)
    const errorMessage = '';

    try {
        const selectedApartment = await Apartment.findById(idApartment);


        // Await the result of getApartmentReservations
        const reservations = await getApartmentReservations(idApartment);
        console.log('reservations: ', reservations); // This will now show the resolved value

        // Render the view with the apartment details and reservations
        res.render('detail-apartment', {
            selectedApartment,
            reservations, // Pass reservations to the template if needed
            errorMessage
        });
    } catch (error) {
        console.error('Error fetching apartment or reservations:', error);
        res.status(500).send('An error occurred while fetching the apartment details');
    }
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

        // Await the result of getApartmentReservations
        const reservations = await getApartmentReservations(idApartment);
        console.log('reservations: ', reservations); // This will now show the resolved value

        const conflictes = await Reservation.findOne({
            apartment: idApartment,
            $or: [
              { startDate: { $lt: endDate }, endDate: { $gt: startDate } }
            ]
          });

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