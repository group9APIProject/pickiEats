// namespace object
const app = {};

// Define Variables:
app.apiKey = 'c8f1c1da6fe84ef6b510afbd3ad28f27';
// app.apiKey = "20a367ef2c2e4d4380d95b890faae49b";
app.apiUrl = "https://api.spoonacular.com/recipes/complexSearch"

// global array of cuisines already excluded from user choices
const excludedCuisines = [
    'African',
    'British',
    'Cajun',
    'Caribbean',
    'Eastern European',
    'European',
    'German',
    'Irish',
    'Jewish',
    'Latin American',
    'Mediterranean',
    'Nordic',
    'Southern',
    'Vietnamese'
];

// function to display cuisine options in HTML
app.displayCuisines = () => {
    // array of cuisine options 
    const cuisineOptions = ['American', 'Chinese', 'Italian', 'Mexican', 'Thai', 'Japanese', 'French', 'Indian', 'Greek', 'Spanish', 'Korean', 'Middle Eastern'];

    // create array of random cuisines
    const randomCuisines = [];
    while (randomCuisines.length < 4) {
        const randomIndex = Math.floor(Math.random() * cuisineOptions.length);
        const randomCuisine = cuisineOptions[randomIndex];
        if (!randomCuisines.includes(randomCuisine)) {
            randomCuisines.push(randomCuisine);
        }
    }

    // loop over each cuisine item in randomCuisines array to create HTML elements and append to form
    randomCuisines.forEach((cuisine) => {
        // target HTML to append checkboxes
        const cuisineChoices = document.querySelector('.cuisineChoices');

        // create div element to populate with label and input
        const optionButton = document.createElement('div');
        optionButton.classList.add('optionButton');

        // add input/label HTML to div
        optionButton.innerHTML =
            `<input type="checkbox" id="cuisineOption" name="cuisineOption" value="${cuisine}">
                    <label for="cuisineOption">${cuisine}</label>`;

        // append div with input[type='checkbox'] for each cuisine option to DOM
        cuisineChoices.appendChild(optionButton);
    })
}

// function to listen for form submit and get user's cuisine options
app.setEventListener = () => {
    // target form from html
    const form = document.querySelector('form');

    // add event listener to form
    form.addEventListener('submit', function (event) {
        // prevent form from reloading
        event.preventDefault();

        // store the selected checked boxes and push them into global excludedCuisines array
        const checkboxes = event.target.querySelectorAll('input[type = "checkbox"]');
        checkboxes.forEach((checkbox) => {
            if (checkbox.checked) {
                // if checkbox.checked === true, then add(push) value of checked input into global excludedCuisines array
                excludedCuisines.push(checkbox.value);
            }
        });

        // convert excludedCuisines array into a string
        const stringCuisines = excludedCuisines.toString();

        // call app.getRecipes function with stringCuisines as argument
        app.getRecipes(stringCuisines);
    });
}

// function to pull recipe information from Spoonacular API based on user's choice(s)
app.getRecipes = (query) => {
    const url = new URL(app.apiUrl);
    // add search parameters to url
    url.search = new URLSearchParams({
        apiKey: app.apiKey,
        excludedCuisine: query,
        type: [
            'lunch',
            'main course',
            'main dish',
            'dinner'
        ],
        addRecipeInformation: true,
        sort: 'random',
        number: 2
    })
    fetch(url)
        .then(response => {
            return response.json();
        })
        .then(jsonResult => {
            // console.log(jsonResult);
            app.displayRecipe(jsonResult);
        });
}

// function to display recipes to DOM
app.displayRecipe = (recipeArray) => {
    // console.log(recipeArray.results);

    // target <ul> recipe container in HTML
    const recipes = document.querySelector('.recipes');

    // loop over each recipe item to create & append elements to <ul> recipe container
    recipeArray.results.forEach(recipe => {
        // create li element
        const listItem = document.createElement('li');

        // create img element
        const recipeImage = document.createElement('img');

        // create h2 element
        const recipeHeading = document.createElement('h2');

        // populate src & alt attributes of img elements
        recipeImage.src = recipe.image;
        recipeImage.alt = `Image of recipe ${recipe.title}`

        // add text to h2
        recipeHeading.textContent = recipe.title;

        // append img & h2 to li
        listItem.appendChild(recipeImage);
        listItem.appendChild(recipeHeading);

        // append li to ul
        recipes.appendChild(listItem);
    });
}

// init function to call methods 
app.init = () => {
    app.displayCuisines();
    app.setEventListener();
}

// call init function
app.init();