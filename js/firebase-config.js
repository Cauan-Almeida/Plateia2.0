// Configuração do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDsbmVAcvKo2JjIlsWP1ATzBlxFhLoj9os",
    authDomain: "plateia-e13ee.firebaseapp.com",
    projectId: "plateia-e13ee",
    storageBucket: "plateia-e13ee.firebasestorage.app",
    messagingSenderId: "792031758617",
    appId: "1:792031758617:web:b09fd462607aa9d2641d88"
};

// Declarar variáveis globalmente
let auth;
let db;

// Verificar se o Firebase está carregado
if (typeof firebase === 'undefined') {
    console.error('Firebase SDK não encontrado. Certifique-se de incluir os scripts do Firebase antes deste arquivo.');
} else {
    // Inicializar Firebase
    if (!firebase.apps.length) {
        try {
            firebase.initializeApp(firebaseConfig);
            console.log('Firebase inicializado com sucesso');
        } catch (error) {
            console.error('Erro ao inicializar Firebase:', error);
        }
    }

    // Referências globais
    auth = firebase.auth();
    db = firebase.firestore();

    // Configurar persistência para melhorar a experiência offline
    auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
        .then(() => {
            console.log('Persistência de autenticação configurada com sucesso');
        })
        .catch(error => {
            console.error('Erro ao configurar persistência:', error);
        });

    // Verificar estado de autenticação
    auth.onAuthStateChanged((user) => {
        console.log('Estado da autenticação mudou:', user ? 'Usuário logado' : 'Usuário não logado');
        
        if (user) {
            // Forçar atualização do token
            user.getIdToken(true)
                .then(() => {
                    console.log('Token de autenticação atualizado com sucesso');
                    
                    // Atualizar documento do usuário
                    db.collection('usuarios').doc(user.uid).set({
                        uid: user.uid,
                        nome: user.displayName || user.email,
                        email: user.email,
                        photoURL: user.photoURL,
                        ultimoAcesso: firebase.firestore.FieldValue.serverTimestamp()
                    }, { merge: true })
                    .then(() => {
                        console.log('Documento do usuário atualizado com sucesso');
                    })
                    .catch(err => {
                        console.warn('Aviso ao atualizar documento do usuário:', err);
                    });
                })
                .catch(error => {
                    console.error('Erro ao atualizar token:', error);
                });
                
            // Atualizar botões de autenticação
            document.querySelectorAll('.auth-buttons').forEach(button => {
                button.innerHTML = `
                    <a href="dashboard.html" class="btn btn-primary">Dashboard</a>
                    <a href="#" class="btn btn-outline" onclick="logout()">Sair</a>
                `;
            });
        } else {
            // Usuário não está logado
            document.querySelectorAll('.auth-buttons').forEach(button => {
                button.innerHTML = `
                    <a href="login.html" class="btn btn-outline">Entrar</a>
                    <a href="registro.html" class="btn btn-primary">Criar Conta</a>
                `;
            });
        }
    });
}

// Função de login com Google
function loginWithGoogle() {
    if (!auth) {
        console.error('Auth não inicializado');
        alert('Erro ao inicializar autenticação. Por favor, recarregue a página.');
        return;
    }

    console.log('Tentando login com Google...');
    const provider = new firebase.auth.GoogleAuthProvider();
    
    // Configurar o provedor do Google
    provider.setCustomParameters({
        prompt: 'select_account'
    });

    // Usar signInWithPopup
    auth.signInWithPopup(provider)
        .then((result) => {
            console.log('Login com Google bem-sucedido:', result.user);
            window.location.href = 'dashboard.html';
        })
        .catch((error) => {
            console.error('Erro no login com Google:', error);
            alert('Erro ao fazer login com Google: ' + error.message);
        });
}

// Função de login
function login(email, password) {
    if (!auth) {
        console.error('Auth não inicializado');
        return Promise.reject(new Error('Erro ao inicializar autenticação'));
    }

    console.log('Tentando login com email/senha...');
    return auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            console.log('Login bem-sucedido:', userCredential.user);
            window.location.href = 'dashboard.html';
        })
        .catch((error) => {
            console.error('Erro no login:', error);
            if (error.code === 'auth/user-not-found') {
                console.log('Usuário não encontrado, tentando criar conta...');
                return register(email, password);
            } else {
                throw error;
            }
        });
}

// Função de registro
function register(email, password) {
    if (!auth) {
        console.error('Auth não inicializado');
        return Promise.reject(new Error('Erro ao inicializar autenticação'));
    }

    console.log('Tentando criar conta...');
    return auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            console.log('Conta criada com sucesso:', userCredential.user);
            window.location.href = 'dashboard.html';
        })
        .catch((error) => {
            console.error('Erro ao criar conta:', error);
            if (error.code === 'auth/email-already-in-use') {
                console.log('Email já em uso, tentando login...');
                return login(email, password);
            } else {
                throw error;
            }
        });
}

// Função de logout
function logout() {
    if (!auth) {
        console.error('Auth não inicializado');
        return Promise.reject(new Error('Erro ao inicializar autenticação'));
    }

    console.log('Tentando fazer logout...');
    return auth.signOut().then(() => {
        console.log('Logout bem-sucedido');
        window.location.href = 'index.html';
    });
}

// Função para redirecionar o logo
function handleLogoClick() {
    if (!auth) {
        console.error('Auth não inicializado');
        window.location.href = 'index.html';
        return;
    }
    
    const user = auth.currentUser;
    console.log('Clique no logo, usuário atual:', user);
    if (user) {
        window.location.href = 'dashboard.html';
    } else {
        window.location.href = 'index.html';
    }
} 