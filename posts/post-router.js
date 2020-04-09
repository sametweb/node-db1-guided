const express = require("express");

// database access using knex
const db = require("../data/db-config.js");

const router = express.Router();

router.get("/", (req, res) => {
  //   db.select().from("posts")
  db("posts")
    .then((posts) => {
      res.json(posts);
    })
    .catch((err) => {
      res.status(500).json({ message: "error retrieving posts", err });
    });
});

router.get("/:id", (req, res) => {
  const { id } = req.params;

  db.select()
    .from("posts")
    .where({ id })
    .then((post) => res.json(post))
    .catch((err) =>
      res.json({ message: "error retrieving post with id", err })
    );
});

router.post("/", (req, res) => {
  const postData = req.body;
  db("posts")
    .insert(postData)
    .then((post) => {
      res.status(201).json(post);
    })
    .catch((err) =>
      res.status(500).json({ message: "failed to create new post" }, err)
    );
});

router.put("/:id", (req, res) => {
  const { id } = req.params;
  const changes = req.body;

  db("posts")
    .where({ id })
    .update(changes)
    .then((count) => {
      if (count) {
        res.json({ updated: count });
      } else {
        res.status(404).json({ message: "invalid id" });
      }
    })
    .catch((err) => {
      res.status(500).json({ message: "error updating", err });
    });
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;

  db("posts")
    .where({ id })
    .del()
    .then((deleted) =>
      deleted
        ? res.status(204).end()
        : res.status(404).json({ message: "id not found" })
    )
    .catch((err) => res.status(404).json({ message: "error deleting", err }));
});

module.exports = router;
