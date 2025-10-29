/*
  MangaVerse - Client-side search prototype
  - Hooks the header search input across all pages
  - Redirects to search.html?q=...
  - On the search page, fetches manga-data.json, filters client-side, and renders results
*/
(function () {
  const DATA_URL = 'manga-data.json';
  let DATA_CACHE = null;

  // Utility shortcuts
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  function navigateToSearch(query) {
    const q = (query || '').trim();
    if (!q) return; // ignore empty
    // Always go to search.html from any page
    const base = window.location.href.replace(/[^/]+$/, '');
    window.location.href = base + 'search.html?q=' + encodeURIComponent(q);
  }

  function attachGlobalSearchHandlers() {
    const input = $('.search-input');
    const icon = $('.search-icon');
    if (!input) return;

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        navigateToSearch(input.value);
      }
    });
    if (icon) {
      icon.style.cursor = 'pointer';
      icon.setAttribute('title', 'Search');
      icon.addEventListener('click', () => navigateToSearch(input.value));
    }
  }

  function parseQuery() {
    const params = new URLSearchParams(window.location.search);
    return {
      q: params.get('q') || ''
    };
  }

  async function fetchData() {
    if (DATA_CACHE) return DATA_CACHE;
    const res = await fetch(DATA_URL, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to load manga-data.json');
    DATA_CACHE = await res.json();
    return DATA_CACHE;
  }

  function matchesQuery(manga, q) {
    const haystack = [
      manga.title,
      ...(manga.altTitles || []),
      manga.author,
      (manga.type || ''),
      (manga.status || ''),
      ...(manga.genres || [])
    ]
      .filter(Boolean)
      .join(' \u2002 ')
      .toLowerCase();

    return haystack.includes(q);
  }

  function rankScore(manga, q) {
    const t = (manga.title || '').toLowerCase();
    if (t === q) return 100;
    if (t.startsWith(q)) return 80;
    if (t.includes(q)) return 60;
    const inAlt = (manga.altTitles || []).some((a) => (a || '').toLowerCase().includes(q));
    if (inAlt) return 50;
    return 30;
  }

  function formatGenres(genres) {
    return (genres || []).slice(0, 3).join(', ');
  }

  function createCard(m) {
    const div = document.createElement('div');
    div.className = 'manga-card';
    div.innerHTML = `
      <div class="card-cover" style="background-image:url('${m.coverImage}')"></div>
      <div class="card-body">
        <div class="card-top">
          <span class="badge type">${m.type || ''}</span>
          <span class="badge status ${String(m.status || '').toLowerCase()}">${m.status || ''}</span>
        </div>
        <h3 class="card-title">${m.title}</h3>
        <div class="card-meta">
          <span class="rating">⭐ ${Number(m.rating || 0).toFixed(1)}</span>
          <span class="dot">•</span>
          <span class="genres">${formatGenres(m.genres)}</span>
        </div>
        <p class="card-desc">${m.description}</p>
        <div class="card-actions">
          <button class="read-btn">Read Now</button>
        </div>
      </div>
    `;
    return div;
  }

  async function renderSearchPage() {
    const container = document.getElementById('results-grid');
    const header = document.getElementById('results-header');
    if (!container) return; // not on search page

    // Reflect query inside header search input if present
    const { q } = parseQuery();
    const normalized = (q || '').trim();
    const searchInput = $('.search-input');
    if (searchInput && normalized) searchInput.value = normalized;

    if (!normalized) {
      container.innerHTML = `<div class="empty-state">Type a search above to find manga.</div>`;
      if (header) header.textContent = 'Search';
      return;
    }

    const qLower = normalized.toLowerCase();

    // Show a small loading state
    container.innerHTML = `<div class="loading">Searching for “${escapeHtml(normalized)}”...</div>`;
    try {
      const data = await fetchData();
      const results = data
        .filter((m) => matchesQuery(m, qLower))
        .map((m) => ({ ...m, _score: rankScore(m, qLower) }))
        .sort((a, b) => b._score - a._score || b.rating - a.rating);

      if (header) header.textContent = `Results for "${normalized}" (${results.length})`;

      if (!results.length) {
        container.innerHTML = `<div class="empty-state">No results for “${escapeHtml(normalized)}”. Try different keywords or check spelling.</div>`;
        return;
      }

      container.innerHTML = '';
      const frag = document.createDocumentFragment();
      results.forEach((m) => frag.appendChild(createCard(m)));
      container.appendChild(frag);
    } catch (err) {
      console.error(err);
      container.innerHTML = `<div class="empty-state error">Failed to fetch data. If you're opening this page directly from your file system, please run a local server and reload.</div>`;
    }
  }

  function escapeHtml(str) {
    return String(str)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;');
  }

  // ---------- Trending Page ----------
  function attachTrendingHandlers() {
    const filters = $('#trending-filters');
    const grid = $('#trending-grid');
    if (!filters || !grid) return;

    filters.addEventListener('click', (e) => {
      const btn = e.target.closest('button.filter-btn');
      if (!btn) return;
      $$('.filter-btn', filters).forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const range = btn.getAttribute('data-range') || 'week';
      renderTrending(range).catch(console.error);
    });
  }

  async function renderTrending(range = 'week') {
    const grid = $('#trending-grid');
    if (!grid) return;
    grid.innerHTML = `<div class="loading">Loading trending (${range})...</div>`;
    try {
      const data = await fetchData();
      const sorted = [...data]
        .filter((m) => m.trending && typeof m.trending[range] === 'number')
        .sort((a, b) => (b.trending[range] - a.trending[range]) || (b.views - a.views));
      const top = sorted.slice(0, 6);

      grid.innerHTML = '';
      const frag = document.createDocumentFragment();
      top.forEach((m, idx) => frag.appendChild(createTrendingItem(m, idx, range)));
      grid.appendChild(frag);
    } catch (e) {
      console.error(e);
      grid.innerHTML = `<div class="empty-state error">Failed to load trending data.</div>`;
    }
  }

  function formatViews(n) {
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
    if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
    return String(n);
  }

  function createTrendingItem(m, idx, range) {
    const rankClass = idx < 3 ? ` rank-${idx + 1}` : '';
    const div = document.createElement('div');
    div.className = 'trending-item' + rankClass;
    const genres = (m.genres || []).slice(0, 3).join(', ');
    const trendPct = Math.round(m.trending?.[range] ?? 0);
    const coverMarkup = (idx >= 3)
      ? `<div class="manga-cover placeholder-cover">
            <div class="podium-cover" style="background-image: url('${m.coverImage}')"></div>
         </div>`
      : `<div class="manga-cover" style="background-image: url('${m.coverImage}')"></div>`;

    div.innerHTML = `
      <div class="rank-badge">#${idx + 1}</div>
      ${coverMarkup}
      <div class="manga-info">
          <h3>${m.title}</h3>
          <p class="genre">${genres}</p>
          <div class="stats">
              <span class="rating">⭐ ${Number(m.rating || 0).toFixed(1)}</span>
              <span class="views">👁 ${formatViews(m.views)} views</span>
              <span class="trend">📈 +${trendPct}%</span>
          </div>
          <p class="description">${m.description}</p>
          <button class="read-btn">Read Now</button>
      </div>`;
    return div;
  }


  // ---------- Top Rated Page ----------
  function attachTopRatedHandlers() {
    const filters = $('#top-filters');
    const sortSel = $('#top-sort');
    const podium = $('#top-podium');
    const list = $('#top-rankings');
    if (!filters || !sortSel || !podium || !list) return;

    filters.addEventListener('click', (e) => {
      const btn = e.target.closest('button.filter-btn');
      if (!btn) return;
      $$('.filter-btn', filters).forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      renderTopRated().catch(console.error);
    });
    sortSel.addEventListener('change', () => renderTopRated().catch(console.error));
  }

  function getTopFilter() {
    const active = $('#top-filters .filter-btn.active');
    return active?.getAttribute('data-filter') || 'all';
  }

  function getTopSort() {
    return $('#top-sort')?.value || 'rating';
  }

  function addedWithinLastYear(dateStr) {
    if (!dateStr) return false;
    const d = new Date(dateStr);
    if (Number.isNaN(+d)) return false;
    const now = new Date();
    const yearAgo = new Date(now);
    yearAgo.setFullYear(now.getFullYear() - 1);
    return d >= yearAgo;
  }

  async function renderTopRated() {
    const podium = $('#top-podium');
    const list = $('#top-rankings');
    if (!podium || !list) return;
    podium.innerHTML = `<div class="loading">Loading top rated...</div>`;
    list.innerHTML = '';

    try {
      const data = await fetchData();
      const filter = getTopFilter();
      const sort = getTopSort();

      let arr = [...data];
      if (filter === 'manga') arr = arr.filter((m) => (m.type || '').toLowerCase() === 'manga');
      else if (filter === 'manhwa') arr = arr.filter((m) => (m.type || '').toLowerCase() === 'manhwa');
      else if (filter === 'completed') arr = arr.filter((m) => (m.status || '').toLowerCase() === 'completed');
      else if (filter === 'last-year') arr = arr.filter((m) => addedWithinLastYear(m.addedAt));

      if (sort === 'rating') arr.sort((a, b) => (b.rating - a.rating) || ((b.reviews||0)-(a.reviews||0)));
      else if (sort === 'reviews') arr.sort((a, b) => (b.reviews||0) - (a.reviews||0));
      else if (sort === 'recent') arr.sort((a, b) => new Date(b.addedAt||0) - new Date(a.addedAt||0));

      const top3 = arr.slice(0, 3);
      podium.innerHTML = '';
      podium.appendChild(buildPodium(top3));

      const rest = arr.slice(3, 3 + 10);
      list.innerHTML = '';
      rest.forEach((m, i) => list.appendChild(buildRankingItem(m, i + 4)));
    } catch (e) {
      console.error(e);
      podium.innerHTML = `<div class="empty-state error">Failed to load ratings.</div>`;
    }
  }

  function buildPodium(items) {
    const container = document.createElement('div');
    container.className = 'podium';
    const [first, second, third] = [items[0], items[1], items[2]];
    if (second) container.appendChild(buildPodiumItem(second, 'second-place', 2));
    if (first) container.appendChild(buildPodiumItem(first, 'first-place', 1));
    if (third) container.appendChild(buildPodiumItem(third, 'third-place', 3));
    return container;
  }

  function buildPodiumItem(m, placeClass, rankNum) {
    const div = document.createElement('div');
    div.className = `podium-item ${placeClass}`;
    const medal = placeClass.includes('first') ? 'gold' : placeClass.includes('second') ? 'silver' : 'bronze';
    div.innerHTML = `
      <div class="rank-medal ${medal}">${rankNum}</div>
      ${medal === 'gold' ? '<div class="crown">👑</div>' : ''}
      <div class="podium-cover" style="background-image: url('${m.coverImage}')"></div>
      <h3>${m.title}</h3>
      <div class="rating-display">
        <span class="stars">⭐⭐⭐⭐⭐</span>
        <span class="rating-num">${Number(m.rating||0).toFixed(1)}</span>
        <span class="review-count">(${formatNumber(m.reviews||0)} reviews)</span>
      </div>
      <div class="genre-tags">${(m.genres||[]).slice(0,2).map(g=>`<span class="tag">${g}</span>`).join('')}</div>
    `;
    return div;
  }

  function formatNumber(n) {
    return new Intl.NumberFormat().format(n);
  }

  function buildRankingItem(m, rankNum) {
    const div = document.createElement('div');
    div.className = 'ranking-item';
    div.innerHTML = `
      <div class="rank-number">${rankNum}</div>
      <div class="podium-cover" style="background-image: url('${m.coverImage}')"></div>
      <div class="manga-details">
        <h3>${m.title}</h3>
        <p class="description">${m.description}</p>
        <div class="genres">${(m.genres||[]).slice(0,3).map(g=>`<span class="genre-tag">${g}</span>`).join('')}</div>
        <div class="manga-stats">
          <span class="status ${String(m.status||'').toLowerCase()}">${m.status||''}</span>
          <span class="chapters">${m.chapters || '?'} Chapters</span>
          <span class="year">${m.year || ''}</span>
        </div>
      </div>
      <div class="rating-column">
        <div class="rating-score">${Number(m.rating||0).toFixed(1)}</div>
        <div class="rating-stars">⭐⭐⭐⭐⭐</div>
        <div class="total-reviews">${formatNumber(m.reviews||0)} reviews</div>
      </div>
    `;
    return div;
  }

  // Init on every page
  document.addEventListener('DOMContentLoaded', () => {
    attachGlobalSearchHandlers();
    renderSearchPage();
    attachTrendingHandlers();
    // Initial renders if present
    if (document.getElementById('trending-grid')) {
      const active = document.querySelector('#trending-filters .filter-btn.active');
      const range = active?.getAttribute('data-range') || 'week';
      renderTrending(range);
    }
    attachTopRatedHandlers();
    if (document.getElementById('top-podium')) {
      renderTopRated();
    }
  });
})();
