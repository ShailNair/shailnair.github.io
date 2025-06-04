/*
 * Modern Portfolio Website
 * Enhanced functionality with smooth animations and interactions
 */

(function($) {
    'use strict';

    // Initialize AOS (Animate On Scroll)
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        offset: 100
    });

    // Variables
    var $window = $(window),
        $body = $('body'),
        $navbar = $('#navbar'),
        $navLinks = $('.nav-link'),
        $navToggle = $('#navToggle'),
        $navMenu = $('#navMenu');

    // Remove preload class after page loads
    $window.on('load', function() {
        setTimeout(function() {
            $body.removeClass('is-preload');
        }, 100);
    });

    // Navbar scroll effect
    $window.on('scroll', function() {
        if ($window.scrollTop() > 50) {
            $navbar.addClass('scrolled');
        } else {
            $navbar.removeClass('scrolled');
        }
    });

    // Mobile navigation toggle
    $navToggle.on('click', function() {
        $navMenu.toggleClass('active');
        $(this).toggleClass('active');
    });

    // Close mobile menu when clicking on a link
    $navLinks.on('click', function() {
        $navMenu.removeClass('active');
        $navToggle.removeClass('active');
    });

    // Smooth scrolling for navigation links
    $('a[href^="#"]').on('click', function(e) {
        e.preventDefault();
        var target = $(this.getAttribute('href'));
        if (target.length) {
            var scrollTop = target.offset().top - 80;
            $('html, body').animate({
                scrollTop: scrollTop
            }, 800);
        }
    });

    // Active navigation link highlighting
    function updateActiveNav() {
        var scrollPosition = $window.scrollTop() + 100;
        
        $('section').each(function() {
            var currentSection = $(this);
            var sectionTop = currentSection.offset().top;
            var sectionBottom = sectionTop + currentSection.outerHeight();
            var sectionId = currentSection.attr('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                $navLinks.removeClass('active');
                $('.nav-link[href="#' + sectionId + '"]').addClass('active');
            }
        });
    }

    $window.on('scroll', updateActiveNav);
    updateActiveNav();

    // Parallax effect for hero section
    if (!browser.mobile) {
        $window.on('scroll', function() {
            var scrolled = $window.scrollTop();
            var parallaxSpeed = 0.5;
            $('.hero-background').css('transform', 'translateY(' + (scrolled * parallaxSpeed) + 'px)');
        });
    }

    // Dynamic typing effect for hero subtitle
    function typeWriter(element, text, speed) {
        var i = 0;
        var $element = $(element);
        $element.empty();
        
        function type() {
            if (i < text.length) {
                $element.append(text.charAt(i));
                i++;
                setTimeout(type, speed);
            }
        }
        
        type();
    }

    // Initialize typing effect after page loads
    $window.on('load', function() {
        setTimeout(function() {
            typeWriter('.hero-subtitle', 'Marine Microbiologist', 100);
        }, 500);
    });

    // Lazy loading for images
    function lazyLoadImages() {
        $('img[data-src]').each(function() {
            var $img = $(this);
            var src = $img.data('src');
            
            if ($img.offset().top < $window.scrollTop() + $window.height() + 100) {
                $img.attr('src', src).removeAttr('data-src');
            }
        });
    }

    $window.on('scroll', lazyLoadImages);
    lazyLoadImages();

    // Counter animation for statistics (if needed in future)
    function animateCounter($element, start, end, duration) {
        var range = end - start;
        var current = start;
        var increment = end > start ? 1 : -1;
        var stepTime = Math.abs(Math.floor(duration / range));
        
        var timer = setInterval(function() {
            current += increment;
            $element.text(current);
            
            if (current == end) {
                clearInterval(timer);
            }
        }, stepTime);
    }

    // Form validation (if contact form is added in future)
    function validateEmail(email) {
        var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // Smooth reveal animations for elements
    function revealOnScroll() {
        var reveals = document.querySelectorAll('.reveal');
        
        reveals.forEach(function(element) {
            var windowHeight = window.innerHeight;
            var elementTop = element.getBoundingClientRect().top;
            var elementVisible = 150;
            
            if (elementTop < windowHeight - elementVisible) {
                element.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', revealOnScroll);

    // Initialize tooltips (if using Bootstrap tooltips)
    // Removed tooltip initialization to fix error: $(...).tooltip is not a function
    // $('[data-toggle="tooltip"]').tooltip();

    // Handle window resize
    var resizeTimer;
    $window.on('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            // Update any size-dependent features
            updateActiveNav();
            AOS.refresh();
        }, 250);
    });

    // Preloader (if needed)
    function hidePreloader() {
        $('.preloader').fadeOut('slow');
    }

    // Social links hover effect
    $('.social-link').on('mouseenter', function() {
        $(this).addClass('pulse');
    }).on('mouseleave', function() {
        $(this).removeClass('pulse');
    });

    // Back to top button (if implemented)
    var $backToTop = $('.back-to-top');
    
    $window.on('scroll', function() {
        if ($window.scrollTop() > 300) {
            $backToTop.fadeIn();
        } else {
            $backToTop.fadeOut();
        }
    });
    
    $backToTop.on('click', function(e) {
        e.preventDefault();
        $('html, body').animate({scrollTop: 0}, 800);
    });

    // Initialize any third-party plugins
    function initPlugins() {
        // Initialize any sliders, galleries, etc.
    }

    // Document ready
    $(document).ready(function() {
        initPlugins();
        hidePreloader();
    });

})(jQuery);
