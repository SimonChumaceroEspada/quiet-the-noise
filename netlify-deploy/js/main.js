// Main JavaScript for Quiet the Noise Landing Page

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Main initialization function
function initializeApp() {
    initializeScrollEffects();
    initializeNavigation();
    initializeFAQ();
    initializeFormHandling();
    initializePaymentProcessing();
    initializeAnalytics();
    initializeSmoothScrolling();
    initializeAnimations();
    initializeExitIntent();
    
    // New features
    const variant = initializeABTesting();
    initializeConversionTracking();
    initializeUrgencyTimer();
    
    // Uncomment to enable social proof notifications
    // initializeSocialProof();
    
    console.log(`Landing page initialized with A/B test variant: ${variant}`);
}

// Scroll Effects and Header Behavior
function initializeScrollEffects() {
    const header = document.querySelector('.header');
    let lastScrollTop = 0;

    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add/remove scrolled class for header styling
        if (scrollTop > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        lastScrollTop = scrollTop;
    });

    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe all elements with fade-in class
    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });
}

// Navigation functionality
function initializeNavigation() {
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (mobileToggle && navLinks) {
        mobileToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            mobileToggle.classList.toggle('active');
        });

        // Close mobile menu when clicking on a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', function() {
                navLinks.classList.remove('active');
                mobileToggle.classList.remove('active');
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!event.target.closest('.nav-container')) {
                navLinks.classList.remove('active');
                mobileToggle.classList.remove('active');
            }
        });
        
        // Close mobile menu on window resize
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768) {
                navLinks.classList.remove('active');
                mobileToggle.classList.remove('active');
            }
        });
        
        // Prevent body scroll when mobile menu is open
        const toggleBodyScroll = (disable) => {
            if (disable) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        };
        
        mobileToggle.addEventListener('click', function() {
            const isActive = navLinks.classList.contains('active');
            toggleBodyScroll(!isActive);
        });
        
        // Re-enable scroll when menu is closed
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', function() {
                toggleBodyScroll(false);
            });
        });
    }
}

// FAQ Accordion functionality
function initializeFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', function() {
            const isActive = item.classList.contains('active');
            
            // Close all FAQ items
            faqItems.forEach(faq => {
                faq.classList.remove('active');
            });
            
            // Open clicked item if it wasn't already active
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
}

// Smooth scrolling for anchor links
function initializeSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Form handling and email capture
function initializeFormHandling() {
    // Email capture forms (if any are added)
    const emailForms = document.querySelectorAll('.email-capture-form');
    
    emailForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            handleEmailCapture(form);
        });
    });
}

function handleEmailCapture(form) {
    const email = form.querySelector('input[type="email"]').value;
    const submitButton = form.querySelector('button[type="submit"]');
    
    // Add loading state
    submitButton.classList.add('loading');
    submitButton.disabled = true;
    
    // Simulate API call (replace with actual email service)
    setTimeout(() => {
        // Success handling
        showNotification('Thank you! You\'ll receive updates about the book.', 'success');
        form.reset();
        
        // Remove loading state
        submitButton.classList.remove('loading');
        submitButton.disabled = false;
        
        // Track email capture
        trackEvent('email_capture', {
            source: form.dataset.source || 'unknown'
        });
    }, 1500);
}

// Payment Processing with Stripe and PayPal
function initializePaymentProcessing() {    
    // Initialize Stripe (replace with your actual publishable key)
    const stripe = Stripe(window.CONFIG?.STRIPE_PUBLISHABLE_KEY || 'pk_test_your_stripe_publishable_key_here');
    
    const checkoutButton = document.getElementById('checkout-button');
    
    if (checkoutButton) {
        checkoutButton.addEventListener('click', function() {
            handlePurchase('stripe');
        });
    }
    
    // Initialize PayPal tracking
    initializePayPalTracking();
}

// PayPal Tracking and Integration
function initializePayPalTracking() {
    // Track when PayPal button is loaded
    const checkPayPalLoaded = setInterval(() => {
        const paypalContainer = document.getElementById('paypal-container-T62JMDAV6VUBQ');
        if (paypalContainer && paypalContainer.children.length > 0) {
            clearInterval(checkPayPalLoaded);
            
            // Track PayPal button render
            trackEvent('paypal_button_rendered', {
                product: 'quiet_the_noise_ebook'
            });
            
            // Add click tracking to PayPal button
            const paypalButton = paypalContainer.querySelector('iframe');
            if (paypalButton) {
                paypalButton.addEventListener('load', function() {
                    trackEvent('paypal_button_loaded', {
                        product: 'quiet_the_noise_ebook'
                    });
                });
            }
        }
    }, 500);
    
    // Clear interval after 10 seconds to prevent endless checking
    setTimeout(() => clearInterval(checkPayPalLoaded), 10000);
    
    // Listen for PayPal events (if available through their API)
    if (typeof paypal !== 'undefined') {
        // Track PayPal payment initiation
        document.addEventListener('click', function(e) {
            if (e.target.closest('#paypal-container-T62JMDAV6VUBQ')) {
                trackEvent('paypal_payment_attempt', {
                    product: 'quiet_the_noise_ebook',
                    price: 1,
                    payment_method: 'paypal'
                });
            }
        });
    }
}

