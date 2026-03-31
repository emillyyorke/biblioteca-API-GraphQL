/* ══════════════════════════════════════════
   BIBLIOTECA GRAPHQL — FRONTEND
   ══════════════════════════════════════════ */

const API_URL = 'http://localhost:4000/graphql';
let allBooks = [];
let currentFilter = 'all';

// ── GraphQL fetch wrapper with error handling ──
async function fetchGraphQL(query, variables = {}) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query, variables })
        });

        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const result = await response.json();

        if (result.errors) {
            throw new Error(result.errors[0].message);
        }

        return result;
    } catch (err) {
        if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
            showToast('Servidor offline. Verifique se o backend está rodando.', 'error');
        } else {
            showToast(`Erro: ${err.message}`, 'error');
        }
        throw err;
    }
}

// ── Load all books ──
async function loadBooks() {
    const query = `
        query {
            livros {
                id titulo autor genero anoPublicacao
                paginas editora descricao capaUrl disponivel
            }
        }
    `;

    try {
        const { data } = await fetchGraphQL(query);
        allBooks = data.livros;
        applyFilters();
        updateStats();
    } catch {
        document.getElementById('bookList').innerHTML = `
            <div style="grid-column: 1/-1; text-align:center; padding:40px; color: var(--text-muted);">
                <div style="font-size:2.5rem; margin-bottom:12px;">⚠️</div>
                <p style="font-weight:600;">Não foi possível conectar ao servidor</p>
                <p style="font-size:0.85rem; margin-top:6px;">Certifique-se de que o backend está rodando em <code>localhost:4000</code></p>
            </div>
        `;
    }
}

// ── Search books ──
async function searchBooks() {
    const term = document.getElementById('searchInput').value.trim();
    document.getElementById('clearSearch').classList.toggle('visible', term.length > 0);

    if (!term) {
        applyFilters();
        return;
    }

    const query = `
        query BuscarLivros($termo: String!) {
            buscarPorTitulo(titulo: $termo) { id titulo autor genero capaUrl disponivel anoPublicacao paginas editora descricao }
            buscarPorAutor(autor: $termo)   { id titulo autor genero capaUrl disponivel anoPublicacao paginas editora descricao }
            buscarPorGenero(genero: $termo)  { id titulo autor genero capaUrl disponivel anoPublicacao paginas editora descricao }
        }
    `;

    try {
        const { data } = await fetchGraphQL(query, { termo: term });
        const all = [...data.buscarPorTitulo, ...data.buscarPorAutor, ...data.buscarPorGenero];
        const unique = [...new Map(all.map(b => [b.id, b])).values()];
        displayBooks(unique);
    } catch { /* handled in fetchGraphQL */ }
}

// ── Add book ──
async function addBook(event) {
    event.preventDefault();
    const btn = document.getElementById('submitBtn');
    btn.disabled = true;
    btn.querySelector('.btn-text').style.display = 'none';
    btn.querySelector('.btn-loading').style.display = 'inline';

    const editId = document.getElementById('editId').value;
    const input = getFormData();

    try {
        if (editId) {
            const mutation = `
                mutation AtualizarLivro($id: ID!, $input: LivroInput!) {
                    atualizarLivro(id: $id, input: $input) { id titulo }
                }
            `;
            await fetchGraphQL(mutation, { id: editId, input });
            showToast('Livro atualizado com sucesso!', 'success');
        } else {
            const mutation = `
                mutation AdicionarLivro($input: LivroInput!) {
                    adicionarLivro(input: $input) { id titulo }
                }
            `;
            await fetchGraphQL(mutation, { input });
            showToast('Livro adicionado com sucesso!', 'success');
        }

        closeModal();
        document.getElementById('bookForm').reset();
        document.getElementById('editId').value = '';
        await loadBooks();
    } catch { /* handled */ }

    btn.disabled = false;
    btn.querySelector('.btn-text').style.display = 'inline';
    btn.querySelector('.btn-loading').style.display = 'none';
}

// ── Remove book ──
async function removeBook(id) {
    if (!confirm('Tem certeza que deseja remover este livro?')) return;

    const mutation = `
        mutation RemoverLivro($id: ID!) { removerLivro(id: $id) }
    `;

    try {
        await fetchGraphQL(mutation, { id });
        showToast('Livro removido.', 'info');
        await loadBooks();
    } catch { /* handled */ }
}

// ── Toggle availability ──
async function toggleAvailability(id, currentStatus) {
    const book = allBooks.find(b => b.id === id);
    if (!book) return;

    const input = {
        titulo: book.titulo,
        autor: book.autor,
        genero: book.genero,
        anoPublicacao: book.anoPublicacao,
        paginas: book.paginas,
        editora: book.editora || '',
        descricao: book.descricao || '',
        capaUrl: book.capaUrl || '',
        disponivel: !currentStatus
    };

    const mutation = `
        mutation AtualizarLivro($id: ID!, $input: LivroInput!) {
            atualizarLivro(id: $id, input: $input) { id disponivel }
        }
    `;

    try {
        await fetchGraphQL(mutation, { id, input });
        showToast(!currentStatus ? 'Livro marcado como disponível' : 'Livro marcado como indisponível', 'success');
        await loadBooks();
    } catch { /* handled */ }
}

