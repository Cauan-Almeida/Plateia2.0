// Espera o DOM ser completamente carregado
document.addEventListener('DOMContentLoaded', function() {
    // Menu mobile toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const header = document.querySelector('.header');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function(event) {
            // Previne comportamento padrão
            event.preventDefault();
            event.stopPropagation();
            
            // Toggle do menu mobile
            mobileMenu.classList.toggle('active');
            header.classList.toggle('menu-open');
            
            // Alterna o ícone do menu
            const icon = menuToggle.querySelector('i');
            if (icon.classList.contains('fa-bars')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
            
            console.log('Menu toggle clicado', mobileMenu.classList.contains('active'));
        });
    }
        
    // Fecha o menu ao clicar em um link
    document.querySelectorAll('.mobile-menu a').forEach(link => {
        link.addEventListener('click', function() {
            mobileMenu.classList.remove('active');
            header.classList.remove('menu-open');
            
            const icon = menuToggle.querySelector('i');
            if (icon.classList.contains('fa-times')) {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    });
    
    // Carrossel de depoimentos
    const testimonialContainer = document.querySelector('.testimonial-container');
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const dots = document.querySelectorAll('.dot');
    
    if (testimonialContainer && testimonialCards.length > 0) {
        let currentIndex = 0;
        
        // Inicializa o carrossel
        function initCarousel() {
            // Configura a largura do container baseado no número de cards
            testimonialContainer.style.width = `${testimonialCards.length * 100}%`;
            
            // Configura a largura de cada card
            testimonialCards.forEach(card => {
                card.style.width = `${100 / testimonialCards.length}%`;
            });
            
            // Define o primeiro card como ativo desde o início
            testimonialCards[0].classList.add('active');
            
            // Atualiza o carrossel para a posição inicial
            updateCarousel();
        }
        
        // Função para atualizar o carrossel
        function updateCarousel() {
            testimonialContainer.style.transform = `translateX(-${currentIndex * (100 / testimonialCards.length)}%)`;
            
            // Atualiza os dots e aplica efeito fade
            dots.forEach((dot, index) => {
                if (index === currentIndex) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
            
            // Aplica efeito fade nos cards
            testimonialCards.forEach((card, index) => {
                if (index === currentIndex) {
                    card.classList.add('active');
                } else {
                    card.classList.remove('active');
                }
            });
        }
        
        // Inicializa o carrossel
        initCarousel();
        
        // Ajusta o carrossel quando a janela é redimensionada
        window.addEventListener('resize', initCarousel);
        
        // Event listeners para os botões de navegação
        if (prevBtn) {
            prevBtn.addEventListener('click', function() {
                currentIndex = (currentIndex === 0) ? testimonialCards.length - 1 : currentIndex - 1;
                updateCarousel();
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', function() {
                currentIndex = (currentIndex === testimonialCards.length - 1) ? 0 : currentIndex + 1;
                updateCarousel();
            });
        }
        
        // Event listeners para os dots
        dots.forEach((dot, index) => {
            dot.addEventListener('click', function() {
                currentIndex = index;
                updateCarousel();
            });
        });
        
        // Rotação automática do carrossel
        let autoSlide = setInterval(() => {
            currentIndex = (currentIndex === testimonialCards.length - 1) ? 0 : currentIndex + 1;
            updateCarousel();
        }, 5000);
        
        // Pausa a rotação automática quando o mouse está sobre o carrossel
        testimonialContainer.addEventListener('mouseenter', () => {
            clearInterval(autoSlide);
        });
        
        // Retoma a rotação automática quando o mouse sai do carrossel
        testimonialContainer.addEventListener('mouseleave', () => {
            autoSlide = setInterval(() => {
                currentIndex = (currentIndex === testimonialCards.length - 1) ? 0 : currentIndex + 1;
                updateCarousel();
            }, 5000);
        });
    }
    
    // Navegação suave para links internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Animação de fade-in para elementos ao rolar a página
    const fadeElements = document.querySelectorAll('.feature-block, .testimonial-card, .cta-content');
    
    function checkFade() {
        fadeElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight - 100) {
                element.classList.add('fade-in');
            }
        });
    }
    
    // Adiciona a classe fade-in aos elementos visíveis no carregamento inicial
    window.addEventListener('load', checkFade);
    
    // Verifica elementos ao rolar a página
    window.addEventListener('scroll', checkFade);
});
