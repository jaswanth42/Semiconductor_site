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

// Load jobs for careers page
function loadJobsForCareers() {
    const jobsContainer = document.getElementById('jobsContainer');
    const noJobsMessage = document.getElementById('noJobsMessage');

    if (!jobsContainer) {
        console.error('Jobs container not found!');
        return;
    }

    // Get jobs from localStorage
    const jobs = getJobs();
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

        let requirementsHtml = '';
        if (job.requirements && job.requirements.length > 0) {
            requirementsHtml = '<ul style="margin-top: 10px; padding-left: 20px;">' +
                job.requirements.map(req => `<li style="margin-bottom: 5px; font-size: 0.9rem;">${req}</li>`).join('') +
                '</ul>';
        }

        card.innerHTML = `
            <h3>${job.title}</h3>
            <p><strong>${job.location}</strong> • ${job.type}</p>
            <p style="font-size: 0.9rem; margin-bottom: 15px;">${job.description}</p>
            ${requirementsHtml}
            <a href="contact.html?job=${encodeURIComponent(job.title)}" class="btn btn-outline" style="margin-top: 15px;">Apply Now</a>
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
        ['jobTitle', 'jobLocation', 'jobType', 'jobDescription', 'jobRequirements'].forEach(id => {
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
function loadJobsForAdmin() {
    const jobsList = document.getElementById('jobsList');
    if (!jobsList) return;

    const jobs = getJobs();
    jobsList.innerHTML = '';

    jobs.forEach(job => {
        const jobElement = document.createElement('div');
        jobElement.className = 'job-item';
        jobElement.innerHTML = `
            <div class="job-info">
                <h4>${job.title}</h4>
                <p><strong>Location:</strong> ${job.location}</p>
                <p><strong>Type:</strong> ${job.type}</p>
                <p>${job.description}</p>
            </div>
            <div class="job-actions">
                <button onclick="deleteJob(${job.id})" class="btn-danger">Delete</button>
            </div>
        `;
        jobsList.appendChild(jobElement);
    });
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
function handleJobFormSubmit(e) {
    e.preventDefault();

    const newJob = {
        id: Date.now(), // Unique ID based on timestamp
        title: document.getElementById('jobTitle').value,
        location: document.getElementById('jobLocation').value,
        type: document.getElementById('jobType').value,
        description: document.getElementById('jobDescription').value,
        requirements: document.getElementById('jobRequirements').value
            .split('\n')
            .filter(req => req.trim() !== '')
    };

    const jobs = getJobs();
    jobs.push(newJob);
    saveJobs(jobs);

    loadJobsForAdmin();
    clearJobForm();
    alert('Job added successfully!');
}

// Delete a job
function deleteJob(id) {
    if (confirm('Are you sure you want to delete this job?')) {
        let jobs = getJobs();
        jobs = jobs.filter(job => job.id !== id);
        saveJobs(jobs);
        loadJobsForAdmin();
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
    const requirements = document.getElementById('jobRequirements').value;

    let requirementsHtml = '';
    if (requirements) {
        requirementsHtml = '<ul style="margin-top: 10px; padding-left: 20px;">' +
            requirements.split('\n')
                .filter(req => req.trim() !== '')
                .map(req => `<li style="margin-bottom: 5px; font-size: 0.9rem;">${req}</li>`)
                .join('') +
            '</ul>';
    }

    preview.innerHTML = `
        <h3>${title}</h3>
        <p><strong>${location} • ${type}</strong></p>
        <p>${description}</p>
        ${requirementsHtml}
        <a href="#" class="btn btn-outline" style="margin-top: 15px;">Apply Now</a>
    `;
}

function clearForm() {
    const form = document.getElementById('jobForm');
    if (form) {
        form.reset();
        updatePreview();
        // Optional: Show a confirmation message
        alert('Form cleared successfully!');
    }
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
function getJobs() {
    const jobs = localStorage.getItem('jobs');
    if (!jobs) {
        // Initialize with default jobs
        const defaultJobs = [
            {
                id: 1,
                title: "Senior Analog Design Engineer",
                location: "San Jose, CA",
                type: "Full-time",
                description: "5+ years experience in high-speed SerDes design.",
                requirements: []
            },
            {
                id: 2,
                title: "Verification Engineer",
                location: "Austin, TX",
                type: "Full-time",
                description: "Experience with UVM and SystemVerilog required.",
                requirements: []
            },
            {
                id: 3,
                title: "Embedded Software Developer",
                location: "Remote / Hybrid",
                type: "Full-time",
                description: "Strong C/C++ skills for firmware development.",
                requirements: []
            }
        ];
        saveJobs(defaultJobs);
        return defaultJobs;
    }

    try {
        return JSON.parse(jobs);
    } catch (e) {
        console.error('Error parsing jobs from localStorage:', e);
        return [];
    }
}

function saveJobs(jobs) {
    localStorage.setItem('jobs', JSON.stringify(jobs));
}

function logout() {
    localStorage.removeItem('adminLoggedIn');
    window.location.href = 'admin-login.html';
}
document.getElementById("contactForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const formData = new FormData(this);
  const data = Object.fromEntries(formData.entries());

  fetch("YOUR_WEB_APP_URL", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json"
    }
  })
  .then(res => res.json())
  .then(response => {
    alert("Message sent successfully!");
    this.reset();
  })
  .catch(err => alert("Error submitting form"));
});

