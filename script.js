document.addEventListener('DOMContentLoaded', () => {
  // Preloader
  window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    preloader.style.display = 'none';
  });

  // Typing effect for name
  const typedName = document.getElementById('typed-name');
  const text = "Hi, I'm Justis Dutt";
  let index = 0;

  function type() {
    if (index < text.length) {
      typedName.textContent += text.charAt(index);
      index++;
      setTimeout(type, 100);
    }
  }

  type();

  // GSAP Animations
  gsap.registerPlugin(ScrollTrigger);

  gsap.from('.home-content', {
    opacity: 0,
    y: 50,
    duration: 1,
    ease: 'power2.out'
  });

  gsap.from('.section', {
    scrollTrigger: {
      trigger: '.section',
      start: 'top 80%',
      toggleActions: 'play none none reverse'
    },
    opacity: 0,
    y: 50,
    duration: 1,
    stagger: 0.2
  });

  // Navigation smooth scroll
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href').substring(1);
      const targetSection = document.getElementById(targetId);
      targetSection.scrollIntoView({ behavior: 'smooth' });
      if (window.innerWidth <= 768) {
        toggleMenu();
      }
    });
  });

  // Hamburger menu toggle
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('nav ul');

  function toggleMenu() {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
  }

  hamburger.addEventListener('click', toggleMenu);

  // EmailJS Contact Form
  emailjs.init('8ZhgCaxGFcA7Rwp2J');

  document.getElementById('contact-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    emailjs.send('service_tzpy98o', 'template_tah909p', {
      from_name: name,
      from_email: email,
      message: message
    }).then(
      () => {
        alert('Message sent successfully!');
        this.reset();
      },
      () => {
        alert('Oops, something went wrong. Please try again or email me directly at justisdutt@gmail.com.');
      }
    );
  });
});