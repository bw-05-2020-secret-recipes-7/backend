const db = require('../../data/db-config');

const findUser = async (username) => {
  const user = await db('users').where('username', username).first();
  return user;
}

// const findById = async (user_id) => {
//   const user = await db('users').where('user_id', user_id).first();
//   return user;
// }

const addUser = async (user) => {
  const newUser = await db('users').insert(user, ['user_id', 'username', 'password']);
  return newUser[0];
}

module.exports = { findUser, addUser };