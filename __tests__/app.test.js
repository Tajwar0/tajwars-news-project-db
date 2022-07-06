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
  describe("3 GET api topics", () => {
    it("responds with an array of topic objects, including properties'slug' and 'description ", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body: { topics } }) => {
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

describe("5. PATCH /api/articles/:article_id", () => {
  describe("Patch /api/articles/:article_id", () => {
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

  describe("Patch errors", () => {
    it("responds with 400 if passed a non number variable as article_id", () => {
      const updatedVote = { inc_votes: 75 };
      return request(app)
        .patch("/api/articles/four")
        .send(updatedVote)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Invalid input");
        });
    });
    it("responds with 404 if passed an article_id which does not exist in our database currently", () => {
      const updatedVote = { inc_votes: 75 };
      return request(app)
        .patch("/api/articles/55500046")
        .send(updatedVote)
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("article_id is not in database");
        });
    });

    it("responds with 'Iinc_votes is undefined' and a response status of 400 if 'inc_votes' is spelt incorrectly", () => {
      const updatedVote = { inc_vot: 75 };
      return request(app)
        .patch("/api/articles/11")
        .send(updatedVote)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("inc_votes is undefined");
        });
    });
    it("responds with 'Invalid  input' and a response status of 400 if the value of 'inc_votes' not a number", () => {
      const updatedVote = { inc_votes: "five" };
      return request(app)
        .patch("/api/articles/11")
        .send(updatedVote)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Invalid input");
        });
    });
  });
});

describe("6. GET /api/users", () => {
  describe("GET /api/users", () => {
    it("should respon with an array of objects from users data ", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then(({ body: { users } }) => {
          expect(users).toEqual(
            expect.objectContaining([
              {
                username: "butter_bridge",
                name: "jonny",
                avatar_url:
                  "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
              },
              {
                username: "icellusedkars",
                name: "sam",
                avatar_url:
                  "https://avatars2.githubusercontent.com/u/24604688?s=460&v=4",
              },
              {
                username: "rogersop",
                name: "paul",
                avatar_url:
                  "https://avatars2.githubusercontent.com/u/24394918?s=400&v=4",
              },
              {
                username: "lurker",
                name: "do_nothing",
                avatar_url:
                  "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
              },
            ])
          );
        });
    });
  });
  describe("error handling", () => {
    it("responds with 404 and message if get request path does not exist", () => {
      return request(app)
        .get("/api/bad_path")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Invalid path");
        });
    });
  });
});

describe("7. GET /api/articles/:article_id (comment count)", () => {
  describe("/api/articles/:article_id (comment count)", () => {
    it("should ", () => {
      return request(app)
        .get("/api/articles/5")
        .expect(200)
        .then(({ body: { users } }) => {
          expect(users).toEqual(
            expect.objectContaining({
              title: "Sony Vaio; or, The Laptop",
              topic: "mitch",
              author: "icellusedkars",
              body: "Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.",
              created_at: 1602828180000,
              votes: 0,
              comment_count: 2,
            })
          );
        });
    });
  });
});
