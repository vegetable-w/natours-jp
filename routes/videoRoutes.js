const express = require('express');
const videoController = require('../controllers/videoController');

const router = express.Router();

router.get('/user/:userId', videoController.getMyVideos);

router.get('/tour/:tourId', videoController.getTourVideos);

module.exports = router;
