// Attendre que le DOM soit chargé
document.addEventListener('DOMContentLoaded', function() {
    // Initialiser toutes les fonctionnalités
    initMobileMenu();
    initSmoothScrolling();
    initContactForm();
    initScrollAnimations();
    initActiveNavigation();
    initGalleryModal();
    initEnhancedAnimations();
    initVideoAutoplay();
    initSoundControls();
});

/**
 * NAVIGATION MOBILE
 * Gère l'ouverture/fermeture du menu sur mobile
 */
function initMobileMenu() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (!navToggle || !navMenu) return;
    
    // Fonction pour basculer le menu
    function toggleMenu() {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        
        // Gestion de l'accessibilité
        const isExpanded = navMenu.classList.contains('active');
        navToggle.setAttribute('aria-expanded', isExpanded);
    }
    
    // Événement sur le bouton burger
    navToggle.addEventListener('click', toggleMenu);
    
    // Fermer le menu quand on clique sur un lien
    const navLinks = navMenu.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
        });
    });
    
    // Fermer le menu si on clique en dehors
    document.addEventListener('click', (e) => {
        if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
        }
    });
}

/**
 * DÉFILEMENT FLUIDE
 * Améliore la navigation vers les sections
 */
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * NAVIGATION ACTIVE
 * Met en évidence la section actuelle dans la navigation
 */
function initActiveNavigation() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    function updateActiveNavigation() {
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                // Retirer la classe active de tous les liens
                navLinks.forEach(link => link.classList.remove('active'));
                
                // Ajouter la classe active au lien correspondant
                const activeLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }
    
    // Mettre à jour au scroll avec throttling pour les performances
    let ticking = false;
    function throttledUpdate() {
        if (!ticking) {
            requestAnimationFrame(() => {
                updateActiveNavigation();
                ticking = false;
            });
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', throttledUpdate);
    updateActiveNavigation(); // Initialiser
}

/**
 * FORMULAIRE DE CONTACT
 * Gère la validation et l'envoi du formulaire
 */
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (!contactForm) return;
    
    // Validation des champs
    function validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name;
        let isValid = true;
        let errorMessage = '';
        
        // Supprimer les anciens messages d'erreur
        removeFieldError(field);
        
        // Validation selon le type de champ
        switch (fieldName) {
            case 'name':
                if (value.length < 2) {
                    isValid = false;
                    errorMessage = 'Le nom doit contenir au moins 2 caractères';
                }
                break;
                
            case 'phone':
                const phoneRegex = /^(\+237\s?)?[6-9]\d{8}$/; // Format camerounais avec indicatif optionnel
                if (!phoneRegex.test(value.replace(/\s+/g, ''))) {
                    isValid = false;
                    errorMessage = 'Numéro de téléphone invalide (ex: +237 6 77 95 38 93 ou 6 77 95 38 93)';
                }
                break;
        }
        
        // Afficher l'erreur si nécessaire
        if (!isValid) {
            showFieldError(field, errorMessage);
        }
        
        return isValid;
    }
    
    // Afficher un message d'erreur pour un champ
    function showFieldError(field, message) {
        field.classList.add('error');
        
        const errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.textContent = message;
        errorElement.style.color = '#e74c3c';
        errorElement.style.fontSize = '0.875rem';
        errorElement.style.marginTop = '0.25rem';
        
        field.parentNode.appendChild(errorElement);
    }
    
    // Supprimer le message d'erreur d'un champ
    function removeFieldError(field) {
        field.classList.remove('error');
        const errorElement = field.parentNode.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
    }
    
    // Validation en temps réel
    const requiredFields = contactForm.querySelectorAll('input[required], select[required]');
    requiredFields.forEach(field => {
        field.addEventListener('blur', () => validateField(field));
        field.addEventListener('input', () => {
            if (field.classList.contains('error')) {
                validateField(field);
            }
        });
    });
    
    // Gestion de l'envoi du formulaire
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Valider tous les champs requis
        let isFormValid = true;
        requiredFields.forEach(field => {
            if (!validateField(field)) {
                isFormValid = false;
            }
        });
        
        if (isFormValid) {
            submitForm(contactForm);
        } else {
            // Défiler vers le premier champ en erreur
            const firstError = contactForm.querySelector('.error');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                firstError.focus();
            }
        }
    });
    
    // Envoyer le formulaire via WhatsApp
    function submitForm(form) {
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        
        // Désactiver le bouton et changer le texte
        submitButton.disabled = true;
        submitButton.textContent = 'Préparation du message...';
        
        // Collecter les données du formulaire
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        // Créer le message WhatsApp
        const whatsappMessage = createWhatsAppMessage(data);
        
        // Numéro WhatsApp de l'institut (format international)
        const phoneNumber = '237677953893'; // +237 6 77 95 38 93
        
        // Créer l'URL WhatsApp
        const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(whatsappMessage)}`;
        
        // Petit délai pour l'UX puis ouvrir WhatsApp
        setTimeout(() => {
            // Ouvrir WhatsApp
            window.open(whatsappURL, '_blank');
            
            // Afficher un message de succès
            showSuccessMessage(form);
            
            // Réinitialiser le formulaire
            form.reset();
            
            // Réactiver le bouton
            submitButton.disabled = false;
            submitButton.textContent = originalText;
        }, 1000);
    }
    
    // Créer le message WhatsApp formaté
    function createWhatsAppMessage(data) {
        const message = `🌟 *NOUVELLE DEMANDE DE RENDEZ-VOUS*
