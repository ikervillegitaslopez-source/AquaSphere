/**
 * AquaSphere™ Dropshipping Shopify Landing Page Script
 * Fully interactive e-commerce interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  // Bundle Pricing Definitions
  const BUNDLE_DATA = {
    1: { qty: 1, price: 24.95, comparePrice: 49.99, title: '1x AquaSphere™' },
    2: { qty: 2, price: 39.90, comparePrice: 99.98, title: '2x AquaSphere™' },
    3: { qty: 3, price: 49.95, comparePrice: 149.97, title: '3x AquaSphere™' }
  };

  // State
  let state = {
    selectedBundle: BUNDLE_DATA[1],
    selectedColor: 'Pastel Blue',
    quantity: 1,
    cart: [
      {
        id: 'aquasphere-blue',
        title: 'AquaSphere™ Pet Travel Flask',
        variant: '1x AquaSphere™ • Pastel Blue',
        price: 24.95,
        qty: 1,
        color: 'Pastel Blue',
        bundleQty: 1,
        image: 'images/blue-closed.jpg'
      }
    ],
    upsellAdded: false
  };

  /* ------------------------------------------------
     1. COUNTDOWN TIMER
  ------------------------------------------------- */
  function startCountdown() {
    let duration = 2 * 3600 + 44 * 60 + 18; // 2h 44m 18s
    const timerEls = document.querySelectorAll('.countdown-timer');

    setInterval(() => {
      if (duration <= 0) duration = 3 * 3600; // loop
      duration--;

      const hours = Math.floor(duration / 3600);
      const minutes = Math.floor((duration % 3600) / 60);
      const seconds = duration % 60;

      const formatted = 
        String(hours).padStart(2, '0') + 'h : ' +
        String(minutes).padStart(2, '0') + 'm : ' +
        String(seconds).padStart(2, '0') + 's';

      timerEls.forEach(el => el.textContent = formatted);
    }, 1000);
  }
  startCountdown();

  /* ------------------------------------------------
     2. GALLERY LOGIC
  ------------------------------------------------- */
  const mainImg = document.getElementById('mainProductImg');
  const thumbs = document.querySelectorAll('.thumb-item');
  const stickyThumb = document.querySelector('.sticky-thumb');

  thumbs.forEach(thumb => {
    thumb.addEventListener('click', () => {
      const newSrc = thumb.getAttribute('data-img');
      if (newSrc && newSrc.includes('pink')) {
        setColor('Blush Pink', newSrc);
      } else if (newSrc && newSrc.includes('blue')) {
        setColor('Pastel Blue', newSrc);
      } else {
        thumbs.forEach(t => t.classList.remove('active'));
        thumb.classList.add('active');
        if (mainImg && newSrc) {
          mainImg.style.opacity = '0';
          setTimeout(() => {
            mainImg.src = newSrc;
            mainImg.style.opacity = '1';
          }, 150);
        }
      }
    });
  });

  /* ------------------------------------------------
     3. BUNDLE & QUANTITY AUTO-SYNC (MAX 3 UNITS PER PRODUCT)
  ------------------------------------------------- */
  const MAX_QUANTITY = 3;
  const bundleCards = document.querySelectorAll('.bundle-card');
  const currentPriceEl = document.getElementById('currentPrice');
  const comparePriceEl = document.getElementById('comparePrice');
  const addCartBtnText = document.getElementById('btnPriceText');
  const stickyPriceEl = document.getElementById('stickyPrice');
  const qtyMinus = document.getElementById('qtyMinus');
  const qtyPlus = document.getElementById('qtyPlus');
  const qtyInput = document.getElementById('qtyValue');

  function updateQtyButtons() {
    if (qtyMinus) {
      const isMin = state.quantity <= 1;
      qtyMinus.disabled = isMin;
      qtyMinus.style.opacity = isMin ? '0.4' : '1';
      qtyMinus.style.cursor = isMin ? 'not-allowed' : 'pointer';
    }
    if (qtyPlus) {
      const isMax = state.quantity >= MAX_QUANTITY;
      qtyPlus.disabled = isMax;
      qtyPlus.style.opacity = isMax ? '0.4' : '1';
      qtyPlus.style.cursor = isMax ? 'not-allowed' : 'pointer';
    }
  }

  function updatePriceDisplay() {
    const bundle = BUNDLE_DATA[state.quantity] || BUNDLE_DATA[1];
    const total = bundle.price.toFixed(2);
    const compareTotal = bundle.comparePrice.toFixed(2);

    if (currentPriceEl) currentPriceEl.textContent = `$${total}`;
    if (comparePriceEl) comparePriceEl.textContent = `$${compareTotal}`;
    if (addCartBtnText) addCartBtnText.textContent = `ADD TO CART • $${total}`;
    if (stickyPriceEl) stickyPriceEl.textContent = `$${total}`;
  }

  function selectBundle(qty) {
    const validQty = Math.max(1, Math.min(MAX_QUANTITY, parseInt(qty) || 1));
    state.quantity = validQty;
    state.selectedBundle = BUNDLE_DATA[validQty] || BUNDLE_DATA[1];

    bundleCards.forEach(card => {
      const cardQty = parseInt(card.getAttribute('data-qty'));
      if (cardQty === validQty) {
        card.classList.add('selected');
      } else {
        card.classList.remove('selected');
      }
    });

    if (qtyInput) {
      qtyInput.textContent = validQty;
    }

    updateQtyButtons();
    updatePriceDisplay();
  }

  bundleCards.forEach(card => {
    card.addEventListener('click', () => {
      const qty = parseInt(card.getAttribute('data-qty'));
      selectBundle(qty);
    });
  });

  if (qtyMinus && qtyPlus && qtyInput) {
    updateQtyButtons();

    qtyMinus.addEventListener('click', () => {
      if (state.quantity > 1) {
        selectBundle(state.quantity - 1);
      }
    });

    qtyPlus.addEventListener('click', () => {
      if (state.quantity < MAX_QUANTITY) {
        selectBundle(state.quantity + 1);
      } else {
        showToastNotification(`⚠️ Maximum order limit reached (${MAX_QUANTITY} units per product)`);
      }
    });
  }

  /* ------------------------------------------------
     4. COLOR SWATCHES (BLUE & PINK INTERACTION)
  ------------------------------------------------- */
  const swatches = document.querySelectorAll('.swatch-btn');
  const colorNameEl = document.getElementById('selectedColorName');

  function setColor(color, imgSrc) {
    state.selectedColor = color;

    if (colorNameEl) {
      colorNameEl.textContent = color;
      if (color === 'Blush Pink') {
        colorNameEl.style.color = '#db2777'; // Vibrant elegant pink
      } else {
        colorNameEl.style.color = '#0284c7'; // Vibrant pastel blue
      }
    }

    swatches.forEach(s => {
      if (s.getAttribute('data-color') === color) {
        s.classList.add('active');
      } else {
        s.classList.remove('active');
      }
    });

    if (mainImg && imgSrc) {
      mainImg.style.opacity = '0';
      setTimeout(() => {
        mainImg.src = imgSrc;
        mainImg.style.opacity = '1';
      }, 150);
    }

    if (imgSrc) {
      thumbs.forEach(t => {
        if (t.getAttribute('data-img') === imgSrc) {
          t.classList.add('active');
        } else {
          t.classList.remove('active');
        }
      });
    }

    if (stickyThumb && imgSrc) {
      stickyThumb.src = imgSrc;
    }
  }

  swatches.forEach(swatch => {
    swatch.addEventListener('click', () => {
      const color = swatch.getAttribute('data-color');
      const imgSrc = swatch.getAttribute('data-img');
      setColor(color, imgSrc);
    });
  });



  /* ------------------------------------------------
     6. CART DRAWER
  ------------------------------------------------- */
  const cartDrawer = document.getElementById('cartDrawer');
  const drawerBackdrop = document.getElementById('drawerBackdrop');
  const closeDrawerBtn = document.getElementById('closeDrawerBtn');
  const cartHeaderBtn = document.getElementById('cartHeaderBtn');
  const btnAddToCart = document.getElementById('btnAddToCart');
  const stickyAddToCart = document.getElementById('stickyAddToCart');
  const btnBuyNow = document.getElementById('btnBuyNow');
  const cartItemsList = document.getElementById('cartItemsList');
  const cartSubtotal = document.getElementById('cartSubtotal');
  const cartBadge = document.querySelector('.cart-badge');

  function openCart() {
    if (cartDrawer && drawerBackdrop) {
      cartDrawer.classList.add('active');
      drawerBackdrop.classList.add('active');
      document.body.style.overflow = 'hidden';
      renderCart();
    }
  }

  function closeCart() {
    if (cartDrawer && drawerBackdrop) {
      cartDrawer.classList.remove('active');
      drawerBackdrop.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  if (cartHeaderBtn) cartHeaderBtn.addEventListener('click', openCart);
  if (closeDrawerBtn) closeDrawerBtn.addEventListener('click', closeCart);
  if (drawerBackdrop) drawerBackdrop.addEventListener('click', closeCart);

  function addItemToCart() {
    const qty = state.quantity;
    const bundle = BUNDLE_DATA[qty] || BUNDLE_DATA[1];
    const color = state.selectedColor || 'Pastel Blue';
    const itemTitle = 'AquaSphere™ Pet Travel Flask';
    const itemImg = (color === 'Blush Pink') ? 'images/pink-closed.jpg' : 'images/blue-closed.jpg';

    const existingIndex = state.cart.findIndex(item => item.color === color);

    if (existingIndex > -1) {
      const currentQty = state.cart[existingIndex].qty;
      const targetQty = Math.min(MAX_QUANTITY, currentQty + qty);

      if (currentQty >= MAX_QUANTITY) {
        showToastNotification(`⚠️ Maximum limit reached (${MAX_QUANTITY} units for ${color})`);
      } else {
        const bundleInfo = BUNDLE_DATA[targetQty] || BUNDLE_DATA[1];
        state.cart[existingIndex].qty = targetQty;
        state.cart[existingIndex].bundleQty = targetQty;
        state.cart[existingIndex].price = bundleInfo.price;
        state.cart[existingIndex].variant = `${bundleInfo.title} • ${color}`;
        state.cart[existingIndex].image = itemImg;
      }
    } else {
      state.cart.push({
        id: 'prod-' + Date.now(),
        title: itemTitle,
        variant: `${bundle.title} • ${color}`,
        price: bundle.price,
        qty: qty,
        color: color,
        bundleQty: qty,
        image: itemImg
      });
    }

    if (window.clarity) {
      window.clarity("event", "add_to_cart");
    }

    renderCart();
    openCart();
  }

  if (btnAddToCart) btnAddToCart.addEventListener('click', addItemToCart);
  if (stickyAddToCart) stickyAddToCart.addEventListener('click', addItemToCart);

  if (btnBuyNow) {
    btnBuyNow.addEventListener('click', (e) => {
      e.preventDefault();
      handleCheckout();
    });
  }

  function renderCart() {
    if (!cartItemsList) return;
    cartItemsList.innerHTML = '';

    let total = 0;
    let count = 0;

    state.cart.forEach((item, index) => {
      total += item.price;
      count += item.qty;

      const isMax = item.qty >= MAX_QUANTITY;
      const isMin = item.qty <= 1;

      const itemDiv = document.createElement('div');
      itemDiv.className = 'cart-item';
      itemDiv.innerHTML = `
        <img src="${item.image}" alt="${item.title}" class="cart-item-img">
        <div class="cart-item-details">
          <div class="cart-item-title">${item.title}</div>
          <div class="cart-item-variant">${item.variant}</div>
          <div class="cart-item-row">
            <div class="qty-control" style="height: 34px;">
              <button class="qty-btn" style="width: 28px; font-size: 1rem; ${isMin ? 'opacity: 0.4; cursor: not-allowed;' : ''}" onclick="window.updateCartItemQty(${index}, -1)">-</button>
              <span class="qty-val" style="min-width: 28px; width: auto; padding: 0 4px; font-size: 0.85rem;">${item.qty}</span>
              <button class="qty-btn" style="width: 28px; font-size: 1rem; ${isMax ? 'opacity: 0.4; cursor: not-allowed;' : ''}" ${isMax ? 'disabled' : ''} onclick="window.updateCartItemQty(${index}, 1)">+</button>
            </div>
            <div class="cart-item-price">$${item.price.toFixed(2)}</div>
          </div>
        </div>
        <button onclick="window.removeCartItem(${index})" style="color: #94a3b8; font-size: 1.1rem; align-self: flex-start; padding: 4px;" title="Remove">&times;</button>
      `;
      cartItemsList.appendChild(itemDiv);
    });

    if (state.cart.length === 0) {
      cartItemsList.innerHTML = `
        <div style="text-align: center; padding: 40px 20px; color: #94a3b8;">
          <p style="font-size: 2.5rem; margin-bottom: 10px;">🛒</p>
          <p style="font-weight: 700; color: #0f172a;">Your cart is empty</p>
        </div>
      `;
    }

    if (cartSubtotal) cartSubtotal.textContent = `$${total.toFixed(2)}`;
    if (cartBadge) {
      cartBadge.textContent = count >= 100 ? '+99' : count;
    }
  }

  window.updateCartItemQty = function(index, delta) {
    if (state.cart[index]) {
      const currentItem = state.cart[index];
      const targetQty = currentItem.qty + delta;

      if (targetQty > MAX_QUANTITY) {
        showToastNotification(`⚠️ Maximum limit reached (${MAX_QUANTITY} units per product)`);
        return;
      }

      if (targetQty <= 0) {
        state.cart.splice(index, 1);
      } else {
        const bundleInfo = BUNDLE_DATA[targetQty] || BUNDLE_DATA[1];
        currentItem.qty = targetQty;
        currentItem.bundleQty = targetQty;
        currentItem.price = bundleInfo.price;
        currentItem.variant = `${bundleInfo.title} • ${currentItem.color}`;
      }
      renderCart();
    }
  };

  window.removeCartItem = function(index) {
    state.cart.splice(index, 1);
    renderCart();
  };

  // Initial cart render on page load
  renderCart();

  /* ------------------------------------------------
     7. SECURE CHECKOUT HANDLER (STRIPE PAYMENT LINKS)
  ------------------------------------------------- */
  const STRIPE_LINKS = {
    'Pastel Blue': {
      1: 'https://buy.stripe.com/cNi00c6s393ugjs6krew809',
      2: 'https://buy.stripe.com/cNi14gg2D2F61oy4cjew80a',
      3: 'https://buy.stripe.com/bJe00c4jV2F64AK8szew80b'
    },
    'Blush Pink': {
      1: 'https://buy.stripe.com/5kQ9AM6s31B25EO9wDew80e',
      2: 'https://buy.stripe.com/aFacMYaIja7y0ku6krew80f',
      3: 'https://buy.stripe.com/5kQ6oA3fRfrS7MW5gnew80g'
    }
  };

  function getStripeLinkForItem(item) {
    if (!item) return STRIPE_LINKS['Pastel Blue'][1] + '?locale=en';

    let color = item.color || 'Pastel Blue';
    if (!item.color && item.variant) {
      if (item.variant.includes('Blush Pink')) color = 'Blush Pink';
      else if (item.variant.includes('Pastel Blue')) color = 'Pastel Blue';
    }

    let bundleQty = item.bundleQty || item.qty || 1;
    if (!item.bundleQty && item.variant) {
      if (item.variant.includes('3x')) bundleQty = 3;
      else if (item.variant.includes('2x')) bundleQty = 2;
      else if (item.variant.includes('1x')) bundleQty = 1;
    }
    if (bundleQty > 3) bundleQty = 3;
    if (bundleQty < 1) bundleQty = 1;

    let url = (STRIPE_LINKS[color] && STRIPE_LINKS[color][bundleQty])
      || (STRIPE_LINKS['Pastel Blue'] && STRIPE_LINKS['Pastel Blue'][bundleQty])
      || (STRIPE_LINKS[color] && STRIPE_LINKS[color][1])
      || STRIPE_LINKS['Pastel Blue'][1]
      || 'https://buy.stripe.com/cNi00c6s393ugjs6krew809';

    if (!url.includes('locale=')) {
      url += (url.includes('?') ? '&' : '?') + 'locale=en';
    }

    return url;
  }

  const checkoutBtn = document.getElementById('btnDrawerCheckout');

  function handleCheckout() {
    if (window.clarity) {
      window.clarity("event", "checkout_click");
    }

    if (window.location.hostname.includes('myshopify.com')) {
      window.location.href = '/checkout';
      return;
    }

    if (state.cart && state.cart.length > 0) {
      const firstItem = state.cart[0];
      const remainingItems = state.cart.slice(1);

      if (remainingItems.length > 0) {
        try {
          localStorage.setItem('aquasphere_pending_queue', JSON.stringify(remainingItems));
        } catch (e) {}
      } else {
        try {
          localStorage.removeItem('aquasphere_pending_queue');
        } catch (e) {}
      }

      window.location.href = getStripeLinkForItem(firstItem);
      return;
    }

    const fallbackItem = {
      color: state.selectedColor || 'Pastel Blue',
      bundleQty: (state.selectedBundle && state.selectedBundle.qty) || state.quantity || 1,
      qty: state.quantity || 1
    };
    window.location.href = getStripeLinkForItem(fallbackItem);
  }

  // Seamless sequential checkout queue handler
  (function processPendingQueue() {
    try {
      const queueRaw = localStorage.getItem('aquasphere_pending_queue');
      if (queueRaw) {
        const queue = JSON.parse(queueRaw);
        if (Array.isArray(queue) && queue.length > 0) {
          const nextItem = queue.shift();
          if (queue.length > 0) {
            localStorage.setItem('aquasphere_pending_queue', JSON.stringify(queue));
          } else {
            localStorage.removeItem('aquasphere_pending_queue');
          }
          const nextUrl = getStripeLinkForItem(nextItem);
          if (nextUrl) {
            window.location.href = nextUrl;
          }
        } else {
          localStorage.removeItem('aquasphere_pending_queue');
        }
      }
    } catch (e) {
      try { localStorage.removeItem('aquasphere_pending_queue'); } catch (_) {}
    }
  })();

  if (checkoutBtn) checkoutBtn.addEventListener('click', handleCheckout);

  /* ------------------------------------------------
     9. STICKY BOTTOM BAR OBSERVER
  ------------------------------------------------- */
  const stickyBar = document.getElementById('stickyBar');
  const heroBtn = document.getElementById('btnAddToCart');

  if (stickyBar && heroBtn) {
    window.addEventListener('scroll', () => {
      const rect = heroBtn.getBoundingClientRect();
      if (rect.bottom < 0) {
        stickyBar.classList.add('visible');
      } else {
        stickyBar.classList.remove('visible');
      }
    });
  }

  /* ------------------------------------------------
     10. REVIEWS DYNAMIC LOADER & LIKE/DISLIKE (248 REVIEWS)
  ------------------------------------------------- */
  const reviewsGrid = document.getElementById('reviewsGrid');
  const btnLoadMore = document.getElementById('btnLoadMoreReviews');
  const currentCountEl = document.getElementById('currentReviewsCount');
  const progressFill = document.getElementById('reviewsProgressFill');

  const allReviews = window.AQUASPHERE_REVIEWS_DATA || [];
  const TOTAL_REVIEWS = allReviews.length || 248;
  let currentlyShown = 10;

  function getAvatarUrl(avatarPath) {
    if (!avatarPath) return 'images/avatars/dog-corgi.jpg';
    if (typeof window !== 'undefined' && window.AQUASPHERE_ASSET_BASE) {
      const filename = avatarPath.split('/').pop();
      return window.AQUASPHERE_ASSET_BASE + filename;
    }
    return avatarPath;
  }

  function createReviewCardHTML(r) {
    const avatarSrc = getAvatarUrl(r.avatar);
    return `
      <div class="review-card">
        <div class="review-header">
          <div class="reviewer-meta">
            <img src="${avatarSrc}" alt="${r.name}" class="reviewer-avatar-img" loading="lazy" onerror="this.onerror=null; this.src='images/avatars/dog-corgi.jpg';">
            <div>
              <div class="reviewer-name">${r.name} ${r.countryFlag}</div>
              <div class="stars-row" style="font-size: 0.9rem;">${r.starsString}</div>
            </div>
          </div>
        </div>
        <div class="review-title">${r.title}</div>
        <div class="review-body">
          "${r.body}"
        </div>
        <div class="review-footer">
          <span class="helpful-label">Was this review helpful?</span>
          <div class="helpful-actions">
            <button class="vote-btn like-btn" aria-label="Helpful review">
              <span class="vote-icon">👍</span> Like
            </button>
            <button class="vote-btn dislike-btn" aria-label="Not helpful review">
              <span class="vote-icon">👎</span> Dislike
            </button>
          </div>
        </div>
      </div>
    `;
  }

  function bindVotingToCard(card) {
    const likeBtn = card.querySelector('.like-btn');
    const dislikeBtn = card.querySelector('.dislike-btn');
    if (!likeBtn || !dislikeBtn) return;

    likeBtn.addEventListener('click', () => {
      if (likeBtn.classList.contains('voted')) {
        likeBtn.classList.remove('voted');
      } else {
        dislikeBtn.classList.remove('voted');
        likeBtn.classList.add('voted');
      }
    });

    dislikeBtn.addEventListener('click', () => {
      if (dislikeBtn.classList.contains('voted')) {
        dislikeBtn.classList.remove('voted');
      } else {
        likeBtn.classList.remove('voted');
        dislikeBtn.classList.add('voted');
      }
    });
  }

  // Bind voting to all initially rendered cards
  if (reviewsGrid) {
    reviewsGrid.querySelectorAll('.review-card').forEach(card => bindVotingToCard(card));
  }

  function updateReviewsProgress() {
    if (currentCountEl) currentCountEl.textContent = currentlyShown;
    if (progressFill) {
      const pct = Math.min(100, Math.round((currentlyShown / TOTAL_REVIEWS) * 100));
      progressFill.style.width = `${pct}%`;
    }
    if (currentlyShown >= TOTAL_REVIEWS) {
      if (btnLoadMore) {
        btnLoadMore.textContent = 'All 248 Reviews Loaded ✓';
        btnLoadMore.disabled = true;
        btnLoadMore.style.opacity = '0.6';
        btnLoadMore.style.cursor = 'default';
      }
    }
  }

  function loadReviewsBatch(count) {
    if (!reviewsGrid || currentlyShown >= TOTAL_REVIEWS) return;
    const startIndex = currentlyShown;
    const endIndex = Math.min(TOTAL_REVIEWS, startIndex + count);

    const fragment = document.createDocumentFragment();
    for (let i = startIndex; i < endIndex; i++) {
      const reviewData = allReviews[i];
      if (!reviewData) continue;
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = createReviewCardHTML(reviewData);
      const newCard = tempDiv.firstElementChild;
      bindVotingToCard(newCard);
      fragment.appendChild(newCard);
    }
    reviewsGrid.appendChild(fragment);
    currentlyShown = endIndex;
    updateReviewsProgress();
  }

  if (btnLoadMore) {
    btnLoadMore.addEventListener('click', () => {
      loadReviewsBatch(10);
    });
  }

  /* ------------------------------------------------
     12. DYNAMIC SOCIAL PROOF (NON-REPEATING US & CANADA BUYERS)
  ------------------------------------------------- */
  const FIRST_NAMES = [
    'Emma', 'Liam', 'Olivia', 'Noah', 'Ava', 'Oliver', 'Sophia', 'Elijah',
    'Isabella', 'William', 'Charlotte', 'Henry', 'Amelia', 'Lucas', 'Mia', 'Benjamin',
    'Harper', 'Theodore', 'Evelyn', 'Mateo', 'Abigail', 'Levi', 'Emily', 'Sebastian',
    'Ella', 'Daniel', 'Elizabeth', 'Jack', 'Camila', 'Michael', 'Luna', 'Alexander',
    'Sofia', 'Owen', 'Avery', 'Asher', 'Mila', 'Samuel', 'Aria', 'Ethan',
    'Scarlett', 'Leo', 'Penelope', 'Jackson', 'Layla', 'Mason', 'Chloe', 'Ezra',
    'Victoria', 'John', 'Madison', 'Hudson', 'Eleanor', 'Luca', 'Grace', 'Aiden',
    'Nora', 'Joseph', 'Riley', 'David', 'Zoey', 'Jacob', 'Hannah', 'Logan',
    'Hazel', 'Luke', 'Lily', 'Julian', 'Ellie', 'Gabriel', 'Violet', 'Grayson',
    'Lillian', 'Wyatt', 'Zoe', 'Matthew', 'Stella', 'Maverick', 'Aurora', 'Dylan',
    'Natalie', 'Isaac', 'Emilia', 'Elias', 'Everly', 'Anthony', 'Leah', 'Thomas',
    'Aubrey', 'Caleb', 'Willow', 'Carter', 'Addison', 'Santiago', 'Lucy', 'Ezekiel',
    'Audrey', 'Charles', 'Bella', 'Josiah', 'Claire', 'Christian', 'Skylar', 'Cameron',
    'Paisley', 'Colton', 'Savannah', 'Hunter', 'Anna', 'Tyler', 'Caroline', 'Aaron',
    'Genesis', 'Eli', 'Aaliyah', 'Landon', 'Kennedy', 'Jonathan', 'Kinsley', 'Nolan',
    'Allison', 'Nicholas', 'Maya', 'Adrian', 'Sarah', 'Austin', 'Madelyn', 'Connor',
    'Adeline', 'Ruby', 'Alexa', 'Serena', 'Ariana', 'Dominic', 'Elena', 'Gemma'
  ];

  const LAST_INITIALS = ['A.', 'B.', 'C.', 'D.', 'E.', 'F.', 'G.', 'H.', 'J.', 'K.', 'L.', 'M.', 'N.', 'P.', 'R.', 'S.', 'T.', 'V.', 'W.', 'Y.', 'Z.'];

  const LOCATIONS = [
    // United States (Major Metro & Outdoor Active Cities)
    'New York, NY', 'Los Angeles, CA', 'Miami, FL', 'Austin, TX', 'Chicago, IL',
    'Seattle, WA', 'San Diego, CA', 'Denver, CO', 'Boston, MA', 'Dallas, TX',
    'Phoenix, AZ', 'San Francisco, CA', 'Atlanta, GA', 'Portland, OR', 'Nashville, TN',
    'Houston, TX', 'Las Vegas, NV', 'Orlando, FL', 'Salt Lake City, UT', 'Scottsdale, AZ',
    'Charlotte, NC', 'Raleigh, NC', 'Tampa, FL', 'Minneapolis, MN', 'Indianapolis, IN',
    'Columbus, OH', 'Kansas City, MO', 'Sacramento, CA', 'San Jose, CA', 'Boise, ID',
    'Boulder, CO', 'Fort Worth, TX', 'San Antonio, TX', 'Memphis, TN', 'Jacksonville, FL',
    'Richmond, VA', 'Charleston, SC', 'Savannah, GA', 'Honolulu, HI', 'Anchorage, AK',
    'Milwaukee, WI', 'Albuquerque, NM', 'Tucson, AZ', 'Colorado Springs, CO', 'Bend, OR',
    'Bozeman, MT', 'Asheville, NC', 'Ann Arbor, MI', 'Madison, WI', 'Spokane, WA',
    'Pittsburgh, PA', 'Philadelphia, PA', 'Cleveland, OH', 'Baltimore, MD', 'Providence, RI',
    // Canada (Major Metro & Active Outdoor Provinces)
    'Toronto, ON', 'Vancouver, BC', 'Montreal, QC', 'Calgary, AB', 'Ottawa, ON',
    'Edmonton, AB', 'Quebec City, QC', 'Winnipeg, MB', 'Victoria, BC', 'Halifax, NS',
    'Kelowna, BC', 'Banff, AB', 'Canmore, AB', 'Whistler, BC', 'London, ON',
    'Kitchener, ON', 'Hamilton, ON', 'Saskatoon, SK', 'Regina, SK', 'St. John\'s, NL',
    'Barrie, ON', 'Oshawa, ON', 'Kingston, ON', 'Guelph, ON', 'Burlington, ON',
    'Kamloops, BC', 'Nanaimo, BC', 'Sherbrooke, QC', 'Trois-Rivières, QC', 'Fredericton, NB'
  ];

  const BUNDLES = [
    { text: 'AquaSphere™' },
    { text: '2x AquaSphere™' },
    { text: '2x AquaSphere™' },
    { text: '3x AquaSphere™' }
  ];

  const TIMES = ['Just now', '2m ago', '3m ago', '5m ago', '8m ago', '12m ago', '16m ago', '21m ago'];

  // Smart non-repeating shuffle queue: guarantees NO city and NO name repeats until entire deck is depleted
  function createShuffledQueue(array) {
    let queue = [];
    return function getNext() {
      if (queue.length === 0) {
        queue = [...array];
        for (let i = queue.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [queue[i], queue[j]] = [queue[j], queue[i]];
        }
      }
      return queue.pop();
    };
  }

  const getNextFirstName = createShuffledQueue(FIRST_NAMES);
  const getNextLastInitial = createShuffledQueue(LAST_INITIALS);
  const getNextLocation = createShuffledQueue(LOCATIONS);
  const getNextBundle = createShuffledQueue(BUNDLES);
  const getNextTime = createShuffledQueue(TIMES);

  function showSocialToast() {
    // Disabled per user request (no simulated buyer notifications)
  }

  // Social toast timers disabled per user request
  // setTimeout(showSocialToast, 4000);
  // setInterval(showSocialToast, 20000);

  function showToastNotification(text) {
    const toast = document.createElement('div');
    toast.style.cssText = `
      position: fixed;
      top: 30px;
      right: 30px;
      background: #0f172a;
      color: white;
      padding: 14px 22px;
      border-radius: 10px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.25);
      z-index: 200;
      font-weight: 700;
      font-size: 0.95rem;
      display: flex;
      align-items: center;
      gap: 10px;
      animation: fadeIn 0.3s ease;
    `;
    toast.textContent = text;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 2800);
  }

  /* ------------------------------------------------
     13. TERMS & CONDITIONS MODAL
  ------------------------------------------------- */
  const openTermsBtn = document.getElementById('openTermsModalBtn');
  const termsModal = document.getElementById('termsModalOverlay');
  const closeTermsBtn = document.getElementById('closeTermsModalBtn');
  const closeTermsBottomBtn = document.getElementById('closeTermsModalBottomBtn');

  function openTermsModal() {
    if (termsModal) {
      termsModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeTermsModal() {
    if (termsModal) {
      termsModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  if (openTermsBtn) {
    openTermsBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openTermsModal();
    });
  }

  if (closeTermsBtn) closeTermsBtn.addEventListener('click', closeTermsModal);
  if (closeTermsBottomBtn) closeTermsBottomBtn.addEventListener('click', closeTermsModal);

  if (termsModal) {
    termsModal.addEventListener('click', (e) => {
      if (e.target === termsModal) closeTermsModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && termsModal && termsModal.classList.contains('active')) {
      closeTermsModal();
    }
  });
});
