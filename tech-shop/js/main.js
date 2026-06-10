/**
 * VORTEX GEAR - COSMIC TECH INTERACTIVE ENGINE
 * Custom JavaScript managing e-commerce cart listings and the 3D-style customizer preview.
 */

document.addEventListener('DOMContentLoaded', () => {
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  initHeader();
  initMobileMenu();
  initScrollHighlight();
  initCartDrawer();
  initCaseCustomizer();
  initCatalogGrid();
  initFaqAccordion();
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
   4. E-COMMERCE CART SYSTEM
   ========================================================================== */
let cart = [];

function initCartDrawer() {
  const cartBtn = document.getElementById('cartIconBtn');
  const cartOverlay = document.getElementById('cartOverlay');
  const closeBtn = document.getElementById('cartCloseBtn');
  const itemsWrapper = document.getElementById('cartItemsWrapper');
  const countBadge = document.getElementById('cartBadgeCount');
  
  const subtotalPrice = document.getElementById('cartSubtotal');
  const deliveryPrice = document.getElementById('cartDelivery');
  const totalPrice = document.getElementById('cartTotal');
  const checkoutBtn = document.getElementById('checkoutBtn');

  if (!cartOverlay || !itemsWrapper) return;

  const openCart = () => cartOverlay.classList.add('active');
  const closeCart = () => cartOverlay.classList.remove('active');

  cartBtn.addEventListener('click', openCart);
  closeBtn.addEventListener('click', closeCart);
  cartOverlay.addEventListener('click', (e) => {
    if (e.target === cartOverlay) closeCart();
  });

  const renderCart = () => {
    itemsWrapper.innerHTML = '';
    
    if (cart.length === 0) {
      itemsWrapper.innerHTML = `<p class="cart-empty-msg">Your shopping bag is empty.</p>`;
      countBadge.style.display = 'none';
      subtotalPrice.innerText = '₹0';
      deliveryPrice.innerText = '₹0';
      totalPrice.innerText = '₹0';
      return;
    }

    let totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
    countBadge.innerText = totalQty;
    countBadge.style.display = 'flex';

    let subtotal = 0;

    cart.forEach(item => {
      const itemSubtotal = item.price * item.qty;
      subtotal += itemSubtotal;

      const itemDiv = document.createElement('div');
      itemDiv.className = 'cart-item';
      itemDiv.innerHTML = `
        <div class="cart-item-img">
          <img src="${item.img}" alt="${item.name}">
        </div>
        <div class="cart-item-info">
          <h4>${item.name}</h4>
          <p>${item.desc || ''}</p>
          <div class="cart-item-quantity">
            <button class="qty-btn dec-qty-btn" data-id="${item.id}">-</button>
            <span class="qty-val">${item.qty}</span>
            <button class="qty-btn inc-qty-btn" data-id="${item.id}">+</button>
          </div>
          <span class="remove-item-link" data-id="${item.id}">Remove</span>
        </div>
        <div class="cart-item-price">₹${itemSubtotal}</div>
      `;
      itemsWrapper.appendChild(itemDiv);
    });

    const deliveryFee = subtotal > 999 ? 0 : 99;
    const total = subtotal + deliveryFee;

    subtotalPrice.innerText = `₹${subtotal}`;
    deliveryPrice.innerText = deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`;
    totalPrice.innerText = `₹${total}`;

    attachCartActions();
  };

  const attachCartActions = () => {
    // Increment
    document.querySelectorAll('.inc-qty-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const item = cart.find(i => i.id === id);
        if (item) {
          item.qty++;
          renderCart();
        }
      });
    });

    // Decrement
    document.querySelectorAll('.dec-qty-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const item = cart.find(i => i.id === id);
        if (item) {
          item.qty--;
          if (item.qty <= 0) {
            cart = cart.filter(i => i.id !== id);
          }
          renderCart();
        }
      });
    });

    // Remove
    document.querySelectorAll('.remove-item-link').forEach(link => {
      link.addEventListener('click', () => {
        const id = link.getAttribute('data-id');
        cart = cart.filter(i => i.id !== id);
        renderCart();
      });
    });
  };

  window.addItemToCart = (item) => {
    const existingItem = cart.find(i => i.id === item.id);
    if (existingItem) {
      existingItem.qty += item.qty || 1;
    } else {
      cart.push({
        id: item.id,
        name: item.name,
        price: item.price,
        qty: item.qty || 1,
        img: item.img,
        desc: item.desc || ''
      });
    }

    renderCart();
    openCart();
    
    if (window.showTechToast) {
      window.showTechToast('Item Added', `${item.name} added to bag.`);
    }
  };

  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      alert('Thank you! Your order has been placed successfully. We will call you soon.');
      cart = [];
      renderCart();
      closeCart();
    });
  }

  renderCart();
}

/* ==========================================================================
   5. COSMIC CASE CONFIGURATOR
   ========================================================================== */
function initCaseCustomizer() {
  const modelOptions = document.querySelectorAll('.model-step .option-badge');
  const typeOptions = document.querySelectorAll('.type-step .option-badge');
  const colorSwatches = document.querySelectorAll('.color-step .color-swatch');
  
  const phoneWireframe = document.getElementById('phoneWireframe');
  const caseWrapper = document.getElementById('phoneCaseWrapper');
  const priceDisplay = document.getElementById('customizerPrice');
  const addToCartBtn = document.getElementById('customizerAddToCartBtn');

  if (!caseWrapper || !priceDisplay) return;

  // Active configurations
  let config = {
    model: 'iPhone 15 Pro',
    type: 'carbon', // carbon, clear, leather
    colorName: 'Cobalt Blue',
    colorHex: '#0071E3'
  };

  const PRICING = {
    base: {
      'iPhone 15 Pro': 1499,
      'Galaxy S24 Ultra': 1299
    },
    types: {
      carbon: 699,
      clear: 399,
      leather: 899
    }
  };

  const updateCustomizer = () => {
    // 1. Sync custom colors
    caseWrapper.style.setProperty('--bumper-color', config.colorHex);
    
    // 2. Sync textures
    caseWrapper.className = 'phone-case-wrapper';
    if (config.type === 'carbon') {
      caseWrapper.classList.add('carbon-texture');
      caseWrapper.style.setProperty('--case-bg', 'rgba(0,0,0,0.85)');
    } else if (config.type === 'clear') {
      caseWrapper.classList.add('clear-texture');
      caseWrapper.style.setProperty('--case-bg', 'rgba(0, 240, 255, 0.05)');
    } else {
      // Premium leather brown
      caseWrapper.style.setProperty('--case-bg', '#8E6F54');
    }

    // 3. Recalculate price
    const base = PRICING.base[config.model];
    const type = PRICING.types[config.type];
    const total = base + type;
    
    animatePrice(total);
  };

  const animatePrice = (targetPrice) => {
    const startPrice = parseInt(priceDisplay.innerText.replace('₹', '')) || 0;
    const duration = 400; // ms
    const startTime = performance.now();

    const updateCount = (timestamp) => {
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const currentVal = Math.floor(progress * (targetPrice - startPrice) + startPrice);
      priceDisplay.innerText = `₹${currentVal}`;

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      } else {
        priceDisplay.innerText = `₹${targetPrice}`;
      }
    };

    requestAnimationFrame(updateCount);
  };

  // Model selection
  modelOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      modelOptions.forEach(o => o.classList.remove('active'));
      opt.classList.add('active');
      config.model = opt.getAttribute('data-value');
      
      // Animate wireframe bounds
      if (config.model === 'Galaxy S24 Ultra') {
        phoneWireframe.style.transform = 'scale(1.05)';
        phoneWireframe.style.borderRadius = '12px';
        caseWrapper.style.borderRadius = '14px';
      } else {
        phoneWireframe.style.transform = 'scale(1)';
        phoneWireframe.style.borderRadius = '36px';
        caseWrapper.style.borderRadius = '40px';
      }
      
      updateCustomizer();
    });
  });

  // Type selection
  typeOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      typeOptions.forEach(o => o.classList.remove('active'));
      opt.classList.add('active');
      config.type = opt.getAttribute('data-value');
      updateCustomizer();
    });
  });

  // Color Swatches
  colorSwatches.forEach(swatch => {
    swatch.addEventListener('click', () => {
      colorSwatches.forEach(s => s.classList.remove('active'));
      swatch.classList.add('active');
      
      config.colorName = swatch.getAttribute('data-name');
      config.colorHex = swatch.getAttribute('data-hex');
      updateCustomizer();
    });
  });

  // Add Custom configuration to Cart
  if (addToCartBtn) {
    addToCartBtn.addEventListener('click', () => {
      const priceVal = PRICING.base[config.model] + PRICING.types[config.type];
      const customItem = {
        id: `custom_${config.model.toLowerCase().replace(/\s/g, '')}_${config.type}_${config.colorName.toLowerCase()}`,
        name: `Vortex Custom Case`,
        desc: `${config.model} // ${config.type.toUpperCase()} // ${config.colorName}`,
        price: priceVal,
        qty: 1,
        img: 'assets/images/phone_hero.png'
      };

      if (window.addItemToCart) {
        window.addItemToCart(customItem);
      }
    });
  }

  updateCustomizer();
}

