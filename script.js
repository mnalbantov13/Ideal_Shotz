// Modern JavaScript for IS Photography Portfolio

// Ensure page loads at top
window.addEventListener('load', function() {
    window.scrollTo(0, 0);
});

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    renderGallery();

    // Initialize all functionality
    initNavigation();
    initGalleryFilter();
    
    // Initialize contact form with error handling
    try {
        initContactForm();
    } catch (error) {
        console.error('Failed to initialize contact form:', error);
    }
    

    initScrollEffects();
    initHeroImageRotation();
    initLazyLoading(); // Initialize lazy loading
    
    // Initialize gallery to show only overview cards
    if (document.querySelector('.gallery-grid')) {
        // Make sure the "All" button is active on page load
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-filter') === 'all') {
                btn.classList.add('active');
            }
        });
        
        // Ensure proper initial state
        const galleryItems = document.querySelectorAll('.gallery-item');
        const overviewItems = document.querySelectorAll('.category-overview-item');
        const galleryGrid = document.querySelector('.gallery-grid');
        
        // Force the correct initial state
        galleryGrid.classList.add('gallery-grid--all-view');
        
        // Hide all gallery items explicitly
        galleryItems.forEach(item => {
            item.style.display = 'none';
        });
        
        // Show overview items explicitly
        overviewItems.forEach(item => {
            item.style.display = 'block';
        });
        
        // Apply the filter to handle animations
        setTimeout(() => {
            applyFilter('all');
        }, 50);
    }
});

function resolveSrc(src) {
  const base = window.IMAGE_BASE || '';
  return (!base || src.startsWith('http') || src.startsWith('//')) ? src : base + src;
}

function resolveLabel(cat) {
  return (window.LANG === 'bg' && cat.labelBG) ? cat.labelBG : cat.label;
}

function resolveTitle(album) {
  return (window.LANG === 'bg' && album.titleBG) ? album.titleBG : album.title;
}

function renderGallery() {
  const container = document.getElementById('gallery-container');
  if (!container) return;

  const overviewHTML = `
    <div class="gallery-grid gallery-grid--all-view" id="overview-grid">
      ${GALLERY_DATA.map(cat => `
        <div class="category-overview-item" data-category="overview" onclick="filterCategory('${cat.id}')">
          <img src="${resolveSrc(cat.cover)}" alt="${resolveLabel(cat)} Category" loading="lazy">
          <div class="category-overlay">
            <div class="category-content"><h3>${resolveLabel(cat)}</h3></div>
          </div>
        </div>
      `).join('')}
    </div>`;

  const gridsHTML = GALLERY_DATA.map(cat => {
    if (cat.images) {
      return `
        <div class="gallery-grid">
          ${cat.images.map(img => itemHTML(img, cat.id)).join('')}
        </div>`;
    } else {
      return cat.albums.map(album => {
        const isMobile = window.innerWidth <= 768;
        const images = (isMobile && album.mobileImages) ? album.mobileImages : album.images;
        return `
        <h3 class="album-title" data-category="${cat.id}">${resolveTitle(album)}</h3>
        <div class="gallery-grid">
          ${images.map(img => itemHTML(img, cat.id)).join('')}
        </div>
      `;
      }).join('');
    }
  }).join('');

  container.innerHTML = overviewHTML + gridsHTML;
}

function itemHTML(img, category) {
  const fullSrcAttr = img.fullSrc ? `data-src="${resolveSrc(img.fullSrc)}"` : '';
  const spanClass = img.span ? ' col-span-mobile' : '';
  return `
    <div class="gallery-item${spanClass}" data-category="${category}" onclick="openModal(this)">
      <img src="${resolveSrc(img.src)}" ${fullSrcAttr} alt="${img.alt}" loading="lazy">
    </div>`;
}

// Navigation functionality
function initNavigation() {
    const hamburger = document.getElementById('hamburger');
    const navList = document.querySelector('.nav-list');
    const navLinks = document.querySelectorAll('.nav-link');

    // Mobile menu toggle
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            if (navList) navList.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking on links
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (navList && navList.classList.contains('active')) {
                hamburger.classList.remove('active');
                navList.classList.remove('active');
            }
        });
    });

    // Navbar background on scroll
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    });

    // Handle active nav link based on scroll position
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// Gallery filter functionality
function initGalleryFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const overviewItems = document.querySelectorAll('.category-overview-item');

    // Add click handlers to all gallery items for modal opening
    galleryItems.forEach(item => {
        item.addEventListener('click', function(e) {
            // Don't trigger if clicking on the button itself
            if (!e.target.closest('.view-btn')) {
                openModal(this);
            }
        });
    });

    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Scroll to gallery section top when using filter buttons
            const gallerySection = document.querySelector('.gallery-section');
            if (gallerySection) {
                gallerySection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
            
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');

            const filterValue = this.getAttribute('data-filter');
            applyFilter(filterValue);
        });
    });
}

