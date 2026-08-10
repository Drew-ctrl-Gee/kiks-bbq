// ===== PAGE LOADER =====
window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('loader').classList.add('hidden');
    }, 2200);
});

// ===== CANVAS PARTICLE NETWORK =====
const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');
let particles = [];
let mouse = { x: null, y: null };

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 1.5 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.4;
        this.speedY = (Math.random() - 0.5) * 0.4;
        this.opacity = Math.random() * 0.3 + 0.1;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;

        if (mouse.x !== null) {
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 150) {
                this.x -= dx * 0.01;
                this.y -= dy * 0.01;
            }
        }
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 107, 53, ${this.opacity})`;
        ctx.fill();
    }
}

function initParticles() {
    particles = [];
    const count = Math.min(
        Math.floor((canvas.width * canvas.height) / 12000), 
        120
    );
    for (let i = 0; i < count; i++) {
        particles.push(new Particle());
    }
}
initParticles();
window.addEventListener('resize', initParticles);

function connectParticles() {
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 120) {
                const opacity = (1 - dist / 120) * 0.15;
                ctx.beginPath();
                ctx.strokeStyle = `rgba(255, 107, 53, ${opacity})`;
                ctx.lineWidth = 0.5;
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    connectParticles();
    requestAnimationFrame(animateParticles);
}
animateParticles();

document.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

// ===== CUSTOM CURSOR =====
const dot = document.createElement('div');
dot.className = 'cursor-dot';
document.body.appendChild(dot);

const ring = document.createElement('div');
ring.className = 'cursor-ring';
document.body.appendChild(ring);

let mouseX = 0, mouseY = 0;
let ringX = 0, ringY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX - 3 + 'px';
    dot.style.top = mouseY - 3 + 'px';
});

function animateRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    ring.style.left = ringX - 20 + 'px';
    ring.style.top = ringY - 20 + 'px';
    requestAnimationFrame(animateRing);
}
animateRing();

const hoverElements = document.querySelectorAll(
    'a, button, .menu-card, .location-card, .contact-item, .badge, .btn'
);

hoverElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
        dot.classList.add('hovering');
        ring.classList.add('hovering');
    });
    el.addEventListener('mouseleave', () => {
        dot.classList.remove('hovering');
        ring.classList.remove('hovering');
    });
});

// ===== HAMBURGER =====
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('open');
    });
});

// ===== NAVBAR SCROLL =====
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 80) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ===== ACTIVE NAV =====
const sections = document.querySelectorAll('section');
const navItems = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const top = section.offsetTop - 100;
        if (window.scrollY >= top) {
            current = section.getAttribute('id');
        }
    });
    navItems.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// ===== SCROLL ANIMATIONS =====
const animateObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

document.querySelectorAll(`
    .section-title,
    .section-sub,
    .menu-card,
    .location-card,
    .contact-item,
    .contact-form,
    .footer-info,
    .badge,
    .about-img,
    .about-text
`).forEach(el => animateObserver.observe(el));

// ===== PARALLAX HERO =====
window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const heroContent = document.querySelector('.hero-content');
    
    if (heroContent && scrolled < window.innerHeight) {
        heroContent.style.transform = 
            `translateY(${scrolled * 0.25}px)`;
        heroContent.style.opacity = 
            Math.max(0, 1 - (scrolled / (window.innerHeight * 0.8)));
    }
});

// ===== 3D TILT ON CARDS =====
document.querySelectorAll('.menu-card, .location-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 25;
        const rotateY = (centerX - x) / 25;

        card.style.transform = 
            `perspective(1000px) 
             rotateX(${rotateX}deg) 
             rotateY(${rotateY}deg) 
             translateY(-8px) 
             scale(1.01)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
    });
});

// ===== MAGNETIC BUTTONS =====
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = 
            `translate(${x * 0.25}px, ${y * 0.25}px)`;
    });

    btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
    });
});

// ===== CONTACT FORM =====
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = contactForm.querySelector(
        'input[type="text"]').value;
    const phone = contactForm.querySelector(
        'input[type="tel"]').value;

    contactForm.innerHTML = `
        <div class="success-msg">
            <div class="success-icon">✅</div>
            <h3>Message Sent!</h3>
            <p>Thank you <strong>${name}</strong>!</p>
            <p>We'll reach you on 
               <strong>${phone}</strong></p>
            <button onclick="location.reload()" 
                    class="btn btn-primary"
                    style="margin-top:20px">
                <i class="fas fa-redo"></i> Send Another
            </button>
        </div>
    `;
});

// ===== WHATSAPP + BACK TO TOP =====
const waBtn = document.createElement('a');
waBtn.href = 'https://wa.me/254719518191';
waBtn.target = '_blank';
waBtn.className = 'whatsapp-float';
waBtn.innerHTML = '<i class="fab fa-whatsapp"></i>';
document.body.appendChild(waBtn);

