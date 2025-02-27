// Our secret key to use the Spoonacular API (don’t share this publicly!)
const apiKey = "924bdd3a22964d7bbd7c231ce8a5ba3a";

// Keeps track of whether we want vegetarian recipes (starts as false = non-veg)
let isVegetarian = false;

// Updates isVegetarian when the toggle is clicked
function toggleDiet() {
    isVegetarian = document.getElementById("vegToggle").checked; // True if checked, false if not
}

// This function searches for recipes when the button is clicked
async function searchRecipes() {
    // Get what your friend typed in the input field and remove extra spaces
    let ingredients = document.getElementById("ingredientInput").value.trim();
    
    // If nothing was typed, show an alert and stop
    if (!ingredients) {
        alert("Please enter some ingredients!");
        return;
    }

    // If the toggle is on (vegetarian), add "vegetarian, veg" to the search
    if (isVegetarian) {
        ingredients += ", vegetarian, veg";
    }

    // Build the API URL with our key, ingredients, and a limit of 20 recipes
    const url = `https://api.spoonacular.com/recipes/findByIngredients?apiKey=${apiKey}&ingredients=${ingredients}&number=20`;

    // Try to get data from the API
    try {
        const response = await fetch(url); // Send a request to the API
        if (!response.ok) { // Check if the request failed
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const recipes = await response.json(); // Convert the response to usable data
        displayRecipes(recipes); // Show the recipes on the page
    } catch (error) { // If something goes wrong (e.g., bad internet or wrong API key)
        console.error("Error fetching recipes:", error); // Log the error for debugging
        document.getElementById("recipeResults").innerHTML = `<p>Sorry, something went wrong: ${error.message}. Check your API key or try again later.</p>`;
    }
}

// This function takes the recipes from the API and puts them on the page
function displayRecipes(recipes) {
    const resultsDiv = document.getElementById("recipeResults"); // The div where recipes go
    resultsDiv.innerHTML = ""; // Clear out old results

    // If no recipes were found or something’s wrong with the data
    if (!Array.isArray(recipes) || recipes.length === 0) {
        resultsDiv.innerHTML = "<p>No recipes found. Try different ingredients or check your API key!</p>";
        return;
    }

    // Loop through each recipe and make a card for it
    recipes.forEach(recipe => {
        const recipeCard = document.createElement("div"); // Create a new div for the card
        recipeCard.className = "recipe-card"; // Add the recipe-card styling

        // Make lists of used and missed ingredients
        let usedList = recipe.usedIngredients.map(ing => `<li class="used">${ing.amount} ${ing.unit} ${ing.name}</li>`).join("");
        let missedList = recipe.missedIngredients.map(ing => `<li class="missed">${ing.amount} ${ing.unit} ${ing.name}</li>`).join("");

        // Fill the card with the recipe’s image, title, and ingredients
        recipeCard.innerHTML = `
            <img src="${recipe.image}" alt="${recipe.title}">
            <div class="content">
                <h3>${recipe.title}</h3>
                <ul>${usedList}${missedList}</ul>
            </div>
        `;
        resultsDiv.appendChild(recipeCard); // Add the card to the page
    });
}
