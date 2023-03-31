// namespace object
const app = {};

// Define Global Variables:

// app.apiKey = 'c8f1c1da6fe84ef6b510afbd3ad28f27';
app.apiKey = "20a367ef2c2e4d4380d95b890faae49b";

// recipe complex search endpoint
app.apiUrl = "https://proxy.junocollege.com/https://api.spoonacular.com/recipes/complexSearch";

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

// empty array to push user's ingredients
app.excludedIngredients = [];
// target input box 
app.inputBox = document.querySelector('input[type="text"]');
// target add button
app.addButton = document.querySelector('.add');
// target remove button
app.removeButton = document.querySelector('.remove');
// target submit button
app.submitButton = document.querySelector('.submitBtn');
// get ul element to append list of excluded ingredients
app.ingredientsList = document.querySelector('.ingredientsList');
// target form section
app.form = document.querySelector('.formSection');
// target recipes container
app.recipesContainer = document.querySelector('.recipesContainer');
// target start page
app.startPage = document.querySelector('.startingPage');
// function to pull recipe information from Spoonacular API based on user's choice(s)

app.getRecipes = (query1, query2) => {
    const url = new URL(app.apiUrl);
    // add search parameters to url
    url.search = new URLSearchParams({
        apiKey: app.apiKey,
        excludeCuisine: query1,
        excludeIngredients: query2,
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

        // const app.formSection = document.querySelector('.formSection');

        // remove 'hide' class to display form section
       
        app.startPage.classList.add('hide');
        app.form.classList.remove('hide');
    });
}


