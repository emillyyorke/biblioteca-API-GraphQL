# 📚 Biblioteca Online - Sistema Full-Stack

Um sistema moderno de gerenciamento de livros que utiliza **GraphQL** para a comunicação entre o cliente e o servidor. A aplicação permite catalogar livros, realizar buscas inteligentes e gerenciar o acervo em tempo real.

---

## 🛠️ Tecnologias Utilizadas

### **Back-end (API)**
* **Node.js & Express**: Base do servidor web.
* **Apollo Server Express**: Implementação do servidor GraphQL.
* **Mongoose & MongoDB**: Modelagem de dados e banco de dados NoSQL.
* **GraphQL**: Linguagem de consulta para APIs.

### **Front-end**
* **HTML5 & CSS3**: Estrutura e estilização moderna com Flexbox e Grid.
* **JavaScript (Vanilla)**: Lógica de consumo da API usando `fetch` e manipulação do DOM.
* **Font Awesome**: Ícones vetoriais.
* **Google Fonts (Montserrat)**: Tipografia refinada.

---

## 📋 Funcionalidades

- **Catálogo Dinâmico**: Visualização de todos os livros cadastrados com capas e descrições.
- **Busca Global**: Pesquisa por título, autor ou gênero.
- **Gestão de Acervo**: Adição de novos títulos e remoção de livros existentes via Mutations.
- **Interface Responsiva**: Design adaptável para dispositivos móveis e desktop.

---

## 🚀 Como Executar o Projeto

### **Pré-requisitos**
- Node.js instalado.
- MongoDB instalado localmente e rodando na porta padrão (`27017`).

### **1. Configuração do Back-end**
Navegue até a pasta do servidor e instale as dependências:
```bash
npm install
