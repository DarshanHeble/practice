/**
 * L'AMOUR DU SUCRE - PREMIUM CAKE BOUTIQUE ENGINE
 * Fully custom JavaScript for boutique styling, live cake building, and menu filters.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  initHeader();
  initMobileMenu();
  initScrollHighlight();
  initCakeBuilder();
  initMenuFilter();
  initTestimonialSlider();
  initConsultationForm();
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
  handleScroll();
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

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu.classList.contains('active')) {
        toggleMenu();
      }
    });
  });
}

/* ==========================================================================
   3. SCROLL HIGHLIGHT
   ========================================================================== */
function initScrollHighlight() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const highlightNav = () => {
    const scrollY = window.scrollY;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
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
   4. DYNAMIC CAKE BUILDER WIDGET
   ========================================================================== */
function initCakeBuilder() {
  // Option Selectors
  const flavorCards = document.querySelectorAll('.flavor-step .option-card');
  const tierCards = document.querySelectorAll('.tiers-step .option-card');
  const frostingCards = document.querySelectorAll('.frosting-step .option-card');
  const toppingCards = document.querySelectorAll('.toppings-step .option-card');
  
  // Preview Elements
  const layersContainer = document.getElementById('cakeLayersContainer');
  const toppingGraphic = document.getElementById('cakeToppingGraphic');
  const priceDisplay = document.getElementById('builderPrice');
  const addToCartBtn = document.getElementById('builderAddToCartBtn');

  if (!layersContainer || !priceDisplay) return;

  // Active configuration states
  let cakeConfig = {
    flavor: 'chocolate',   // chocolate, vanilla, redvelvet, pistachio
    tiers: 2,             // 1, 2, 3
    frosting: 'buttercream', // buttercream, fondant, naked
    topping: 'berries'    // berries, gold, flowers, none
  };

  // Pricing configuration database
  const PRICING_RULES = {
    flavors: {
      chocolate: 35,
      vanilla: 30,
      redvelvet: 40,
      pistachio: 45
    },
    tiersMultiplier: {
      1: 1.0,
      2: 1.8,
      3: 2.5
    },
    frostings: {
      buttercream: 5,
      fondant: 15,
      naked: 0
    },
    toppings: {
      berries: 8,
      gold: 12,
      flowers: 10,
      none: 0
    }
  };

  // Flavor Hex Colors for Cake Layers
  const FLAVOR_COLORS = {
    chocolate: {
      buttercream: '#6A4D46', // Chocolate Brown with frosting highlights
      fondant: '#FDF6ED',     // Cover with White Fondant
      naked: '#4E362F'        // Rustic chocolate stripes
    },
    vanilla: {
      buttercream: '#FFF8E7', // Cream Vanilla
      fondant: '#FFFDF9',     // Plain White
      naked: '#EADBC8'        // Biscuit vanilla crumbs
    },
    redvelvet: {
      buttercream: '#C73E4A', // Crimson red velvet frosting mix
      fondant: '#F9F1EB',     // Creamy fondant
      naked: '#A82531'        // Deep Ruby red cake layers
    },
    pistachio: {
      buttercream: '#ADC1A3', // Sage green pistachio buttercream
      fondant: '#FFF8E8',     // Pastel
      naked: '#8FA883'        // Warm nut green cake base
    }
  };

  // Topping Emojis / Glyphs
  const TOPPING_GLYPHS = {
    berries: '🍓🍒🍓',
    gold: '✨👑✨',
    flowers: '🌸🌹🌸',
    none: ''
  };

  const updatePreview = () => {
    // 1. Render Tiers / Layers
    layersContainer.innerHTML = '';
    
    // Create layers (bottom to top)
    for (let i = 1; i <= cakeConfig.tiers; i++) {
      const layerElement = document.createElement('div');
      layerElement.className = 'cake-layer-graphic';
      layerElement.setAttribute('data-tier', i);
      
      // Determine Color style based on flavor & frosting style
      const baseColors = FLAVOR_COLORS[cakeConfig.flavor];
      const selectedColor = baseColors[cakeConfig.frosting];
      layerElement.style.backgroundColor = selectedColor;

      // Special styling details for Naked Cake style (stripes overlay)
      if (cakeConfig.frosting === 'naked') {
        layerElement.style.backgroundImage = 'repeating-linear-gradient(0deg, transparent, transparent 15px, rgba(255, 255, 255, 0.4) 15px, rgba(255, 255, 255, 0.4) 22px)';
      } else if (cakeConfig.frosting === 'buttercream') {
        layerElement.style.borderTop = '6px solid #FFFDF9'; // Frosting top rim
      } else {
        layerElement.style.border = '1px solid rgba(194, 166, 118, 0.3)'; // Smooth fondant line
      }

      layersContainer.appendChild(layerElement);
      
      // Animate expansion
      setTimeout(() => {
        layerElement.classList.add('active');
      }, i * 100);
    }

    // 2. Render Topping
    if (cakeConfig.topping !== 'none') {
      toppingGraphic.innerText = TOPPING_GLYPHS[cakeConfig.topping];
      toppingGraphic.classList.add('active');
    } else {
      toppingGraphic.classList.remove('active');
      toppingGraphic.innerText = '';
    }

    // 3. Recalculate Price
    const base = PRICING_RULES.flavors[cakeConfig.flavor];
    const mult = PRICING_RULES.tiersMultiplier[cakeConfig.tiers];
    const frost = PRICING_RULES.frostings[cakeConfig.frosting];
    const top = PRICING_RULES.toppings[cakeConfig.topping];

    const totalPrice = Math.round((base * mult) + frost + top);
    
    // Animate Price changes
    animatePrice(totalPrice);
  };

  const animatePrice = (targetPrice) => {
    const startPrice = parseInt(priceDisplay.innerText.replace('$', '')) || 0;
    const duration = 600; // ms
    const startTime = performance.now();

    const updateCount = (timestamp) => {
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const currentVal = Math.floor(progress * (targetPrice - startPrice) + startPrice);
      priceDisplay.innerText = `$${currentVal}`;

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      } else {
        priceDisplay.innerText = `$${targetPrice}`;
      }
    };

    requestAnimationFrame(updateCount);
  };

  // Set up click handlers for Option Cards
  const attachSelectionHandlers = (cards, configKey) => {
    cards.forEach(card => {
      card.addEventListener('click', () => {
        cards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        
        // Update configuration state
        const val = card.getAttribute('data-value');
        cakeConfig[configKey] = isNaN(val) ? val : parseInt(val);
        
        updatePreview();
      });
    });
  };

  attachSelectionHandlers(flavorCards, 'flavor');
  attachSelectionHandlers(tierCards, 'tiers');
  attachSelectionHandlers(frostingCards, 'frosting');
  attachSelectionHandlers(toppingCards, 'topping');

  // Trigger Add To Cart
  if (addToCartBtn) {
    addToCartBtn.addEventListener('click', () => {
      const summaryMsg = `Custom ${cakeConfig.tiers}-Tier ${cakeConfig.flavor.toUpperCase()} Cake with ${cakeConfig.frosting} frosting has been added to your Box!`;
      
      if (window.showCakeToast) {
        window.showCakeToast('Custom Order Added!', summaryMsg);
      } else {
        alert(summaryMsg);
      }
    });
  }

  // Initial render
  updatePreview();
}

