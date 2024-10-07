const root = document.getElementById('root');

const makeDiv = (className) => {
  const div = document.createElement('div');
  div.className = className;
  return div;
};

const makeEl = (tagName, className) => {
  const el = document.createElement(tagName);
  el.className = className;
  return el;
};

class PokemonCard {
  constructor(parent, pokemon, onClick) {
    const pokemonCard = document.createElement('button');
    pokemonCard.className = 'pokemon-card';
    pokemonCard.addEventListener('click', onClick);
    const pokemonName = document.createElement('p');
    pokemonName.innerText = pokemon.pokemon_species.name;
    pokemonCard.appendChild(pokemonName);
    this.pokemonName = pokemonName;
    parent.appendChild(pokemonCard);
    this.img = document.createElement('img');
    this.img.alt = `Image of ${pokemonName}`;
    this.data = null;
    pokemonCard.appendChild(this.img);
    this.getPokemonData(
      `https://pokeapi.co/api/v2/pokemon/${pokemon.entry_number}`
    );
  }

  getPokemonData = (url) => {
    fetch(url)
      .then((resp) => resp.json())
      .then((data) => {
        this.img.src = data.sprites['front_default'];
        // const pokemonData = JSON.parse(localStorage.getItem('pokemon') ?? '{}');
        // pokemonData[data.id] = data;
        // localStorage.setItem('pokemon', JSON.stringify(pokemonData));
      });
  };
}

class PokemonPage {
  constructor(parent, entryPage, backCallback) {
    this.parent = parent;
    const backButton = document.createElement('button');
    backButton.innerText = 'Back';
    backButton.addEventListener('click', backCallback);
    this.parent.appendChild(backButton);
    // const pokemonData = localStorage.getItem('pokemon');
    fetch(`https://pokeapi.co/api/v2/pokemon/${entryPage}`)
      .then((resp) => resp.json())
      .then((data) => {
        console.log(data);
        this.pokemonName = document.createElement('h1');
        this.pokemonName.innerText = data.species.name;
        this.parent.appendChild(this.pokemonName);
        this.pokemonName.className = 'pokemon-name-title';
        this.pokemonImage = document.createElement('img');
        this.pokemonImage.src = data.sprites['front_default'];
        this.parent.appendChild(this.pokemonImage);
      });
  }
}

class PokedexPage {
  constructor(parent) {
    this.parent = parent;
    const rootLayout = makeDiv('base-layout');
    this.parent.appendChild(rootLayout);
    const columnLayout = makeDiv('two-column-layout');
    rootLayout.appendChild(columnLayout);
    const sideBar = makeDiv('sidebar');
    const main = makeDiv('main-content');
    columnLayout.appendChild(sideBar);
    columnLayout.appendChild(main);
    this.mainContent = main;
    this.sideBar = sideBar;
    this.columnLayout = columnLayout;
    this.data = null;
  }

  generatePokedexPage() {
    while (this.mainContent.firstChild) {
      this.mainContent.removeChild(this.mainContent.firstChild);
    }

    if (this.data === null) {
      fetch('https://pokeapi.co/api/v2/pokedex/2/')
        .then((resp) => resp.json())
        .then((data) => (this.data = data))
        .then(() => {
          this.generatePokedexPage();
        });
      return;
    }

    for (const pokemon of this.data.pokemon_entries) {
      new PokemonCard(this.mainContent, pokemon, () =>
        this.generatePokemonPage(pokemon.entry_number)
      );
    }
  }

  generatePokemonPage(entryNumber) {
    console.log('generating pokemon page');
    console.log(entryNumber);
    while (this.mainContent.firstChild) {
      this.mainContent.removeChild(this.mainContent.firstChild);
    }
    new PokemonPage(
      this.mainContent,
      entryNumber,
      () => this.generatePokedexPage()
    );
  }
}

const page = new PokedexPage(root);
page.generatePokedexPage();
