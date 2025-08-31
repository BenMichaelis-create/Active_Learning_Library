const typeTags = [
  "OPENING","INTRODUCE","PRE-ASSESSMENT","READ",
  "ANALYZE","REVIEW","EVALUATE","FORMATIVE",
  "SUMMATIVE","CLOSING"
];
const genreTags = [
  "READ","VOCABULARY","WRITING (Short)",
  "WRITING (creative)","Visual Art"
];
const miscTags = [
  "On Your Feet","Home Connection",
  "Games","Ice Breaker","Making Groups"
];

let allActivities = [];

// Load JSON
async function loadActivities() {
  const res = await fetch("activities.json");
  allActivities = await res.json();
  buildFilters();
  renderActivities(allActivities);
}

// Build filters
function buildFilters() {
  const typeContainer = document.getElementById("typeFilters");
  const genreContainer = document.getElementById("genreFilters");
  const miscContainer = document.getElementById("miscFilters");

  function makeCheckbox(tag, container, category) {
    const id = `${category}-${tag}`;
    const div = document.createElement("div");
    div.classList.add("checkbox-item");
    div.innerHTML = `
      <input type="checkbox" id="${id}" value="${tag}" data-category="${category}">
      <label for="${id}">${tag}</label>
    `;
    container.appendChild(div);
  }

  typeTags.forEach(tag => makeCheckbox(tag, typeContainer, "type"));
  genreTags.forEach(tag => makeCheckbox(tag, genreContainer, "genre"));

  // misc = fixed + auto-fill from json
  const extraTags = new Set();
  allActivities.forEach(a => {
    if (a.tags) {
      a.tags.forEach(tag => {
        if (![...typeTags, ...genreTags, ...miscTags].includes(tag)) {
          extraTags.add(tag);
        }
      });
    }
  });

  [...miscTags, ...extraTags].forEach(tag => makeCheckbox(tag, miscContainer, "misc"));
}

// Apply filters + search
function filterActivities() {
  const searchValue = document.getElementById("searchInput").value.toLowerCase().trim();

  // Collect selected filters
  const checkedBoxes = [...document.querySelectorAll(".filters input:checked")];
  const selectedTags = checkedBoxes.map(cb => cb.value);

  const filtered = allActivities.filter(a => {
    const activityTags = a.tags || [];

    // Must include ALL selected tags (AND logic)
    const hasAllTags = selectedTags.every(tag => activityTags.includes(tag));

    // Search match in name, description, or tags
    const matchesSearch =
      a.name.toLowerCase().includes(searchValue) ||
      (a.description && a.description.toLowerCase().includes(searchValue)) ||
      activityTags.some(tag => tag.toLowerCase().includes(searchValue));

    return hasAllTags && (searchValue === "" || matchesSearch);
  });

  renderActivities(filtered);
}

// Render activity cards
function renderActivities(list) {
  const container = document.getElementById("activityList");
  container.innerHTML = "";

  if (list.length === 0) {
    container.innerHTML = "<p>No activities found.</p>";
    return;
  }

  list.forEach(a => {
    const card = document.createElement("div");
    card.classList.add("activity-card");

    const tagsHtml = (a.tags || [])
      .map(tag => `<span class="tag">${tag}</span>`)
      .join(" ");

    card.innerHTML = `
      <h4>${a.name}</h4>
      <p>${a.description || ""}</p>
      <div class="tags">${tagsHtml}</div>
    `;

    container.appendChild(card);
  });
}

// Listeners
document.getElementById("searchButton").addEventListener("click", filterActivities);
document.querySelectorAll(".filters").forEach(group => {
  group.addEventListener("change", filterActivities);
});

// Start
loadActivities();