/* ==========================================================================
   6. CATALOG GRID DATA
   ========================================================================== */
const PRODUCTS_DATABASE = [
  { id: 'p1', name: 'Transparent Magnetic Case', category: 'cases', price: 999, img: 'assets/images/accessory_case.png', compat: 'iPhone 15/14 Pro' },
  { id: 'p2', name: 'Carbon Fiber Case', category: 'cases', price: 1499, img: 'assets/images/phone_hero.png', compat: 'Galaxy S24 / iPhone 15' },
  { id: 'p3', name: '140W 4-Port Fast Charger', category: 'chargers', price: 2499, img: 'assets/images/accessory_charger.png', compat: 'Fast charger for all phones' },
  { id: 'p4', name: 'Magnetic Car Phone Holder', category: 'chargers', price: 1299, img: 'assets/images/accessory_charger.png', compat: 'Fits all magnetic cases' },
  { id: 'p5', name: 'Strong Tempered Glass (2 Pack)', category: 'cases', price: 499, img: 'assets/images/accessory_case.png', compat: 'iPhone 15/15 Pro' },
  { id: 'p6', name: 'Type-C Fast Charging Cable', category: 'chargers', price: 299, img: 'assets/images/accessory_charger.png', compat: '240W fast charging' }
];

function initCatalogGrid() {
  const tabButtons = document.querySelectorAll('.catalog-tabs .tab-btn');
  const catalogGrid = document.getElementById('catalogGrid');

  if (!catalogGrid) return;

  const renderGrid = (categoryFilter) => {
    catalogGrid.innerHTML = '';
    
    const filteredProducts = PRODUCTS_DATABASE.filter(prod => {
      if (categoryFilter === 'all') return true;
      return prod.category === categoryFilter;
    });

    filteredProducts.forEach((item, index) => {
      const card = document.createElement('div');
      card.className = 'catalog-card';
      card.style.animationDelay = `${index * 0.1}s`;

      card.innerHTML = `
        <div class="card-img-box">
          <img src="${item.img}" alt="${item.name}" class="card-img">
          <div class="card-tag-compat">${item.compat}</div>
        </div>
        <div class="card-meta">Product ID: ${item.id.toUpperCase()}</div>
        <h4 class="card-title">${item.name}</h4>
        
        <div class="card-price-row">
          <div class="card-price">₹${item.price}</div>
          <button class="btn btn-secondary buy-now-btn" data-id="${item.id}">
            Add to Bag
          </button>
        </div>
      `;

      catalogGrid.appendChild(card);
    });

    lucide.createIcons();
    attachCatalogClickEvents();
  };

  const attachCatalogClickEvents = () => {
    document.querySelectorAll('.buy-now-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const prod = PRODUCTS_DATABASE.find(p => p.id === id);
        if (prod && window.addItemToCart) {
          window.addItemToCart({
            id: prod.id,
            name: prod.name,
            price: prod.price,
            qty: 1,
            img: prod.img,
            desc: prod.compat
          });
        }
      });
    });
  };

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.getAttribute('data-category');
      renderGrid(cat);
    });
  });

  renderGrid('all');
}

