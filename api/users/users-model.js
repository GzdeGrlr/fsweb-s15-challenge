const db = require("../../data/dbConfig");

function find() {
  return db("users").select("id", "username");
}

function findByFilter(filter) {
  return db("users").where(filter);
}

function findById(id) {
  return db("users").where("id", id).first();
}

async function add(user) {
  const [id] = await db("users").insert(user);

  const newUser = await findById(id);

  return {
    id: newUser.id,
    username: newUser.username,
  };
}

module.exports = {
  find,
  findById,
  findByFilter,
  add,
};
