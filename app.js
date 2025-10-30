let data = [];

// Load data from JSON
fetch("./manga-data.json")
  .then(res => res.json())
  .then(json => {
    data = json;
    console.log("Data loaded!");
    showTrending();
    showTopRated();
    doSearch();
  })
  .catch(err => console.log("Error loading data:", err));

// Search elements
const searchInput = document.querySelector(".search-input");
const searchIcon = document.querySelector(".search-icon");

// Search input key listener
if (searchInput) {
  searchInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      goToSearch();
    }
  });
}

// Search icon click listener
if (searchIcon) {
  searchIcon.addEventListener("click", function () {
    goToSearch();
  });
}

// Redirect to search page
function goToSearch() {
  const q = searchInput.value.trim();
  if (q === "") return;
  window.location.href = "search.html?q=" + encodeURIComponent(q);
}

// Perform search (on search.html)
function doSearch() {
  const container = document.getElementById("results-grid");
  const header = document.getElementById("results-header");
  if (!container) return; // Not on search page

  const params = new URLSearchParams(window.location.search);
  let q = params.get("q");
  if (!q) {
    container.innerHTML = "<div class='empty-state'>Type something to search.</div>";
    if (header) header.textContent = "Search";
    return;
  }

  q = q.trim().toLowerCase();
  if (searchInput) searchInput.value = q;

  container.innerHTML = "<div class='loading'>Searching...</div>";

  const found = data.filter(m => {
    const text = (
      m.title + " " +
      (m.altTitles || []).join(" ") + " " +
      (m.author || "") + " " +
      (m.type || "") + " " +
      (m.status || "") + " " +
      (m.genres || []).join(" ")
    ).toLowerCase();
    return text.includes(q);
  });

  if (header) header.textContent = `Results for "${q}" (${found.length})`;

  if (found.length === 0) {
    container.innerHTML = "<div class='empty-state'>No results found.</div>";
    return;
  }

  container.innerHTML = "";
  found.forEach(m => {
    const div = document.createElement("div");
    div.className = "manga-card";
    div.innerHTML = `
      <div class="card-cover" style="background-image:url('${m.coverImage}')"></div>
      <div class="card-body">
        <h3>${m.title}</h3>
        <p>${m.description || ""}</p>
        <div class="genres">${(m.genres || []).slice(0, 3).join(", ")}</div>
        <button class="read-btn">Read Now</button>
      </div>
    `;
    container.appendChild(div);
  });
}

// Show trending section (on index.html)
function showTrending() {
  const grid = document.getElementById("trending-grid");
  if (!grid) return;

  grid.innerHTML = "<div class='loading'>Loading trending...</div>";

  const trending = data
    .filter(m => m.trending && m.trending.week)
    .sort((a, b) => b.trending.week - a.trending.week)
    .slice(0, 6);

  grid.innerHTML = "";
  trending.forEach((m, i) => {
    const div = document.createElement("div");
    div.className = "trending-item";
    div.innerHTML = `
      <div class="rank-badge">#${i + 1}</div>
      <div class="manga-cover" style="background-image:url('${m.coverImage}')"></div>
      <div class="manga-info">
        <h3>${m.title}</h3>
        <p>${(m.genres || []).slice(0, 3).join(", ")}</p>
        <span>⭐ ${m.rating}</span>
      </div>
    `;
    grid.appendChild(div);
  });
}

// Show top-rated section (on index.html)
function showTopRated() {
  const podium = document.getElementById("top-podium");
  const list = document.getElementById("top-rankings");
  if (!podium || !list) return;

  podium.innerHTML = "<div class='loading'>Loading top rated...</div>";
  list.innerHTML = "";

  const sorted = [...data].sort((a, b) => b.rating - a.rating);
  const top3 = sorted.slice(0, 3);
  const rest = sorted.slice(3, 13);

  podium.innerHTML = "";
  top3.forEach((m, i) => {
    const div = document.createElement("div");
    div.className = "podium-item";
    div.innerHTML = `
      <div class="rank-medal">${i + 1}</div>
      <div class="podium-cover" style="background-image:url('${m.coverImage}')"></div>
      <h3>${m.title}</h3>
      <p>${m.rating}</p>
    `;
    podium.appendChild(div);
  });

  rest.forEach((m, i) => {
    const div = document.createElement("div");
    div.className = "ranking-item";
    div.innerHTML = `
      <div class="rank-number">${i + 4}</div>
      <div class="manga-details">
        <h3>${m.title}</h3>
        <p>${m.description || ""}</p>
        <p>${(m.genres || []).slice(0, 3).join(", ")}</p>
      </div>
      <div class="rating">${m.rating}</div>
    `;
    list.appendChild(div);
  });
}
