// --- CONFIGURAÇÃO INICIAL ---
let currentOffset = 0; // Controla quantos posts já foram carregados
let currentFilter = ''; // Guarda o filtro atual para o "Carregar Mais"

document.addEventListener('DOMContentLoaded', () => {
    fetchPosts();  // Busca os primeiros 12 posts
    initSidebar(); 
    initSearch();  
});

// --- 1. BUSCAR E RENDERIZAR POSTS (ATUALIZADO COM PAGINAÇÃO) ---
async function fetchPosts(filter = '', isLoadMore = false) {
    const contentArea = document.getElementById('content-area');
    
    // Se não for "carregar mais", limpa a tela e reseta o contador
    if (!isLoadMore) {
        contentArea.innerHTML = '<div class="loading">Carregando tendências exclusivas...</div>';
        currentOffset = 0;
        currentFilter = filter;
    }

    try {
        // Monta a URL com category e offset para o banco de dados
        let url = `/api/posts?offset=${currentOffset}`;
        if (filter) {
            url += `&category=${encodeURIComponent(filter)}`;
        }

        const response = await fetch(url);
        const posts = await response.json();

        // Remove o indicador de "carregando" na primeira carga
        if (!isLoadMore) contentArea.innerHTML = '';

        if (posts.length === 0) {
            if (!isLoadMore) {
                contentArea.innerHTML = '<p class="no-posts">Nenhum conteúdo encontrado para esta categoria.</p>';
            } else {
                // Remove o botão "Ver Mais" se não houver mais posts
                const btn = document.getElementById('load-more-btn');
                if (btn) btn.remove();
            }
            return;
        }

        posts.forEach(post => {
            const gallery = post.gallery_images;
            const postHTML = `
                <article class="post-card">
                    <div class="post-header">
                        <h1 class="post-title">${post.title}</h1>
                        <p class="post-subtitle">${post.subtitle}</p>
                    </div>

                    <div class="img-container-central">
                        <img src="${gallery[0]}" alt="${post.title}" class="main-img">
                    </div>

                    <div class="post-description">
                        <p>${post.content}</p>
                        <p>A moda feminina em 2026 pede audácia. Esta peça foi selecionada para garantir que você não apenas vista uma roupa, mas exale uma aura de poder e sedução em qualquer ambiente.</p>
                    </div>

                    <div class="split-section">
                        <img src="${gallery[1]}" alt="Detalhe Angulo 1">
                        <div class="text-box">
                            <h3>Design e Curvas</h3>
                            <p>O corte anatômico foi projetado para elevar a silhueta, focando no conforto sem abrir mão da estética provocante que o estilo exige.</p>
                        </div>
                    </div>

                    <div class="split-section reverse">
                        <img src="${gallery[2]}" alt="Detalhe Angulo 2">
                        <div class="text-box">
                            <h3>Dica de Ousadia</h3>
                            <p>Para um impacto visual inesquecível, combine com acessórios minimalistas. Deixe que a peça seja a protagonista absoluta do seu visual.</p>
                        </div>
                    </div>

                    <div class="slider-container">
                        <div class="slider-controls">
                            <button class="prev" onclick="handleSlider(this, -1)">&#10094;</button>
                            <button class="next" onclick="handleSlider(this, 1)">&#10095;</button>
                        </div>
                        <img src="${gallery[0]}" 
                             class="slider-img active" 
                             data-images='${JSON.stringify(gallery)}' 
                             data-current="0"
                             style="display: block;"> 
                        <p class="carousel-counter">Confira todos os 4 ângulos exclusivos</p>
                    </div>

                    <div class="ads-space">
                        <span>Espaço para Google Adsense</span>
                    </div>
                </article>
                <hr style="border: 0; height: 1px; background: #eee; margin: 50px 0;">
            `;
            contentArea.insertAdjacentHTML('beforeend', postHTML);
        });

        // Atualiza o offset para a próxima busca
        currentOffset += posts.length;

        // Gerencia o botão "Ver Mais"
        renderLoadMoreButton(posts.length);

    } catch (err) {
        contentArea.innerHTML = '<p>Erro ao conectar com o banco de dados.</p>';
        console.error("Erro:", err);
    }
}

