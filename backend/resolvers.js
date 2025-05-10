const Livro = require('./database').Livro;

const resolvers = {
  Query: {
    livros: async () => await Livro.find(),
    livro: async (_, { id }) => await Livro.findById(id),
    buscarPorTitulo: async (_, { titulo }) => {
      return await Livro.find({ titulo: new RegExp(titulo, 'i') });
    },
    buscarPorAutor: async (_, { autor }) => {
      return await Livro.find({ autor: new RegExp(autor, 'i') });
    },
    buscarPorGenero: async (_, { genero }) => {
      return await Livro.find({ genero: new RegExp(genero, 'i') });
    }
  },
  Mutation: {
    adicionarLivro: async (_, { input }) => {
      const livro = new Livro({ ...input, disponivel: true });
      await livro.save();
      return livro;
    },
    removerLivro: async (_, { id }) => {
      await Livro.findByIdAndDelete(id);
      return "Livro removido com sucesso";
    },
    atualizarLivro: async (_, { id, input }) => {
      const livro = await Livro.findByIdAndUpdate(id, input, { new: true });
      return livro;
    }
  }
};

module.exports = resolvers;