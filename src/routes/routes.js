const express = require('express')
const router = express.Router();
const { authGuard } = require('../middleware/authguard')
const { vidlymovies } = require('../controller/movies');
const { customer } = require('../controller/customer');
const { rental } = require('../controller/rental');
const { user } = require('../controller/user')
const { auth } = require('../controller/auth')
const { isAdmin } = require('../middleware/adminuser');

//------------------------ Use Registration ---------------------------
router.get('/user', user.getAll);
router.get('/user/:id', user.getById);
router.post('/user', user.create);
router.put('/user/:id', authGuard.validateToken, user.update);
router.delete('/user/:id', authGuard.validateToken, user.delete);
router.get('/currentuser', authGuard.validateToken, user.getCurrentUser);

//------------------------ Use Sign-Up ---------------------------

router.post('/auth', auth.authenticateUser);

//------------------------ Movies -------------------------
router.get('/movies'/*, authGuard.validateToken*/, vidlymovies.getAll);
router.get('/movies/:id', vidlymovies.getById);
router.post('/movie', authGuard.validateToken, vidlymovies.create);
router.put('/movie/:id', authGuard.validateToken, vidlymovies.update);
router.delete('/movie/:id', authGuard.validateToken, vidlymovies.delete);

//------------------------ Customers ----------------------
router.get('/customer', customer.getAll);
router.get('/customer/:id', customer.getById);
router.post('/customer', authGuard.validateToken, customer.create);
router.put('/customer/:id', authGuard.validateToken, customer.update);
router.delete('/customer/:id', [authGuard.validateToken, isAdmin], customer.delete);

//------------------------ Rentals ----------------------
router.get('/rental', rental.getAll);
router.get('/rental/:id', rental.getById);
router.post('/rental', authGuard.validateToken, rental.create);
// router.put('/rental/:id', rental.update);
router.delete('/rental/:id', authGuard.validateToken, rental.delete);

module.exports.route = router;