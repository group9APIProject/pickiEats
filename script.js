// name space object
const app = {}

app.apiKey = 'c8f1c1da6fe84ef6b510afbd3ad28f27';
// app.apiKey = "20a367ef2c2e4d4380d95b890faae49b";
app.apiUrl = "https://api.spoonacular.com/recipes/complexSearch"

// function to request data from API
app.getRecipes = (query) => {
    const url = new URL(app.apiUrl);

    url.search = new URLSearchParams({
        apiKey: app.apiKey,
        // excludeCuisine: 'Italian',
        excludeIngredients: query,
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
            // app.displayRecipe(jsonResult);
        });
}

// function to display recipe sugggestions to DOM
app.displayRecipe = (recipeArray) => {
    // console.log(recipeArray.results);

    // target ul element to append recipe results
    const recipesContainer = document.querySelector('.recipesContainer');

    // loop over each recipe item in array to append to DOM
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

// function to get user's input of ingredients to exclude from recipe search
// app.getUserInput = () => {
    // target add button
    const addButton = document.querySelector('.add');

    // get ul element to append list of excluded ingredients 
    const ingredientsList = document.querySelector('.ingredientsList');

    // add event listener to add button
    addButton.addEventListener('click', function () {
        // target input element
        const inputElement = document.getElementById('inputText');
        // store user input in a variable
        const userInput = inputElement.value;
        // convert user input to lowercase
        const excludedIngredients = userInput.toLowerCase();

        // if user input evaluates to truthy (i.e. input is a string & not empty)
        const hasIngredients = userInput.trim();

        if(hasIngredients) {
            // convert string input into an array
            const ingredientsArray = excludedIngredients.split(",");

            // if array length <= 5, then loop over each ingredient in ingredients list array and append to DOM
            if (ingredientsArray.length > 5) {
                alert('Oops! The maximum number of ingredients to exclude from the recipe search is five (5). Please be sure to separate each ingredient with a comma (ex. beef, parsley, tomatoes).')
            } else {
                // loop over each ingredient and append to DOM
                ingredientsArray.forEach((ingredient) => {
                    // create <li> element
                    const ingredientItem = document.createElement('li');

                    // add text to <li>
                    ingredientItem.textContent = ingredient;

                    // add listItem class to <li>
                    ingredientItem.classList.add('listItem');
                    
                    // append ingredient list item to ul in DOM
                    ingredientsList.appendChild(ingredientItem);
                });

                // call function to get recipes from api based on user's input, which is used as the argument
                app.getRecipes(excludedIngredients);
            }
            
            // clear input box
            inputElement.value = '';

            // grey out add button
            addButton.disabled = true;
            removeButton.disabled = false;
        }
    });
// }

// get target button to clear list
const removeButton = document.querySelector('.remove');

// put in a function?
// add event listener to clear list button
removeButton.addEventListener('click', function() {
    ingredientsList.innerHTML = '';
    addButton.disabled = false;
    removeButton.disabled = true;
});

// create init method
app.init = () => {
    // app.getUserInput();
    // app.getRecipes();
}

// call init method
app.init();