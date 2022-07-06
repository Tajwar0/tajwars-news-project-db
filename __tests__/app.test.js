const request = require("supertest");
const connection = require(`../db/connection`);
const app = require(`${__dirname}/../app`);
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");
beforeEach(() => seed(testData));
afterAll(() => connection.end());

const neededKeys = [
  "author",
  "title",
  "article_id",
  "body",
  "topic",
  "created_at",
  "votes",
];

const expectedTopics = [
  { description: "The man, the Mitch, the legend", slug: "mitch" },
  { description: "Not dogs", slug: "cats" },
  { description: "what books are made of", slug: "paper" },
];

describe("3 topics api", () => {
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
  describe("get api/topics", () => {
    it("respond with an array of topic objects, including properties'slug' and 'description ", () => {
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
describe("4 Get api", () => {
  describe("get api/articles/:article_id", () => {
    it("responds with an article object with the following properties: author, title, article_id, body, topic, created_at, votes", () => {
      return request(app)
        .get("/api/articles/4")
        .expect(200)
        .then(({ body: { article } }) => {
          expect(article).toEqual(
            expect.objectContaining({
              article_id: 4,
              author: "rogersop",
              body: "We all love Mitch and his wonderful, unique typing style. However, the volume of his typing has ALLEGEDLY burst another students eardrums, and they are now suing for damages",
              created_at: "2020-05-06T01:14:00.000Z",
              title: "Student SUES Mitch!",
              topic: "mitch",
              votes: 0,
            })
          );
        });
    });
  });
  describe("handles issues with request", () => {
    it("responds with 400 if passed a non number variable as article_id", () => {
      return request(app)
        .get("/api/articles/four")
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Invalid input");
        });
    });
  });
  it("responds with 404 if passed an article_id which does not exist in our database currently", () => {
    return request(app)
      .get("/api/articles/55500046")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("article_id is not in database");
      });
  });
});