/* ==========================================================================
   7. FAQ ACCORDIONS
   ========================================================================== */
function initFaqAccordion() {
  const faqQuestions = document.querySelectorAll('.faq-question');

  faqQuestions.forEach(q => {
    q.addEventListener('click', () => {
      const card = q.parentElement;
      const answer = card.querySelector('.faq-answer');

      const isActive = card.classList.contains('active');

      document.querySelectorAll('.faq-card').forEach(c => {
        c.classList.remove('active');
        c.querySelector('.faq-answer').style.maxHeight = '0';
      });

      if (!isActive) {
        card.classList.add('active');
        answer.style.maxHeight = `${answer.scrollHeight}px`;
      }
    });
  });

  // Success Toast Trigger
  const toast = document.getElementById('successToast');
  window.showTechToast = (title, msg) => {
    if (!toast) return;

    toast.querySelector('h5').innerText = title;
    toast.querySelector('p').innerText = msg;
    
    toast.classList.add('active');

    setTimeout(() => {
      toast.classList.remove('active');
    }, 4000);
  };

  // Newsletter Submit
  const newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      newsletterForm.reset();
      window.showTechToast('Newsletter Joined', 'Email registered to Vortex digest list.');
    });
  }
}

/* ==========================================================================
   8. SCROLL ANIMATIONS
   ========================================================================== */
function initScrollAnimations() {
  const elements = document.querySelectorAll(
    '.hero-content, .hero-visual, .feature-block, .customizer-preview, .customizer-controls, .catalog-card, .faq-card'
  );

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  elements.forEach((elem, index) => {
    elem.style.opacity = '0';
    elem.style.transform = 'translateY(25px)';
    elem.style.transition = 'opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';

    if (elem.classList.contains('feature-block') || elem.classList.contains('catalog-card')) {
      const col = index % 3;
      elem.style.transitionDelay = `${col * 0.12}s`;
    }

    observer.observe(elem);
  });
}
