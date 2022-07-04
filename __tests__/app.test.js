const request = require("supertest");
const connection = require(`../db/connection`);
const app = require(`${__dirname}/../app`);
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");
beforeEach(() => seed(testData));
afterAll(() => connection.end());

const topics = [
  { description: "The man, the Mitch, the legend", slug: "mitch" },
  { description: "Not dogs", slug: "cats" },
  { description: "what books are made of", slug: "paper" },
];

describe("3 GET api topics", () => {
  it("respond with an array of topic objects, including properties'slug' and 'description ", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        expect(body).toEqual(topics);
      });
  });
});

describe("5. PATCH /api/articles/:article_id", () => {
  it("accepts a request body in the form '{ inc_votes: newVote }', the value is then used to increment and update the 'votes' property in the article specified by id ", () => {
    const updatedVote = { inc_votes: 75 };
    const updatedArticle = {
      title: "Moustache",
      topic: "mitch",
      author: "butter_bridge",
      body: "Have you seen the size of that thing?",
      created_at: 1602419040000,
      votes: 75,
    };
    return request(app)
      .patch("/api/articles/11")
      .send(updatedArticle)
      .expect(201)
      .then(({ body }) => {
        expect(body.votes).toEqual(75);
      });
  });
});
