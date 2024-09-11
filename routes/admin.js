// Rutas de administrador

// Rutas "públicas" de la app
const express = require('express');
const router = express.Router();

// importar todos los controladores de controllers/admin.js

// Crear primer endpoint de administrador que es el que nos permite mostrar un formulario para añadir un nuevo apartamento
const adminControllers = require('../controllers/admin.js');

router.get('/apartment/new-apartment', adminControllers.getNewApartmentForm);
router.post('/apartment/new-apartment', adminControllers.postNewApartment);

// ruta dinámica para editar apartamento
router.get('/apartment/:idApartment/edit', adminControllers.getApartmentByIdEdit);
router.post('/apartment/:idApartment/edit', adminControllers.postApartmentByIdEdit);

//ruta para despublicar apartamento
router.post('/apartment/:idApartment/unpublish', adminControllers.postUnpublishApartment)

//ruta para publicar apartamento
router.post('/apartment/:idApartment/publish', adminControllers.postPublishApartment)

module.exports = router;