// Canonical tag lists
const canonicalTags = {
  Type: ["OPENING","INTRODUCE","PRE-ASSESSMENT","READ","ANALYZE","REVIEW","EVALUATE","FORMATIVE","SUMMATIVE","CLOSING"],
  Genre: ["READ","VOCABULARY","WRITING (Short)","WRITING (creative)","Visual Art"],
  Misc: ["On Your Feet","Home Connection","Games","Ice Breaker","Making Groups"]
};

let activities = [];
let selectedTags = { Type: [], Genre: [], Misc: [] };

// Load JSON
fetch('activities.json')
  .then(response => response.json())
  .then(data => {
    activities = data;
    generateTagButtons();
    displayActivities(activities);
  });

// Normalize tag to canonical list or Misc
function normalizeTag(tag, category) {
  tag = tag.trim().toUpperCase();
  if(canonicalTags[category].includes(tag)) return tag;
  return tag; // Any unknown will still appear in Misc
}

// Generate clickable tag buttons
function generateTagButtons() {
  ["Type","Genre","Misc"].forEach(cat => {
    const container = document.getElementById(cat.toLowerCase() + "Filters");
    const allTags = new Set();

    activities.forEach(act => {
      const val = act[cat] || "";
      if(val) allTags.add(val.trim());
    });

    const sortedTags = Array.from(allTags).sort();
    sortedTags.forEach(tag => {
      const button = document.createElement('span');
      button.className = "tag-button";
      button.textContent = tag;
      button.addEventListener('click', () => {
        button.classList.toggle('active');
        if(selectedTags[cat].includes(tag)) {
          selectedTags[cat] = selectedTags[cat].filter(t => t !== tag);
        } else {
          selectedTags[cat].push(tag);
        }
      });
      container.appendChild(button);
    });
  });
}

// Display activities
function displayActivities(list) {
  const container = document.getElementById('activityList');
  container.innerHTML = "";

  list.forEach(act => {
    const card = document.createElement('div');
    const typeClass = "type-" + (canonicalTags.Type.includes(act.TYPE) ? act.TYPE : "UNKNOWN");
    card.className = `activity-card ${typeClass}`;
    
    const title = document.createElement('h3');
    title.textContent = act["Activity Name"] || "Unnamed Activity";
    const desc = document.createElement('p');
    desc.textContent = act.Description || "";

    card.appendChild(title);
    card.appendChild(desc);
    container.appendChild(card);
  });
}

// Tag filter Go button
document.getElementById("tagFilterButton").addEventListener("click", () => {
  const filtered = activities.filter(act => {
    return ["Type","Genre","Misc"].every(cat => {
      if(selectedTags[cat].length === 0) return true;
      const val = act[cat] || "";
      return selectedTags[cat].some(tag => val.toUpperCase() === tag.toUpperCase());
    });
  });
  displayActivities(filtered);
});

// Search button
document.getElementById("searchButton").addEventListener("click", () => {
  const term = document.getElementById("searchInput").value.toLowerCase();
  const filtered = activities.filter(act => {
    const name = act["Activity Name"]?.toLowerCase() || "";
    const desc = act.Description?.toLowerCase() || "";
    const tags = [act.TYPE, act.GENRE, act.Misc].join(" ").toLowerCase();
    return name.includes(term) || desc.includes(term) || tags.includes(term);
  });
  displayActivities(filtered);
});
