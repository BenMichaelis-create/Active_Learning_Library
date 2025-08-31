let activities = [];
let selectedTags = {
  type: [],
  genre: [],
  misc: []
};

// Load activities from JSON
fetch('activities.json')
  .then(response => response.json())
  .then(data => {
    // Normalize keys
    activities = data.map(a => ({
      name: a["Activity Name"],
      type: a["TYPE"],
      genre: a["GENRE"],
      tags: a["Misc"] ? [a["Misc"]] : []
    }));
    renderFilters();
    renderActivities(activities);
  });

// Render filter buttons
function renderFilters() {
  const typeFilters = ["OPENING","INTRODUCE","PRE-ASSESSMENT","READ","ANALYZE","REVIEW","EVALUATE","FORMATIVE","SUMMATIVE","CLOSING"];
  const genreFilters = ["READ","VOCABULARY","WRITING (Short)","WRITING (creative)","Visual Art"];
  const miscFilters = ["On Your Feet","Home Connection","Games","Ice Breaker","Making Groups"];

  addFilterButtons(typeFilters, "typeFilters", "type");
  addFilterButtons(genreFilters, "genreFilters", "genre");
  addFilterButtons(miscFilters, "miscFilters", "misc");
}

function addFilterButtons(filters, containerId, category) {
  const container = document.getElementById(containerId);
  filters.forEach(f => {
    const btn = document.createElement("button");
    btn.className = "filter-btn";
    btn.textContent = f;
    btn.addEventListener("click", () => {
      if (selectedTags[category].includes(f)) {
        selectedTags[category] = selectedTags[category].filter(t => t !== f);
        btn.classList.remove("active");
      } else {
        selectedTags[category].push(f);
        btn.classList.add("active");
      }
    });
    container.appendChild(btn);
  });
}

// Tag filter “Go” button
const goBtn = document.createElement("button");
goBtn.textContent = "Go";
goBtn.className = "go-btn";
goBtn.addEventListener("click", () => {
  applyFilters();
});
document.querySelector(".filters").appendChild(goBtn);

// Search button
document.getElementById("searchButton").addEventListener("click", () => {
  applyFilters();
});

// Apply filters and search
function applyFilters() {
  const searchInput = document.getElementById("searchInput").value.toLowerCase();
  let filtered = activities.filter(a => {
    // Search in name and tags
    const matchesSearch = a.name.toLowerCase().includes(searchInput) ||
      a.type.toLowerCase().includes(searchInput) ||
      a.genre.toLowerCase().includes(searchInput) ||
      a.tags.some(t => t.toLowerCase().includes(searchInput));

    // Filter by selected tags
    const matchesType = selectedTags.type.length === 0 || selectedTags.type.includes(a.type);
    const matchesGenre = selectedTags.genre.length === 0 || selectedTags.genre.includes(a.genre);
    const matchesMisc = selectedTags.misc.length === 0 || a.tags.some(t => selectedTags.misc.includes(t));

    return matchesSearch && matchesType && matchesGenre && matchesMisc;
  });

  renderActivities(filtered);
}

// Render activities
function renderActivities(list) {
  const container = document.getElementById("activityList");
  container.innerHTML = "";

  if (list.length === 0) {
    container.innerHTML = "<p>No activities found.</p>";
    return;
  }

  list.forEach(a => {
    const card = document.createElement("div");
    card.className = "activity-card";
    card.innerHTML = `
      <h3>${a.name}</h3>
      <p>${a.type} | ${a.genre} | ${a.tags.join(", ")}</p>
      <p>${a.description || ""}</p>
    `;
    container.appendChild(card);
  });
}
