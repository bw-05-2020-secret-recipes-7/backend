const router = require("express").Router();
const Recipes = require("./recipes-model.js");

router.get('/', (req, res, next) => {
  Recipes.getAll()
    .then(recipes => {
      res.status(200).json(recipes);
    })
    .catch(next);
});

router.get("/:user_id", (req, res, next) => {
  Recipes.getAllByUser(req.params.user_id)
    .then(recipes => {
      res.status(200).json(recipes);
    })
    .catch(next);
});

router.get("/recipe/:recipe_id", (req, res, next) => {
  Recipes.getRecipeById(req.params.recipe_id)
    .then(recipe => {
      res.status(200).json(recipe);
    })
    .catch(next);
});

router.post('/:user_id', (req, res, next) => {
  Recipes.addRecipe(req.body)
    .then(recipe => {
      res.status(201).json(recipe);
    })
    .catch(next);
});

router.put("/recipe/:recipe_id", (req, res, next) => {
  const { recipe_id } = req.params;
  Recipes.updateRecipe({...req.body, recipe_id})
    .then(recipe => {
      res.status(200).json(recipe);
    })
    .catch(next);
});

router.delete("/recipe/:recipe_id", (req, res, next) => {
  const { recipe_id } = req.params;
  Recipes.deleteRecipe(recipe_id)
    .then(recipe => {
      res.status(200).json(recipe);
    })
    .catch(next);
});

module.exports = router;