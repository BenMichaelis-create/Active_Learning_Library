let activities = [];
const typeTags = ["OPENING","INTRODUCE","PRE-ASSESSMENT","READ","ANALYZE","REVIEW","EVALUATE","FORMATIVE","SUMMATIVE","CLOSING"];
const genreTags = ["READ","VOCABULARY","WRITING (Short)","WRITING (creative)","Visual Art"];
const miscTags = ["On Your Feet","Home Connection","Games","Ice Breaker","Making Groups"];

fetch('activities.json')
  .then(res => res.json())
  .then(data => {
    activities = data;
    createTagButtons();
    displayActivities(activities);
  })
  .catch(err => console.error('Error loading JSON:', err));

function createTagButtons() {
  const typeContainer = document.getElementById('typeFilters');
  const genreContainer = document.getElementById('genreFilters');
  const miscContainer = document.getElementById('miscFilters');

  typeTags.forEach(tag => {
    const t = document.createElement('span');
    t.className = 'tag';
    t.textContent = tag;
    typeContainer.appendChild(t);
  });

  genreTags.forEach(tag => {
    const t = document.createElement('span');
    t.className = 'tag';
    t.textContent = tag;
    genreContainer.appendChild(t);
  });

  miscTags.forEach(tag => {
    const t = document.createElement('span');
    t.className = 'tag';
    t.textContent = tag;
    miscContainer.appendChild(t);
  });

  // Tag click toggle
  document.querySelectorAll('.tag').forEach(tag => {
    tag.addEventListener('click', () => {
      tag.classList.toggle('selected');
    });
  });
}

function displayActivities(list) {
  const container = document.getElementById('activityList');
  container.innerHTML = '';

  list.forEach(act => {
    const card = document.createElement('div');
    card.className = 'activity-card';
    card.innerHTML = `
      <h4>${act['Activity Name'] || 'No Name'}</h4>
      <p>${act['Description'] || ''}</p>
      <p><strong>Type:</strong> ${act['TYPE'] || 'N/A'}</p>
      <p><strong>Genre:</strong> ${act['GENRE'] || 'N/A'}</p>
      <p><strong>Misc:</strong> ${act['Misc'] || 'N/A'}</p>
    `;
    container.appendChild(card);
  });
}

function filterActivities() {
  const searchValue = document.getElementById('searchInput').value.toLowerCase();

  const selectedTypes = Array.from(document.querySelectorAll('#typeFilters .tag.selected')).map(t => t.textContent);
  const selectedGenres = Array.from(document.querySelectorAll('#genreFilters .tag.selected')).map(t => t.textContent);
  const selectedMiscs = Array.from(document.querySelectorAll('#miscFilters .tag.selected')).map(t => t.textContent);

  const filtered = activities.filter(act => {
    const matchesSearch = act['Activity Name'].toLowerCase().includes(searchValue) ||
                          (act['TYPE'] && act['TYPE'].toLowerCase().includes(searchValue)) ||
                          (act['GENRE'] && act['GENRE'].toLowerCase().includes(searchValue)) ||
                          (act['Misc'] && act['Misc'].toLowerCase().includes(searchValue));

    const matchesType = selectedTypes.length === 0 || selectedTypes.includes(act['TYPE']);
    const matchesGenre = selectedGenres.length === 0 || selectedGenres.includes(act['GENRE']);
    const matchesMisc = selectedMiscs.length === 0 || selectedMiscs.includes(act['Misc']) ||
                        (!miscTags.includes(act['Misc'])); // catch-all any unknown misc

    return matchesSearch && matchesType && matchesGenre && matchesMisc;
  });

  displayActivities(filtered);
}

// Button events
document.getElementById('searchButton').addEventListener('click', () => {
  filterActivities(); // search input
});

document.getElementById('goButton').addEventListener('click', () => {
  filterActivities(); // tag filters
});
