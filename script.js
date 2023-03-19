// namespace object
const app = {};

// Define Variables:
app.apiKey = 'c8f1c1da6fe84ef6b510afbd3ad28f27';
// app.apiKey = "20a367ef2c2e4d4380d95b890faae49b";
app.apiUrl = "https://api.spoonacular.com/recipes/complexSearch"

// global array of cuisines already excluded from user choices
app.excludedCuisines = [
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

// global variables: (put in init function??)
// empty array to push user's ingredients
app.excludedIngredients = [];
// target add to list button
app.addButton = document.querySelector('.add');
// target remove list items button
app.removeButton = document.querySelector('.remove');
// target submit button
app.submitButton = document.querySelector('.submitBtn');
// get ul element to append list of excluded ingredients
app.ingredientsList = document.querySelector('.ingredientsList');

// function to pull recipe information from Spoonacular API based on user's choice(s)
app.getRecipes = (query1, query2) => {
    const url = new URL(app.apiUrl);
    // add search parameters to url
    url.search = new URLSearchParams({
        apiKey: app.apiKey,
        excludedCuisine: query1,
        excludeIngredients: query2,
        type: [
            'lunch',
            'main course',
            'main dish',
            'dinner'
        ],
        addRecipeInformation: true,
        sort: 'random',
        number: 3
    })
    fetch(url)
        .then(response => {
            return response.json();
        })
        .then(jsonResult => {
            app.displayRecipe(jsonResult);
        });
}

// function to display form
app.displayForm = () => {
    // target start button to begin use of app
    const startButton = document.querySelector('.startButton');

    // add event listener to start button
    startButton.addEventListener('click', function () {
        // target form sections
        const formSection = document.querySelector('.formSection');
        // remove 'hide' class to display form section
        formSection.classList.remove('hide');
    });
}

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
    randomCuisines.forEach((cuisine, index) => {
        // target HTML to append checkboxes
        const cuisineChoices = document.querySelector('.cuisineChoices');

        // create div element to populate with label and input
        const optionButton = document.createElement('div');
        optionButton.classList.add('optionButton');

        // add input/label HTML to div
        optionButton.innerHTML =
            `<input type="checkbox" id="cuisineOption${index}" name="cuisineOption" value="${cuisine}">
            <label for="cuisineOption${index}">${cuisine}</label>`;

        // append div with input[type='checkbox'] for each cuisine option to DOM
        cuisineChoices.appendChild(optionButton);
    });
}

// function to show more cuisine options
app.setShuffleListener = () => {
    // target the shuffle button
    const shuffleButton = document.querySelector('.shuffleBtn');
    // add click event listener to shuffle button
    shuffleButton.addEventListener('click', function () {
        // target cuisine choices container
        const cuisineChoices = document.querySelector('.cuisineChoices');
        // remove all cuisine options from container
        cuisineChoices.innerHTML = '';
        // re-display cuisine options
        app.displayCuisines();
    });
}

// function to display recipes to DOM
app.displayRecipe = (recipeArray) => {
    // target <ul> recipe container in HTML
    const recipesContainer = document.querySelector('.recipesContainer');

    // loop over each recipe item to create & append elements to <ul> recipe container
    recipeArray.results.forEach(recipe => {
        // create li element
        const listItem = document.createElement('li');
        listItem.classList.add('recipeCard');

        const recipeHTML = `
                <div class="recipeImageContainer">
                    <img src="${recipe.image}" alt="Image of ${recipe.title}">
                </div>

                <div class="recipeText flexContainer">
                    <a href="${recipe.sourceUrl}" className="recipeLink" target="_blank">
                        <h3>${recipe.title}</h3>
                    </a>
                </div>
            `;

        // append img & h3 to li
        listItem.innerHTML = recipeHTML;

        // append li to ul
        recipesContainer.appendChild(listItem);
    });
}

// function to add user's ingredients to list in html
app.addButtonListener = () => {
    // add event listener to add button
    app.addButton.addEventListener('click', function (event) {
        // prevent form from reloading
        event.preventDefault();
        // target input element
        const inputElement = document.getElementById('inputText');
        // store user input in a variable
        const userInput = inputElement.value;
        // convert user input to lowercase
        const excludedIngredients = userInput.toLowerCase();

        // if user input evaluates to truthy (i.e. input is a string & not empty)
        const hasIngredients = userInput.trim();

        if (hasIngredients) {
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
                    app.ingredientsList.appendChild(ingredientItem);

                    // push user's list of ingredients into global excluded ingredients array
                    app.excludedIngredients.push(ingredient);

                    // clear input box
                    inputElement.value = '';

                    // grey out add button
                    app.addButton.disabled = true;
                });
            }
            // make removeButton functional
            app.removeButton.disabled = false;
        }
    });
}

// function to clear list in html
app.removeButtonListener = () => {
    // add event listener to remove button
    app.removeButton.addEventListener('click', function (event) {
        // prevent form from reloading
        event.preventDefault();
        // remove ingredient list items from html
        app.ingredientsList.innerHTML = '';
        //reactivate use of add button
        app.addButton.disabled = false;
        // disable remove button
        app.removeButton.disabled = true;
        // empty excluded ingredients global array
        app.excludedIngredients.splice(0, app.excludedIngredients.length);
    });
}

// function to listen for form submit and get user's cuisine options
app.submitForm = () => {
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
                // console.log(checkbox);
                app.excludedCuisines.push(checkbox.value);
            }
            // clear all checkboxes on submit
            if (checkbox.checked) {
                checkbox.checked = false;
            }
        });

        // conditional statement to prevent api call if no input by user
        if (app.excludedCuisines.length === 14 && app.excludedIngredients.length === 0) {
            alert('You must at least choose to either exclude cuisine(s) OR ingredients (max: 5) to receive recipe suggestions. And if you are feeling particularly picky - fill out both!');
        } else { 
            // convert excludedCuisines array into a string
            const stringCuisines = app.excludedCuisines.toString();
            // convert excludedIngredients array into a string
            const stringIngredients = app.excludedIngredients.toString();
            console.log(stringCuisines, stringIngredients);
            // call app.getRecipes function with stringCuisines as arguments
            app.getRecipes(stringCuisines, stringIngredients);
        }
        // disable submit button
        app.submitButton.disabled = true;
        // clear ingredient list on submit
        app.ingredientsList.innerHTML = '';

        // disable remove button
        app.removeButton.disabled = true;
        
        // remove 'hide' class to display results section
        const resultsSection = document.querySelector('.resultsSection');
        resultsSection.classList.remove('hide');
    });
}

// function to remove previous recipe results and bring user back to form to start search again
app.startNewSearch = () => {
    const reset = document.querySelector('.reset');

    const recipesContainer = document.querySelector('.recipesContainer');

    const resultsSection = document.querySelector('.resultsSection');

    reset.addEventListener('click', function() {
        // remove results from html
        recipesContainer.innerHTML = '';
        //reactivate use of add button
        app.addButton.disabled = false;
        // reactivate submit button
        app.submitButton.disabled = false;
        // add 'hide' class to results section
        resultsSection.classList.add('hide');
    });
}

// init function to call methods 
app.init = () => {
    app.displayForm();
    app.displayCuisines();
    app.setShuffleListener();
    app.addButtonListener();
    app.removeButtonListener();
    app.submitForm();
    app.startNewSearch();
}

// call init function
app.init();