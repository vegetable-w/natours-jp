const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  tour: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tour',
  },
  created_at: {
    type: Date,
    default: Date.now(),
  },
});

favoriteSchema.index({ user: 1, tour: 1 }, { unique: true });

const Favorite = mongoose.model('Favorite', favoriteSchema);

module.exports = Favorite;
