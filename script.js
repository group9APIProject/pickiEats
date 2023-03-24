// namespace object
const app = {};

// Define Variables:
app.apiKey = 'c8f1c1da6fe84ef6b510afbd3ad28f27';
// app.apiKey = "20a367ef2c2e4d4380d95b890faae49b";
app.apiUrl = "https://proxy.junocollege.com/https://api.spoonacular.com/recipes/complexSearch"

// global array of cuisines already excluded from user choices
// if global variable, then can name space it (app.excludedCuisines)
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
        number: 3
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
    shuffleButton.addEventListener('click', function (event) {
        // prevent page from reloading
        event.preventDefault();
        // target cuisine choices container
        const cuisineChoices = document.querySelector('.cuisineChoices');
        // remove all cuisine options from container
        cuisineChoices.innerHTML = '';
        // re-display cuisine options
        app.displayCuisines();
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

// function to display recipes to DOM
app.displayRecipe = (recipeArray) => {
    // target <ul> recipe container in HTML
    const recipesContainer = document.querySelector('.recipesContainer');

    // loop over each recipe item to create & append elements to <ul> recipe container
    recipeArray.results.forEach(recipe => {
        // console.log(recipe);
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
                console.log(checkbox);
                excludedCuisines.push(checkbox.value);
            }
        });

        // clear all checkboxes on submit

        // convert excludedCuisines array into a string
        const stringCuisines = excludedCuisines.toString();

        // disable remove button
        app.removeButton.disabled = true;
        
        // remove 'hide' class to display results section
        const resultsSection = document.querySelector('.resultsSection');
        resultsSection.classList.remove('hide');
    });
}

// function to display next section when user clicks button
app.displayNextSection = () => {
    // target start button to begin use of app
    const startButton = document.querySelector('.startButton');

    // target submit button to reveal section with recipe results
    const submitButton = document.querySelector('.submitBtn');

    // add event listener to start button
    startButton.addEventListener('click', function () {
        // target form sections
        const formSection = document.querySelector('.formSection');
        // remove 'hide' class to display form section
        formSection.classList.toggle('hide');
    });

    // add event listener to submit button
    submitButton.addEventListener('click', function () {
        // target results section
        const resultsSection = document.querySelector('.resultsSection');
        // remove 'hide' class to display results section
        resultsSection.classList.toggle('hide');

        // app.scrollToSection();
        // window.scrollBy(0, window.innerHeight);

        // window.scroll({
        //     top: 1000,
        //     left: 0,
        //     behavior: 'smooth'
        // });
    });
}

// app.scrollToSection = () => {
//     const section = document.querySelector('.resultsHeading');
//     section.scrollIntoView({ behavior: 'smooth' });
// }

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

// init function to call methods 
app.init = () => {
    app.displayNextSection();
    app.setShuffleListener();
    app.displayCuisines();
    app.setShuffleListener();
    app.addButtonListener();
    app.removeButtonListener();
    app.submitForm();
    app.startNewSearch();
}

// call init function
app.init();