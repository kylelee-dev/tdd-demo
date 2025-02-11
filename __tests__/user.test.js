const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../app");

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("User API", () => {
  // Test 1: Creating a user
  describe("POST /api/users", () => {
    it("should create a new user", async () => {
      const userData = {
        name: "John Doe",
        email: "john@example.com",
      };

      const response = await request(app).post("/api/users").send(userData);

      expect(response.status).toBe(201);
      expect(response.body.name).toBe(userData.name);
      expect(response.body.email).toBe(userData.email);
    });

    it("should fail if email is missing", async () => {
      const userData = {
        name: "John Doe",
      };

      const response = await request(app).post("/api/users").send(userData);

      expect(response.status).toBe(400);
      expect(response.body.error).toBeTruthy();
    });
  });

  // Test 2: Getting a user
  describe("GET /api/users/:id", () => {
    let userId;

    beforeEach(async () => {
      // Create a test user
      const userData = {
        name: "Test User",
        email: "test@example.com",
      };
      const response = await request(app).post("/api/users").send(userData);
      userId = response.body._id;
    });

    it("should return user if valid id is provided", async () => {
      const response = await request(app).get(`/api/users/${userId}`);

      expect(response.status).toBe(200);
      expect(response.body.name).toBe("Test User");
    });

    it("should return 404 if invalid id is provided", async () => {
      const response = await request(app).get("/api/users/invalidId");

      expect(response.status).toBe(404);
    });
  });

  // Test 3: Updating a user
  describe("PUT /api/users/:id", () => {
    it("should update user details", async () => {
      const user = await request(app).post("/api/users").send({
        name: "Test User",
        email: "test@example.com",
      });

      const response = await request(app).put(`/api/users/${user.body._id}`).send({
        name: "New Name for Test User"
      })
      
      expect(response.status).toBe(200);
      expect(response.body.name).toBe("New Name for Test User");
    });
  });
});
