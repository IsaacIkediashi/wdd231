const navigation = document.querySelector(".navigation");
const menu = document.querySelector(".menu");
const membersContainer = document.querySelector("#members");
const gridButton = document.querySelector("#grid-view");
const listButton = document.querySelector("#list-view");

if (navigation && menu) {
  menu.addEventListener("click", () => {
    const isOpen = menu.getAttribute("aria-expanded") === "true";
    menu.setAttribute("aria-expanded", String(!isOpen));
    menu.setAttribute("aria-label", isOpen ? "Open navigation menu" : "Close navigation menu");
    navigation.classList.toggle("show", !isOpen);
    menu.classList.toggle("show", !isOpen);
  });

  navigation.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navigation.classList.remove("show");
      menu.classList.remove("show");
      menu.setAttribute("aria-expanded", "false");
      menu.setAttribute("aria-label", "Open navigation menu");
    });
  });
}

if (membersContainer && gridButton && listButton) {
  gridButton.addEventListener("click", () => {
    membersContainer.classList.remove("directory-list");
    membersContainer.classList.add("directory-grid");
    gridButton.classList.add("active");
    listButton.classList.remove("active");
    gridButton.setAttribute("aria-pressed", "true");
    listButton.setAttribute("aria-pressed", "false");
  });

  listButton.addEventListener("click", () => {
    membersContainer.classList.remove("directory-grid");
    membersContainer.classList.add("directory-list");
    listButton.classList.add("active");
    gridButton.classList.remove("active");
    listButton.setAttribute("aria-pressed", "true");
    gridButton.setAttribute("aria-pressed", "false");
  });
}

// Footer dates
const currentYear = document.querySelector("#current-year");
const lastModified = document.querySelector("#lastModified");
const now = new Date();

if (currentYear) currentYear.textContent = now.getFullYear();
if (lastModified) lastModified.textContent = document.lastModified;

function getMembership(level) {
  const normalizedLevel = Number(level);
  if (normalizedLevel === 3) return "Gold Member";
  if (normalizedLevel === 2) return "Silver Member";
  return "Member";
}

function createBusinessCard(member) {
  const card = document.createElement("article");
  card.className = "business-card";

  const heading = document.createElement("div");
  heading.className = "business-heading";
  const name = document.createElement("h2");
  name.textContent = member.companyName || "Unnamed business";
  const tagline = document.createElement("p");
  tagline.textContent = member.tagline || "Local Business";
  heading.append(name, tagline);

  const details = document.createElement("div");
  details.className = "business-details";
  const image = document.createElement("img");
  image.src = member.image || "images/hero.svg";
  image.alt = `${member.companyName || "Business"} logo`;
  image.loading = "lazy";
  image.width = 120;
  image.height = 100;

  const info = document.createElement("div");
  info.className = "business-info";

  const address = document.createElement("p");
  const addressLabel = document.createElement("strong");
  addressLabel.textContent = "Address: ";
  address.append(addressLabel, document.createTextNode(member.address || "Not provided"));

  const phone = document.createElement("p");
  const phoneLabel = document.createElement("strong");
  phoneLabel.textContent = "Phone: ";
  phone.append(phoneLabel);
  if (member.phone) {
    const phoneLink = document.createElement("a");
    phoneLink.href = `tel:${member.phone.replace(/[^+\d]/g, "")}`;
    phoneLink.textContent = member.phone;
    phone.append(phoneLink);
  } else {
    phone.append("Not provided");
  }

  const website = document.createElement("p");
  const websiteLabel = document.createElement("strong");
  websiteLabel.textContent = "Website: ";
  website.append(websiteLabel);
  if (member.website) {
    try {
      const websiteUrl = new URL(member.website);
      if (websiteUrl.protocol === "https:" || websiteUrl.protocol === "http:") {
        const websiteLink = document.createElement("a");
        websiteLink.href = websiteUrl.href;
        websiteLink.textContent = websiteUrl.hostname.replace(/^www\./, "");
        websiteLink.target = "_blank";
        websiteLink.rel = "noopener noreferrer";
        website.append(websiteLink);
      } else {
        website.append("Not provided");
      }
    } catch {
      website.append("Not provided");
    }
  } else {
    website.append("Not provided");
  }

  const membership = document.createElement("p");
  const membershipLabel = document.createElement("strong");
  membershipLabel.textContent = "Membership: ";
  membership.append(membershipLabel, getMembership(member.membershipLevel));

  info.append(address, phone, website, membership);
  details.append(image, info);
  card.append(heading, details);
  return card;
}

async function getMembers() {
  if (!membersContainer) return;

  try {
    const response = await fetch("data/members.json");
    if (!response.ok) throw new Error(`HTTP error: ${response.status}`);

    const members = await response.json();
    if (!Array.isArray(members)) throw new Error("Members data must be an array.");

    membersContainer.replaceChildren();
    members.forEach((member) => membersContainer.append(createBusinessCard(member)));
  } catch (error) {
    membersContainer.innerHTML = "<p>Unable to load the business directory. Please try again later.</p>";
    console.error("Directory error:", error);
  }
}

getMembers();
