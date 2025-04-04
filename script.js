document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.circle').forEach((circle, index) => {
        const percentages = [100, 52, 60, 65]; // Percentages for Hindi, English, French, and German
        const radius = 45;
        const circumference = 2 * Math.PI * radius;
        const offset = circumference - (percentages[index] / 100) * circumference;

        const progressCircle = circle.querySelector('.progress-ring__circle');
        progressCircle.style.strokeDasharray = `${circumference} ${circumference}`;
        progressCircle.style.strokeDashoffset = offset;
    });
     // Background Music
     const audio = new Audio('background.mp3');
     audio.loop = true; // To make it loop
     audio.play(); // To start the music automatically

    const particleContainer = document.getElementById('particle-container');
    let mouseX = 0, mouseY = 0;
    const particles = [];

    const leafColors = [
        'rgba(79, 209, 197, 0.4)',   
        'rgba(45, 55, 72, 0.3)',     
        'rgba(32, 42, 58, 0.5)',     
        'rgba(79, 209, 197, 0.2)'    
    ];

    class LeafParticle {
        constructor() {
            this.element = document.createElement('div');
            this.element.classList.add('leaf-particle');
            
            this.width = Math.random() * 15 + 10;
            this.height = this.width * (Math.random() * 0.5 + 0.5);
            this.speed = Math.random() * 1.5 + 0.5;
            this.color = leafColors[Math.floor(Math.random() * leafColors.length)];
            
            this.wobbleFrequency = Math.random() * 0.05 + 0.02;
            this.wobbleAmplitude = Math.random() * 10 + 5;
            this.rotationSpeed = (Math.random() - 0.5) * 2;
            
            this.x = Math.random() * window.innerWidth;
            this.y = -50;
            this.time = Math.random() * 100;
            this.rotation = Math.random() * 360;
            
            this.createLeafShape();
            
            particleContainer.appendChild(this.element);
        }

        createLeafShape() {
            this.element.innerHTML = `
                <svg viewBox="0 0 30 40" width="${this.width}" height="${this.height}">
                    <path 
                        d="M15 0 Q25 10, 20 20 Q15 30, 15 40 Q10 30, 5 20 Q0 10, 15 0" 
                        fill="${this.color}" 
                        stroke="none"
                    />
                </svg>
            `;
            
            this.element.style.position = 'absolute';
            this.element.style.transformOrigin = 'center';
        }

        update() {
            this.time += 0.1;
            
            this.y += this.speed;
            this.x += Math.sin(this.time * this.wobbleFrequency) * this.wobbleAmplitude * 0.1;
            
            this.rotation += this.rotationSpeed;

            const cursorInfluence = (mouseX - this.x) / window.innerWidth;
            this.x += cursorInfluence * 1.1; 

            this.element.style.transform = `translate(${this.x}px, ${this.y}px) rotate(${this.rotation}deg)`;
            
            if (this.y > window.innerHeight + 50) {
                this.element.remove();
                return false;
            }
            return true;
        }
    }

    const particleStyle = document.createElement('style');
    particleStyle.innerHTML = `
        #particle-container {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: -1;
            overflow: hidden;
            perspective: 1000px;
        }
        .leaf-particle {
            position: absolute;
            pointer-events: none;
            will-change: transform;
            transition: opacity 0.3s ease;
        }
    `;
    document.head.appendChild(particleStyle);

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function generateLeaves() {
        if (particles.length < 70) {
            particles.push(new LeafParticle());
        }

        for (let i = particles.length - 1; i >= 0; i--) {
            if (!particles[i].update()) {
                particles.splice(i, 1);
            }
        }

        requestAnimationFrame(generateLeaves);
    }

    generateLeaves();

  // Navigation and Mobile Menu
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  const backdrop = document.querySelector('.menu-backdrop');
  const navButtons = document.querySelectorAll('.nav-links button');
  
  // Initialize touch variables
  let touchStartX = null;
  
  function toggleMenu() {
      hamburger.classList.toggle('open');
      navLinks.classList.toggle('open');
      backdrop.classList.toggle('show');
      
      if (navLinks.classList.contains('open')) {
          document.body.style.overflow = 'hidden';
      } else {
          document.body.style.overflow = '';
      }
  }

  // Touch event handlers for the whole document
  document.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
  });

  document.addEventListener('touchend', (e) => {
      if (!touchStartX) {
          return;
      }

      const touchEndX = e.changedTouches[0].clientX;
      const deltaX = touchEndX - touchStartX;

      // Only process swipe if we're in mobile view
      if (window.innerWidth <= 768) {
          // Left swipe (open menu)
          if (deltaX < -75 && !navLinks.classList.contains('open')) {
              toggleMenu();
          }
          // Right swipe (close menu)
          else if (deltaX > 75 && navLinks.classList.contains('open')) {
              toggleMenu();
          }
      }

      touchStartX = null;
  });

    hamburger.addEventListener('click', toggleMenu);
    backdrop.addEventListener('click', toggleMenu);

    // Handle navigation button clicks
    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const sectionId = button.dataset.section;
            
            // Remove active class from all buttons and add to clicked button
            navButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Hide all sections and show the selected one
            const sections = document.querySelectorAll('main section');
            sections.forEach(section => {
                section.classList.remove('active-section');
                section.classList.add('hidden-section');
            });
            
            const targetSection = document.getElementById(sectionId);
            if (targetSection) {
                targetSection.classList.remove('hidden-section');
                targetSection.classList.add('active-section');
            }
            
            // Close mobile menu if it's open
            if (window.innerWidth <= 768 && navLinks.classList.contains('open')) {
                toggleMenu();
            }
        });
    });

    // Handle window resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            hamburger.classList.remove('open');
            navLinks.classList.remove('open');
            backdrop.classList.remove('show');
            document.body.style.overflow = '';
        }
    });

    // Set default active section
    const defaultSection = document.querySelector('main section#home');
    if (defaultSection) {
        defaultSection.classList.add('active-section');
        const homeButton = document.querySelector('.nav-links button[data-section="home"]');
        if (homeButton) {
            homeButton.classList.add('active');
        }
    }

    // Typing animation
   const typingContainer = document.querySelector('.typing-container');
