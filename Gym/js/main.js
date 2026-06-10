/**
 * AURA ATHLETICS - PREMIUM INTERACTIVE WEBSITE ENGINE
 * Fully custom JavaScript for professional UI/UX, animations, and calculators.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  initHeader();
  initMobileMenu();
  initScrollHighlight();
  initMouseFlare();
  initSchedule();
  initBmiCalculator();
  initPricingToggle();
  initTestimonialSlider();
  initBookingModal();
  initFormValidation();
  initScrollAnimations();
});

/* ==========================================================================
   1. STICKY HEADER
   ========================================================================== */
function initHeader() {
  const header = document.querySelector('.header');
  
  const handleScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Initial check
}

/* ==========================================================================
   2. MOBILE NAV MENU
   ========================================================================== */
function initMobileMenu() {
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!menuToggle || !navMenu) return;

  const toggleMenu = () => {
    navMenu.classList.toggle('active');
    
    // Toggle menu icon
    const icon = menuToggle.querySelector('i');
    if (icon) {
      if (navMenu.classList.contains('active')) {
        icon.setAttribute('data-lucide', 'x');
      } else {
        icon.setAttribute('data-lucide', 'menu');
      }
      lucide.createIcons();
    }
  };

  menuToggle.addEventListener('click', toggleMenu);

  // Close menu when a link is clicked
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu.classList.contains('active')) {
        toggleMenu();
      }
    });
  });
}

/* ==========================================================================
   3. SCROLL SECTION HIGHLIGHTING IN NAV
   ========================================================================== */
function initScrollHighlight() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const highlightNav = () => {
    const scrollY = window.scrollY;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 100;
      const sectionId = current.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', highlightNav);
}

/* ==========================================================================
   4. MOUSE HOVER FLARE EFFECT (Card illumination)
   ========================================================================== */
function initMouseFlare() {
  const cards = document.querySelectorAll('.feature-card, .pricing-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left; // x position within the element
      const y = e.clientY - rect.top;  // y position within the element

      card.style.setProperty('--x', `${x}px`);
      card.style.setProperty('--y', `${y}px`);
    });
  });
}

/* ==========================================================================
   5. INTERACTIVE SCHEDULE FILTER
   ========================================================================== */