// function to display cuisine options in HTML
app.displayCuisines = () => {
    // array of cuisine options 
    const cuisineOptions = ['American', 'Chinese', 'Italian', 'Mexican', 'Thai', 'Japanese', 'French', 'Indian', 'Greek', 'Spanish', 'Korean', 'Middle Eastern'];

    // loop over each cuisine item in randomCuisines array to create HTML elements and append to form
    cuisineOptions.forEach((cuisine, index) => {
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

        // if input box is not empty
        if (hasIngredients) {
            // search for numeric characters in input string
            const number = /[0-9]+/;
            // if returns -1, then number absent
            const numAbsent = hasIngredients.search(number);
            // search for special characters in input string
            const specialChar = /[~`!@#$%\^.&*()\-.=+\\.|\[.{}\].:"';\\.<>\/.?]/;
            const specialCharAbsent = hasIngredients.search(specialChar);

            // if input does not include a number AND special character
            if (numAbsent === -1 && specialCharAbsent === -1) {
                // convert string input into an array
                const ingredientsArray = excludedIngredients.split(",");

                // if array length <= 5, then loop over each ingredient in ingredients list array and append to DOM
                if (ingredientsArray.length > 5) {
                    alert('Oops! The maximum number of ingredients to exclude from the recipe search is five (5). Please be sure to separate each ingredient with a comma (ex. beef, parsley, tomatoes).')

                    // clear input box
                    inputElement.value = '';
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
                        app.addButton.classList.add('noHover');
                        // disable input text box
                        app.inputBox.disabled = true;

                        // make removeButton functional
                        app.removeButton.classList.remove('noHover');
                    });
                }
            } else {
                alert('Oops! Try again. Please use alpha characters only (a-z) and comma(s) to separate each ingredient if more than one (maximum: 5; ex. peanuts, egg, mushroom, fish, cilantro).');

                // clear input box
                inputElement.value = '';
            }
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
        // reactivate input text box
        app.inputBox.disabled = false;
        //reactivate use of add button
        app.addButton.classList.remove('noHover');;
        // disable remove button
        app.removeButton.classList.add('noHover');
        // empty excluded ingredients global array
        app.excludedIngredients.splice(0, app.excludedIngredients.length);
    });
}



// function to listen for form submit and get user's cuisine options
app.submitForm = () => {

    // add event listener to form
    app.form.addEventListener('submit', function (event) {
        // prevent form from reloading
        event.preventDefault();

        // store the selected checked boxes and push them into global excludedCuisines array
        const checkboxes = event.target.querySelectorAll('input[type = "checkbox"]');

        // loop over checkboxes
        checkboxes.forEach((checkbox) => {
            // if checkbox.checked === true
            if (checkbox.checked) {
                // then push value of checked input into global excludedCuisines array
                app.excludedCuisines.push(checkbox.value);
                // clear all checkboxes on submit
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

            // call app.getRecipes function with stringCuisines & stringIngredients as arguments
            app.getRecipes(stringCuisines, stringIngredients);

            // remove 'hide' class to display results section
            const resultsSection = document.querySelector('.resultsSection');
            resultsSection.classList.remove('hide');

            // clear ingredient list on submit
            app.ingredientsList.innerHTML = '';

            // disable input box & all form buttons
            app.inputBox.disabled = true;
            app.addButton.classList.add('noHover');
            app.removeButton.classList.add('noHover');
            app.submitButton.classList.add('noHover');

            app.form.classList.add('hide');
        }
    });
}

// function to display recipes to DOM
app.displayRecipe = (recipeArray) => {

    // loop over each recipe item to create & append elements to <ul> recipe container
    recipeArray.results.forEach(recipe => {
        // create li element
        const listItem = document.createElement('li');
        listItem.classList.add('recipeCard');

        const recipeHTML = `
            <!-- recipe image container -->
            <div class="recipeImageContainer">
                <img src="${recipe.image}" alt="Image of ${recipe.title}">
            </div>

            <!-- recipe information -->
            <div class="recipeText">
                <!-- recipe link -->
                <a href="${recipe.sourceUrl}" class="recipeLink" target="_blank">
                    <p class="sr-only">To read recipe, click to open it in a new page.</p>

                    <!-- recipe title -->
                    <h3>${recipe.title}</h3>

                    <!-- prep time -->
                    <p><i class="far fa-clock" aria-hidden="true"></i> Prep time: ${recipe.readyInMinutes} mins</p>
                    <!-- servings -->
                    <p><i class="fas fa-utensils" aria-hidden="true"></i> Serves: ${recipe.servings}</p>
                </a><!-- recipe link ends -->
            </div><!-- recipe information ends -->
        `;

        // append HTML to li
        listItem.innerHTML = recipeHTML;
        // append li to ul
        app.recipesContainer.appendChild(listItem);
    });
}

// function to remove previous recipe results and bring user back to form to start search again
app.startNewSearch = () => {
    // target 'reset' button
    const reset = document.querySelector('.reset');
    
    // target results section
    const resultsSection = document.querySelector('.resultsSection');

    // add event listener to reset button
    reset.addEventListener('click', function () {
        // removed user's addition of excluded cuisines from  global array
        app.excludedCuisines.splice(14, app.excludedCuisines.length);
        // empty excluded ingredients global array
        app.excludedIngredients.splice(0, app.excludedIngredients.length);

        console.log(app.excludedCuisines, app.excludedIngredients);

        // remove results from html
        app.recipesContainer.innerHTML = '';
        // reactivate input text box
        app.inputBox.disabled = false;
        //reactivate use of add button
        app.addButton.classList.remove('noHover');
        // reactivate submit button
        app.submitButton.classList.remove('noHover');
        // add 'hide' class to results section
        resultsSection.classList.add('hide');

        app.startPage.classList.remove('hide');

    });
}

app.moreCuisines = () => {

    
    const resubmitButton = document.querySelector('.resubmitBtn');


    resubmitButton.addEventListener('click', (event) => {

        event.preventDefault();

        // simulate form submission
        app.form.dispatchEvent(new Event('submit'));


        // const stringCuisines = app.excludedCuisines.toString();
        // convert excludedIngredients array into a string
        // const stringIngredients = app.excludedIngredients.toString();



        // call app.getRecipes function with stringCuisines & stringIngredients as arguments
        // app.getRecipes(stringCuisines, stringIngredients);



    });
}

// init function to call methods 
app.init = () => {
    app.displayForm();
    app.displayCuisines();
    // app.setShuffleListener();
    app.addButtonListener();
    app.removeButtonListener();
    app.submitForm();
    app.startNewSearch();
    app.moreCuisines();

}

// call init function
app.init();