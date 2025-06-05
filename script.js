// ===== MODERN PORTFOLIO INTERACTIONS =====

document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Initialize all components
    initializeNavigation();
    initializeCards();
    initializeScrollAnimations();
    initializeMouseEffects();
    initializePerformance();
    initializeForms();
}

// ===== NAVIGATION ENHANCEMENTS =====
function initializeNavigation() {
    const nav = document.querySelector('nav');
    const logo = document.querySelector('.logo');
    
    // Enhanced scroll behavior for navigation
    let lastScrollY = window.scrollY;
    let ticking = false;
    
    function updateNavigation() {
        const scrollY = window.scrollY;
        
        if (scrollY > 100) {
            nav.style.background = 'rgba(10, 10, 11, 0.95)';
            nav.style.backdropFilter = 'blur(25px)';
        } else {
            nav.style.background = 'rgba(10, 10, 11, 0.8)';
            nav.style.backdropFilter = 'blur(20px)';
        }
        
        // Hide/show nav on scroll direction
        if (scrollY > lastScrollY && scrollY > 200) {
            nav.style.transform = 'translateY(-100%)';
        } else {
            nav.style.transform = 'translateY(0)';
        }
        
        lastScrollY = scrollY;
        ticking = false;
    }
    
    function requestNavUpdate() {
        if (!ticking) {
            requestAnimationFrame(updateNavigation);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestNavUpdate);
    
    // Logo pulse animation on click
    logo.addEventListener('click', function(e) {
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = 'scale(1.05)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        }, 100);
    });
}

// ===== ENHANCED CARD INTERACTIONS =====
function initializeCards() {
    const cards = document.querySelectorAll('.card');
    
    cards.forEach((card, index) => {
        // Enhanced click handling
        card.addEventListener('click', function(e) {
            // Prevent action if clicking on link
            if (e.target.tagName === 'A' || e.target.closest('a')) {
                return;
            }
            
            // Add click animation
            this.style.transform = 'translateY(-8px) scale(0.98)';
            setTimeout(() => {
                this.style.transform = 'translateY(-8px) scale(1.02)';
            }, 100);
            
            // Find and navigate to link
            const link = this.querySelector('a');
            if (link) {
                const href = link.getAttribute('href');
                
                // Add loading state
                this.classList.add('loading');
                
                setTimeout(() => {
                    if (href.startsWith('http')) {
                        window.open(href, '_blank');
                    } else {
                        window.location.href = href;
                    }
                    this.classList.remove('loading');
                }, 300);
                return;
            }
            
            // Fallback for cards without links
            const title = this.querySelector('h3').textContent;
            const description = this.querySelector('p').textContent;
            showNotification(`${title} - 詳細ページは準備中です`);
        });
        
        // Enhanced hover effects with mouse position
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            this.style.transform = `translateY(-8px) scale(1.02) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
        
        // Staggered entrance animation
        card.style.opacity = '0';
        card.style.transform = 'translateY(50px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 150 + 300);
    });
}

// ===== SCROLL ANIMATIONS =====
function initializeScrollAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe all animatable elements
    const animateElements = document.querySelectorAll('.card, .info-card, header h1, header p');
    animateElements.forEach(el => {
        observer.observe(el);
    });
    
    // Parallax effect for background
    let parallaxTicking = false;
    
    function updateParallax() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('header::before');
        
        parallaxElements.forEach(element => {
            const speed = 0.5;
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
        
        parallaxTicking = false;
    }
    
    function requestParallaxUpdate() {
        if (!parallaxTicking) {
            requestAnimationFrame(updateParallax);
            parallaxTicking = true;
        }
    }
    
    window.addEventListener('scroll', requestParallaxUpdate);
}

// ===== MOUSE EFFECTS (SIMPLIFIED FOR PERFORMANCE) =====
function initializeMouseEffects() {
    // Cursor effects removed for better performance
    // Focus on lightweight hover interactions instead
    console.log('Mouse effects initialized (lightweight mode)');
}

// ===== PERFORMANCE OPTIMIZATIONS =====
function initializePerformance() {
    // Preload critical images
    const criticalImages = document.querySelectorAll('img[data-preload]');
    criticalImages.forEach(img => {
        const imageUrl = img.dataset.src || img.src;
        if (imageUrl) {
            const preloadImg = new Image();
            preloadImg.src = imageUrl;
        }
    });
    
    // Lazy loading for non-critical images
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        imageObserver.unobserve(img);
                    }
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
    
    // Debounced resize handler
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            // Handle responsive adjustments
            handleResize();
        }, 250);
    });
}

// ===== FORM ENHANCEMENTS =====
function initializeForms() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input, textarea, select');
        
        // Enhanced input interactions
        inputs.forEach(input => {
            // Floating label effect
            input.addEventListener('focus', function() {
                this.parentElement.classList.add('focused');
            });
            
            input.addEventListener('blur', function() {
                if (!this.value) {
                    this.parentElement.classList.remove('focused');
                }
            });
            
            // Real-time validation
            input.addEventListener('input', function() {
                validateField(this);
            });
        });
        
        // Enhanced form submission
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            handleFormSubmission(this);
        });
    });
}

// ===== UTILITY FUNCTIONS =====
function validateField(field) {
    const value = field.value.trim();
    const fieldGroup = field.parentElement;
    
    // Remove existing validation classes
    fieldGroup.classList.remove('valid', 'invalid');
    
    if (field.hasAttribute('required') && !value) {
        fieldGroup.classList.add('invalid');
        return false;
    }
    
    // Email validation
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            fieldGroup.classList.add('invalid');
            return false;
        }
    }
    
    if (value) {
        fieldGroup.classList.add('valid');
    }
    
    return true;
}

function handleFormSubmission(form) {
    const submitBtn = form.querySelector('button[type=\"submit\"]');
    const originalText = submitBtn.textContent;
    
    // Add loading state
    submitBtn.disabled = true;
    submitBtn.textContent = '送信中...';
    submitBtn.classList.add('loading');
    
    // Collect form data
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    // Validate all fields
    const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });
    
    if (!isValid) {
        showNotification('必須項目を正しく入力してください', 'error');
        resetSubmitButton(submitBtn, originalText);
        return;
    }
    
    // Simulate form submission
    setTimeout(() => {
        showNotification('お問い合わせを受け付けました。24時間以内にご返信いたします。', 'success');
        form.reset();
        resetSubmitButton(submitBtn, originalText);
        
        // Reset validation classes
        form.querySelectorAll('.form-group').forEach(group => {
            group.classList.remove('focused', 'valid', 'invalid');
        });
    }, 2000);
}

function resetSubmitButton(button, originalText) {
    button.disabled = false;
    button.textContent = originalText;
    button.classList.remove('loading');
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Remove after delay
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 5000);
}

function handleResize() {
    // Cursor effects removed for performance
    
    // Recalculate animations if needed
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.style.transform = '';
    });
}

// ===== ACCESSIBILITY ENHANCEMENTS =====
document.addEventListener('keydown', function(e) {
    // Enhanced keyboard navigation
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
    }
});

document.addEventListener('mousedown', function() {
    document.body.classList.remove('keyboard-navigation');
});

// ===== THEME SYSTEM (FUTURE ENHANCEMENT) =====
function initializeThemeSystem() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // For future light/dark mode toggle
    // Currently using dark theme by default
}

// ===== ERROR HANDLING =====
window.addEventListener('error', function(e) {
    console.error('Application error:', e.error);
    // Could implement error reporting here
});

// ===== PAGE VISIBILITY API =====
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        // Pause non-critical animations when page is not visible
        document.body.classList.add('page-hidden');
    } else {
        document.body.classList.remove('page-hidden');
    }
});

// ===== INITIALIZE ON LOAD =====
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}