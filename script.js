const app = {}

app.apiKey = 'c8f1c1da6fe84ef6b510afbd3ad28f27';
// app.apiKey = "20a367ef2c2e4d4380d95b890faae49b";
app.apiUrl = "https://api.spoonacular.com/recipes/complexSearch"

// https://api.spoonacular.com/food/products/search?query=yogurt&apiKey=API-KEY

// function to request data from API
app.getRecipes = (query) => {
    const url = new URL(app.apiUrl);

    url.search = new URLSearchParams({
        apiKey: app.apiKey,
        excludeCuisine: 'Italian',
        excludeIngredients: query,
        // fillIngredients: false,
        type: [
            'lunch',
            'main course',
            'main dish',
            'dinner'
        ],
        addRecipeInformation: true,
        sort: 'random',
        number: 1
    })

    // console.log(query);

    fetch(url)
        .then(response => {
            return response.json();
        })
        .then(jsonResult => {
            // console.log(jsonResult);
            app.displayRecipe(jsonResult);
        });
}

// function to display recipe sugggestions to DOM
app.displayRecipe = (recipeArray) => {

    // console.log(recipeArray.results);

    const recipesContainer = document.querySelector('.recipesContainer');

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

        recipesContainer.appendChild(listItem);
    });
}

// app.getUserInput = () => {
    // target form
    const form = document.querySelector('.form');

    // add event listener to form
    form.addEventListener('submit', function (event) {
        // prevent page from reloading
        event.preventDefault();

        // target input element
        const inputElement = document.getElementById('inputText');

        // console.log(inputElement);

        const userInput = inputElement.value;

        // console.log(userInput);

        const ingredientsArray = [];

        ingredientsArray.push(userInput);

        // console.log(ingredientsArray);

        const excludedIngredients = ingredientsArray.toString()

        console.log(excludedIngredients);
        app.getRecipes(excludedIngredients);
    });
// }

// create init method
app.init = () => {
    // app.getUserInput();
    app.getRecipes();
}

// call init method
app.init();