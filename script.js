// namespace object
const app = {};

// Define Global Variables:
// app.apiKey
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

    app.formSection = document.querySelector('.formSection');

// function to display form
app.displayForm = () => {
    // target start button to begin use of app
    const startButton = document.querySelector('.startButton');

    // add event listener to start button
    startButton.addEventListener('click', function () {
        // target form sections

        // const app.formSection = document.querySelector('.formSection');
        
        // remove 'hide' class to display form section
        const startPage = document.querySelector('.startingPage');
        startPage.classList.add('hide');
        app.formSection.classList.remove('hide');
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

// function to display recipes to DOM
app.displayRecipe = (recipeArray) => {
    // target <ul> recipe container in HTML
    const recipesContainer = document.querySelector('.recipesContainer');

    // loop over each recipe item to create & append elements to <ul> recipe container
    recipeArray.results.forEach(recipe => {
        console.log(recipe);
        // create li element
        const listItem = document.createElement('li');
        listItem.classList.add('recipeCard');

        // create img element
        // const recipeImage = document.createElement('img');

        // create h3 element
        // const recipeHeading = document.createElement('h3');

        // populate src & alt attributes of img elements
        // recipeImage.src = recipe.image;
        // recipeImage.alt = `Image of ${recipe.title}`

        // add text to h3
        // recipeHeading.textContent = recipe.title;

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
        // listItem.appendChild(recipeHeading);

        // append li to ul
        recipesContainer.appendChild(listItem);
    });

}

// https://spoonacular.com/recipeImages/157458-312x231.jpg
// https://spoonacular.com/recipeImages/666262-312x231.jpg

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

            // call app.getRecipes function with stringCuisines & stringIngredients as arguments
            app.getRecipes(stringCuisines, stringIngredients);

            // remove 'hide' class to display results section
            const resultsSection = document.querySelector('.resultsSection');
            resultsSection.classList.remove('hide');
            app.formSection.classList.add('hide');

            // clear ingredient list on submit
            app.ingredientsList.innerHTML = '';

            // disable input box & all form buttons
            app.inputBox.disabled = true;
            app.submitButton.classList.add('noHover');
            app.addButton.classList.add('noHover');
            app.removeButton.classList.add('noHover'); 
        }
    });
}

// function to display recipes to DOM
app.displayRecipe = (recipeArray) => {
    // console.log(recipeArray.results);

    // target <ul> recipe container in HTML
    const recipesContainer = document.querySelector('.recipesContainer');

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
        recipesContainer.appendChild(listItem);
    });
}

app.moreCuisines = () => {

    const recipesContainer = document.querySelector('.recipesContainer');
    const form = document.querySelector('form');
    const resubmitButton = document.querySelector('.resubmitBtn');


    resubmitButton.addEventListener('click', (event) => {

        event.preventDefault();

        // simulate form submission
        form.dispatchEvent(new Event('submit'));


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
    app.addButtonListener();
    app.removeButtonListener();
    app.submitForm();
    app.moreCuisines();
    // app.startNewSearch();
}

// call init function
app.init();