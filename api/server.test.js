// testleri buraya yazın

const request = require("supertest");
const server = require("./server");
const db = require("../data/dbConfig");

beforeAll(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
});

afterAll(async () => {
  await db.destroy();
});

test("[0] Testler çalışır durumda]", () => {
  expect(true).not.toBe(false);
});

describe("[POST] api/auth/register", () => {
  it("[1] yeni kullanıcı adı istenilenlere uygun dönüyor", async () => {
    await request(server).post("/api/auth/register").send({
      username: "JohnReese",
      password: "123456",
    });
    const newUser = await db("users").where("username", "JohnReese").first();
    expect(newUser.username).toBe("JohnReese");
  }, 1000);

  it("[2] username veya password olmayınca hata dönüyor", async () => {
    const res = await request(server)
      .post("/api/auth/register")
      .send({ username: "Shaw" });
    expect(res.body.message).toMatch(/şifre gereklidir/i);
  }, 1000);

  it("[3] username alındıysa hata dönüyor", async () => {
    const res = await request(server)
      .post("/api/auth/register")
      .send({ username: "JohnReese", password: "123456" });
    expect(res.status).toBe(422);
    expect(res.body.message).toBe("username alınmış");
  }, 1000);
});

describe("[POST] api/auth/login", () => {
  it("[4] login oluyor mu?", async () => {
    const response = await request(server)
      .post("/api/auth/login")
      .send({ username: "JohnReese", password: "123456" });
    expect(response.status).toBe(200);
  }, 1000);

  it("[5] hatalı bilgilerle login olmuyor", async () => {
    const response = await request(server)
      .post("/api/auth/login")
      .send({ username: "Harold", password: "123456" });
    expect(response.status).toBe(401);
  }, 1000);
});
