let activities = [];
let selectedTags = [];

// Tag categories for display purposes only
const typeTags = ["INTRODUCE","PRE-ASSESSMENT","READ","ANALYZE","REVIEW","EVALUATE","FORMATIVE","CLOSING"];
const genreTags = ["READ","VOCABULARY","WRITING","CREATIVE WRITING","VISUAL ART"];
const miscTags = ["ON YOUR FEET","HOME WORK","GAMES","ICE BREAKER","MAKING GROUPS"];

// Map tags to colors
const tagColors = {
  "INTRODUCE":"#fce4ec","PRE-ASSESSMENT":"#fff9c4","READ":"#ffe0e0","ANALYZE":"#f3e5f5",
  "REVIEW":"#b3e5fc","EVALUATE":"#ffccbc","FORMATIVE":"#c8e6c9","CLOSING":"#f0f4c3",
  "VOCABULARY":"#e0f7ff","WRITING":"#fff3e0","CREATIVE WRITING":"#fff8e1","VISUAL ART":"#e0ffe0",
  "ON YOUR FEET":"#ffdede","HOME WORK":"#deffe0","GAMES":"#e0deff","ICE BREAKER":"#fff0de","MAKING GROUPS":"#f0e0ff"
};

// Utility to normalize tags
function normalizeTag(tag) {
  return tag ? tag.trim().toUpperCase() : "";
}

// Load activities and initialize filters
async function loadActivities() {
  const response = await fetch("activities.json");
  activities = await response.json();
  generateFilters();
  displayActivities(activities);
}

// Generate filter buttons under categories
function generateFilters() {
  const categories = {TYPE:typeTags, GENRE:genreTags, MISC:miscTags};
  const container = document.getElementById("tagFilters");
  container.innerHTML = "";

  Object.keys(categories).forEach(cat => {
    const heading = document.createElement("h4");
    heading.textContent = cat;
    container.appendChild(heading);

    categories[cat].forEach(tag => {
      const btn = document.createElement("button");
      btn.textContent = tag;
      btn.classList.add("filter-button");
      btn.addEventListener("click", () => {
        toggleTag(tag, btn);
      });
      container.appendChild(btn);
    });
  });
}

// Toggle tag selection
function toggleTag(tag, btn) {
  const i = selectedTags.indexOf(tag);
  if (i > -1) {
    selectedTags.splice(i,1);
    btn.classList.remove("selected");
  } else {
    selectedTags.push(tag);
    btn.classList.add("selected");
  }
  filterActivities();
}

// Filter activities based on search input and selected tags
function filterActivities() {
  const searchInput = document.getElementById("searchInput").value.trim().toUpperCase();

  const filtered = activities.filter(a => {
    const activityTags = [
      normalizeTag(a["TYPE"]),
      normalizeTag(a["GENRE"]),
      normalizeTag(a["Misc"])
    ];

    // Matches search input in name or any tag
    const matchesSearch = a["Activity Name"].toUpperCase().includes(searchInput) ||
      activityTags.some(tag => tag.includes(searchInput));

    // Matches all selected tags
    const matchesTags = selectedTags.every(tag => activityTags.includes(tag));

    return matchesSearch && matchesTags;
  });

  displayActivities(filtered);
}

// Display activities
function displayActivities(list) {
  const container = document.getElementById("activityList");
  container.innerHTML = "";

  list.forEach(a => {
    const card = document.createElement("div");
    card.classList.add("activity-card");

    // Determine color from first non-empty tag
    const firstTag = [a["TYPE"], a["GENRE"], a["Misc"]].find(t => t);
    const color = tagColors[normalizeTag(firstTag)] || "#ecf0f1";
    card.style.backgroundColor = color;

    const title = document.createElement("h4");
    title.textContent = a["Activity Name"];
    card.appendChild(title);

    const desc = document.createElement("p");
    desc.textContent = a["Description"];
    card.appendChild(desc);

    const tagsDiv = document.createElement("div");
    tagsDiv.classList.add("activity-tags");
    const tagList = [a["TYPE"], a["GENRE"], a["Misc"]].filter(t=>t);
    tagsDiv.textContent = tagList.join(" | ");
    card.appendChild(tagsDiv);

    container.appendChild(card);
  });
}

// Event listeners
document.getElementById("searchButton").addEventListener("click", filterActivities);
document.getElementById("searchInput").addEventListener("input", filterActivities);

loadActivities();

