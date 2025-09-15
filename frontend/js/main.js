// ==================== MAIN JAVASCRIPT FILE ====================

// API Configuration
const API_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:5000/api'
    : 'https://westeel-building.vercel.app/api';

// DOM Elements
const preloader = document.getElementById('preloader');
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const contactForm = document.getElementById('contactForm');
const newsletterForm = document.getElementById('newsletterForm');
const projectsGrid = document.getElementById('projectsGrid');

// Sample project data (will be replaced with API data)
const sampleProjects = [
    {
        _id: '1',
        title: 'Wildstone Infra Hotel',
        category: 'commercial',
        address: '2715 Ash Dr. San Jose',
        image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400'
    },
    {
        _id: '2',
        title: 'Wish Stone Building',
        category: 'commercial',
        address: '2972 Westheimer Rd.',
        image: 'https://images.unsplash.com/photo-1479839672679-a46483c0e7c8?w=400'
    },
    {
        _id: '3',
        title: 'Mr. Parkinston\'s House',
        category: 'residential',
        address: '3517 W. Gray St. Utica',
        image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400'
    },
    {
        _id: '4',
        title: 'Oregano Height',
        category: 'residential',
        address: '2464 Royal Ln. Mesa',
        image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400'
    }
];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Hide preloader
    setTimeout(() => {
        preloader.classList.add('hide');
    }, 1000);
    
    // Initialize components
    initNavigation();
    initAnimations();
    initCounters();
    loadProjects();
    initForms();
});

// Navigation
function initNavigation() {
    // Mobile menu toggle
    hamburger?.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
    
    // Close mobile menu on link click
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });
    
    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Active nav link
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === current) {
                link.classList.add('active');
            }
        });
    });
}

// Smooth scroll
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// Animations
function initAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.rep-card, .service-card, .project-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
}

// Counter animation
function initCounters() {
    const counters = document.querySelectorAll('.stat-number[data-target]');
    
    const startCounting = (counter) => {
        const target = +counter.getAttribute('data-target');
        const increment = target / 200;
        
        const updateCount = () => {
            const current = +counter.innerText;
            
            if (current < target) {
                counter.innerText = Math.ceil(current + increment);
                setTimeout(updateCount, 10);
            } else {
                counter.innerText = target;
            }
        };
        
        updateCount();
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                startCounting(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => observer.observe(counter));
}

// Load projects
function loadProjects(filter = 'all') {
    if (!projectsGrid) return;
    
    // Filter projects
    const filteredProjects = filter === 'all' 
        ? sampleProjects 
        : sampleProjects.filter(p => p.category === filter);
    
    // Render projects
    projectsGrid.innerHTML = filteredProjects.map(project => `
        <div class="project-card">
            <div class="project-image">
                <img src="${project.image}" alt="${project.title}" style="width:100%;height:100%;object-fit:cover;">
                <span class="project-category">${project.category}</span>
            </div>
            <div class="project-info">
                <h3>${project.title}</h3>
                <p><i class="fas fa-map-marker-alt"></i> ${project.address}</p>
            </div>
        </div>
    `).join('');
}

// Project filters
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        // Update active state
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Load filtered projects
        const filter = btn.getAttribute('data-filter');
        loadProjects(filter);
    });
});

// Forms
function initForms() {
    // Contact form
    contactForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);
        
        try {
            const response = await fetch(`${API_URL}/contact`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            
            if (response.ok) {
                alert('Message sent successfully!');
                contactForm.reset();
            } else {
                alert('Failed to send message. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to send message. Please try again.');
        }
    });
    
    // Newsletter form
    newsletterForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = e.target.querySelector('input[type="email"]').value;
        
        try {
            const response = await fetch(`${API_URL}/newsletter`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            });
            
            if (response.ok) {
                alert('Successfully subscribed to newsletter!');
                newsletterForm.reset();
            } else {
                alert('Failed to subscribe. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to subscribe. Please try again.');
        }
    });
}

// Featured project navigation
let currentProjectIndex = 0;

function previousProject() {
    currentProjectIndex = currentProjectIndex > 0 ? currentProjectIndex - 1 : sampleProjects.length - 1;
    updateFeaturedProject();
}

function nextProject() {
    currentProjectIndex = currentProjectIndex < sampleProjects.length - 1 ? currentProjectIndex + 1 : 0;
    updateFeaturedProject();
}

function updateFeaturedProject() {
    const project = sampleProjects[currentProjectIndex];
    const featureBox = document.querySelector('.feature-box h3');
    if (featureBox) {
        featureBox.textContent = project.title;
    }
}