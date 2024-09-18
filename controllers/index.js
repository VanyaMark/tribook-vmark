/** Crear un conjunto de funciones que van a dar respuesta a nuestras rutas  */

// Importamos el modelo
const Apartment = require("../models/apartment.model.js");
const Reservation = require("../models/reservation.model.js");

const getApartments = async (req, res) => {
  let apartments;

  try {
    const isAdmin = req.session.isAuthenticated || false;

    if (isAdmin) {
      apartments = await Apartment.find();
    } else {
      apartments = await Apartment.find({ isPublished: true });
    }

    res.render("home", {
      apartments,
    });
  } catch (error) {
    console.error("Error fetching apartments:", error);
    res.status(500).send("Server error");
  }
};

// Async function to get reservations for the apartment
const getApartmentReservations = async (apartmentId) => {
  const reservations = await Reservation.find({ apartment: apartmentId });
  return reservations.map((reservation) => ({
    startDate: reservation.startDate,
    endDate: reservation.endDate,
  }));
};

const getApartmentById = async (req, res) => {
  // 1. Fetch the apartment by its id
  const { idApartment } = req.params;
  console.log(idApartment);
  const errorMessage = "";

  try {
    const selectedApartment = await Apartment.findById(idApartment);

    // Await the result of getApartmentReservations
    const reservations = await getApartmentReservations(idApartment);
    console.log("reservations: ", reservations); // This will now show the resolved value

    // Mapear las reservas para asegurarse de que las fechas están en el formato correcto
    const mappedReservations = reservations.map((reservation) => ({
      startDate: new Date(reservation.startDate).toISOString().split("T")[0], // Convertir a formato YYYY-MM-DD
      endDate: new Date(reservation.endDate).toISOString().split("T")[0], // Convertir a formato YYYY-MM-DD
    }));
    // Render the view with the apartment details and reservations
    return res.render("detail-apartment", {
      selectedApartment,
      reservations: mappedReservations, // Pass reservations to the template if needed
      errorMsg: req.flash("error"),
    });
  } catch (error) {
    req.flash("error", "No se pudo cargar el apartamento.");
    return res.redirect("/apartments");
  }
};

const searchApartments = async (req, res) => {
  // PAso 3 buscar apartamentos. Parsear la query string que recibo del formulario
  const { maxPrice } = req.query;

  // Obtener del modelo todos los apartamentos cuyo precio sea menor que el precio maximo que el usuairo está dispuesto a pagar

  // Pasarle estos apartamentos ya filtrados a la vista
  const apartments = await Apartment.find({ price: { $lte: maxPrice } });
  res.render("home", {
    apartments,
  });
};

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
    console.log("reservations: ", reservations); // This will now show the resolved value

    const conflictes = await Reservation.findOne({
      apartment: idApartment,
      $or: [{ startDate: { $lt: endDate }, endDate: { $gt: startDate } }],
    });

    console.log("conflictes: ", conflictes);
    if (conflictes) {
      req.flash("error", "Fechas de la reserva no disponibles");
      return res.redirect(`/apartment/${idApartment}`); // Redirige a la página del formulario con un mensaje de error
    } else {
      // 2B. Create the new reservation
      const newReservation = await Reservation.create({
        email,
        startDate,
        endDate,
        apartment,
      });

      // 3. Render a reservation summary page
      return res.render("reservation-summary", {
        reservation: newReservation,
        selectedApartment: apartment,
        errorMessage: req.flash("error"),
      });
      // return res.status(201).json({ message: "Reservation created", newReservation });
    }
  } catch (err) {
    // Catch and handle any errors that occur
    console.error(err);
    req.flash("error", "Reserva no creada, por favor, añade datos válidos.");
    return res.render("detail-apartment", {
      errorMsg: req.flash("error"),
      selectedApartment: apartment,
    });
    // return res.status(500).json({ error: "An error occurred while processing the reservation" });
  }
};

module.exports = {
  getApartments,
  getApartmentById,
  searchApartments,
  postNewReservation,
};
