let activities = [];
let selectedTags = [];
let debugStep = 0;

function debug(msg) {
  debugStep++;
  const counter = document.getElementById("debugCounter");
  if (counter) {
    counter.textContent = `Step ${debugStep}: ${msg}`;
  }
  console.log(`DEBUG ${debugStep}: ${msg}`);
}

// Tag categories for button display only
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
  debug("Starting loadActivities");
  try {
    const response = await fetch("activities.json");
    debug("Fetched activities.json");
    activities = await response.json();
    debug(`Loaded ${activities.length} activities`);
  } catch (e) {
    debug("Error loading activities.json");
    console.error(e);
    return;
  }

  generateFilters();
  displayActivities(activities);
  debug("Finished initial display");
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
  debug("Generating filters");
  const allTags = { TYPE: new Set(), GENRE: new Set(), MISC: new Set() };

  activities.forEach(a => {
    ["TYPE","GENRE","MISC"].forEach(key => {
      if (a[key]) {
        const category = assignCategory(a[key]);
        allTags[category].add(a[key]);
      }
    });
  });
  debug("Filter sets created");

  // Generate buttons
  Object.keys(allTags).forEach(cat => {
    const container = document.getElementById(cat.toLowerCase() + "Filters");
    if (!container) {
      debug(`Container for ${cat.toLowerCase()}Filters not found`);
      return;
    }
    allTags[cat].forEach(tag => {
      const btn = document.createElement("button");
      btn.textContent = tag;
      btn.classList.add("filter-button");
      btn.addEventListener("click", () => toggleTag(tag, btn));
      container.appendChild(btn);
    });
  });
  debug("Filter buttons created");
}

function toggleTag(tag, btn) {
  const index = selectedTags.indexOf(tag);
  if (index > -1) {
    selectedTags.splice(index, 1);
    btn.classList.remove("selected");
    debug(`Deselected tag: ${tag}`);
  } else {
    selectedTags.push(tag);
    btn.classList.add("selected");
    debug(`Selected tag: ${tag}`);
  }
  filterActivities();
}

function filterActivities() {
  debug("Filtering activities");
  const searchInput = document.getElementById("searchInput").value.toLowerCase();

  const filtered = activities.filter(a => {
    // Search input matches name or tags
    const matchesSearch =
      a["Activity Name"].toLowerCase().includes(searchInput) ||
      selectedTags.some(tag => 
        [a["TYPE"], a["GENRE"], a["MISC"]].some(t => t && t.toUpperCase() === tag.toUpperCase())
      );

    // Selected tags filter
    const matchesTags =
      selectedTags.length === 0 || selectedTags.some(tag =>
        [a["TYPE"], a["GENRE"], a["MISC"]].includes(tag)
      );

    return matchesSearch && matchesTags;
  });

  debug(`Filtered down to ${filtered.length} activities`);
  displayActivities(filtered);
}

function displayActivities(list) {
  debug("Displaying activities");
  const container = document.getElementById("activityList");
  container.innerHTML = "";

  list.forEach(a => {
    const card = document.createElement("div");
    card.classList.add("activity-card");

    // Determine card color by first tag in array
    let firstTag = a["TYPE"] || a["GENRE"] || a["MISC"];
    if (firstTag) {
      card.classList.add(`card-${firstTag.replace(/\s+/g, '-')}`);
    }

    const title = document.createElement("h4");
    title.textContent = a["Activity Name"];
    card.appendChild(title);

    const desc = document.createElement("p");
    desc.textContent = a["Description"];
    card.appendChild(desc);

    // Show all tags at bottom
    const tags = [a["TYPE"], a["GENRE"], a["MISC"]].filter(Boolean);
    if (tags.length > 0) {
      const tagElem = document.createElement("p");
      tagElem.textContent = tags.join(" • ");
      tagElem.style.fontSize = "0.8em";
      tagElem.style.color = "#888";
      card.appendChild(tagElem);
    }

    container.appendChild(card);
  });

  debug(`Displayed ${list.length} activities`);
}

// Search button triggers filtering
document.getElementById("searchButton").addEventListener("click", filterActivities);

// Add debug counter element
const debugDiv = document.createElement("div");
debugDiv.id = "debugCounter";
debugDiv.style.cssText = "position: fixed; top: 10px; right: 10px; background: #fff; border: 1px solid #ccc; padding: 5px 10px; font-family: monospace; z-index: 1000;";
document.body.appendChild(debugDiv);

loadActivities();
