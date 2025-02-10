const mongoose = require('mongoose');
const Video = require('../models/videoModel');

exports.getMyVideos = async (req, res) => {
  const id = req.params.userId;
  const objectId = mongoose.Types.ObjectId(id);

  try {
    const myVideos = await Video.find({ user: objectId });

    res.status(200).json({
      status: 'success',
      results: myVideos.length,
      data: myVideos,
    });
  } catch (error) {
    res
      .status(500)
      .json({ status: 'error', message: 'Failed to fetch my videos' });
  }
};

exports.getTourVideos = async (req, res) => {
  const id = req.params.tourId;
  const objectId = mongoose.Types.ObjectId(id);

  try {
    const tourVideos = await Video.find({ tour: objectId });

    res.status(200).json({
      status: 'success',
      results: tourVideos.length,
      data: tourVideos,
    });
  } catch (error) {
    res
      .status(500)
      .json({ status: 'error', message: 'Failed to fetch videos' });
  }
};
