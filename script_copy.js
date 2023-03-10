const app = {};

app.displayCuisines = () => {
    const cuisineOptions = ['American', 'Chinese', 'Italian', 'Mexican', 'Thai', 'Japanese', 'French', 'Indian', 'Greek', 'Spanish', 'Korean', 'Middle Eastern'];
    const randomCuisines = [];
    while (randomCuisines.length < 4) {
        const randomIndex = Math.floor(Math.random() * cuisineOptions.length);
        const randomCuisine = cuisineOptions[randomIndex];
        if (!randomCuisines.includes(randomCuisine)) {
            randomCuisines.push(randomCuisine);
        }
    }
    // loop over each cuisine item in cuisineOptions array to create HTML elements and append to form in DOM
    randomCuisines.forEach((cuisine, index) => {
        // target HTML to append checkboxes
        const cuisineChoices = document.querySelector('.cuisineChoices');
        // create div element to populate with label and input
        const optionButton = document.createElement('div');
        optionButton.classList.add('optionButton');
        optionButton.innerHTML =
            `<input type="checkbox" id="cuisineOption${index}" name="cuisineOption" value="${cuisine}">
                    <label for="cuisineOption${index}">${cuisine}</label>`;
        // append checkbox input for each cuisine to DOM
        cuisineChoices.appendChild(optionButton);
    })
}
// function to listen for button click and store value of user's cuisine choice(s)
app.setEventListener = () => {
    // target form
    const form = document.querySelector('form');
    form.addEventListener('submit', function (event) {
        event.preventDefault();
        
        const checkboxes = event.target.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach((checkbox) => {
            if (checkbox.checked) {
                excludedCuisines.push(checkbox.value);
            }
        });
        
    });

}
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

app.apiKey = 'c8f1c1da6fe84ef6b510afbd3ad28f27';
    // app.apiKey = "20a367ef2c2e4d4380d95b890faae49b";
    app.apiUrl = "https://api.spoonacular.com/recipes/complexSearch"
    // https://api.spoonacular.com/food/products/search?query=yogurt&apiKey=API-KEY
    app.getRecipes = () => {
        const url = new URL(app.apiUrl);
        url.search = new URLSearchParams({
            apiKey: app.apiKey,
            excludedCuisine:  '',

        })
        fetch(url)
            .then(response => {
                return response.json();
            })
            .then(jsonResult => {
                console.log(jsonResult);
                app.displayRecipe(jsonResult);
        });
    }
    app.displayRecipe = (recipeArray) => {
        console.log(recipeArray.results);
        const recipes = document.querySelector('.recipes');
        // loop
        recipeArray.results.forEach(recipe => {
            // create li element
            const listItem = document.createElement('li');
            // create img element
            const recipeImage = document.createElement('img');
            // create h2 element
            const recipeHeading = document.createElement('h2');
            recipeImage.src = recipe.image;
            recipeHeading.textContent = recipe.title;
            listItem.appendChild(recipeImage);
            listItem.appendChild(recipeHeading);
            recipes.appendChild(listItem);
        });
    }

app.init = () => {
    app.displayCuisines();
    // app.getRecipes();
    app.setEventListener();
}
app.init();