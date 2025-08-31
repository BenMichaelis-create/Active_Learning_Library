// Canonical tag lists
const typeTags = [
  "OPENING", "INTRODUCE", "PRE-ASSESSMENT", "READ", "ANALYZE",
  "REVIEW", "EVALUATE", "FORMATIVE", "SUMMATIVE", "CLOSING"
];

const genreTags = [
  "READ", "VOCABULARY", "WRITING (Short)", "WRITING (creative)", "Visual Art"
];

const miscTags = [
  "On Your Feet", "Home Connection", "Games", "Ice Breaker", "Making Groups"
];

// Load JSON and normalize tags
async function loadActivities() {
  const res = await fetch("activities.json");
  const data = await res.json();

  // Normalize tags for each activity
  const normalizedData = data.map(act => normalizeActivity(act));
  createTagButtons(normalizedData);
  displayActivities(normalizedData);
}

// Normalize function
function normalizeActivity(act) {
  const type = typeTags.find(t => t.toUpperCase() === (act.TYPE || '').trim().toUpperCase()) 
               || act.TYPE?.trim() || "CLOSING";

  const genre = genreTags.find(g => g.toUpperCase() === (act.GENRE || '').trim().toUpperCase()) 
                || act.GENRE?.trim() || "";

  const misc = miscTags.find(m => m.toUpperCase() === (act.Misc || '').trim().toUpperCase()) 
               || act.Misc?.trim() || "";

  return {...act, TYPE: type, GENRE: genre, Misc: misc};
}

// Create tag buttons
function createTagButtons(activities) {
  const typeContainer = document.getElementById("typeFilters");
  const genreContainer = document.getElementById("genreFilters");
  const miscContainer = document.getElementById("miscFilters");

  // Clear existing buttons
  typeContainer.innerHTML = "<h3>Type</h3>";
  genreContainer.innerHTML = "<h3>Genre</h3>";
  miscContainer.innerHTML = "<h3>Misc</h3>";

  // Collect unique tags
  const types = new Set(activities.map(a => a.TYPE));
  const genres = new Set(activities.map(a => a.GENRE));
  const miscs = new Set(activities.map(a => a.Misc));

  types.forEach(t => addTagButton(typeContainer, t));
  genres.forEach(g => addTagButton(genreContainer, g));
  miscs.forEach(m => addTagButton(miscContainer, m));
}

// Add a single button with click behavior
function addTagButton(container, tag) {
  const btn = document.createElement("button");
  btn.textContent = tag;
  btn.classList.add("tag-button");
  btn.addEventListener("click", () => {
    btn.classList.toggle("selected");
    filterActivities();
  });
  container.appendChild(btn);
}

// Display activities
function displayActivities(activities) {
  const list = document.getElementById("activityList");
  list.innerHTML = "";

  activities.forEach(a => {
    const card = document.createElement("div");
    card.classList.add("activity-card");
    
    // Color code by TYPE for now
    card.style.borderLeft = "5px solid " + colorByTag(a.TYPE);

    const title = document.createElement("h4");
    title.textContent = a["Activity Name"];
    
    const desc = document.createElement("p");
    desc.textContent = a.Description;

    card.appendChild(title);
    card.appendChild(desc);
    list.appendChild(card);
  });
}

// Example color function
function colorByTag(tag) {
  const colors = {
    "OPENING": "#ffadad",
    "INTRODUCE": "#ffd6a5",
    "PRE-ASSESSMENT": "#fdffb6",
    "READ": "#caffbf",
    "ANALYZE": "#9bf6ff",
    "REVIEW": "#a0c4ff",
    "EVALUATE": "#bdb2ff",
    "FORMATIVE": "#ffc6ff",
    "SUMMATIVE": "#fffffc",
    "CLOSING": "#ffb5a7"
  };
  return colors[tag] || "#ddd";
}

// Filtering logic
function filterActivities() {
  const selectedTags = Array.from(document.querySelectorAll(".tag-button.selected")).map(b => b.textContent);
  const searchTerm = document.getElementById("searchInput").value.toLowerCase();

  fetch("activities.json")
    .then(res => res.json())
    .then(data => {
      const normalizedData = data.map(normalizeActivity);
      const filtered = normalizedData.filter(a => {
        const text = (a["Activity Name"] + " " + a.Description + " " + a.TYPE + " " + a.GENRE + " " + a.Misc).toLowerCase();
        const matchesSearch = searchTerm ? text.includes(searchTerm) : true;
        const matchesTags = selectedTags.every(tag => 
          a.TYPE === tag || a.GENRE === tag || a.Misc === tag
        );
        return matchesSearch && matchesTags;
      });
      displayActivities(filtered);
    });
}

// Search button
document.getElementById("searchButton").addEventListener("click", filterActivities);

// Initial load
loadActivities();

