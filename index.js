import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import pg from "pg";

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "TodoList",
  password: "ThePostgreSql",
  port: 5432,
});
db.connect();

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let items = [
  /*{ id: 1, title: "Buy milk" },
  { id: 2, title: "Finish homework" },*/
];

app.get("/", async (req, res) => {
  try {
    const items = await extractTasks();
    res.render("index.ejs", {
    listTitle: "Today's Goals",
    listItems: items,
  });
  } catch (err) {
    console.log("An error eccoured", err.stack);
    res.status(500).send("An error occurred: Check your DB");
  } 
});

app.post("/add", async (req, res) => {
  try{
    const newitem = req.body.newItem;
    console.log(newitem);
    await db.query("INSERT INTO taskDB (title) VALUES ($1)", [newitem]);
    res.redirect("/");
  }catch(err){
    console.log("An error eccoured", err.stack);
    res.status(500).send("An error occurred: Check your DB");
  } 
});

app.post("/edit", async (req, res) => {
  try {
    const editTitle = req.body.updatedItemTitle;
    console.log(editTitle);
    const editId = req.body.updatedItemId;

    await db.query("UPDATE taskDB SET title = $1 WHERE id = $2",[editTitle.toLowerCase() ,editId]);
    res.redirect("/");

  } catch (err) {
    console.log("An error eccoured", err.stack);
    res.status(500).send("An error occurred: Check your DB");
  }
});

app.post("/delete", async (req, res) => {
  try {
    const deleteItemId = req.body.deleteItemId;
    console.log(deleteItemId);
    const cdeleteItemId = parseInt(deleteItemId); //cdeleteItemId = converted deleteItemId to int
    //console.log(typeof(cdeleteItemId));

    await db.query("DELETE FROM taskDB WHERE id = $1",[deleteItemId]);
    res.redirect("/");

  } catch (err) {
    console.log("An error eccoured", err.stack);
    res.status(500).send("An error occurred: Check your DB");
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

async function extractTasks(){
  try {
    const items = await db.query("SELECT * FROM taskDB");
    console.log(items.rows);
    return items.rows;
  } catch (err) {
    console.log("An error eccoured", err.stack);
    res.status(500).send("An error occurred: Check your DB");
  }
}