const topBtn = document.createElement('a');
topBtn.href = '#home';
topBtn.className = 'back-to-top';
topBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
document.body.appendChild(topBtn);

window.addEventListener('scroll', () => {
    if (window.scrollY > 600) {
        topBtn.classList.add('show');
    } else {
        topBtn.classList.remove('show');
    }
});

// ===== PRICE COUNT UP =====
const priceObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const el = entry.target;
            const text = el.textContent;
            const match = text.match(/\d+/);
            if (match) {
                const target = parseInt(match[0]);
                let current = 0;
                const step = target / 40;
                const prefix = text.split(match[0])[0];
                const suffix = text.split(match[0])[1] || '';
                const counter = setInterval(() => {
                    current += step;
                    if (current >= target) {
                        current = target;
                        clearInterval(counter);
                    }
                    el.textContent = 
                        prefix + Math.floor(current) + suffix;
                }, 25);
            }
            priceObserver.unobserve(el);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.price').forEach(el => {
    priceObserver.observe(el);
});

// ===== SMOOTH SECTION REVEAL =====
const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.03 });

document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 
        'opacity 1s cubic-bezier(0.16, 1, 0.3, 1), transform 1s cubic-bezier(0.16, 1, 0.3, 1)';
    sectionObserver.observe(section);
});

// ===== YEAR UPDATE =====
const yearElements = document.querySelectorAll('.footer-bottom p');
if (yearElements.length > 0) {
    const year = new Date().getFullYear();
    yearElements[0].innerHTML = 
        yearElements[0].innerHTML.replace('2025', year);
}

// ===== REVIEWS SLIDER =====
const track = document.getElementById('reviewsTrack');
const cards = document.querySelectorAll('.review-card');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const dotsContainer = document.getElementById('sliderDots');

let currentIndex = 0;
let cardsPerView = 3;
let totalSlides = Math.ceil(cards.length / cardsPerView);
let autoSlideInterval;

// Calculate cards per view based on screen size
function updateCardsPerView() {
    if (window.innerWidth <= 640) {
        cardsPerView = 1;
    } else if (window.innerWidth <= 900) {
        cardsPerView = 2;
    } else {
        cardsPerView = 3;
    }
    totalSlides = Math.ceil(cards.length / cardsPerView);
    createDots();
    goToSlide(0);
}

// Create dots
function createDots() {
    dotsContainer.innerHTML = '';
    for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('div');
        dot.className = 'dot';
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => {
            currentIndex = i;
            goToSlide(i);
            resetAutoSlide();
        });
        dotsContainer.appendChild(dot);
    }
}

// Go to specific slide
function goToSlide(index) {
    const cardWidth = cards[0].offsetWidth + 24;
    const offset = -(index * cardWidth * cardsPerView);
    track.style.transform = `translateX(${offset}px)`;
    
    // Update dots
    document.querySelectorAll('.dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
    });
}

// Next slide
function nextSlide() {
    currentIndex = (currentIndex + 1) % totalSlides;
    goToSlide(currentIndex);
}

// Previous slide
function prevSlide() {
    currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
    goToSlide(currentIndex);
}

// Auto slide
function startAutoSlide() {
    autoSlideInterval = setInterval(nextSlide, 5000);
}

function resetAutoSlide() {
    clearInterval(autoSlideInterval);
    startAutoSlide();
}

// Button events
if (nextBtn && prevBtn) {
    nextBtn.addEventListener('click', () => {
        nextSlide();
        resetAutoSlide();
    });

    prevBtn.addEventListener('click', () => {
        prevSlide();
        resetAutoSlide();
    });
}

// Touch support
let touchStartX = 0;
let touchEndX = 0;

if (track) {
    track.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });

    track.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
}

function handleSwipe() {
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
        if (diff > 0) nextSlide();
        else prevSlide();
        resetAutoSlide();
    }
}

// Initialize
if (track && cards.length > 0) {
    updateCardsPerView();
    startAutoSlide();
    window.addEventListener('resize', updateCardsPerView);
}

// ===== STATS COUNT UP =====
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const numberEl = entry.target;
            const target = parseInt(numberEl.getAttribute('data-count'));
            let current = 0;
            const step = target / 50;
            
            const counter = setInterval(() => {
                current += step;
                if (current >= target) {
                    current = target;
                    clearInterval(counter);
                }
                numberEl.textContent = Math.floor(current);
                if (target >= 500) {
                    numberEl.textContent = Math.floor(current) + '+';
                }
            }, 30);
            
            statsObserver.unobserve(numberEl);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('[data-count]').forEach(el => {
    statsObserver.observe(el);
});

