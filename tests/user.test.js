const request = require("supertest");
const app = require("../dist/app");

test("Should signup a new user", async () => {
  await request(app)
    .post("/users")
    .send({
      name: "john",
      email: "john@gmail.com",
      password: "1234"
    })
    .expect(201);
});
