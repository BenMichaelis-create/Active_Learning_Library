let activities = [];
let selectedTags = [];

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
  filterActivities(); // Show all by default
}

function normalizeTag(tag) {
  return tag.trim().toUpperCase();
}

// Assign category only for display purposes
function assignCategory(tag) {
  const t = normalizeTag(tag);
  if (typeTags.map(normalizeTag).includes(t)) return "TYPE";
  if (genreTags.map(normalizeTag).includes(t)) return "GENRE";
  return "MISC";
}

function generateFilters() {
  const allTags = { TYPE: new Set(), GENRE: new Set(), MISC: new Set() };

  activities.forEach(a => {
    if (a.tags && Array.isArray(a.tags)) {
      a.tags.forEach(tag => {
        const category = assignCategory(tag);
        allTags[category].add(tag);
      });
    }
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
  const index = selectedTags.indexOf(tag);
  if (index > -1) {
    selectedTags.splice(index, 1);
    btn.classList.remove("selected");
  } else {
    selectedTags.push(tag);
    btn.classList.add("selected");
  }
  filterActivities();
}

function filterActivities() {
  const searchInput = document.getElementById("searchInput").value.toLowerCase();

  const filtered = activities.filter(a => {
    const matchesSearch =
      a["Activity Name"].toLowerCase().includes(searchInput) ||
      (a.tags && a.tags.some(t => t.toLowerCase().includes(searchInput)));

    const matchesTags =
      selectedTags.length === 0 || (a.tags && selectedTags.every(t => a.tags.includes(t)));

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

    // Color by first tag
    let tagColor = "#ecf0f1"; // default
    if (a.tags && a.tags.length > 0) {
      const firstTag = normalizeTag(a.tags[0]);
      if (typeTags.map(normalizeTag).includes(firstTag)) tagColor = "#fce4ec"; // pink
      else if (genreTags.map(normalizeTag).includes(firstTag)) tagColor = "#e0f7ff"; // light blue
      else tagColor = "#e0ffe0"; // green for misc
    }
    card.style.borderLeft = `6px solid ${tagColor}`;

    const title = document.createElement("h4");
    title.textContent = a["Activity Name"];
    card.appendChild(title);

    const desc = document.createElement("p");
    desc.textContent = a["Description"];
    card.appendChild(desc);

    container.appendChild(card);
  });
}

// Search triggers real-time filtering
document.getElementById("searchInput").addEventListener("input", filterActivities);

loadActivities();