const SCHEDULE_DATA = {
  monday: [
    { time: '06:00 AM', name: 'Strength & Conditioning', trainer: 'Marcus Vance', trainerImg: 'assets/images/trainer_male.png', trainerTitle: 'Strength Specialist', slots: 5, category: 'Strength' },
    { time: '09:00 AM', name: 'Power Yoga & Flow', trainer: 'Sarah Chen', trainerImg: 'assets/images/trainer_yoga.png', trainerTitle: 'Yoga & Mind Expert', slots: 12, category: 'Yoga' },
    { time: '12:00 PM', name: 'HIIT Cardio Fusion', trainer: 'Elena Rostova', trainerImg: 'assets/images/trainer_female.png', trainerTitle: 'HIIT & Nutrition', slots: 8, category: 'Cardio' },
    { time: '05:30 PM', name: 'Athletic CrossFit', trainer: 'Marcus Vance', trainerImg: 'assets/images/trainer_male.png', trainerTitle: 'Strength Specialist', slots: 3, category: 'CrossFit' },
    { time: '07:00 PM', name: 'Boxing & Core', trainer: 'Elena Rostova', trainerImg: 'assets/images/trainer_female.png', trainerTitle: 'HIIT & Nutrition', slots: 10, category: 'Cardio' }
  ],
  tuesday: [
    { time: '07:00 AM', name: 'HIIT Cardio Fusion', trainer: 'Elena Rostova', trainerImg: 'assets/images/trainer_female.png', trainerTitle: 'HIIT & Nutrition', slots: 15, category: 'Cardio' },
    { time: '10:00 AM', name: 'Olympic Weightlifting', trainer: 'Marcus Vance', trainerImg: 'assets/images/trainer_male.png', trainerTitle: 'Strength Specialist', slots: 4, category: 'Strength' },
    { time: '04:30 PM', name: 'Vinyasa Yoga', trainer: 'Sarah Chen', trainerImg: 'assets/images/trainer_yoga.png', trainerTitle: 'Yoga & Mind Expert', slots: 18, category: 'Yoga' },
    { time: '06:00 PM', name: 'Strength & Conditioning', trainer: 'Marcus Vance', trainerImg: 'assets/images/trainer_male.png', trainerTitle: 'Strength Specialist', slots: 7, category: 'Strength' }
  ],
  wednesday: [
    { time: '06:00 AM', name: 'Athletic CrossFit', trainer: 'Marcus Vance', trainerImg: 'assets/images/trainer_male.png', trainerTitle: 'Strength Specialist', slots: 2, category: 'CrossFit' },
    { time: '09:00 AM', name: 'Pilates Core Focus', trainer: 'Sarah Chen', trainerImg: 'assets/images/trainer_yoga.png', trainerTitle: 'Yoga & Mind Expert', slots: 14, category: 'Yoga' },
    { time: '12:00 PM', name: 'HIIT Cardio Fusion', trainer: 'Elena Rostova', trainerImg: 'assets/images/trainer_female.png', trainerTitle: 'HIIT & Nutrition', slots: 9, category: 'Cardio' },
    { time: '05:30 PM', name: 'Strength & Conditioning', trainer: 'Marcus Vance', trainerImg: 'assets/images/trainer_male.png', trainerTitle: 'Strength Specialist', slots: 6, category: 'Strength' },
    { time: '07:00 PM', name: 'Mobility & Recovery', trainer: 'Sarah Chen', trainerImg: 'assets/images/trainer_yoga.png', trainerTitle: 'Yoga & Mind Expert', slots: 20, category: 'Yoga' }
  ],
  thursday: [
    { time: '07:00 AM', name: 'HIIT Cardio Fusion', trainer: 'Elena Rostova', trainerImg: 'assets/images/trainer_female.png', trainerTitle: 'HIIT & Nutrition', slots: 11, category: 'Cardio' },
    { time: '10:00 AM', name: 'Strength & Conditioning', trainer: 'Marcus Vance', trainerImg: 'assets/images/trainer_male.png', trainerTitle: 'Strength Specialist', slots: 8, category: 'Strength' },
    { time: '04:30 PM', name: 'Hatha Yoga & Rest', trainer: 'Sarah Chen', trainerImg: 'assets/images/trainer_yoga.png', trainerTitle: 'Yoga & Mind Expert', slots: 15, category: 'Yoga' },
    { time: '06:00 PM', name: 'Athletic CrossFit', trainer: 'Marcus Vance', trainerImg: 'assets/images/trainer_male.png', trainerTitle: 'Strength Specialist', slots: 5, category: 'CrossFit' }
  ],
  friday: [
    { time: '06:00 AM', name: 'Strength & Conditioning', trainer: 'Marcus Vance', trainerImg: 'assets/images/trainer_male.png', trainerTitle: 'Strength Specialist', slots: 6, category: 'Strength' },
    { time: '09:00 AM', name: 'Power Yoga & Flow', trainer: 'Sarah Chen', trainerImg: 'assets/images/trainer_yoga.png', trainerTitle: 'Yoga & Mind Expert', slots: 10, category: 'Yoga' },
    { time: '12:00 PM', name: 'HIIT Cardio Fusion', trainer: 'Elena Rostova', trainerImg: 'assets/images/trainer_female.png', trainerTitle: 'HIIT & Nutrition', slots: 7, category: 'Cardio' },
    { time: '05:30 PM', name: 'Athletic CrossFit', trainer: 'Marcus Vance', trainerImg: 'assets/images/trainer_male.png', trainerTitle: 'Strength Specialist', slots: 4, category: 'CrossFit' },
    { time: '07:00 PM', name: 'Elite Performance Run', trainer: 'Elena Rostova', trainerImg: 'assets/images/trainer_female.png', trainerTitle: 'HIIT & Nutrition', slots: 12, category: 'Cardio' }
  ],
  saturday: [
    { time: '08:00 AM', name: 'Weekend Warrior HIIT', trainer: 'Elena Rostova', trainerImg: 'assets/images/trainer_female.png', trainerTitle: 'HIIT & Nutrition', slots: 15, category: 'Cardio' },
    { time: '10:00 AM', name: 'CrossFit Team WOD', trainer: 'Marcus Vance', trainerImg: 'assets/images/trainer_male.png', trainerTitle: 'Strength Specialist', slots: 8, category: 'CrossFit' },
    { time: '11:30 AM', name: 'Deep Stretch & Release', trainer: 'Sarah Chen', trainerImg: 'assets/images/trainer_yoga.png', trainerTitle: 'Yoga & Mind Expert', slots: 25, category: 'Yoga' }
  ]
};

