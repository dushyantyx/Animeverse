// ========================================
// MANGAVERSE - MAIN JAVASCRIPT
// Interactive Features & UI Enhancements
// ========================================

document.addEventListener('DOMContentLoaded', function() {
  initMobileMenu();
  initUserDropdown();
  initFilterButtons();
  initFlashMessages();
  initSearchEnhancements();
  initImageErrorHandling();
});

// ========================================
// MOBILE MENU
// ========================================
function initMobileMenu() {
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const mobileMenu = document.querySelector('.mobile-menu');
  
  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', function() {
      mobileMenu.classList.toggle('active');
      
      // Change icon
      const icon = this.querySelector('i');
      if (mobileMenu.classList.contains('active')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
      } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
      }
    });
    
    // Close on link click
    const menuLinks = mobileMenu.querySelectorAll('a');
    menuLinks.forEach(link => {
      link.addEventListener('click', function() {
        mobileMenu.classList.remove('active');
        const icon = mobileMenuBtn.querySelector('i');
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
      });
    });
    
    // Close on outside click
    document.addEventListener('click', function(e) {
      if (!mobileMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
        mobileMenu.classList.remove('active');
        const icon = mobileMenuBtn.querySelector('i');
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
      }
    });
  }
}

// ========================================
// USER DROPDOWN
// ========================================
function initUserDropdown() {
  const userBtn = document.querySelector('.user-btn');
  const userDropdown = document.querySelector('.user-dropdown');
  
  if (userBtn && userDropdown) {
    userBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      userDropdown.classList.toggle('active');
    });
    
    // Close on outside click
    document.addEventListener('click', function(e) {
      if (!userBtn.contains(e.target) && !userDropdown.contains(e.target)) {
        userDropdown.classList.remove('active');
      }
    });
  }
}

// ========================================
// FILTER BUTTONS (Trending Page)
// ========================================
function initFilterButtons() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  
  if (filterButtons.length > 0) {
    filterButtons.forEach(btn => {
      btn.addEventListener('click', function() {
        // Remove active class from all buttons
        filterButtons.forEach(b => b.classList.remove('active'));
        
        // Add active class to clicked button
        this.classList.add('active');
        
        // Get filter value
        const filterValue = this.getAttribute('data-filter');
        
        // Filter manga cards
        filterMangaCards(filterValue);
      });
    });
  }
}

function filterMangaCards(filterValue) {
  const mangaCards = document.querySelectorAll('.manga-card, .manga-list-item');
  
  mangaCards.forEach(card => {
    if (filterValue === 'all') {
      card.style.display = '';
      return;
    }
    
    // For trending page - filter by time period
    if (card.dataset.trending) {
      const trendingPeriod = card.dataset.trending;
      if (filterValue === trendingPeriod) {
        card.style.display = '';
      } else {
        card.style.display = 'none';
      }
    }
    
    // For genre filtering (if implemented)
    if (card.dataset.genres) {
      const genres = card.dataset.genres.split(',');
      if (genres.includes(filterValue)) {
        card.style.display = '';
      } else {
        card.style.display = 'none';
      }
    }
  });
}

// ========================================
// FILTER BY TIME (Trending Page)
// ========================================
function filterByTime(period) {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const mangaCards = document.querySelectorAll('.manga-card');
  
  // Update active button
  filterButtons.forEach(btn => {
    btn.classList.remove('active');
    if (btn.textContent.toLowerCase().includes(period) || 
        (period === 'all' && btn.textContent.toLowerCase().includes('all'))) {
      btn.classList.add('active');
    }
  });
  
  // Show all cards (all periods show all manga in trending)
  // In a real implementation, you'd filter by actual date ranges
  mangaCards.forEach(card => {
    card.style.display = '';
  });
}

// Make filterByTime globally accessible
window.filterByTime = filterByTime;

// ========================================
// FILTER BY TIME (Trending Page)
// ========================================
function filterByTime(period) {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const mangaCards = document.querySelectorAll('.manga-card');
  
  // Update active button
  filterButtons.forEach(btn => {
    btn.classList.remove('active');
    if (btn.textContent.toLowerCase().includes(period) || 
        (period === 'all' && btn.textContent.toLowerCase().includes('all'))) {
      btn.classList.add('active');
    }
  });
  
  // Show all cards (all periods show all manga in trending)
  // In a real implementation, you'd filter by actual date ranges
  mangaCards.forEach(card => {
    card.style.display = '';
  });
}

