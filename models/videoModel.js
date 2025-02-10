const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'Video must belong to a user.'],
    ref: 'User',
  },
  tour: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'Video must belong to a tour.'],
    ref: 'Tour',
  },
  title: {
    type: String,
    required: [true, 'Title can not be empty.'],
    maxlength: 255,
  },
  discription: {
    type: String,
    required: [true, 'Discription can not be empty.'],
    maxlength: 255,
  },
  cloudinaryPublicId: {
    type: String,
    required: true,
  },
  filePath: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

videoSchema.index({ tour: 1, user: 1 }, { unique: true });

videoSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name photo',
  });
  next();
});

const Video = mongoose.model('Video', videoSchema);

module.exports = Video;
