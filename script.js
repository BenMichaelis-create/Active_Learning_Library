let activities = [];
let selectedTags = [];

const typeTags = ["INTRODUCE","PRE-ASSESSMENT","READ","ANALYZE","REVIEW","EVALUATE","FORMATIVE","CLOSING"];
const genreTags = ["READ","VOCABULARY","WRITING","CREATIVE WRITING","VISUAL ART"];
const miscTags = ["ON YOUR FEET","HOME WORK","GAMES","ICE BREAKER","MAKING GROUPS"];

// Load activities
async function loadActivities() {
  const response = await fetch("activities.json");
  activities = await response.json();
  generateTagButtons();
  displayActivities(activities);
}

// Normalize tag for comparison
function normalizeTag(tag) {
  return tag.trim().toUpperCase();
}

// Assign category for display only
function assignCategory(tag) {
  const t = normalizeTag(tag);
  if (typeTags.map(normalizeTag).includes(t)) return "TYPE";
  if (genreTags.map(normalizeTag).includes(t)) return "GENRE";
  return "MISC";
}

// Generate filter buttons grouped by TYPE/GENRE/MISC
function generateTagButtons() {
  const allTags = { TYPE: new Set(), GENRE: new Set(), MISC: new Set() };
  activities.forEach(a => {
    ["TYPE","GENRE","Misc"].forEach(key => {
      if(a[key]) {
        const category = assignCategory(a[key]);
        allTags[category].add(a[key]);
      }
    });
  });

  const container = document.getElementById("tagFilters");
  container.innerHTML = "";

  Object.keys(allTags).forEach(cat => {
    const groupDiv = document.createElement("div");
    groupDiv.classList.add("filter-group");
    const title = document.createElement("h3");
    title.textContent = cat.charAt(0) + cat.slice(1).toLowerCase();
    groupDiv.appendChild(title);

    allTags[cat].forEach(tag => {
      const btn = document.createElement("button");
      btn.textContent = tag;
      btn.addEventListener("click", () => toggleTag(tag, btn));
      groupDiv.appendChild(btn);
    });

    container.appendChild(groupDiv);
  });
}

// Toggle tag selection
function toggleTag(tag, btn) {
  const index = selectedTags.indexOf(tag);
  if(index > -1) {
    selectedTags.splice(index,1);
    btn.classList.remove("selected");
  } else {
    selectedTags.push(tag);
    btn.classList.add("selected");
  }
  filterActivities();
}

// Filter activities based on selected tags and search
function filterActivities() {
  const searchInput = document.getElementById("searchInput").value.toLowerCase();
  const filtered = activities.filter(a => {
    // Collect all tags
    const tags = [a["TYPE"], a["GENRE"], a["Misc"]].filter(Boolean);

    // Search match
    const matchesSearch =
      a["Activity Name"].toLowerCase().includes(searchInput) ||
      tags.some(t => t.toLowerCase().includes(searchInput));

    // Tag match
    const matchesTags = selectedTags.every(tag => tags.includes(tag));

    return matchesSearch && matchesTags;
  });

  displayActivities(filtered);
}

// Display activities as cards
function displayActivities(list) {
  const container = document.getElementById("activityList");
  container.innerHTML = "";

  list.forEach(a => {
    const card = document.createElement("div");
    card.classList.add("activity-card");

    // Determine color by first tag
    const firstTag = a["TYPE"] || a["GENRE"] || a["Misc"];
    if(firstTag) {
      const safeClass = firstTag.replace(/\s/g, "\\ ");
      card.classList.add("card-" + safeClass);
    }

    // Title
    const title = document.createElement("h4");
    title.textContent = a["Activity Name"];
    card.appendChild(title);

    // Description
    const desc = document.createElement("p");
    desc.textContent = a["Description"];
    card.appendChild(desc);

    // Tags at bottom
    const tagDiv = document.createElement("div");
    tagDiv.classList.add("tags");
    [a["TYPE"], a["GENRE"], a["Misc"]].forEach(t => {
      if(t) {
        const span = document.createElement("span");
        span.textContent = t;
        tagDiv.appendChild(span);
      }
    });
    card.appendChild(tagDiv);

    container.appendChild(card);
  });
}

// Search input
document.getElementById("searchInput").addEventListener("input", filterActivities);

// Initial load
loadActivities();
