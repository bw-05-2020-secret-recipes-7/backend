### ENDPOINTS
base url: https://ft-secret-recipes-7.herokuapp.com/
### USERS

User Logins 

username: grandma password: 1234

username: ryan password: 1234


| User Action | METHOD | ROUTE                      | SEND TO DB                           | INFO                                     |
| :---------: | :----: | -------------------------- | ------------------------------------ | ---------------------------------------- |
|    Login    |  POST  | /api/auth/login            | { username, password}                | Login                                    |    
|   Create    |  POST  | /api/auth/register         | { username, password, phone }        | Creates new user                         |


### Recipes

| User Action | METHOD | ROUTE                          | SEND TO DB                                                                | INFO                              |
| :---------: | :----: | ------------------------------ | ------------------------------------------------------------------------- | --------------------------------- |
|    Read     |  GET   | /api/recipes                   | n/a                                                                       | Gets list of all recipes          |
|    Read     |  GET   | /api/recipes/:user_id          | n/a                                                                       | Get a list of user recipes by id  |
|   Create    |  POST  | /api/recipes/:user_id          | { recipe_title, ingredients, instructions, category, user_id }            | Creates new recipe                |
|    Read     |  GET   | /api/recipes/recipe/:recipe_id | n/a                                                                       | Gets a specific recipe by id      |
|    Edit     |  PUT   | /api/recipes/recipe/:recipe_id | { recipe_id, recipe_title, ingredients, instructions, category, user_id } | Edits a recipe (recipe by id)     |
|     Del     | DELETE | /api/recipes/recipe/:recipe_id | n/a                                                                       | Deletes recipe (recipe by id)     |