// Apply filter function
function applyFilter(filterValue) {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const overviewItems = document.querySelectorAll('.category-overview-item');
    const albumTitles = document.querySelectorAll('.album-title');
    const galleryGrid = document.getElementById('overview-grid');

    if (filterValue === 'all') {
        // Add special class for 'All' view
        if (galleryGrid) galleryGrid.classList.add('gallery-grid--all-view');
        
        // Show overview items, hide gallery items and album titles
        overviewItems.forEach(item => {
            item.style.display = 'block';
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            setTimeout(() => {
                item.style.transition = 'all 0.3s ease';
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, 100);
        });
        
        galleryItems.forEach(item => {
            item.style.display = 'none';
        });
        
        // Hide album titles on 'All' view
        albumTitles.forEach(title => {
            title.style.display = 'none';
        });
    } else {
        // Remove special class for category views
        if (galleryGrid) galleryGrid.classList.remove('gallery-grid--all-view');
        
        // Hide overview items
        overviewItems.forEach(item => {
            item.style.display = 'none';
        });

        // Show/hide album titles based on filter
        albumTitles.forEach(title => {
            const titleCategory = title.getAttribute('data-category');
            
            if (titleCategory === filterValue) {
                title.style.display = 'block';
                title.style.setProperty('display', 'block', 'important');
                title.style.opacity = '0';
                title.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    title.style.transition = 'all 0.3s ease';
                    title.style.opacity = '1';
                    title.style.transform = 'translateY(0)';
                }, 50);
            } else {
                title.style.display = 'none';
            }
        });

        galleryItems.forEach(item => {
            const itemCategory = item.getAttribute('data-category');
            
            if (itemCategory === filterValue) {
                item.style.display = 'block';
                item.style.setProperty('display', 'block', 'important');
                // Add entrance animation
                item.style.opacity = '0';
                item.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    item.style.transition = 'all 0.3s ease';
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                }, 100);
            } else {
                item.style.display = 'none';
            }
        });
    }
    
    // Refresh lazy loading after filter changes
    setTimeout(() => {
        if (window.refreshLazyLoading) {
            window.refreshLazyLoading();
        }
        

    }, 350); // Wait for animations to complete
}

// Filter to specific category (called from overview cards)
function filterCategory(category) {
    // Scroll to gallery section top when filtering
    const gallerySection = document.querySelector('.gallery-section');
    if (gallerySection) {
        gallerySection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
        // If on index page, scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    // Update active button
    filterBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-filter') === category) {
            btn.classList.add('active');
        }
    });
    
    // Apply the filter
    applyFilter(category);
}

// Modal functionality for gallery
let currentImages = [];
let currentImageIndex = 0;
let isNavigating = false; // Lock to prevent multiple rapid navigation

function openModal(element) {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    
    let galleryItem;
    
    // Check if element is a button or the gallery item itself
    if (element.classList.contains('gallery-item')) {
        galleryItem = element;
    } else {
        galleryItem = element.closest('.gallery-item');
    }
    
    // Check if we're on the prom page (items have prom-gallery-item class)
    const isPromPage = galleryItem && galleryItem.classList.contains('prom-gallery-item');
    
    if (isPromPage) {
        // For prom page, get all prom gallery items
        currentImages = Array.from(document.querySelectorAll('.gallery-item.prom-gallery-item'));
    } else {
        // Get current filter to determine which images to show
        const activeFilter = document.querySelector('.filter-btn.active');
        const currentFilter = activeFilter ? activeFilter.getAttribute('data-filter') : 'all';
        
        // Get all visible images in current category
        if (currentFilter === 'all') {
            // Show category overview items instead of individual images
            currentImages = Array.from(document.querySelectorAll('.category-overview-item[data-category="overview"]'));
        } else {
            // Get all gallery items for the current category (regardless of display state)
            currentImages = Array.from(document.querySelectorAll(`.gallery-item[data-category="${currentFilter}"]`));
        }
    }
    
    // Find current image index
    currentImageIndex = currentImages.indexOf(galleryItem);
    
    // Ensure valid index (fallback to 0 if not found)
    if (currentImageIndex === -1) {
        currentImageIndex = 0;
    }
    
    // Display the image and modal
    displayCurrentImage();
    modal.style.display = 'block';
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    
    // Initialize touch handling for swipe gestures
    initModalTouchHandling(modalImg);
    
    // Update navigation buttons
    updateNavigationButtons();
}

