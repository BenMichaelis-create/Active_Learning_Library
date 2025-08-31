// Canonical tag lists
const typeTags = ["OPENING","INTRODUCE","PRE-ASSESSMENT","READ","ANALYZE","REVIEW","EVALUATE","FORMATIVE","SUMMATIVE","CLOSING"];
const genreTags = ["READ","VOCABULARY","WRITING (Short)","WRITING (creative)","Visual Art"];
const miscTags = ["On Your Feet","Home Connection","Games","Ice Breaker","Making Groups"];

// Sets for active filters
let selectedTypes = new Set();
let selectedGenres = new Set();
let selectedMisc = new Set();

let activities = [];

// Load JSON
fetch('activities.json')
  .then(response => response.json())
  .then(data => {
    activities = data.map(a => normalizeActivity(a));
    createTagButtons();
    renderActivities(activities);
  });

// Normalize activity tags
function normalizeActivity(act) {
  let type = typeTags.includes(act.TYPE) ? act.TYPE : "CLOSING";
  let genre = genreTags.includes(act.GENRE) ? act.GENRE : "";
  let misc = miscTags.includes(act.Misc) ? act.Misc : act.Misc || "";
  return {...act, TYPE: type, GENRE: genre, Misc: misc};
}

// Create buttons
function createTagButtons() {
  createButtons(typeTags, "typeFilters", selectedTypes);
  createButtons(genreTags, "genreFilters", selectedGenres);
  createButtons(miscTags, "miscFilters", selectedMisc);
}

// Generic button creator
function createButtons(tags, containerId, selectedSet) {
  const container = document.getElementById(containerId);
  tags.forEach(tag => {
    const btn = document.createElement('button');
    btn.textContent = tag;
    btn.addEventListener('click', () => {
      if (selectedSet.has(tag)) {
        selectedSet.delete(tag);
        btn.classList.remove('active');
      } else {
        selectedSet.add(tag);
        btn.classList.add('active');
      }
    });
    container.appendChild(btn);
  });
}

// Render activities
function renderActivities(list) {
  const container = document.getElementById('activityList');
  container.innerHTML = '';
  list.forEach(act => {
    const card = document.createElement('div');
    card.classList.add('activity-card');

    // Color code by most prominent tag
    let colorClass = "#fff9c4"; // default
    if (typeTags.includes(act.TYPE)) colorClass = "#ffecb3";
    if (genreTags.includes(act.GENRE)) colorClass = "#c8e6c9";
    if (miscTags.includes(act.Misc)) colorClass = "#bbdefb";
    card.style.backgroundColor = colorClass;

    card.innerHTML = `<h4>${act["Activity Name"]}</h4><p>${act.Description}</p>`;
    container.appendChild(card);
  });
}

// Filter and Go button
document.getElementById('goButton').addEventListener('click', () => {
  let filtered = activities.filter(a => {
    let typeOk = selectedTypes.size === 0 || selectedTypes.has(a.TYPE);
    let genreOk = selectedGenres.size === 0 || selectedGenres.has(a.GENRE);
    let miscOk = selectedMisc.size === 0 || selectedMisc.has(a.Misc);
    return typeOk && genreOk && miscOk;
  });
  renderActivities(filtered);
});

// Search button
document.getElementById('searchButton').addEventListener('click', () => {
  const query = document.getElementById('searchInput').value.toLowerCase();
  const filtered = activities.filter(a => 
    a["Activity Name"].toLowerCase().includes(query) ||
    a.Description.toLowerCase().includes(query) ||
    a.TYPE.toLowerCase().includes(query) ||
    a.GENRE.toLowerCase().includes(query) ||
    a.Misc.toLowerCase().includes(query)
  );
  renderActivities(filtered);
});

