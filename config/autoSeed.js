// ========================================
// AUTO-SEED MODULE
// Automatically seeds database on startup if empty
// ========================================

const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Manga = require('../models/Manga');
const Rating = require('../models/Rating');
const Thread = require('../models/Thread');

// ========================================
// SAMPLE DATA
// ========================================

const sampleUsers = [
  {
    username: 'admin',
    email: 'admin@mangaverse.com',
    password: 'admin123'
  },
  {
    username: 'otaku_reader',
    email: 'otaku@example.com',
    password: 'password123'
  },
  {
    username: 'manga_fan',
    email: 'fan@example.com',
    password: 'password123'
  },
  {
    username: 'anime_lover',
    email: 'anime@example.com',
    password: 'password123'
  }
];

const sampleManga = [
  {
    title: 'One Piece',
    author: 'Eiichiro Oda',
    description: 'Monkey D. Luffy and his pirate crew explore the Grand Line in search of the legendary treasure known as "One Piece" in order to become the King of the Pirates.',
    coverImage: 'https://cdn.myanimelist.net/images/manga/2/253146.jpg',
    genres: ['Action', 'Adventure', 'Fantasy'],
    status: 'Ongoing',
    chapters: 1100,
    publicationYear: 1997
  },
  {
    title: 'Attack on Titan',
    author: 'Hajime Isayama',
    description: 'Humanity lives inside cities surrounded by enormous walls due to the Titans, gigantic humanoid creatures who devour humans seemingly without reason.',
    coverImage: 'https://cdn.myanimelist.net/images/manga/2/37846.jpg',
    genres: ['Action', 'Dark Fantasy', 'Post-Apocalyptic'],
    status: 'Completed',
    chapters: 139,
    publicationYear: 2009
  },
  {
    title: 'My Hero Academia',
    author: 'Kohei Horikoshi',
    description: 'In a world where people with superpowers (quirks) are the norm, Izuku Midoriya dreams of becoming a hero despite being born without powers.',
    coverImage: 'https://cdn.myanimelist.net/images/manga/1/209370.jpg',
    genres: ['Action', 'Superhero', 'Coming-of-age'],
    status: 'Ongoing',
    chapters: 400,
    publicationYear: 2014
  },
  {
    title: 'Death Note',
    author: 'Tsugumi Ohba',
    description: 'A high school student discovers a supernatural notebook that allows him to kill anyone by writing their name while picturing their face.',
    coverImage: 'https://cdn.myanimelist.net/images/manga/1/258245.jpg',
    genres: ['Thriller', 'Psychological', 'Supernatural'],
    status: 'Completed',
    chapters: 108,
    publicationYear: 2003
  },
  {
    title: 'Demon Slayer',
    author: 'Koyoharu Gotouge',
    description: 'Tanjiro Kamado becomes a demon slayer after his family is slaughtered and his younger sister Nezuko is turned into a demon.',
    coverImage: 'https://cdn.myanimelist.net/images/manga/3/179023.jpg',
    genres: ['Action', 'Dark Fantasy', 'Martial Arts'],
    status: 'Completed',
    chapters: 205,
    publicationYear: 2016
  },
  {
    title: 'Naruto',
    author: 'Masashi Kishimoto',
    description: 'Naruto Uzumaki, a young ninja, seeks recognition from his peers and dreams of becoming the Hokage, the leader of his village.',
    coverImage: 'https://cdn.myanimelist.net/images/manga/3/249658.jpg',
    genres: ['Action', 'Adventure', 'Martial Arts'],
    status: 'Completed',
    chapters: 700,
    publicationYear: 1999
  },
  {
    title: 'Jujutsu Kaisen',
    author: 'Gege Akutami',
    description: 'A high school student joins a secret organization of Jujutsu Sorcerers in order to kill a powerful Curse living inside him.',
    coverImage: 'https://cdn.myanimelist.net/images/manga/3/210341.jpg',
    genres: ['Action', 'Dark Fantasy', 'Supernatural'],
    status: 'Ongoing',
    chapters: 250,
    publicationYear: 2018
  },
  {
    title: 'Fullmetal Alchemist',
    author: 'Hiromu Arakawa',
    description: 'Two brothers search for the Philosopher\'s Stone to restore their bodies after a failed alchemical ritual.',
    coverImage: 'https://cdn.myanimelist.net/images/manga/3/243675.jpg',
    genres: ['Action', 'Adventure', 'Steampunk'],
    status: 'Completed',
    chapters: 116,
    publicationYear: 2001
  },
  {
    title: 'Tokyo Ghoul',
    author: 'Sui Ishida',
    description: 'A college student becomes a half-ghoul and must navigate between the human and ghoul worlds while struggling with his new identity.',
    coverImage: '/images/tokyo.jpg',
    genres: ['Dark Fantasy', 'Horror', 'Psychological'],
    status: 'Completed',
    chapters: 143,
    publicationYear: 2011
  },
  {
    title: 'Chainsaw Man',
    author: 'Tatsuki Fujimoto',
    description: 'Denji becomes a devil hunter to pay off his debts, merging with his pet devil Pochita to become Chainsaw Man.',
    coverImage: 'https://cdn.myanimelist.net/images/manga/3/216464.jpg',
    genres: ['Action', 'Dark Fantasy', 'Horror'],
    status: 'Ongoing',
    chapters: 150,
    publicationYear: 2018
  },
  {
    title: 'Vinland Saga',
    author: 'Makoto Yukimura',
    description: 'A young Viking warrior seeks revenge for his father\'s murder while caught in the midst of historical warfare.',
    coverImage: 'https://cdn.myanimelist.net/images/manga/2/188925.jpg',
    genres: ['Action', 'Adventure', 'Historical'],
    status: 'Ongoing',
    chapters: 200,
    publicationYear: 2005
  },
  {
    title: 'Spy x Family',
    author: 'Tatsuya Endo',
    description: 'A spy, an assassin, and a telepath come together to form a fake family, each hiding their true identity from the others.',
    coverImage: '/images/spy.jpg',
    genres: ['Action', 'Comedy', 'Slice of Life'],
    status: 'Ongoing',
    chapters: 90,
    publicationYear: 2019
  }
];

