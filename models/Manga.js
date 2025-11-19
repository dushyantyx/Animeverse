const mongoose = require('mongoose');

// Manga Schema - Stores manga information
const mangaSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  author: {
    type: String,
    required: true
  },
  genres: [String],
  description: {
    type: String,
    required: true
  },
  coverImage: {
    type: String,
    default: 'https://via.placeholder.com/300x400?text=No+Cover'
  },
  status: {
    type: String,
    enum: ['Ongoing', 'Completed', 'Hiatus'],
    default: 'Ongoing'
  },
  chapters: {
    type: Number,
    default: 0
  },
  yearPublished: {
    type: Number
  },
  // For trending calculation
  viewCount: {
    type: Number,
    default: 0
  },
  // Average rating (calculated from ratings)
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  ratingCount: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for search functionality
mangaSchema.index({ title: 'text', author: 'text', description: 'text' });

module.exports = mongoose.model('Manga', mangaSchema);
