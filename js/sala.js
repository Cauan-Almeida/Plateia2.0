// Sala de Tópicos - Plateia
document.addEventListener('DOMContentLoaded', function() {
    // Verificar autenticação
    firebase.auth().onAuthStateChanged(function(user) {
        if (!user) {
            window.location.href = 'login.html';
            return;
        }
        
        // Inicializar a interface
        initSalaInterface();
    });
    
    // Referências do Firebase
    const db = firebase.firestore();
    const storage = firebase.storage();
    
    // Referências DOM
    const salaSelect = document.getElementById('sala-select');
    const entrarSalaBtn = document.getElementById('entrar-sala-btn');
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const messageInput = document.getElementById('message-input');
    const sendMessageBtn = document.getElementById('send-message-btn');
    const uploadFileBtn = document.getElementById('upload-file-btn');
    
    // Variáveis globais
    let currentRoom = null;
    let jitsiAPI = null;
    let whiteboardInstance = null;
    let currentUser = null;
    let messageListener = null;
    let participantsListener = null;
    let filesListener = null;
    
    // Inicializar interface
    function initSalaInterface() {
        // Obter usuário atual
        currentUser = firebase.auth().currentUser;
        
        // Configurar eventos de clique das abas
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tabName = button.getAttribute('data-tab');
                switchTab(tabName);
            });
        });
        
        // Configurar evento de entrar na sala
        entrarSalaBtn.addEventListener('click', entrarNaSala);
        
        // Configurar evento de enviar mensagem
        sendMessageBtn.addEventListener('click', enviarMensagem);
        messageInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                enviarMensagem();
            }
        });
        
        // Configurar evento de upload de arquivo
        uploadFileBtn.addEventListener('click', () => {
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.style.display = 'none';
            document.body.appendChild(fileInput);
            
            fileInput.addEventListener('change', (e) => {
                if (e.target.files.length > 0) {
                    uploadArquivo(e.target.files[0]);
                }
                document.body.removeChild(fileInput);
            });
            
            fileInput.click();
        });
        
        // Carregar salas disponíveis do Firebase
        carregarSalasDisponiveis().then(() => {
            // Verificar se há um parâmetro de sala na URL
            const urlParams = new URLSearchParams(window.location.search);
            const salaParam = urlParams.get('sala');
            
            if (salaParam) {
                // Selecionar a sala na lista
                for (let i = 0; i < salaSelect.options.length; i++) {
                    if (salaSelect.options[i].value === salaParam) {
                        salaSelect.selectedIndex = i;
                        // Entrar na sala automaticamente
                        entrarNaSala();
                        break;
                    }
                }
            }
        });
    }
    
    // Carregar salas disponíveis
    function carregarSalasDisponiveis() {
        return db.collection('salas').get()
            .then((snapshot) => {
                // Limpar opções existentes, mantendo apenas a opção padrão
                const defaultOption = salaSelect.options[0];
                salaSelect.innerHTML = '';
                salaSelect.appendChild(defaultOption);
                
                // Adicionar salas do Firebase
                snapshot.forEach((doc) => {
                    const sala = doc.data();
                    const option = document.createElement('option');
                    option.value = doc.id;
                    option.textContent = sala.nome;
                    salaSelect.appendChild(option);
                });
            })
            .catch((error) => {
                console.error('Erro ao carregar salas:', error);
            });
    }
    
    // Entrar na sala selecionada
    function entrarNaSala() {
        const salaId = salaSelect.value;
        
        if (!salaId) {
            alert('Por favor, selecione uma sala');
            return;
        }
        
        // Mostrar indicador de carregamento
        document.querySelectorAll('.empty-state').forEach(el => {
            el.innerHTML = '<i class="fas fa-spinner fa-spin"></i><p>Carregando sala...</p>';
            el.style.display = 'flex';
        });
        
        // Desconectar da sala atual, se houver
        leaveCurrentRoom();
        
        console.log('Tentando entrar na sala:', salaId);
        
        // Verificar se o usuário está autenticado
        if (!firebase.auth().currentUser) {
            console.error('Usuário não autenticado');
            alert('Você precisa estar autenticado para entrar na sala. Redirecionando para a página de login...');
            window.location.href = 'login.html';
            return;
        }
        
        // Forçar atualização do token de autenticação antes de acessar o Firestore
        firebase.auth().currentUser.getIdToken(true)
            .then(() => {
                console.log('Token de autenticação atualizado com sucesso');
                // Agora criar a sala (se não existir) e entrar
                return criarSalaSeNaoExistir(salaId);
            })
            .then(() => {
                // Obter dados da sala
                return db.collection('salas').doc(salaId).get();
            })
            .then((doc) => {
                if (doc.exists) {
                    currentRoom = {
                        id: doc.id,
                        ...doc.data()
                    };
                    
                    console.log('Sala encontrada:', currentRoom);
                    
                    // Atualizar interface com dados da sala
                    document.getElementById('sala-titulo').textContent = currentRoom.nome || salaId;
                    document.getElementById('sala-descricao').textContent = currentRoom.descricao || 'Sala de tópicos';
                    
                    // Registrar entrada do usuário na sala
                    registrarEntradaNaSala();
                    
                    // Inicializar componentes da sala
                    initJitsiMeet();
                    initChat();
                    initWhiteboard();
                    initFilesSection();
                    
                    // Remover estados vazios
                    document.querySelectorAll('.empty-state').forEach(el => {
                        el.style.display = 'none';
                    });
                    
                    // Mudar para a aba de vídeo
                    switchTab('video');
                    
                    // Atualizar URL com o parâmetro da sala (sem recarregar a página)
                    const url = new URL(window.location);
                    url.searchParams.set('sala', salaId);
                    window.history.pushState({}, '', url);
                    
                    // Exibir mensagem de sucesso
                    console.log('Entrada na sala concluída com sucesso');
                } else {
                    console.error('Sala não encontrada após tentativa de criação:', salaId);
                    
                    // Tentar criar a sala novamente com abordagem mais agressiva
                    return criarSalaDiretamente(salaId)
                        .then(() => {
                            console.log('Sala criada com abordagem agressiva, recarregando...');
                            // Esperar um pouco antes de recarregar para garantir que os dados sejam gravados
                            setTimeout(() => {
                                window.location.reload();
                            }, 1000);
                        })
                        .catch(err => {
                            console.error('Erro na criação agressiva:', err);
                            alert('Não foi possível criar a sala. Por favor, tente novamente mais tarde.');
                            
                            // Restaurar estados vazios com mensagem de erro
                            document.querySelectorAll('.empty-state').forEach(el => {
                                el.innerHTML = '<i class="fas fa-exclamation-triangle"></i><p>Sala não encontrada. Por favor, selecione outra sala.</p>';
                                el.style.display = 'flex';
                            });
                        });
                }
            })
            .catch((error) => {
                console.error('Erro ao entrar na sala:', error);
                
                // Tentar abordagem alternativa em caso de erro de permissão
                if (error.code === 'permission-denied' || (error.message && error.message.includes('permission'))) {
                    console.log('Erro de permissão, tentando abordagem alternativa...');
                    
                    // Mostrar mensagem de tentativa
                    document.querySelectorAll('.empty-state').forEach(el => {
                        el.innerHTML = '<i class="fas fa-spinner fa-spin"></i><p>Tentando método alternativo...</p>';
                    });
                    
                    // Tentar atualizar o token novamente e criar a sala diretamente
                    firebase.auth().currentUser.getIdToken(true)
                        .then(() => {
                            return criarSalaDiretamente(salaId);
                        })
                        .then(() => {
                            console.log('Sala criada com abordagem alternativa, recarregando...');
                            // Esperar um pouco antes de recarregar
                            setTimeout(() => {
                                window.location.reload();
                            }, 1000);
                        })
                        .catch(err => {
                            console.error('Erro na abordagem alternativa:', err);
                            
                            // Restaurar estados vazios com mensagem de erro
                            document.querySelectorAll('.empty-state').forEach(el => {
                                el.innerHTML = '<i class="fas fa-exclamation-triangle"></i><p>Não foi possível acessar a sala. Por favor, tente novamente mais tarde.</p>';
                                el.style.display = 'flex';
                            });
                        });
                } else {
                    // Restaurar estados vazios com mensagem de erro
                    document.querySelectorAll('.empty-state').forEach(el => {
                        el.innerHTML = '<i class="fas fa-exclamation-triangle"></i><p>Erro ao entrar na sala: ' + error.message + '</p>';
                        el.style.display = 'flex';
                    });
                }
            });
    }
    
    // Função para criar sala se não existir
    function criarSalaSeNaoExistir(salaId, forcePublic = false) {
        console.log('Verificando/criando sala:', salaId);
        
        if (!firebase.auth().currentUser) {
            console.error('Usuário não autenticado');
            return Promise.reject(new Error('Usuário não autenticado'));
        }
        
        const userId = firebase.auth().currentUser.uid;
        const userEmail = firebase.auth().currentUser.email;
        const userName = firebase.auth().currentUser.displayName || userEmail;
        
        // Abordagem direta: criar a sala diretamente sem verificar se ela existe
        // Isso funciona bem com { merge: true } que não sobrescreverá dados existentes
        const salaData = {
            nome: salaId,
            descricao: `Sala de tópicos: ${salaId}`,
            criadorId: userId,
            criadorNome: userName,
            dataCriacao: firebase.firestore.FieldValue.serverTimestamp(),
            publica: true, // Sempre definir como pública para evitar problemas de permissão
            participantes: firebase.firestore.FieldValue.arrayUnion(userId)
        };
        
        // Tentar atualizar o token antes de qualquer operação no Firestore
        return firebase.auth().currentUser.getIdToken(true)
            .then(() => {
                // Usar set com merge para criar ou atualizar a sala sem sobrescrever dados existentes
                return db.collection('salas').doc(salaId).set(salaData, { merge: true });
            })
            .then(() => {
                console.log('Sala criada ou atualizada com sucesso!');
                
                // Criar coleções necessárias em sequência para evitar erros de batch
                return db.collection('salas').doc(salaId)
                    .collection('participantes').doc(userId).set({
                        userId: userId,
                        nome: userName,
                        email: userEmail,
                        dataEntrada: firebase.firestore.FieldValue.serverTimestamp(),
                        online: true,
                        avatar: firebase.auth().currentUser.photoURL || null
                    }, { merge: true });
            })
            .then(() => {
                // Adicionar mensagem de boas-vindas apenas se for uma nova sala
                // Verificamos o timestamp da sala para determinar se é nova
                return db.collection('salas').doc(salaId).get();
            })
            .then(doc => {
                const data = doc.data();
                const isNewSala = data && data.dataCriacao && 
                                  (Date.now() - data.dataCriacao.toMillis() < 10000); // 10 segundos
                
                if (isNewSala) {
                    return db.collection('salas').doc(salaId)
                        .collection('mensagens').add({
                            texto: `Bem-vindo à sala ${salaId}! Esta sala foi criada por ${userName}.`,
                            userId: 'sistema',
                            nome: 'Sistema',
                            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                            tipo: 'sistema'
                        });
                }
                
                return Promise.resolve();
            })
            .catch(error => {
                console.error('Erro ao criar/atualizar sala:', error);
                
                // Tentar uma abordagem ainda mais simples em caso de erro
                if (error.code === 'permission-denied') {
                    console.log('Erro de permissão, tentando abordagem alternativa...');
                    
                    // Atualizar o token novamente
                    return firebase.auth().currentUser.getIdToken(true)
                        .then(() => {
                            // Apenas definir os dados mínimos necessários
                            return db.collection('salas').doc(salaId).set({
                                nome: salaId,
                                publica: true,
                                criadorId: userId
                            }, { merge: true });
                        });
                }
                
                return Promise.reject(error);
            });
    }
    
    // Função para criar sala diretamente (abordagem agressiva)
    function criarSalaDiretamente(salaId) {
        if (!firebase.auth().currentUser) {
            return Promise.reject(new Error('Usuário não autenticado'));
        }
        
        const userId = firebase.auth().currentUser.uid;
        const userName = firebase.auth().currentUser.displayName || firebase.auth().currentUser.email;
        
        // Dados mínimos para a sala funcionar
        const salaData = {
            nome: salaId,
            publica: true,
            criadorId: userId,
            criadorNome: userName,
            participantes: [userId]
        };
        
        // Atualizar o token antes de criar a sala
        return firebase.auth().currentUser.getIdToken(true)
            .then(() => {
                // Criar a sala com dados mínimos
                return db.collection('salas').doc(salaId).set(salaData);
            })
            .then(() => {
                console.log('Sala criada diretamente com sucesso');
                return Promise.resolve();
            });
    }
    
    // Registrar entrada do usuário na sala
    function registrarEntradaNaSala() {
        const participantRef = db.collection('salas').doc(currentRoom.id)
            .collection('participantes').doc(currentUser.uid);
            
        participantRef.set({
            uid: currentUser.uid,
            nome: currentUser.displayName || 'Usuário',
            email: currentUser.email,
            photoURL: currentUser.photoURL || '',
            entradaEm: firebase.firestore.FieldValue.serverTimestamp(),
            online: true
        });
        
        // Configurar para atualizar status quando o usuário sair
        window.addEventListener('beforeunload', () => {
            if (currentRoom) {
                participantRef.update({
                    online: false,
                    saidaEm: firebase.firestore.FieldValue.serverTimestamp()
                }).catch(() => {});
            }
        });
        
        // Iniciar listener para participantes
        iniciarListenerParticipantes();
    }
    
    // Iniciar listener para participantes
    function iniciarListenerParticipantes() {
        if (!currentRoom) return;
        
        // Limpar listener anterior, se existir
        if (participantsListener) {
            participantsListener();
        }
        
        // Configurar novo listener
        participantsListener = db.collection('salas').doc(currentRoom.id)
            .collection('participantes')
            .where('online', '==', true)
            .onSnapshot((snapshot) => {
                // Atualizar contador
                const membrosEl = document.getElementById('sala-membros');
                if (membrosEl) {
                    membrosEl.textContent = snapshot.size;
                }
                
                // Atualizar lista de participantes
                const participantsList = document.getElementById('participants-list');
                if (participantsList) {
                    participantsList.innerHTML = '';
                    
                    if (snapshot.empty) {
                        participantsList.innerHTML = '<li class="empty-participant">Nenhum participante online</li>';
                        return;
                    }
                    
                    snapshot.forEach((doc) => {
                        const participante = doc.data();
                        const isCurrentUser = participante.uid === currentUser.uid;
                        
                        const li = document.createElement('li');
                        
                        const avatar = document.createElement('img');
                        avatar.className = 'participant-avatar';
                        avatar.src = participante.photoURL || 'images/usuario.png';
                        avatar.alt = participante.nome;
                        
                        // Adicionar tratamento de erro para a imagem
                        avatar.onerror = function() {
                            this.src = 'images/usuario.png';
                            // Se ainda falhar, usar uma imagem padrão do Font Awesome
                            this.onerror = function() {
                                const avatarContainer = this.parentNode;
                                avatarContainer.removeChild(this);
                                const iconElement = document.createElement('i');
                                iconElement.className = 'fas fa-user participant-icon';
                                avatarContainer.insertBefore(iconElement, avatarContainer.firstChild);
                            };
                        };
                        
                        const info = document.createElement('div');
                        info.className = 'participant-info';
                        
                        const name = document.createElement('div');
                        name.className = 'participant-name';
                        name.textContent = participante.nome + (isCurrentUser ? ' (você)' : '');
                        
                        const status = document.createElement('div');
                        status.className = 'participant-status';
                        status.textContent = 'Online';
                        
                        info.appendChild(name);
                        info.appendChild(status);
                        
                        li.appendChild(avatar);
                        li.appendChild(info);
                        
                        participantsList.appendChild(li);
                    });
                }
            }, (error) => {
                console.error('Erro ao monitorar participantes:', error);
            });
    }
    
    // Inicializar Jitsi Meet
    function initJitsiMeet() {
        const container = document.getElementById('jitsi-container');
        if (!container) {
            console.error('Container do Jitsi não encontrado');
            return;
        }
        
        // Limpar o container
        container.innerHTML = '';
        
        try {
            console.log('Inicializando Jitsi Meet para a sala:', currentRoom.id);
            
            // Verificar se o script do Jitsi foi carregado
            if (typeof JitsiMeetExternalAPI !== 'function') {
                console.error('JitsiMeetExternalAPI não está disponível');
                
                // Tentar carregar o script novamente
                const jitsiScript = document.createElement('script');
                jitsiScript.src = 'https://meet.jit.si/external_api.js';
                jitsiScript.onload = function() {
                    console.log('Script do Jitsi carregado com sucesso');
                    // Tentar inicializar novamente após carregar o script
                    setTimeout(() => {
                        initJitsiMeetInstance(container);
                    }, 1000);
                };
                jitsiScript.onerror = function() {
                    console.error('Falha ao carregar o script do Jitsi');
                    container.innerHTML = '<div class="empty-state"><i class="fas fa-exclamation-triangle"></i><p>Não foi possível carregar o serviço de videoconferência. Verifique sua conexão com a internet.</p></div>';
                };
                document.head.appendChild(jitsiScript);
                return;
            }
            
            initJitsiMeetInstance(container);
        } catch (error) {
            console.error('Erro ao inicializar Jitsi Meet:', error);
            container.innerHTML = '<div class="empty-state"><i class="fas fa-exclamation-triangle"></i><p>Erro ao inicializar videoconferência. Tente novamente mais tarde.</p></div>';
        }
    }
    
    // Inicializar instância do Jitsi Meet
    function initJitsiMeetInstance(container) {
        try {
            const domain = 'meet.jit.si';
            const options = {
                roomName: `plateia-${currentRoom.id}`,
                parentNode: container,
                width: '100%',
                height: '100%',
                configOverwrite: {
                    startWithAudioMuted: false,
                    startWithVideoMuted: false,
                    disableRemoteMute: true,
                    resolution: 720
                },
                interfaceConfigOverwrite: {
                    APP_NAME: 'Plateia',
                    HIDE_TOASTAVATAR: true,
                    SHOW_JITSI_WATERMARK: false,
                    SHOW_WATERMARK_FOR_GUESTS: false,
                    SHOW_CHROME_EXTENSION_BANNER: false,
                    SHOW_POWERED_BY: false,
                    TOOLBAR_ALWAYS_VISIBLE: true,
                    TOOLBAR_BUTTONS: [
                        'microphone',
                        'camera',
                        'desktop',
                        'fullscreen',
                        'hangup',
                        'settings',
                        'raisehand',
                        'videoquality',
                        'filmstrip',
                        'tileview'
                    ]
                },
                userInfo: {
                    displayName: currentUser.displayName || currentUser.email
                }
            };
            
            console.log('Criando instância do Jitsi com opções:', options);
            
            // Criar a instância do Jitsi
            jitsiAPI = new JitsiMeetExternalAPI(domain, options);
            
            // Adicionar listeners para eventos
            jitsiAPI.addListener('participantJoined', handleParticipantJoined);
            jitsiAPI.addListener('participantLeft', handleParticipantLeft);
            jitsiAPI.addListener('videoConferenceJoined', handleVideoConferenceJoined);
            jitsiAPI.addListener('videoConferenceLeft', handleVideoConferenceLeft);
            
            // Adicionar tratamento de erro
            jitsiAPI.addListener('errorOccurred', function(error) {
                console.error('Erro no Jitsi Meet:', error);
            });
            
            // Atualizar contagem de participantes
            atualizarContadorParticipantes();
            
            console.log('Jitsi Meet inicializado com sucesso');
        } catch (error) {
            console.error('Erro ao criar instância do Jitsi Meet:', error);
            container.innerHTML = '<div class="empty-state"><i class="fas fa-exclamation-triangle"></i><p>Erro ao inicializar videoconferência. Tente novamente mais tarde.</p></div>';
        }
    }
    
    // Atualizar contador de participantes
    function atualizarContadorParticipantes() {
        if (!currentRoom) return;
        
        db.collection('salas').doc(currentRoom.id)
            .collection('participantes')
            .where('online', '==', true)
            .get()
            .then((snapshot) => {
                const membrosEl = document.getElementById('sala-membros');
                if (membrosEl) {
                    membrosEl.textContent = snapshot.size;
                }
            })
            .catch((error) => {
                console.error('Erro ao contar participantes:', error);
            });
    }
    
    // Inicializar chat
    function initChat() {
        const chatMessages = document.getElementById('chat-messages');
        chatMessages.innerHTML = '';
        
        // Carregar mensagens anteriores
        db.collection('salas').doc(currentRoom.id)
            .collection('mensagens')
            .orderBy('timestamp', 'asc')
            .limit(50)
            .get()
            .then((snapshot) => {
                snapshot.forEach((doc) => {
                    adicionarMensagemAoChat(doc.data());
                });
                
                // Rolar para o final
                chatMessages.scrollTop = chatMessages.scrollHeight;
            });
        
        // Configurar listener para novas mensagens
        messageListener = db.collection('salas').doc(currentRoom.id)
            .collection('mensagens')
            .orderBy('timestamp', 'desc')
            .limit(1)
            .onSnapshot((snapshot) => {
                snapshot.docChanges().forEach((change) => {
                    if (change.type === 'added') {
                        const mensagem = change.doc.data();
                        adicionarMensagemAoChat(mensagem);
                        chatMessages.scrollTop = chatMessages.scrollHeight;
                    }
                });
            });
    }
    
    // Adicionar mensagem ao chat
    function adicionarMensagemAoChat(mensagem) {
        const chatMessages = document.getElementById('chat-messages');
        const isCurrentUser = mensagem.userId === currentUser.uid;
        
        const messageElement = document.createElement('div');
        messageElement.className = `message ${isCurrentUser ? 'message-own' : ''}`;
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        
        if (!isCurrentUser) {
            const messageHeader = document.createElement('div');
            messageHeader.className = 'message-header';
            
            const userAvatar = document.createElement('img');
            userAvatar.className = 'message-avatar';
            userAvatar.src = mensagem.userPhoto || 'images/usuario.png';
            userAvatar.alt = mensagem.userName;
            
            const userName = document.createElement('span');
            userName.className = 'message-username';
            userName.textContent = mensagem.userName;
            
            messageHeader.appendChild(userAvatar);
            messageHeader.appendChild(userName);
            messageContent.appendChild(messageHeader);
        }
        
        const messageText = document.createElement('div');
        messageText.className = 'message-text';
        messageText.textContent = mensagem.texto;
        
        const messageTime = document.createElement('div');
        messageTime.className = 'message-time';
        messageTime.textContent = formatarDataHora(mensagem.timestamp);
        
        messageContent.appendChild(messageText);
        messageContent.appendChild(messageTime);
        messageElement.appendChild(messageContent);
        
        chatMessages.appendChild(messageElement);
    }
    
    // Enviar mensagem
    function enviarMensagem() {
        if (!currentRoom) return;
        
        const texto = messageInput.value.trim();
        if (!texto) return;
        
        db.collection('salas').doc(currentRoom.id)
            .collection('mensagens')
            .add({
                texto: texto,
                userId: currentUser.uid,
                userName: currentUser.displayName || 'Usuário',
                userPhoto: currentUser.photoURL || '',
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            })
            .then(() => {
                messageInput.value = '';
                
                // Atualizar contador de mensagens
                atualizarContadorMensagens();
            })
            .catch((error) => {
                console.error('Erro ao enviar mensagem:', error);
            });
    }
    
    // Inicializar quadro branco
    function initWhiteboard() {
        const container = document.querySelector('.whiteboard-container');
        container.innerHTML = '';
        
        // Verificar se o Excalidraw está disponível
        if (!window.ExcalidrawLib) {
            console.log('Excalidraw não está disponível, exibindo mensagem alternativa');
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-chalkboard"></i>
                    <p>O quadro branco não está disponível nesta versão.</p>
                    <small>Esta funcionalidade requer a biblioteca Excalidraw.</small>
                </div>
            `;
            return;
        }
        
        // Implementação básica com Excalidraw
        // Em uma implementação completa, seria necessário configurar
        // sincronização em tempo real com outros usuários
        try {
            const excalidrawDiv = document.createElement('div');
            excalidrawDiv.id = 'excalidraw-container';
            excalidrawDiv.style.width = '100%';
            excalidrawDiv.style.height = '100%';
            container.appendChild(excalidrawDiv);
            
            const App = window.ExcalidrawLib.Excalidraw;
            const excalidrawWrapper = document.createElement('div');
            excalidrawWrapper.style.height = '100%';
            excalidrawDiv.appendChild(excalidrawWrapper);
            
            // Renderizar o componente Excalidraw
            // Nota: Esta é uma implementação simplificada
            // Em um projeto real, seria necessário usar React ou uma abordagem mais robusta
            whiteboardInstance = App({ container: excalidrawWrapper });
        } catch (error) {
            console.error('Erro ao inicializar quadro:', error);
            container.innerHTML = '<div class="empty-state"><i class="fas fa-exclamation-triangle"></i><p>Não foi possível carregar o quadro. Tente novamente mais tarde.</p></div>';
        }
    }
    
    // Inicializar seção de arquivos
    function initFilesSection() {
        const filesList = document.getElementById('files-list');
        filesList.innerHTML = '';
        
        // Carregar arquivos existentes
        db.collection('salas').doc(currentRoom.id)
            .collection('arquivos')
            .orderBy('uploadedAt', 'desc')
            .get()
            .then((snapshot) => {
                if (snapshot.empty) {
                    filesList.innerHTML = '<div class="empty-state"><i class="fas fa-file-alt"></i><p>Nenhum arquivo compartilhado nesta sala</p></div>';
                    return;
                }
                
                snapshot.forEach((doc) => {
                    const arquivo = doc.data();
                    adicionarArquivoALista(doc.id, arquivo);
                });
            });
        
        // Configurar listener para novos arquivos
        filesListener = db.collection('salas').doc(currentRoom.id)
            .collection('arquivos')
            .orderBy('uploadedAt', 'desc')
            .onSnapshot((snapshot) => {
                snapshot.docChanges().forEach((change) => {
                    if (change.type === 'added') {
                        adicionarArquivoALista(change.doc.id, change.doc.data());
                    } else if (change.type === 'removed') {
                        const element = document.getElementById(`file-${change.doc.id}`);
                        if (element) {
                            element.remove();
                        }
                    }
                });
            });
    }
    
    // Adicionar arquivo à lista
    function adicionarArquivoALista(id, arquivo) {
        const filesList = document.getElementById('files-list');
        
        // Remover mensagem de vazio, se existir
        const emptyState = filesList.querySelector('.empty-state');
        if (emptyState) {
            emptyState.remove();
        }
        
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        fileItem.id = `file-${id}`;
        
        // Determinar ícone com base no tipo de arquivo
        let iconClass = 'fa-file';
        if (arquivo.tipo.startsWith('image/')) {
            iconClass = 'fa-file-image';
        } else if (arquivo.tipo.startsWith('video/')) {
            iconClass = 'fa-file-video';
        } else if (arquivo.tipo.startsWith('audio/')) {
            iconClass = 'fa-file-audio';
        } else if (arquivo.tipo === 'application/pdf') {
            iconClass = 'fa-file-pdf';
        } else if (arquivo.tipo.includes('word') || arquivo.tipo.includes('document')) {
            iconClass = 'fa-file-word';
        } else if (arquivo.tipo.includes('excel') || arquivo.tipo.includes('sheet')) {
            iconClass = 'fa-file-excel';
        } else if (arquivo.tipo.includes('powerpoint') || arquivo.tipo.includes('presentation')) {
            iconClass = 'fa-file-powerpoint';
        }
        
        fileItem.innerHTML = `
            <i class="file-icon fas ${iconClass}"></i>
            <div class="file-info">
                <div class="file-name">${arquivo.nome}</div>
                <div class="file-meta">
                    <span>${formatarTamanhoArquivo(arquivo.tamanho)}</span> • 
                    <span>Enviado por ${arquivo.userName}</span> • 
                    <span>${formatarDataHora(arquivo.uploadedAt)}</span>
                </div>
            </div>
            <div class="file-actions">
                <button class="download-file" title="Baixar arquivo">
                    <i class="fas fa-download"></i>
                </button>
                ${arquivo.userId === currentUser.uid ? `
                <button class="delete-file" title="Excluir arquivo">
                    <i class="fas fa-trash"></i>
                </button>
                ` : ''}
            </div>
        `;
        
        filesList.prepend(fileItem);
        
        // Adicionar eventos aos botões
        const downloadBtn = fileItem.querySelector('.download-file');
        downloadBtn.addEventListener('click', () => {
            window.open(arquivo.url, '_blank');
        });
        
        const deleteBtn = fileItem.querySelector('.delete-file');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', () => {
                if (confirm('Tem certeza que deseja excluir este arquivo?')) {
                    excluirArquivo(id, arquivo.path);
                }
            });
        }
    }
    
    // Upload de arquivo
    function uploadArquivo(file) {
        if (!currentRoom) return;
        
        // Criar referência no Storage
        const storageRef = storage.ref();
        const fileRef = storageRef.child(`salas/${currentRoom.id}/${Date.now()}_${file.name}`);
        
        // Fazer upload do arquivo
        const uploadTask = fileRef.put(file);
        
        // Monitorar progresso do upload
        uploadTask.on('state_changed', 
            (snapshot) => {
                // Progresso do upload
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log(`Upload: ${progress.toFixed(2)}%`);
            },
            (error) => {
                // Erro no upload
                console.error('Erro no upload:', error);
                alert('Erro ao fazer upload do arquivo');
            },
            () => {
                // Upload concluído
                uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                    // Salvar informações do arquivo no Firestore
                    db.collection('salas').doc(currentRoom.id)
                        .collection('arquivos')
                        .add({
                            nome: file.name,
                            tipo: file.type,
                            tamanho: file.size,
                            url: downloadURL,
                            path: fileRef.fullPath,
                            userId: currentUser.uid,
                            userName: currentUser.displayName || 'Usuário',
                            uploadedAt: firebase.firestore.FieldValue.serverTimestamp()
                        })
                        .then(() => {
                            console.log('Arquivo enviado com sucesso');
                            // Mudar para a aba de arquivos
                            switchTab('files');
                        })
                        .catch((error) => {
                            console.error('Erro ao salvar informações do arquivo:', error);
                        });
                });
            }
        );
    }
    
    // Excluir arquivo
    function excluirArquivo(id, path) {
        // Excluir do Storage
        storage.ref().child(path).delete()
            .then(() => {
                // Excluir do Firestore
                return db.collection('salas').doc(currentRoom.id)
                    .collection('arquivos').doc(id).delete();
            })
            .then(() => {
                console.log('Arquivo excluído com sucesso');
            })
            .catch((error) => {
                console.error('Erro ao excluir arquivo:', error);
                alert('Erro ao excluir arquivo');
            });
    }
    
    // Alternar entre abas
    function switchTab(tabName) {
        // Atualizar botões
        tabButtons.forEach(button => {
            button.classList.toggle('active', button.getAttribute('data-tab') === tabName);
        });
        
        // Atualizar conteúdo
        tabContents.forEach(content => {
            content.classList.toggle('active', content.id === `${tabName}-tab`);
        });
    }
    
    // Sair da sala atual
    function leaveCurrentRoom() {
        if (!currentRoom) return;
        
        // Desativar listeners
        if (messageListener) messageListener();
        if (participantsListener) participantsListener();
        if (filesListener) filesListener();
        
        // Desconectar do Jitsi
        if (jitsiAPI) {
            jitsiAPI.dispose();
            jitsiAPI = null;
        }
        
        // Atualizar status do participante
        db.collection('salas').doc(currentRoom.id)
            .collection('participantes').doc(currentUser.uid)
            .update({
                online: false,
                saidaEm: firebase.firestore.FieldValue.serverTimestamp()
            }).catch(() => {});
        
        // Limpar variável da sala atual
        currentRoom = null;
        
        // Restaurar estados vazios
        document.querySelectorAll('.empty-state').forEach(el => {
            el.style.display = 'flex';
        });
    }
    
    // Handlers para eventos do Jitsi
    function handleParticipantJoined(event) {
        console.log('Participante entrou:', event);
    }
    
    function handleParticipantLeft(event) {
        console.log('Participante saiu:', event);
    }
    
    function handleVideoConferenceJoined(event) {
        console.log('Entrou na videoconferência:', event);
        
        // Atualizar interface para indicar que entrou na sala
        const videoContainer = document.getElementById('jitsi-container');
        if (videoContainer) {
            // Remover qualquer mensagem de estado vazio
            const emptyState = videoContainer.querySelector('.empty-state');
            if (emptyState) {
                emptyState.style.display = 'none';
            }
        }
        
        // Atualizar contadores
        atualizarContadorParticipantes();
        atualizarContadorMensagens();
    }
    
    function handleVideoConferenceLeft(event) {
        console.log('Saiu da videoconferência:', event);
    }
    
    // Atualizar contador de mensagens
    function atualizarContadorMensagens() {
        if (!currentRoom) return;
        
        db.collection('salas').doc(currentRoom.id)
            .collection('mensagens')
            .get()
            .then((snapshot) => {
                const mensagensEl = document.getElementById('sala-mensagens');
                if (mensagensEl) {
                    mensagensEl.textContent = snapshot.size;
                }
            })
            .catch((error) => {
                console.error('Erro ao contar mensagens:', error);
            });
    }
    
    // Funções utilitárias
    function formatarDataHora(timestamp) {
        if (!timestamp) return '';
        
        const data = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return data.toLocaleString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
    
    function formatarTamanhoArquivo(bytes) {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}); 