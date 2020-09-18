exports.up = function(knex) {
    return(
        knex.schema
        //users
        .createTable('users', users => {
            users.increments('id')
            users.string('username', 255)
            .notNullable()
            .unique();
            users.string('password', 255)
            .notNullable();
            users.text('imageURL');
            users.string('created')
            users.string('updated')
            .notNullable()
        })

        //recipes
        .createTable('recipes', recipes => {
            recipes.increments('id')
            recipes.integer('userId', 255)
            .notNullable()
            .references('users.id')
            .onDelete('CASCADE')
            .onUpdate('CASCADE');
            recipes.string('recipeName', 255)
            .notNullable()
            recipes.text('description');
            recipes.text('imageURL');
            recipes.string('prepTime');
            recipes.string('cookTime');
            recipes.string('yields');
            recipes.string('created')
            .notNullable();
            recipes.string('updated')
        })
        //steps
        .createTable('steps', steps => {
            steps.increments('id')
            steps.integer('recipeId', 255)
            .references('recipes.id')
            .onDelete('CASCADE')
            .onUpdate('CASCADE');
            steps.integer('stepNum', 255)
            .notNullable();
            steps.text('stepInstruction')
            .notNullable();
        })
    
        //ingredients
        .createTable('ingredients', ingredients => {
            ingredients.increments('id')
            ingredients.string('ingredientName', 255)
            .unique()
            .notNullable();
        })

        //foreign key
        .createTable('recipe_ingredients', recipe_ingredients => {
            recipe_ingredients.increments('id')
            //recipeId
            recipe_ingredients.integer('recipeId', 255)
            .notNullable()
            .references('recipes.id')
            .onDelete('CASCADE')
            .onUpdate('CASCADE');
            //ingredientId
            recipe_ingredients.integer('ingredientId')
            .notNullable()
            .references('ingredients.id')
            .onDelete('CASCADE')
            .onUpdate('CASCADE');
            recipe_ingredients.string('amount', 255)
        })
    )
};

exports.down = function(knex) {
  return knex.schema
  .dropTableIfExists('recipe_ingredients')
  .dropTableIfExists('ingredients')
  .dropTableIfExists('steps')
  .dropTableIfExists('recipes')
  .dropTableIfExists('users')
};