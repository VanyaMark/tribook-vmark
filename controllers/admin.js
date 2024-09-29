// Import the Apartment model
const Apartment = require("../models/apartment.model.js");

// Define an array of all possible services, each with a default 'isPresent' value of false
const allServices = [
  { id: "wifi", label: "Wi-Fi", isPresent: false },
  { id: "airConditioner", label: "Aire Acondicionado", isPresent: false },
  { id: "kitchen", label: "Cocina", isPresent: false },
  { id: "disabilityAccess", label: "Acceso Minusválidos", isPresent: false },
  { id: "heating", label: "Calefacción", isPresent: false },
  { id: "tv", label: "Televisión", isPresent: false },
];

//Additional function to manage services in case of no services present
const checkServices = (services) => {
  // If no services are provided, return the default list with 'isPresent' set to false
  if (!services) {
    return allServices;
  } else {
    // Map over allServices and update 'isPresent' to true for services that are included in the input list
    const checkedServices = allServices.map((service) => {
      return {
        id: service.id,
        label: service.label,
        isPresent: services.includes(service.label), // Mark service as present if included in input
      };
    });
    return checkedServices;
  }
};

// Render the form to create a new apartment
const getNewApartmentForm = (req, res) => {
  const apartments = Apartment.find();
  res.render("new-apartment.ejs");
};

// Handle the submission of a new apartment
const postNewApartment = async (req, res) => {
  const {
    title,
    description,
    price,
    size,
    rooms,
    bathrooms,
    guests,
    mainPhoto,
    services,
  } = req.body;

  try {
            // Create a new apartment in the database
    await Apartment.create({
      title,
      description,
      price,
      size,
      rooms,
      bathrooms,
      guests,
      mainPhoto,
      services: checkServices(services), // Check and map services provided
      isPublished: true, // Mark apartment as published by default
    });

    req.flash("success", "Apartamento creado con éxito");
    return res.redirect("/"); // Redirect to homepage on success
  } catch (error) {
    console.error("Error al crear el apartamento:", error);
    req.flash(
      "error",
      "No se pudo crear el apartamento. Por favor, inténtelo de nuevo."
    );
    return res.redirect("/apartment/new-apartment"); // Redirect to form with error message
  }
};

// Render the form to edit an existing apartment
const getApartmentByIdEdit = async (req, res) => {
// Extract apartment ID from the request params
  const { idApartment } = req.params;

      // Find the apartment by its ID
  const selectedApartment = await Apartment.findById(idApartment);

      // Render the edit form with the selected apartment's details
  return res.render("apartment-edit", {
    selectedApartment,
  });
};

// Handle updating an existing apartment
const postApartmentByIdEdit = async (req, res) => {
    // Extract apartment ID from the request params
  const { idApartment } = req.params;
  
  const {
    title,
    description,
    price,
    size,
    rooms,
    bathrooms,
    guests,
    mainPhoto,
    services,
  } = req.body;

  try {
  // Find and update the apartment by its ID
  const updatedApartment = await Apartment.findByIdAndUpdate(idApartment, {
    title,
    description,
    price,
    size,
    rooms,
    bathrooms,
    guests,
    mainPhoto,
    services: checkServices(services), // Check and map updated services
    isPublished: true, // Ensure the apartment remains published
  });
  console.log("updated apartment: ", updatedApartment);
  req.flash("success", "Apartamento editado con éxito");
  // Redirect to homepage on success
  return res.redirect("/");
} catch (error) {
    console.error('Error updating apartment:', error);
    req.flash('error', 'Failed to update apartment. Please try again.');
    return res.redirect(`/apartment/${idApartment}/edit`); // Redirect to edit form with error message
}
};

// Handle unpublishing an apartment (set isPublished to false)
const postUnpublishApartment =
  ("/apartments/:id/unpublish",
  async (req, res) => {
    try {
      const { idApartment } = req.params;
      // Find and update the apartment to unpublish it
      const selectedApartment = await Apartment.findByIdAndUpdate(idApartment, {
        isPublished: false, // Mark apartment as unpublished
        unpublishedAt: new Date(), // Record the unpublish date
      });
      req.flash("success", "Apartamento despublicado con éxito");
      return res.redirect("/"); // Redirect to homepage on success
    } catch (error) {
      console.log(error);
      // Redirect with error message
      req.flash("error", "Error despublicando apartamento");
      return res.redirect("/");
    }
  });

  // Handle publishing an apartment (set isPublished to true)
const postPublishApartment =
  ("/apartments/:id/publish",
  async (req, res) => {
    try {
      const { idApartment } = req.params;
        // Find and update the apartment to publish it
      const selectedApartment = await Apartment.findByIdAndUpdate(idApartment, {
        isPublished: true, // Mark apartment as published
        unpublishedAt: null, // Reset the unpublish date
      });
      req.flash("success", "Apartamento publicado con éxito");
      // Redirect to homepage on success
      return res.redirect("/");
    } catch (error) {
      console.log(error);
    // Redirect with error message
      req.flash("error", "Error publicando apartamento");
      return res.redirect("/");
    }
  });

// named exports (export several resources as an object)
module.exports = {
  getNewApartmentForm,
  postNewApartment,
  getApartmentByIdEdit,
  postApartmentByIdEdit,
  postUnpublishApartment,
  postPublishApartment,
};
