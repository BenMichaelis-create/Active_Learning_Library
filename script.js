let activities = [];
let selectedTags = [];

const typeTags = ["INTRODUCE","PRE-ASSESSMENT","READ","ANALYZE","REVIEW","EVALUATE","FORMATIVE","CLOSING"];
const genreTags = ["READ","VOCABULARY","WRITING","CREATIVE WRITING","VISUAL ART"];
const miscTags = ["ON YOUR FEET","HOME WORK","GAMES","ICE BREAKER","MAKING GROUPS"];

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
  if (typeTags.map(normalizeTag).includes(t)) return "TYPE";
  if (genreTags.map(normalizeTag).includes(t)) return "GENRE";
  return "MISC";
}

function generateFilters() {
  const allTags = { TYPE: new Set(), GENRE: new Set(), MISC: new Set() };

  activities.forEach(a => {
    ["TYPE","GENRE","MISC"].forEach(key => {
      if (a[key]) {
        const category = assignCategory(a[key]);
        allTags[category].add(a[key]);
      }
    });
  });

  Object.keys(allTags).forEach(cat => {
    const container = document.getElementById(cat.toLowerCase() + "Filters");
    container.innerHTML = ""; // Clear any old buttons
    allTags[cat].forEach(tag => {
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
    // Search matches name or tags
    const matchesSearch =
      a["Activity Name"].toLowerCase().includes(searchInput) ||
      (a["TYPE"] && a["TYPE"].toLowerCase().includes(searchInput)) ||
      (a["GENRE"] && a["GENRE"].toLowerCase().includes(searchInput)) ||
      (a["MISC"] && a["MISC"].toLowerCase().includes(searchInput));

    // All selected tags must appear in at least one of the activity's tags
    const activityTags = [a["TYPE"], a["GENRE"], a["MISC"]].filter(Boolean).map(normalizeTag);
    const matchesTags = selectedTags.every(tag => activityTags.includes(normalizeTag(tag)));

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

    // Determine background color based on first existing tag
    let bgColor = "#ecf0f1"; // default light gray
    if (a["TYPE"]) bgColor = "#ffcccc";       // light red
    else if (a["GENRE"]) bgColor = "#cce5ff"; // light blue
    else if (a["MISC"]) bgColor = "#ccffcc";  // light green
    card.style.backgroundColor = bgColor;

    const title = document.createElement("h4");
    title.textContent = a["Activity Name"];
    card.appendChild(title);

    const desc = document.createElement("p");
    desc.textContent = a["Description"];
    card.appendChild(desc);

    // Show all tags in small light-grey text
    const tagLine = document.createElement("p");
    tagLine.style.color = "#555"; // slightly darker grey for readability
    tagLine.style.fontSize = "0.8em";
    const tags = [a["TYPE"], a["GENRE"], a["MISC"]].filter(Boolean);
    tagLine.textContent = tags.join(" • ");
    card.appendChild(tagLine);

    container.appendChild(card);
  });
}

// Search input triggers filtering as well
document.getElementById("searchInput").addEventListener("input", filterActivities);

loadActivities();
