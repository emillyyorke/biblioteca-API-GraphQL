const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');

async function startServer() {
  const app = express();

  // Conectar ao MongoDB (sem opções depreciadas — Mongoose 8.x não precisa mais)
  try {
    await mongoose.connect('mongodb://localhost:27017/biblioteca');
    console.log('✅ Conectado ao MongoDB');
  } catch (err) {
    console.error('❌ Erro ao conectar ao MongoDB:', err.message);
    console.log('💡 Certifique-se de que o MongoDB está rodando: mongod --dbpath /data/db');
    process.exit(1);
  }

  // Configurar CORS
  app.use(cors());

  // Servir arquivos estáticos do frontend
  app.use(express.static(path.join(__dirname, '..', 'frontend')));

  // Configurar Apollo Server
  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => ({ req }),
    formatError: (err) => {
      console.error('GraphQL Error:', err.message);
      return err;
    }
  });

  await apolloServer.start();
  apolloServer.applyMiddleware({ app, path: '/graphql' });

  // Rota raiz serve o frontend
  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
  });

  // Iniciar servidor
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`\n🚀 Servidor rodando em http://localhost:${PORT}`);
    console.log(`📡 GraphQL endpoint: http://localhost:${PORT}${apolloServer.graphqlPath}`);
    console.log(`📚 Frontend: http://localhost:${PORT}\n`);
  });
}

startServer().catch(err => {
  console.error('❌ Erro ao iniciar servidor:', err);
  process.exit(1);
});
