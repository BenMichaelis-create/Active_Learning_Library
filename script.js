// script.js
let activities = [];
let selectedTags = [];

// Category definitions for display only
const typeTags = ["INTRODUCE","PRE-ASSESSMENT","READ","ANALYZE","REVIEW","EVALUATE","FORMATIVE","CLOSING"];
const genreTags = ["READ","VOCABULARY","WRITING","CREATIVE WRITING","VISUAL ART"];
const miscTags = ["ON YOUR FEET","HOME WORK","GAMES","ICE BREAKER","MAKING GROUPS"];

async function loadActivities() {
  try {
    const response = await fetch("activities.json");
    activities = await response.json();
    generateFilters();
    displayActivities(activities);
  } catch (err) {
    console.error("Error loading activities:", err);
  }
}

// Normalize tags to uppercase
function normalizeTag(tag) {
  return tag.trim().toUpperCase();
}

// Determine display category for a tag
function assignCategory(tag) {
  const t = normalizeTag(tag);
  if (typeTags.map(normalizeTag).includes(t)) return "TYPE";
  if (genreTags.map(normalizeTag).includes(t)) return "GENRE";
  return "Misc";
}

// Generate buttons for each category
function generateFilters() {
  const containerMap = {
    TYPE: document.getElementById("typeFilters"),
    GENRE: document.getElementById("genreFilters"),
    Misc: document.getElementById("miscFilters")
  };

  // Clear old buttons
  Object.values(containerMap).forEach(c => c.innerHTML = "");

  // Collect unique tags per category
  const tagsPerCategory = { TYPE: new Set(), GENRE: new Set(), Misc: new Set() };
  activities.forEach(a => {
    Object.keys(tagsPerCategory).forEach(cat => {
      if (a[cat]) tagsPerCategory[cat].add(normalizeTag(a[cat]));
    });
  });

  // Generate buttons
  Object.keys(tagsPerCategory).forEach(cat => {
    const container = containerMap[cat];
    tagsPerCategory[cat].forEach(tag => {
      const btn = document.createElement("button");
      btn.textContent = tag;
      btn.classList.add("filter-button");
      btn.addEventListener("click", () => {
        if (selectedTags.includes(tag)) {
          selectedTags.splice(selectedTags.indexOf(tag), 1);
          btn.classList.remove("selected");
        } else {
          selectedTags.push(tag);
          btn.classList.add("selected");
        }
        filterActivities();
      });
      container.appendChild(btn);
    });
  });
}

// Filter activities based on search and selected tags
function filterActivities() {
  const searchInput = document.getElementById("searchInput").value.toLowerCase();

  const filtered = activities.filter(a => {
    const matchesSearch =
      a["Activity Name"].toLowerCase().includes(searchInput) ||
      (a["TYPE"] && a["TYPE"].toLowerCase().includes(searchInput)) ||
      (a["GENRE"] && a["GENRE"].toLowerCase().includes(searchInput)) ||
      (a["Misc"] && a["Misc"].toLowerCase().includes(searchInput));

    // If no tags are selected, include all
    if (selectedTags.length === 0) return matchesSearch;

    // Otherwise, at least one selected tag must be present
    const activityTags = [
      normalizeTag(a["TYPE"] || ""),
      normalizeTag(a["GENRE"] || ""),
      normalizeTag(a["Misc"] || "")
    ];
    const matchesTags = selectedTags.every(tag => activityTags.includes(tag));

    return matchesSearch && matchesTags;
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

    // Determine first tag for color priority: TYPE > GENRE > Misc
    let colorTag = normalizeTag(a["TYPE"] || "") || normalizeTag(a["GENRE"] || "") || normalizeTag(a["Misc"] || "");
    card.style.backgroundColor = getTagColor(colorTag);

    // Title
    const title = document.createElement("h4");
    title.textContent = a["Activity Name"];
    card.appendChild(title);

    // Description
    const desc = document.createElement("p");
    desc.textContent = a["Description"];
    card.appendChild(desc);

    // Tag display
    const tagDiv = document.createElement("div");
    tagDiv.classList.add("activity-tags");
    const tags = [a["TYPE"], a["GENRE"], a["Misc"]].filter(Boolean);
    tagDiv.textContent = tags.join(" • ");
    card.appendChild(tagDiv);

    container.appendChild(card);
  });
}

// Simple color mapping for tags
function getTagColor(tag) {
  const colors = {
    "READ": "#ffe0e0",
    "VOCABULARY": "#e0f7ff",
    "WRITING": "#fff3e0",
    "CREATIVE WRITING": "#f0f4c3",
    "VISUAL ART": "#e0ffe0",
    "INTRODUCE": "#fce4ec",
    "PRE-ASSESSMENT": "#fff9c4",
    "ANALYZE": "#f3e5f5",
    "REVIEW": "#b3e5fc",
    "EVALUATE": "#ffccbc",
    "FORMATIVE": "#c8e6c9",
    "CLOSING": "#f0f4c3",
    "SUMMATIVE": "#d1c4e9"
  };
  return colors[tag] || "#ecf0f1"; // default light gray
}

// Search button event
document.getElementById("searchButton").addEventListener("click", filterActivities);

loadActivities();
