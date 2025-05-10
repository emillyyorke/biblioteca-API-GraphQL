const API_URL = 'http://localhost:4000/graphql';

// Função para fazer requisições GraphQL
async function fetchGraphQL(query, variables = {}) {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            query,
            variables
        })
    });
    return await response.json();
}

// Carregar todos os livros
async function loadBooks() {
    const query = `
        query {
            livros {
                id
                titulo
                autor
                genero
                anoPublicacao
                paginas
                editora
                descricao
                capaUrl
                disponivel
            }
        }
    `;

    const { data } = await fetchGraphQL(query);
    displayBooks(data.livros);
}

// Buscar livros
async function searchBooks() {
    const searchTerm = document.getElementById('searchInput').value.trim();
    if (!searchTerm) {
        loadBooks();
        return;
    }

    const query = `
        query BuscarLivros($termo: String!) {
            buscarPorTitulo(titulo: $termo) {
                id
                titulo
                autor
                genero
                capaUrl
            }
            buscarPorAutor(autor: $termo) {
                id
                titulo
                autor
                genero
                capaUrl
            }
            buscarPorGenero(genero: $termo) {
                id
                titulo
                autor
                genero
                capaUrl
            }
        }
    `;

    const { data } = await fetchGraphQL(query, { termo: searchTerm });
    
    // Combinar resultados sem duplicatas
    const allResults = [...data.buscarPorTitulo, ...data.buscarPorAutor, ...data.buscarPorGenero];
    const uniqueResults = Array.from(new Set(allResults.map(l => l.id)))
        .map(id => allResults.find(l => l.id === id));
    
    displayBooks(uniqueResults);
}

// Adicionar novo livro
async function addBook(event) {
    event.preventDefault();
    
    const form = event.target;
    const input = {
        titulo: form.titulo.value,
        autor: form.autor.value,
        genero: form.genero.value,
        anoPublicacao: form.anoPublicacao.value ? parseInt(form.anoPublicacao.value) : null,
        paginas: form.paginas.value ? parseInt(form.paginas.value) : null,
        editora: form.editora.value,
        descricao: form.descricao.value,
        capaUrl: form.capaUrl.value || 'https://via.placeholder.com/150x200?text=Sem+Capa'
    };

    const mutation = `
        mutation AdicionarLivro($input: LivroInput!) {
            adicionarLivro(input: $input) {
                id
                titulo
                autor
                genero
                capaUrl
            }
        }
    `;

    await fetchGraphQL(mutation, { input });
    form.reset();
    loadBooks();
}

// Remover livro
async function removeBook(id) {
    if (!confirm('Tem certeza que deseja remover este livro?')) return;

    const mutation = `
        mutation RemoverLivro($id: ID!) {
            removerLivro(id: $id)
        }
    `;

    await fetchGraphQL(mutation, { id });
    loadBooks();
}

// Exibir livros na tela
function displayBooks(livros) {
    const bookList = document.getElementById('bookList');
    bookList.innerHTML = '';

    if (livros.length === 0) {
        bookList.innerHTML = '<p class="no-books">Nenhum livro encontrado.</p>';
        return;
    }

    livros.forEach(livro => {
        const bookCard = document.createElement('div');
        bookCard.className = 'book-card';
        
        bookCard.innerHTML = `
            <div class="book-cover" style="background-image: url('${livro.capaUrl || 'https://via.placeholder.com/150x200?text=Sem+Capa'}')"></div>
            <div class="book-info">
                <h3 class="book-title">${livro.titulo}</h3>
                <p class="book-author">${livro.autor}</p>
                <span class="book-genre">${livro.genero}</span>
                ${livro.descricao ? `<p class="book-description">${livro.descricao}</p>` : ''}
                <div class="book-actions">
                    <span class="book-status">${livro.disponivel ? 'Disponível' : 'Indisponível'}</span>
                    <button class="delete-btn" onclick="removeBook('${livro.id}')">
                        <i class="fas fa-trash"></i> Remover
                    </button>
                </div>
            </div>
        `;

        bookList.appendChild(bookCard);
    });
}

// Event Listeners
document.addEventListener('DOMContentLoaded', loadBooks);
document.getElementById('searchBtn').addEventListener('click', searchBooks);
document.getElementById('searchInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') searchBooks();
});
document.getElementById('bookForm').addEventListener('submit', addBook);

// Expor funções para o escopo global
window.removeBook = removeBook;