// Função auxiliar para o botão de carregar mais
function renderLoadMoreButton(loadedCount) {
    let btn = document.getElementById('load-more-btn');
    
    // Se carregou 12, pode ser que existam mais no banco
    if (loadedCount === 9) {
        if (!btn) {
            btn = document.createElement('button');
            btn.id = 'load-more-btn';
            btn.innerText = 'Ver Mais Tendências';
            btn.className = 'load-more-style'; // Adicione este estilo ao seu CSS
            btn.onclick = () => fetchPosts(currentFilter, true);
            document.getElementById('content-area').after(btn);
        }
    } else {
        // Se carregou menos que 12, significa que acabaram os posts
        if (btn) btn.remove();
    }
}

// --- 2. LÓGICA DO SIDEBAR ---
function initSidebar() {
    const items = document.querySelectorAll('.cat-item');
    items.forEach(item => {
        const titleArea = item.querySelector('.cat-title');
        titleArea.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            items.forEach(i => i.classList.remove('active'));

            if (!isActive) {
                item.classList.add('active');
                fetchPosts(item.getAttribute('data-category'));
            } else {
                fetchPosts(); 
            }
        });
    });
}

// --- 3. LÓGICA DE PESQUISA ---
function initSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    if (!searchInput || !searchBtn) return;

    const performSearch = () => {
        const termo = searchInput.value.trim();
        fetchPosts(termo);
    };

    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') performSearch();
    });
}

// --- 4. LÓGICA DO CARROSSEL ---
function handleSlider(btn, direction) {
    const container = btn.closest('.slider-container');
    const imgTag = container.querySelector('.slider-img');
    const gallery = JSON.parse(imgTag.getAttribute('data-images'));
    let currentIndex = parseInt(imgTag.getAttribute('data-current'));

    currentIndex += direction;
    if (currentIndex >= gallery.length) currentIndex = 0;
    if (currentIndex < 0) currentIndex = gallery.length - 1;

    imgTag.style.opacity = '0';
    setTimeout(() => {
        imgTag.src = gallery[currentIndex];
        imgTag.setAttribute('data-current', currentIndex);
        imgTag.style.opacity = '1';
    }, 200);
}

// --- FUNÇÕES DE PÁGINAS ESTÁTICAS ---
function showAbout() {
    const btn = document.getElementById('load-more-btn'); if(btn) btn.remove();
    const contentArea = document.getElementById('content-area');
    contentArea.innerHTML = `
        <article class="post-card about-section">
            <h1 class="post-title">Onde a Ousadia Encontra a Sofisticação</h1>
            <p class="post-subtitle">Nossa missão é despertar a mulher poderosa, segura e irresistível que existe em você.</p>
            <div style="display: flex; justify-content: center; margin: 30px 0;">
                <div class="logo" style="font-size: 32px;">Fashion<span>Dicas</span></div>
            </div>
            <div class="post-description">
                <p>O <strong>Fashion Dicas</strong> não é apenas um portal de moda; é um manifesto de liberdade.</p>
                <p>Nossa curadoria é pensada para a mulher contemporânea que não tem medo de transitar entre a elegância clássica e a sensualidade provocante.</p>
            </div>
        </article>
    `;
}

function showDicas() {
    const btn = document.getElementById('load-more-btn'); if(btn) btn.remove();
    const contentArea = document.getElementById('content-area');
    contentArea.innerHTML = `
        <article class="post-card">
            <h1 class="post-title">Guia de Estilo & Sedução</h1>
            <div class="split-section">
                <img src="https://cdn.pixabay.com/photo/2017/08/10/03/47/guy-2617866_1280.jpg" alt="Dica">
                <div class="text-box">
                    <h3>1. O Poder do Contraste</h3>
                    <p>Combine peças pesadas com lingeries delicadas.</p>
                </div>
            </div>
        </article>
    `;
}