📍 *Institut de Beauté GLADSTONE*

👤 *Informations Client:*
• Nom: ${data.name || 'Non renseigné'}
• Téléphone: ${data.phone || 'Non renseigné'}
• Email: ${data.email || 'Non renseigné'}

💅 *Service demandé:*
${data.service || 'Non précisé'}

📅 *Date souhaitée:*
${data.date ? formatDate(data.date) : 'Non précisée'}

⏰ *Heure préférée:*
${data.time || 'Non précisée'}

💬 *Message:*
${data.message || 'Aucun message particulier'}

---
_Message envoyé depuis le site web GLADSTONE_`;

        return message;
    }
    
    // Formater la date en français
    function formatDate(dateString) {
        const date = new Date(dateString);
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        return date.toLocaleDateString('fr-FR', options);
    }
    
    // Afficher un message de succès
    function showSuccessMessage(form) {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.innerHTML = `
            <div style="
                background-color: #d4edda;
                color: #155724;
                padding: 1.5rem;
                border-radius: 12px;
                border: 1px solid #c3e6cb;
                margin-bottom: 1rem;
                text-align: center;
                box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            ">
                <div style="font-size: 2rem; margin-bottom: 0.5rem;">📱</div>
                <strong>✓ Message WhatsApp préparé !</strong><br>
                <span style="font-size: 0.9rem; opacity: 0.8;">
                    WhatsApp va s'ouvrir avec votre demande de rendez-vous.<br>
                    Il vous suffit d'appuyer sur "Envoyer" dans WhatsApp.
                </span>
            </div>
        `;
        
        form.parentNode.insertBefore(successDiv, form);
        
        // Supprimer le message après 7 secondes
        setTimeout(() => {
            successDiv.remove();
        }, 7000);
    }
}

/**
 * ANIMATIONS AU SCROLL
 * Anime les éléments quand ils entrent dans la vue
 */
function initScrollAnimations() {
    // Utiliser Intersection Observer pour les performances
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target); // Arrêter l'observation une fois animé
            }
        });
    }, observerOptions);
    
    // Observer les éléments à animer
    const animatedElements = document.querySelectorAll('.service-card, .testimonial-card, .gallery-item');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });
    
    // Style pour l'animation
    const style = document.createElement('style');
    style.textContent = `
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);
}

/**
 * UTILITAIRES
 */

// Fonction pour debouncer les événements (optimisation des performances)
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Fonction pour throttler les événements (optimisation des performances)
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Gestion des erreurs globales
window.addEventListener('error', function(e) {
    console.error('Erreur JavaScript:', e.error);
    // Ici vous pourriez envoyer l'erreur à un service de monitoring
});

// Amélioration de l'accessibilité au clavier
document.addEventListener('keydown', function(e) {
    // Fermer le menu mobile avec Escape
    if (e.key === 'Escape') {
        const navToggle = document.getElementById('navToggle');
        const navMenu = document.getElementById('navMenu');
        
        if (navMenu && navMenu.classList.contains('active')) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
            navToggle.focus();
        }
    }
});

/**
 * GALERIE INTERACTIVE
 * Gère l'ouverture de la galerie en modal
 */
