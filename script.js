// =========================================
// ELOHIM — script.js
// =========================================


// =========================================
// ESTADO
// =========================================

let carrinho = JSON.parse(localStorage.getItem("carrinhoElohim")) || [];
let avaliacoes = JSON.parse(localStorage.getItem("avaliacoesElohim")) || [];


// =========================================
// ELEMENTOS DOM
// =========================================

const listaProdutos     = document.getElementById("listaProdutos");
const listaCarrinho     = document.getElementById("listaCarrinho");
const totalCarrinhoEl   = document.getElementById("totalCarrinho");
const quantidadeBadge   = document.getElementById("quantidadeCarrinho");
const finalizarBtn      = document.getElementById("finalizarCompra");

const carrinhoDrawer    = document.getElementById("carrinhoDrawer");
const drawerOverlay     = document.getElementById("drawerOverlay");
const carrinhoBtn       = document.getElementById("carrinhoBtn");
const drawerClose       = document.getElementById("drawerClose");

const modal             = document.getElementById("modal");
const abrirModalBtn     = document.getElementById("abrirModal");
const fecharModalBtn    = document.getElementById("fecharModal");
const formulario        = document.getElementById("formulario");

const header            = document.getElementById("header");
const menuMobileBtn     = document.getElementById("menuMobileBtn");
const mobileMenu        = document.getElementById("mobileMenu");
const mobileMenuOverlay = document.getElementById("mobileMenuOverlay");
const mobileMenuClose   = document.getElementById("mobileMenuClose");


// =========================================
// PRODUTOS
// =========================================

function mostrarProdutos() {
  listaProdutos.innerHTML = "";

  produtos.forEach(produto => {
    const card = document.createElement("div");
    card.className = "produto-card";
    card.innerHTML = `
      <div class="produto-img-wrap">
        <img
          src="${produto.imagem}"
          alt="${produto.nome}"
          loading="lazy"
          onerror="this.src='https://via.placeholder.com/600x300?text=Elohim'"
        >
      </div>
      <div class="produto-info">
        <h3>${produto.nome}</h3>
        <p>${produto.descricao}</p>
        <div class="preco">
          <small>R$</small> ${produto.preco.toFixed(2).replace(".", ",")}
        </div>
        <button class="btn-principal" onclick="adicionarCarrinho(${produto.id})">
          Adicionar ao carrinho
        </button>
      </div>
    `;
    listaProdutos.appendChild(card);
  });
}


// =========================================
// CARRINHO — LÓGICA
// =========================================

function adicionarCarrinho(id) {
  const produto = produtos.find(item => item.id === id);
  if (!produto) return;

  carrinho.push(produto);
  salvarCarrinho();
  atualizarCarrinho();
  abrirDrawer();
  animarBadge();
}

function removerCarrinho(index) {
  carrinho.splice(index, 1);
  salvarCarrinho();
  atualizarCarrinho();
}

function salvarCarrinho() {
  localStorage.setItem("carrinhoElohim", JSON.stringify(carrinho));
}

function atualizarCarrinho() {
  listaCarrinho.innerHTML = "";
  let total = 0;

  if (carrinho.length === 0) {
    listaCarrinho.innerHTML = `
      <div class="carrinho-vazio">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
          <line x1="3" y1="6" x2="21" y2="6"/>
          <path d="M16 10a4 4 0 01-8 0"/>
        </svg>
        <p>Seu carrinho está vazio.</p>
        <span>Adicione peças da nossa coleção.</span>
      </div>
    `;
  } else {
    const fragment = document.createDocumentFragment();

    carrinho.forEach((produto, index) => {
      total += produto.preco;

      const item = document.createElement("div");
      item.className = "item-carrinho";
      item.innerHTML = `
        <div class="item-info">
          <strong>${produto.nome}</strong>
          <div class="item-preco">R$ ${produto.preco.toFixed(2).replace(".", ",")}</div>
        </div>
        <button class="btn-remover" onclick="removerCarrinho(${index})" aria-label="Remover ${produto.nome}">×</button>
      `;
      fragment.appendChild(item);
    });

    listaCarrinho.appendChild(fragment);
  }

  totalCarrinhoEl.textContent = total.toFixed(2).replace(".", ",");
  quantidadeBadge.textContent = carrinho.length;
}