/* ==========================================================================
   5. MENU FILTER & DYNAMIC MENU RENDER
   ========================================================================== */
const MENU_DATA = {
  signature: [
    { title: 'Chocolate Raspberry Drip', price: '$42.00', rating: 5, desc: 'Decadent chocolate sponge layers layered with fresh raspberry compote and coated in glossy dark ganache drips.', img: 'assets/images/cake_chocolate.png' },
    { title: 'Lemon Elderflower Arch', price: '$48.00', rating: 5, desc: 'Zesty lemon sponge infused with organic elderflower syrup, decorated with delicate floral sugar accents.', img: 'assets/images/cake_hero.png' },
    { title: 'Salted Caramel Macadamia', price: '$45.00', rating: 4, desc: 'Soft sponge layered with gold butterscotch caramel, toasted macadamia nuts, and topped with sea salt flakes.', img: 'assets/images/cake_chocolate.png' }
  ],
  cupcake: [
    { title: 'Velvet Pearl Cupcake', price: '$4.50', rating: 5, desc: 'Classic deep crimson red velvet base topped with a smooth dome of cream cheese frosting and sweet sugar pearls.', img: 'assets/images/cake_cupcake.png' },
    { title: 'Lavender Blueberry Swirl', price: '$4.75', rating: 5, desc: 'Fragrant French lavender cupcake with wild blueberry filling and a soft lavender whipped cream swirl.', img: 'assets/images/cake_cupcake.png' },
    { title: 'Pistachio Rose Buds', price: '$5.00', rating: 4, desc: 'Pistachio nut crumble cupcake topped with light rosewater buttercream and a single candied rose petal.', img: 'assets/images/cake_cupcake.png' }
  ],
  pastry: [
    { title: 'Double Almond Croissant', price: '$5.50', rating: 5, desc: 'Slow-baked buttery flaky croissant filled with rich almond frangipane paste and coated in shaved nuts.', img: 'assets/images/cake_hero.png' },
    { title: 'Artisanal Macaron Box', price: '$18.00', rating: 5, desc: 'A curated assortment of 6 gluten-free French macarons (Pistachio, Salted Caramel, Rose, Lemon, Vanilla, Espresso).', img: 'assets/images/cake_cupcake.png' },
    { title: 'Wild Strawberry Tartlet', price: '$6.00', rating: 4, desc: 'Crisp buttery pastry shell filled with vanilla bean pastry cream and piled with glazed organic strawberries.', img: 'assets/images/cake_chocolate.png' }
  ]
};

