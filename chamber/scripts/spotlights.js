// Randomly display two or three Gold/Silver chamber members on the homepage.
const spotlightsContainer = document.querySelector("#spotlights-container");

function shuffleArray(items) {
  const shuffled = [...items];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
  }
  return shuffled;
}

function createSpotlightCard(member) {
  const card = document.createElement("article");
  card.className = "spotlight-card";

  const heading = document.createElement("div");
  heading.className = "spotlight-heading";
  const name = document.createElement("h3");
  name.textContent = member.companyName;
  const level = document.createElement("span");
  level.className = "membership-badge";
  level.textContent = Number(member.membershipLevel) === 3 ? "Gold Member" : "Silver Member";
  heading.append(name, level);

  const body = document.createElement("div");
  body.className = "spotlight-body";
  const logo = document.createElement("img");
  logo.src = member.image;
  logo.alt = `${member.companyName} logo`;
  logo.loading = "lazy";
  logo.width = 100;
  logo.height = 100;

  const details = document.createElement("div");
  details.className = "spotlight-details";
  const tagline = document.createElement("p");
  tagline.textContent = member.tagline || "Chamber member";
  const address = document.createElement("p");
  address.textContent = member.address || "Address not provided";
  const phone = document.createElement("p");
  phone.textContent = member.phone || "Phone not provided";
  const website = document.createElement("a");
  website.href = member.website;
  website.textContent = "Visit website";
  website.target = "_blank";
  website.rel = "noopener noreferrer";
  details.append(tagline, address, phone, website);
  body.append(logo, details);
  card.append(heading, body);
  return card;
}

async function loadSpotlights() {
  if (!spotlightsContainer) return;

  try {
    const response = await fetch("data/members.json");
    if (!response.ok) throw new Error(`HTTP error: ${response.status}`);

    const members = await response.json();
    if (!Array.isArray(members)) throw new Error("Members data must be an array.");

    const eligibleMembers = members.filter((member) => {
      const level = Number(member.membershipLevel);
      return level === 2 || level === 3;
    });

    const selectedMembers = shuffleArray(eligibleMembers).slice(0, Math.min(3, eligibleMembers.length));
    spotlightsContainer.replaceChildren();

    if (selectedMembers.length === 0) {
      spotlightsContainer.textContent = "No Gold or Silver member spotlights are available yet.";
      return;
    }

    selectedMembers.forEach((member) => spotlightsContainer.append(createSpotlightCard(member)));
  } catch (error) {
    spotlightsContainer.textContent = "Unable to load business spotlights.";
    console.error("Spotlights error:", error);
  }
}

loadSpotlights();
