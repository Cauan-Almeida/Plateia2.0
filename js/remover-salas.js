// Script para remover salas específicas
document.addEventListener('DOMContentLoaded', function() {
    console.log('Iniciando script para remover salas...');
    
    // Verificar se o Firebase está inicializado
    if (!firebase || !firebase.firestore) {
        console.error('Firebase não está inicializado');
        alert('Erro: Firebase não está inicializado. Por favor, tente novamente mais tarde.');
        return;
    }
    
    // Referência ao Firestore
    const db = firebase.firestore();
    
    // Salas a serem removidas
    const salasParaRemover = ['fashion', 'artes', 'fitness-zone', 'art-hub', 'fitness', 'mental-health'];
    
    // Função para remover as salas
    function removerSalas() {
        console.log('Removendo salas:', salasParaRemover);
        
        // Obter todas as salas do Firestore
        db.collection('salas').get()
            .then((snapshot) => {
                if (snapshot.empty) {
                    console.log('Nenhuma sala encontrada.');
                    alert('Nenhuma sala encontrada no banco de dados.');
                    return;
                }
                
                console.log('Total de salas encontradas:', snapshot.size);
                
                const batch = db.batch();
                let salasRemovidas = 0;
                
                // Processar cada sala
                snapshot.forEach((doc) => {
                    const sala = doc.data();
                    const salaId = doc.id;
                    
                    // Verificar se a sala deve ser removida
                    // (tanto pelo ID exato quanto por ID que contenha as palavras)
                    if (salasParaRemover.includes(salaId) || 
                        salasParaRemover.some(id => salaId.includes(id)) ||
                        (sala.nome && salasParaRemover.some(id => sala.nome.toLowerCase().includes(id.replace('-', ' ')))))
                    {
                        console.log('Removendo sala:', salaId, sala.nome);
                        batch.delete(doc.ref);
                        salasRemovidas++;
                    }
                });
                
                // Se encontrou salas para remover, executar o batch
                if (salasRemovidas > 0) {
                    return batch.commit()
                        .then(() => {
                            console.log(`${salasRemovidas} salas removidas com sucesso!`);
                            alert(`${salasRemovidas} salas removidas com sucesso! A página será recarregada.`);
                            // Recarregar a página para mostrar as alterações
                            setTimeout(() => {
                                window.location.reload();
                            }, 1500);
                        });
                } else {
                    console.log('Nenhuma sala correspondente foi encontrada para remover.');
                    alert('Nenhuma sala correspondente foi encontrada para remover.');
                }
            })
            .catch((error) => {
                console.error('Erro ao remover salas:', error);
                alert(`Erro ao remover salas: ${error.message}`);
            });
    }
    
    // Executar a remoção automaticamente
    removerSalas();
}); 