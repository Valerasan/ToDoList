import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import db from "./db.js"
import authRoutes, { authenticateTokenCheck} from "./auth.js"


dotenv.config();
const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(cors({ origin: "http://localhost:5173", credentials: true }));

//need call last
app.use("/auth", authRoutes);

const PORT = 3000;



app.get("/", (req, res) => {
    res.send("Welocm to the node server!!");
});

app.get("/api/hello", (req, res) => {
    res.json({ message: "Hello from the API" });
});

app.get("/api/notes", authenticateTokenCheck, async (req, res) => {

    const result = await db.query("SELECT * FROM notes WHERE user_id = $1 ORDER BY id ASC ", [req.userId]);
    const notes = result.rows
    res.json(notes);
});


app.get("/auth/me", authenticateTokenCheck, async (req, res) => {
    const result = await db.query("SELECT id, email FROM users WHERE id = $1", [req.userId]);
    res.json(result.rows[0]);
});


app.post("/api/notes/add", authenticateTokenCheck, async (req, res) => {
    const { note } = req.body;
    const { rows } = await db.query("INSERT INTO notes (title, content, user_id) VALUES ($1, $2, $3) RETURNING *", [note.title, note.content, req.userId]);
    console.log("add to SQl: ", rows[0]);
    res.json(rows[0]);
});


app.delete("/api/notes/delete", authenticateTokenCheck, async (req, res) => {
    const { id } = req.body;
    console.log("Delete ite:", id);
    await db.query("DELETE FROM notes WHERE id=$1", [id])
    res.json({ ok: true });
});


app.listen(PORT, () => {
    console.log(`Server is running on http:localhost:${PORT}`);
})