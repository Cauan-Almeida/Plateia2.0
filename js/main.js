// Menu Mobile
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM carregado, configurando eventos...');
    
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const body = document.body;
    const logoLink = document.querySelector('.logo a');
    const googleLoginBtn = document.querySelector('.btn-google');

    // Configurar menu mobile apenas se os elementos existirem
    if (menuToggle && mobileMenu) {
        console.log('Configurando menu mobile...');
        menuToggle.addEventListener('click', function() {
            mobileMenu.classList.toggle('active');
            body.classList.toggle('menu-open');
        });

        // Fechar menu ao clicar em um link
        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
                body.classList.remove('menu-open');
            });
        });

        // Fechar menu ao clicar fora
        document.addEventListener('click', function(event) {
            if (!mobileMenu.contains(event.target) && !menuToggle.contains(event.target)) {
                mobileMenu.classList.remove('active');
                body.classList.remove('menu-open');
            }
        });
    }

    // Configurar o comportamento do logo
    if (logoLink) {
        console.log('Configurando evento do logo...');
        logoLink.addEventListener('click', function(e) {
            e.preventDefault();
            handleLogoClick();
        });
    }

    // Configurar login com Google
    if (googleLoginBtn) {
        console.log('Configurando evento do botão Google...');
        googleLoginBtn.addEventListener('click', function(e) {
            e.preventDefault();
            loginWithGoogle();
        });
    }
});

// Funções de Autenticação
function handleLogin(event) {
    console.log('Tentando fazer login...');
    event.preventDefault();
    const email = document.getElementById('email');
    const password = document.getElementById('password');

    if (!email || !password) {
        console.error('Campos de email ou senha não encontrados');
        return;
    }

    console.log('Email:', email.value);
    login(email.value, password.value)
        .catch((error) => {
            console.error('Erro no login:', error);
            alert('Erro ao fazer login: ' + error.message);
        });
}

function handleRegister(event) {
    console.log('Tentando criar conta...');
    event.preventDefault();
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirmPassword');

    if (!email || !password || !confirmPassword) {
        console.error('Campos de formulário não encontrados');
        return;
    }

    console.log('Email:', email.value);

    if (password.value !== confirmPassword.value) {
        console.error('Senhas não coincidem');
        alert('As senhas não coincidem!');
        return;
    }

    register(email.value, password.value)
        .catch((error) => {
            console.error('Erro ao criar conta:', error);
            alert('Erro ao criar conta: ' + error.message);
        });
}

// Adicionar event listeners aos formulários
document.addEventListener('DOMContentLoaded', function() {
    console.log('Configurando formulários...');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    if (loginForm) {
        console.log('Formulário de login encontrado');
        loginForm.addEventListener('submit', handleLogin);
    }

    if (registerForm) {
        console.log('Formulário de registro encontrado');
        registerForm.addEventListener('submit', handleRegister);
    }
});

// Atualizar informações do usuário no dashboard
document.addEventListener('DOMContentLoaded', function() {
    // Verificar se estamos na página do dashboard
    if (window.location.pathname.includes('dashboard.html')) {
        // Verificar autenticação
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                // Atualizar nome do usuário
                const userNameElement = document.getElementById('user-name');
                if (userNameElement) {
                    userNameElement.textContent = user.displayName || user.email || 'Usuário';
                }
                
                // Atualizar avatar do usuário se disponível
                if (user.photoURL) {
                    const userAvatarElement = document.querySelector('.user-avatar');
                    if (userAvatarElement) {
                        userAvatarElement.src = user.photoURL;
                        
                        // Adicionar tratamento de erro para a imagem
                        userAvatarElement.onerror = function() {
                            this.src = 'images/usuario.png';
                        };
                    }
                }
            }
        });
    }
}); 