// Make filterByTime globally accessible
window.filterByTime = filterByTime;

// ========================================
// FLASH MESSAGES
// ========================================
function initFlashMessages() {
  const flashMessages = document.querySelectorAll('.alert');
  
  flashMessages.forEach(flash => {
    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      flash.style.animation = 'slideUp 0.3s ease';
      setTimeout(() => {
        flash.remove();
      }, 300);
    }, 5000);
    
    // Add close button functionality if exists
    const closeBtn = flash.querySelector('.close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', function() {
        flash.style.animation = 'slideUp 0.3s ease';
        setTimeout(() => {
          flash.remove();
        }, 300);
      });
    }
  });
}

// ========================================
// SEARCH ENHANCEMENTS
// ========================================
function initSearchEnhancements() {
  const searchForm = document.querySelector('.search-form');
  const searchInput = document.querySelector('.search-input');
  
  if (searchForm && searchInput) {
    // Add search suggestions (basic implementation)
    searchInput.addEventListener('input', function() {
      const query = this.value.trim();
      
      // Minimum 2 characters for suggestions
      if (query.length >= 2) {
        // Could implement autocomplete here
        // For now, just enable/disable search button
        const searchBtn = searchForm.querySelector('.search-btn');
        if (searchBtn) {
          searchBtn.style.opacity = query.length > 0 ? '1' : '0.5';
        }
      }
    });
    
    // Prevent empty searches
    searchForm.addEventListener('submit', function(e) {
      const query = searchInput.value.trim();
      if (query.length === 0) {
        e.preventDefault();
        searchInput.focus();
        searchInput.style.borderColor = '#ef4444';
        setTimeout(() => {
          searchInput.style.borderColor = '';
        }, 1000);
      }
    });
  }
}

// ========================================
// IMAGE ERROR HANDLING
// ========================================
function initImageErrorHandling() {
  const images = document.querySelectorAll('img');
  
  images.forEach(img => {
    // Add loading class
    img.classList.add('loading');
    
    // Store original source and attempt count
    if (!img.dataset.originalSrc) {
      img.dataset.originalSrc = img.src;
      img.dataset.errorCount = '0';
    }
    
    img.addEventListener('load', function() {
      this.classList.remove('loading');
      this.classList.add('loaded');
    });
    
    img.addEventListener('error', function() {
      this.classList.remove('loading');
      const errorCount = parseInt(this.dataset.errorCount || '0');
      const originalSrc = this.dataset.originalSrc || this.src;
      
      // Try alternative sources with progressive fallback
      if (errorCount === 0) {
        // Attempt 1: Try with cache bypass
        this.dataset.errorCount = '1';
        this.src = originalSrc.split('?')[0] + '?t=' + Date.now();
      } else if (errorCount === 1) {
        // Attempt 2: Try forcing HTTPS
        this.dataset.errorCount = '2';
        const httpsUrl = originalSrc.replace(/^http:/, 'https:');
        if (httpsUrl !== originalSrc) {
          this.src = httpsUrl;
        } else {
          // Skip to next attempt
          this.dataset.errorCount = '3';
          tryAlternativeCDN(this, originalSrc);
        }
      } else if (errorCount === 2) {
        // Attempt 3: Try alternative CDN proxy
        this.dataset.errorCount = '3';
        tryAlternativeCDN(this, originalSrc);
      } else {
        // Final fallback: Use themed SVG placeholder
        this.classList.add('error');
        this.src = createPlaceholderImage(this.alt || 'Manga Cover');
        this.style.objectFit = 'cover';
      }
    });
  });
}

// Try alternative image CDN/proxy services
function tryAlternativeCDN(img, originalSrc) {
  // Extract the URL and try via a CORS proxy
  const cleanUrl = originalSrc.split('?')[0];
  
  // Try different MyAnimeList image servers
  if (cleanUrl.includes('myanimelist.net')) {
    // MyAnimeList has multiple CDN servers (cdn, cdn2, cdn-us, etc.)
    const alternativeUrl = cleanUrl
      .replace('cdn.myanimelist.net', 'cdn-us.myanimelist.net')
      .replace('cdn-us.myanimelist.net', 'cdn2.myanimelist.net');
    
    if (alternativeUrl !== cleanUrl) {
      img.src = alternativeUrl;
      return;
    }
  }
  
  // If all else fails, use placeholder
  img.classList.add('error');
  img.src = createPlaceholderImage(img.alt || 'Manga Cover');
  img.style.objectFit = 'cover';
}

