const TYPE_TAGS = [
  "OPENING", "INTRODUCE", "PRE-ASSESSMENT", "READ", "ANALYZE", 
  "REVIEW", "EVALUATE", "FORMATIVE", "SUMMATIVE", "CLOSING"
];

const GENRE_TAGS = [
  "READ", "VOCABULARY", "WRITING (Short)", "WRITING (creative)", "Visual Art"
];

const MISC_TAGS = [
  "On Your Feet", "Home Connection", "Games", "Ice Breaker", "Making Groups"
];

// Holds normalized tags mapping for canonical matching
function normalizeTag(tag) {
  if (!tag) return "";
  tag = tag.trim().toUpperCase();
  if (TYPE_TAGS.includes(tag)) return tag;
  if (GENRE_TAGS.includes(tag)) return tag;
  if (MISC_TAGS.map(t => t.toUpperCase()).includes(tag)) {
    return MISC_TAGS.find(t => t.toUpperCase() === tag);
  }
  return tag; // any unknown tags
}

let activities = [];
let selectedTags = {
  TYPE: [],
  GENRE: [],
  MISC: []
};

// Load JSON and normalize tags
fetch('activities.json')
  .then(response => response.json())
  .then(data => {
    activities = data.map(act => ({
      ...act,
      TYPE: normalizeTag(act.TYPE),
      GENRE: normalizeTag(act.GENRE),
      MISC: normalizeTag(act.Misc)
    }));
    generateTagButtons();
    displayActivities(activities);
  });

function generateTagButtons() {
  const typeContainer = document.getElementById('typeFilters');
  const genreContainer = document.getElementById('genreFilters');
  const miscContainer = document.getElementById('miscFilters');

  TYPE_TAGS.forEach(tag => createButton(typeContainer, tag, 'TYPE'));
  GENRE_TAGS.forEach(tag => createButton(genreContainer, tag, 'GENRE'));
  MISC_TAGS.forEach(tag => createButton(miscContainer, tag, 'MISC'));
}

// create button helper
function createButton(container, tag, category) {
  const btn = document.createElement('button');
  btn.textContent = tag;
  btn.addEventListener('click', () => {
    btn.classList.toggle('selected');
    if (selectedTags[category].includes(tag)) {
      selectedTags[category] = selectedTags[category].filter(t => t !== tag);
    } else {
      selectedTags[category].push(tag);
    }
  });
  container.appendChild(btn);
}

// Apply tag filters when "Go" button pressed
document.getElementById('applyTagFilters').addEventListener('click', () => {
  filterActivities();
});

// Apply search
document.getElementById('searchButton').addEventListener('click', () => {
  filterActivities();
});

// Filter activities
function filterActivities() {
  const searchTerm = document.getElementById('searchInput').value.toLowerCase();
  let filtered = activities.filter(act => {
    // Tag filtering
    const typeMatch = selectedTags.TYPE.length === 0 || selectedTags.TYPE.includes(act.TYPE);
    const genreMatch = selectedTags.GENRE.length === 0 || selectedTags.GENRE.includes(act.GENRE);
    const miscMatch = selectedTags.MISC.length === 0 || selectedTags.MISC.includes(act.MISC);

    // Search matching
    const searchMatch = act['Activity Name'].toLowerCase().includes(searchTerm)
      || act.Description.toLowerCase().includes(searchTerm)
      || act.TYPE.toLowerCase().includes(searchTerm)
      || act.GENRE.toLowerCase().includes(searchTerm)
      || act.MISC.toLowerCase().includes(searchTerm);

    return typeMatch && genreMatch && miscMatch && searchMatch;
  });
  displayActivities(filtered);
}

// Display activities
function displayActivities(list) {
  const container = document.getElementById('activityList');
  container.innerHTML = '';
  if (list.length === 0) {
    container.innerHTML = '<p>No activities found.</p>';
    return;
  }

  list.forEach(act => {
    const card = document.createElement('div');
    const mainTag = act.TYPE || act.GENRE || act.MISC;
    const classTag = mainTag.replace(/\s+/g, '-').replace(/\(.*\)/, '');
    card.className = `activity-card card-${classTag}`;
    card.innerHTML = `
      <h4>${act['Activity Name']}</h4>
      <p>${act.Description}</p>
      <p><strong>Type:</strong> ${act.TYPE || ''} | <strong>Genre:</strong> ${act.GENRE || ''} | <strong>Misc:</strong> ${act.MISC || ''}</p>
    `;
    container.appendChild(card);
  });
}
