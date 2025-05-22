# Plateia - Sala de Tópicos

## Visão Geral

A funcionalidade de Sala de Tópicos do Plateia permite que os usuários participem de salas temáticas onde podem interagir através de videoconferência, chat, quadro compartilhado e compartilhamento de arquivos. Esta funcionalidade substitui a antiga sala de videoconferência simples, oferecendo uma experiência mais completa e integrada com o conceito de salas temáticas do dashboard.

## Funcionalidades

### 1. Integração com Salas do Dashboard

- As salas exibidas no dashboard são agora interativas
- Clique em "Entrar na Sala" para acessar diretamente uma sala específica
- As salas são armazenadas no Firebase Firestore

### 2. Interface Multifuncional

A nova interface da sala inclui:

- **Videoconferência**: Utilizando a API do Jitsi Meet
- **Chat em Tempo Real**: Chat integrado com histórico de mensagens
- **Quadro Compartilhado**: Utilizando Excalidraw para colaboração visual
- **Compartilhamento de Arquivos**: Upload e download de arquivos

### 3. Informações da Sala

- Nome e descrição da sala
- Lista de participantes online
- Estatísticas de uso (número de participantes, mensagens, etc.)

## Tecnologias Utilizadas

- **Firebase**:
  - Authentication: Para autenticação de usuários
  - Firestore: Para armazenar dados das salas, mensagens e participantes
  - Storage: Para armazenar arquivos compartilhados

- **APIs de Terceiros**:
  - Jitsi Meet: Para videoconferência
  - Excalidraw: Para o quadro compartilhado

## Como Usar

1. Acesse o dashboard do Plateia
2. Clique em "Sala de Tópicos" no menu superior ou em "Entrar na Sala" em qualquer card de sala
3. Selecione uma sala na lista suspensa (ou será automaticamente selecionada se vier do dashboard)
4. Clique em "Entrar na Sala"
5. Utilize as abas para alternar entre videoconferência, chat, quadro e arquivos

## Estrutura de Dados no Firebase

### Coleção `salas`

- **Documento**: `{id_da_sala}`
  - `nome`: Nome da sala
  - `descricao`: Descrição da sala
  - `categoria`: Categoria da sala
  - `imagem`: URL da imagem de capa
  - `criado_em`: Timestamp de criação

  - **Subcoleção**: `participantes`
    - **Documento**: `{uid_do_usuario}`
      - `uid`: ID do usuário
      - `nome`: Nome do usuário
      - `email`: Email do usuário
      - `photoURL`: URL da foto do usuário
      - `entradaEm`: Timestamp de entrada
      - `saidaEm`: Timestamp de saída (se aplicável)
      - `online`: Status online (boolean)

  - **Subcoleção**: `mensagens`
    - **Documento**: `{id_auto_gerado}`
      - `texto`: Conteúdo da mensagem
      - `userId`: ID do usuário que enviou
      - `userName`: Nome do usuário
      - `userPhoto`: URL da foto do usuário
      - `timestamp`: Timestamp de envio

  - **Subcoleção**: `arquivos`
    - **Documento**: `{id_auto_gerado}`
      - `nome`: Nome do arquivo
      - `tipo`: Tipo MIME do arquivo
      - `tamanho`: Tamanho em bytes
      - `url`: URL de download
      - `path`: Caminho no Firebase Storage
      - `userId`: ID do usuário que enviou
      - `userName`: Nome do usuário
      - `uploadedAt`: Timestamp de upload

## Configuração das Regras do Firestore

Para garantir o correto funcionamento das permissões no aplicativo, é necessário configurar as regras do Firestore. Siga os passos abaixo:

1. Acesse o [Console do Firebase](https://console.firebase.google.com/)
2. Selecione o projeto "plateia-e13ee"
3. No menu lateral, clique em "Firestore Database"
4. Clique na aba "Regras"
5. Substitua o conteúdo atual pelas regras contidas no arquivo `firestore.rules` deste projeto
6. Clique em "Publicar"

As regras implementadas são simplificadas para permitir:
- Qualquer usuário autenticado pode ler e escrever em qualquer documento
- Esta abordagem simplificada resolve problemas de permissão que podem ocorrer durante o uso do aplicativo
- Em um ambiente de produção, você pode querer implementar regras mais restritivas após resolver os problemas iniciais

**Nota importante:** As regras atuais são adequadas para desenvolvimento e testes, mas para um ambiente de produção, considere implementar regras mais específicas para proteger seus dados.

# Plateia 2.0

## Atualizações de Permissões do Firestore

Foram realizadas várias alterações para resolver problemas de permissão no acesso ao Firestore:

### 1. Regras do Firestore Simplificadas

As regras do Firestore foram simplificadas para permitir acesso total a usuários autenticados:

```
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 2. Configuração do Firebase

O arquivo `js/firebase-config.js` foi atualizado para:
- Usar persistência LOCAL para melhorar a experiência offline
- Atualizar o token de autenticação automaticamente
- Melhorar o tratamento de erros

### 3. Verificação de Autenticação

Foi implementado o arquivo `js/auth-check.js` que:
- Verifica se o usuário está autenticado antes de acessar páginas protegidas
- Redireciona para a página de login se necessário
- Atualiza o token de autenticação para evitar problemas de permissão

### 4. Funções de Criação de Salas

As funções `criarSalaSeNaoExistir` e `criarSalaDiretamente` no arquivo `js/sala.js` foram modificadas para:
- Usar o método `set` com `{ merge: true }` para evitar sobrescrever dados existentes
- Definir salas como públicas por padrão
- Implementar tratamento de erros mais robusto

### 5. Inicialização de Salas

O arquivo `js/init-salas.js` foi atualizado para:
- Verificar autenticação antes de acessar o Firestore
- Criar salas padrão se não existirem
- Melhorar o tratamento de erros

### 6. Correções de Imagens

Foram feitas correções nas referências a imagens que não existiam:
- Criado o arquivo `default-room.jpg` a partir de `Hero.jpg`
- Atualizado o arquivo `js/init-salas.js` para usar imagens existentes nas salas padrão
- Corrigido o fallback de imagens no arquivo `js/sala.js` para usar `usuario.png` em vez de `user-avatar.jpg`
- Implementado tratamento de erro para imagens não encontradas

### 7. Correção de Erros Adicionais

- Adicionada verificação de disponibilidade do Excalidraw para evitar erros no quadro branco
- Criado arquivo de configuração CORS para o Firebase Storage para permitir acesso de localhost

## Como Usar

1. Certifique-se de estar logado antes de acessar páginas protegidas
2. Se encontrar problemas de permissão, tente recarregar a página ou fazer login novamente
3. As salas são criadas automaticamente se não existirem

## Configuração do Firebase

Para implantar as regras do Firestore:

```
firebase login
firebase deploy --only firestore:rules
```

Para configurar as regras CORS do Firebase Storage:

```
firebase login
gsutil cors set cors.json gs://plateia-e13ee.firebasestorage.app
```

Nota: Para usar o comando `gsutil`, você precisa ter o Google Cloud SDK instalado. Se não tiver, você pode instalá-lo seguindo as instruções em: https://cloud.google.com/sdk/docs/install 