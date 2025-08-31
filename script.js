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
