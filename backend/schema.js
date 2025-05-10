const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Livro {
    id: ID!
    titulo: String!
    autor: String!
    genero: String!
    anoPublicacao: Int
    paginas: Int
    editora: String
    descricao: String
    capaUrl: String
    disponivel: Boolean
  }

  input LivroInput {
    titulo: String!
    autor: String!
    genero: String!
    anoPublicacao: Int
    paginas: Int
    editora: String
    descricao: String
    capaUrl: String
    disponivel: Boolean
  }

  type Query {
    livros: [Livro!]!
    livro(id: ID!): Livro
    buscarPorTitulo(titulo: String!): [Livro!]!
    buscarPorAutor(autor: String!): [Livro!]!
    buscarPorGenero(genero: String!): [Livro!]!
  }

  type Mutation {
    adicionarLivro(input: LivroInput!): Livro!
    removerLivro(id: ID!): String
    atualizarLivro(id: ID!, input: LivroInput!): Livro!
  }
`;

module.exports = typeDefs;