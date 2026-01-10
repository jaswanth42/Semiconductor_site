// script.js
document.addEventListener('DOMContentLoaded', function () {
    // ===== Scroll Animation Observer =====
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe all animate-on-scroll elements
    document.querySelectorAll('.animate-on-scroll').forEach((el) => scrollObserver.observe(el));

    // ===== Mobile Menu Setup =====
    setupMobileMenu();

    // ===== Page Transition for Navigation =====
    setupPageTransitions();

    // ===== Jobs Management =====
    if (window.location.pathname.includes('careers.html')) {
        loadJobsForCareers();
    }

    if (window.location.pathname.includes('admin-jobs.html')) {
        setupAdminJobsPage();
    }

    if (window.location.pathname.includes('admin-login.html')) {
        setupAdminLogin();
    }

    // ===== Update Admin Links =====
    updateAdminLink();

    // ===== Index Page Specific Logic =====
    if (window.location.pathname.includes('index.html') || window.location.pathname === '/' || window.location.pathname === '') {
        document.body.classList.add('index-page');
    }
});

// ===== MOBILE MENU FUNCTIONS =====
function setupMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', function (e) {
            e.stopPropagation();
            navLinks.classList.toggle('active');

            // Toggle icon
            const icon = menuToggle.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });

        // Close menu when clicking outside
        document.addEventListener('click', function (event) {
            if (navLinks.classList.contains('active') &&
                !navLinks.contains(event.target) &&
                !menuToggle.contains(event.target)) {
                navLinks.classList.remove('active');
                const icon = menuToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });

        // Close menu when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function () {
                navLinks.classList.remove('active');
                const icon = menuToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            });
        });
    }
}

// ===== PAGE TRANSITIONS =====
function setupPageTransitions() {
    const links = document.querySelectorAll('a:not([href^="#"]):not([target="_blank"]):not(.no-transition)');
    links.forEach(link => {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href && !href.startsWith('javascript:')) {
                e.preventDefault();

                // Create transition overlay
                const overlay = document.createElement('div');
                overlay.className = 'page-transition-overlay active';
                document.body.appendChild(overlay);

                // Navigate after delay
                setTimeout(() => {
                    window.location.href = href;
                }, 300);
            }
        });
    });
}

// ===== JOBS MANAGEMENT FUNCTIONS =====

// API base URL - adjust if needed for your server setup
const API_URL = 'api/jobs.php';

// Load jobs for careers page
async function loadJobsForCareers() {
    const jobsContainer = document.getElementById('jobsContainer');
    const noJobsMessage = document.getElementById('noJobsMessage');

    if (!jobsContainer) {
        console.error('Jobs container not found!');
        return;
    }

    try {
        // Fetch jobs from PHP API
        const response = await fetch(API_URL);
        const data = await response.json();
        const jobs = data.jobs || [];

        console.log('Loading jobs:', jobs);

        // Clear container
        jobsContainer.innerHTML = '';

        // Check if there are jobs
        if (jobs.length === 0) {
            if (noJobsMessage) {
                noJobsMessage.style.display = 'block';
            }
            console.log('No jobs found');
            return;
        }

        if (noJobsMessage) {
            noJobsMessage.style.display = 'none';
        }

        // Add delay classes for staggered animation
        const delays = ['delay-100', 'delay-200', 'delay-300', 'delay-400', 'delay-500'];

        // Create job cards
        jobs.forEach((job, index) => {
            const card = document.createElement('div');
            card.className = `card animate-on-scroll ${delays[index % delays.length]}`;

            // Use applyLink if provided, otherwise fallback to contact page
            const applyUrl = job.applyLink || `contact.html?job=${encodeURIComponent(job.title)}`;
            const isExternalLink = job.applyLink ? 'target="_blank" rel="noopener noreferrer"' : '';

            card.innerHTML = `
                <h3>${job.title}</h3>
                <p><strong>${job.location}</strong> • ${job.type}</p>
                <p style="font-size: 0.9rem; margin-bottom: 15px;">${job.description}</p>
                <a href="${applyUrl}" ${isExternalLink} class="btn btn-outline" style="margin-top: 15px;">Apply Now</a>
            `;

            jobsContainer.appendChild(card);
        });

        // Re-observe the new elements for animations
        setTimeout(() => {
            const scrollObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    }
                });
            }, { threshold: 0.1 });

            document.querySelectorAll('.animate-on-scroll').forEach((el) => scrollObserver.observe(el));
        }, 100);
    } catch (error) {
        console.error('Error loading jobs:', error);
        if (noJobsMessage) {
            noJobsMessage.textContent = 'Error loading jobs. Please try again later.';
            noJobsMessage.style.display = 'block';
        }
    }
}

// Setup admin jobs page
function setupAdminJobsPage() {
    // Check authentication
    if (localStorage.getItem('adminLoggedIn') !== 'true') {
        window.location.href = 'admin-login.html';
        return;
    }

    // Load existing jobs
    loadJobsForAdmin();

    // Setup form submission
    const jobForm = document.getElementById('jobForm');
    if (jobForm) {
        jobForm.addEventListener('submit', handleJobFormSubmit);

        // Add input listeners for live preview
        ['jobTitle', 'jobLocation', 'jobType', 'jobDescription', 'applyLink'].forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('input', updatePreview);
                element.addEventListener('change', updatePreview);
            }
        });

        // Initial preview
        updatePreview();
    }
}

