// Services Page Flowchart - Optimized with Mobile Support
document.addEventListener('DOMContentLoaded', function () {
    // Flowchart Data
    const flowchartData = [
        {
            id: 1,
            title: "Land Assure",
            description: "Comprehensive land assessment",
            fullTitle: "Land Assure",
            details: "Comprehensive land assessment and suitability analysis using AI-powered tools to evaluate soil quality, topography, climate conditions, and environmental factors for optimal agricultural planning.",
            features: [
                "Soil composition and nutrient analysis",
                "Topography and drainage assessment",
                "Climate and microclimate evaluation",
                "Environmental impact assessment",
                "Land suitability scoring system",
                "Historical land use pattern analysis",
                "Water resource availability assessment"
            ],
            color: '#667eea',
            icon: 'fa-mountain',
            angle: -90
        },
        {
            id: 2,
            title: "Seed Quality",
            description: "AI-powered seed inspection",
            fullTitle: "Seed Quality Assurance",
            details: "AI-powered seed inspection and viability prediction using computer vision and machine learning to ensure high germination rates and crop quality.",
            features: [
                "Seed purity and quality testing",
                "Germination rate prediction",
                "Genetic purity verification",
                "Disease resistance assessment",
                "Storage condition monitoring",
                "Batch quality certification",
                "Traceability system integration"
            ],
            color: '#f093fb',
            icon: 'fa-seedling',
            angle: -38.57
        },
        {
            id: 3,
            title: "Advisory",
            description: "Real-time expert guidance",
            fullTitle: "AI Advisory System",
            details: "Real-time expert guidance and recommendations powered by machine learning algorithms that analyze multiple data sources to provide personalized agricultural advice.",
            features: [
                "Personalized crop recommendations",
                "Fertilizer and pesticide guidance",
                "Irrigation scheduling optimization",
                "Weather-based advisories",
                "Market price predictions",
                "Pest and disease alerts",
                "Sustainable practice recommendations"
            ],
            color: '#4fd1c5',
            icon: 'fa-comments',
            angle: 12.86
        },
        {
            id: 4,
            title: "Crop Health",
            description: "Health monitoring & detection",
            fullTitle: "Crop Health Monitoring",
            details: "Continuous monitoring of crop health using drones, sensors, and satellite imagery with AI-powered disease detection and prevention algorithms.",
            features: [
                "Real-time crop health monitoring",
                "Early disease detection",
                "Nutrient deficiency identification",
                "Stress factor analysis",
                "Growth stage tracking",
                "Yield prediction models",
                "Intervention recommendation system"
            ],
            color: '#38b2ac',
            icon: 'fa-heartbeat',
            angle: 64.29
        },
        {
            id: 5,
            title: "Distribution",
            description: "Optimized logistics & supply chain",
            fullTitle: "Smart Distribution System",
            details: "Intelligent logistics planning and supply chain optimization using AI algorithms to ensure efficient and timely distribution of agricultural produce.",
            features: [
                "Route optimization algorithms",
                "Inventory management system",
                "Demand forecasting models",
                "Cold chain monitoring",
                "Quality control during transit",
                "Market linkage optimization",
                "Real-time tracking system"
            ],
            color: '#4299e1',
            icon: 'fa-truck',
            angle: 115.71
        },
        {
            id: 6,
            title: "Insurance",
            description: "Comprehensive insurance solutions",
            fullTitle: "Agricultural Insurance",
            details: "AI-powered risk assessment and comprehensive insurance solutions tailored for agricultural needs, climate challenges, and market fluctuations.",
            features: [
                "Risk assessment and scoring",
                "Crop insurance customization",
                "Weather-based premium calculation",
                "Claim processing automation",
                "Disaster risk mitigation",
                "Market risk coverage",
                "Yield protection insurance"
            ],
            color: '#0bc5ea',
            icon: 'fa-shield-alt',
            angle: 167.14
        },
        {
            id: 7,
            title: "Gap Assist",
            description: "Identifying gaps in practices",
            fullTitle: "Gap Assist",
            details: "Advanced gap analysis system that identifies discrepancies between current agricultural practices and optimal standards, providing actionable insights for improvement.",
            features: [
                "Practice vs standard gap analysis",
                "Yield optimization opportunities",
                "Resource utilization efficiency",
                "Technology adoption gaps",
                "Skill and training requirements",
                "Process improvement suggestions",
                "Best practice recommendations"
            ],
            color: '#764ba2',
            icon: 'fa-search-minus',
            angle: 218.57
        }
    ];

    // DOM Elements
    const circularStepsContainer = document.getElementById('circularSteps');
    const verticalStepsContainer = document.getElementById('verticalSteps');
    const flowchartConnections = document.getElementById('flowchartConnections');
    let currentStep = 1;
    const totalSteps = flowchartData.length;
    const stepRadius = 250;

    // Check if mobile on load
    function checkIfMobile() {
        return window.innerWidth <= 768;
    }

    let isMobile = checkIfMobile();

    // Initialize based on screen size
    if (isMobile) {
        setupVerticalLayout();
    } else {
        initCircularFlowchart();
    }

    // Setup vertical layout for mobile
    function setupVerticalLayout() {
        if (!verticalStepsContainer) return;
        verticalStepsContainer.innerHTML = '';

        flowchartData.forEach((step) => {
            const stepItem = document.createElement('div');
            stepItem.className = 'vertical-step-item';
            stepItem.setAttribute('data-step', step.id);

            stepItem.innerHTML = `
                <div class="vertical-step-number">${step.id}</div>
                <div class="vertical-step-content">
                    <h4>${step.title}</h4>
                    <p>${step.description}</p>
                </div>
                <div class="vertical-step-arrow">
                    <i class="fas fa-chevron-right"></i>
                </div>
            `;

            stepItem.addEventListener('click', function () {
                const stepNum = parseInt(this.getAttribute('data-step'));
                setActiveVerticalStep(stepNum);
                showStepModal(stepNum);
            });

            verticalStepsContainer.appendChild(stepItem);
        });

        // Set first step as active
        setActiveVerticalStep(1);
    }

    function setActiveVerticalStep(stepNum) {
        const allSteps = document.querySelectorAll('.vertical-step-item');
        allSteps.forEach(step => {
            step.classList.remove('active');
        });

        for (let i = 1; i <= stepNum; i++) {
            const stepElement = document.querySelector(`.vertical-step-item[data-step="${i}"]`);
            if (stepElement) {
                stepElement.classList.add('active');
            }
        }
        currentStep = stepNum;
    }

    // Initialize circular flowchart (Desktop)
    function initCircularFlowchart() {
        if (!circularStepsContainer) return;
        setupCircularSteps();
        updateFlowchartStep(currentStep);
        setTimeout(drawCircularConnections, 100);

        // Handle window resize
        let resizeTimer;
        window.addEventListener('resize', function () {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function () {
                const newIsMobile = checkIfMobile();
                if (newIsMobile !== isMobile) {
                    isMobile = newIsMobile;
                    if (isMobile) {
                        // Switch to vertical layout
                        setupVerticalLayout();
                    } else {
                        // Switch to circular layout
                        initCircularFlowchart();
                    }
                } else if (!isMobile) {
                    // Just resize circular layout
                    setupCircularSteps();
                    updateFlowchartStep(currentStep);
                    drawCircularConnections();
                }
            }, 250);
        });
    }

    function setupCircularSteps() {
        if (!circularStepsContainer) return;
        circularStepsContainer.innerHTML = '';

        const container = circularStepsContainer.parentElement;
        const width = container.offsetWidth;
        const height = container.offsetHeight;
        const centerX = width / 2;
        const centerY = height / 2;

        flowchartData.forEach((step) => {
            const angleRad = (step.angle * Math.PI) / 180;
            const x = centerX + stepRadius * Math.cos(angleRad);
            const y = centerY + stepRadius * Math.sin(angleRad);

            const stepElement = document.createElement('div');
            stepElement.className = 'flowchart-step';
            stepElement.setAttribute('data-step', step.id);
            stepElement.style.left = `${x - 75}px`;
            stepElement.style.top = `${y - 75}px`;

            stepElement.innerHTML = `
                <div class="step-number">${step.id}</div>
                <div class="step-circle">
                    <h4>${step.title}</h4>
                    <p>${step.description}</p>
                </div>
            `;

            stepElement.addEventListener('click', function () {
                const stepNum = parseInt(this.getAttribute('data-step'));
                navigateToStep(stepNum);
                showStepModal(stepNum);
            });

            circularStepsContainer.appendChild(stepElement);
        });
    }

    function navigateToStep(stepNum) {
        currentStep = stepNum;
        updateFlowchartStep(currentStep);
    }

    function updateFlowchartStep(stepNum) {
        const allSteps = document.querySelectorAll('.flowchart-step');
        allSteps.forEach(step => {
            step.classList.remove('active');
        });

        for (let i = 1; i <= stepNum; i++) {
            const stepElement = document.querySelector(`[data-step="${i}"]`);
            if (stepElement) {
                stepElement.classList.add('active');
            }
        }

        drawCircularConnections();
    }

    function drawCircularConnections() {
        if (!flowchartConnections || isMobile) return;

        flowchartConnections.innerHTML = '';

        const container = flowchartConnections.parentElement;
        const width = container.offsetWidth;
        const height = container.offsetHeight;
        const centerX = width / 2;
        const centerY = height / 2;

        for (let i = 0; i < flowchartData.length; i++) {
            const currentStepData = flowchartData[i];
            const nextStepData = flowchartData[(i + 1) % flowchartData.length];

            const startAngle = (currentStepData.angle * Math.PI) / 180;
            const endAngle = (nextStepData.angle * Math.PI) / 180;

            const startX = centerX + stepRadius * Math.cos(startAngle);
            const startY = centerY + stepRadius * Math.sin(startAngle);
            const endX = centerX + stepRadius * Math.cos(endAngle);
            const endY = centerY + stepRadius * Math.sin(endAngle);

            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            const isActive = currentStep >= nextStepData.id || (i === flowchartData.length - 1 && currentStep === totalSteps);

            line.setAttribute('x1', startX);
            line.setAttribute('y1', startY);
            line.setAttribute('x2', endX);
            line.setAttribute('y2', endY);
            line.setAttribute('class', `connection-line ${isActive ? 'active' : ''}`);
            line.setAttribute('stroke', currentStepData.color);
            line.setAttribute('stroke-width', isActive ? '3.5' : '2.5');
            line.setAttribute('stroke-dasharray', isActive ? '0' : '5,3');

            flowchartConnections.appendChild(line);

            if (i === flowchartData.length - 1) {
                const arrow = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
                const arrowSize = 8;
                const dx = endX - startX;
                const dy = endY - startY;
                const angle = Math.atan2(dy, dx);

                const arrowX = endX - arrowSize * Math.cos(angle);
                const arrowY = endY - arrowSize * Math.sin(angle);

                const points = [
                    `${arrowX},${arrowY}`,
                    `${arrowX - arrowSize * Math.cos(angle - Math.PI / 6)},${arrowY - arrowSize * Math.sin(angle - Math.PI / 6)}`,
                    `${arrowX - arrowSize * Math.cos(angle + Math.PI / 6)},${arrowY - arrowSize * Math.sin(angle + Math.PI / 6)}`
                ].join(' ');

                arrow.setAttribute('points', points);
                arrow.setAttribute('class', 'arrow-head');
                arrow.setAttribute('fill', currentStepData.color);
                flowchartConnections.appendChild(arrow);
            }
        }
    }

    // Modal Functions
    function setupModal() {
        const modal = document.getElementById('stepModal');
        const closeBtn = document.getElementById('modalClose');

        if (closeBtn) {
            closeBtn.addEventListener('click', () => closeModal());
        }

        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) closeModal();
            });
        }

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
                closeModal();
            }
        });
    }

    function showStepModal(stepNum) {
        const modal = document.getElementById('stepModal');
        const modalTitle = document.getElementById('modalTitle');
        const modalDetails = document.getElementById('modalDetails');
        const modalFeaturesList = document.getElementById('modalFeaturesList');

        if (!modal || !modalTitle || !modalDetails || !modalFeaturesList) return;

        const stepData = flowchartData.find(step => step.id === stepNum);
        if (!stepData) return;

        modalTitle.textContent = stepData.fullTitle || stepData.title;
        modalDetails.textContent = stepData.details || stepData.description;

        modalFeaturesList.innerHTML = '';
        if (stepData.features && stepData.features.length > 0) {
            stepData.features.forEach(feature => {
                const li = document.createElement('li');
                li.textContent = feature;
                modalFeaturesList.appendChild(li);
            });
        } else {
            const li = document.createElement('li');
            li.textContent = 'No additional features available.';
            li.style.color = '#94a3b8';
            modalFeaturesList.appendChild(li);
        }

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        const modal = document.getElementById('stepModal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    // Initialize modal
    setupModal();
});
