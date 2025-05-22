@echo off
echo Instalando ferramentas do Firebase...
npm install -g firebase-tools

echo Instalando Google Cloud SDK...
echo Por favor, visite https://cloud.google.com/sdk/docs/install para instalar o Google Cloud SDK

echo Fazendo login no Firebase...
firebase login

echo Implantando regras do Firestore...
firebase deploy --only firestore:rules

echo Configurando regras CORS do Firebase Storage...
echo Este comando requer o Google Cloud SDK instalado
echo Se você já instalou o Google Cloud SDK, pressione qualquer tecla para continuar
pause
gsutil cors set cors.json gs://plateia-e13ee.firebasestorage.app

echo Configuração concluída!
pause 