function initSchedule() {
  const tabButtons = document.querySelectorAll('.schedule-tabs .tab-btn');
  const scheduleGrid = document.getElementById('scheduleGrid');

  if (!scheduleGrid) return;

  const renderSchedule = (day) => {
    const classes = SCHEDULE_DATA[day] || [];
    scheduleGrid.innerHTML = '';

    if (classes.length === 0) {
      scheduleGrid.innerHTML = `<p style="text-align: center; color: var(--text-muted); padding: 3rem 0;">No classes scheduled for today.</p>`;
      return;
    }

    classes.forEach((cls, index) => {
      const scheduleItem = document.createElement('div');
      scheduleItem.className = 'schedule-item';
      scheduleItem.style.animationDelay = `${index * 0.1}s`;

      scheduleItem.innerHTML = `
        <div class="sched-time">
          <i data-lucide="clock"></i>
          <span>${cls.time}</span>
        </div>
        <div class="sched-class">
          <h4>${cls.name}</h4>
          <p>${cls.category}</p>
        </div>
        <div class="sched-trainer">
          <img src="${cls.trainerImg}" alt="${cls.trainer}" class="sched-trainer-img">
          <div class="sched-trainer-info">
            <h5>${cls.trainer}</h5>
            <p>${cls.trainerTitle}</p>
          </div>
        </div>
        <div class="sched-slots">
          <i data-lucide="users"></i>
          <span>${cls.slots} slots left</span>
        </div>
        <div class="sched-action">
          <button class="btn btn-secondary btn-sm open-booking-btn" data-class="${cls.name}" data-time="${cls.time}" data-day="${day}">
            Book Class
          </button>
        </div>
      `;
      scheduleGrid.appendChild(scheduleItem);
    });

    // Re-create icons for new elements
    lucide.createIcons();
    attachClassBookingEvents();
  };

  // Set up event listeners for tab buttons
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const day = btn.getAttribute('data-day');
      renderSchedule(day);
    });
  });

  // Render initial schedule (Monday)
  renderSchedule('monday');
}

/* ==========================================================================
   6. INTERACTIVE BMI CALCULATOR
   ========================================================================== */
function initBmiCalculator() {
  const weightInput = document.getElementById('bmiWeight');
  const heightInput = document.getElementById('bmiHeight');
  const calculateBtn = document.getElementById('calculateBmiBtn');
  
  const needle = document.getElementById('bmiNeedle');
  const resultCard = document.getElementById('bmiResultCard');
  const bmiNumber = document.getElementById('bmiNumber');
  const bmiStatus = document.getElementById('bmiStatus');
  const bmiAdvice = document.getElementById('bmiAdvice');

  if (!calculateBtn || !needle) return;

  calculateBtn.addEventListener('click', () => {
    const weight = parseFloat(weightInput.value);
    const height = parseFloat(heightInput.value) / 100; // convert cm to m

    if (!weight || !height || weight <= 0 || height <= 0) {
      alert('Please enter valid numeric height and weight.');
      return;
    }

    const bmi = (weight / (height * height)).toFixed(1);
    
    // Animate Needle
    // BMI 15 -> -90deg rotation
    // BMI 25 -> 0deg rotation (center)
    // BMI 35 -> +90deg rotation
    // Formula: angle = ((bmi - 15) / 20) * 180 - 90
    let angle = ((bmi - 15) / 20) * 180 - 90;
    // Clamp angle between -90 and 90 degrees
    angle = Math.max(-90, Math.min(90, angle));
    needle.style.transform = `translateX(-50%) rotate(${angle}deg)`;

    // Determine category & advice
    let statusText = '';
    let adviceText = '';
    let accentColor = '';

    if (bmi < 18.5) {
      statusText = 'Underweight';
      adviceText = 'Focus on lifting weights and eat healthy, protein-rich food to gain weight.';
      accentColor = '#3b82f6'; // Blue
    } else if (bmi >= 18.5 && bmi < 25) {
      statusText = 'Healthy Weight';
      adviceText = 'Great job! Keep fit with regular workouts and strength exercises.';
      accentColor = '#C5F82A'; // Aura Accent Neon
    } else if (bmi >= 25 && bmi < 30) {
      statusText = 'Overweight';
      adviceText = 'Add fast cardio workouts (HIIT) to your routine and eat healthy, balanced food.';
      accentColor = '#f59e0b'; // Orange
    } else {
      statusText = 'Obese';
      adviceText = 'Focus on daily cardio exercises, consult our diet coach, and stay regular.';
      accentColor = '#ef4444'; // Red
    }

    // Display result with styling
    bmiNumber.innerText = bmi;
    bmiStatus.innerText = statusText;
    bmiStatus.style.color = accentColor;
    bmiAdvice.innerText = adviceText;

    resultCard.classList.add('active');
  });
}