async function handlePurchase(paymentMethod = 'stripe') {
    const checkoutButton = document.getElementById('checkout-button');
    
    // Add loading state
    checkoutButton.classList.add('loading');
    checkoutButton.disabled = true;
    
    try {
        // Track purchase attempt with payment method        
        trackEvent('purchase_attempt', {
            product: 'quiet_the_noise_ebook',
            price: 1,
            payment_method: paymentMethod
        });
        
        // For demo purposes, simulate checkout process
        // In production, this would create a Stripe Checkout session
        await simulateStripeCheckout();
        
    } catch (error) {
        console.error('Purchase error:', error);
        showNotification('There was an error processing your payment. Please try again.', 'error');
        
        // Track error with payment method
        trackEvent('purchase_error', {
            error: error.message,
            payment_method: paymentMethod
        });
    } finally {
        // Remove loading state
        checkoutButton.classList.remove('loading');
        checkoutButton.disabled = false;
    }
}

// Simulate Stripe checkout (replace with actual Stripe integration)
async function simulateStripeCheckout() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Simulate successful payment for demo
            // In production, redirect to Stripe Checkout
            showNotification('Redirecting to secure checkout...', 'info');
            
            // Example of actual Stripe integration:
            // stripe.redirectToCheckout({
            //     sessionId: 'session_id_from_your_backend'
            // });
            
            resolve();
        }, 2000);
    });
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        z-index: 10000;
        max-width: 400px;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Close functionality
    const closeButton = notification.querySelector('.notification-close');
    closeButton.addEventListener('click', () => {
        closeNotification(notification);
    });
    
    // Auto close after 5 seconds
    setTimeout(() => {
        closeNotification(notification);
    }, 5000);
}

function closeNotification(notification) {
    notification.style.opacity = '0';
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

// Enhanced Analytics and Conversion Tracking
function initializeAnalytics() {
    // Google Analytics placeholder
    if (typeof gtag !== 'undefined') {
        // Track page view
        gtag('event', 'page_view', {
            page_title: document.title,
            page_location: window.location.href
        });
        
        // Track scroll depth
        trackScrollDepth();
        
        // Track CTA clicks
        trackCTAClicks();
    }
    
    // Facebook Pixel placeholder
    if (typeof fbq !== 'undefined') {
        fbq('track', 'PageView');
    }
}

// Track scroll depth for engagement metrics
function trackScrollDepth() {
    const scrollThresholds = [25, 50, 75, 90];
    const trackedThresholds = new Set();
    
    window.addEventListener('scroll', function() {
        const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
        
        scrollThresholds.forEach(threshold => {
            if (scrollPercent >= threshold && !trackedThresholds.has(threshold)) {
                trackedThresholds.add(threshold);
                
                // Google Analytics
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'scroll', {
                        event_category: 'engagement',
                        event_label: `${threshold}%`,
                        value: threshold
                    });
                }
                
                // Facebook Pixel
                if (typeof fbq !== 'undefined') {
                    fbq('trackCustom', 'ScrollDepth', { depth: threshold });
                }
            }
        });
    });
}

// Track CTA button clicks
function trackCTAClicks() {
    document.querySelectorAll('.cta-button, .purchase-button').forEach(button => {
        button.addEventListener('click', function(e) {
            const buttonText = this.textContent.trim();
            const buttonLocation = this.closest('section')?.id || 'unknown';
            
            // Google Analytics
            if (typeof gtag !== 'undefined') {
                gtag('event', 'click', {
                    event_category: 'cta',
                    event_label: `${buttonText} - ${buttonLocation}`,
                    value: 1
                });
            }
            
            // Facebook Pixel
            if (typeof fbq !== 'undefined') {
                fbq('track', 'Lead', {
                    content_name: buttonText,
                    content_category: 'CTA Click'
                });
            }
        });
    });
}

// Exit Intent Detection
function initializeExitIntent() {
    let exitIntentShown = false;
    
    document.addEventListener('mouseleave', function(e) {
        if (e.clientY <= 0 && !exitIntentShown) {
            exitIntentShown = true;
            showExitIntentModal();
        }
    });
}

