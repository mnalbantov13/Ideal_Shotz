// Modern JavaScript for IS Photography Portfolio

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initNavigation();
    initGalleryFilter();
    initContactForm();
    initFAQ();
    initScrollEffects();
    initHeroImageRotation();
    
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
    const galleryGrid = document.querySelector('.gallery-grid');

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
}

// Filter to specific category (called from overview cards)
function filterCategory(category) {
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
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData);
            
            // Basic validation
            if (!data.firstName || !data.lastName || !data.email || !data.message) {
                showNotification('Please fill in all required fields.', 'error');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data.email)) {
                showNotification('Please enter a valid email address.', 'error');
                return;
            }
            
            // Simulate form submission
            showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
            contactForm.reset();
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

// Lazy loading for images
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

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

// Export functions for global access
window.openModal = openModal;
window.closeModal = closeModal;
window.navigateImage = navigateImage;