function animarBadge() {
  quantidadeBadge.classList.remove("bump");
  void quantidadeBadge.offsetWidth; // reflow para reiniciar animação
  quantidadeBadge.classList.add("bump");
}


// =========================================
// DRAWER — ABRIR / FECHAR
// =========================================

function abrirDrawer() {
  carrinhoDrawer.classList.add("active");
  drawerOverlay.classList.add("active");
  document.body.style.overflow = "hidden";
}

function fecharDrawer() {
  carrinhoDrawer.classList.remove("active");
  drawerOverlay.classList.remove("active");
  document.body.style.overflow = "";
}

carrinhoBtn.addEventListener("click", () => {
  if (carrinhoDrawer.classList.contains("active")) {
    fecharDrawer();
  } else {
    abrirDrawer();
  }
});

drawerClose.addEventListener("click", fecharDrawer);

drawerOverlay.addEventListener("click", fecharDrawer);

document.addEventListener("keydown", e => {
  if (e.key === "Escape") {
    fecharDrawer();
    fecharModalFn();
  }
});


// =========================================
// WHATSAPP
// =========================================

finalizarBtn.addEventListener("click", () => {
  if (carrinho.length === 0) return;

  let mensagem = "Olá! Gostaria de fazer um pedido:%0A%0A";

  carrinho.forEach(produto => {
    mensagem += `• ${produto.nome} — R$ ${produto.preco.toFixed(2).replace(".", ",")}%0A`;
  });

  mensagem += `%0A*Total: R$ ${totalCarrinhoEl.textContent}*`;

  const numero = "5511950755880";
  finalizarBtn.href = `https://wa.me/${numero}?text=${mensagem}`;
});


// =========================================
// AVALIAÇÕES
// =========================================

function abrirModalFn() {
  modal.classList.add("active");
  document.body.style.overflow = "hidden";
}

function fecharModalFn() {
  modal.classList.remove("active");
  document.body.style.overflow = "";
}

abrirModalBtn.addEventListener("click", abrirModalFn);
fecharModalBtn.addEventListener("click", fecharModalFn);

modal.addEventListener("click", e => {
  if (e.target === modal) fecharModalFn();
});

formulario.addEventListener("submit", e => {
  e.preventDefault();

  const nome      = document.getElementById("nome").value.trim();
  const nota      = document.getElementById("nota").value;
  const comentario = document.getElementById("comentario").value.trim();

  if (!nome || !comentario) return;

  const avaliacao = { nome, nota, comentario };
  avaliacoes.push(avaliacao);

  localStorage.setItem("avaliacoesElohim", JSON.stringify(avaliacoes));

  formulario.reset();
  fecharModalFn();
  mostrarAvaliacoes();
});

function mostrarAvaliacoes() {
  const area = document.getElementById("listaAvaliacoes");
  area.innerHTML = "";

  if (avaliacoes.length === 0) return;

  const fragment = document.createDocumentFragment();

  avaliacoes.forEach(item => {
    const card = document.createElement("div");
    card.className = "avaliacao-card";
    card.innerHTML = `
      <h3>${escapeHtml(item.nome)}</h3>
      <div class="estrelas">${"★".repeat(Number(item.nota))}${"☆".repeat(5 - Number(item.nota))}</div>
      <p>"${escapeHtml(item.comentario)}"</p>
    `;
    fragment.appendChild(card);
  });

  area.appendChild(fragment);
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}


// =========================================
// HEADER — SCROLL + MOBILE MENU
// =========================================

window.addEventListener("scroll", () => {
  if (window.scrollY > 20) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
});

menuMobileBtn.addEventListener("click", () => {
  mobileMenu.classList.add("active");
  mobileMenuOverlay.classList.add("active");
  document.body.style.overflow = "hidden";
});

function fecharMobileMenu() {
  mobileMenu.classList.remove("active");
  mobileMenuOverlay.classList.remove("active");
  document.body.style.overflow = "";
}

mobileMenuClose.addEventListener("click", fecharMobileMenu);
mobileMenuOverlay.addEventListener("click", fecharMobileMenu);

document.querySelectorAll(".mobile-menu-link").forEach(link => {
  link.addEventListener("click", fecharMobileMenu);
});


// =========================================
// INICIALIZAÇÃO
// =========================================

mostrarProdutos();
atualizarCarrinho();
mostrarAvaliacoes();
