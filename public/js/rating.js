// ========================================
// MANGAVERSE - RATING SYSTEM
// Interactive Star Rating Component
// ========================================

document.addEventListener('DOMContentLoaded', function() {
  initStarRating();
});

// ========================================
// STAR RATING INITIALIZATION
// ========================================
function initStarRating() {
  const ratingContainers = document.querySelectorAll('.star-rating');
  
  ratingContainers.forEach(container => {
    const stars = container.querySelectorAll('.rating-star');
    const form = container.closest('form');
    const ratingInput = form ? form.querySelector('input[name="rating"]') : null;
    let currentRating = parseInt(container.dataset.userRating) || 0;
    
    // Initialize stars display
    updateStars(stars, currentRating);
    
    // Add click handlers to each star
    stars.forEach((star, index) => {
      const ratingValue = index + 1;
      
      // Mouse enter - preview rating
      star.addEventListener('mouseenter', function(e) {
        e.stopPropagation();
        updateStars(stars, ratingValue);
      });
      
      // Click to set rating
      star.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        currentRating = ratingValue;
        updateStars(stars, currentRating);
        
        // Update hidden input
        if (ratingInput) {
          ratingInput.value = currentRating;
        }
        
        // Visual feedback
        showRatingFeedback(container, currentRating);
        
        console.log('Rating set to:', currentRating);
      });
    });
    
    // Mouse leave container - restore current rating
    container.addEventListener('mouseleave', function() {
      updateStars(stars, currentRating);
    });
  });
}

// ========================================
// UPDATE STAR DISPLAY
// ========================================
function updateStars(stars, rating) {
  stars.forEach((star, index) => {
    if (index < rating) {
      star.classList.add('selected');
      star.classList.remove('fa-regular');
      star.classList.add('fa-solid');
    } else {
      star.classList.remove('selected');
      star.classList.remove('fa-solid');
      star.classList.add('fa-regular');
    }
  });
}

// ========================================
// SUBMIT RATING (AJAX)
// ========================================
function submitRating(form, rating) {
  const mangaId = form.querySelector('input[name="mangaId"]')?.value;
  const actionUrl = form.action;
  
  if (!mangaId || !actionUrl) {
    console.error('Missing manga ID or action URL');
    return;
  }
  
  // Show loading state
  const submitBtn = form.querySelector('button[type="submit"]');
  const originalBtnText = submitBtn ? submitBtn.innerHTML : '';
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
  }
  
  // Send AJAX request
  fetch(actionUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `rating=${rating}`
  })
  .then(response => {
    if (response.ok) {
      return response.json();
    }
    throw new Error('Failed to submit rating');
  })
  .then(data => {
    // Update UI with new average rating
    if (data.success) {
      updateAverageRating(data.averageRating, data.ratingCount);
      showSuccessMessage('Rating submitted successfully!');
    }
  })
  .catch(error => {
    console.error('Error submitting rating:', error);
    showErrorMessage('Failed to submit rating. Please try again.');
  })
  .finally(() => {
    // Restore button state
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;
    }
  });
}

// ========================================
// UPDATE AVERAGE RATING DISPLAY
// ========================================
function updateAverageRating(averageRating, ratingCount) {
  const avgRatingElement = document.querySelector('.rating-number');
  const ratingCountElement = document.querySelector('.rating-count');
  const starsDisplay = document.querySelector('.stars-large');
  
  if (avgRatingElement) {
    // Animate number change
    animateNumber(avgRatingElement, parseFloat(averageRating));
  }
  
  if (ratingCountElement) {
    ratingCountElement.textContent = `(${ratingCount} rating${ratingCount !== 1 ? 's' : ''})`;
  }
  
  if (starsDisplay) {
    updateStarsDisplay(starsDisplay, averageRating);
  }
}

