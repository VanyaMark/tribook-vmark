// importar el modelo
const Apartment = require('../models/apartment.model.js');
    //Creates an array that contains all services
    const allServices = [
        { id: 'wifi', label: 'Wi-Fi', isPresent: false},
        { id: 'airConditioner', label: 'Aire Acondicionado', isPresent: false},
        { id: 'kitchen', label: 'Cocina', isPresent: false},
        { id: 'disabilityAccess' , label: 'Acceso Minusválidos', isPresent: false},
        { id: 'heating' , label: 'Calefacción', isPresent: false},
        { id: 'tv', label: 'Televisión', isPresent:false }
    ];

    //Additional function to manage services in case of no services present
    const checkServices = (services) => {
        if (!services) {
            return allServices;
        } else {
                    //Mapping through all services, creates an array according to Model with checked services
        const checkedServices = allServices.map(service => {
            return {
                id: service.id,
                label: service.label,
                isPresent: services.includes(service.label), 
            }
        })
            return checkedServices;
        }
    }

const getNewApartmentForm = (req, res) => {

    // Obtener todos los apartmentos de la base de datos
    const apartments = Apartment.find();
    res.render('new-apartment.ejs')
}

const postNewApartment = async (req, res) => {

    // Me han metido más servicios en el req.services que los servicios que yo quiero? kitchen, wifi, etc. res.status(400).send('Ha ocurrido un error');
    //Create an array to hold the available services for the appartment
    //const checkedServices = req.body.services;
    const {title, description, price, size, rooms, bathrooms, guests, mainPhoto, services} = req.body;



    await Apartment.create({
        title,
        description,
        price,
        size,
        rooms,
        bathrooms,
        guests,
        mainPhoto,
        services: checkServices(services),
        isPublished: true
    });
    res.send('Apartamaneto creado');
}

//Get route to edit appartment

const getApartmentByIdEdit = async (req, res) => {
    const { idApartment } = req.params;
    const selectedApartment = await Apartment.findById(idApartment)
    console.log('req', req.params)
    console.log(selectedApartment)
    res.render('apartment-edit', {
        selectedApartment
    })
}
//Post route to edit appartment

const postApartmentByIdEdit = async (req, res) => {
    const { idApartment } = req.params;
    console.log('id from post: ', idApartment);
    const {title, description, price, size, rooms, bathrooms, guests, mainPhoto, services} = req.body;

    const updatedApartment = await Apartment.findByIdAndUpdate(idApartment, {
        title,
        description,
        price,
        size,
        rooms,
        bathrooms,
        guests,
        mainPhoto,
        services: checkServices(services),
        isPublished: true
    })
    console.log('updated apartment: ', updatedApartment);
    res.send('Apartment updated')
}

const postUnpublishApartment = ('/apartments/:id/unpublish', async (req, res) => {
    try {
    const { idApartment } = req.params;
    const selectedApartment = await Apartment.findByIdAndUpdate(idApartment, {
        isPublished: false,
        unpublishedAt: new Date()
    });
    req.flash('success', 'Apartamento despublicado con éxito');
    res.redirect('/');
} catch (error) {
    console.log(error)
    // res.status(500).send('Error unpublishing apartment')
    res.flash('error', 'Error despublicando apartamento');
    res.redirect('/');
}
})

const postPublishApartment = ('/apartments/:id/publish', async (req, res) => {
    try {
        const { idApartment } = req.params;
        const selectedApartment = await Apartment.findByIdAndUpdate(idApartment, {
            isPublished: true,
            unpublishedAt: null
        });
        req.flash('success', 'Apartamento publicado con éxito');
        res.redirect('/');
    } catch (error) {
        console.log(error)
        // res.status(500).send('Error publishing apartment')
        res.flash('error', 'Error publicando apartamento');
        res.redirect('/');
    }
})

// named exports (expotamos varios recursos, lo hacemos como un objeto)
module.exports = {
    getNewApartmentForm,
    postNewApartment,
    getApartmentByIdEdit,
    postApartmentByIdEdit,
    postUnpublishApartment,
    postPublishApartment
}