function initGalleryModal() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const modal = document.getElementById('galleryModal');
    const modalImage = document.getElementById('modalImage');
    const modalTitle = document.getElementById('modalTitle');
    const modalDescription = document.getElementById('modalDescription');
    const modalClose = document.querySelector('.modal-close');
    const modalPrev = document.getElementById('modalPrev');
    const modalNext = document.getElementById('modalNext');
    
    if (!modal || galleryItems.length === 0) return;
    
    let currentImageIndex = 0;
    const images = Array.from(galleryItems);
    
    // Fonction pour ouvrir le modal
    function openModal(index) {
        currentImageIndex = index;
        updateModalContent();
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    // Fonction pour fermer le modal
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // Fonction pour mettre à jour le contenu du modal
    function updateModalContent() {
        const currentItem = images[currentImageIndex];
        const img = currentItem.querySelector('img');
        const info = currentItem.querySelector('.gallery-info');
        
        modalImage.src = img.src;
        modalImage.alt = img.alt;
        
        if (info) {
            modalTitle.textContent = info.querySelector('h4').textContent;
            modalDescription.textContent = info.querySelector('p').textContent;
        }
    }
    
    // Fonction pour image suivante
    function showNext() {
        currentImageIndex = (currentImageIndex + 1) % images.length;
        updateModalContent();
    }
    
    // Fonction pour image précédente
    function showPrevious() {
        currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
        updateModalContent();
    }
    
    // Évènements sur les items de galerie
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => openModal(index));
    });
    
    // Évènements sur les contrôles du modal
    modalClose.addEventListener('click', closeModal);
    modalNext.addEventListener('click', showNext);
    modalPrev.addEventListener('click', showPrevious);
    
    // Fermer en cliquant en dehors
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Navigation au clavier
    document.addEventListener('keydown', (e) => {
        if (!modal.classList.contains('active')) return;
        
        switch (e.key) {
            case 'Escape':
                closeModal();
                break;
            case 'ArrowRight':
                showNext();
                break;
            case 'ArrowLeft':
                showPrevious();
                break;
        }
    });
}

/**
 * ANIMATIONS AMÉLIORÉES
 * Gère les animations au scroll plus sophistiquées
 */
function initEnhancedAnimations() {
    // Animation des éléments au scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Animation staggered pour les éléments en groupe
                if (entry.target.classList.contains('staggered-parent')) {
                    const children = entry.target.querySelectorAll('.staggered-child');
                    children.forEach((child, index) => {
                        setTimeout(() => {
                            child.classList.add('visible');
                        }, index * 150);
                    });
                }
            }
        });
    }, observerOptions);
    
    // Observer les éléments à animer
    const elementsToAnimate = document.querySelectorAll('.fade-in-on-scroll, .about-highlights, .services-grid, .gallery-grid');
    elementsToAnimate.forEach(el => {
        el.classList.add('fade-in-on-scroll');
        animationObserver.observe(el);
    });
    
    // Animation des statistiques hero
    const heroStats = document.querySelectorAll('.stat-number');
    heroStats.forEach(stat => {
        const finalValue = parseFloat(stat.textContent);
        let currentValue = 0;
        const increment = finalValue / 50;
        const duration = 20;
        
        const timer = setInterval(() => {
            currentValue += increment;
            if (currentValue >= finalValue) {
                currentValue = finalValue;
                clearInterval(timer);
            }
            
            // Formater selon le type de valeur
            if (finalValue % 1 !== 0) {
                stat.textContent = currentValue.toFixed(1);
            } else {
                stat.textContent = Math.floor(currentValue) + (finalValue >= 20 ? '+' : '');
            }
        }, duration);
    });
}

// Performance: Preload des images critiques
function preloadCriticalImages() {
    const criticalImages = [
        '2025-02-07.webp',
        '2024-11-13.webp',
        'video_services.mp4',
        'video_locaux.mp4'
    ];
    
    criticalImages.forEach(src => {
        if (src.endsWith('.mp4')) {
            const video = document.createElement('video');
            video.preload = 'metadata';
            video.muted = true;
            video.src = src;
        } else {
            const img = new Image();
            img.src = src;
        }
    });
}

