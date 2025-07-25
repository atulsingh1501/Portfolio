document.addEventListener('DOMContentLoaded', () => {
    // --- Animate Language Circles on Scroll ---
    const circles = document.querySelectorAll('.language-cards .circle');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const circle = entry.target;
                const percentageSpan = circle.querySelector('span');
                if (!percentageSpan) return;

                const percentage = parseInt(percentageSpan.textContent, 10);
                const radius = 45;
                const circumference = 2 * Math.PI * radius;
                const offset = circumference - (percentage / 100) * circumference;

                const progressCircle = circle.querySelector('.progress-ring__circle');
                progressCircle.style.strokeDashoffset = offset;
                
                observer.unobserve(circle); // Animate only once
            }
        });
    }, {
        threshold: 0.5 // Trigger when 50% of the element is visible
    });

    circles.forEach(circle => {
        // Set initial state for animation
        const radius = 45; // Corrected radius to match SVG
        const circumference = 2 * Math.PI * radius;
        const progressCircle = circle.querySelector('.progress-ring__circle');
        progressCircle.style.strokeDasharray = `${circumference} ${circumference}`;
        progressCircle.style.strokeDashoffset = circumference; // Start empty

        observer.observe(circle);
    });

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

    // --- Form Validation and Submission ---
    const contactForm = document.querySelector('.contact-form');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = contactForm.querySelector('.submit-btn');
            // Replace with your actual Formspree endpoint URL
            const formAction = "https://formspree.io/f/meozganv"; 
            const formData = new FormData(contactForm);

            // Simple validation
            if (!formData.get('name') || !formData.get('email') || !formData.get('message')) {
                alert('Please fill out all fields.');
                return;
            }

            submitBtn.disabled = true;
            submitBtn.innerHTML = 'Sending... <i class="fas fa-spinner fa-spin"></i>';

            try {
                const response = await fetch(formAction, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json'
                    },
                    body: formData
                });

                if (response.ok) {
                    window.location.href = 'thank-you.html';
                } else {
                    const result = await response.json();
                    console.error('Submission failed:', result);
                    alert(result.error || 'An error occurred. Please try again.');
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = 'Send Message';
                }
            } catch (error) {
                console.error('Error submitting form:', error);
                alert('An error occurred. Please check your connection and try again.');
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Send Message';
            }
        });
    }

    // Typing animation
    const typingContainer = document.querySelector('.typing-container');
    if (typingContainer) {
        const text = typingContainer.dataset.text || "(Parul University, Gujarat), a future Programmer and Developer.";
        let charIndex = 0;

        function typeText() {
            if (charIndex < text.length) {
                typingContainer.innerHTML += text.charAt(charIndex);
                charIndex++;
                setTimeout(typeText, 50);
            } else {
                typingContainer.style.animation = 'float 3s ease-in-out infinite';
            }
        }
        setTimeout(typeText, 1000);
    }


    // Name hover effect
    // The code below was intended to create a letter-by-letter animation on hover,
    // but it was incomplete and conflicted with the "typing" cursor effect.
    // I've commented it out to restore the blinking cursor.
    /*
    const nameElement = document.getElementById('typing-name'); ...
    */

    // --- Particles.js Initialization ---
    if (document.getElementById('particle-container')) {
        particlesJS('particle-container', {
            "particles": {
                "number": {
                    "value": 80,
                    "density": {
                        "enable": true,
                        "value_area": 800
                    }
                },
                "color": {
                    "value": "#4fd1c5"
                },
                "shape": {
                    "type": "circle",
                    "stroke": {
                        "width": 0,
                        "color": "#000000"
                    },
                },
                "opacity": {
                    "value": 0.5,
                    "random": false,
                    "anim": {
                        "enable": false
                    }
                },
                "size": {
                    "value": 3,
                    "random": true,
                    "anim": {
                        "enable": false
                    }
                },
                "line_linked": {
                    "enable": true,
                    "distance": 150,
                    "color": "#4fd1c5",
                    "opacity": 0.4,
                    "width": 1
                },
                "move": {
                    "enable": true,
                    "speed": 2,
                    "direction": "none",
                    "random": false,
                    "straight": false,
                    "out_mode": "out",
                    "bounce": false,
                }
            },
            "interactivity": {
                "detect_on": "canvas",
                "events": {
                    "onhover": {
                        "enable": true,
                        "mode": "repulse"
                    },
                    "onclick": {
                        "enable": true,
                        "mode": "push"
                    },
                    "resize": true
                },
                "modes": {
                    "repulse": {
                        "distance": 100,
                        "duration": 0.4
                    },
                    "push": {
                        "particles_nb": 4
                    }
                }
            },
            "retina_detect": true
        });
    }

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

    // --- Image Modal Logic ---
    const modal = document.getElementById("image-modal");
    if (modal) {
        const modalImg = document.getElementById("modal-image");
        const closeModal = document.querySelector(".close-modal");
        const proofButtons = document.querySelectorAll('.view-proof-btn');

        proofButtons.forEach(button => {
            button.addEventListener('click', function() {
                modal.style.display = "block";
                modalImg.src = this.dataset.image;
            });
        });

        const hideModal = () => {
            modal.style.display = "none";
        };

        if (closeModal) {
            closeModal.onclick = hideModal;
        }

        window.addEventListener('click', function(event) {
            if (event.target == modal) {
                hideModal();
            }
        });
    }
});
