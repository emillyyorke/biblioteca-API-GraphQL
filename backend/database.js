const mongoose = require('mongoose');

const livroSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  autor: { type: String, required: true },
  genero: { type: String, required: true },
  anoPublicacao: { type: Number },
  paginas: { type: Number },
  editora: { type: String },
  descricao: { type: String },
  capaUrl: { type: String },
  disponivel: { type: Boolean, default: true }
});

const Livro = mongoose.model('Livro', livroSchema);

module.exports = { Livro };