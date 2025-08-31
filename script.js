// script.js
let activities = [];
let selectedTags = { TYPE: [], GENRE: [], MISC: [] };

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

// Normalize any string: trim, uppercase, remove accents, collapse spaces
function normalizeTag(tag) {
  if (!tag) return "";
  return tag
    .normalize("NFD")             // split accents
    .replace(/[\u0300-\u036f]/g, "") // remove accents
    .trim()
    .replace(/\s+/g, " ")         // collapse multiple spaces
    .toUpperCase();
}

// Determine category of a tag
function assignCategory(tag) {
  const t = normalizeTag(tag);
  if (typeTags.map(normalizeTag).includes(t)) return "TYPE";
  if (genreTags.map(normalizeTag).includes(t)) return "GENRE";
  return "MISC";
}

// Load activities JSON
async function loadActivities() {
  const response = await fetch("activities.json");
  activities = (await response.json()).map(a => ({
    "Activity Name": a["Activity Name"]?.trim() || "",
    "Description": a["Description"]?.trim() || "",
    "TYPE": normalizeTag(a["TYPE"]),
    "GENRE": normalizeTag(a["GENRE"]),
    "MISC": normalizeTag(a["MISC"])
  }));
  generateFilters();
  displayActivities(activities);
}

// Generate filter buttons
function generateFilters() {
  const allTags = { TYPE: new Set(), GENRE: new Set(), MISC: new Set() };

  activities.forEach(a => {
    ["TYPE", "GENRE", "MISC"].forEach(key => {
      if (a[key]) allTags[key].add(a[key]);
    });
  });

  Object.keys(allTags).forEach(cat => {
    const container = document.getElementById(cat.toLowerCase() + "Filters");
    allTags[cat].forEach(tag => {
      const btn = document.createElement("button");
      btn.textContent = tag;
      btn.classList.add("filter-button");
      btn.addEventListener("click", () => toggleTag(cat, tag, btn));
      container.appendChild(btn);
    });
  });
}

// Toggle tag selection
function toggleTag(category, tag, btn) {
  const index = selectedTags[category].indexOf(tag);
  if (index > -1) {
    selectedTags[category].splice(index, 1);
    btn.classList.remove("selected");
  } else {
    selectedTags[category].push(tag);
    btn.classList.add("selected");
  }
  filterActivities();
}

// Filter activities by search + selected tags
function filterActivities() {
  const searchInput = normalizeTag(document.getElementById("searchInput").value);

  const filtered = activities.filter(a => {
    const matchesSearch =
      normalizeTag(a["Activity Name"]).includes(searchInput) ||
      normalizeTag(a["TYPE"]).includes(searchInput) ||
      normalizeTag(a["GENRE"]).includes(searchInput) ||
      normalizeTag(a["MISC"]).includes(searchInput);

    const matchesType =
      selectedTags.TYPE.length === 0 || selectedTags.TYPE.includes(a["TYPE"]);
    const matchesGenre =
      selectedTags.GENRE.length === 0 || selectedTags.GENRE.includes(a["GENRE"]);
    const matchesMisc =
      selectedTags.MISC.length === 0 || selectedTags.MISC.includes(a["MISC"]);

    return matchesSearch && matchesType && matchesGenre && matchesMisc;
  });

  displayActivities(filtered);
}

// Display activity cards
function displayActivities(list) {
  const container = document.getElementById("activityList");
  container.innerHTML = "";

  list.forEach(a => {
    const card = document.createElement("div");
    card.classList.add("activity-card");

    // Color by primary tag
    let tagColor = "lightorange";
    if (a["TYPE"]) tagColor = "lightcoral";
    else if (a["GENRE"]) tagColor = "lightblue";
    else if (a["MISC"]) tagColor = "lightgreen";
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

// Search button
document.getElementById("searchButton").addEventListener("click", filterActivities);

loadActivities();
