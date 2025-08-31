let activities = [];
let selectedTags = new Set(); // Single set for all tags

async function loadActivities() {
  const response = await fetch("activities.json");
  activities = await response.json();

  // Normalize tags in each activity
  activities.forEach(a => {
    a.Tags = [];
    if (a.TYPE) a.Tags.push(a.TYPE.toUpperCase());
    if (a.GENRE) a.Tags.push(a.GENRE.toUpperCase());
    if (a.MISC) a.Tags.push(a.MISC.toUpperCase());
  });

  generateFilters();
  filterActivities();
}

function generateFilters() {
  const allTags = new Set();

  activities.forEach(a => a.Tags.forEach(tag => allTags.add(tag)));

  const container = document.getElementById("tagFilters");
  container.innerHTML = ""; // Clear any existing buttons

  allTags.forEach(tag => {
    const btn = document.createElement("button");
    btn.textContent = tag;
    btn.classList.add("filter-button");
    btn.addEventListener("click", () => toggleTag(tag, btn));
    container.appendChild(btn);
  });
}

function toggleTag(tag, btn) {
  if (selectedTags.has(tag)) {
    selectedTags.delete(tag);
    btn.classList.remove("selected");
  } else {
    selectedTags.add(tag);
    btn.classList.add("selected");
  }
  filterActivities();
}

function filterActivities() {
  const searchInput = document.getElementById("searchInput").value.toLowerCase();

  const filtered = activities.filter(a => {
    // Must include all selected tags
    for (let tag of selectedTags) {
      if (!a.Tags.includes(tag)) return false;
    }

    // Search filter (optional)
    const matchesSearch =
      a["Activity Name"].toLowerCase().includes(searchInput) ||
      (a.TYPE && a.TYPE.toLowerCase().includes(searchInput)) ||
      (a.GENRE && a.GENRE.toLowerCase().includes(searchInput)) ||
      (a.MISC && a.MISC.toLowerCase().includes(searchInput));

    return matchesSearch;
  });

  displayActivities(filtered);
}

function displayActivities(list) {
  const container = document.getElementById("activityList");
  container.innerHTML = "";

  list.forEach(a => {
    const card = document.createElement("div");
    card.classList.add("activity-card");

    // Assign color by most prominent tag (TYPE > GENRE > MISC)
    let tagColor = "lightorange";
    if (a.TYPE) tagColor = "lightcoral";
    else if (a.GENRE) tagColor = "lightblue";
    else if (a.MISC) tagColor = "lightgreen";
    card.style.borderLeft = `6px solid ${tagColor}`;

    const title = document.createElement("h4");
    title.textContent = a["Activity Name"];
    card.appendChild(title);

    const desc = document.createElement("p");
    desc.textContent = a["Description"];
    card.appendChild(desc);

    container.appendChild(card);
  });
}

// Search button
document.getElementById("searchButton").addEventListener("click", filterActivities);

// Optional: search on enter key
document.getElementById("searchInput").addEventListener("keyup", (e) => {
  if (e.key === "Enter") filterActivities();
});

loadActivities();
