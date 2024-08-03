const express = require("express");
const { scrapeLogic } = require("./scrapeLogic");
const app = express();

const PORT = process.env.PORT || 4000;

app.get("/tiktok", (req, res) => {
  scrapeLogic(res, req);
});

app.get("/", (req, res) => {
  res.send("<h1>bienvenue sur le scraper TikTok</h1>");
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