function initMenuFilter() {
  const tabButtons = document.querySelectorAll('.menu-tabs .tab-btn');
  const menuGrid = document.getElementById('menuGrid');

  if (!menuGrid) return;

  const renderMenu = (category) => {
    const items = MENU_DATA[category] || [];
    menuGrid.innerHTML = '';

    items.forEach((item, index) => {
      const card = document.createElement('div');
      card.className = 'menu-card';
      card.style.animationDelay = `${index * 0.1}s`;

      // Build rating stars
      let starsHtml = '';
      for (let i = 0; i < 5; i++) {
        const fillStyle = i < item.rating ? 'fill="currentColor"' : '';
        starsHtml += `<i data-lucide="star" ${fillStyle}></i>`;
      }

      card.innerHTML = `
        <div class="menu-img-wrapper">
          <img src="${item.img}" alt="${item.title}" class="menu-img">
          <div class="menu-price-tag">${item.price}</div>
        </div>
        <div class="menu-details">
          <div class="menu-stars">
            ${starsHtml}
          </div>
          <h3 class="menu-title">${item.title}</h3>
          <p class="menu-desc">${item.desc}</p>
          <div class="menu-card-footer">
            <button class="btn-link add-to-box-btn" data-name="${item.title}">
              Add to Box <i data-lucide="plus"></i>
            </button>
          </div>
        </div>
      `;

      menuGrid.appendChild(card);
    });

    // Rebuild Icons
    lucide.createIcons();
    attachBoxActions();
  };

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const cat = btn.getAttribute('data-category');
      renderMenu(cat);
    });
  });

  // Render initial (Signature Cakes)
  renderMenu('signature');
}

// Attach listeners to newly created box buttons
function attachBoxActions() {
  const buttons = document.querySelectorAll('.add-to-box-btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const itemName = btn.getAttribute('data-name');
      if (window.showCakeToast) {
        window.showCakeToast('Item Added!', `Added ${itemName} to your dessert tasting box.`);
      }
    });
  });
}

/* ==========================================================================
   6. TESTIMONIAL SLIDER
   ========================================================================== */
function initTestimonialSlider() {
  const track = document.getElementById('testimonialsTrack');
  const slides = document.querySelectorAll('.testimonials-track .slide');
  const prevBtn = document.getElementById('prevTestimonial');
  const nextBtn = document.getElementById('nextTestimonial');

  if (!track || slides.length === 0) return;

  let currentIndex = 0;
  const slideCount = slides.length;

  const goToSlide = (index) => {
    if (index < 0) {
      currentIndex = slideCount - 1;
    } else if (index >= slideCount) {
      currentIndex = 0;
    } else {
      currentIndex = index;
    }

    track.style.transform = `translateX(-${currentIndex * 100}%)`;
  };

  if (prevBtn) {
    prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));
  }

  // Auto scroll
  let timer = setInterval(() => goToSlide(currentIndex + 1), 6000);

  const resetTimer = () => {
    clearInterval(timer);
    timer = setInterval(() => goToSlide(currentIndex + 1), 6000);
  };

  [prevBtn, nextBtn].forEach(b => {
    if (b) b.addEventListener('click', resetTimer);
  });
}

/* ==========================================================================
   7. CONSULTATION FORM & TOAST MANAGER
   ========================================================================== */
function initConsultationForm() {
  const form = document.getElementById('consultForm');
  const toast = document.getElementById('successToast');

  const showToast = (title, msg) => {
    if (!toast) return;

    toast.querySelector('h5').innerText = title;
    toast.querySelector('p').innerText = msg;
    
    toast.classList.add('active');

    setTimeout(() => {
      toast.classList.remove('active');
    }, 4000);
  };

  // Expose toast function globally for other builder scripts
  window.showCakeToast = showToast;

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('clientName').value.trim();
      const email = document.getElementById('clientEmail').value.trim();
      const date = document.getElementById('eventDate').value.trim();

      if (!name || !email) {
        alert('Please fill out required contact fields.');
        return;
      }

      form.reset();
      showToast(
        'Consultation Requested!',
        `Thank you, ${name}. Our head pastry chef will contact you shortly.`
      );
    });
  }
}

/* ==========================================================================
   8. SCROLL ANIMATIONS (Intersection Observer)
   ========================================================================== */
function initScrollAnimations() {
  const animateItems = document.querySelectorAll(
    '.story-img-collage, .story-content, .builder-preview-box, .builder-controls, .menu-card, .process-step, .consult-visual, .consult-form'
  );

  const observerOptions = {
    root: null,
    threshold: 0.1,
    rootMargin: '0px'
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0) scale(1)';
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  animateItems.forEach((item, index) => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(30px)';
    item.style.transition = 'opacity 0.8s cubic-bezier(0.25, 1, 0.5, 1), transform 0.8s cubic-bezier(0.25, 1, 0.5, 1)';
    
    // Add simple grid staggering
    if (item.classList.contains('menu-card') || item.classList.contains('process-step')) {
      const colIndex = index % 3;
      item.style.transitionDelay = `${colIndex * 0.15}s`;
    }

    observer.observe(item);
  });
}
