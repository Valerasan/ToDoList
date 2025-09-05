import express from "express";
import cors from "cors";
import pg from "pg"

const app = express();
const PORT = 3000;

const db = new pg.Client({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});

app.use(express.json());
db.connect();


app.use(cors());

app.get("/", (req, res) => {
    res.send("Welocm to the node server!!");
})

app.get("/api/hello", (req, res) => {
    res.json({ message: "Hello from the API" });
})

app.get("/api/notes", async (req, res) => {

    const result = await db.query("SELECT * FROM notes ORDER BY id ASC ");
    const notes = result.rows
    res.json(notes);
})


app.post("/api/notes/add", async (req, res) => {
    
    console.log(req.body.note)

    const {note} = req.body;

    const { rows } = await db.query( "INSERT INTO notes (title, content) VALUES ($1, $2) RETURNING *", [note.title, note.content]);
    console.log("add to SQl");
    
    console.log(rows[0]);
    res.json(rows[0]);
});


app.delete("/api/notes/delete", async (req, res) => {

    const {id} = req.body;
    console.log("Delete ite:", id);

    await db.query("DELETE FROM notes WHERE id=$1", [id])

    res.json({ ok: true});
});


app.listen(PORT, () => {
    console.log(`Server is running on http:localhost:${PORT}`);

})