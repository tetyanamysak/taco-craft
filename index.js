import express from "express";
import bodyParser from "body-parser";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3040;

const recipeFile = path.join(__dirname, "recipe.json");

function getRecipes() {
  const data = fs.readFileSync(recipeFile, "utf8");
  return JSON.parse(data);
}

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("index.ejs");
});

app.get("/api/recipe", (req, res) => {
  const recipes = getRecipes();
  const choice = req.query.choice;

  const selectedData = recipes.find((r) => r.choice === choice);

  if (!selectedData) {
    return res.status(404).json({ error: "Recipe not found" });
  }

  res.json(selectedData);
});

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});