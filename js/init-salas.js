// Inicialização das salas
document.addEventListener('DOMContentLoaded', function() {
    console.log('Inicializando salas...');
    
    // Verificar se o Firebase está inicializado
    if (!firebase || !firebase.firestore) {
        console.error('Firebase não está inicializado');
        return;
    }
    
    // Referência ao Firestore
    const db = firebase.firestore();
    
    // Elementos do DOM
    const salasContainer = document.getElementById('salas-container');
    const topicosContainer = document.getElementById('topicos-container');
    
    if (!salasContainer || !topicosContainer) {
        console.error('Containers de salas não encontrados');
        return;
    }
    
    // Função para detectar imagens que não carregam
    document.addEventListener('error', function(e) {
        const target = e.target;
        if (target.tagName === 'IMG') {
            console.log('Erro ao carregar imagem:', target.src);
            if (target.src.indexOf('default-room.jpg') === -1) {
                console.log('Substituindo por imagem padrão');
                target.src = 'images/default-room.jpg';
            }
        }
    }, true);
    
    // Mostrar indicador de carregamento
    salasContainer.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> Carregando salas...</div>';
    topicosContainer.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> Carregando tópicos...</div>';
    
    // Verificar estado de autenticação
    firebase.auth().onAuthStateChanged(function(user) {
        if (!user) {
            console.log('Usuário não autenticado, redirecionando para login...');
            window.location.href = 'login.html';
            return;
        }
        
        console.log('Usuário autenticado:', user.uid);
        
        // Carregar salas ou criar salas padrão se não existirem
        carregarSalas();
    });
    
    // Função para carregar salas
    function carregarSalas() {
        console.log('Carregando salas do Firestore...');
        
        // Tentar carregar salas do Firestore
        db.collection('salas').get()
            .then((snapshot) => {
                console.log('Salas obtidas:', snapshot.size);
                
                // Limpar containers
                salasContainer.innerHTML = '';
                topicosContainer.innerHTML = '';
                
                if (snapshot.empty) {
                    console.log('Nenhuma sala encontrada, criando salas padrão...');
                    return criarSalasPadrao();
                }
                
                // Arrays para separar salas
                const todasSalas = [];
                
                // Processar salas existentes
                snapshot.forEach((doc) => {
                    const sala = doc.data();
                    sala.id = doc.id;
                    
                    console.log('Sala encontrada:', sala);
                    todasSalas.push(sala);
                });

                // Remover duplicações (se houver salas com mesmo nome)
                const salasUnicas = [];
                const idsRegistrados = {};
                
                todasSalas.forEach(sala => {
                    const baseId = sala.id.split('-copia-')[0]; // Remover sufixo de cópia, se houver
                    
                    if (!idsRegistrados[baseId]) {
                        idsRegistrados[baseId] = true;
                        salasUnicas.push(sala);
                    }
                });
                
                // Verificar se temos a sala Literatura/Poesia
                let temSalaPoesia = false;
                salasUnicas.forEach(sala => {
                    if (sala.id === 'literatura' || sala.id === 'poesia' || 
                        sala.nome.toLowerCase().includes('literatura') || 
                        sala.nome.toLowerCase().includes('poesia')) {
                        temSalaPoesia = true;
                    }
                });
                
                // Se não temos a sala de poesia, criaremos ela
                if (!temSalaPoesia) {
                    const novaSala = {
                        id: 'literatura-poesia',
                        nome: 'Literatura e Poesia',
                        descricao: 'Um espaço para amantes da literatura e poesia compartilharem suas obras e discutirem sobre autores e textos',
                        imagem: 'images/arte.webp',
                        destaque: false,
                        publica: true,
                        criadorId: firebase.auth().currentUser.uid,
                        criadorNome: firebase.auth().currentUser.displayName || firebase.auth().currentUser.email,
                        dataCriacao: firebase.firestore.FieldValue.serverTimestamp(),
                        participantes: [firebase.auth().currentUser.uid]
                    };
                    
                    // Adicionar a nova sala ao array primeiro para garantir que será exibida
                    salasUnicas.push(novaSala);
                    
                    // Depois salvar no Firestore em segundo plano
                    db.collection('salas').doc(novaSala.id).set(novaSala)
                        .then(() => {
                            console.log('Nova sala de Literatura e Poesia criada com sucesso');
                        })
                        .catch(error => {
                            console.error('Erro ao criar sala de Literatura e Poesia:', error);
                        });
                }

                // Definir quais salas vão para destaque (exatamente 2) e quais vão para explorar (2+)
                // Prioridade para Educação e Artes nos destaques
                const salasDestaque = [];
                const salasNormais = [];
                
                // Primeiro encontrar a sala de Literatura e Poesia para garantir que fique em "Explorar"
                const salaLiteratura = salasUnicas.find(sala => 
                    sala.id === 'literatura-poesia' || 
                    (sala.nome && sala.nome.toLowerCase().includes('literatura'))
                );
                
                // Se encontramos, remover do array principal e adicionar diretamente às salas normais
                if (salaLiteratura) {
                    const filteredSalas = salasUnicas.filter(sala => sala.id !== salaLiteratura.id);
                    salasUnicas.length = 0;
                    salasUnicas.push(...filteredSalas);
                    salasNormais.push(salaLiteratura);
                }
                
                // Primeiro, procurar Educação e Artes para os destaques
                const salaEducacao = salasUnicas.find(sala => 
                    sala.id === 'educacao' || 
                    sala.nome.toLowerCase().includes('educação') || 
                    sala.nome.toLowerCase().includes('educacao')
                );
                
                const salaArtes = salasUnicas.find(sala => 
                    sala.id === 'artes' || 
                    sala.nome.toLowerCase().includes('arte')
                );
                
                // Adicionar salas prioritárias aos destaques, se encontradas
                if (salaEducacao) {
                    salasDestaque.push(salaEducacao);
                    // Marcar como processada
                    const filteredSalas = salasUnicas.filter(sala => sala.id !== salaEducacao.id);
                    salasUnicas.length = 0;
                    salasUnicas.push(...filteredSalas);
                }
                
                if (salaArtes) {
                    salasDestaque.push(salaArtes);
                    // Marcar como processada
                    const filteredSalas = salasUnicas.filter(sala => sala.id !== salaArtes.id);
                    salasUnicas.length = 0;
                    salasUnicas.push(...filteredSalas);
                }
                
                // Se ainda não temos 2 salas em destaque, adicionar mais
                while (salasDestaque.length < 2 && salasUnicas.length > 0) {
                    salasDestaque.push(salasUnicas.shift());
                }
                
                // Restante vai para salas normais (explorar), queremos pelo menos 2
                salasNormais.push(...salasUnicas);
                
                // Se não tivermos salas normais suficientes, pegar algumas dos destaques
                if (salasNormais.length < 2 && salasDestaque.length > 2) {
                    const extras = salasDestaque.splice(2); // Remover salas extras dos destaques
                    salasNormais.push(...extras);
                }
                
                // Criar uma div para envolver os cards de destaque (exatamente 2)
                const destaqueWrapper = document.createElement('div');
                destaqueWrapper.className = 'topic-cards'; // Mesmo estilo das salas exploradas
                salasContainer.appendChild(destaqueWrapper);
                
                // Adicionar exatamente 2 salas em destaque
                salasDestaque.slice(0, 2).forEach(sala => {
                    const card = criarCardSala(sala);
                    destaqueWrapper.appendChild(card);
                });
                
                // Criar div para envolver os cards de tópicos (pelo menos 2)
                const topicosWrapper = document.createElement('div');
                topicosWrapper.className = 'topic-cards';
                topicosContainer.appendChild(topicosWrapper);
                
                // Adicionar outras salas (não em destaque)
                salasNormais.forEach(sala => {
                    const card = criarCardSala(sala);
                    topicosWrapper.appendChild(card);
                });
                
                // Se nenhuma sala foi adicionada aos containers, mostrar mensagem
                if (destaqueWrapper.children.length === 0) {
                    salasContainer.innerHTML = '<div class="info-message">Nenhuma sala em destaque disponível.</div>';
                }
                
                if (topicosWrapper.children.length === 0) {
                    topicosContainer.innerHTML = '<div class="info-message">Nenhum tópico disponível.</div>';
                }
            })
            .catch((error) => {
                console.error('Erro ao obter salas:', error);
                
                // Em caso de erro, mostrar mensagem e tentar criar salas padrão
                salasContainer.innerHTML = `
                    <div class="error-message">
                        <i class="fas fa-exclamation-triangle"></i>
                        <p>Não foi possível carregar as salas. Tentando criar salas padrão...</p>
                    </div>
                `;
                
                // Tentar criar salas padrão
                criarSalasPadrao();
            });
    }
    
    // Função para embaralhar array
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
    
    // Função para criar salas padrão
    function criarSalasPadrao() {
        console.log('Criando salas padrão...');
        
        const user = firebase.auth().currentUser;
        
        if (!user) {
            console.error('Usuário não autenticado');
            return Promise.reject(new Error('Usuário não autenticado'));
        }
        
        // Limpar salas existentes primeiro para evitar duplicação
        return db.collection('salas').get()
            .then(snapshot => {
                const batch = db.batch();
                snapshot.forEach(doc => {
                    batch.delete(doc.ref);
                });
                return batch.commit();
            })
            .then(() => {
                console.log('Salas existentes apagadas com sucesso. Criando novas salas...');
                
                const salasPadrao = [
                    {
                        id: 'tecnologia',
                        nome: 'Tecnologia',
                        descricao: 'Discussões sobre tecnologia, programação e inovação',
                        imagem: 'images/tecnonologia.webp',
                        destaque: false,
                        publica: true
                    },
                    {
                        id: 'saude',
                        nome: 'Saúde',
                        descricao: 'Discussões sobre saúde, bem-estar e qualidade de vida',
                        imagem: 'images/saude.png',
                        destaque: false,
                        publica: true
                    },
                    {
                        id: 'educacao',
                        nome: 'Educação',
                        descricao: 'Compartilhe conhecimentos e discussões sobre ensino e aprendizagem',
                        imagem: 'images/educacao.jpeg',
                        destaque: true,
                        publica: true
                    },
                    {
                        id: 'saude-mental',
                        nome: 'Saúde Mental',
                        descricao: 'Conversas sobre saúde mental, autoconhecimento e bem-estar emocional',
                        imagem: 'images/Saude-mental.jpg',
                        destaque: false,
                        publica: true
                    },
                    {
                        id: 'jogos',
                        nome: 'Jogos em Geral',
                        descricao: 'Discussões sobre todos os tipos de jogos, estratégias e novidades',
                        imagem: 'images/Videogames.jpg',
                        destaque: false,
                        publica: true
                    },
                    {
                        id: 'tech-talks',
                        nome: 'Palestras de Tecnologia',
                        descricao: 'Compartilhe conhecimentos e assista palestras sobre tecnologia',
                        imagem: 'images/tech-talk.jpg',
                        destaque: true,
                        publica: true
                    },
                    {
                        id: 'jogos-educativos',
                        nome: 'Jogos Educativos',
                        descricao: 'Discussões sobre jogos educativos e sua aplicação no ensino e aprendizagem',
                        imagem: 'images/jogos educativos.jpg',
                        destaque: false,
                        publica: true
                    },
                    {
                        id: 'literatura-poesia',
                        nome: 'Literatura e Poesia',
                        descricao: 'Um espaço para amantes da literatura e poesia compartilharem suas obras e discutirem sobre autores e textos',
                        imagem: 'images/leitura e poesia.webp',
                        destaque: false,
                        publica: true
                    }
                ];
                
                // Remover explicitamente qualquer sala relacionada a fashion, artes ou fitness
                const salasParaRemover = ['fashion', 'artes', 'fitness-zone', 'art-hub', 'fitness', 'moda', 'mental-health'];
                const salasFiltradas = salasPadrao.filter(sala => {
                    // Verificar se o ID da sala não contém nenhuma das palavras-chave para remover
                    const idContainsRemovable = salasParaRemover.some(
                        termo => sala.id.includes(termo)
                    );
                    
                    // Verificar se o nome da sala não contém nenhuma das palavras-chave para remover
                    const nomeContainsRemovable = salasParaRemover.some(
                        termo => sala.nome.toLowerCase().includes(termo.replace('-', ' '))
                    );
                    
                    // Manter a sala apenas se não contiver nenhuma palavra-chave de remoção
                    return !idContainsRemovable && !nomeContainsRemovable;
                });
                
                // Atualizar a variável salasPadrao com as salas filtradas
                salasPadrao.length = 0;
                salasPadrao.push(...salasFiltradas);
                
                // Garantir que temos exatamente 2 salas em destaque
                // Contar quantas já estão marcadas como destaque
                let destaqueCount = 0;
                salasPadrao.forEach(sala => {
                    if (sala.destaque) {
                        destaqueCount++;
                    }
                });
                
                // Se temos mais que 2 salas em destaque, desmarcar algumas
                if (destaqueCount > 2) {
                    let desmarcar = destaqueCount - 2;
                    for (let i = 0; i < salasPadrao.length && desmarcar > 0; i++) {
                        if (salasPadrao[i].destaque && 
                            salasPadrao[i].id !== 'educacao' && 
                            salasPadrao[i].id !== 'artes') {
                            salasPadrao[i].destaque = false;
                            desmarcar--;
                        }
                    }
                }
                // Se temos menos que 2 salas em destaque, marcar mais até chegar a 2
                else if (destaqueCount < 2) {
                    // Priorizar Educação e Artes
                    const prioridades = ['educacao', 'artes'];
                    
                    // Primeiro marcar as prioritárias
                    for (let id of prioridades) {
                        if (destaqueCount < 2) {
                            const sala = salasPadrao.find(s => s.id === id);
                            if (sala && !sala.destaque) {
                                sala.destaque = true;
                                destaqueCount++;
                            }
                        }
                    }
                    
                    // Se ainda precisar de mais, marcar outras
                    if (destaqueCount < 2) {
                        for (let i = 0; i < salasPadrao.length && destaqueCount < 2; i++) {
                            if (!salasPadrao[i].destaque) {
                                salasPadrao[i].destaque = true;
                                destaqueCount++;
                            }
                        }
                    }
                }
                
                // Criar salas uma por uma
                const promises = salasPadrao.map(sala => {
                    return criarSala(sala);
                });
                
                return Promise.all(promises);
            })
            .then(() => {
                console.log('Salas padrão criadas com sucesso');
                // Recarregar a página para mostrar as salas criadas
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            })
            .catch((error) => {
                console.error('Erro ao criar salas padrão:', error);
                
                // Em caso de erro, mostrar mensagem amigável
                salasContainer.innerHTML = `
                    <div class="error-message">
                        <i class="fas fa-exclamation-triangle"></i>
                        <p>Não foi possível criar as salas padrão: ${error.message}</p>
                        <button class="btn btn-primary" onclick="window.location.reload()">Tentar novamente</button>
                    </div>
                `;
            });
    }
    
    // Função simplificada para criar uma sala
    function criarSala(sala) {
        console.log('Criando sala:', sala.id);
        
        const user = firebase.auth().currentUser;
        
        if (!user) {
            return Promise.reject(new Error('Usuário não autenticado'));
        }
        
        // Dados da sala
        const salaData = {
            ...sala,
            criadorId: user.uid,
            criadorNome: user.displayName || user.email,
            dataCriacao: firebase.firestore.FieldValue.serverTimestamp(),
            participantes: [user.uid],
            publica: true
        };
        
        // Criar a sala
        return db.collection('salas').doc(sala.id).set(salaData)
            .then(() => {
                console.log('Sala criada com sucesso:', sala.id);
                return Promise.resolve();
            })
            .catch(error => {
                console.error(`Erro ao criar sala ${sala.id}:`, error);
                return Promise.resolve(); // Continuar com as próximas salas mesmo se uma falhar
            });
    }
    
    // Função para criar card de sala
    function criarCardSala(sala) {
        const card = document.createElement('div');
        card.className = 'card';
        
        // Mapeamento direto de IDs de salas para imagens
        const imagensPorId = {
            'tecnologia': 'images/tecnonologia.webp',
            'tech-talks': 'images/tech-talk.jpg',
            'saude-geral': 'images/saude.png',
            'saude': 'images/saude.png',
            'jogos': 'images/Videogames.jpg',
            'game': 'images/Videogames.jpg',
            'moda': 'images/moda.jpg',
            'educacao': 'images/educacao.jpeg',
            'jogos-educativos': 'images/jogos educativos.jpg',
            'literatura-poesia': 'images/leitura e poesia.webp',
            'literatura': 'images/leitura e poesia.webp',
            'poesia': 'images/leitura e poesia.webp',
            'saude-mental': 'images/Saude-mental.jpg'
        };
        
        // Obter imagem diretamente pelo ID da sala ou pelo mapeamento de palavras-chave
        let imagemSrc = sala.imagem;
        
        // Se a sala tem um ID no mapeamento, usar essa imagem
        if (imagensPorId[sala.id]) {
            imagemSrc = imagensPorId[sala.id];
        } 
        // Se não, verificar pelo nome
        else {
            const nomeSalaLowerCase = sala.nome.toLowerCase();
            
            if (nomeSalaLowerCase.includes('tecnologia') || nomeSalaLowerCase.includes('tech')) {
                imagemSrc = 'images/tecnonologia.webp';
            } else if (nomeSalaLowerCase.includes('palestra') || nomeSalaLowerCase.includes('talk')) {
                imagemSrc = 'images/tech-talk.jpg';
            } else if (nomeSalaLowerCase.includes('mental')) {
                imagemSrc = 'images/Saude-mental.jpg';
            } else if (nomeSalaLowerCase.includes('saúde') || nomeSalaLowerCase.includes('saude')) {
                imagemSrc = 'images/saude.png';
            } else if (nomeSalaLowerCase.includes('jogo') || nomeSalaLowerCase.includes('games')) {
                imagemSrc = 'images/Videogames.jpg';
            } else if (nomeSalaLowerCase.includes('jogos educativos')) {
                imagemSrc = 'images/jogos educativos.jpg';
            } else if (nomeSalaLowerCase.includes('moda') || nomeSalaLowerCase.includes('estilo')) {
                imagemSrc = 'images/moda.jpg';
            } else if (nomeSalaLowerCase.includes('educação') || nomeSalaLowerCase.includes('educacao') || nomeSalaLowerCase.includes('ensino')) {
                imagemSrc = 'images/educacao.jpeg';
            } else if (nomeSalaLowerCase.includes('literatura') || nomeSalaLowerCase.includes('poesia') || nomeSalaLowerCase.includes('livro') || nomeSalaLowerCase.includes('leitura')) {
                imagemSrc = 'images/leitura e poesia.webp';
            } else {
                // Imagem padrão caso não encontre correspondência
                imagemSrc = 'images/default-room.jpg';
            }
        }
        
        // Verificar se a imagem está definida corretamente
        if (!imagemSrc || imagemSrc === '') {
            imagemSrc = 'images/default-room.jpg';
        }
        
        // Gerar um número fixo de participantes para a visualização
        // Sala de tópico: saude terá 2 participantes, as outras terão 3
        const numParticipantes = sala.id.includes('saude') ? 2 : 3;
        
        // Simplificar o ID da sala para exibição
        const salaId = sala.id.replace(/-/g, ' ');
        
        card.innerHTML = `
            <div class="card-image">
                <img src="${imagemSrc}" alt="${sala.nome}" onerror="this.onerror=null; this.src='images/default-room.jpg';">
            </div>
            <div class="card-content">
                <h3>${sala.nome.toLowerCase()}</h3>
                <p>Sala do tópico: ${salaId}</p>
                <div class="card-meta">
                    <span><i class="fas fa-users"></i> ${numParticipantes} participantes</span>
                </div>
                <a href="sala.html?sala=${sala.id}" class="btn btn-primary btn-block">Entrar na Sala</a>
            </div>
        `;
        
        return card;
    }
}); 