// ========================================
// ANIMATE NUMBER CHANGE
// ========================================
function animateNumber(element, targetValue) {
  const currentValue = parseFloat(element.textContent) || 0;
  const duration = 500; // milliseconds
  const steps = 30;
  const increment = (targetValue - currentValue) / steps;
  const stepDuration = duration / steps;
  
  let currentStep = 0;
  
  const interval = setInterval(() => {
    currentStep++;
    const newValue = currentValue + (increment * currentStep);
    element.textContent = newValue.toFixed(1);
    
    if (currentStep >= steps) {
      element.textContent = targetValue.toFixed(1);
      clearInterval(interval);
    }
  }, stepDuration);
}

// ========================================
// UPDATE STARS DISPLAY (Read-only)
// ========================================
function updateStarsDisplay(container, rating) {
  const stars = container.querySelectorAll('.fa-star');
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  
  stars.forEach((star, index) => {
    star.classList.remove('fa-solid', 'fa-regular', 'fa-star-half-stroke');
    
    if (index < fullStars) {
      star.classList.add('fa-solid');
    } else if (index === fullStars && hasHalfStar) {
      star.classList.add('fa-star-half-stroke');
    } else {
      star.classList.add('fa-regular');
    }
  });
}

// ========================================
// RATING FEEDBACK
// ========================================
function showRatingFeedback(container, rating) {
  const messages = {
    1: 'Poor',
    2: 'Fair',
    3: 'Good',
    4: 'Very Good',
    5: 'Excellent'
  };
  
  const message = messages[rating] || '';
  
  // Create temporary feedback element
  let feedback = container.querySelector('.rating-feedback');
  if (!feedback) {
    feedback = document.createElement('div');
    feedback.className = 'rating-feedback';
    feedback.style.cssText = `
      position: absolute;
      top: -30px;
      left: 50%;
      transform: translateX(-50%);
      background: #6366f1;
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 8px;
      font-size: 0.875rem;
      font-weight: 600;
      white-space: nowrap;
      opacity: 0;
      transition: opacity 0.3s ease;
      pointer-events: none;
    `;
    container.style.position = 'relative';
    container.appendChild(feedback);
  }
  
  feedback.textContent = message;
  feedback.style.opacity = '1';
  
  setTimeout(() => {
    feedback.style.opacity = '0';
  }, 2000);
}

// ========================================
// SUCCESS/ERROR MESSAGES
// ========================================
function showSuccessMessage(message) {
  showNotification(message, 'success');
}

function showErrorMessage(message) {
  showNotification(message, 'error');
}

function showNotification(message, type = 'success') {
  const notification = document.createElement('div');
  notification.className = `alert alert-${type}`;
  notification.style.cssText = `
    position: fixed;
    top: 90px;
    right: 20px;
    z-index: 9999;
    min-width: 300px;
    animation: slideIn 0.3s ease;
  `;
  
  const icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';
  notification.innerHTML = `
    <i class="fas ${icon}"></i>
    <span>${message}</span>
  `;
  
  document.body.appendChild(notification);
  
  // Auto-remove after 3 seconds
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 3000);
}

// Add notification animations
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateX(100%);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  
  @keyframes slideOut {
    from {
      opacity: 1;
      transform: translateX(0);
    }
    to {
      opacity: 0;
      transform: translateX(100%);
    }
  }
`;
document.head.appendChild(style);

// ========================================
// UTILITY: SET RATING (for inline onclick)
// ========================================
function setRating(rating) {
  const container = document.querySelector('.star-rating');
  if (!container) return;
  
  const stars = container.querySelectorAll('.rating-star');
  const form = container.closest('form');
  
  updateStars(stars, rating);
  
  if (form) {
    const ratingInput = form.querySelector('input[name="rating"]');
    if (ratingInput) {
      ratingInput.value = rating;
    }
  }
  
  showRatingFeedback(container, rating);
}

// Export for global use
window.setRating = setRating;
window.submitRating = submitRating;
