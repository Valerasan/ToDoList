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

app.use("/auth", authRoutes);

const PORT = 3000;

app.get("/api/notes", authenticateTokenCheck, async (req, res) => {
    const result = await db("notes")
        .where("user_id", req.userId)
        .orderBy("id", "asc");
    const notes = result.rows
    res.json(result);
});


app.get("/auth/me", authenticateTokenCheck, async (req, res) => {
    const user = await db("users")
        .select("id", "email")
        .where({ id: req.userId })
        .first();

    res.json(user);
});


app.post("/api/notes/add", authenticateTokenCheck, async (req, res) => {
    const { note } = req.body;
    const [newNote] = await db("notes")
        .insert({
            title: note.title,
            content: note.content,
            user_id: req.userId,
        })
        .returning("*");

    console.log("add to SQl: ", newNote);
    res.json(newNote);
});


app.delete("/api/notes/delete", authenticateTokenCheck, async (req, res) => {
    const { id } = req.body;
    await db("notes")
        .where({ id })
        .del();
    res.json({ ok: true });
});


app.listen(PORT, () => {
    console.log(`Server is running on http:localhost:${PORT}`);
})