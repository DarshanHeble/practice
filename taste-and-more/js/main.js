document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Lucide Icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // 2. Sticky Navigation Bar & Active Section Highlight
  const navbarContainer = document.querySelector('.navbar-container');
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', () => {
    // Toggle sticky background shadow
    if (window.scrollY > 50) {
      navbarContainer.classList.add('scrolled');
    } else {
      navbarContainer.classList.remove('scrolled');
    }

    // Scroll active link highlight
    let currentSectionId = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= (sectionTop - 150)) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  });

  // 3. Mobile Hamburger Menu Toggle
  const menuToggle = document.querySelector('.menu-toggle');
  const navList = document.querySelector('.nav-links');
  
  if (menuToggle && navList) {
    menuToggle.addEventListener('click', () => {
      navList.classList.toggle('active');
      // Change icon
      const icon = menuToggle.querySelector('i');
      if (icon) {
        if (navList.classList.contains('active')) {
          icon.setAttribute('data-lucide', 'x');
        } else {
          icon.setAttribute('data-lucide', 'menu');
        }
        lucide.createIcons();
      }
    });

    // Close menu when link clicked
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navList.classList.remove('active');
        const icon = menuToggle.querySelector('i');
        if (icon) {
          icon.setAttribute('data-lucide', 'menu');
          lucide.createIcons();
        }
      });
    });
  }

  // 4. Menu Category Tabs Filtering
  const tabButtons = document.querySelectorAll('.tab-btn');
  const dishCards = document.querySelectorAll('.dish-card');

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active from all tabs
      tabButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      const filterValue = button.getAttribute('data-filter');

      dishCards.forEach(card => {
        // Simple fade transition
        card.style.opacity = '0';
        card.style.transform = 'translateY(15px)';
        
        setTimeout(() => {
          if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
            card.style.display = 'flex';
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            }, 50);
          } else {
            card.style.display = 'none';
          }
        }, 300);
      });
    });
  });

  // 5. Customer Reviews Carousel
  const slides = document.querySelectorAll('.review-slide');
  const dotsContainer = document.querySelector('.carousel-dots');
  const prevBtn = document.querySelector('.carousel-btn-prev');
  const nextBtn = document.querySelector('.carousel-btn-next');
  let currentSlide = 0;
  let carouselInterval;

  if (slides.length > 0) {
    // Generate Dots
    slides.forEach((slide, index) => {
      const dot = document.createElement('button');
      dot.classList.add('carousel-dot');
      if (index === 0) dot.classList.add('active');
      dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
      dot.addEventListener('click', () => goToSlide(index));
      dotsContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll('.carousel-dot');

    function updateSlides() {
      slides.forEach((slide, index) => {
        slide.classList.remove('active');
        dots[index].classList.remove('active');
        if (index === currentSlide) {
          slide.classList.add('active');
          dots[index].classList.add('active');
        }
      });
    }

    function nextSlide() {
      currentSlide = (currentSlide + 1) % slides.length;
      updateSlides();
    }

    function prevSlide() {
      currentSlide = (currentSlide - 1 + slides.length) % slides.length;
      updateSlides();
    }

    function goToSlide(index) {
      currentSlide = index;
      updateSlides();
      resetInterval();
    }

    function resetInterval() {
      clearInterval(carouselInterval);
      carouselInterval = setInterval(nextSlide, 5000);
    }

    if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); resetInterval(); });
    if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); resetInterval(); });

    // Start auto scroll
    resetInterval();
  }

  // 6. Star Rating Interactive Selection
  const starRatingInput = document.getElementById('star-rating');
  let selectedRating = 5;

  if (starRatingInput) {
    const stars = starRatingInput.querySelectorAll('i');
    stars.forEach(star => {
      star.addEventListener('click', () => {
        selectedRating = parseInt(star.getAttribute('data-value'));
        updateStars(selectedRating);
      });

      star.addEventListener('mouseover', () => {
        const hoverVal = parseInt(star.getAttribute('data-value'));
        highlightStars(hoverVal);
      });

      star.addEventListener('mouseout', () => {
        highlightStars(selectedRating);
      });
    });

    function updateStars(rating) {
      stars.forEach(star => {
        const val = parseInt(star.getAttribute('data-value'));
        if (val <= rating) {
          star.classList.add('active');
          star.setAttribute('data-lucide', 'star');
        } else {
          star.classList.remove('active');
          star.setAttribute('data-lucide', 'star');
          // Update visual look (Lucide icons can use styling to handle fill)
        }
      });
      // Re-trigger lucide to repaint if icon names change
      lucide.createIcons();
    }

    function highlightStars(rating) {
      stars.forEach(star => {
        const val = parseInt(star.getAttribute('data-value'));
        if (val <= rating) {
          star.style.color = '#F6CF4E';
        } else {
          star.style.color = '';
        }
      });
    }
  }

  // 7. Demo Review Form Submit
  const reviewForm = document.getElementById('restaurant-review-form');
  if (reviewForm) {
    reviewForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('review-name').value;
      const reviewText = document.getElementById('review-text').value;

      if (!name || !reviewText) return;

      // Add new slide dynamically to reviews carousel
      const carousel = document.querySelector('.reviews-carousel');
      const newSlide = document.createElement('div');
      newSlide.classList.add('review-slide');
      
      let starsHTML = '';
      for (let i = 1; i <= 5; i++) {
        const fillClass = i <= selectedRating ? 'style="fill: #F6CF4E; color: #F6CF4E;"' : 'style="color: rgba(15, 106, 91, 0.15);"';
        starsHTML += `<i data-lucide="star" ${fillClass}></i>`;
      }

      newSlide.innerHTML = `
        <div class="review-card">
          <span class="quote-icon">“</span>
          <div class="review-stars">
            ${starsHTML}
          </div>
          <p class="review-text">"${reviewText}"</p>
          <div class="review-author">${name}</div>
          <div class="review-author-title">Verified Guest</div>
        </div>
      `;

      carousel.appendChild(newSlide);
      lucide.createIcons();

      // Regenerate dots
      const dotsContainer = document.querySelector('.carousel-dots');
      dotsContainer.innerHTML = '';
      
      const allSlides = document.querySelectorAll('.review-slide');
      allSlides.forEach((slide, index) => {
        const dot = document.createElement('button');
        dot.classList.add('carousel-dot');
        dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
        dot.addEventListener('click', () => {
          // Trigger slide update
          allSlides.forEach((s, idx) => {
            s.classList.remove('active');
            document.querySelectorAll('.carousel-dot')[idx].classList.remove('active');
          });
          allSlides[index].classList.add('active');
          document.querySelectorAll('.carousel-dot')[index].classList.add('active');
          currentSlide = index;
        });
        dotsContainer.appendChild(dot);
      });

      // Switch to the newly created slide
      allSlides.forEach(s => s.classList.remove('active'));
      newSlide.classList.add('active');
      currentSlide = allSlides.length - 1;
      
      const allDots = document.querySelectorAll('.carousel-dot');
      allDots.forEach(d => d.classList.remove('active'));
      allDots[allDots.length - 1].classList.add('active');

      // Show success alert
      alert('Thank you for your warm review! It has been added to our live showcase.');
      
      // Reset form
      reviewForm.reset();
      selectedRating = 5;
      updateStars(5);
    });
  }

  // 8. Contact Form Demo Submission
  const contactForm = document.getElementById('restaurant-contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Thank you for contacting Tastes & More. We have received your query and our team will get in touch with you shortly.');
      contactForm.reset();
    });
  }

  // 9. Gallery Lightbox Functionality
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.createElement('div');
  lightbox.classList.add('lightbox');
  lightbox.innerHTML = `
    <button class="lightbox-close">&times;</button>
    <div class="lightbox-content">
      <img src="" alt="Enlarged Food Image">
    </div>
  `;
  document.body.appendChild(lightbox);

  const lightboxImg = lightbox.querySelector('img');
  const lightboxClose = lightbox.querySelector('.lightbox-close');

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const imgSrc = item.querySelector('img').getAttribute('src');
      lightboxImg.setAttribute('src', imgSrc);
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden'; // Disable page scrolling
    });
  });

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = ''; // Enable page scrolling
  }

  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });

  // 10. Scroll Animation Trigger using Intersection Observer
  const animateElements = document.querySelectorAll('.animate-on-scroll');

  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-fade-in');
        observer.unobserve(entry.target); // Trigger only once
      }
    });
  }, observerOptions);

  animateElements.forEach(element => {
    observer.observe(element);
  });

  // 11. Scroll To Top Button
  const scrollTopBtn = document.createElement('button');
  scrollTopBtn.classList.add('scroll-top-btn');
  scrollTopBtn.innerHTML = '<i data-lucide="arrow-up"></i>';
  document.body.appendChild(scrollTopBtn);
  lucide.createIcons();

  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }
  });

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  // 12. FAQ Chatbot Functionality
  const faqBotBtn = document.getElementById('faqBotBtn');
  const faqChatWindow = document.getElementById('faqChatWindow');
  const closeFaqChat = document.getElementById('closeFaqChat');
  const faqChatBody = document.getElementById('faqChatBody');
  const faqUserInput = document.getElementById('faqUserInput');
  const sendFaqMsg = document.getElementById('sendFaqMsg');

  // Toggle Chat Window
  if (faqBotBtn && faqChatWindow && closeFaqChat) {
    faqBotBtn.addEventListener('click', () => {
      faqChatWindow.classList.toggle('active');
    });

    closeFaqChat.addEventListener('click', () => {
      faqChatWindow.classList.remove('active');
    });
  }

  // FAQ Database
  const faqAnswers = {
    veg: "Tastes & More is a 100% pure vegetarian restaurant. We follow strict traditional cooking standards with clean utensils and zero meat contamination.",
    timings: "Our serving hours are:<br>• Breakfast: 8:00 AM - 11:30 AM<br>• Lunch & Dinner: 12:00 PM - 11:00 PM everyday.",
    delivery: "Yes, we deliver within a 5km radius! You can place an order using the 'Order Online' button on our page, or find us on Swiggy and Zomato.",
    reserve: "You can book a table by calling us at +91 90077 32566, or fill out the reservation form in the Contact section at the bottom of the page.",
    location: "We are located at 12, Palace Road, Vasanth Nagar, Bengaluru, Karnataka 560052. Feel free to use the interactive map below to find us!"
  };

  // Append Chat Message
  function appendChatMessage(text, sender) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('chat-message', sender === 'bot' ? 'bot-message' : 'user-message');
    msgDiv.innerHTML = `<p>${text}</p>`;
    faqChatBody.appendChild(msgDiv);
    
    // Auto Scroll to bottom
    faqChatBody.scrollTop = faqChatBody.scrollHeight;
  }

  // Handle Quick Chips
  const faqChips = document.querySelectorAll('.faq-chip');
  faqChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const questionText = chip.textContent;
      const questionKey = chip.getAttribute('data-question');
      
      appendChatMessage(questionText, 'user');
      
      // Bot Reply
      setTimeout(() => {
        const reply = faqAnswers[questionKey] || "I'm sorry, I didn't understand that.";
        appendChatMessage(reply, 'bot');
      }, 500);
    });
  });

  // Handle Text Input
  function handleFaqSubmit() {
    const text = faqUserInput.value.trim();
    if (!text) return;

    appendChatMessage(text, 'user');
    faqUserInput.value = '';

    // Simple NLP check
    setTimeout(() => {
      let reply = "Thank you for your question! For detailed enquiries, please contact us directly at +91 90077 32566 or write in our Contact section.";
      const query = text.toLowerCase();

      if (query.includes('veg') || query.includes('pure') || query.includes('meat') || query.includes('egg')) {
        reply = faqAnswers.veg;
      } else if (query.includes('time') || query.includes('timing') || query.includes('open') || query.includes('hour')) {
        reply = faqAnswers.timings;
      } else if (query.includes('deliver') || query.includes('order') || query.includes('swiggy') || query.includes('zomato')) {
        reply = faqAnswers.delivery;
      } else if (query.includes('book') || query.includes('reserve') || query.includes('table') || query.includes('seat')) {
        reply = faqAnswers.reserve;
      } else if (query.includes('where') || query.includes('location') || query.includes('map') || query.includes('address')) {
        reply = faqAnswers.location;
      }

      appendChatMessage(reply, 'bot');
    }, 600);
  }

  if (sendFaqMsg && faqUserInput) {
    sendFaqMsg.addEventListener('click', handleFaqSubmit);
    faqUserInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleFaqSubmit();
    });
  }

  // Printed Menu Modal Logic
  const viewMenuBtn = document.getElementById('viewMenuBtn');
  const menuModal = document.getElementById('menuModal');
  const closeMenuModal = document.getElementById('closeMenuModal');
  const modalBackdrop = document.querySelector('.menu-modal-backdrop');

  if (viewMenuBtn && menuModal) {
    viewMenuBtn.addEventListener('click', (e) => {
      e.preventDefault();
      menuModal.classList.add('active');
      document.body.style.overflow = 'hidden'; // Stop background scrolling
    });

    const closeModal = () => {
      menuModal.classList.remove('active');
      document.body.style.overflow = ''; // Resume scrolling
    };

    if (closeMenuModal) closeMenuModal.addEventListener('click', closeModal);
    if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);
  }

  // Preloader Fade Out Logic
  const preloader = document.getElementById('preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      // Delay slightly for visual comfort and entry animation completion
      setTimeout(() => {
        preloader.classList.add('fade-out');
      }, 800);
    });
  }

  // Banta Clink Toast Animation Timeline Observer
  const bantaSection = document.getElementById('banta');
  if (bantaSection) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Phase 1: Slide-In Entrance
          bantaSection.classList.add('toast-active');
          
          // Phase 2: Clink Impact, Flash, Splash, and Marble Drop (1.15s)
          setTimeout(() => {
            bantaSection.classList.add('toast-impacted');
          }, 1150);
          
          // Phase 3 & 4: Settle right bottle, fade left bottle, portal reveal (1.6s)
          setTimeout(() => {
            bantaSection.classList.remove('toast-active', 'toast-impacted');
            bantaSection.classList.add('toast-settling');
          }, 1600);
          
          // Phase 5: Transition to Continuous Idle Float & Bubbling State (2.8s)
          setTimeout(() => {
            bantaSection.classList.remove('toast-settling');
            bantaSection.classList.add('toast-settled');
          }, 2800);
          
          observer.unobserve(bantaSection); // Run the animation sequence only once
        }
      });
    }, { threshold: 0.25 });
    
    observer.observe(bantaSection);
  }
});