function displayCurrentImage() {
    const modalImg = document.getElementById('modalImage');
    const currentImageNumber = document.getElementById('currentImageNumber');
    const totalImages = document.getElementById('totalImages');
    
    if (currentImages.length > 0 && currentImageIndex >= 0 && currentImageIndex < currentImages.length) {
        const currentItem = currentImages[currentImageIndex];
        const img = currentItem.querySelector('img');
        
        if (img) {
            modalImg.src = img.src;
            modalImg.alt = img.alt;
            
            // Update counter with explicit DOM updates
            if (currentImageNumber && totalImages) {
                currentImageNumber.textContent = String(currentImageIndex + 1);
                totalImages.textContent = String(currentImages.length);
                
                // Force DOM update for mobile
                currentImageNumber.style.display = 'inline';
                totalImages.style.display = 'inline';
            }
        }
    }
}

function navigateImage(direction) {
    if (currentImages.length <= 1 || isNavigating) return;
    
    // Lock navigation to prevent multiple rapid calls
    isNavigating = true;
    
    currentImageIndex += direction;
    
    // Loop around if needed
    if (currentImageIndex >= currentImages.length) {
        currentImageIndex = 0;
    } else if (currentImageIndex < 0) {
        currentImageIndex = currentImages.length - 1;
    }
    
    displayCurrentImage();
    updateNavigationButtons();
    
    // Additional counter update for mobile reliability
    setTimeout(() => {
        forceCounterUpdate();
        // Release navigation lock after update
        isNavigating = false;
    }, 150);
}

function forceCounterUpdate() {
    const currentImageNumber = document.getElementById('currentImageNumber');
    const totalImages = document.getElementById('totalImages');
    
    if (currentImageNumber && totalImages && currentImages.length > 0) {
        currentImageNumber.innerHTML = String(currentImageIndex + 1);
        totalImages.innerHTML = String(currentImages.length);
    }
}

function updateNavigationButtons() {
    const prevBtn = document.querySelector('.nav-btn-prev');
    const nextBtn = document.querySelector('.nav-btn-next');
    
    // Hide navigation if only one image
    if (currentImages.length <= 1) {
        prevBtn.style.display = 'none';
        nextBtn.style.display = 'none';
        return;
    }
    
    prevBtn.style.display = 'flex';
    nextBtn.style.display = 'flex';
    
    // Optional: disable buttons at ends (remove if you want infinite loop)
    // prevBtn.disabled = currentImageIndex === 0;
    // nextBtn.disabled = currentImageIndex === currentImages.length - 1;
}

