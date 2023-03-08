const form = document.querySelector('form');
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
    console.log(checkboxes)

});
const app = {};


app.displayCuisines = () => {
    const cuisineOptions = ['american', 'chinese', 'italian', 'mexican', 'thai', 'japanese', 'french', 'indian', 'greek', 'spanish', 'korean', 'Middle Eastern'];


    // Select 4 random cuisine options from the array
    const randomCuisines = [];
    while (randomCuisines.length < 4) {
        const randomIndex = Math.floor(Math.random() * cuisineOptions.length);
        const randomCuisine = cuisineOptions[randomIndex];
        if (!randomCuisines.includes(randomCuisine)) {
            randomCuisines.push(randomCuisine);
        }
    }

    // Append the random cuisine options to the HTML form labels
    const cuisineOptionLabels = document.querySelectorAll('.option1, .option2, .option3, .option4');
    for (let i = 0; i < cuisineOptionLabels.length; i++) {
        cuisineOptionLabels[i].textContent = randomCuisines[i];
    }
}





const excludedCuisines = ['African',
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

// store the selected checked boxes and push them into excludedCuisines array
const checkedBoxes = [];



// app.apiKey = 'c8f1c1da6fe84ef6b510afbd3ad28f27';
//     // app.apiKey = "20a367ef2c2e4d4380d95b890faae49b";
//     app.apiUrl = "https://api.spoonacular.com/recipes/complexSearch"

//     // https://api.spoonacular.com/food/products/search?query=yogurt&apiKey=API-KEY

//     app.getRecipes = () => {
//         const url = new URL(app.apiUrl);

//         url.search = new URLSearchParams({
//             apiKey: app.apiKey,

//             excludedCuisine:  '', 




//             // type: [
//             //     // 'side dish'
//             //     // 'appetizer',
//             //     'lunch',
//             //     'main course',
//             //     'main dish',
//             //     'dinner'
//             // ],
//             // addRecipeInformation: true,
//             // addRecipeNutrition: true,
//             // sort: 'random',
//             // instructionsRequired: true,
//             // // limitLicense: true,
//             // number: 2

//             // excludeCuisine: 'var','middle eastern','spanish','thai'
//             // excludeIngredient: 'parsley'
//         })

//         fetch(url)
//             .then(response => {
//                 return response.json();
//             })
//             .then(jsonResult => {
//                 console.log(jsonResult);
//                 app.displayRecipe(jsonResult);
//         });
//     }


//     app.displayRecipe = (recipeArray) => {

//         console.log(recipeArray.results);

//         const recipes = document.querySelector('.recipes');

//         // loop 
//         recipeArray.results.forEach(recipe => {
//             // create li element
//             const listItem = document.createElement('li');
//             // create img element
//             const recipeImage = document.createElement('img');
//             // create h2 element
//             const recipeHeading = document.createElement('h2');

//             recipeImage.src = recipe.image;
//             recipeHeading.textContent = recipe.title;

//             listItem.appendChild(recipeImage);
//             listItem.appendChild(recipeHeading);

//             recipes.appendChild(listItem);
//         });

//     }
app.init = () => {
    app.displayCuisines();
    // app.getRecipes();
}
app.init();