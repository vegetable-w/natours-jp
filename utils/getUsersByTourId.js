const mongoose = require('mongoose');
const Favorite = require('../models/favoriteModel');

async function getUsersByTourId(tourId) {
  try {
    const objectId = mongoose.Types.ObjectId(tourId);
    const favorites = await Favorite.find({ tour: objectId }).select('user');

    const userIds = favorites.map((favorite) => favorite.user.toString());

    return userIds;
  } catch (error) {
    console.error('Error finding users by tourId:', error);
    return [];
  }
}

module.exports = getUsersByTourId;
