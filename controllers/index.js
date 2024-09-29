// Import the Apartment and Reservation models
const Apartment = require('../models/apartment.model.js');
const Reservation = require('../models/reservation.model.js');

// Fetch and render a list of apartments
const getApartments = async (req, res) => {
    let apartments;

    try {
                // Check if the user is an admin based on session authentication
        const isAdmin = req.session.isAuthenticated || false;

                // Admins can see all apartments, while non-admin users can only see published apartments
        if (isAdmin) {
            apartments = await Apartment.find(); // Fetch all apartments
        } else {
            apartments = await Apartment.find({ isPublished: true }); // Fetch only published apartments
        }

                // Render the homepage with the list of apartments
        return res.render('home', {
            apartments
        });
    } catch (error) {
        console.error('Error fetching apartments:', error);
        return res.status(500).send('Server error');
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

        // Fetch and render details of a specific apartment by its ID
const getApartmentById = async (req, res) => {
    // Extract apartment ID from the request parameters
    const { idApartment } = req.params;
    console.log(idApartment)
    const errorMessage = '';

    try {
              // Fetch the apartment from the database
        const selectedApartment = await Apartment.findById(idApartment);


        // Fetch reservations related to the apartment
        const reservations = await getApartmentReservations(idApartment);
        console.log('reservations: ', reservations); // This will now show the resolved value

     // Render the apartment details page with apartment info and reservations
       return res.render('detail-apartment', {
            selectedApartment,
            reservations, // Pass reservations to the template if needed
            errorMessage
        });
    } catch (error) {
        console.error('Error fetching apartment or reservations:', error);
        return res.status(500).send('An error occurred while fetching the apartment details');
    }
};

// Search for apartments by price and render the results
const searchApartments = async (req, res) => {

// Extract max price from query string
    const { maxPrice } = req.query;

    // Fetch apartments whose price is less than or equal to the maximum price provided by the user
    const apartments = await Apartment.find({ price: { $lte: maxPrice } });

        // Render the homepage with the filtered list of apartments
    res.render('home', {
        apartments
    });
}

// Handle the creation of a new reservation
const postNewReservation = async (req, res) => {
    let apartment;
    try {
        // Extract reservation details from the request body
        const { email, startDate, endDate, idApartment } = req.body;

        // Find the apartment by its ID
        apartment = await Apartment.findById(idApartment);
                // If apartment is not found, return a 404 error
        if (!apartment) {
            return res.status(404).json({ error: "Apartment not found" });
        }

        // Check for conflicting reservations on the same apartment
        const reservations = await getApartmentReservations(idApartment);
        console.log('reservations: ', reservations); // This will now show the resolved value

        const conflictes = await Reservation.findOne({
            apartment: idApartment,
            $or: [
              { startDate: { $lt: endDate }, endDate: { $gt: startDate } } // Check if dates overlap
            ]
          });
          console.log('conflictes: ', conflictes)

          // If there is a conflict, flash an error message and redirect to the apartment details page
          if (conflictes) {
            req.flash('error', 'Fechas de la reserva no disponibles');
          return  res.redirect(`/apartment/${idApartment}`); // Return to the form page with error message
          } else {
        // Create the new reservation
        const newReservation = await Reservation.create({
            email,
            startDate,
            endDate,
            apartment
        });

         // Render a reservation summary page after successful booking
        return res.render('reservation-summary', {
            reservation: newReservation,
            selectedApartment: apartment,
            errorMessage: req.flash('error'),
        });
    }
    } catch (err) {
        // Handle any errors that occur during the reservation process
        console.error(err);
        req.flash('error', "Reserva no creada, por favor, añade datos válidos.") 
        return res.render('detail-apartment', {
            errorMsg: req.flash('error'),
            selectedApartment: apartment
        })
    }
};

module.exports = {
    getApartments,
    getApartmentById,
    searchApartments,
    postNewReservation
}