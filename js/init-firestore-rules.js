// Inicialização de regras do Firestore
console.log('Inicializando verificação de regras do Firestore...');

// Função para esperar que o usuário esteja autenticado
function waitForAuth() {
    return new Promise((resolve) => {
        const checkAuth = () => {
            const user = firebase.auth().currentUser;
            if (user) {
                console.log('Usuário autenticado:', user.uid);
                resolve(user);
            } else {
                console.log('Aguardando autenticação...');
                setTimeout(checkAuth, 500);
            }
        };
        
        checkAuth();
    });
}

// Inicializar quando o documento estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    // Esperar que o Firebase esteja inicializado
    if (!firebase || !firebase.firestore) {
        console.error('Firebase não está inicializado');
        return;
    }
    
    // Esperar pela autenticação antes de continuar
    waitForAuth()
        .then(user => {
            console.log('Autenticação confirmada, atualizando token...');
            // Forçar atualização do token
            return user.getIdToken(true);
        })
        .catch(error => {
            console.error('Erro ao atualizar token:', error);
        });
}); 