// Create a themed SVG placeholder
function createPlaceholderImage(altText) {
  const title = altText.substring(0, 30); // Limit text length
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="400" height="600" viewBox="0 0 400 600">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#3c3836;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#504945;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect fill="url(#grad)" width="400" height="600"/>
      <circle cx="200" cy="250" r="60" fill="#fe8019" opacity="0.3"/>
      <text fill="#ebdbb2" font-family="Arial, sans-serif" font-size="24" font-weight="bold" 
            x="200" y="340" text-anchor="middle">${title}</text>
      <text fill="#a89984" font-family="Arial, sans-serif" font-size="16" 
            x="200" y="370" text-anchor="middle">Image Unavailable</text>
      <g transform="translate(170, 220)">
        <path d="M30 5 L50 25 L30 45 L10 25 Z" fill="none" stroke="#fe8019" stroke-width="3"/>
        <circle cx="30" cy="25" r="15" fill="none" stroke="#fabd2f" stroke-width="2"/>
      </g>
    </svg>
  `.trim();
  
  return 'data:image/svg+xml;base64,' + btoa(svg);
}

// ========================================
// SMOOTH SCROLL
// ========================================
function initSmoothScroll() {
  const scrollLinks = document.querySelectorAll('a[href^="#"]');
  
  scrollLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      
      // Only for hash links
      if (href !== '#' && href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    });
  });
}

// ========================================
// DELETE CONFIRMATION
// ========================================
function confirmDelete(message = 'Are you sure you want to delete this?') {
  return confirm(message);
}

// ========================================
// FORM VALIDATION
// ========================================
function validateForm(formId) {
  const form = document.getElementById(formId);
  
  if (!form) return true;
  
  const requiredFields = form.querySelectorAll('[required]');
  let isValid = true;
  
  requiredFields.forEach(field => {
    if (!field.value.trim()) {
      isValid = false;
      field.style.borderColor = '#ef4444';
      
      // Reset border color after 2 seconds
      setTimeout(() => {
        field.style.borderColor = '';
      }, 2000);
    }
  });
  
  return isValid;
}

// ========================================
// TRENDING ANIMATION (Optional Enhancement)
// ========================================
function initTrendingAnimation() {
  const trendingBadges = document.querySelectorAll('.trending-badge');
  
  trendingBadges.forEach(badge => {
    // Add pulsing animation
    badge.style.animation = 'pulse 2s infinite';
  });
}

// Add keyframe animation via JavaScript
const style = document.createElement('style');
style.textContent = `
  @keyframes slideUp {
    from {
      opacity: 1;
      transform: translateY(0);
    }
    to {
      opacity: 0;
      transform: translateY(-20px);
    }
  }
  
  @keyframes pulse {
    0%, 100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.05);
    }
  }
`;
document.head.appendChild(style);

// ========================================
// LAZY LOADING IMAGES (Optional)
// ========================================
function initLazyLoading() {
  const images = document.querySelectorAll('img[data-src]');
  
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        observer.unobserve(img);
      }
    });
  });
  
  images.forEach(img => imageObserver.observe(img));
}

// ========================================
// VIEW COUNT TRACKER
// ========================================
function trackView(mangaId) {
  // Could send AJAX request to increment view count
  // For now, handled by backend on page load
  console.log(`Viewing manga: ${mangaId}`);
}

// ========================================
// UTILITY FUNCTIONS
// ========================================

// Format date for display
function formatDate(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now - date;
  
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 7) {
    return date.toLocaleDateString();
  } else if (days > 0) {
    return `${days} day${days > 1 ? 's' : ''} ago`;
  } else if (hours > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else {
    return 'Just now';
  }
}

// Truncate text
function truncateText(text, maxLength = 100) {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

// Export functions for use in other scripts
window.MangaVerse = {
  confirmDelete,
  validateForm,
  formatDate,
  truncateText,
  trackView
};