const text = "(Parul University, Gujarat)a future Programmer and Developer."; // Added <br> for line break
let charIndex = 0;

function typeText() {
    if (charIndex < text.length) {
        typingContainer.innerHTML += text.charAt(charIndex); // Use innerHTML to support <br>
        charIndex++;
        setTimeout(typeText, 50);
    } else {
        typingContainer.style.animation = 'float 3s ease-in-out infinite';
    }
}

setTimeout(typeText, 1000);


    // Name hover effect
    const nameElement = document.getElementById('name');
    const letters = nameElement.textContent.split('');
    
    nameElement.innerHTML = letters
        .map(letter => `<span class="letter">${letter}</span>`)
        .join('');

    const letterElements = nameElement.querySelectorAll('.letter');
    letterElements.forEach((letter, index) => {
        letter.style.animationDelay = `${index * 0.1}s`;
    });

    // Highlight hover animations
    const highlights = document.querySelectorAll('.highlight');
    highlights.forEach(highlight => {
        highlight.addEventListener('mouseover', () => {
            highlight.style.transform = 'scale(1.1)';
            highlight.style.transition = 'transform 0.3s ease';
        });

        highlight.addEventListener('mouseout', () => {
            highlight.style.transform = 'scale(1)';
        });
    });
});

// Navbar scroll behavior
let lastScrollTop = 0;
const navbar = document.getElementById('navbar');
const threshold = 100;

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > lastScrollTop && scrollTop > threshold) {
        navbar.classList.add('scroll-down');
        navbar.classList.remove('scroll-up');
    } else {
        navbar.classList.add('scroll-up');
        navbar.classList.remove('scroll-down');
    }
    
    lastScrollTop = scrollTop;
});




// Discord Login Integration
const loginButton = document.getElementById('login-button');
const userProfile = document.getElementById('user-profile');
const userAvatar = document.getElementById('user-avatar');
const profileDropdown = document.getElementById('profile-dropdown');
const username = document.getElementById('username');
const logoutButton = document.getElementById('logout-button');

// Discord OAuth2 configuration
const CLIENT_ID = '1327073500812546080'; // Replace with your Discord application client ID
const REDIRECT_URI = encodeURIComponent(window.location.origin);
const DISCORD_ENDPOINT = `https://discord.com/api/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=token&scope=identify`;

// Check if user is logged in
function checkLogin() {
    const userData = localStorage.getItem('discord_user');
    if (userData) {
        const user = JSON.parse(userData);
        showUserProfile(user);
    }
}

// Handle login button click
loginButton.addEventListener('click', () => {
    window.location.href = DISCORD_ENDPOINT;
});

// Handle logout button click
logoutButton.addEventListener('click', () => {
    localStorage.removeItem('discord_user');
    hideUserProfile();
});

// Toggle profile dropdown
userAvatar.addEventListener('click', () => {
    profileDropdown.classList.toggle('show');
});

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
    if (!userProfile.contains(e.target)) {
        profileDropdown.classList.remove('show');
    }
});

// Show user profile
function showUserProfile(user) {
    loginButton.classList.add('hidden');
    userProfile.classList.remove('hidden');
    userAvatar.src = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`;
    username.textContent = user.username;
}

// Hide user profile
function hideUserProfile() {
    loginButton.classList.remove('hidden');
    userProfile.classList.add('hidden');
    profileDropdown.classList.remove('show');
}

// Handle OAuth callback
function handleCallback() {
    const fragment = new URLSearchParams(window.location.hash.slice(1));
    const accessToken = fragment.get('access_token');

    if (accessToken) {
        // Get user data from Discord
        fetch('https://discord.com/api/users/@me', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })
        .then(response => response.json())
        .then(user => {
            localStorage.setItem('discord_user', JSON.stringify(user));
            showUserProfile(user);
            // Remove the hash from the URL
            history.pushState('', document.title, window.location.pathname);
        })
        .catch(error => console.error('Error fetching user data:', error));
    }
}

// Initial setup
checkLogin();
handleCallback();
