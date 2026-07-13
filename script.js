document.addEventListener('DOMContentLoaded', () => {
    // 1. Header Scroll Effect
    const header = document.querySelector('header');
    const whatsappSticky = document.querySelector('.whatsapp-float-btn');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Show/Hide Floating WhatsApp Button
        if (window.scrollY > 400) {
            whatsappSticky.classList.add('visible');
        } else {
            whatsappSticky.classList.remove('visible');
        }
    });

    // 2. Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav');
    
    if (menuToggle && nav) {
        menuToggle.addEventListener('click', () => {
            nav.classList.toggle('active');
            
            // Toggle hamburger animation
            const spans = menuToggle.querySelectorAll('span');
            spans[0].style.transform = nav.classList.contains('active') ? 'rotate(45deg) translate(6px, 6px)' : 'none';
            spans[1].style.opacity = nav.classList.contains('active') ? '0' : '1';
            spans[2].style.transform = nav.classList.contains('active') ? 'rotate(-45deg) translate(5px, -5px)' : 'none';
        });
        
        // Close menu when clicking nav links
        const navLinks = nav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('active');
                const spans = menuToggle.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            });
        });
    }

    // 3. Scroll Reveal Animations (Intersection Observer)
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Stop observing once revealed
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px' // Trigger slightly before element enters viewport
    });
    
    revealElements.forEach(element => {
        revealObserver.observe(element);
    });

    // 4. Dynamic WhatsApp Button Generation
    const phone = '5511986743847'; // Clean number for link (no spaces, dashes, or brackets)
    const defaultMsg = 'Olá Demerson! Gostaria de fazer um orçamento de furo em concreto para minha obra.';
    
    // Select all WhatsApp action buttons/links
    const waButtons = document.querySelectorAll('[data-wa-action]');
    
    waButtons.forEach(btn => {
        const customMsg = btn.getAttribute('data-wa-msg') || defaultMsg;
        const encodedMsg = encodeURIComponent(customMsg);
        const waLink = `https://wa.me/${phone}?text=${encodedMsg}`;
        btn.setAttribute('href', waLink);
        btn.setAttribute('target', '_blank');
        btn.setAttribute('rel', 'noopener noreferrer');
    });

    // 5. Contact Form Handler (Redirect to WhatsApp)
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const phoneVal = document.getElementById('phone').value;
            const city = document.getElementById('city').value;
            const msg = document.getElementById('message').value;
            
            const fullMsg = `Olá Demerson! Me chamo *${name}*.\n\n*Contato:* ${phoneVal}\n*Cidade/Local:* ${city}\n*Mensagem:* ${msg}\n\n_Solicitado via website ASB Perfuração._`;
            const encodedFormMsg = encodeURIComponent(fullMsg);
            
            // Redirect to WhatsApp
            window.open(`https://wa.me/${phone}?text=${encodedFormMsg}`, '_blank');
            
            // Clear form
            contactForm.reset();
        });
    }

});
