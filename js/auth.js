// Configuração do Firebase
const firebaseConfig = {
    // Substitua com suas credenciais do Firebase
    apiKey: "SUA_API_KEY",
    authDomain: "seu-projeto.firebaseapp.com",
    projectId: "seu-projeto",
    storageBucket: "seu-projeto.appspot.com",
    messagingSenderId: "seu-messaging-sender-id",
    appId: "seu-app-id"
};

// Inicializar Firebase
try {
    firebase.initializeApp(firebaseConfig);
    console.log('Firebase inicializado com sucesso');
} catch (error) {
    console.error('Erro ao inicializar Firebase:', error);
}

document.addEventListener('DOMContentLoaded', function() {
    // Verificar em qual página estamos
    const isLoginPage = window.location.pathname.includes('login.html');
    const isRegisterPage = window.location.pathname.includes('registro.html');
    
    // Formulário de login
    if (isLoginPage) {
        const loginForm = document.querySelector('.auth-form');
        if (loginForm) {
            loginForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const email = document.getElementById('email').value;
                const password = document.getElementById('password').value;
                
                // Login com email e senha
                firebase.auth().signInWithEmailAndPassword(email, password)
                    .then((userCredential) => {
                        // Login bem-sucedido
                        const user = userCredential.user;
                        console.log('Login bem-sucedido:', user);
                        window.location.href = 'index.html'; // Redirecionar para a página inicial
                    })
                    .catch((error) => {
                        // Erro no login
                        const errorCode = error.code;
                        const errorMessage = error.message;
                        console.error('Erro no login:', errorMessage);
                        alert('Erro no login: ' + errorMessage);
                    });
            });
            
            // Botões de login social
            const googleBtn = document.querySelector('.btn-google');
            const facebookBtn = document.querySelector('.btn-facebook');
            
            if (googleBtn) {
                googleBtn.addEventListener('click', function() {
                    const provider = new firebase.auth.GoogleAuthProvider();
                    firebase.auth().signInWithPopup(provider)
                        .then((result) => {
                            console.log('Login com Google bem-sucedido');
                            window.location.href = 'index.html';
                        }).catch((error) => {
                            console.error('Erro no login com Google:', error);
                            alert('Erro no login com Google: ' + error.message);
                        });
                });
            }
            
            if (facebookBtn) {
                facebookBtn.addEventListener('click', function() {
                    const provider = new firebase.auth.FacebookAuthProvider();
                    firebase.auth().signInWithPopup(provider)
                        .then((result) => {
                            console.log('Login com Facebook bem-sucedido');
                            window.location.href = 'index.html';
                        }).catch((error) => {
                            console.error('Erro no login com Facebook:', error);
                            alert('Erro no login com Facebook: ' + error.message);
                        });
                });
            }
        }
    }
    
    // Formulário de registro
    if (isRegisterPage) {
        const registerForm = document.querySelector('.auth-form');
        if (registerForm) {
            registerForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const name = document.getElementById('name').value;
                const email = document.getElementById('email').value;
                const password = document.getElementById('password').value;
                const confirmPassword = document.getElementById('confirm-password').value;
                
                // Verificar se as senhas coincidem
                if (password !== confirmPassword) {
                    alert('As senhas não coincidem!');
                    return;
                }
                
                // Criar usuário com email e senha
                firebase.auth().createUserWithEmailAndPassword(email, password)
                    .then((userCredential) => {
                        // Registro bem-sucedido
                        const user = userCredential.user;
                        
                        // Atualizar o perfil do usuário com o nome
                        return user.updateProfile({
                            displayName: name
                        }).then(() => {
                            console.log('Usuário registrado com sucesso:', user);
                            window.location.href = 'index.html'; // Redirecionar para a página inicial
                        });
                    })
                    .catch((error) => {
                        // Erro no registro
                        const errorCode = error.code;
                        const errorMessage = error.message;
                        console.error('Erro no registro:', errorMessage);
                        alert('Erro no registro: ' + errorMessage);
                    });
            });
            
            // Botões de login social para registro
            const googleBtn = document.querySelector('.btn-google');
            const facebookBtn = document.querySelector('.btn-facebook');
            
            if (googleBtn) {
                googleBtn.addEventListener('click', function() {
                    const provider = new firebase.auth.GoogleAuthProvider();
                    firebase.auth().signInWithPopup(provider)
                        .then((result) => {
                            console.log('Registro com Google bem-sucedido');
                            window.location.href = 'index.html';
                        }).catch((error) => {
                            console.error('Erro no registro com Google:', error);
                            alert('Erro no registro com Google: ' + error.message);
                        });
                });
            }
            
            if (facebookBtn) {
                facebookBtn.addEventListener('click', function() {
                    const provider = new firebase.auth.FacebookAuthProvider();
                    firebase.auth().signInWithPopup(provider)
                        .then((result) => {
                            console.log('Registro com Facebook bem-sucedido');
                            window.location.href = 'index.html';
                        }).catch((error) => {
                            console.error('Erro no registro com Facebook:', error);
                            alert('Erro no registro com Facebook: ' + error.message);
                        });
                });
            }
        }
    }
    
    // Verificar estado de autenticação
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // Usuário está logado
            console.log('Usuário logado:', user.displayName);
        } else {
            // Usuário não está logado
            console.log('Usuário não está logado');
        }
    });
});