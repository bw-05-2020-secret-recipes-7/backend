const request = require('supertest');
const server = require('./server');
const db = require('../data/db-config');
const bcrypt = require('bcryptjs');
const jwtDecode = require('jwt-decode');

beforeAll(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
});

beforeEach(async () => {
  await db.seed.run()
});

afterAll(async (done) => {
  await db.seed.run()
  await db.destroy()
  done()
});


it('sanity check', () => {
  expect(true).not.toBe(false)
});

const testCredentials = [
  { username: 'grandma', password: '1234' },
  { username: 'ryan', password: '1234' },
  { username: 'g-mom', password: '1234' },
  { username: 'ryan', password: '12345' },
  { username: 'mom' },
  { password: '12345' },
  { username: 'mom', password: '1234' }
];

const seedRecipes = [   
  { 
    recipe_title: 'Scrambled Eggs',
    source: 'me',
    ingredients: '4 eggs, 3 tblsps whole milk, pinch salt, pinch pepper, shredded cheese (optional)',
    instructions: '1. Preheat pan; while pan is heating, beat eggs in bowl and add milk 2. Add butter or oil to heated pan, then pour in egg and milk mixture 3. Periodically stir eggs in pan with spoon or spatula. As it cooks, mixture starts to solidify. If desired, add shredded cheese 4. Once egg mixture has reached desired level of done-ness, remove from heat and add salt and pepper as desired',
    category: 'breakfast',
    user_id: 1
  },
  {
    recipe_title: 'Chocolate Ice Cream',
    ingredients: '3 scoops chocoloate ice cream, toppings (as desired)',
    instructions: '1. Get ice cream out of freezer and let sit for 10 minutes to soften 2. Scoop ice cream into bowl 3. Add desired toppings',
    category: 'dessert',
    user_id: 2
  },
  { 
    recipe_title: 'Succotash',
    source: 'me',
    ingredients: '2 cups fresh lima beans, 2 cups fresh corn, 4 slices bacon',
    instructions: '1. Chop bacon slices into small pieces. 2. Add bacon to preheated frying pan with a dash of baking grease or oil and sautee for 5 minutes at medium heat. 3. Add fresh lima beans and corn and 1 cup water. 4. Bring to boil, stirring occasionally 5. Reduce heat to low, cover, and simmer until veggies are fully cooked. ',
    user_id: 1
  }
];

const testRecipes = [
  { 
    recipe_title: 'Fried Eggs',
    source: 'me',
    ingredients: '2 eggs',
    instructions: '1. Preheat pan 2. Add butter or oil to heated pan, then crack eggs 3. Cook to desirel level of done-ness. Flip if desired halfway through for over-easy',
    category: 'breakfast',
    user_id: 2
  },
  {
    recipe_title: 'Cookie Dough Ice Cream',
    ingredients: '3 scoops cookie dough ice cream, toppings (as desired)',
    instructions: '1. Get ice cream out of freezer and let sit for 10 minutes to soften 2. Scoop ice cream into bowl 3. Add desired toppings',
    category: 'dessert',
    user_id: 2
  },
  { 
    recipe_title: 'Fried Eggs',
    source: 'Dad',
    ingredients: '2 eggs',
    instructions: '1. Preheat pan 2. Add butter or oil to heated pan, then crack eggs 3. Cook to desirel level of done-ness. Flip if desired halfway through for over-easy',
    category: 'breakfast',
    user_id: 2
  }
];

