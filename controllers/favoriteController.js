const mongoose = require('mongoose');
const Tour = require('../models/tourModel');
const Favorite = require('../models/favoriteModel');

exports.getFavorites = async (req, res) => {
  const id = req.params.userId;
  const objectId = mongoose.Types.ObjectId(id);

  try {
    const favorites = await Favorite.find({ user: objectId });

    const tourIDs = favorites.map((el) => el.tour);
    const tours = await Tour.find({ _id: { $in: tourIDs } });
    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: tours,
    });
  } catch (error) {
    res
      .status(500)
      .json({ status: 'error', message: 'Failed to fetch favorites' });
  }
};

exports.addFavorite = async (req, res) => {
  // eslint-disable-next-line prefer-destructuring
  const userId = req.params.userId;
  const { tourId } = req.body;

  try {
    const existing = await Favorite.findOne({ user: userId, tour: tourId });

    if (existing) {
      return res
        .status(400)
        .json({ status: 'error', message: 'Tour already in favorites' });
    }

    const favorite = await Favorite.create({ user: userId, tour: tourId });

    res.status(201).json({ status: 'success', data: favorite });
  } catch (error) {
    console.error('Add favorite error:', error);
    res
      .status(500)
      .json({ status: 'error', message: 'Failed to add favorite' });
  }
};

exports.removeFavorite = async (req, res) => {
  const { userId, tourId } = req.params;
  console.log(req.params);

  const objectId = mongoose.Types.ObjectId(userId);
  const objectTourId = mongoose.Types.ObjectId(tourId);
  console.log(objectId, objectTourId);

  try {
    const deletedFavorite = await Favorite.findOneAndDelete({
      user: objectId,
      tour: objectTourId,
    });

    if (!deletedFavorite) {
      return res.status(404).json({
        status: 'error',
        message: 'Favorite not found',
      });
    }

    res.status(204).json({
      status: 'success',
      message: 'Tour removed from favorites',
    });
  } catch (error) {
    console.error('Remove favorite error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to remove favorite',
    });
  }
};
