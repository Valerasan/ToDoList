import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import cors from "cors";
import pg from "pg"
import dotenv from "dotenv";


dotenv.config();
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

const PORT = 3000;

const db = new pg.Client({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT,
});

db.connect();

const JWT_SECRET = process.env.JWT_SECRET_KEY;

function authMiddleware(req, res, next) {

    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.userId = decoded.userId;
        console.log("User Id: ", req.userId);
        next();
    } catch {
        res.status(401).json({ error: "Invalid token" });
    }
}


app.get("/", (req, res) => {
    res.send("Welocm to the node server!!");
});

app.get("/api/hello", (req, res) => {
    res.json({ message: "Hello from the API" });
});

app.get("/api/notes", authMiddleware, async (req, res) => {

    const result = await db.query("SELECT * FROM notes WHERE user_id = $1 ORDER BY id ASC ", [req.userId]);
    const notes = result.rows
    res.json(notes);
});


app.get("/auth/me", authMiddleware, async (req, res) => {
    const result = await db.query("SELECT id, email FROM users WHERE id = $1", [req.userId]);
    res.json(result.rows[0]);
});


app.post("/api/notes/add", authMiddleware, async (req, res) => {
    const { note } = req.body;
    const { rows } = await db.query("INSERT INTO notes (title, content, user_id) VALUES ($1, $2, $3) RETURNING *", [note.title, note.content, req.userId]);
    console.log("add to SQl: ", rows[0]);
    res.json(rows[0]);
});


app.delete("/api/notes/delete", async (req, res) => {
    const { id } = req.body;
    console.log("Delete ite:", id);
    await db.query("DELETE FROM notes WHERE id=$1", [id])
    res.json({ ok: true });
});


app.post("/auth/register", async (req, res) => {
    const { email, password } = req.body;

    const hashed = await bcrypt.hash(password, 10);

    try {
        const result = await db.query(
            "INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email",
            [email, hashed]
        );

        res.json(result.rows[0]);
    } catch (err) {
        if (err.code === "23505") {
            return res.status(400).json({ error: "Email already exists" });
        }
        res.status(500).json({ error: "Server error" });
    }
});

app.post("/auth/login", async (req, res) => {
    const { email, password } = req.body;

    const result = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    const user = result.rows[0];

    if (!user) return res.status(400).json({ error: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) return res.status(400).json({ error: "Invalid email or password" });


    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "1h" });

    res.cookie("token", token, {
        httpOnly: true,
        sameSite: "lax",
        secure: false,
    });

    res.json({ message: "Logged in" });
});

app.post("/auth/logout", (req, res) => {
    res.clearCookie("token");
    res.json({ message: "Logged out" });
});


app.listen(PORT, () => {
    console.log(`Server is running on http:localhost:${PORT}`);

})