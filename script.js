let activities = [];
let selectedTags = []; // just a flat array of tags for filtering

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

// Mapping of all tags to their category for button display
const allTagCategories = {
  TYPE: typeTags,
  GENRE: genreTags,
  MISC: miscTags
};

async function loadActivities() {
  const response = await fetch("activities.json");
  activities = await response.json();
  generateFilters();
  displayActivities(activities);
}

function normalizeTag(tag) {
  return tag.trim().toUpperCase();
}

// Generate filter buttons grouped by TYPE/GENRE/MISC
function generateFilters() {
  const container = document.getElementById("tagFilters");
  container.innerHTML = "";

  Object.keys(allTagCategories).forEach(category => {
    const groupDiv = document.createElement("div");
    groupDiv.classList.add("filter-group");

    const heading = document.createElement("h4");
    heading.textContent = category;
    groupDiv.appendChild(heading);

    allTagCategories[category].forEach(tag => {
      const btn = document.createElement("button");
      btn.textContent = tag;
      btn.addEventListener("click", () => toggleTag(tag, btn));
      groupDiv.appendChild(btn);
    });

    container.appendChild(groupDiv);
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
    // Check search box matches
    const matchesSearch =
      a["Activity Name"].toLowerCase().includes(searchInput) ||
      (a["TYPE"] && a["TYPE"].toLowerCase().includes(searchInput)) ||
      (a["GENRE"] && a["GENRE"].toLowerCase().includes(searchInput)) ||
      (a["Misc"] && a["Misc"].toLowerCase().includes(searchInput));

    // Check tags
    const activityTags = [
      a["TYPE"],
      a["GENRE"],
      a["Misc"]
    ].map(normalizeTag);

    const matchesTags =
      selectedTags.length === 0 || selectedTags.every(t => activityTags.includes(normalizeTag(t)));

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

    // Determine first tag in array for color
    const firstTag = a["TYPE"] || a["GENRE"] || a["Misc"];
    const tagClass = `card-${firstTag.replace(/\s+/g, '-')}`;
    card.classList.add(tagClass);

    const title = document.createElement("h4");
    title.textContent = a["Activity Name"];
    card.appendChild(title);

    const desc = document.createElement("p");
    desc.textContent = a["Description"];
    card.appendChild(desc);

    // Display tags at bottom
    const tagLine = document.createElement("p");
    tagLine.textContent = `${a["TYPE"]}, ${a["GENRE"]}, ${a["Misc"]}`;
    tagLine.style.fontSize = "12px";
    tagLine.style.color = "#777";
    card.appendChild(tagLine);

    container.appendChild(card);
  });
}

// Search filters on typing
document.getElementById("searchInput").addEventListener("input", filterActivities);

// Initial load
loadActivities();
