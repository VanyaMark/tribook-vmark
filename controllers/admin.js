// importar el modelo
const Apartment = require('../models/apartment.model.js');

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

    await Apartment.findByIdAndUpdate()

}

// named exports (expotamos varios recursos, lo hacemos como un objeto)
module.exports = {
    getNewApartmentForm,
    postNewApartment,
    getApartmentByIdEdit,
    postApartmentByIdEdit
}

