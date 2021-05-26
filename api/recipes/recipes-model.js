const db = require('../../data/db-config.js');


const getAll = async () => {
  const recipes = await db('recipes');
  return recipes;
}

const getAllByUser = async (user_id) => {
  const recipes = await db('recipes').where('user_id', user_id);
  return recipes;
}

const getRecipeById = async (recipe_id) => {
  const recipe = await db('recipes').where('recipe_id', recipe_id).first();
  return recipe;
}

const addRecipe = async (recipe) => {
  const newRecipe = await db('recipes').insert(recipe, ['recipe_id', 'recipe_title', 'source', 'ingredients', 'instructions', 'category', 'user_id']);
  return newRecipe[0];
}

const updateRecipe = async (recipe) => {
  const { recipe_id } = recipe;
  await db('recipes').where("recipe_id", recipe_id).update(recipe);
  const updatedRecipe = await getRecipeById(recipe_id);
  return updatedRecipe;
}

const deleteRecipe = async (recipe_id) => {
  const recipe = await getRecipeById(recipe_id);
  await db('recipes').where("recipe_id", recipe_id).delete();
  return recipe;
}

module.exports = { getAll, getAllByUser, getRecipeById, addRecipe, updateRecipe, deleteRecipe }