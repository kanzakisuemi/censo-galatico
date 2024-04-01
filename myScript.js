async function getPlanets () {
  let response = await fetch('https://swapi.dev/api/planets/');
  let data = await response.json();
  let planets = data.results;

  let planetsContainer = document.getElementById('planets-container');
  let buttonsContainer = document.getElementById('buttons-container');
  let showPlanetsBtn = document.getElementById('show-planets-btn');
  showPlanetsBtn.style.display = 'none';

  let searchContainer = document.createElement('div');
  searchContainer.classList.add('d-flex', 'justify-content-center');
  buttonsContainer.appendChild(searchContainer);

  let search = document.createElement('input');
  search.setAttribute('type', 'text');
  search.setAttribute('id', 'search');
  search.setAttribute('placeholder', 'Search');
  search.classList.add('form-control', 'm-2');
  searchContainer.appendChild(search);

  let submitSearch = document.createElement('button');
  submitSearch.innerHTML = 'Search';
  submitSearch.setAttribute('id', 'submit-search');
  submitSearch.classList.add('btn', 'btn-primary', 'm-2');
  searchContainer.appendChild(submitSearch);

  search.addEventListener('focus', () => { document.addEventListener('keydown', onKeyDown); })
  search.addEventListener('blur', () => { document.removeEventListener('keydown', onKeyDown); })

  function onKeyDown(event) {
    if (event.keyCode === 13) { handleSearch(); }
  }

  async function handleSearch() {
    let response = await fetch('https://swapi.dev/api/planets/');
    let data = await response.json();
    let planets = data.results;
  
    searchPlanets(planets);
  }

  submitSearch.addEventListener('click', handleSearch);
  
  let accordion = document.createElement('div');
  accordion.classList.add('accordion');
  accordion.setAttribute('id', 'accordionId');

  planets.forEach(planet => {
    let accordionItem = document.createElement('div');
    accordionItem.classList.add('accordion-item');
    accordionItem.innerHTML = `
      <h2 class="accordion-header" id="heading${planet.name.replace(/ /g, '')}">
        <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${planet.name.replace(/ /g, '')}" aria-expanded="true" aria-controls="collapse${planet.name.replace(/ /g, '')}">
          ${planet.name}
        </button>
      </h2>
      <div id="collapse${planet.name.replace(/ /g, '')}" class="accordion-collapse collapse" aria-labelledby="heading${planet.name}" data-bs-parent="#accordionId">
        <div class="accordion-body">
          <p>Climate: ${planet.climate}</p>
          <p>Population: ${planet.population}</p>
          <p>Terrain: ${planet.terrain}</p>
        </div>
      </div>
    `;
    accordion.appendChild(accordionItem);
    getPeople(planet);
  });
  planetsContainer.appendChild(accordion);
}

async function searchPlanets(planets) {
  let searchTerm = document.getElementById('search').value.toLowerCase();
  let message = document.createElement('div');
  message.classList.add('alert', 'alert-danger', 'mt-4');
  message.textContent = 'No planets found matching the search term.';

  if (document.querySelector('.accordion-collapse.show')) {
    let expandedAccordion = document.querySelector('.accordion-collapse.show')
    let accordionButton = expandedAccordion.parentElement.firstElementChild.querySelector('.accordion-button');
    if (accordionButton) { accordionButton.click(); }
  }

  if (document.querySelector('.alert-danger')) {
    let existingMessage = document.querySelector('.alert-danger');
    existingMessage.remove();
  }

  let foundMatch = false;
  planets.forEach((planet, index) => {
    if (planet.name.toLowerCase() == searchTerm) {
      foundMatch = true;
      if (message) { message.remove(); }
      let accordionButton = document.getElementById(`heading${planet.name.replace(/ /g, '')}`).firstElementChild;
      if (accordionButton) { accordionButton.click(); }
    }
  });

 if (!foundMatch) { document.getElementById('planets-container').insertBefore(message, document.getElementById('accordionId')); }

}

async function getPeople(planet) {
  let response = await fetch('https://swapi.dev/api/people/');
  let data = await response.json();
  let people = data.results;

  let peopleFromThisPlanet = await people.filter(person => person.homeworld == planet.url);

  let peopleList = document.createElement('ul');
  peopleList.classList.add('list-group');
  peopleList.setAttribute('id', `people-${planet.name.replace(/ /g, '')}`);
  let accordionBody = document.getElementById(`collapse${planet.name.replace(/ /g, '')}`).firstElementChild;

  peopleFromThisPlanet.forEach(person => {
    let personItem = document.createElement('li');
    personItem.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
    let personName = document.createElement('span');
    personName.textContent = person.name;
    personItem.appendChild(personName);
    let personBirthYear = document.createElement('span');
    personBirthYear.textContent = person.birth_year;
    personItem.appendChild(personBirthYear);
    peopleList.appendChild(personItem);
  });

  accordionBody.appendChild(peopleList);

  if (peopleFromThisPlanet.length == 0) {
    let noPeople = document.createElement('div');
    noPeople.classList.add('alert', 'alert-danger');
    noPeople.textContent = 'No one here is famous.';
    accordionBody.appendChild(noPeople);
  }
}