function closeModal() {
    const modal = document.getElementById('imageModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
    
    // Reset variables
    currentImages = [];
    currentImageIndex = 0;
    isNavigating = false; // Reset navigation lock
}

// Initialize touch handling for swipe gestures
function initModalTouchHandling(modalImg) {
    let startY = 0;
    let startX = 0;
    let startTime = 0;
    let isDragging = false;
    let hasTriggeredNavigation = false; // Prevent multiple navigation triggers
    
    modalImg.addEventListener('touchstart', function(e) {
        if (isNavigating) return; // Don't start new gesture if navigating
        
        startY = e.touches[0].clientY;
        startX = e.touches[0].clientX;
        startTime = Date.now();
        isDragging = true;
        hasTriggeredNavigation = false;
        modalImg.style.transition = 'none';
    });
    
    modalImg.addEventListener('touchmove', function(e) {
        if (!isDragging) return;
        
        const currentY = e.touches[0].clientY;
        const currentX = e.touches[0].clientX;
        const deltaY = currentY - startY;
        const deltaX = currentX - startX;
        
        // Determine if this is primarily a vertical or horizontal swipe
        const isVerticalSwipe = Math.abs(deltaY) > Math.abs(deltaX);
        
        if (isVerticalSwipe && deltaY > 0) {
            // Vertical swipe down - close gesture
            const opacity = Math.max(0.3, 1 - (deltaY / 300));
            const scale = Math.max(0.8, 1 - (deltaY / 600));
            
            modalImg.style.transform = `translateY(${deltaY}px) scale(${scale})`;
            modalImg.style.opacity = opacity;
        } else if (!isVerticalSwipe && Math.abs(deltaX) > 50) {
            // Horizontal swipe - navigation gesture
            const opacity = Math.max(0.5, 1 - (Math.abs(deltaX) / 400));
            modalImg.style.opacity = opacity;
            modalImg.style.transform = `translateX(${deltaX * 0.3}px)`;
        }
    });
    
    modalImg.addEventListener('touchend', function(e) {
        if (!isDragging || isNavigating) return;
        
        const endY = e.changedTouches[0].clientY;
        const endX = e.changedTouches[0].clientX;
        const deltaY = endY - startY;
        const deltaX = endX - startX;
        const deltaTime = Date.now() - startTime;
        
        isDragging = false;
        modalImg.style.transition = 'all 0.1s ease';
        
        // Determine gesture type
        const isVerticalSwipe = Math.abs(deltaY) > Math.abs(deltaX);
        const velocity = isVerticalSwipe ? deltaY / deltaTime : deltaX / deltaTime;
        
        if (isVerticalSwipe && (deltaY > 100 || (deltaY > 50 && velocity > 0.3))) {
            // Close on swipe down
            closeModal();
        } else if (!isVerticalSwipe && Math.abs(deltaX) > 100 && !hasTriggeredNavigation) {
            // Navigate on horizontal swipe (increased threshold to 100px)
            hasTriggeredNavigation = true; // Prevent multiple triggers
            
            if (deltaX > 0) {
                navigateImage(-1); // Swipe right = previous image
            } else {
                navigateImage(1);  // Swipe left = next image
            }
            // Reset position after navigation and ensure counter is updated
            setTimeout(() => {
                modalImg.style.transform = 'translateX(0)';
                modalImg.style.opacity = '1';
                // Force counter update after navigation
                updateNavigationButtons();
            }, 10);
        } else {
            // Reset position if gesture wasn't strong enough
            modalImg.style.transform = 'translateY(0) scale(1) translateX(0)';
            modalImg.style.opacity = '1';
        }
    });
}

// Close modal when clicking outside
window.addEventListener('click', function(event) {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    
    if (event.target === modal) {
        closeModal();
    }
    // Close when clicking on the image itself
    else if (event.target === modalImg) {
        closeModal();
    }
});

// Close modal with escape key and navigate with arrow keys
document.addEventListener('keydown', function(event) {
    const modal = document.getElementById('imageModal');
    
    // Only handle keys when modal is open
    if (modal.style.display === 'block') {
        switch(event.key) {
            case 'Escape':
                closeModal();
                break;
            case 'ArrowLeft':
                event.preventDefault();
                navigateImage(-1);
                break;
            case 'ArrowRight':
                event.preventDefault();
                navigateImage(1);
                break;
        }
    }
});

// Contact form functionality
function initContactForm() {
    // Check if EmailJS is available first
    if (typeof emailjs === 'undefined') {
        console.log('EmailJS not loaded - contact form functionality disabled');
        return; // Exit early if EmailJS is not available
    }
    
    const contactForm = document.getElementById('contactForm');
    
    // Initialize EmailJS
    try {
        emailjs.init("ypLtPGxmSdgzAI-mK"); // You'll need to replace this with your actual public key
    } catch (error) {
        console.error('Failed to initialize EmailJS:', error);
        return;
    }
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData);
            
            // Basic validation
            if (!data.firstName || !data.lastName || !data.email || !data.subject || !data.message) {
                showNotification('Please fill in all required fields.', 'error');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data.email)) {
                showNotification('Please enter a valid email address.', 'error');
                return;
            }
            
            // Show loading state
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            // Prepare email parameters
            const emailParams = {
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                first_name: data.firstName,  // Alternative naming
                last_name: data.lastName,    // Alternative naming
                user_email: data.email,      // Alternative naming
                from_name: `${data.firstName} ${data.lastName}`, // Combined name
                subject: data.subject,
                message: data.message
            };
            
            // Send email using EmailJS (if available)
            if (typeof emailjs !== 'undefined') {
                emailjs.send('service_2l2impe', 'template_7n7xfvf', emailParams)
                    .then(function(response) {
                        console.log('SUCCESS!', response.status, response.text);
                        showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
                        contactForm.reset();
                    })
                    .catch(function(error) {
                        console.log('FAILED...', error);
                        showNotification('Failed to send message. Please try again or contact us directly.', 'error');
                    })
                    .finally(function() {
                        // Reset button state
                        submitBtn.textContent = originalText;
                        submitBtn.disabled = false;
                    });
            } else {
                // EmailJS not available - just show a message
                showNotification('EmailJS not configured. Contact form disabled.', 'error');
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
    }
}

// Show notification
function showNotification(message, type) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Style the notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 2rem;
        border-radius: 4px;
        color: white;
        font-weight: 500;
        z-index: 9999;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        ${type === 'success' ? 'background: #28a745;' : 'background: #dc3545;'}
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

