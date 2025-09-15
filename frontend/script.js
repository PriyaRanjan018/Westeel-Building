// API Configuration - Update this after deployment
const API_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:3000/api'
    : 'https://westeel-building.vercel.app/api'; // Will update with actual URL

// DOM Elements
const preloader = document.getElementById('preloader');
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const contactForm = document.getElementById('contactForm');
const newsletterForm = document.getElementById('newsletterForm');
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modalTitle');
const modalMessage = document.getElementById('modalMessage');

// Hide preloader when page loads
window.addEventListener('load', () => {
    setTimeout(() => {
        preloader.style.display = 'none';
    }, 500);
});

// Mobile menu toggle
hamburger?.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// Smooth scrolling
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// Active nav link on scroll
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
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

// Counter animation
const counters = document.querySelectorAll('.stat-number[data-target]');
const observerOptions = {
    threshold: 0.5
};

const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const counter = entry.target;
            const target = +counter.getAttribute('data-target');
            const increment = target / 100;
            
            const updateCounter = () => {
                const current = +counter.innerText;
                if (current < target) {
                    counter.innerText = Math.ceil(current + increment);
                    setTimeout(updateCounter, 20);
                } else {
                    counter.innerText = target;
                }
            };
            
            updateCounter();
            counterObserver.unobserve(counter);
        }
    });
}, observerOptions);

counters.forEach(counter => {
    counterObserver.observe(counter);
});

// Load projects
const projectsData = [
    {
        title: 'Wildstone Infra Hotel',
        category: 'commercial',
        address: '2715 Ash Dr. San Jose',
        image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400'
    },
    {
        title: 'Wish Stone Building',
        category: 'commercial',
        address: '2972 Westheimer Rd.',
        image: 'https://images.unsplash.com/photo-1479839672679-a46483c0e7c8?w=400'
    },
    {
        title: 'Mr. Parkinston\'s House',
        category: 'residential',
        address: '3517 W. Gray St. Utica',
        image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400'
    },
    {
        title: 'Oregano Height',
        category: 'residential',
        address: '2464 Royal Ln. Mesa',
        image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400'
    }
];

function loadProjects(filter = 'all') {
    const container = document.getElementById('projectsContainer');
    if (!container) return;
    
    const filtered = filter === 'all' 
        ? projectsData 
        : projectsData.filter(p => p.category === filter);
    
    container.innerHTML = filtered.map(project => `
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
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        loadProjects(btn.dataset.filter);
    });
});

// Load projects on page load
loadProjects();

// Contact form submission
contactForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        reason: document.getElementById('reason').value,
        message: document.getElementById('message').value
    };
    
    try {
        const response = await fetch(`${API_URL}/contact`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showModal('Success!', 'Your message has been sent successfully. We will get back to you soon!');
            contactForm.reset();
        } else {
            showModal('Error', data.message || 'Failed to send message. Please try again.');
        }
    } catch (error) {
        console.error('Error:', error);
        showModal('Error', 'Failed to send message. Please check your connection and try again.');
    }
});

// Newsletter form submission
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
        
        const data = await response.json();
        
        if (response.ok) {
            showModal('Success!', 'You have been subscribed to our newsletter!');
            newsletterForm.reset();
        } else {
            showModal('Error', data.message || 'Failed to subscribe. Please try again.');
        }
    } catch (error) {
        console.error('Error:', error);
        showModal('Error', 'Failed to subscribe. Please check your connection and try again.');
    }
});

// Show modal
function showModal(title, message) {
    modalTitle.textContent = title;
    modalMessage.textContent = message;
    modal.classList.add('show');
}

// Close modal
document.querySelector('.close')?.addEventListener('click', () => {
    modal.classList.remove('show');
});

modal?.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.classList.remove('show');
    }
});