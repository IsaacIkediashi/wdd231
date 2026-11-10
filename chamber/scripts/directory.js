
const navigation = document.querySelector(".navigation");
const menu = document.querySelector(".menu");

const membersContainer = document.querySelector("#members");
const gridButton = document.querySelector("#grid-view");
const listButton = document.querySelector("#list-view");

// HAMBURGER MENU

if (navigation && menu) {
    menu.addEventListener("click", () => {
        const isOpen = menu.getAttribute("aria-expanded") === "true";

        menu.setAttribute("aria-expanded", String(!isOpen));

        menu.setAttribute(
            "aria-label",
            isOpen ? "Open navigation menu" : "Close navigation menu"
        );

        navigation.classList.toggle("show", !isOpen);
        menu.classList.toggle("show", !isOpen);
    });

    navigation.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
            navigation.classList.remove("show");
            menu.classList.remove("show");

            menu.setAttribute("aria-expanded", "false");
            menu.setAttribute("aria-label", "Open navigation menu");
        });
    });
}

// GRID VIEW

gridButton.addEventListener("click", () => {
    membersContainer.classList.remove("directory-list");
    membersContainer.classList.add("directory-grid");

    gridButton.classList.add("active");
    listButton.classList.remove("active");

    gridButton.setAttribute("aria-pressed", "true");
    listButton.setAttribute("aria-pressed", "false");
});

// LIST VIEW

listButton.addEventListener("click", () => {
    membersContainer.classList.remove("directory-grid");
    membersContainer.classList.add("directory-list");

    listButton.classList.add("active");
    gridButton.classList.remove("active");

    listButton.setAttribute("aria-pressed", "true");
    gridButton.setAttribute("aria-pressed", "false");
});

// FOOTER DATE

const currentYear = document.querySelector("#current-year");
const lastModified = document.querySelector("#lastModified");

const date = new Date();

if (currentYear) {
    currentYear.textContent = date.getFullYear();
}

if (lastModified) {
    lastModified.textContent = document.lastModified;
}

// MEMBERSHIP LEVEL

function getMembership(level) {
    if (level === 3) {
        return "Gold Member";
    }

    if (level === 2) {
        return "Silver Member";
    }

    return "Member";
}

// DISPLAY MEMBERS

function displayMembers(members) {
    membersContainer.innerHTML = "";

    members.forEach(member => {
        const card = document.createElement("article");
        card.classList.add("business-card");

        // COMPANY HEADING

        const heading = document.createElement("div");
        heading.classList.add("business-heading");

        const name = document.createElement("h2");
        name.textContent = member.companyName;

        const tagline = document.createElement("p");
        tagline.textContent = member.tagline || "Local Business";

        heading.append(name, tagline);

        // COMPANY DETAILS

        const details = document.createElement("div");
        details.classList.add("business-details");

        const image = document.createElement("img");
        image.src = member.image;
        image.alt = `${member.companyName} logo`;
        image.loading = "lazy";
        image.width = 120;
        image.height = 100;

        const info = document.createElement("div");
        info.classList.add("business-info");

        // ADDRESS

        const address = document.createElement("p");
        const addressLabel = document.createElement("strong");

        addressLabel.textContent = "ADDRESS: ";
        address.append(addressLabel, member.address);

        // PHONE

        const phone = document.createElement("p");
        const phoneLabel = document.createElement("strong");

        phoneLabel.textContent = "PHONE: ";

        const phoneLink = document.createElement("a");
        phoneLink.href = `tel:${member.phone}`;
        phoneLink.textContent = member.phone;

        phone.append(phoneLabel, phoneLink);

        // WEBSITE

        const website = document.createElement("p");
        const websiteLabel = document.createElement("strong");

        websiteLabel.textContent = "URL: ";

        const websiteLink = document.createElement("a");
        websiteLink.href = member.website;
        websiteLink.textContent = member.website.replace(/^https?:\/\//, "");
        websiteLink.target = "_blank";
        websiteLink.rel = "noopener noreferrer";

        website.append(websiteLabel, websiteLink);

        // MEMBERSHIP

        const membership = document.createElement("p");
        const membershipLabel = document.createElement("strong");

        membershipLabel.textContent = "MEMBERSHIP: ";

        membership.append(
            membershipLabel,
            getMembership(member.membershipLevel)
        );

        info.append(address, phone, website, membership);

        details.append(image, info);
        card.append(heading, details);

        membersContainer.append(card);
    });
}

// FETCH JSON DATA

async function getMembers() {
    try {
        const response = await fetch("data/members.json");

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        const members = await response.json();

        if (!Array.isArray(members)) {
            throw new Error("Members data must be an array.");
        }

        displayMembers(members);

    } catch (error) {
        membersContainer.innerHTML =
            "<p>Unable to load the business directory.</p>";

        console.error("Directory error:", error);
    }
}

const themeButton = document.querySelector("#theme-toggle");

if (themeButton) {
    themeButton.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");

        const isDark = document.body.classList.contains("dark-mode");

        themeButton.setAttribute(
            "aria-label",
            isDark ? "Switch to light mode" : "Switch to dark mode"
        );
    });
}

getMembers();
