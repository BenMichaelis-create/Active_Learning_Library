let activities = [];
let selectedTags = [];

const typeTags = ["INTRODUCE","PRE-ASSESSMENT","READ","ANALYZE","REVIEW","EVALUATE","FORMATIVE","CLOSING"];
const genreTags = ["READ","VOCABULARY","WRITING","CREATIVE WRITING","VISUAL ART"];
const miscTags = ["ON YOUR FEET","HOME WORK","GAMES","ICE BREAKER","MAKING GROUPS"];

// Color mapping for tags
const tagColors = {
  "READ": "#ffe0e0",
  "VOCABULARY": "#e0f7ff",
  "WRITING": "#fff3e0",
  "CREATIVE WRITING": "#fff3e0",
  "VISUAL ART": "#e0ffe0",
  "INTRODUCE": "#fce4ec",
  "PRE-ASSESSMENT": "#fff9c4",
  "ANALYZE": "#f3e5f5",
  "REVIEW": "#b3e5fc",
  "EVALUATE": "#ffccbc",
  "FORMATIVE": "#c8e6c9",
  "CLOSING": "#f0f4c3",
  "SUMMATIVE": "#d1c4e9",
  "ON YOUR FEET": "#f0f4c3",
  "HOME WORK": "#f9f9f9",
  "GAMES": "#fce4ec",
  "ICE BREAKER": "#e0ffe0",
  "MAKING GROUPS": "#e0f7ff"
};

async function loadActivities() {
  const response = await fetch("activities.json");
  activities = await response.json();
  generateFilters();
  displayActivities(activities);
}

function generateFilters() {
  const categories = {
    TYPE: { containerId: "typeFilters", tags: new Set() },
    GENRE: { containerId: "genreFilters", tags: new Set() },
    Misc: { containerId: "miscFilters", tags: new Set() }
  };

  activities.forEach(a => {
    for (const key in categories) {
      if (a[key]) categories[key].tags.add(a[key]);
    }
  });

  for (const key in categories) {
    const container = document.getElementById(categories[key].containerId);
    categories[key].tags.forEach(tag => {
      const btn = document.createElement("button");
      btn.textContent = tag;
      btn.classList.add("filter-button");
      btn.addEventListener("click", () => toggleTag(tag, btn));
      container.appendChild(btn);
    });
  }
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
    const allTags = [a.TYPE, a.GENRE, a.Misc].map(t => t.toUpperCase());

    const matchesTags = selectedTags.every(tag => allTags.includes(tag.toUpperCase()));
    const matchesSearch =
      a["Activity Name"].toLowerCase().includes(searchInput) ||
      a["Description"].toLowerCase().includes(searchInput) ||
      allTags.some(t => t.toLowerCase().includes(searchInput));

    return matchesTags && matchesSearch;
  });

  displayActivities(filtered);
}

function displayActivities(list) {
  const container = document.getElementById("activityList");
  container.innerHTML = "";

  list.forEach(a => {
    const card = document.createElement("div");
    card.classList.add("activity-card");

    // Use first tag to set background color
    const firstTag = a.TYPE || a.GENRE || a.Misc;
    const bgColor = tagColors[firstTag.toUpperCase()] || "#ecf0f1";
    card.style.backgroundColor = bgColor;

    const title = document.createElement("h4");
    title.textContent = a["Activity Name"];
    card.appendChild(title);

    const desc = document.createElement("p");
    desc.textContent = a["Description"];
    card.appendChild(desc);

    const tagsEl = document.createElement("p");
    tagsEl.classList.add("activity-tags");
    tagsEl.textContent = [a.TYPE, a.GENRE, a.Misc].filter(Boolean).join(", ");
    card.appendChild(tagsEl);

    container.appendChild(card);
  });
}

// Search updates on typing
document.getElementById("searchInput").addEventListener("input", filterActivities);

loadActivities();

