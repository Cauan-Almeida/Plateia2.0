// Script específico para a página index.html
document.addEventListener('DOMContentLoaded', function() {
    // Garantir que o menu mobile funcione corretamente
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', function() {
            mobileMenu.classList.toggle('active');
            console.log('Menu toggle clicado (index)', mobileMenu.classList.contains('active'));
        });
    }
    
    // Carrossel de depoimentos específico para index
    const testimonialContainer = document.querySelector('.index-testimonial-container');
    const testimonialCards = document.querySelectorAll('.index-testimonial-card');
    const prevBtn = document.querySelector('.index-prev-btn');
    const nextBtn = document.querySelector('.index-next-btn');
    const dots = document.querySelectorAll('.index-dot');
    
    if (testimonialContainer && testimonialCards.length > 0) {
        let currentIndex = 0;
        let isMobile = window.innerWidth <= 768;
        
        // Inicializa o carrossel
        function initCarousel() {
            isMobile = window.innerWidth <= 768;
            
            if (isMobile) {
                // Em dispositivos móveis, mostramos apenas um card por vez
                testimonialContainer.style.width = '100%';
                
                testimonialCards.forEach((card, index) => {
                    card.style.width = '100%';
                    if (index === currentIndex) {
                        card.classList.add('active');
                        card.style.display = 'block';
                    } else {
                        card.classList.remove('active');
                        card.style.display = 'none';
                    }
                });
            } else {
                // Em desktop, configuramos o carrossel normal
                testimonialContainer.style.width = `${testimonialCards.length * 100}%`;
                
                testimonialCards.forEach(card => {
                    card.style.width = `${100 / testimonialCards.length}%`;
                    card.style.display = 'block';
                });
                
                // Atualiza o carrossel para a posição atual
                updateCarousel();
            }
            
            // Atualiza os dots
            updateDots();
        }
        
        // Função para atualizar o carrossel
        function updateCarousel() {
            if (!isMobile) {
                testimonialContainer.style.transform = `translateX(-${currentIndex * (100 / testimonialCards.length)}%)`;
            } else {
                testimonialCards.forEach((card, index) => {
                    if (index === currentIndex) {
                        card.classList.add('active');
                        card.style.display = 'block';
                    } else {
                        card.classList.remove('active');
                        card.style.display = 'none';
                    }
                });
            }
            
            updateDots();
        }
        
        // Função para atualizar os dots
        function updateDots() {
            dots.forEach((dot, index) => {
                if (index === currentIndex) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        }
        
        // Inicializa o carrossel
        initCarousel();
        
        // Ajusta o carrossel quando a janela é redimensionada
        window.addEventListener('resize', initCarousel);
        
        // Event listeners para os botões de navegação
        prevBtn.addEventListener('click', function() {
            currentIndex = (currentIndex === 0) ? testimonialCards.length - 1 : currentIndex - 1;
            updateCarousel();
        });
        
        nextBtn.addEventListener('click', function() {
            currentIndex = (currentIndex === testimonialCards.length - 1) ? 0 : currentIndex + 1;
            updateCarousel();
        });
        
        // Event listeners para os dots
        dots.forEach((dot, index) => {
            dot.addEventListener('click', function() {
                currentIndex = index;
                updateCarousel();
            });
        });
        
        // Suporte para gestos de swipe em dispositivos móveis
        let touchStartX = 0;
        let touchEndX = 0;
        
        testimonialContainer.addEventListener('touchstart', function(e) {
            touchStartX = e.changedTouches[0].screenX;
        }, false);
        
        testimonialContainer.addEventListener('touchend', function(e) {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, false);
        
        function handleSwipe() {
            if (touchEndX < touchStartX) {
                // Swipe para a esquerda (próximo)
                currentIndex = (currentIndex === testimonialCards.length - 1) ? 0 : currentIndex + 1;
            } else if (touchEndX > touchStartX) {
                // Swipe para a direita (anterior)
                currentIndex = (currentIndex === 0) ? testimonialCards.length - 1 : currentIndex - 1;
            }
            updateCarousel();
        }
        
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
        
        // Efeito de hover nos cards de depoimentos
        testimonialCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                testimonialCards.forEach(c => c.style.opacity = '0.7');
                card.style.opacity = '1';
                card.style.transform = 'scale(1.05)';
            });
            
            card.addEventListener('mouseleave', () => {
                testimonialCards.forEach(c => {
                    if (c.classList.contains('active')) {
                        c.style.opacity = '1';
                        c.style.transform = 'scale(1.05)';
                    } else {
                        c.style.opacity = '0.7';
                        c.style.transform = 'scale(1)';
                    }
                });
            });
        });
    }
}); 