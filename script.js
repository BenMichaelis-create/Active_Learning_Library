let activities = [];
let selectedTags = [];

async function loadActivities() {
  const response = await fetch("activities.json");
  activities = await response.json();
  generateFilters();
  displayActivities(activities);
}

function normalizeTag(tag) {
  return tag.trim().toUpperCase();
}

function getAllTags() {
  const tagsSet = new Set();
  activities.forEach(a => {
    ["TYPE", "GENRE", "Misc"].forEach(key => {
      if (a[key]) tagsSet.add(a[key]);
    });
  });
  return Array.from(tagsSet);
}

function generateFilters() {
  const container = document.getElementById("tagFilters");
  const allTags = getAllTags();
  allTags.forEach(tag => {
    const btn = document.createElement("button");
    btn.textContent = tag;
    btn.classList.add("filter-button");
    btn.addEventListener("click", () => {
      const idx = selectedTags.indexOf(tag);
      if (idx > -1) {
        selectedTags.splice(idx, 1);
        btn.classList.remove("selected");
      } else {
        selectedTags.push(tag);
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
    const matchesSearch =
      a["Activity Name"].toLowerCase().includes(searchInput) ||
      (a["TYPE"] && a["TYPE"].toLowerCase().includes(searchInput)) ||
      (a["GENRE"] && a["GENRE"].toLowerCase().includes(searchInput)) ||
      (a["Misc"] && a["Misc"].toLowerCase().includes(searchInput));

    const matchesTags =
      selectedTags.length === 0 ||
      selectedTags.some(tag => [a["TYPE"], a["GENRE"], a["Misc"]].includes(tag));

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

    // Determine first tag for color
    const firstTag = a["TYPE"] || a["GENRE"] || a["Misc"];
    if (firstTag) {
      const safeClass = firstTag.toUpperCase().replace(/\s/g, "-");
      card.classList.add("card-" + safeClass);
    }

    const title = document.createElement("h4");
    title.textContent = a["Activity Name"];
    card.appendChild(title);

    const desc = document.createElement("p");
    desc.textContent = a["Description"];
    card.appendChild(desc);

    // Display tags
    const tagLine = document.createElement("div");
    tagLine.classList.add("activity-tags");
    const tags = [a["TYPE"], a["GENRE"], a["Misc"]].filter(Boolean);
    tagLine.textContent = tags.join(", ");
    card.appendChild(tagLine);

    container.appendChild(card);
  });
}

// Search input triggers
document.getElementById("searchInput").addEventListener("input", filterActivities);

loadActivities();

