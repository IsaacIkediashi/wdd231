const navigation = document.querySelector(".navigation");
const menuButton = document.querySelector("#menu");

menuButton.addEventListener("click", ()=>{
 if(navigation && menuButton){
  const isOpen = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!isOpen));
  menuButton.setAttribute("aria-label", isOpen ? "Open navigation menu" : "Close navigation menu");
  navigation.classList.toggle("show", !isOpen);
  menuButton.classList.toggle("show", !isOpen);
 }
})




