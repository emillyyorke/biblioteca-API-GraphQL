const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const mongoose = require('mongoose');
const cors = require('cors');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');

async function startServer() {
  const app = express();
  
  // Conectar ao MongoDB
  await mongoose.connect('mongodb://localhost:27017/biblioteca', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  console.log('Conectado ao MongoDB');

  // Configurar CORS
  app.use(cors());

  // Configurar Apollo Server
  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => ({ req })
  });

  await apolloServer.start();
  apolloServer.applyMiddleware({ app, path: '/graphql' });

  // Iniciar servidor
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}${apolloServer.graphqlPath}`);
  });
}

startServer().catch(err => console.error(err));