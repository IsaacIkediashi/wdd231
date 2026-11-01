
const currentYear = document.querySelector("#currentyear");
const lastModified = document.querySelector("#lastModified");

const date = new Date();

if (currentYear) {
    currentYear.textContent = date.getFullYear();
}

if (lastModified) {
    lastModified.textContent = document.lastModified;
}
