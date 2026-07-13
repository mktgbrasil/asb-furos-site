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

    // 6. Real-time Canvas Drilling Effects (Water Splashing, Mist, Rotation Sheen)
    const canvas = document.getElementById('drillEffectsCanvas');
    const heroImage = document.getElementById('heroDrillImg');
    
    if (canvas && heroImage) {
        const ctx = canvas.getContext('2d');
        let animationFrameId;
        
        // Match canvas coordinate system with display size
        function resizeCanvas() {
            const rect = canvas.getBoundingClientRect();
            canvas.width = rect.width * window.devicePixelRatio;
            canvas.height = rect.height * window.devicePixelRatio;
            ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        }
        
        // Wait for image load or use bounding rect if already loaded
        if (heroImage.complete) {
            resizeCanvas();
        } else {
            heroImage.addEventListener('load', resizeCanvas);
        }
        window.addEventListener('resize', resizeCanvas);
        
        // Particle Definitions
        const particles = [];
        const splats = [];
        let rotationAngle = 0;
        
        class Particle {
            constructor(x, y, isWater = true) {
                this.x = x;
                this.y = y;
                this.isWater = isWater;
                
                // Speed & Direction (most fly upwards and out)
                const angle = (Math.random() * -0.5 - 0.25) * Math.PI; // -45 to -135 degrees (upwards)
                const speed = Math.random() * 4 + 2;
                
                this.vx = Math.cos(angle) * speed + (Math.random() - 0.5) * 1.5;
                this.vy = Math.sin(angle) * speed - (Math.random() * 2);
                
                // Gravity
                this.gravity = 0.15;
                
                // Size & Life
                this.size = Math.random() * (isWater ? 3.5 : 5) + 1.5;
                this.opacity = Math.random() * 0.5 + 0.5;
                this.life = 1.0;
                this.decay = Math.random() * 0.02 + 0.015;
                
                // Lens targeting
                this.isLensTarget = Math.random() < 0.08; // 8% chance to splash screen
                this.z = 1.0; // 3D depth simulation
                this.vz = Math.random() * 0.04 + 0.02; // moves "forward"
            }
            
            update(w, h) {
                if (this.isLensTarget) {
                    this.z -= this.vz; // Move closer to screen
                    // Scale coordinates outward to simulate 3D projection
                    const centerX = w * 0.35;
                    const centerY = h * 0.75;
                    this.x = centerX + (this.x - centerX) * (1 / this.z);
                    this.y = centerY + (this.y - centerY) * (1 / this.z);
                    this.size += 0.5; // grows larger
                    
                    if (this.z <= 0.15) {
                        // Hits the screen! Create splat
                        splats.push(new Splat(this.x, this.y));
                        this.life = 0; // kill particle
                        return;
                    }
                } else {
                    this.x += this.vx;
                    this.vy += this.gravity;
                    this.y += this.vy;
                }
                
                this.life -= this.decay;
            }
            
            draw(ctx) {
                if (this.life <= 0) return;
                ctx.save();
                ctx.globalAlpha = this.opacity * this.life;
                
                if (this.isWater) {
                    // Draw shiny water droplet
                    ctx.fillStyle = 'rgba(200, 220, 255, 0.8)';
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                    ctx.fill();
                } else {
                    // Draw concrete powder/dust mist
                    ctx.fillStyle = 'rgba(211, 211, 211, 0.4)';
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.size * 1.5, 0, Math.PI * 2);
                    ctx.fill();
                }
                ctx.restore();
            }
        }
        
        class Splat {
            constructor(x, y) {
                this.x = Math.max(10, Math.min(x, canvas.width / window.devicePixelRatio - 10));
                this.y = Math.max(10, Math.min(y, canvas.height / window.devicePixelRatio - 10));
                this.size = Math.random() * 12 + 6;
                this.opacity = Math.random() * 0.4 + 0.3;
                this.life = 1.0;
                this.decay = Math.random() * 0.008 + 0.006;
                this.slideSpeed = Math.random() * 0.15 + 0.05;
            }
            
            update() {
                this.y += this.slideSpeed; // trickle down
                this.life -= this.decay;
            }
            
            draw(ctx) {
                if (this.life <= 0) return;
                ctx.save();
                ctx.globalAlpha = this.opacity * this.life;
                
                // Draw splat pattern
                ctx.fillStyle = 'rgba(230, 240, 255, 0.4)';
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
                
                // Draw small secondary runs/drips
                ctx.beginPath();
                ctx.arc(this.x, this.y - this.size * 0.3, this.size * 0.7, 0, Math.PI * 2);
                ctx.arc(this.x + this.size * 0.2, this.y + this.size * 0.5, this.size * 0.5, 0, Math.PI * 2);
                ctx.fill();
                
                ctx.restore();
            }
        }
        
        function animate() {
            const w = canvas.width / window.devicePixelRatio;
            const h = canvas.height / window.devicePixelRatio;
            
            ctx.clearRect(0, 0, w, h);
            
            // Contact Point coords (where core bit meets concrete)
            const startX = w * 0.35;
            const startY = h * 0.75;
            
            // 1. Generate particles at drilling contact area
            // Water spray (from core cooling water)
            if (Math.random() < 0.6) {
                particles.push(new Particle(startX + (Math.random() - 0.5) * 15, startY + (Math.random() - 0.5) * 10, true));
            }
            // Concrete dust mist
            if (Math.random() < 0.4) {
                particles.push(new Particle(startX + (Math.random() - 0.5) * 20, startY + (Math.random() - 0.5) * 10, false));
            }
            
            // Update & Draw particles
            for (let i = particles.length - 1; i >= 0; i--) {
                const p = particles[i];
                p.update(w, h);
                if (p.life <= 0 || p.x < 0 || p.x > w || p.y > h) {
                    particles.splice(i, 1);
                } else {
                    p.draw(ctx);
                }
            }
            
            // Update & Draw screen splats (water hitting the camera)
            for (let i = splats.length - 1; i >= 0; i--) {
                const s = splats[i];
                s.update();
                if (s.life <= 0) {
                    splats.splice(i, 1);
                } else {
                    s.draw(ctx);
                }
            }
            
            // 2. Draw Rotation Sheen on Gold Core Bit
            // Golden core bit coordinates in image: roughly from x=26% to x=55%, y=45% to y=75%
            const bitLeft = w * 0.26;
            const bitWidth = w * 0.28;
            const bitTop = h * 0.44;
            const bitHeight = h * 0.31;
            
            rotationAngle = (rotationAngle + 0.08) % (Math.PI * 2);
            
            ctx.save();
            // Create a path clip corresponding to the tilted core bit shape
            ctx.beginPath();
            // Golden core bit is skewed/tilted in the photo. Let's make a skewed clip path
            ctx.moveTo(w * 0.45, h * 0.45);
            ctx.lineTo(w * 0.56, h * 0.49);
            ctx.lineTo(w * 0.45, h * 0.81);
            ctx.lineTo(w * 0.25, h * 0.74);
            ctx.closePath();
            ctx.clip();
            
            // Draw rotating reflection lines
            const sheenX = bitLeft + (Math.sin(rotationAngle) * 0.5 + 0.5) * bitWidth;
            const grad = ctx.createLinearGradient(sheenX - 40, bitTop, sheenX + 40, bitTop);
            grad.addColorStop(0, 'rgba(255, 255, 255, 0)');
            grad.addColorStop(0.5, 'rgba(255, 230, 150, 0.45)');
            grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
            
            ctx.fillStyle = grad;
            ctx.fillRect(bitLeft - 50, bitTop, bitWidth + 100, bitHeight);
            
            // Draw a second reflection line 180 degrees out of phase
            const sheenX2 = bitLeft + (Math.sin(rotationAngle + Math.PI) * 0.5 + 0.5) * bitWidth;
            const grad2 = ctx.createLinearGradient(sheenX2 - 30, bitTop, sheenX2 + 30, bitTop);
            grad2.addColorStop(0, 'rgba(255, 255, 255, 0)');
            grad2.addColorStop(0.5, 'rgba(255, 255, 255, 0.3)');
            grad2.addColorStop(1, 'rgba(255, 255, 255, 0)');
            
            ctx.fillStyle = grad2;
            ctx.fillRect(bitLeft - 50, bitTop, bitWidth + 100, bitHeight);
            ctx.restore();
            
            animationFrameId = requestAnimationFrame(animate);
        }
        
        // Start animation loop
        animate();
    }
});
