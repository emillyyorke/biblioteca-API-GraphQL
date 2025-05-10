# 📚 Biblioteca Online - API GraphQL + Frontend

![Node.js](https://img.shields.io/badge/Node.js-18.x-green)
![MongoDB](https://img.shields.io/badge/MongoDB-5.0+-brightgreen)
![GraphQL](https://img.shields.io/badge/GraphQL-16.8.1-pink)

Um sistema completo para gerenciamento de acervo de livros com API GraphQL e interface web moderna.

## 🚀 Funcionalidades

- Catálogo completo de livros
- Busca por título, autor ou gênero
- Adição/remoção de livros
- Atualização de status de disponibilidade
- Interface responsiva em tons de azul

## 🛠 Tecnologias

### Backend
- **Node.js** (v18+)
- **Apollo Server** (GraphQL)
- **Mongoose** (ODM para MongoDB)
- **Express** (Servidor HTTP)

### Frontend
- HTML5 + CSS3 moderno (Flexbox/Grid)
- JavaScript Vanilla (ES6+)
- Fetch API para consumo GraphQL

## 📦 Como rodar localmente

1.Pré-requisitos
✅ Tenha instalado:

Node.js (v18 ou superior)

MongoDB (local ou Atlas)

Navegador moderno (Chrome, Firefox, Edge)

2. Clone o repositório

git clone https://github.com/seu-usuario/biblioteca-online.git
cd biblioteca-online

3. Configurar as dependências
npm init -y
npm install express apollo-server-express graphql mongoose cors

4. Inicie o servidor
node server.js

5. Acesse o frontend
Abra o arquivo frontend/index.html diretamente no navegador