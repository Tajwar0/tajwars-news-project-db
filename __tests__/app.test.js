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

const newComment = {
  body: "5 hours of debugging can save you 7 minutes of reading documentation, debugging is cool",
  username: "butter_bridge",
};

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
    it("responds with 404 if passed an article_id which does not exist in our database currently", () => {
      return request(app)
        .get("/api/articles/55500046")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("article_id is not in database");
        });
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

    describe("Patch errors", () => {
      it("responds with 400 if article_id passed is not a number", () => {
        const updatedVote = { inc_votes: 75 };
        return request(app)
          .patch("/api/articles/four")
          .send(updatedVote)
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Invalid input");
          });
      });
      it("responds with 404 if passed an article_id which does not exist in our database", () => {
        const updatedVote = { inc_votes: 75 };
        return request(app)
          .patch("/api/articles/55500046")
          .send(updatedVote)
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("article_id is not in database");
          });
      });

      it("responds with 'inc_votes is undefined' and a response status of 400 if 'inc_votes' is spelt incorrectly", () => {
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
});
describe("6. GET /api/users", () => {
  describe("GET /api/users", () => {
    it("should respond with an array of objects from users data ", () => {
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
});

describe("7. GET /api/articles/:article_id (comment count)", () => {
  describe("/api/articles/:article_id (comment count)", () => {
    it("should respond with an article object including comment_count", () => {
      return request(app)
        .get("/api/articles/5")
        .expect(200)
        .then(({ body: { article } }) => {
          expect(article).toEqual(
            expect.objectContaining({
              article_id: 5,
              title: "UNCOVERED: catspiracy to bring down democracy",
              topic: "cats",
              author: "rogersop",
              body: "Bastet walks amongst us, and the cats are taking arms!",
              created_at: "2020-08-03T13:14:00.000Z",
              votes: 0,
              comment_count: 2,
            })
          );
        });
    });
  });
});

describe("8- GET/api/articles", () => {
  describe("get/api/articles", () => {
    it("responds with an articles array ", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body: { allArticles } }) => {
          expect(allArticles).toBeSortedBy(allArticles.created_at, {
            descending: true,
          });
          allArticles.forEach((article) => {
            expect(article).toMatchObject({
              article_id: expect.any(Number),
              title: expect.any(String),
              topic: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              comment_count: expect.any(Number),
            });
            expect(Array.isArray(allArticles)).toBe(true);
          });
        });
    });
  });
});

describe("9- GET/api/articles/:article_id/comments", () => {
  describe("get/api/articles/:article_id/comments", () => {
    it("responds with an array of comments from the given article_id", () => {
      return request(app)
        .get("/api/articles/6/comments")
        .expect(200)
        .then(({ body: { articleComments } }) => {
          expect(articleComments).toEqual([
            {
              body: "This is a bad article name",
              votes: 1,
              author: "butter_bridge",
              comment_id: 16,
              created_at: "2020-10-11T15:23:00.000Z",
            },
          ]);
        });
    });
  });
  describe("handles issues with request", () => {
    it("responds with 400 if passed a non number variable as article_id", () => {
      return request(app)
        .get("/api/articles/four/comments")
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Invalid input");
        });
    });
    it("responds with 404 if passed an article_id which does not exist in the database currently", () => {
      return request(app)
        .get("/api/articles/58643/comments")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("article_id is not in database");
        });
    });
    it("responds with 404 if passed an article_id which exists but no comments exist in the database with that article_id", () => {
      return request(app)
        .get("/api/articles/2/comments")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("article_id is not in database");
        });
    });
  });
});

describe("10- post/api/articles/:article_id/comments", () => {
  describe("api/articles/:article_id/comments", () => {
    it("request body accepts an object with username and body, responds with posted comment", () => {
      return request(app)
        .post("/api/articles/1/comments")
        .send(newComment)
        .expect(201)
        .then(({ body: { createdComment } }) => {
          expect(createdComment).toEqual({
            body: "5 hours of debugging can save you 7 minutes of reading documentation, debugging is cool",
            author: "butter_bridge",
            votes: 0,
            article_id: 1,
            comment_id: expect.any(Number),
            created_at: expect.any(String),
          });
        });
    });
  });
  describe("error handling issues", () => {
    it("responds with 400 if article_id passed is not a number", () => {
      return request(app)
        .post("/api/articles/four/comments")
        .send(newComment)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Invalid input");
        });
    });
    it("responds with 404 if passed an article_id which does not exist in our database", () => {
      return request(app)
        .post("/api/articles/555/comments")
        .send(newComment)
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("article_id is not in database");
        });
    });
    it("if username or body is not spelt correctly", () => {
      return request(app)
        .post("/api/articles/1/comments")
        .send({
          boy: "5 hours of debugging can save you 7 minutes of reading documentation, debugging is cool",
          usernae: "butter_bridge",
        })
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("bad user post input");
        });
    });
  });
});
describe("11. GET /api/articles (queries)", () => {
  describe("tests for 0 queries, sorted by date order descending", () => {
    it("should return all articles sorted by date in descending order ", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body: { allArticles } }) => {
          expect(allArticles).toBeSortedBy("created_at", {
            descending: true,
          });
        });
    });
  });
  describe("tests for each query successively", () => {
    it("/api/articles?sort_by=title , sort by title in descending order", () => {
      return request(app)
        .get("/api/articles?sort_by=title")
        .expect(200)
        .then(({ body: { allArticles } }) => {
          expect(allArticles).toBeSortedBy("title", {
            descending: true,
          });
        });
    });
    it("?order=ASC , sort articles in ascending order ", () => {
      return request(app)
        .get("/api/articles?order=ASC")
        .expect(200)
        .then(({ body: { allArticles } }) => {
          expect(allArticles).toBeSortedBy("created_at", {
            ascending: true,
          });
        });
    });
    it("query ?topic=cats ", () => {
      return request(app)
        .get("/api/articles?topic=cats")
        .expect(200)
        .then(({ body: { allArticles } }) => {
          allArticles.forEach((article) => {
            expect(article).toMatchObject({
              article_id: expect.any(Number),
              title: expect.any(String),
              topic: "cats",
              author: expect.any(String),
              body: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              comment_count: expect.any(Number),
            });
          });
        });
    });
    it("joint query of 3 parameters, should return a filtered articles list with mitch as the topic, sorted in descending order from column comment_count, a ", () => {
      return request(app)
        .get("/api/articles?sort_by=title&order=ASC&topic=mitch")
        .expect(200)
        .then(({ body: { allArticles } }) => {
          expect(allArticles).toBeSortedBy("title", {
            ascending: true,
          });
          allArticles.forEach((article) => {
            expect(article).toMatchObject({
              article_id: expect.any(Number),
              title: expect.any(String),
              topic: "mitch",
              author: expect.any(String),
              body: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              comment_count: expect.any(Number),
            });
          });
        });
    });
  });
  describe("Error handling for queries", () => {
    it("400 response if value of query topic is spelt wrong", () => {
      return request(app)
        .get("/api/articles?topic=Joey")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid topic");
        });
    });
    it("400 response if value of sort_by query is spelt wrong", () => {
      return request(app)
        .get("/api/articles?sort_by=comment_cnt")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid user input: sort_by value");
        });
    });
    it("400 response if value of order query is spelt wrong", () => {
      return request(app)
        .get("/api/articles?order=Inf")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid user input: order value");
        });
    });
  });
});