// ========================================
// SEED FUNCTIONS
// ========================================

async function seedDatabase() {
  try {
    // Seed users
    const users = await seedUsers();
    
    // Seed manga
    const manga = await seedManga();
    
    // Seed ratings
    const ratings = await seedRatings(users, manga);
    
    // Update manga average ratings
    await updateMangaRatings(manga);
    
    // Seed discussion threads
    await seedThreads(users, manga);
    
  } catch (error) {
    console.error('❌ Error auto-seeding database:', error);
    throw error;
  }
}

async function seedUsers() {
  const users = [];
  
  for (const userData of sampleUsers) {
    const user = new User(userData);
    await user.save();
    users.push(user);
  }
  
  return users;
}

async function seedManga() {
  const manga = [];
  
  for (const mangaData of sampleManga) {
    const newManga = new Manga(mangaData);
    await newManga.save();
    manga.push(newManga);
  }
  
  return manga;
}

async function seedRatings(users, manga) {
  const ratings = [];
  
  for (const user of users) {
    const numToRate = Math.floor(Math.random() * 4) + 5;
    const shuffledManga = [...manga].sort(() => 0.5 - Math.random());
    const mangaToRate = shuffledManga.slice(0, numToRate);
    
    for (const m of mangaToRate) {
      const ratingValue = Math.floor(Math.random() * 3) + 3;
      
      const rating = new Rating({
        manga: m._id,
        user: user._id,
        rating: ratingValue
      });
      
      await rating.save();
      ratings.push(rating);
    }
  }
  
  return ratings;
}

async function updateMangaRatings(manga) {
  for (const m of manga) {
    const ratings = await Rating.find({ manga: m._id });
    
    if (ratings.length > 0) {
      const sum = ratings.reduce((acc, r) => acc + r.rating, 0);
      m.averageRating = sum / ratings.length;
      m.ratingCount = ratings.length;
    }
    
    m.viewCount = Math.floor(Math.random() * 4900) + 100;
    await m.save();
  }
}

async function seedThreads(users, manga) {
  const threads = [];
  
  const threadTemplates = [
    {
      title: 'What did you think of the latest chapter?',
      content: 'I just finished reading the latest chapter and I\'m blown away! The plot twists keep getting better. What are your thoughts?'
    },
    {
      title: 'Character Development Discussion',
      content: 'Let\'s talk about how the main character has evolved throughout the series. I love seeing the growth!'
    },
    {
      title: 'Predictions for the next arc',
      content: 'Based on the recent chapters, what do you think will happen next? I have some theories I\'d like to share.'
    },
    {
      title: 'Favorite moments from this manga',
      content: 'What are your favorite scenes or moments? I want to hear what stood out to you the most!'
    },
    {
      title: 'Art style appreciation',
      content: 'Can we talk about how amazing the art is in this series? The detail in every panel is incredible.'
    }
  ];
  
  const popularManga = manga.slice(0, 8);
  
  for (const m of popularManga) {
    const numThreads = Math.floor(Math.random() * 2) + 2;
    const shuffledTemplates = [...threadTemplates].sort(() => 0.5 - Math.random());
    
    for (let i = 0; i < numThreads; i++) {
      const template = shuffledTemplates[i];
      const randomUser = users[Math.floor(Math.random() * users.length)];
      
      const thread = new Thread({
        title: template.title,
        content: template.content,
        manga: m._id,
        user: randomUser._id
      });
      
      await thread.save();
      
      const numReplies = Math.floor(Math.random() * 3) + 1;
      for (let j = 0; j < numReplies; j++) {
        const replyUser = users[Math.floor(Math.random() * users.length)];
        const replyContent = [
          'I completely agree with you! This series is amazing.',
          'Great point! I never thought about it that way.',
          'Thanks for sharing your thoughts. Very interesting perspective!',
          'I have a different opinion, but I respect your view.',
          'This is exactly what I was thinking! Well said.'
        ][Math.floor(Math.random() * 5)];
        
        thread.replies.push({
          content: replyContent,
          user: replyUser._id
        });
      }
      
      await thread.save();
      threads.push(thread);
    }
  }
  
  return threads;
}

// ========================================
// EXPORT
// ========================================
module.exports = seedDatabase;
