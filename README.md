# 📚 Biblioteca Online - Sistema Full-Stack (GraphQL + MongoDB)

Este é um sistema robusto de gerenciamento de acervo literário que utiliza uma arquitetura moderna baseada em **GraphQL**. O projeto permite o cadastro, a busca inteligente e a exclusão de títulos em tempo real, integrando uma interface reativa com um banco de dados NoSQL.

---

## 🛠️ Tecnologias e Ferramentas

### **Back-end (API & Banco de Dados)**
* **Node.js**: Ambiente de execução para o servidor.
* **Express**: Framework web para estruturação da aplicação.
* **Apollo Server Express**: Implementação do servidor GraphQL para gerenciar Queries e Mutations.
* **Mongoose**: Biblioteca ODM para modelagem de dados e conexão com o MongoDB.
* **GraphQL**: Linguagem de consulta para integração eficiente entre front e back.

### **Front-end (Interface)**
* **HTML5 & CSS3**: Estrutura semântica e estilização com Grid e Flexbox.
* **Google Fonts (Montserrat)**: Tipografia profissional para melhor legibilidade.
* **Font Awesome**: Conjunto de ícones para ações de interface.
* **JavaScript (Vanilla)**: Lógica de consumo da API via `fetch` e manipulação dinâmica do DOM.

---

## ⚙️ Funcionalidades do Sistema

* **Catálogo Reativo**: Visualização imediata de livros com capas, autores e descrições.
* **Busca Global**: Pesquisa simultânea por título, autor ou gênero através de expressões regulares (Regex) no banco de dados.
* **Gestão de Livros**: Formulário completo para adicionar novos títulos e botão de remoção definitiva.
* **Interface Responsiva**: Layout adaptável para diferentes tamanhos de tela.

---

## 📂 Estrutura de Arquivos

```text
backend/
├── database.js     # Schema do Mongoose e modelo do Livro
├── schema.js       # Definição dos tipos (TypeDefs) do GraphQL
├── resolvers.js    # Lógica de negócio (Queries e Mutations)
├── server.js       # Configuração do servidor e conexão MongoDB
├── package.json    # Dependências e scripts do Node.js
frontend/
├── index.html      # Estrutura da página principal
├── style.css       # Estilização e design visual
└── script.js       # Integração com a API GraphQL
```

---

## 🚀 Guia de Instalação e Execução

### **Pré-requisitos**
* Node.js instalado em sua máquina.
* MongoDB instalado e rodando localmente na porta padrão `27017`.

### **Passo 1: Configurar o Back-end**
Abra o terminal na pasta do projeto e siga os comandos:

```bash
# Entre na pasta do backend
cd backend

# Instale todas as dependências necessárias
npm install

# Inicie o servidor
npm start
```
O servidor GraphQL estará ativo em: `http://localhost:4000/graphql`.

### **Passo 2: Configurar o Front-end**
O front-end é baseado em arquivos estáticos:
1. Localize o arquivo `index.html`.
2. Abra-o diretamente em seu navegador ou utilize a extensão **Live Server** no VS Code.

---

## 📤 Guia de Deploy: Como subir para o GitHub

Para salvar este projeto no seu perfil, execute estes comandos na raiz da pasta:

```bash
# Inicializa o Git
git init

# Cria o arquivo para ignorar pastas pesadas
echo "node_modules/" > .gitignore

# Adiciona os arquivos e faz o commit
git add .
git commit -m "Projeto Biblioteca Full-Stack Finalizado"

# Conecta ao seu repositório remoto
git remote add origin [https://github.com/emillyyorke/NOME_DO_REPOSITORIO.git](https://github.com/emillyyorke/biblioteca-API-GraphQL.git)
git branch -M main
git push -u origin main
```

---
*Projeto desenvolvido por Emilly Yorke para fins educacionais focando na integração de APIs modernas e persistência de dados.*