// ===== STAR RATING SYSTEM =====
const stars = document.querySelectorAll('.star-rating i');
const ratingText = document.getElementById('ratingText');
let selectedRating = 0;

const ratingLabels = {
    1: '⭐ Poor',
    2: '⭐⭐ Fair', 
    3: '⭐⭐⭐ Good',
    4: '⭐⭐⭐⭐ Very Good',
    5: '⭐⭐⭐⭐⭐ Excellent!'
};

// Hover effect
stars.forEach((star, index) => {
    star.addEventListener('mouseenter', () => {
        stars.forEach((s, i) => {
            if (i <= index) {
                s.classList.add('hovered');
            } else {
                s.classList.remove('hovered');
            }
        });
        ratingText.textContent = ratingLabels[index + 1];
        ratingText.classList.add('rated');
    });

    star.addEventListener('mouseleave', () => {
        stars.forEach(s => s.classList.remove('hovered'));
        if (selectedRating === 0) {
            ratingText.textContent = 'Click to rate';
            ratingText.classList.remove('rated');
        } else {
            ratingText.textContent = ratingLabels[selectedRating];
        }
    });

    // Click to select
    star.addEventListener('click', () => {
        selectedRating = index + 1;
        stars.forEach((s, i) => {
            if (i < selectedRating) {
                s.classList.add('active');
            } else {
                s.classList.remove('active');
            }
        });
        ratingText.textContent = ratingLabels[selectedRating];
        ratingText.classList.add('rated');
    });
});

// ===== REVIEW FORM SUBMIT =====
const reviewForm = document.getElementById('reviewForm');
const reviewsTrack = document.getElementById('reviewsTrack');

// Load saved reviews on page load
loadSavedReviews();

if (reviewForm) {
    reviewForm.addEventListener('submit', (e) => {
        e.preventDefault();

        if (selectedRating === 0) {
            alert('Please select a rating!');
            return;
        }

        const name = document.getElementById('reviewName').value;
        const title = document.getElementById('reviewTitle').value;
        const message = document.getElementById('reviewMessage').value;

        // Create review object
        const newReview = {
            name: name,
            title: title,
            message: message,
            rating: selectedRating,
            date: new Date().toISOString()
        };

        // Save to localStorage
        saveReview(newReview);

        // Add to slider
        addReviewToSlider(newReview, true);

        // Show success message
        reviewForm.innerHTML = `
            <div class="review-success">
                <div class="review-success-icon">
                    <i class="fas fa-check"></i>
                </div>
                <h3>Thank You, ${name}! 🎉</h3>
                <p>
                    Your <strong>${selectedRating}-star</strong> 
                    review has been added! We really appreciate 
                    your feedback and hope to see you again soon.
                </p>
                <button onclick="location.reload()" 
                        class="btn btn-primary">
                    <i class="fas fa-plus"></i> Add Another Review
                </button>
            </div>
        `;

        // Scroll to reviews slider to show new review
        setTimeout(() => {
            document.querySelector('.reviews-slider')
                .scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'center' 
                });
        }, 500);
    });
}

// Save review to localStorage
function saveReview(review) {
    let reviews = JSON.parse(
        localStorage.getItem('kikisReviews') || '[]'
    );
    reviews.unshift(review); // Add to beginning
    localStorage.setItem('kikisReviews', JSON.stringify(reviews));
}

// Load saved reviews from localStorage
function loadSavedReviews() {
    const reviews = JSON.parse(
        localStorage.getItem('kikisReviews') || '[]'
    );
    reviews.forEach(review => {
        addReviewToSlider(review, false);
    });
}

// Add review to slider
function addReviewToSlider(review, isNew) {
    if (!reviewsTrack) return;

    // Generate initials
    const initials = review.name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

    // Generate stars HTML
    let starsHTML = '';
    for (let i = 0; i < 5; i++) {
        if (i < review.rating) {
            starsHTML += '<i class="fas fa-star"></i>';
        } else {
            starsHTML += '<i class="far fa-star" style="color:rgba(255,255,255,0.1)"></i>';
        }
    }

    // Create review card
    const newCard = document.createElement('div');
    newCard.className = 'review-card';
    newCard.innerHTML = `
        <div class="review-stars">
            ${starsHTML}
        </div>
        <p class="review-text">
            "${review.message}"
        </p>
        <div class="reviewer">
            <div class="reviewer-avatar">${initials}</div>
            <div class="reviewer-info">
                <h4>
                    ${review.name}
                    ${isNew ? '<span class="new-review-badge">NEW</span>' : ''}
                </h4>
                <span>${review.title}</span>
            </div>
        </div>
    `;

    // Add to beginning of track
    reviewsTrack.insertBefore(newCard, reviewsTrack.firstChild);

    // Update slider
    if (typeof updateCardsPerView === 'function') {
        setTimeout(() => updateCardsPerView(), 100);
    }
}