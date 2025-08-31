let activities = [];
let selectedTags = new Set();

const typeTags = [
  "INTRODUCE","PRE-ASSESSMENT","READ","ANALYZE","REVIEW",
  "EVALUATE","FORMATIVE","CLOSING"
];
const genreTags = [
  "READ","VOCABULARY","WRITING","CREATIVE WRITING","VISUAL ART"
];
const miscTags = [
  "ON YOUR FEET","HOME WORK","GAMES","ICE BREAKER","MAKING GROUPS"
];

async function loadActivities() {
  const response = await fetch("activities.json");
  activities = await response.json();
  generateFilters();
  filterActivities();
}

function normalizeTag(tag) {
  return tag.trim().toUpperCase();
}

function assignCategory(tag) {
  const t = normalizeTag(tag);
  if (typeTags.map(normalizeTag).includes(t)) return "TYPE";
  if (genreTags.map(normalizeTag).includes(t)) return "GENRE";
  return "MISC";
}

function generateFilters() {
  const allTags = { TYPE: new Set(), GENRE: new Set(), MISC: new Set() };

  activities.forEach(a => {
    ["TYPE", "GENRE", "MISC"].forEach(key => {
      if (a[key]) {
        a[key].split(",").forEach(tag => {
          const category = assignCategory(tag);
          allTags[category].add(tag.trim());
        });
      }
    });
  });

  Object.keys(allTags).forEach(cat => {
    const container = document.getElementById(cat.toLowerCase() + "Filters");
    allTags[cat].forEach(tag => {
      const btn = document.createElement("button");
      btn.textContent = tag;
      btn.classList.add("filter-button");
      btn.addEventListener("click", () => toggleTag(tag, btn));
      container.appendChild(btn);
    });
  });
}

function toggleTag(tag, btn) {
  const normalized = normalizeTag(tag);
  if (selectedTags.has(normalized)) {
    selectedTags.delete(normalized);
    btn.classList.remove("selected");
  } else {
    selectedTags.add(normalized);
    btn.classList.add("selected");
  }
  filterActivities();
}

function filterActivities() {
  const searchInput = document.getElementById("searchInput").value.toLowerCase();

  const filtered = activities.filter(a => {
    const allActivityTags = [];
    ["TYPE", "GENRE", "MISC"].forEach(key => {
      if (a[key]) a[key].split(",").forEach(t => allActivityTags.push(normalizeTag(t)));
    });

    const matchesSearch =
      a["Activity Name"].toLowerCase().includes(searchInput) ||
      allActivityTags.some(t => t.includes(searchInput));

    const matchesTags =
      selectedTags.size === 0 || [...selectedTags].every(tag => allActivityTags.includes(tag));

    return matchesSearch && matchesTags;
  });

  displayActivities(filtered);
}

function displayActivities(list) {
  const container = document.getElementById("activityList");
  container.innerHTML = "";

  list.forEach(a => {
    const card = document.createElement("div");
    card.classList.add("activity-card");

    // Get first tag from TYPE > GENRE > MISC
    let firstTag = null;
    if (a["TYPE"]) firstTag = a["TYPE"].split(",")[0].trim().toUpperCase();
    else if (a["GENRE"]) firstTag = a["GENRE"].split(",")[0].trim().toUpperCase();
    else if (a["MISC"]) firstTag = a["MISC"].split(",")[0].trim().toUpperCase();

    if (firstTag) card.setAttribute("data-first-tag", firstTag);

    const title = document.createElement("h4");
    title.textContent = a["Activity Name"];
    card.appendChild(title);

    const desc = document.createElement("p");
    desc.textContent = a["Description"];
    card.appendChild(desc);

    container.appendChild(card);
  });
}

// Search input updates automatically
document.getElementById("searchInput").addEventListener("input", filterActivities);

loadActivities();
