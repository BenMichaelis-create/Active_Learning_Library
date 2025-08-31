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
  if (typeTags.map(normalizeTag).includes(t)) return "typeFilters";
  if (genreTags.map(normalizeTag).includes(t)) return "genreFilters";
  return "miscFilters";
}

function generateFilters() {
  const allTags = { typeFilters: new Set(), genreFilters: new Set(), miscFilters: new Set() };

  activities.forEach(a => {
    ["TYPE","GENRE","Misc"].forEach(key => {
      if (a[key]) {
        const category = assignCategory(a[key]);
        allTags[category].add(a[key].toUpperCase());
      }
    });
  });

  Object.keys(allTags).forEach(cat => {
    const container = document.getElementById(cat);
    container.innerHTML = "";
    allTags[cat].forEach(tag => {
      const btn = document.createElement("button");
      btn.textContent = tag;
      btn.classList.add("filter-button");
      btn.addEventListener("click", () => {
        if (selectedTags.includes(tag)) {
          selectedTags.splice(selectedTags.indexOf(tag), 1);
          btn.classList.remove("selected");
        } else {
          selectedTags.push(tag);
          btn.classList.add("selected");
        }
        filterActivities();
      });
      container.appendChild(btn);
    });
  });
}

function filterActivities() {
  const searchInput = document.getElementById("searchInput").value.toLowerCase();

  const filtered = activities.filter(a => {
    const matchesSearch =
      a["Activity Name"].toLowerCase().includes(searchInput) ||
      ["TYPE","GENRE","Misc"].some(k => a[k].toLowerCase().includes(searchInput));

    const matchesTags =
      selectedTags.length === 0 ||
      selectedTags.some(tag =>
        ["TYPE","GENRE","Misc"].some(k => normalizeTag(a[k]) === tag)
      );

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

    // Determine color based on first tag
    const firstTag = [a["TYPE"], a["GENRE"], a["Misc"]].find(Boolean);
    let tagColor = "#ecf0f1"; // default gray
    if (firstTag) {
      switch(firstTag.toUpperCase()) {
        case "READ": tagColor="#ffe0e0"; break;
        case "VOCABULARY": tagColor="#e0f7ff"; break;
        case "WRITING": tagColor="#fff3e0"; break;
        case "CREATIVE WRITING": tagColor="#fce4ec"; break;
        case "VISUAL ART": tagColor="#e0ffe0"; break;
        case "INTRODUCE": tagColor="#fce4ec"; break;
        case "ANALYZE": tagColor="#f3e5f5"; break;
        case "PRE-ASSESSMENT": tagColor="#fff9c4"; break;
        case "FORMATIVE": tagColor="#c8e6c9"; break;
        case "REVIEW": tagColor="#b3e5fc"; break;
        case "EVALUATE": tagColor="#ffccbc"; break;
        case "SUMMATIVE": tagColor="#d1c4e9"; break;
        case "CLOSING": tagColor="#f0f4c3"; break;
        default: tagColor="#ecf0f1";
      }
    }
    card.style.backgroundColor = tagColor;

    const title = document.createElement("h4");
    title.textContent = a["Activity Name"];
    card.appendChild(title);

    const desc = document.createElement("p");
    desc.textContent = a["Description"];
    card.appendChild(desc);

    const tagText = document.createElement("small");
    tagText.textContent = [a["TYPE"], a["GENRE"], a["Misc"]].filter(Boolean).join(" • ");
    tagText.style.color = "#7f8c8d";
    card.appendChild(tagText);

    container.appendChild(card);
  });
}

// Search updates automatically as you type
document.getElementById("searchInput").addEventListener("input", filterActivities);

loadActivities();
