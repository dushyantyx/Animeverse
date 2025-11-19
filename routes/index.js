const express = require('express');
const router = express.Router();
const Manga = require('../models/Manga');

// GET / - Home page with featured manga
router.get('/', async (req, res) => {
  try {
    // Get recent manga
    const recentManga = await Manga.find()
      .sort({ createdAt: -1 })
      .limit(8);

    // Get top rated
    const topRated = await Manga.find()
      .sort({ averageRating: -1, ratingCount: -1 })
      .limit(6);

    res.render('index', { 
      title: 'MangaVerse - Your Manga Community',
      recentManga,
      topRated
    });
  } catch (error) {
    console.error(error);
    res.render('index', { 
      title: 'MangaVerse',
      recentManga: [],
      topRated: []
    });
  }
});

// GET /trending - Trending manga page
router.get('/trending', async (req, res) => {
  try {
    const period = req.query.period || 'all';
    let dateFilter = {};
    
    // Calculate date ranges for filtering
    const now = new Date();
    if (period === 'week') {
      const weekAgo = new Date(now.setDate(now.getDate() - 7));
      dateFilter = { updatedAt: { $gte: weekAgo } };
    } else if (period === 'month') {
      const monthAgo = new Date(now.setMonth(now.getMonth() - 1));
      dateFilter = { updatedAt: { $gte: monthAgo } };
    }
    
    const trendingManga = await Manga.find(dateFilter)
      .sort({ viewCount: -1, averageRating: -1 })
      .limit(20);

    res.render('trending', { 
      title: 'Trending Manga',
      manga: trendingManga,
      currentPeriod: period
    });
  } catch (error) {
    console.error(error);
    res.render('trending', { 
      title: 'Trending Manga',
      manga: [],
      currentPeriod: 'all'
    });
  }
});

// GET /top-rated - Top rated manga page
router.get('/top-rated', async (req, res) => {
  try {
    const topManga = await Manga.find({ ratingCount: { $gt: 0 } })
      .sort({ averageRating: -1, ratingCount: -1 })
      .limit(20);

    res.render('top-rated', { 
      title: 'Top Rated Manga',
      manga: topManga
    });
  } catch (error) {
    console.error(error);
    res.render('top-rated', { 
      title: 'Top Rated Manga',
      manga: []
    });
  }
});

// GET /search - Search manga
router.get('/search', async (req, res) => {
  try {
    const query = req.query.q || '';
    let results = [];

    if (query) {
      results = await Manga.find({
        $or: [
          { title: { $regex: query, $options: 'i' } },
          { author: { $regex: query, $options: 'i' } },
          { genres: { $regex: query, $options: 'i' } }
        ]
      }).limit(20);
    }

    res.render('search', { 
      title: 'Search Results',
      query,
      results
    });
  } catch (error) {
    console.error(error);
    res.render('search', { 
      title: 'Search',
      query: '',
      results: []
    });
  }
});

module.exports = router;