/* ==========================================================================
   7. PRICING MONTHLY / ANNUAL TOGGLE
   ========================================================================== */
function initPricingToggle() {
  const switchInput = document.getElementById('pricingSwitch');
  const labels = document.querySelectorAll('.toggle-label');
  
  const basicPrice = document.getElementById('priceBasic');
  const premiumPrice = document.getElementById('pricePremium');
  const elitePrice = document.getElementById('priceElite');
  
  const periodText = document.querySelectorAll('.plan-period');

  if (!switchInput) return;

  const updatePricing = () => {
    const isYearly = switchInput.checked;
    
    if (isYearly) {
      labels[0].classList.remove('active');
      labels[1].classList.add('active');
      
      // Animate price swap
      animatePriceChange(basicPrice, 1999);
      animatePriceChange(premiumPrice, 3199);
      animatePriceChange(elitePrice, 6399);
      
      periodText.forEach(p => p.innerText = '/mo, billed annually');
    } else {
      labels[0].classList.add('active');
      labels[1].classList.remove('active');
      
      animatePriceChange(basicPrice, 2499);
      animatePriceChange(premiumPrice, 3999);
      animatePriceChange(elitePrice, 7999);
      
      periodText.forEach(p => p.innerText = '/mo');
    }
  };

  const animatePriceChange = (element, targetValue) => {
    element.style.opacity = 0;
    element.style.transform = 'translateY(-10px)';
    
    setTimeout(() => {
      element.innerText = `₹${targetValue}`;
      element.style.opacity = 1;
      element.style.transform = 'translateY(0)';
    }, 200);
  };

  switchInput.addEventListener('change', updatePricing);
}

/* ==========================================================================
   8. TESTIMONIALS SLIDER (CAROUSEL)
   ========================================================================== */
function initTestimonialSlider() {
  const track = document.getElementById('testimonialsTrack');
  const slides = document.querySelectorAll('.testimonials-track .slide');
  const prevBtn = document.getElementById('prevTestimonial');
  const nextBtn = document.getElementById('nextTestimonial');
  const dotsContainer = document.getElementById('sliderDots');

  if (!track || slides.length === 0) return;

  let currentIndex = 0;
  const slideCount = slides.length;

  // Create indicator dots
  dotsContainer.innerHTML = '';
  for (let i = 0; i < slideCount; i++) {
    const dot = document.createElement('div');
    dot.className = `slider-dot ${i === 0 ? 'active' : ''}`;
    dot.addEventListener('click', () => goToSlide(i));
    dotsContainer.appendChild(dot);
  }

  const updateDots = () => {
    const dots = dotsContainer.querySelectorAll('.slider-dot');
    dots.forEach((dot, idx) => {
      if (idx === currentIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  };

  const goToSlide = (index) => {
    if (index < 0) {
      currentIndex = slideCount - 1;
    } else if (index >= slideCount) {
      currentIndex = 0;
    } else {
      currentIndex = index;
    }

    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    updateDots();
  };

  if (prevBtn) {
    prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));
  }

  // Auto play every 6 seconds
  let timer = setInterval(() => goToSlide(currentIndex + 1), 6000);

  const resetTimer = () => {
    clearInterval(timer);
    timer = setInterval(() => goToSlide(currentIndex + 1), 6000);
  };

  [prevBtn, nextBtn, dotsContainer].forEach(elem => {
    if (elem) elem.addEventListener('click', resetTimer);
  });
}

/* ==========================================================================
   9. BOOKING MODAL & NOTIFICATIONS
   ========================================================================== */
let selectedBookingInfo = null;

function initBookingModal() {
  const modal = document.getElementById('bookingModal');
  const closeBtn = document.getElementById('closeModal');
  const triggerButtons = document.querySelectorAll('.open-join-modal-btn');
  const bookingForm = document.getElementById('modalBookingForm');

  if (!modal || !closeBtn) return;

  const openModal = (title = 'Join Aura Athletics', desc = 'Fill in your details below and an Elite advisor will reach out within 2 hours.') => {
    document.getElementById('modalTitle').innerText = title;
    document.getElementById('modalDesc').innerText = desc;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
    bookingForm.reset();
  };

  // Close when clicking X or background
  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // Attach generic trigger buttons (e.g. CTA buttons, Hero "Get Started", Pricing buttons)
  triggerButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const planName = btn.getAttribute('data-plan');
      if (planName) {
        openModal(
          `Subscribe to ${planName}`,
          `Secure your special rate for ${planName}. Fill details to request setup.`
        );
      } else {
        openModal();
      }
    });
  });

  window.openAuraModal = openModal;
  window.closeAuraModal = closeModal;
}

