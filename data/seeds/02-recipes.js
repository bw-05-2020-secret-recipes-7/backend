exports.seed = async function(knex) {
  return knex('recipes').insert([   
    { recipe_title: 'Scrambled Eggs',
      source: 'me',
      ingredients: '4 eggs, 3 tblsps whole milk, pinch salt, pinch pepper, shredded cheese (optional)',
      instructions: '1. Preheat pan; while pan is heating, beat eggs in bowl and add milk 2. Add butter or oil to heated pan, then pour in egg and milk mixture 3. Periodically stir eggs in pan with spoon or spatula. As it cooks, mixture starts to solidify. If desired, add shredded cheese 4. Once egg mixture has reached desired level of done-ness, remove from heat and add salt and pepper as desired',
      category: 'breakfast',
      user_id: 1
    },
    { recipe_title: 'Chocolate Ice Cream',
      ingredients: '3 scoops chocoloate ice cream, toppings (as desired)',
      instructions: '1. Get ice cream out of freezer and let sit for 10 minutes to soften 2. Scoop ice cream into bowl 3. Add desired toppings',
      category: 'dessert',
      user_id: 2
    },
    { recipe_title: 'Succotash',
      source: 'me',
      ingredients: '2 cups fresh lima beans, 2 cups fresh corn, 4 slices bacon',
      instructions: '1. Chop bacon slices into small pieces. 2. Add bacon to preheated frying pan with a dash of baking grease or oil and sautee for 5 minutes at medium heat. 3. Add fresh lima beans and corn and 1 cup water. 4. Bring to boil, stirring occasionally 5. Reduce heat to low, cover, and simmer until veggies are fully cooked. ',
      category: 'sides - veggies',
      user_id: 1
    }
  ]);
};