// Load jobs for admin page
async function loadJobsForAdmin() {
    const jobsList = document.getElementById('jobsList');
    if (!jobsList) return;

    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        const jobs = data.jobs || [];

        jobsList.innerHTML = '';

        if (jobs.length === 0) {
            jobsList.innerHTML = '<p style="color: #888; text-align: center;">No jobs added yet. Use the form above to add your first job.</p>';
            return;
        }

        jobs.forEach(job => {
            const jobElement = document.createElement('div');
            jobElement.className = 'job-item';
            jobElement.innerHTML = `
                <div class="job-info">
                    <h4>${job.title}</h4>
                    <p><strong>Location:</strong> ${job.location}</p>
                    <p><strong>Type:</strong> ${job.type}</p>
                    <p>${job.description}</p>
                    <p><strong>Apply Link:</strong> <a href="${job.applyLink}" target="_blank" style="color: var(--primary); word-break: break-all;">${job.applyLink || 'Not set'}</a></p>
                </div>
                <div class="job-actions">
                    <button onclick="deleteJob('${job.id}')" class="btn-danger">Delete</button>
                </div>
            `;
            jobsList.appendChild(jobElement);
        });
    } catch (error) {
        console.error('Error loading jobs for admin:', error);
        jobsList.innerHTML = '<p style="color: #ff4444;">Error loading jobs. Make sure PHP server is running.</p>';
    }
}

// Setup admin login page
function setupAdminLogin() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            // Simple authentication
            if (username === 'admin' && password === 'admin123') {
                localStorage.setItem('adminLoggedIn', 'true');
                window.location.href = 'admin-jobs.html';
            } else {
                alert('Invalid credentials. Try: admin/admin123');
            }
        });
    }

    // Redirect if already logged in
    if (localStorage.getItem('adminLoggedIn') === 'true') {
        window.location.href = 'admin-jobs.html';
    }
}

// Handle job form submission
async function handleJobFormSubmit(e) {
    e.preventDefault();

    const newJob = {
        title: document.getElementById('jobTitle').value,
        location: document.getElementById('jobLocation').value,
        type: document.getElementById('jobType').value,
        description: document.getElementById('jobDescription').value,
        applyLink: document.getElementById('applyLink').value
    };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newJob)
        });

        const data = await response.json();

        if (data.success) {
            loadJobsForAdmin();
            clearJobForm();
            alert('Job added successfully!');
        } else {
            alert('Error adding job: ' + (data.message || 'Unknown error'));
        }
    } catch (error) {
        console.error('Error adding job:', error);
        alert('Error adding job. Make sure PHP server is running.');
    }
}

// Delete a job - made globally accessible
window.deleteJob = async function (id) {
    console.log('Deleting job ID:', id);
    try {
        const response = await fetch(API_URL, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: id })
        });

        const data = await response.json();
        console.log('Delete response:', data);

        if (data.success) {
            alert('Job deleted successfully!');
            loadJobsForAdmin();
        } else {
            alert('Error deleting job: ' + (data.message || 'Unknown error'));
        }
    } catch (error) {
        console.error('Error deleting job:', error);
        alert('Error deleting job. Make sure PHP server is running.');
    }
}

// Update job preview
function updatePreview() {
    const preview = document.getElementById('jobPreview');
    if (!preview) return;

    const title = document.getElementById('jobTitle').value || 'Job Title';
    const location = document.getElementById('jobLocation').value || 'Location';
    const type = document.getElementById('jobType').value;
    const description = document.getElementById('jobDescription').value || 'Job description goes here.';
    const applyLink = document.getElementById('applyLink')?.value || '#';

    preview.innerHTML = `
        <h3>${title}</h3>
        <p><strong>${location} • ${type}</strong></p>
        <p>${description}</p>
        <p style="font-size: 0.85rem; color: #888;"><strong>Apply Link:</strong> ${applyLink || 'Not set'}</p>
        <a href="#" class="btn btn-outline" style="margin-top: 15px;">Apply Now</a>
    `;
}

// Clear form function
function clearJobForm() {
    const form = document.getElementById('jobForm');
    if (form) {
        form.reset();
        updatePreview();
    }
}

function clearForm() {
    clearJobForm();
    alert('Form cleared successfully!');
}

// Update admin link
function updateAdminLink() {
    const adminLinks = document.querySelectorAll('.nav-links .admin-link');
    const isLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';

    adminLinks.forEach(link => {
        if (isLoggedIn) {
            link.href = 'admin-jobs.html';
            link.innerHTML = 'Admin';
        } else {
            link.href = 'admin-login.html';
            link.innerHTML = 'Admin';
        }
    });
}

// ===== GLOBAL HELPER FUNCTIONS =====
function logout() {
    localStorage.removeItem('adminLoggedIn');
    window.location.href = 'admin-login.html';
}
const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbx0QtZ16dvoJsv5x0j5ZCmmss8kDHWvLsK1cvZpCSyK1qpAcG45ZKVl4TIGC2u6ZVp84w/exec";

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("contactForm");
    const statusEl = document.getElementById("formStatus");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const payload = {
            name: formData.get("name"),
            email: formData.get("email"),
            message: formData.get("message"),
        };

        statusEl.textContent = "Sending...";

        try {
            const res = await fetch(WEB_APP_URL, {
                method: "POST",
                headers: { "Content-Type": "text/plain;charset=utf-8" },
                body: JSON.stringify(payload),
            });

            const out = await res.json();

            if (out.status === "success") {
                statusEl.textContent = "✅ Message sent successfully!";
                form.reset();
            } else {
                statusEl.textContent = "❌ Error: " + (out.message || "Unknown error");
            }
        } catch (err) {
            statusEl.textContent = "❌ Network error. Please try again.";
        }
    });
});






