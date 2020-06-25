
const express = require("express");
const path = require("path");
const fs = require("fs");
const uuid = require("uuid/v4");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

let notes = [];

app.get("/api/notes", (req, res) => {
  notes = JSON.parse(fs.readFileSync("./db/db.json"));
  res.json(notes);
});

app.get("/api/notes/:id", (req, res) => {
  const chosenNote = req.params.id;

  for (var i = 0; i < notes.length; i++) {
    if (chosenNote === notes[i].id) {
      return res.json(notes[i]);
    }
  }

  return res.send(
    "Cannot find note with the ID of " +
      req.params.id +
      ". Please make sure you have the correct ID."
  );
});

app.post("/api/notes", (req, res) => {
  notes = JSON.parse(fs.readFileSync("./db/db.json"));

  notes.push({
    id: uuid(),
    title: req.body.title,
    text: req.body.text,
  });
  fs.writeFileSync("./db/db.json", JSON.stringify(notes));
  res.json(true);
});

app.delete("/api/notes/:id", (req, res) => {
  notes = JSON.parse(fs.readFileSync("./db/db.json"));
  const alteredNotes = notes.filter((note) => note.id !== req.params.id);
  fs.writeFileSync("./db/db.json", JSON.stringify(alteredNotes));
  res.json(true);
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "notes.html"));
});

app.listen(PORT, function () {
  console.log("App listening on: http://localhost:" + PORT);
});