// Separate function to attach dynamic event listeners to newly generated DOM buttons in schedule grid
function attachClassBookingEvents() {
  const buttons = document.querySelectorAll('.open-booking-btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const className = btn.getAttribute('data-class');
      const time = btn.getAttribute('data-time');
      const day = btn.getAttribute('data-day').toUpperCase();
      
      selectedBookingInfo = { class: className, time, day };
      
      if (window.openAuraModal) {
        window.openAuraModal(
          `Reserve Class Slot`,
          `Booking: ${className} on ${day} at ${time}. Fill out verification below.`
        );
      }
    });
  });
}

/* ==========================================================================
   10. FORM SUBMISSION VALIDATION & TOAST NOTIFICATION
   ========================================================================== */
function initFormValidation() {
  const modalForm = document.getElementById('modalBookingForm');
  const contactForm = document.getElementById('contactForm');
  const newsletterForm = document.getElementById('newsletterForm');

  const showToast = (title, msg) => {
    const toast = document.getElementById('successToast');
    if (!toast) return;

    toast.querySelector('h5').innerText = title;
    toast.querySelector('p').innerText = msg;
    
    toast.classList.add('active');

    setTimeout(() => {
      toast.classList.remove('active');
    }, 4000);
  };

  // Modal Form Submission
  if (modalForm) {
    modalForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('modalName').value.trim();
      const email = document.getElementById('modalEmail').value.trim();
      const phone = document.getElementById('modalPhone').value.trim();

      if (!name || !email || !phone) {
        alert('Please fill out all fields.');
        return;
      }

      // Hide Modal
      if (window.closeAuraModal) window.closeAuraModal();

      let toastTitle = 'Welcome on Board!';
      let toastMsg = 'Your elite onboarding request has been submitted.';

      if (selectedBookingInfo) {
        toastTitle = 'Slot Reserved!';
        toastMsg = `Successfully booked ${selectedBookingInfo.class} for ${selectedBookingInfo.day}.`;
        selectedBookingInfo = null; // reset
      }

      showToast(toastTitle, toastMsg);
    });
  }

  // Contact Form Submission
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('contactName').value.trim();
      const email = document.getElementById('contactEmail').value.trim();
      const msg = document.getElementById('contactMessage').value.trim();

      if (!name || !email || !msg) {
        alert('Please fill out all fields.');
        return;
      }

      contactForm.reset();
      showToast('Message Sent!', 'Our coaching team will contact you back via email.');
    });
  }

  // Newsletter Form Submission
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const emailInput = newsletterForm.querySelector('input');
      const email = emailInput.value.trim();

      if (!email) return;

      newsletterForm.reset();
      showToast('Subscribed!', 'Welcome to Aura newsletter digest.');
    });
  }
}

/* ==========================================================================
   11. SCROLL FADE-IN ANIMATIONS (ScrollReveal-like behavior)
   ========================================================================== */
function initScrollAnimations() {
  const elements = document.querySelectorAll('.feature-card, .program-card, .trainer-card, .pricing-card, .bmi-wrapper, .contact-card, .contact-details, .map-container');

  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  elements.forEach((element, index) => {
    // Initial styles
    element.style.opacity = '0';
    element.style.transform = 'translateY(30px)';
    element.style.transition = `opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)`;
    
    // Add small staggering effect
    if (element.classList.contains('feature-card') || 
        element.classList.contains('program-card') || 
        element.classList.contains('trainer-card') ||
        element.classList.contains('pricing-card')) {
      const colIndex = index % 3; // or % 4 depending on grid
      element.style.transitionDelay = `${colIndex * 0.15}s`;
    }

    observer.observe(element);
  });
}
