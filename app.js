const searchForm = document.getElementById('search-form');
const dishNameInput = document.getElementById('dish-name');
const dietaryFilters = document.getElementsByName('diet');
const recipesDiv = document.getElementById('recipes');
const messageDiv = document.getElementById('message');
const randomRecipeButton = document.getElementById('random-recipe-button');
const recipeModal = document.getElementById('recipe-modal');
const recipeStepsDiv = document.getElementById('recipe-steps');


const apiKey = 'a7d528374129456e834519791a065f24';
const apiUrl = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${apiKey}&query=`;
const recipeDetailUrl = `https://api.spoonacular.com/recipes/`;
const randomRecipeUrl = `https://api.spoonacular.com/recipes/random?apiKey=${apiKey}`;

searchForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const dishName = dishNameInput.value.trim();
  const selectedDiets = Array.from(dietaryFilters).filter(filter => filter.checked).map(filter => filter.value);
  const dietQuery = selectedDiets.length > 0 ? `&diet=${selectedDiets.join(',')}` : '';
  fetch(`${apiUrl}${dishName}${dietQuery}`)
    .then(response => response.json())
    .then(data => {
      const recipes = data.results;
      recipesDiv.innerHTML = '';
      messageDiv.innerHTML = '';
      if (recipes.length > 0) {
        recipes.forEach(recipe => {
          const recipeDiv = document.createElement('div');
          recipeDiv.className = 'recipe';
          recipeDiv.innerHTML = `
            <img src="${recipe.image}" alt="${recipe.title}">
            <h2>${recipe.title}</h2>
            <button onclick="getRecipeDetails(${recipe.id})">View Steps</button>
          `;
          recipesDiv.appendChild(recipeDiv);
        });
        window.scrollTo({
          top: recipesDiv.offsetTop,
          behavior: 'smooth'
        });
      } else {
        messageDiv.textContent = "We apologize but we could not find this dish.";
      }
    });
});

randomRecipeButton.addEventListener('click', () => {
  fetch(randomRecipeUrl)
    .then(response => response.json())
    .then(data => {
      const recipe = data.recipes[0];
      recipesDiv.innerHTML = '';
      messageDiv.innerHTML = '';
      const recipeDiv = document.createElement('div');
      recipeDiv.className = 'recipe';
      recipeDiv.innerHTML = `
        <img src="${recipe.image}" alt="${recipe.title}">
        <h2>${recipe.title}</h2>
        <button onclick="getRecipeDetails(${recipe.id})">View Steps</button>
      `;
      recipesDiv.appendChild(recipeDiv);
      window.scrollTo({
        top: recipesDiv.offsetTop,
        behavior: 'smooth'
      });
    });
});

function getRecipeDetails(recipeId) {
  fetch(`${recipeDetailUrl}${recipeId}/information?apiKey=${apiKey}`)
    .then(response => response.json())
    .then(recipe => {
      recipeStepsDiv.innerHTML = `<h2>${recipe.title}</h2>`;
      
      
      const ingredientsList = document.createElement('ul');
      ingredientsList.innerHTML = '<h3>Ingredients:</h3>';
      recipe.extendedIngredients.forEach(ingredient => {
        const ingredientItem = document.createElement('li');
        ingredientItem.textContent = `${ingredient.original}`;
        ingredientsList.appendChild(ingredientItem);
      });
      recipeStepsDiv.appendChild(ingredientsList);

    
      const stepsList = document.createElement('ol');
      stepsList.innerHTML = '<h3>Steps:</h3>';
      recipe.analyzedInstructions[0].steps.forEach(step => {
        const stepItem = document.createElement('li');
        stepItem.textContent = step.step;
        stepsList.appendChild(stepItem);
      });
      recipeStepsDiv.appendChild(stepsList);

      recipeModal.style.display = 'block';
    });
}

function closeModal() {
  recipeModal.style.display = 'none';
}
