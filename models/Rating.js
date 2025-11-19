const mongoose = require('mongoose');

// Rating Schema - Stores user ratings for manga
const ratingSchema = new mongoose.Schema({
  manga: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Manga',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Ensure one rating per user per manga
ratingSchema.index({ manga: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('Rating', ratingSchema);
