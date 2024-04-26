// Seleção de elementos do DOM para manipulação
let pokemon_name = document.querySelector(".pokemon_name");
let pokemon_number = document.querySelector(".pokemon_num");
let pokemon_image = document.querySelector(".pokemon_image");
let form = document.querySelector(".form");
let pokemon_search = document.querySelector(".input_search");
let button_prev = document.querySelector(".btn-prev");
let button_next = document.querySelector(".btn-next");
let filter_type = document.querySelector("#shiny_default");
let last_chosen;

// Renderiza o primeiro Pokémon assim que a página é carregada
document.addEventListener("DOMContentLoaded", () => {
    render_pokemon("1");
});

// Função assíncrona para buscar dados do Pokémon na API
const fetch_pokemon = async (pokemon) => {
    const API_response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${pokemon.toLowerCase()}`
    );
    if (API_response.status === 200) {
        const data = API_response.json();
        return data;
    }
};

// Função assíncrona para renderizar os dados do Pokémon na página
const render_pokemon = async (pokemon) => {
    // Exibe mensagens de carregamento e limpa conteúdo anterior
    pokemon_number.textContent = "";
    pokemon_name.textContent = "Loading...";
    const data = await fetch_pokemon(pokemon);
    if (data) {
        // Escolhe a imagem padrão ou brilhante com base na seleção do filtro
        const filter_value = filter_type.value;
        switch (filter_value) {
            case "default":
                // Configura os detalhes do Pokémon para o modo padrão
                pokemon_name.textContent = data.name;
                pokemon_number.textContent = data.id;
                last_chosen = pokemon_number.textContent;
                pokemon_image.src =
                    data.sprites.versions["generation-v"][
                        "black-white"
                    ].animated["front_default"];
                pokemon_search.value = "";
                break;
            case "shiny":
                // Configura os detalhes do Pokémon para o modo brilhante (shiny)
                pokemon_name.textContent = data.name;
                pokemon_number.textContent = data.id;
                last_chosen = pokemon_number.textContent;
                pokemon_image.src =
                    data.sprites.versions["generation-v"][
                        "black-white"
                    ].animated["front_shiny"];
                pokemon_search.value = "";
                break;
        }
    } else {
        // Chama a função de erro se os dados não forem encontrados
        error();
    }
};

// Atualiza a visualização do Pokémon quando o filtro é alterado
filter_type.addEventListener("change", () => {
    if (last_chosen) {
        render_pokemon(last_chosen);
    }
});

// Busca um Pokémon específico quando o formulário é submetido
form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (pokemon_search.value > 649) {
        error();
    } else {
        render_pokemon(pokemon_search.value);
    }
});

// Navega para o Pokémon anterior
button_prev.addEventListener("click", () => {
    pokemon_number.textContent--;
    if (pokemon_number.textContent < 1) {
        error();
    } else {
        render_pokemon(pokemon_number.textContent);
    }
});

// Navega para o próximo Pokémon
button_next.addEventListener("click", () => {
    pokemon_number.textContent++;
    if (pokemon_number.textContent < 650) {
        render_pokemon(pokemon_number.textContent);
    } else {
        error();
    }
});

// Função para tratar erros, como Pokémon não encontrado
function error() {
    pokemon_image.src = "./img/klipartz.com.png";
    pokemon_name.textContent = "Not Found ;(";
    pokemon_number.textContent = "";
}
