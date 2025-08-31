let activities = [];
let selectedTags = new Set();

const TYPE_TAGS = ["OPENING", "INTRODUCE", "PRE-ASSESSMENT", "READ", "ANALYZE", "REVIEW", "EVALUATE", "FORMATIVE", "SUMMATIVE", "CLOSING"];
const GENRE_TAGS = ["READ", "VOCABULARY", "WRITING (Short)", "WRITING (creative)", "Visual Art"];
const MISC_TAGS = ["On Your Feet", "Home Connection", "Games", "Ice Breaker", "Making Groups"];

async function loadActivities() {
  try {
    const res = await fetch("activities.json");
    activities = await res.json();
    buildFilters();
    displayActivities(activities);
  } catch (err) {
    console.error("Error loading activities:", err);
  }
}

function buildFilters() {
  const typeDiv = document.getElementById("typeFilters");
  const genreDiv = document.getElementById("genreFilters");
  const miscDiv = document.getElementById("miscFilters");

  const allTags = new Set(activities.flatMap(a => a.tags));

  function makeTile(tag, container) {
    const tile = document.createElement("div");
    tile.className = "filter-tile";
    tile.textContent = tag;
    tile.addEventListener("click", () => {
      tile.classList.toggle("selected");
      if (selectedTags.has(tag)) {
        selectedTags.delete(tag);
      } else {
        selectedTags.add(tag);
      }
    });
    container.appendChild(tile);
  }

  TYPE_TAGS.forEach(tag => makeTile(tag, typeDiv));
  GENRE_TAGS.forEach(tag => makeTile(tag, genreDiv));
  MISC_TAGS.forEach(tag => makeTile(tag, miscDiv));

  // Put any leftover tags into Misc
  allTags.forEach(tag => {
    if (![...TYPE_TAGS, ...GENRE_TAGS, ...MISC_TAGS].includes(tag)) {
      makeTile(tag, miscDiv);
    }
  });
}

function displayActivities(list) {
  const container = document.getElementById("activityList");
  container.innerHTML = "";

  if (list.length === 0) {
    container.innerHTML = "<p>No activities found.</p>";
    return;
  }

  list.forEach(activity => {
    const card = document.createElement("div");
    card.className = "activity-card";
    card.innerHTML = `<h3>${activity.name}</h3><p>${activity.description}</p>`;
    container.appendChild(card);
  });
}

function applySearch() {
  const query = document.getElementById("searchInput").value.toLowerCase();
  const filtered = activities.filter(a =>
    a.name.toLowerCase().includes(query) ||
    a.tags.some(t => t.toLowerCase().includes(query))
  );
  displayActivities(filtered);
}

function applyFilters() {
  const filtered = activities.filter(a =>
    [...selectedTags].every(tag => a.tags.includes(tag))
  );
  displayActivities(filtered);
}

document.getElementById("searchButton").addEventListener("click", applySearch);
document.getElementById("filterButton").addEventListener("click", applyFilters);

loadActivities();
