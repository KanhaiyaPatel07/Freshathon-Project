// Main Application Controller
class RescueConnectApp {
    constructor() {
        this.initialize();
    }

    initialize() {
        // Initialize components when DOM is loaded
        document.addEventListener('DOMContentLoaded', () => {
            this.initMap();
            this.setupEventListeners();
            this.loadInitialData();
            this.simulateChatbot();
            this.animateStats();
        });
    }

    // Initialize Leaflet map
    initMap() {
        const mapElement = document.getElementById('map-display');
        if (!mapElement) return;

        // Create map centered on a default location (San Francisco)
        this.map = L.map('map-display').setView([37.7749, -122.4194], 12);

        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.map);

        // Add sample markers (in a real app, these would come from an API)
        this.addSampleMarkers();
    }

    addSampleMarkers() {
        // Sample data for shelters
        const shelters = [
            { lat: 37.7749, lng: -122.4194, name: "Central High School Shelter", type: "shelter", capacity: "120/150" },
            { lat: 37.7849, lng: -122.4294, name: "Community Center", type: "shelter", capacity: "80/100" },
            { lat: 37.7649, lng: -122.4094, name: "YMCA Downtown", type: "shelter", capacity: "50/75" }
        ];

        // Sample data for food distribution
        const foodLocations = [
            { lat: 37.7799, lng: -122.4144, name: "First Baptist Church", type: "food", service: "Hot meals" },
            { lat: 37.7699, lng: -122.4244, name: "City Park Pavilion", type: "food", service: "Food boxes" }
        ];

        // Sample data for medical aid
        const medicalLocations = [
            { lat: 37.7749, lng: -122.4294, name: "Memorial Hospital", type: "medical", service: "Emergency care" },
            { lat: 37.7799, lng: -122.4044, name: "Mobile Clinic A", type: "medical", service: "Basic care" }
        ];

        // Sample danger zones
        const dangerZones = [
            { lat: 37.7749, lng: -122.4344, name: "Collapsed Building", type: "danger", risk: "High" },
            { lat: 37.7649, lng: -122.4344, name: "Gas Leak", type: "danger", risk: "Extreme" }
        ];

        // Create icon for each type
        const shelterIcon = L.divIcon({
            className: 'map-icon shelter',
            html: '<i class="fas fa-home"></i>',
            iconSize: [30, 30]
        });

        const foodIcon = L.divIcon({
            className: 'map-icon food',
            html: '<i class="fas fa-utensils"></i>',
            iconSize: [30, 30]
        });

        const medicalIcon = L.divIcon({
            className: 'map-icon medical',
            html: '<i class="fas fa-briefcase-medical"></i>',
            iconSize: [30, 30]
        });

        const dangerIcon = L.divIcon({
            className: 'map-icon danger',
            html: '<i class="fas fa-exclamation-triangle"></i>',
            iconSize: [30, 30]
        });

        // Add markers to map
        shelters.forEach(shelter => {
            const marker = L.marker([shelter.lat, shelter.lng], { icon: shelterIcon })
                .addTo(this.map)
                .bindPopup(`<b>${shelter.name}</b><br>Capacity: ${shelter.capacity}`);
        });

        foodLocations.forEach(food => {
            const marker = L.marker([food.lat, food.lng], { icon: foodIcon })
                .addTo(this.map)
                .bindPopup(`<b>${food.name}</b><br>Service: ${food.service}`);
        });

        medicalLocations.forEach(medical => {
            const marker = L.marker([medical.lat, medical.lng], { icon: medicalIcon })
                .addTo(this.map)
                .bindPopup(`<b>${medical.name}</b><br>Service: ${medical.service}`);
        });

        dangerZones.forEach(danger => {
            const marker = L.marker([danger.lat, danger.lng], { icon: dangerIcon })
                .addTo(this.map)
                .bindPopup(`<b>${danger.name}</b><br>Risk: ${danger.risk}`);
        });
    }

    // Set up all event listeners
    setupEventListeners() {
        // Modal toggles
        document.getElementById('login-btn').addEventListener('click', () => this.toggleModal('login-modal'));
        document.getElementById('register-btn').addEventListener('click', () => this.toggleModal('register-modal'));
        document.getElementById('switch-to-register').addEventListener('click', (e) => {
            e.preventDefault();
            this.toggleModal('login-modal', false);
            this.toggleModal('register-modal');
        });
        document.getElementById('switch-to-login').addEventListener('click', (e) => {
            e.preventDefault();
            this.toggleModal('register-modal', false);
            this.toggleModal('login-modal');
        });

        // Close modals when clicking X
        document.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', () => {
                this.toggleModal(btn.closest('.modal').id, false);
            });
        });

        // Close modals when clicking outside
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.toggleModal(modal.id, false);
                }
            });
        });

        // Help request form submission
        const helpRequestForm = document.getElementById('help-request-form');
        if (helpRequestForm) {
            helpRequestForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.submitHelpRequest();
            });
        }

        // Volunteer registration form
        const volunteerForm = document.getElementById('volunteer-registration');
        if (volunteerForm) {
            volunteerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.registerVolunteer();
            });
        }

        // Need Help button
        const needHelpBtn = document.getElementById('need-help-btn');
        if (needHelpBtn) {
            needHelpBtn.addEventListener('click', () => {
                document.getElementById('request-help').scrollIntoView({ behavior: 'smooth' });
            });
        }

        // Offer Help button
        const offerHelpBtn = document.getElementById('offer-help-btn');
        if (offerHelpBtn) {
            offerHelpBtn.addEventListener('click', () => {
                document.getElementById('volunteer').scrollIntoView({ behavior: 'smooth' });
            });
        }

        // Chatbot input
        const chatbotInput = document.getElementById('chatbot-input-field');
        const sendMessageBtn = document.getElementById('send-message-btn');
        
        if (chatbotInput && sendMessageBtn) {
            sendMessageBtn.addEventListener('click', () => this.sendChatbotMessage());
            chatbotInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.sendChatbotMessage();
                }
            });
        }

        // Voice input button
        const voiceInputBtn = document.getElementById('voice-input-btn');
        if (voiceInputBtn) {
            voiceInputBtn.addEventListener('click', () => this.toggleVoiceInput());
        }

        // Quick reply buttons
        document.querySelectorAll('.quick-reply-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const message = btn.textContent;
                this.addUserMessage(message);
                setTimeout(() => {
                    this.respondToQuickReply(message);
                }, 800);
            });
        });

        // Detect location button
        const detectLocationBtn = document.getElementById('detect-location');
        if (detectLocationBtn) {
            detectLocationBtn.addEventListener('click', () => {
                this.toggleModal('location-modal');
            });
        }

        // Allow location button
        const allowLocationBtn = document.getElementById('allow-location-btn');
        if (allowLocationBtn) {
            allowLocationBtn.addEventListener('click', () => {
                this.getUserLocation();
            });
        }

        // Close confirmation modal
        const closeConfirmationBtn = document.getElementById('close-confirmation-btn');
        if (closeConfirmationBtn) {
            closeConfirmationBtn.addEventListener('click', () => {
                this.toggleModal('confirmation-modal', false);
            });
        }

        // Track request button
        const trackRequestBtn = document.getElementById('track-request-btn');
        if (trackRequestBtn) {
            trackRequestBtn.addEventListener('click', () => {
                this.toggleModal('confirmation-modal', false);
                alert('Request tracking feature will be implemented in the full version.');
            });
        }

        // Refresh map button
        const refreshMapBtn = document.getElementById('refresh-map');
        if (refreshMapBtn) {
            refreshMapBtn.addEventListener('click', () => {
                this.refreshMap();
            });
        }

        // Report danger button
        const reportDangerBtn = document.getElementById('report-danger');
        if (reportDangerBtn) {
            reportDangerBtn.addEventListener('click', () => {
                this.reportDanger();
            });
        }

        // Find nearest help button
        const findNearestHelpBtn = document.getElementById('find-nearest-help');
        if (findNearestHelpBtn) {
            findNearestHelpBtn.addEventListener('click', () => {
                this.findNearestHelp();
            });
        }
    }

    // Load initial data (simulated)
    loadInitialData() {
        console.log('Loading initial data...');
        // In a real app, this would fetch data from APIs
    }

    // Toggle modal visibility
    toggleModal(modalId, show = true) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = show ? 'flex' : 'none';
            
            if (show) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        }
    }

    // Submit help request form
    submitHelpRequest() {
        // Get form values
        const emergencyType = document.getElementById('emergency-type').value;
        const urgencyLevel = document.getElementById('urgency-level').value;
        const location = document.getElementById('location').value;
        const peopleCount = document.getElementById('people-count').value;
        const details = document.getElementById('details').value;
        const contact = document.getElementById('contact').value;
        
        // Validate form
        if (!emergencyType || !urgencyLevel || !location || !peopleCount || !contact) {
            alert('Please fill in all required fields.');
            return;
        }
        
        // In a real app, this would send data to your backend
        console.log('Submitting help request:', {
            emergencyType,
            urgencyLevel,
            location,
            peopleCount,
            details,
            contact
        });
        
        // Generate random reference ID
        const refId = 'RESC-' + new Date().getFullYear() + '-' + Math.floor(10000 + Math.random() * 90000);
        document.getElementById('reference-id').textContent = refId;
        
        // Show confirmation modal
        this.toggleModal('confirmation-modal');
        
        // Reset form
        document.getElementById('help-request-form').reset();
    }

    // Register volunteer
    registerVolunteer() {
        const form = document.getElementById('volunteer-registration');
        const formData = new FormData(form);
        
        // Validate form
        let isValid = true;
        form.querySelectorAll('[required]').forEach(field => {
            if (!field.value) {
                isValid = false;
                field.style.borderColor = 'var(--danger-color)';
            }
        });
        
        if (!isValid) {
            alert('Please fill in all required fields.');
            return;
        }
        
        // In a real app, this would send data to your backend
        console.log('Registering volunteer:', Object.fromEntries(formData));
        
        // Show success message
        alert('Thank you for registering as a volunteer! Our team will contact you soon.');
        
        // Reset form
        form.reset();
        
        // Close modal if open
        this.toggleModal('register-modal', false);
    }

    // Chatbot functions
    addBotMessage(text, isHTML = false) {
        const messagesContainer = document.getElementById('chatbot-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message bot';
        
        if (isHTML) {
            messageDiv.innerHTML = `
                <div class="message-content">
                    ${text}
                </div>
            `;
        } else {
            messageDiv.innerHTML = `
                <div class="message-content">
                    <p>${text}</p>
                </div>
            `;
        }
        
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    addUserMessage(text) {
        const messagesContainer = document.getElementById('chatbot-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message user';
        messageDiv.innerHTML = `
            <div class="message-content">
                <p>${text}</p>
            </div>
        `;
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        // Clear input
        document.getElementById('chatbot-input-field').value = '';
    }

    sendChatbotMessage() {
        const input = document.getElementById('chatbot-input-field');
        const message = input.value.trim();
        
        if (message) {
            this.addUserMessage(message);
            this.showTypingIndicator();
            
            setTimeout(() => {
                this.processUserMessage(message);
                this.hideTypingIndicator();
            }, 1000 + Math.random() * 2000); // Simulate thinking time
        }
    }

    showTypingIndicator() {
        const indicator = document.getElementById('typing-indicator');
        if (indicator) {
            indicator.style.display = 'flex';
        }
    }

    hideTypingIndicator() {
        const indicator = document.getElementById('typing-indicator');
        if (indicator) {
            indicator.style.display = 'none';
        }
    }

    processUserMessage(message) {
        // Simple keyword-based responses with some NLP simulation
        message = message.toLowerCase();
        
        if (message.includes('shelter') || message.includes('place to stay') || message.includes('housing')) {
            this.addBotMessage(`
                <p>Here are the nearest shelters with available space:</p>
                <ul class="chatbot-features">
                    <li><strong>Central High School</strong> - 2 miles away (120/150 capacity)</li>
                    <li><strong>Community Center</strong> - 3.5 miles away (80/100 capacity)</li>
                    <li><strong>YMCA Downtown</strong> - 1.8 miles away (50/75 capacity)</li>
                </ul>
                <p>Would you like directions to any of these locations?</p>
            `, true);
        } 
        else if (message.includes('food') || message.includes('hungry') || message.includes('water') || message.includes('eat')) {
            this.addBotMessage(`
                <p>Food and water distribution centers near you:</p>
                <ul class="chatbot-features">
                    <li><strong>First Baptist Church</strong> - Open until 8pm (Hot meals)</li>
                    <li><strong>City Park Pavilion</strong> - Open until 7pm (Food boxes)</li>
                    <li><strong>Salvation Army Center</strong> - Open 24/7 (Emergency rations)</li>
                </ul>
                <p>I can provide directions or add you to the queue if needed.</p>
            `, true);
        }
        else if (message.includes('medical') || message.includes('hurt') || message.includes('doctor') || message.includes('hospital')) {
            this.addBotMessage(`
                <p>Medical assistance options:</p>
                <ul class="chatbot-features">
                    <li><strong>Memorial Hospital</strong> - 1.2 miles away (Emergency care)</li>
                    <li><strong>Mobile Clinic A</strong> - 0.8 miles away (Basic care)</li>
                    <li><strong>Red Cross Station</strong> - 1.5 miles away (First aid)</li>
                </ul>
                <p class="warning"><i class="fas fa-exclamation-triangle"></i> If this is a life-threatening emergency, please call local emergency services immediately.</p>
            `, true);
        }
        else if (message.includes('danger') || message.includes('unsafe') || message.includes('hazard')) {
            this.addBotMessage('Please describe the danger and its location so I can report it to authorities and warn others. Is it a fire, structural damage, flood, or another hazard?');
        }
        else if (message.includes('translate') || message.includes('language')) {
            this.addBotMessage('I can translate emergency information to many languages. Please tell me what language you need (Spanish, French, Arabic, etc.) and what information you need translated.');
        }
        else if (message.includes('thank')) {
            this.addBotMessage('You\'re welcome! Is there anything else I can help you with? Your safety is our priority.');
        }
        else {
            this.addBotMessage('I can help you find shelters, food, medical aid, report dangers, or translate emergency information. What do you need assistance with?');
        }
    }

    respondToQuickReply(reply) {
        this.processUserMessage(reply);
    }

    // Toggle voice input
    toggleVoiceInput() {
        alert('Voice input feature will be implemented in the full version. For now, please type your message.');
    }

    // Get user location
    getUserLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;
                    
                    // Reverse geocode to get address (in real app, use a geocoding service)
                    const address = `Near ${lat.toFixed(4)}, ${lng.toFixed(4)}`;
                    document.getElementById('location').value = address;
                    
                    // Add marker to map
                    if (this.map) {
                        this.map.setView([lat, lng], 15);
                        L.marker([lat, lng]).addTo(this.map)
                            .bindPopup('Your Location')
                            .openPopup();
                    }
                    
                    this.toggleModal('location-modal', false);
                },
                (error) => {
                    console.error('Error getting location:', error);
                    alert('Unable to get your location. Please enter it manually.');
                }
            );
        } else {
            alert('Geolocation is not supported by your browser. Please enter your location manually.');
        }
    }

    // Refresh map data
    refreshMap() {
        alert('Map data refreshed! In a real app, this would fetch the latest resource locations from our servers.');
    }

    // Report danger
    reportDanger() {
        this.addBotMessage('Please describe the danger you want to report (e.g., collapsed building, gas leak, flood area). Include the location if possible.');
        document.getElementById('chatbot-input-field').focus();
    }

    // Find nearest help
    findNearestHelp() {
        alert('Finding nearest help resources... In the full version, this would use your location to show the closest shelters, food, and medical aid.');
    }

    // Simulate initial chatbot messages
    simulateChatbot() {
        setTimeout(() => {
            this.addBotMessage('Hello! I\'m RescueAI, your emergency assistance assistant. I can help you:');
            setTimeout(() => {
                this.addBotMessage(`
                    <ul class="chatbot-features">
                        <li>Find emergency shelters and resources</li>
                        <li>Report dangerous situations</li>
                        <li>Connect with first responders</li>
                        <li>Translate emergency information</li>
                        <li>Guide you through first aid procedures</li>
                    </ul>
                    <p>How can I help you today?</p>
                `, true);
            }, 800);
        }, 1500);
    }

    // Animate statistics on hero section
    animateStats() {
        const animateValue = (id, start, end, duration) => {
            const obj = document.getElementById(id);
            let startTimestamp = null;
            const step = (timestamp) => {
                if (!startTimestamp) startTimestamp = timestamp;
                const progress = Math.min((timestamp - startTimestamp) / duration, 1);
                obj.innerHTML = Math.floor(progress * (end - start) + start);
                if (progress < 1) {
                    window.requestAnimationFrame(step);
                }
            };
            window.requestAnimationFrame(step);
        };

        animateValue('people-helped', 0, 5247, 2000);
        animateValue('active-volunteers', 0, 1892, 2000);
        animateValue('emergency-requests', 0, 324, 2000);
    }
}

// Initialize the application
const app = new RescueConnectApp();