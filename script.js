let activities = [];
let selectedTags = new Set(); // store all selected tags

async function loadActivities() {
  const response = await fetch("activities.json");
  activities = await response.json();
  generateTagButtons();
  displayActivities(activities);
}

function generateTagButtons() {
  const allTags = new Set();

  activities.forEach(a => {
    ["TYPE", "GENRE", "Misc"].forEach(key => {
      if (a[key]) allTags.add(a[key].trim());
    });
  });

  const container = document.getElementById("tagFilters");
  allTags.forEach(tag => {
    const btn = document.createElement("button");
    btn.textContent = tag;
    btn.classList.add("filter-button");
    btn.addEventListener("click", () => {
      if (selectedTags.has(tag)) {
        selectedTags.delete(tag);
        btn.classList.remove("selected");
      } else {
        selectedTags.add(tag);
        btn.classList.add("selected");
      }
      filterActivities();
    });
    container.appendChild(btn);
  });
}

function filterActivities() {
  const searchInput = document.getElementById("searchInput").value.toLowerCase();

  const filtered = activities.filter(a => {
    const tags = ["TYPE","GENRE","Misc"].map(k => a[k].trim());
    const matchesTags = selectedTags.size === 0 || Array.from(selectedTags).every(t => tags.includes(t));
    const matchesSearch = a["Activity Name"].toLowerCase().includes(searchInput) ||
                          a["Description"].toLowerCase().includes(searchInput) ||
                          tags.some(tag => tag.toLowerCase().includes(searchInput));
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

    // Color by first tag (TYPE > GENRE > Misc)
    const firstTag = a["TYPE"] || a["GENRE"] || a["Misc"];
    card.style.backgroundColor = getTagColor(firstTag);

    const title = document.createElement("h4");
    title.textContent = a["Activity Name"];
    card.appendChild(title);

    const desc = document.createElement("p");
    desc.textContent = a["Description"];
    card.appendChild(desc);

    const tagLine = document.createElement("p");
    tagLine.textContent = ["TYPE","GENRE","Misc"].map(k => a[k]).filter(Boolean).join(" | ");
    tagLine.style.fontSize = "12px";
    tagLine.style.color = "#777";
    card.appendChild(tagLine);

    container.appendChild(card);
  });
}

function getTagColor(tag) {
  const colors = {
    "READ": "#ffe0e0",
    "VOCABULARY": "#e0f7ff",
    "WRITING": "#fff3e0",
    "CREATIVE WRITING": "#e0ffe0",
    "VISUAL ART": "#fce4ec",
    "INTRODUCE": "#fce4ec",
    "PRE-ASSESSMENT": "#fff9c4",
    "ANALYZE": "#f3e5f5",
    "EVALUATE": "#ffccbc",
    "FORMATIVE": "#c8e6c9",
    "REVIEW": "#b3e5fc",
    "SUMMATIVE": "#d1c4e9",
    "CLOSING": "#f0f4c3",
    "ON YOUR FEET": "#ffe0b2",
    "HOME WORK": "#d7ccc8",
    "GAMES": "#c5cae9",
    "ICE BREAKER": "#f8bbd0",
    "MAKING GROUPS": "#b2dfdb"
  };
  return colors[tag] || "#ecf0f1"; // default gray
}

// Search button
document.getElementById("searchButton").addEventListener("click", filterActivities);

// Optional: filter as you type
document.getElementById("searchInput").addEventListener("input", filterActivities);

loadActivities();
