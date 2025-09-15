// Mobile Menu Toggle
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const mainNav = document.querySelector('.main-nav');

mobileMenuToggle?.addEventListener('click', () => {
    mainNav.classList.toggle('active');
});

// Smooth Scrolling
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

// Project Filtering
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        // Add active class to clicked button
        button.classList.add('active');
        
        const filter = button.getAttribute('data-filter');
        
        projectCards.forEach(card => {
            if (filter === 'all' || card.getAttribute('data-category') === filter) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });
});

// Contact Form Handler
const contactForm = document.getElementById('contactForm');

contactForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        reason: document.getElementById('reason').value,
        phone: document.getElementById('phone').value,
        message: document.getElementById('message').value
    };
    
    try {
        const response = await fetch('/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        if (response.ok) {
            alert('Thank you for contacting us! We will get back to you soon.');
            contactForm.reset();
        } else {
            alert('Something went wrong. Please try again.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to send message. Please try again later.');
    }
});

// Newsletter Form Handler
const newsletterForm = document.querySelector('.newsletter-form');

newsletterForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = e.target.querySelector('input[type="email"]').value;
    
    try {
        const response = await fetch('/api/newsletter', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email })
        });
        
        if (response.ok) {
            alert('Successfully subscribed to our newsletter!');
            e.target.reset();
        } else {
            alert('Something went wrong. Please try again.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to subscribe. Please try again later.');
    }
});

// Intersection Observer for Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.reputation-card, .service-card, .project-card, .stat-card').forEach(el => {
    observer.observe(el);
});

// Stats Counter Animation
const stats = document.querySelectorAll('.stat-card h3');
const statsSection = document.querySelector('.experience');
let hasAnimated = false;

const animateStats = () => {
    stats.forEach(stat => {
        const target = parseInt(stat.innerText);
        let current = 0;
        const increment = target / 50;
        
        const updateCounter = () => {
            if (current < target) {
                current += increment;
                stat.innerText = Math.ceil(current);
                setTimeout(updateCounter, 30);
            } else {
                stat.innerText = target;
            }
        };
        
        updateCounter();
    });
};

// Check if stats section is in view
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !hasAnimated) {
            animateStats();
            hasAnimated = true;
        }
    });
}, { threshold: 0.5 });

if (statsSection) {
    statsObserver.observe(statsSection);
}

// Project Navigation
let currentProjectPage = 0;
const projectsPerPage = 4;
const allProjects = Array.from(projectCards);
const totalPages = Math.ceil(allProjects.length / projectsPerPage);

const updateProjectDisplay = () => {
    const start = currentProjectPage * projectsPerPage;
    const end = start + projectsPerPage;
    
    allProjects.forEach((project, index) => {
        if (index >= start && index < end) {
            project.style.display = 'block';
        } else {
            project.style.display = 'none';
        }
    });
    
    // Update pagination dots
    document.querySelectorAll('.dot').forEach((dot, index) => {
        dot.classList.toggle('active', index === currentProjectPage);
    });
};

// Project navigation buttons
document.querySelectorAll('.project-navigation .prev').forEach(btn => {
    btn.addEventListener('click', () => {
        if (currentProjectPage > 0) {
            currentProjectPage--;
            updateProjectDisplay();
        }
    });
});

document.querySelectorAll('.project-navigation .next').forEach(btn => {
    btn.addEventListener('click', () => {
        if (currentProjectPage < totalPages - 1) {
            currentProjectPage++;
            updateProjectDisplay();
        }
    });
});

// Pagination dots click handler
document.querySelectorAll('.dot').forEach((dot, index) => {
    dot.addEventListener('click', () => {
        currentProjectPage = index;
        updateProjectDisplay();
    });
});