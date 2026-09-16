let todosProdutos = [];

document.addEventListener('DOMContentLoaded', () => {
  verificarAutenticacao();
  carregarProdutos();
});

function verificarAutenticacao() {
  const usuarioLogado = localStorage.getItem('usuario');
  if (!usuarioLogado) {
    window.location.href = 'index.html';
  } else {
    document.getElementById('welcome-message').innerText = `Seja bem-vindo(a), ${usuarioLogado}! 🌱`;
  }
}

function logout() {
  localStorage.removeItem('usuario');
  window.location.href = 'index.html';
}

function carregarProdutos() {
  fetch('produtos.json')
    .then(response => response.json())
    .then(data => {
      todosProdutos = data;
      exibirProdutos(todosProdutos);
      atualizarExibicaoCarrinho();
    })
    .catch(error => console.error('Erro ao carregar o catálogo de produtos:', error));
}

function exibirProdutos(produtos) {
  const grid = document.getElementById('grid-produtos');
  grid.innerHTML = '';

  if (produtos.length === 0) {
    grid.innerHTML = '<p>Nenhuma planta encontrada com esses filtros.</p>';
    return;
  }

  produtos.forEach(produto => {
    const avaliacoes = JSON.parse(localStorage.getItem(`avaliacoes_prod_${produto.id}`)) || [];
    const mediaEstrelas = calcularMediaEstrelas(avaliacoes);

    const card = document.createElement('div');
    card.className = 'card-produto';
    card.innerHTML = `
      <img src="${produto.imagem}" alt="${produto.nome}" class="img-produto">
      <h4>${produto.nome}</h4>
      <p class="descricao">${produto.descricao}</p>
      <p class="preco">R$ ${produto.preco.toFixed(2)}</p>
      <p class="codigo-barras">Código de barras: ${produto.codigoBarras}</p>
      
      <div class="avaliacao-container">
        <span>Avaliação: <strong>${mediaEstrelas} ⭐</strong> (${avaliacoes.length})</span>
        <div class="estrelas-voto">
          ${[1, 2, 3, 4, 5].map(num => `
            <button onclick="votarEstrela(${produto.id}, ${num})" class="btn-estrela">⭐ ${num}</button>
          `).join('')}
        </div>
      </div>

      <button onclick="adicionarAoCarrinho(${produto.id})" class="btn-primary">Adicionar ao Carrinho 🛒</button>
    `;
    grid.appendChild(card);
  });
}

function aplicarFiltros() {
  const nomeBusca = document.getElementById('filter-name').value.toLowerCase().trim();
  const precoMin = parseFloat(document.getElementById('filter-min-price').value) || 0;
  const precoMax = parseFloat(document.getElementById('filter-max-price').value) || Infinity;

  const produtosFiltrados = todosProdutos.filter(produto => {
    const atendeNome = produto.nome.toLowerCase().includes(nomeBusca);
    const atendePreco = produto.preco >= precoMin && produto.preco <= precoMax;
    return atendeNome && atendePreco;
  });

  exibirProdutos(produtosFiltrados);
}

function votarEstrela(produtoId, nota) {
  const chave = `avaliacoes_prod_${produtoId}`;
  const avaliacoes = JSON.parse(localStorage.getItem(chave)) || [];
  avaliacoes.push(nota);
  localStorage.setItem(chave, JSON.stringify(avaliacoes));
  
  aplicarFiltros();
}

function calcularMediaEstrelas(avaliacoes) {
  if (avaliacoes.length === 0) return 'Sem notas';
  const soma = avaliacoes.reduce((acc, curr) => acc + curr, 0);
  return (soma / avaliacoes.length).toFixed(1);
}

function adicionarAoCarrinho(produtoId) {
  const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
  carrinho.push(produtoId);
  localStorage.setItem('carrinho', JSON.stringify(carrinho));
  atualizarExibicaoCarrinho();
}

function limparCarrinho() {
  localStorage.removeItem('carrinho');
  atualizarExibicaoCarrinho();
}

function atualizarExibicaoCarrinho() {
  const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
  document.getElementById('carrinho-count').innerText = carrinho.length;

  const lista = document.getElementById('lista-carrinho');
  lista.innerHTML = '';

  carrinho.forEach(produtoId => {
    const produto = todosProdutos.find(p => p.id === produtoId);
    if (produto) {
      const item = document.createElement('li');
      item.textContent = produto.nome;
      lista.appendChild(item);
    }
  });
}