describe('server.js', () => {

  describe('[POST] /api/auth/login', () => {
    it('Responds with the correct message on valid credentials', async () => {
      const res = await request(server).post('/api/auth/login').send(testCredentials[0]);
      expect(res.body.message).toMatch(/welcome grandma/i);
    });
    it('responds with the correct status and message on invalid username', async () => {
      const res = await request(server).post('/api/auth/login').send(testCredentials[2]);
      expect(res.body.message).toMatch(/invalid username/i);
      expect(res.status).toBe(401);
    });
    it('responds with the correct status and message on invalid password', async () => {
      const res = await request(server).post('/api/auth/login').send(testCredentials[3]);
      expect(res.body.message).toMatch(/invalid password/i);
      expect(res.status).toBe(401);
    });
    it('responds with the correct status and message on missing credentials', async () => {
      let res = await request(server).post('/api/auth/login').send(testCredentials[4]);
      expect(res.body.message).toMatch(/username and password required/i);
      expect(res.status).toBe(422);
      res = await request(server).post('/api/auth/login').send(testCredentials[5]);
      expect(res.body.message).toMatch(/username and password required/i);
      expect(res.status).toBe(422);
    });
    it('responds with a token with correct login', async () => {
      let res = await request(server).post('/api/auth/login').send(testCredentials[0]);
      let decoded = jwtDecode(res.body.token);
      expect(decoded).toHaveProperty('iat');
      expect(decoded).toHaveProperty('exp');
      expect(decoded).toMatchObject({
        sub: 1,
        username: 'grandma'
      });
      res = await request(server).post('/api/auth/login').send(testCredentials[1]);
      decoded = jwtDecode(res.body.token);
      expect(decoded).toHaveProperty('iat');
      expect(decoded).toHaveProperty('exp');
      expect(decoded).toMatchObject({
        sub: 2,
        username: 'ryan'
      });
    });
  });

  describe('[POST] /api/auth/register', () => {
    it('creates a new user in the database and responds with the new user object when proper credentials provided', async () => {
      const res = await request(server).post('/api/auth/register').send(testCredentials[6]);
      expect(res.body).toMatchObject({ user_id: 3, username: 'mom' });
      expect(res.status).toEqual(201);
    });
    it('saves the user with a bcrypted password instead of plain text', async () => {
      const newUser = await request(server).post('/api/auth/register').send(testCredentials[6]);
      expect(bcrypt.compareSync('1234', newUser.body.password)).toBeTruthy();
    });
    it('resonds w/proper message if username or password missing', async () => {
      let res = await request(server).post('/api/auth/register').send(testCredentials[4]);
      expect(res.body.message).toMatch(/username and password required/i);
      res = await request(server).post('/api/auth/register').send(testCredentials[5]);
      expect(res.body.message).toMatch(/username and password required/i);
    });
    it("resonds w/proper message if username already exists", async () => {
      const res = await request(server).post('/api/auth/register').send(testCredentials[3]);
      expect(res.body.message).toMatch(/username unavailable/i);
    });
  });

  describe('[GET] /api/recipes', () => {
    it('requests without a token are bounced with proper status and message', async () => {
      let res = await request(server).get('/api/recipes');
      expect(res.status).toEqual(401);
      expect(res.body.message).toMatch(/login to access recipe database/i);
      res = await request(server).get('/api/recipes/1');
      expect(res.status).toEqual(401);
      expect(res.body.message).toMatch(/login to access recipe database/i);
    });
    it('requests with an invalid token are bounced with proper status and message', async () => {
      const res = await request(server).get('/api/recipes').set('Authorization', 'foobar');
      expect(res.status).toEqual(401);
      expect(res.body.message).toMatch(/invalid token. please login to access recipes/i);
    });
    it('requests with a valid token obtain a list of all recipes', async () => {
      let res = await request(server).post('/api/auth/login').send({ username: 'grandma', password: '1234' });
      res = await request(server).get('/api/recipes').set('Authorization', res.body.token);
      expect(res.body).toMatchObject(seedRecipes);
    });
    it('requests with a valid token obtain a list of user recipes', async () => {
      let res = await request(server).post('/api/auth/login').send({ username: 'grandma', password: '1234' });
      res = await request(server).get('/api/recipes/1').set('Authorization', res.body.token);
      expect(res.body).toMatchObject([seedRecipes[0], seedRecipes[2]]);
    });
  });

  describe('[POST] /api/recipes/:user_id', () => {
    it('creates a new recipe in the database and responds with recipe object when provided with valid data object ', async () => {
      let res = await request(server).post('/api/auth/login').send({ username: 'ryan', password: '1234' });
      res = await request(server).post('/api/recipes/2').send(testRecipes[0]).set('Authorization', res.body.token);
      expect(res.body).toMatchObject({recipe_id: 4, ...testRecipes[0]});
    });
  });

  describe('[PUT] /api/recipes/recipe/:recipe_id', () => {
    it('updates an existing recipe in the database and responds with updated recipe object when provided with valid data', async () => {
      let res = await request(server).post('/api/auth/login').send({ username: 'ryan', password: '1234' });
      res = await request(server).put('/api/recipes/recipe/2').send(testRecipes[1]).set('Authorization', res.body.token);
      expect(res.body).toMatchObject({recipe_id: 2, ...testRecipes[1]});
    });
  });

  describe('[DELETE] /api/recipes/recipe/:recipe_id', () => {
    it('deletes an existing recipe in the database and responds with deleted recipe object', async () => {
      let res = await request(server).post('/api/auth/login').send({ username: 'ryan', password: '1234' });
      await request(server).post('/api/recipes/2').send(testRecipes[0]).set('Authorization', res.body.token);
      res = await request(server).delete('/api/recipes/recipe/4').set('Authorization', res.body.token);
      expect(res.body).toMatchObject(testRecipes[0]);
    });
  });
});



// describe('server.js', () => {



    


  
//   describe('[GET] /api/users/:user_id', () => {
//     it('[20] requests with a token with role_name admin obtain the user details', async () => {
//       let res = await request(server).post('/api/auth/login').send({ username: 'bob', password: '1234' })
//       res = await request(server).get('/api/users/1').set('Authorization', res.body.token)
//       expect(res.body).toMatchObject({ "role_name": "admin", "user_id": 1, "username": "bob" })
//     })
//     it('[21] requests with a token with a role_name that is not admin are bounced with proper status and message', async () => {
//       let res = await request(server).post('/api/auth/login').send({ username: 'sue', password: '1234' })
//       res = await request(server).get('/api/users/1').set('Authorization', res.body.token)
//       expect(res.body.message).toMatch(/this is not for you/i)
//       expect(res.status).toBe(403)
//     })
//   })
// })
