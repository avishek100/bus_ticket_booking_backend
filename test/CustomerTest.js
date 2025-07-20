const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../server"); // Adjust based on your project structure
const Customer = require("../models/customer");
const { expect } = chai;

chai.use(chaiHttp);

describe("Customer API Tests", () => {
  let testCustomer;
  let token;

  before(async () => {
    // Cleanup existing test customers
    await Customer.deleteMany({});
    // Create a test customer for login and fetch tests
    testCustomer = await Customer.create({
      fname: "John",
      lname: "Doe",
      phone: "1234567890",
      email: "john.doe@example.com",
      password: "password123",
      role: "customer",
      image: "default.jpg",
    });
  });

  // 1️⃣ Test Get All Customers
  it("should GET all customers", (done) => {
    chai
      .request(server)
      .get("/api/v1/auth/customers")
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property("success", true);
        expect(res.body).to.have.property("count");
        expect(res.body).to.have.property("data").that.is.an("array");
        done();
      });
  });

  // 2️⃣ Test Get Single Customer
  it("should GET a single customer by ID", (done) => {
    chai
      .request(server)
      .get(`/api/v1/auth/customer/${testCustomer._id}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property("success", true);
        expect(res.body.data).to.have.property("email", testCustomer.email);
        done();
      });
  });

  // 3️⃣ Test Register a New Customer
  it("should register a new customer", (done) => {
    chai
      .request(server)
      .post("/api/v1/auth/register")
      .send({
        fname: "Alice",
        lname: "Smith",
        phone: "9876543210",
        email: "alice.smith@example.com",
        password: "testpassword",
        role: "customer",
      })
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.have.property("success", true);
        expect(res.body).to.have.property("message").that.includes("registered successfully");
        expect(res.body.customer).to.have.property("email", "alice.smith@example.com");
        done();
      });
  });

  // 4️⃣ Test Customer Login
  it("should login a customer and return a token", (done) => {
    chai
      .request(server)
      .post("/api/v1/auth/login")
      .send({
        email: testCustomer.email,
        password: "password123",
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property("success", true);
        expect(res.body).to.have.property("token").that.is.a("string");
        token = res.body.token; // Save token for future tests
        done();
      });
  });

  after(async () => {
    await Customer.deleteMany({});
  });
});