// Exit Intent Modal
function showExitIntentModal() {
    const modal = document.createElement('div');
    modal.className = 'exit-intent-modal';
    modal.innerHTML = `
        <div class="exit-intent-content">
            <button class="exit-intent-close">&times;</button>
            <h3>Wait! Don't Leave Empty-Handed</h3>
            <p>Get instant access to "Quiet the Noise" and start your journey to mental clarity today.</p>
            <div class="exit-intent-offer">
                <span class="discount-badge">LIMITED TIME</span>
                <p class="offer-text">🎁 Special discount available for the next 15 minutes!</p>
            </div>
            <a href="#purchase" class="exit-intent-cta">Get My Copy Now</a>
            <p class="guarantee-text">✅ 30-day money-back guarantee</p>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close modal functionality
    modal.querySelector('.exit-intent-close').addEventListener('click', () => {
        modal.remove();
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
    
    // Track exit intent
    if (typeof gtag !== 'undefined') {
        gtag('event', 'exit_intent', {
            event_category: 'engagement',
            event_label: 'modal_shown'
        });
    }
}

// Enhanced Form Validation
function validatePurchaseForm(formData) {
    const errors = [];
    
    if (!formData.name || formData.name.trim().length < 2) {
        errors.push('Please enter a valid name');
    }
    
    if (!formData.email || !isValidEmail(formData.email)) {
        errors.push('Please enter a valid email address');
    }
    
    return {
        isValid: errors.length === 0,
        errors: errors
    };
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Success notification system
function showSuccessNotification(message, duration = 5000) {
    const notification = document.createElement('div');
    notification.className = 'success-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">✅</span>
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after duration
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, duration);
    
    // Manual close
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.remove();
    });
}

// Enhanced error handling
function showErrorNotification(message, duration = 7000) {
    const notification = document.createElement('div');
    notification.className = 'error-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">⚠️</span>
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, duration);
    
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.remove();
    });
}

// Analytics and tracking
function initializeAnalytics() {
    // Initialize Google Analytics (replace with your tracking ID)
    if (typeof gtag !== 'undefined') {
        gtag('config', 'GA_TRACKING_ID');
    }
    
    // Track page view
    trackEvent('page_view', {
        page_title: document.title,
        page_location: window.location.href
    });
    
    // Track scroll depth
    let maxScroll = 0;
    window.addEventListener('scroll', debounce(() => {
        const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
        if (scrollPercent > maxScroll && scrollPercent % 25 === 0) {
            maxScroll = scrollPercent;
            trackEvent('scroll_depth', {
                percent: scrollPercent
            });
        }
    }, 250));
    
    // Track CTA clicks
    document.querySelectorAll('.cta-primary, .cta-button, .cta-primary-large').forEach(button => {
        button.addEventListener('click', function() {
            trackEvent('cta_click', {
                button_text: this.textContent.trim(),
                button_location: this.closest('section')?.className || 'unknown'
            });
        });
    });
}

function trackEvent(eventName, parameters = {}) {
    // Google Analytics 4
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, parameters);
    }
    
    // Facebook Pixel (if implemented)
    if (typeof fbq !== 'undefined') {
        fbq('track', eventName, parameters);
    }
    
    // Console log for development
    console.log('Event tracked:', eventName, parameters);
}

// Animation utilities
function initializeAnimations() {
    // Add fade-in class to elements that should animate
    const animatedElements = document.querySelectorAll(`
        .hero-content,
        .problem-item,
        .benefit-card,
        .phase-card,
        .testimonial-card,
        .pricing-card
    `);
    
    animatedElements.forEach(el => {
        el.classList.add('fade-in');
    });
    
    // Parallax effect for hero section
    const hero = document.querySelector('.hero');
    if (hero) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            hero.style.transform = `translateY(${rate}px)`;
        });
    }
}

// Simple A/B Testing Framework
function initializeABTesting() {
    // Check if user has already been assigned a variant
    let variant = localStorage.getItem('ab_test_variant');
    
    if (!variant) {
        // Randomly assign variant (50/50 split)
        variant = Math.random() < 0.5 ? 'A' : 'B';
        localStorage.setItem('ab_test_variant', variant);
        
        // Track variant assignment
        if (typeof gtag !== 'undefined') {
            gtag('event', 'ab_test_assignment', {
                event_category: 'experiment',
                event_label: `variant_${variant}`,
                custom_parameter_1: variant
            });
        }
    }
    
    // Apply variant-specific changes
    applyABTestVariant(variant);
    
    return variant;
}

// Apply A/B test variants
function applyABTestVariant(variant) {
    if (variant === 'B') {
        // Variant B changes - example: different CTA text
        const ctaButtons = document.querySelectorAll('.purchase-button');
        ctaButtons.forEach(button => {
            if (button.textContent.includes('Get Your Copy')) {
                button.textContent = 'Start Your Journey Today';
            }
        });
        
        // Add variant class for CSS targeting
        document.body.classList.add('variant-b');
        
        // Example: Different pricing emphasis
        const priceElement = document.querySelector('.price-highlight');
        if (priceElement) {
            priceElement.innerHTML = '<span class="currency">$</span>27 <span class="period">one-time</span>';
        }
    }
}

// Track conversion by variant
function trackConversionByVariant(conversionType = 'purchase') {
    const variant = localStorage.getItem('ab_test_variant') || 'A';
    
    if (typeof gtag !== 'undefined') {
        gtag('event', 'conversion', {
            event_category: 'ab_test',
            event_label: `${conversionType}_variant_${variant}`,
            value: 1,
            custom_parameter_1: variant,
            custom_parameter_2: conversionType
        });
    }
}

// Enhanced conversion tracking
function initializeConversionTracking() {
    // Track when users reach the purchase section
    const purchaseSection = document.querySelector('#purchase');
    if (purchaseSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    trackConversionByVariant('purchase_section_view');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(purchaseSection);
    }
    
    // Track email captures (if you add an email opt-in)
    document.addEventListener('submit', function(e) {
        if (e.target.classList.contains('email-capture-form')) {
            trackConversionByVariant('email_capture');
        }
    });
}

// Landing page optimization - urgency timer
function initializeUrgencyTimer() {
    const timerElement = document.querySelector('.urgency-timer');
    if (!timerElement) return;
    
    // Set timer for 24 hours from first visit
    let timerEnd = localStorage.getItem('urgency_timer_end');
    if (!timerEnd) {
        timerEnd = Date.now() + (24 * 60 * 60 * 1000); // 24 hours
        localStorage.setItem('urgency_timer_end', timerEnd);
    }
    
    function updateTimer() {
        const now = Date.now();
        const timeLeft = parseInt(timerEnd) - now;
        
        if (timeLeft <= 0) {
            timerElement.innerHTML = '<span class="timer-expired">Offer Expired</span>';
            return;
        }
        
        const hours = Math.floor(timeLeft / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
        
        timerElement.innerHTML = `
            <span class="timer-label">Limited Time Offer Ends In:</span>
            <span class="timer-display">
                <span class="timer-unit">${hours.toString().padStart(2, '0')}</span>:
                <span class="timer-unit">${minutes.toString().padStart(2, '0')}</span>:
                <span class="timer-unit">${seconds.toString().padStart(2, '0')}</span>
            </span>
        `;
    }
    
    updateTimer();
    setInterval(updateTimer, 1000);
}

// Social proof notifications
function initializeSocialProof() {
    const notifications = [
        "Sarah from Toronto just purchased Quiet the Noise",
        "Mike from Chicago completed the 30-day program",
        "Lisa from Vancouver left a 5-star review",
        "David from New York just started his journey",
        "Emma from Seattle reported reduced anxiety after week 1"
    ];
    
    let notificationIndex = 0;
    
    function showSocialProofNotification() {
        const notification = document.createElement('div');
        notification.className = 'social-proof-notification';
        notification.innerHTML = `
            <div class="social-proof-content">
                <span class="social-proof-icon">✅</span>
                <span class="social-proof-text">${notifications[notificationIndex]}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Remove after 5 seconds
        setTimeout(() => {
            notification.remove();
        }, 5000);
        
        notificationIndex = (notificationIndex + 1) % notifications.length;
    }
    
    // Show first notification after 10 seconds
    setTimeout(showSocialProofNotification, 10000);
    
    // Show subsequent notifications every 45 seconds
    setInterval(showSocialProofNotification, 45000);
}

// Update main initialization to include new features
function initializeApp() {
    initializeScrollEffects();
    initializeNavigation();
    initializeFAQ();
    initializeFormHandling();
    initializePaymentProcessing();
    initializeAnalytics();
    initializeSmoothScrolling();
    initializeAnimations();
    
    // New features
    const variant = initializeABTesting();
    initializeConversionTracking();
    initializeUrgencyTimer();
    
    // Uncomment to enable social proof notifications
    // initializeSocialProof();
    
    console.log(`Landing page initialized with A/B test variant: ${variant}`);
}

// Error handling
window.addEventListener('error', function(event) {
    trackEvent('javascript_error', {
        error_message: event.message,
        filename: event.filename,
        line_number: event.lineno
    });
});

// Initialize performance monitoring
initializePerformanceMonitoring();

// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeApp,
        trackEvent,
        showNotification,
        handlePurchase
    };
}
