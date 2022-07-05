const request = require("supertest");
const connection = require(`../db/connection`);
const app = require(`${__dirname}/../app`);
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");
beforeEach(() => seed(testData));
afterAll(() => connection.end());

const expectedTopics = [
  { description: "The man, the Mitch, the legend", slug: "mitch" },
  { description: "Not dogs", slug: "cats" },
  { description: "what books are made of", slug: "paper" },
];

describe("topics api", () => {
  describe("handles bad paths", () => {
    it("responds with 404 and message if get request path does not exist", () => {
      return request(app)
        .get("/api/bad_path")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Invalid path");
        });
    });
  });
  describe("3 GET api topics", () => {
    it("responds with an array of topic objects, including properties'slug' and 'description ", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body: { topics } }) => {
          console.log(topics);
          expect(topics).toEqual(expectedTopics);
        });
    });
  });
});

describe("5. PATCH /api/articles/:article_id", () => {
  it("accepts a request body in the form '{ inc_votes: newVote }', the value is then used to increment and update the 'votes' property in the article specified by id", () => {
    const updatedVote = { inc_votes: 75 };
    return request(app)
      .patch("/api/articles/11")
      .send(updatedVote)
      .expect(201)
      .then(({ body: { article } }) => {
        expect(article).toEqual(
          expect.objectContaining({
            title: "Am I a cat?",
            topic: "mitch",
            author: "icellusedkars",
            body: "Having run out of ideas for articles, I am staring at the wall blankly, like a cat. Does this make me a cat?",
            created_at: "2020-01-15T22:21:00.000Z",
            votes: 75,
            article_id: 11,
          })
        );
      });
  });
});