// Fonction pour gérer l'autoplay des vidéos
function initVideoAutoplay() {
    const videos = document.querySelectorAll('video[autoplay]');
    
    videos.forEach(video => {
        video.muted = true; // Nécessaire pour l'autoplay
        video.setAttribute('playsinline', ''); // Pour iOS
        
        // Forcer la lecture si elle ne démarre pas automatiquement
        video.addEventListener('loadedmetadata', () => {
            const playPromise = video.play();
            
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.log('Autoplay bloqué par le navigateur:', error);
                    // Ajouter un bouton de lecture si nécessaire
                    addPlayButton(video);
                });
            }
        });
    });
}

// Ajouter un bouton de lecture si l'autoplay est bloqué
function addPlayButton(video) {
    const playButton = document.createElement('button');
    playButton.innerHTML = '▶️ Lancer la vidéo';
    playButton.className = 'video-play-button';
    playButton.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: var(--primary-color);
        color: white;
        border: none;
        padding: 1rem 2rem;
        border-radius: 25px;
        font-size: 1rem;
        cursor: pointer;
        z-index: 10;
        box-shadow: 0 4px 15px rgba(0,0,0,0.3);
    `;
    
    video.parentElement.style.position = 'relative';
    video.parentElement.appendChild(playButton);
    
    playButton.addEventListener('click', () => {
        video.play().then(() => {
            playButton.remove();
        });
    });
}

// Performance: Lazy loading pour les images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    // Observer toutes les images avec loading="lazy"
    document.querySelectorAll('img[loading="lazy"]').forEach(img => {
        imageObserver.observe(img);
    });
}

/**
 * CONTRÔLES DE SON DES VIDÉOS
 * Gère l'activation/désactivation du son des vidéos
 */
function initSoundControls() {
    // Configuration des contrôles de son pour chaque vidéo
    const videoControls = [
        {
            videoId: 'heroVideo',
            toggleId: 'heroSoundToggle'
        },
        {
            videoId: 'aboutVideo',
            toggleId: 'aboutSoundToggle'
        }
    ];
    
    videoControls.forEach(control => {
        const video = document.getElementById(control.videoId);
        const toggle = document.getElementById(control.toggleId);
        
        if (!video || !toggle) return;
        
        // État initial (muted)
        let isMuted = true;
        updateSoundIcon(toggle, isMuted);
        
        // Fonction pour basculer le son
        function toggleSound() {
            isMuted = !isMuted;
            video.muted = isMuted;
            updateSoundIcon(toggle, isMuted);
            
            // Animation de feedback
            toggle.style.transform = 'scale(0.8)';
            setTimeout(() => {
                toggle.style.transform = 'scale(1)';
            }, 150);
            
            // Notification sonore (si activé)
            if (!isMuted) {
                showSoundNotification(video);
            }
        }
        
        // Événement sur le bouton
        toggle.addEventListener('click', toggleSound);
        
        // Raccourci clavier (optionnel)
        video.addEventListener('click', (e) => {
            // Double-click pour basculer le son
            if (e.detail === 2) {
                toggleSound();
            }
        });
    });
}

// Mettre à jour l'icône du bouton selon l'état
function updateSoundIcon(button, isMuted) {
    if (isMuted) {
        button.innerHTML = '🔇';
        button.title = 'Activer le son';
        button.setAttribute('aria-label', 'Activer le son');
    } else {
        button.innerHTML = '🔊';
        button.title = 'Désactiver le son';
        button.setAttribute('aria-label', 'Désactiver le son');
    }
}

// Notification visuelle quand le son est activé
function showSoundNotification(video) {
    const notification = document.createElement('div');
    notification.innerHTML = '🔊 Son activé';
    notification.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(183, 110, 121, 0.9);
        color: white;
        padding: 0.75rem 1.5rem;
        border-radius: 25px;
        font-size: 0.875rem;
        font-weight: 500;
        z-index: 1000;
        pointer-events: none;
        box-shadow: 0 4px 15px rgba(0,0,0,0.3);
        animation: fadeInOut 2s ease-in-out;
    `;
    
    // Ajouter l'animation CSS
    if (!document.getElementById('soundNotificationStyle')) {
        const style = document.createElement('style');
        style.id = 'soundNotificationStyle';
        style.textContent = `
            @keyframes fadeInOut {
                0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
                20% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                80% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
            }
        `;
        document.head.appendChild(style);
    }
    
    video.parentElement.appendChild(notification);
    
    // Supprimer après l'animation
    setTimeout(() => {
        notification.remove();
    }, 2000);
}

// Initialiser le preload au chargement
window.addEventListener('load', preloadCriticalImages);