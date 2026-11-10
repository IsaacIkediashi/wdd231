const url = "https://byui-cse.github.io/cse-ww-program/data/latter-day-prophets.json";
const cards = document.querySelector("#cards");


async function getProphetsData(){
 try{
  const response = await fetch(url);
  if(!response.ok){
   throw new error(`Request failed with status ${response.status}`)
  };
  const data = await response.json();
  displayProphets(data.prophets);
 }catch(error){
  console.error(error);
 }
 
}


getProphetsData();

const displayProphets = (prophetsData) => {

 

 prophetsData.forEach(prophet => {
  const card = document.createElement("section");
  card.classList.add("prophet");

  const about = document.createElement("div");
  about.innerHTML= `
   <h2>${prophet.name} ${prophet.lastname}</h2> 
   <div id="add-info">Date of Birth: ${prophet.birthdate} <br>
   Place of Birth: ${prophet.birthplace}
   </div>`;

  const portrait = document.createElement("img");
  portrait.setAttribute("src", prophet.imageurl);
  portrait.setAttribute('alt', `Portrait of ${prophet.name}`);
  portrait.setAttribute("width", "140");
  portrait.setAttribute("height", "240");
  portrait.setAttribute("loading", "lazy");
  
  card.appendChild(about);
  card.appendChild(portrait);
  cards.appendChild(card);
 });

 
 

}