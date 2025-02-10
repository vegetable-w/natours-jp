const express = require('express');
const favoriteController = require('../controllers/favoriteController');

const router = express.Router();

router.get('/:userId', favoriteController.getFavorites);

router.post('/:userId', favoriteController.addFavorite);

router.delete('/:userId/:tourId', favoriteController.removeFavorite);

module.exports = router;