// Scroll effects
function initScrollEffects() {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Fade in animation for elements
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements with fade-in class
    document.querySelectorAll('.service-card, .gallery-item, .contact-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
}

// Hero image rotation
function initHeroImageRotation() {
    const heroImg = document.getElementById('hero-img');
    
    if (heroImg) {
        const images = [
            'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
        ];
        
        let currentIndex = 0;
        
        function changeImage() {
            currentIndex = (currentIndex + 1) % images.length;
            
            heroImg.style.opacity = '0.7';
            
            setTimeout(() => {
                heroImg.src = images[currentIndex];
                heroImg.style.opacity = '1';
            }, 300);
        }
        
        // Change image every 5 seconds
        setInterval(changeImage, 5000);
    }
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Duplicate function removed - using the enhanced version below

// Performance optimization
function optimizePerformance() {
    // Preload critical images
    const criticalImages = [
        'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
    ];
    
    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}


// Initialize performance optimizations
document.addEventListener('DOMContentLoaded', optimizePerformance);

// Function to scroll to top before navigation
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Cache busting function
function addCacheBusting(url) {
    const version = '1.0.4'; // Update this version when you want to clear cache
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}v=${version}`;
}

// Custom Lazy Loading Function
function initLazyLoading() {
    // Enhanced iOS Detection
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    const isIOSSafari = isIOS && isSafari;
    
    // Detect iOS version for specific optimizations
    const iOSVersion = isIOS ? parseFloat(
        ('' + (/CPU.*OS ([0-9_]{1,5})|(CPU like).*AppleWebKit.*Mobile/i.exec(navigator.userAgent) || [0,''])[1])
        .replace('undefined', '3_2').replace('_', '.').replace('_', '')
    ) || false : false;
    
    // Device detection complete (logging disabled for production)
    
    // iOS-optimized configuration
    const halfScreenHeight = isIOS ? window.innerHeight / 4 : window.innerHeight / 2; // Even more aggressive for iOS
    const threshold = isIOSSafari ? 0.2 : isIOS ? 0.1 : 0; // Higher threshold for iOS Safari
    const loadTimeout = isIOSSafari ? 20000 : isIOS ? 15000 : 10000; // Longer timeout for iOS Safari
    
    // iOS memory management
    const maxConcurrentLoads = isIOS ? 3 : 6; // Limit concurrent loads on iOS
    let currentLoadingCount = 0;
    
    // Lazy loading initialized
    
    // Create intersection observer with custom rootMargin (half screen away)
    const lazyImageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                const dataSrc = img.getAttribute('data-src');
                const isAlreadyLoaded = img.getAttribute('data-loaded') === 'true';
                
                if (dataSrc && !isAlreadyLoaded) {
                    // iOS memory management - limit concurrent loads
                    if (isIOS && currentLoadingCount >= maxConcurrentLoads) {
                        // iOS: Delaying load due to concurrent limit
                        setTimeout(() => {
                            if (img.getAttribute('data-loaded') !== 'true') {
                                lazyImageObserver.observe(img);
                            }
                        }, 1000);
                        return;
                    }
                    
                    currentLoadingCount++;
                    // Loading image
                    
                    // Add loading state with iOS-specific optimizations
                    img.classList.add('lazy-loading');
                    
                    // iOS-specific loading timeout
                    let loadingTimeout;
                    if (isIOS) {
                        loadingTimeout = setTimeout(() => {
                            console.warn(`⏰ iOS loading timeout for:`, dataSrc);
                            img.classList.remove('lazy-loading');
                            img.classList.add('lazy-error');
                            currentLoadingCount = Math.max(0, currentLoadingCount - 1);
                        }, loadTimeout);
                    }
                    
                    // Create a new image to preload with iOS optimizations
                    const imageLoader = new Image();
                    
                    // iOS-specific image properties
                    if (isIOS) {
                        imageLoader.crossOrigin = 'anonymous'; // Help with iOS caching
                        imageLoader.decoding = 'async'; // Async decode for better performance
                    }
                    
                    imageLoader.onload = function() {
                        // Image loaded successfully
                        currentLoadingCount = Math.max(0, currentLoadingCount - 1);
                        
                        // Clear iOS timeout
                        if (loadingTimeout) clearTimeout(loadingTimeout);
                        
                        // Image loaded successfully - replace src with cache-busted version
                        img.src = addCacheBusting(dataSrc);
                        // Keep data-src for cache reference but mark as loaded
                        img.setAttribute('data-loaded', 'true');
                        
                        // iOS-specific fade-in handling with memory optimization
                        if (isIOS) {
                            // Use requestIdleCallback for better performance on iOS
                            const fadeIn = () => {
                                img.style.opacity = '0';
                                img.offsetHeight; // Force reflow
                                
                                // Use requestAnimationFrame for smooth animation
                                requestAnimationFrame(() => {
                                    img.style.transition = isIOSSafari ? 'opacity 0.2s ease-out' : 'opacity 0.3s ease-in-out';
                                    img.style.opacity = '1';
                                    img.classList.remove('lazy-loading');
                                    img.classList.add('lazy-loaded');
                                    
                                    // Force gallery reflow after image loads (iOS column layout fix)
                                    if (window.forceGalleryReflow) {
                                        setTimeout(() => window.forceGalleryReflow(), 50);
                                    }
                                    
                                    // Clean up imageLoader reference for memory
                                    setTimeout(() => {
                                        imageLoader.onload = null;
                                        imageLoader.onerror = null;
                                    }, 100);
                                });
                            };
                            
                            // Use requestIdleCallback if available, fallback to setTimeout
                            if (window.requestIdleCallback && !isIOSSafari) {
                                requestIdleCallback(fadeIn, { timeout: 100 });
                            } else {
                                fadeIn();
                            }
                        } else {
                            // Standard fade-in for other browsers
                            img.style.opacity = '0';
                            setTimeout(() => {
                                img.style.transition = 'opacity 0.3s ease-in-out';
                                img.style.opacity = '1';
                                img.classList.remove('lazy-loading');
                                img.classList.add('lazy-loaded');
                            }, 50);
                        }
                    };
                    
                    imageLoader.onerror = function() {
                        console.error(`❌ Image load failed:`, dataSrc);
                        currentLoadingCount = Math.max(0, currentLoadingCount - 1);
                        
                        // Clear iOS timeout
                        if (loadingTimeout) clearTimeout(loadingTimeout);
                        
                        // Enhanced iOS error handling with retry mechanism
                        if (isIOS) {
                            const retryCount = parseInt(img.getAttribute('data-retry-count') || '0');
                            if (retryCount < 2) {
                                console.log(`🍎 iOS: Retrying image load (attempt ${retryCount + 1}/3):`, dataSrc);
                                img.setAttribute('data-retry-count', (retryCount + 1).toString());
                                
                                // Retry with exponential backoff
                                setTimeout(() => {
                                    if (img.getAttribute('data-loaded') !== 'true') {
                                        lazyImageObserver.observe(img);
                                    }
                                }, Math.pow(2, retryCount) * 1000);
                                return;
                            }
                        }
                        
                        // Handle loading error
                        img.classList.remove('lazy-loading');
                        img.classList.add('lazy-error');
                        console.warn('Failed to load image after retries:', dataSrc);
                        
                        // Set a placeholder or default image if needed
                        img.alt = 'Image failed to load';
                        
                        // Clean up memory
                        imageLoader.onload = null;
                        imageLoader.onerror = null;
                    };
                    
                    // Start loading the image with cache busting
                    imageLoader.src = addCacheBusting(dataSrc);
                    
                    // Stop observing this image
                    observer.unobserve(img);
                } else if (isAlreadyLoaded) {
                    // Image already loaded - just show it immediately
                    img.style.opacity = '1';
                    img.classList.remove('lazy-loading');
                    img.classList.add('lazy-loaded');
                    observer.unobserve(img);
                }
            }
        });
    }, {
        // Load images when they're half a screen away (closer for iOS)
        rootMargin: `${halfScreenHeight}px 0px ${halfScreenHeight}px 0px`,
        threshold: threshold
    });

    // Helper function to check if an element is visible
    const isElementVisible = (element) => {
        const style = window.getComputedStyle(element);
        const parentElement = element.closest('.gallery-item, .category-overview-item');
        const parentStyle = parentElement ? window.getComputedStyle(parentElement) : null;
        
        return style.display !== 'none' && 
               style.visibility !== 'hidden' && 
               (!parentStyle || (parentStyle.display !== 'none' && parentStyle.visibility !== 'hidden'));
    };

    // Find all images with data-src attribute and observe only visible ones
    const observeVisibleImages = () => {
        // First unobserve all currently observed images
        const allImages = document.querySelectorAll('img[data-src]');
        allImages.forEach(img => {
            lazyImageObserver.unobserve(img);
        });
        
        // Now observe only visible images
        const visibleImages = Array.from(allImages).filter(isElementVisible);
        let newImagesCount = 0;
        let cachedImagesCount = 0;
        
        visibleImages.forEach(img => {
            const isAlreadyLoaded = img.getAttribute('data-loaded') === 'true';
            
            if (isAlreadyLoaded) {
                // Image is cached - show it immediately
                img.style.opacity = '1';
                img.classList.remove('lazy-loading');
                img.classList.add('lazy-loaded');
                cachedImagesCount++;
            } else {
                // Image not loaded yet - observe it for lazy loading
                lazyImageObserver.observe(img);
                newImagesCount++;
            }
        });
        
        // Lazy loading images processed
        return visibleImages;
    };

    // Initial observation
    const lazyImages = observeVisibleImages();

    // Enhanced iOS-specific fallback mechanisms
    if (isIOS) {
        // iOS-specific fallbacks enabled
        
        // iOS Memory management - periodic cleanup
        const iOSMemoryCleanup = () => {
            if (performance.memory && performance.memory.usedJSHeapSize > performance.memory.jsHeapSizeLimit * 0.8) {
                console.log('🍎 iOS: High memory usage detected, forcing garbage collection');
                // Force garbage collection by creating temporary stress
                if (window.gc) {
                    window.gc();
                } else {
                    // Fallback memory cleanup
                    const temp = new Array(1000).fill(0);
                    temp.length = 0;
                }
            }
        };
        
        // Fallback 1: Enhanced force load visible images with memory management
        setTimeout(() => {
            iOSMemoryCleanup();
            
            const visibleImages = Array.from(document.querySelectorAll('img[data-src]')).filter(img => {
                const rect = img.getBoundingClientRect();
                return rect.top < window.innerHeight * 1.5 && rect.bottom > -100 && img.getAttribute('data-loaded') !== 'true';
            });
            
            if (visibleImages.length > 0) {
                // iOS: Force loading visible images
                
                // Load images in batches for iOS memory management
                const batchSize = isIOSSafari ? 2 : 3;
                let batchIndex = 0;
                
                const loadBatch = () => {
                    const batch = visibleImages.slice(batchIndex, batchIndex + batchSize);
                    batch.forEach(img => {
                        const dataSrc = img.getAttribute('data-src');
                        if (dataSrc) {
                            // Force loading image
                            img.src = addCacheBusting(dataSrc);
                            img.setAttribute('data-loaded', 'true');
                            img.style.opacity = '1';
                            img.classList.remove('lazy-loading');
                            img.classList.add('lazy-loaded');
                        }
                    });
                    
                    batchIndex += batchSize;
                    if (batchIndex < visibleImages.length) {
                        setTimeout(loadBatch, 500); // Delay between batches
                    }
                };
                
                loadBatch();
            }
        }, isIOSSafari ? 2000 : 3000);
        
        // Fallback 2: Monitor viewport changes and reload stalled images
        let viewportChangeTimer;
        const handleViewportChange = () => {
            clearTimeout(viewportChangeTimer);
            viewportChangeTimer = setTimeout(() => {
                // iOS: Checking for stalled images after viewport change
                const stalledImages = document.querySelectorAll('img.lazy-loading');
                if (stalledImages.length > 0) {
                    // iOS: Force loading stalled images
                    stalledImages.forEach(img => {
                        const dataSrc = img.getAttribute('data-src');
                        if (dataSrc) {
                            img.src = addCacheBusting(dataSrc);
                            img.setAttribute('data-loaded', 'true');
                            img.style.opacity = '1';
                            img.classList.remove('lazy-loading');
                            img.classList.add('lazy-loaded');
                        }
                    });
                }
            }, 1000);
        };
        
        window.addEventListener('resize', handleViewportChange);
        window.addEventListener('orientationchange', () => {
            setTimeout(handleViewportChange, 500);
        });
        
        // Fallback 3: Enhanced periodic check with iOS optimizations
        const periodicCheck = setInterval(() => {
            // Memory cleanup every check
            iOSMemoryCleanup();
            
            const failedImages = document.querySelectorAll('img[data-src]:not([data-loaded="true"]):not(.lazy-loading):not(.lazy-error)');
            if (failedImages.length > 0) {
                // iOS: Retrying unloaded images
                
                // Only retry visible images to avoid memory issues
                const visibleFailedImages = Array.from(failedImages).filter(img => {
                    const rect = img.getBoundingClientRect();
                    return rect.top < window.innerHeight * 2 && rect.bottom > -window.innerHeight;
                });
                
                // iOS: Retrying visible failed images
                visibleFailedImages.forEach(img => {
                    lazyImageObserver.observe(img);
                });
            }
            
            // Stop periodic checks after 5 minutes to save battery
            if (Date.now() - window.performance.timing.navigationStart > 300000) {
                console.log('🍎 iOS: Stopping periodic checks after 5 minutes');
                clearInterval(periodicCheck);
            }
        }, isIOSSafari ? 7000 : 5000);
        
        // iOS-specific connection monitoring
        if (navigator.connection) {
            const connection = navigator.connection;
            // iOS: Network monitoring enabled
            
            // Adjust loading behavior based on connection
            connection.addEventListener('change', () => {
                // iOS: Network connection changed
                if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
                    // Reduce concurrent loads on slow connections
                    maxConcurrentLoads = 1;
                } else if (connection.effectiveType === '3g') {
                    maxConcurrentLoads = 2;
                } else {
                    maxConcurrentLoads = isIOS ? 3 : 6;
                }
            });
        }
        
        // iOS battery API optimization
        if (navigator.getBattery) {
            navigator.getBattery().then(battery => {
                // iOS: Battery monitoring enabled
                
                // Reduce loading aggressiveness on low battery
                if (battery.level < 0.2 && !battery.charging) {
                    // iOS: Reducing loading for low battery
                    maxConcurrentLoads = 1;
                }
                
                battery.addEventListener('levelchange', () => {
                    if (battery.level < 0.15 && !battery.charging) {
                        maxConcurrentLoads = 1;
                    } else {
                        maxConcurrentLoads = isIOS ? 3 : 6;
                    }
                });
            });
        }
    }

    // Force reflow function for iOS column layout issues
    const forceGalleryReflow = () => {
        const galleryGrids = document.querySelectorAll('.gallery-grid');
        galleryGrids.forEach(grid => {
            // Force reflow by temporarily changing display
            const originalDisplay = grid.style.display;
            grid.style.display = 'none';
            
            // Trigger reflow
            grid.offsetHeight; // eslint-disable-line no-unused-expressions
            
            // Restore display
            grid.style.display = originalDisplay || '';
            
            // Additional force reflow by reading computed style
            window.getComputedStyle(grid).columnCount;
        });
        
        console.log('🔄 Forced gallery reflow for column recalculation');
    };

    // Handle dynamic content (when filters change)
    const refreshLazyLoading = () => {
        // Re-observe only visible images when filters change
        observeVisibleImages();
        
        // Force reflow after filter change (especially important for iOS)
        if (isIOS) {
            setTimeout(() => {
                forceGalleryReflow();
            }, 100);
        }
        
        // iOS-specific: Additional fallback after filter change
        if (isIOS) {
            setTimeout(() => {
                const newVisibleImages = Array.from(document.querySelectorAll('img[data-src]')).filter(img => {
                    const rect = img.getBoundingClientRect();
                    const parentVisible = img.closest('.gallery-item, .category-overview-item');
                    const parentStyle = parentVisible ? window.getComputedStyle(parentVisible) : null;
                    return rect.top < window.innerHeight * 1.5 && rect.bottom > -100 && 
                           img.getAttribute('data-loaded') !== 'true' &&
                           parentStyle && parentStyle.display !== 'none';
                });
                
                if (newVisibleImages.length > 0) {
                    console.log(`🍎 iOS post-filter fallback: Loading ${newVisibleImages.length} images`);
                    newVisibleImages.forEach(img => {
                        const dataSrc = img.getAttribute('data-src');
                        if (dataSrc) {
                            img.src = addCacheBusting(dataSrc);
                            img.setAttribute('data-loaded', 'true');
                            img.style.opacity = '1';
                            img.classList.remove('lazy-loading');
                            img.classList.add('lazy-loaded');
                        }
                    });
                    
                    // Force reflow after loading images
                    setTimeout(forceGalleryReflow, 200);
                }
            }, 1500);
        }
    };

    // Make refresh function available globally for filter changes
    window.refreshLazyLoading = refreshLazyLoading;
    
    // Make reflow function available globally
    window.forceGalleryReflow = forceGalleryReflow;
    
    // Optional: Log lazy loading initialization
    console.log(`Lazy loading initialized for ${lazyImages.length} images`);
    
    // iOS-specific: Add scroll listener to force reflow periodically
    if (isIOS) {
        let scrollReflowTimer;
        let lastReflowTime = Date.now();
        
        const debouncedReflow = () => {
            clearTimeout(scrollReflowTimer);
            scrollReflowTimer = setTimeout(() => {
                // Only reflow if enough time has passed (avoid too frequent reflows)
                const now = Date.now();
                if (now - lastReflowTime > 1000) {
                    forceGalleryReflow();
                    lastReflowTime = now;
                }
            }, 300);
        };
        
        window.addEventListener('scroll', debouncedReflow, { passive: true });
        
        // Also reflow on orientation change
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                forceGalleryReflow();
                lastReflowTime = Date.now();
            }, 500);
        });
        
        console.log('🍎 iOS: Gallery reflow listeners added');
    }
    
    // Force load images that are immediately visible (for testing)
    lazyImages.forEach(img => {
        const rect = img.getBoundingClientRect();
        if (rect.top < window.innerHeight) {
            console.log('Forcing load of visible image:', img.getAttribute('data-src'));
            const dataSrc = img.getAttribute('data-src');
            if (dataSrc) {
                img.src = addCacheBusting(dataSrc);
                img.removeAttribute('data-src');
            }
        }
    });
}

// Language Toggle Function
function toggleLanguageMenu() {
    const menu = document.getElementById('langMenu');
    const switcher = document.querySelector('.language-switcher');
    
    if (menu && switcher) {
        menu.classList.toggle('show');
        switcher.classList.toggle('active');
    }
}

// Close language menu when clicking outside
document.addEventListener('click', function(event) {
    const switcher = document.querySelector('.language-switcher');
    const menu = document.getElementById('langMenu');
    
    if (switcher && menu && !switcher.contains(event.target)) {
        menu.classList.remove('show');
        switcher.classList.remove('active');
    }
});

// Close language menu when pressing Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const menu = document.getElementById('langMenu');
        const switcher = document.querySelector('.language-switcher');
        
        if (menu && switcher) {
            menu.classList.remove('show');
            switcher.classList.remove('active');
        }
    }
});

// Export functions for global access
window.openModal = openModal;
window.closeModal = closeModal;
window.navigateImage = navigateImage;
window.filterCategory = filterCategory;
window.scrollToTop = scrollToTop;
window.toggleLanguageMenu = toggleLanguageMenu;
