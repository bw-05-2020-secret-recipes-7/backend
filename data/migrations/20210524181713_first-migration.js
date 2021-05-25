exports.up = async function(knex) {
  return await knex.schema
    .createTable('users', users => {
      users.increments('user_id')
      users.string('username', 128).notNullable().unique()
      users.string('password', 128).notNullable()
    })
    .createTable('recipes', recipes => {
      recipes.increments('recipe_id');
      recipes.string('recipe_title', 128).notNullable().unique();
      recipes.string('source', 128);
      recipes.string('ingredients', 512).notNullable();
      recipes.string('instructions', 512).notNullable();
      recipes.string('category', 128);
      recipes.integer('user_id')
        .unsigned()
        .notNullable()
        .references('user_id')
        .inTable('users')
        .onUpdate('RESTRICT')
        .onDelete('RESTRICT');
    });
};

exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('recipes')
    .dropTableIfExists('users');
};
