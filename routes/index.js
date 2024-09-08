// Rutas "públicas" de la app
const express = require('express');
const router = express.Router();

// importamos todos los controladores de controllers/index.js
const indexControllers = require('../controllers/index.js');

// Router funciona igual que el "app" para crear los endpoints. Nos permite definir un conjunto arbitrario de rutas
router.get('/', indexControllers.getApartments);

// Paso 2 Buscar apartamentos: Crear una nueva ruta al endpoint /search . Debe ejecutar el controlador indexControllers.searchApartments
router.get('/search', indexControllers.searchApartments);

// ruta dinámica para detalle del apartamento
router.get('/apartment/:idApartment', indexControllers.getApartmentById);

router.post('/apartment/new-reservation', indexControllers.postNewReservation);

//Ruta resumen reserva
router.get('/apartment/reservation-summary', indexControllers.postNewReservation)
// Tenemos que exportar estas rutas para que sean usadas en app.js
module.exports = router;