// Script para verificar autenticação em páginas protegidas
document.addEventListener('DOMContentLoaded', function() {
    console.log('Verificando autenticação...');
    
    // Lista de páginas que requerem autenticação
    const paginasProtegidas = [
        'dashboard.html',
        'sala.html',
        'perfil.html'
    ];
    
    // Obter o nome da página atual
    const paginaAtual = window.location.pathname.split('/').pop();
    console.log('Página atual:', paginaAtual);
    
    // Verificar se a página atual está na lista de páginas protegidas
    const requerAutenticacao = paginasProtegidas.some(pagina => 
        paginaAtual.toLowerCase().includes(pagina.toLowerCase())
    );
    
    if (!requerAutenticacao) {
        console.log('Página não requer autenticação');
        return;
    }
    
    console.log('Página requer autenticação');
    
    // Verificar se o Firebase está inicializado
    if (!firebase || !firebase.auth) {
        console.error('Firebase não está inicializado');
        mostrarErroAutenticacao('Erro ao inicializar sistema de autenticação. Por favor, recarregue a página.');
        return;
    }
    
    // Mostrar indicador de carregamento enquanto verifica autenticação
    const authCheckElement = document.createElement('div');
    authCheckElement.id = 'auth-check';
    authCheckElement.className = 'auth-check-overlay';
    authCheckElement.innerHTML = `
        <div class="auth-check-container">
            <div class="loading">
                <i class="fas fa-spinner fa-spin"></i>
                <p>Verificando autenticação...</p>
            </div>
        </div>
    `;
    document.body.appendChild(authCheckElement);
    
    // Adicionar estilos para o overlay
    const style = document.createElement('style');
    style.textContent = `
        .auth-check-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(255, 255, 255, 0.8);
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .auth-check-container {
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            padding: 20px;
            max-width: 400px;
            width: 90%;
        }
        
        .auth-check-container .error-message {
            margin: 0;
        }
    `;
    document.head.appendChild(style);
    
    // Verificar autenticação com timeout
    let authTimeout = setTimeout(() => {
        console.warn('Timeout na verificação de autenticação');
        mostrarErroAutenticacao('Tempo esgotado ao verificar autenticação. Por favor, recarregue a página ou faça login novamente.');
    }, 10000); // 10 segundos
    
    // Verificar se o usuário está autenticado
    firebase.auth().onAuthStateChanged(function(user) {
        // Limpar o timeout
        clearTimeout(authTimeout);
        
        if (user) {
            console.log('Usuário autenticado:', user.uid);
            
            // Forçar atualização do token de autenticação
            user.getIdToken(true)
                .then(() => {
                    console.log('Token de autenticação atualizado com sucesso');
                    
                    // Remover o overlay de verificação
                    const authCheckElement = document.getElementById('auth-check');
                    if (authCheckElement) {
                        authCheckElement.remove();
                    }
                })
                .catch(error => {
                    console.error('Erro ao atualizar token:', error);
                    mostrarErroAutenticacao('Erro ao verificar sua autenticação. Por favor, tente fazer login novamente.');
                });
        } else {
            console.log('Usuário não autenticado, redirecionando para login');
            mostrarErroAutenticacao('Você precisa estar autenticado para acessar esta página. Redirecionando para a página de login...', true);
            
            // Redirecionar para a página de login após 2 segundos
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
        }
    });
    
    // Função para mostrar erro de autenticação
    function mostrarErroAutenticacao(mensagem, redirecionando = false) {
        const authCheckElement = document.getElementById('auth-check');
        if (authCheckElement) {
            authCheckElement.querySelector('.auth-check-container').innerHTML = `
                <div class="error-message">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>${mensagem}</p>
                    ${!redirecionando ? '<button class="btn btn-primary" onclick="window.location.href=\'login.html\'">Ir para Login</button>' : ''}
                </div>
            `;
        }
    }
}); 