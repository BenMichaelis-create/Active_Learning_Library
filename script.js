// script.js
let activities = [];
let selectedTags = { Type: [], Genre: [], Misc: [] };

const typeTags = [
  "OPENING","INTRODUCE","PRE-ASSESSMENT","READ","ANALYZE","REVIEW",
  "EVALUATE","FORMATIVE","SUMMATIVE","CLOSING"
];
const genreTags = [
  "READ","VOCABULARY","WRITING (Short)","WRITING (creative)","Visual Art"
];
const miscTags = [
  "On Your Feet","Home Connection","Games","Ice Breaker","Making Groups"
];

async function loadActivities() {
  const response = await fetch("activities.json");
  activities = await response.json();
  generateFilters();
  displayActivities(activities);
}

function normalizeTag(tag) {
  return tag.trim().toUpperCase();
}

function assignCategory(tag) {
  const t = normalizeTag(tag);
  if (typeTags.map(normalizeTag).includes(t)) return "Type";
  if (genreTags.map(normalizeTag).includes(t)) return "Genre";
  return "Misc";
}

function generateFilters() {
  const allTags = { Type: new Set(), Genre: new Set(), Misc: new Set() };

  activities.forEach(a => {
    ["TYPE","GENRE","Misc"].forEach(key => {
      if (a[key]) {
        const category = assignCategory(a[key]);
        allTags[category].add(a[key]);
      }
    });
  });

  // Generate buttons
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

function filterActivities() {
  const searchInput = document.getElementById("searchInput").value.toLowerCase();

  const filtered = activities.filter(a => {
    const matchesSearch =
      a["Activity Name"].toLowerCase().includes(searchInput) ||
      (a["TYPE"] && a["TYPE"].toLowerCase().includes(searchInput)) ||
      (a["GENRE"] && a["GENRE"].toLowerCase().includes(searchInput)) ||
      (a["Misc"] && a["Misc"].toLowerCase().includes(searchInput));

    const matchesType =
      selectedTags.Type.length === 0 || selectedTags.Type.includes(a["TYPE"]);
    const matchesGenre =
      selectedTags.Genre.length === 0 || selectedTags.Genre.includes(a["GENRE"]);
    const matchesMisc =
      selectedTags.Misc.length === 0 || selectedTags.Misc.includes(a["Misc"]);

    return matchesSearch && matchesType && matchesGenre && matchesMisc;
  });

  displayActivities(filtered);
}

function displayActivities(list) {
  const container = document.getElementById("activityList");
  container.innerHTML = "";

  list.forEach(a => {
    const card = document.createElement("div");
    card.classList.add("activity-card");

    // Assign color by most prominent tag (Type > Genre > Misc)
    let tagColor = "lightgray";
    if (a["TYPE"]) tagColor = "lightcoral";
    else if (a["GENRE"]) tagColor = "lightblue";
    else if (a["Misc"]) tagColor = "lightgreen";
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
