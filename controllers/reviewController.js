const Review = require('../models/reviewModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');
const AppError = require('../utils/appError');
// eslint-disable-next-line import/order
const mongoose = require('mongoose');

exports.getAllReviews = factory.getAll(Review);

exports.getMyReview = catchAsync(async (req, res, next) => {
  const id = req.params.userId;

  const objectId = mongoose.Types.ObjectId(id);

  console.log(objectId);

  const query = Review.find({ user: objectId });

  const doc = await query;

  if (!doc) {
    return next(new AppError('No document found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      data: doc,
    },
  });
});

exports.setTourUserIds = (req, res, next) => {
  // 允许嵌套路由
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.getReview = factory.getOne(Review);

exports.createReview = factory.createOne(Review);

exports.updateReview = factory.updateOne(Review);

exports.deleteReview = factory.deleteOne(Review);