// ── Edit book (fill modal) ──
function editBook(id) {
    const book = allBooks.find(b => b.id === id);
    if (!book) return;

    document.getElementById('editId').value = book.id;
    document.getElementById('titulo').value = book.titulo;
    document.getElementById('autor').value = book.autor;
    document.getElementById('genero').value = book.genero;
    document.getElementById('anoPublicacao').value = book.anoPublicacao || '';
    document.getElementById('paginas').value = book.paginas || '';
    document.getElementById('editora').value = book.editora || '';
    document.getElementById('descricao').value = book.descricao || '';
    document.getElementById('capaUrl').value = book.capaUrl || '';

    document.getElementById('modalTitle').textContent = 'Editar Livro';
    document.getElementById('submitBtn').querySelector('.btn-text').textContent = 'Salvar Alterações';
    openModal();
}

// ── Display books ──
function displayBooks(livros) {
    const list = document.getElementById('bookList');
    const empty = document.getElementById('emptyState');

    if (!livros || livros.length === 0) {
        list.innerHTML = '';
        empty.style.display = 'block';
        return;
    }

    empty.style.display = 'none';
    list.innerHTML = livros.map(livro => `
        <div class="book-card">
            <div class="book-cover">
                ${livro.capaUrl
                    ? `<img src="${livro.capaUrl}" alt="${livro.titulo}" onerror="this.style.display='none'">`
                    : ''
                }
                <div class="cover-placeholder">
                    <span class="cover-emoji">📖</span>
                </div>
                <span class="book-status-badge ${livro.disponivel !== false ? 'available' : 'unavailable'}">
                    ${livro.disponivel !== false ? '● Disponível' : '● Indisponível'}
                </span>
            </div>
            <div class="book-body">
                <span class="book-genre-tag">${livro.genero}</span>
                <h3 class="book-title">${livro.titulo}</h3>
                <p class="book-author">por ${livro.autor}</p>
                <div class="book-meta">
                    ${livro.anoPublicacao ? `<span>📅 ${livro.anoPublicacao}</span>` : ''}
                    ${livro.paginas ? `<span>📄 ${livro.paginas} pág.</span>` : ''}
                    ${livro.editora ? `<span>🏢 ${livro.editora}</span>` : ''}
                </div>
                ${livro.descricao ? `<p class="book-desc">${livro.descricao}</p>` : ''}
                <div class="book-actions">
                    <button class="btn-edit" onclick="editBook('${livro.id}')">✏️ Editar</button>
                    <button class="btn-toggle ${livro.disponivel !== false ? '' : 'unavailable'}" onclick="toggleAvailability('${livro.id}', ${livro.disponivel !== false})">
                        ${livro.disponivel !== false ? '📗' : '📕'}
                    </button>
                    <button class="btn-delete" onclick="removeBook('${livro.id}')">🗑️</button>
                </div>
            </div>
        </div>
    `).join('');
}

// ── Filter logic ──
function applyFilters() {
    let filtered = [...allBooks];
    if (currentFilter === 'available') filtered = filtered.filter(b => b.disponivel !== false);
    if (currentFilter === 'unavailable') filtered = filtered.filter(b => b.disponivel === false);
    displayBooks(filtered);
}

function updateStats() {
    document.getElementById('totalBooks').textContent = allBooks.length;
    document.getElementById('availableBooks').textContent = allBooks.filter(b => b.disponivel !== false).length;
}

// ── Helpers ──
function getFormData() {
    return {
        titulo: document.getElementById('titulo').value,
        autor: document.getElementById('autor').value,
        genero: document.getElementById('genero').value,
        anoPublicacao: document.getElementById('anoPublicacao').value ? parseInt(document.getElementById('anoPublicacao').value) : null,
        paginas: document.getElementById('paginas').value ? parseInt(document.getElementById('paginas').value) : null,
        editora: document.getElementById('editora').value,
        descricao: document.getElementById('descricao').value,
        capaUrl: document.getElementById('capaUrl').value
    };
}

// ── Modal ──
function openModal() {
    document.getElementById('modalOverlay').classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    document.getElementById('modalOverlay').classList.remove('open');
    document.body.style.overflow = '';
    document.getElementById('bookForm').reset();
    document.getElementById('editId').value = '';
    document.getElementById('modalTitle').textContent = 'Novo Livro';
    document.getElementById('submitBtn').querySelector('.btn-text').textContent = 'Adicionar Livro';
}

// ── Toast notifications ──
function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const icons = { success: '✅', error: '❌', info: 'ℹ️' };

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<span class="toast-icon">${icons[type]}</span><span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('fade-out');
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}

// ── Event Listeners ──
document.addEventListener('DOMContentLoaded', loadBooks);
document.getElementById('bookForm').addEventListener('submit', addBook);
document.getElementById('openAddBtn').addEventListener('click', openModal);
document.getElementById('closeModal').addEventListener('click', closeModal);
document.getElementById('cancelModal').addEventListener('click', closeModal);
document.getElementById('modalOverlay').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeModal();
});

// Search
let searchTimeout;
document.getElementById('searchInput').addEventListener('input', () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(searchBooks, 300);
});
document.getElementById('clearSearch').addEventListener('click', () => {
    document.getElementById('searchInput').value = '';
    document.getElementById('clearSearch').classList.remove('visible');
    applyFilters();
});

// Filter chips
document.querySelectorAll('.chip').forEach(chip => {
    chip.addEventListener('click', () => {
        document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        currentFilter = chip.dataset.filter;
        applyFilters();
    });
});

// Escape to close modal
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
});

// Global scope
window.removeBook = removeBook;
window.editBook = editBook;
window.toggleAvailability = toggleAvailability;
