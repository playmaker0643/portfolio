/**
 * Portfolio Site - Main JavaScript
 * Handles theme switching, mobile navigation, form submission, and scroll effects
 */

// Theme Management
class ThemeManager {
  constructor() {
    this.THEME_KEY = 'portfolio-theme';
    this.DARK_MODE_CLASS = 'dark-mode';
    this.LIGHT_MODE_CLASS = 'light-mode';
    this.init();
  }

  init() {
    this.loadTheme();
    this.setupThemeToggle();
  }

  loadTheme() {
    const savedTheme = localStorage.getItem(this.THEME_KEY);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldBeDark = savedTheme ? savedTheme === 'dark' : prefersDark;

    this.setTheme(shouldBeDark ? 'dark' : 'light');
  }

  setTheme(theme) {
    const isDark = theme === 'dark';
    document.body.classList.toggle(this.DARK_MODE_CLASS, isDark);
    document.body.classList.toggle(this.LIGHT_MODE_CLASS, !isDark);
    localStorage.setItem(this.THEME_KEY, theme);
    this.updateThemeToggle(isDark);
  }

  setupThemeToggle() {
    const toggle = document.getElementById('theme-toggle');
    if (toggle) {
      toggle.addEventListener('click', () => {
        const isDark = document.body.classList.contains(this.DARK_MODE_CLASS);
        this.setTheme(isDark ? 'light' : 'dark');
      });
    }
  }

  updateThemeToggle(isDark) {
    const sunIcon = document.querySelector('.sun-icon');
    const moonIcon = document.querySelector('.moon-icon');
    if (sunIcon && moonIcon) {
      sunIcon.style.display = isDark ? 'none' : 'block';
      moonIcon.style.display = isDark ? 'block' : 'none';
    }
  }
}

// Mobile Navigation
class MobileNav {
  constructor() {
    this.toggle = document.getElementById('mobile-menu-toggle');
    this.menu = document.getElementById('navbar-menu');
    this.links = document.querySelectorAll('.nav-link');
    this.init();
  }

  init() {
    if (this.toggle) {
      this.toggle.addEventListener('click', () => this.toggleMenu());
    }
    this.links.forEach(link => {
      link.addEventListener('click', () => this.closeMenu());
    });
  }

  toggleMenu() {
    this.menu.classList.toggle('active');
    this.toggle.classList.toggle('active');
  }

  closeMenu() {
    this.menu.classList.remove('active');
    this.toggle.classList.remove('active');
  }
}

// Smooth Scroll Navigation
class SmoothScroll {
  constructor() {
    this.init();
  }

  init() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const href = anchor.getAttribute('href');
        if (href === '#') return;
        
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }
}

// Intersection Observer for fade-in animations
class ScrollAnimations {
  constructor() {
    this.init();
  }

  init() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observe all sections and cards
    document.querySelectorAll(
      'section, .project-card, .highlight-card, .skill-category, .service-card'
    ).forEach(el => {
      observer.observe(el);
    });
  }
}

// Form Handling
class FormHandler {
  constructor() {
    this.form = document.getElementById('contact-form');
    this.init();
  }

  init() {
    if (this.form) {
      this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(this.form);
    const data = Object.fromEntries(formData);
    
    // Validate form
    if (!this.validateForm(data)) {
      this.showMessage('Please fill in all fields correctly', 'error');
      return;
    }

    // Show loading state
    const submitBtn = this.form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    // Simulate form submission (in production, send to backend)
    setTimeout(() => {
      this.showMessage('Message sent successfully! I\'ll get back to you soon.', 'success');
      this.form.reset();
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }, 1000);
  }

  validateForm(data) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return data.name.trim() !== '' &&
           emailRegex.test(data.email) &&
           data.subject.trim() !== '' &&
           data.message.trim() !== '';
  }

  showMessage(message, type) {
    const messageEl = document.createElement('div');
    messageEl.className = `form-message form-message-${type}`;
    messageEl.textContent = message;
    messageEl.style.cssText = `
      padding: 1rem;
      margin-bottom: 1rem;
      border-radius: 0.75rem;
      font-weight: 500;
      animation: fadeIn 0.3s ease-out;
      background-color: ${type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)'};
      border: 1px solid ${type === 'success' ? '#10b981' : '#ef4444'};
      color: ${type === 'success' ? '#10b981' : '#ef4444'};
    `;
    
    this.form.insertBefore(messageEl, this.form.firstChild);
    
    setTimeout(() => {
      messageEl.remove();
    }, 5000);
  }
}

// Navbar scroll effect
class NavbarScroll {
  constructor() {
    this.navbar = document.getElementById('navbar');
    this.init();
  }

  init() {
    window.addEventListener('scroll', () => this.handleScroll());
  }

  handleScroll() {
    if (window.scrollY > 50) {
      this.navbar.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.4)';
    } else {
      this.navbar.style.boxShadow = 'none';
    }
  }
}

// Active navigation link based on scroll position
class ActiveNavLink {
  constructor() {
    this.links = document.querySelectorAll('.nav-link');
    this.sections = document.querySelectorAll('section[id]');
    this.init();
  }

  init() {
    window.addEventListener('scroll', () => this.updateActiveLink());
  }

  updateActiveLink() {
    let current = '';
    
    this.sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      
      if (pageYOffset >= sectionTop - 200) {
        current = section.getAttribute('id');
      }
    });

    this.links.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href').slice(1) === current) {
        link.classList.add('active');
      }
    });
  }
}

// Analytics and tracking (basic)
class Analytics {
  constructor() {
    this.init();
  }

  init() {
    // Track page view
    this.trackPageView();
    
    // Track external links
    this.trackExternalLinks();
  }

  trackPageView() {
    if (window.gtag) {
      window.gtag('config', 'GA_MEASUREMENT_ID', {
        'page_path': window.location.pathname
      });
    }
  }

  trackExternalLinks() {
    document.querySelectorAll('a[target="_blank"]').forEach(link => {
      link.addEventListener('click', () => {
        if (window.gtag) {
          window.gtag('event', 'external_link', {
            'link_url': link.href
          });
        }
      });
    });
  }
}

// Performance monitoring
class PerformanceMonitor {
  constructor() {
    this.init();
  }

  init() {
    if ('PerformanceObserver' in window) {
      try {
        // Monitor Core Web Vitals
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            console.log(`${entry.name}: ${entry.value}ms`);
          }
        });
        observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] });
      } catch (e) {
        console.log('Performance monitoring not supported');
      }
    }
  }
}

// Initialize all modules when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new ThemeManager();
  new MobileNav();
  new SmoothScroll();
  new ScrollAnimations();
  new FormHandler();
  new NavbarScroll();
  new ActiveNavLink();
  new Analytics();
  new PerformanceMonitor();
});

// Handle visibility changes
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    console.log('Page hidden');
  } else {
    console.log('Page visible');
  }
});

// Error handling
window.addEventListener('error', (event) => {
  console.error('Error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled rejection:', event.reason);
});