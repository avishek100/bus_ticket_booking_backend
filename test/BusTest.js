const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../server"); // ✅ Ensure this correctly points to `server.js`
const Bus = require("../models/Bus");
const Route = require("../models/Route");
const { expect } = chai;

chai.use(chaiHttp);

describe("Bus API Tests", () => {
  let testBus;
  let testRoute;
  let busId;

  before(async () => {
    await Bus.deleteMany({});
    await Route.deleteMany({});

    // ✅ Create a test route with required fields
    testRoute = await Route.create({
      routeName: "Kathmandu-Pokhara",  // ✅ Required field
      startPoint: "Kathmandu",
      endPoint: "Pokhara",
      distance: 200,  // ✅ Required field
    });

    // ✅ Create a test bus
    testBus = await Bus.create({
      busNumber: "KA-01-1234",
      driverName: "John Doe",
      route: testRoute._id,
      capacity: 40,
      busType: "AC",
      date: new Date(),
      seats: Array(40)
        .fill()
        .map((_, i) => ({ number: `A${i + 1}`, booked: false })),
    });

    busId = testBus._id; // ✅ Store bus ID for testing
  });

  // ✅ Test Get All Buses
  it("should GET all buses", (done) => {
    chai
      .request(server) // ✅ Use `server`, not `app`
      .get("/api/v1/bus")
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property("success", true);
        expect(res.body.data).to.be.an("array");
        done();
      });
  });

  // ✅ Test Get Single Bus
  it("should GET a single bus by ID", (done) => {
    chai
      .request(server)
      .get(`/api/v1/bus/${busId}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property("success", true);
        expect(res.body.data).to.have.property("busNumber", "KA-01-1234");
        done();
      });
  });

  // ✅ Test Create a New Bus
  it("should create a new bus", (done) => {
    const newBus = {
      busNumber: "KA-02-5678",
      driverName: "Jane Doe",
      route: testRoute._id,
      capacity: 30,
      busType: "Non-AC",
      date: new Date().toISOString(),
    };

    chai
      .request(server)
      .post("/api/v1/bus")
      .send(newBus)
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.have.property("success", true);
        expect(res.body.data).to.have.property("busNumber", "KA-02-5678");
        done();
      });
  });

  // ✅ Test Update a Bus
  it("should update an existing bus", (done) => {
    chai
      .request(server)
      .put(`/api/v1/bus/${busId}`)
      .send({ driverName: "Michael Smith" })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property("success", true);
        expect(res.body.data).to.have.property("driverName", "Michael Smith");
        done();
      });
  });

  // ✅ Test Delete a Bus
  it("should delete a bus", (done) => {
    chai
      .request(server)
      .delete(`/api/v1/bus/${busId}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property("success", true);
        expect(res.body).to.have.property("message", "Bus deleted successfully");
        done();
      });
  });

  // ✅ Test Search Buses by Route and Date
  it("should search for buses by route and date", (done) => {
    chai
      .request(server)
      .get(
        `/api/v1/bus-search/search?startPoint=Kathmandu&endPoint=Pokhara&date=${new Date().toISOString()}`
      )
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property("success", true);
        expect(res.body.buses).to.be.an("array");
        done();
      });
  });

  // ✅ Test Get Seats for a Bus
  it("should fetch seats for a bus", (done) => {
    chai
      .request(server)
      .get(`/api/v1/bus/${busId}/seats`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property("success", true);
        expect(res.body.seats).to.be.an("array");
        done();
      });
  });

  // ✅ Test Book Seats
  it("should book seats for a bus", (done) => {
    const seatBooking = {
      seats: ["A1", "A2"],
    };

    chai
      .request(server)
      .post(`/api/v1/bus/${busId}/book`)
      .send(seatBooking)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property("success", true);
        expect(res.body).to.have.property("message", "Seats booked successfully");
        done();
      });
  });

  after(async () => {
    await Bus.deleteMany({});
    await Route.deleteMany({});
  });
});
